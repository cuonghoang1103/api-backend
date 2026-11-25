/**
 * 12.7 — Câu hỏi phỏng vấn NestJS kèm gợi ý trả lời (khoá nestjs, soạn 24/11/2026). Bài tổng hợp: mỗi gợi ý trỏ về bài và SỐ ĐO THẬT
 * đã chạy trong khoá (Chương 1–12); không có thí nghiệm mới. Ghép: ghep.sh 127 nst-12-7-phong-van (c127.txt rỗng).
 */
import { lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-2-6-so-spring', title: 'NestJS 2.6 — Nest đặt cạnh Spring', sub: 'Bảng dịch 14 dòng cho các câu "so với Spring".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-6-thu-tu', title: 'NestJS 3.6 — Thứ tự chạy đo thật', sub: 'Câu hỏi vòng đời request hay gặp nhất.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-0-4-du-an', title: 'Node.js 0.4 — Dự án xuyên suốt', sub: 'Câu hỏi nền Node/Express không nhắc lại ở đây.', cta: 'Mở bài →' }),
].join('\n');

// [nhóm, câu EN, câu VI, gợi ý EN, gợi ý VI]
const Q = [
  ['A', 'What problem does Nest solve that Express does not?', 'Nest giải quyết vấn đề gì mà Express không giải quyết?',
    'Express gives routing and middleware; it says nothing about where business rules, validation or authorization live, so every team invents a structure. Nest runs on Express (or Fastify) and adds modules, dependency injection and fixed places for each concern (guard, pipe, interceptor, filter). Cost: decorators, metadata "magic", slower start. In 1.5 the same Notes API was 81 lines in Express and 93 in Nest — Nest is not shorter, it is more predictable.',
    'Express cho định tuyến và middleware; nó không nói luật nghiệp vụ, kiểm dữ liệu hay phân quyền nằm ở đâu, nên nhóm nào cũng tự chế cấu trúc. Nest chạy trên Express (hoặc Fastify) và thêm module, dependency injection và chỗ cố định cho từng mối quan tâm (guard, pipe, interceptor, filter). Cái giá: decorator, "phép màu" metadata, khởi động chậm hơn. Ở bài 1.5 cùng một Notes API: Express 81 dòng, Nest 93 — Nest không ngắn hơn, nó dễ đoán hơn.'],
  ['A', 'Explain dependency injection as if I had never used it.', 'Giải thích dependency injection như thể tôi chưa dùng bao giờ.',
    'A class says what it needs in its constructor; it does not create it. The container reads the constructor types (design:paramtypes metadata), builds the graph leaves-first and hands each class its dependencies. Benefit: replace a dependency without editing the class — a fake payment gateway in tests, a real one in production (lab 2.7). You wrote a 52-line container in 2.1.',
    'Một lớp khai trong constructor nó cần gì; nó không tự tạo thứ đó. Container đọc kiểu tham số constructor (metadata design:paramtypes), dựng đồ thị từ lá lên và trao cho mỗi lớp phụ thuộc của nó. Lợi ích: thay một phụ thuộc mà không sửa lớp — cổng thanh toán giả khi test, thật khi chạy (lab 2.7). Bạn đã tự viết container 52 dòng ở bài 2.1.'],
  ['A', 'Why can\'t I inject an interface?', 'Sao không tiêm được một interface?',
    'Interfaces disappear when TypeScript compiles; the emitted metadata is Object, so Nest reports the parameter as "?" (2.2). Use an abstract class as the token, or a string/symbol token with @Inject(). import type has the same effect as an interface.',
    'Interface biến mất khi TypeScript biên dịch; metadata sinh ra là Object, nên Nest báo tham số đó là "?" (2.2). Dùng abstract class làm token, hoặc token chuỗi/symbol kèm @Inject(). import type cũng gây hệ quả y như interface.'],
  ['A', 'Singleton, request and transient scope — when would you use request scope?', 'Scope singleton, request và transient — khi nào dùng request scope?',
    'Default singleton. Request scope creates a new instance per request — and every class that depends on it becomes request-scoped too: in 2.4, 3,000 requests created 3,003 controller instances instead of 1 (and ran about 30% slower). Prefer passing request data explicitly or AsyncLocalStorage (nestjs-cls); use request scope only for per-tenant connections and the like.',
    'Mặc định singleton. Request scope tạo bản mới cho mỗi request — và mọi lớp phụ thuộc vào nó cũng thành request scope: ở bài 2.4, 3.000 request tạo 3.003 bản controller thay vì 1 (và chậm hơn khoảng 30%). Ưu tiên truyền dữ liệu request tường minh hoặc AsyncLocalStorage (nestjs-cls); chỉ dùng request scope cho kiểu kết nối theo từng tenant.'],
  ['A', 'What does @Global() do and when is it a smell?', '@Global() làm gì và khi nào là dấu hiệu xấu?',
    'It makes a module\'s exports injectable everywhere without importing it. Fine for infrastructure (Prisma, clock); a smell for feature services because dependencies become invisible — the container even binds globals into every module (55 edges in 12.2).',
    'Nó cho export của module tiêm được ở mọi nơi mà không cần import. Ổn với hạ tầng (Prisma, đồng hồ); là dấu hiệu xấu với service tính năng vì phụ thuộc trở nên vô hình — container còn gắn module toàn cục vào mọi module (55 cạnh ở bài 12.2).'],
  ['B', 'Order of middleware, guard, interceptor, pipe, filter?', 'Thứ tự middleware, guard, interceptor, pipe, filter?',
    'Middleware → guards → interceptors (before) → pipes → handler → interceptors (after) → exception filters on error. Within each kind: global → controller → route. Measured step by step in 3.6 (19 of 20 steps observed). Say why each sits where it is: guards need the handler\'s metadata, pipes need the parameter types.',
    'Middleware → guard → interceptor (trước) → pipe → handler → interceptor (sau) → exception filter khi có lỗi. Trong mỗi loại: toàn cục → controller → route. Đã đo từng bước ở bài 3.6 (quan sát được 19/20 bước). Nói vì sao mỗi lớp đứng đó: guard cần metadata của handler, pipe cần kiểu tham số.'],
  ['B', 'Guard or middleware for authentication?', 'Xác thực đặt ở guard hay middleware?',
    'Guard: it runs after routing, so it can read @Public() or role metadata and return 401/403 per route. A middleware cannot know which handler will run. Make the guard global (APP_GUARD) so new routes are closed by default (7.1).',
    'Guard: nó chạy sau khi đã định tuyến, nên đọc được @Public() hay metadata vai trò và trả 401/403 theo từng route. Middleware không biết handler nào sẽ chạy. Đặt guard toàn cục (APP_GUARD) để route mới mặc định đóng (7.1).'],
  ['B', 'What can an interceptor do that a middleware cannot?', 'Interceptor làm được gì mà middleware không làm được?',
    'Wrap the handler: see and transform the return value (serialization, envelope), time it, add a timeout, cache. Caveat from 3.5: a timeout interceptor answers 408 but the handler keeps running to the end.',
    'Bọc quanh handler: thấy và biến đổi giá trị trả về (tuần tự hoá, bọc phản hồi), đo thời gian, đặt timeout, cache. Lưu ý từ bài 3.5: interceptor timeout trả 408 nhưng handler vẫn chạy tới cùng.'],
  ['C', 'How do you stop mass assignment?', 'Chặn mass assignment thế nào?',
    'DTO classes with class-validator plus a global ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }); never spread the body into the ORM. Interfaces or import type as the body type validate nothing (4.1). The GitHub 2012 incident (0.9) is the classic story.',
    'DTO là class có class-validator cộng ValidationPipe toàn cục ({ whitelist: true, forbidNonWhitelisted: true }); không bao giờ rải body thẳng vào ORM. Dùng interface hay import type làm kiểu body thì không kiểm gì cả (4.1). Vụ GitHub 2012 (0.9) là câu chuyện kinh điển.'],
  ['C', 'How do you hide passwordHash in responses?', 'Ẩn passwordHash khỏi phản hồi thế nào?',
    'Response DTOs with an allow-list (@Exclude() on the class, @Expose() per field) and ClassSerializerInterceptor with type set. @Exclude on a field does nothing when the service returns a plain object (4.3). And check the generated OpenAPI — response schemas were silently empty until 12.2.',
    'DTO trả về theo danh sách cho phép (@Exclude() ở lớp, @Expose() từng trường) cùng ClassSerializerInterceptor có đặt type. @Exclude trên một trường không có tác dụng khi service trả object thường (4.3). Và kiểm OpenAPI sinh ra — schema phản hồi từng rỗng im lặng cho tới bài 12.2.'],
  ['C', 'How do you guarantee no double booking?', 'Bảo đảm không đặt trùng thế nào?',
    'In the database: an EXCLUDE constraint on room + time range (6.5). Check-then-insert lets duplicates through under concurrency (6.5: 49 of 50 concurrent requests accepted for one slot). For rules over other rows (quotas), lock: advisory lock in the transaction — 8 of 10 leaked without it, exactly 3 with it (12.3).',
    'Trong cơ sở dữ liệu: ràng buộc EXCLUDE trên phòng + khoảng thời gian (6.5). Kiểm rồi mới ghi để lọt bản trùng khi đồng thời (bài 6.5: 49/50 request đồng thời được nhận cho cùng một khung). Với luật trên các dòng khác (hạn mức) thì khoá: khoá tư vấn trong transaction — không khoá lọt 8/10, có khoá đúng 3 (12.3).'],
  ['C', 'Transactions across two services?', 'Transaction xuyên hai service?',
    'Pass the transaction client explicitly, or use nestjs-cls @Transactional so both services share it (6.2). Never call the network inside a transaction: in 6.2 a 6-second HTTP call hit P2028 (transaction timeout).',
    'Truyền client transaction tường minh, hoặc dùng @Transactional của nestjs-cls để hai service dùng chung (6.2). Không gọi mạng trong transaction: ở bài 6.2 một lời gọi HTTP 6 giây dính P2028 (hết giờ transaction).'],
  ['D', 'Where do you verify a JWT, and what goes wrong?', 'Kiểm JWT ở đâu, và hay sai chỗ nào?',
    'In a global guard, with verify (never decode) and a pinned algorithm. In 7.1 decode instead of verify let 4 forged or expired tokens return 200, and the key "secret" was guessed in 0.19 ms. Add a token version so role changes and logout take effect before expiry (7.3).',
    'Ở guard toàn cục, dùng verify (không bao giờ decode) và ghim thuật toán. Ở bài 7.1 dùng decode thay verify làm 4 token giả hoặc hết hạn vẫn ra 200, và khoá "secret" bị đoán trong 0,19 mili giây. Thêm tokenVersion để đổi vai trò và đăng xuất có hiệu lực trước khi token hết hạn (7.3).'],
  ['D', 'RBAC is not enough — why?', 'RBAC chưa đủ — vì sao?',
    'Roles answer "may a student cancel bookings?"; ownership answers "may this student cancel this booking?". Missing the second is IDOR/BOLA, OWASP API1. In 7.4, 9 of 9 cross-user requests leaked without ownership checks. Return 404 for objects the user may not see.',
    'Vai trò trả lời "sinh viên có được huỷ lịch không?"; quyền sở hữu trả lời "sinh viên này có được huỷ lịch này không?". Thiếu cái sau là IDOR/BOLA, OWASP API1. Ở bài 7.4, 9/9 request chéo người dùng lọt khi không kiểm sở hữu. Trả 404 cho đối tượng người dùng không được thấy.'],
  ['D', 'Rate limiting behind a proxy with several replicas?', 'Giới hạn tốc độ sau proxy với nhiều bản chạy?',
    'Set trust proxy to the number of proxies, or every user shares the proxy\'s IP (7.5). The default storage counts per process — two replicas double the limit (11.5: 199 requests/min passed a 100 limit) — so use a shared store, and decide what happens when that store is down (12.6).',
    'Đặt trust proxy bằng số proxy phía trước, không thì mọi người dùng chung IP của proxy (7.5). Kho mặc định đếm theo từng tiến trình — hai bản nhân đôi giới hạn (11.5: 199 request/phút qua được giới hạn 100) — nên dùng kho chung, và quyết định chuyện gì xảy ra khi kho đó chết (12.6).'],
  ['E', 'How do you unit-test a service with dependencies?', 'Test đơn vị một service có phụ thuộc thế nào?',
    'Test.createTestingModule with the real class and fakes via useValue/overrideProvider, or plain new for simple classes (8.1). Traps: compile() does not call onModuleInit; APP_GUARD with useClass cannot be overridden (8.2 — use useExisting).',
    'Test.createTestingModule với lớp thật và đồ giả qua useValue/overrideProvider, hoặc new thường cho lớp đơn giản (8.1). Bẫy: compile() không gọi onModuleInit; APP_GUARD khai bằng useClass không override được (8.2 — dùng useExisting).'],
  ['E', 'What makes an e2e test trustworthy?', 'Điều gì làm test e2e đáng tin?',
    'Same app setup as production (one cauHinhApp function — 8.3 found 400 in test vs 413 in production), a real database per worker, an injected clock, closing the app after each file, and proof it can fail: remove the protection once and watch it go red.',
    'Cấu hình ứng dụng giống production (một hàm cauHinhApp dùng chung — bài 8.3 thấy test trả 400 còn máy chủ thật trả 413), cơ sở dữ liệu thật cho mỗi worker, đồng hồ tiêm vào, đóng ứng dụng sau mỗi tệp, và bằng chứng nó biết đỏ: gỡ lớp bảo vệ một lần và xem nó đỏ.'],
  ['E', 'Is 90% coverage good?', 'Độ phủ 90% có tốt không?',
    'Coverage says which lines ran, not what was checked. In 8.5 a suite with 89% line coverage killed 0 of 8 mutants; 14 targeted tests killed 8 of 8.',
    'Độ phủ cho biết dòng nào đã chạy, không cho biết điều gì đã được kiểm. Ở bài 8.5 một bộ test phủ 89% dòng diệt 0/8 đột biến; 14 test nhắm đúng chỗ diệt 8/8.'],
  ['F', 'Event emitter or queue?', 'Event emitter hay hàng đợi?',
    'Events are in-process and lost on crash; a queue (BullMQ) survives restarts and retries. Rule: in-process events to decouple modules, a queue for anything that must eventually happen (email). Emit after commit, or you notify about data that was rolled back (9.3).',
    'Sự kiện chạy trong tiến trình và mất khi sập; hàng đợi (BullMQ) sống qua khởi động lại và có thử lại. Quy tắc: sự kiện trong tiến trình để tách module, hàng đợi cho thứ nhất định phải xảy ra (email). Phát sau khi commit, không thì báo về dữ liệu đã bị rollback (9.3).'],
  ['F', 'A cron job with three replicas?', 'Cron job khi có ba bản chạy?',
    'Each replica runs it — three times per tick in 9.2. Use the queue\'s job scheduler (one job per tick) or a lock per tick, and make the job idempotent anyway.',
    'Bản nào cũng chạy — mỗi lượt ba lần ở bài 9.2. Dùng job scheduler của hàng đợi (mỗi lượt một job) hoặc khoá theo lượt, và dù vậy vẫn làm job idempotent.'],
  ['F', 'The worker dies after sending the email but before recording it. What happens?', 'Worker chết sau khi gửi email nhưng trước khi ghi lại. Chuyện gì xảy ra?',
    'BullMQ redelivers the stalled job (at-least-once), so without protection the user gets two emails — measured in 9.1. Layers: deterministic job id, check a sent-log before sending, provider idempotency key; test each layer (12.4).',
    'BullMQ giao lại job bị treo (ít nhất một lần), nên không có bảo vệ thì người dùng nhận hai email — đã đo ở bài 9.1. Các lớp: id job tất định, kiểm sổ đã gửi trước khi gửi, khoá idempotency của nhà cung cấp; test từng lớp (12.4).'],
  ['G', 'How do you authenticate WebSockets?', 'Xác thực WebSocket thế nào?',
    'At the handshake, in a Socket.IO middleware registered in afterInit, plus an Origin allow-list (allowRequest). @UseGuards on the gateway does not block the connection, and checking in handleConnection let 21 messages through in 100 ms (10.2).',
    'Ngay lúc bắt tay, trong middleware Socket.IO đăng ký ở afterInit, cộng danh sách Origin được phép (allowRequest). @UseGuards trên gateway không chặn kết nối, còn kiểm trong handleConnection để lọt 21 tin trong 100 mili giây (10.2).'],
  ['G', 'When would you split into microservices?', 'Khi nào thì tách microservice?',
    'When a part needs independent deployment or scaling and the team boundary matches. A local function call was 0.3 µs vs 57–107 µs over TCP on the same machine (10.4) — before the network, consistency and operations costs. Start as a modular monolith with event boundaries.',
    'Khi một phần cần triển khai hoặc mở rộng độc lập và ranh giới nhóm khớp với nó. Một lời gọi hàm là 0,3 µs so với 57–107 µs qua TCP trên cùng máy (10.4) — chưa kể chi phí mạng, nhất quán dữ liệu và vận hành. Bắt đầu bằng khối nguyên theo module có ranh giới sự kiện.'],
  ['H', 'What goes into a production Dockerfile for Nest?', 'Dockerfile production cho Nest có những gì?',
    'Multi-stage (deps, build, prod-deps, runtime), runtime last or --target, npm ci --omit=dev --omit=optional, USER node, exec-form CMD so Node is PID 1 and receives SIGTERM. 2.75 GB → 106 MB pulled in 11.1; shell-form CMD on Debian waited 10.4 s and exited 137.',
    'Nhiều tầng (deps, build, prod-deps, runtime), runtime đứng cuối hoặc dùng --target, npm ci --omit=dev --omit=optional, USER node, CMD dạng exec để Node là PID 1 và nhận SIGTERM. Bài 11.1: 2,75 GB → 106 MB kéo về; CMD dạng shell trên Debian chờ 10,4 giây rồi thoát 137.'],
  ['H', 'Liveness vs readiness?', 'Liveness khác readiness thế nào?',
    'Liveness: "restart me if false" — no dependencies, or a database outage restarts every pod. Readiness: "send me traffic" — hard dependencies only. 12.6 showed the follow-up question: after Redis became optional, should readiness still check it?',
    'Liveness: "sai thì khởi động lại tôi" — không hỏi phụ thuộc nào, không thì DB chết là mọi pod bị khởi động lại. Readiness: "gửi request cho tôi" — chỉ phụ thuộc bắt buộc. Bài 12.6 cho thấy câu hỏi tiếp theo: khi Redis đã thành tuỳ chọn, readiness có nên kiểm nó nữa không?'],
  ['I', 'Map Nest to Spring in one breath.', 'Dịch Nest sang Spring trong một hơi.',
    '@Module ≈ @Configuration + component scan boundary; provider ≈ @Bean/@Component; @Injectable ≈ @Service; guard ≈ Spring Security filter / @PreAuthorize; pipe ≈ @Valid + converters; interceptor ≈ HandlerInterceptor/AOP; exception filter ≈ @ControllerAdvice. Differences: Nest resolves by type tokens at runtime from TypeScript metadata, modules must export explicitly, no proxies by default (2.6).',
    '@Module ≈ @Configuration + ranh giới component scan; provider ≈ @Bean/@Component; @Injectable ≈ @Service; guard ≈ filter của Spring Security / @PreAuthorize; pipe ≈ @Valid + converter; interceptor ≈ HandlerInterceptor/AOP; exception filter ≈ @ControllerAdvice. Khác biệt: Nest tra theo token kiểu lúc chạy từ metadata TypeScript, module phải export tường minh, mặc định không có proxy (2.6).'],
];
const NHOM = { A: ['Core: modules and DI', 'Lõi: module và DI'], B: ['The request pipeline', 'Dây chuyền xử lý request'], C: ['Data and validation', 'Dữ liệu và kiểm dữ liệu'], D: ['Security', 'Bảo mật'], E: ['Testing', 'Test'], F: ['Background work', 'Việc nền'], G: ['Real time and services', 'Thời gian thực và dịch vụ'], H: ['Production', 'Production'], I: ['Compared with Spring', 'So với Spring'] };
const ve = (vi) => Object.keys(NHOM).map((g) => `<h3>${g}. ${NHOM[g][vi ? 1 : 0]}</h3>\n<ol>\n${Q.filter((q) => q[0] === g).map((q) => `<li><strong>${vi ? q[2] : q[1]}</strong>\n<details><summary>${vi ? 'Gợi ý trả lời' : 'Model answer'}</summary><p>${vi ? q[4] : q[3]}</p></details></li>`).join('\n')}\n</ol>`).join('\n\n');

export default {
  title: '12.7 — NestJS interview questions (with model answers)|||12.7 — Câu hỏi phỏng vấn NestJS (kèm gợi ý trả lời)',
  slug: 'nst-12-7-phong-van',
  type: 'LESSON',
  isFreePreview: true,
  description: '26 câu phỏng vấn NestJS theo 9 nhóm (DI, dây chuyền request, dữ liệu, bảo mật, test, việc nền, realtime, production, so với Spring), mỗi gợi ý trả lời dẫn về một số đo đã chạy thật trong khoá — vì câu trả lời có con số thuyết phục hơn câu trả lời thuộc lòng. Kèm cách trả lời, câu nên hỏi lại nhà tuyển dụng, và bài luyện nói.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 7</span>
<h2>12.7 — Interview questions, answered with numbers you measured</h2>
<p class="lead">Interviewers for Node/Nest positions — including OJT and fresher roles at outsourcing companies — ask the same families of questions. A memorised definition is worth little; "in my project, X happened, I measured Y, so I did Z" is what gets remembered. Every model answer below points to a measurement from this course. Try each question aloud before opening the answer.</p>

<h3>How to answer</h3>
<ul>
<li><strong>Claim → evidence → limit.</strong> "Guards, because they see handler metadata. In my project @Public() is read there. A guard cannot see the parsed body, so validation is a pipe."</li>
<li><strong>Say the number.</strong> 49 of 50 accepted without the constraint; 3,003 instances with request scope.</li>
<li><strong>Admit and route.</strong> "I haven't used Kafka with Nest; I used Redis transport and know the send/emit difference, so I'd start there."</li>
</ul>

${ve(false)}

<h3>Questions to ask the interviewer</h3>
<ul>
<li>"Which Nest version and Node version are your projects on, and how do you upgrade?"</li>
<li>"Do you keep the OpenAPI contract in the repository? Who consumes it?"</li>
<li>"What does your CI run before a merge?"</li>
<li>"For an OJT student, what would the first ticket typically be?"</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Pick five questions at random, answer each aloud in under 60 seconds, record yourself.</li>
<li>For each answer, check: did it contain a claim, a piece of evidence, and a limit?</li>
<li>Write one answer of your own project for "tell me about a bug you found" in that shape.</li>
</ol>
<details><summary>Show a sample answer for "a bug you found"</summary>
<p>"My grader for the capstone reported 11 failures at once. Before believing it I ran a case that had to succeed — it got 400 too. The grader built the end time with toISOString(), which adds milliseconds our DTO rejects. Since then, any test tool I write gets one must-pass case first."</p>
</details>

<h3>💼 On the job</h3>
<p>Interviews at outsourcing companies often include a live task: "add an endpoint with validation and a test" in 30–45 minutes, sometimes on their starter repository. The 3-hour timed version of the capstone (12.1) is the right practice for that; time yourself.</p>

<h3>📌 Summary</h3>
<ul>
<li>26 questions in 9 groups, each with an answer tied to a measured result.</li>
<li>Answer as claim → evidence → limit; say the number.</li>
<li>Ask about versions, contracts and CI — it shows you have worked that way.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 7</span>
<h2>12.7 — Câu hỏi phỏng vấn, trả lời bằng chính con số bạn đã đo</h2>
<p class="lead">Người phỏng vấn vị trí Node/Nest — kể cả OJT và fresher ở công ty outsourcing — hỏi những họ câu hỏi giống nhau. Một định nghĩa học thuộc chẳng đáng bao nhiêu; "trong dự án của em, X đã xảy ra, em đo được Y, nên em làm Z" mới là thứ được nhớ. Mỗi gợi ý trả lời dưới đây trỏ về một phép đo trong khoá. Hãy tự trả lời thành tiếng trước khi mở gợi ý.</p>

<h3>Cách trả lời</h3>
<ul>
<li><strong>Khẳng định → bằng chứng → giới hạn.</strong> "Guard, vì nó thấy metadata của handler. Trong dự án em, @Public() được đọc ở đó. Guard không thấy body đã parse, nên kiểm dữ liệu là việc của pipe."</li>
<li><strong>Nói con số.</strong> 49 trên 50 request được nhận khi không có ràng buộc; 3.003 bản với request scope.</li>
<li><strong>Thừa nhận và dẫn đường.</strong> "Em chưa dùng Kafka với Nest; em đã dùng transport Redis và hiểu khác biệt send/emit, nên em sẽ bắt đầu từ đó."</li>
</ul>

${ve(true)}

<h3>Câu nên hỏi lại nhà tuyển dụng</h3>
<ul>
<li>"Dự án bên mình đang dùng Nest và Node bản nào, và nâng cấp ra sao?"</li>
<li>"Hợp đồng OpenAPI có nằm trong repo không? Ai dùng nó?"</li>
<li>"CI chạy những gì trước khi merge?"</li>
<li>"Với sinh viên OJT, ticket đầu tiên thường là gì?"</li>
</ul>

<h3>🧪 Luyện tập (30 phút)</h3>
<ol>
<li>Chọn ngẫu nhiên năm câu, trả lời thành tiếng mỗi câu dưới 60 giây, tự ghi âm.</li>
<li>Với mỗi câu trả lời, kiểm: có đủ một khẳng định, một bằng chứng, một giới hạn không?</li>
<li>Viết câu trả lời của chính dự án bạn cho câu "kể một lỗi bạn đã tìm ra" theo đúng khuôn đó.</li>
</ol>
<details><summary>Xem câu trả lời mẫu cho "một lỗi bạn đã tìm ra"</summary>
<p>"Bộ chấm dự án cuối của em báo 11 mục trượt một lúc. Trước khi tin, em chạy một ca bắt buộc phải thành công — nó cũng nhận 400. Bộ chấm dựng giờ kết thúc bằng toISOString(), thêm mili giây mà DTO của em từ chối. Từ đó, công cụ kiểm thử nào em viết cũng có một ca bắt buộc phải đạt chạy trước."</p>
</details>

<h3>💼 Tình huống đi làm</h3>
<p>Phỏng vấn ở công ty outsourcing hay có bài làm trực tiếp: "thêm một endpoint có kiểm dữ liệu và một test" trong 30–45 phút, đôi khi trên repo khởi đầu của họ. Bản thi 3 giờ của dự án cuối (12.1) là bài luyện đúng cho việc đó; hãy bấm giờ.</p>

<h3>📌 Tóm tắt</h3>
<ul>
<li>26 câu trong 9 nhóm, câu nào cũng có gợi ý gắn với một kết quả đã đo.</li>
<li>Trả lời theo khuôn khẳng định → bằng chứng → giới hạn; nói con số.</li>
<li>Hỏi lại về phiên bản, hợp đồng API và CI — cho thấy bạn đã từng làm theo cách đó.</li>
</ul>
${THE}
</div>
`,
};
