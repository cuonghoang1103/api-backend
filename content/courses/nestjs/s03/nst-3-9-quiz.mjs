/**
 * 3.9 — Kiểm tra Chương 3 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật của chương
 * (scratchpad/nst/lab/c3/o): câu 1 31-sao ('*path' không khớp '/'), câu 2 32-macdinh (Error lạ ⇒ 500 chung, stack ở log),
 * câu 3 33-pipe (/tho ⇒ "21"), câu 4 33-pipe (9007199254740993 ⇒ …992, 200), câu 5 34-guard (@Public + @Roles ở class ⇒ 403),
 * câu 6 34-guard (/rooms/abc không khoá ⇒ 401), câu 7 35-icp (408 nhưng handler vẫn chạy xong), câu 8 36-di (useGlobalGuards(new) ⇒ 500 TypeError),
 * câu 9 36-bt (filter route chỉ NotFound ⇒ filter controller bắt, toàn cục không chạy), câu 10 37-test (guard chặn ⇒ không dòng kiểm toán).
 * Phân bố đáp án: A3 B2 C3 D2.
 */
export default {
  title: '3.9 — Chapter 3 quiz|||3.9 — Kiểm tra Chương 3',
  slug: 'nst-3-9-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 3: mẫu wildcard của middleware, lỗi lạ thành 500, tham số không pipe, id lớn bị làm tròn, @Public và guard vai trò, guard chạy trước pipe, timeout không huỷ việc, useGlobalGuards không DI, filter nào bắt lỗi, và vì sao lần bị từ chối không vào nhật ký kiểm toán.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each one checked against real output from this chapter. Most ask "what does the client get?" or "which layer runs?" — the questions you will answer in code review.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say, for any requirement, which of the five layers it belongs to and why.</li>
<li>I can write the order: middleware → guard → interceptor → pipe → handler → interceptor → filter.</li>
<li>I know what Nest returns for HTTP exceptions and for unknown errors, and what must never reach the client.</li>
<li>I know the gaps of the built-in pipes (big ids, bare dates) and of RxJS <code>timeout</code>.</li>
<li>I can explain why global layers should be registered with <code>APP_*</code> providers.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương. Phần lớn hỏi "client nhận gì?" hoặc "lớp nào chạy?" — đúng những câu bạn sẽ trả lời khi review mã.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Với yêu cầu bất kỳ, tôi nói được nó thuộc lớp nào trong năm lớp và vì sao.</li>
<li>Tôi viết được thứ tự: middleware → guard → interceptor → pipe → handler → interceptor → filter.</li>
<li>Tôi biết Nest trả gì cho ngoại lệ HTTP và cho lỗi lạ, và thứ gì không bao giờ được tới client.</li>
<li>Tôi biết kẽ hở của pipe dựng sẵn (id lớn, ngày trần) và của <code>timeout</code> trong RxJS.</li>
<li>Tôi giải thích được vì sao lớp toàn cục nên đăng ký bằng provider <code>APP_*</code>.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Nest 12 app: consumer.apply(logMw).forRoutes(\'*path\'). Requests: GET /, GET /rooms, GET /rooms/7/bookings. For which ones does logMw run?|||Ứng dụng Nest 12: consumer.apply(logMw).forRoutes(\'*path\'). Các request: GET /, GET /rooms, GET /rooms/7/bookings. logMw chạy với những request nào?',
        options: [
          'All three|||Cả ba',
          'Only GET /|||Chỉ GET /',
          'GET /rooms and GET /rooms/7/bookings, but not GET /|||GET /rooms và GET /rooms/7/bookings, không chạy với GET /',
          'None — Nest prints an "Unsupported route path" warning and skips it|||Không cái nào — Nest in cảnh báo "Unsupported route path" và bỏ qua',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 3.1, experiment 4: "*path" requires at least one segment, so "/" is not covered. Use "{*path}" (optional) for every route. Only unnamed legacy patterns like "rooms/*" print the warning.|||VI: Bài 3.1, thí nghiệm 4: "*path" cần ít nhất một đoạn, nên "/" không được khớp. Dùng "{*path}" (tuỳ chọn) cho mọi route. Chỉ mẫu cũ không tên như "rooms/*" mới in cảnh báo.',
      },
      {
        question: 'A handler throws new Error(\'connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin)\'). No custom filter. What does the client receive?|||Một handler ném new Error(\'connect ECONNREFUSED 10.0.3.15:5432 (user=lab_admin)\'). Không có filter tự viết. Client nhận gì?',
        options: [
          '500 {"statusCode":500,"message":"Internal server error"}; the message and stack go to the server log|||500 {"statusCode":500,"message":"Internal server error"}; message và stack nằm ở log server',
          '500 with the original message so the client can retry|||500 kèm message gốc để client thử lại',
          '503 Service Unavailable, because the database is down|||503 Service Unavailable, vì cơ sở dữ liệu sập',
          'The process crashes and the connection is reset|||Tiến trình sập và kết nối bị ngắt',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 3.2, experiment 1: anything that is not an HttpException becomes a generic 500; BaseExceptionFilter logs the error with its stack. Nest does not guess 503. The process only dies for errors outside the awaited chain (setTimeout callback, experiment 4).|||VI: Bài 3.2, thí nghiệm 1: thứ gì không phải HttpException đều thành 500 chung chung; BaseExceptionFilter ghi lỗi kèm stack vào log. Nest không tự đoán 503. Tiến trình chỉ chết với lỗi nằm ngoài chuỗi được await (callback setTimeout, thí nghiệm 4).',
      },
      {
        question: '@Get() list(@Query(\'page\') page: number) { return page + 1; } — no pipes anywhere, no global ValidationPipe. GET /?page=2 returns…|||@Get() list(@Query(\'page\') page: number) { return page + 1; } — không có pipe nào, không có ValidationPipe toàn cục. GET /?page=2 trả về…',
        options: [
          '3|||3',
          'A 400 error, because "2" is not a number|||Lỗi 400, vì "2" không phải số',
          'NaN|||NaN',
          '"21"|||"21"',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 3.3, line /tho: typeof page is "string". The TypeScript type is erased at runtime and nothing converts the value, so + concatenates. Add ParseIntPipe (with DefaultValuePipe first if the parameter is optional).|||VI: Bài 3.3, dòng /tho: typeof page là "string". Kiểu TypeScript bị xoá lúc chạy và không có gì chuyển đổi, nên + nối chuỗi. Thêm ParseIntPipe (kèm DefaultValuePipe đứng trước nếu tham số không bắt buộc).',
      },
      {
        question: '@Param(\'id\', ParseIntPipe) id: number. GET /rooms/9007199254740993 — what happens?|||@Param(\'id\', ParseIntPipe) id: number. GET /rooms/9007199254740993 — chuyện gì xảy ra?',
        options: [
          '400: the number is too large|||400: số quá lớn',
          '200, but the handler receives 9007199254740992 — a different id|||200, nhưng handler nhận 9007199254740992 — một id khác',
          '200 with the exact value as a BigInt|||200 với đúng giá trị dạng BigInt',
          '500: RangeError|||500: RangeError',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 3.3: ParseIntPipe checks the string is numeric, then converts; beyond Number.MAX_SAFE_INTEGER the value is silently rounded. The exercise\'s ParseIdPipe refuses with Number.isSafeInteger. Keep BIGINT ids as strings.|||VI: Bài 3.3: ParseIntPipe kiểm chuỗi là số rồi chuyển; vượt Number.MAX_SAFE_INTEGER thì giá trị bị làm tròn lặng lẽ. ParseIdPipe ở bài tập từ chối bằng Number.isSafeInteger. Giữ id BIGINT ở dạng chuỗi.',
      },
      {
        question: 'Two global guards: ApiKeyGuard (skips routes marked @Public) then RolesGuard (checks @Roles, ignores @Public). Controller has @Roles([\'sv\',\'gv\']); method list() has @Public(). Anonymous GET /rooms returns…|||Hai guard toàn cục: ApiKeyGuard (bỏ qua route gắn @Public) rồi RolesGuard (kiểm @Roles, không xét @Public). Controller có @Roles([\'sv\',\'gv\']); method list() có @Public(). GET /rooms ẩn danh trả về…',
        options: [
          '200 — @Public on the method overrides everything|||200 — @Public ở method ghi đè mọi thứ',
          '401 — no API key|||401 — không có khoá API',
          '403 — RolesGuard finds the class roles and no user|||403 — RolesGuard thấy vai trò ở class mà không có user',
          '500 — req.user is undefined|||500 — req.user là undefined',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 3.4, the real bug found while writing: the first guard let the request through without a user; the second found roles on the class and returned false ⇒ 403 "Forbidden resource". Every guard in the chain must honour @Public (or merge the checks).|||VI: Bài 3.4, lỗi thật phát hiện lúc soạn: guard đầu cho qua mà không có user; guard thứ hai thấy vai trò ở class và trả false ⇒ 403 "Forbidden resource". Mọi guard trong chuỗi phải tôn trọng @Public (hoặc gộp các bước kiểm).',
      },
      {
        question: 'Global API key guard; route GET /rooms/:id uses ParseIntPipe. Request GET /rooms/abc with no key. Status?|||Guard khoá API toàn cục; route GET /rooms/:id dùng ParseIntPipe. Request GET /rooms/abc không có khoá. Mã trạng thái?',
        options: [
          '401 — guards run before pipes|||401 — guard chạy trước pipe',
          '400 — the id is checked first|||400 — id được kiểm trước',
          '404 — no room "abc"|||404 — không có phòng "abc"',
          '401 and 400 merged into one problem+json|||401 và 400 gộp vào một problem+json',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lessons 3.4 and 3.6: guards run before interceptors and pipes. Without a key the request never reaches ParseIntPipe; with a key the same URL gives 400. Strangers learn nothing about which ids are valid.|||VI: Bài 3.4 và 3.6: guard chạy trước interceptor và pipe. Không có khoá thì request không bao giờ tới ParseIntPipe; có khoá thì cùng URL đó ra 400. Người lạ không biết được id nào hợp lệ.',
      },
      {
        question: 'TimeoutInterceptor uses RxJS timeout(200) and maps TimeoutError to 408. The handler takes 500 ms and writes a booking to the database at the end. What happens?|||TimeoutInterceptor dùng timeout(200) của RxJS và đổi TimeoutError thành 408. Handler mất 500 ms và cuối cùng ghi một lịch đặt vào cơ sở dữ liệu. Chuyện gì xảy ra?',
        options: [
          'Client gets 408 and the write is cancelled|||Client nhận 408 và lệnh ghi bị huỷ',
          'Client waits 500 ms, then gets 201|||Client chờ 500 ms rồi nhận 201',
          'Client gets 408 after 200 ms, and the handler still finishes and writes the booking|||Client nhận 408 sau 200 ms, còn handler vẫn chạy xong và ghi lịch đặt',
          'Nest kills the handler\'s promise and logs a warning|||Nest giết promise của handler và ghi cảnh báo',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 3.5, /rooms/cham: 408 after ~200 ms, then "handler VẪN chạy xong sau 500 ms". timeout stops waiting, not the work. Real cancellation needs an AbortSignal passed into the I/O; and the client may retry, so the write should be idempotent.|||VI: Bài 3.5, /rooms/cham: 408 sau khoảng 200 ms, rồi "handler VẪN chạy xong sau 500 ms". timeout dừng việc chờ, không dừng việc làm. Huỷ thật cần truyền AbortSignal vào thao tác I/O; và client có thể gửi lại, nên lệnh ghi phải idempotent.',
      },
      {
        question: 'main.ts: app.useGlobalGuards(new RolesGuard()); RolesGuard\'s constructor takes a Reflector. What happens on the first request?|||main.ts: app.useGlobalGuards(new RolesGuard()); constructor của RolesGuard nhận một Reflector. Request đầu tiên ra sao?',
        options: [
          'Nest injects Reflector automatically because the class is @Injectable()|||Nest tự tiêm Reflector vì class có @Injectable()',
          'Startup fails with "Nest can\'t resolve dependencies"|||Khởi động lỗi "Nest can\'t resolve dependencies"',
          'The guard is ignored and the request passes|||Guard bị bỏ qua và request đi qua',
          '500 — TypeError: Cannot read properties of undefined (reading \'getAllAndOverride\')|||500 — TypeError: Cannot read properties of undefined (reading \'getAllAndOverride\')',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 3.6, CACH=new: an instance you create yourself is outside the container, so nothing is injected and nothing is checked at startup — it fails per request. Register with { provide: APP_GUARD, useClass: RolesGuard } instead.|||VI: Bài 3.6, CACH=new: đối tượng tự tạo nằm ngoài container, nên không gì được tiêm và lúc khởi động cũng không ai kiểm — nó hỏng ở từng request. Hãy đăng ký bằng { provide: APP_GUARD, useClass: RolesGuard }.',
      },
      {
        question: 'Filters: route-level @Catch(NotFoundException), controller-level @Catch(HttpException), global @Catch(HttpException). The handler throws HttpException(\'…\', 418). Which filters run?|||Filter: mức route @Catch(NotFoundException), mức controller @Catch(HttpException), toàn cục @Catch(HttpException). Handler ném HttpException(\'…\', 418). Những filter nào chạy?',
        options: [
          'All three, route first|||Cả ba, route trước',
          'Only the controller filter|||Chỉ filter controller',
          'Controller then global|||Controller rồi toàn cục',
          'Only the global filter, because 418 is not a standard error|||Chỉ filter toàn cục, vì 418 không phải lỗi chuẩn',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 3.6 exercise: the route filter does not match, so Nest moves outward; the controller filter matches and handles it. One error, one filter — the global filter never runs.|||VI: Bài tập 3.6: filter route không khớp, nên Nest đi ra một lớp; filter controller khớp và xử lý. Một lỗi, một filter — filter toàn cục không chạy.',
      },
      {
        question: 'Lab 3.7: the audit line is written in a global interceptor. A student calls a teacher-only route and gets 403 from the global guard. What is in the audit trail?|||Lab 3.7: dòng kiểm toán được ghi trong một interceptor toàn cục. Một sinh viên gọi route chỉ dành cho giảng viên và nhận 403 từ guard toàn cục. Nhật ký kiểm toán có gì?',
        options: [
          'Nothing — the guard rejected before the interceptor ran|||Không có gì — guard chặn trước khi interceptor chạy',
          'A line with ketQua 403, written by the interceptor\'s error branch|||Một dòng ketQua 403, do nhánh error của interceptor ghi',
          'A line with ketQua 403 and hanhDong "undefined.undefined"|||Một dòng ketQua 403 với hanhDong "undefined.undefined"',
          'Two lines: one from the guard, one from the interceptor|||Hai dòng: một của guard, một của interceptor',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lab 3.7, test "THỨ TỰ: guard chặn ⇒ interceptor CHƯA chạy": the audit array stays empty. To log denials, write them in the guard (it knows the handler); writing them in the filter gives "undefined.undefined", as the extra exercise showed.|||VI: Lab 3.7, test "THỨ TỰ: guard chặn ⇒ interceptor CHƯA chạy": mảng kiểm toán vẫn rỗng. Muốn ghi lần bị từ chối, ghi ở guard (nó biết handler); ghi ở filter sẽ ra "undefined.undefined", như bài tập thêm đã cho thấy.',
      },
    ],
  },
};
