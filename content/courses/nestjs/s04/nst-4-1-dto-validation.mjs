/**
 * 4.1 — DTO với class-validator và ValidationPipe — và Standard Schema (Zod) ở Nest 12 (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node 22, Nest 12.6.0, class-validator 0.15.1, zod 4.6.7) — scratchpad/nst/lab/c4/app/src/b41:
 * dto.ts (13 request: không pipe ⇒ lọt hết; lỗi mảng; {} ⇒ "$value" không được thay; interface và import type ⇒ lọt im lặng;
 * stopAtFirstError; exceptionFactory theo trường; Zod qua @Body({ schema, pipes })), b41b/thutu.ts (thứ tự decorator với stopAtFirstError),
 * bt.ts (validator tự viết SauTruong).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'typescript', bai: 'typescript-13-1-boundary-zod', title: 'TypeScript 13.1 — Vấn đề tại biên & Zod', sub: 'Vì sao kiểu TypeScript không bảo vệ dữ liệu từ mạng; Zod từ số 0.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'API Design 2.2 — Kiểm dữ liệu vào ngay cửa', sub: 'Schema, object strict, 415 và 413 — nguyên tắc chung cho mọi framework.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Validation', 'ValidationPipe, tuỳ chọn whitelist/transform, Standard Schema.', 'https://docs.nestjs.com/techniques/validation'),
  nguon('📘', 'class-validator (GitHub)', 'Danh sách decorator, thông báo lỗi, $value/$constraint1, validator tự viết.', 'https://github.com/typestack/class-validator'),
  nguon('📘', 'Standard Schema', 'Giao diện chung mà Zod, Valibot, ArkType cùng cài — Nest 12 nhận thẳng.', 'https://standardschema.dev'),
].join('\n');

const MA_DTO = "import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';\n\nexport enum Loai { hoc = 'hoc', thi = 'thi', clb = 'clb' }\n\n// DTO = class: sau khi biên dịch vẫn còn, decorator của class-validator gắn luật lên từng thuộc tính\nexport class CreateBookingDto {\n  @IsInt() @Min(1) roomId: number;\n  @Matches(/^SE\\d{6}$/, { message: 'studentId phải dạng SE + 6 chữ số, ví dụ SE170001' }) studentId: string;\n  @IsEmail({}, { message: 'email không hợp lệ' }) email: string;\n  @IsString() @Length(5, 200) purpose: string;\n  @IsInt() @Min(1) @Max(40, { message: 'phòng lab tối đa $constraint1 người, bạn ghi $value' }) attendees: number;\n  @IsEnum(Loai) loai: Loai;\n  @IsOptional() @IsString() note?: string;\n}";
const MA_41 = "import 'reflect-metadata';\nimport { BadRequestException, Body, Controller, Module, Post, StandardSchemaValidationPipe, ValidationError, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { CreateBookingDto } from './booking.dto.js';\nimport type { CreateBookingDto as BookingKieu } from './booking.dto.js';   // chỉ lấy KIỂU\nimport { z } from 'zod';\nimport { goi } from '../goi.js';\n\n// Cùng hình dạng nhưng là interface: biến mất sau biên dịch\nexport interface CreateBookingInterface { roomId: number; studentId: string }\n\n// Zod — Standard Schema: Nest 12 nhận thẳng qua @Body({ schema })\nconst BookingSchema = z.object({\n  roomId: z.number().int().min(1),\n  studentId: z.string().regex(/^SE\\d{6}$/),\n  attendees: z.number().int().min(1).max(40),\n});\n\n// Lỗi theo trường cho frontend: { errors: { roomId: '…', email: '…' } }\nfunction theoTruong(errs: ValidationError[]) {\n  return new BadRequestException({ code: 'VALIDATION', errors: Object.fromEntries(errs.map((e) => [e.property, Object.values(e.constraints ?? {})[0]])) });\n}\n\n@Controller()\nclass C {\n  @Post('tho') tho(@Body() dto: CreateBookingDto) { return { nhan: dto, laDto: dto instanceof CreateBookingDto }; }\n  @Post('dto') dto(@Body(new ValidationPipe()) dto: CreateBookingDto) { return { nhan: dto, laDto: dto instanceof CreateBookingDto }; }\n  @Post('iface') iface(@Body(new ValidationPipe()) dto: CreateBookingInterface) { return { nhan: dto }; }\n  @Post('import-type') importType(@Body(new ValidationPipe()) dto: BookingKieu) { return { nhan: dto }; }\n  @Post('loi-gon') loiGon(@Body(new ValidationPipe({ stopAtFirstError: true, exceptionFactory: theoTruong })) dto: CreateBookingDto) { return dto; }\n  @Post('mot-loi') motLoi(@Body(new ValidationPipe({ stopAtFirstError: true })) dto: CreateBookingDto) { return dto; }\n  @Post('zod') zod(@Body({ schema: BookingSchema, pipes: [new StandardSchemaValidationPipe()] }) dto: z.infer<typeof BookingSchema>) { return { nhan: dto }; }\n}\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst tot = { roomId: 1, studentId: 'SE170001', email: 'an@fpt.edu.vn', purpose: 'Ôn thi PRF192', attendees: 20, loai: 'hoc' };\nconst xau = { roomId: '1', studentId: 'an', email: 'an@', purpose: 'x', attendees: 99, loai: 'tiec' };\nawait goi([\n  ['POST', '/tho', xau],\n  ['POST', '/dto', tot],\n  ['POST', '/dto', xau],\n  ['POST', '/dto', {}],\n  ['POST', '/dto', '[1,2]'],\n  ['POST', '/iface', { roomId: 'gì cũng được', hack: true }],\n  ['POST', '/mot-loi', xau],\n  ['POST', '/import-type', xau],\n  ['POST', '/loi-gon', xau],\n  ['POST', '/zod', { roomId: 1, studentId: 'SE170001', attendees: 20 }],\n  ['POST', '/zod', { roomId: '1', studentId: 'an', attendees: 99 }],\n], 14);\nawait app.close();";
const OUT_41 = "POST /tho      {\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"}\n  → 201 {\"nhan\":{\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"},\"laDto\":false}\nPOST /dto      {\"roomId\":1,\"studentId\":\"SE170001\",\"email\":\"an@fpt.edu.vn\",\"purpose\":\"Ôn thi PRF192\",\"attendees\":20,\"loai\":\"hoc\"}\n  → 201 {\"nhan\":{\"roomId\":1,\"studentId\":\"SE170001\",\"email\":\"an@fpt.edu.vn\",\"purpose\":\"Ôn thi PRF192\",\"attendees\":20,\"loai\":\"hoc\"},\"laDto\":false}\nPOST /dto      {\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"}\n  → 400 {\"message\":[\"roomId must not be less than 1\",\"roomId must be an integer number\",\"studentId phải dạng SE + 6 chữ số, ví dụ SE170001\",\"email không hợp lệ\",\"purpose must be longer than or equal to 5 characters\",\"phòng lab tối đa 40 người, bạn ghi 99\",\"loai must be one of the following values: hoc, thi, clb\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /dto      {}\n  → 400 {\"message\":[\"roomId must not be less than 1\",\"roomId must be an integer number\",\"studentId phải dạng SE + 6 chữ số, ví dụ SE170001\",\"email không hợp lệ\",\"purpose must be longer than or equal to 5 characters\",\"purpose must be a string\",\"phòng lab tối đa 40 người, bạn ghi $value\",\"attendees must not be less than 1\",\"attendees must be an integer number\",\"loai must be one of the following values: hoc, thi, clb\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /dto      [1,2]\n  → 400 {\"message\":[\"roomId must not be less than 1\",\"roomId must be an integer number\",\"studentId phải dạng SE + 6 chữ số, ví dụ SE170001\",\"email không hợp lệ\",\"purpose must be longer than or equal to 5 characters\",\"purpose must be a string\",\"phòng lab tối đa 40 người, bạn ghi $value\",\"attendees must not be less than 1\",\"attendees must be an integer number\",\"loai must be one of the following values: hoc, thi, clb\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /iface    {\"roomId\":\"gì cũng được\",\"hack\":true}\n  → 201 {\"nhan\":{\"roomId\":\"gì cũng được\",\"hack\":true}}\nPOST /mot-loi  {\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"}\n  → 400 {\"message\":[\"roomId must not be less than 1\",\"studentId phải dạng SE + 6 chữ số, ví dụ SE170001\",\"email không hợp lệ\",\"purpose must be longer than or equal to 5 characters\",\"phòng lab tối đa 40 người, bạn ghi 99\",\"loai must be one of the following values: hoc, thi, clb\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /import-type {\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"}\n  → 201 {\"nhan\":{\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"}}\nPOST /loi-gon  {\"roomId\":\"1\",\"studentId\":\"an\",\"email\":\"an@\",\"purpose\":\"x\",\"attendees\":99,\"loai\":\"tiec\"}\n  → 400 {\"code\":\"VALIDATION\",\"errors\":{\"roomId\":\"roomId must not be less than 1\",\"studentId\":\"studentId phải dạng SE + 6 chữ số, ví dụ SE170001\",\"email\":\"email không hợp lệ\",\"purpose\":\"purpose must be longer than or equal to 5 characters\",\"attendees\":\"phòng lab tối đa 40 người, bạn ghi 99\",\"loai\":\"loai must be one of the following values: hoc, thi, clb\"}}\nPOST /zod      {\"roomId\":1,\"studentId\":\"SE170001\",\"attendees\":20}\n  → 201 {\"nhan\":{\"roomId\":1,\"studentId\":\"SE170001\",\"attendees\":20}}\nPOST /zod      {\"roomId\":\"1\",\"studentId\":\"an\",\"attendees\":99}\n  → 400 {\"message\":[\"roomId: Invalid input: expected number, received string\",\"studentId: Invalid string: must match pattern /^SE\\\\d{6}$/\",\"attendees: Too big: expected number to be <=40\"],\"error\":\"Bad Request\",\"statusCode\":400}";
const MA_THUTU = "import 'reflect-metadata';\nimport { IsInt, Min, validate } from 'class-validator';\nclass A { @IsInt() @Min(1) roomId: unknown; }\nclass B { @Min(1) @IsInt() roomId: unknown; }\nfor (const K of [A, B]) {\n  const o = Object.assign(new K(), { roomId: '1' });\n  const e = await validate(o, { stopAtFirstError: true });\n  console.log(K.name, JSON.stringify(e[0].constraints));\n}";
const OUT_THUTU = "A {\"min\":\"roomId must not be less than 1\"}\nB {\"isInt\":\"roomId must be an integer number\"}";
const MA_BT = "import 'reflect-metadata';\nimport { Body, Controller, Module, Post, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { IsISO8601, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';\nimport { goi } from '../goi.js';\n\n// Validator tự viết: giá trị phải SAU trường `ten` (so ngày giờ), tối đa `toiDaPhut` phút\nexport function SauTruong(ten: string, toiDaPhut: number, opts?: ValidationOptions) {\n  return (obj: object, prop: string) =>\n    registerDecorator({\n      name: 'sauTruong', target: obj.constructor, propertyName: prop, constraints: [ten, toiDaPhut], options: opts,\n      validator: {\n        validate(v: unknown, a: ValidationArguments) {\n          const truoc = Date.parse((a.object as Record<string, string>)[a.constraints[0]]);\n          const sau = Date.parse(String(v));\n          if (Number.isNaN(truoc) || Number.isNaN(sau)) return false;\n          return sau > truoc && sau - truoc <= a.constraints[1] * 60_000;\n        },\n        defaultMessage: (a: ValidationArguments) => `${a.property} phải sau ${a.constraints[0]} và không quá ${a.constraints[1]} phút`,\n      },\n    });\n}\n\nclass KhungGioDto {\n  @IsISO8601({ strict: true }) start: string;\n  @IsISO8601({ strict: true }) @SauTruong('start', 240) end: string;\n}\n@Controller() class C { @Post('khung') k(@Body(new ValidationPipe()) d: KhungGioDto) { return d; } }\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nconst d = (s: string, e: string) => ({ start: `2027-01-05T${s}:00+07:00`, end: `2027-01-05T${e}:00+07:00` });\nawait goi([\n  ['POST', '/khung', d('07:30', '09:30')],\n  ['POST', '/khung', d('09:30', '07:30')],\n  ['POST', '/khung', d('07:00', '13:00')],\n  ['POST', '/khung', { start: '2027-02-30T07:00:00+07:00', end: '2027-02-30T08:00:00+07:00' }],\n], 12);\nawait app.close();";
const OUT_BT = "POST /khung  {\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\"}\n  → 201 {\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\"}\nPOST /khung  {\"start\":\"2027-01-05T09:30:00+07:00\",\"end\":\"2027-01-05T07:30:00+07:00\"}\n  → 400 {\"message\":[\"end phải sau start và không quá 240 phút\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /khung  {\"start\":\"2027-01-05T07:00:00+07:00\",\"end\":\"2027-01-05T13:00:00+07:00\"}\n  → 400 {\"message\":[\"end phải sau start và không quá 240 phút\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPOST /khung  {\"start\":\"2027-02-30T07:00:00+07:00\",\"end\":\"2027-02-30T08:00:00+07:00\"}\n  → 400 {\"message\":[\"start must be a valid ISO 8601 date string\",\"end must be a valid ISO 8601 date string\"],\"error\":\"Bad Request\",\"statusCode\":400}";

export default {
  title: '4.1 — DTOs with class-validator and ValidationPipe — and Standard Schema (Zod) in Nest 12|||4.1 — DTO với class-validator và ValidationPipe — và Standard Schema (Zod) ở Nest 12',
  slug: 'nst-4-1-dto-validation',
  type: 'LESSON',
  isFreePreview: true,
  description: 'DTO là class mô tả đúng thứ client được gửi; ValidationPipe đọc decorator của class-validator và trả 400 có danh sách lỗi. Chạy thật 13 request: không pipe thì mọi thứ lọt qua; DTO là interface hoặc import type cũng lọt im lặng; "$value" không được thay khi trường vắng; với stopAtFirstError, decorator sát tên chạy trước; exceptionFactory trả lỗi theo trường; Zod qua @Body({ schema }) của Nest 12. Bài tập: validator tự viết "end sau start".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>4.1 — DTOs: write down exactly what a client may send</h2>
<p class="lead">Chapter 3 showed pipes on single values. A request body is a whole object from a stranger: it may be missing fields, have the wrong types, carry extra fields, or be an array. A <strong>DTO</strong> (data transfer object) is a class that describes the allowed shape; <code>ValidationPipe</code> reads the rules attached to it and rejects the request with a 400 before your handler runs. This lesson builds the habit and shows five ways it silently fails.</p>

<h3>Everyday analogy: the printed application form</h3>
<p>A blank sheet of paper lets the applicant write anything; a printed form has labelled boxes, "date (dd/mm/yyyy)", "max 40 people", and the clerk returns it if a box is wrong. The DTO is the form, the decorators are the printed rules, <code>ValidationPipe</code> is the clerk. And just like a form, it only works if the clerk actually receives the form — not a photocopy of its outline (that is the interface trap below).</p>

<h3>Why a class and not an interface?</h3>
<p>TypeScript types are erased at compile time. A class survives: it exists at runtime, decorators can attach metadata to its properties, and <code>emitDecoratorMetadata</code> records the class as the parameter type of your handler (<code>design:paramtypes</code>, Lesson 1.1). <code>ValidationPipe</code> uses that recorded type to know which rules to apply. No class at runtime ⇒ no rules ⇒ no validation.</p>

<h3>Experiment — one DTO, 13 requests</h3>
<p>The DTO, with Vietnamese messages for two rules (placeholders <code>$constraint1</code>, <code>$value</code>):</p>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<p>The app: one route without a pipe, one with <code>ValidationPipe</code>, one where the parameter type is an interface, one where it is the same class imported with <code>import type</code>, two option variants, and a Zod schema:</p>
<pre><code class="language-ts">${esc(MA_41)}</code></pre>
<div class="out">${esc(OUT_41)}</div>

<h4>1. Without a pipe, the DTO is decoration</h4>
<p><code>/tho</code> accepted <code>roomId: "1"</code>, an invalid email and 99 attendees with 201. Declaring <code>dto: CreateBookingDto</code> does nothing on its own. Also note <code>laDto: false</code> even on the validated route: without <code>transform: true</code> the handler receives a plain object, not a class instance — Lesson 4.2 is about this.</p>

<h4>2. The error shape: an array of sentences, sometimes two per field</h4>
<p>The default response is <code>{ message: string[], error, statusCode: 400 }</code>. A field can produce several messages (<code>roomId must not be less than 1</code> <em>and</em> <code>must be an integer number</code> for the string <code>"1"</code>). Fine for humans, awkward for a frontend that wants to put a red line under one input — see point 5.</p>

<h4>3. Placeholders are not always filled</h4>
<p>With an empty body <code>{}</code> the message reads <code>phòng lab tối đa 40 người, bạn ghi $value</code> — the literal text <code>$value</code>, because the value is <code>undefined</code>. If your message uses <code>$value</code>, test it with the field missing, or write a message that does not need it. The body <code>[1,2]</code> (an array) produced the same ten errors: it is treated as an object with no fields — rejected, which is what you want.</p>

<h4>4. Interface or <code>import type</code>: everything passes, silently</h4>
<p><code>/iface</code> accepted <code>{"roomId":"gì cũng được","hack":true}</code>. <code>/import-type</code> uses the very same class as <code>/dto</code>, but imported with <code>import type</code> — and it accepted the bad body too. The compiled JavaScript shows why:</p>
<div class="out">$ grep -n "design:paramtypes" dist/b41/dto.js
41:    __metadata("design:paramtypes", [CreateBookingDto]),     ← /tho
48:    __metadata("design:paramtypes", [CreateBookingDto]),     ← /dto
55:    __metadata("design:paramtypes", [Object]),               ← /iface
62:    __metadata("design:paramtypes", [Function]),             ← /import-type</div>
<p>(The arrows are added by hand.) An interface becomes <code>Object</code> (which <code>ValidationPipe</code> skips by design); a type-only import has no runtime value, so the compiler writes a placeholder. No error, no warning, no 400. Editors and lint rules that "helpfully" convert imports to <code>import type</code> (for example with <code>verbatimModuleSyntax</code> or a consistent-type-imports rule) can switch validation off for a whole module. Rule: <strong>DTOs are imported as values</strong>, and a test sends one bad body to each route (Lab 4.5).</p>

<h4>5. Options that shape the errors</h4>
<p><code>stopAtFirstError: true</code> gives one message per field. But which one? Decorators are applied bottom-up — the one closest to the property name runs first:</p>
<pre><code class="language-ts">${esc(MA_THUTU)}</code></pre>
<div class="out">${esc(OUT_THUTU)}</div>
<p>With <code>@IsInt() @Min(1)</code>, a string <code>"1"</code> is reported as "must not be less than 1" — confusing. Put the type check next to the name: <code>@Min(1) @IsInt() roomId</code>. And <code>exceptionFactory</code> lets you return any shape; <code>/loi-gon</code> returns <code>{ code, errors: { field: message } }</code>, which a form can map directly to its inputs.</p>

<h4>6. Zod through Standard Schema (new in Nest 12)</h4>
<p>Zod, Valibot and ArkType implement one interface, <a href="https://standardschema.dev" target="_blank" rel="noopener">Standard Schema</a>. Nest 12 accepts such a schema on a parameter decorator — <code>@Body({ schema, pipes: [new StandardSchemaValidationPipe()] })</code> — and the pipe validates against it. The type comes from <code>z.infer</code>, so there is no separate class to keep in sync. Messages are prefixed with the path (<code>roomId: Invalid input…</code>). Note the pipe is explicit here; it can also be registered globally.</p>

<h3>class-validator or Zod?</h3>
<table>
<thead><tr><th></th><th>class-validator DTO</th><th>Zod / Standard Schema</th></tr></thead>
<tbody>
<tr><td>Where the rules live</td><td>Decorators on a class</td><td>A schema value; the type is inferred</td></tr>
<tr><td>Nest ecosystem</td><td>OpenAPI plugin reads it (4.4), mapped types (4.3), serialization</td><td>OpenAPI needs extra work; mapped types do not apply</td></tr>
<tr><td>Share with a TypeScript frontend</td><td>Awkward (decorators, reflect-metadata)</td><td>Easy — the same schema validates the form</td></tr>
<tr><td>Typical in companies today</td><td>The default in most Nest codebases</td><td>Growing; common in full-stack TypeScript teams</td></tr>
</tbody>
</table>
<p>This course uses class-validator as the main path because it is what you will meet in existing Nest projects and it feeds OpenAPI for free. Zod at the boundary is taught from zero in the TypeScript course, Chapter 13 (card below).</p>

<h3>🧪 Exercise (20 min) — a rule across two fields</h3>
<p>Write a decorator <code>@SauTruong('start', 240)</code>: the decorated value must be later than the field <code>start</code>, by at most 240 minutes. Use <code>registerDecorator</code>. Check: 07:30→09:30 passes; 09:30→07:30 and 07:00→13:00 fail; 30 February fails.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>ValidationArguments.object</code> gives the whole DTO, so the rule can read another field. <code>IsISO8601({ strict: true })</code> rejects 30 February. Notice what is <em>not</em> here: "not in the past" depends on the clock; in the project that check lives in the service with the injected <code>Clock</code> (Lesson 2.8), where tests can fix the time.</p>
</details>

<h3>💼 On the job</h3>
<p>In an outsourcing project the API contract usually comes from the customer as a spreadsheet or an OpenAPI file: field, type, required, rule. Turning each row into one decorator line is mechanical — and reviewable. When a tester reports "the API accepted 99 people", the fix and its proof are one decorator plus one test case. Ask in code review: is every <code>@Body()</code> typed with a class, imported as a value?</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DTO</span><span class="v">Class describing the data a client may send (or receive); exists at runtime.</span></div>
  <div class="kv"><span class="k">ValidationPipe</span><span class="v">Turns the body into the DTO class, runs class-validator, throws 400 with messages.</span></div>
  <div class="kv"><span class="k">design:paramtypes</span><span class="v">Metadata emitted by TypeScript; the pipe reads the DTO class from it.</span></div>
  <div class="kv"><span class="k">stopAtFirstError</span><span class="v">One message per field; the decorator closest to the name runs first.</span></div>
  <div class="kv"><span class="k">Standard Schema</span><span class="v">Common interface of Zod/Valibot/ArkType; Nest 12 accepts it via <code>{ schema }</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A DTO must be a class imported as a value; an interface or <code>import type</code> disables validation without any warning.</li>
<li><code>ValidationPipe</code> returns 400 with an array of messages; customise per rule with <code>message</code>, or the whole shape with <code>exceptionFactory</code>.</li>
<li>Test messages that use <code>$value</code> with the field missing.</li>
<li>With <code>stopAtFirstError</code>, put the type check closest to the property name.</li>
<li>Nest 12 also validates with Zod (Standard Schema) through <code>@Body({ schema })</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>4.1 — DTO: ghi rõ client được gửi những gì</h2>
<p class="lead">Chương 3 dùng pipe cho từng giá trị đơn. Thân request là cả một object do người lạ gửi: có thể thiếu trường, sai kiểu, thừa trường, hoặc là một mảng. <strong>DTO</strong> (data transfer object — đối tượng chuyển dữ liệu) là một class mô tả hình dạng được phép; <code>ValidationPipe</code> đọc các luật gắn trên đó và trả 400 trước khi handler chạy. Bài này tập thói quen đó và chỉ ra năm cách nó hỏng mà không báo.</p>

<h3>Liên hệ đời thường: tờ đơn in sẵn</h3>
<p>Tờ giấy trắng thì người nộp viết gì cũng được; tờ đơn in sẵn có ô ghi nhãn, "ngày (dd/mm/yyyy)", "tối đa 40 người", và cán bộ trả lại nếu ô nào sai. DTO là tờ đơn, decorator là luật in trên đơn, <code>ValidationPipe</code> là cán bộ. Và cũng như tờ đơn, nó chỉ có tác dụng khi cán bộ nhận được tờ đơn thật — không phải bản chụp đường viền của nó (chính là bẫy interface bên dưới).</p>

<h3>Vì sao là class mà không phải interface?</h3>
<p>Kiểu TypeScript bị xoá khi biên dịch. Class thì còn: nó tồn tại lúc chạy, decorator gắn được metadata lên từng thuộc tính, và <code>emitDecoratorMetadata</code> ghi class đó làm kiểu tham số của handler (<code>design:paramtypes</code>, Bài 1.1). <code>ValidationPipe</code> dựa vào kiểu đã ghi để biết áp luật nào. Lúc chạy không có class ⇒ không có luật ⇒ không kiểm gì.</p>

<h3>Thí nghiệm — một DTO, 13 request</h3>
<p>DTO, có thông báo tiếng Việt cho hai luật (biến thay thế <code>$constraint1</code>, <code>$value</code>):</p>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<p>Ứng dụng: một route không pipe, một route có <code>ValidationPipe</code>, một route kiểu tham số là interface, một route dùng đúng class đó nhưng nhập bằng <code>import type</code>, hai biến thể tuỳ chọn, và một schema Zod:</p>
<pre><code class="language-ts">${esc(MA_41)}</code></pre>
<div class="out">${esc(OUT_41)}</div>

<h4>1. Không có pipe, DTO chỉ để trang trí</h4>
<p><code>/tho</code> nhận <code>roomId: "1"</code>, email sai và 99 người với mã 201. Khai báo <code>dto: CreateBookingDto</code> tự nó không làm gì. Để ý thêm <code>laDto: false</code> ngay cả ở route đã kiểm: không có <code>transform: true</code> thì handler nhận object thường, không phải instance của class — Bài 4.2 nói về chuyện này.</p>

<h4>2. Dạng lỗi: mảng câu, có khi hai câu cho một trường</h4>
<p>Phản hồi mặc định là <code>{ message: string[], error, statusCode: 400 }</code>. Một trường có thể sinh vài câu (<code>roomId must not be less than 1</code> <em>và</em> <code>must be an integer number</code> với chuỗi <code>"1"</code>). Người đọc thì ổn, nhưng frontend muốn gạch đỏ dưới đúng một ô nhập sẽ khó dùng — xem ý 5.</p>

<h4>3. Biến thay thế không phải lúc nào cũng được thay</h4>
<p>Với thân rỗng <code>{}</code>, thông báo thành <code>phòng lab tối đa 40 người, bạn ghi $value</code> — nguyên chữ <code>$value</code>, vì giá trị là <code>undefined</code>. Thông báo nào dùng <code>$value</code> thì thử cả khi vắng trường, hoặc viết câu không cần nó. Thân <code>[1,2]</code> (một mảng) cho đúng mười lỗi như thế: nó bị coi là object không có trường nào — bị từ chối, đúng như ta muốn.</p>

<h4>4. Interface hoặc <code>import type</code>: mọi thứ lọt qua, im lặng</h4>
<p><code>/iface</code> nhận <code>{"roomId":"gì cũng được","hack":true}</code>. <code>/import-type</code> dùng đúng class của <code>/dto</code>, chỉ khác là nhập bằng <code>import type</code> — và cũng nhận thân xấu. JavaScript sau biên dịch cho thấy lý do:</p>
<div class="out">$ grep -n "design:paramtypes" dist/b41/dto.js
41:    __metadata("design:paramtypes", [CreateBookingDto]),     ← /tho
48:    __metadata("design:paramtypes", [CreateBookingDto]),     ← /dto
55:    __metadata("design:paramtypes", [Object]),               ← /iface
62:    __metadata("design:paramtypes", [Function]),             ← /import-type</div>
<p>(Mũi tên là chú thích thêm tay.) Interface thành <code>Object</code> (thứ <code>ValidationPipe</code> cố ý bỏ qua); nhập chỉ-kiểu thì lúc chạy không có giá trị, trình biên dịch ghi một giá trị giữ chỗ. Không lỗi, không cảnh báo, không 400. Trình soạn thảo và luật lint "tốt bụng" tự đổi import sang <code>import type</code> (ví dụ với <code>verbatimModuleSyntax</code> hoặc luật consistent-type-imports) có thể tắt kiểm dữ liệu của cả một module. Luật: <strong>DTO luôn nhập như giá trị</strong>, và có test gửi một thân xấu tới từng route (Lab 4.5).</p>

<h4>5. Tuỳ chọn định hình lỗi</h4>
<p><code>stopAtFirstError: true</code> cho mỗi trường một câu. Nhưng câu nào? Decorator được áp từ dưới lên — cái sát tên thuộc tính nhất chạy trước:</p>
<pre><code class="language-ts">${esc(MA_THUTU)}</code></pre>
<div class="out">${esc(OUT_THUTU)}</div>
<p>Với <code>@IsInt() @Min(1)</code>, chuỗi <code>"1"</code> bị báo "must not be less than 1" — gây khó hiểu. Đặt kiểm kiểu sát tên: <code>@Min(1) @IsInt() roomId</code>. Còn <code>exceptionFactory</code> cho phép trả bất kỳ dạng nào; <code>/loi-gon</code> trả <code>{ code, errors: { trường: câu } }</code>, biểu mẫu gắn thẳng vào từng ô được.</p>

<h4>6. Zod qua Standard Schema (mới ở Nest 12)</h4>
<p>Zod, Valibot và ArkType cùng cài một giao diện, <a href="https://standardschema.dev" target="_blank" rel="noopener">Standard Schema</a>. Nest 12 nhận schema đó ngay trên decorator tham số — <code>@Body({ schema, pipes: [new StandardSchemaValidationPipe()] })</code> — và pipe kiểm theo nó. Kiểu lấy từ <code>z.infer</code>, nên không có class riêng phải giữ cho khớp. Thông báo có tiền tố đường dẫn (<code>roomId: Invalid input…</code>). Ở đây pipe ghi tường minh; cũng có thể đăng ký toàn cục.</p>

<h3>class-validator hay Zod?</h3>
<table>
<thead><tr><th></th><th>DTO class-validator</th><th>Zod / Standard Schema</th></tr></thead>
<tbody>
<tr><td>Luật nằm ở đâu</td><td>Decorator trên class</td><td>Một giá trị schema; kiểu được suy ra</td></tr>
<tr><td>Hệ sinh thái Nest</td><td>Plugin OpenAPI đọc được (4.4), mapped types (4.3), tuần tự hoá</td><td>OpenAPI phải làm thêm; mapped types không áp dụng</td></tr>
<tr><td>Dùng chung với frontend TypeScript</td><td>Khó (decorator, reflect-metadata)</td><td>Dễ — cùng schema kiểm luôn biểu mẫu</td></tr>
<tr><td>Phổ biến ở công ty hiện nay</td><td>Mặc định trong đa số dự án Nest</td><td>Đang tăng; hay gặp ở nhóm full-stack TypeScript</td></tr>
</tbody>
</table>
<p>Khoá này đi đường chính bằng class-validator vì đó là thứ bạn sẽ gặp trong các dự án Nest đang chạy, và nó cấp dữ liệu cho OpenAPI miễn phí. Zod ở biên được dạy từ số 0 trong khoá TypeScript, Chương 13 (thẻ bên dưới).</p>

<h3>🧪 Bài tập (20 phút) — luật giữa hai trường</h3>
<p>Viết decorator <code>@SauTruong('start', 240)</code>: giá trị được gắn phải sau trường <code>start</code>, không quá 240 phút. Dùng <code>registerDecorator</code>. Kiểm: 07:30→09:30 qua; 09:30→07:30 và 07:00→13:00 trượt; ngày 30 tháng 2 trượt.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>ValidationArguments.object</code> trả cả DTO, nên luật đọc được trường khác. <code>IsISO8601({ strict: true })</code> từ chối ngày 30/02. Để ý thứ <em>không</em> có ở đây: "không ở quá khứ" phụ thuộc đồng hồ; trong dự án, luật đó nằm ở service với <code>Clock</code> được tiêm (Bài 2.8), nơi test cố định được giờ.</p>
</details>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, hợp đồng API thường đến từ khách hàng dưới dạng bảng tính hoặc tệp OpenAPI: trường, kiểu, bắt buộc, luật. Biến mỗi dòng thành một dòng decorator là việc máy móc — và review được. Khi tester báo "API nhận 99 người", bản sửa và bằng chứng chỉ là một decorator cộng một ca test. Câu nên hỏi khi review mã: mọi <code>@Body()</code> đã có kiểu là class, nhập như giá trị chưa?</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DTO</span><span class="v">Class mô tả dữ liệu client được gửi (hoặc nhận); tồn tại lúc chạy.</span></div>
  <div class="kv"><span class="k">ValidationPipe</span><span class="v">Đổi thân request thành class DTO, chạy class-validator, ném 400 kèm thông báo.</span></div>
  <div class="kv"><span class="k">design:paramtypes</span><span class="v">Metadata do TypeScript sinh; pipe đọc class DTO từ đây.</span></div>
  <div class="kv"><span class="k">stopAtFirstError</span><span class="v">Mỗi trường một câu; decorator sát tên chạy trước.</span></div>
  <div class="kv"><span class="k">Standard Schema</span><span class="v">Giao diện chung của Zod/Valibot/ArkType; Nest 12 nhận qua <code>{ schema }</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>DTO phải là class nhập như giá trị; interface hoặc <code>import type</code> tắt kiểm dữ liệu mà không cảnh báo gì.</li>
<li><code>ValidationPipe</code> trả 400 với mảng thông báo; đổi câu từng luật bằng <code>message</code>, đổi cả dạng bằng <code>exceptionFactory</code>.</li>
<li>Thông báo có <code>$value</code> thì thử cả khi vắng trường.</li>
<li>Với <code>stopAtFirstError</code>, đặt kiểm kiểu sát tên thuộc tính nhất.</li>
<li>Nest 12 kiểm được cả bằng Zod (Standard Schema) qua <code>@Body({ schema })</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
