/**
 * 4.2 — whitelist, forbidNonWhitelisted, transform, object lồng và mảng (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node 22, Nest 12.6.0, class-validator 0.15.1, class-transformer 0.5.1) — lab/c4/app/src/b42:
 * wl.ts (18 request: role=ADMIN lọt khi không whitelist; whitelist/transform làm MẤT email khi PATCH; exposeUnsetFields chỉ cứu khi KHÔNG
 * transform; bỏ undefined tường minh; null lọt @IsOptional; object lồng không @Type ⇒ bị lột thành {} và không kiểm; ArrayMaxSize;
 * 10.000 phần tử ⇒ 413; enableImplicitConversion biến "false" thành true), b42b/q.ts (query DTO ép kiểu tường minh), bt.ts (chặn null).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-9-bat-dau-khi-khong-co', title: 'NestJS 0.9 — Express không khuôn khổ lớn lên thành gì', sub: 'Mass assignment chạy thật và vụ GitHub 04/03/2012.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-3-owasp-api', title: 'API Design 6.3 — OWASP API Security Top 10 (2023)', sub: 'API3: phân quyền ở mức thuộc tính — gồm mass assignment.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Validation: stripping properties, transformation', 'whitelist, forbidNonWhitelisted, transform, enableImplicitConversion.', 'https://docs.nestjs.com/techniques/validation#stripping-properties'),
  nguon('📘', 'OWASP API3:2023 — Broken Object Property Level Authorization', 'Gộp "mass assignment" và "lộ dữ liệu thừa" của bản 2019.', 'https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/'),
  nguon('📘', 'Prisma Docs — Null and undefined', 'undefined nghĩa là "không động vào trường này", null là ghi null.', 'https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined'),
  nguon('📘', 'TypeScript — useDefineForClassFields', 'Từ target ES2022 trở lên, trường khai báo trong class thành thuộc tính thật mang undefined.', 'https://www.typescriptlang.org/tsconfig/#useDefineForClassFields'),
].join('\n');

const MA_42 = "import 'reflect-metadata';\nimport { Body, Controller, Get, Module, Patch, Post, Query, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { Type } from 'class-transformer';\nimport { ArrayMaxSize, IsBoolean, IsEmail, IsInt, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';\nimport { goi } from '../goi.js';\n\nclass UpdateMeDto {\n  @IsOptional() @IsString() @Length(2, 50) name?: string;\n  @IsOptional() @IsEmail() email?: string;\n}\nconst goc = () => ({ id: 7, name: 'An', email: 'an@fpt.edu.vn', role: 'STUDENT' });\nlet user = goc();\nconst sua = (dto: object) => { user = goc(); Object.assign(user, dto); return { keys: Object.keys(dto), user }; };   // kiểu \"sửa nhanh\" hay gặp\n\nclass ThietBiDto { @IsString() @Length(1, 30) ten: string; @IsInt() @Min(1) @Max(5) soLuong: number; }\nclass DatKhongTypeDto { @IsInt() roomId: number; @ValidateNested({ each: true }) thietBi: ThietBiDto[]; }\nclass DatCoTypeDto {\n  @IsInt() roomId: number;\n  @ValidateNested({ each: true }) @Type(() => ThietBiDto) @ArrayMaxSize(5) thietBi: ThietBiDto[];\n}\nclass TimDto {\n  @IsOptional() @IsInt() @Min(1) page?: number;\n  @IsOptional() @IsBoolean() conTrong?: boolean;\n}\n\n// Chỉ giữ trường client THỰC SỰ gửi (undefined = không gửi; null = xoá có chủ đích)\nconst boUndefined = <T extends object>(d: T) => Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined)) as Partial<T>;\nconst vp = (o: object = {}) => new ValidationPipe(o);\n@Controller()\nclass C {\n  @Patch('khong') a(@Body(vp()) d: UpdateMeDto) { return sua(d); }\n  @Patch('whitelist') b(@Body(vp({ whitelist: true })) d: UpdateMeDto) { return sua(d); }\n  @Patch('forbid') c(@Body(vp({ whitelist: true, forbidNonWhitelisted: true })) d: UpdateMeDto) { return sua(d); }\n  @Patch('transform') e(@Body(vp({ whitelist: true, transform: true })) d: UpdateMeDto) { return sua(d); }\n  @Patch('wl-expose') w(@Body(vp({ whitelist: true, transformOptions: { exposeUnsetFields: false } })) d: UpdateMeDto) { return sua(d); }\n  @Patch('tf-expose') f(@Body(vp({ whitelist: true, transform: true, transformOptions: { exposeUnsetFields: false } })) d: UpdateMeDto) { return sua(d); }\n  @Patch('map') m(@Body(vp({ whitelist: true, transform: true })) d: UpdateMeDto) { return sua(boUndefined(d)); }\n  @Post('dat-khong-type') g(@Body(vp({ whitelist: true })) d: DatKhongTypeDto) { return d; }\n  @Post('dat-co-type') h(@Body(vp({ whitelist: true, transform: true })) d: DatCoTypeDto) { return d; }\n  @Get('tim-tho') i(@Query(vp({ transform: true })) q: TimDto) { return q; }\n  @Get('tim-ngam') j(@Query(vp({ transform: true, transformOptions: { enableImplicitConversion: true } })) q: TimDto) { return { q, kieu: typeof q.page }; }\n}\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst hack = { name: 'Bình', role: 'ADMIN' };\nconst tb = (n: number) => Array.from({ length: n }, () => ({ ten: 'Arduino', soLuong: 1 }));\nawait goi([\n  ['PATCH', '/khong', hack],\n  ['PATCH', '/whitelist', hack],\n  ['PATCH', '/forbid', hack],\n  ['PATCH', '/whitelist', { name: 'Bình' }],\n  ['PATCH', '/transform', { name: 'Bình' }],\n  ['PATCH', '/wl-expose', { name: 'Bình' }],\n  ['PATCH', '/tf-expose', { name: 'Bình' }],\n  ['PATCH', '/map', { name: 'Bình' }],\n  ['PATCH', '/map', { name: 'Bình', email: null }],\n  ['POST', '/dat-khong-type', { roomId: 1, thietBi: [{ ten: '', soLuong: 999, admin: true }] }],\n  ['POST', '/dat-co-type', { roomId: 1, thietBi: [{ ten: '', soLuong: 999, admin: true }] }],\n  ['POST', '/dat-co-type', { roomId: 1, thietBi: [{ ten: 'Arduino', soLuong: 2, admin: true }] }],\n  ['POST', '/dat-co-type', { roomId: 1, thietBi: tb(10000) }],\n  ['POST', '/dat-co-type', { roomId: 1, thietBi: tb(6) }],\n  ['GET', '/tim-tho?page=2&conTrong=true'],\n  ['GET', '/tim-ngam?page=2&conTrong=true'],\n  ['GET', '/tim-ngam?page=2&conTrong=false'],\n], 22);\nawait app.close();";
const OUT_42 = "PATCH /khong           {\"name\":\"Bình\",\"role\":\"ADMIN\"}\n  → 200 {\"keys\":[\"name\",\"role\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"email\":\"an@fpt.edu.vn\",\"role\":\"ADMIN\"}}\nPATCH /whitelist       {\"name\":\"Bình\",\"role\":\"ADMIN\"}\n  → 200 {\"keys\":[\"name\",\"email\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"role\":\"STUDENT\"}}\nPATCH /forbid          {\"name\":\"Bình\",\"role\":\"ADMIN\"}\n  → 400 {\"message\":[\"property role should not exist\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPATCH /whitelist       {\"name\":\"Bình\"}\n  → 200 {\"keys\":[\"name\",\"email\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"role\":\"STUDENT\"}}\nPATCH /transform       {\"name\":\"Bình\"}\n  → 200 {\"keys\":[\"name\",\"email\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"role\":\"STUDENT\"}}\nPATCH /wl-expose       {\"name\":\"Bình\"}\n  → 200 {\"keys\":[\"name\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"email\":\"an@fpt.edu.vn\",\"role\":\"STUDENT\"}}\nPATCH /tf-expose       {\"name\":\"Bình\"}\n  → 200 {\"keys\":[\"name\",\"email\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"role\":\"STUDENT\"}}\nPATCH /map             {\"name\":\"Bình\"}\n  → 200 {\"keys\":[\"name\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"email\":\"an@fpt.edu.vn\",\"role\":\"STUDENT\"}}\nPATCH /map             {\"name\":\"Bình\",\"email\":null}\n  → 200 {\"keys\":[\"name\",\"email\"],\"user\":{\"id\":7,\"name\":\"Bình\",\"email\":null,\"role\":\"STUDENT\"}}\nPOST /dat-khong-type   {\"roomId\":1,\"thietBi\":[{\"ten\":\"\",\"soLuong\":999,\"admin\":true}]}\n  → 201 {\"roomId\":1,\"thietBi\":[{}]}\nPOST /dat-co-type      {\"roomId\":1,\"thietBi\":[{\"ten\":\"\",\"soLuong\":999,\"admin\":true}]}\n  → 400 {\"message\":[\"thietBi.0.ten must be longer than or equal to 1 characters\",\"thietBi.0.soLuong must not be greater than 5\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /dat-co-type      {\"roomId\":1,\"thietBi\":[{\"ten\":\"Arduino\",\"soLuong\":2,\"admin\":true}]}\n  → 201 {\"roomId\":1,\"thietBi\":[{\"ten\":\"Arduino\",\"soLuong\":2}]}\nPOST /dat-co-type      {\"roomId\":1,\"thietBi\":[ …10.000 phần tử {\"ten\":\"Arduino\",\"soLuong\":1} … ]}\n  → 413 {\"statusCode\":413,\"message\":\"request entity too large\"}\nPOST /dat-co-type      {\"roomId\":1,\"thietBi\":[{\"ten\":\"Arduino\",\"soLuong\":1},{\"ten\":\"Arduino\",\"soLuong\":1},{\"ten\":\"Arduino\",\"soLuong\":1},{\"ten\":\"Arduino\",\"soLuong\":1},{\"ten\":\"Arduino\",\"soLuong\":1},{\"ten\":\"Arduino\",\"soLuong\":1}]}\n  → 400 {\"message\":[\"thietBi must contain no more than 5 elements\"],\"error\":\"Bad Request\",\"statusCode\":400}\nGET /tim-tho?page=2&conTrong=true\n  → 400 {\"message\":[\"page must not be less than 1\",\"page must be an integer number\",\"conTrong must be a boolean value\"],\"error\":\"Bad Request\",\"statusCode\":400}\nGET /tim-ngam?page=2&conTrong=true\n  → 200 {\"q\":{\"page\":2,\"conTrong\":true},\"kieu\":\"number\"}\nGET /tim-ngam?page=2&conTrong=false\n  → 200 {\"q\":{\"page\":2,\"conTrong\":true},\"kieu\":\"number\"}";
const MA_Q = "import 'reflect-metadata';\nimport { Controller, Get, Module, Query, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { Transform, Type } from 'class-transformer';\nimport { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';\nimport { goi } from '../goi.js';\n\n// Query DTO an toàn: ép kiểu TƯỜNG MINH từng trường, không bật enableImplicitConversion\nclass TimDto {\n  @IsOptional() @Type(() => Number) @Max(100) @Min(1) @IsInt() page?: number;\n  @IsOptional() @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value)) @IsBoolean() conTrong?: boolean;\n}\n@Controller() class C { @Get('tim') t(@Query(new ValidationPipe({ transform: true })) q: TimDto) { return q; } }\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nawait goi([['GET', '/tim?page=2&conTrong=false'], ['GET', '/tim?page=2&conTrong=true'], ['GET', '/tim?conTrong=0'], ['GET', '/tim?page=abc']], 28);\nawait app.close();";
const OUT_Q = "GET /tim?page=2&conTrong=false\n  → 200 {\"page\":2,\"conTrong\":false}\nGET /tim?page=2&conTrong=true\n  → 200 {\"page\":2,\"conTrong\":true}\nGET /tim?conTrong=0\n  → 400 {\"message\":[\"conTrong must be a boolean value\"],\"error\":\"Bad Request\",\"statusCode\":400}\nGET /tim?page=abc\n  → 400 {\"message\":[\"page must be an integer number\",\"page must not be less than 1\",\"page must not be greater than 100\"],\"error\":\"Bad Request\",\"statusCode\":400}";
const MA_BT = "import 'reflect-metadata';\nimport { Body, Controller, Module, Patch, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { IsEmail, IsOptional, IsString, Length, ValidateIf } from 'class-validator';\nimport { goi } from '../goi.js';\n\nclass UpdateMeDto {\n  @IsOptional() @IsString() @Length(2, 50) name?: string;              // bỏ trống hoặc null đều bỏ qua kiểm\n  @ValidateIf((_o, v) => v !== undefined) @IsEmail() email?: string;   // chỉ bỏ qua khi KHÔNG gửi; null ⇒ bị kiểm ⇒ 400\n  @IsOptional() @IsString() @Length(0, 200) bio?: string | null;       // null = xoá giới thiệu (có chủ đích)\n}\n@Controller() class C {\n  @Patch('me') me(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) d: UpdateMeDto) {\n    return Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined));\n  }\n}\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nawait goi([\n  ['PATCH', '/me', { name: 'Bình' }],\n  ['PATCH', '/me', { email: null }],\n  ['PATCH', '/me', { email: 'binh@fpt.edu.vn', bio: null }],\n], 10);\nawait app.close();";
const OUT_BT = "PATCH /me  {\"name\":\"Bình\"}\n  → 200 {\"name\":\"Bình\"}\nPATCH /me  {\"email\":null}\n  → 400 {\"message\":[\"email must be an email\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPATCH /me  {\"email\":\"binh@fpt.edu.vn\",\"bio\":null}\n  → 200 {\"email\":\"binh@fpt.edu.vn\",\"bio\":null}";

export default {
  title: '4.2 — whitelist, forbidNonWhitelisted, transform, nested objects and arrays|||4.2 — whitelist, forbidNonWhitelisted, transform, object lồng và mảng',
  slug: 'nst-4-2-whitelist-transform',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba tuỳ chọn quyết định thứ gì tới được handler. Chạy thật 18 request: thiếu whitelist thì role=ADMIN lọt vào (mass assignment); có whitelist thì PATCH làm mất email vì trường không gửi thành undefined — exposeUnsetFields chỉ cứu khi không transform; null lọt qua @IsOptional; object lồng thiếu @Type bị lột thành {} mà không kiểm; 10.000 phần tử gặp 413; enableImplicitConversion biến "false" thành true. Cách sửa chạy được cho từng bẫy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>4.2 — What actually reaches your handler</h2>
<p class="lead">Lesson 4.1 checked that the fields you declared are correct. This lesson is about everything else: fields you did <em>not</em> declare, fields the client did not send, <code>null</code>, objects inside objects, very large arrays, and query strings. Three options — <code>whitelist</code>, <code>forbidNonWhitelisted</code>, <code>transform</code> — decide what your handler receives, and each one has a trap we hit for real.</p>

<h3>Everyday analogy: the bank teller and the extra line</h3>
<p>You fill a withdrawal slip and, under the amount, add a line "also make me branch manager". A careless teller processes the whole slip. A careful one either crosses out the extra line (<code>whitelist</code>) or hands the slip back (<code>forbidNonWhitelisted</code>). But a teller who, while copying the slip, writes "blank" over every box you left empty has just erased your address — that is the PATCH trap below.</p>

<h3>Experiment — 18 requests, one option at a time</h3>
<p>A "quick" update handler that does <code>Object.assign(user, dto)</code> — common in tutorials and in real code — plus nested and query DTOs:</p>
<pre><code class="language-ts">${esc(MA_42)}</code></pre>
<div class="out">${esc(OUT_42)}</div>
<p><code>keys</code> is <code>Object.keys(dto)</code>: what the handler really received, including properties whose value is <code>undefined</code> (JSON hides them).</p>

<h4>1. No whitelist: mass assignment</h4>
<p><code>/khong</code>: the client added <code>"role":"ADMIN"</code> and became admin. Validation passed because every <em>declared</em> field was valid — undeclared fields are simply not checked. This is the bug behind the GitHub incident of 4 March 2012 (Lesson 0.9) and part of OWASP API3:2023. <code>whitelist: true</code> removes undeclared fields; <code>forbidNonWhitelisted: true</code> rejects the request with <code>property role should not exist</code>. Prefer rejecting: the client learns it is sending something wrong, and an attacker's probe leaves a 400 in your logs.</p>

<h4>2. whitelist alone: the PATCH that erases data</h4>
<p>Look at <code>/whitelist</code> with only <code>{"name":"Bình"}</code>: <code>keys</code> is <code>["name","email"]</code> and the user's <strong>email is gone</strong>. Same with <code>transform: true</code>. Why: with target ES2022 or later, TypeScript emits declared class fields as real properties (<code>useDefineForClassFields</code>), so a fresh <code>UpdateMeDto</code> instance has <code>email: undefined</code>. The pipe builds that instance; <code>Object.assign</code> copies the <code>undefined</code> over the stored email. With a database this is silent data loss on every partial update.</p>

<h4>3. <code>exposeUnsetFields: false</code> helps only without transform</h4>
<p>Lesson 0.9 fixed this with <code>transformOptions: { exposeUnsetFields: false }</code> — and <code>/wl-expose</code> confirms it: <code>keys: ["name"]</code>, email kept. That works because, without <code>transform</code>, the pipe returns <code>classToPlain(instance)</code>, and that option drops unset fields. But <code>/tf-expose</code> (the same option <em>plus</em> <code>transform: true</code>, which almost every project enables) still erases the email: the handler now receives the instance itself, and the instance has the <code>undefined</code> fields. The reliable fix does not depend on pipe options: <strong>copy only fields the client actually sent</strong>. <code>/map</code> filters out <code>undefined</code> and keeps the email. Two related facts: Prisma treats <code>undefined</code> in <code>update</code> data as "leave this column alone" (so <code>prisma.user.update({ data: dto })</code> does not erase), and mapping fields explicitly in the service, one by one, is the most readable fix of all (Mốc 4 does that).</p>

<h4>4. <code>null</code> passes <code>@IsOptional()</code></h4>
<p><code>/map</code> with <code>"email": null</code> stored <code>email: null</code>. <code>@IsOptional()</code> skips validation for both <code>undefined</code> <em>and</em> <code>null</code>. For a column that must not be empty, that is a bug; the exercise fixes it.</p>

<h4>5. Nested objects need <code>@Type</code></h4>
<p><code>/dat-khong-type</code> sent <code>{"ten":"","soLuong":999,"admin":true}</code> inside <code>thietBi</code> and got <strong>201</strong> with <code>thietBi: [{}]</code>. Without <code>@Type(() =&gt; ThietBiDto)</code>, class-transformer does not know the class of the inner objects, so <code>@ValidateNested</code> sees plain objects with no rules — nothing is checked — and <code>whitelist</code>, seeing no declared fields, strips everything. Invalid data accepted <em>and</em> valid data lost, with no error. With <code>@Type</code>, the inner rules run (<code>thietBi.0.soLuong must not be greater than 5</code>) and only the undeclared <code>admin</code> is stripped. Safety net: <code>forbidUnknownValues: true</code> (Nest's <code>ValidationPipe</code> leaves it off by default) makes a missing <code>@Type</code> fail loudly instead — Lab 4.5 shows it catching exactly this.</p>

<h4>6. Size limits: array and body</h4>
<p><code>@ArrayMaxSize(5)</code> rejected 6 items with a clear message. 10,000 items never reached validation: Express's JSON parser has a 100 KB default and answered <strong>413</strong>. Both limits matter — validating a 10 MB array costs CPU before you reject it. For a booking form 16 KB is plenty (<code>app.useBodyParser('json', { limit: '16kb' })</code>, Lab 4.5).</p>

<h4>7. Query strings: implicit conversion turns "false" into true</h4>
<p>Query values are always strings, so <code>/tim-tho</code> with <code>transform: true</code> still fails <code>@IsInt()</code>. The popular fix, <code>enableImplicitConversion: true</code>, converts using the declared type — and the declared type of <code>conTrong</code> is <code>Boolean</code>, so <code>Boolean("false")</code> is <strong>true</strong>: <code>?conTrong=false</code> returned <code>"conTrong":true</code>. A filter "only free rooms = false" silently means the opposite. Convert explicitly per field instead:</p>
<pre><code class="language-ts">${esc(MA_Q)}</code></pre>
<div class="out">${esc(OUT_Q)}</div>

<h3>The configuration to start every project with</h3>
<pre><code class="language-ts">{ provide: APP_PIPE, useFactory: () =&gt; new ValidationPipe({
  whitelist: true, forbidNonWhitelisted: true,   // không nhận trường lạ
  transform: true,                               // handler nhận instance DTO, có @Type/@Transform
  forbidUnknownValues: true,                     // object lồng thiếu @Type ⇒ lỗi, không lọt im
  validationError: { target: false, value: false }, // không trả lại dữ liệu người dùng trong lỗi
}) }
// và: không Object.assign DTO vào entity — chép từng trường đã gửi</code></pre>

<h3>🧪 Exercise (15 min) — "optional" but never null</h3>
<p>In <code>UpdateMeDto</code>: <code>email</code> may be omitted but must not be <code>null</code>; <code>bio</code> may be set to <code>null</code> on purpose (to clear it). Return only the fields that were sent.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>@ValidateIf((_o, v) =&gt; v !== undefined)</code> skips validation only when the field is absent; <code>null</code> is then checked by <code>@IsEmail()</code> and rejected. Deciding what <code>null</code> means per field is part of API design: here "clear" for <code>bio</code>, "not allowed" for <code>email</code>.</p>
</details>

<h3>💼 On the job</h3>
<p>"After editing my phone number, my email disappeared" is the kind of ticket that reaches an outsourcing team weeks after release, when data is already gone. Two review rules catch it: no <code>Object.assign(entity, dto)</code> or <code>{ ...entity, ...dto }</code>, and every PATCH endpoint has a test that sends one field and asserts the others are unchanged (Mốc 4 adds exactly that test).</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Client sets fields it should not (role, status, price) because input is copied wholesale.</span></div>
  <div class="kv"><span class="k">whitelist / forbidNonWhitelisted</span><span class="v">Strip undeclared fields / reject the request if any exist.</span></div>
  <div class="kv"><span class="k">transform</span><span class="v">Handler receives a DTO instance (with @Type/@Transform applied) instead of the raw object.</span></div>
  <div class="kv"><span class="k">@Type</span><span class="v">Tells class-transformer the class of nested objects; without it nested rules do not run.</span></div>
  <div class="kv"><span class="k">enableImplicitConversion</span><span class="v">Converts by declared type — Boolean("false") is true; prefer explicit @Type/@Transform.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Use <code>whitelist</code> + <code>forbidNonWhitelisted</code>: undeclared fields are rejected, not trusted.</li>
<li>DTO instances carry <code>undefined</code> for fields not sent; never <code>Object.assign</code> them into stored data — copy only what was sent.</li>
<li><code>@IsOptional()</code> also accepts <code>null</code>; use <code>@ValidateIf</code> when null is not allowed.</li>
<li>Nested DTOs need <code>@ValidateNested</code> <em>and</em> <code>@Type</code>; <code>forbidUnknownValues</code> catches the forgotten <code>@Type</code>.</li>
<li>Limit arrays and body size; convert query fields explicitly instead of implicit conversion.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>4.2 — Thứ gì thực sự tới được handler</h2>
<p class="lead">Bài 4.1 kiểm các trường bạn đã khai có đúng không. Bài này lo phần còn lại: trường bạn <em>không</em> khai, trường client không gửi, <code>null</code>, object nằm trong object, mảng rất lớn, và chuỗi query. Ba tuỳ chọn — <code>whitelist</code>, <code>forbidNonWhitelisted</code>, <code>transform</code> — quyết định handler nhận gì, và tuỳ chọn nào cũng có bẫy mà ta đã dính thật.</p>

<h3>Liên hệ đời thường: giao dịch viên và dòng ghi thêm</h3>
<p>Bạn điền phiếu rút tiền và, dưới ô số tiền, viết thêm "cho tôi làm giám đốc chi nhánh luôn". Giao dịch viên cẩu thả xử lý cả tờ. Người cẩn thận thì gạch dòng thừa (<code>whitelist</code>) hoặc trả phiếu lại (<code>forbidNonWhitelisted</code>). Nhưng người nào, khi chép phiếu, ghi chữ "trống" đè lên mọi ô bạn bỏ trống thì vừa xoá mất địa chỉ của bạn — chính là bẫy PATCH bên dưới.</p>

<h3>Thí nghiệm — 18 request, mỗi lần đổi một tuỳ chọn</h3>
<p>Một handler cập nhật "nhanh" dùng <code>Object.assign(user, dto)</code> — hay gặp trong bài hướng dẫn lẫn mã thật — cùng DTO lồng và DTO query:</p>
<pre><code class="language-ts">${esc(MA_42)}</code></pre>
<div class="out">${esc(OUT_42)}</div>
<p><code>keys</code> là <code>Object.keys(dto)</code>: thứ handler thực sự nhận, kể cả thuộc tính mang giá trị <code>undefined</code> (JSON giấu chúng đi).</p>

<h4>1. Không whitelist: mass assignment</h4>
<p><code>/khong</code>: client thêm <code>"role":"ADMIN"</code> và thành admin. Kiểm dữ liệu vẫn qua vì mọi trường <em>đã khai</em> đều hợp lệ — trường không khai đơn giản là không ai kiểm. Đây là lỗi đứng sau sự cố GitHub ngày 04/03/2012 (Bài 0.9) và là một phần của OWASP API3:2023. <code>whitelist: true</code> gỡ trường không khai; <code>forbidNonWhitelisted: true</code> từ chối request với <code>property role should not exist</code>. Nên chọn từ chối: client biết mình gửi sai, và lần dò của kẻ tấn công để lại một dòng 400 trong log.</p>

<h4>2. Chỉ whitelist: PATCH xoá mất dữ liệu</h4>
<p>Nhìn <code>/whitelist</code> với chỉ <code>{"name":"Bình"}</code>: <code>keys</code> là <code>["name","email"]</code> và <strong>email của người dùng biến mất</strong>. Với <code>transform: true</code> cũng vậy. Lý do: với target ES2022 trở lên, TypeScript sinh trường khai báo trong class thành thuộc tính thật (<code>useDefineForClassFields</code>), nên một instance <code>UpdateMeDto</code> mới tạo có sẵn <code>email: undefined</code>. Pipe dựng instance đó; <code>Object.assign</code> chép <code>undefined</code> đè lên email đã lưu. Gặp cơ sở dữ liệu thật thì mỗi lần cập nhật một phần là một lần mất dữ liệu không ai hay.</p>

<h4>3. <code>exposeUnsetFields: false</code> chỉ cứu khi không transform</h4>
<p>Bài 0.9 sửa bằng <code>transformOptions: { exposeUnsetFields: false }</code> — và <code>/wl-expose</code> xác nhận: <code>keys: ["name"]</code>, email còn nguyên. Nó đúng vì khi không có <code>transform</code>, pipe trả <code>classToPlain(instance)</code>, và tuỳ chọn đó bỏ các trường chưa đặt. Nhưng <code>/tf-expose</code> (cùng tuỳ chọn <em>cộng</em> <code>transform: true</code>, thứ hầu như dự án nào cũng bật) vẫn xoá email: lúc này handler nhận chính instance, mà instance có các trường <code>undefined</code>. Cách sửa chắc chắn không phụ thuộc tuỳ chọn của pipe: <strong>chỉ chép những trường client thực sự gửi</strong>. <code>/map</code> lọc bỏ <code>undefined</code> và giữ được email. Hai điều liên quan: Prisma hiểu <code>undefined</code> trong dữ liệu <code>update</code> là "không động vào cột này" (nên <code>prisma.user.update({ data: dto })</code> không xoá), và ánh xạ từng trường tường minh ở service là cách dễ đọc nhất (Mốc 4 làm đúng như vậy).</p>

<h4>4. <code>null</code> lọt qua <code>@IsOptional()</code></h4>
<p><code>/map</code> với <code>"email": null</code> đã lưu <code>email: null</code>. <code>@IsOptional()</code> bỏ qua kiểm cho cả <code>undefined</code> <em>lẫn</em> <code>null</code>. Với cột không được để trống, đó là lỗi; bài tập sửa nó.</p>

<h4>5. Object lồng cần <code>@Type</code></h4>
<p><code>/dat-khong-type</code> gửi <code>{"ten":"","soLuong":999,"admin":true}</code> bên trong <code>thietBi</code> và nhận <strong>201</strong> với <code>thietBi: [{}]</code>. Thiếu <code>@Type(() =&gt; ThietBiDto)</code>, class-transformer không biết class của object bên trong, nên <code>@ValidateNested</code> thấy object thường không có luật — không kiểm gì — còn <code>whitelist</code>, không thấy trường nào được khai, lột sạch. Dữ liệu sai được nhận <em>và</em> dữ liệu đúng bị mất, không một lỗi. Có <code>@Type</code> thì luật bên trong chạy (<code>thietBi.0.soLuong must not be greater than 5</code>) và chỉ trường lạ <code>admin</code> bị gỡ. Lưới an toàn: <code>forbidUnknownValues: true</code> (<code>ValidationPipe</code> của Nest mặc định tắt) làm việc quên <code>@Type</code> hỏng ồn ào — Lab 4.5 cho thấy nó bắt đúng lỗi này.</p>

<h4>6. Giới hạn kích thước: mảng và thân request</h4>
<p><code>@ArrayMaxSize(5)</code> từ chối 6 phần tử với thông báo rõ. 10.000 phần tử thì chưa tới bước kiểm: bộ đọc JSON của Express mặc định giới hạn 100 KB và trả <strong>413</strong>. Cả hai giới hạn đều cần — kiểm một mảng 10 MB tốn CPU trước khi kịp từ chối. Biểu mẫu đặt lịch thì 16 KB là dư (<code>app.useBodyParser('json', { limit: '16kb' })</code>, Lab 4.5).</p>

<h4>7. Chuỗi query: chuyển ngầm biến "false" thành true</h4>
<p>Giá trị query luôn là chuỗi, nên <code>/tim-tho</code> có <code>transform: true</code> vẫn trượt <code>@IsInt()</code>. Cách sửa phổ biến, <code>enableImplicitConversion: true</code>, chuyển theo kiểu đã khai — mà kiểu đã khai của <code>conTrong</code> là <code>Boolean</code>, nên <code>Boolean("false")</code> là <strong>true</strong>: <code>?conTrong=false</code> trả <code>"conTrong":true</code>. Bộ lọc "chỉ phòng trống = false" lặng lẽ thành nghĩa ngược lại. Hãy chuyển tường minh từng trường:</p>
<pre><code class="language-ts">${esc(MA_Q)}</code></pre>
<div class="out">${esc(OUT_Q)}</div>

<h3>Cấu hình nên có từ ngày đầu mọi dự án</h3>
<pre><code class="language-ts">{ provide: APP_PIPE, useFactory: () =&gt; new ValidationPipe({
  whitelist: true, forbidNonWhitelisted: true,   // không nhận trường lạ
  transform: true,                               // handler nhận instance DTO, có @Type/@Transform
  forbidUnknownValues: true,                     // object lồng thiếu @Type ⇒ lỗi, không lọt im
  validationError: { target: false, value: false }, // không trả lại dữ liệu người dùng trong lỗi
}) }
// và: không Object.assign DTO vào entity — chép từng trường đã gửi</code></pre>

<h3>🧪 Bài tập (15 phút) — "không bắt buộc" nhưng không được null</h3>
<p>Trong <code>UpdateMeDto</code>: <code>email</code> được bỏ trống nhưng không được là <code>null</code>; <code>bio</code> được đặt <code>null</code> có chủ đích (để xoá). Chỉ trả về các trường đã gửi.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>@ValidateIf((_o, v) =&gt; v !== undefined)</code> chỉ bỏ qua kiểm khi trường vắng mặt; <code>null</code> khi đó bị <code>@IsEmail()</code> kiểm và từ chối. Quyết định <code>null</code> nghĩa là gì cho từng trường là việc của thiết kế API: ở đây là "xoá" với <code>bio</code>, "không cho phép" với <code>email</code>.</p>
</details>

<h3>💼 Tình huống đi làm</h3>
<p>"Sửa số điện thoại xong thì mất email" là loại ticket tới tay nhóm outsourcing vài tuần sau khi phát hành, lúc dữ liệu đã mất. Hai luật review bắt được nó: không có <code>Object.assign(entity, dto)</code> hay <code>{ ...entity, ...dto }</code>, và mỗi endpoint PATCH có một test gửi một trường rồi khẳng định các trường khác không đổi (Mốc 4 thêm đúng test đó).</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Client đặt được trường không được phép (role, status, giá) vì dữ liệu vào bị chép nguyên khối.</span></div>
  <div class="kv"><span class="k">whitelist / forbidNonWhitelisted</span><span class="v">Gỡ trường không khai / từ chối request nếu có trường như vậy.</span></div>
  <div class="kv"><span class="k">transform</span><span class="v">Handler nhận instance DTO (đã áp @Type/@Transform) thay vì object thô.</span></div>
  <div class="kv"><span class="k">@Type</span><span class="v">Cho class-transformer biết class của object lồng; thiếu nó luật bên trong không chạy.</span></div>
  <div class="kv"><span class="k">enableImplicitConversion</span><span class="v">Chuyển theo kiểu đã khai — Boolean("false") là true; nên dùng @Type/@Transform tường minh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dùng <code>whitelist</code> + <code>forbidNonWhitelisted</code>: trường không khai bị từ chối, không được tin.</li>
<li>Instance DTO mang <code>undefined</code> cho trường không gửi; đừng bao giờ <code>Object.assign</code> nó vào dữ liệu đã lưu — chỉ chép thứ đã gửi.</li>
<li><code>@IsOptional()</code> nhận cả <code>null</code>; dùng <code>@ValidateIf</code> khi không cho phép null.</li>
<li>DTO lồng cần <code>@ValidateNested</code> <em>và</em> <code>@Type</code>; <code>forbidUnknownValues</code> bắt lỗi quên <code>@Type</code>.</li>
<li>Giới hạn mảng và kích thước thân request; chuyển kiểu query tường minh thay vì chuyển ngầm.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
