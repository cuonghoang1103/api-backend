/**
 * 4.4 — OpenAPI với @nestjs/swagger (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node 22, Nest 12.6.0, @nestjs/swagger 12.1.2) — lab/c4/a44: nest build KHÔNG plugin ⇒ schema DTO
 * rỗng {"properties":{}}; CÓ plugin (introspectComments, classValidatorShim) ⇒ đủ trường, required, min/max, pattern, enum, mô tả từ
 * chú thích JSDoc, summary từ chú thích phương thức; @IsInt vẫn ra "number"; ApiHideProperty ẩn internalNote; PartialType bản swagger
 * ⇒ required null; URI versioning /v1 /v2; NODE_ENV=production ⇒ /docs 404. Máy nhà: openapi-typescript 7.13.0 (peer typescript ^5 ⇒
 * không cài chung dự án TS 6, chạy bằng npx riêng) sinh api.d.ts; tsc 6 bắt 2 lỗi gọi sai của frontend.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-7-1-openapi', title: 'API Design 7.1 — Viết OpenAPI 3.1', sub: 'Đọc và viết tay hợp đồng OpenAPI từ số 0 (design-first).', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-7-2-sinh-code', title: 'API Design 7.3 — Sinh tài liệu, client có kiểu và bộ validate từ một tệp', sub: 'openapi-typescript, client sinh tự động, kiểm hợp đồng.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — OpenAPI: Introduction', 'DocumentBuilder, SwaggerModule.setup, /docs-json.', 'https://docs.nestjs.com/openapi/introduction'),
  nguon('📘', 'NestJS Docs — OpenAPI: CLI Plugin', 'introspectComments, classValidatorShim; chỉ chạy qua nest build.', 'https://docs.nestjs.com/openapi/cli-plugin'),
  nguon('📘', 'NestJS Docs — Versioning', 'URI, header, media type; @Version trên route.', 'https://docs.nestjs.com/techniques/versioning'),
  nguon('📘', 'openapi-typescript', 'Sinh kiểu TypeScript từ tệp OpenAPI 3.0/3.1.', 'https://openapi-ts.dev'),
  nguon('📘', 'OWASP API9:2023 — Improper Inventory Management', 'API không có danh mục/tài liệu là API không ai quản lý được.', 'https://owasp.org/API-Security/editions/2023/en/0xa9-improper-inventory-management/'),
].join('\n');

const MA_DTO = "import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';\nimport { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';\n\nexport enum Loai { hoc = 'hoc', thi = 'thi', clb = 'clb' }\n\nexport class CreateBookingDto {\n  /** Mã phòng lab, ví dụ 1 = Lab 401 */\n  @IsInt() @Min(1) roomId: number;\n  /** Mã số sinh viên */\n  @Matches(/^SE\\d{6}$/) studentId: string;\n  /** Giờ bắt đầu, ISO 8601 có múi giờ */\n  @IsISO8601({ strict: true }) start: string;\n  @IsISO8601({ strict: true }) end: string;\n  @IsInt() @Min(1) @Max(40) attendees: number;\n  @IsEnum(Loai) loai: Loai;\n  @IsOptional() @IsString() @Length(0, 200) note?: string;\n}\nexport class UpdateBookingDto extends PartialType(CreateBookingDto) {}\n\nexport class BookingResponse {\n  id: string;\n  roomId: number;\n  start: string;\n  end: string;\n  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'REJECTED'] }) status: string;\n  @ApiHideProperty() internalNote?: string;\n}";
const MA_CTL = "import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Version } from '@nestjs/common';\nimport { ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';\nimport { BookingResponse, CreateBookingDto, UpdateBookingDto } from './booking.dto.js';\n\n@ApiTags('bookings')\n@ApiBearerAuth()\n@Controller({ path: 'bookings', version: '1' })\nexport class BookingsController {\n  /** Đặt một khung giờ phòng lab (chờ duyệt) */\n  @Post() create(@Body() dto: CreateBookingDto): BookingResponse {\n    return { id: '9b2f6c3e-8a41-4d6e-b0c2-1f3a5d7e9c10', roomId: dto.roomId, start: dto.start, end: dto.end, status: 'PENDING' };\n  }\n  @ApiOperation({ summary: 'Xem một lượt đặt' })\n  @ApiNotFoundResponse({ description: 'Không có lượt đặt này' })\n  @Get(':id') one(@Param('id', ParseUUIDPipe) id: string): BookingResponse { throw new NotFoundException(id); }\n  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBookingDto): BookingResponse { throw new NotFoundException(id); }\n  /** Bản 2: trả thêm số người */\n  @Version('2') @Get(':id') oneV2(@Param('id', ParseUUIDPipe) id: string): BookingResponse { throw new NotFoundException(id); }\n}";
const MA_MAIN = "import 'reflect-metadata';\nimport { Module, ValidationPipe, VersioningType } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { writeFileSync } from 'node:fs';\nimport { BookingsController } from './bookings.controller.js';\n\n@Module({ controllers: [BookingsController] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\napp.enableVersioning({ type: VersioningType.URI });                 // /v1/…, /v2/…\napp.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));\nif (process.env.NODE_ENV !== 'production') {\n  const config = new DocumentBuilder().setTitle('Lab Booking API').setVersion('1.0').addBearerAuth().build();\n  const doc = SwaggerModule.createDocument(app, config);\n  SwaggerModule.setup('docs', app, doc);                              // /docs (giao diện) + /docs-json\n  writeFileSync('openapi.json', JSON.stringify(doc, null, 2));\n}\nawait app.listen(3000);";
const NESTCLI = "{\n  \"$schema\": \"https://json.schemastore.org/nest-cli\",\n  \"collection\": \"@nestjs/schematics\",\n  \"sourceRoot\": \"src\",\n  \"compilerOptions\": {\n    \"deleteOutDir\": true,\n    \"plugins\": [{ \"name\": \"@nestjs/swagger\", \"options\": { \"introspectComments\": true, \"classValidatorShim\": true } }]\n  }\n}";
const OUT_A = "$ curl -s localhost:3000/docs -o /dev/null -w '%{http_code} %{content_type}\\n'\n200 text/html; charset=utf-8\n$ curl -s localhost:3000/docs-json | jq -c \".paths | keys\"\n[\"/v1/bookings\",\"/v1/bookings/{id}\",\"/v2/bookings/{id}\"]\n$ curl -s localhost:3000/docs-json | jq -c \".components.schemas.CreateBookingDto\"\n{\"type\":\"object\",\"properties\":{}}\n$ curl -s localhost:3000/docs-json | jq -c \".paths[\\\"/v1/bookings\\\"].post | {summary, requestBody, responses, security}\"\n{\"summary\":null,\"requestBody\":{\"required\":true,\"content\":{\"application/json\":{\"schema\":{\"$ref\":\"#/components/schemas/CreateBookingDto\"}}}},\"responses\":{\"201\":{\"description\":\"\"}},\"security\":[{\"bearer\":[]}]}";
const OUT_B = "$ curl -s localhost:3000/docs -o /dev/null -w '%{http_code} %{content_type}\\n'\n200 text/html; charset=utf-8\n$ curl -s localhost:3000/docs-json | jq -c \".paths | keys\"\n[\"/v1/bookings\",\"/v1/bookings/{id}\",\"/v2/bookings/{id}\"]\n$ curl -s localhost:3000/docs-json | jq -c \".components.schemas.CreateBookingDto\"\n{\"type\":\"object\",\"properties\":{\"roomId\":{\"type\":\"number\",\"description\":\"Mã phòng lab, ví dụ 1 = Lab 401\",\"minimum\":1},\"studentId\":{\"type\":\"string\",\"description\":\"Mã số sinh viên\",\"pattern\":\"^SE\\\\d{6}$\"},\"start\":{\"type\":\"string\",\"description\":\"Giờ bắt đầu, ISO 8601 có múi giờ\"},\"end\":{\"type\":\"string\"},\"attendees\":{\"type\":\"number\",\"minimum\":1,\"maximum\":40},\"loai\":{\"type\":\"string\",\"enum\":[\"hoc\",\"thi\",\"clb\"]},\"note\":{\"type\":\"string\",\"minLength\":0,\"maxLength\":200}},\"required\":[\"roomId\",\"studentId\",\"start\",\"end\",\"attendees\",\"loai\"]}\n$ curl -s localhost:3000/docs-json | jq -c \".paths[\\\"/v1/bookings\\\"].post | {summary, requestBody, responses, security}\"\n{\"summary\":\"Đặt một khung giờ phòng lab (chờ duyệt)\",\"requestBody\":{\"required\":true,\"content\":{\"application/json\":{\"schema\":{\"$ref\":\"#/components/schemas/CreateBookingDto\"}}}},\"responses\":{\"201\":{\"description\":\"\",\"content\":{\"application/json\":{\"schema\":{\"$ref\":\"#/components/schemas/BookingResponse\"}}}}},\"security\":[{\"bearer\":[]}]}";
const OUT_C = "$ curl -s localhost:3000/docs-json | jq -c \".components.schemas.BookingResponse\"\n{\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"PENDING\",\"APPROVED\",\"REJECTED\"]},\"id\":{\"type\":\"string\"},\"roomId\":{\"type\":\"number\"},\"start\":{\"type\":\"string\"},\"end\":{\"type\":\"string\"}},\"required\":[\"status\",\"id\",\"roomId\",\"start\",\"end\"]}\n$ curl -s localhost:3000/docs-json | jq -c \".components.schemas.UpdateBookingDto.required\"\nnull\n$ curl -s -XPOST localhost:3000/v1/bookings -H 'content-type: application/json' -d '{\"roomId\":1}' | jq -c .\n{\"message\":[\"studentId must match /^SE\\\\d{6}$/ regular expression\",\"start must be a valid ISO 8601 date string\",\"end must be a valid ISO 8601 date string\",\"attendees must not be greater than 40\",\"attendees must not be less than 1\",\"attendees must be an integer number\",\"loai must be one of the following values: hoc, thi, clb\"],\"error\":\"Bad Request\",\"statusCode\":400}\n$ NODE_ENV=production node dist/main.js  # rồi:\n$ curl -s localhost:3000/docs -o /dev/null -w '%{http_code}\\n'\n404";
const MA_CLIENT = "import type { components } from './api.js';\ntype CreateBooking = components['schemas']['CreateBookingDto'];\n\nexport async function datPhong(b: CreateBooking) {\n  const r = await fetch('/v1/bookings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) });\n  return (await r.json()) as components['schemas']['BookingResponse'];\n}\n// Frontend gõ sai — trình biên dịch bắt TRƯỚC khi chạy\ndatPhong({ roomId: 1, studentId: 'SE170001', start: '2027-01-05T07:30:00+07:00', end: '2027-01-05T09:30:00+07:00', attendees: 20, loai: 'tiec' });\ndatPhong({ roomId: '1', studentId: 'SE170001', start: '', end: '', attendees: 20, loai: 'hoc' });";
const OUT_CLIENT = "dat.ts(9,131): error TS2322: Type '\"tiec\"' is not assignable to type '\"hoc\" | \"thi\" | \"clb\"'.\ndat.ts(10,12): error TS2322: Type 'string' is not assignable to type 'number'.";
const MA_TYPES = "CreateBookingDto: {\n            /** @description Mã phòng lab, ví dụ 1 = Lab 401 */\n            roomId: number;\n            /** @description Mã số sinh viên */\n            studentId: string;\n            /** @description Giờ bắt đầu, ISO 8601 có múi giờ */\n            start: string;\n            end: string;\n            attendees: number;\n            /** @enum {string} */\n            loai: \"hoc\" | \"thi\" | \"clb\";\n            note?: string;\n        };";

export default {
  title: '4.4 — OpenAPI with @nestjs/swagger: CLI plugin, decorators, auth, versioning|||4.4 — OpenAPI với @nestjs/swagger: plugin CLI, decorator, xác thực, versioning',
  slug: 'nst-4-4-openapi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tài liệu API sinh từ chính DTO và controller. Chạy thật: không plugin thì schema DTO rỗng; bật plugin CLI thì đủ trường, required, min/max, pattern, enum, mô tả lấy từ chú thích. Thêm ApiBearerAuth, ApiHideProperty, URI versioning /v1 /v2, tắt /docs ở production (404). Sinh kiểu TypeScript bằng openapi-typescript (bẫy peer TypeScript 5) và để tsc bắt lỗi gọi sai của frontend. Bàn: có nên tắt docs ở production?',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>4.4 — Documentation that cannot drift from the code</h2>
<p class="lead">A Word file describing the API is out of date the day after it is written. OpenAPI is a machine-readable contract (JSON/YAML); <code>@nestjs/swagger</code> generates it from the controllers and DTOs you already have, serves an interactive page at <code>/docs</code>, and the frontend can generate typed clients from it. The DTOs of Lessons 4.1–4.3 become the documentation — if you switch on the one setting most tutorials forget.</p>

<h3>Everyday analogy: the menu printed from the kitchen's recipe system</h3>
<p>A hand-written menu says "spring rolls, 30k" long after the price changed. A menu printed each morning from the kitchen's recipe system is always right, lists allergens because recipes record them, and the delivery app imports it automatically. OpenAPI generated from DTOs is that printed menu.</p>

<h3>Setup — one controller, two versions, auth</h3>
<p>Install <code>@nestjs/swagger</code> (12.1.2 here; peer of Nest 12). DTOs use plain class-validator rules plus JSDoc comments; mapped types now come from <code>@nestjs/swagger</code>:</p>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>

<h3>Without the CLI plugin: empty schemas</h3>
<div class="out">$ nest build &amp;&amp; node dist/main.js   # nest-cli.json chưa có plugin
${esc(OUT_A)}</div>
<p>The page works, paths and versions are right, the bearer lock is there — but <code>CreateBookingDto</code> is <code>{"properties":{}}</code>. Swagger cannot see TypeScript property types at runtime; without help, every field needs a hand-written <code>@ApiProperty()</code>, which duplicates the validation rules and drifts.</p>

<h3>With the CLI plugin: the DTO is the documentation</h3>
<pre><code class="language-json">${esc(NESTCLI)}</code></pre>
<div class="out">$ nest build &amp;&amp; node dist/main.js
${esc(OUT_B)}</div>
<p>The plugin is a TypeScript transformer that runs during <code>nest build</code>: it reads property types and optionality (<code>note?</code> is not in <code>required</code>), turns class-validator rules into schema rules (<code>@Min(1)</code> → <code>minimum</code>, <code>@Matches</code> → <code>pattern</code>, <code>@IsEnum</code> → <code>enum</code>), copies JSDoc comments into <code>description</code>, and the method comment into <code>summary</code>; return types become response schemas. Three details from the output:</p>
<ul>
<li><code>@IsInt()</code> still shows <code>"type":"number"</code>. If clients care (generated Java/C# clients use <code>int</code> vs <code>double</code>), add <code>@ApiProperty({ type: 'integer' })</code>.</li>
<li>The plugin runs only through the Nest CLI build. Plain <code>tsc</code>, <code>ts-node</code> or a test runner do not apply it — a test that inspects the generated document needs the same plugin configured for the test build, or should run against the built app.</li>
<li><code>start</code> and <code>end</code> have no <code>format</code>: our custom ISO rule means nothing to the plugin. Add <code>@ApiProperty({ format: 'date-time', example: '…' })</code> where the format matters.</li>
</ul>
<div class="out">${esc(OUT_C)}</div>
<p><code>@ApiHideProperty()</code> removed <code>internalNote</code> from <code>BookingResponse</code>; <code>PartialType</code> from <code>@nestjs/swagger</code> made every field optional (<code>required: null</code>); the 400 shows validation and docs agree, because they read the same decorators. With <code>NODE_ENV=production</code> the docs route is not registered at all: 404.</p>

<h3>Versioning in one line</h3>
<p><code>app.enableVersioning({ type: VersioningType.URI })</code> plus <code>version: '1'</code> on the controller gave <code>/v1/bookings</code>; <code>@Version('2')</code> on one method added <code>/v2/bookings/{id}</code> while the rest stays on v1. Header- and media-type versioning exist too; URI is the easiest to see in logs and docs. Version when you must break a contract (rename a field, change a type) — additive changes (a new optional field) do not need a new version.</p>

<h3>The frontend side: types generated from the contract</h3>
<div class="out">$ npx -y openapi-typescript@7 openapi.json -o api.d.ts
✨ openapi-typescript 7.13.0
🚀 openapi.json → api.d.ts [33.6ms]</div>
<pre><code class="language-ts">${esc(MA_TYPES)}</code></pre>
<pre><code class="language-ts">${esc(MA_CLIENT)}</code></pre>
<div class="out">$ tsc -p .
${esc(OUT_CLIENT)}</div>
<p>The frontend's mistakes — an enum value that does not exist, a string id — fail at compile time, before any request. A real snag we hit: <code>npm install -D openapi-typescript</code> inside the Nest 12 project failed with <code>ERESOLVE … peer typescript@"^5.x"</code>, because the project uses TypeScript 6. Running it with <code>npx</code> in a separate folder (or in the frontend repo) avoids forcing peers. In CI, regenerate the file and fail the build if it differs from the committed one — then a backend change that breaks the contract is visible in the pull request.</p>

<h3>Should <code>/docs</code> be off in production?</h3>
<p>Turning it off is common and reasonable for internal APIs, but it is not a security control: every endpoint is still reachable, and attackers find them from the frontend bundle anyway. What actually matters: (1) every endpoint is protected by guards regardless of documentation; (2) the published document does not list internal/admin endpoints you have not meant to expose (use <code>@ApiExcludeController()</code> or a separate document); (3) someone owns the inventory — OWASP API9:2023 lists forgotten, undocumented endpoints (old versions, debug routes) as a top risk. Many teams therefore publish the spec behind company SSO or ship the JSON with the frontend instead of hiding it.</p>

<h3>🧪 Exercise (15 min)</h3>
<p>Add to the project: <code>@ApiProperty({ format: 'date-time', example: '2027-01-05T07:30:00+07:00' })</code> on <code>start</code>/<code>end</code>, <code>@ApiProperty({ type: 'integer' })</code> on <code>attendees</code>, and an <code>@ApiConflictResponse</code> on create. Rebuild, then check with <code>curl -s localhost:3000/docs-json | jq '.components.schemas.CreateBookingDto.properties.start'</code> that the format and example appear.</p>
<details><summary>Show solution</summary>
<div class="out">$ curl -s localhost:3000/docs-json | jq -c '.components.schemas.CreateBookingDto.properties | {start, attendees}'
{"start":{"type":"string","description":"Giờ bắt đầu, ISO 8601 có múi giờ","format":"date-time","example":"2027-01-05T07:30:00+07:00"},"attendees":{"type":"integer","minimum":1,"maximum":40}}
$ curl -s localhost:3000/docs-json | jq -c '.paths["/v1/bookings"].post.responses | keys'
["201","409"]</div>
<p>The JSDoc description survived: <code>@ApiProperty()</code> merges with what the plugin inferred — you only write the extra keys. <code>@ApiConflictResponse({ description: 'Trùng lịch' })</code> adds a 409 entry to that operation's <code>responses</code>.</p>
</details>

<h3>💼 On the job</h3>
<p>In outsourcing, the OpenAPI file is often a <em>deliverable</em>: the customer's frontend team (or another vendor) builds against it, and acceptance tests are written from it. A generated, always-current <code>/docs-json</code> plus a CI check that it changed only on purpose saves many "the API does not match the document" meetings.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OpenAPI</span><span class="v">Machine-readable description of an HTTP API: paths, parameters, schemas, auth.</span></div>
  <div class="kv"><span class="k">CLI plugin</span><span class="v">TypeScript transformer in <code>nest build</code> that writes schema metadata from DTO types, validators and comments.</span></div>
  <div class="kv"><span class="k">DocumentBuilder / SwaggerModule</span><span class="v">Build the document; serve <code>/docs</code> (UI) and <code>/docs-json</code>.</span></div>
  <div class="kv"><span class="k">URI versioning</span><span class="v"><code>/v1/…</code>, <code>/v2/…</code> chosen per controller or per route with <code>@Version</code>.</span></div>
  <div class="kv"><span class="k">openapi-typescript</span><span class="v">Generates TypeScript types from the document for typed clients.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Enable the <code>@nestjs/swagger</code> CLI plugin; without it DTO schemas are empty.</li>
<li>The plugin reads types, optionality, class-validator rules and JSDoc; add <code>@ApiProperty</code> only for extras (integer, format, example).</li>
<li>Use mapped types from <code>@nestjs/swagger</code> so derived DTOs keep their docs.</li>
<li>Version with URI when a contract must break; additive changes do not need a version.</li>
<li>Generate frontend types from <code>/docs-json</code>; hiding <code>/docs</code> is not security — guards and an endpoint inventory are.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>4.4 — Tài liệu không thể lệch khỏi mã</h2>
<p class="lead">Tệp Word mô tả API lỗi thời ngay hôm sau khi viết. OpenAPI là hợp đồng máy đọc được (JSON/YAML); <code>@nestjs/swagger</code> sinh nó từ chính controller và DTO bạn đang có, phục vụ một trang tương tác ở <code>/docs</code>, và frontend sinh được client có kiểu từ đó. DTO của Bài 4.1–4.3 trở thành tài liệu — nếu bạn bật đúng một thiết lập mà phần lớn bài hướng dẫn quên mất.</p>

<h3>Liên hệ đời thường: thực đơn in từ hệ thống công thức của bếp</h3>
<p>Thực đơn viết tay vẫn ghi "chả giò, 30 nghìn" rất lâu sau khi giá đã đổi. Thực đơn in mỗi sáng từ hệ thống công thức của bếp thì luôn đúng, có ghi chất gây dị ứng vì công thức đã ghi, và ứng dụng giao đồ ăn tự nhập vào. OpenAPI sinh từ DTO chính là tờ thực đơn in đó.</p>

<h3>Dựng — một controller, hai phiên bản, có xác thực</h3>
<p>Cài <code>@nestjs/swagger</code> (ở đây 12.1.2; đi cặp với Nest 12). DTO chỉ dùng luật class-validator thường cộng chú thích JSDoc; mapped types giờ nhập từ <code>@nestjs/swagger</code>:</p>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>

<h3>Không có plugin CLI: schema rỗng</h3>
<div class="out">$ nest build &amp;&amp; node dist/main.js   # nest-cli.json chưa có plugin
${esc(OUT_A)}</div>
<p>Trang chạy, đường dẫn và phiên bản đúng, ổ khoá bearer có đủ — nhưng <code>CreateBookingDto</code> là <code>{"properties":{}}</code>. Lúc chạy, Swagger không nhìn thấy kiểu thuộc tính TypeScript; không ai giúp thì trường nào cũng cần một dòng <code>@ApiProperty()</code> viết tay, lặp lại luật kiểm và dần lệch đi.</p>

<h3>Có plugin CLI: DTO chính là tài liệu</h3>
<pre><code class="language-json">${esc(NESTCLI)}</code></pre>
<div class="out">$ nest build &amp;&amp; node dist/main.js
${esc(OUT_B)}</div>
<p>Plugin là một bộ biến đổi TypeScript chạy trong lúc <code>nest build</code>: nó đọc kiểu và tính bắt buộc của thuộc tính (<code>note?</code> không nằm trong <code>required</code>), đổi luật class-validator thành luật schema (<code>@Min(1)</code> → <code>minimum</code>, <code>@Matches</code> → <code>pattern</code>, <code>@IsEnum</code> → <code>enum</code>), chép chú thích JSDoc vào <code>description</code> và chú thích phương thức vào <code>summary</code>; kiểu trả về thành schema phản hồi. Ba chi tiết từ output:</p>
<ul>
<li><code>@IsInt()</code> vẫn ra <code>"type":"number"</code>. Nếu client quan tâm (client Java/C# sinh tự động phân biệt <code>int</code> và <code>double</code>), thêm <code>@ApiProperty({ type: 'integer' })</code>.</li>
<li>Plugin chỉ chạy qua bước build của Nest CLI. <code>tsc</code> trần, <code>ts-node</code> hay trình chạy test không áp nó — test nào soi tài liệu sinh ra thì cần cấu hình cùng plugin cho bản build test, hoặc chạy trên ứng dụng đã build.</li>
<li><code>start</code> và <code>end</code> không có <code>format</code>: luật ISO tự viết của ta không có nghĩa gì với plugin. Thêm <code>@ApiProperty({ format: 'date-time', example: '…' })</code> ở chỗ định dạng quan trọng.</li>
</ul>
<div class="out">${esc(OUT_C)}</div>
<p><code>@ApiHideProperty()</code> đã gỡ <code>internalNote</code> khỏi <code>BookingResponse</code>; <code>PartialType</code> của <code>@nestjs/swagger</code> làm mọi trường thành không bắt buộc (<code>required: null</code>); lỗi 400 cho thấy kiểm dữ liệu và tài liệu khớp nhau, vì cùng đọc một bộ decorator. Với <code>NODE_ENV=production</code>, route tài liệu không được đăng ký: 404.</p>

<h3>Versioning trong một dòng</h3>
<p><code>app.enableVersioning({ type: VersioningType.URI })</code> cộng <code>version: '1'</code> trên controller cho ra <code>/v1/bookings</code>; <code>@Version('2')</code> trên một phương thức thêm <code>/v2/bookings/{id}</code> trong khi phần còn lại vẫn ở v1. Còn có versioning theo header và media type; URI dễ thấy nhất trong log và tài liệu. Chỉ lên phiên bản khi buộc phải phá hợp đồng (đổi tên trường, đổi kiểu) — thay đổi kiểu thêm vào (một trường tuỳ chọn mới) không cần phiên bản mới.</p>

<h3>Phía frontend: kiểu sinh từ hợp đồng</h3>
<div class="out">$ npx -y openapi-typescript@7 openapi.json -o api.d.ts
✨ openapi-typescript 7.13.0
🚀 openapi.json → api.d.ts [33.6ms]</div>
<pre><code class="language-ts">${esc(MA_TYPES)}</code></pre>
<pre><code class="language-ts">${esc(MA_CLIENT)}</code></pre>
<div class="out">$ tsc -p .
${esc(OUT_CLIENT)}</div>
<p>Lỗi của frontend — một giá trị enum không tồn tại, một id kiểu chuỗi — trượt ngay lúc biên dịch, trước khi có request nào. Một vướng mắc thật ta gặp: <code>npm install -D openapi-typescript</code> trong dự án Nest 12 hỏng với <code>ERESOLVE … peer typescript@"^5.x"</code>, vì dự án dùng TypeScript 6. Chạy bằng <code>npx</code> ở thư mục riêng (hoặc trong repo frontend) thì không phải ép peer. Trong CI, sinh lại tệp và cho build trượt nếu nó khác bản đã commit — khi đó thay đổi backend làm vỡ hợp đồng sẽ hiện ngay trong pull request.</p>

<h3>Có nên tắt <code>/docs</code> ở production?</h3>
<p>Tắt là chuyện phổ biến và hợp lý với API nội bộ, nhưng đó không phải biện pháp bảo mật: endpoint nào vẫn gọi được, và kẻ tấn công vẫn tìm ra chúng từ bundle của frontend. Điều thực sự quan trọng: (1) mọi endpoint được guard bảo vệ, có tài liệu hay không; (2) tài liệu công bố không liệt kê endpoint nội bộ/admin bạn không định mở (dùng <code>@ApiExcludeController()</code> hoặc một tài liệu riêng); (3) có người chịu trách nhiệm danh mục — OWASP API9:2023 xếp endpoint bị quên, không tài liệu (phiên bản cũ, route debug) vào nhóm rủi ro hàng đầu. Vì vậy nhiều nhóm công bố spec sau SSO công ty, hoặc giao tệp JSON cùng frontend, thay vì giấu đi.</p>

<h3>🧪 Bài tập (15 phút)</h3>
<p>Thêm vào dự án: <code>@ApiProperty({ format: 'date-time', example: '2027-01-05T07:30:00+07:00' })</code> cho <code>start</code>/<code>end</code>, <code>@ApiProperty({ type: 'integer' })</code> cho <code>attendees</code>, và <code>@ApiConflictResponse</code> cho thao tác tạo. Build lại, rồi kiểm bằng <code>curl -s localhost:3000/docs-json | jq '.components.schemas.CreateBookingDto.properties.start'</code> rằng format và example đã hiện.</p>
<details><summary>Xem lời giải</summary>
<div class="out">$ curl -s localhost:3000/docs-json | jq -c '.components.schemas.CreateBookingDto.properties | {start, attendees}'
{"start":{"type":"string","description":"Giờ bắt đầu, ISO 8601 có múi giờ","format":"date-time","example":"2027-01-05T07:30:00+07:00"},"attendees":{"type":"integer","minimum":1,"maximum":40}}
$ curl -s localhost:3000/docs-json | jq -c '.paths["/v1/bookings"].post.responses | keys'
["201","409"]</div>
<p>Mô tả từ JSDoc vẫn còn: <code>@ApiProperty()</code> được gộp với thứ plugin đã suy ra — bạn chỉ viết các khoá thêm. <code>@ApiConflictResponse({ description: 'Trùng lịch' })</code> thêm mục 409 vào <code>responses</code> của thao tác đó.</p>
</details>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, tệp OpenAPI thường là một <em>sản phẩm bàn giao</em>: nhóm frontend của khách (hoặc một nhà cung cấp khác) làm theo nó, và test nghiệm thu được viết từ nó. Một <code>/docs-json</code> sinh tự động, luôn mới, cộng một bước CI kiểm nó chỉ đổi khi có chủ đích, tiết kiệm rất nhiều buổi họp "API không khớp tài liệu".</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OpenAPI</span><span class="v">Mô tả API HTTP mà máy đọc được: đường dẫn, tham số, schema, xác thực.</span></div>
  <div class="kv"><span class="k">Plugin CLI</span><span class="v">Bộ biến đổi TypeScript trong <code>nest build</code>, ghi metadata schema từ kiểu DTO, validator và chú thích.</span></div>
  <div class="kv"><span class="k">DocumentBuilder / SwaggerModule</span><span class="v">Dựng tài liệu; phục vụ <code>/docs</code> (giao diện) và <code>/docs-json</code>.</span></div>
  <div class="kv"><span class="k">URI versioning</span><span class="v"><code>/v1/…</code>, <code>/v2/…</code> chọn theo controller hoặc theo route bằng <code>@Version</code>.</span></div>
  <div class="kv"><span class="k">openapi-typescript</span><span class="v">Sinh kiểu TypeScript từ tài liệu để có client có kiểu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bật plugin CLI của <code>@nestjs/swagger</code>; thiếu nó schema DTO rỗng.</li>
<li>Plugin đọc kiểu, tính bắt buộc, luật class-validator và JSDoc; chỉ thêm <code>@ApiProperty</code> cho phần dư (integer, format, example).</li>
<li>Dùng mapped types của <code>@nestjs/swagger</code> để DTO dẫn xuất giữ được tài liệu.</li>
<li>Lên phiên bản bằng URI khi buộc phải phá hợp đồng; thay đổi kiểu thêm vào không cần phiên bản.</li>
<li>Sinh kiểu frontend từ <code>/docs-json</code>; giấu <code>/docs</code> không phải bảo mật — guard và danh mục endpoint mới là bảo mật.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
