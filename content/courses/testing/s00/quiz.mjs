/**
 * Testing · Mục 0 · Quiz Mục 0 (10 câu tình huống). BÀI MỚI 31/10/2026, slug tst-0-4-quiz.
 * Đáp án rải: A ×3 (câu 2, 5, 10) · B ×2 (4, 7) · C ×3 (1, 6, 9) · D ×2 (3, 8).
 */
export default {
  title: 'Section 0 check — 10 scenario questions|||Kiểm tra Mục 0 — 10 câu tình huống',
  slug: 'tst-0-4-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Mục 0: test là gì, error/defect/failure, kim tự tháp, sự cố thật, chạy Vitest — mỗi câu có giải thích vì sao đúng và vì sao phương án hấp dẫn nhất lại sai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Section 0 check</h2>
<p class="lead">Ten scenario questions. Each answer comes with an explanation — read it even when you were right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain a test as “known input → compare actual with expected → pass/fail”.</li>
<li>I can tell error, defect and failure apart with a LabFlow example.</li>
<li>I can say where a check belongs: unit, integration/API or end-to-end — and why.</li>
<li>I can name the missing test in at least two of the five real incidents.</li>
<li>I can create a Vitest project, run it, filter it and read a red result.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0</h2>
<p class="lead">Mười câu tình huống. Câu nào cũng có giải thích — đọc kể cả khi bạn trả lời đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được test là "đầu vào đã biết → so thực tế với mong đợi → đạt/không đạt".</li>
<li>Tôi phân biệt được error, defect, failure bằng một ví dụ LabFlow.</li>
<li>Tôi nói được một phép kiểm nên nằm ở cấp nào: unit, tích hợp/API hay đầu-cuối — và vì sao.</li>
<li>Tôi gọi tên được cái test còn thiếu trong ít nhất hai trong năm sự cố thật.</li>
<li>Tôi tạo được dự án Vitest, chạy, lọc và đọc được một kết quả đỏ.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A teammate says: "All 40 tests of the booking module are green, so it has no bugs." What is the best reply?|||Một bạn cùng nhóm nói: "40 test của module đặt phòng xanh hết, vậy là nó không còn lỗi." Câu đáp tốt nhất là gì?',
        options: [
          'Right — 40 green tests prove the module is correct.|||Đúng — 40 test xanh chứng minh module đúng.',
          'Only if line coverage is also 100%.|||Chỉ đúng khi độ phủ dòng cũng đạt 100%.',
          'Green tests only show that the checked cases pass; testing shows the presence of defects, never their absence.|||Test xanh chỉ cho thấy các trường hợp đã kiểm thì đạt; kiểm thử cho thấy lỗi có tồn tại, không chứng minh được là hết lỗi.',
          'Only if the tests were written before the code (TDD).|||Chỉ đúng khi test được viết trước code (TDD).',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Tests check only what they were written to check — the broken parseTime still passed the 07:00 test. “100% coverage” is tempting but wrong: coverage counts executed lines, not checked behaviour (Chapter 8 shows a bug surviving 100% coverage).|||VI: Test chỉ kiểm đúng những gì nó được viết để kiểm — bản parseTime hỏng vẫn qua test 07:00. "Độ phủ 100%" nghe hấp dẫn nhưng sai: độ phủ đếm dòng đã chạy, không đếm hành vi đã được kiểm (Chương 8 cho thấy một lỗi sống sót qua độ phủ 100%).',
      },
      {
        question: 'A developer reads BR-05 "at most 14 days ahead" and writes daysAhead < 14. A student books exactly 14 days ahead and sees "not allowed". In this story, what is the FAILURE?|||Lập trình viên đọc BR-05 "đặt trước tối đa 14 ngày" và viết daysAhead < 14. Một sinh viên đặt đúng 14 ngày và thấy "không được phép". Trong câu chuyện này, đâu là FAILURE?',
        options: [
          'The student seeing "not allowed" for a valid booking.|||Việc sinh viên thấy "không được phép" với một lượt đặt hợp lệ.',
          'The line daysAhead < 14 in the code.|||Dòng daysAhead < 14 trong code.',
          'The developer misunderstanding "at most".|||Việc lập trình viên hiểu sai chữ "tối đa".',
          'The missing test for 14 days.|||Việc thiếu test cho 14 ngày.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Failure = wrong behaviour when the software runs. The misunderstanding is the error, the < line is the defect. The missing test is a gap in testing, not part of the chain.|||VI: Failure = hành vi sai khi phần mềm chạy. Hiểu sai là error, dòng < là defect. Thiếu test là lỗ hổng trong kiểm thử, không nằm trong chuỗi error → defect → failure.',
      },
      {
        question: 'LabFlow Lite must never store two bookings for BE-201 that overlap in time, and the rule is enforced by a PostgreSQL constraint. Which test proves it best?|||LabFlow Lite không bao giờ được lưu hai lượt đặt BE-201 trùng giờ nhau, và luật được cưỡng chế bằng một ràng buộc PostgreSQL. Test nào chứng minh tốt nhất?',
        options: [
          'A unit test of checkSlot with two time ranges.|||Một unit test cho checkSlot với hai khoảng giờ.',
          'An end-to-end test that books twice in the browser.|||Một test đầu-cuối đặt hai lần trên trình duyệt.',
          'A unit test with the database replaced by an array in memory.|||Một unit test thay cơ sở dữ liệu bằng một mảng trong bộ nhớ.',
          'An integration test that inserts two overlapping bookings into a real PostgreSQL and expects the second to be rejected.|||Một test tích hợp chèn hai lượt đặt trùng giờ vào PostgreSQL thật và mong đợi lượt thứ hai bị từ chối.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The rule lives in the database, so only a real database can prove it — an array in memory proves the array, not the constraint. An E2E test would also hit it, but slowly and with a vague failure; rule of thumb: a join goes to an integration test.|||VI: Luật nằm trong cơ sở dữ liệu nên chỉ database thật mới chứng minh được — mảng trong bộ nhớ chỉ chứng minh cái mảng, không phải ràng buộc. Test đầu-cuối cũng chạm tới, nhưng chậm và báo lỗi mơ hồ; kinh nghiệm: chỗ nối thì test tích hợp.',
      },
      {
        question: 'Lesson 0.2 measured 200 unit checks in 3 ms and 200 HTTP checks through Express in 149–207 ms. What is the right conclusion?|||Bài 0.2 đo được 200 lần kiểm unit mất 3 ms và 200 lần kiểm HTTP qua Express mất 149–207 ms. Kết luận đúng là gì?',
        options: [
          'HTTP tests are useless; write only unit tests.|||Test HTTP vô dụng; chỉ nên viết unit test.',
          'Each check belongs at the lowest level that can catch it; keep HTTP tests for what only HTTP can show.|||Mỗi phép kiểm nên ở cấp thấp nhất còn bắt được nó; giữ test HTTP cho những gì chỉ HTTP mới cho thấy.',
          'The measurement is meaningless because timings vary between laptops.|||Phép đo vô nghĩa vì thời gian khác nhau giữa các máy.',
          'Unit tests are faster, so they give more confidence than API tests.|||Unit test nhanh hơn nên cho nhiều niềm tin hơn test API.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Absolute timings vary, the 50–70× ratio does not. Speed is not confidence: API tests prove the parts fit (JSON, routes, status codes), which unit tests cannot. Hence the pyramid — proportion, not elimination.|||VI: Thời gian tuyệt đối thì thay đổi, tỉ lệ 50–70 lần thì không. Nhanh không có nghĩa là đáng tin hơn: test API chứng minh các mảnh khớp nhau (JSON, route, mã trạng thái), điều unit test không làm được. Vì vậy mới có kim tự tháp — tỉ lệ, không phải loại bỏ.',
      },
      {
        question: 'A team’s suite is 80% browser tests, takes 40 minutes, and fails "randomly"; people re-run until green. What is this called, and what is the fix?|||Bộ test của một đội có 80% là test trình duyệt, chạy 40 phút và hỏng "ngẫu nhiên"; mọi người chạy lại tới khi xanh. Hiện tượng này gọi là gì, sửa thế nào?',
        options: [
          'The ice-cream cone; move each check down to the lowest level that can catch it.|||Cây kem ốc quế; chuyển từng phép kiểm xuống cấp thấp nhất còn bắt được nó.',
          'The testing trophy; it is fine as long as integration tests are the biggest part.|||Chiếc cúp; không sao miễn tầng tích hợp là lớn nhất.',
          'A healthy pyramid; just buy faster CI machines.|||Một kim tự tháp khoẻ mạnh; chỉ cần mua máy CI nhanh hơn.',
          'Normal flakiness; add automatic retries to every test.|||Chập chờn bình thường; thêm tự động chạy lại cho mọi test.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Mostly UI tests on top of few unit tests is the ice-cream cone. Retries hide the problem and the trophy also wants few E2E tests — the cure is pushing checks down.|||VI: Phần lớn là test giao diện trên một ít unit test chính là "cây kem". Chạy lại tự động chỉ che vấn đề, còn chiếc cúp cũng muốn ít test đầu-cuối — cách chữa là đẩy phép kiểm xuống thấp.',
      },
      {
        question: 'In the CrowdStrike 2024 root-cause report, why did tests not catch the 21-vs-20 field mismatch?|||Theo báo cáo nguyên nhân gốc của CrowdStrike 2024, vì sao test không bắt được chuyện 21 trường so với 20 trường?',
        options: [
          'There were no tests at all for the sensor.|||Phần mềm cảm biến không hề có test nào.',
          'The tests ran on Linux, not Windows.|||Test chạy trên Linux chứ không phải Windows.',
          'Field 21 was only ever matched with a wildcard during testing, so its value was never actually read.|||Trong lúc test, trường 21 luôn được so bằng wildcard, nên giá trị của nó chưa bao giờ thật sự được đọc.',
          'The update was too large for the test servers.|||Bản cập nhật quá lớn so với máy test.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The report says the mismatch evaded several layers of validation and testing, partly because of wildcard matching on the 21st input. Tests existed — they just never exercised the risky value. Lesson: vary every input.|||VI: Báo cáo nói sự lệch nhau lọt qua nhiều lớp kiểm tra và kiểm thử, một phần vì trường thứ 21 được so bằng wildcard. Test có tồn tại — chỉ là chưa bao giờ chạy giá trị nguy hiểm. Bài học: thay đổi mọi đầu vào.',
      },
      {
        question: 'Your package.json has "test": "vitest run". How does a CI server know your tests failed?|||package.json của bạn có "test": "vitest run". Máy chủ CI biết test hỏng bằng cách nào?',
        options: [
          'It searches the output for the word FAIL.|||Nó tìm chữ FAIL trong output.',
          'vitest run exits with a non-zero exit code (1) when any test fails.|||vitest run thoát với mã khác 0 (là 1) khi có test hỏng.',
          'It reads the red colour of the output.|||Nó đọc màu đỏ của output.',
          'It counts the ✓ symbols.|||Nó đếm số dấu ✓.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Every tool in CI communicates through exit codes: 0 = success, non-zero = failure. Colours disappear when output is not a terminal, and text formats change between versions.|||VI: Mọi công cụ trong CI giao tiếp bằng mã thoát: 0 = thành công, khác 0 = thất bại. Màu sắc biến mất khi output không phải terminal, còn định dạng chữ thay đổi giữa các phiên bản.',
      },
      {
        question: 'You run node src/rules/time.test.js and get "TypeError: Cannot read properties of undefined (reading \'config\')" from inside node_modules/vitest. What is wrong?|||Bạn chạy node src/rules/time.test.js và nhận "TypeError: Cannot read properties of undefined (reading \'config\')" từ bên trong node_modules/vitest. Sai ở đâu?',
        options: [
          'vitest.config.js is missing.|||Thiếu file vitest.config.js.',
          'Node is older than 22.12.|||Node cũ hơn 22.12.',
          'The import path ./time.js is wrong.|||Đường dẫn import ./time.js bị sai.',
          'A Vitest test file must be run by the Vitest runner (npm test / npx vitest run), not by plain node.|||File test Vitest phải chạy qua bộ chạy Vitest (npm test / npx vitest run), không chạy bằng node trơn.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: describe/it need the runner to prepare them; called directly, Vitest’s internals are undefined. Vitest works without a config file, so “missing config” is the tempting but wrong answer.|||VI: describe/it cần bộ chạy chuẩn bị trước; gọi thẳng thì phần bên trong Vitest là undefined. Vitest chạy được không cần file cấu hình, nên "thiếu config" là đáp án hấp dẫn nhưng sai.',
      },
      {
        question: 'You type npx vitest inside an AI coding agent’s terminal. It runs the tests once and exits instead of watching. Why?|||Bạn gõ npx vitest trong terminal của một agent lập trình AI. Nó chạy test một lượt rồi thoát, không vào chế độ watch. Vì sao?',
        options: [
          'Watch mode was removed in Vitest 5.|||Chế độ watch đã bị bỏ ở Vitest 5.',
          'vitest.config.js must contain watch: true.|||vitest.config.js phải có watch: true.',
          'Vitest detects CI or an AI agent (or a non-interactive terminal) and deliberately runs once.|||Vitest phát hiện CI hoặc agent AI (hoặc terminal không tương tác) và cố ý chạy một lượt.',
          'Watch mode only works with TypeScript files.|||Chế độ watch chỉ chạy với file TypeScript.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Vitest 5’s default is watch: !isCI && stdin.isTTY && !isAgent. In your own interactive terminal, npm run test:watch watches as expected.|||VI: Mặc định của Vitest 5 là watch: !isCI && stdin.isTTY && !isAgent. Trong terminal tương tác của chính bạn, npm run test:watch vẫn theo dõi bình thường.',
      },
      {
        question: 'A classmate on Node 20 cannot get Vitest 5 to work. What should they do first?|||Một bạn cùng lớp dùng Node 20 không chạy được Vitest 5. Việc đầu tiên nên làm là gì?',
        options: [
          'Upgrade Node to 22.12 or newer (Vitest 5 requires ^22.12, ^24 or ≥ 26), then open a new terminal.|||Nâng Node lên 22.12 trở lên (Vitest 5 cần ^22.12, ^24 hoặc ≥ 26), rồi mở terminal mới.',
          'Delete package-lock.json and reinstall.|||Xoá package-lock.json rồi cài lại.',
          'Switch to Jest, which supports every Node version.|||Chuyển sang Jest vì Jest chạy với mọi phiên bản Node.',
          'Add "type": "commonjs" to package.json.|||Thêm "type": "commonjs" vào package.json.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Vitest 5’s engines field excludes Node 20. Reinstalling does not change the Node version, and switching runners dodges the problem instead of fixing it.|||VI: Trường engines của Vitest 5 không chấp nhận Node 20. Cài lại gói không đổi được phiên bản Node, còn đổi bộ chạy test là né chứ không sửa vấn đề.',
      },
    ],
  },
};
