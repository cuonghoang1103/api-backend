/**
 * Testing · Chương 11 · Bài thi cuối khoá (18 câu tình huống, trải từ Mục 0 tới Chương 11). BÀI MỚI 01/11/2026, slug tst-11-6-kiem-tra-cuoi-khoa.
 * Cùng dạng bài thi cuối khoá của khoá Docker (dk-16-5-kiem-tra-cuoi-khoa): QUIZ, mỗi câu `explanation: 'EN: …|||VI: …'` nói vì sao đúng VÀ vì sao
 * phương án sai hấp dẫn nhất lại sai, kèm số bài để đọc lại.
 * Đáp án rải: A ×5 (câu 2, 5, 9, 13, 18) · B ×5 (4, 7, 10, 14, 17) · C ×4 (1, 6, 11, 15) · D ×4 (3, 8, 12, 16).
 * Mọi con số lấy từ output chạy thật của khoá (sNN/_ma.mjs, _HOP-DONG.md): 41,49% (8.2), 17/50 → 0/50 (8.3), 20/20 đỏ khi rò dòng (4.4),
 * 97,73% vs 100% (11.2), 16 test API “chứng minh” AC6 (11.1), mã lab 900 giá trị / 25 test (11.3), ma trận 12 bug × 5 tầng (11.1).
 */
export default {
  title: '11.6 — Final exam: the whole course in 18 situations|||11.6 — Bài thi cuối khoá: cả khoá trong 18 tình huống',
  slug: 'tst-11-6-kiem-tra-cuoi-khoa',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Bài thi cuối khoá Testing: 18 câu tình huống trải đều từ Mục 0 tới Chương 11 — test không khẳng định, giá trị biên, quên await, múi giờ, test chỉ kiểm mock, cô lập dữ liệu CSDL, 404 thay 403, cleanup của Testing Library, strict mode của Playwright, độ phủ 100% mà đột biến 41,49%, retry che lỗi, tee nuốt mã thoát, check bị skip coi như đạt, golden master theo múi giờ, bug chỉ PostgreSQL mới thấy, đột biến sống vì máy ở Việt Nam, ma trận truy vết đếm thừa, và mã lab trùng nhau. 25 phút, câu nào cũng có lời giải thích.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Final exam</span>
<h2>The whole course in 18 situations</h2>
<p class="lead">This is the last test of the course. Eighteen questions, twenty-five minutes, from the first <code>expect</code> to the pipeline that blocks a pull request. None asks for a definition: each one describes something that really happened on LabFlow Lite while this course was written — a measured number, a red line in a terminal — and asks what you would do.</p>
<p>How to take it: once, without notes, in one sitting. Then read every explanation, also for the questions you got right: it says why the most tempting wrong answer is wrong, and that is where most of the learning is. Each explanation names the lessons to reread. Below 13 correct, go back to those lessons before you put the capstone on your CV.</p>
<h3>Self-check before you start</h3>
<ul>
<li><strong>Foundations (Section 0–2).</strong> I write tests that can fail, name them after the rule they check, pick boundary values, and control time, randomness and errors instead of waiting for them.</li>
<li><strong>Doubles and real dependencies (3–5).</strong> I mock only at boundaries I do not own, test SQL on a real PostgreSQL in a throw-away container, and test an HTTP API from the outside, against its contract.</li>
<li><strong>The user’s side (6–7).</strong> I find elements the way users do, wait for the screen instead of sleeping, and keep end-to-end tests independent of each other.</li>
<li><strong>Trust (8–10).</strong> I read coverage and mutation scores for what they are, hunt flaky tests down instead of retrying them, make CI turn red when a test does, write tests first when it helps, and review tests in a pull request.</li>
<li><strong>The capstone (11).</strong> I plan tests from risks, choose the layer that can see each bug, trace every requirement to a passing test, and ship it all behind one required check.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài thi cuối khoá</span>
<h2>Cả khoá trong 18 tình huống</h2>
<p class="lead">Đây là bài kiểm tra cuối cùng của khoá. Mười tám câu, hai mươi lăm phút, từ dòng <code>expect</code> đầu tiên tới pipeline chặn một pull request. Không câu nào hỏi định nghĩa: mỗi câu kể một chuyện đã xảy ra THẬT trên LabFlow Lite trong lúc soạn khoá — một con số đo được, một dòng đỏ trong terminal — và hỏi bạn sẽ làm gì.</p>
<p>Cách làm: một lượt, không mở tài liệu, ngồi một mạch. Rồi đọc mọi lời giải thích, kể cả của những câu đã làm đúng: nó nói vì sao phương án sai hấp dẫn nhất lại sai, và phần lớn cái bạn học được nằm ở đó. Mỗi lời giải thích ghi số bài cần đọc lại. Dưới 13 câu đúng thì quay lại các bài đó trước khi ghi dự án cuối khoá vào CV.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li><strong>Nền tảng (Mục 0–Chương 2).</strong> Tôi viết test có thể đỏ, đặt tên theo luật mà nó kiểm, chọn giá trị biên, và điều khiển thời gian, ngẫu nhiên, lỗi thay vì ngồi chờ chúng.</li>
<li><strong>Đồ đóng thế và phụ thuộc thật (Chương 3–5).</strong> Tôi chỉ mock ở ranh giới mình không sở hữu, test SQL trên PostgreSQL thật trong container dùng một lần, và test API HTTP từ bên ngoài, đối chiếu với hợp đồng của nó.</li>
<li><strong>Phía người dùng (Chương 6–7).</strong> Tôi tìm phần tử theo cách người dùng tìm, chờ màn hình thay vì ngủ, và giữ các test đầu-cuối độc lập với nhau.</li>
<li><strong>Độ tin cậy (Chương 8–10).</strong> Tôi đọc đúng điểm độ phủ và điểm đột biến, săn test chập chờn thay vì chạy lại cho qua, làm CI đỏ khi test đỏ, viết test trước khi có ích, và review test trong pull request.</li>
<li><strong>Dự án cuối khoá (Chương 11).</strong> Tôi lập kế hoạch test từ rủi ro, chọn đúng tầng nhìn thấy từng bug, truy mọi yêu cầu tới một test xanh, và đưa tất cả ra sau một check bắt buộc duy nhất.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1500,
    questions: [
      {
        question: "A teammate adds `it('accepts 08:00–10:00', () => { checkSlot('08:00', '10:00'); })` to LabFlow Lite and says: 'No error is thrown, so it passes.' The project's vitest.config.js has expect: { requireAssertions: true }. What does `npm run test:unit` say?|||Một bạn thêm `it('accepts 08:00–10:00', () => { checkSlot('08:00', '10:00'); })` vào LabFlow Lite và nói: 'Không có lỗi nào bị ném, nên nó xanh.' vitest.config.js của dự án có expect: { requireAssertions: true }. `npm run test:unit` báo gì?",
        options: [
          'Green: a test passes when nothing throws, which is exactly what this test checks.|||Xanh: một test qua khi không có gì ném lỗi, đúng thứ test này kiểm.',
          'Skipped: Vitest skips a test with no expect and prints a warning.|||Bị bỏ qua: Vitest bỏ qua test không có expect và in cảnh báo.',
          'Red: with requireAssertions a test that makes no assertion fails — and it should, because it would stay green even if checkSlot returned { ok: false }.|||Đỏ: với requireAssertions, test không khẳng định gì sẽ hỏng — và đúng là phải thế, vì nó vẫn xanh kể cả khi checkSlot trả { ok: false }.',
          'Green, with a yellow warning in the summary that the run does not fail on.|||Xanh, kèm một cảnh báo vàng trong bảng tổng kết mà lần chạy không đỏ vì nó.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: checkSlot never throws — it returns { ok, code } — so 'no error' proves nothing: the test would stay green for every bug in the rule. requireAssertions (lesson 1.1, set in vitest.config.js since Chapter 1) turns 'no expect called' into a failure. Answer A is the tempting belief, true only for code whose whole contract is 'does not throw', and even then expect(() => …).not.toThrow() says so out loud.|||VI: checkSlot không bao giờ ném lỗi — nó trả { ok, code } — nên 'không có lỗi' chẳng chứng minh được gì: test sẽ vẫn xanh với mọi bug của luật. requireAssertions (bài 1.1, có trong vitest.config.js từ Chương 1) biến 'không gọi expect nào' thành một lần đỏ. Phương án A là niềm tin hấp dẫn, chỉ đúng với code mà toàn bộ hợp đồng là 'không ném lỗi', và kể cả khi đó expect(() => …).not.toThrow() vẫn nói thẳng điều ấy ra.",
      },
      {
        question: "BR-05: 'a booking may be made at most 14 days ahead'. Someone writes `daysAhead < MAX_DAYS_AHEAD` instead of `<=`. Which smallest set of tests for isWithinBookingWindow catches this bug AND the opposite one (`<= 15`)?|||BR-05: 'được đặt trước tối đa 14 ngày'. Có người viết `daysAhead < MAX_DAYS_AHEAD` thay vì `<=`. Bộ test nhỏ nhất nào cho isWithinBookingWindow bắt được bug này VÀ bug ngược lại (`<= 15`)?",
        options: [
          '14 → true and 15 → false: one value on each side of the boundary.|||14 → true và 15 → false: một giá trị ở mỗi phía của biên.',
          '7 → true and 30 → false: one typical value from each partition.|||7 → true và 30 → false: một giá trị điển hình của mỗi phân vùng.',
          '0 → true only: the first valid day.|||Chỉ 0 → true: ngày hợp lệ đầu tiên.',
          '14 → true only: the boundary itself.|||Chỉ 14 → true: chính giá trị biên.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Boundary value analysis (lesson 1.4, SWT301 4.3): the bug '< 14' turns 14 into false, so '14 → true' goes red; the bug '<= 15' turns 15 into true, so '15 → false' goes red. Answer B is the tempting one — equivalence partitioning with typical values — but 7 and 30 give the same results with or without either bug: the classes are right, only their edge moved.|||VI: Phân tích giá trị biên (bài 1.4, SWT301 4.3): bug '< 14' biến 14 thành false, nên '14 → true' đỏ; bug '<= 15' biến 15 thành true, nên '15 → false' đỏ. Phương án B là phương án hấp dẫn — phân vùng tương đương với giá trị điển hình — nhưng 7 và 30 cho cùng kết quả dù có hay không có bug nào: các lớp vẫn đúng, chỉ mép của chúng bị dịch.",
      },
      {
        question: "A test reads `it('rejects an overlap', () => { expect(bookLab(repo, sameSlot)).rejects.toThrow('OVERLAP'); });` — no async, no await, no return. What does Vitest 5 report, and what is the lesson?|||Một test viết `it('rejects an overlap', () => { expect(bookLab(repo, sameSlot)).rejects.toThrow('OVERLAP'); });` — không async, không await, không return. Vitest 5 báo gì, và bài học là gì?",
        options: [
          'Green: the promise is never awaited, so its assertion is never checked and nothing can fail.|||Xanh: promise không bao giờ được await, nên phép khẳng định của nó không bao giờ được kiểm và không gì đỏ được.',
          'A timeout after 5 seconds.|||Hết giờ sau 5 giây.',
          'A syntax error: .rejects needs an async test function.|||Lỗi cú pháp: .rejects cần hàm test async.',
          "Red, whatever bookLab does: 'Promise returned by expect(actual).rejects.toThrow(expected) was not awaited'. Write await expect(…) (or return it) — and do not count on this safety net elsewhere: in Jest the same test can pass silently.|||Đỏ, bất kể bookLab làm gì: 'Promise returned by expect(actual).rejects.toThrow(expected) was not awaited'. Hãy viết await expect(…) (hoặc return nó) — và đừng trông vào tấm lưới này ở chỗ khác: trong Jest, cùng test đó có thể xanh âm thầm.",
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Lesson 2.1 ran exactly this: Vitest 5 fails a test whose .rejects/.resolves promise was not awaited, and prints the fix. The underlying danger is real — expect(promise).rejects returns a promise of its own, and a test body that does not wait for it ends before the verdict; Jest's documentation warns that such a test can complete without the assertion ever running. Answer A describes that older, silent failure: the tempting answer if you learned testing on Jest or wrote .then() without return (the other trap of 2.1).|||VI: Bài 2.1 chạy đúng test này: Vitest 5 đánh hỏng một test có promise .rejects/.resolves không được await, và in luôn cách sửa. Mối nguy bên dưới là có thật — expect(promise).rejects trả về một promise của riêng nó, và thân test không chờ nó thì kết thúc trước khi có kết luận; tài liệu Jest cảnh báo một test như vậy có thể chạy xong mà phép khẳng định chưa bao giờ chạy. Phương án A tả đúng kiểu hỏng âm thầm cũ đó: câu trả lời hấp dẫn nếu bạn học test trên Jest, hoặc viết .then() mà không return (cái bẫy còn lại của 2.1).",
      },
      {
        question: "The server runs in UTC. At 00:30 on 16 November in Ha Noi (17:30 UTC on 15 November), a student books 30 November, exactly 14 days ahead in Viet Nam. A first version of daysAheadVN took 'today' from new Date().toISOString(). What happened, and what is the fix?|||Máy chủ chạy theo UTC. Lúc 00:30 ngày 16/11 ở Hà Nội (17:30 UTC ngày 15/11), một sinh viên đặt ngày 30/11, đúng 14 ngày sau theo giờ Việt Nam. Một bản đầu của daysAheadVN lấy 'hôm nay' từ new Date().toISOString(). Chuyện gì xảy ra, và sửa thế nào?",
        options: [
          'Nothing: dates are the same everywhere, only times differ.|||Không có gì: ngày thì ở đâu cũng như nhau, chỉ giờ là khác.',
          "'Today' was still 15 November in UTC, so 30 November counted as 15 days and was refused; count the calendar in Viet Nam time (add 7 hours before taking the date) and test it with an injected clock at both sides of midnight.|||'Hôm nay' theo UTC vẫn là 15/11, nên 30/11 bị tính là 15 ngày và bị từ chối; đếm lịch theo giờ Việt Nam (cộng 7 giờ trước khi lấy ngày) và test bằng đồng hồ tiêm vào ở cả hai phía nửa đêm.",
          'Set TZ=Asia/Ho_Chi_Minh on the developer laptops so the bug cannot happen.|||Đặt TZ=Asia/Ho_Chi_Minh trên laptop của lập trình viên để bug không thể xảy ra.',
          'Use fake timers so that Date never changes during the test.|||Dùng fake timer để Date không bao giờ đổi trong lúc test.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: Between 00:00 and 07:00 in Viet Nam, UTC is still on the previous day (lesson 2.2's bug): the count comes out one higher and a valid booking is refused. The fix is in the code (count in UTC+7) and the proof is a test with a fixed clock on both sides of midnight. Answer C is the tempting one: it hides the bug on laptops while the UTC server keeps it — Chapter 11 measured the same trap with Stryker (97.73% in Ha Noi, 100% in UTC).|||VI: Từ 00:00 tới 07:00 ở Việt Nam, UTC vẫn đang ở ngày hôm trước (bug của bài 2.2): số ngày ra thừa một và một lượt đặt hợp lệ bị từ chối. Cách sửa nằm trong code (đếm theo UTC+7) và bằng chứng là một test với đồng hồ cố định ở hai phía nửa đêm. Phương án C là phương án hấp dẫn: nó giấu bug trên laptop trong khi máy chủ UTC vẫn giữ nguyên — Chương 11 đo đúng cái bẫy này bằng Stryker (97,73% ở Hà Nội, 100% ở UTC).",
      },
      {
        question: "A test for bookAndNotify replaces the mailer with vi.fn(), makes the code call it, then asserts `expect(mailer.send).toHaveBeenCalledWith(mailer.send.mock.calls[0][0])`. It is green. What is wrong?|||Một test cho bookAndNotify thay mailer bằng vi.fn(), cho code gọi nó, rồi khẳng định `expect(mailer.send).toHaveBeenCalledWith(mailer.send.mock.calls[0][0])`. Nó xanh. Sai ở đâu?",
        options: [
          'It only checks the mock against itself: whatever the code sends — wrong address, wrong subject — is what the assertion expects. Assert the e-mail the RULE requires (recipient, subject with the lab and time).|||Nó chỉ kiểm mock với chính nó: code gửi gì — sai địa chỉ, sai tiêu đề — thì phép khẳng định cũng mong đúng thứ đó. Hãy khẳng định e-mail mà LUẬT đòi (người nhận, tiêu đề có phòng và giờ).',
          'Nothing; toHaveBeenCalledWith is the right matcher for mocks.|||Không sai gì; toHaveBeenCalledWith là matcher đúng cho mock.',
          'It should use a real SMTP server instead of a mock.|||Nó nên dùng máy chủ SMTP thật thay cho mock.',
          'vi.fn() must be reset with mockReset() before the assertion.|||vi.fn() phải được mockReset() trước phép khẳng định.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: The expected value is read from the mock's own call, so the assertion can never fail (lesson 3.3, 'when mocks make tests worthless'; the Code Lab exercise for 3.1 plants a confirmation sent to the approver to show it). The matcher in B is fine — the expected value is the problem. A real SMTP server (C) makes the test slow and flaky without fixing the circular check.|||VI: Giá trị mong đợi được đọc từ chính lời gọi của mock, nên phép khẳng định không bao giờ đỏ được (bài 3.3, 'khi mock làm test vô giá trị'; đề Code Lab của bài 3.1 cài bug gửi xác nhận cho người duyệt để thấy điều đó). Matcher ở B không sai — giá trị mong đợi mới sai. Máy chủ SMTP thật (C) làm test chậm và chập chờn mà không sửa được phép kiểm vòng tròn.",
      },
      {
        question: "Two integration test files share one PostgreSQL. Each wraps its own tests in a transaction and rolls back, but file B's beforeAll commits seed rows. After that file A's 'the table starts empty' tests go red in every run (20 of 20). What is the fix that LabFlow Lite uses?|||Hai file test tích hợp dùng chung một PostgreSQL. Mỗi file bọc test của mình trong transaction rồi rollback, nhưng beforeAll của file B commit dữ liệu mẫu. Từ đó các test 'bảng bắt đầu rỗng' của file A đỏ ở mọi lần chạy (20/20). LabFlow Lite sửa thế nào?",
        options: [
          'Retry file A twice.|||Cho file A chạy lại hai lần.',
          'Run the files in parallel so they do not see each other.|||Chạy các file song song để chúng không thấy nhau.',
          'Every integration file TRUNCATEs the table once in beforeAll (and per test where needed), and the files run one at a time (fileParallelism: false): a rollback cannot undo rows another file committed.|||Mọi file tích hợp TRUNCATE bảng một lần ở beforeAll (và từng test khi cần), và các file chạy lần lượt (fileParallelism: false): rollback không huỷ được những dòng file khác đã commit.',
          'Use SQLite for the tests so each file gets its own database file.|||Dùng SQLite cho test để mỗi file có một file CSDL riêng.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: A rollback only undoes your own transaction; committed rows from another file stay (measured in Chapter 4: 20 of 20 red). Hence the rule in _HOP-DONG and in every integration file: TRUNCATE once in beforeAll, run files one at a time against one database (lesson 4.4). Answer B is backwards — parallel files on one database make the collisions worse — and SQLite (D) is not PostgreSQL: lesson 4.1 showed bugs only the real engine reveals, and Chapter 11 found four more.|||VI: Rollback chỉ huỷ transaction của chính bạn; dòng đã commit của file khác vẫn ở đó (đo ở Chương 4: 20/20 đỏ). Vì vậy có luật trong _HOP-DONG và trong mọi file tích hợp: TRUNCATE một lần ở beforeAll, cho các file chạy lần lượt trên một CSDL (bài 4.4). Phương án B ngược đời — các file song song trên cùng một CSDL làm va chạm nặng hơn — còn SQLite (D) không phải PostgreSQL: bài 4.1 cho thấy những bug chỉ engine thật mới lộ ra, và Chương 11 tìm thêm bốn bug nữa.",
      },
      {
        question: "Student Binh, signed in, calls GET /api/bookings/1, which belongs to An. In Chapter 11 he also calls POST /api/bookings/1/cancel. What should the API answer both times, and why?|||Sinh viên Bình đã đăng nhập, gọi GET /api/bookings/1 vốn là của An. Ở Chương 11 Bình còn gọi POST /api/bookings/1/cancel. API nên trả gì cả hai lần, vì sao?",
        options: [
          '403 Forbidden both times: he is authenticated but not allowed.|||403 Forbidden cả hai lần: đã xác thực nhưng không được phép.',
          '404 Not Found both times: someone else’s booking must look exactly like a missing one, or the API tells strangers which ids exist (IDOR).|||404 Not Found cả hai lần: lượt đặt của người khác phải trông y hệt một lượt không tồn tại, không thì API cho người lạ biết id nào có thật (IDOR).',
          '401 both times, so he signs in again.|||401 cả hai lần, để Bình đăng nhập lại.',
          '200 for the read (bookings are public) and 403 for the cancel.|||200 cho lần đọc (lượt đặt là công khai) và 403 cho lần huỷ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: LabFlow's API answers 404 for 'missing or not mine' (lesson 5.2; US-11 AC3 in 11.2, with tests for a student, a lecturer and an admin, who gets 200). 403 (A) is the textbook answer for 'authenticated, not allowed', and it is right for a whole route a role may not use (/api/admin/bookings) — but for one object it confirms the object exists. 401 is for a missing or invalid token.|||VI: API của LabFlow trả 404 cho 'không có hoặc không phải của tôi' (bài 5.2; US-11 AC3 ở 11.2, có test cho sinh viên, giảng viên và admin — admin nhận 200). 403 (A) là câu trả lời sách vở cho 'đã xác thực, không được phép', và nó đúng cho cả một route mà một vai trò không được dùng (/api/admin/bookings) — nhưng với một đối tượng cụ thể, nó xác nhận đối tượng đó có thật. 401 dành cho token thiếu hoặc sai.",
      },
      {
        question: "Two tests in one file both render the booking form. The second fails with 'Found multiple elements with the role button and name Book'. The project runs Vitest without globals. Why, and what does LabFlow Lite do about it?|||Hai test trong một file cùng render form đặt phòng. Test thứ hai đỏ với 'Found multiple elements with the role button and name Book'. Dự án chạy Vitest không bật globals. Vì sao, và LabFlow Lite làm gì?",
        options: [
          'The form renders two Book buttons; use getAllByRole.|||Form render hai nút Book; hãy dùng getAllByRole.',
          'jsdom keeps the DOM between files; switch to happy-dom.|||jsdom giữ DOM giữa các file; chuyển sang happy-dom.',
          'The first test forgot to click; add a click.|||Test đầu quên bấm; thêm một cú bấm.',
          'Testing Library unmounts after each test only through a global afterEach; without globals nothing calls cleanup, so the first form is still in the document — web/test-setup.js registers afterEach(cleanup).|||Testing Library chỉ gỡ component sau mỗi test qua một afterEach toàn cục; không có globals thì không ai gọi cleanup, nên form thứ nhất vẫn nằm trong document — web/test-setup.js đăng ký afterEach(cleanup).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Measured in lesson 6.1: auto-cleanup hooks into a global afterEach, which does not exist without globals: true, so renders pile up inside one file. The fix lives in the setup file every web test loads. Answer A is the tempting quick fix: it makes the line pass while the leftover form keeps contaminating later tests. jsdom vs happy-dom has nothing to do with it.|||VI: Đo ở bài 6.1: tự cleanup móc vào một afterEach toàn cục, thứ không tồn tại khi không có globals: true, nên các lần render chồng lên nhau trong một file. Cách sửa nằm trong file setup mà mọi test web nạp. Phương án A là cách sửa nhanh hấp dẫn: dòng đó qua, còn form sót lại vẫn tiếp tục làm bẩn các test sau. jsdom hay happy-dom không liên quan.",
      },
      {
        question: "On the booking page, page.getByLabel('Lab').fill('BE-305') fails: strict mode violation, getByLabel('Lab') resolved to 2 elements. The page has one input labelled Lab. Why, and what is the fix?|||Trên trang đặt phòng, page.getByLabel('Lab').fill('BE-305') đỏ: strict mode violation, getByLabel('Lab') ra 2 phần tử. Trang chỉ có một ô nhập tên Lab. Vì sao, và sửa thế nào?",
        options: [
          "getByLabel matches a substring by default, and the form itself is labelled 'Book a lab'; use { exact: true } (or a role with an exact name).|||getByLabel mặc định khớp chuỗi con, và chính form có nhãn 'Book a lab'; dùng { exact: true } (hoặc một role với tên chính xác).",
          'The page rendered twice; add a wait before fill.|||Trang render hai lần; thêm một lần chờ trước fill.',
          'Strict mode is a bug in Playwright; turn it off.|||Strict mode là bug của Playwright; tắt nó đi.',
          'Use .first() so the test always takes the first match.|||Dùng .first() để test luôn lấy phần tử khớp đầu tiên.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Lesson 7.1 measured it: name matching is case-insensitive and by substring, so the form 'Book a lab' matches 'Lab' too. Strict mode is the safety net that said so. Answer D is the tempting one — it turns red into green by guessing an order, and breaks silently the day the form moves. Chapter 11's My bookings rows have Cancel buttons named after their booking for the same reason.|||VI: Bài 7.1 đo được: so tên không phân biệt hoa thường và theo chuỗi con, nên form 'Book a lab' cũng khớp 'Lab'. Strict mode là lưới an toàn đã nói ra điều đó. Phương án D là phương án hấp dẫn — nó biến đỏ thành xanh bằng cách đoán thứ tự, và hỏng âm thầm vào ngày form đổi chỗ. Các dòng của My bookings ở Chương 11 có nút Cancel mang tên của chính lượt đặt cũng vì lý do này.",
      },
      {
        question: "A suite for booking.js has 100% statements, branches, functions and lines. Stryker runs it: 39 of 94 mutants killed, score 41.49%. The team lead says: 'We have 100% coverage, ignore Stryker.' What is the right reading?|||Một bộ test cho booking.js đạt 100% câu lệnh, nhánh, hàm và dòng. Stryker chấm nó: diệt 39/94 đột biến, điểm 41,49%. Trưởng nhóm nói: 'Ta có 100% độ phủ, bỏ qua Stryker.' Đọc thế nào mới đúng?",
        options: [
          'Stryker is wrong because the tests execute every line.|||Stryker sai vì test đã chạy qua mọi dòng.',
          'Coverage proves the lines ran, not that any assertion would notice them change; 55 planted bugs stayed green, so the tests check too little.|||Độ phủ chứng minh các dòng đã chạy, không chứng minh có phép khẳng định nào nhận ra khi chúng đổi; 55 bug cài vào vẫn xanh, nên test kiểm quá ít.',
          'Both numbers are fine; mutation testing is only for libraries.|||Cả hai con số đều ổn; mutation testing chỉ dành cho thư viện.',
          'Raise the coverage threshold to 100% for branches as well.|||Nâng ngưỡng độ phủ nhánh lên 100% luôn.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: Lesson 8.2: the suite asserted with toBeDefined(), so every line ran and almost nothing was checked. Mutation testing measures whether the tests notice a change. Answer D is the tempting one: the branches are already at 100% and the bugs still survive. Chapter 11 keeps both bars in CI — coverage 97/91/96/97 and mutation at least 95% — because they measure different things.|||VI: Bài 8.2: bộ test khẳng định bằng toBeDefined(), nên mọi dòng đều chạy mà gần như không gì được kiểm. Mutation testing đo xem test có nhận ra một thay đổi không. Phương án D là phương án hấp dẫn: nhánh đã 100% rồi mà bug vẫn sống. Chương 11 giữ cả hai mức trong CI — độ phủ 97/91/96/97 và đột biến tối thiểu 95% — vì chúng đo hai thứ khác nhau.",
      },
      {
        question: "'Two students book one slot at once: exactly one wins' is red in 17 of 50 runs. With --retry=2 it is red in 0 of 50 and the report shows a green tick with '(retry x1)'. The double-booking bug is still in the code. What should the team do?|||Test 'hai sinh viên đặt cùng một khung một lúc: đúng một người thắng' đỏ 17/50 lần. Với --retry=2 nó đỏ 0/50 và báo cáo hiện dấu xanh kèm '(retry x1)'. Bug đặt trùng vẫn còn trong code. Nhóm nên làm gì?",
        options: [
          'Keep the retry: 0 of 50 is good enough for CI.|||Giữ retry: 0/50 là đủ tốt cho CI.',
          'Delete the test; it is flaky.|||Xoá test; nó chập chờn.',
          'Quarantine it with an issue and an owner (it runs, reports, and never blocks), and fix the cause — the check-then-insert race — with a database constraint; then bring it back.|||Cách ly nó kèm issue và người phụ trách (vẫn chạy, vẫn báo, không bao giờ chặn), và sửa tận gốc — cuộc đua kiểm-rồi-ghi — bằng ràng buộc trong CSDL; rồi đưa nó trở lại.',
          'Add a sleep(100) between the two bookings.|||Thêm sleep(100) giữa hai lượt đặt.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: The test is red because the product is broken some of the time (lessons 8.3, 9.3): retry turned 17/50 into 0/50 without fixing anything. Quarantine keeps the signal visible without blocking everyone, and the real fix (EXCLUDE constraint, Chapter 4) makes it green for the right reason. Answer A is the tempting one — CI turns green — and that is exactly how the bug would reach users. A sleep removes the race from the test, not from the product.|||VI: Test đỏ vì sản phẩm hỏng một phần thời gian (bài 8.3, 9.3): retry biến 17/50 thành 0/50 mà không sửa gì. Cách ly giữ tín hiệu còn nhìn thấy mà không chặn mọi người, còn cách sửa thật (ràng buộc EXCLUDE, Chương 4) làm nó xanh đúng lý do. Phương án A là phương án hấp dẫn — CI xanh — và đó chính là đường bug đi tới người dùng. Một cái sleep xoá cuộc đua khỏi test, không khỏi sản phẩm.",
      },
      {
        question: "A CI step runs `npx vitest run src/ --reporter=dot | tee unit.log` with no shell: set. The log shows 'Tests 1 failed | 173 passed (174)', yet the step is green. Why, and what is the fix?|||Một bước CI chạy `npx vitest run src/ --reporter=dot | tee unit.log` không khai shell:. Log ghi 'Tests 1 failed | 173 passed (174)', vậy mà bước đó xanh. Vì sao, và sửa thế nào?",
        options: [
          'Vitest exits 0 when only one test fails.|||Vitest thoát 0 khi chỉ một test đỏ.',
          'The dot reporter hides failures from the exit code.|||Reporter dot giấu lỗi khỏi mã thoát.',
          'GitHub ignores the exit codes of run steps.|||GitHub bỏ qua mã thoát của bước run.',
          'A pipe returns the exit code of its LAST command, tee, which succeeded; with shell: bash GitHub runs bash -eo pipefail and the step fails — the report job of Chapter 11 does exactly that.|||Một đường ống trả mã thoát của lệnh CUỐI, tee, mà tee thì chạy tốt; với shell: bash, GitHub chạy bash -eo pipefail và bước đó đỏ — job report của Chương 11 làm đúng như vậy.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Lesson 9.3 measured it: without pipefail, '… | tee' reports tee's 0. Declaring shell: bash switches GitHub to bash --noprofile --norc -eo pipefail. Chapter 11's quality report step pipes into $GITHUB_STEP_SUMMARY with tee, so it declares shell: bash, and src/ci/workflow.test.js checks that it does. Answer B sounds plausible but reporters do not choose the exit code; Vitest exits 1 on any failure.|||VI: Bài 9.3 đo được: không có pipefail, '… | tee' báo số 0 của tee. Khai shell: bash khiến GitHub chạy bash --noprofile --norc -eo pipefail. Bước báo cáo chất lượng của Chương 11 dẫn qua tee vào $GITHUB_STEP_SUMMARY, nên nó khai shell: bash, và src/ci/workflow.test.js kiểm điều đó. Phương án B nghe hợp lý nhưng reporter không quyết định mã thoát; Vitest thoát 1 khi có bất kỳ test nào đỏ.",
      },
      {
        question: "Branch protection requires the check 'naive-gate', a job with needs: [unit] and no if:. On a pull request the unit job fails. What happens to the merge button on GitHub?|||Branch protection đòi check 'naive-gate', một job có needs: [unit] và không có if:. Trên một pull request, job unit đỏ. Nút merge trên GitHub ra sao?",
        options: [
          "naive-gate is skipped, and GitHub counts a skipped required check as passed: the pull request can be merged. A gate needs if: always() and must read the results of the jobs it needs (ci-ok + decideMerge).|||naive-gate bị skipped, và GitHub coi một check bắt buộc bị skipped là đạt: pull request merge được. Một cổng cần if: always() và phải đọc kết quả của các job nó cần (ci-ok + decideMerge).",
          'naive-gate fails, so merging is blocked.|||naive-gate đỏ, nên merge bị chặn.',
          'GitHub waits forever for naive-gate.|||GitHub chờ naive-gate mãi mãi.',
          'GitHub reruns the unit job automatically.|||GitHub tự chạy lại job unit.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: A job whose needs failed is skipped, not failed, and a skipped required check counts as passed (lesson 9.3, documented with the date it was read). That is why LabFlow's gate is one job, ci-ok, with if: always() and a tested decideMerge that blocks on anything but success; Chapter 11 added mutation and report to its list. Answer B is what most people expect — which is exactly why the trap works.|||VI: Một job mà job nó cần bị đỏ thì bị skipped, không phải failed, và một check bắt buộc bị skipped được tính là đạt (bài 9.3, ghi kèm ngày đọc tài liệu). Vì vậy cổng của LabFlow là một job duy nhất, ci-ok, có if: always() và một decideMerge có test, chặn mọi kết quả khác success; Chương 11 thêm mutation và report vào danh sách của nó. Phương án B là điều đa số người mong — và đó chính là lý do cái bẫy hiệu nghiệm.",
      },
      {
        question: "The golden-master test of the legacy monthly report (lesson 10.2) is green on every laptop in Ha Noi and in UTC, and red when run with TZ=America/New_York. The approved file was written by the original v0 code. What does this tell you?|||Test golden master của báo cáo tháng cũ (bài 10.2) xanh trên mọi laptop ở Hà Nội và ở UTC, và đỏ khi chạy với TZ=America/New_York. File đã duyệt được ghi bằng chính code v0 gốc. Điều đó nói gì?",
        options: [
          'The approved file is corrupt; regenerate it with -u.|||File đã duyệt bị hỏng; ghi lại bằng -u.',
          "v0 decides the weekday with the machine's time zone (getDay), so its output depends on where it runs — a real bug the golden master exposed; the refactored version reads dates as Viet Nam calendar days and is green in all three zones.|||v0 xác định thứ trong tuần theo múi giờ của máy (getDay), nên output của nó phụ thuộc nơi nó chạy — một bug thật mà golden master phơi ra; bản refactor đọc ngày theo lịch Việt Nam và xanh ở cả ba múi giờ.",
          'Golden-master tests are flaky by nature; delete it.|||Test golden master vốn chập chờn; xoá nó.',
          'New York is not a supported time zone for LabFlow.|||New York không phải múi giờ LabFlow hỗ trợ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: Lesson 10.2 measured it: getDay() reads the local zone, so a date at midnight UTC falls on the previous weekday in New York. Characterization tests pin behaviour; when the behaviour depends on the environment, they reveal it. Answer A is the dangerous one: -u would 'fix' the test by approving whatever this machine prints. The same lesson returned in Chapter 11, where Stryker's result depended on the time zone.|||VI: Bài 10.2 đo được: getDay() đọc múi giờ của máy, nên một ngày lúc nửa đêm UTC rơi vào thứ của hôm trước ở New York. Test đặc tả ghim hành vi; khi hành vi phụ thuộc môi trường, chúng làm lộ ra điều đó. Phương án A là phương án nguy hiểm: -u sẽ 'sửa' test bằng cách duyệt bất cứ thứ gì máy này in ra. Bài học đó quay lại ở Chương 11, nơi kết quả của Stryker phụ thuộc múi giờ.",
      },
      {
        question: "In lesson 11.2 a mutant changes the PostgreSQL adapter to read `date` straight from the column instead of to_char(date, 'YYYY-MM-DD'). Every unit and API test stays green. Which layer turns red, and what does the user see?|||Ở bài 11.2, một đột biến đổi adapter PostgreSQL thành đọc `date` thẳng từ cột thay vì to_char(date, 'YYYY-MM-DD'). Mọi test unit và API vẫn xanh. Tầng nào đỏ, và người dùng thấy gì?",
        options: [
          'The UI tests: the date column renders as text.|||Test UI: cột ngày hiện thành chữ.',
          'None: JSON serialises dates correctly.|||Không tầng nào: JSON tự chuyển ngày cho đúng.',
          "Only the DB integration tests: node-postgres turns a date into a JS Date at LOCAL midnight (2026-11-15T17:00:00.000Z in Viet Nam), so My bookings breaks the contract — and every cancel answers TOO_LATE_TO_CANCEL because the start time can no longer be read.|||Chỉ test tích hợp CSDL: node-postgres biến cột date thành JS Date lúc nửa đêm GIỜ MÁY (2026-11-15T17:00:00.000Z ở Việt Nam), nên My bookings vi phạm hợp đồng — và mọi lượt huỷ đều trả TOO_LATE_TO_CANCEL vì không còn đọc được giờ bắt đầu.",
          'The E2E test, because Playwright runs against PostgreSQL.|||Test E2E, vì Playwright chạy trên PostgreSQL.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: Unit and API tests use the in-memory repository, which stores strings, so they cannot see it; the E2E server of this course also uses the in-memory repository. Only test/integration ran the real adapter, and its contract check on the PostgreSQL-backed API caught the shape (lesson 11.2). Answer D is the tempting one — 'E2E tests everything' — but an end-to-end test is only as end-to-end as the stack it starts. The layer matrix of 11.1 shows it: DB caught 4 of the 12 planted bugs, three that no other layer saw.|||VI: Test unit và API dùng repository bộ nhớ, vốn lưu chuỗi, nên chúng không thể thấy; server E2E của khoá cũng dùng repository bộ nhớ. Chỉ test/integration chạy adapter thật, và phép kiểm hợp đồng trên API chạy bằng PostgreSQL đã bắt được dạng dữ liệu sai (bài 11.2). Phương án D là phương án hấp dẫn — 'E2E test mọi thứ' — nhưng một test đầu-cuối chỉ đầu-cuối tới đúng chỗ cái stack nó khởi động. Ma trận tầng của bài 11.1 cho thấy: DB bắt 4/12 bug cài vào, ba bug mà không tầng nào khác thấy.",
      },
      {
        question: "Stryker on src/rules/cancel.js: 97.73% on your laptop in Ha Noi (one survivor: ':00+07:00' replaced by \"\" in startsAtVN), 100% on a CI runner in UTC. Same code, same tests. What is going on, and what did LabFlow change?|||Stryker trên src/rules/cancel.js: 97,73% trên laptop của bạn ở Hà Nội (một đột biến sống: ':00+07:00' bị thay bằng \"\" trong startsAtVN), 100% trên runner CI ở UTC. Cùng code, cùng test. Chuyện gì đang xảy ra, và LabFlow đã đổi gì?",
        options: [
          'An equivalent mutant: dropping the offset never changes anything, so ignore it.|||Một đột biến tương đương: bỏ offset không bao giờ thay đổi gì, cứ bỏ qua.',
          'Stryker is non-deterministic; rerun until it says 100%.|||Stryker không tất định; chạy lại tới khi nó báo 100%.',
          'The test is wrong and must be deleted.|||Test sai và phải bị xoá.',
          "Without the offset the string is read in the machine's local zone — which in Ha Noi IS +07:00, so the tests cannot see the bug there; on a UTC server it shifts the start by 7 hours. stryker.config.mjs now runs mutants in UTC, and the nightly workflow runs the unit suite in Asia/Ho_Chi_Minh.|||Không có offset thì chuỗi được đọc theo múi giờ của máy — mà ở Hà Nội thì ĐÚNG LÀ +07:00, nên test không thể thấy bug ở đó; trên máy chủ UTC nó lệch giờ bắt đầu 7 tiếng. stryker.config.mjs nay chạy đột biến ở UTC, và workflow chạy đêm chạy bộ unit theo Asia/Ho_Chi_Minh.",
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: The mutant is only 'equivalent' in one time zone (lesson 11.2): on servers and in CI it is a real bug — cancelling stays open 7 hours too long. Testing in two zones (UTC for pull requests and mutation, Viet Nam at night) covers both directions. Answer A is the tempting one, because Chapter 8 did show truly equivalent mutants in days.js; the difference is that those give identical results everywhere, which you can check with node -e under TZ=UTC.|||VI: Đột biến này chỉ 'tương đương' ở một múi giờ (bài 11.2): trên máy chủ và trong CI nó là bug thật — cửa huỷ mở lâu thêm 7 tiếng. Test ở hai múi giờ (UTC cho pull request và mutation, Việt Nam vào ban đêm) phủ cả hai chiều. Phương án A là phương án hấp dẫn, vì Chương 8 đúng là có đột biến tương đương thật trong days.js; khác biệt là những đột biến đó cho cùng kết quả ở mọi nơi, điều bạn kiểm được bằng node -e với TZ=UTC.",
      },
      {
        question: "The first traceability matrix of lesson 11.1 showed US-11 AC6 ('an admin may cancel at any time') proven by 16 API tests. Only two of them involve an admin. Why, and what is the rule?|||Ma trận truy vết đầu tiên của bài 11.1 cho thấy US-11 AC6 ('admin được huỷ bất cứ lúc nào') được 16 test API chứng minh. Chỉ hai trong số đó có admin. Vì sao, và luật là gì?",
        options: [
          'The matrix counts every test in the file; split the file.|||Ma trận đếm mọi test trong file; hãy tách file.',
          "The tag sat on the describe — '(US-11 AC2–AC6)' — so every test inside inherited all five criteria; tag the narrowest test with the criteria it really checks, and keep the describe to '(US-11)'.|||Nhãn nằm ở describe — '(US-11 AC2–AC6)' — nên mọi test bên trong thừa hưởng cả năm tiêu chí; hãy gắn nhãn ở test hẹp nhất với đúng tiêu chí nó kiểm, và để describe chỉ ghi '(US-11)'.",
          'Admins are tested indirectly by every API test, so 16 is right.|||Admin được test gián tiếp qua mọi test API, nên 16 là đúng.',
          'Use a spreadsheet instead of test names.|||Dùng bảng tính thay vì tên test.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: A test's full name includes its describe titles, so a range on a describe tags every child (lesson 11.1, first run: 16 for AC2–AC6 alike). A matrix that overclaims is worse than none: it says a criterion is covered when it is not. Answer D is tempting — spreadsheets are the classic RTM of SWT301 Report 5.x — but a spreadsheet does not know whether the test still exists or still passes; names checked against real reports do.|||VI: Tên đầy đủ của test có cả tiêu đề các describe, nên một khoảng ghi ở describe gắn nhãn cho mọi test con (bài 11.1, lần chạy đầu: 16 cho AC2–AC6 như nhau). Một ma trận khai khống còn tệ hơn không có: nó nói một tiêu chí đã được phủ khi chưa. Phương án D hấp dẫn — bảng tính là RTM kinh điển của Report 5.x trong SWT301 — nhưng bảng tính không biết test còn tồn tại hay còn xanh không; tên test đối chiếu với báo cáo thật thì biết.",
      },
      {
        question: "After tagging '31 seats waits for approval' with (BR-06), the old E2E test 'a booking by an shows up in the admin list' became flaky in Firefox: strict mode violation, getByRole('row', { name: /QA-912/ }) resolved to 2 elements. Nothing in the app changed. What happened?|||Sau khi gắn nhãn (BR-06) cho '31 seats waits for approval', test E2E cũ 'a booking by an shows up in the admin list' trở nên chập chờn trên Firefox: strict mode violation, getByRole('row', { name: /QA-912/ }) ra 2 phần tử. Ứng dụng không đổi gì. Chuyện gì đã xảy ra?",
        options: [
          "freshLab derives the lab code from a hash of the testId, and renaming a test changes its testId; with only 900 codes and 25 tests a shared code had about a 28% chance — it hit. The fix: a 608,400-code space and a script that lists codes used twice from the report annotations.|||freshLab lấy mã phòng từ băm của testId, và đổi tên test là đổi testId; chỉ có 900 mã cho 25 test thì xác suất có mã trùng khoảng 28% — và nó trúng. Cách sửa: không gian 608.400 mã và một script liệt kê mã bị dùng hai lần từ annotation trong báo cáo.",
          'Firefox renders tables twice; skip the test in Firefox.|||Firefox render bảng hai lần; bỏ qua test trên Firefox.',
          'The admin list shows cancelled bookings now; filter them out.|||Danh sách admin giờ hiện cả lượt đã huỷ; lọc chúng ra.',
          'Add retries: 2 in the Firefox project.|||Thêm retries: 2 cho project Firefox.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Measured in lesson 11.3: the two Firefox tests got QA-912, and the admin test failed whenever the other one had already booked (order-dependent, hence 'flaky'). The birthday problem: 1 − e^(−25·24/(2·900)) ≈ 28%. Retries (D) would hide a test-data collision that will hit again with every new test. Renaming for traceability was harmless; the hidden coupling through the hash was the bug.|||VI: Đo ở bài 11.3: hai test Firefox cùng nhận QA-912, và test admin đỏ mỗi khi test kia đã đặt trước (phụ thuộc thứ tự, nên 'chập chờn'). Bài toán ngày sinh: 1 − e^(−25·24/(2·900)) ≈ 28%. Retry (D) sẽ giấu một va chạm dữ liệu test, thứ sẽ trúng lại với mỗi test mới. Đổi tên để truy vết là vô hại; mối nối ngầm qua hàm băm mới là bug.",
      },
    ],
  },
};
