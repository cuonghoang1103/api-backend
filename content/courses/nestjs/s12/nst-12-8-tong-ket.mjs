/**
 * 12.8 — Kiểm tra tổng kết (20 câu trộn cả khoá) và checklist đưa một API Nest lên production (khoá nestjs, soạn 24/11/2026).
 * Mỗi câu đối chiếu với output đã chạy thật ở bài được ghi trong phần giải thích. Ghép: ghep.sh 128 nst-12-8-tong-ket (c128.txt rỗng).
 */
import { lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-12-1-de-bai', title: 'Debug có phương pháp 12.1 — App đặt lịch phòng lab có 10 lỗi', sub: 'Học xong khoá này: sang đó săn lỗi trên đúng kiểu hệ thống bạn đã dựng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Đề và rubric', sub: 'Đối chiếu lần cuối dự án của bạn với rubric 100 điểm.', cta: 'Mở bài →' }),
].join('\n');

const CHECK = [
  ['Every route closed by default (global auth guard + @Public); ownership checked per object (404 if not visible)', 'Mọi route mặc định đóng (guard xác thực toàn cục + @Public); quyền sở hữu kiểm theo từng đối tượng (không được thấy ⇒ 404)'],
  ['Global ValidationPipe with whitelist + forbidNonWhitelisted; DTOs are classes, not interfaces', 'ValidationPipe toàn cục bật whitelist + forbidNonWhitelisted; DTO là class, không phải interface'],
  ['Responses through response DTOs (allow-list); no password hashes, internal ids or free-text you did not mean to publish', 'Phản hồi đi qua DTO trả về (danh sách cho phép); không lộ hash mật khẩu, id nội bộ hay ghi chú không định công bố'],
  ['Rules that concurrency can break are enforced by the database (constraint, lock) and have a concurrent test', 'Luật mà đồng thời phá được thì do cơ sở dữ liệu giữ (ràng buộc, khoá) và có test đồng thời'],
  ['Config validated at startup (schema); secrets only from the environment; .env.example committed, .env never', 'Cấu hình được kiểm lúc khởi động (schema); bí mật chỉ đến từ môi trường; commit .env.example, không bao giờ commit .env'],
  ['JSON logs with request id; no tokens or passwords in logs', 'Log JSON có request id; không có token hay mật khẩu trong log'],
  ['Errors as one format (problem+json) with stable error codes; no stack traces to clients', 'Lỗi theo một định dạng (problem+json) với mã lỗi ổn định; không trả stack trace cho client'],
  ['Rate limits behind the right trust proxy, shared across replicas, with a decision for when the store is down', 'Giới hạn tốc độ đặt đúng trust proxy, dùng chung giữa các bản, có quyết định cho lúc kho đếm hỏng'],
  ['Background jobs idempotent (job id + sent-log), retries with backoff, cron once per tick across replicas', 'Job nền idempotent (id job + sổ đã gửi), thử lại có giãn cách, cron mỗi lượt một lần dù nhiều bản'],
  ['Events emitted after commit; resources closed in onApplicationShutdown; enableShutdownHooks', 'Sự kiện phát sau commit; đóng tài nguyên ở onApplicationShutdown; bật enableShutdownHooks'],
  ['Docker: multi-stage, runtime as non-root, exec-form CMD, image size known', 'Docker: nhiều tầng, runtime không chạy root, CMD dạng exec, biết kích thước ảnh'],
  ['Liveness without dependencies; readiness with hard dependencies only; /health not public', 'Liveness không hỏi phụ thuộc; readiness chỉ hỏi phụ thuộc bắt buộc; /health không công khai'],
  ['Migrations run once before new replicas start; never synchronize in production', 'Migration chạy một lần trước khi các bản mới khởi động; không bao giờ synchronize ở production'],
  ['OpenAPI generated, committed and diffed in CI; /docs off in production unless intended', 'OpenAPI được sinh, commit và so trong CI; /docs tắt ở production trừ khi có chủ đích'],
  ['CI: lint, typecheck, unit, e2e on real services, image build + acceptance run; required before merge', 'CI: lint, kiểm kiểu, test đơn vị, e2e trên dịch vụ thật, dựng ảnh + chạy nghiệm thu; bắt buộc trước khi merge'],
  ['Dependencies audited; dev-only tools (devtools, CLI) not in the runtime image', 'Phụ thuộc được audit; công cụ chỉ dành cho dev (devtools, CLI) không có trong ảnh chạy'],
];
const ds = (vi) => `<ol>\n${CHECK.map(([en, v]) => `<li>☐ ${vi ? v : en}</li>`).join('\n')}\n</ol>`;
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });
// đưa đáp án đúng về vị trí đích (đổi chỗ với phương án đang ở đó) — đáp án không dồn vào một chữ cái
const VI_TRI = [1, 3, 2, 0, 1, 2, 0, 3, 1, 2, 3, 3, 0, 1, 2, 2, 0, 2, 3, 0];
const dat = (x, k) => { const o = [...x.options]; [o[x.correctIndex], o[k]] = [o[k], o[x.correctIndex]]; return { ...x, options: o, correctIndex: k }; };

export default {
  title: '12.8 — Final quiz and checklist|||12.8 — Kiểm tra tổng kết và checklist',
  slug: 'nst-12-8-tong-ket',
  type: 'QUIZ',
  isFreePreview: true,
  description: '20 câu tình huống trộn cả khoá — DI và scope, thứ tự dây chuyền, DTO, đặt trùng và hạn mức khi đồng thời, JWT và sở hữu, test, hàng đợi, socket, Docker, health, múi giờ — câu nào cũng đối chiếu với output đã chạy thật. Kèm checklist 16 mục trước khi đưa một API Nest lên production và đường học tiếp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final check</span>
<h2>Twenty situations from the whole course, and the checklist you keep</h2>
<p class="lead">Every question below happened in a lab of this course; the explanation names the lesson and the measured result. Score 16 or more and you are ready to defend the capstone. Below 12: revisit the lessons named in the explanations of the questions you missed.</p>
<h3>Checklist before a Nest API goes to production</h3>
${ds(false)}
<h3>Where to go next</h3>
<ul>
<li><strong>Debug with method</strong>, chapter 12 — a lab-booking app with ten planted bugs: hunt them in the kind of system you just built.</li>
<li><strong>System design</strong> — when the modular monolith stops being enough.</li>
<li>Your own project: finish milestone 12 against your grader, put the README and the green CI link in your CV.</li>
</ul>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra cuối</span>
<h2>Hai mươi tình huống từ cả khoá, và tờ checklist để giữ lại</h2>
<p class="lead">Mọi câu dưới đây đều đã xảy ra trong một bài lab của khoá; phần giải thích ghi tên bài và kết quả đo được. Đạt từ 16 câu là sẵn sàng bảo vệ dự án cuối. Dưới 12: xem lại các bài được nêu trong giải thích của những câu làm sai.</p>
<h3>Checklist trước khi đưa một API Nest lên production</h3>
${ds(true)}
<h3>Học tiếp ở đâu</h3>
<ul>
<li><strong>Debug có phương pháp</strong>, chương 12 — app đặt lịch phòng lab gài sẵn mười lỗi: săn lỗi trên đúng kiểu hệ thống bạn vừa dựng.</li>
<li><strong>Thiết kế hệ thống</strong> — khi khối nguyên theo module không còn đủ.</li>
<li>Dự án của bạn: hoàn thành mốc 12 theo bộ chấm của bạn, đưa README và đường dẫn CI xanh vào CV.</li>
</ul>
${THE}
</div>
`,
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      q('A service is request-scoped. A controller and two other services inject it. After 3,000 requests, how many controller instances were created in lesson 2.4?|||Một service ở request scope. Một controller và hai service khác tiêm nó. Sau 3.000 request, bài 2.4 đếm được bao nhiêu bản controller?',
        ['1 — controllers are always singletons|||1 — controller luôn là singleton', '3,003 — request scope bubbles up to everything that depends on it|||3.003 — request scope lan lên mọi thứ phụ thuộc vào nó', '3 — one per module|||3 — mỗi module một bản', 'It fails to start: request scope cannot be injected into a controller|||Không khởi động được: không tiêm request scope vào controller được'], 1,
        'EN: Lesson 2.4: 3,003 instances and about 30% slower than singleton. Prefer AsyncLocalStorage for per-request data.|||VI: Bài 2.4: 3.003 bản và chậm hơn singleton khoảng 30%. Ưu tiên AsyncLocalStorage cho dữ liệu theo request.'),
      q('The body type of a POST handler is an interface CreateRoom. The global ValidationPipe has whitelist + forbidNonWhitelisted. A client sends {"isAdmin": true}. Result?|||Kiểu body của handler POST là interface CreateRoom. ValidationPipe toàn cục bật whitelist + forbidNonWhitelisted. Client gửi {"isAdmin": true}. Kết quả?',
        ['400 — property isAdmin should not exist|||400 — property isAdmin should not exist', '201 — an interface leaves no runtime type, so nothing is validated|||201 — interface không để lại kiểu lúc chạy, nên không gì được kiểm', '500 — the pipe cannot find metadata|||500 — pipe không tìm thấy metadata', '422 Unprocessable Entity|||422 Unprocessable Entity'], 1,
        'EN: Lesson 4.1: interface and import type both returned 201 silently. DTOs must be classes.|||VI: Bài 4.1: interface và import type đều trả 201 im lặng. DTO phải là class.'),
      q('Which runs first for one request: the global guard, the controller-level interceptor, or the route pipe?|||Với một request, cái nào chạy trước: guard toàn cục, interceptor ở controller, hay pipe của route?',
        ['The pipe — data must be validated before anything else|||Pipe — dữ liệu phải được kiểm trước mọi thứ', 'The interceptor — it wraps everything|||Interceptor — nó bọc mọi thứ', 'The guard, then the interceptor, then the pipe|||Guard, rồi interceptor, rồi pipe', 'Order depends on registration order in AppModule|||Thứ tự tuỳ thứ tự đăng ký trong AppModule'], 2,
        'EN: Lesson 3.6: middleware → guards → interceptors (before) → pipes → handler, measured step by step.|||VI: Bài 3.6: middleware → guard → interceptor (trước) → pipe → handler, đã đo từng bước.'),
      q('50 concurrent POST /bookings for the same slot. The service does findFirst() for an overlap, then create(). How many bookings did lesson 6.5 end up with?|||50 request POST /bookings đồng thời cho cùng một khung. Service dùng findFirst() tìm lịch chồng rồi create(). Bài 6.5 kết thúc với bao nhiêu lịch?',
        ['1|||1', '49|||49', '50|||50', '0 — deadlock|||0 — deadlock'], 1,
        'EN: Lesson 6.5: 201 × 49 and 49 rows for one slot. With the EXCLUDE constraint: exactly 1 (and 409 for the rest once 23P01 is mapped).|||VI: Bài 6.5: 201 × 49 và 49 dòng cho một khung. Có ràng buộc EXCLUDE: đúng 1 (và 409 cho phần còn lại khi đã đổi mã 23P01).'),
      q('Pending limit 3 per user. count() then create() inside ONE Prisma transaction at READ COMMITTED, no lock. 10 concurrent requests from one user. What happens?|||Hạn mức 3 lịch chờ mỗi người. count() rồi create() trong MỘT transaction Prisma ở READ COMMITTED, không khoá. 10 request đồng thời của một người. Chuyện gì xảy ra?',
        ['Exactly 3 succeed — the transaction makes it atomic|||Đúng 3 thành công — transaction làm nó nguyên tử', 'More than 3 can succeed — both transactions read the old count; something must make one wait|||Có thể hơn 3 thành công — các transaction cùng đọc con số cũ; phải có thứ bắt một bên chờ', 'All 10 fail with a deadlock|||Cả 10 hỏng vì deadlock', 'Prisma rejects count() inside a transaction|||Prisma không cho count() trong transaction'], 1,
        'EN: Lesson 12.3: without a lock 8 of 10 passed; pg_advisory_xact_lock(1, userId) inside the transaction gave exactly 3.|||VI: Bài 12.3: không khoá thì 8/10 lọt; pg_advisory_xact_lock(1, userId) trong transaction cho đúng 3.'),
      q('SQL: timestamptz \'2027-03-01 00:00Z\' AT TIME ZONE \'+07\'. What does PostgreSQL return?|||SQL: timestamptz \'2027-03-01 00:00Z\' AT TIME ZONE \'+07\'. PostgreSQL trả gì?',
        ['2027-03-01 07:00:00|||2027-03-01 07:00:00', '2027-02-28 17:00:00 — a POSIX string: positive means west of Greenwich|||2027-02-28 17:00:00 — chuỗi POSIX: dấu dương là phía tây Greenwich', 'An error: offset must be an interval|||Lỗi: độ lệch phải là interval', '2027-03-01 00:00:00|||2027-03-01 00:00:00'], 1,
        'EN: Lesson 12.3, measured. INTERVAL \'+07:00\' and \'Asia/Ho_Chi_Minh\' both give 07:00. An e2e test caught the wrong version.|||VI: Bài 12.3, đã đo. INTERVAL \'+07:00\' và \'Asia/Ho_Chi_Minh\' đều cho 07:00. Một test e2e đã bắt bản sai.'),
      q('A JWT guard uses jwt.decode() instead of verify(). In lesson 7.1, what happened with forged and expired tokens?|||Guard JWT dùng jwt.decode() thay vì verify(). Ở bài 7.1, token giả và token hết hạn ra sao?',
        ['All rejected — decode checks the signature too|||Đều bị từ chối — decode cũng kiểm chữ ký', '4 forged/expired tokens got 200 — decode only reads the payload|||4 token giả/hết hạn được 200 — decode chỉ đọc payload', 'Only expired tokens passed|||Chỉ token hết hạn lọt', 'The library throws at startup|||Thư viện ném lỗi lúc khởi động'], 1,
        'EN: Lesson 7.1. Always verify with a pinned algorithm; the weak key "secret" fell in 0.19 ms.|||VI: Bài 7.1. Luôn verify với thuật toán được ghim; khoá yếu "secret" bị đoán trong 0,19 mili giây.'),
      q('Student B requests GET /bookings/17, which belongs to student A. Which response leaks the least?|||Sinh viên B gọi GET /bookings/17 của sinh viên A. Phản hồi nào lộ ít nhất?',
        ['403 "not your booking"|||403 "không phải lịch của bạn"', '404 — as if it did not exist|||404 — như thể nó không tồn tại', '200 with sensitive fields removed|||200 kèm đã bỏ trường nhạy cảm', '401|||401'], 1,
        'EN: Lessons 7.4 and 12.1 (B3): 403 confirms the id exists. 403 is for objects you may see but not change.|||VI: Bài 7.4 và 12.1 (B3): 403 xác nhận id có tồn tại. 403 dành cho đối tượng được thấy mà không được sửa.'),
      q('Two API replicas behind nginx use @nestjs/throttler with the default storage, limit 100/min/IP. What did lesson 11.5 measure?|||Hai bản API sau nginx dùng @nestjs/throttler với kho mặc định, giới hạn 100/phút/IP. Bài 11.5 đo được gì?',
        ['Exactly 100 per minute|||Đúng 100 mỗi phút', '199 requests passed in one minute — each process counts separately|||199 request qua trong một phút — mỗi tiến trình đếm riêng', '50 — the limit is split|||50 — giới hạn bị chia đôi', '0 — nginx hides the client IP|||0 — nginx giấu IP client'], 1,
        'EN: Lesson 11.5; milestone 11 moved counters to Redis, and 12.6 decided what happens when Redis is down.|||VI: Bài 11.5; mốc 11 chuyển bộ đếm sang Redis, và bài 12.6 quyết định chuyện gì xảy ra khi Redis chết.'),
      q('With the throttler counters in Redis, Redis is stopped. Before the fix in 12.6, what did public GET /rooms return?|||Bộ đếm throttler nằm trong Redis, Redis bị dừng. Trước khi sửa ở bài 12.6, GET /rooms công khai trả gì?',
        ['200 — the route does not use Redis|||200 — route đó không dùng Redis', '500 after about 1.2 s — the global throttler guard failed on every request|||500 sau khoảng 1,2 giây — guard throttler toàn cục hỏng ở mọi request', '429|||429', '503 from the health check|||503 từ health check'], 1,
        'EN: Lesson 12.6, measured. Now: the general limit fails open, the login limit fails closed (503).|||VI: Bài 12.6, đã đo. Giờ: giới hạn chung "mở", giới hạn đăng nhập "đóng" (503).'),
      q('APP_GUARD is registered with useClass: JwtAuthGuard. In an e2e test you call overrideGuard(JwtAuthGuard). What happened in lesson 8.2?|||APP_GUARD được khai bằng useClass: JwtAuthGuard. Trong test e2e bạn gọi overrideGuard(JwtAuthGuard). Bài 8.2 thấy gì?',
        ['The override works|||Override có tác dụng', 'Still 401 — the global guard instance is not the JwtAuthGuard provider; use useExisting + a regular provider|||Vẫn 401 — bản guard toàn cục không phải provider JwtAuthGuard; dùng useExisting + provider thường', 'The test fails to compile|||Test không biên dịch được', 'All routes become public|||Mọi route thành công khai'], 1,
        'EN: Lesson 8.2: with useClass both overrideGuard and overrideProvider still gave 401; with useExisting, overrideProvider works.|||VI: Bài 8.2: với useClass cả overrideGuard lẫn overrideProvider vẫn 401; với useExisting thì overrideProvider ăn.'),
      q('A suite has 89% line coverage. How many of 8 deliberate bugs (mutants) did it catch in lesson 8.5?|||Một bộ test phủ 89% dòng. Bài 8.5 cho thấy nó bắt được bao nhiêu trong 8 lỗi cố ý (đột biến)?',
        ['8|||8', '7|||7', '4|||4', '0|||0'], 3,
        'EN: Lesson 8.5: 0 of 8. Fourteen targeted tests caught 8 of 8. Coverage shows what ran, not what was checked.|||VI: Bài 8.5: 0/8. Mười bốn test nhắm đúng chỗ bắt 8/8. Độ phủ cho biết cái gì đã chạy, không cho biết cái gì được kiểm.'),
      q('A BullMQ worker is killed with SIGKILL right after sending an email, before recording it. No idempotency layer. Lesson 9.1 result?|||Worker BullMQ bị SIGKILL ngay sau khi gửi email, trước khi kịp ghi lại. Không có lớp idempotency nào. Kết quả ở bài 9.1?',
        ['One email — BullMQ is exactly-once|||Một email — BullMQ giao đúng một lần', 'Two emails — the stalled job is delivered again|||Hai email — job bị treo được giao lại', 'No email — the job is lost|||Không email — job bị mất', 'The queue stops until restarted manually|||Hàng đợi dừng tới khi khởi động lại bằng tay'], 1,
        'EN: Lesson 9.1, and 9.4 for the fix (job id + sent-log + provider key). 12.4 added a test for each layer.|||VI: Bài 9.1, cách sửa ở 9.4 (id job + sổ đã gửi + khoá nhà cung cấp). Bài 12.4 thêm test cho từng lớp.'),
      q('In 12.4 the job id was removed from the "hours changed" job, but email_log still blocked duplicates. What did the existing test do?|||Ở bài 12.4, id của job "đổi giờ" bị gỡ, nhưng email_log vẫn chặn email trùng. Test hiện có làm gì?',
        ['Went red|||Đỏ', 'Stayed green — it only proved the second layer; a job-count assertion was added|||Vẫn xanh — nó chỉ chứng minh lớp thứ hai; đã thêm khẳng định đếm job', 'Timed out|||Hết giờ', 'Was skipped|||Bị bỏ qua'], 1,
        'EN: Lesson 12.4: a layer without its own test will eventually be "simplified" away.|||VI: Bài 12.4: lớp nào không có test riêng thì sớm muộn sẽ bị "rút gọn" mất.'),
      q('A cron job decorated with @Cron runs in an app with 3 replicas. How many times per tick did lesson 9.2 observe?|||Một cron job gắn @Cron chạy trong ứng dụng có 3 bản. Bài 9.2 quan sát mỗi lượt chạy mấy lần?',
        ['1|||1', '2|||2', '3|||3', 'It depends on which replica started first|||Tuỳ bản nào khởi động trước'], 2,
        'EN: Lesson 9.2: 3 — use the queue\'s job scheduler (one job per tick) or a lock per tick.|||VI: Bài 9.2: 3 — dùng job scheduler của hàng đợi (mỗi lượt một job) hoặc khoá theo lượt.'),
      q('Where should a Socket.IO gateway authenticate the JWT?|||Gateway Socket.IO nên xác thực JWT ở đâu?',
        ['@UseGuards on the gateway class|||@UseGuards trên lớp gateway', 'In handleConnection, then disconnect|||Trong handleConnection, rồi ngắt', 'In a Socket.IO middleware at the handshake (afterInit), plus an Origin allow-list|||Trong middleware Socket.IO lúc bắt tay (afterInit), cộng danh sách Origin được phép', 'It is not needed when CORS is configured|||Không cần nếu đã cấu hình CORS'], 2,
        'EN: Lesson 10.2: guards did not block the connection; handleConnection let 21 messages through in 100 ms; the middleware let 0.|||VI: Bài 10.2: guard không chặn kết nối; handleConnection để lọt 21 tin trong 100 mili giây; middleware lọt 0.'),
      q('RoomsService has constructor(private readonly repo: RoomsRepo), where RoomsRepo is a TypeScript interface with one provider implementing it. What happens at startup?|||RoomsService có constructor(private readonly repo: RoomsRepo), với RoomsRepo là một interface TypeScript và có một provider cài đặt nó. Lúc khởi động chuyện gì xảy ra?',
        ['Nest finds the implementing provider automatically|||Nest tự tìm provider cài đặt interface', 'Nest cannot resolve dependencies of RoomsService (?) — interfaces vanish at compile time; use an abstract class or an @Inject() token|||Nest can\'t resolve dependencies of RoomsService (?) — interface biến mất khi biên dịch; dùng abstract class hoặc token @Inject()', 'It starts, and repo is undefined at runtime|||Khởi động được, và repo là undefined lúc chạy', 'TypeScript refuses to compile|||TypeScript không cho biên dịch'], 1,
        'EN: Lesson 2.2: the emitted metadata is Object, shown as "?". import type has the same effect.|||VI: Bài 2.2: metadata sinh ra là Object, hiện thành "?". import type cũng gây hệ quả y hệt.'),
      q('GET /bookings/mine (JWT, returns the caller\'s bookings). A teammate registers CacheInterceptor globally "for speed". What did lesson 11.4 show?|||GET /bookings/mine (có JWT, trả lịch của người gọi). Một bạn đăng ký CacheInterceptor toàn cục "cho nhanh". Bài 11.4 cho thấy gì?',
        ['Faster and correct — the cache key includes the user|||Nhanh hơn và đúng — khoá cache có tính người dùng', 'No effect — cache only applies to public routes|||Không tác dụng — cache chỉ áp cho route công khai', 'A second user received the first user\'s bookings — the default cache key is the URL|||Người dùng thứ hai nhận lịch của người thứ nhất — khoá cache mặc định là URL', '500 — the interceptor cannot serialize dates|||500 — interceptor không tuần tự hoá được ngày giờ'], 2,
        'EN: Lesson 11.4: cache per user (custom trackBy) or not at all on personal data.|||VI: Bài 11.4: cache theo người dùng (trackBy riêng) hoặc không cache dữ liệu cá nhân.'),
      q('nest-cli.json uses the @nestjs/swagger plugin with default options. The response class lives in booking.response.ts. What does the generated schema contain?|||nest-cli.json dùng plugin @nestjs/swagger với tuỳ chọn mặc định. Lớp phản hồi nằm trong booking.response.ts. Schema sinh ra có gì?',
        ['All properties, read from TypeScript types|||Đủ các trường, đọc từ kiểu TypeScript', 'An empty object — by default the plugin only reads *.dto.ts and *.entity.ts|||Một object rỗng — mặc định plugin chỉ đọc *.dto.ts và *.entity.ts', 'A build error|||Lỗi build', 'Only properties with @Expose()|||Chỉ các trường có @Expose()'], 1,
        'EN: Lesson 12.2: empty since milestone 4 until dtoFileNameSuffix included .response.ts. The committed openapi.json + CI diff made it visible.|||VI: Bài 12.2: rỗng từ mốc 4 cho tới khi dtoFileNameSuffix có .response.ts. openapi.json được commit + diff trong CI làm nó lộ ra.'),
      q('compose.yaml: a "seed" service in profile demo has SEED_PASSWORD: ${SEED_PASSWORD:?required}. SEED_PASSWORD is not set. You run docker compose up (without the profile). Result?|||compose.yaml: dịch vụ "seed" trong profile demo có SEED_PASSWORD: ${SEED_PASSWORD:?required}. Chưa đặt SEED_PASSWORD. Chạy docker compose up (không bật profile). Kết quả?',
        ['Starts normally — seed is not enabled|||Khởi động bình thường — seed không được bật', 'Fails: compose interpolates every service, including disabled profiles|||Hỏng: compose nội suy mọi dịch vụ, kể cả profile chưa bật', 'Starts and prints a warning|||Khởi động và in cảnh báo', 'Starts seed anyway|||Vẫn chạy seed'], 1,
        'EN: Lesson 12.5, measured with docker compose config. The check moved into seed.ts.|||VI: Bài 12.5, đo bằng docker compose config. Phép kiểm được dời vào seed.ts.'),
    ].map((x, i) => dat(x, VI_TRI[i])),
  },
};
