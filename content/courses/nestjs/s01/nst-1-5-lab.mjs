/**
 * 1.5 — Lab: Notes API bằng Nest, đặt cạnh bản Express (khoá nestjs, soạn 24/11/2026).
 * Lời giải THẬT: scratchpad/nst/lab/c1/notes-nest (Nest 12.6.0 ESM) và notes-express (Express 5.3.0, viết lại theo hợp đồng
 * bài nodejs-5-5-notes-api). Cùng kịch bản curl kich-ban.sh chạy trong container nst-run-* (Node v22.23.5): 10/12 phản hồi giống
 * hệt, 2 dòng khác (404 route lạ và JSON hỏng — dạng lỗi mặc định của Nest; bản Express có lỗi code "INTERNAL" với 400).
 * wc -l: Express 81 dòng, Nest 93 dòng. Vitest 4.1.12 trên máy nhà (Node v22.22.2): 2 test đơn vị + 2 e2e (supertest) xanh.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-5-notes-api', title: 'Node.js 5.5 — Lắp ráp Notes API', sub: 'Bản Express gốc của lab này: cùng hợp đồng, cùng mã lỗi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây', sub: 'Chưa quen test đơn vị/e2e? Khoá Testing dạy tư duy; chương 8 khoá này dạy phần riêng của Nest.', cta: 'Mở khoá →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Testing', 'Test.createTestingModule, ghi đè provider, e2e với supertest.', 'https://docs.nestjs.com/fundamentals/testing'),
  nguon('📘', 'NestJS Docs — Exception filters', 'Body của HttpException khi truyền object; dạng lỗi mặc định.', 'https://docs.nestjs.com/exception-filters'),
].join('\n');
const MA_KB = "# kich-ban.sh — cùng một loạt curl cho cả hai bản\nc() { echo \"\\$ curl $*\"; curl -s -w '   [%{http_code}]' \"$@\" | sed 's/\"createdAt\":\"[^\"]*\"/\"createdAt\":\"…\"/g'; echo; }\nH='Content-Type: application/json'\nc -X POST localhost:3000/api/v1/notes -H \"$H\" -d '{\"title\":\"Learning Nest\",\"body\":\"chapter 1\"}'\nc -X POST localhost:3000/api/v1/notes -H \"$H\" -d '{\"title\":\"Second note\"}'\nc -X POST localhost:3000/api/v1/notes -H \"$H\" -d '{\"body\":\"no title\"}'\necho \"\\$ curl -sI -X POST …  (xem header Location)\"; curl -s -D - -o /dev/null -X POST localhost:3000/api/v1/notes -H \"$H\" -d '{\"title\":\"third\"}' | grep -i '^location'\nc \"localhost:3000/api/v1/notes?page=1&limit=2\"\nc \"localhost:3000/api/v1/notes?q=nest\"\nc localhost:3000/api/v1/notes/999\nc -X PATCH localhost:3000/api/v1/notes/1 -H \"$H\" -d '{\"body\":\"edited\"}'\nc -X DELETE localhost:3000/api/v1/notes/2\nc -X DELETE localhost:3000/api/v1/notes/2\nc localhost:3000/api/v1/khong-co\nc -X POST localhost:3000/api/v1/notes -H \"$H\" -d '{\"title\":'";
const MA_SVC = "import { Injectable } from '@nestjs/common';\n\nexport interface Note { id: number; title: string; body: string; createdAt: string }\n\n@Injectable()\nexport class NotesService {                      // không biết gì về HTTP\n  private notes = new Map<number, Note>();\n  private nextId = 1;\n\n  list({ page, limit, q }: { page: number; limit: number; q?: string }) {\n    let items = [...this.notes.values()];\n    if (q) items = items.filter((n) => n.title.toLowerCase().includes(q.toLowerCase()));\n    return { items: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length };\n  }\n  get(id: number) { return this.notes.get(id); }\n  create(d: { title: string; body: string }): Note {\n    const note = { id: this.nextId++, ...d, createdAt: new Date().toISOString() };\n    this.notes.set(note.id, note);\n    return note;\n  }\n  update(id: number, patch: Partial<Pick<Note, 'title' | 'body'>>) {\n    const note = this.notes.get(id);\n    if (note) Object.assign(note, patch);\n    return note;\n  }\n  remove(id: number) { return this.notes.delete(id); }\n}";
const MA_CTL = "import {\n  Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Res,\n  UnprocessableEntityException,\n} from '@nestjs/common';\nimport type { Response } from 'express';\nimport { NotesService } from './notes.service.js';\n\nconst loi = (code: string, message: string) => ({ error: { code, message } });\nconst khongThay = (id: string) => new NotFoundException(loi('NOTE_NOT_FOUND', `Note ${id} does not exist`));\n\n@Controller('api/v1/notes')\nexport class NotesController {\n  constructor(private readonly notes: NotesService) {}\n\n  @Get()\n  list(@Query('page') page = '1', @Query('limit') limit = '10', @Query('q') q?: string) {\n    return this.notes.list({ page: Number(page), limit: Math.min(Number(limit), 50), q });\n  }\n\n  @Get(':id')\n  get(@Param('id') id: string) {\n    const note = this.notes.get(Number(id));\n    if (!note) throw khongThay(id);\n    return note;\n  }\n\n  @Post()                                        // POST ⇒ 201 mặc định\n  create(@Body() b: { title?: unknown; body?: unknown }, @Res({ passthrough: true }) res: Response) {\n    if (typeof b?.title !== 'string' || b.title.trim() === '')\n      throw new UnprocessableEntityException(loi('VALIDATION_FAILED', 'title is required'));\n    const note = this.notes.create({ title: b.title.trim(), body: typeof b.body === 'string' ? b.body : '' });\n    res.location(`/api/v1/notes/${note.id}`);\n    return note;\n  }\n\n  @Patch(':id')\n  update(@Param('id') id: string, @Body() b: { title?: string; body?: string }) {\n    const patch = Object.fromEntries(Object.entries({ title: b?.title, body: b?.body }).filter(([, v]) => v !== undefined));\n    const note = this.notes.update(Number(id), patch);\n    if (!note) throw khongThay(id);\n    return note;\n  }\n\n  @Delete(':id')\n  @HttpCode(204)\n  remove(@Param('id') id: string) {\n    if (!this.notes.remove(Number(id))) throw khongThay(id);\n  }\n}";
const MA_MOD = "import { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module.js';\n\nconst app = await NestFactory.create(AppModule);\napp.enableShutdownHooks();                       // SIGTERM ⇒ đóng server êm (chương 11 nói kỹ)\nawait app.listen(process.env.PORT ?? 3000);\n\n// ── app.module.ts\nimport { Module } from '@nestjs/common';\nimport { NotesModule } from './notes/notes.module.js';\n\n@Module({ imports: [NotesModule] })\nexport class AppModule {}\n\n// ── notes/notes.module.ts\nimport { Module } from '@nestjs/common';\nimport { NotesController } from './notes.controller.js';\nimport { NotesService } from './notes.service.js';\n\n@Module({ controllers: [NotesController], providers: [NotesService] })\nexport class NotesModule {}";
const MA_EXP = "import { Router } from 'express';\nimport * as service from '../services/notes.service.mjs';\nimport { AppError } from '../middleware/errors.mjs';\n\nconst router = Router();\nconst khongThay = (id) => new AppError(404, 'NOTE_NOT_FOUND', `Note ${id} does not exist`);\n\nrouter.get('/', (req, res) => {\n  const page = Number(req.query.page ?? 1);\n  const limit = Math.min(Number(req.query.limit ?? 10), 50);\n  res.json(service.list({ page, limit, q: req.query.q }));\n});\nrouter.get('/:id', (req, res) => {\n  const note = service.get(Number(req.params.id));\n  if (!note) throw khongThay(req.params.id);\n  res.json(note);\n});\nrouter.post('/', (req, res) => {\n  const { title, body } = req.body ?? {};\n  if (typeof title !== 'string' || title.trim() === '')\n    throw new AppError(422, 'VALIDATION_FAILED', 'title is required');\n  const note = service.create({ title: title.trim(), body: typeof body === 'string' ? body : '' });\n  res.status(201).location(`/api/v1/notes/${note.id}`).json(note);\n});\nrouter.patch('/:id', (req, res) => {\n  const { title, body } = req.body ?? {};\n  const patch = Object.fromEntries(Object.entries({ title, body }).filter(([, v]) => v !== undefined));\n  const note = service.update(Number(req.params.id), patch);\n  if (!note) throw khongThay(req.params.id);\n  res.json(note);\n});\nrouter.delete('/:id', (req, res) => {\n  if (!service.remove(Number(req.params.id))) throw khongThay(req.params.id);\n  res.status(204).end();\n});\nexport default router;";
const MA_EXPERR = "export class AppError extends Error {\n  constructor(status, code, message) { super(message); this.status = status; this.code = code; }\n}\nexport const notFound = (req, _res, next) =>\n  next(new AppError(404, 'NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`));\nexport function errorHandler(err, _req, res, _next) {\n  const status = err.status ?? 500;\n  res.status(status).json({ error: { code: err.code ?? 'INTERNAL', message: status < 500 ? err.message : 'Internal error' } });\n}";
const OUT_NEST = "$ curl -X POST localhost:3000/api/v1/notes -H Content-Type: application/json -d {\"title\":\"Learning Nest\",\"body\":\"chapter 1\"}\n{\"id\":1,\"title\":\"Learning Nest\",\"body\":\"chapter 1\",\"createdAt\":\"…\"}   [201]\n$ curl -X POST localhost:3000/api/v1/notes -H Content-Type: application/json -d {\"title\":\"Second note\"}\n{\"id\":2,\"title\":\"Second note\",\"body\":\"\",\"createdAt\":\"…\"}   [201]\n$ curl -X POST localhost:3000/api/v1/notes -H Content-Type: application/json -d {\"body\":\"no title\"}\n{\"error\":{\"code\":\"VALIDATION_FAILED\",\"message\":\"title is required\"}}   [422]\n$ curl -sI -X POST …  (xem header Location)\nLocation: /api/v1/notes/3\r\n$ curl localhost:3000/api/v1/notes?page=1&limit=2\n{\"items\":[{\"id\":1,\"title\":\"Learning Nest\",\"body\":\"chapter 1\",\"createdAt\":\"…\"},{\"id\":2,\"title\":\"Second note\",\"body\":\"\",\"createdAt\":\"…\"}],\"page\":1,\"limit\":2,\"total\":3}   [200]\n$ curl localhost:3000/api/v1/notes?q=nest\n{\"items\":[{\"id\":1,\"title\":\"Learning Nest\",\"body\":\"chapter 1\",\"createdAt\":\"…\"}],\"page\":1,\"limit\":10,\"total\":1}   [200]\n$ curl localhost:3000/api/v1/notes/999\n{\"error\":{\"code\":\"NOTE_NOT_FOUND\",\"message\":\"Note 999 does not exist\"}}   [404]\n$ curl -X PATCH localhost:3000/api/v1/notes/1 -H Content-Type: application/json -d {\"body\":\"edited\"}\n{\"id\":1,\"title\":\"Learning Nest\",\"body\":\"edited\",\"createdAt\":\"…\"}   [200]\n$ curl -X DELETE localhost:3000/api/v1/notes/2\n   [204]\n$ curl -X DELETE localhost:3000/api/v1/notes/2\n{\"error\":{\"code\":\"NOTE_NOT_FOUND\",\"message\":\"Note 2 does not exist\"}}   [404]\n$ curl localhost:3000/api/v1/khong-co\n{\"message\":\"Cannot GET /api/v1/khong-co\",\"error\":\"Not Found\",\"statusCode\":404}   [404]\n$ curl -X POST localhost:3000/api/v1/notes -H Content-Type: application/json -d {\"title\":\n{\"message\":\"Unexpected end of JSON input\",\"error\":\"Bad Request\",\"statusCode\":400}   [400]";
const OUT_DIFF = "22c22\n< {\"error\":{\"code\":\"NOT_FOUND\",\"message\":\"Cannot GET /api/v1/khong-co\"}}   [404]\n---\n> {\"message\":\"Cannot GET /api/v1/khong-co\",\"error\":\"Not Found\",\"statusCode\":404}   [404]\n24c24\n< {\"error\":{\"code\":\"INTERNAL\",\"message\":\"Unexpected end of JSON input\"}}   [400]\n---\n> {\"message\":\"Unexpected end of JSON input\",\"error\":\"Bad Request\",\"statusCode\":400}   [400]";
const OUT_WC = "$ wc -l   # bản Express (nodejs 5.5, viết lại cho cùng hợp đồng)\n  12 src/app.mjs\n   4 src/index.mjs\n   9 src/middleware/errors.mjs\n  36 src/routes/notes.routes.mjs\n  20 src/services/notes.service.mjs\n  81 total\n$ wc -l   # bản Nest\n   5 src/app.module.ts\n   6 src/main.ts\n  49 src/notes/notes.controller.ts\n   6 src/notes/notes.module.ts\n  27 src/notes/notes.service.ts\n  93 total";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport { NotFoundException } from '@nestjs/common';\nimport { NotesController } from './notes.controller.js';\nimport { NotesService } from './notes.service.js';\n\ndescribe('NotesController', () => {\n  let controller: NotesController;\n\n  beforeEach(async () => {\n    const mod = await Test.createTestingModule({\n      controllers: [NotesController],\n      providers: [NotesService],\n    }).compile();\n    controller = mod.get(NotesController);\n  });\n\n  it('GET :id không có ⇒ NotFoundException mang mã NOTE_NOT_FOUND', () => {\n    expect(() => controller.get('999')).toThrow(NotFoundException);\n    try { controller.get('999'); } catch (e) {\n      expect((e as NotFoundException).getResponse()).toEqual({ error: { code: 'NOTE_NOT_FOUND', message: 'Note 999 does not exist' } });\n    }\n  });\n\n  it('dùng service giả thay bản thật (useValue)', async () => {\n    const mod = await Test.createTestingModule({\n      controllers: [NotesController],\n      providers: [{ provide: NotesService, useValue: { get: () => ({ id: 7, title: 'giả' }) } }],\n    }).compile();\n    expect(mod.get(NotesController).get('7')).toEqual({ id: 7, title: 'giả' });\n  });\n});";
const MA_E2E = "import { Test } from '@nestjs/testing';\nimport type { INestApplication } from '@nestjs/common';\nimport request from 'supertest';\nimport { AppModule } from '../src/app.module.js';\n\ndescribe('Notes API (e2e)', () => {\n  let app: INestApplication;\n  beforeAll(async () => {\n    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = mod.createNestApplication();\n    await app.init();                            // không listen cổng nào\n  });\n  afterAll(() => app.close());\n\n  it('POST ⇒ 201 + Location, rồi GET đọc lại được', async () => {\n    const tao = await request(app.getHttpServer()).post('/api/v1/notes').send({ title: 'e2e' }).expect(201);\n    expect(tao.headers.location).toBe(`/api/v1/notes/${tao.body.id}`);\n    await request(app.getHttpServer()).get(tao.headers.location).expect(200);\n  });\n\n  it('POST thiếu title ⇒ 422', () =>\n    request(app.getHttpServer()).post('/api/v1/notes').send({ body: 'x' }).expect(422));\n});";
const OUT_TEST = "$ npx vitest run --reporter=verbose\n RUN  v4.1.12 …/notes-nest\n ✓ src/notes/notes.controller.spec.ts > NotesController > GET :id không có ⇒ NotFoundException mang mã NOTE_NOT_FOUND 56ms\n ✓ src/notes/notes.controller.spec.ts > NotesController > dùng service giả thay bản thật (useValue) 3ms\n Test Files  1 passed (1)\n      Tests  2 passed (2)\n   Duration  450ms (transform 52ms, setup 0ms, import 234ms, tests 60ms, environment 0ms)\n$ npm run test:e2e -- --reporter=verbose\n RUN  v4.1.12 …/notes-nest\n ✓ test/notes.e2e-spec.ts > Notes API (e2e) > POST ⇒ 201 + Location, rồi GET đọc lại được 30ms\n ✓ test/notes.e2e-spec.ts > Notes API (e2e) > POST thiếu title ⇒ 422 3ms\n Test Files  1 passed (1)\n      Tests  2 passed (2)\n   Duration  520ms (transform 42ms, setup 0ms, import 279ms, tests 87ms, environment 0ms)";

export default {
  title: '1.5 — Lab: A Notes API in Nest, side by side with its Express version|||1.5 — Lab: Notes API bằng Nest, đặt cạnh bản Express',
  slug: 'nst-1-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Viết lại Notes API của khoá Node.js (bài 5.5) bằng Nest, giữ NGUYÊN hợp đồng: phân trang, tìm kiếm, 201 + Location, 422 khi thiếu title, 404 NOTE_NOT_FOUND, 204 khi xoá. Chạy cùng một kịch bản curl cho cả hai bản và diff: 10/12 phản hồi giống, 2 chỗ khác chỉ ra việc của chương 3. So số dòng (81 vs 93 — Nest không ngắn hơn), chỗ đặt logic, cách test (createTestingModule + useValue, e2e không mở cổng). Kèm 5 câu phỏng vấn của Chương 1.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab</span>
<h2>1.5 — Lab: same contract, two frameworks</h2>
<p class="lead">The best way to see what Nest adds is to build something you already built in Express and keep the contract identical. You will port the Notes API from lesson nodejs 5.5, run one curl script against both versions and diff the outputs. The differences are small and each one points at a chapter of this course.</p>

<h3>The brief (90 minutes)</h3>
<div class="callout ok">
<p>Build <code>/api/v1/notes</code> in a new Nest 12 project (in memory, no database):</p>
<table>
<thead><tr><th>Request</th><th>Must return</th></tr></thead>
<tbody>
<tr><td><code>GET /api/v1/notes?page=&amp;limit=&amp;q=</code></td><td><code>200 {items, page, limit, total}</code>; limit capped at 50; <code>q</code> filters by title, case-insensitive</td></tr>
<tr><td><code>GET /api/v1/notes/:id</code></td><td><code>200</code> note, or <code>404 {"error":{"code":"NOTE_NOT_FOUND",…}}</code></td></tr>
<tr><td><code>POST /api/v1/notes</code></td><td><code>201</code> + header <code>Location: /api/v1/notes/&lt;id&gt;</code>; missing/blank title ⇒ <code>422 VALIDATION_FAILED</code></td></tr>
<tr><td><code>PATCH /api/v1/notes/:id</code></td><td><code>200</code> updated note; only fields sent are changed; unknown id ⇒ 404</td></tr>
<tr><td><code>DELETE /api/v1/notes/:id</code></td><td><code>204</code> empty; second delete ⇒ 404</td></tr>
</tbody>
</table>
<p><strong>Rules:</strong> the service never imports anything HTTP (no exceptions, no <code>Response</code>); no <code>@Res()</code> except where you truly need it; no <code>try/catch</code> in the controller.</p>
<p><strong>Done when:</strong> the curl script below gives the same lines as the Express version except where this page says otherwise; one unit test and one e2e test pass.</p>
</div>

<h3>The test script (run it against both)</h3>
<pre><code class="language-bash">${esc(MA_KB)}</code></pre>
<p>Hints, if you are stuck: the error body is whatever object you pass to an <code>HttpException</code> subclass (<code>new NotFoundException({ error: {…} })</code>). Look back at lesson 1.3 for <code>@HttpCode</code> and passthrough.</p>

<details><summary>Show the reference solution (try first!)</summary>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p>Why <code>@Res({ passthrough: true })</code> in <code>create</code>? <code>@Header()</code> only sets fixed values; the Location depends on the new id. Passthrough lets us add one header and still return the note normally (lesson 1.3). An interceptor could do it without touching <code>res</code> — chapter 3.</p>
</details>

<h3>Results: both versions, one script</h3>
<div class="out">${esc(OUT_NEST)}</div>
<p>That is the Nest output. Now the diff against Express (<code>&lt;</code> Express, <code>&gt;</code> Nest):</p>
<div class="out">${esc(OUT_DIFF)}</div>
<ul>
<li><strong>Line 22 — unknown route.</strong> Our handlers choose the error body; a route that does not exist never reaches a handler, so Nest's built-in filter uses its default shape. Making <em>every</em> error look the same is exactly what a global exception filter is for (lesson 3.2).</li>
<li><strong>Line 24 — broken JSON.</strong> Same story on Nest's side. And look at Express: <code>"code":"INTERNAL"</code> with status 400 — the hand-written error handler did not know body-parser errors. Nobody noticed until two versions were diffed. That is the kind of bug a single, tested filter prevents.</li>
</ul>

<h3>Comparing the two codebases</h3>
<div class="out">${esc(OUT_WC)}</div>
<p>The Express version from lesson 5.5, re-typed for the same contract, for reference:</p>
<pre><code class="language-js">${esc(MA_EXP)}</code></pre>
<pre><code class="language-js">${esc(MA_EXPERR)}</code></pre>
<table>
<thead><tr><th></th><th>Express</th><th>Nest</th></tr></thead>
<tbody>
<tr><td>Lines</td><td>81</td><td>93 — Nest is <strong>not</strong> shorter</td></tr>
<tr><td>Where the wiring lives</td><td><code>app.mjs</code>: order of <code>app.use</code> matters</td><td>modules + decorators; order fixed by the lifecycle (1.4)</td></tr>
<tr><td>Who creates the service</td><td>the route file imports a module-level singleton</td><td>the container; the controller just asks in its constructor</td></tr>
<tr><td>Error handling</td><td>you write <code>AppError</code> + error middleware (and its holes)</td><td>throw built-in exceptions; one filter to customise (3.2)</td></tr>
<tr><td>Test a route without HTTP</td><td>awkward: the handler needs <code>req</code>/<code>res</code></td><td>call <code>controller.get('999')</code> directly; swap the service with <code>useValue</code></td></tr>
<tr><td>Test over HTTP</td><td><code>supertest(createApp())</code> (you had to split app/server)</td><td><code>createNestApplication()</code> + <code>init()</code>, no port</td></tr>
</tbody>
</table>
<p>The honest conclusion: on a five-route API, Nest costs a dozen lines. What you buy is that the 50th route looks like the 5th, a new teammate knows where everything goes, and tests can replace any dependency. The value grows with the size of the team and the codebase — not with the number of lines saved.</p>

<h3>Tests that come almost for free</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>The second unit test is the important one: <code>{ provide: NotesService, useValue: … }</code> replaced the real service without changing a line of the controller. That is dependency injection paying off, and the whole of chapter 2.</p>

<h3>🎤 What interviewers ask about chapter 1</h3>
<ol>
<li><strong>"What does <code>@Injectable()</code> actually do?"</strong> — It marks a class as a provider and, with <code>emitDecoratorMetadata</code>, makes TypeScript record its constructor parameter types (<code>design:paramtypes</code>), which the container reads to inject dependencies. Without any decorator, no metadata is emitted.</li>
<li><strong>"Middleware vs guard?"</strong> — Middleware runs before routing and does not know which handler will run; a guard runs after, gets an <code>ExecutionContext</code> with the handler and class, and can read metadata like required roles. Use middleware for request-wide concerns, guards for "may this request call this handler".</li>
<li><strong>"A route <code>GET /users/me</code> always returns the wrong thing. Why?"</strong> — It is declared after <code>GET /users/:id</code>; routes match in order and <code>:id</code> captured <code>"me"</code>. Declare fixed paths first; check the order in the <code>Mapped</code> log lines.</li>
<li><strong>"When would you use <code>@Res()</code>?"</strong> — For low-level work such as streaming. You lose automatic response handling (forget to send ⇒ the request hangs), result-transforming interceptors, and portability to Fastify. Prefer <code>passthrough: true</code> when you only add a header or cookie.</li>
<li><strong>"Is Nest faster than Express?"</strong> — No; with the default adapter it <em>is</em> Express plus a layer. It is chosen for structure, DI and testability. If raw throughput matters, the Fastify adapter helps (measured in 11.4).</li>
</ol>

<h3>🧪 Extra exercises</h3>
<div class="callout ok">
<ol>
<li>Add <code>GET /api/v1/notes/stats</code> returning <code>{ total, longestTitle }</code>. Where must it be declared, and why?</li>
<li>Write the missing unit test: <code>POST</code> without title throws <code>UnprocessableEntityException</code>, without starting HTTP.</li>
<li>Make the Express error handler correct for body-parser errors (hint: <code>err.type === 'entity.parse.failed'</code>), then diff again.</li>
</ol>
<details><summary>Show answer for 1</summary>
<p>Before <code>@Get(':id')</code> in the controller, otherwise <code>:id</code> captures <code>"stats"</code> and you get <code>404 Note stats does not exist</code> — the same trap as <code>users/me</code> in lesson 1.3.</p>
</details>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Same contract, two frameworks: 10 of 12 responses identical.</li>
<li>The two differences (unknown route, broken JSON) are default error shapes — fixed by one global filter in chapter 3.</li>
<li>Nest is not shorter; it is more uniform, and its pieces are replaceable in tests.</li>
<li>Services stay free of HTTP; controllers translate; exceptions replace manual status codes.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab</span>
<h2>1.5 — Lab: cùng hợp đồng, hai framework</h2>
<p class="lead">Cách tốt nhất để thấy Nest thêm được gì là dựng lại thứ bạn đã dựng bằng Express, và giữ hợp đồng y hệt. Bạn sẽ chuyển Notes API của bài nodejs 5.5 sang Nest, chạy cùng một kịch bản curl cho cả hai bản rồi so output bằng diff. Khác biệt rất nhỏ, và mỗi chỗ khác chỉ thẳng tới một chương của khoá này.</p>

<h3>Đề bài (90 phút)</h3>
<div class="callout ok">
<p>Dựng <code>/api/v1/notes</code> trong một dự án Nest 12 mới (lưu trong bộ nhớ, chưa có cơ sở dữ liệu):</p>
<table>
<thead><tr><th>Request</th><th>Phải trả</th></tr></thead>
<tbody>
<tr><td><code>GET /api/v1/notes?page=&amp;limit=&amp;q=</code></td><td><code>200 {items, page, limit, total}</code>; limit tối đa 50; <code>q</code> lọc theo title, không phân biệt hoa thường</td></tr>
<tr><td><code>GET /api/v1/notes/:id</code></td><td><code>200</code> kèm ghi chú, hoặc <code>404 {"error":{"code":"NOTE_NOT_FOUND",…}}</code></td></tr>
<tr><td><code>POST /api/v1/notes</code></td><td><code>201</code> + header <code>Location: /api/v1/notes/&lt;id&gt;</code>; thiếu hoặc rỗng title ⇒ <code>422 VALIDATION_FAILED</code></td></tr>
<tr><td><code>PATCH /api/v1/notes/:id</code></td><td><code>200</code> ghi chú đã sửa; chỉ đổi trường được gửi; id không có ⇒ 404</td></tr>
<tr><td><code>DELETE /api/v1/notes/:id</code></td><td><code>204</code> rỗng; xoá lần hai ⇒ 404</td></tr>
</tbody>
</table>
<p><strong>Luật:</strong> service không import thứ gì của HTTP (không ngoại lệ, không <code>Response</code>); không <code>@Res()</code> trừ chỗ thật sự cần; không <code>try/catch</code> trong controller.</p>
<p><strong>Đạt khi:</strong> kịch bản curl dưới đây cho các dòng giống bản Express, trừ những chỗ trang này nói rõ; có một test đơn vị và một test e2e xanh.</p>
</div>

<h3>Kịch bản kiểm (chạy cho cả hai bản)</h3>
<pre><code class="language-bash">${esc(MA_KB)}</code></pre>
<p>Gợi ý nếu bí: body lỗi chính là object bạn truyền vào lớp con của <code>HttpException</code> (<code>new NotFoundException({ error: {…} })</code>). Xem lại bài 1.3 về <code>@HttpCode</code> và passthrough.</p>

<details><summary>Xem lời giải mẫu (tự làm trước đã!)</summary>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p>Vì sao <code>create</code> dùng <code>@Res({ passthrough: true })</code>? <code>@Header()</code> chỉ đặt được giá trị cố định; Location lại phụ thuộc id mới. Passthrough cho ta thêm một header mà vẫn trả ghi chú như thường (bài 1.3). Một interceptor làm được việc này mà không đụng <code>res</code> — chương 3.</p>
</details>

<h3>Kết quả: hai bản, một kịch bản</h3>
<div class="out">${esc(OUT_NEST)}</div>
<p>Đó là output của bản Nest. Giờ so với Express (<code>&lt;</code> là Express, <code>&gt;</code> là Nest):</p>
<div class="out">${esc(OUT_DIFF)}</div>
<ul>
<li><strong>Dòng 22 — route không tồn tại.</strong> Handler của ta tự chọn body lỗi; route không tồn tại thì không bao giờ tới handler nào, nên filter dựng sẵn của Nest dùng dạng mặc định của nó. Làm cho <em>mọi</em> lỗi cùng một dạng chính là việc của exception filter toàn cục (bài 3.2).</li>
<li><strong>Dòng 24 — JSON hỏng.</strong> Phía Nest cũng vậy. Còn nhìn sang Express: <code>"code":"INTERNAL"</code> với mã 400 — bộ xử lý lỗi tự viết không biết lỗi của body-parser. Không ai để ý cho tới khi diff hai bản. Một filter duy nhất, có test, ngăn đúng loại lỗi này.</li>
</ul>

<h3>So hai bộ mã</h3>
<div class="out">${esc(OUT_WC)}</div>
<p>Bản Express của bài 5.5, gõ lại cho cùng hợp đồng, để đối chiếu:</p>
<pre><code class="language-js">${esc(MA_EXP)}</code></pre>
<pre><code class="language-js">${esc(MA_EXPERR)}</code></pre>
<table>
<thead><tr><th></th><th>Express</th><th>Nest</th></tr></thead>
<tbody>
<tr><td>Số dòng</td><td>81</td><td>93 — Nest <strong>không</strong> ngắn hơn</td></tr>
<tr><td>Chỗ nối dây</td><td><code>app.mjs</code>: thứ tự <code>app.use</code> quyết định</td><td>module + decorator; thứ tự do vòng đời cố định (1.4)</td></tr>
<tr><td>Ai tạo service</td><td>tệp route import một singleton cấp module</td><td>container; controller chỉ cần xin trong constructor</td></tr>
<tr><td>Xử lý lỗi</td><td>tự viết <code>AppError</code> + middleware lỗi (kèm lỗ hổng của nó)</td><td>ném ngoại lệ dựng sẵn; một filter để tuỳ biến (3.2)</td></tr>
<tr><td>Test route không qua HTTP</td><td>vướng: handler cần <code>req</code>/<code>res</code></td><td>gọi thẳng <code>controller.get('999')</code>; thay service bằng <code>useValue</code></td></tr>
<tr><td>Test qua HTTP</td><td><code>supertest(createApp())</code> (phải tách app/server)</td><td><code>createNestApplication()</code> + <code>init()</code>, không mở cổng</td></tr>
</tbody>
</table>
<p>Kết luận thật lòng: với API năm route, Nest tốn thêm chục dòng. Thứ bạn mua được là route thứ 50 trông giống route thứ 5, người mới vào nhóm biết ngay cái gì nằm đâu, và test thay được mọi phụ thuộc. Giá trị lớn dần theo cỡ nhóm và cỡ mã — không theo số dòng tiết kiệm.</p>

<h3>Test gần như miễn phí</h3>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Test đơn vị thứ hai mới là cái quan trọng: <code>{ provide: NotesService, useValue: … }</code> thay service thật mà không sửa dòng nào của controller. Đó là lúc dependency injection trả công, và là toàn bộ chương 2.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi gì về chương 1</h3>
<ol>
<li><strong>"<code>@Injectable()</code> thực ra làm gì?"</strong> — Đánh dấu class là provider, và cùng <code>emitDecoratorMetadata</code> khiến TypeScript ghi kiểu tham số constructor (<code>design:paramtypes</code>); container đọc danh sách đó để tiêm phụ thuộc. Không có decorator nào thì không có metadata.</li>
<li><strong>"Middleware khác guard thế nào?"</strong> — Middleware chạy trước khi chọn route, không biết handler nào sẽ chạy; guard chạy sau, nhận <code>ExecutionContext</code> có handler và class, đọc được metadata như vai trò yêu cầu. Middleware cho việc chung của mọi request, guard cho câu "request này có được gọi handler này không".</li>
<li><strong>"Route <code>GET /users/me</code> lúc nào cũng trả sai. Vì sao?"</strong> — Nó khai sau <code>GET /users/:id</code>; route khớp theo thứ tự và <code>:id</code> đã bắt <code>"me"</code>. Khai đường cố định trước; kiểm thứ tự ở các dòng log <code>Mapped</code>.</li>
<li><strong>"Khi nào bạn dùng <code>@Res()</code>?"</strong> — Cho việc cấp thấp như stream. Mất việc tự gửi phản hồi (quên gửi ⇒ request treo), mất interceptor biến đổi kết quả, mất khả năng chuyển sang Fastify. Chỉ thêm header hay cookie thì dùng <code>passthrough: true</code>.</li>
<li><strong>"Nest có nhanh hơn Express không?"</strong> — Không; với adapter mặc định, nó <em>chính là</em> Express cộng thêm một lớp. Người ta chọn Nest vì cấu trúc, DI và khả năng test. Nếu cần thông lượng thô, adapter Fastify giúp được (đo ở bài 11.4).</li>
</ol>

<h3>🧪 Bài tập thêm</h3>
<div class="callout ok">
<ol>
<li>Thêm <code>GET /api/v1/notes/stats</code> trả <code>{ total, longestTitle }</code>. Phải khai ở đâu, vì sao?</li>
<li>Viết test đơn vị còn thiếu: <code>POST</code> không có title ném <code>UnprocessableEntityException</code>, không bật HTTP.</li>
<li>Sửa bộ xử lý lỗi của bản Express cho đúng với lỗi body-parser (gợi ý: <code>err.type === 'entity.parse.failed'</code>), rồi diff lại.</li>
</ol>
<details><summary>Xem đáp án câu 1</summary>
<p>Trước <code>@Get(':id')</code> trong controller, nếu không <code>:id</code> bắt <code>"stats"</code> và bạn nhận <code>404 Note stats does not exist</code> — đúng cái bẫy <code>users/me</code> ở bài 1.3.</p>
</details>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng hợp đồng, hai framework: 10/12 phản hồi giống hệt.</li>
<li>Hai chỗ khác (route lạ, JSON hỏng) là dạng lỗi mặc định — một filter toàn cục ở chương 3 sửa cả hai.</li>
<li>Nest không ngắn hơn; nó đồng đều hơn, và các mảnh thay được khi test.</li>
<li>Service không dính HTTP; controller lo dịch; ngoại lệ thay cho tự đặt mã trạng thái.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
