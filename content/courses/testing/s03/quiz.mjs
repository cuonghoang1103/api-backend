/**
 * Testing · Chương 3 · Quiz Chương 3 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-3-6-quiz.
 * Đáp án rải: A ×2 (câu 3, 8) · B ×3 (1, 5, 10) · C ×3 (2, 6, 9) · D ×2 (4, 7).
 */
export default {
  title: 'Chapter 3 check — 10 scenario questions|||Kiểm tra Chương 3 — 10 câu tình huống',
  slug: 'tst-3-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 3: gọi đúng tên đồ đóng thế, kiểm trạng thái hay tương tác, lỗi hoisting của vi.mock, test HTTP bằng MSW, tuỳ chọn MSW 3 đổi tên, test mock nặng vẫn xanh khi có bug, test quá chi tiết, phụ thuộc ẩn, lõi thuần, đừng mock thứ không phải của mình.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Chapter 3 check</h2>
<p class="lead">Ten scenarios about test doubles in LabFlow Lite. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name dummy, stub, spy, mock and fake and pick one for a job.</li>
<li>I prefer asserting state and know when an interaction is the behaviour.</li>
<li>I can use vi.mock with vi.hoisted, and MSW with unhandled requests failing.</li>
<li>I can tell a worthless mock-heavy test from a useful one by planting a bug.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3</h2>
<p class="lead">Mười tình huống về đồ đóng thế trong LabFlow Lite. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi đúng tên dummy, stub, spy, mock, fake và chọn được loại cho từng việc.</li>
<li>Tôi ưu tiên kiểm trạng thái và biết khi nào chính tương tác là hành vi.</li>
<li>Tôi dùng được vi.mock với vi.hoisted, và MSW với request lạ bị đánh hỏng.</li>
<li>Tôi phân biệt được test mock nặng vô giá trị với test có ích bằng cách cài một bug.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "A test passes mailer = { send: async () => { throw new Error('SMTP down'); } } so that bookAndNotify reaches its catch branch. What kind of test double is this?|||Một test truyền mailer = { send: async () => { throw new Error('SMTP down'); } } để bookAndNotify đi vào nhánh catch. Đây là loại đồ đóng thế nào?",
        options: ['Dummy|||Dummy', 'Stub|||Stub', 'Spy|||Spy', 'Fake|||Fake'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A stub gives a canned answer — here a canned failure — to control what comes into the code. It records nothing (not a spy) and is not a working implementation (not a fake). A dummy is never used at all, but this one is called.|||VI: Stub đưa ra câu trả lời soạn sẵn — ở đây là một lỗi soạn sẵn — để điều khiển thứ đi vào code. Nó không ghi lại gì (không phải spy) và không phải bản cài đặt chạy thật (không phải fake). Dummy thì không bao giờ được dùng, còn cái này có được gọi.',
      },
      {
        question: 'Which assertion is state verification?|||Khẳng định nào là kiểm trạng thái?',
        options: [
          "expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: '…' })|||expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn', subject: '…' })",
          'expect(log.warn).toHaveBeenCalledTimes(1)|||expect(log.warn).toHaveBeenCalledTimes(1)',
          "expect(mailer.outbox).toEqual([{ to: APPROVER, subject: '…' }])|||expect(mailer.outbox).toEqual([{ to: APPROVER, subject: '…' }])",
          'expect(bookLab).toHaveBeenCalled()|||expect(bookLab).toHaveBeenCalled()',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Reading the fake’s outbox looks at the result, not at the calls that produced it. The other three check calls (interaction verification). State checks survive refactoring because they do not care how the result was reached.|||VI: Đọc hộp thư của fake là nhìn kết quả, không nhìn các lời gọi tạo ra nó. Ba đáp án còn lại kiểm lời gọi (kiểm tương tác). Kiểm trạng thái sống qua refactor vì không quan tâm kết quả đến bằng đường nào.',
      },
      {
        question: "A test file has const send = vi.fn(); and then vi.mock('../src/lib/mailer.js', () => ({ createHttpMailer: () => ({ send }) })). It fails with \"ReferenceError: Cannot access 'send' before initialization\". What is the fix?|||Một file test có const send = vi.fn(); rồi vi.mock('../src/lib/mailer.js', () => ({ createHttpMailer: () => ({ send }) })). Nó hỏng với \"ReferenceError: Cannot access 'send' before initialization\". Sửa thế nào?",
        options: [
          'Create send with vi.hoisted: const { send } = vi.hoisted(() => ({ send: vi.fn() }));|||Tạo send bằng vi.hoisted: const { send } = vi.hoisted(() => ({ send: vi.fn() }));',
          'Move the vi.mock call to the bottom of the file.|||Dời lời gọi vi.mock xuống cuối file.',
          'Change const to let.|||Đổi const thành let.',
          'Raise testTimeout.|||Tăng testTimeout.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: vi.mock is hoisted above the imports, so its factory runs before line one of your code; vi.hoisted is hoisted too, so the value exists in time. Moving vi.mock does nothing — Vitest hoists it wherever it is. let has the same temporal dead zone as const.|||VI: vi.mock bị dời lên trên các import, nên factory chạy trước cả dòng đầu code của bạn; vi.hoisted cũng được dời lên, nên giá trị có kịp. Dời vi.mock chẳng có tác dụng — Vitest vẫn dời nó lên dù đặt ở đâu. let cũng có vùng chết tạm thời như const.',
      },
      {
        question: 'You want to test createHttpMailer, our adapter around an e-mail provider’s HTTP API. Which approach tests the most of our own code without calling the provider?|||Bạn muốn test createHttpMailer, adapter của ta quanh API HTTP của nhà cung cấp email. Cách nào test được nhiều code của ta nhất mà không gọi nhà cung cấp?',
        options: [
          'vi.mock the mailer module and assert that send was called.|||vi.mock module mailer rồi khẳng định send đã được gọi.',
          'Replace globalThis.fetch with a function that returns { ok: true }.|||Thay globalThis.fetch bằng một hàm trả về { ok: true }.',
          'Call the real provider with a test API key.|||Gọi nhà cung cấp thật với một khoá API thử.',
          'An MSW handler for the provider URL, real fetch, and unhandled requests set to fail.|||Một handler MSW cho URL của nhà cung cấp, fetch thật, và request lạ bị đánh hỏng.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: MSW intercepts after fetch, so URL building, headers, JSON and status handling all run. Mocking the module (A) tests nothing of it; a hand-made fetch (B) skips the request entirely and invents a response shape; the real provider (C) is slow, costs money and is not repeatable.|||VI: MSW chặn sau fetch, nên phần ghép URL, header, JSON và xử lý mã trạng thái đều chạy. Mock cả module (A) thì chẳng test gì của nó; fetch tự chế (B) bỏ qua hẳn request và tự bịa hình dạng câu trả lời; nhà cung cấp thật (C) chậm, tốn tiền và không lặp lại được.',
      },
      {
        question: "With MSW 3 installed, a test used server.listen({ onUnhandledRequest: 'error' }) and a URL with a typo. What did the run in lesson 3.2 show?|||Đã cài MSW 3, một test dùng server.listen({ onUnhandledRequest: 'error' }) và một URL gõ nhầm. Lần chạy ở bài 3.2 cho thấy gì?",
        options: [
          'The test failed at once with “request without a matching handler” as an error.|||Test hỏng ngay với lỗi “request without a matching handler”.',
          'The option was ignored: MSW only warned and the request went out to a real DNS lookup (ENOTFOUND).|||Tuỳ chọn bị bỏ qua: MSW chỉ cảnh báo và request đi ra ngoài tra DNS thật (ENOTFOUND).',
          'Vitest refused to start because of an unknown option.|||Vitest từ chối chạy vì tuỳ chọn lạ.',
          'MSW answered 404 automatically.|||MSW tự trả 404.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: onUnhandledRequest is the MSW 2 name; MSW 3 uses onUnhandledFrame and silently ignores the old key. The default is to warn and let the request pass, so it reached the network. With onUnhandledFrame the run ended with “Cannot bypass a request when using the error strategy”.|||VI: onUnhandledRequest là tên của MSW 2; MSW 3 dùng onUnhandledFrame và lặng lẽ bỏ qua khoá cũ. Mặc định là cảnh báo rồi cho request đi tiếp, nên nó chạm ra mạng. Với onUnhandledFrame, lần chạy kết thúc bằng “Cannot bypass a request when using the error strategy”.',
      },
      {
        question: 'A bug makes every booking CONFIRMED. A test that vi.mocks bookLab to return CONFIRMED stays green. What does this tell you?|||Một bug làm mọi lượt đặt đều CONFIRMED. Một test vi.mock bookLab để trả CONFIRMED vẫn xanh. Điều này cho bạn biết gì?',
        options: [
          'Vitest did not pick up the change; clear the cache.|||Vitest chưa nhận thay đổi; hãy xoá cache.',
          'The bug is harmless because the test is green.|||Bug vô hại vì test vẫn xanh.',
          'The test replaced the code it claims to test, so the rule never ran — it only re-checks its own mock.|||Test đã thay chính code mà nó tự nhận là đang test, nên luật không hề chạy — nó chỉ kiểm lại mock của chính nó.',
          'It needs more toHaveBeenCalledWith assertions.|||Nó cần thêm khẳng định toHaveBeenCalledWith.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The mock returned the answer the test then checked, so no business logic was exercised. More interaction assertions (D) still would not run the rule. The fake-based version — real bookLab, memory repo, fake mailer — failed with “expected PENDING, received CONFIRMED”.|||VI: Mock trả về đúng câu trả lời mà test sau đó kiểm, nên chẳng có logic nghiệp vụ nào được chạy. Thêm khẳng định tương tác (D) cũng không làm luật chạy. Bản dùng fake — bookLab thật, repo bộ nhớ, mailer giả — đã hỏng với “expected PENDING, received CONFIRMED”.',
      },
      {
        question: 'A test asserts repo.insert toHaveBeenCalledWith an exact object. Storing one extra column (no visible change) turns it red. Best fix?|||Một test khẳng định repo.insert toHaveBeenCalledWith một object chính xác. Lưu thêm một cột (không đổi gì nhìn thấy được) làm nó đỏ. Cách sửa tốt nhất?',
        options: [
          'Update the expected object every time a column is added.|||Cập nhật object mong đợi mỗi lần thêm cột.',
          'Delete the test.|||Xoá test.',
          'Use toHaveBeenCalled() without arguments.|||Dùng toHaveBeenCalled() không tham số.',
          'Use the memory repository and assert the outcome: the stored booking and its fields that matter.|||Dùng repository bộ nhớ và khẳng định kết quả: lượt đặt đã lưu và các trường thật sự quan trọng.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Assert what the requirement cares about through the public behaviour. Updating the test forever (A) keeps it brittle; toHaveBeenCalled() (C) would no longer catch a wrong status or length; deleting it (B) loses coverage of the rule.|||VI: Khẳng định thứ yêu cầu quan tâm, qua hành vi công khai. Sửa test mãi (A) thì nó vẫn giòn; toHaveBeenCalled() (C) sẽ không bắt được trạng thái hay độ dài sai nữa; xoá test (B) là mất phần kiểm luật.',
      },
      {
        question: 'bookHard(input) imports a database pool and a mail client and calls new Date() inside. Why is it hard to test?|||bookHard(input) import một pool cơ sở dữ liệu và một client gửi thư, và gọi new Date() bên trong. Vì sao nó khó test?',
        options: [
          'Its dependencies are hidden: none is a parameter, so a test can only patch modules and freeze time.|||Phụ thuộc của nó bị ẩn: không cái nào là tham số, nên test chỉ có thể vá module và đóng băng thời gian.',
          'Because it is an async function.|||Vì nó là hàm async.',
          'Because it uses SQL.|||Vì nó dùng SQL.',
          'Because it throws Error instead of BookingError.|||Vì nó ném Error thay vì BookingError.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured: without doubles it failed with ECONNREFUSED; with doubles it needed two vi.mock calls, a frozen clock and query results in a fixed order (21 lines). bookAndNotify is just as async but receives its dependencies — 11 lines, no tricks.|||VI: Đo được: không có đồ đóng thế thì hỏng với ECONNREFUSED; có thì cần hai lời gọi vi.mock, một đồng hồ đóng băng và kết quả truy vấn theo thứ tự cố định (21 dòng). bookAndNotify cũng async y vậy nhưng nhận phụ thuộc qua tham số — 11 dòng, không mẹo gì.',
      },
      {
        question: 'In “functional core, imperative shell”, which LabFlow Lite function belongs to the core?|||Trong “functional core, imperative shell”, hàm nào của LabFlow Lite thuộc phần lõi?',
        options: ['bookAndNotify|||bookAndNotify', 'createHttpMailer|||createHttpMailer', 'buildMail|||buildMail', 'createMemoryRepo|||createMemoryRepo'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: buildMail is pure — same booking in, same e-mail out, no I/O — so it is tested with a plain table and no doubles. bookAndNotify is the shell that does I/O; createHttpMailer and createMemoryRepo are adapters.|||VI: buildMail là hàm thuần — cùng lượt đặt vào, cùng thư ra, không vào/ra — nên test bằng bảng đơn giản, không cần đồ đóng thế. bookAndNotify là lớp vỏ làm vào/ra; createHttpMailer và createMemoryRepo là adapter.',
      },
      {
        question: '“Don’t mock what you don’t own.” Which setup follows the rule?|||“Đừng mock thứ không phải của mình.” Cách dựng nào theo đúng quy tắc?',
        options: [
          "vi.mock('msw') so that no requests are made.|||vi.mock('msw') để không có request nào.",
          'Wrap the provider in createHttpMailer, test it with MSW, and give the rest of the code createFakeMailer.|||Bọc nhà cung cấp trong createHttpMailer, test nó bằng MSW, và cho phần còn lại của code createFakeMailer.',
          'Mock the e-mail library’s transport object in every service test.|||Mock object transport của thư viện email trong mọi test service.',
          'Call the real provider in CI only.|||Chỉ gọi nhà cung cấp thật trên CI.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: You own the adapter and its small interface, so you fake that; the adapter itself is checked against the real HTTP contract. Mocking a library’s internals (C) encodes guesses that break silently when it changes; the real provider in CI (D) is slow and flaky.|||VI: Bạn sở hữu adapter và interface nhỏ của nó, nên bạn làm giả cái đó; còn chính adapter được kiểm theo hợp đồng HTTP thật. Mock ruột thư viện (C) là ghi lại phỏng đoán, vỡ âm thầm khi thư viện đổi; gọi nhà cung cấp thật trên CI (D) thì chậm và chập chờn.',
      },
    ],
  },
};
