/**
 * 3.5 — Kiểm tra Chương 3 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-3-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 3.1–3.4 (argon2 0.45.2, Zod 4.6.7, jose 6.2.18, express-rate-limit 8.7.5).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '3.5 — Chapter 3 quiz|||3.5 — Kiểm tra Chương 3',
  slug: 'fp-3-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: SHA-256 vs argon2id, tham số argon2 khi nhiều người đăng ký cùng lúc, mật khẩu tiếng Việt NFC/NFD, thứ tự trim trong Zod, NIST 15 ký tự, mã băm giả khi đăng nhập, thu hồi cả họ refresh token, hai tab refresh cùng lúc, router.use(requireAuth) và 404, access token sau đăng xuất.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while building ChiaSe's authentication. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a password hash must be slow, and what the salt in my hash string is for.</li>
<li>I can draw the two-token design and say which one the server stores.</li>
<li>I can predict what happens when an old refresh token is sent again.</li>
<li>I can give one example each of 401 and 403 in ChiaSe.</li>
<li>My Checkpoint 3 passes 23/23 on a clean clone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi dựng phần xác thực của ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao băm mật khẩu phải chậm, và muối trong chuỗi băm của tôi dùng để làm gì.</li>
<li>Tôi vẽ được thiết kế hai token và nói được server lưu cái nào.</li>
<li>Tôi đoán trước được chuyện gì xảy ra khi một refresh token cũ được gửi lại.</li>
<li>Tôi nêu được mỗi loại một ví dụ 401 và 403 trong ChiaSe.</li>
<li>Checkpoint 3 của tôi đạt 23/23 trên bản clone sạch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A teammate says: "SHA-256 is a secure hash, so storing sha256(password + salt) is fine." What did our measurement show?|||Một bạn cùng nhóm nói: "SHA-256 là hàm băm an toàn, lưu sha256(mật khẩu + muối) là được." Phép đo của ta cho thấy gì?',
        options: [
          'SHA-256 took about 40 ms, as slow as argon2id|||SHA-256 mất khoảng 40 ms, chậm ngang argon2id',
          'About 553,000 SHA-256 guesses per second on one core, versus 40 ms per argon2id guess — the salt does not slow guessing down|||Khoảng 553.000 lần đoán SHA-256 mỗi giây trên một nhân, so với 40 ms mỗi lần đoán argon2id — muối không làm việc đoán chậm đi',
          'SHA-256 cannot be used with a salt|||SHA-256 không dùng được với muối',
          'SHA-256 produces the same hash for the same password even with different salts|||SHA-256 cho cùng mã băm với cùng mật khẩu kể cả khi muối khác nhau',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: "Secure" for SHA-256 means collision-resistant and one-way — and fast. Speed is the attacker\'s friend: a salt stops precomputed tables, not guessing. Password hashes must be slow and memory-hard.|||VI: "An toàn" với SHA-256 nghĩa là khó đụng độ và một chiều — và nhanh. Tốc độ là bạn của kẻ tấn công: muối chặn bảng tính sẵn, không chặn việc đoán. Băm mật khẩu phải chậm và tốn bộ nhớ.',
      },
      {
        question: 'You use argon2\'s library defaults (m=64 MiB, t=3, p=4). Twenty people register at the same second. What did we measure?|||Bạn dùng mặc định của thư viện argon2 (m=64 MiB, t=3, p=4). Hai mươi người đăng ký cùng một giây. Ta đo được gì?',
        options: [
          'All 20 finish in about 187 ms because Node is asynchronous|||Cả 20 xong trong khoảng 187 ms vì Node là bất đồng bộ',
          'The process crashes immediately|||Tiến trình sập ngay',
          'Only 4 run at a time on libuv\'s thread pool; the 20th waited about 1.65 s, and with 8 threads memory grew by about 513 MiB|||Chỉ 4 cái chạy cùng lúc trên threadpool của libuv; người thứ 20 chờ khoảng 1,65 giây, và với 8 luồng bộ nhớ tăng khoảng 513 MiB',
          'argon2 refuses to run more than one hash per process|||argon2 từ chối chạy quá một lần băm mỗi tiến trình',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Asynchronous does not mean free: argon2 runs on the 4-thread pool, so requests queue and memory scales with threads × m. In a 2 GB container that matters. We chose OWASP\'s minimum (19 MiB, t=2, p=1): 20th user under 300 ms.|||VI: Bất đồng bộ không có nghĩa là miễn phí: argon2 chạy trên threadpool 4 luồng, nên request xếp hàng và bộ nhớ tăng theo số luồng × m. Trong container 2 GB thì điều đó quan trọng. Ta chọn mức tối thiểu OWASP (19 MiB, t=2, p=1): người thứ 20 dưới 300 ms.',
      },
      {
        question: 'A user registered on one laptop with password "Mật khẩu của tôi" and cannot log in from another device, typing the same visible text. Most likely cause?|||Một người đăng ký trên laptop này với mật khẩu "Mật khẩu của tôi" và không đăng nhập được từ thiết bị khác, dù gõ đúng chữ nhìn thấy. Nguyên nhân khả dĩ nhất?',
        options: [
          'The second keyboard produced NFD (letter + combining marks) instead of NFC, so the bytes differ and verify returns false|||Bộ gõ thứ hai sinh NFD (chữ + dấu ghép) thay vì NFC, nên các byte khác nhau và verify trả false',
          'argon2 does not support Vietnamese|||argon2 không hỗ trợ tiếng Việt',
          'The salt changes between devices|||Muối thay đổi giữa các thiết bị',
          'Spaces are not allowed in passwords|||Mật khẩu không được có dấu cách',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: We measured it: NFC 16 code units / 23 bytes, NFD 22 / 28 bytes, verify false; normalising to NFC fixed it. NIST 800-63B-4 recommends NFC. That is why bamMatKhau and khopMatKhau both call normalize("NFC").|||VI: Ta đã đo: NFC 16 đơn vị / 23 byte, NFD 22 / 28 byte, verify ra false; chuẩn hoá NFC là khớp. NIST 800-63B-4 khuyên dùng NFC. Vì vậy cả bamMatKhau lẫn khopMatKhau đều gọi normalize("NFC").',
      },
      {
        question: 'Which Zod 4 schema accepts "  An@Mail.COM " and outputs "an@mail.com"?|||Schema Zod 4 nào nhận "  An@Mail.COM " và cho ra "an@mail.com"?',
        options: [
          'z.email()|||z.email()',
          'z.email().trim().toLowerCase()|||z.email().trim().toLowerCase()',
          'z.string().email()|||z.string().email()',
          'z.string().trim().toLowerCase().pipe(z.email())|||z.string().trim().toLowerCase().pipe(z.email())',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: In our run, z.email().trim().toLowerCase() rejected the value: the email check ran before the trim. Clean first, then pipe into the email check.|||VI: Lần chạy của ta cho thấy z.email().trim().toLowerCase() từ chối giá trị này: phép kiểm email chạy trước khi cắt. Làm sạch trước, rồi mới pipe vào phép kiểm email.',
      },
      {
        question: 'Under NIST SP 800-63B-4, which password policy is right for ChiaSe, where the password is the only factor?|||Theo NIST SP 800-63B-4, chính sách mật khẩu nào đúng cho ChiaSe, nơi mật khẩu là yếu tố duy nhất?',
        options: [
          'Minimum 8, must contain uppercase, digit and symbol, change every 90 days|||Tối thiểu 8, phải có chữ hoa, số và ký tự đặc biệt, đổi mỗi 90 ngày',
          'Minimum 15 characters, allow at least 64, no composition rules, no periodic changes|||Tối thiểu 15 ký tự, cho phép ít nhất 64, không luật thành phần, không bắt đổi định kỳ',
          'Maximum 16 characters to keep hashing fast|||Tối đa 16 ký tự để băm cho nhanh',
          'Only ASCII characters, to avoid Unicode problems|||Chỉ ký tự ASCII để tránh rắc rối Unicode',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: NIST requires 15 for single-factor passwords (8 only when part of MFA), should permit ≥ 64, should accept Unicode (each code point counts as one), and forbids composition rules and arbitrary periodic changes. "Abc@1234" passes the old rules and is in every cracking list.|||VI: NIST đòi 15 với mật khẩu là yếu tố duy nhất (8 chỉ khi nằm trong MFA), nên cho phép ≥ 64, nên nhận Unicode (mỗi code point tính một ký tự), và cấm luật thành phần lẫn bắt đổi định kỳ vô cớ. "Abc@1234" qua luật cũ và nằm trong mọi danh sách bẻ khoá.',
      },
      {
        question: 'Login returns the same 401 message for "unknown email" and "wrong password", but returns immediately when the email is unknown. What did we measure?|||Đăng nhập trả cùng một câu 401 cho "email không có" và "sai mật khẩu", nhưng trả ngay khi email không tồn tại. Ta đo được gì?',
        options: [
          'No difference: the message is the same, so nothing leaks|||Không khác gì: câu báo giống nhau nên không lộ gì',
          'A difference of about 0.1 ms, impossible to measure over a network|||Chênh khoảng 0,1 ms, qua mạng không đo nổi',
          '4.8 ms for an unknown email vs 39.8 ms for an existing one — a stopwatch reveals which emails have accounts; a dummy hash brought them to 39.2 vs 41.6 ms|||4,8 ms với email không có so với 39,8 ms với email có — một cái đồng hồ là biết email nào có tài khoản; mã băm giả đưa về 39,2 so với 41,6 ms',
          'The unknown email is slower because the database scans the whole table|||Email không có chậm hơn vì CSDL quét cả bảng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Same words, different timing. Running argon2 against MA_BAM_GIA when the user is missing makes both paths pay the hash. Register does the same by hashing before INSERT (≈ 8 ms gap remained there — written down honestly).|||VI: Cùng câu chữ, khác thời gian. Chạy argon2 với MA_BAM_GIA khi không có user làm cả hai nhánh cùng trả giá phép băm. Đăng ký làm tương tự bằng cách băm trước khi INSERT (ở đó còn lệch ≈ 8 ms — đã ghi trung thực).',
      },
      {
        question: 'A thief copied Chi\'s refresh cookie. Chi refreshed twice since then. The thief now sends the copied (old) token. What happens in ChiaSe?|||Kẻ trộm chép được cookie refresh của Chi. Từ đó Chi đã refresh hai lần. Giờ kẻ trộm gửi token đã chép (cũ). ChiaSe xử lý thế nào?',
        options: [
          'The thief gets 401 REFRESH_DUNG_LAI and the whole family is revoked — Chi\'s newest token stops working too|||Kẻ trộm nhận 401 REFRESH_DUNG_LAI và cả họ bị thu hồi — token mới nhất của Chi cũng hết dùng được',
          'The thief gets a new access token because the old token has not expired (30 days)|||Kẻ trộm nhận access token mới vì token cũ chưa hết hạn (30 ngày)',
          'The thief gets 401 but Chi is unaffected|||Kẻ trộm nhận 401 nhưng Chi không bị ảnh hưởng',
          'The server cannot tell, because it only stores hashes|||Server không phân biệt được vì chỉ lưu mã băm',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: A used token appearing again means a copy exists; the server cannot know who is the thief, so it ends the family (RFC 9700 §4.14.2). Our run: thief 401, then Chi\'s newest cookie 401 too; the log reported the live tokens revoked.|||VI: Token đã dùng xuất hiện lại nghĩa là có bản sao; server không biết ai là kẻ trộm nên kết thúc cả họ (RFC 9700 §4.14.2). Lần chạy của ta: kẻ trộm 401, rồi cookie mới nhất của Chi cũng 401; log ghi số token còn sống bị thu hồi.',
      },
      {
        question: 'Users report "I get logged out randomly, maybe once a day". Both tabs of ChiaSe are usually open. What did dua2.mjs show?|||Người dùng báo "thỉnh thoảng bị đăng xuất, chắc ngày một lần". Họ thường mở ChiaSe ở hai tab. dua2.mjs cho thấy gì?',
        options: [
          'Two simultaneous refreshes always fail|||Hai lần refresh đồng thời luôn thất bại',
          'The browser deletes httpOnly cookies when two tabs are open|||Trình duyệt xoá cookie httpOnly khi mở hai tab',
          'Rotation creates two live tokens in the same family|||Xoay vòng tạo hai token sống trong cùng một họ',
          '19 of 20 times one tab wins harmlessly; 1 time the loser arrives after the token was marked used, looks like reuse, and the whole family — including the winner\'s new token — is revoked|||19/20 lần một tab thắng vô hại; 1 lần request thua tới sau khi token đã bị đánh dấu dùng, trông như dùng lại, và cả họ — kể cả token mới của tab thắng — bị thu hồi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A rare, timing-dependent false alarm. The conditional updateMany prevents two winners, but reuse detection cannot tell a racing tab from a thief. Chapter 6 makes the frontend send one refresh at a time (shared promise).|||VI: Một báo động giả hiếm gặp, phụ thuộc thời điểm. updateMany có điều kiện chặn được hai bên cùng thắng, nhưng phát hiện dùng lại không phân biệt được tab đang đua với kẻ trộm. Chương 6 cho frontend gửi mỗi lúc một lần refresh (promise dùng chung).',
      },
      {
        question: 'You protect routes with apiRouter.use(requireAuth) placed after the public routes. Checkpoint 2 then fails one line. Which?|||Bạn bảo vệ route bằng apiRouter.use(requireAuth) đặt sau các route công khai. Checkpoint 2 liền trượt một dòng. Dòng nào?',
        options: [
          'GET /api/health returns 401|||GET /api/health trả 401',
          'An unknown route returns 401 CHUA_DANG_NHAP instead of 404 KHONG_CO_ROUTE|||Route lạ trả 401 CHUA_DANG_NHAP thay vì 404 KHONG_CO_ROUTE',
          'The X-Powered-By header reappears|||Header X-Powered-By xuất hiện trở lại',
          'Prisma migrate status reports drift|||Prisma migrate status báo lệch',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: router.use runs for every path reaching it, existing or not, so unknown URLs never reach notFound. /health is declared before it, so it still works. We kept the 404 contract by guarding each route and added a test that calls every protected route anonymously.|||VI: router.use chạy cho mọi đường dẫn đi tới nó, có tồn tại hay không, nên URL lạ không bao giờ tới notFound. /health khai báo trước nó nên vẫn chạy. Ta giữ hợp đồng 404 bằng cách gắn bảo vệ từng route, và thêm phép thử gọi mọi route bảo vệ khi ẩn danh.',
      },
      {
        question: 'After POST /api/auth/logout (204), you call GET /api/me with the access token you had before logging out. Result?|||Sau POST /api/auth/logout (204), bạn gọi GET /api/me bằng access token đang cầm từ trước khi đăng xuất. Kết quả?',
        options: [
          '401, because logout revokes all tokens|||401, vì đăng xuất thu hồi mọi token',
          '403, because the session is closed|||403, vì phiên đã đóng',
          '200 — the server does not store access tokens, so it works until it expires (at most 15 minutes)|||200 — server không lưu access token nên nó còn chạy tới khi hết hạn (tối đa 15 phút)',
          '429, because logout counts toward the rate limit|||429, vì đăng xuất bị tính vào giới hạn tần suất',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Measured: 200 after logout. Logout revokes the refresh family and clears the cookie; the stateless access token lives until exp. ChiaSe accepts this window and documents it; shorter TTL, a tokenVersion check or a deny-list are the alternatives.|||VI: Đã đo: 200 sau khi đăng xuất. Đăng xuất thu hồi họ refresh và xoá cookie; access token không trạng thái sống tới exp. ChiaSe chấp nhận khoảng hở này và ghi vào tài liệu; TTL ngắn hơn, kiểm tokenVersion hoặc danh sách chặn là các phương án khác.',
      },
    ],
  },
};
