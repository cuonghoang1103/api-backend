/**
 * Bắt đầu tại đây (1/2) — khoá nestjs (soạn 24/11/2026).
 * Output: chạy THẬT trong container nst-run-* (node:22-alpine, Node v22.23.5, @nestjs/core 12.6.0, express 5.3.0),
 * thư mục scratchpad/nst/lab/m0. Số liệu: GitHub API nestjs/nest (tạo 2017-02-04, 77.131 sao, MIT), npm registry
 * (@nestjs/core: 4.0.0 12/09/2017 … 11.0.0 16/01/2025, 12.0.0 27/08/2026), npm downloads 16–22/11/2026
 * (@nestjs/core 25.391.280; express 209.772.988), nestjs.com mục "Trusted by…", docs.nestjs.com Introduction — tất cả lấy 24/11/2026.
 * Không trùng: nodejs (Express/REST nền), typescript 14.4 (decorator), SDN302 8.1 (Nest nhập môn) — chỉ dẫn link.
 */
import { nguon, lienKet, lienKetAcademy } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-0-0-start-here-1', title: 'Node.js — Bắt đầu tại đây', sub: 'Chưa viết API Express nào? Học khoá Node.js chương 1–8 trước: Nest chạy trên chính Express đó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-1-tu-http-toi-express', title: 'Node.js 5.1 — Từ http thuần tới Express', sub: 'Route, middleware, xử lý lỗi bằng Express — phần nền mà Nest đóng khung lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'typescript', bai: 'typescript-14-4-decorators', title: 'TypeScript 14.4 — Decorator', sub: 'Cú pháp @ mà Nest dùng ở mọi tệp. Chương 1 khoá này đào thêm phần metadata.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-0-8-bat-dau-tai-day', title: 'Spring Boot — Bắt đầu tại đây', sub: 'Học cả hai? Chương 2 khoá này có bảng dịch Nest ↔ Spring IoC từng khái niệm.', cta: 'Mở bài →' }),
  lienKetAcademy({ mon: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-8-1-nestjs-hono', title: 'SDN302 — Chuyên sâu 8.1: NestJS, Hono đo thật', sub: 'Môn SDN302 ở trường giới thiệu Nest trong một buổi (CLO2). Khoá này là bản đầy đủ để đi làm.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Introduction & Philosophy', '"The architecture is heavily inspired by Angular." — vì sao Nest ra đời.', 'https://docs.nestjs.com/'),
  nguon('🏢', 'nestjs.com — "Trusted by thousands of leading companies"', 'Dải logo trên trang chủ: IBM, Adidas, Sanofi, Mercedes, BMW, Capgemini, GitLab, Decathlon, Roche, Société Générale.', 'https://nestjs.com/'),
  nguon('🏷️', 'NestJS v12.0.0 release notes (27/08/2026)', 'ESM, Standard Schema, CLI mới, Vitest mặc định cho dự án ESM, yêu cầu Node 20.19+/22.12+.', 'https://github.com/nestjs/nest/releases/tag/v12.0.0'),
  nguon('⭐', 'GitHub — nestjs/nest', 'Mã nguồn MIT, kho tạo 02/2017.', 'https://github.com/nestjs/nest'),
  nguon('📦', 'npm — @nestjs/core', 'Lượt tải hằng tuần và lịch sử phiên bản.', 'https://www.npmjs.com/package/@nestjs/core'),
].join('\n');

const MA_NEST = `import { Controller, Get, Injectable, Module, Param } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Injectable()
class ChaoService {
  chao(ten: string) {
    return { loiChao: \`Xin chào \${ten}!\`, luc: new Date().toISOString() };
  }
}

@Controller('chao')
class ChaoController {
  constructor(private readonly chaoService: ChaoService) {} // Nest tự đưa ChaoService vào

  @Get(':ten')
  chao(@Param('ten') ten: string) {
    return this.chaoService.chao(ten);
  }
}

@Module({ controllers: [ChaoController], providers: [ChaoService] })
class AppModule {}

const app = await NestFactory.create(AppModule);
await app.listen(3000);`;

const MA_EXPRESS = `import express from 'express';

const chao = (ten) => ({ loiChao: \`Xin chào \${ten}!\`, luc: new Date().toISOString() });

const app = express();
app.get('/chao/:ten', (req, res) => res.json(chao(req.params.ten)));
app.listen(3000, () => console.log('Express chạy ở cổng 3000'));`;

const OUT_NEST = `$ node dist/main.js
[Nest] 8  - 11/23/2026, 8:27:52 PM     LOG [NestFactory] Starting Nest application...
[Nest] 8  - 11/23/2026, 8:27:52 PM     LOG [InstanceLoader] AppModule dependencies initialized +7ms
[Nest] 8  - 11/23/2026, 8:27:52 PM     LOG [RoutesResolver] ChaoController {/chao}: +3ms
[Nest] 8  - 11/23/2026, 8:27:52 PM     LOG [RouterExplorer] Mapped {/chao/:ten, GET} route +2ms
[Nest] 8  - 11/23/2026, 8:27:52 PM     LOG [NestApplication] Nest application successfully started +1ms
$ curl -s localhost:3000/chao/Cuong
{"loiChao":"Xin chào Cuong!","luc":"2026-11-23T20:27:54.302Z"}`;

const OUT_LOI = `[Nest] 8  - 11/23/2026, 8:28:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 8  - 11/23/2026, 8:28:00 PM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the ChaoController (?). Please make sure that the argument ChaoService at index [0] is available in the AppModule module.

Potential solutions:
- Is AppModule a valid NestJS module?
- If ChaoService is a provider, is it part of the current AppModule?
- If ChaoService is exported from a separate @Module, is that module imported within AppModule?`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default {
  title: 'Start here (1/2) — What NestJS is, where it came from, and what this course gives you|||Bắt đầu tại đây (1/2) — NestJS là gì, từ đâu ra, và khoá này cho bạn điều gì',
  slug: 'nst-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'NestJS là gì và vì sao ra đời (2017, cảm hứng Angular, tới Nest 12 tháng 8/2026), khác Express, Fastify, Hono và Spring Boot ra sao, cần nền gì, học xong làm được gì, công ty lớn nào dùng (có nguồn), học kèm khoá nào — và chạy thật một ứng dụng Nest một tệp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Hello. Let us learn the Node.js framework that gives a team one shared shape for a backend</h2>
<p class="lead">If you have written an Express API, you know the feeling after a few weeks: routes in one file, database calls inside route handlers, a <code>utils.js</code> that everybody edits, and nobody quite sure where the permission check should go. <strong>NestJS</strong> is a framework that runs <em>on top of</em> Express (or Fastify) and answers those questions for the whole team: every feature is a <strong>module</strong>, HTTP lives in <strong>controllers</strong>, business logic lives in <strong>providers</strong> that the framework creates and hands to whoever needs them (<strong>dependency injection</strong>), and cross-cutting work — validation, authentication, logging, error format — has a named place in the request pipeline. This course teaches only what is specific to Nest. JavaScript, Express, REST, Prisma and JWT are taught in their own courses on this site; we link to the exact lesson when we need them.</p>

<h3>An everyday picture: a home kitchen vs a restaurant kitchen</h3>
<p>Cooking at home (Express) is free: you take the pan, go to the market yourself, cook and wash in the same corner. Great for one person. A restaurant kitchen (Nest) has <strong>stations</strong> (modules: grill, salad, pastry), a <strong>supply room</strong> that delivers the ingredients each cook asks for (the DI container — a cook never goes to the market), and a <strong>pass</strong> where every plate is checked before it leaves (guards, pipes, interceptors, filters). It feels heavier for one dish, but twenty cooks can work without stepping on each other — and a new cook knows where everything is on day one. That is exactly why companies with many developers pick Nest.</p>

<h3>See it before reading about it — one file, real output</h3>
<p>The same endpoint, <code>GET /chao/:ten</code>, in Express and in Nest 12. Both ran in a Node 22 container while this lesson was written.</p>
<pre><code class="language-js">${esc(MA_EXPRESS)}</code></pre>
<pre><code class="language-ts">${esc(MA_NEST)}</code></pre>
<div class="out">${esc(OUT_NEST)}</div>
<p>Read the start-up log line by line: Nest <strong>created</strong> every object in <code>AppModule</code> (<code>InstanceLoader</code>), <strong>discovered</strong> the controller and its route from the decorators (<code>RoutesResolver</code>, <code>RouterExplorer</code>), and only then started listening. You never wrote <code>new ChaoService()</code>. Now remove <code>providers: [ChaoService]</code> from the module and start again:</p>
<div class="out">${esc(OUT_LOI)}</div>
<p>This is the error you will see most often in your first month of Nest. It says precisely: the controller's constructor argument at index 0 (<code>ChaoService</code>) is not available in <code>AppModule</code>. Chapter 2 teaches you to read it in five seconds — after you have written a tiny DI container yourself.</p>

<h3>1 · What NestJS is, and where it came from</h3>
<ul>
<li><strong>What:</strong> an open-source (MIT) framework for server-side Node.js applications, written in TypeScript. It is not a new HTTP server: by default it uses Express underneath (Express 5.3.0 in our run), and can swap to Fastify with one adapter.</li>
<li><strong>Who and why:</strong> created by <strong>Kamil Myśliwiec</strong>. The official docs explain the motivation: Node had excellent libraries, but "none of them effectively solves the main problem of architecture"; Nest provides "an out-of-the-box application architecture", and "the architecture is heavily inspired by Angular" — modules, decorators and dependency injection.</li>
<li><strong>Timeline (from GitHub and the npm registry):</strong> repository created February 2017 · first <code>@nestjs/core</code> on npm May 2017 · 4.0 September 2017 · one major version roughly every year (7.0 in 2020, 9.0 in 2022, 10.0 in 2023, 11.0 January 2025) · <strong>12.0 on 27 August 2026</strong>: packages ship as ESM, Standard Schema validation (Zod, Valibot…), a rebuilt CLI, Vitest as the default test runner for new ESM projects, and Node 20.19+/22.12+ required.</li>
<li><strong>Size today:</strong> 77,131 GitHub stars and 25.4 million npm downloads of <code>@nestjs/core</code> in the week 16–22 November 2026 (Express: 209.8 million — Express is still the base layer of most Node backends, including Nest's).</li>
</ul>

<h3>2 · How it differs from the technologies around it</h3>
<table>
<thead><tr><th></th><th>What it is</th><th>Structure</th><th>When people choose it</th></tr></thead>
<tbody>
<tr><td><strong>Express</strong></td><td>Minimal HTTP library: routes + middleware</td><td>You invent it</td><td>Small services, learning, full control</td></tr>
<tr><td><strong>Fastify</strong></td><td>Fast HTTP framework with schemas and plugins</td><td>Plugins, light</td><td>Throughput matters, team likes JSON Schema</td></tr>
<tr><td><strong>Hono</strong></td><td>Tiny framework on Web standards; runs on Node, Bun, edge</td><td>Light</td><td>Edge/serverless, very small APIs</td></tr>
<tr><td><strong>NestJS</strong></td><td>Application framework on top of Express/Fastify</td><td>Modules, DI, decorators, fixed pipeline</td><td>Medium/large teams, long-lived TypeScript backends, enterprise/outsourcing</td></tr>
<tr><td><strong>Spring Boot</strong></td><td>Java application framework</td><td>IoC container, annotations, starters</td><td>Java enterprise; same ideas as Nest in another language</td></tr>
</tbody>
</table>
<p>If you know Spring: <code>@Module</code> ≈ <code>@Configuration</code>, <code>@Injectable</code> ≈ <code>@Service</code>, guards ≈ Spring Security filters, pipes + DTOs ≈ <code>@Valid</code> + Bean Validation. Chapter 2 has the full translation table — and the places where the analogy breaks.</p>

<h3>3 · What you need before starting</h3>
<ul>
<li><strong>Required:</strong> you have built a small REST API with Express (routes, middleware, JSON, status codes) — Node.js course chapters 1–8 or equivalent; TypeScript classes, interfaces and generics at a basic level; introductory SQL.</li>
<li><strong>Helpful:</strong> TypeScript 14.4 (decorators), Docker basics (we start PostgreSQL and Redis in containers), Spring Boot (for the comparisons).</li>
<li><strong>Not required:</strong> Angular, RxJS (Chapter 3 teaches the three operators you need), any previous Nest experience.</li>
</ul>

<h3>4 · After this course you can…</h3>
<ul>
<li>Create and structure a Nest 12 project (ESM or CommonJS) and read any existing Nest 10/11 codebase at a company.</li>
<li>Explain and use modules, providers, injection tokens, scopes and dynamic modules — and answer "what is dependency injection?" in an interview with your own 60-line container as proof.</li>
<li>Put each concern in the right layer: middleware, guard, interceptor, pipe, exception filter, custom decorators.</li>
<li>Validate input with DTOs (and stop mass assignment), hide sensitive fields, generate OpenAPI docs.</li>
<li>Wire Prisma or TypeORM into the container, use transactions, prevent double booking under concurrency.</li>
<li>Secure an API with a global JWT guard, roles and ownership checks; test it with unit and end-to-end tests (Vitest and Jest).</li>
<li>Run background jobs (BullMQ), schedules, events, WebSocket gateways and microservice transports; ship with Docker, health checks and CI.</li>
<li>Deliver the capstone — a lab-booking API — and defend it. Typical job titles that list NestJS: Backend Developer (Node.js/TypeScript), Full-stack Developer (React + NestJS), and many offshore/outsourcing projects for Japanese and European clients.</li>
</ul>

<h3>5 · Who runs Nest in production — with sources</h3>
<p>Nest's home page shows a "Trusted by thousands of leading companies and organizations worldwide" logo wall. On 24 November 2026 it listed <strong>IBM, Adidas, Sanofi, Mercedes, BMW, Capgemini, GitLab, Decathlon, Roche and Société Générale</strong> (link below). Treat this the way an engineer should: a logo means the company uses Nest <em>somewhere</em>, not that every system there is Nest. Separately, Microsoft and Trilon appear as principal <em>sponsors</em> — sponsoring is not the same as using, so we do not count them.</p>

<h3>6 · Courses to take before, alongside and after</h3>
<table>
<thead><tr><th>When</th><th>Course</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Before</td><td>Node.js (ch 1–8), TypeScript (ch 1–6, 14)</td><td>Nest is TypeScript on Express — the base must be solid</td></tr>
<tr><td>Alongside</td><td>Prisma ORM, Authentication, API Design, Testing</td><td>Chapters 4–8 link to them instead of re-teaching</td></tr>
<tr><td>Alongside</td><td>Spring Boot</td><td>Same architecture ideas in Java — learning both makes each easier</td></tr>
<tr><td>After</td><td>Docker, GitHub Actions, System Design, Fullstack Project</td><td>Deploy and grow what you built here</td></tr>
<tr><td>School</td><td>Academy SDN302 (chapter 8)</td><td>The school course introduces Nest in one session; this course is the full version</td></tr>
</tbody>
</table>

<h3>🧪 Practice (10 min) — read a Nest error before you need to</h3>
<div class="callout ok">
<ol>
<li>Look at the second output above. Without reading the explanation again, write down: which class failed to be created, which constructor argument was missing, and which module should have provided it.</li>
<li>Write the one-line fix.</li>
<li>Bonus: guess what the message would say if <code>ChaoService</code> lived in a separate <code>ChaoModule</code> that <code>AppModule</code> imports but <code>ChaoModule</code> forgot to <code>export</code> it. (You will run exactly this in Chapter 2.)</li>
</ol>
<details><summary>Show answer</summary>
<p>Failed: <code>ChaoController</code>. Missing: argument index [0], type <code>ChaoService</code>. Expected in: <code>AppModule</code>. Fix: <code>@Module({ controllers: [ChaoController], providers: [ChaoService] })</code>. Bonus: the same "can't resolve dependencies" message; the fix is <code>exports: [ChaoService]</code> in <code>ChaoModule</code> — a module only shares what it exports.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestJS</span><span class="v">A TypeScript application framework for Node.js that runs on Express or Fastify.</span></div>
  <div class="kv"><span class="k">module</span><span class="v">A class marked <code>@Module</code> that groups controllers and providers of one feature and decides what it exports.</span></div>
  <div class="kv"><span class="k">controller</span><span class="v">A class that maps HTTP routes to methods.</span></div>
  <div class="kv"><span class="k">provider</span><span class="v">Anything the container can create and inject — usually a service class marked <code>@Injectable</code>.</span></div>
  <div class="kv"><span class="k">dependency injection (DI)</span><span class="v">Objects receive what they need from outside instead of creating it with <code>new</code>.</span></div>
  <div class="kv"><span class="k">decorator</span><span class="v">The <code>@Something</code> syntax: a function that attaches behaviour or metadata to a class, method or parameter.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nest = TypeScript framework on top of Express/Fastify that gives a backend a fixed shape: modules, controllers, providers, a request pipeline.</li>
<li>Born in 2017 from Kamil Myśliwiec's frustration with "no architecture" in Node; heavily inspired by Angular; Nest 12 (August 2026) is ESM-first.</li>
<li>Dependency injection means Nest creates objects and hands them over; the most common beginner error is a provider not available in a module.</li>
<li>Choose Express/Hono for small and fast, Nest for teams and long-lived codebases; Spring Boot is the same idea in Java.</li>
<li>Logos on nestjs.com (IBM, Adidas, BMW, GitLab, Roche…) are evidence of use, not proof of scale — read sources like an engineer.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Ta học framework Node.js giúp cả đội cùng một "hình dáng" cho backend</h2>
<p class="lead">Nếu bạn đã viết một API Express, chắc bạn quen cảm giác sau vài tuần: route dồn một tệp, gọi cơ sở dữ liệu ngay trong hàm xử lý route, một tệp <code>utils.js</code> ai cũng sửa, và không ai chắc chỗ kiểm quyền nên đặt ở đâu. <strong>NestJS</strong> là framework chạy <em>trên</em> Express (hoặc Fastify) và trả lời những câu đó cho cả đội: mỗi tính năng là một <strong>module</strong>; phần HTTP nằm trong <strong>controller</strong>; logic nghiệp vụ nằm trong <strong>provider</strong> — framework tự tạo và đưa cho ai cần (<strong>dependency injection</strong>, tiêm phụ thuộc); còn việc dùng chung như kiểm dữ liệu, xác thực, ghi log, định dạng lỗi đều có một chỗ có tên trong dây chuyền xử lý request. Khoá này chỉ dạy phần RIÊNG của Nest. JavaScript, Express, REST, Prisma, JWT đã có khoá riêng trên trang; cần đến đâu, bài sẽ dẫn đúng bài đó.</p>

<h3>Liên tưởng đời thường: bếp nhà và bếp nhà hàng</h3>
<p>Nấu ở nhà (Express) thì tự do: bạn tự cầm chảo, tự đi chợ, nấu và rửa cùng một góc. Một người thì rất tiện. Bếp nhà hàng (Nest) có <strong>các trạm</strong> (module: trạm nướng, trạm salad, trạm bánh), có <strong>kho</strong> giao đúng nguyên liệu cho đầu bếp nào cần (DI container — đầu bếp không bao giờ tự đi chợ), và có <strong>quầy ra món</strong> nơi mọi đĩa được kiểm trước khi mang đi (guard, pipe, interceptor, filter). Nấu một món thì thấy rườm rà; nhưng hai mươi đầu bếp làm cùng lúc không giẫm chân nhau, và người mới vào biết ngay đồ ở đâu từ ngày đầu. Đó chính là lý do công ty nhiều lập trình viên chọn Nest.</p>

<h3>Thấy trước khi đọc — một tệp, output thật</h3>
<p>Cùng một endpoint <code>GET /chao/:ten</code>, viết bằng Express và bằng Nest 12. Cả hai đã chạy trong container Node 22 lúc soạn bài.</p>
<pre><code class="language-js">${esc(MA_EXPRESS)}</code></pre>
<pre><code class="language-ts">${esc(MA_NEST)}</code></pre>
<div class="out">${esc(OUT_NEST)}</div>
<p>Đọc log khởi động từng dòng: Nest <strong>tạo</strong> mọi object trong <code>AppModule</code> (<code>InstanceLoader</code>), <strong>tìm ra</strong> controller và route của nó nhờ decorator (<code>RoutesResolver</code>, <code>RouterExplorer</code>), rồi mới bắt đầu lắng nghe cổng. Bạn không hề viết <code>new ChaoService()</code>. Giờ xoá <code>providers: [ChaoService]</code> khỏi module rồi chạy lại:</p>
<div class="out">${esc(OUT_LOI)}</div>
<p>Đây là lỗi bạn gặp nhiều nhất trong tháng đầu dùng Nest. Nó nói rất chính xác: tham số thứ 0 trong constructor của controller (kiểu <code>ChaoService</code>) không có sẵn trong <code>AppModule</code>. Chương 2 dạy bạn đọc lỗi này trong năm giây — sau khi bạn tự viết một DI container nhỏ.</p>

<h3>1 · NestJS là gì, và từ đâu ra</h3>
<ul>
<li><strong>Là gì:</strong> framework mã nguồn mở (giấy phép MIT) để viết ứng dụng phía server bằng Node.js, viết bằng TypeScript. Nó không phải một HTTP server mới: mặc định nó dùng Express bên dưới (lần chạy ở trên là Express 5.3.0), và đổi sang Fastify được bằng một adapter.</li>
<li><strong>Ai làm, vì sao:</strong> tác giả là <strong>Kamil Myśliwiec</strong>. Tài liệu chính thức kể lý do: Node có rất nhiều thư viện tốt, nhưng "không cái nào thật sự giải bài toán chính là kiến trúc"; Nest đưa ra "một kiến trúc ứng dụng dùng ngay được", và "kiến trúc này lấy cảm hứng rất nhiều từ Angular" — module, decorator và dependency injection.</li>
<li><strong>Mốc thời gian (theo GitHub và npm):</strong> kho mã tạo tháng 2/2017 · gói <code>@nestjs/core</code> đầu tiên lên npm tháng 5/2017 · bản 4.0 tháng 9/2017 · gần như mỗi năm một bản lớn (7.0 năm 2020, 9.0 năm 2022, 10.0 năm 2023, 11.0 tháng 1/2025) · <strong>12.0 ngày 27/08/2026</strong>: các gói chuyển sang ESM, kiểm dữ liệu theo Standard Schema (Zod, Valibot…), CLI viết lại, Vitest là trình chạy test mặc định cho dự án ESM mới, yêu cầu Node 20.19+ hoặc 22.12+.</li>
<li><strong>Quy mô hôm nay:</strong> 77.131 sao trên GitHub; 25,4 triệu lượt tải <code>@nestjs/core</code> trong tuần 16–22/11/2026 (Express: 209,8 triệu — Express vẫn là tầng nền của phần lớn backend Node, kể cả của Nest).</li>
</ul>

<h3>2 · Khác gì các công nghệ xung quanh</h3>
<table>
<thead><tr><th></th><th>Là gì</th><th>Cấu trúc</th><th>Khi nào người ta chọn</th></tr></thead>
<tbody>
<tr><td><strong>Express</strong></td><td>Thư viện HTTP tối giản: route + middleware</td><td>Tự bạn nghĩ ra</td><td>Dịch vụ nhỏ, học, muốn toàn quyền</td></tr>
<tr><td><strong>Fastify</strong></td><td>Framework HTTP nhanh, có schema và plugin</td><td>Plugin, nhẹ</td><td>Cần thông lượng cao, đội thích JSON Schema</td></tr>
<tr><td><strong>Hono</strong></td><td>Framework rất nhỏ theo chuẩn Web; chạy trên Node, Bun, edge</td><td>Nhẹ</td><td>Edge/serverless, API rất nhỏ</td></tr>
<tr><td><strong>NestJS</strong></td><td>Framework ứng dụng chạy trên Express/Fastify</td><td>Module, DI, decorator, dây chuyền cố định</td><td>Đội vừa/lớn, backend TypeScript sống lâu, dự án doanh nghiệp/outsourcing</td></tr>
<tr><td><strong>Spring Boot</strong></td><td>Framework ứng dụng Java</td><td>IoC container, annotation, starter</td><td>Java doanh nghiệp; cùng ý tưởng với Nest ở ngôn ngữ khác</td></tr>
</tbody>
</table>
<p>Nếu bạn biết Spring: <code>@Module</code> ≈ <code>@Configuration</code>, <code>@Injectable</code> ≈ <code>@Service</code>, guard ≈ filter của Spring Security, pipe + DTO ≈ <code>@Valid</code> + Bean Validation. Chương 2 có bảng dịch đầy đủ — và cả những chỗ phép so sánh này không đúng.</p>

<h3>3 · Cần biết gì trước</h3>
<ul>
<li><strong>Bắt buộc:</strong> đã tự dựng một REST API nhỏ bằng Express (route, middleware, JSON, mã trạng thái) — khoá Node.js chương 1–8 hoặc tương đương; class, interface, generic TypeScript ở mức cơ bản; SQL nhập môn.</li>
<li><strong>Nên có:</strong> TypeScript 14.4 (decorator), Docker cơ bản (ta chạy PostgreSQL và Redis trong container), Spring Boot (để so sánh).</li>
<li><strong>Không cần:</strong> Angular, RxJS (chương 3 dạy đúng ba toán tử cần dùng), kinh nghiệm Nest trước đó.</li>
</ul>

<h3>4 · Học xong bạn làm được gì</h3>
<ul>
<li>Tạo và tổ chức dự án Nest 12 (ESM hoặc CommonJS), và đọc được mã Nest 10/11 đang chạy ở công ty.</li>
<li>Giải thích và dùng module, provider, injection token, scope, dynamic module — trả lời câu phỏng vấn "dependency injection là gì?" bằng chính DI container 60 dòng bạn tự viết.</li>
<li>Đặt mỗi việc vào đúng lớp: middleware, guard, interceptor, pipe, exception filter, decorator tự viết.</li>
<li>Kiểm dữ liệu vào bằng DTO (chặn mass assignment), giấu trường nhạy cảm, sinh tài liệu OpenAPI.</li>
<li>Nối Prisma hoặc TypeORM vào container, dùng transaction, chặn đặt trùng khi nhiều request cùng lúc.</li>
<li>Bảo vệ API bằng guard JWT toàn cục, vai trò và kiểm chủ sở hữu; test bằng test đơn vị và test end-to-end (Vitest và Jest).</li>
<li>Chạy tác vụ nền (BullMQ), hẹn giờ, sự kiện, WebSocket gateway, transport microservice; đóng gói bằng Docker, health check và CI.</li>
<li>Hoàn thành dự án cuối khoá — API đặt lịch phòng lab — và bảo vệ được nó. Vị trí hay ghi NestJS: Backend Developer (Node.js/TypeScript), Full-stack Developer (React + NestJS), và nhiều dự án offshore/outsourcing cho khách Nhật, châu Âu.</li>
</ul>

<h3>5 · Ai đang chạy Nest thật — có nguồn</h3>
<p>Trang chủ Nest có dải logo "Trusted by thousands of leading companies and organizations worldwide" (được hàng nghìn công ty và tổ chức hàng đầu tin dùng). Ngày 24/11/2026 dải này gồm <strong>IBM, Adidas, Sanofi, Mercedes, BMW, Capgemini, GitLab, Decathlon, Roche và Société Générale</strong> (liên kết bên dưới). Hãy đọc nguồn như một kỹ sư: logo nghĩa là công ty đó dùng Nest <em>ở đâu đó</em>, không phải mọi hệ thống ở đó đều là Nest. Riêng Microsoft và Trilon xuất hiện ở mục <em>nhà tài trợ</em> chính — tài trợ không đồng nghĩa với dùng, nên ta không tính.</p>

<h3>6 · Học trước, học kèm, học sau khoá nào</h3>
<table>
<thead><tr><th>Lúc nào</th><th>Khoá</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Trước</td><td>Node.js (chương 1–8), TypeScript (chương 1–6, 14)</td><td>Nest là TypeScript chạy trên Express — nền phải chắc</td></tr>
<tr><td>Kèm</td><td>Prisma ORM, Authentication, API Design, Testing</td><td>Chương 4–8 dẫn sang các khoá này thay vì dạy lại</td></tr>
<tr><td>Kèm</td><td>Spring Boot</td><td>Cùng ý tưởng kiến trúc bằng Java — học cả hai thì mỗi bên dễ hơn</td></tr>
<tr><td>Sau</td><td>Docker, GitHub Actions, System Design, Fullstack Project</td><td>Triển khai và phát triển tiếp thứ bạn dựng ở đây</td></tr>
<tr><td>Ở trường</td><td>Academy SDN302 (chương 8)</td><td>Môn ở trường giới thiệu Nest trong một buổi; khoá này là bản đầy đủ</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (10 phút) — đọc lỗi Nest trước khi cần đến</h3>
<div class="callout ok">
<ol>
<li>Nhìn output thứ hai ở trên. Không đọc lại phần giải thích, hãy viết ra: class nào không tạo được, tham số constructor nào bị thiếu, và module nào lẽ ra phải cung cấp nó.</li>
<li>Viết bản sửa một dòng.</li>
<li>Thêm: đoán thông báo sẽ nói gì nếu <code>ChaoService</code> nằm trong một <code>ChaoModule</code> riêng, <code>AppModule</code> có import <code>ChaoModule</code>, nhưng <code>ChaoModule</code> quên <code>export</code> nó. (Chương 2 bạn sẽ chạy đúng tình huống này.)</li>
</ol>
<details><summary>Xem đáp án</summary>
<p>Không tạo được: <code>ChaoController</code>. Thiếu: tham số vị trí [0], kiểu <code>ChaoService</code>. Lẽ ra ở: <code>AppModule</code>. Sửa: <code>@Module({ controllers: [ChaoController], providers: [ChaoService] })</code>. Câu thêm: vẫn là thông báo "can't resolve dependencies"; cách sửa là thêm <code>exports: [ChaoService]</code> vào <code>ChaoModule</code> — module chỉ chia sẻ thứ nó export.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NestJS</span><span class="v">Framework ứng dụng TypeScript cho Node.js, chạy trên Express hoặc Fastify.</span></div>
  <div class="kv"><span class="k">module</span><span class="v">Class gắn <code>@Module</code>, gom controller và provider của một tính năng, và quyết định chia sẻ (export) gì.</span></div>
  <div class="kv"><span class="k">controller</span><span class="v">Class nối route HTTP với phương thức xử lý.</span></div>
  <div class="kv"><span class="k">provider</span><span class="v">Thứ container tạo được và tiêm được — thường là class service gắn <code>@Injectable</code>.</span></div>
  <div class="kv"><span class="k">dependency injection (DI)</span><span class="v">Tiêm phụ thuộc: object nhận thứ nó cần từ bên ngoài thay vì tự <code>new</code>.</span></div>
  <div class="kv"><span class="k">decorator</span><span class="v">Cú pháp <code>@Tên</code>: một hàm gắn hành vi hoặc metadata vào class, phương thức hay tham số.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nest = framework TypeScript chạy trên Express/Fastify, cho backend một hình dáng cố định: module, controller, provider, dây chuyền xử lý request.</li>
<li>Ra đời năm 2017 vì Kamil Myśliwiec thấy Node "thiếu kiến trúc"; lấy cảm hứng từ Angular; Nest 12 (tháng 8/2026) ưu tiên ESM.</li>
<li>DI nghĩa là Nest tạo object và đưa cho bạn; lỗi hay gặp nhất của người mới là provider không có sẵn trong module.</li>
<li>Nhỏ và nhanh thì chọn Express/Hono; đội đông, mã sống lâu thì chọn Nest; Spring Boot là cùng ý tưởng bằng Java.</li>
<li>Logo trên nestjs.com (IBM, Adidas, BMW, GitLab, Roche…) là bằng chứng có dùng, không phải bằng chứng về quy mô — đọc nguồn như một kỹ sư.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
