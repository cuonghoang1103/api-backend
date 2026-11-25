/**
 * 3.3 — Pipe (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c3/app/src/b33:
 * pipe.ts (23 request: không pipe ⇒ "21"; ParseIntPipe từ chối 7.5/1e3 nhưng làm tròn 9007199254740993 ⇒ …992 KHÔNG báo;
 * DefaultValuePipe đặt sai thứ tự ⇒ 400; UUID v4, enum, bool chặt, mảng; ParseDatePipe từ chối 30/02, ngày trần ⇒ nửa đêm UTC;
 * KhungGioPipe tự viết + trích input có giới hạn 20 ký tự; RoomByIdPipe có DI ⇒ 404), bt.ts (ParseIdPipe: số nguyên dương an toàn).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'API Design 6.2 — Phân quyền theo đối tượng (BOLA)', sub: 'Tải bản ghi theo id mà không kiểm chủ sở hữu — lỗ hổng số 1 của API.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Pipes', 'Pipe dựng sẵn, gắn ở tham số/route/toàn cục, pipe tự viết, ArgumentMetadata.', 'https://docs.nestjs.com/pipes'),
  nguon('📘', 'MDN — Number.MAX_SAFE_INTEGER', 'Vì sao 9007199254740993 không biểu diễn được bằng number.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER'),
].join('\n');

const GAN = `@Get(':id') one(@Param('id', ParseIntPipe) id: number)        // một tham số
@Get() @UsePipes(MyPipe) list(@Query() q: object)               // mọi tham số của route
@Controller('rooms') @UsePipes(MyPipe) class RoomsController    // mọi route của controller
{ provide: APP_PIPE, useClass: ValidationPipe }                 // toàn cục, có DI (chương 4)`;
const MA_PIPE = "import 'reflect-metadata';\nimport {\n  ArgumentMetadata, BadRequestException, Controller, DefaultValuePipe, Get, Injectable, Module, NotFoundException, Param,\n  ParseArrayPipe, ParseBoolPipe, ParseDatePipe, ParseEnumPipe, ParseIntPipe, ParseUUIDPipe, PipeTransform, Query,\n} from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n\nenum TrangThai { cho = 'cho', duyet = 'duyet', huy = 'huy' }\n\n// Pipe tự viết: \"08:00-10:30\" ⇒ { tu: 480, den: 630 } (phút trong ngày), kèm luật nghiệp vụ của phòng lab\n@Injectable()\nexport class KhungGioPipe implements PipeTransform<string, { tu: number; den: number }> {\n  transform(v: string, meta: ArgumentMetadata) {\n    const m = /^(\\d{2}):(\\d{2})-(\\d{2}):(\\d{2})$/.exec(v ?? '');\n    if (!m) throw new BadRequestException(`${meta.data}: cần dạng HH:MM-HH:MM, nhận \"${String(v).slice(0, 20)}\"`);   // trích lại có giới hạn\n    const [tu, den] = [+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]];\n    if (tu % 30 || den % 30) throw new BadRequestException(`${meta.data}: phòng lab đặt theo bước 30 phút`);\n    if (tu >= den) throw new BadRequestException(`${meta.data}: giờ bắt đầu phải trước giờ kết thúc`);\n    if (tu < 7 * 60 || den > 21 * 60) throw new BadRequestException(`${meta.data}: phòng mở 07:00–21:00`);\n    return { tu, den };\n  }\n}\n\n// Pipe CÓ DI: đổi id thành bản ghi phòng (tra \"DB\"); không thấy ⇒ 404\n@Injectable() class RoomsRepo { private rooms = new Map([[1, { id: 1, ten: 'Lab 401' }]]); find(id: number) { return this.rooms.get(id); } }\n@Injectable()\nclass RoomByIdPipe implements PipeTransform<number> {\n  constructor(private readonly repo: RoomsRepo) {}\n  transform(id: number) { const r = this.repo.find(id); if (!r) throw new NotFoundException(`Không có phòng ${id}`); return r; }\n}\n\n@Controller()\nclass C {\n  @Get('tho') tho(@Query('page') page: number) { return { typeof: typeof page, 'page + 1': page + 1 }; }   // KHÔNG pipe\n  @Get('rooms/:id') one(@Param('id', ParseIntPipe) id: number) { return { id, typeof: typeof id }; }\n  @Get('ds') ds(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) { return { page }; }\n  @Get('ds-nguoc') dsNguoc(@Query('page', ParseIntPipe, new DefaultValuePipe(1)) page: number) { return { page }; }\n  @Get('bookings/:id') bk(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) { return { id }; }\n  @Get('loc') loc(\n    @Query('trangThai', new ParseEnumPipe(TrangThai)) tt: TrangThai,\n    @Query('conTrong', new ParseBoolPipe({ optional: true })) conTrong?: boolean,\n    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',', optional: true })) ids?: number[],\n  ) { return { tt, conTrong, ids }; }\n  @Get('ngay/:d') ngay(@Param('d', ParseDatePipe) d: Date) { return { iso: d.toISOString() }; }\n  @Get('dat') dat(@Query('khung', KhungGioPipe) k: { tu: number; den: number }) { return k; }\n  @Get('phong/:id') phong(@Param('id', ParseIntPipe, RoomByIdPipe) room: object) { return room; }\n}\n@Module({ controllers: [C], providers: [RoomsRepo] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nfor (const u of process.argv.slice(2)) {\n  const r = await fetch('http://127.0.0.1:3000' + u);\n  const hien = u.length > 50 ? u.slice(0, 22) + `…(${u.length} ký tự)` : u;\n  console.log(`GET ${hien.padEnd(34)} → ${r.status} ${await r.text()}`);\n}\nawait app.close();";
const OUT_PIPE = "GET /tho?page=2                        → 200 {\"typeof\":\"string\",\"page + 1\":\"21\"}\nGET /rooms/7                           → 200 {\"id\":7,\"typeof\":\"number\"}\nGET /rooms/abc                         → 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/7.5                         → 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/1e3                         → 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/9007199254740993            → 200 {\"id\":9007199254740992,\"typeof\":\"number\"}\nGET /ds                                → 200 {\"page\":1}\nGET /ds?page=3                         → 200 {\"page\":3}\nGET /ds-nguoc                          → 400 {\"message\":\"Validation failed (numeric string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /bookings/123                      → 400 {\"message\":\"Validation failed (uuid v 4 is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /bookings/9b2f6c3e-8a41-4d6e-b0c2-1f3a5d7e9c10 → 200 {\"id\":\"9b2f6c3e-8a41-4d6e-b0c2-1f3a5d7e9c10\"}\nGET /loc?trangThai=duyet&conTrong=true&ids=1,2,3 → 200 {\"tt\":\"duyet\",\"conTrong\":true,\"ids\":[1,2,3]}\nGET /loc?trangThai=xong                → 400 {\"message\":\"Validation failed (enum string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /loc?trangThai=cho&conTrong=1      → 400 {\"message\":\"Validation failed (boolean string is expected)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /ngay/2026-11-24                   → 200 {\"iso\":\"2026-11-24T00:00:00.000Z\"}\nGET /ngay/2026-02-30                   → 400 {\"message\":\"Validation failed (invalid date format)\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /dat?khung=08:00-10:30             → 200 {\"tu\":480,\"den\":630}\nGET /dat?khung=08:15-09:00             → 400 {\"message\":\"khung: phòng lab đặt theo bước 30 phút\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /dat?khung=20:00-22:00             → 400 {\"message\":\"khung: phòng mở 07:00–21:00\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /dat?khung=8h-10h                  → 400 {\"message\":\"khung: cần dạng HH:MM-HH:MM, nhận \\\"8h-10h\\\"\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /dat?khung=AAAAAAAAAAA…(311 ký tự) → 400 {\"message\":\"khung: cần dạng HH:MM-HH:MM, nhận \\\"AAAAAAAAAAAAAAAAAAAA\\\"\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /phong/1                           → 200 {\"id\":1,\"ten\":\"Lab 401\"}\nGET /phong/2                           → 404 {\"message\":\"Không có phòng 2\",\"error\":\"Not Found\",\"statusCode\":404}";
const MA_BT = "import 'reflect-metadata';\nimport { BadRequestException, Controller, Get, Injectable, Module, Param, PipeTransform } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n\n@Injectable()\nexport class ParseIdPipe implements PipeTransform<string, number> {\n  transform(v: string) {\n    if (!/^[1-9]\\d*$/.test(v)) throw new BadRequestException('id phải là số nguyên dương, không có số 0 đứng đầu');\n    const n = Number(v);\n    if (!Number.isSafeInteger(n)) throw new BadRequestException('id vượt Number.MAX_SAFE_INTEGER — dùng chuỗi/BigInt');\n    return n;\n  }\n}\n@Controller('rooms') class C { @Get(':id') one(@Param('id', ParseIdPipe) id: number) { return { id }; } }\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nfor (const u of ['7', '0', '007', '-3', '9007199254740991', '9007199254740993']) {\n  const r = await fetch('http://127.0.0.1:3000/rooms/' + u);\n  console.log(`GET /rooms/${u.padEnd(17)} → ${r.status} ${await r.text()}`);\n}\nawait app.close();";
const OUT_BT = "GET /rooms/7                 → 200 {\"id\":7}\nGET /rooms/0                 → 400 {\"message\":\"id phải là số nguyên dương, không có số 0 đứng đầu\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/007               → 400 {\"message\":\"id phải là số nguyên dương, không có số 0 đứng đầu\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/-3                → 400 {\"message\":\"id phải là số nguyên dương, không có số 0 đứng đầu\",\"error\":\"Bad Request\",\"statusCode\":400}\nGET /rooms/9007199254740991  → 200 {\"id\":9007199254740991}\nGET /rooms/9007199254740993  → 400 {\"message\":\"id vượt Number.MAX_SAFE_INTEGER — dùng chuỗi/BigInt\",\"error\":\"Bad Request\",\"statusCode\":400}";

export default {
  title: '3.3 — Pipes: ParseIntPipe, ParseUUIDPipe, default values and custom pipes|||3.3 — Pipe: ParseIntPipe, ParseUUIDPipe, giá trị mặc định và pipe tự viết',
  slug: 'nst-3-3-pipe',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Pipe biến đổi và kiểm tham số trước khi vào handler. Chạy thật 23 request: kiểu number trên tham số chỉ là lời hứa (page + 1 = "21"); ParseIntPipe chặt với 7.5 và 1e3 nhưng lặng lẽ làm tròn 9007199254740993; DefaultValuePipe đặt sai thứ tự thành 400; UUID v4, enum, bool, mảng; ParseDatePipe từ chối 30/02 nhưng ngày trần là nửa đêm UTC. Tự viết KhungGioPipe với luật phòng lab và pipe có DI đổi id thành bản ghi. Bài tập: ParseIdPipe an toàn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>3.3 — Pipes: turn strings into values you can trust</h2>
<p class="lead">Everything in a URL is a string. A pipe sits right before the handler, receives each argument, and either returns a transformed value (string → number, Date, a record) or throws — usually a 400. After pipes, the handler can assume its parameters are what their types say. Chapter 4 uses the most important pipe, <code>ValidationPipe</code>, for request bodies; this lesson covers the mechanism with simple values.</p>

<h3>Everyday analogy: the currency exchange counter</h3>
<p>You hand over cash in whatever form you have; the counter checks it is real, converts it, and gives you exactly the currency the shop accepts — or refuses and tells you why. The shop (handler) never handles a fake note or the wrong currency.</p>

<h3>Experiment — 23 requests against built-in and custom pipes</h3>
<pre><code class="language-ts">${esc(MA_PIPE)}</code></pre>
<div class="out">${esc(OUT_PIPE)}</div>

<h4>1. A type annotation is a promise, not a check</h4>
<p><code>@Query('page') page: number</code> without a pipe: <code>typeof</code> is <code>string</code> and <code>page + 1</code> is <code>"21"</code>. TypeScript types disappear at runtime; nothing converted anything. This bug reaches production as "page 2 returns page 21" or "price + tax" concatenated.</p>

<h4>2. ParseIntPipe is strict — except where it is not</h4>
<p><code>abc</code>, <code>7.5</code>, <code>1e3</code> are rejected with a clear 400. But <code>9007199254740993</code> came back as <code>9007199254740992</code> with status 200: beyond <code>Number.MAX_SAFE_INTEGER</code> (2<sup>53</sup> − 1) a JavaScript number cannot represent every integer, so the value was silently rounded to a <em>different id</em>. If your database uses <code>BIGINT</code> ids (Twitter/Snowflake-style ids are much larger), keep them as strings end to end. The exercise below writes a pipe that refuses instead of rounding.</p>

<h4>3. Order matters: <code>DefaultValuePipe</code> first</h4>
<p>Pipes on one parameter run left to right. <code>(new DefaultValuePipe(1), ParseIntPipe)</code>: missing <code>page</code> becomes 1, then is parsed. Reversed, <code>ParseIntPipe</code> sees <code>undefined</code> and returns 400 for a request that should have worked.</p>

<h4>4. The other built-ins</h4>
<ul>
<li><code>ParseUUIDPipe({ version: '4' })</code> — reject malformed ids before they reach the database (a malformed UUID in a PostgreSQL <code>uuid</code> column is a 500, not a 404).</li>
<li><code>ParseEnumPipe</code>, <code>ParseArrayPipe({ items: Number, separator: ',' })</code>.</li>
<li><code>ParseBoolPipe</code> accepts only <code>true</code>/<code>false</code>; <code>conTrong=1</code> is a 400. Decide whether that is what your frontend sends.</li>
<li><code>ParseDatePipe</code> rejects <code>2026-02-30</code> (it checks the day exists). But <code>2026-11-24</code> became <code>2026-11-24T00:00:00.000Z</code> — midnight <strong>UTC</strong>, which is 07:00 in Vietnam. For a booking system, "the 24th" in the user's mind and in your database may differ by seven hours. Send full ISO timestamps with an offset, or treat dates as plain <code>YYYY-MM-DD</code> strings.</li>
</ul>

<h4>5. A custom pipe with business rules</h4>
<p><code>KhungGioPipe</code> implements <code>PipeTransform</code>: parse <code>08:00-10:30</code> into minutes, and enforce the lab's rules — 30-minute steps, start before end, open 07:00–21:00. <code>ArgumentMetadata.data</code> gives the parameter name for the message. Note the 311-character input: the message quotes at most 20 characters. Quoting user input in an error is fine; quoting all of it, unescaped, into HTML or logs is how error paths become attack paths (lesson 3.2).</p>
<p>Should this rule live in a pipe or in the service? Format checks (is this a time range at all?) belong in the pipe. Rules that may change per room or need the database ("this room closes at 17:00 on Saturdays") belong in the service.</p>

<h4>6. A pipe with DI: id → record</h4>
<p><code>RoomByIdPipe</code> is <code>@Injectable()</code>, receives <code>RoomsRepo</code>, and turns an id into a room or a 404. Chaining <code>(ParseIntPipe, RoomByIdPipe)</code> gives the handler a ready object. Convenient, with two cautions: a database query now hides in a decorator, and loading "room 2" says nothing about whether <em>this user</em> may see room 2 — the classic broken object-level authorization. Keep ownership checks explicit in the service.</p>

<h3>Where to bind pipes</h3>
<pre><code class="language-ts">${esc(GAN)}</code></pre>
<p>Pipes run <strong>after guards</strong> and after the "before" part of interceptors (lesson 3.6). So an unauthenticated request with a bad id gets 401, not 400 — you do not tell strangers which ids are well-formed.</p>

<h3>🧪 Exercise (15 min)</h3>
<p>Write <code>ParseIdPipe</code>: accept only positive integers without leading zeros, and refuse — instead of rounding — anything beyond <code>Number.MAX_SAFE_INTEGER</code>.</p>
<details><summary>Show answer</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>The regex rules out <code>0</code>, <code>007</code> and <code>-3</code>; <code>Number.isSafeInteger</code> catches precision loss. <code>9007199254740991</code> (exactly the maximum) still passes.</p>
</details>

<h3>💼 On the job</h3>
<p>"Page 2 shows page 21" and "the booking for the 24th shows up on the 23rd" are both real-world bug reports of exactly the two traps above. In code review, any <code>@Query()</code> or <code>@Param()</code> typed as <code>number</code>, <code>boolean</code> or <code>Date</code> without a pipe (or a global <code>ValidationPipe</code> with <code>transform</code>, Chapter 4) is worth a comment.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PipeTransform</span><span class="v">Interface of a pipe: <code>transform(value, metadata)</code> returns the new value or throws.</span></div>
  <div class="kv"><span class="k">ArgumentMetadata</span><span class="v"><code>type</code> (body/query/param/custom), <code>data</code> (parameter name), <code>metatype</code> (declared type).</span></div>
  <div class="kv"><span class="k">DefaultValuePipe</span><span class="v">Replaces <code>undefined</code>/<code>null</code> with a default; put it first.</span></div>
  <div class="kv"><span class="k">MAX_SAFE_INTEGER</span><span class="v">2<sup>53</sup> − 1; beyond it a JS number silently loses integer precision.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Without a pipe, every route parameter is a string, whatever its TypeScript type says.</li>
<li>Built-in pipes cover int, float, bool, UUID, enum, array, date; they return clear 400s.</li>
<li>Watch the gaps: big ids are rounded silently; bare dates mean midnight UTC.</li>
<li>Pipes on one parameter run left to right; <code>DefaultValuePipe</code> goes first.</li>
<li>Custom pipes for format rules; business rules that change belong in services; a pipe that loads records does not check ownership.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>3.3 — Pipe: biến chuỗi thành giá trị tin được</h2>
<p class="lead">Mọi thứ trong URL đều là chuỗi. Pipe đứng ngay trước handler, nhận từng tham số, rồi hoặc trả về giá trị đã biến đổi (chuỗi → số, Date, một bản ghi), hoặc ném lỗi — thường là 400. Qua pipe rồi, handler được quyền tin tham số đúng như kiểu đã khai. Chương 4 dùng pipe quan trọng nhất, <code>ValidationPipe</code>, cho body; bài này học cơ chế với các giá trị đơn giản.</p>

<h3>Liên hệ đời thường: quầy đổi tiền</h3>
<p>Bạn đưa tiền mặt ở dạng nào cũng được; quầy kiểm thật giả, quy đổi, rồi đưa đúng loại tiền cửa hàng nhận — hoặc từ chối và nói lý do. Cửa hàng (handler) không bao giờ phải cầm tờ tiền giả hay sai loại.</p>

<h3>Thí nghiệm — 23 request qua pipe dựng sẵn và pipe tự viết</h3>
<pre><code class="language-ts">${esc(MA_PIPE)}</code></pre>
<div class="out">${esc(OUT_PIPE)}</div>

<h4>1. Khai kiểu là lời hứa, không phải bước kiểm</h4>
<p><code>@Query('page') page: number</code> không có pipe: <code>typeof</code> là <code>string</code> và <code>page + 1</code> ra <code>"21"</code>. Kiểu TypeScript biến mất lúc chạy; chẳng có gì chuyển đổi cả. Lỗi này lên production thành "bấm trang 2 ra trang 21", hoặc "giá + thuế" bị nối chuỗi.</p>

<h4>2. ParseIntPipe chặt — trừ chỗ nó không chặt</h4>
<p><code>abc</code>, <code>7.5</code>, <code>1e3</code> bị từ chối với 400 rõ ràng. Nhưng <code>9007199254740993</code> quay về thành <code>9007199254740992</code> với status 200: vượt <code>Number.MAX_SAFE_INTEGER</code> (2<sup>53</sup> − 1), số JavaScript không biểu diễn được mọi số nguyên, nên giá trị bị làm tròn lặng lẽ thành <em>một id khác</em>. Nếu cơ sở dữ liệu dùng id <code>BIGINT</code> (id kiểu Twitter/Snowflake lớn hơn nhiều), hãy giữ id là chuỗi từ đầu tới cuối. Bài tập bên dưới viết pipe từ chối thay vì làm tròn.</p>

<h4>3. Thứ tự quan trọng: <code>DefaultValuePipe</code> đứng trước</h4>
<p>Các pipe trên một tham số chạy từ trái sang phải. <code>(new DefaultValuePipe(1), ParseIntPipe)</code>: thiếu <code>page</code> thì thành 1, rồi mới phân tích. Đảo ngược, <code>ParseIntPipe</code> gặp <code>undefined</code> và trả 400 cho một request lẽ ra phải chạy.</p>

<h4>4. Các pipe dựng sẵn khác</h4>
<ul>
<li><code>ParseUUIDPipe({ version: '4' })</code> — chặn id sai dạng trước khi tới cơ sở dữ liệu (UUID sai dạng đưa vào cột <code>uuid</code> của PostgreSQL là lỗi 500, không phải 404).</li>
<li><code>ParseEnumPipe</code>, <code>ParseArrayPipe({ items: Number, separator: ',' })</code>.</li>
<li><code>ParseBoolPipe</code> chỉ nhận <code>true</code>/<code>false</code>; <code>conTrong=1</code> là 400. Hãy hỏi frontend xem họ gửi gì.</li>
<li><code>ParseDatePipe</code> từ chối <code>2026-02-30</code> (nó kiểm ngày có thật). Nhưng <code>2026-11-24</code> thành <code>2026-11-24T00:00:00.000Z</code> — nửa đêm <strong>UTC</strong>, tức 7 giờ sáng ở Việt Nam. Với hệ thống đặt lịch, "ngày 24" trong đầu người dùng và trong cơ sở dữ liệu có thể lệch bảy tiếng. Gửi thời điểm ISO đầy đủ kèm múi giờ, hoặc coi ngày là chuỗi <code>YYYY-MM-DD</code> thuần.</li>
</ul>

<h4>5. Pipe tự viết mang luật nghiệp vụ</h4>
<p><code>KhungGioPipe</code> cài <code>PipeTransform</code>: tách <code>08:00-10:30</code> thành phút, và áp luật của phòng lab — bước 30 phút, bắt đầu trước kết thúc, mở 07:00–21:00. <code>ArgumentMetadata.data</code> cho tên tham số để ghi vào thông báo. Để ý input 311 ký tự: thông báo chỉ trích tối đa 20 ký tự. Trích lại input trong lỗi thì được; trích toàn bộ, không thoát ký tự, vào HTML hay log là cách đường lỗi thành đường tấn công (bài 3.2).</p>
<p>Luật này nên ở pipe hay ở service? Kiểm định dạng (có phải khung giờ không?) thuộc về pipe. Luật có thể đổi theo phòng hoặc cần cơ sở dữ liệu ("phòng này thứ Bảy đóng lúc 17:00") thuộc về service.</p>

<h4>6. Pipe có DI: id → bản ghi</h4>
<p><code>RoomByIdPipe</code> có <code>@Injectable()</code>, nhận <code>RoomsRepo</code>, đổi id thành phòng hoặc 404. Nối <code>(ParseIntPipe, RoomByIdPipe)</code> là handler nhận sẵn object. Tiện, nhưng có hai điều cần dè chừng: một truy vấn cơ sở dữ liệu giờ nấp trong decorator, và tải được "phòng 2" không nói gì về việc <em>người này</em> có được xem phòng 2 không — đúng lỗi kinh điển phân quyền theo đối tượng (BOLA). Giữ bước kiểm chủ sở hữu tường minh trong service.</p>

<h3>Gắn pipe ở đâu</h3>
<pre><code class="language-ts">${esc(GAN)}</code></pre>
<p>Pipe chạy <strong>sau guard</strong> và sau phần "trước" của interceptor (bài 3.6). Vì vậy request chưa xác thực mà id sai nhận 401, không phải 400 — không nói cho người lạ biết id nào đúng dạng.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Viết <code>ParseIdPipe</code>: chỉ nhận số nguyên dương không có số 0 đứng đầu, và từ chối — thay vì làm tròn — mọi số vượt <code>Number.MAX_SAFE_INTEGER</code>.</p>
<details><summary>Xem đáp án</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Biểu thức chính quy loại <code>0</code>, <code>007</code> và <code>-3</code>; <code>Number.isSafeInteger</code> bắt chỗ mất độ chính xác. <code>9007199254740991</code> (đúng bằng giới hạn) vẫn qua.</p>
</details>

<h3>💼 Đi làm thật</h3>
<p>"Bấm trang 2 ra trang 21" và "lịch ngày 24 hiện ở ngày 23" đều là báo lỗi thật ngoài đời của đúng hai bẫy trên. Khi review mã, mọi <code>@Query()</code> hay <code>@Param()</code> khai kiểu <code>number</code>, <code>boolean</code> hoặc <code>Date</code> mà không có pipe (hoặc <code>ValidationPipe</code> toàn cục có <code>transform</code>, Chương 4) đều đáng một bình luận.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PipeTransform</span><span class="v">Interface của pipe: <code>transform(value, metadata)</code> trả giá trị mới hoặc ném lỗi.</span></div>
  <div class="kv"><span class="k">ArgumentMetadata</span><span class="v"><code>type</code> (body/query/param/custom), <code>data</code> (tên tham số), <code>metatype</code> (kiểu đã khai).</span></div>
  <div class="kv"><span class="k">DefaultValuePipe</span><span class="v">Thay <code>undefined</code>/<code>null</code> bằng giá trị mặc định; đặt đầu tiên.</span></div>
  <div class="kv"><span class="k">MAX_SAFE_INTEGER</span><span class="v">2<sup>53</sup> − 1; vượt mức này số JS mất độ chính xác số nguyên mà không báo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có pipe, mọi tham số route là chuỗi, mặc kệ kiểu TypeScript nói gì.</li>
<li>Pipe dựng sẵn lo int, float, bool, UUID, enum, mảng, ngày; trả 400 rõ ràng.</li>
<li>Coi chừng kẽ hở: id lớn bị làm tròn lặng lẽ; ngày trần nghĩa là nửa đêm UTC.</li>
<li>Pipe trên một tham số chạy trái sang phải; <code>DefaultValuePipe</code> đứng đầu.</li>
<li>Pipe tự viết cho luật định dạng; luật nghiệp vụ hay đổi thuộc service; pipe tải bản ghi không kiểm chủ sở hữu.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
