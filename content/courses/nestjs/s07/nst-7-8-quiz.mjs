/**
 * 7.8 — Kiểm tra Chương 7 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c7/o):
 * câu 1 71-decode (4 token giả/chết lọt 200), câu 2 71-thieu (khởi động được, /login 500), câu 3 71-jwt (Passport 401 trơn),
 * câu 4 72-thoigian (79,3 vs 2,3 ms), câu 5 72-auth (access 200 sau logout), câu 6 72-auth (tái dùng R1 ⇒ R2 cũng 401),
 * câu 7 73-nguoc (đảo guard ⇒ 7×500), câu 8 73-ha (token cũ duyệt 200; tokenVersion ⇒ 401), câu 9 74 (CASL 404 lịch người khác),
 * câu 10 75-proxy (trust proxy true ⇒ giả XFF lọt 4/4). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '7.8 — Chapter 7 quiz|||7.8 — Kiểm tra Chương 7',
  slug: 'nst-7-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 7: decode thay verify, khoá JWT đọc lúc import, Passport và guard tự viết, dò email qua thời gian trả lời, logout và access token, tái dùng refresh token, thứ tự guard toàn cục, vai trò cũ trong token, IDOR trả 404 hay 403, và trust proxy với X-Forwarded-For giả.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter (Nest 12.6, @nestjs/jwt 12.0, argon2 0.45, CASL 7.1, @nestjs/throttler 6.8). Most auth bugs pass every happy-path test, so most questions ask what a slightly wrong setup really does.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a JWT guard and say which checks <code>verifyAsync</code> performs.</li>
<li>I can explain why logout does not kill an access token, and what does.</li>
<li>I know in which order global guards run and why it matters.</li>
<li>I can stop IDOR with an ownership check and choose between 404 and 403.</li>
<li>I can set <code>trust proxy</code> correctly behind nginx.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương (Nest 12.6, @nestjs/jwt 12.0, argon2 0.45, CASL 7.1, @nestjs/throttler 6.8). Phần lớn lỗi xác thực qua được mọi test đường thuận, nên phần lớn câu hỏi hỏi một cấu hình hơi lệch thật sự làm gì.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được guard JWT và nói được <code>verifyAsync</code> kiểm những gì.</li>
<li>Tôi giải thích được vì sao logout không giết access token, và cái gì giết được.</li>
<li>Tôi biết guard toàn cục chạy theo thứ tự nào và vì sao điều đó quan trọng.</li>
<li>Tôi chặn được IDOR bằng phép kiểm sở hữu và chọn được giữa 404 và 403.</li>
<li>Tôi đặt đúng <code>trust proxy</code> khi đứng sau nginx.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A guard uses jwtService.decode(token) instead of verifyAsync. Which tokens get 200?|||Một guard dùng jwtService.decode(token) thay cho verifyAsync. Những token nào nhận 200?',
        options: [
          'Only the correctly signed token|||Chỉ token ký đúng',
          'The correct token and the expired one, but not forged ones|||Token đúng và token hết hạn, không có token giả',
          'The correct token, an edited payload with roles admin, alg none, another audience and an expired token|||Token đúng, payload sửa thành roles admin, alg none, audience khác và token hết hạn',
          'None — decode throws without a secret|||Không token nào — decode ném lỗi khi không có khoá',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 7.1: with GUARD=decode, "đổi roles → admin", "alg: none", "aud của dịch vụ khác" and "hết hạn 1 s" all returned 200. decode only reads base64.|||VI: Bài 7.1: với GUARD=decode, "đổi roles → admin", "alg: none", "aud của dịch vụ khác" và "hết hạn 1 s" đều trả 200. decode chỉ đọc base64.',
      },
      {
        question: 'JwtModule.register({ secret: process.env.JWT_SECRET }) while .env is loaded by ConfigModule. What happens?|||JwtModule.register({ secret: process.env.JWT_SECRET }) trong khi .env do ConfigModule nạp. Chuyện gì xảy ra?',
        options: [
          'The app refuses to start: "secretOrPrivateKey must have a value"|||Ứng dụng từ chối khởi động: "secretOrPrivateKey must have a value"',
          'The app starts; the first login returns 500|||Ứng dụng khởi động được; lần đăng nhập đầu tiên trả 500',
          'Tokens are signed with an empty secret and accepted everywhere|||Token được ký bằng khoá rỗng và được nhận ở mọi nơi',
          'Nest waits for ConfigModule automatically, so it works|||Nest tự chờ ConfigModule nên vẫn chạy đúng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 7.1, section 6: "ứng dụng đã khởi động", then POST /login → 500 with "secretOrPrivateKey must have a value" in the log. The object is built at import time. Use registerAsync + ConfigService.|||VI: Bài 7.1, mục 6: "ứng dụng đã khởi động", rồi POST /login → 500, log ghi "secretOrPrivateKey must have a value". Object được dựng lúc import. Dùng registerAsync + ConfigService.',
      },
      {
        question: 'The same seven tokens go through a hand-written guard and through AuthGuard(\'jwt\') from Passport. What differs?|||Cùng bảy token đi qua guard tự viết và qua AuthGuard(\'jwt\') của Passport. Khác nhau ở đâu?',
        options: [
          'Only the error body: Passport answers a bare "Unauthorized", the hand-written guard shows the reason|||Chỉ thân lỗi: Passport trả "Unauthorized" trơn, guard tự viết hiện lý do',
          'Passport accepts alg none, the hand-written guard does not|||Passport nhận alg none, guard tự viết thì không',
          'Passport rejects the correct token without a session|||Passport từ chối token đúng nếu không có session',
          'The hand-written guard skips the expiry check|||Guard tự viết bỏ qua kiểm hạn dùng',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 7.1, section 3: both accept exactly one token and reject six; the security comes from jsonwebtoken underneath.|||VI: Bài 7.1, mục 3: cả hai nhận đúng một token và từ chối sáu; độ an toàn đến từ jsonwebtoken bên dưới.',
      },
      {
        question: 'Login returns the same message for unknown email and wrong password, but skips argon2.verify when the email does not exist. What can an attacker learn?|||Đăng nhập trả cùng câu cho email lạ và sai mật khẩu, nhưng bỏ qua argon2.verify khi email không tồn tại. Kẻ tấn công biết được gì?',
        options: [
          'Nothing — the message is identical|||Không gì cả — câu báo giống hệt',
          'The password hash parameters|||Tham số của hàm băm mật khẩu',
          'The JWT secret|||Khoá JWT',
          'Which emails have accounts, from the response time (79 ms vs 2 ms)|||Email nào có tài khoản, qua thời gian trả lời (79 ms so với 2 ms)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 7.2: LOGIN=ngay-tho measured 79.3 ms (existing email) vs 2.3 ms (unknown). Verifying against a dummy hash made both ~57–65 ms.|||VI: Bài 7.2: LOGIN=ngay-tho đo được 79,3 ms (email có) so với 2,3 ms (email lạ). Verify với chuỗi băm giả làm cả hai còn ~57–65 ms.',
      },
      {
        question: 'A user logs out (refresh token revoked). Ten seconds later the old access token (15-minute JWT) calls GET /auth/me. Result?|||Người dùng đăng xuất (refresh token bị thu hồi). Mười giây sau, access token cũ (JWT 15 phút) gọi GET /auth/me. Kết quả?',
        options: [
          '401 — logout revokes every token|||401 — logout thu hồi mọi token',
          '200 — the JWT stays valid until exp unless the server checks something per request|||200 — JWT vẫn hợp lệ tới exp, trừ khi máy chủ kiểm thêm ở mỗi request',
          '403 — the user is known but logged out|||403 — biết người dùng nhưng đã đăng xuất',
          '440 — session expired|||440 — phiên hết hạn',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 7.2: "GET /me bằng access SAU logout → 200". Milestone 7 adds a tokenVersion check per request for immediate revocation.|||VI: Bài 7.2: "GET /me bằng access SAU logout → 200". Mốc 7 thêm kiểm tokenVersion ở mỗi request để thu hồi ngay.',
      },
      {
        question: 'R1 is rotated into R2. Then R1 is presented again. With reuse detection, what happens to R2?|||R1 đã được đổi thành R2. Sau đó R1 lại được gửi lên. Có phát hiện tái dùng, R2 ra sao?',
        options: [
          'Nothing — only R1 is refused|||Không sao — chỉ R1 bị từ chối',
          'R2 is extended because the owner is active|||R2 được gia hạn vì chủ đang hoạt động',
          'R2 is revoked too: the whole family dies and the owner must log in again|||R2 cũng bị thu hồi: cả họ token chết và chủ phải đăng nhập lại',
          'R1 is accepted once more for compatibility|||R1 được nhận thêm một lần cho tương thích',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 7.2: "KẺ CẮP dùng lại R1 → 401", then "chủ thật dùng R2 (mới nhất) → 401". Milestone 7 test: no active refresh token left for that user.|||VI: Bài 7.2: "KẺ CẮP dùng lại R1 → 401", rồi "chủ thật dùng R2 (mới nhất) → 401". Test mốc 7: người đó không còn refresh token nào còn hiệu lực.',
      },
      {
        question: 'providers: [{ provide: APP_GUARD, useClass: AccessGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }] — AccessGuard reads req.user.roles. What do protected routes return?|||providers: [{ provide: APP_GUARD, useClass: AccessGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }] — AccessGuard đọc req.user.roles. Các route được bảo vệ trả gì?',
        options: [
          '500 for everyone, admin included — req.user does not exist yet|||500 với tất cả, kể cả admin — req.user chưa tồn tại',
          'Correct results — Nest sorts guards by dependency|||Kết quả đúng — Nest tự xếp guard theo phụ thuộc',
          '401 for everyone|||401 với tất cả',
          '200 for everyone|||200 với tất cả',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 7.3, THU_TU=nguoc: every protected route returned 500 with "Cannot read properties of undefined (reading \'roles\')"; only @Public /health stayed 200. Global guards run in providers order.|||VI: Bài 7.3, THU_TU=nguoc: mọi route được bảo vệ trả 500 với "Cannot read properties of undefined (reading \'roles\')"; chỉ /health @Public còn 200. Guard toàn cục chạy theo thứ tự providers.',
      },
      {
        question: 'Roles are copied into a 15-minute JWT. An admin demotes a lecturer at 8:05. At 8:06 the lecturer approves a booking with the old token. Result?|||Vai trò được chép vào JWT 15 phút. Admin hạ một giảng viên lúc 8:05. Lúc 8:06 giảng viên duyệt lịch bằng token cũ. Kết quả?',
        options: [
          '403 — Nest re-reads roles on every request|||403 — Nest tự đọc lại vai trò ở mỗi request',
          '401 — the token is invalid after any change|||401 — token mất hiệu lực sau mọi thay đổi',
          '409 — the role changed during the request|||409 — vai trò đổi trong lúc xử lý request',
          '200 — unless the guard checks the current role or a tokenVersion from the database|||200 — trừ khi guard kiểm vai trò hiện tại hoặc tokenVersion từ cơ sở dữ liệu',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 7.3, KICH=ha-vai-tro: "PATCH /bookings/6/approve gv → 200"; with VAI_TRO=csdl → 401 "Phiên đã bị thu hồi".|||VI: Bài 7.3, KICH=ha-vai-tro: "PATCH /bookings/6/approve gv → 200"; với VAI_TRO=csdl → 401 "Phiên đã bị thu hồi".',
      },
      {
        question: 'Student An calls GET /bookings/102, which belongs to Bình. With the CASL policy of lesson 7.4, what should An receive, and why?|||Sinh viên An gọi GET /bookings/102 của Bình. Với policy CASL của bài 7.4, An nên nhận gì, vì sao?',
        options: [
          '200 — An is logged in|||200 — An đã đăng nhập',
          '403 — to tell An the booking is someone else\'s|||403 — để báo An đây là lịch của người khác',
          '404 — An may not even learn that booking 102 exists|||404 — An không được biết cả việc lịch 102 tồn tại',
          '401 — An\'s token does not cover other users|||401 — token của An không bao người dùng khác',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 7.4, CACH=casl: "tk-an GET /bookings/102 → 404". 403 would confirm the id exists; sequential ids then reveal how many bookings there are.|||VI: Bài 7.4, CACH=casl: "tk-an GET /bookings/102 → 404". 403 sẽ xác nhận id tồn tại; id tăng dần khi đó lộ ra có bao nhiêu lịch.',
      },
      {
        question: 'Nest runs behind one nginx that appends the client IP to X-Forwarded-For. app.set(\'trust proxy\', true). An attacker sends a new fake X-Forwarded-For with every request. What happens to a 3-per-minute IP limit?|||Nest chạy sau một nginx nối IP client vào X-Forwarded-For. app.set(\'trust proxy\', true). Kẻ tấn công gửi X-Forwarded-For giả mới ở mỗi request. Giới hạn 3 lần/phút theo IP ra sao?',
        options: [
          'It works — nginx overwrites the header|||Vẫn chạy — nginx ghi đè header',
          'It is bypassed — req.ip is the leftmost, client-written entry (4/4 passed)|||Bị vượt qua — req.ip là mục bên trái nhất do client viết (lọt 4/4)',
          'Everyone shares one bucket and the real user is blocked|||Mọi người chung một xô và người thật bị chặn',
          'Nest rejects requests with more than one X-Forwarded-For entry|||Nest từ chối request có nhiều hơn một mục X-Forwarded-For',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 7.5, TRUST_PROXY=true: 4/4 attacker requests 200. Without trust proxy everyone shared one bucket (option C); with trust proxy = 1 only the attacker was limited.|||VI: Bài 7.5, TRUST_PROXY=true: 4/4 request của kẻ tấn công 200. Không đặt trust proxy thì mọi người chung một xô (phương án C); trust proxy = 1 thì chỉ kẻ tấn công bị chặn.',
      },
    ],
  },
};
