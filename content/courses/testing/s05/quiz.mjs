/**
 * Testing · Chương 5 · Quiz Chương 5 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-5-6-quiz.
 * Đáp án rải: A ×2 (câu 3, 6) · B ×3 (1, 5, 9) · C ×3 (2, 7, 10) · D ×2 (4, 8).
 */
export default {
  title: 'Chapter 5 check — 10 scenario questions|||Kiểm tra Chương 5 — 10 câu tình huống',
  slug: 'tst-5-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 5: tách createApp khỏi listen, 401/403/404 và IDOR, test chỉ kiểm khoảng mã trạng thái, khoá lạ role trong body, 400 so với 422, đồng hồ khi test token hết hạn, đổi tên trường và lộ dữ liệu bị contract test bắt, khi nào đáng dùng Pact.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Chapter 5 check</h2>
<p class="lead">Ten scenarios about testing an HTTP API. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can test an Express app with Supertest and assert status, headers and the full body.</li>
<li>I can tell 401, 403 and 404 apart and test access control as a table.</li>
<li>I can tell 400 from 422, and check real responses against an OpenAPI contract.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Kiểm tra Chương 5</h2>
<p class="lead">Mười tình huống về test API HTTP. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi test được app Express bằng Supertest và khẳng định mã trạng thái, header và cả body.</li>
<li>Tôi phân biệt được 401, 403, 404 và test phân quyền dạng bảng.</li>
<li>Tôi phân biệt được 400 với 422, và kiểm phản hồi thật theo hợp đồng OpenAPI.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Why does LabFlow Lite export createApp() and keep app.listen() in a separate main.js?|||Vì sao LabFlow Lite xuất createApp() và để app.listen() trong một file main.js riêng?',
        options: [
          'Because Express 5 no longer supports listen() inside the same file.|||Vì Express 5 không còn hỗ trợ listen() trong cùng file.',
          'So tests can build a fresh app with their own repository and clock, and Supertest can send requests without anyone starting a server on a fixed port.|||Để test dựng được một app mới với repository và đồng hồ riêng, và Supertest gửi request được mà không ai phải bật server trên một cổng cố định.',
          'Because Supertest can only test apps that have never listened.|||Vì Supertest chỉ test được app chưa từng listen.',
          'To make the production server faster.|||Để server chạy thật nhanh hơn.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A factory lets every test start from a clean, fully controlled app (memory repository, test secret, fixed clock), and Supertest opens and closes a temporary port by itself. Express 5 still supports listen anywhere; Supertest can also take a URL — the split is about control and isolation, not a technical limit.|||VI: Một hàm dựng app cho mỗi test bắt đầu từ một app sạch, điều khiển được hoàn toàn (repository trong bộ nhớ, khoá cho test, đồng hồ cố định), còn Supertest tự mở và đóng một cổng tạm. Express 5 vẫn listen ở đâu cũng được; Supertest cũng nhận được URL — việc tách là vì quyền điều khiển và sự cô lập, không phải giới hạn kỹ thuật.',
      },
      {
        question: 'Student Bình, logged in, requests GET /api/bookings/1, which belongs to An. What should the API answer?|||Sinh viên Bình đã đăng nhập, gọi GET /api/bookings/1 vốn là của An. API nên trả gì?',
        options: [
          '200 with the booking — Bình is logged in.|||200 kèm lượt đặt — Bình đã đăng nhập.',
          '401 Unauthorized.|||401 Unauthorized.',
          '404 Not Found, exactly as if the booking did not exist.|||404 Not Found, y như khi lượt đặt không tồn tại.',
          '403 Forbidden, so Bình knows the booking exists.|||403 Forbidden, để Bình biết lượt đặt có tồn tại.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Being logged in does not give access to other people’s data — returning it is IDOR, broken access control. 401 is wrong: Bình’s identity is valid. 403 is defensible in some APIs, but it confirms the booking exists, letting an attacker count bookings by trying ids; 404 reveals nothing.|||VI: Đã đăng nhập không có nghĩa được xem dữ liệu của người khác — trả nó ra là IDOR, phân quyền hỏng. 401 sai: danh tính của Bình hợp lệ. 403 có API vẫn dùng, nhưng nó xác nhận lượt đặt tồn tại, giúp kẻ tấn công đếm số lượt đặt bằng cách thử id; 404 không tiết lộ gì.',
      },
      {
        question: 'A logged-in lecturer calls GET /api/admin/bookings, which is for ADMIN only. Which status is correct?|||Một giảng viên đã đăng nhập gọi GET /api/admin/bookings, route chỉ dành cho ADMIN. Mã trạng thái nào đúng?',
        options: [
          '403 Forbidden — the identity is known, the action is not allowed.|||403 Forbidden — biết là ai, nhưng không được làm.',
          '401 Unauthorized — the token is not an admin token.|||401 Unauthorized — token không phải token admin.',
          '400 Bad Request.|||400 Bad Request.',
          '500 Internal Server Error.|||500 Internal Server Error.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 401 means “who are you?” — logging in again will not help the lecturer, so 401 sends the app into a useless re-login loop (mutant #3 of Lab 5). The route exists and its existence is not secret, so 403 is right here.|||VI: 401 nghĩa là “bạn là ai?” — đăng nhập lại cũng không giúp gì giảng viên, nên 401 đẩy app vào vòng đăng nhập lại vô ích (đột biến 3 của Lab 5). Route có thật và sự tồn tại của nó không bí mật, nên 403 là đúng ở đây.',
      },
      {
        question: 'A test for POST /api/bookings asserts expect(res.status).toBeLessThan(300). A bug changes 201 to 200. What happens?|||Một test cho POST /api/bookings khẳng định expect(res.status).toBeLessThan(300). Một bug đổi 201 thành 200. Chuyện gì xảy ra?',
        options: [
          'The test fails, because 200 is not 201.|||Test đỏ, vì 200 khác 201.',
          'Vitest warns about the changed status.|||Vitest cảnh báo mã trạng thái đã đổi.',
          'Supertest refuses 200 for a POST.|||Supertest từ chối 200 cho một POST.',
          'The test stays green; it should assert 201 exactly, plus the Location header and the body.|||Test vẫn xanh; nó nên khẳng định đúng 201, kèm header Location và body.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A range accepts every wrong value inside it — the first Lab 5 attempt killed 0 of 8 mutants this way. Neither Vitest nor Supertest knows which status your API promises; only an exact assertion does.|||VI: Một khoảng chấp nhận mọi giá trị sai nằm trong nó — lần thử đầu của Lab 5 diệt 0/8 đột biến chính vì vậy. Cả Vitest lẫn Supertest không biết API của bạn hứa mã nào; chỉ khẳng định chính xác mới biết.',
      },
      {
        question: 'A client sends { ..., "role": "ADMIN" } in the body of POST /api/bookings. The schema uses z.object instead of z.strictObject. What happens, and what should happen?|||Client gửi { ..., "role": "ADMIN" } trong body của POST /api/bookings. Schema dùng z.object thay vì z.strictObject. Chuyện gì xảy ra, và lẽ ra phải thế nào?',
        options: [
          'The user becomes ADMIN; nothing can prevent it.|||Người dùng trở thành ADMIN; không có cách nào ngăn.',
          'The key is silently dropped and the request succeeds; it should be refused with 400 so the attempt is visible and tested.|||Khoá bị lặng lẽ bỏ đi và request thành công; lẽ ra phải bị từ chối với 400 để hành vi đó lộ ra và được test.',
          'Zod throws and the API answers 500.|||Zod ném lỗi và API trả 500.',
          'Express rejects unknown JSON keys by itself.|||Express tự từ chối khoá JSON lạ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: z.object strips unknown keys, so the role never reaches the code — safe today, but silent; a later change that spreads the body into the row would turn it into privilege escalation. strictObject refuses with 400 “Unrecognized key”, which a test can pin down (mutant #4). The role always comes from the token.|||VI: z.object bỏ khoá lạ, nên role không bao giờ tới code — hôm nay an toàn, nhưng im lặng; một thay đổi sau này trải body vào dòng dữ liệu sẽ biến nó thành leo thang quyền. strictObject từ chối với 400 “Unrecognized key”, thứ một test ghim lại được (đột biến 4). Vai trò luôn lấy từ token.',
      },
      {
        question: 'POST /api/bookings with start "08:15", end "09:00" (the grid is 30 minutes). Which answer fits the LabFlow Lite design?|||POST /api/bookings với start "08:15", end "09:00" (lưới 30 phút). Câu trả lời nào khớp thiết kế LabFlow Lite?',
        options: [
          '422 OFF_GRID: the request is well-formed but breaks a business rule.|||422 OFF_GRID: request đúng định dạng nhưng trái luật nghiệp vụ.',
          '400 VALIDATION: 08:15 is not a valid time.|||400 VALIDATION: 08:15 không phải giờ hợp lệ.',
          '409 OVERLAP.|||409 OVERLAP.',
          '200 with a rounded time.|||200 kèm giờ đã làm tròn.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 08:15 is a valid HH:MM, so the schema accepts it; the grid is a business rule checked by checkSlot, so the answer is 422. Keeping 400 and 422 apart tells the client “fix the form” versus “choose another slot”. Silently rounding would book a slot the user never asked for.|||VI: 08:15 là HH:MM hợp lệ, nên schema chấp nhận; lưới giờ là luật nghiệp vụ do checkSlot kiểm, nên câu trả lời là 422. Tách 400 với 422 giúp client biết “sửa form” hay “chọn khung khác”. Lặng lẽ làm tròn sẽ đặt một khung giờ người dùng chưa từng chọn.',
      },
      {
        question: 'A test for an expired token signs it “now” with a 1-second lifetime and waits 1.5 seconds. It is slow and fails now and then on CI. The best fix?|||Một test token hết hạn ký token “bây giờ” với hạn 1 giây rồi chờ 1,5 giây. Nó chậm và thỉnh thoảng đỏ trên CI. Cách sửa tốt nhất?',
        options: [
          'Wait 5 seconds instead.|||Chờ 5 giây thay vì 1,5.',
          'Mock jose so verify always throws.|||Mock jose để verify luôn ném lỗi.',
          'Pass the clock to createAuth and to jwtVerify (currentDate), then move a fixed clock past the expiry.|||Truyền đồng hồ vào createAuth và vào jwtVerify (currentDate), rồi dịch một đồng hồ cố định qua mốc hết hạn.',
          'Mark the test as retry: 3.|||Đặt retry: 3 cho test.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Time is an input (lesson 2.2). With a controlled clock the test is instant and exact, and can check the boundary (09:59:59 valid, 10:00:00 refused). Mocking jose would test the mock, not the expiry check; longer waits and retries only hide the problem.|||VI: Thời gian là một đầu vào (bài 2.2). Với đồng hồ điều khiển được, test chạy tức thì, chính xác, và kiểm được biên (09:59:59 còn hạn, 10:00:00 bị từ chối). Mock jose là test cái mock chứ không test phần kiểm hết hạn; chờ lâu hơn hay chạy lại chỉ che giấu vấn đề.',
      },
      {
        question: 'A backend developer renames the field start to startTime in responses. All backend tests that check only statuses stay green. What catches it before the React screen breaks?|||Một lập trình viên backend đổi tên trường start thành startTime trong phản hồi. Mọi test backend chỉ kiểm mã trạng thái vẫn xanh. Cái gì bắt được trước khi màn hình React hỏng?',
        options: [
          'A load test.|||Một bài test tải.',
          'TypeScript in the backend.|||TypeScript ở backend.',
          'Code coverage reaching 100%.|||Độ phủ code đạt 100%.',
          'A contract test that checks every real response against openapi.json (required start, additionalProperties false).|||Một contract test kiểm mọi phản hồi thật theo openapi.json (start bắt buộc, additionalProperties false).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The contract names exactly what changed: “must have required property start” and “must NOT have additional properties: startTime”. Coverage can be 100% with status-only assertions, and backend types change together with the rename, so they agree with themselves.|||VI: Hợp đồng gọi tên chính xác điều đã đổi: “must have required property start” và “must NOT have additional properties: startTime”. Độ phủ có thể 100% với test chỉ kiểm mã trạng thái, còn kiểu dữ liệu ở backend đổi cùng lúc với tên trường nên tự khớp với chính nó.',
      },
      {
        question: 'A handler sends res.json(booking) — the stored row, including userId and role. A test asserts expect(res.body).toMatchObject({ lab: "BE-201", seats: 30 }). What is true?|||Một handler gửi res.json(booking) — nguyên dòng đã lưu, gồm userId và role. Một test khẳng định expect(res.body).toMatchObject({ lab: "BE-201", seats: 30 }). Điều nào đúng?',
        options: [
          'The test fails because of the extra fields.|||Test đỏ vì có trường thừa.',
          'The test stays green; toEqual on the full body or the contract with additionalProperties: false would catch the leak.|||Test vẫn xanh; toEqual trên cả body hoặc hợp đồng có additionalProperties: false sẽ bắt được vụ lộ dữ liệu.',
          'Express removes unknown fields before sending.|||Express tự bỏ trường lạ trước khi gửi.',
          'Supertest hides internal fields.|||Supertest ẩn các trường nội bộ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: toMatchObject only checks the listed keys, by design. Leaks are extra data, so only an assertion that forbids extra data can see them.|||VI: toMatchObject chỉ kiểm các khoá được liệt kê, đúng như thiết kế của nó. Lộ dữ liệu là dữ liệu thừa, nên chỉ một khẳng định cấm dữ liệu thừa mới thấy được.',
      },
      {
        question: 'When is a consumer-driven contract tool such as Pact worth its cost over a checked OpenAPI file?|||Khi nào một công cụ hợp đồng do client dẫn dắt như Pact đáng giá hơn một file OpenAPI được kiểm?',
        options: [
          'Always — OpenAPI checks are useless.|||Luôn luôn — kiểm OpenAPI là vô ích.',
          'Only for APIs without authentication.|||Chỉ cho API không có xác thực.',
          'When several teams or clients depend on one API and need to know which fields each of them actually uses.|||Khi nhiều nhóm hoặc nhiều client cùng phụ thuộc một API và cần biết mỗi bên thật sự dùng trường nào.',
          'Never — it replaces all other API tests.|||Không bao giờ — nó thay thế mọi test API khác.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Pact records what each client really sends and reads, and the provider replays it — powerful across teams, at the cost of a broker and a workflow. For one team with one web client, a checked OpenAPI file is the cheap first step. It complements, not replaces, the API tests of this chapter.|||VI: Pact ghi lại thứ mỗi client thật sự gửi và đọc, rồi phía cung cấp chạy lại — mạnh khi nhiều nhóm, đổi lại cần broker và quy trình. Với một nhóm và một web client, file OpenAPI được kiểm là bước đầu rẻ. Nó bổ sung, không thay thế, các test API của chương này.',
      },
    ],
  },
};
