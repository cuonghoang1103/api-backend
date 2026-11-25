/**
 * 4.5 — Lab: Biểu mẫu đặt lịch không thể lạm dụng (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: lab/c4/app/src/lab45 — Vitest 4.1.12 trên máy nhà (14 test xanh: 12 request xấu bị chặn ĐÚNG mã VÀ đúng lý do, 1 hợp lệ
 * chỉ trả 6 trường công khai, 1 lỗi không lặp lại dữ liệu gửi); in-loi.ts chạy trong container nst-run-* (lý do từng request);
 * thử phá (bỏ forbidNonWhitelisted + bỏ @Type): bản test chỉ kiểm mã chỉ đỏ 1 test (lý do sai vẫn xanh), bản kiểm lý do đỏ 3 test.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-2-5-lab', title: 'API Design 2.5 — Lab 2: báo hỏng thiết bị phiên bản 2', sub: 'Schema, lỗi hai thứ tiếng, view ổn định — cùng bài toán ở mức thiết kế.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây', sub: 'Khoá Testing từ số 0: test xanh chưa chắc đã đúng.', cta: 'Mở khoá →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Validation', 'Cấu hình ValidationPipe toàn cục qua APP_PIPE.', 'https://docs.nestjs.com/techniques/validation'),
  nguon('📘', 'class-validator — Custom validation decorators', 'registerDecorator, ValidationArguments.', 'https://github.com/typestack/class-validator#custom-validation-decorators'),
].join('\n');

const MA_DTO = "import { Type } from 'class-transformer';\nimport {\n  ArrayMaxSize, IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, Min, ValidateNested,\n  registerDecorator, ValidationArguments,\n} from 'class-validator';\n\nexport enum Loai { hoc = 'hoc', thi = 'thi', clb = 'clb' }\n// ISO 8601 ĐẦY ĐỦ có múi giờ: \"2027-01-05T07:30:00+07:00\" hoặc \"…Z\" — không nhận giờ \"trôi\" không múi\nconst ISO_CO_MUI = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?(\\.\\d{1,3})?(Z|[+-]\\d{2}:\\d{2})$/;\n\n/** Ngày giờ có thật (từ chối 30/02), đúng bước 30 phút, trong tương lai */\nfunction KhungHopLe() {\n  return (obj: object, prop: string) => registerDecorator({\n    name: 'khungHopLe', target: obj.constructor, propertyName: prop,\n    validator: {\n      validate(v: unknown) {\n        if (typeof v !== 'string' || !ISO_CO_MUI.test(v)) return false;\n        const t = new Date(v);\n        if (Number.isNaN(t.getTime())) return false;\n        const [y, m, d] = v.slice(0, 10).split('-').map(Number);           // 2027-02-30 ⇒ Date tự \"trôi\" sang 02/03\n        const local = new Date(t.getTime() + offsetPhut(v) * 60_000);\n        if (local.getUTCFullYear() !== y || local.getUTCMonth() + 1 !== m || local.getUTCDate() !== d) return false;\n        return t.getUTCMinutes() % 30 === 0 && t.getUTCSeconds() === 0 && t.getTime() > Date.now();\n      },\n      defaultMessage: (a: ValidationArguments) => `${a.property}: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai`,\n    },\n  });\n}\nconst offsetPhut = (v: string) => { const m = /([+-])(\\d{2}):(\\d{2})$/.exec(v); return m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +m[3]) : 0; };\n\n/** end sau start, tối đa 4 giờ */\nfunction SauStart() {\n  return (obj: object, prop: string) => registerDecorator({\n    name: 'sauStart', target: obj.constructor, propertyName: prop,\n    validator: {\n      validate(v: unknown, a: ValidationArguments) {\n        const s = Date.parse((a.object as { start?: string }).start ?? ''), e = Date.parse(String(v));\n        return e > s && e - s <= 4 * 3_600_000;\n      },\n      defaultMessage: () => 'end phải sau start và không quá 4 giờ',\n    },\n  });\n}\n\nexport class ThietBiDto {\n  @IsEnum(['arduino', 'raspberry-pi', 'oscilloscope']) loai: string;\n  @Max(5) @Min(1) @IsInt() soLuong: number;\n}\n\n// Thứ tự: với stopAtFirstError, decorator SÁT tên thuộc tính chạy TRƯỚC ⇒ đặt kiểm kiểu (IsInt, IsString) ở sát tên\nexport class CreateBookingDto {\n  @Min(1) @IsInt() roomId: number;\n  @Matches(/^SE\\d{6}$/, { message: 'studentId dạng SE + 6 chữ số' }) studentId: string;\n  @KhungHopLe() start: string;\n  @KhungHopLe() @SauStart() end: string;\n  @Max(40) @Min(1) @IsInt() attendees: number;\n  @IsEnum(Loai) loai: Loai;\n  @IsOptional() @ValidateNested({ each: true }) @Type(() => ThietBiDto) @ArrayMaxSize(5) thietBi?: ThietBiDto[];\n  @IsOptional() @Length(0, 300) @IsString() note?: string;\n}";
const MA_RESP = "import { Exclude, Expose } from 'class-transformer';\n\n/** Chỉ những gì sinh viên được thấy. Thêm trường vào entity ⇒ KHÔNG tự lọt ra đây. */\n@Exclude()\nexport class BookingResponse {\n  @Expose() id: string;\n  @Expose() roomId: number;\n  @Expose() start: string;\n  @Expose() end: string;\n  @Expose() attendees: number;\n  @Expose() status: 'PENDING' | 'APPROVED' | 'REJECTED';\n}";
const MA_SVC = "import { Body, ClassSerializerInterceptor, Controller, Get, Injectable, NotFoundException, Param, ParseUUIDPipe, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';\nimport { randomUUID } from 'node:crypto';\nimport { CreateBookingDto } from './booking.dto.js';\nimport { BookingResponse } from './booking.response.js';\n\n/** Bản ghi nội bộ — có trường KHÔNG được ra ngoài */\nexport interface BookingRow {\n  id: string; roomId: number; studentId: string; start: string; end: string; attendees: number;\n  status: 'PENDING' | 'APPROVED' | 'REJECTED'; internalNote: string; approverEmail: string | null; createdIp: string;\n}\n\n@Injectable()\nexport class BookingsService {\n  readonly rows = new Map<string, BookingRow>();\n  create(dto: CreateBookingDto, ip: string): BookingRow {\n    // Ánh xạ TƯỜNG MINH từng trường — không spread/Object.assign DTO vào bản ghi\n    const row: BookingRow = {\n      id: randomUUID(), roomId: dto.roomId, studentId: dto.studentId, start: dto.start, end: dto.end, attendees: dto.attendees,\n      status: 'PENDING', internalNote: `tạo bởi ${dto.studentId}`, approverEmail: null, createdIp: ip,\n    };\n    this.rows.set(row.id, row);\n    return row;\n  }\n  get(id: string) { const r = this.rows.get(id); if (!r) throw new NotFoundException(`Không có lượt đặt ${id}`); return r; }\n}\n\n@Controller('bookings')\n@UseInterceptors(ClassSerializerInterceptor)\n@SerializeOptions({ type: BookingResponse })\nexport class BookingsController {\n  constructor(private readonly svc: BookingsService) {}\n  @Post() create(@Body() dto: CreateBookingDto) { return this.svc.create(dto, '10.0.0.7'); }\n  @Get(':id') one(@Param('id', ParseUUIDPipe) id: string) { return this.svc.get(id); }\n}";
const MA_MOD = "import { Module, ValidationPipe } from '@nestjs/common';\nimport { APP_PIPE } from '@nestjs/core';\nimport { BookingsController, BookingsService } from './bookings.js';\n\n/** Cấu hình kiểm dữ liệu dùng chung — đặt ở module để test và main.ts dùng CÙNG một cấu hình */\nexport const validationPipe = () => new ValidationPipe({\n  whitelist: true, forbidNonWhitelisted: true, transform: true,\n  forbidUnknownValues: true, stopAtFirstError: true,\n  validationError: { target: false, value: false },     // không trả lại giá trị người dùng gửi trong lỗi\n});\n\n@Module({\n  controllers: [BookingsController],\n  providers: [BookingsService, { provide: APP_PIPE, useFactory: validationPipe }],\n})\nexport class AppModule {}\n\n/** Phần cấu hình gắn trên app (không nằm trong module được) — main.ts và test đều gọi */\nexport function cauHinh(app: { useBodyParser: (t: 'json', o: { limit: string }) => unknown }) {\n  app.useBodyParser('json', { limit: '16kb' });   // biểu mẫu đặt lịch không cần hơn 16 KB\n}";
const MA_SPEC = "import 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport request from 'supertest';\nimport { AppModule, cauHinh } from './app.module.js';\n\nconst TOT = {\n  roomId: 1, studentId: 'SE170001', start: '2027-01-05T07:30:00+07:00', end: '2027-01-05T09:30:00+07:00',\n  attendees: 20, loai: 'hoc', thietBi: [{ loai: 'arduino', soLuong: 2 }],\n};\n// 12 request xấu: [mô tả, thân, mã mong đợi, LÝ DO mong đợi] — chỉ kiểm mã thì test có thể xanh vì lý do sai\nconst XAU: [string, unknown, number, RegExp][] = [\n  ['tự đặt trạng thái APPROVED', { ...TOT, status: 'APPROVED' }, 400, /status should not exist/],\n  ['roomId là chuỗi', { ...TOT, roomId: '1' }, 400, /roomId must be an integer/],\n  ['41 người', { ...TOT, attendees: 41 }, 400, /attendees must not be greater/],\n  ['ngày 30/02', { ...TOT, start: '2027-02-30T07:30:00+07:00', end: '2027-02-30T08:30:00+07:00' }, 400, /^start:/],\n  ['giờ không múi', { ...TOT, start: '2027-01-05T07:30:00', end: '2027-01-05T09:30:00' }, 400, /^start:/],\n  ['lệch bước 30 phút', { ...TOT, start: '2027-01-05T07:45:00+07:00' }, 400, /^start:/],\n  ['end trước start', { ...TOT, end: '2027-01-05T07:00:00+07:00' }, 400, /end phải sau start/],\n  ['dài quá 4 giờ', { ...TOT, end: '2027-01-05T12:00:00+07:00' }, 400, /end phải sau start/],\n  ['ở quá khứ', { ...TOT, start: '2020-01-06T07:30:00+07:00', end: '2020-01-06T09:30:00+07:00' }, 400, /^start:/],\n  ['thiết bị lồng sai', { ...TOT, thietBi: [{ loai: 'arduino', soLuong: 999, mienPhi: true }] }, 400, /thietBi\\.0\\.soLuong must not be greater/],\n  ['ghi chú 5.000 ký tự', { ...TOT, note: 'x'.repeat(5000) }, 400, /note must be shorter/],\n  ['thân 20 KB', { ...TOT, thietBi: Array.from({ length: 700 }, () => ({ loai: 'arduino', soLuong: 1 })) }, 413, /too large/],\n];\n\ndescribe('Lab 4.5 — biểu mẫu đặt lịch không thể lạm dụng', () => {\n  let app: NestExpressApplication;\n  beforeAll(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = m.createNestApplication<NestExpressApplication>({ logger: false });\n    cauHinh(app);\n    await app.init();\n  });\n  afterAll(() => app.close());\n\n  it.each(XAU)('chặn: %s', async (_ten, than, ma, lyDo) => {\n    const r = await request(app.getHttpServer()).post('/bookings').send(than as object);\n    expect(r.status).toBe(ma);\n    expect([r.body.message].flat()).toContainEqual(expect.stringMatching(lyDo));\n  });\n\n  it('hợp lệ ⇒ 201, phản hồi chỉ có trường công khai, status do server đặt', async () => {\n    const r = await request(app.getHttpServer()).post('/bookings').send(TOT).expect(201);\n    expect(Object.keys(r.body).sort()).toEqual(['attendees', 'end', 'id', 'roomId', 'start', 'status']);\n    expect(r.body.status).toBe('PENDING');\n    const g = await request(app.getHttpServer()).get(`/bookings/${r.body.id}`).expect(200);\n    expect(g.body).toEqual(r.body);\n    expect(JSON.stringify(g.body)).not.toMatch(/internalNote|approverEmail|createdIp|10\\.0\\.0\\.7/);\n  });\n\n  it('lỗi kiểm dữ liệu không trả lại giá trị đã gửi', async () => {\n    const r = await request(app.getHttpServer()).post('/bookings').send({ ...TOT, note: '<script>alert(1)</script>'.repeat(20) }).expect(400);\n    expect(JSON.stringify(r.body)).not.toContain('<script>');\n  });\n});";
const OUT_TEST = " RUN  v4.1.12 app\n ✓ chặn: tự đặt trạng thái APPROVED 40ms\n ✓ chặn: roomId là chuỗi 7ms\n ✓ chặn: 41 người 4ms\n ✓ chặn: ngày 30/02 3ms\n ✓ chặn: giờ không múi 4ms\n ✓ chặn: lệch bước 30 phút 3ms\n ✓ chặn: end trước start 3ms\n ✓ chặn: dài quá 4 giờ 3ms\n ✓ chặn: ở quá khứ 5ms\n ✓ chặn: thiết bị lồng sai 3ms\n ✓ chặn: ghi chú 5.000 ký tự 3ms\n ✓ chặn: thân 20 KB 3ms\n ✓ hợp lệ ⇒ 201, phản hồi chỉ có trường công khai, status do server đặt 9ms\n ✓ lỗi kiểm dữ liệu không trả lại giá trị đã gửi 2ms\n Test Files  1 passed (1)\n      Tests  14 passed (14)";
const OUT_LOI = "status      → 400 [\"property status should not exist\"]\nroomId \"1\"  → 400 [\"roomId must be an integer number\"]\n41 người    → 400 [\"attendees must not be greater than 40\"]\n30/02       → 400 [\"start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\",\"end: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\"]\nkhông múi   → 400 [\"start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\",\"end: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\"]\n07:45       → 400 [\"start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\"]\nend < start → 400 [\"end phải sau start và không quá 4 giờ\"]\n> 4 giờ     → 400 [\"end phải sau start và không quá 4 giờ\"]\nquá khứ     → 400 [\"start: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\",\"end: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút, ở tương lai\"]\nlồng sai    → 400 [\"thietBi.0.property mienPhi should not exist\",\"thietBi.0.soLuong must not be greater than 5\"]\nnote 5000   → 400 [\"note must be shorter than or equal to 300 characters\"]\n20 KB       → 413 \"request entity too large\"\nHỢP LỆ      → 201 {\"id\":\"00aa1965-462c-4241-8967-1f124b0c633d\",\"roomId\":1,\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20,\"status\":\"PENDING\"}";
const OUT_PHA = "     × chặn: tự đặt trạng thái APPROVED 44ms\n     × chặn: thiết bị lồng sai 4ms\n     × hợp lệ ⇒ 201, phản hồi chỉ có trường công khai, status do server đặt 4ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  3 failed | 11 passed (14)";

export default {
  title: '4.5 — Lab: A booking form that cannot be abused|||4.5 — Lab: Biểu mẫu đặt lịch không thể lạm dụng',
  slug: 'nst-4-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab 90 phút: DTO đặt phòng lab đầy đủ (ngày có thật, có múi giờ, bước 30 phút, tương lai, tối đa 4 giờ, thiết bị lồng ≤ 5), không nhận trường lạ, thân ≤ 16 KB, phản hồi chỉ 6 trường công khai, lỗi không lặp lại dữ liệu gửi. Đạt khi 14 test Vitest xanh: 12 request xấu bị chặn đúng mã VÀ đúng lý do. Thử phá cho thấy test chỉ kiểm mã vẫn xanh vì lý do sai. 5 câu phỏng vấn Chương 4.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab</span>
<h2>4.5 — Lab: a booking form nobody can abuse</h2>
<p class="lead">The university's lab-booking form will be opened to all students next semester. Before that, the security team will throw malformed and malicious requests at it. Your job: make every one of them fail with the right status <em>and the right reason</em>, and make sure the response never shows internal fields. Everything uses Lessons 4.1–4.3; the new skill is proving it with tests that cannot pass by accident.</p>

<h3>The brief (90 min)</h3>
<table>
<thead><tr><th>#</th><th>Requirement</th><th>Pass when</th></tr></thead>
<tbody>
<tr><td>YC1</td><td>Full DTO: <code>roomId</code> integer ≥ 1; <code>studentId</code> SE + 6 digits; <code>start</code>/<code>end</code> ISO 8601 <em>with</em> time zone, real calendar date, 30-minute steps, in the future; <code>end</code> after <code>start</code>, at most 4 h; <code>attendees</code> 1–40; <code>loai</code> enum; optional <code>thietBi</code> ≤ 5 items, each validated; <code>note</code> ≤ 300 characters</td><td>11 bad bodies → 400 with a message naming the field</td></tr>
<tr><td>YC2</td><td>No unknown fields anywhere, nested included</td><td><code>status: "APPROVED"</code> → 400; a forgotten <code>@Type</code> cannot pass silently</td></tr>
<tr><td>YC3</td><td>Body at most 16 KB</td><td>~20 KB → 413</td></tr>
<tr><td>YC4</td><td>Response shows only <code>id, roomId, start, end, attendees, status</code>; <code>status</code> set by the server</td><td>Key list exact; no <code>internalNote</code>, <code>approverEmail</code>, <code>createdIp</code></td></tr>
<tr><td>YC5</td><td>Error messages do not repeat the submitted data</td><td>A note full of <code>&lt;script&gt;</code> → 400 without it in the body</td></tr>
</tbody>
</table>
<p>Start from an empty folder in your Nest 12 project (<code>src/lab45</code>); the in-memory service is fine — the database comes in Chapter 6. Try it yourself first; the solution is below.</p>

<h3>Tests first — the contract you must satisfy</h3>
<p>Each bad request lists the expected status <strong>and</strong> a pattern the message must match. Why both is the point of the "break it" step.</p>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>

<details><summary>Show solution — DTO</summary>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<p>Notes: the regex forces a time zone (<code>Z</code> or <code>±hh:mm</code>) — "07:30" without a zone means different instants on the server and the phone. <code>new Date('2027-02-30…')</code> silently rolls over to 2 March, so the rule compares the calendar date at the given offset with the string. "In the future" uses <code>Date.now()</code> here for brevity; in the project (Mốc 4) it moves to the service with the injected <code>Clock</code> so tests can fix time.</p>
</details>
<details><summary>Show solution — response DTO, service, module</summary>
<pre><code class="language-ts">${esc(MA_RESP)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p>The pipe is registered with <code>APP_PIPE</code> inside the module, so the test (which imports <code>AppModule</code>) and <code>main.ts</code> use the same configuration. The body limit is set on the app, not in a module, so <code>cauHinh(app)</code> is shared by both — forget it in the test and YC3 would only be "tested" in production.</p>
</details>

<h3>Run it</h3>
<div class="out">$ npx vitest run src/lab45 --reporter=verbose
${esc(OUT_TEST)}</div>
<p>And the reason each request was rejected, from the running app (container, Node 22):</p>
<div class="out">$ node dist/lab45/in-loi.js
${esc(OUT_LOI)}</div>

<h3>Break it — does the test fail for the right reason?</h3>
<p>Remove two protections at once: <code>forbidNonWhitelisted</code> from the pipe and <code>@Type(() =&gt; ThietBiDto)</code> from the DTO. With the first version of the test (status only), we got <strong>1 failed, 13 passed</strong>: the "status APPROVED" request still returned 400 — not because of <code>status</code>, but because <code>forbidUnknownValues</code> now rejected the nested <code>thietBi</code> objects. A green test for the wrong reason. With the reason patterns:</p>
<div class="out">${esc(OUT_PHA)}</div>
<p>All three real regressions are visible. Rule for every negative test: assert <em>why</em> it failed, not just that it failed. Also note that <code>forbidUnknownValues: true</code> did its job — a forgotten <code>@Type</code> broke valid requests loudly instead of letting invalid ones through quietly (compare Lesson 4.2, point 5).</p>

<h3>🧪 Extra exercise (30 min)</h3>
<p>Add a rule: club bookings (<code>loai: "clb"</code>) are allowed only on Saturday and Sunday (Vietnam time). Where should it live — DTO or service? Write it, and a test for a Friday club booking that asserts the reason.</p>
<details><summary>Hint</summary>
<p>It depends on two fields and a calendar, but not on stored data or the clock, so a class-level custom validator on the DTO is acceptable; if the rule may change per semester (configuration), put it in the service. Compute the weekday at <code>+07:00</code>, not with <code>getDay()</code> on server time.</p>
</details>

<h3>🎤 What interviewers ask about Chapter 4</h3>
<ol>
<li><strong>"Why are Nest DTOs classes and not interfaces?"</strong> — Types are erased; <code>ValidationPipe</code> reads the class from <code>design:paramtypes</code> and the rules from decorator metadata. An interface (or <code>import type</code>) leaves <code>Object</code>/a placeholder ⇒ validation is skipped silently. Mention you test with a bad body per route.</li>
<li><strong>"What do whitelist, forbidNonWhitelisted and transform do?"</strong> — Strip unknown fields / reject them / pass a DTO instance with conversions. Add the trap: an instance carries <code>undefined</code> for unsent fields, so never <code>Object.assign</code> it into an entity on PATCH.</li>
<li><strong>"How do you stop an API leaking fields like passwordHash?"</strong> — Response DTO as an allow-list (<code>@Exclude</code> on the class, <code>@Expose</code> per field) via <code>@SerializeOptions({ type })</code>; explain that <code>@Exclude</code> on entities fails with plain objects from Prisma; test the exact key list. OWASP API3:2023.</li>
<li><strong>"How is your API documentation kept in sync?"</strong> — Generated from code with <code>@nestjs/swagger</code> and the CLI plugin; mapped types from swagger; <code>/docs-json</code> generates client types; CI diff on the spec.</li>
<li><strong>"Where does validation end and business logic begin?"</strong> — Shape and format at the edge (types, ranges, formats, cross-field rules that need nothing else); rules that need the database, the clock or the user's permissions (room free, not in the past, own booking) in services, where they can be tested with fakes.</li>
</ol>

<h3>💼 On the job</h3>
<p>The negative-test table in this lab is exactly what a QA team writes for an acceptance test plan. Handing it over as executable tests — with expected status and reason — turns "please re-test everything" after each change into one command, and gives the customer evidence instead of promises.</p>

<h3>📌 Summary</h3>
<ul>
<li>Configure validation once (<code>APP_PIPE</code> + a shared <code>cauHinh(app)</code>) so tests and production match.</li>
<li>Dates: require a time zone, check the calendar date, keep clock-based rules in services.</li>
<li>Responses: allow-list DTO and an exact key-list assertion.</li>
<li>Negative tests assert status <em>and</em> reason; break your protections once to see the tests catch it.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab</span>
<h2>4.5 — Lab: biểu mẫu đặt lịch không ai lạm dụng được</h2>
<p class="lead">Kỳ tới, biểu mẫu đặt phòng lab của trường sẽ mở cho mọi sinh viên. Trước đó, nhóm bảo mật sẽ ném vào nó đủ loại request dị dạng và độc hại. Việc của bạn: làm mọi request đó trượt với đúng mã <em>và đúng lý do</em>, và bảo đảm phản hồi không bao giờ lộ trường nội bộ. Mọi thứ dùng Bài 4.1–4.3; kỹ năng mới là chứng minh bằng test không thể xanh nhờ may mắn.</p>

<h3>Đề bài (90 phút)</h3>
<table>
<thead><tr><th>#</th><th>Yêu cầu</th><th>Đạt khi</th></tr></thead>
<tbody>
<tr><td>YC1</td><td>DTO đầy đủ: <code>roomId</code> số nguyên ≥ 1; <code>studentId</code> SE + 6 chữ số; <code>start</code>/<code>end</code> ISO 8601 <em>có</em> múi giờ, ngày có thật trên lịch, bước 30 phút, ở tương lai; <code>end</code> sau <code>start</code>, tối đa 4 giờ; <code>attendees</code> 1–40; <code>loai</code> là enum; <code>thietBi</code> tuỳ chọn ≤ 5 phần tử, phần tử nào cũng được kiểm; <code>note</code> ≤ 300 ký tự</td><td>11 thân xấu → 400 với thông báo nêu đúng trường</td></tr>
<tr><td>YC2</td><td>Không nhận trường lạ ở bất kỳ đâu, kể cả bên trong object lồng</td><td><code>status: "APPROVED"</code> → 400; quên <code>@Type</code> không thể lọt im lặng</td></tr>
<tr><td>YC3</td><td>Thân request tối đa 16 KB</td><td>~20 KB → 413</td></tr>
<tr><td>YC4</td><td>Phản hồi chỉ có <code>id, roomId, start, end, attendees, status</code>; <code>status</code> do máy chủ đặt</td><td>Danh sách khoá đúng y; không có <code>internalNote</code>, <code>approverEmail</code>, <code>createdIp</code></td></tr>
<tr><td>YC5</td><td>Thông báo lỗi không lặp lại dữ liệu đã gửi</td><td>Ghi chú đầy <code>&lt;script&gt;</code> → 400 mà thân phản hồi không chứa nó</td></tr>
</tbody>
</table>
<p>Bắt đầu từ một thư mục trống trong dự án Nest 12 (<code>src/lab45</code>); service trong bộ nhớ là đủ — cơ sở dữ liệu ở Chương 6. Tự làm trước; lời giải ở dưới.</p>

<h3>Test trước — hợp đồng bạn phải đáp ứng</h3>
<p>Mỗi request xấu ghi mã mong đợi <strong>và</strong> một mẫu mà thông báo phải khớp. Vì sao cần cả hai chính là ý của bước "thử phá".</p>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>

<details><summary>Xem lời giải — DTO</summary>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<p>Ghi chú: regex bắt buộc có múi giờ (<code>Z</code> hoặc <code>±hh:mm</code>) — "07:30" không múi là hai thời điểm khác nhau trên máy chủ và trên điện thoại. <code>new Date('2027-02-30…')</code> lặng lẽ trôi sang mùng 2 tháng 3, nên luật so ngày trên lịch tại múi đã ghi với chuỗi gốc. "Ở tương lai" ở đây dùng <code>Date.now()</code> cho gọn; trong dự án (Mốc 4), luật này chuyển sang service với <code>Clock</code> được tiêm để test cố định được giờ.</p>
</details>
<details><summary>Xem lời giải — DTO trả về, service, module</summary>
<pre><code class="language-ts">${esc(MA_RESP)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p>Pipe được đăng ký bằng <code>APP_PIPE</code> ngay trong module, nên test (nạp <code>AppModule</code>) và <code>main.ts</code> dùng cùng cấu hình. Giới hạn thân request đặt trên app chứ không trong module, nên <code>cauHinh(app)</code> được cả hai dùng chung — quên nó trong test thì YC3 chỉ được "kiểm" ở production.</p>
</details>

<h3>Chạy</h3>
<div class="out">$ npx vitest run src/lab45 --reporter=verbose
${esc(OUT_TEST)}</div>
<p>Và lý do từng request bị từ chối, lấy từ ứng dụng đang chạy (container, Node 22):</p>
<div class="out">$ node dist/lab45/in-loi.js
${esc(OUT_LOI)}</div>

<h3>Thử phá — test có trượt đúng lý do không?</h3>
<p>Gỡ cùng lúc hai lớp bảo vệ: <code>forbidNonWhitelisted</code> khỏi pipe và <code>@Type(() =&gt; ThietBiDto)</code> khỏi DTO. Với bản test đầu tiên (chỉ kiểm mã), ta được <strong>1 đỏ, 13 xanh</strong>: request "status APPROVED" vẫn trả 400 — không phải vì <code>status</code>, mà vì <code>forbidUnknownValues</code> giờ từ chối các object <code>thietBi</code> lồng bên trong. Test xanh vì lý do sai. Với mẫu lý do:</p>
<div class="out">${esc(OUT_PHA)}</div>
<p>Cả ba chỗ thoái lui thật đều hiện ra. Luật cho mọi test phủ định: khẳng định <em>vì sao</em> nó trượt, không chỉ là nó trượt. Để ý thêm <code>forbidUnknownValues: true</code> đã làm đúng việc — quên <code>@Type</code> làm hỏng request hợp lệ một cách ồn ào, thay vì để request sai lọt qua lặng lẽ (so với Bài 4.2, ý 5).</p>

<h3>🧪 Bài tập thêm (30 phút)</h3>
<p>Thêm luật: lịch của câu lạc bộ (<code>loai: "clb"</code>) chỉ được đặt vào thứ Bảy và Chủ nhật (giờ Việt Nam). Luật này nên nằm ở đâu — DTO hay service? Viết nó, và một test cho lịch câu lạc bộ ngày thứ Sáu có khẳng định lý do.</p>
<details><summary>Gợi ý</summary>
<p>Nó phụ thuộc hai trường và lịch, nhưng không phụ thuộc dữ liệu đã lưu hay đồng hồ, nên validator tự viết mức class trên DTO là chấp nhận được; nếu luật có thể đổi theo học kỳ (cấu hình), đặt nó ở service. Tính thứ trong tuần tại <code>+07:00</code>, đừng dùng <code>getDay()</code> theo giờ máy chủ.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi gì về Chương 4</h3>
<ol>
<li><strong>"Vì sao DTO của Nest là class chứ không phải interface?"</strong> — Kiểu bị xoá; <code>ValidationPipe</code> đọc class từ <code>design:paramtypes</code> và luật từ metadata của decorator. Interface (hoặc <code>import type</code>) để lại <code>Object</code>/giá trị giữ chỗ ⇒ kiểm bị bỏ qua im lặng. Nói thêm bạn có test gửi thân xấu cho từng route.</li>
<li><strong>"whitelist, forbidNonWhitelisted và transform làm gì?"</strong> — Gỡ trường lạ / từ chối chúng / đưa instance DTO đã chuyển kiểu. Thêm cái bẫy: instance mang <code>undefined</code> cho trường không gửi, nên khi PATCH đừng bao giờ <code>Object.assign</code> nó vào entity.</li>
<li><strong>"Làm sao để API không lộ những trường như passwordHash?"</strong> — DTO trả về theo danh sách cho phép (<code>@Exclude</code> ở class, <code>@Expose</code> từng trường) qua <code>@SerializeOptions({ type })</code>; giải thích <code>@Exclude</code> trên entity vô tác dụng với object thường từ Prisma; test đúng danh sách khoá. OWASP API3:2023.</li>
<li><strong>"Tài liệu API của bạn giữ khớp với mã bằng cách nào?"</strong> — Sinh từ mã bằng <code>@nestjs/swagger</code> và plugin CLI; mapped types lấy từ swagger; <code>/docs-json</code> sinh kiểu cho client; CI so khác biệt của spec.</li>
<li><strong>"Kiểm dữ liệu dừng ở đâu và logic nghiệp vụ bắt đầu từ đâu?"</strong> — Hình dạng và định dạng ở biên (kiểu, khoảng, định dạng, luật giữa các trường không cần gì thêm); luật cần cơ sở dữ liệu, đồng hồ hay quyền của người dùng (phòng còn trống, không ở quá khứ, lịch của chính mình) nằm ở service, nơi test được bằng đồ giả.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Bảng test phủ định trong lab này chính là thứ nhóm QA viết cho kế hoạch kiểm thử nghiệm thu. Giao nó dưới dạng test chạy được — có mã và lý do mong đợi — biến "nhờ test lại hết" sau mỗi thay đổi thành một lệnh, và cho khách hàng bằng chứng thay vì lời hứa.</p>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cấu hình kiểm dữ liệu một lần (<code>APP_PIPE</code> + <code>cauHinh(app)</code> dùng chung) để test và production khớp nhau.</li>
<li>Ngày giờ: bắt buộc múi giờ, kiểm ngày trên lịch, luật theo đồng hồ để ở service.</li>
<li>Phản hồi: DTO danh sách cho phép và khẳng định đúng danh sách khoá.</li>
<li>Test phủ định khẳng định cả mã <em>và</em> lý do; thử gỡ lớp bảo vệ một lần để thấy test bắt được.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
