/**
 * 4.6 — Mốc dự án 4: DTO, kiểm dữ liệu và tài liệu API (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: lab/c4/moc4 (lab-booking, nối tiếp c3/moc3) — Vitest 4.1.12 trên máy nhà 11/11 xanh (6 test cũ + 5 test mốc 4);
 * moc4/xem.sh trong container nst-run-* (nest build có plugin swagger): status=APPROVED ⇒ 400 problem+json có errors[]; hợp lệ ⇒ 6
 * trường; PATCH capacity giữ code/building; /docs 200; docs-json có required + securitySchemes api-key. grep Object.assign/...dto:
 * moc3 3 chỗ, moc4 0 chỗ.
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Dự án xuyên suốt', sub: 'Đề tài, 11 mốc và thang điểm 100 — mốc 4 nằm ở đâu trong lộ trình.', cta: 'Mở bài →' }),
].join('\n');

const MA_RDTO = "import { IsIn, IsInt, Matches, Max, Min } from 'class-validator';\n\nexport class CreateRoomDto {\n  /** Mã phòng, ví dụ AL-201 */\n  @Matches(/^[A-Z]{2}-\\d{3}$/, { message: 'code dạng AL-201' }) code: string;\n  @IsIn(['Alpha', 'Beta', 'Gamma', 'Delta']) building: string;\n  /** Sức chứa (người) */\n  @Max(200) @Min(1) @IsInt() capacity: number;\n}";
const MA_RUPD = "import { PartialType } from '@nestjs/swagger';      // bản của swagger: vừa giữ luật kiểm, vừa giữ mô tả tài liệu\nimport { CreateRoomDto } from './create-room.dto.js';\n\nexport class UpdateRoomDto extends PartialType(CreateRoomDto) {}";
const MA_RSVC = "  create(dto: CreateRoomDto): Room {\n    const room: Room = { id: this.nextId++, code: dto.code, building: dto.building, capacity: dto.capacity };\n    this.rooms.push(room);\n    return room;\n  }";
const MA_RSVC2 = "  update(id: number, dto: UpdateRoomDto): Room | undefined {\n    const room = this.findOne(id);\n    if (!room) return room;\n    // Chỉ chép trường client THỰC SỰ gửi (transform: true ⇒ trường không gửi vẫn là undefined trên instance)\n    if (dto.code !== undefined) room.code = dto.code;\n    if (dto.building !== undefined) room.building = dto.building;\n    if (dto.capacity !== undefined) room.capacity = dto.capacity;\n    return room;\n  }";
const MA_BDTO = "import { IsInt, IsOptional, IsString, Length, Matches, Max, Min, registerDecorator, ValidationArguments } from 'class-validator';\n\nconst ISO_CO_MUI = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?(Z|[+-]\\d{2}:\\d{2})$/;\n\n/** Ngày giờ có thật, có múi giờ, bước 30 phút. (\"Ở tương lai\" là luật theo đồng hồ ⇒ để service + Clock kiểm.) */\nfunction KhungGio() {\n  return (obj: object, prop: string) => registerDecorator({\n    name: 'khungGio', target: obj.constructor, propertyName: prop,\n    validator: {\n      validate(v: unknown) {\n        if (typeof v !== 'string' || !ISO_CO_MUI.test(v)) return false;\n        const t = new Date(v);\n        if (Number.isNaN(t.getTime())) return false;\n        const m = /([+-])(\\d{2}):(\\d{2})$/.exec(v), lech = m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +m[3]) : 0;\n        const tai = new Date(t.getTime() + lech * 60_000);                    // giờ \"trên đồng hồ\" tại múi đã ghi\n        if (tai.toISOString().slice(0, 10) !== v.slice(0, 10)) return false;  // 2027-02-30 bị Date đẩy sang 03-02\n        return t.getUTCMinutes() % 30 === 0 && t.getUTCSeconds() === 0;\n      },\n      defaultMessage: (a: ValidationArguments) => `${a.property}: cần ISO 8601 có múi giờ, ngày có thật, bước 30 phút`,\n    },\n  });\n}\n\nexport class CreateBookingDto {\n  @Min(1) @IsInt() roomId: number;\n  /** Mã số sinh viên, ví dụ SE170001 */\n  @Matches(/^SE\\d{6}$/, { message: 'studentId dạng SE + 6 chữ số' }) studentId: string;\n  /** Bắt đầu, ví dụ 2027-01-05T07:30:00+07:00 */\n  @KhungGio() start: string;\n  @KhungGio() end: string;\n  @Max(200) @Min(1) @IsInt() attendees: number;\n  @IsOptional() @Length(0, 300) @IsString() note?: string;\n}";
const MA_BRESP = "import { Exclude, Expose } from 'class-transformer';\n\n/** Những gì client thấy về một lượt đặt — mở từng trường (allow-list) */\n@Exclude()\nexport class BookingResponse {\n  @Expose() id: number;\n  @Expose() roomId: number;\n  @Expose() start: string;\n  @Expose() end: string;\n  @Expose() attendees: number;\n  @Expose() status: 'PENDING' | 'APPROVED' | 'REJECTED';\n}";
const MA_BCTL = "import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';\nimport { ApiSecurity } from '@nestjs/swagger';\nimport { BookingsService } from './bookings.service.js';\nimport { CreateBookingDto } from './dto/create-booking.dto.js';\nimport { BookingResponse } from './dto/booking.response.js';\n\n@ApiSecurity('api-key')\n@Controller('bookings')\n@UseInterceptors(ClassSerializerInterceptor)\n@SerializeOptions({ type: BookingResponse })       // bản ghi nội bộ ⇒ chỉ trường đã @Expose\nexport class BookingsController {\n  constructor(private readonly bookings: BookingsService) {}\n  /** Đặt một khung giờ (chờ duyệt) */\n  @Post() create(@Body() b: CreateBookingDto): BookingResponse { return this.bookings.create(b, 'api-key'); }\n  /** Lịch của một phòng */\n  @Get('room/:roomId') byRoom(@Param('roomId', ParseIntPipe) id: number): BookingResponse[] { return this.bookings.findByRoom(id); }\n}";
const MA_BSVC = "    const moi: Booking = {                      // ánh xạ tường minh: status/createdBy do server đặt\n      id: this.nextId++, roomId: b.roomId, studentId: b.studentId, start: b.start, end: b.end,\n      attendees: b.attendees, note: b.note, status: 'PENDING', createdBy,\n    };";
const MA_MOD = "    {\n      provide: APP_PIPE,                       // trong module ⇒ test nạp AppModule cũng có cùng cấu hình\n      useFactory: () => new ValidationPipe({\n        whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: true,\n        validationError: { target: false, value: false },\n      }),\n    },";
const MA_FILTER = "    const msg = typeof body === 'string' ? body : (body as any)?.message ?? (err as any)?.message;\n    const errors = Array.isArray(msg) ? msg : undefined;          // ValidationPipe trả mảng lỗi theo trường\n    const detail = status >= 500 ? 'Lỗi phía máy chủ — đã ghi log.' : errors ? 'Dữ liệu gửi lên không hợp lệ' : msg;";
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { AppModule } from './app.module.js';\n\nasync function bootstrap() {\n  const app = await NestFactory.create<NestExpressApplication>(AppModule);\n  app.useBodyParser('json', { limit: '16kb' });\n  if (process.env.NODE_ENV !== 'production') {\n    const doc = SwaggerModule.createDocument(app, new DocumentBuilder()\n      .setTitle('lab-booking API').setVersion('0.4.0')\n      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key').build());\n    SwaggerModule.setup('docs', app, doc);\n  }\n  await app.listen(process.env.PORT ?? 3000);\n}\nawait bootstrap();";
const NESTCLI = "{\n  \"$schema\": \"https://json.schemastore.org/nest-cli\",\n  \"collection\": \"@nestjs/schematics\",\n  \"sourceRoot\": \"src\",\n  \"compilerOptions\": {\n    \"deleteOutDir\": true,\n    \"plugins\": [{ \"name\": \"@nestjs/swagger\", \"options\": { \"introspectComments\": true, \"classValidatorShim\": true } }]\n  }\n}";
const MA_SPEC = "import 'reflect-metadata';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport type { INestApplication } from '@nestjs/common';\nimport { Clock } from './clock.module.js';\n\nprocess.env.API_KEYS = 'test-key';\nconst { AppModule } = await import('../app.module.js');\n\ndescribe('Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ', () => {\n  let app: INestApplication;\n  beforeAll(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] })\n      .overrideProvider(Clock).useValue({ now: () => new Date('2026-12-01T00:00:00Z') }).compile();\n    app = m.createNestApplication({ logger: false });\n    await app.init();\n  });\n  afterAll(() => app.close());\n  const http = () => request(app.getHttpServer());\n  const B = { roomId: 2, studentId: 'SE170001', start: '2027-01-06T07:30:00+07:00', end: '2027-01-06T09:30:00+07:00', attendees: 20 };\n\n  it('tự đặt status ⇒ 400, lỗi theo dạng problem+json có errors[]', async () => {\n    const r = await http().post('/bookings').set('x-api-key', 'test-key').send({ ...B, status: 'APPROVED' }).expect(400);\n    expect(r.headers['content-type']).toMatch(/problem\\+json/);\n    expect(r.body.errors).toEqual(['property status should not exist']);\n  });\n  it('ngày 30/02 và giờ không múi ⇒ 400 đúng trường', async () => {\n    const r = await http().post('/bookings').set('x-api-key', 'test-key')\n      .send({ ...B, start: '2027-02-30T07:30:00+07:00', end: '2027-01-06T09:30:00' }).expect(400);\n    expect(r.body.errors).toEqual([expect.stringMatching(/^start:/), expect.stringMatching(/^end:/)]);\n  });\n  it('hợp lệ ⇒ 201, status do server đặt, không lộ createdBy', async () => {\n    const r = await http().post('/bookings').set('x-api-key', 'test-key').send(B).expect(201);\n    expect(r.body).toEqual({ id: expect.any(Number), roomId: 2, start: B.start, end: B.end, attendees: 20, status: 'PENDING' });\n  });\n  it('PATCH phòng: không ghi đè id, trường không gửi giữ nguyên', async () => {\n    await http().patch('/rooms/1').set('x-api-key', 'test-key').send({ id: 99 }).expect(400);\n    const r = await http().patch('/rooms/1').set('x-api-key', 'test-key').send({ capacity: 35 }).expect(200);\n    expect(r.body).toEqual({ id: 1, code: 'AL-201', building: 'Alpha', capacity: 35 });\n  });\n  it('tạo phòng sai luật ⇒ 400', async () => {\n    const r = await http().post('/rooms').set('x-api-key', 'test-key').send({ code: 'al201', building: 'Omega', capacity: 0 }).expect(400);\n    expect(r.body.errors).toHaveLength(3);\n  });\n});";
const OUT_TEST = " RUN  v4.1.12 moc4\n ✓ 8:00 \"bây giờ\" ⇒ 7:30 là quá khứ 71ms\n ✓ hai lịch chạm mép không trùng (9:00 kết thúc, 9:00 bắt đầu) 3ms\n ✓ xem phòng không cần khoá (@Public) 25ms\n ✓ id không phải số ⇒ 400 problem+json, không còn 404 \"Room abc\" 7ms\n ✓ đặt lịch thiếu khoá ⇒ 401 8ms\n ✓ tự đặt status ⇒ 400, lỗi theo dạng problem+json có errors[] 37ms\n ✓ đặt trùng ⇒ 409 với mã BOOKING_CONFLICT 10ms\n ✓ ngày 30/02 và giờ không múi ⇒ 400 đúng trường 6ms\n ✓ hợp lệ ⇒ 201, status do server đặt, không lộ createdBy 4ms\n ✓ PATCH phòng: không ghi đè id, trường không gửi giữ nguyên 6ms\n ✓ tạo phòng sai luật ⇒ 400 3ms\n Test Files  3 passed (3)\n      Tests  11 passed (11)";
const OUT_CURL = "$ curl -s -XPOST localhost:3000/bookings $K -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20,\"status\":\"APPROVED\"}'\n{\"type\":\"https://lab-booking.example/errors/400\",\"title\":\"BadRequestException\",\"status\":400,\"detail\":\"Dữ liệu gửi lên không hợp lệ\",\"instance\":\"/bookings\",\"requestId\":\"bf17656e-ffcb-473e-8284-eead73be7819\",\"errors\":[\"property status should not exist\"]}\n$ curl -s -XPOST localhost:3000/bookings $K -d '{\"roomId\":1,\"studentId\":\"SE170001\",\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20}'\n{\"id\":1,\"roomId\":1,\"start\":\"2027-01-05T07:30:00+07:00\",\"end\":\"2027-01-05T09:30:00+07:00\",\"attendees\":20,\"status\":\"PENDING\"}";

export default {
  title: '4.6 — Project milestone 4: DTOs, validation and API docs for your topic|||4.6 — Mốc dự án 4: DTO, kiểm dữ liệu và tài liệu API cho đề tài',
  slug: 'nst-4-6-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc 4: mọi body có DTO class-validator, ValidationPipe toàn cục qua APP_PIPE (whitelist, forbid, transform), service chép từng trường thay vì Object.assign, DTO trả về theo danh sách cho phép, lỗi kiểm dữ liệu vào problem+json dưới dạng errors[], /docs có plugin CLI và khoá API. Ví dụ mẫu lab-booking chạy thật: 11 test xanh, grep Object.assign từ 3 chỗ còn 0, /docs-json có required và securitySchemes.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Project</span>
<h2>4.6 — Milestone 4: a contract that defends itself</h2>
<p class="lead">After milestone 3 your API has one error format, logs and a default-deny guard — but bodies are still typed with interfaces or <code>Omit&lt;Entity&gt;</code>, which (Lesson 4.1) means no validation at all. This milestone makes every input a validated DTO, every output an allow-list, and publishes the contract at <code>/docs</code>. The worked example applies it to lab-booking; do the same for your own topic.</p>

<h3>Steps</h3>
<ol>
<li><code>npm i @nestjs/swagger</code> (class-validator and class-transformer are already there from the Nest 12 template).</li>
<li>For each resource: <code>CreateXDto</code> with class-validator rules (type check closest to the name), <code>UpdateXDto = PartialType(CreateXDto)</code> from <code>@nestjs/swagger</code>. Every <code>@Body()</code> typed with a DTO class, imported as a value.</li>
<li>Register <code>ValidationPipe</code> with <code>APP_PIPE</code> in <code>AppModule</code>: <code>whitelist</code>, <code>forbidNonWhitelisted</code>, <code>transform</code>, <code>stopAtFirstError</code>, <code>validationError: { target: false, value: false }</code>.</li>
<li>Services copy fields explicitly; remove every <code>Object.assign(entity, dto)</code> and <code>{ ...dto }</code>. Server-owned fields (<code>status</code>, <code>createdBy</code>) are set by the service.</li>
<li>One response DTO per resource (<code>@Exclude()</code> class, <code>@Expose()</code> fields) applied with <code>@SerializeOptions({ type })</code>.</li>
<li>Make the milestone-3 <code>ProblemFilter</code> put validation messages into an <code>errors</code> array.</li>
<li>Swagger: plugin in <code>nest-cli.json</code>, <code>/docs</code> only outside production, the security scheme of your guard (API key now, bearer in Chapter 7). Body limit 16 KB.</li>
<li>e2e tests: unknown field → 400 with reason; bad date → 400 naming the field; valid → exact key list; PATCH one field keeps the others. Commit: <code>feat: DTO, kiểm dữ liệu, tài liệu API (mốc 4)</code>.</li>
</ol>

<h3>Worked example: lab-booking</h3>
<h4>Before (milestone 3)</h4>
<div class="out">$ grep -rnE 'Object.assign|\\.\\.\\.(dto|b)\\b|import type .*Dto' src/ --include='*.ts' | grep -v spec
src/rooms/rooms.service.ts:15:    const room = { id: this.nextId++, ...dto };
src/rooms/rooms.service.ts:27:    if (room) Object.assign(room, dto);      // ⚠ chương 4: DTO + whitelist, kẻo ghi đè cả id
src/bookings/bookings.service.ts:21:    const moi = { id: this.nextId++, ...b };</div>
<p>And <code>BookingsController.create(@Body() b: Omit&lt;Booking, 'id'&gt;)</code> — a type, not a class: everything was accepted.</p>

<h4>After (milestone 4)</h4>
<p>Rooms — rules, derived update DTO, explicit copying:</p>
<pre><code class="language-ts">${esc(MA_RDTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_RUPD)}</code></pre>
<pre><code class="language-ts">${esc(MA_RSVC)}
  // …
${esc(MA_RSVC2)}</code></pre>
<p>Bookings — the DTO keeps format rules; "not in the past" stays in the service with the injected <code>Clock</code> (milestone 2), so tests can fix the time:</p>
<pre><code class="language-ts">${esc(MA_BDTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_BRESP)}</code></pre>
<pre><code class="language-ts">${esc(MA_BCTL)}</code></pre>
<pre><code class="language-ts">// bookings.service.ts — trong create()
${esc(MA_BSVC)}</code></pre>
<p>Global pipe, filter change, main and plugin:</p>
<pre><code class="language-ts">// app.module.ts — providers
${esc(MA_MOD)}</code></pre>
<pre><code class="language-ts">// common/problem.filter.ts — trong catch()
${esc(MA_FILTER)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-json">${esc(NESTCLI)}</code></pre>

<h4>Tests and a real run</h4>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">$ npx vitest run --reporter=verbose
${esc(OUT_TEST)}</div>
<div class="out">$ K="-H 'x-api-key: admin-7c1e' -H 'content-type: application/json'"
${esc(OUT_CURL)}</div>
<div class="out">$ grep -rnE 'Object.assign|\\.\\.\\.(dto|b)\\b|import type .*Dto' src/ --include='*.ts' | grep -v spec; echo "(exit $?)"
(exit 1)</div>

<h4>The trap: the filter swallowed the messages</h4>
<p>Milestone 3's <code>ProblemFilter</code> put <code>body.message</code> into <code>detail</code>. For validation errors that is an <em>array</em>, so <code>detail</code> — a string in RFC 9457 — would have become a list: a typed client expecting a string breaks, and a banner that prints <code>detail</code> shows the messages glued with commas. The fix keeps <code>detail</code> a sentence and adds an <code>errors</code> extension member, which RFC 9457 allows. When you add a layer, re-check the layers around it.</p>

<h3>README section</h3>
<pre><code>## Hợp đồng API (mốc 4)
Tài liệu: GET /docs (giao diện), GET /docs-json (OpenAPI) — tắt khi NODE_ENV=production
Kiểm dữ liệu: ValidationPipe toàn cục (APP_PIPE): whitelist + forbidNonWhitelisted + transform; thân ≤ 16 KB
Lỗi kiểm dữ liệu: 400 application/problem+json, detail = câu chung, errors = [câu theo trường]
Ngày giờ: ISO 8601 BẮT BUỘC có múi giờ (…+07:00 hoặc …Z), bước 30 phút
Phản hồi: DTO danh sách cho phép (BookingResponse) — trường nội bộ (createdBy) không bao giờ ra ngoài</code></pre>

<div class="callout ok">
<p><strong>Self-check before committing:</strong> every <code>@Body()</code> uses a DTO class imported as a value; one request per route with an unknown field returns 400; PATCH with one field leaves the others unchanged (tested); no <code>Object.assign</code>/<code>...dto</code> left; every response type is a response DTO; <code>/docs-json</code> shows non-empty schemas with <code>required</code>; all old tests still green.</p>
</div>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Dự án</span>
<h2>4.6 — Mốc 4: hợp đồng tự bảo vệ mình</h2>
<p class="lead">Sau mốc 3, API của bạn có một dạng lỗi, có log và guard mặc định chặn — nhưng body vẫn khai kiểu bằng interface hoặc <code>Omit&lt;Entity&gt;</code>, mà (Bài 4.1) như vậy nghĩa là không kiểm gì cả. Mốc này biến mọi dữ liệu vào thành DTO đã kiểm, mọi dữ liệu ra thành danh sách cho phép, và công bố hợp đồng ở <code>/docs</code>. Ví dụ mẫu áp lên lab-booking; bạn làm tương tự cho đề tài của mình.</p>

<h3>Các bước</h3>
<ol>
<li><code>npm i @nestjs/swagger</code> (class-validator và class-transformer đã có sẵn từ mẫu Nest 12).</li>
<li>Mỗi tài nguyên: <code>CreateXDto</code> với luật class-validator (kiểm kiểu sát tên nhất), <code>UpdateXDto = PartialType(CreateXDto)</code> lấy từ <code>@nestjs/swagger</code>. Mọi <code>@Body()</code> có kiểu là class DTO, nhập như giá trị.</li>
<li>Đăng ký <code>ValidationPipe</code> bằng <code>APP_PIPE</code> trong <code>AppModule</code>: <code>whitelist</code>, <code>forbidNonWhitelisted</code>, <code>transform</code>, <code>stopAtFirstError</code>, <code>validationError: { target: false, value: false }</code>.</li>
<li>Service chép từng trường tường minh; xoá mọi <code>Object.assign(entity, dto)</code> và <code>{ ...dto }</code>. Trường do máy chủ quản (<code>status</code>, <code>createdBy</code>) do service đặt.</li>
<li>Mỗi tài nguyên một DTO trả về (class <code>@Exclude()</code>, trường <code>@Expose()</code>) áp bằng <code>@SerializeOptions({ type })</code>.</li>
<li>Sửa <code>ProblemFilter</code> của mốc 3 để thông báo kiểm dữ liệu nằm trong mảng <code>errors</code>.</li>
<li>Swagger: plugin trong <code>nest-cli.json</code>, <code>/docs</code> chỉ bật ngoài production, khai cơ chế bảo mật của guard (khoá API lúc này, bearer ở Chương 7). Giới hạn thân request 16 KB.</li>
<li>Test e2e: trường lạ → 400 có lý do; ngày sai → 400 nêu đúng trường; hợp lệ → đúng danh sách khoá; PATCH một trường giữ nguyên các trường khác. Commit: <code>feat: DTO, kiểm dữ liệu, tài liệu API (mốc 4)</code>.</li>
</ol>

<h3>Ví dụ mẫu: lab-booking</h3>
<h4>Trước (mốc 3)</h4>
<div class="out">$ grep -rnE 'Object.assign|\\.\\.\\.(dto|b)\\b|import type .*Dto' src/ --include='*.ts' | grep -v spec
src/rooms/rooms.service.ts:15:    const room = { id: this.nextId++, ...dto };
src/rooms/rooms.service.ts:27:    if (room) Object.assign(room, dto);      // ⚠ chương 4: DTO + whitelist, kẻo ghi đè cả id
src/bookings/bookings.service.ts:21:    const moi = { id: this.nextId++, ...b };</div>
<p>Và <code>BookingsController.create(@Body() b: Omit&lt;Booking, 'id'&gt;)</code> — một kiểu, không phải class: nhận tất tần tật.</p>

<h4>Sau (mốc 4)</h4>
<p>Phòng — luật, DTO sửa dẫn xuất, chép tường minh:</p>
<pre><code class="language-ts">${esc(MA_RDTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_RUPD)}</code></pre>
<pre><code class="language-ts">${esc(MA_RSVC)}
  // …
${esc(MA_RSVC2)}</code></pre>
<p>Lịch đặt — DTO giữ luật định dạng; "không ở quá khứ" vẫn ở service với <code>Clock</code> được tiêm (mốc 2), để test cố định được giờ:</p>
<pre><code class="language-ts">${esc(MA_BDTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_BRESP)}</code></pre>
<pre><code class="language-ts">${esc(MA_BCTL)}</code></pre>
<pre><code class="language-ts">// bookings.service.ts — trong create()
${esc(MA_BSVC)}</code></pre>
<p>Pipe toàn cục, sửa filter, main và plugin:</p>
<pre><code class="language-ts">// app.module.ts — providers
${esc(MA_MOD)}</code></pre>
<pre><code class="language-ts">// common/problem.filter.ts — trong catch()
${esc(MA_FILTER)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<pre><code class="language-json">${esc(NESTCLI)}</code></pre>

<h4>Test và một lần chạy thật</h4>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">$ npx vitest run --reporter=verbose
${esc(OUT_TEST)}</div>
<div class="out">$ K="-H 'x-api-key: admin-7c1e' -H 'content-type: application/json'"
${esc(OUT_CURL)}</div>
<div class="out">$ grep -rnE 'Object.assign|\\.\\.\\.(dto|b)\\b|import type .*Dto' src/ --include='*.ts' | grep -v spec; echo "(exit $?)"
(exit 1)</div>

<h4>Cái bẫy: filter nuốt mất thông báo</h4>
<p><code>ProblemFilter</code> của mốc 3 đưa <code>body.message</code> vào <code>detail</code>. Với lỗi kiểm dữ liệu, đó là một <em>mảng</em>, nên <code>detail</code> — theo RFC 9457 là một chuỗi — sẽ thành danh sách: client có kiểu chờ một chuỗi sẽ hỏng, còn dải báo lỗi in thẳng <code>detail</code> thì ra các câu dính nhau bằng dấu phẩy. Bản sửa giữ <code>detail</code> là một câu và thêm trường mở rộng <code>errors</code>, thứ RFC 9457 cho phép. Thêm một lớp thì kiểm lại các lớp xung quanh.</p>

<h3>Phần README</h3>
<pre><code>## Hợp đồng API (mốc 4)
Tài liệu: GET /docs (giao diện), GET /docs-json (OpenAPI) — tắt khi NODE_ENV=production
Kiểm dữ liệu: ValidationPipe toàn cục (APP_PIPE): whitelist + forbidNonWhitelisted + transform; thân ≤ 16 KB
Lỗi kiểm dữ liệu: 400 application/problem+json, detail = câu chung, errors = [câu theo trường]
Ngày giờ: ISO 8601 BẮT BUỘC có múi giờ (…+07:00 hoặc …Z), bước 30 phút
Phản hồi: DTO danh sách cho phép (BookingResponse) — trường nội bộ (createdBy) không bao giờ ra ngoài</code></pre>

<div class="callout ok">
<p><strong>Tự kiểm trước khi commit:</strong> mọi <code>@Body()</code> dùng class DTO nhập như giá trị; mỗi route có một request mang trường lạ trả 400; PATCH một trường giữ nguyên các trường khác (có test); không còn <code>Object.assign</code>/<code>...dto</code>; mọi kiểu trả về là DTO trả về; <code>/docs-json</code> có schema không rỗng với <code>required</code>; mọi test cũ vẫn xanh.</p>
</div>
${THE}
</div>
`,
};
