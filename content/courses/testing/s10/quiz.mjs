/**
 * Testing · Chương 10 · Quiz Chương 10 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-10-6-quiz.
 * Đáp án rải: A ×3 (câu 2, 6, 9) · B ×3 (4, 7, 10) · C ×2 (1, 5) · D ×2 (3, 8).
 * Mọi con số lấy từ output chạy thật của Chương 10 (s10/_ma.mjs): 101-b1-do, 101-b2-do, 101-v1-sau, 101-splice, 102-cov-3, 102-mut-3/4,
 * 102-truot, 102-tz-v0/102-tz-moi, 103-snap-u/103-snap-diff, 103-retry-khong/103-retry-co/103-retry-thay.
 */
export default {
  title: 'Chapter 10 check — 10 scenario questions|||Kiểm tra Chương 10 — 10 câu tình huống',
  slug: 'tst-10-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 10: đỏ đúng lý do ở bước đầu TDD, fake it và triangulate, test mockist đỏ sau một lần refactor vô hại mà xanh khi repo thật hỏng, 96,42% dòng mà chỉ bắt 3/10 thay đổi, ghim hay sửa một bug cũ, toFixed làm đỏ golden master, golden master đỏ theo múi giờ, snapshot -u nuốt một bug, và retry che một test đỏ 10/30 lần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Chapter 10 check</h2>
<p class="lead">Ten scenarios from a real team’s week — building a rule test-first, pinning and refactoring legacy code, reviewing tests in a pull request. Each is based on something measured on LabFlow Lite in this chapter. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can drive a rule with red → green → refactor and say why each red must fail for the right reason.</li>
<li>I can choose between classicist and mockist tests and say what each one misses.</li>
<li>I can pin untested code with characterization tests, add seams, and refactor without changing its output.</li>
<li>I can review tests in a pull request: mocks, snapshots, names, randomness, retries.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm tra Chương 10</h2>
<p class="lead">Mười tình huống từ một tuần làm việc của nhóm thật — xây luật theo kiểu test trước, ghim và refactor code cũ, review test trong pull request. Câu nào cũng dựa trên một điều đã đo trên LabFlow Lite trong chương. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dẫn dắt được một luật bằng đỏ → xanh → refactor và nói được vì sao mỗi lần đỏ phải đỏ đúng lý do.</li>
<li>Tôi chọn được giữa test kiểu classicist và mockist và nói được mỗi kiểu bỏ lọt gì.</li>
<li>Tôi ghim được code chưa có test bằng test đặc tả, thêm seam, và refactor mà không đổi output.</li>
<li>Tôi review được test trong pull request: mock, snapshot, tên test, ngẫu nhiên, retry.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "TDD, step 1. The test 'puts the first student at position 1' imports joinWaitlist from a file that only contains `export function joinWaitlist(queue, request) {}`. Vitest says: AssertionError: expected undefined to deeply equal { ok: true, position: 1, …(1) }. A teammate says: 'Why bother running it? Without the code it is obviously red.' What is the run for?|||TDD, bước 1. Test 'puts the first student at position 1' import joinWaitlist từ một file chỉ có `export function joinWaitlist(queue, request) {}`. Vitest báo: AssertionError: expected undefined to deeply equal { ok: true, position: 1, …(1) }. Một bạn nói: 'Chạy làm gì? Chưa có code thì hiển nhiên đỏ.' Lần chạy đó để làm gì?",
        options: [
          'Nothing — an import error would have been just as good a red.|||Không để làm gì — một lỗi import cũng là một lần đỏ tốt y như vậy.',
          'To measure how long the test takes before the code exists.|||Để đo test mất bao lâu khi chưa có code.',
          'To prove the test can fail, and fails for the reason it was written for (the assertion), before any code makes it pass.|||Để chứng minh test có thể đỏ, và đỏ đúng vì lý do nó được viết ra (phép khẳng định), trước khi có code làm nó xanh.',
          'To create the snapshot file that the green step will compare against.|||Để tạo file snapshot cho bước xanh so sánh.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: A test you never saw red may be unable to fail (no assertion, wrong import, a typo that skips it). The stub makes the failure land on the assertion — 'expected undefined to deeply equal …' — so you know the test checks what its name says. Tempting wrong answer — 'an import error is just as good': it proves only that the file is missing, not that the assertion works; the test could still be green for any code once the file exists.|||VI: Một test chưa từng thấy đỏ có thể không bao giờ đỏ được (thiếu khẳng định, import sai, gõ nhầm khiến nó bị bỏ qua). File rỗng làm lỗi rơi đúng vào phép khẳng định — 'expected undefined to deeply equal …' — nên bạn biết test kiểm đúng điều tên nó nói. Đáp án sai hấp dẫn — 'lỗi import cũng tốt như vậy': nó chỉ chứng minh file chưa có, không chứng minh phép khẳng định hoạt động; khi file đã có, test vẫn có thể xanh với bất kỳ code nào.",
      },
      {
        question: "Step 1 went green with `return { ok: true, position: 1, queue: [{ userId }] };` — position is hard-coded to 1. In review, someone calls this cheating. What happened next in lesson 10.1, and why is it fine?|||Bước 1 xanh với `return { ok: true, position: 1, queue: [{ userId }] };` — vị trí bị viết cứng là 1. Khi review, có người gọi đó là ăn gian. Điều gì xảy ra tiếp theo ở bài 10.1, và vì sao nó ổn?",
        options: [
          "It is 'fake it': the next test (a second student at position 2) went red — 1 failed | 1 passed — and forced the general code; the constant never reached a commit as the final answer.|||Đó là 'fake it': test kế tiếp (sinh viên thứ hai ở vị trí 2) đỏ — 1 failed | 1 passed — và buộc phải viết code tổng quát; hằng số đó không bao giờ là đáp án cuối cùng.",
          'It is cheating; TDD requires writing the complete implementation as soon as the first test is red.|||Đó là ăn gian; TDD đòi viết trọn bản cài đặt ngay khi test đầu tiên đỏ.',
          'It is fine only because Stryker later reached 100%; without Stryker it would be wrong.|||Nó chỉ ổn vì sau đó Stryker đạt 100%; không có Stryker thì là sai.',
          'It is fine because hard-coded values make tests faster.|||Nó ổn vì giá trị viết cứng làm test nhanh hơn.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Fake it (Kent Beck) gets to green in seconds; the next test triangulates — with two examples the constant fails (step 2: 1 failed | 1 passed) and the general code [...queue, { userId }] appears because a test demanded it. Tempting wrong answer — 'write the complete implementation at once': then no test forces each branch, and code arrives that nothing checks; small steps are how the waitlist ended with 45/45 mutants killed.|||VI: Fake it (Kent Beck) tới xanh trong vài giây; test kế tiếp làm phép tam giác — có hai ví dụ thì hằng số hỏng (bước 2: 1 failed | 1 passed) và code tổng quát [...queue, { userId }] xuất hiện vì có test đòi nó. Đáp án sai hấp dẫn — 'viết trọn bản cài đặt ngay': khi đó không test nào buộc từng nhánh, và có code không gì kiểm; bước nhỏ là cách danh sách chờ kết thúc với 45/45 đột biến bị diệt.",
      },
      {
        question: "cancelBooking first called repo.findById(id) and then repo.remove(id). It is refactored to one call, `const booking = await repo.remove(id)` (remove now returns the removed row). Result: the mockist test (vi.fn for repo, waitlists and mailer) is red with BookingError: NOT_FOUND; the classicist test (real memory repo, real Map, fake mailer) is 3/3 green. What does that tell you?|||cancelBooking ban đầu gọi repo.findById(id) rồi repo.remove(id). Nó được refactor còn một lời gọi, `const booking = await repo.remove(id)` (remove giờ trả về dòng đã xoá). Kết quả: test mockist (vi.fn cho repo, waitlists và mailer) đỏ với BookingError: NOT_FOUND; test classicist (repo bộ nhớ thật, Map thật, mailer giả) xanh 3/3. Điều đó nói gì?",
        options: [
          'The refactor introduced a bug; revert it.|||Lần refactor gây ra bug; hãy revert.',
          'The classicist test is too weak, because it did not notice the change.|||Test classicist quá yếu, vì nó không nhận ra thay đổi.',
          'Mocks are always wrong and must be removed from the project.|||Mock luôn sai và phải bị gỡ khỏi dự án.',
          'The mockist test was tied to the sequence of calls (findById, then remove returning undefined); the behaviour did not change, so it is the test that has to be rewritten.|||Test mockist bị gắn vào chuỗi lời gọi (findById, rồi remove trả undefined); hành vi không đổi, nên chính test phải được viết lại.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Same inputs, same result, same e-mail — the classicist test checks those and stays green. The mockist stub of remove returned undefined, so the new code saw 'no booking' and threw NOT_FOUND: the test broke because it described how the code talked to its collaborators. Tempting wrong answer — 'the refactor introduced a bug': nothing a user can see changed; reverting would keep two database round trips for no reason.|||VI: Cùng đầu vào, cùng kết quả, cùng email — test classicist kiểm những thứ đó và vẫn xanh. Stub remove của test mockist trả undefined, nên code mới thấy 'không có lượt đặt' và ném NOT_FOUND: test hỏng vì nó mô tả cách code nói chuyện với cộng sự. Đáp án sai hấp dẫn — 'refactor gây bug': không có gì người dùng thấy được bị đổi; revert chỉ giữ lại hai lượt gọi CSDL vô cớ.",
      },
      {
        question: "Someone rewrites the memory repo's remove as `return rows.splice(i, 1)` (an array, not a row). The rewritten mockist test stays green; the classicist test goes red 2 of 3: expected { cancelled: undefined, offeredTo: null } … { cancelled: 1, … }. Which statement is right?|||Một người viết lại remove của repo bộ nhớ thành `return rows.splice(i, 1)` (một mảng, không phải một dòng). Test mockist (bản đã viết lại) vẫn xanh; test classicist đỏ 2 trên 3: expected { cancelled: undefined, offeredTo: null } … { cancelled: 1, … }. Câu nào đúng?",
        options: [
          'The classicist test is flaky: the memory repo adds 5 ms of latency.|||Test classicist chập chờn: repo bộ nhớ thêm 5 ms độ trễ.',
          "The mock returned a hand-written row, so it could not see that the real repo broke its contract; only a test that uses the real collaborator catches it.|||Mock trả về một dòng viết tay, nên nó không thể thấy repo thật đã phá hợp đồng; chỉ test dùng cộng sự thật mới bắt được.",
          'Both tests are equally good; one red test out of two is the expected ratio.|||Hai test tốt như nhau; một test đỏ trên hai là tỉ lệ bình thường.',
          'The mockist test is right, because the bug is in the repo, not in cancelBooking.|||Test mockist đúng, vì bug nằm ở repo, không nằm ở cancelBooking.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: With splice returning [row], booking.id is undefined and the slot key is wrong, so nobody is offered the seat — a real user-visible bug. The mockist test never runs the repo; its stub keeps returning a perfect row. Tempting wrong answer — 'the bug is in the repo, so the mockist test is right': users do not care which file is wrong; that is why lesson 10.1 mocks only the boundary (the mailer) and uses real collaborators inside.|||VI: Khi splice trả [row], booking.id là undefined và khoá khung giờ sai, nên không ai được mời vào chỗ trống — một bug thật người dùng thấy được. Test mockist không bao giờ chạy repo; stub của nó vẫn trả một dòng hoàn hảo. Đáp án sai hấp dẫn — 'bug ở repo nên test mockist đúng': người dùng không quan tâm file nào sai; vì thế bài 10.1 chỉ mock ở biên (mailer) và dùng cộng sự thật ở bên trong.",
      },
      {
        question: "Your first characterization test of the legacy monthly report (three October bookings, link seams, the exact text pasted in) is green and covers 96.42% of the lines (branches 66.66%). Ten real changes are planted one at a time: it catches 3 of 10. What makes it strong enough to refactor under?|||Test đặc tả đầu tiên của báo cáo tháng cũ (ba lượt đặt tháng 10, link seam, dán nguyên văn bản) xanh và phủ 96,42% dòng (nhánh 66,66%). Cài lần lượt mười thay đổi thật: nó bắt được 3 trên 10. Điều gì làm nó đủ mạnh để refactor bên dưới?",
        options: [
          'Nothing more: above 95% lines is enough.|||Không cần gì thêm: trên 95% dòng là đủ.',
          'Snapshots instead of a string, with the same three bookings.|||Dùng snapshot thay cho chuỗi, với đúng ba lượt đặt đó.',
          'Inputs chosen to reach every branch — weekend, holiday, pending, cancelled, 30/31 seats, another lab, another month, an empty month — then the mutants as proof: 100% branches and 10/10.|||Chọn đầu vào chạm mọi nhánh — cuối tuần, ngày lễ, chờ duyệt, đã huỷ, 30/31 chỗ, phòng khác, tháng khác, tháng trống — rồi dùng đột biến làm bằng chứng: 100% nhánh và 10/10.',
          'Running the same test 100 times in a shuffled order.|||Chạy cùng test đó 100 lần theo thứ tự xáo trộn.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: A characterization test is only as strong as its inputs. Three ordinary weekday bookings never reach the large-booking count, the weekend and holiday checks, the (pending) mark or the empty month. The golden master over nine chosen rows reached 100% branches and caught 10/10. Tempting wrong answer — '95% lines is enough': the measured 96.42% lines caught 3 changes in 10; branch coverage (66.66%) pointed at the gap, mutants proved it.|||VI: Test đặc tả chỉ mạnh bằng đầu vào của nó. Ba lượt đặt ngày thường không bao giờ chạm tới phép đếm lượt lớn, phép kiểm cuối tuần và ngày lễ, dấu (pending) hay tháng trống. Golden master trên chín dòng chọn có chủ đích đạt 100% nhánh và bắt 10/10. Đáp án sai hấp dẫn — '95% dòng là đủ': 96,42% dòng đo được chỉ bắt 3 trên 10 thay đổi; độ phủ nhánh (66,66%) chỉ ra lỗ hổng, đột biến chứng minh nó.",
      },
      {
        question: "Pinning the club fee quote, you find that the weekend rate depends on the day the quote is MADE (new Date()), not on the event date — the date parameter is never read. You are in the middle of a refactor the finance office asked for 'without changing any number'. What do you do?|||Khi ghim hàm báo giá câu lạc bộ, bạn thấy giá cuối tuần phụ thuộc ngày LÀM báo giá (new Date()), không phụ thuộc ngày sự kiện — tham số date không bao giờ được đọc. Bạn đang giữa lần refactor mà phòng tài chính yêu cầu 'không đổi con số nào'. Bạn làm gì?",
        options: [
          'Pin it with a test that names the issue (LF-212), finish the refactor with it unchanged, and fix it later in its own pull request agreed with the finance office.|||Ghim nó bằng một test có tên nêu rõ issue (LF-212), làm xong refactor mà vẫn giữ nguyên nó, và sửa sau trong một pull request riêng có phòng tài chính đồng ý.',
          'Fix it in the refactor — it is obviously a bug and nobody wants wrong prices.|||Sửa luôn trong lần refactor — rõ ràng là bug và không ai muốn giá sai.',
          'Leave it out of the tests so the tests do not depend on a bug.|||Bỏ nó ra khỏi test để test không phụ thuộc vào một bug.',
          'Delete the date parameter, since it is unused.|||Xoá tham số date, vì nó không được dùng.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Characterization tests pin what the code does, not what it should do. Fixing during the refactor mixes a behaviour change into a change that promised none, and the tests can no longer tell a slip from a decision. Tempting wrong answer — 'fix it in the refactor': the office may have planned prices around it for years; the fix is right, but it belongs in its own change with the people who own the numbers.|||VI: Test đặc tả ghim điều code làm, không ghim điều code nên làm. Sửa trong lúc refactor là trộn một thay đổi hành vi vào một thay đổi đã hứa không đổi gì, và test không còn phân biệt được trượt tay với quyết định. Đáp án sai hấp dẫn — 'sửa luôn': phòng tài chính có thể đã tính giá quanh nó nhiều năm; sửa là đúng, nhưng phải trong một thay đổi riêng, cùng những người chịu trách nhiệm về con số.",
      },
      {
        question: "Refactoring the monthly report, a teammate writes the hours as `(minutes / 60).toFixed(1)` — 'cleaner than Math.round(x * 10) / 10'. The golden master goes red: - Hours: 7 / + Hours: 7.0, and the same for 9. What is the right reaction?|||Khi refactor báo cáo tháng, một bạn viết số giờ thành `(minutes / 60).toFixed(1)` — 'gọn hơn Math.round(x * 10) / 10'. Golden master đỏ: - Hours: 7 / + Hours: 7.0, và tương tự với 9. Phản ứng đúng là gì?",
        options: [
          "Update the approved file with -u: '7.0' is more consistent.|||Cập nhật file đã duyệt bằng -u: '7.0' nhất quán hơn.",
          "Keep v0's formatting: the office pastes this text into Excel, so the text is the behaviour; the red test caught a real change, which is its job.|||Giữ cách định dạng của v0: văn phòng khoa dán văn bản này vào Excel, nên văn bản chính là hành vi; test đỏ đã bắt một thay đổi thật, đó là việc của nó.",
          'Make the comparison ignore whitespace and decimals.|||Cho phép so sánh bỏ qua khoảng trắng và số thập phân.',
          'Delete the golden master; a refactor should not be blocked by formatting.|||Xoá golden master; refactor không nên bị chặn vì định dạng.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: The approved file was written by v0 and has not changed since; its job during a refactor is to go red at any difference, and '7' vs '7.0' is one the office's Excel import would see. Tempting wrong answer — '-u because 7.0 is nicer': that turns a characterization test into a rubber stamp; changing the format is a separate, agreed change, not a side effect of a refactor.|||VI: File đã duyệt do v0 viết ra và chưa từng đổi; việc của nó trong lúc refactor là đỏ ở bất kỳ khác biệt nào, và '7' so với '7.0' là khác biệt mà phần nhập Excel của phòng sẽ thấy. Đáp án sai hấp dẫn — '-u vì 7.0 đẹp hơn': làm vậy biến test đặc tả thành con dấu đóng cho có; đổi định dạng là một thay đổi riêng, có đồng ý, không phải tác dụng phụ của refactor.",
      },
      {
        question: "The golden master of the legacy monthly report is green under TZ=UTC and TZ=Asia/Ho_Chi_Minh, but red under TZ=America/New_York (Weekend/holiday: 2 becomes 1). The refactored report passes in all three. Why?|||Golden master của báo cáo tháng cũ xanh với TZ=UTC và TZ=Asia/Ho_Chi_Minh, nhưng đỏ với TZ=America/New_York (Weekend/holiday: 2 thành 1). Báo cáo đã refactor thì xanh ở cả ba. Vì sao?",
        options: [
          'Fake timers do not work outside Asia.|||Fake timers không chạy ngoài châu Á.',
          'The approved file was written with Windows line endings.|||File đã duyệt được ghi với ký tự xuống dòng kiểu Windows.',
          'New York has more public holidays.|||New York có nhiều ngày lễ hơn.',
          "v0 does new Date('2026-10-03').getDay(): a date-only string is midnight UTC, and getDay reads local time, so west of UTC the day moves back by one; the refactor reads the calendar date with getUTCDay.|||v0 làm new Date('2026-10-03').getDay(): chuỗi chỉ có ngày là nửa đêm UTC, còn getDay đọc giờ địa phương, nên ở phía tây UTC ngày lùi lại một; bản refactor đọc ngày theo lịch bằng getUTCDay.",
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: In New York, Saturday 2026-10-03 at 00:00 UTC is Friday evening, so one weekend booking stops counting. In UTC and in Viet Nam (UTC+7) the local day is the same calendar day, which is why the pin looked stable on the machines that matter. Tempting wrong answer — 'fake timers do not work': the clock was faked correctly; the difference is in how a date-only string is parsed, which no fake clock changes.|||VI: Ở New York, thứ Bảy 2026-10-03 lúc 00:00 UTC là tối thứ Sáu, nên một lượt đặt cuối tuần không còn được đếm. Ở UTC và ở Việt Nam (UTC+7) ngày địa phương trùng ngày theo lịch, vì thế cái ghim trông ổn định trên những máy quan trọng. Đáp án sai hấp dẫn — 'fake timers không chạy': đồng hồ đã được giả đúng; khác biệt nằm ở cách đọc một chuỗi chỉ có ngày, thứ mà không đồng hồ giả nào thay đổi được.",
      },
      {
        question: "A bug sends a freed slot to the LAST student in line. The PR's broad snapshot test turns red; the author runs vitest -u: 'Snapshots 1 updated', 4 passed, and pushes. What should the reviewer do?|||Một bug gửi khung giờ vừa trống cho sinh viên CUỐI hàng. Test snapshot rộng của PR đỏ; tác giả chạy vitest -u: 'Snapshots 1 updated', 4 passed, rồi push. Người review nên làm gì?",
        options: [
          "Read the .snap diff like code: it shows offeredTo an → chi and the queue reversed; block the PR, and ask for explicit assertions on who is offered the slot.|||Đọc diff của file .snap như đọc code: nó cho thấy offeredTo an → chi và hàng chờ bị đảo; chặn PR, và yêu cầu khẳng định rõ ràng ai được mời vào chỗ trống.",
          'Approve: the tests are green again.|||Duyệt: test đã xanh trở lại.',
          'Ask the author to delete the .snap file so it is generated again in CI.|||Yêu cầu tác giả xoá file .snap để CI tự sinh lại.',
          'Ask for retry: 3 on the snapshot test.|||Yêu cầu thêm retry: 3 cho test snapshot.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: -u accepts whatever the code does now, bug included; the only defence left is a human reading the snapshot diff, where 'chi@labflow.example' replaces 'an@labflow.example' among dozens of unchanged lines. The reviewed tests name the behaviour and assert it exactly. Tempting wrong answer — 'approve, it is green': green after -u proves only that the snapshot matches itself.|||VI: -u chấp nhận mọi thứ code đang làm, kể cả bug; hàng phòng thủ duy nhất còn lại là người đọc diff snapshot, nơi 'chi@labflow.example' thay cho 'an@labflow.example' giữa hàng chục dòng không đổi. Bộ test sau review gọi tên hành vi và khẳng định chính xác nó. Đáp án sai hấp dẫn — 'duyệt vì đã xanh': xanh sau -u chỉ chứng minh snapshot khớp với chính nó.",
      },
      {
        question: "A test builds three random student ids ('student' + 0–9). Without retry it is red in 10 of 30 runs; with { retry: 3 } it is red in 0 of 30, and the tree reporter sometimes prints 'should return correct value … (retry x1)'. The author says the retry fixed it. Your review comment?|||Một test tạo ba id sinh viên ngẫu nhiên ('student' + 0–9). Không có retry thì đỏ 10 trên 30 lần; có { retry: 3 } thì đỏ 0 trên 30, và reporter tree đôi khi in 'should return correct value … (retry x1)'. Tác giả nói retry đã sửa xong. Bình luận review của bạn?",
        options: [
          '0/30 proves it is fixed; approve.|||0/30 chứng minh đã sửa xong; duyệt.',
          "Blocking: the test is non-deterministic (random ids collide, so a student is ALREADY_WAITING); retry only hides it and would hide a real intermittent bug too — use fixed ids and remove the retry.|||Chặn: test không tất định (id ngẫu nhiên trùng nhau, nên một sinh viên bị ALREADY_WAITING); retry chỉ che nó đi và cũng sẽ che một bug chập chờn thật — dùng id cố định và bỏ retry.",
          'Raise retry to 10 so it is never red.|||Tăng retry lên 10 để không bao giờ đỏ.',
          'Move it to the nightly workflow so it does not block pull requests.|||Chuyển nó sang workflow chạy đêm để không chặn pull request.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: The randomness is in the test itself, so the fix is in the test: fixed names make it deterministic (the reviewed version was 0/30 red in shuffled order). '(retry x1)' in the output is the signal a reviewer should notice. Tempting wrong answer — '0/30 proves it is fixed': the same code was red 10/30 without the retry; nothing was fixed, the failures were just repeated until they passed.|||VI: Sự ngẫu nhiên nằm ngay trong test, nên phải sửa ở test: tên cố định làm nó tất định (bản sau review đỏ 0/30 lần khi xáo thứ tự). '(retry x1)' trong output là tín hiệu người review cần để ý. Đáp án sai hấp dẫn — '0/30 chứng minh đã sửa': cùng code đó đỏ 10/30 khi không có retry; không có gì được sửa, lần đỏ chỉ được chạy lại tới khi xanh.",
      },
    ],
  },
};
