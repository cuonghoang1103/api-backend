/**
 * Testing · Chương 2 · Quiz Chương 2 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-2-6-quiz.
 * Đáp án rải: A ×3 (câu 2, 6, 9) · B ×2 (4, 8) · C ×3 (1, 5, 10) · D ×2 (3, 7).
 */
export default {
  title: 'Chapter 2 check — 10 scenario questions|||Kiểm tra Chương 2 — 10 câu tình huống',
  slug: 'tst-2-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 2: .then không await, rejects đúng cách, lỗi tranh chấp và it.fails, bug múi giờ UTC+7, khẳng định mã lỗi + cause, fake timers với retry, biên thời gian 59/60/61 phút, bẫy try/catch, test chập chờn do ngẫu nhiên, mock không trả lại — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Chapter 2 check</h2>
<p class="lead">Ten scenarios from LabFlow Lite: promises, clocks, errors and chance. Every question explains why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write an async test and assert values and errors with <code>resolves</code> / <code>rejects</code>.</li>
<li>I can explain why a missing <code>await</code> can make a wrong test green, and how <code>requireAssertions</code> catches it.</li>
<li>I can freeze and move time with fake timers, or inject a clock, and I restore what I change.</li>
<li>I can reach a <code>catch</code> branch with a repository that fails on purpose.</li>
<li>I can make a test that uses randomness repeatable.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Kiểm tra Chương 2</h2>
<p class="lead">Mười tình huống từ LabFlow Lite: promise, đồng hồ, lỗi và may rủi. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được test bất đồng bộ và khẳng định giá trị lẫn lỗi bằng <code>resolves</code> / <code>rejects</code>.</li>
<li>Tôi giải thích được vì sao thiếu <code>await</code> có thể làm test sai vẫn xanh, và <code>requireAssertions</code> bắt nó ra sao.</li>
<li>Tôi đóng băng và dịch được thời gian bằng fake timers, hoặc tiêm đồng hồ, và tôi trả lại những gì mình đã đổi.</li>
<li>Tôi đi vào được nhánh <code>catch</code> bằng một repository cố ý hỏng.</li>
<li>Tôi làm được một test dùng ngẫu nhiên trở nên lặp lại được.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "A teammate's test reads: it('stores a pending booking', () => { bookLab(repo, input).then((b) => { expect(b.status).toBe('PENDING'); }); }). The input has 20 seats, so the real status is CONFIRMED — yet with a loose config the test is green. Why?|||Test của một bạn cùng nhóm: it('stores a pending booking', () => { bookLab(repo, input).then((b) => { expect(b.status).toBe('PENDING'); }); }). Đầu vào có 20 chỗ nên trạng thái thật là CONFIRMED — vậy mà với cấu hình lỏng test vẫn xanh. Vì sao?",
        options: [
          'Vitest waits for every .then automatically, so the booking must really be PENDING.|||Vitest tự chờ mọi .then, nên lượt đặt chắc chắn là PENDING thật.',
          'A .then callback swallows errors, so an expect inside it can never fail.|||Callback của .then nuốt mất lỗi, nên expect bên trong không bao giờ hỏng được.',
          'The test function returned before the promise settled; the failing expect ran after the test had already passed.|||Hàm test đã trả về trước khi promise ngã ngũ; dòng expect hỏng chạy sau khi test đã được tính là đạt.',
          'toBe compares references, so two strings are never equal.|||toBe so sánh tham chiếu, nên hai chuỗi không bao giờ bằng nhau.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Without await, the test function returns immediately and Vitest counts it as passed. About 5 ms later the expect throws, which shows up at most as an "Unhandled Rejection". Vitest does not wait for promises you do not return or await. Fix: make the test async and await the booking; requireAssertions also turns this test red ("expected any number of assertion, but got none").|||VI: Thiếu await, hàm test trả về ngay và Vitest tính là đạt. Khoảng 5 ms sau dòng expect mới ném lỗi, nhiều lắm chỉ hiện thành một "Unhandled Rejection". Vitest không chờ những promise bạn không return hay await. Cách sửa: biến test thành async và await lượt đặt; requireAssertions cũng làm test này đỏ ("expected any number of assertion, but got none").',
      },
      {
        question: 'bookLab rejects a 06:00 booking with a BookingError whose code is OUTSIDE_HOURS. Which assertion is correct and complete?|||bookLab từ chối lượt đặt lúc 06:00 bằng một BookingError có mã OUTSIDE_HOURS. Khẳng định nào đúng và đủ?',
        options: [
          "await expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });|||await expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });",
          "expect(() => bookLab(repo, { ...input, start: '06:00' })).toThrow('OUTSIDE_HOURS');|||expect(() => bookLab(repo, { ...input, start: '06:00' })).toThrow('OUTSIDE_HOURS');",
          "expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toMatchObject({ code: 'OUTSIDE_HOURS' }); (no await)|||expect(bookLab(repo, { ...input, start: '06:00' })).rejects.toMatchObject({ code: 'OUTSIDE_HOURS' }); (không await)",
          "try { await bookLab(repo, { ...input, start: '06:00' }); } catch (e) { expect(e.code).toBe('OUTSIDE_HOURS'); } with no assertion guard|||try { await bookLab(repo, { ...input, start: '06:00' }); } catch (e) { expect(e.code).toBe('OUTSIDE_HOURS'); } không có chốt chặn khẳng định",
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: An async function never throws synchronously — it returns a rejected promise — so toThrow on a wrapper function (B) fails with "expected function to throw". Un-awaited rejects (C) is failed by Vitest 5 as "not awaited" and was silently green in other runners. The try/catch version (D) is green if nothing is thrown. Only A waits and checks the stable code.|||VI: Hàm async không bao giờ ném lỗi đồng bộ — nó trả về một promise bị từ chối — nên toThrow trên hàm bọc (B) hỏng với "expected function to throw". rejects không await (C) bị Vitest 5 đánh hỏng là "not awaited", còn ở các bộ chạy khác thì xanh trong im lặng. Bản try/catch (D) xanh nếu không có gì bị ném. Chỉ A vừa chờ vừa kiểm mã lỗi ổn định.',
      },
      {
        question: "Two bookings of the same slot are started together with Promise.allSettled. The test expects ['fulfilled', 'rejected'] but gets ['fulfilled', 'fulfilled']. What is the right response?|||Hai lượt đặt cùng khung giờ được khởi động cùng lúc bằng Promise.allSettled. Test mong ['fulfilled', 'rejected'] nhưng nhận ['fulfilled', 'fulfilled']. Phản ứng đúng là gì?",
        options: [
          'Make the in-memory repository slower so the second booking sees the first.|||Làm repository trong bộ nhớ chậm hơn để lượt thứ hai thấy lượt thứ nhất.',
          'Await the two bookings one after the other so the test is green.|||Await hai lượt đặt lần lượt từng cái để test xanh.',
          'Switch to Promise.all, which stops at the first error.|||Đổi sang Promise.all, thứ dừng ở lỗi đầu tiên.',
          'Accept that it is a real check-then-act race: mark it it.fails with a comment, and fix it with an atomic database constraint (Chapter 4).|||Chấp nhận đó là lỗi tranh chấp kiểm-rồi-làm thật: đánh dấu it.fails kèm chú thích, và sửa bằng một ràng buộc nguyên tử ở cơ sở dữ liệu (Chương 4).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Both requests check for an overlap before either inserts, so both win — a genuine bug that real users pressing "Book" together would hit. Running them sequentially (B) only changes the test, not the bug. Timing tricks (A) hide it. it.fails keeps the bug visible ("1 expected fail") and turns red once Chapter 4 adds the exclusion constraint.|||VI: Cả hai yêu cầu đều kiểm trùng trước khi bên nào kịp ghi, nên cả hai cùng thắng — một bug thật mà người dùng cùng bấm "Đặt" sẽ gặp. Chạy lần lượt (B) chỉ đổi test chứ không đổi bug. Mẹo thời gian (A) chỉ giấu nó. it.fails giữ bug trong tầm mắt ("1 expected fail") và sẽ chuyển đỏ khi Chương 4 thêm ràng buộc loại trừ.',
      },
      {
        question: 'A "days ahead" test passes on your laptop in Ha Noi but fails in CI with "expected 15 to be 14". The test fixes now = 06:30 on 2 November (+07:00). What is the most likely cause?|||Một test "còn mấy ngày" đạt trên laptop ở Hà Nội nhưng hỏng trên CI với "expected 15 to be 14". Test cố định now = 06:30 sáng 2/11 (+07:00). Nguyên nhân khả dĩ nhất là gì?',
        options: [
          'CI machines are slower, so the date changes during the test.|||Máy CI chậm hơn nên ngày đã đổi trong lúc test chạy.',
          'CI runs in UTC; the code counts from local midnight, and at 06:30 in Viet Nam a UTC machine is still on 1 November.|||CI chạy giờ UTC; code đếm từ nửa đêm theo giờ máy, mà lúc 06:30 ở Việt Nam thì máy UTC vẫn đang ở ngày 1/11.',
          'CI uses a different Vitest version with a different toBe.|||CI dùng bản Vitest khác có toBe khác.',
          'Fake timers were left on by another test file.|||Một file test khác để quên fake timers.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: setHours(0, 0, 0, 0) means midnight in the machine’s time zone. 06:30 on 2 November in Viet Nam is 23:30 on 1 November UTC, so a UTC server counts 15 days. Compute the date in Viet Nam explicitly (daysAheadVN) and run the suite with TZ=UTC before pushing. Fake timers (D) do not cross file boundaries — Vitest isolates files by default.|||VI: setHours(0, 0, 0, 0) nghĩa là nửa đêm theo múi giờ của máy. 06:30 sáng 2/11 ở Việt Nam là 23:30 ngày 1/11 giờ UTC, nên máy chủ UTC đếm ra 15 ngày. Hãy tính rõ ngày ở Việt Nam (daysAheadVN) và chạy bộ test với TZ=UTC trước khi đẩy code. Fake timers (D) không vượt ranh giới file — mặc định Vitest cách ly các file.',
      },
      {
        question: "A test uses a fake repository whose findOverlap throws new Error('connect ECONNREFUSED 127.0.0.1:5432'). What should it assert about the error bookLab rejects with?|||Một test dùng repository giả có findOverlap ném new Error('connect ECONNREFUSED 127.0.0.1:5432'). Test nên khẳng định gì về lỗi mà bookLab từ chối?",
        options: [
          "That its message is 'connect ECONNREFUSED 127.0.0.1:5432'.|||Rằng thông điệp của nó là 'connect ECONNREFUSED 127.0.0.1:5432'.",
          'Only that something was thrown: rejects.toThrow() with no argument.|||Chỉ cần có lỗi bị ném: rejects.toThrow() không tham số.',
          "That its code is STORAGE_DOWN and its cause.message is the driver's message.|||Rằng mã của nó là STORAGE_DOWN và cause.message là thông điệp của driver.",
          'That insert was called afterwards to save the booking anyway.|||Rằng insert vẫn được gọi sau đó để lưu lượt đặt.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: bookLab wraps the driver error: users and the API see the stable code STORAGE_DOWN, logs keep the original in cause. The BookingError message is the code, not the driver text (A). toThrow() with no argument (B) would also pass if the code crashed with a TypeError. After a failed read the code must stop, so insert must not be called (D).|||VI: bookLab bọc lỗi của driver: người dùng và API thấy mã ổn định STORAGE_DOWN, còn log giữ lỗi gốc trong cause. Thông điệp của BookingError là mã, không phải chữ của driver (A). toThrow() không tham số (B) cũng đạt nếu code sập vì một TypeError. Sau lần đọc hỏng code phải dừng, nên insert không được gọi (D).',
      },
      {
        question: 'retry(fn) waits 1 s, then 2 s, between three attempts. You want a fast test that checks the second attempt happens at exactly 1000 ms. With vi.useFakeTimers() on, what do you do?|||retry(fn) chờ 1 giây rồi 2 giây giữa ba lần thử. Bạn muốn một test nhanh kiểm rằng lần thử thứ hai xảy ra đúng ở 1000 ms. Khi đã bật vi.useFakeTimers(), bạn làm gì?',
        options: [
          'Start retry(fn) without awaiting it, then await vi.advanceTimersByTimeAsync(999) and (1), counting calls after each step.|||Khởi động retry(fn) mà không await, rồi await vi.advanceTimersByTimeAsync(999) và (1), đếm số lần gọi sau mỗi bước.',
          'await retry(fn) first, then call vi.advanceTimersByTime(3000).|||await retry(fn) trước, rồi gọi vi.advanceTimersByTime(3000).',
          'Nothing else: fake timers make every setTimeout fire instantly.|||Không cần gì thêm: fake timers làm mọi setTimeout chạy ngay lập tức.',
          'Change retry so delayMs is 0 when NODE_ENV is test.|||Sửa retry để delayMs bằng 0 khi NODE_ENV là test.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Fake timers only move when you move them. Awaiting retry first (B) waits for a timer that never fires — the test times out. They do not fire on their own (C). Changing production behaviour for tests (D) means the real delays are never tested. The Async variant also lets the awaits inside retry settle between steps.|||VI: Fake timers chỉ nhích khi bạn đẩy chúng. Await retry trước (B) là chờ một bộ hẹn giờ không bao giờ chạy — test quá giờ. Chúng không tự chạy (C). Sửa hành vi thật vì test (D) nghĩa là các khoảng chờ thật không bao giờ được test. Bản Async còn cho các await bên trong retry kịp ngã ngũ giữa các bước.',
      },
      {
        question: 'Lite-3: a booking can be cancelled until 60 minutes before it starts. For a 09:00 booking, which "now" values make the best boundary test?|||Lite-3: được huỷ lượt đặt tới trước giờ bắt đầu 60 phút. Với lượt đặt lúc 09:00, các giá trị "bây giờ" nào tạo nên test biên tốt nhất?',
        options: [
          '07:00 and 10:00.|||07:00 và 10:00.',
          '08:30 only.|||Chỉ 08:30.',
          '00:00, 09:00 and 23:59.|||00:00, 09:00 và 23:59.',
          '07:59, 08:00 and 08:01.|||07:59, 08:00 và 08:01.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A time limit is a boundary: test on it (08:00 = exactly 60 minutes, still allowed) and one step either side (61 and 59 minutes). 07:00 and 10:00 (A) are far from the limit, so the >= → > mutant (Lab 2 #1) survives. 08:30 (B) tests only one side.|||VI: Giới hạn thời gian là một biên: test ngay trên nó (08:00 = đúng 60 phút, vẫn được huỷ) và lệch một bước hai bên (61 và 59 phút). 07:00 và 10:00 (A) ở xa giới hạn, nên đột biến >= → > (Lab 2 số 1) sống sót. 08:30 (B) chỉ test một phía.',
      },
      {
        question: "it('rejects 06:00', async () => { try { await bookLab(repo, input); } catch (e) { expect(e.code).toBe('OUTSIDE_HOURS'); } }) — but input starts at 08:00. With a loose config the test is green. Which statement is true?|||it('rejects 06:00', async () => { try { await bookLab(repo, input); } catch (e) { expect(e.code).toBe('OUTSIDE_HOURS'); } }) — nhưng input bắt đầu lúc 08:00. Với cấu hình lỏng test vẫn xanh. Câu nào đúng?",
        options: [
          'Green means the opening-hours rule works.|||Xanh nghĩa là luật giờ mở cửa hoạt động đúng.',
          'Nothing was thrown, so no expect ran; requireAssertions, expect.assertions(1) or a rejects assertion would make it fail.|||Không có gì bị ném nên không expect nào chạy; requireAssertions, expect.assertions(1) hoặc khẳng định bằng rejects sẽ làm nó hỏng.',
          'It is a Vitest bug: a test with an expect inside cannot pass without running it.|||Đó là bug của Vitest: test có expect bên trong thì không thể đạt khi chưa chạy nó.',
          'Adding toThrow() with no argument inside the catch block fixes it.|||Thêm toThrow() không tham số vào trong khối catch là sửa được.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A test passes unless something fails; an expect that never runs cannot fail. The test would stay green even if the opening-hours rule were deleted (A is wrong). Anything inside the catch block (D) has the same problem. await expect(...).rejects fails with "promise resolved … instead of rejecting".|||VI: Test đạt trừ khi có thứ gì hỏng; một expect không bao giờ chạy thì không thể hỏng. Test vẫn xanh kể cả khi luật giờ mở cửa bị xoá (A sai). Mọi thứ nằm trong khối catch (D) đều dính cùng vấn đề. await expect(...).rejects hỏng với "promise resolved … instead of rejecting".',
      },
      {
        question: 'A test checks that 20 two-letter booking codes from makeBookingCode(Math.random, 2) are all different. Over 100 runs it failed 14 times. What is the best fix?|||Một test kiểm rằng 20 mã đặt chỗ hai chữ từ makeBookingCode(Math.random, 2) đều khác nhau. Qua 100 lần chạy nó hỏng 14 lần. Cách sửa tốt nhất là gì?',
        options: [
          'Pass a seeded generator such as seededRandom(7), so the same 20 codes are produced on every run.|||Truyền một bộ sinh có seed như seededRandom(7), để lần chạy nào cũng ra đúng 20 mã đó.',
          'Configure the runner to retry failed tests three times.|||Cấu hình bộ chạy tự chạy lại test hỏng ba lần.',
          'Generate 50 codes instead of 20 so the result averages out.|||Sinh 50 mã thay vì 20 để kết quả cân bằng lại.',
          'Mark it it.fails, because it usually fails.|||Đánh dấu it.fails, vì nó thường hỏng.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The failure is chance (a birthday-problem collision, about 17 %), not a bug, so control the chance. Retrying (B) hides flakiness and teaches the team to ignore red. More codes (C) makes collisions more likely, not less. it.fails (D) is for a known bug that fails every time; this test passes most of the time, so it.fails would itself be flaky.|||VI: Lần hỏng là do may rủi (trùng nhau kiểu bài toán ngày sinh, khoảng 17 %), không phải bug, nên hãy kiểm soát may rủi. Chạy lại (B) giấu tính chập chờn và dạy cả nhóm lờ màu đỏ. Nhiều mã hơn (C) làm trùng dễ xảy ra hơn chứ không ít đi. it.fails (D) dành cho bug đã biết, hỏng ở mọi lần; test này đạt phần lớn số lần, nên it.fails cũng sẽ thành chập chờn.',
      },
      {
        question: 'Test A calls vi.spyOn(Math, "random").mockReturnValue(0) and never restores it. Test B, later in the same file, fails only when A runs first. What is the best permanent fix?|||Test A gọi vi.spyOn(Math, "random").mockReturnValue(0) và không bao giờ trả lại. Test B, nằm sau trong cùng file, chỉ hỏng khi A chạy trước. Cách sửa lâu dài tốt nhất là gì?',
        options: [
          'Always run B on its own with -t B.|||Luôn chạy riêng B bằng -t B.',
          'Delete test B, since it is order-dependent.|||Xoá test B, vì nó phụ thuộc thứ tự.',
          'Set restoreMocks: true in vitest.config.js (or call vi.restoreAllMocks() in afterEach).|||Đặt restoreMocks: true trong vitest.config.js (hoặc gọi vi.restoreAllMocks() trong afterEach).',
          'Also spy on Math.random in test B with a different value.|||Spy luôn Math.random trong test B với một giá trị khác.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: B is correct; A leaks global state. restoreMocks: true restores every spy before each test, so no test can leak a spy into the next one, now or in the future. Running B alone (A) or deleting it (B) hides the leak. Spying in B (D) piles a second patch on the first.|||VI: B viết đúng; A làm rò trạng thái toàn cục. restoreMocks: true trả lại mọi spy trước mỗi test, nên không test nào làm rò spy sang test sau, bây giờ cũng như về sau. Chạy riêng B (A) hay xoá nó (B) chỉ giấu chỗ rò. Spy thêm trong B (D) là chồng một miếng vá lên miếng vá cũ.',
      },
    ],
  },
};
