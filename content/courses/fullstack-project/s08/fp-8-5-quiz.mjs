/**
 * 8.5 — Kiểm tra Chương 8 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-8-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 8.1–8.4 (Vitest 5.1.1, Postgres 18 dùng một lần, Supertest 7.3.2).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '8.5 — Chapter 8 quiz|||8.5 — Kiểm tra Chương 8',
  slug: 'fp-8-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: test đầu tiên văng vì thiếu biến môi trường, trạng thái cấp module rò giữa các test, 43 unit test xanh với lỗi phân quyền, CSDL dùng chung làm test đỏ ngẫu nhiên, cuộc đua refresh 20/20, tmpfs có nhanh hơn không, bản "sửa" kiểu Peloton, đặt biến môi trường trước import, độ phủ không đổi khi test bị làm yếu, và checkpoint "bắt được" lỗi giả.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while ChiaSe got its test suite. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can run <code>npm test</code> on a machine with no <code>.env</code> and no Postgres running, and it is green.</li>
<li>I can plant a permission bug and name which layer of tests catches it, and which does not.</li>
<li>I can explain why each worker gets its own database.</li>
<li>I can show that coverage stays the same when I delete an assertion.</li>
<li>My Checkpoint 8 passes 23/23 (or 24/24 with Checkpoint 7) and catches 8/8 planted bugs.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi ChiaSe có bộ test. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy <code>npm test</code> trên một máy không có <code>.env</code>, không có Postgres nào đang chạy, và nó xanh.</li>
<li>Tôi cài được một bug phân quyền và nói được tầng test nào bắt nó, tầng nào không.</li>
<li>Tôi giải thích được vì sao mỗi worker có một CSDL riêng.</li>
<li>Tôi cho thấy được độ phủ không đổi khi xoá một câu khẳng định.</li>
<li>Checkpoint 8 của tôi đạt 23/23 (hoặc 24/24 khi gọi cả Checkpoint 7) và bắt 8/8 lỗi cài thử.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The very first unit test (sign a token, verify it) fails with "Thiếu biến môi trường WEB_ORIGIN" before any assertion runs. What is the right fix?|||Unit test đầu tiên (ký token rồi kiểm lại) hỏng với "Thiếu biến môi trường WEB_ORIGIN" trước khi kịp khẳng định gì. Cách sửa đúng là gì?',
        options: [
          'Load apps/api/.env at the top of every test file|||Nạp apps/api/.env ở đầu mỗi tệp test',
          'Remove the check from config.ts so missing variables fall back to empty strings|||Bỏ phép kiểm trong config.ts để biến thiếu thì thành chuỗi rỗng',
          'A setup file (setupFiles) that sets test-only values before any test file imports src/, with the database URL pointing at a port where nothing listens|||Một tệp setup (setupFiles) đặt giá trị RIÊNG cho test trước khi tệp test nào import src/, URL CSDL trỏ vào cổng không có gì nghe',
          'Mock config.ts in every test with vi.mock|||Mock config.ts trong mọi test bằng vi.mock',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: config.ts reads the environment at import time and refuses to run half-configured — that is a feature. The dev .env points at your development database, which the integration tests empty before every test. test/moi-truong.ts sets safe values with ??= (so CI can override); unit tests get a database URL on port 1, so an accidental query fails loudly.|||VI: config.ts đọc biến môi trường lúc import và từ chối chạy khi thiếu — đó là tính năng. .env dev trỏ vào CSDL dev, thứ mà test tích hợp xoá sạch trước mỗi test. test/moi-truong.ts đặt giá trị an toàn bằng ??= (CI ghi đè được); unit test nhận URL CSDL ở cổng 1, lỡ truy vấn là hỏng ầm ĩ.',
      },
      {
        question: 'In like.service.test.ts the three "batched emit" tests fail when run after the two thich/boThich tests, and pass when run alone. What happened?|||Trong like.service.test.ts, ba test "phát gộp" đỏ khi chạy sau hai test thich/boThich, và xanh khi chạy riêng. Chuyện gì đã xảy ra?',
        options: [
          'The earlier tests scheduled a fake 100 ms timer that never ran; the module-level Map kept post p-1 in "waiting", so later emits were skipped — drain pending timers in afterEach|||Test trước hẹn một giờ giả 100 ms không bao giờ chạy; Map cấp module giữ bài p-1 ở trạng thái "chờ", nên mọi lần phát sau bị bỏ — xả hẹn giờ còn treo trong afterEach',
          'vi.resetAllMocks() also resets fake timers|||vi.resetAllMocks() cũng đặt lại đồng hồ giả',
          'Vitest runs tests inside one file in parallel by default|||Vitest mặc định chạy các test trong cùng một tệp song song',
          'The real database was slower than 100 ms|||CSDL thật chậm hơn 100 ms',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Module state lives as long as the test file. thich("p-1") put p-1 in the Map and scheduled a fake timer; the test ended and real timers returned before it fired. Fix: await vi.runAllTimersAsync() before vi.useRealTimers(). Tests inside a file run sequentially; there is no database in unit tests.|||VI: Trạng thái module sống lâu bằng cả tệp test. thich("p-1") đặt p-1 vào Map và hẹn một giờ giả; test kết thúc, đồng hồ thật quay lại trước khi nó chạy. Sửa: await vi.runAllTimersAsync() trước vi.useRealTimers(). Test trong một tệp chạy tuần tự; unit test không có CSDL.',
      },
      {
        question: 'You change xoaBinhLuan\'s DELETE to "where: { id }" (anyone can delete any comment). All 43 unit tests stay green. Why?|||Bạn đổi câu DELETE của xoaBinhLuan thành "where: { id }" (ai cũng xoá được bình luận của người khác). Cả 43 unit test vẫn xanh. Vì sao?',
        options: [
          'The unit tests forgot to call xoaBinhLuan|||Unit test quên gọi xoaBinhLuan',
          'The permission rule lives in SQL; the fake deleteMany returns {count: 1} for any where, so no unit test with a fake database can see it|||Luật phân quyền nằm trong SQL; deleteMany giả trả {count: 1} với mọi where, nên không unit test nào dùng CSDL giả thấy được',
          'Vitest caches results of unchanged test files|||Vitest lưu đệm kết quả của tệp test không đổi',
          'TypeScript removed the OR clause during compilation|||TypeScript bỏ mệnh đề OR lúc biên dịch',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Only a database evaluates the WHERE clause. The integration test "người thứ ba ⇒ 403 và bình luận VẪN CÒN" turned red at once against real Postgres. You could assert the exact Prisma arguments, but that copies the implementation instead of checking behaviour.|||VI: Chỉ CSDL mới chạy mệnh đề WHERE. Test tích hợp "người thứ ba ⇒ 403 và bình luận VẪN CÒN" đỏ ngay trên Postgres thật. Bạn có thể khẳng định nguyên văn tham số Prisma, nhưng như vậy là chép lại phần cài đặt chứ không kiểm hành vi.',
      },
      {
        question: 'All integration test files share one database. Three runs: 3, 7 and 6 tests fail, different ones each time, including a foreign-key violation on a post the test had just created. Best fix?|||Mọi tệp test tích hợp dùng chung một CSDL. Ba lần chạy: 3, 7 rồi 6 test đỏ, mỗi lần một khác, có cả vi phạm khoá ngoại với bài test vừa tạo. Cách sửa tốt nhất?',
        options: [
          'Add retry: 3 to the integration project|||Thêm retry: 3 cho project tích hợp',
          'Remove the TRUNCATE in beforeEach|||Bỏ TRUNCATE trong beforeEach',
          'Increase testTimeout|||Tăng testTimeout',
          'Give each worker its own database: CREATE DATABASE chiase_w<id> TEMPLATE chiase in the setup file|||Cho mỗi worker một CSDL riêng: CREATE DATABASE chiase_w<id> TEMPLATE chiase trong tệp setup',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Files run in parallel workers; one file\'s TRUNCATE ran in the middle of another file\'s test. Retries hide the cause, removing cleanup makes tests depend on each other. Template clones copy the migrated schema in milliseconds; after the change: green three runs in a row. fileParallelism: false also works, but is slower forever.|||VI: Các tệp chạy ở worker song song; TRUNCATE của tệp này chạy chen giữa test của tệp kia. Thử lại chỉ che nguyên nhân, bỏ dọn dẹp thì test phụ thuộc nhau. Nhân bản từ template chép lược đồ đã migrate trong vài mili giây; sau khi sửa: xanh ba lần liền. fileParallelism: false cũng được, nhưng chậm mãi mãi.',
      },
      {
        question: 'You remove "revokedAt: null" from the conditional update in lamMoi and send the same refresh token 20 times concurrently to real Postgres. What did the test record?|||Bạn bỏ "revokedAt: null" khỏi câu cập nhật có điều kiện trong lamMoi rồi gửi cùng một refresh token 20 lần đồng thời vào Postgres thật. Test ghi nhận gì?',
        options: [
          'Exactly 1 winner — Postgres serializes updates anyway|||Đúng 1 bên thắng — đằng nào Postgres cũng tuần tự hoá các câu cập nhật',
          '0 winners — all requests deadlock|||0 bên thắng — mọi request bị deadlock',
          '20 winners: 20 valid refresh tokens from one stolen cookie|||20 bên thắng: 20 refresh token hợp lệ từ một cookie bị đánh cắp',
          'About 10 winners, depending on the pool size|||Khoảng 10 bên thắng, tuỳ cỡ pool',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: "expected [ Array(20) ] to have a length of 1 but got 20". Every request read the row before any marked it, and every unconditional update succeeded. With the condition, row locking lets exactly one UPDATE still see revoked_at IS NULL. The mocked unit test only noticed because it compared the exact arguments.|||VI: "expected [ Array(20) ] to have a length of 1 but got 20". Request nào cũng đọc dòng đó trước khi có request đánh dấu, và mọi câu cập nhật không điều kiện đều thành công. Có điều kiện thì khoá dòng chỉ cho đúng một UPDATE còn thấy revoked_at IS NULL. Unit test dùng mock chỉ để ý được vì nó so nguyên văn tham số.',
      },
      {
        question: 'The same 51 integration/API tests ran three times against Postgres on tmpfs with fsync=off, and three times against a normal volume with default durability. Result?|||Cùng 51 test tích hợp/API chạy ba lần trên Postgres dùng tmpfs + fsync=off, và ba lần trên volume thường với độ bền mặc định. Kết quả?',
        options: [
          'tmpfs was about 5× faster|||tmpfs nhanh hơn khoảng 5 lần',
          'No meaningful difference: 6.1–7.5 s vs 6.2–8.7 s — the suite writes too little for disk durability to matter|||Không khác biệt đáng kể: 6,1–7,5 s so với 6,2–8,7 s — bộ test ghi quá ít để độ bền đĩa thành vấn đề',
          'The volume run failed because fsync was on|||Lần chạy với volume hỏng vì fsync bật',
          'tmpfs was slower because RAM is shared with Node|||tmpfs chậm hơn vì RAM dùng chung với Node',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Measure before trusting a trick. The settings are free and keep your disk clean, but they do not rescue a slow suite; fewer and smaller database round-trips do. Container start-up dominated (≈3 s on a quiet machine, 11–30 s while the machine was busy).|||VI: Đo trước khi tin một mẹo. Các tuỳ chọn đó không tốn gì và giữ đĩa sạch, nhưng không cứu được bộ test chậm; bớt và thu nhỏ lượt hỏi CSDL mới cứu được. Thời gian bật container chiếm phần lớn (≈3 s khi máy rảnh, 11–30 s khi máy bận).',
      },
      {
        question: 'Like Peloton\'s 2021 "fix", you make GET /users/:id/sessions require login but drop the "only you" check. Which tests turn red?|||Giống bản "sửa" của Peloton năm 2021, bạn bắt GET /users/:id/sessions phải đăng nhập nhưng bỏ phép kiểm "chỉ chính bạn". Test nào đỏ?',
        options: [
          'Only the test where a second user asks for the first user\'s sessions and expects 403|||Chỉ test có người thứ hai xin danh sách phiên của người thứ nhất và mong 403',
          'Every test in the "no token ⇒ 401" table|||Mọi test trong bảng "không token ⇒ 401"',
          'None — this is an authentication bug, Supertest cannot see it|||Không test nào — đây là lỗi xác thực, Supertest không thấy được',
          'The rate-limit test|||Test giới hạn tốc độ',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: 1 failed | 38 passed — "expected 403 Forbidden, got 200 OK". The 401 table still passes because a token is still required. Authentication answers "who are you", authorization answers "whose data comes back"; every ownership rule needs a test with two users (OWASP API1 BOLA).|||VI: Đã đo: 1 failed | 38 passed — "expected 403 Forbidden, got 200 OK". Bảng 401 vẫn xanh vì vẫn phải có token. Xác thực trả lời "bạn là ai", phân quyền trả lời "dữ liệu của ai được trả về"; mỗi luật chủ sở hữu cần một test có hai người (OWASP API1 BOLA).',
      },
      {
        question: 'The login rate limiter reads process.env.AUTH_RATE_LIMIT when its module is imported. One test file needs the limit to be 3. How?|||Bộ giới hạn đăng nhập đọc process.env.AUTH_RATE_LIMIT lúc module của nó được import. Một tệp test cần giới hạn là 3. Làm thế nào?',
        options: [
          'Set process.env.AUTH_RATE_LIMIT = "3" on the line after the imports|||Gán process.env.AUTH_RATE_LIMIT = "3" ở dòng ngay sau các import',
          'Use vi.useFakeTimers() so the window resets|||Dùng vi.useFakeTimers() để cửa sổ tự đặt lại',
          'Lower the limit for every test in test/moi-truong.ts|||Hạ giới hạn cho mọi test trong test/moi-truong.ts',
          'Set it inside vi.hoisted(() => { … }), which runs before the hoisted imports|||Đặt nó trong vi.hoisted(() => { … }), chạy trước cả các import đã được kéo lên',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: ES imports are evaluated before any other statement in the file, so a normal assignment comes too late. vi.hoisted is lifted above them. Vitest isolates each test file, so this file gets its own limiter while the shared environment keeps 1000 for others.|||VI: Import ES được thực thi trước mọi câu lệnh khác trong tệp, nên gán bình thường là quá muộn. vi.hoisted được kéo lên trên cả chúng. Vitest cô lập từng tệp test, nên tệp này có bộ giới hạn riêng, còn môi trường chung vẫn để 1000 cho các tệp khác.',
      },
      {
        question: 'You delete the 403 assertions for comment deletion from two test files. Coverage stays at 92.25% lines. What does Checkpoint 8 report?|||Bạn xoá các khẳng định 403 khi xoá bình luận ở hai tệp test. Độ phủ vẫn 92,25% dòng. Checkpoint 8 báo gì?',
        options: [
          'Nothing — coverage did not drop, so the suite is as strong as before|||Không gì — độ phủ không giảm nên bộ test mạnh như cũ',
          'The coverage threshold fails|||Ngưỡng độ phủ trượt',
          'The planted "anyone can delete any comment" bug survives: "test VẪN XANH — lỗi lọt!" (7/8 caught)|||Lỗi cài thử "ai cũng xoá được bình luận" sống sót: "test VẪN XANH — lỗi lọt!" (bắt 7/8)',
          'The typecheck step fails|||Bước typecheck trượt',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Coverage counts lines that ran, not whether anything was checked — the same lines still run. A test file with zero expect calls reached 100% on cursor.ts while a real bug survived. Planting known bugs (mutation testing) measures the suite itself.|||VI: Độ phủ đếm dòng đã chạy, không đếm có kiểm gì hay không — các dòng đó vẫn chạy. Một tệp test không có expect nào vẫn đạt 100% trên cursor.ts trong khi bug thật sống sót. Cài lỗi đã biết (mutation testing) mới đo được chính bộ test.',
      },
      {
        question: 'An "it.only" is left in one file. The first version of Checkpoint 8 still reported every planted bug as "caught". Why was that wrong?|||Một "it.only" bị quên trong một tệp. Bản đầu của Checkpoint 8 vẫn báo mọi lỗi cài thử là "bắt được". Vì sao như vậy là sai?',
        options: [
          'it.only makes Vitest skip the planted bugs|||it.only làm Vitest bỏ qua các lỗi cài thử',
          'The suite was already red (with CI=1 Vitest fails on .only), so "red after the mutation" meant nothing — mutation checks need a green baseline|||Bộ test đã đỏ sẵn (với CI=1 Vitest báo lỗi khi có .only), nên "đỏ sau khi phá" chẳng chứng minh gì — phá thử cần bộ test xanh trước',
          'The mutations were written to the wrong files|||Đột biến được ghi vào nhầm tệp',
          'Supertest ignores .only|||Supertest bỏ qua .only',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Testing your tests has the same trap as testing code: a check that is always red proves nothing, just like one that is always green. The fixed script skips mutations (and fails) unless run 1 was green. The .only itself was caught by the hygiene check.|||VI: Test chính bộ test cũng có cái bẫy như test mã: phép kiểm lúc nào cũng đỏ chẳng chứng minh gì, y như phép kiểm lúc nào cũng xanh. Script đã sửa bỏ qua bước phá thử (và báo trượt) nếu lần chạy 1 không xanh. Bản thân .only bị bắt ở bước kiểm vệ sinh.',
      },
    ],
  },
};
