/**
 * Testing · Chương 7 · Quiz Chương 7 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-7-6-quiz.
 * Đáp án rải: A ×2 (câu 5, 8) · B ×3 (1, 3, 9) · C ×3 (2, 6, 10) · D ×2 (4, 7).
 * Mọi con số trong câu hỏi lấy từ output chạy thật của Chương 7 (s07/_ma.mjs).
 */
export default {
  title: 'Chapter 7 check — 10 scenario questions|||Kiểm tra Chương 7 — 10 câu tình huống',
  slug: 'tst-7-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 7: strict mode của getByLabel, assertion web-first khi API chậm, file storageState chứa gì, setup project và dependencies, đọc đúng phép đo tốc độ, dữ liệu dùng chung giữa worker, "1 flaky" trong CI, đọc error-context.md, Firefox đỏ vì hai project chung một server, ảnh gốc theo hệ điều hành và ngưỡng màu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Chapter 7 check</h2>
<p class="lead">Ten scenarios about end-to-end tests with Playwright, each based on something measured in this chapter. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can start the app with webServer, find elements by role and label, and wait with web-first assertions.</li>
<li>I can sign in once with a setup project, reuse the session, and follow one journey across two users.</li>
<li>I can reproduce and fix a flaky test, read a trace and an error context, and decide what deserves an e2e test.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7</h2>
<p class="lead">Mười tình huống về test đầu-cuối với Playwright, câu nào cũng dựa trên một điều đã đo trong chương. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi bật được ứng dụng bằng webServer, tìm phần tử theo role và label, và chờ bằng assertion web-first.</li>
<li>Tôi đăng nhập một lần bằng setup project, dùng lại phiên, và theo một hành trình qua hai người dùng.</li>
<li>Tôi tái hiện và sửa được test chập chờn, đọc được trace và error context, và quyết định được cái gì đáng một test e2e.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "On the booking page, page.getByLabel('Lab').fill('BE-305') fails with \"strict mode violation: getByLabel('Lab') resolved to 2 elements\". Why?|||Trên trang đặt phòng, page.getByLabel('Lab').fill('BE-305') đỏ với \"strict mode violation: getByLabel('Lab') resolved to 2 elements\". Vì sao?",
        options: [
          'The Lab input is not on the page yet; Playwright should have waited longer.|||Ô Lab chưa có trên trang; lẽ ra Playwright phải chờ lâu hơn.',
          "getByLabel matches part of a name, ignoring case, and the form itself is named \"Book a lab\"; use { exact: true } or getByRole('textbox', { name: 'Lab', exact: true }).|||getByLabel khớp một phần tên, không phân biệt hoa thường, và chính form tên là \"Book a lab\"; dùng { exact: true } hoặc getByRole('textbox', { name: 'Lab', exact: true }).",
          'Playwright cannot fill text inputs that have a default value.|||Playwright không điền được ô chữ đã có giá trị mặc định.',
          'Two tests running in parallel filled the same field.|||Hai test chạy song song cùng điền một ô.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The error lists both matches: the form (aria-label "Book a lab") and the input. Strict mode refuses to guess. Waiting longer cannot help — both elements are already there; tests never share a page, each has its own browser context.|||VI: Thông báo lỗi liệt kê cả hai phần tử khớp: form (aria-label "Book a lab") và ô nhập. Strict mode từ chối đoán. Chờ lâu hơn không giúp gì — cả hai phần tử đã có sẵn; các test không bao giờ dùng chung trang, mỗi test có browser context riêng.',
      },
      {
        question: 'The booking API answers 1.5 seconds late. Which check passes after the click on Book?|||API đặt phòng trả lời trễ 1,5 giây. Sau cú bấm Book, phép kiểm nào qua?',
        options: [
          "await page.waitForTimeout(1000); expect(await page.getByRole('status').isVisible()).toBe(true);|||await page.waitForTimeout(1000); expect(await page.getByRole('status').isVisible()).toBe(true);",
          "expect(await page.getByRole('status').isVisible()).toBe(true);|||expect(await page.getByRole('status').isVisible()).toBe(true);",
          "await expect(page.getByRole('status')).toHaveText('Booked. See you in DM-701.');|||await expect(page.getByRole('status')).toHaveText('Booked. See you in DM-701.');",
          "expect(await page.getByRole('status').textContent()).toBe('Booked. See you in DM-701.');|||expect(await page.getByRole('status').textContent()).toBe('Booked. See you in DM-701.');",
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured in lesson 7.1: the web-first assertion retried and passed after 2.2 s; isVisible() answered false at once, and the one-second sleep was still too short. A longer sleep would pass today and fail on a slower CI machine. textContent() also reads once — and fails on an element that is not there yet.|||VI: Đo ở bài 7.1: assertion web-first thử lại và qua sau 2,2 giây; isVisible() trả false ngay lập tức, và sleep một giây vẫn quá ngắn. Sleep dài hơn sẽ qua hôm nay và đỏ trên máy CI chậm hơn. textContent() cũng chỉ đọc một lần — và đỏ với phần tử chưa xuất hiện.',
      },
      {
        question: 'A teammate wants to commit playwright/.auth/an.json "so CI does not have to sign in". What does that file contain in LabFlow Lite, and what should you answer?|||Một bạn cùng nhóm muốn commit playwright/.auth/an.json "để CI khỏi phải đăng nhập". Trong LabFlow Lite file đó chứa gì, và bạn nên trả lời thế nào?',
        options: [
          'Only window size and language settings — committing it is harmless.|||Chỉ kích thước cửa sổ và cài đặt ngôn ngữ — commit thì vô hại.',
          'The localStorage entry labflow.session with a JWT valid for one hour: it works like a password, it expires anyway, and setup recreates it every run — keep the folder in .gitignore.|||Mục localStorage labflow.session chứa một JWT sống một giờ: nó như một mật khẩu, đằng nào cũng hết hạn, và setup tạo lại nó mỗi lần chạy — giữ thư mục đó trong .gitignore.',
          'Playwright refuses to start when a storage file is tracked by git.|||Playwright từ chối chạy khi file storage được git theo dõi.',
          'A list of every test that passed last time, used to skip them.|||Danh sách mọi test đã qua lần trước, dùng để bỏ qua chúng.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Lesson 7.2 printed the file: no cookies, one localStorage entry with the token (exp − iat = 3600 s). Anyone holding it is signed in as an until it expires, and a committed copy would be expired on the next run anyway. Playwright does not check git; the last-run list is test-results/.last-run.json, a different file.|||VI: Bài 7.2 đã in file ra: không cookie nào, một mục localStorage chứa token (exp − iat = 3600 giây). Ai cầm nó là đăng nhập bằng an tới khi hết hạn, và bản đã commit sẽ hết hạn ngay ở lần chạy sau. Playwright không kiểm git; danh sách lần chạy trước là test-results/.last-run.json, một file khác.',
      },
      {
        question: 'A change breaks every login. The suite has a setup project (auth.setup.js) and chromium has dependencies: [\'setup\']. What does npm run test:e2e report?|||Một thay đổi làm hỏng mọi lần đăng nhập. Bộ test có setup project (auth.setup.js) và chromium có dependencies: [\'setup\']. npm run test:e2e báo gì?',
        options: [
          'Nine red tests, each with its own stack trace.|||Chín test đỏ, mỗi test một stack trace riêng.',
          'All green, because yesterday’s session file is reused.|||Xanh hết, vì file phiên của hôm qua được dùng lại.',
          'Only the booking tests fail; the login tests pass.|||Chỉ test đặt phòng đỏ; test đăng nhập vẫn qua.',
          'Two failed (the setup sign-ins) and "7 did not run".|||Hai test đỏ (hai lần đăng nhập ở setup) và "7 did not run".',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured in lesson 7.2 with the login refused on purpose: both setup tests failed on the line waiting for "Signed in as", and the seven dependent tests did not run — one cause, one clear place. Setup writes the session file fresh on every run, so nothing from yesterday is reused.|||VI: Đo ở bài 7.2 khi cố ý từ chối đăng nhập: cả hai test setup đỏ ở dòng chờ "Signed in as", và bảy test phụ thuộc không chạy — một nguyên nhân, một chỗ rõ ràng. Setup ghi file phiên mới ở mỗi lần chạy, nên không có gì của hôm qua được dùng lại.',
      },
      {
        question: 'Six bookings on one worker: signing in through the form took 247–314 ms per test (3.7 s in total), reusing the saved session 289–324 ms (4.0 s). What is the right conclusion for LabFlow Lite?|||Sáu lượt đặt trên một worker: đăng nhập qua form mất 247–314 ms mỗi test (tổng 3,7 s), dùng lại phiên đã lưu 289–324 ms (4,0 s). Kết luận đúng cho LabFlow Lite là gì?',
        options: [
          'Here storageState saves no time, because the demo login is almost free; keep it for slow, external or rate-limited logins and for one clear failure when login breaks.|||Ở đây storageState không tiết kiệm thời gian, vì đăng nhập demo gần như không tốn gì; giữ nó cho đăng nhập chậm, qua bên ngoài hoặc bị giới hạn tần suất, và để chỉ đỏ một chỗ khi đăng nhập hỏng.',
          'The measurement must be wrong: storageState is always faster.|||Phép đo chắc chắn sai: storageState luôn nhanh hơn.',
          'storageState is slower, so it should never be used.|||storageState chậm hơn, nên không bao giờ nên dùng.',
          'Run with more workers until the saved session wins.|||Chạy với nhiều worker hơn tới khi phiên lưu sẵn thắng.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A measurement answers a question about this project, not about every project. Three more runs on a busy machine gave whole-run times from 4.0 to 13.3 s for both files — start-up noise, no winner. The reasons for storageState are bcrypt-style hashing, SSO, a second factor, lock-outs like BR-02, and failures that point at the login only.|||VI: Phép đo trả lời câu hỏi về dự án này, không phải về mọi dự án. Chạy thêm ba lần trên máy đang bận cho tổng thời gian từ 4,0 tới 13,3 giây cho cả hai file — nhiễu khởi động, không bên nào thắng. Lý do dùng storageState là băm kiểu bcrypt, SSO, yếu tố thứ hai, khoá tài khoản kiểu BR-02, và lỗi chỉ trỏ vào phần đăng nhập.',
      },
      {
        question: 'Two tests both book SH-301, 16 November, 08:00–10:00. With --workers=2 both passed; with --workers=1 one failed; with --repeat-each=3 four failed. What is going on?|||Hai test cùng đặt SH-301, 16 tháng 11, 08:00–10:00. Với --workers=2 cả hai qua; với --workers=1 một test đỏ; với --repeat-each=3 bốn test đỏ. Chuyện gì đang xảy ra?',
        options: [
          'The Playwright runner is unreliable; raise retries until it is green.|||Runner của Playwright không ổn định; tăng retry tới khi xanh.',
          'The server is slow; add waitForTimeout(2000) after each booking.|||Server chậm; thêm waitForTimeout(2000) sau mỗi lượt đặt.',
          'The tests share data, so the result depends on scheduling — flaky; give each test its own lab. And the two-worker green run hid a real double booking.|||Hai test dùng chung dữ liệu, nên kết quả tuỳ lịch chạy — chập chờn; cho mỗi test một phòng riêng. Và lần hai worker xanh đã che một lượt đặt trùng thật.',
          'Chromium caches the booking form between tests.|||Chromium lưu đệm form đặt phòng giữa các test.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Same code, three results: the definition of a flaky test. Two requests sent at the same moment both got 201 — the in-memory repository still has the check-then-insert race of Chapter 2. Retries and sleeps would only hide both problems; freshLab made 12 of 12 pass.|||VI: Cùng code, ba kết quả: đúng định nghĩa test chập chờn. Hai request gửi cùng lúc đều nhận 201 — repository bộ nhớ vẫn còn race kiểm-rồi-ghi của Chương 2. Retry và sleep chỉ giấu cả hai vấn đề; freshLab làm 12 trên 12 test qua.',
      },
      {
        question: 'The CI summary says "1 flaky" for a booking test: it failed, then passed on retry #1. What should the team do?|||Tổng kết CI ghi "1 flaky" cho một test đặt phòng: nó đỏ, rồi qua ở retry #1. Nhóm nên làm gì?',
        options: [
          'Nothing — the test passed, the pipeline is green.|||Không làm gì — test đã qua, pipeline xanh.',
          'Raise retries to 5 so it never shows up again.|||Tăng retry lên 5 để nó không bao giờ hiện nữa.',
          'Delete the test; flaky tests have no value.|||Xoá test; test chập chờn không có giá trị.',
          'Treat it as a bug: open the trace and error context of the failed attempt, find the cause (data, waits, order, environment or a real race) and fix it; --fail-on-flaky-tests can make such runs fail.|||Coi nó là một bug: mở trace và error context của lần đỏ, tìm nguyên nhân (dữ liệu, chờ, thứ tự, môi trường hay một race thật) và sửa; --fail-on-flaky-tests có thể làm những lần chạy như vậy đỏ.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Playwright reports a pass-on-retry as flaky precisely so that it is not mistaken for green. More retries hide it — the double booking of lesson 7.3 would pass on retry and ship. Deleting the test throws away the one signal that something is wrong.|||VI: Playwright báo qua-nhờ-thử-lại là flaky chính để không ai nhầm nó là xanh. Thêm retry là giấu nó — lượt đặt trùng ở bài 7.3 sẽ qua ở lần thử lại và lên production. Xoá test là vứt đi tín hiệu duy nhất cho biết có gì đó sai.',
      },
      {
        question: 'A test expects "Booked. See you in TR-701." and fails. Its error-context.md shows: - status: Sent. A lecturer must approve this booking. The test books 31 seats as student an. What is the fix?|||Một test mong "Booked. See you in TR-701." và đỏ. error-context.md của nó ghi: - status: Sent. A lecturer must approve this booking. Test đặt 31 chỗ bằng sinh viên an. Sửa thế nào?',
        options: [
          'The expectation is wrong: 31 seats from a student needs approval (BR-06) — expect the approval message, or book 30 seats or fewer for the confirmed case.|||Kỳ vọng sai: sinh viên đặt 31 chỗ thì cần duyệt (BR-06) — mong câu chờ duyệt, hoặc đặt từ 30 chỗ trở xuống cho trường hợp xác nhận.',
          'Add await page.waitForTimeout(3000) before the assertion.|||Thêm await page.waitForTimeout(3000) trước assertion.',
          'Turn on retries; the second attempt will show "Booked".|||Bật retry; lần thử thứ hai sẽ hiện "Booked".',
          'Run the test in Firefox, which renders the status faster.|||Chạy test trên Firefox, trình duyệt hiển thị status nhanh hơn.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The snapshot shows the page answered — just with a different message, chosen by the business rule. Waiting or retrying cannot change a deterministic answer. Read the evidence before guessing: here it names the cause in one line.|||VI: Snapshot cho thấy trang đã trả lời — chỉ là bằng một câu khác, do luật nghiệp vụ chọn. Chờ hay thử lại không đổi được một câu trả lời tất định. Đọc bằng chứng trước khi đoán: ở đây nó gọi tên nguyên nhân trong một dòng.',
      },
      {
        question: 'demo7/dau-tien.spec.js (fixed lab BE-201, 16 Nov, 08:00) passes in Chromium. Run with --project=firefox --project=webkit, the booking test is red in Firefox three times in a row, and its error context shows the alert "This slot is already taken." Why?|||demo7/dau-tien.spec.js (phòng cố định BE-201, 16/11, 08:00) qua trên Chromium. Chạy với --project=firefox --project=webkit, test đặt phòng đỏ trên Firefox ba lần liền, và error context hiện alert "This slot is already taken." Vì sao?',
        options: [
          'Firefox does not support <input type="time">.|||Firefox không hỗ trợ <input type="time">.',
          'Both projects use one e2e server and book the same fixed slot; WebKit got there first, so Firefox was refused.|||Cả hai project dùng một server e2e và đặt cùng một khung cố định; WebKit tới trước, nên Firefox bị từ chối.',
          'WebKit is faster, so Firefox timed out; raise the expect timeout.|||WebKit nhanh hơn nên Firefox hết giờ; tăng timeout của expect.',
          'Firefox ran before the setup project had signed in.|||Firefox chạy trước khi setup project kịp đăng nhập.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The page answered with an alert, so nothing timed out and the session worked. The cause is shared data multiplied by projects. The e2e/ suite avoids it because freshLab hashes testInfo.testId, which differs per project — all 37 tests passed.|||VI: Trang đã trả lời bằng một alert, nên không có gì hết giờ và phiên vẫn hoạt động. Nguyên nhân là dữ liệu dùng chung bị nhân lên theo số project. Bộ e2e/ tránh được vì freshLab băm testInfo.testId, thứ khác nhau ở mỗi project — cả 37 test đều qua.',
      },
      {
        question: 'Screenshot tests: a darker orange button (#e06a1b → #d35400) still passed, a blue button failed with 2423 different pixels, and the baseline file is sign-in-chromium-darwin.png. Which statement is right?|||Test ảnh chụp: nút cam đậm hơn (#e06a1b → #d35400) vẫn qua, nút xanh dương đỏ với 2423 điểm ảnh khác, và file ảnh gốc là sign-in-chromium-darwin.png. Phát biểu nào đúng?',
        options: [
          'A screenshot test also proves the Sign in button works.|||Test ảnh chụp còn chứng minh nút Sign in hoạt động.',
          'The darker orange passing is a Playwright bug; report it.|||Cam đậm hơn mà vẫn qua là bug của Playwright; báo lỗi đi.',
          'Baselines are per browser and operating system, so generate them on the CI OS; the default per-pixel threshold (0.2) treats close colours as equal.|||Ảnh gốc riêng cho từng trình duyệt và hệ điều hành, nên hãy tạo chúng trên hệ điều hành của CI; ngưỡng mặc định cho từng điểm ảnh (0.2) coi các màu gần nhau là như nhau.',
          'Set threshold to 1.0 so screenshot tests never fail on CI.|||Đặt threshold 1.0 để test ảnh chụp không bao giờ đỏ trên CI.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: "darwin" in the name means macOS; Linux renders fonts differently, so a Mac baseline fails on Linux CI. The threshold is documented behaviour, not a bug. A pixel test sees colour and position, not behaviour; and a threshold of 1.0 would accept any image at all.|||VI: "darwin" trong tên nghĩa là macOS; Linux hiển thị font khác, nên ảnh gốc làm trên Mac sẽ đỏ trên CI Linux. Ngưỡng là hành vi có trong tài liệu, không phải bug. Test điểm ảnh thấy màu và vị trí, không thấy hành vi; còn ngưỡng 1.0 thì nhận mọi ảnh.',
      },
    ],
  },
};
