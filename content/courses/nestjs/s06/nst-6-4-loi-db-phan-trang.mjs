/**
 * 6.4 — Lỗi cơ sở dữ liệu và danh sách: trùng → 409, không thấy → 404, phân trang (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Prisma 7.10.1, Nest 12.6.0, PostgreSQL 16.16): b64/app.ts KICH=tran (không filter ⇒ 500 "Internal server error",
 * log có P2002 + originalCode 23505 + tên ràng buộc), ngay-tho (filter trả e.message ⇒ lộ tên ràng buộc Room_code_key, Booking_roomId_fkey,
 * câu "Invalid prisma.room.create() invocation"), dung (PrismaErrorFilter: 409 / 404 / 409; phân trang con trỏ 2+2+1, limit=1000000 ⇒ 400).
 * b64/bt-typeorm.ts: cùng bảng theo SQLSTATE 23505/23503 + EntityNotFoundError ⇒ 201, 409, 404.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-3-1-offset', title: 'API Design 3.1 — Phân trang offset và vấn đề của nó', sub: 'Trùng dòng, trang sâu chậm — đo thật, bài này không đo lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-3-2-cursor', title: 'API Design 3.2 — Phân trang con trỏ làm cho đúng', sub: 'Con trỏ mờ, keyset — thiết kế hợp đồng của endpoint danh sách.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-12-2-bay-hinh-dang', title: 'Prisma ORM 12.2 — Bảy hình dáng hỏng hóc, phân biệt bằng mã lỗi', sub: 'Đủ các mã P1xxx/P2xxx và cách đọc chúng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-2-exception-filter', title: 'NestJS 3.2 — Exception filter', sub: 'Filter, @Catch và problem+json — phần nền của bài này.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'OWASP API8:2023 — Security Misconfiguration', 'Thông báo lỗi chi tiết lộ ra ngoài là một mục của API8.', 'https://owasp.org/API-Security/editions/2023/en/0xa8-security-misconfiguration/'),
].join('\n');
const MA_FILTER = "// prisma-error.filter.ts — lỗi Prisma đã biết ⇒ mã HTTP đúng, không lộ câu chữ nội bộ\nimport { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';\nimport type { Response } from 'express';\nimport { Prisma } from '../generated/prisma/client.js';\n\nconst BANG: Record<string, [number, string, string]> = {\n  P2002: [HttpStatus.CONFLICT, 'UNIQUE_VIOLATION', 'Giá trị đã tồn tại'],\n  P2025: [HttpStatus.NOT_FOUND, 'NOT_FOUND', 'Không tìm thấy bản ghi'],\n  P2003: [HttpStatus.CONFLICT, 'STILL_REFERENCED', 'Bản ghi đang được tham chiếu'],\n  P2000: [HttpStatus.BAD_REQUEST, 'VALUE_TOO_LONG', 'Giá trị quá dài'],\n};\n\n@Catch(Prisma.PrismaClientKnownRequestError)\nexport class PrismaErrorFilter implements ExceptionFilter {\n  private readonly log = new Logger('PrismaErrorFilter');\n  catch(e: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {\n    const res = host.switchToHttp().getResponse<Response>();\n    const map = BANG[e.code];\n    if (!map) {                                                  // mã lạ: 500, chi tiết chỉ vào log\n      this.log.error(`${e.code} ${e.message.split('\\n').filter(Boolean).at(-1)}`);\n      return res.status(500).type('application/problem+json').json({ status: 500, title: 'Internal Server Error' });\n    }\n    const [status, code, title] = map;\n    res.status(status).type('application/problem+json').json({ status, code, title });   // không gửi e.message ra ngoài\n  }\n}";
const MA_APP = "class CreateRoomDto { @IsString() code: string; @IsInt() @Min(1) capacity: number; }\nclass PageQuery {\n  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;     // trần 100: không ai kéo cả bảng\n  @IsOptional() @Type(() => Number) @IsInt() @Min(1) cursor?: number;          // id cuối của trang trước\n}\n\n@Controller()\nclass AppController {\n  constructor(private readonly db: PrismaService) {}\n  @Post('rooms') create(@Body() b: CreateRoomDto) { return this.db.room.create({ data: b }); }\n  @Get('rooms/:id') one(@Param('id', ParseIntPipe) id: number) { return this.db.room.findUniqueOrThrow({ where: { id } }); }\n  @Delete('rooms/:id') del(@Param('id', ParseIntPipe) id: number) { return this.db.room.delete({ where: { id } }); }\n  @Get('bookings') async page(@Query() q: PageQuery) {\n    const rows = await this.db.booking.findMany({\n      take: q.limit + 1, orderBy: { id: 'asc' },                              // lấy dư 1 để biết còn trang sau không\n      ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}),\n      select: { id: true, roomId: true, start: true },\n    });\n    const items = rows.slice(0, q.limit);\n    return { items, nextCursor: rows.length > q.limit ? items.at(-1)!.id : null };\n  }\n}";
const MA_NGAYTHO = "@Catch() class NgayThoFilter {                                    // ⚠ kiểu hay thấy trên mạng\n  catch(e: any, host: ArgumentsHost) { host.switchToHttp().getResponse().status(500).json({ error: e.message }); }\n}";
const OUT_64 = "$ KICH=tran node dist/b64/app.js 2>/dev/null   # chỉ xem phản hồi HTTP\nPOST /rooms → 201 {\"id\":1,\"code\":\"AL-301\",\"capacity\":30}\nPOST /rooms → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nGET /rooms/99 → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nDELETE /rooms/1 → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\n$ KICH=ngay-tho node dist/b64/app.js\nPOST /rooms → 201 {\"id\":1,\"code\":\"AL-301\",\"capacity\":30}\nPOST /rooms → 500 {\"error\":\"\\nInvalid `prisma.room.create()` invocation:\\n\\n\\nUnique constraint failed on the constraint: `Room_code_key`\"}\nGET /rooms/99 → 500 {\"error\":\"\\nInvalid `prisma.room.findUniqueOrThrow()` invocation:\\n\\n\\nAn operation failed because it depends on one or more records that were required but not found. No record was found for a query.\"}\nDELETE /rooms/1 → 500 {\"error\":\"\\nInvalid `prisma.room.delete()` invocation:\\n\\n\\nForeign key constraint violated on the constraint: `Booking_roomId_fkey`\"}\n$ KICH=dung node dist/b64/app.js\nPOST /rooms → 201 {\"id\":1,\"code\":\"AL-301\",\"capacity\":30}\nPOST /rooms → 409 {\"status\":409,\"code\":\"UNIQUE_VIOLATION\",\"title\":\"Giá trị đã tồn tại\"}\nGET /rooms/99 → 404 {\"status\":404,\"code\":\"NOT_FOUND\",\"title\":\"Không tìm thấy bản ghi\"}\nDELETE /rooms/1 → 409 {\"status\":409,\"code\":\"STILL_REFERENCED\",\"title\":\"Bản ghi đang được tham chiếu\"}\nGET /bookings?limit=2 → 200 {\"items\":[{\"id\":1,\"roomId\":1,\"start\":\"2027-01-05T01:00:00.000Z\"},{\"id\":2,\"roomId\":1,\"start\":\"2027-01-06T01:00:00.000Z\"}],\"nextCursor\":2}\nGET /bookings?limit=2&cursor=2 → 200 {\"items\":[{\"id\":3,\"roomId\":1,\"start\":\"2027-01-07T01:00:00.000Z\"},{\"id\":4,\"roomId\":1,\"start\":\"2027-01-08T01:00:00.000Z\"}],\"nextCursor\":4}\nGET /bookings?limit=2&cursor=4 → 200 {\"items\":[{\"id\":5,\"roomId\":1,\"start\":\"2027-01-09T01:00:00.000Z\"}],\"nextCursor\":null}\nGET /bookings?limit=1000000 → 400 {\"message\":[\"limit must not be greater than 100\"],\"error\":\"Bad Request\",\"statusCode\":400}";
const OUT_LOG = "$ KICH=tran node dist/b64/app.js\nPOST /rooms → 201 {\"id\":1,\"code\":\"AL-301\",\"capacity\":30}\n[Nest] ERROR [ExceptionsHandler] PrismaClientKnownRequestError: \nInvalid `prisma.room.create()` invocation:\nUnique constraint failed on the constraint: `Room_code_key`\n  code: 'P2002',\n  meta: {\n    driverAdapterError: DriverAdapterError: UniqueConstraintViolation\n        at PrismaPgAdapter.onError (file:///home/sv/app/node_modules/@prisma/adapter-pg/dist/index.mjs:666:11)\n        at PrismaPgAdapter.performIO (file:///home/sv/app/node_modules/@prisma/adapter-pg/dist/index.mjs:661:12)\n        at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n        at async PrismaPgAdapter.queryRaw (file:///home/sv/app/node_modules/@prisma/adapter-pg/dist/index.mjs:595:30)\n        at async /home/sv/app/node_modules/@prisma/client/runtime/client.js:11:70479\n        at async e.run (/home/sv/app/node_modules/@prisma/client/runtime/client.js:11:69220)\n        at async e.execute (/home/sv/app/node_modules/@prisma/client/runtime/client.js:57:815)\n        at async yr.request (/home/sv/app/node_modules/@prisma/client/runtime/client.js:58:2425)\n        at async Object.singleLoader (/home/sv/app/node_modules/@prisma/client/runtime/client.js:65:6917)\n        at async vn.request (/home/sv/app/node_modules/@prisma/client/runtime/client.js:65:7523) {\n      cause: {\n        originalCode: '23505',\n        originalMessage: 'duplicate key value violates unique constraint \"Room_code_key\"',\n        kind: 'UniqueConstraintViolation',\n        constraint: {\n          index: 'Room_code_key'\n        },";
const MA_BT = "const PG: Record<string, [number, string]> = { '23505': [409, 'UNIQUE_VIOLATION'], '23503': [409, 'STILL_REFERENCED'], '22001': [400, 'VALUE_TOO_LONG'] };\n@Catch(QueryFailedError, EntityNotFoundError)\nclass TypeOrmErrorFilter implements ExceptionFilter {\n  catch(e: QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {\n    const res = host.switchToHttp().getResponse();\n    const [status, code] = e instanceof EntityNotFoundError ? [404, 'NOT_FOUND'] : PG[(e.driverError as any).code] ?? [500, 'INTERNAL'];\n    res.status(status).type('application/problem+json').json({ status, code });\n  }\n}";
const OUT_BT = "$ node dist/b64/bt-typeorm.js\nPOST /rooms {\"code\":\"LB-101\",\"capacity\":20} → 201 {\"identifiers\":[{\"id\":3}],\"generatedMaps\":[{\"id\":3,\"floor\":0}],\"raw\":[{\"id\":3,\"floor\":0}]}\nPOST /rooms {\"code\":\"LB-101\",\"capacity\":20} → 409 {\"status\":409,\"code\":\"UNIQUE_VIOLATION\"}\nPOST /rooms/xem {\"id\":999} → 404 {\"status\":404,\"code\":\"NOT_FOUND\"}";

export default {
  title: '6.4 — Database errors and lists: unique violations → 409, not found → 404, pagination|||6.4 — Lỗi cơ sở dữ liệu và danh sách: trùng → 409, không thấy → 404, phân trang',
  slug: 'nst-6-4-loi-db-phan-trang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi DB từ chối, client nhận gì? Chạy thật ba cách: không có filter thì trùng mã phòng, không thấy phòng, xoá phòng còn lịch đều thành 500; filter "ngây thơ" trả e.message thì lộ tên ràng buộc và câu gọi Prisma; PrismaErrorFilter đổi P2002 → 409, P2025 → 404, P2003 → 409 mà không lộ gì. Thêm phân trang con trỏ bằng Prisma (lấy dư một hàng, trần limit 100 kiểm bằng DTO) và cùng bảng ánh xạ cho TypeORM theo mã SQLSTATE.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>6.4 — When the database says no</h2>
<p class="lead">A database rejects writes for good reasons: the room code already exists, the row is gone, a room still has bookings. Each of those is a <em>client</em> mistake with a precise HTTP meaning — 409, 404, 409. By default, Nest turns all of them into 500. This lesson measures what the client sees with no filter, with the filter people copy from the internet, and with a proper one; then adds the second everyday concern of a data API: lists that do not return the whole table.</p>

<h3>Everyday analogy: the post office counter</h3>
<p>You hand in a parcel with an address that does not exist. A good clerk says "this address does not exist" (404). A bad clerk either says "system error" (500 — you do not know what to fix), or turns the screen around so you can read the internal sorting codes and the name of the computer (a leaky error message). The filter is the clerk.</p>

<h3>The test app</h3>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>

<h3>Run 1 and 2 — no filter, and the "naive" filter</h3>
<pre><code class="language-ts">${esc(MA_NGAYTHO)}</code></pre>
<div class="out">${esc(OUT_64)}</div>
<ul>
<li><strong>No filter</strong> (<code>tran</code>): three different client mistakes, three identical 500s. Monitoring now shows "server errors" for things that are not bugs, and the client cannot tell "retry later" from "change your input".</li>
<li><strong>Naive filter</strong> (<code>ngay-tho</code>): still 500, and now the response tells an attacker the ORM (<code>prisma.room.create()</code>), the constraint and index names (<code>Room_code_key</code>, <code>Booking_roomId_fkey</code>) and therefore table and column names. That is exactly the "verbose error messages" item of OWASP API8:2023 Security Misconfiguration.</li>
</ul>
<p>What the server log holds for run 1 (this belongs in the log, never in the response):</p>
<div class="out">${esc(OUT_LOG)}</div>
<p>Two useful facts for the filter: the Prisma code <code>P2002</code>, and — under the driver adapter — the original PostgreSQL code <code>23505</code> at <code>meta.driverAdapterError.cause.originalCode</code>.</p>

<h3>Run 3 — a filter that maps known codes</h3>
<pre><code class="language-ts">${esc(MA_FILTER)}</code></pre>
<p>The output of the <code>dung</code> run is the last block above: <code>409 UNIQUE_VIOLATION</code>, <code>404 NOT_FOUND</code>, <code>409 STILL_REFERENCED</code> — correct codes, stable machine-readable <code>code</code>, nothing internal. An unknown Prisma code stays a 500 with details only in the log.</p>
<p>Where should the mapping live? A global filter is the safety net for the generic cases. For errors that mean something in your domain — "room code taken", "room still has bookings" — catch them in the service and throw a domain <code>ConflictException</code> with your own <code>errorCode</code> (milestone 6 does exactly that). The filter then never needs to know table names.</p>

<h3>Pagination with a cursor</h3>
<p>Why cursor rather than <code>skip/take</code> pages, and how to design the contract, is measured in the API Design course (3.1, 3.2). The Nest/Prisma part is small:</p>
<ul>
<li>A query DTO with <code>@Type(() =&gt; Number)</code> (query strings are strings — Lesson 4.2) and a <strong>hard ceiling</strong> (<code>@Max(100)</code>): nobody downloads the table by asking for <code>limit=1000000</code>.</li>
<li><code>take: limit + 1</code> to learn whether a next page exists without a second <code>count()</code> query.</li>
<li><code>cursor: { id }, skip: 1</code> to continue after the last id of the previous page, ordered by a unique column.</li>
</ul>
<p>From the same run: pages 2 + 2 + 1, the last page returns <code>nextCursor: null</code>, and <code>limit=1000000</code> is rejected with 400 by the DTO before any query runs.</p>

<h3>🧪 Exercise</h3>
<p>The project you join uses TypeORM, not Prisma. Write the same mapping (duplicate → 409, foreign key → 409, too long → 400, <code>findOneByOrFail</code> not found → 404) as a filter, and prove it with real requests.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>TypeORM wraps driver errors in <code>QueryFailedError</code>; the PostgreSQL SQLSTATE is in <code>driverError.code</code> (<code>23505</code> unique, <code>23503</code> foreign key, <code>22001</code> value too long). <code>EntityNotFoundError</code> comes from the <code>…OrFail</code> methods. Mapping by SQLSTATE has a bonus: it works for any library that talks to PostgreSQL.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>A unique constraint fails — what status should the API return?</strong> 409 Conflict with a stable error code; not 500 (not a server bug) and not 400 (the input is well-formed, it conflicts with current state).</li>
<li><strong>Why not return the exception message?</strong> It leaks implementation details (ORM, constraint, table names) — OWASP API8. Log it, return a generic body with a code.</li>
<li><strong>Should you check "exists?" before inserting instead of catching P2002?</strong> The check alone is racy (Lesson 6.5); the constraint is the guarantee — the check can stay only as a friendlier early message.</li>
<li><strong>How do you know if there is a next page without COUNT(*)?</strong> Fetch limit + 1 rows.</li>
</ol>

<h3>💼 On the job</h3>
<p>Frontend teams on outsourcing projects build their error handling on your <code>code</code> field. Agree on the list early (<code>UNIQUE_VIOLATION</code>, <code>NOT_FOUND</code>, <code>BOOKING_CONFLICT</code>…), put it in the OpenAPI document (Lesson 4.4), and never change a code once released — change the human message instead.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">P2002 / 23505</span><span class="v">Unique constraint violated (Prisma code / PostgreSQL SQLSTATE) ⇒ 409.</span></div>
  <div class="kv"><span class="k">P2025</span><span class="v">Record required by the operation not found (findUniqueOrThrow, update, delete) ⇒ 404.</span></div>
  <div class="kv"><span class="k">P2003 / 23503</span><span class="v">Foreign key violated — e.g. deleting a room that still has bookings ⇒ 409.</span></div>
  <div class="kv"><span class="k">originalCode</span><span class="v">The PostgreSQL SQLSTATE under a Prisma 7 driver-adapter error.</span></div>
  <div class="kv"><span class="k">Cursor pagination</span><span class="v">Continue after the last seen key: cursor + skip 1, take limit + 1, order by a unique column.</span></div>
  <div class="kv"><span class="k">OWASP API8:2023</span><span class="v">Security misconfiguration, including verbose error messages exposed to clients.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Without a filter, every database refusal is a 500; a naive filter leaks ORM and schema names.</li>
<li>Map known codes (P2002, P2025, P2003; or SQLSTATE) to 409/404 with a stable code; unknown ones stay 500 and go to the log.</li>
<li>Domain conflicts are best translated in the service into your own error codes.</li>
<li>Lists: DTO with a hard limit ceiling, take limit + 1, cursor on a unique column.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>6.4 — Khi cơ sở dữ liệu nói "không"</h2>
<p class="lead">DB từ chối ghi vì những lý do chính đáng: mã phòng đã có, dòng đã mất, phòng còn lịch đặt. Mỗi trường hợp là lỗi của <em>client</em> với một nghĩa HTTP rõ ràng — 409, 404, 409. Mặc định Nest biến tất cả thành 500. Bài này đo xem client thấy gì khi không có filter, khi dùng filter mà người ta hay chép trên mạng, và khi có filter đúng; rồi thêm mối lo thứ hai hằng ngày của một API dữ liệu: danh sách không được trả cả bảng.</p>

<h3>Liên hệ đời thường: quầy bưu điện</h3>
<p>Bạn gửi một gói hàng ghi địa chỉ không tồn tại. Nhân viên giỏi nói "địa chỉ này không có" (404). Nhân viên tệ hoặc nói "lỗi hệ thống" (500 — bạn chẳng biết phải sửa gì), hoặc xoay màn hình cho bạn đọc mã phân loại nội bộ và tên máy tính (thông báo lỗi lộ nội tình). Filter chính là người nhân viên đó.</p>

<h3>Ứng dụng thử</h3>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>

<h3>Lần 1 và 2 — không filter, và filter "ngây thơ"</h3>
<pre><code class="language-ts">${esc(MA_NGAYTHO)}</code></pre>
<div class="out">${esc(OUT_64)}</div>
<ul>
<li><strong>Không filter</strong> (<code>tran</code>): ba lỗi khác nhau của client, ba lần 500 y hệt. Giám sát giờ báo "lỗi máy chủ" cho những thứ không phải bug, còn client không phân biệt được "thử lại sau" với "sửa dữ liệu gửi lên".</li>
<li><strong>Filter ngây thơ</strong> (<code>ngay-tho</code>): vẫn 500, và giờ phản hồi còn kể cho kẻ tấn công biết ORM (<code>prisma.room.create()</code>), tên ràng buộc và chỉ mục (<code>Room_code_key</code>, <code>Booking_roomId_fkey</code>) — tức là tên bảng và tên cột. Đó đúng là mục "thông báo lỗi quá chi tiết" trong OWASP API8:2023 Security Misconfiguration.</li>
</ul>
<p>Thứ log máy chủ ghi ở lần 1 (thứ này thuộc về log, không bao giờ thuộc về phản hồi):</p>
<div class="out">${esc(OUT_LOG)}</div>
<p>Hai dữ kiện hữu ích cho filter: mã Prisma <code>P2002</code>, và — bên dưới driver adapter — mã gốc của PostgreSQL <code>23505</code> ở <code>meta.driverAdapterError.cause.originalCode</code>.</p>

<h3>Lần 3 — filter ánh xạ các mã đã biết</h3>
<pre><code class="language-ts">${esc(MA_FILTER)}</code></pre>
<p>Output của lần <code>dung</code> là khối cuối ở trên: <code>409 UNIQUE_VIOLATION</code>, <code>404 NOT_FOUND</code>, <code>409 STILL_REFERENCED</code> — đúng mã, có <code>code</code> ổn định cho máy đọc, không lộ gì bên trong. Mã Prisma lạ vẫn là 500, chi tiết chỉ nằm trong log.</p>
<p>Ánh xạ nên đặt ở đâu? Filter toàn cục là lưới an toàn cho các trường hợp chung. Còn lỗi mang nghĩa nghiệp vụ — "mã phòng đã có", "phòng còn lịch" — hãy bắt trong service và ném <code>ConflictException</code> với <code>errorCode</code> của riêng bạn (mốc 6 làm đúng như vậy). Khi đó filter không bao giờ cần biết tên bảng.</p>

<h3>Phân trang bằng con trỏ</h3>
<p>Vì sao dùng con trỏ thay vì trang <code>skip/take</code>, và thiết kế hợp đồng ra sao, đã đo ở khoá API Design (3.1, 3.2). Phần của Nest/Prisma nhỏ thôi:</p>
<ul>
<li>DTO cho query có <code>@Type(() =&gt; Number)</code> (query string là chuỗi — Bài 4.2) và một <strong>trần cứng</strong> (<code>@Max(100)</code>): không ai tải cả bảng bằng cách xin <code>limit=1000000</code>.</li>
<li><code>take: limit + 1</code> để biết còn trang sau không mà không cần thêm một truy vấn <code>count()</code>.</li>
<li><code>cursor: { id }, skip: 1</code> để đi tiếp sau id cuối của trang trước, sắp theo một cột duy nhất.</li>
</ul>
<p>Cũng lần chạy đó: các trang 2 + 2 + 1, trang cuối trả <code>nextCursor: null</code>, còn <code>limit=1000000</code> bị DTO từ chối 400 trước khi có truy vấn nào chạy.</p>

<h3>🧪 Bài tập</h3>
<p>Dự án bạn vào dùng TypeORM chứ không dùng Prisma. Viết cùng bảng ánh xạ (trùng → 409, khoá ngoại → 409, quá dài → 400, <code>findOneByOrFail</code> không thấy → 404) thành một filter, và chứng minh bằng request thật.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>TypeORM bọc lỗi của driver trong <code>QueryFailedError</code>; SQLSTATE của PostgreSQL nằm ở <code>driverError.code</code> (<code>23505</code> trùng, <code>23503</code> khoá ngoại, <code>22001</code> quá dài). <code>EntityNotFoundError</code> đến từ các phương thức <code>…OrFail</code>. Ánh xạ theo SQLSTATE còn có lợi thêm: dùng được cho mọi thư viện nói chuyện với PostgreSQL.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Ràng buộc unique bị vi phạm — API nên trả mã gì?</strong> 409 Conflict kèm mã lỗi ổn định; không phải 500 (không phải bug máy chủ) và không phải 400 (dữ liệu đúng dạng, chỉ xung đột với trạng thái hiện tại).</li>
<li><strong>Vì sao không trả message của exception?</strong> Nó lộ chi tiết cài đặt (ORM, tên ràng buộc, tên bảng) — OWASP API8. Ghi log, trả thân chung kèm mã.</li>
<li><strong>Sao không kiểm "đã có chưa?" trước khi chèn thay vì bắt P2002?</strong> Chỉ kiểm thì dính race (Bài 6.5); ràng buộc mới là bảo đảm — phần kiểm chỉ nên giữ để báo lỗi sớm cho thân thiện.</li>
<li><strong>Làm sao biết còn trang sau mà không cần COUNT(*)?</strong> Lấy limit + 1 hàng.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Nhóm frontend ở dự án outsourcing dựng phần xử lý lỗi dựa trên trường <code>code</code> của bạn. Thống nhất danh sách sớm (<code>UNIQUE_VIOLATION</code>, <code>NOT_FOUND</code>, <code>BOOKING_CONFLICT</code>…), đưa vào tài liệu OpenAPI (Bài 4.4), và đừng bao giờ đổi một mã đã phát hành — muốn đổi thì đổi câu chữ cho người đọc.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">P2002 / 23505</span><span class="v">Vi phạm ràng buộc unique (mã Prisma / SQLSTATE PostgreSQL) ⇒ 409.</span></div>
  <div class="kv"><span class="k">P2025</span><span class="v">Không thấy bản ghi mà thao tác cần (findUniqueOrThrow, update, delete) ⇒ 404.</span></div>
  <div class="kv"><span class="k">P2003 / 23503</span><span class="v">Vi phạm khoá ngoại — ví dụ xoá phòng còn lịch đặt ⇒ 409.</span></div>
  <div class="kv"><span class="k">originalCode</span><span class="v">SQLSTATE của PostgreSQL nằm dưới lỗi driver adapter của Prisma 7.</span></div>
  <div class="kv"><span class="k">Phân trang con trỏ</span><span class="v">Đi tiếp sau khoá cuối đã thấy: cursor + skip 1, take limit + 1, sắp theo cột duy nhất.</span></div>
  <div class="kv"><span class="k">OWASP API8:2023</span><span class="v">Cấu hình sai về bảo mật, gồm cả thông báo lỗi chi tiết lộ ra client.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có filter, mọi lần DB từ chối đều thành 500; filter ngây thơ lộ tên ORM và lược đồ.</li>
<li>Ánh xạ mã đã biết (P2002, P2025, P2003; hoặc SQLSTATE) sang 409/404 kèm mã ổn định; mã lạ giữ 500 và vào log.</li>
<li>Xung đột nghiệp vụ nên dịch ngay trong service thành mã lỗi của riêng bạn.</li>
<li>Danh sách: DTO có trần limit cứng, take limit + 1, con trỏ trên cột duy nhất.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
