/**
 * Testing · Chương 1 · Quiz Chương 1 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-1-6-quiz.
 * Đáp án rải: A ×2 (câu 3, 7) · B ×3 (1, 5, 9) · C ×2 (4, 8) · D ×3 (2, 6, 10).
 */
export default {
  title: 'Chapter 1 check — 10 scenario questions|||Kiểm tra Chương 1 — 10 câu tình huống',
  slug: 'tst-1-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 1: AAA, test không khẳng định, toBe/toEqual, số thập phân, toThrow, snapshot -u, .only trong CI, giá trị biên, bảng quyết định, property-based và đột biến — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Chapter 1 check</h2>
<p class="lead">Ten scenarios taken from LabFlow Lite. Every question has an explanation of why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a test in Arrange–Act–Assert form and give it a name that states the rule.</li>
<li>I can choose between <code>toBe</code>, <code>toEqual</code>, <code>toStrictEqual</code>, <code>toMatchObject</code> and <code>toBeCloseTo</code>.</li>
<li>I can test an error with <code>expect(() =&gt; …).toThrow(Class)</code>.</li>
<li>I can pick boundary values and build a decision table as <code>it.each</code>.</li>
<li>I can read a fast-check counterexample and a mutation-testing report.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm tra Chương 1</h2>
<p class="lead">Mười tình huống lấy từ LabFlow Lite. Câu nào cũng có giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một test theo dạng Arrange–Act–Assert và đặt tên nói rõ luật.</li>
<li>Tôi chọn được giữa <code>toBe</code>, <code>toEqual</code>, <code>toStrictEqual</code>, <code>toMatchObject</code> và <code>toBeCloseTo</code>.</li>
<li>Tôi test được một lỗi bằng <code>expect(() =&gt; …).toThrow(Class)</code>.</li>
<li>Tôi chọn được giá trị biên và dựng bảng quyết định bằng <code>it.each</code>.</li>
<li>Tôi đọc được một phản ví dụ của fast-check và một báo cáo kiểm thử đột biến.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "A teammate's test reads: it('creates a booking', () => { createBooking(validInput); }). It is green. What does it prove?|||Test của một bạn cùng nhóm: it('creates a booking', () => { createBooking(validInput); }). Nó xanh. Nó chứng minh điều gì?",
        options: [
          'That the booking has the right status and length.|||Rằng lượt đặt có trạng thái và độ dài đúng.',
          'Only that createBooking did not throw for that input — there is no assertion.|||Chỉ là createBooking không ném lỗi với đầu vào đó — không hề có khẳng định nào.',
          'That every rule of createBooking is covered.|||Rằng mọi luật của createBooking đã được phủ.',
          'Nothing at all — a test without expect never runs.|||Không gì cả — test không có expect thì không bao giờ chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The function body runs, so a thrown error would fail it — but no value is checked. The last option is tempting yet wrong: the test does run; it just cannot fail for a wrong result. Turn on expect.requireAssertions to catch such tests.|||VI: Thân hàm có chạy, nên nếu có lỗi bị ném thì test hỏng — nhưng không giá trị nào được kiểm. Phương án cuối hấp dẫn nhưng sai: test vẫn chạy; chỉ là nó không thể hỏng vì kết quả sai. Bật expect.requireAssertions để bắt loại test này.',
      },
      {
        question: 'expect(createBooking(input)).toBe({ lab: "BE-201", start: "08:00", end: "10:00", minutes: 120, status: "CONFIRMED" }) fails with "Received: serializes to the same string". What should you change?|||expect(createBooking(input)).toBe({ lab: "BE-201", start: "08:00", end: "10:00", minutes: 120, status: "CONFIRMED" }) hỏng với "Received: serializes to the same string". Nên sửa gì?',
        options: [
          'Wrap the object in JSON.stringify on both sides and keep toBe.|||Bọc cả hai vế bằng JSON.stringify và giữ toBe.',
          'Change createBooking so it returns the same object instance every time.|||Sửa createBooking để luôn trả về cùng một object.',
          'Use toBeTruthy, because the booking exists.|||Dùng toBeTruthy, vì lượt đặt có tồn tại.',
          'Use toEqual (or toStrictEqual): toBe compares identity, and two objects are never the same instance.|||Dùng toEqual (hoặc toStrictEqual): toBe so danh tính, mà hai object không bao giờ là cùng một bản.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: toBe uses Object.is. Deep-equality matchers compare contents. JSON.stringify "works" but depends on key order and hides undefined values; changing production code to satisfy a matcher is backwards; toBeTruthy would pass for any object.|||VI: toBe dùng Object.is. Matcher so sánh sâu so nội dung. JSON.stringify "chạy được" nhưng phụ thuộc thứ tự khoá và giấu giá trị undefined; sửa code thật để chiều một matcher là làm ngược; còn toBeTruthy thì đạt với mọi object.',
      },
      {
        question: 'usageRate of bookings of 30, 120 and 60 minutes should be 25% of the 840-minute day, but expect(rate).toBe(0.25) receives 0.24999999999999997. Best fix?|||usageRate của các lượt 30, 120 và 60 phút lẽ ra là 25% của ngày 840 phút, nhưng expect(rate).toBe(0.25) nhận được 0.24999999999999997. Cách sửa tốt nhất?',
        options: [
          'Use toBeCloseTo(0.25), or compute with integer minutes and divide once.|||Dùng toBeCloseTo(0.25), hoặc tính bằng số phút nguyên rồi chia một lần.',
          'Change the expected value to 0.24999999999999997.|||Đổi giá trị mong đợi thành 0.24999999999999997.',
          'Round the result with Math.round before comparing.|||Làm tròn kết quả bằng Math.round trước khi so.',
          'It is a bug in Vitest; report it.|||Đây là lỗi của Vitest; báo cáo nó.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Binary floating point cannot store 30/840 exactly; the sum lands one step below 0.25. Hard-coding 0.24999999999999997 pins an accident of rounding; Math.round(0.25) is 0 and checks nothing useful.|||VI: Số thực nhị phân không lưu chính xác được 30/840; tổng rơi xuống dưới 0.25 một bước. Ghi cứng 0.24999999999999997 là ghim một sự tình cờ của phép làm tròn; còn Math.round(0.25) bằng 0 và chẳng kiểm được gì.',
      },
      {
        question: "expect(parseTime('7h')).toThrow(TypeError) makes the test crash with TypeError: Invalid time \"7h\" instead of passing. Why?|||expect(parseTime('7h')).toThrow(TypeError) làm test chết với TypeError: Invalid time \"7h\" thay vì đạt. Vì sao?",
        options: [
          'parseTime throws a RangeError, not a TypeError.|||parseTime ném RangeError chứ không phải TypeError.',
          'toThrow only works with async functions.|||toThrow chỉ dùng được với hàm async.',
          'parseTime runs before expect is called; toThrow needs a function: expect(() => parseTime(\'7h\')).|||parseTime chạy trước khi expect được gọi; toThrow cần một hàm: expect(() => parseTime(\'7h\')).',
          'The error message must be passed as a string, not a class.|||Thông báo lỗi phải truyền dạng chuỗi chứ không phải class.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Arguments are evaluated first, so the error escapes before toThrow can catch it. The crash message itself shows it is a TypeError, so option A is wrong; toThrow accepts a class, a regex or a string.|||VI: Tham số được tính trước, nên lỗi thoát ra trước khi toThrow kịp bắt. Chính thông báo lỗi cho thấy đó là TypeError, nên phương án A sai; toThrow nhận class, regex hoặc chuỗi đều được.',
      },
      {
        question: 'An inline snapshot of a booking turns red after a change (CONFIRMED → PENDING for 20 seats). A teammate runs vitest -u and everything is green. What happened?|||Một inline snapshot của lượt đặt chuyển đỏ sau một thay đổi (CONFIRMED → PENDING với 20 chỗ). Một bạn chạy vitest -u và mọi thứ xanh. Chuyện gì đã xảy ra?',
        options: [
          'The bug was fixed automatically by Vitest.|||Vitest đã tự sửa con bug.',
          'The snapshot was rewritten to the new behaviour; if PENDING for 20 seats is a bug, the test now protects the bug.|||Snapshot bị ghi lại theo hành vi mới; nếu PENDING với 20 chỗ là bug thì test giờ đang bảo vệ con bug.',
          'Nothing — -u only updates snapshots that are not used.|||Không có gì — -u chỉ cập nhật snapshot không được dùng.',
          'The snapshot file was deleted, so the test is skipped.|||File snapshot bị xoá nên test bị bỏ qua.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: -u writes whatever the code produces now as the new expected value. BR-06 says approval only above 30 seats, so the red snapshot had caught a real bug. Before -u, ask whether the behaviour change was intended.|||VI: -u ghi thứ code đang tạo ra làm giá trị mong đợi mới. BR-06 nói chỉ cần duyệt khi trên 30 chỗ, nên snapshot đỏ lúc đó đã bắt được một bug thật. Trước khi -u, hãy hỏi thay đổi hành vi đó có chủ ý không.',
      },
      {
        question: 'For BR-05 "at most 14 days ahead" (integers), which set of inputs finds an off-by-one bug most reliably?|||Với BR-05 "đặt trước tối đa 14 ngày" (số nguyên), bộ đầu vào nào bắt lỗi lệch một đơn vị chắc chắn nhất?',
        options: [
          '1, 7, 30|||1, 7, 30',
          '7 only, because it is in the middle of the valid range|||Chỉ 7, vì nó nằm giữa khoảng hợp lệ',
          '0, 7, 14|||0, 7, 14',
          '−1, 0, 13, 14, 15|||−1, 0, 13, 14, 15',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Off-by-one bugs (< instead of <=) only change behaviour at a boundary, so test on each boundary and one step outside. 0, 7, 14 touches the boundaries but never steps outside them, so a bug accepting 15 or −1 survives.|||VI: Lỗi lệch một đơn vị (< thay vì <=) chỉ đổi hành vi ngay tại biên, nên test trên mỗi biên và một bước ra ngoài. 0, 7, 14 chạm biên nhưng không bước ra ngoài, nên một bug chấp nhận 15 hay −1 vẫn sống sót.',
      },
      {
        question: 'needsApproval depends on role (STUDENT, LECTURER, ADMIN) and on whether seats > 30. How many rows does a full decision table give, and which seat values should they use?|||needsApproval phụ thuộc vai trò (STUDENT, LECTURER, ADMIN) và việc số chỗ có > 30 không. Một bảng quyết định đầy đủ có bao nhiêu dòng, và nên dùng số chỗ nào?',
        options: [
          '6 rows (3 roles × 2), using 30 and 31 seats.|||6 dòng (3 vai trò × 2), dùng 30 và 31 chỗ.',
          '3 rows, one per role, using 50 seats.|||3 dòng, mỗi vai trò một dòng, dùng 50 chỗ.',
          '2 rows, seats ≤ 30 and seats > 30, with any role.|||2 dòng, số chỗ ≤ 30 và > 30, vai trò nào cũng được.',
          '6 rows, using 5 and 100 seats so the difference is obvious.|||6 dòng, dùng 5 và 100 chỗ để khác biệt cho rõ.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Every combination of the two conditions is a column: 3 × 2 = 6. Choosing 30 and 31 also tests the BR-06 boundary in every row; 5 and 100 give the same six rows but would miss a > 29 or >= 30 bug.|||VI: Mỗi tổ hợp của hai điều kiện là một cột: 3 × 2 = 6. Chọn 30 và 31 thì dòng nào cũng kiểm luôn biên của BR-06; 5 và 100 cũng cho sáu dòng nhưng sẽ bỏ lọt bug kiểu > 29 hay >= 30.',
      },
      {
        question: 'You forgot it.only in a test file and pushed. Locally npm test was green. What does Vitest do on the CI server (CI=true)?|||Bạn quên it.only trong một file test và đã push. Ở máy bạn npm test xanh. Vitest làm gì trên máy CI (CI=true)?',
        options: [
          'Runs only the marked test and reports green, like locally.|||Chỉ chạy test được đánh dấu và báo xanh, giống ở máy bạn.',
          'Ignores .only and runs every test.|||Bỏ qua .only và chạy mọi test.',
          'Fails with "Unexpected .only modifier", because allowOnly is off in CI.|||Hỏng với "Unexpected .only modifier", vì allowOnly bị tắt trong CI.',
          'Deletes the .only automatically and commits the fix.|||Tự xoá .only và commit bản sửa.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured in lesson 1.3: with CI=true the run fails with that exact error. Locally the same file is green with every other test skipped — which is why .only must never be committed.|||VI: Đã đo ở bài 1.3: với CI=true lần chạy hỏng với đúng thông báo đó. Ở máy bạn, cùng file đó xanh trong khi mọi test khác bị bỏ qua — vì vậy không bao giờ được commit .only.',
      },
      {
        question: 'fast-check reports: "Property failed after 8 tests … Counterexample: [390] … seed: 981865028". What is the most useful next step?|||fast-check báo: "Property failed after 8 tests … Counterexample: [390] … seed: 981865028". Bước tiếp theo có ích nhất là gì?',
        options: [
          'Increase numRuns to 10,000 until it passes.|||Tăng numRuns lên 10.000 tới khi nó đạt.',
          'Reproduce with the seed, work out why 390 fails (390/60 = 6.5 rounds to 7), fix the code, and keep an example test for 390.|||Chạy lại bằng seed, tìm vì sao 390 hỏng (390/60 = 6,5 làm tròn thành 7), sửa code, và giữ một test ví dụ cho 390.',
          'Delete the property; random tests are flaky.|||Xoá thuộc tính đi; test ngẫu nhiên thì chập chờn.',
          'Limit the generator to 0…389 so 390 is never generated.|||Giới hạn bộ sinh còn 0…389 để 390 không bao giờ xuất hiện.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A counterexample is a real bug, and the seed makes it reproducible, so it is not flakiness. More runs cannot make a false property pass, and shrinking the input range hides the bug instead of fixing it.|||VI: Phản ví dụ là một bug thật, và seed giúp tái hiện nó, nên đây không phải chập chờn. Chạy nhiều hơn không thể làm một thuộc tính sai trở thành đạt, còn thu hẹp khoảng đầu vào là giấu bug chứ không sửa.',
      },
      {
        question: 'The mutation script prints "✘ SURVIVED #3 slot ending at 21:00 rejected". What does it tell you?|||Script đột biến in "✘ SURVIVED #3 slot ending at 21:00 rejected". Nó cho bạn biết điều gì?',
        options: [
          'The real code wrongly rejects slots ending at 21:00.|||Code thật đang từ chối sai các khung kết thúc lúc 21:00.',
          'The mutation script is broken and should be fixed.|||Script đột biến bị hỏng và cần sửa.',
          'Your suite has too many tests about opening hours.|||Bộ test của bạn có quá nhiều test về giờ mở cửa.',
          'No test checks that a slot ending exactly at 21:00 is accepted, so changing > to >= went unnoticed.|||Không test nào kiểm rằng khung kết thúc đúng 21:00 được chấp nhận, nên đổi > thành >= mà không ai phát hiện.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: "Survived" means your suite stayed green while that bug was planted; the real code is fine. Add a boundary row such as 20:00–21:00 → { ok: true, minutes: 60 } and the mutant is killed.|||VI: "Survived" nghĩa là bộ test vẫn xanh khi con bug đó được cài; code thật thì không sao. Thêm một dòng biên như 20:00–21:00 → { ok: true, minutes: 60 } là con đột biến bị diệt.',
      },
    ],
  },
};
