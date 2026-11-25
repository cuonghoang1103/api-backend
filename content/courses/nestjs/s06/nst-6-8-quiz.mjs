/**
 * 6.8 — Kiểm tra Chương 6 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c6/o):
 * câu 1 61-pool (15 vs 5), câu 2 61-khoidong (lazy 500, eager exit 1), câu 3 61-gen (migrate dev không generate), câu 4 62-tx (cls-ro-ri
 * NOTIFY lọt), câu 5 62-dai (P2028 6,0 s; email đã gửi), câu 6 63-sql (DROP + ADD, 3,2 ⇒ 0,0), câu 7 64 (ngây thơ lộ Room_code_key),
 * câu 8 65-race (Read Committed 10 = pool), câu 9 65-rangbuoc ('[)', 23P01 ⇒ 1×201), câu 10 66-html (throw trong filter ⇒ HTML + stack).
 * Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '6.8 — Chapter 6 quiz|||6.8 — Kiểm tra Chương 6',
  slug: 'nst-6-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 6: PrismaService khai ở nhiều module, kết nối lúc khởi động, Prisma 7 không tự generate, service rò rỉ khỏi transaction CLS, gọi mạng trong transaction, synchronize đổi kiểu cột, filter lộ tên ràng buộc, kiểm-rồi-ghi trong transaction Read Committed, exclusion constraint với khoảng nửa mở, và filter ném lại lỗi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter (Prisma 7.10, TypeORM 1.1, PostgreSQL 16). Most database bugs only appear under load or in production, so most questions ask what really happens there.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain how many PrismaClient instances my app has and why.</li>
<li>I can run writes from two services in one transaction, and say what escapes it.</li>
<li>I know why synchronize is forbidden outside a throw-away database.</li>
<li>I can map database errors to 409/404 without leaking internals.</li>
<li>I can prove with a test that 50 concurrent requests produce exactly one booking.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương (Prisma 7.10, TypeORM 1.1, PostgreSQL 16). Phần lớn lỗi cơ sở dữ liệu chỉ hiện ra khi có tải hoặc trên production, nên phần lớn câu hỏi hỏi điều gì thật sự xảy ra ở đó.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được ứng dụng của mình có bao nhiêu PrismaClient và vì sao.</li>
<li>Tôi cho lệnh ghi của hai service chạy chung một transaction được, và nói được thứ gì lọt ra ngoài.</li>
<li>Tôi biết vì sao cấm synchronize ở mọi nơi trừ DB vứt đi được.</li>
<li>Tôi ánh xạ được lỗi DB sang 409/404 mà không lộ nội tình.</li>
<li>Tôi chứng minh được bằng test rằng 50 request đồng thời chỉ tạo đúng một booking.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'RoomsModule, BookingsModule and AuditModule each list PrismaService in their own providers array (pool max 5). Under load, how many PostgreSQL connections can the app open?|||RoomsModule, BookingsModule và AuditModule mỗi module tự liệt kê PrismaService trong providers của mình (pool tối đa 5). Khi có tải, ứng dụng mở được bao nhiêu kết nối PostgreSQL?',
        options: [
          '15 — three instances, three pools|||15 — ba bản, ba pool',
          '5 — Nest shares providers between modules automatically|||5 — Nest tự dùng chung provider giữa các module',
          '1 — PrismaClient always uses a single connection|||1 — PrismaClient luôn dùng một kết nối',
          'It fails to start with a duplicate provider error|||Không khởi động được vì lỗi trùng provider',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 6.1, experiment 1: "ba service dùng chung một PrismaService? false" and 15 connections; with one global PrismaModule: true and 5.|||VI: Bài 6.1, thí nghiệm 1: "ba service dùng chung một PrismaService? false" và 15 kết nối; với một PrismaModule global: true và 5.',
      },
      {
        question: 'DATABASE_URL points to a port with no database. PrismaService has NO onModuleInit. What happens?|||DATABASE_URL trỏ vào một cổng không có DB. PrismaService KHÔNG có onModuleInit. Chuyện gì xảy ra?',
        options: [
          'The app refuses to start and exits with code 1|||Ứng dụng từ chối khởi động và thoát mã 1',
          'The app starts and listens; the first request gets 500 (P1001)|||Ứng dụng khởi động và nghe cổng; request đầu tiên nhận 500 (P1001)',
          'Prisma retries forever and the app never listens|||Prisma thử lại mãi và ứng dụng không bao giờ nghe cổng',
          'The first request gets 503 Service Unavailable automatically|||Request đầu tự động nhận 503 Service Unavailable',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 6.1, experiment 2: lazy ⇒ "đã nghe cổng sau 111 ms", then GET /rooms → 500, exit 0. With $connect/SELECT 1 in onModuleInit ⇒ exit 1.|||VI: Bài 6.1, thí nghiệm 2: lười ⇒ "đã nghe cổng sau 111 ms", rồi GET /rooms → 500, mã thoát 0. Có $connect/SELECT 1 trong onModuleInit ⇒ mã thoát 1.',
      },
      {
        question: 'Prisma 7: you run "prisma migrate dev --name init" successfully. What is still missing before the app can import the client?|||Prisma 7: bạn chạy "prisma migrate dev --name init" thành công. Còn thiếu gì trước khi ứng dụng import được client?',
        options: [
          'Nothing — migrate dev also generates the client|||Không thiếu gì — migrate dev sinh luôn client',
          'Running prisma db push|||Chạy prisma db push',
          'Running prisma generate — migrate dev no longer does it|||Chạy prisma generate — migrate dev không còn làm việc này',
          'Downloading the query engine binary|||Tải tệp nhị phân query engine',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 6.1, step 1: after migrate dev, "ls src/generated/prisma: No such file or directory"; prisma generate created it. Prisma 7 uses a driver adapter, no engine binary.|||VI: Bài 6.1, bước 1: sau migrate dev, "ls src/generated/prisma: No such file or directory"; prisma generate mới tạo ra. Prisma 7 dùng driver adapter, không có tệp engine.',
      },
      {
        question: 'BookingsCls.create() is @Transactional(); it calls an old NotifyService that injects PrismaService directly, then the audit write fails. What is in the database afterwards?|||BookingsCls.create() có @Transactional(); nó gọi một NotifyService cũ tiêm thẳng PrismaService, rồi lệnh ghi nhật ký hỏng. Sau đó trong DB có gì?',
        options: [
          'Nothing — everything rolled back|||Không có gì — mọi thứ đã rollback',
          'The booking and the notify row|||Booking và dòng notify',
          'Only the booking|||Chỉ booking',
          'Only the notify row — for a booking that does not exist|||Chỉ dòng notify — cho một booking không tồn tại',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 6.2, run cls-ro-ri: "Booking 0 hàng · AuditLog [{"action":"NOTIFY","detail":"đã gửi email cho booking #1"}]" — the direct PrismaService write ran on another connection and committed.|||VI: Bài 6.2, lần chạy cls-ro-ri: "Booking 0 hàng · AuditLog [{"action":"NOTIFY","detail":"đã gửi email cho booking #1"}]" — lệnh ghi qua PrismaService trực tiếp chạy trên kết nối khác và đã commit.',
      },
      {
        question: 'Inside prisma.$transaction you insert a row, call an email API that takes 6 s, then insert another row. Defaults unchanged. Result?|||Trong prisma.$transaction bạn chèn một dòng, gọi API email mất 6 s, rồi chèn dòng nữa. Giữ mặc định. Kết quả?',
        options: [
          'P2028 after ~6 s, both rows rolled back — but the email was already sent|||P2028 sau ~6 s, cả hai dòng rollback — nhưng email đã gửi đi rồi',
          'Both rows committed; transactions have no timeout|||Cả hai dòng commit; transaction không có timeout',
          'The first row is committed, the second fails|||Dòng đầu commit, dòng sau hỏng',
          'The email call is automatically cancelled at 5 s|||Lời gọi email tự bị huỷ ở giây thứ 5',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 6.2: "[6.0 s] lỗi P2028 … The timeout for this transaction was 5000 ms, however 6033 ms passed"; the table was empty afterwards. External side effects do not roll back.|||VI: Bài 6.2: "[6.0 s] lỗi P2028 … The timeout for this transaction was 5000 ms, however 6033 ms passed"; sau đó bảng trống. Tác dụng bên ngoài không rollback được.',
      },
      {
        question: 'TypeORM with synchronize: true. Rooms have floor = 3 and 2. You change @Column floor from integer to smallint and restart. What happens?|||TypeORM với synchronize: true. Các phòng có floor = 3 và 2. Bạn đổi @Column floor từ integer sang smallint rồi khởi động lại. Chuyện gì xảy ra?',
        options: [
          'ALTER COLUMN TYPE smallint; data kept|||ALTER COLUMN TYPE smallint; dữ liệu giữ nguyên',
          'Startup fails with a schema mismatch error|||Khởi động hỏng vì lỗi lệch lược đồ',
          'Nothing; synchronize only creates new tables|||Không có gì; synchronize chỉ tạo bảng mới',
          'DROP COLUMN then ADD COLUMN; floors become 0 and 0, no warning|||DROP COLUMN rồi ADD COLUMN; tầng thành 0 và 0, không cảnh báo',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 6.3: "ALTER TABLE "rooms" DROP COLUMN "floor"", "ADD "floor" smallint NOT NULL DEFAULT \'0\'", rooms printed with floor 0. A rename (only { name }) was kept as RENAME.|||VI: Bài 6.3: "ALTER TABLE "rooms" DROP COLUMN "floor"", "ADD "floor" smallint NOT NULL DEFAULT \'0\'", phòng in ra floor 0. Chỉ đổi tên ({ name }) thì TypeORM 1.1 dùng RENAME, giữ dữ liệu.',
      },
      {
        question: 'A global filter returns { error: e.message } with status 500. A client creates a room with an existing code. What does the client learn?|||Một filter toàn cục trả { error: e.message } với mã 500. Client tạo phòng với mã đã có. Client biết được gì?',
        options: [
          'Only "Internal server error"|||Chỉ "Internal server error"',
          'The ORM call and the constraint name Room_code_key — internals an attacker can use|||Lời gọi ORM và tên ràng buộc Room_code_key — nội tình kẻ tấn công dùng được',
          'A clean 409 with code UNIQUE_VIOLATION|||Một 409 sạch với code UNIQUE_VIOLATION',
          'The full SQL statement with parameter values|||Toàn bộ câu SQL kèm giá trị tham số',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 6.4, run ngay-tho: "POST /rooms → 500 {"error":"\\nInvalid `prisma.room.create()` invocation: … Unique constraint failed on the constraint: `Room_code_key`"}" — OWASP API8 verbose errors.|||VI: Bài 6.4, lần ngay-tho: "POST /rooms → 500 {"error":"\\nInvalid `prisma.room.create()` invocation: … Unique constraint failed on the constraint: `Room_code_key`"}" — thông báo lỗi chi tiết của OWASP API8.',
      },
      {
        question: 'Check-then-insert wrapped in prisma.$transaction (Read Committed, pool 10). 50 truly concurrent requests for the same slot. How many bookings end up in the table?|||Kiểm-rồi-chèn bọc trong prisma.$transaction (Read Committed, pool 10). 50 request thật sự đồng thời cho cùng một khung giờ. Cuối cùng bảng có bao nhiêu booking?',
        options: [
          '1 — the transaction makes the check atomic|||1 — transaction làm lần kiểm thành nguyên tử',
          '50|||50',
          '10 — one per concurrent transaction, the pool size|||10 — mỗi transaction đồng thời một bản, bằng cỡ pool',
          '0 — all transactions deadlock|||0 — mọi transaction đều deadlock',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 6.5: CACH=tx gave {"201":10,"409":40} three times out of three. Without a transaction: 49. With the exclusion constraint: 1.|||VI: Bài 6.5: CACH=tx ra {"201":10,"409":40} cả ba lần. Không transaction: 49. Có exclusion constraint: 1.',
      },
      {
        question: 'Exclusion constraint EXCLUDE USING gist (roomId WITH =, tstzrange(start, "end", \'[)\') WITH &&). Booking A is 7:30–9:30. Which new booking for the same room is accepted?|||Exclusion constraint EXCLUDE USING gist (roomId WITH =, tstzrange(start, "end", \'[)\') WITH &&). Booking A là 7:30–9:30. Booking mới nào cho cùng phòng được chấp nhận?',
        options: [
          '9:30–11:00 — half-open ranges touch but do not overlap|||9:30–11:00 — khoảng nửa mở chạm nhau nhưng không giao',
          '9:00–10:00|||9:00–10:00',
          '7:00–7:31|||7:00–7:31',
          'None until A is deleted|||Không cái nào cho tới khi xoá A',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lab 6.6: "chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201" passes; with \'[]\' the same test fails "expected 201, got 409". A REJECTED booking also frees the slot (WHERE status <> \'REJECTED\').|||VI: Lab 6.6: test "chạm mép không phải trùng: 9:30 kết thúc, 9:30 bắt đầu ⇒ 201" xanh; đổi thành \'[]\' thì cùng test đó đỏ "expected 201, got 409". Booking REJECTED cũng nhả khung giờ (WHERE status <> \'REJECTED\').',
      },
      {
        question: 'A catch-all @Catch() filter handles booking conflicts and does "throw e" for every other error (e.g. a ConflictException from a service). What does the client get for that ConflictException?|||Một filter @Catch() bắt-tất-cả xử lý xung đột booking và "throw e" với mọi lỗi khác (ví dụ ConflictException từ service). Client nhận gì cho ConflictException đó?',
        options: [
          'The normal Nest JSON body — the next filter handles it|||Thân JSON bình thường của Nest — filter tiếp theo xử lý',
          'A 500 Internal server error JSON|||Một JSON 500 Internal server error',
          'The request hangs until timeout|||Request treo tới khi hết giờ',
          'An Express HTML error page with the stack trace and file paths|||Trang lỗi HTML của Express kèm stack trace và đường dẫn tệp',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lab 6.6: "BODY text/html … <pre>ConflictException: Conflict Exception<br> at BookingsService.doiTrangThai (/home/sv/app/src/lab66/bookings.ts:27:28)". Fix: extend BaseExceptionFilter and call super.catch().|||VI: Lab 6.6: "BODY text/html … <pre>ConflictException: Conflict Exception<br> at BookingsService.doiTrangThai (/home/sv/app/src/lab66/bookings.ts:27:28)". Sửa: kế thừa BaseExceptionFilter và gọi super.catch().',
      },
    ],
  },
};
