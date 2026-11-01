/**
 * Testing · Chương 8 · Quiz Chương 8 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-8-6-quiz.
 * Đáp án rải: A ×3 (câu 3, 6, 9) · B ×2 (1, 5) · C ×3 (4, 8, 10) · D ×2 (2, 7).
 * Mọi con số trong câu hỏi lấy từ output chạy thật của Chương 8 (s08/_ma.mjs).
 */
export default {
  title: 'Chapter 8 check — 10 scenario questions|||Kiểm tra Chương 8 — 10 câu tình huống',
  slug: 'tst-8-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 8: 100% độ phủ mà bug vẫn lọt, file không được import thì không được đếm, điểm đột biến 41,49% của bộ test phủ 100%, đột biến tương đương, test bắt đúng lớp lỗi nhưng sai lý do, thư mục .stryker-tmp làm bộ test nhân đôi, retry che một lượt đặt trùng thật, tái hiện thứ tự đỏ bằng seed, chỗ thật sự làm bộ test chậm, và beforeAll làm test nhanh mà đỏ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Chapter 8 check</h2>
<p class="lead">Ten scenarios about coverage, mutation testing, flaky tests and speed, each based on something measured on LabFlow Lite in this chapter. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a coverage report (lines, branches, functions), set thresholds, and say what 100% does not prove.</li>
<li>I can run Stryker, read a surviving mutant, write the test that kills it — or recognise an equivalent mutant.</li>
<li>I can reproduce a flaky test on purpose, find its cause, and explain why a retry is a report, not a fix.</li>
<li>I can measure where a suite spends its time and speed it up without checking less.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Kiểm tra Chương 8</h2>
<p class="lead">Mười tình huống về độ phủ, mutation testing, test chập chờn và tốc độ, câu nào cũng dựa trên một điều đã đo trên LabFlow Lite trong chương. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được báo cáo độ phủ (dòng, nhánh, hàm), đặt được ngưỡng, và nói được 100% không chứng minh điều gì.</li>
<li>Tôi chạy được Stryker, đọc được một đột biến sống, viết được test diệt nó — hoặc nhận ra một đột biến tương đương.</li>
<li>Tôi tái hiện được test chập chờn có chủ đích, tìm ra nguyên nhân, và giải thích vì sao retry là một bản báo cáo chứ không phải cách sửa.</li>
<li>Tôi đo được bộ test tốn thời gian ở đâu và làm nó nhanh hơn mà không kiểm ít đi.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "A suite for booking.js reaches 100% of statements, branches, functions and lines. Every test asserts with toBeDefined() or toBeTruthy(). You plant `seats >= APPROVAL_SEATS` instead of `>`, then remove `role === 'ADMIN'` from needsApproval: both times the suite stays green (5 passed). What does this show?|||Một bộ test cho booking.js đạt 100% câu lệnh, nhánh, hàm và dòng. Mọi test đều khẳng định bằng toBeDefined() hoặc toBeTruthy(). Bạn cài `seats >= APPROVAL_SEATS` thay cho `>`, rồi bỏ `role === 'ADMIN'` khỏi needsApproval: cả hai lần bộ test vẫn xanh (5 passed). Điều này cho thấy gì?",
        options: [
          'Coverage is computed wrongly by the v8 provider; istanbul would report less than 100%.|||Provider v8 tính độ phủ sai; istanbul sẽ báo dưới 100%.',
          'Coverage counts what RAN, not what was CHECKED: every line executed, but no assertion compared a result with the expected value.|||Độ phủ đếm cái gì đã CHẠY, không đếm cái gì đã được KIỂM: mọi dòng đều chạy, nhưng không khẳng định nào so kết quả với giá trị mong đợi.',
          'The suite needs a 100% threshold in vitest.config.js so that the planted bugs make it red.|||Bộ test cần ngưỡng 100% trong vitest.config.js để các bug cài sẵn làm nó đỏ.',
          'Two planted bugs are equivalent mutants, so no test could kill them.|||Hai bug cài sẵn là đột biến tương đương, nên không test nào diệt được.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: Coverage only records that code was executed. toBeDefined() is true for false, for 'PENDING' and for 'CONFIRMED' alike, so a wrong answer still passes. The real booking.test.js, with exact assertions, covers only 87.5% of lines and still kills a planted `>=` (exactly 4 hours refused). Tempting wrong answer — a threshold: the suite already IS at 100%; a threshold can only fail a run on coverage, it cannot make a weak assertion strong.|||VI: Độ phủ chỉ ghi nhận code đã được chạy. toBeDefined() đúng với false, với 'PENDING' và với 'CONFIRMED' như nhau, nên câu trả lời sai vẫn qua. booking.test.js thật, với khẳng định chính xác, chỉ phủ 87,5% số dòng mà vẫn diệt được một bug `>=` cài sẵn (từ chối đúng 4 tiếng). Đáp án sai hấp dẫn — đặt ngưỡng: bộ test ĐÃ ở 100%; ngưỡng chỉ làm lượt chạy đỏ vì độ phủ, không biến một khẳng định yếu thành mạnh.",
      },
      {
        question: "`npx vitest run src/ --coverage` reports 96.31% of lines. Adding `--coverage.include='src/**/*.js'` drops it to 78.91%, and new rows appear: app.js, main.js and code.js, all at 0%. No test changed. Why?|||`npx vitest run src/ --coverage` báo 96,31% số dòng. Thêm `--coverage.include='src/**/*.js'` thì tụt xuống 78,91%, và xuất hiện thêm các dòng: app.js, main.js và code.js, đều 0%. Không test nào thay đổi. Vì sao?",
        options: [
          'include makes Vitest run the test files of every folder, and some of them fail.|||include khiến Vitest chạy test của mọi thư mục, và vài file trong đó đỏ.',
          'The second run used the istanbul provider, which counts more statements.|||Lần chạy thứ hai dùng provider istanbul, vốn đếm nhiều câu lệnh hơn.',
          'The first number was cached from an earlier run.|||Con số đầu được lấy từ cache của lần chạy trước.',
          'By default only files that some test imports are counted; a file no unit test touches is simply missing from the report, which makes the total look better.|||Mặc định chỉ những file có test nào đó import mới được đếm; file không unit test nào chạm tới thì vắng mặt khỏi báo cáo, làm con số tổng trông đẹp hơn.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Without include, Vitest only knows the files that were loaded while tests ran. code.js had tests only in a demo folder and main.js only calls listen, so they were invisible. With include they count as 0% — the honest number. Then you decide per file: write unit tests (code.js was promoted), or exclude it with a reason (main.js; pgRepo.js belongs to test:int). Tempting wrong answer — another provider: the command still says v8; include changes WHICH files are counted, not HOW.|||VI: Không có include, Vitest chỉ biết các file đã được nạp khi test chạy. code.js chỉ có test trong thư mục demo, còn main.js chỉ gọi listen, nên chúng vô hình. Có include, chúng được tính là 0% — con số trung thực. Sau đó bạn quyết định từng file: viết unit test (code.js đã được đưa test vào src), hoặc loại ra kèm lý do (main.js; pgRepo.js là việc của test:int). Đáp án sai hấp dẫn — đổi provider: lệnh vẫn là v8; include đổi file NÀO được đếm, không đổi CÁCH đếm.",
      },
      {
        question: "Stryker mutates booking.js 94 times and runs only the 100%-coverage suite from question 1 against it. The result: 39 killed, 55 survived, mutation score 41.49%, and the command exits with code 1. What is the right reading?|||Stryker tạo 94 đột biến trong booking.js và chỉ chạy bộ test phủ 100% ở câu 1 để chấm. Kết quả: 39 bị diệt, 55 sống, điểm đột biến 41,49%, và lệnh thoát với mã 1. Đọc kết quả này thế nào cho đúng?",
        options: [
          'The tests reach every mutant (coverage is 100%) but notice fewer than half of them: most assertions are too weak. Exit code 1 comes from thresholds.break: 60 in the Stryker config.|||Test chạm tới mọi đột biến (độ phủ 100%) nhưng chỉ nhận ra chưa tới một nửa: phần lớn khẳng định quá yếu. Mã thoát 1 đến từ thresholds.break: 60 trong cấu hình Stryker.',
          'Stryker crashed: a mutation score cannot be below the coverage percentage.|||Stryker bị lỗi: điểm đột biến không thể thấp hơn phần trăm độ phủ.',
          'The 55 survivors are equivalent mutants, so 41.49% is the best possible score.|||55 con sống là đột biến tương đương, nên 41,49% là điểm cao nhất có thể.',
          'Stryker ran the demo tests that are red on purpose, so most mutants were counted wrongly.|||Stryker đã chạy cả các test demo cố ý đỏ, nên đa số đột biến bị tính sai.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Coverage and mutation score answer different questions: “did the tests run this code?” and “would the tests notice if this code were wrong?”. The same weak suite gives 100% and 41.49%. Stryker’s break threshold turns a low score into a failed command, like a coverage threshold. Tempting wrong answer — “all equivalent”: equivalent mutants are rare (the two in days.js are the only ones left in src/rules after the fixes); here the survivors die as soon as exact assertions are written.|||VI: Độ phủ và điểm đột biến trả lời hai câu hỏi khác nhau: “test có chạy đoạn code này không?” và “test có nhận ra nếu đoạn code này sai không?”. Cùng một bộ test yếu cho 100% và 41,49%. Ngưỡng break của Stryker biến điểm thấp thành lệnh thất bại, giống ngưỡng độ phủ. Đáp án sai hấp dẫn — “đều là tương đương”: đột biến tương đương hiếm (hai con trong days.js là những con duy nhất còn lại ở src/rules sau khi sửa); ở đây các con sống chết ngay khi viết khẳng định chính xác.",
      },
      {
        question: "After all fixes two mutants still survive in days.js: Stryker replaced the string 'T00:00:00Z' by \"\" in `Date.parse(dateText + 'T00:00:00Z')`. Running `node -e` shows Date.parse('2026-11-16') and Date.parse('2026-11-16T00:00:00Z') are both 1794787200000. What should you do?|||Sau mọi lần sửa vẫn còn hai đột biến sống trong days.js: Stryker thay chuỗi 'T00:00:00Z' bằng \"\" trong `Date.parse(dateText + 'T00:00:00Z')`. Chạy `node -e` thấy Date.parse('2026-11-16') và Date.parse('2026-11-16T00:00:00Z') đều là 1794787200000. Bạn nên làm gì?",
        options: [
          'Write a test that passes a date with a time zone, so the two versions differ.|||Viết một test truyền ngày có kèm múi giờ, để hai phiên bản khác nhau.',
          'Lower the break threshold until the run is green.|||Hạ ngưỡng break tới khi lượt chạy xanh.',
          'Accept it as an equivalent mutant: a date-only ISO string is already parsed as UTC midnight, so the program behaves the same; record the decision (for example with a Stryker disable comment and its reason).|||Chấp nhận đó là đột biến tương đương: chuỗi ISO chỉ có ngày đã được đọc là nửa đêm UTC, nên chương trình chạy y hệt; ghi lại quyết định (ví dụ bằng chú thích tắt của Stryker kèm lý do).',
          'Remove days.js from the mutate list in stryker.config.mjs.|||Bỏ days.js khỏi danh sách mutate trong stryker.config.mjs.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: An equivalent mutant changes the code but not its behaviour; no test can kill it, and forcing one would test JavaScript’s date parser, not LabFlow. The measurement (same millisecond value) is the proof. Tempting wrong answer — a test with a time zone: daysAheadVN always receives a date-only string from the API schema; inventing an input the program never gets just to kill a mutant makes the suite test something that does not happen. Removing the whole file would hide its 11 real killed mutants too.|||VI: Đột biến tương đương làm đổi code mà không đổi hành vi; không test nào diệt được nó, và cố ép một test thì sẽ là test bộ đọc ngày của JavaScript chứ không phải LabFlow. Phép đo (cùng một giá trị mili giây) chính là bằng chứng. Đáp án sai hấp dẫn — test có múi giờ: daysAheadVN luôn nhận chuỗi chỉ có ngày theo schema của API; bịa ra đầu vào chương trình không bao giờ nhận chỉ để diệt đột biến là làm bộ test kiểm một điều không xảy ra. Bỏ cả file thì giấu luôn 11 đột biến thật đã bị diệt.",
      },
      {
        question: "time.test.js has `expect(() => parseTime('7:00')).toThrow(TypeError)`. Stryker’s mutant `if (!m) throw …` → `if (false) throw …` survives. Why?|||time.test.js có `expect(() => parseTime('7:00')).toThrow(TypeError)`. Đột biến của Stryker `if (!m) throw …` → `if (false) throw …` vẫn sống. Vì sao?",
        options: [
          'Stryker did not run time.test.js for that mutant (coverageAnalysis: perTest skipped it).|||Stryker không chạy time.test.js cho đột biến đó (coverageAnalysis: perTest đã bỏ qua).',
          'Without the check, m is null and m[1] throws “Cannot read properties of null” — also a TypeError. The test passes for the wrong reason; asserting the message (expected HH:MM) kills it.|||Không có phép kiểm, m là null và m[1] ném “Cannot read properties of null” — cũng là TypeError. Test qua vì một lý do sai; khẳng định cả thông báo (expected HH:MM) sẽ diệt nó.',
          'Regular-expression code cannot be mutated reliably, so Stryker marks it as survived.|||Code có biểu thức chính quy không đột biến tin cậy được, nên Stryker đánh dấu là sống.',
          'It is an equivalent mutant: both versions reject 7:00.|||Đó là đột biến tương đương: cả hai phiên bản đều từ chối 7:00.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: toThrow(TypeError) only checks the class. The crash on null happens to be a TypeError, so the test stays green while the helpful error is gone. In the chapter, “the TypeError is ours, not a crash on null” — toThrow('expected HH:MM') — killed it, and time.js reached 100%. Tempting wrong answer — “equivalent”: the behaviour does change (the message, and with it what a developer or API client sees), so a test CAN tell them apart; that is the definition of a killable mutant.|||VI: toThrow(TypeError) chỉ kiểm lớp lỗi. Cú sập vì null tình cờ cũng là TypeError, nên test vẫn xanh trong khi thông báo hữu ích đã mất. Trong chương, test “the TypeError is ours, not a crash on null” — toThrow('expected HH:MM') — đã diệt nó, và time.js đạt 100%. Đáp án sai hấp dẫn — “tương đương”: hành vi có đổi (thông báo, và theo đó điều lập trình viên hay client API nhìn thấy), nên test PHÂN BIỆT được; đó chính là định nghĩa đột biến diệt được.",
      },
      {
        question: "Yesterday `npm run test:unit` printed 10 test files and 85 tests. Today, with no code change, it prints `Test Files 20 passed (20)` and `Tests 170 passed (170)`, and one line reads `✓ .stryker-tmp/sandbox-2n9pUw/src/api/server.test.js`. What happened?|||Hôm qua `npm run test:unit` in 10 file và 85 test. Hôm nay, code không đổi, nó in `Test Files 20 passed (20)` và `Tests 170 passed (170)`, và có một dòng `✓ .stryker-tmp/sandbox-2n9pUw/src/api/server.test.js`. Chuyện gì đã xảy ra?",
        options: [
          'A Stryker run that crashed left its sandbox copy of the project in .stryker-tmp, and `vitest run src/` matches every path containing src/ — so the copy ran too. Exclude .stryker-tmp/** in vitest.config.js (and .gitignore it).|||Một lượt Stryker bị sập để lại bản sao dự án trong .stryker-tmp, và `vitest run src/` khớp mọi đường dẫn chứa src/ — nên bản sao cũng chạy. Loại .stryker-tmp/** trong vitest.config.js (và đưa vào .gitignore).',
          'Vitest 5 runs every test twice when coverage was enabled the day before.|||Vitest 5 chạy mỗi test hai lần nếu hôm trước có bật độ phủ.',
          'Stryker permanently copies each test file so that it can mutate it; this is expected.|||Stryker sao chép vĩnh viễn từng file test để đột biến; đó là điều bình thường.',
          'Someone added --repeats=1 to the test:unit script.|||Ai đó đã thêm --repeats=1 vào script test:unit.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: A path filter in Vitest is a substring match, so `src/` also matches `.stryker-tmp/sandbox-…/src/`. Stryker removes its sandbox after a normal run; a crashed run can leave it behind. The doubled counts (85 → 170) are the clue — read the number of tests, not only the colour. Tempting wrong answer — “expected Stryker behaviour”: the sandbox is temporary by design; a copy that stays is a leftover, and it makes every timing and count wrong.|||VI: Bộ lọc đường dẫn của Vitest là khớp chuỗi con, nên `src/` cũng khớp `.stryker-tmp/sandbox-…/src/`. Stryker tự xoá sandbox sau lượt chạy bình thường; lượt bị sập có thể để lại. Con số nhân đôi (85 → 170) là manh mối — hãy đọc số test, đừng chỉ nhìn màu. Đáp án sai hấp dẫn — “Stryker vốn vậy”: sandbox được thiết kế là tạm; bản sao còn nằm lại là đồ thừa, và nó làm sai mọi số đo thời gian lẫn số lượng.",
      },
      {
        question: "The test “two students book the same slot at once: exactly one wins” runs against a repository whose lookups take 0–40 ms longer each time. Without retries it is red in 17 of 50 runs; with --retry=2 it is red in 0 of 50 runs, and the reporter only shows “(retry x1)” next to a green tick. A teammate wants to keep --retry=2 and close the issue. What is right?|||Test “two students book the same slot at once: exactly one wins” chạy với một repository có thời gian tra cứu dài thêm 0–40 ms mỗi lần. Không retry thì đỏ 17/50 lần; với --retry=2 thì đỏ 0/50 lần, và reporter chỉ hiện “(retry x1)” cạnh dấu tích xanh. Một bạn muốn giữ --retry=2 và đóng issue. Điều gì đúng?",
        options: [
          'Keep the retry: 0/50 proves the problem is gone.|||Giữ retry: 0/50 chứng minh vấn đề đã hết.',
          'Raise the test timeout so the second booking has time to see the first one.|||Tăng timeout của test để lượt đặt thứ hai kịp thấy lượt thứ nhất.',
          'Delete the test: a test that depends on timing cannot be trusted.|||Xoá test: test phụ thuộc thời gian thì không tin được.',
          'The red runs were real double bookings (both requests fulfilled). The retry only hides them; quarantine the test with a tag and an owner if needed, and fix the app — check-and-insert must be one step (a lock, or a database constraint as in Chapter 4).|||Các lần đỏ là lượt đặt trùng thật (cả hai request đều thành công). Retry chỉ che chúng đi; cách ly test bằng tag kèm người phụ trách nếu cần, và sửa ứng dụng — kiểm-rồi-ghi phải là một bước (khoá, hoặc ràng buộc CSDL như Chương 4).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Here the flaky test is the only one telling the truth: the failure message was ['fulfilled', 'fulfilled']. A retry gives the race three chances to lose, so the suite turns green while users can still be double-booked. With check-and-insert serialised (one booking at a time per lab), the fixed version passed 100 repeats in a shuffled order. Tempting wrong answer — delete the test: it removes the only detector of a real bug; isolate it (tags: ['quarantine'], --tagsFilter='!quarantine' in the main job) only while the fix is under way.|||VI: Ở đây test chập chờn là test duy nhất nói thật: thông báo lỗi là ['fulfilled', 'fulfilled']. Retry cho cuộc tranh chấp ba cơ hội để thua, nên bộ test xanh trong khi người dùng vẫn có thể bị đặt trùng. Khi kiểm-rồi-ghi được xếp hàng (mỗi phòng một lượt đặt tại một thời điểm), bản đã sửa qua 100 lần lặp theo thứ tự xáo trộn. Đáp án sai hấp dẫn — xoá test: như thế là bỏ đi máy dò duy nhất của một bug thật; chỉ cách ly nó (tags: ['quarantine'], --tagsFilter='!quarantine' ở job chính) trong lúc đang sửa.",
      },
      {
        question: "thu-tu.test.js was red in 0 of 20 runs in file order and in 13 of 20 runs with --sequence.shuffle. The repeat script printed seeds of the red runs, the first one 1793489700951. How do you get a run that fails the same way every time, to debug it?|||thu-tu.test.js đỏ 0/20 lần theo thứ tự trong file và 13/20 lần với --sequence.shuffle. Script chạy lặp in ra seed của các lần đỏ, seed đầu là 1793489700951. Làm sao để có một lượt chạy đỏ y như vậy mỗi lần, để gỡ lỗi?",
        options: [
          'Run it with --repeats=99 until it fails again.|||Chạy với --repeats=99 tới khi nó đỏ lại.',
          'Run it with --retry=0 so the shuffle cannot hide the failure.|||Chạy với --retry=0 để việc xáo không giấu được lỗi.',
          'Run `npx vitest run demo8/thu-tu.test.js --sequence.shuffle --sequence.seed=1793489700951`: the same seed gives the same order, and the same test is red every time.|||Chạy `npx vitest run demo8/thu-tu.test.js --sequence.shuffle --sequence.seed=1793489700951`: cùng seed cho cùng thứ tự, và cùng một test đỏ mỗi lần.',
          'Run it with --no-file-parallelism, because shuffling only happens between workers.|||Chạy với --no-file-parallelism, vì việc xáo chỉ xảy ra giữa các worker.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: The shuffle is pseudo-random: a seed fixes it. Run twice with that seed, the chapter got “1 failed | 2 passed” both times — “a user with no failures is not locked” ran after the test that locks the same account. Now the cause is visible and the fix is clear: a fresh guard per test (beforeEach). Tempting wrong answer — --repeats: it repeats each test inside the same order, so an order-dependence may never show; and “until it fails” is luck, not reproduction.|||VI: Việc xáo là giả ngẫu nhiên: một seed cố định nó lại. Chạy hai lần với seed đó, chương đều nhận “1 failed | 2 passed” — “a user with no failures is not locked” chạy sau test khoá chính tài khoản đó. Giờ nguyên nhân hiện ra và cách sửa rõ ràng: mỗi test một guard mới (beforeEach). Đáp án sai hấp dẫn — --repeats: nó lặp từng test trong cùng một thứ tự, nên phụ thuộc thứ tự có thể không bao giờ lộ; còn “tới khi đỏ” là trông vào may mắn, không phải tái hiện.",
      },
      {
        question: "demo8/cham/ has two slow files: retry() with its real 1 s + 2 s waits, and 100 bookings seeded in beforeEach. In parallel they take 6.14 s; with --no-file-parallelism 11.07 s. Which change gives the biggest win without checking less?|||demo8/cham/ có hai file chậm: retry() với các lần chờ thật 1 s + 2 s, và 100 lượt đặt dựng sẵn trong beforeEach. Chạy song song mất 6,14 s; với --no-file-parallelism mất 11,07 s. Thay đổi nào lợi nhất mà không kiểm ít đi?",
        options: [
          'Fake timers for the retry waits and only the data each test needs: the same six checks run in 210 ms.|||Giả đồng hồ cho các lần chờ của retry và chỉ dựng đúng dữ liệu mỗi test cần: cùng sáu phép kiểm chạy trong 210 ms.',
          'More workers: parallelism already cut 11.07 s to 6.14 s, so doubling workers halves it again.|||Thêm worker: song song đã giảm 11,07 s xuống 6,14 s, nên gấp đôi worker sẽ giảm nửa lần nữa.',
          'Split the suite with --shard=1/3, 2/3, 3/3 on three machines.|||Chia bộ test bằng --shard=1/3, 2/3, 3/3 trên ba máy.',
          'Raise the test timeout so the slow tests never fail.|||Tăng timeout của test để test chậm không bao giờ đỏ.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Parallelism can never go below the slowest file: one file alone spends 6.0 s waiting for real timers. Removing the waiting itself (fake timers, lesson 2.2) and the setup nobody reads made it 210 ms. Tempting wrong answer — more workers or shards: with two files there is nothing left to spread, and shards split by files, not by time (the unit suite split into 31, 56 and 13 tests). Measure where the time goes first, then remove it.|||VI: Song song không bao giờ nhanh hơn file chậm nhất: riêng một file đã tốn 6,0 s chờ đồng hồ thật. Bỏ chính việc chờ (giả đồng hồ, bài 2.2) và phần dựng dữ liệu không ai đọc thì còn 210 ms. Đáp án sai hấp dẫn — thêm worker hay shard: với hai file thì chẳng còn gì để chia, và shard chia theo file chứ không theo thời gian (bộ unit test bị chia thành 31, 56 và 13 test). Đo xem thời gian đi đâu trước, rồi mới bỏ nó.",
      },
      {
        question: "To speed up the seeding, a teammate moves the 100 bookings from beforeEach to beforeAll. The file now takes 1289 ms instead of 4733 ms — and “the list has 100 bookings” fails: “expected [ …(102) ] to have a length of 100 but got 102”. Why?|||Để dựng dữ liệu nhanh hơn, một bạn chuyển 100 lượt đặt từ beforeEach sang beforeAll. File giờ mất 1289 ms thay vì 4733 ms — và “the list has 100 bookings” đỏ: “expected [ …(102) ] to have a length of 100 but got 102”. Vì sao?",
        options: [
          'beforeAll runs after the tests in Vitest 5, so the list is read too early.|||Trong Vitest 5, beforeAll chạy sau các test, nên danh sách bị đọc quá sớm.',
          'The in-memory repository loses bookings when it is reused.|||Repository trong bộ nhớ làm mất lượt đặt khi được dùng lại.',
          'All four tests now share ONE repository: two earlier tests added bookings, so the count depends on which tests ran before — the shared state of lesson 8.3 brought back by a speed-up.|||Cả bốn test giờ dùng chung MỘT repository: hai test chạy trước đã thêm lượt đặt, nên con số phụ thuộc test nào đã chạy trước — trạng thái dùng chung của bài 8.3 quay lại vì một lần tăng tốc.',
          'beforeAll cannot await async functions, so two bookings were inserted twice.|||beforeAll không await được hàm async, nên hai lượt đặt bị chèn hai lần.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: “another lab is still free” and “the evening is still free” each store a booking, so the shared list grows to 102. Even in file order it is red, and in another order a different test could break. Share setup only when every test just reads it; otherwise give each test the small data it needs. Tempting wrong answer — “beforeAll does not await”: it does; the 100 bookings were there, plus the two the other tests added.|||VI: “another lab is still free” và “the evening is still free” mỗi test lưu một lượt đặt, nên danh sách dùng chung tăng lên 102. Ngay cả theo thứ tự trong file nó đã đỏ, và ở thứ tự khác có thể là một test khác hỏng. Chỉ dùng chung phần dựng sẵn khi mọi test chỉ đọc nó; nếu không, cho mỗi test đúng phần dữ liệu nhỏ nó cần. Đáp án sai hấp dẫn — “beforeAll không await”: nó có await; 100 lượt đặt vẫn ở đó, cộng hai lượt mà các test khác thêm vào.",
      },
    ],
  },
};
