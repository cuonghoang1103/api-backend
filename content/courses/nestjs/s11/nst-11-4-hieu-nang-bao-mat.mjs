/**
 * 11.4 — Hiệu năng và bảo trì: Fastify adapter, cache, npm audit và nâng cấp Nest (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, tải nền ~8 vì có agent/GPU khác): lab/c11/app/src/b114 (b114.sh, autocannon 9.0.0 c=50 10 s), @nestjs/platform-fastify 12.6.0,
 * @nestjs/cache-manager 12.0.5 + cache-manager 7.2.9; npm audit trên moc11; nâng Nest 11.1.6 → 12.6.0 trên lab/c11/nang (bản sao lab/c8/nst11)
 * ⇒ lab/c11/o/114-*.txt. Nguồn đã GET 24/11/2026: GHSA-7589-6fvf-x4pw, GHSA-85cg-cmq5-qjm7 (CVE-2025-54782). Ghép: gen.mjs rồi ghep.sh 114 nst-11-4-hieu-nang-bao-mat.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-12-2-cache-aside', title: 'Node.js 12.2 — Cache-aside: khuôn mẫu và bốn lần nó phản chủ', sub: 'Lý thuyết cache, TTL, vô hiệu hoá — bài này chỉ thêm bẫy của CacheInterceptor.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-8-4-jest-du-an-cu', title: 'NestJS 8.4 — Jest trên dự án Nest 10/11', sub: 'Vì sao Nest 12 + Jest kén phiên bản Node — bài này đo đủ điều kiện.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-0-9-bat-dau-khi-khong-co', title: 'NestJS 0.9 — CVE-2025-54782', sub: 'Lỗ RCE ở gói devtools của Nest — vì sao gói chỉ-cho-máy-dev phải ở đúng chỗ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-14-2-bao-mat-chuoi-cung-ung', title: 'GitHub Actions 14.2 — Bảo mật chuỗi cung ứng, Dependabot', sub: 'Tự động hoá việc cập nhật mà bài này làm bằng tay.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🛡', 'GitHub Advisory GHSA-7589-6fvf-x4pw — effect: ReDoS (19/11/2026)', 'effect ≤ 3.22.0, vá 3.22.1; lọt vào dự án qua prisma 7.10.1 → @prisma/config.', 'https://github.com/advisories/GHSA-7589-6fvf-x4pw'),
  nguon('🛡', 'GitHub Advisory GHSA-85cg-cmq5-qjm7 — @nestjs/devtools-integration (CVE-2025-54782)', 'CSRF tới thoát sandbox ⇒ RCE trên máy lập trình viên; ≤ 0.2.0, vá 0.2.1 (01/08/2025).', 'https://github.com/advisories/GHSA-85cg-cmq5-qjm7'),
  nguon('📘', 'NestJS docs — Performance (Fastify) và Caching', 'FastifyAdapter; CacheInterceptor chỉ cache GET, khoá theo URL, trackBy().', 'https://docs.nestjs.com/techniques/performance'),
  nguon('📘', 'npm docs — overrides', 'Ép phiên bản một phụ thuộc bắc cầu.', 'https://docs.npmjs.com/cli/configuring-npm/package-json#overrides'),
].join('\n');
const OUT_DO = "/rooms NEN=express                 7751 req/s · p99 14 ms · lỗi 0 · non2xx 0\n/rooms NEN=express DAY=1           7028 req/s · p99 17 ms · lỗi 0 · non2xx 0\n/rooms NEN=fastify                36931 req/s · p99 4 ms · lỗi 0 · non2xx 0\n/rooms NEN=fastify DAY=1          30884 req/s · p99 5 ms · lỗi 0 · non2xx 0\n/rooms NEN=express                 8108 req/s · p99 15 ms · lỗi 0 · non2xx 0\n/rooms NEN=express DAY=1          10087 req/s · p99 14 ms · lỗi 0 · non2xx 0\n/rooms NEN=fastify                47359 req/s · p99 2 ms · lỗi 0 · non2xx 0\n/rooms NEN=fastify DAY=1          34785 req/s · p99 3 ms · lỗi 0 · non2xx 0";
const MA_B114 = "// main.ts — thí nghiệm 11.4. NEN=express|fastify; DAY=1 ⇒ thêm ValidationPipe + guard + interceptor toàn cục (như app thật);\n// CACHE=1 ⇒ CacheInterceptor toàn cục (bẫy: khoá cache = URL, không theo người dùng)\nimport { CallHandler, CanActivate, Controller, ExecutionContext, Get, Headers, Injectable, Module, NestInterceptor, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';\nimport { APP_GUARD, APP_INTERCEPTOR, NestFactory } from '@nestjs/core';\nimport { FastifyAdapter } from '@nestjs/platform-fastify';\nimport { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';\nimport { map } from 'rxjs';\n\nconst PHONG = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, code: `AL-${200 + i}`, building: 'Alpha', capacity: 30 }));\n\n@Controller()\nclass PhongController {\n  @Get('rooms') ds() { return PHONG; }\n  @Get('rooms/:id') mot(@Param('id', ParseIntPipe) id: number) { return PHONG[id - 1]; }\n  @Get('me/bookings') cuaToi(@Headers('x-user') u: string) { return { user: u, bookings: [`lịch riêng của ${u}`] }; }   // giả lập route theo người đăng nhập\n}\n@Injectable() class Gac implements CanActivate { canActivate(c: ExecutionContext) { return !!c; } }\n@Injectable() class Boc implements NestInterceptor { intercept(_: ExecutionContext, n: CallHandler) { return n.handle().pipe(map((d) => d)); } }\n\n// CACHE=2 ⇒ bản sửa: chỉ cache request ẩn danh — có danh tính (Authorization / x-user) thì không cache, không đọc cache\n@Injectable() class CacheAnDanh extends CacheInterceptor {\n  protected trackBy(c: ExecutionContext) {\n    const req = c.switchToHttp().getRequest();\n    return req.headers.authorization || req.headers['x-user'] ? undefined : super.trackBy(c);\n  }\n}\nconst day = process.env.DAY === '1', cache = !!process.env.CACHE;\n@Module({\n  imports: cache ? [CacheModule.register({ ttl: 30_000 })] : [],\n  controllers: [PhongController],\n  providers: [\n    ...(day ? [{ provide: APP_GUARD, useClass: Gac }, { provide: APP_INTERCEPTOR, useClass: Boc }] : []),\n    ...(cache ? [{ provide: APP_INTERCEPTOR, useClass: process.env.CACHE === '2' ? CacheAnDanh : CacheInterceptor }] : []),\n  ],\n})\nclass AppModule {}\n\nconst app = process.env.NEN === 'fastify'\n  ? await NestFactory.create(AppModule, new FastifyAdapter(), { logger: ['error', 'warn'] })\n  : await NestFactory.create(AppModule, { logger: ['error', 'warn'] });\nif (day) app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));\nawait app.listen(Number(process.env.PORT ?? 42141), '127.0.0.1');";
const OUT_LO = "GET /me/bookings với X-User: an → {\"user\":\"an\",\"bookings\":[\"lịch riêng của an\"]}\nGET /me/bookings với X-User: binh → {\"user\":\"an\",\"bookings\":[\"lịch riêng của an\"]}";
const OUT_SUA = "GET /me/bookings với X-User: an → {\"user\":\"an\",\"bookings\":[\"lịch riêng của an\"]}\nGET /me/bookings với X-User: binh → {\"user\":\"binh\",\"bookings\":[\"lịch riêng của binh\"]}";
const OUT_AUDIT = "# npm audit report\n\neffect  <=3.22.0\nSeverity: high\nEffect: ReDoS in Schema.TemplateLiteral compiled regex - https://github.com/advisories/GHSA-7589-6fvf-x4pw\nfix available via `npm audit fix --force`\nWill install prisma@6.12.0, which is a breaking change\nnode_modules/effect\n  @prisma/config  >=6.13.0-dev.1\n  Depends on vulnerable versions of effect\n  node_modules/@prisma/config\n    prisma  >=6.13.0-dev.1\n    Depends on vulnerable versions of @prisma/config\n    node_modules/prisma\n\n3 high severity vulnerabilities";
const OUT_AUDIT_SAU = "$ npm audit\nfound 0 vulnerabilities";
const MA_OVR = "{\n  \"overrides\": {\n    \"effect\": \"^3.22.1\"\n  }\n}";
const OUT_OUTDATED = "Package                   Current   Wanted   Latest  Location                               Depended by\n@nestjs/cli               11.0.24  11.0.24  12.0.15  node_modules/@nestjs/cli               nang\n@nestjs/common             11.1.6   11.1.6   12.6.0  node_modules/@nestjs/common            nang\n@nestjs/core               11.1.6   11.1.6   12.6.0  node_modules/@nestjs/core              nang\n@nestjs/platform-express   11.1.6   11.1.6   12.6.0  node_modules/@nestjs/platform-express  nang\n@nestjs/schematics         11.1.0   11.1.0   12.0.0  node_modules/@nestjs/schematics        nang\n@nestjs/testing            11.1.6   11.1.6   12.6.0  node_modules/@nestjs/testing           nang\nclass-validator            0.14.4   0.14.4   0.15.1  node_modules/class-validator           nang\ntypescript                  5.9.3    5.9.3    7.0.2  node_modules/typescript                nang";
const OUT_ERESOLVE = "npm error code ERESOLVE\nWhile resolving: nst11@0.0.1\nFound: typescript@5.9.3\nCould not resolve dependency:\npeer typescript@\">=6.0.0\" from @nestjs/schematics@12.0.0";
const OUT_TS6 = "error TS5101: Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0. Specify compilerOption '\"ignoreDeprecations\": \"6.0\"' to silence this error.\nsrc/rooms/rooms.service.ts:4:44 - error TS2564: Property 'capacity' has no initializer and is not definitely assigned in the constructor.\n4 export class CreateRoomDto { code: string; capacity: number; }\n Error  Found 5 compilation error(s).\ntest/quen.e2e-spec.ts:6:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.";
const OUT_J22 = "FAIL test/rooms.e2e-spec.ts\n  ● Test suite failed to run\n    Must use import to load ES Module: /home/sv/app/node_modules/@nestjs/common/index.js\n    The file contains ESM syntax (import/export) that could not be executed as CommonJS. Either:\n      - Configure a transform (e.g. babel-jest) that compiles this file to CommonJS (see https://jestjs.io/docs/code-transformation)\n      - If the file is in \"node_modules\", allow it to be transformed by adjusting \"transformIgnorePatterns\" (see https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)\n      - Use Node v24.9+ where Jest supports require(esm) natively (see https://jestjs.io/docs/ecmascript-modules#require-of-esm)\n    > 1 | import { INestApplication, ValidationPipe } from '@nestjs/common';";
const OUT_J24 = "v24.22.3\n\nTest Suites: 2 failed, 2 total\nTests:       0 total\nSnapshots:   0 total\nTime:        1.628 s\nRan all test suites.";
const OUT_J24CO = "v24.22.3\nA worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.\nTest Suites: 2 passed, 2 total\nTests:       4 passed, 4 total\nSnapshots:   0 total\nTime:        3.1 s\nRan all test suites.";

export default {
  title: '11.4 — Performance and upkeep: Fastify adapter, caching, npm audit and upgrading Nest|||11.4 — Hiệu năng và bảo trì: Fastify adapter, cache, npm audit và nâng cấp Nest',
  slug: 'nst-11-4-hieu-nang-bao-mat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo thật: Express ~8 nghìn req/s, Fastify ~37–47 nghìn req/s với JSON tĩnh — nhưng lab-booking qua nginx + PostgreSQL + Redis chỉ ~2 nghìn, nên đổi adapter không phải việc đầu tiên. CacheInterceptor toàn cục trả lịch riêng của "an" cho "binh". npm audit báo lỗ hổng ở effect lọt qua prisma; audit fix --force đòi hạ Prisma, overrides thì sạch và CI vẫn xanh. Nâng một dự án Nest 11 lên 12: TypeScript 6 đổi mặc định, Jest cần Node 24.9+ VÀ cờ --experimental-vm-modules.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>11.4 — Four maintenance jobs, each measured: switch adapter, add a cache, fix an advisory, upgrade a major</h2>
<p class="lead">Once the API runs in production, the work becomes upkeep: "can it be faster?", "can we cache this?", "the scanner says high severity", "Nest 12 is out". Each has a tempting shortcut that is wrong. This lesson measures each on the lab project before deciding.</p>

<h3>Everyday analogy: servicing a motorbike</h3>
<p>A faster exhaust does nothing if the tyres are flat; a mechanic measures before replacing parts. Changing the oil brand because a flyer says "high risk" without reading why is how engines get damaged. Same here: measure where time goes, read what the advisory actually affects, upgrade one major at a time with tests green.</p>

<h3>1. Express vs Fastify — and why it is rarely the first fix</h3>
<p><code>b114</code> serves the same static JSON (20 rooms) with both adapters, with and without a global pipe + guard + interceptor (<code>DAY=1</code>), autocannon 50 connections for 10 s, twice, on a machine already at load ~8:</p>
<pre><code class="language-text">${esc(OUT_DO)}</code></pre>
<p>Fastify is 4–6× faster on a route that does nothing. Now the real lab-booking route <code>GET /rooms</code> through nginx with PostgreSQL and the Redis throttler (11.5): about 16,000 requests in 8 s ≈ 2,000 req/s over two API processes ≈ 1,000 req/s each, so roughly 1 ms of work per request. Express's own share is ≈ 1/8,000 s = 0.12 ms, Fastify's ≈ 0.025 ms. Switching saves about 0.1 ms of ~1 ms — worth it for proxies and very hot endpoints, not before you have fixed queries (prisma-orm course) and caching.</p>
<p>What switching costs in lab-booking, found by <code>grep</code>: <code>app.set('trust proxy')</code> and <code>useBodyParser</code> in <code>setup-app.ts</code>, the Express-typed <code>TatEm</code> middleware, <code>NestExpressApplication</code> types, <code>@types/express</code> request objects in guards, and pino-http/Socket.IO setup. Each has a Fastify equivalent, but that is a migration with its own test run, not a one-line change.</p>

<h3>2. CacheInterceptor: the leak that happens by default</h3>
<pre><code class="language-ts">${esc(MA_B114)}</code></pre>
<p>With <code>CACHE=1</code> (a global <code>CacheInterceptor</code>, the shortest code in the docs) and a route that depends on who is calling:</p>
<pre><code class="language-text">${esc(OUT_LO)}</code></pre>
<p>User <code>binh</code> received <code>an</code>'s private bookings: the default cache key is the URL, and the URL is the same for everyone. In lab-booking the identity is in the <code>Authorization</code> header, so <code>GET /bookings/mine</code> would leak exactly like this. With <code>CACHE=2</code> (<code>trackBy</code> returns <code>undefined</code> for requests with an identity):</p>
<pre><code class="language-text">${esc(OUT_SUA)}</code></pre>
<p>Rules: never register <code>CacheInterceptor</code> globally on an authenticated API; put it on public routes only (<code>@UseInterceptors(CacheInterceptor)</code>); with several replicas use a shared store (<code>@keyv/redis</code> — note: version 6 needs keyv 6 while cache-manager 7.2.9 needs keyv 5, so <code>@keyv/redis@5.1.6</code> is the one that installs); invalidate on writes, or accept a TTL of stale data in writing.</p>

<h3>3. npm audit: read the path before you "fix"</h3>
<p>CI printed "3 high severity vulnerabilities" in 11.3:</p>
<pre><code class="language-text">${esc(OUT_AUDIT)}</code></pre>
<p>The advisory (GHSA-7589-6fvf-x4pw, published 19/11/2026) is a ReDoS in <code>effect</code> ≤ 3.22.0, reached only through <code>prisma</code> → <code>@prisma/config</code>, which pins <code>effect</code> at exactly 3.20.0. Three facts decide what to do:</p>
<ul>
<li><code>npm audit fix --force</code> would <em>downgrade</em> Prisma 7 to 6.12.0 — a breaking change to fix a dev tool.</li>
<li><code>npm audit --omit=dev</code> still reports it, because <code>prisma</code> is devOptional (11.1). Yet the runtime image built with <code>--omit=optional</code> does not contain <code>effect</code> at all — the code is not in production.</li>
<li>The vulnerable function parses schema template literals; the CLI runs it on your own config, not on user input.</li>
</ul>
<p>So the risk is low, but a red scanner trains everyone to ignore it. The clean fix is an override to the patched minor version:</p>
<pre><code class="language-json">${esc(MA_OVR)}</code></pre>
<pre><code class="language-text">${esc(OUT_AUDIT_SAU)}</code></pre>
<p>Then the proof that the override did not break Prisma: the CI <code>e2e</code> job from a clean <code>npm ci</code> (effect 3.22.5 in the lockfile) ran <code>prisma generate</code>, <code>migrate deploy</code> and all 46 db tests green. Write the override's reason and a removal condition ("remove when @prisma/config ≥ x") in the PR.</p>
<p><strong>🕵️ Hacker corner — CVE-2025-54782.</strong> In August 2025 <code>@nestjs/devtools-integration</code> ≤ 0.2.0 let any website a developer visited run code on their machine (CSRF to sandbox escape, GHSA-85cg-cmq5-qjm7). It is a dev-time package: keep such packages in devDependencies, never enable them by default, and update them like production code — the developer's laptop holds the production secrets.</p>

<h3>4. Upgrading Nest 11 → 12 on a real project</h3>
<p>Copy of the Nest 11.1.6 CommonJS + Jest project from 8.4, 4 e2e tests green. Step 1, see the distance:</p>
<pre><code class="language-text">${esc(OUT_OUTDATED)}</code></pre>
<p>Step 2, upgrade <em>all</em> <code>@nestjs/*</code> runtime packages together to the same version (the packages are released together and expect the same version — check with <code>npm ls @nestjs/core</code> that only one copy is installed). Upgrading the CLI then failed:</p>
<pre><code class="language-text">${esc(OUT_ERESOLVE)}</code></pre>
<p>Nest CLI 12 needs TypeScript ≥ 6. TypeScript 6 changed defaults, which showed up in two runs (build, then Jest):</p>
<pre><code class="language-text">${esc(OUT_TS6)}</code></pre>
<p>Fix in <code>tsconfig.json</code>: remove <code>baseUrl</code>, set <code>"strict": false</code> explicitly to keep the old behaviour (turn strict flags on later, one PR each), and <code>"types": ["node", "jest"]</code> because TS 6 no longer includes every <code>@types</code> package automatically. Build green. Jest on Node 22:</p>
<pre><code class="language-text">${esc(OUT_J22)}</code></pre>
<p>Jest's message says "Use Node v24.9+". On Node 24.22.3:</p>
<pre><code class="language-text">${esc(OUT_J24)}</code></pre>
<p>Still red. Reading <code>jest-runtime</code>: it uses <code>require(esm)</code> only if <code>vm.SourceTextModule.prototype.hasAsyncGraph</code> exists — and <code>vm.SourceTextModule</code> exists only with <code>--experimental-vm-modules</code>:</p>
<pre><code class="language-text">${esc(OUT_J24CO)}</code></pre>
<p>4/4 green (the warning is the test from 8.x that forgets <code>app.close()</code> on purpose). Node 22 with the same flag still fails — <code>hasAsyncGraph</code> is Node 24.9+. So the real requirement for Nest 12 + Jest is Node ≥ 24.9 <em>and</em> <code>NODE_OPTIONS=--experimental-vm-modules</code>, or move to Vitest (8.4).</p>

<h3>🧪 Exercise (20 min)</h3>
<ol>
<li>lab-booking needs a faster <code>GET /rooms/:id/availability</code>. List, in order, what you would measure and try before switching to Fastify.</li>
<li>Add caching to <code>GET /rooms</code> (public) safely for two replicas. What is the cache key, where is it stored, when is it cleared?</li>
<li>A scanner reports a critical CVE in a package you do not recognise. Write the four questions you answer before changing anything.</li>
</ol>
<details><summary>Show answers</summary>
<ol>
<li>Measure the route's time split (log timing, 5.x), read the query plan (missing index? N+1? — prisma-orm course), cache the result if it can be slightly stale, then reduce per-request work (global interceptors, serialization). Switch the adapter only if the framework overhead is a measured, significant share.</li>
<li>Key: the URL (public, same for everyone) — fine here. Store: Redis via <code>@keyv/redis</code> 5.1.6 so both replicas share it. Clear: delete the key in <code>RoomsService.create/update/remove</code>, plus a TTL (e.g. 60 s) as a safety net. Apply with <code>@UseInterceptors(CacheInterceptor)</code> on that handler only.</li>
<li>(1) Which path pulls it in (<code>npm ls &lt;pkg&gt;</code>) — dev only or runtime? (2) Is the vulnerable function reachable with attacker input? (3) What does the fix require — patch release, override, or a major upgrade of the parent? (4) How will CI prove the fix did not break anything?</li>
</ol>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Express or Fastify for Nest?</strong> Fastify has less overhead (measured 4–6× on a trivial route), but in a DB-bound API that is a fraction of a millisecond; Express has the bigger middleware ecosystem. Measure first.</li>
<li><strong>What is dangerous about <code>CacheInterceptor</code>?</strong> The default key is the URL; on authenticated routes one user's response is served to another. Cache public GETs only, or key by user, and use a shared store across replicas.</li>
<li><strong><code>npm audit</code> reports high severity in a transitive dependency — what do you do?</strong> Trace the path, check reachability and whether it ships to production, prefer a patch/override over <code>--force</code>, prove with CI.</li>
<li><strong>How do you upgrade a framework major?</strong> One major at a time, all related packages together, read the migration guide, fix config defaults, keep tests green between steps.</li>
</ol>

<h3>💼 On the job</h3>
<p>Upgrade and audit tickets are often given to new team members because they look simple. They are a chance to show method: a branch per step, the <code>npm outdated</code>/<code>npm audit</code> output before and after in the PR, the exact errors you hit (like the Jest flag above) and how you verified. Teams remember the person whose upgrade did not break production.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Platform adapter</span><span class="v">The HTTP library under Nest: <code>platform-express</code> (default) or <code>platform-fastify</code>.</span></div>
  <div class="kv"><span class="k">trackBy</span><span class="v">CacheInterceptor method that returns the cache key; <code>undefined</code> means "do not cache".</span></div>
  <div class="kv"><span class="k">Transitive dependency</span><span class="v">A package you did not install directly, pulled in by one you did.</span></div>
  <div class="kv"><span class="k">overrides</span><span class="v"><code>package.json</code> field forcing a version for a transitive dependency.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">A regular expression that takes exponential time on crafted input.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured: Express ~8k, Fastify ~37–47k req/s on static JSON; the real DB-bound route ~2k req/s — fix queries and caching first.</li>
<li>Global <code>CacheInterceptor</code> served <code>an</code>'s bookings to <code>binh</code>; cache public GETs only, shared store, invalidate on write.</li>
<li>Advisory in <code>effect</code> via <code>prisma</code>: <code>--force</code> downgrades Prisma; an override to 3.22.5 is clean and CI stays green.</li>
<li>Nest 11 → 12: all <code>@nestjs/*</code> together, CLI needs TS 6 (new defaults), Jest needs Node ≥ 24.9 + <code>--experimental-vm-modules</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>11.4 — Bốn việc bảo trì, việc nào cũng đo: đổi adapter, thêm cache, xử lý khuyến cáo bảo mật, nâng bản lớn</h2>
<p class="lead">Khi API đã chạy production, công việc chuyển sang bảo trì: "nhanh hơn được không?", "cache cái này được không?", "máy quét báo mức high", "Nest 12 ra rồi". Việc nào cũng có lối tắt hấp dẫn mà sai. Bài này đo từng việc trên dự án lab trước khi quyết.</p>

<h3>Liên hệ đời thường: bảo dưỡng xe máy</h3>
<p>Thay ống xả xịn chẳng giúp gì khi lốp đang xẹp; thợ giỏi đo trước rồi mới thay đồ. Đổi hãng dầu chỉ vì tờ rơi ghi "nguy cơ cao" mà không đọc lý do là cách làm hỏng máy. Ở đây cũng vậy: đo thời gian đi đâu, đọc khuyến cáo thật sự ảnh hưởng tới đâu, nâng từng bản lớn một và giữ test xanh.</p>

<h3>1. Express so với Fastify — và vì sao hiếm khi là việc sửa đầu tiên</h3>
<p><code>b114</code> trả cùng một JSON tĩnh (20 phòng) bằng cả hai adapter, có và không có pipe + guard + interceptor toàn cục (<code>DAY=1</code>), autocannon 50 kết nối trong 10 giây, hai lượt, trên máy đang tải ~8:</p>
<pre><code class="language-text">${esc(OUT_DO)}</code></pre>
<p>Fastify nhanh gấp 4–6 lần trên một route chẳng làm gì. Giờ đến route thật <code>GET /rooms</code> của lab-booking qua nginx, có PostgreSQL và throttler Redis (11.5): khoảng 16.000 request trong 8 giây ≈ 2.000 req/s chia cho hai tiến trình API ≈ 1.000 req/s mỗi tiến trình, tức chừng 1 ms việc cho mỗi request. Phần của riêng Express ≈ 1/8.000 giây = 0,12 ms, của Fastify ≈ 0,025 ms. Đổi adapter tiết kiệm chừng 0,1 ms trong ~1 ms — đáng với proxy và endpoint cực nóng, không đáng trước khi đã sửa truy vấn (khoá prisma-orm) và cache.</p>
<p>Cái giá của việc đổi trong lab-booking, tìm bằng <code>grep</code>: <code>app.set('trust proxy')</code> và <code>useBodyParser</code> trong <code>setup-app.ts</code>, middleware <code>TatEm</code> viết theo kiểu Express, kiểu <code>NestExpressApplication</code>, đối tượng request <code>@types/express</code> trong guard, phần cài pino-http/Socket.IO. Thứ nào cũng có bản tương đương cho Fastify, nhưng đó là một đợt chuyển đổi với lượt test riêng, không phải sửa một dòng.</p>

<h3>2. CacheInterceptor: vụ lộ dữ liệu xảy ra theo mặc định</h3>
<pre><code class="language-ts">${esc(MA_B114)}</code></pre>
<p>Với <code>CACHE=1</code> (một <code>CacheInterceptor</code> toàn cục, đoạn mã ngắn nhất trong tài liệu) và một route phụ thuộc vào người đang gọi:</p>
<pre><code class="language-text">${esc(OUT_LO)}</code></pre>
<p>User <code>binh</code> nhận lịch riêng của <code>an</code>: khoá cache mặc định là URL, mà URL thì ai cũng như nhau. Ở lab-booking, danh tính nằm trong header <code>Authorization</code>, nên <code>GET /bookings/mine</code> sẽ lộ y như vậy. Với <code>CACHE=2</code> (<code>trackBy</code> trả <code>undefined</code> khi request có danh tính):</p>
<pre><code class="language-text">${esc(OUT_SUA)}</code></pre>
<p>Luật: không bao giờ đăng ký <code>CacheInterceptor</code> toàn cục trên API có xác thực; chỉ gắn lên route công khai (<code>@UseInterceptors(CacheInterceptor)</code>); nhiều bản thì dùng kho chung (<code>@keyv/redis</code> — chú ý: bản 6 cần keyv 6 trong khi cache-manager 7.2.9 cần keyv 5, nên <code>@keyv/redis@5.1.6</code> mới cài được); xoá cache khi ghi, hoặc chấp nhận dữ liệu cũ trong một TTL và ghi rõ ra.</p>

<h3>3. npm audit: đọc đường đi trước khi "sửa"</h3>
<p>CI in "3 high severity vulnerabilities" ở bài 11.3:</p>
<pre><code class="language-text">${esc(OUT_AUDIT)}</code></pre>
<p>Khuyến cáo (GHSA-7589-6fvf-x4pw, công bố 19/11/2026) là một lỗi ReDoS trong <code>effect</code> ≤ 3.22.0, chỉ đi vào dự án qua <code>prisma</code> → <code>@prisma/config</code>, gói này ghim <code>effect</code> đúng 3.20.0. Ba sự thật quyết định cách xử lý:</p>
<ul>
<li><code>npm audit fix --force</code> sẽ <em>hạ</em> Prisma 7 xuống 6.12.0 — một thay đổi phá vỡ để sửa một công cụ dev.</li>
<li><code>npm audit --omit=dev</code> vẫn báo, vì <code>prisma</code> là devOptional (11.1). Nhưng ảnh runtime dựng với <code>--omit=optional</code> hoàn toàn không có <code>effect</code> — mã đó không có mặt ở production.</li>
<li>Hàm dính lỗi phân tích template literal của schema; CLI chạy nó trên cấu hình của chính bạn, không phải trên dữ liệu người dùng gửi.</li>
</ul>
<p>Vậy rủi ro thấp, nhưng máy quét đỏ hoài thì cả đội quen lờ nó đi. Cách sửa sạch là override lên bản vá cùng nhánh:</p>
<pre><code class="language-json">${esc(MA_OVR)}</code></pre>
<pre><code class="language-text">${esc(OUT_AUDIT_SAU)}</code></pre>
<p>Rồi bằng chứng override không làm hỏng Prisma: job <code>e2e</code> của CI từ một lượt <code>npm ci</code> sạch (lockfile có effect 3.22.5) đã chạy <code>prisma generate</code>, <code>migrate deploy</code> và đủ 46 test db, xanh. Ghi lý do override và điều kiện gỡ ("gỡ khi @prisma/config ≥ x") vào PR.</p>
<p><strong>🕵️ Góc hacker — CVE-2025-54782.</strong> Tháng 8/2025, <code>@nestjs/devtools-integration</code> ≤ 0.2.0 cho phép bất kỳ trang web nào lập trình viên ghé qua chạy mã trên máy họ (CSRF tới thoát sandbox, GHSA-85cg-cmq5-qjm7). Đó là gói chỉ dùng lúc phát triển: giữ những gói như vậy ở devDependencies, không bật mặc định, và cập nhật chúng như mã production — laptop của lập trình viên đang giữ bí mật production.</p>

<h3>4. Nâng Nest 11 → 12 trên một dự án thật</h3>
<p>Bản sao của dự án Nest 11.1.6 CommonJS + Jest ở bài 8.4, 4 test e2e xanh. Bước 1, xem khoảng cách:</p>
<pre><code class="language-text">${esc(OUT_OUTDATED)}</code></pre>
<p>Bước 2, nâng <em>mọi</em> gói <code>@nestjs/*</code> lúc chạy cùng lúc lên cùng một phiên bản (các gói được phát hành cùng nhau và cần cùng phiên bản — kiểm bằng <code>npm ls @nestjs/core</code> rằng chỉ có một bản được cài). Nâng CLI thì hỏng:</p>
<pre><code class="language-text">${esc(OUT_ERESOLVE)}</code></pre>
<p>Nest CLI 12 cần TypeScript ≥ 6. TypeScript 6 đổi giá trị mặc định, lộ ra qua hai lượt chạy (build, rồi Jest):</p>
<pre><code class="language-text">${esc(OUT_TS6)}</code></pre>
<p>Sửa trong <code>tsconfig.json</code>: bỏ <code>baseUrl</code>, đặt rõ <code>"strict": false</code> để giữ hành vi cũ (bật các cờ strict sau, mỗi cờ một PR), và <code>"types": ["node", "jest"]</code> vì TS 6 không còn tự gộp mọi gói <code>@types</code>. Build xanh. Jest trên Node 22:</p>
<pre><code class="language-text">${esc(OUT_J22)}</code></pre>
<p>Thông báo của Jest ghi "Use Node v24.9+". Trên Node 24.22.3:</p>
<pre><code class="language-text">${esc(OUT_J24)}</code></pre>
<p>Vẫn đỏ. Đọc mã <code>jest-runtime</code>: nó chỉ dùng <code>require(esm)</code> khi có <code>vm.SourceTextModule.prototype.hasAsyncGraph</code> — mà <code>vm.SourceTextModule</code> chỉ tồn tại khi bật <code>--experimental-vm-modules</code>:</p>
<pre><code class="language-text">${esc(OUT_J24CO)}</code></pre>
<p>4/4 xanh (dòng cảnh báo là test ở 8.x cố tình quên <code>app.close()</code>). Node 22 bật cùng cờ vẫn đỏ — <code>hasAsyncGraph</code> chỉ có từ Node 24.9. Vậy điều kiện thật của Nest 12 + Jest là Node ≥ 24.9 <em>và</em> <code>NODE_OPTIONS=--experimental-vm-modules</code>, hoặc chuyển sang Vitest (8.4).</p>

<h3>🧪 Thực hành (20 phút)</h3>
<ol>
<li>lab-booking cần <code>GET /rooms/:id/availability</code> nhanh hơn. Liệt kê theo thứ tự những gì bạn đo và thử trước khi đổi sang Fastify.</li>
<li>Thêm cache cho <code>GET /rooms</code> (công khai) sao cho an toàn với hai bản. Khoá cache là gì, lưu ở đâu, xoá khi nào?</li>
<li>Máy quét báo một CVE critical ở gói bạn không nhận ra. Viết bốn câu hỏi bạn trả lời trước khi đổi bất cứ thứ gì.</li>
</ol>
<details><summary>Xem đáp án</summary>
<ol>
<li>Đo thời gian của route chia cho từng phần (log thời gian, 5.x), đọc kế hoạch truy vấn (thiếu index? N+1? — khoá prisma-orm), cache kết quả nếu chấp nhận hơi cũ, rồi giảm việc mỗi request (interceptor toàn cục, serialize). Chỉ đổi adapter khi phần của framework là một tỉ lệ đáng kể đã đo được.</li>
<li>Khoá: URL (công khai, ai cũng như nhau) — ổn ở đây. Kho: Redis qua <code>@keyv/redis</code> 5.1.6 để hai bản dùng chung. Xoá: xoá khoá trong <code>RoomsService.create/update/remove</code>, thêm TTL (ví dụ 60 giây) làm lưới an toàn. Chỉ gắn <code>@UseInterceptors(CacheInterceptor)</code> lên đúng handler đó.</li>
<li>(1) Đường nào kéo nó vào (<code>npm ls &lt;gói&gt;</code>) — chỉ dev hay có ở runtime? (2) Hàm dính lỗi có bị dữ liệu của kẻ tấn công chạm tới không? (3) Bản sửa đòi gì — bản vá, override, hay nâng bản lớn của gói cha? (4) CI sẽ chứng minh bản sửa không làm hỏng gì bằng cách nào?</li>
</ol>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Nest nên dùng Express hay Fastify?</strong> Fastify tốn ít hơn (đo được 4–6 lần trên route rỗng), nhưng với API phụ thuộc DB thì đó chỉ là một phần nhỏ của mili giây; Express có hệ middleware lớn hơn. Đo trước.</li>
<li><strong><code>CacheInterceptor</code> nguy hiểm ở đâu?</strong> Khoá mặc định là URL; trên route có xác thực, phản hồi của người này bị trả cho người khác. Chỉ cache GET công khai, hoặc khoá theo user, và dùng kho chung giữa các bản.</li>
<li><strong><code>npm audit</code> báo high ở phụ thuộc bắc cầu — bạn làm gì?</strong> Lần theo đường đi, kiểm có bị chạm tới không và có lên production không, ưu tiên bản vá/override hơn <code>--force</code>, chứng minh bằng CI.</li>
<li><strong>Nâng bản lớn của framework thế nào?</strong> Mỗi lần một bản lớn, các gói liên quan cùng lúc, đọc hướng dẫn chuyển đổi, sửa mặc định cấu hình, giữ test xanh giữa các bước.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ticket nâng cấp và audit hay được giao cho người mới vì trông đơn giản. Đó là dịp thể hiện phương pháp: mỗi bước một nhánh, output <code>npm outdated</code>/<code>npm audit</code> trước và sau trong PR, đúng những lỗi bạn gặp (như cờ Jest ở trên) và cách bạn kiểm chứng. Đội sẽ nhớ người có đợt nâng cấp không làm sập production.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Platform adapter</span><span class="v">Thư viện HTTP nằm dưới Nest: <code>platform-express</code> (mặc định) hoặc <code>platform-fastify</code>.</span></div>
  <div class="kv"><span class="k">trackBy</span><span class="v">Phương thức của CacheInterceptor trả khoá cache; <code>undefined</code> nghĩa là "không cache".</span></div>
  <div class="kv"><span class="k">Phụ thuộc bắc cầu</span><span class="v">Gói bạn không cài trực tiếp, do một gói bạn cài kéo vào.</span></div>
  <div class="kv"><span class="k">overrides</span><span class="v">Trường trong <code>package.json</code> ép phiên bản cho phụ thuộc bắc cầu.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Biểu thức chính quy chạy mất thời gian luỹ thừa với dữ liệu được dựng sẵn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo được: Express ~8 nghìn, Fastify ~37–47 nghìn req/s với JSON tĩnh; route thật phụ thuộc DB ~2 nghìn req/s — sửa truy vấn và cache trước.</li>
<li><code>CacheInterceptor</code> toàn cục đã trả lịch của <code>an</code> cho <code>binh</code>; chỉ cache GET công khai, kho chung, xoá khi ghi.</li>
<li>Khuyến cáo ở <code>effect</code> qua <code>prisma</code>: <code>--force</code> hạ Prisma; override lên 3.22.5 thì sạch và CI vẫn xanh.</li>
<li>Nest 11 → 12: mọi <code>@nestjs/*</code> cùng lúc, CLI cần TS 6 (mặc định mới), Jest cần Node ≥ 24.9 + <code>--experimental-vm-modules</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
