/**
 * Testing · Chương 10B · Quiz Chương 10B (10 câu tình huống). BÀI MỚI 24/11/2026, slug tst-10b-8-quiz.
 * Đáp án rải: A ×2 (câu 3, 8) · B ×3 (1, 5, 9) · C ×3 (2, 6, 10) · D ×2 (4, 7). Mọi con số trong câu hỏi lấy từ output thật của chương.
 */
export default {
  title: 'Chapter 10B check — 10 scenario questions|||Kiểm tra Chương 10B — 10 câu tình huống',
  slug: 'tst-10b-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 10B: tầng biến nào thắng, forEach trên danh sách rỗng, biến gõ sai tên làm test IDOR xanh, assertion trong callback không done, token hết hạn giữa lượt chạy, "{{seats}}" trong ngoặc kép, đọc lượt CI đỏ dây chuyền, artifact nào được công khai, mock trả 201 cho giờ lệch lưới, và test đặt sát giờ ở sai phòng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Check</span>
<h2>Chapter 10B check</h2>
<p class="lead">Ten scenarios about testing an API with Postman and Newman. Every number in the questions comes from a real run in this chapter. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can organise a collection with folders, environments and variables, and I know which scope wins.</li>
<li>I can write test scripts that fail for the right reason, including asynchronous ones.</li>
<li>I can run a collection with auth, data files and Newman in CI, and read a red report.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10B · Kiểm tra</span>
<h2>Kiểm tra Chương 10B</h2>
<p class="lead">Mười tình huống về test API bằng Postman và Newman. Mọi con số trong câu hỏi đều lấy từ một lượt chạy thật trong chương. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi sắp xếp được collection với folder, environment và biến, và biết tầng biến nào thắng.</li>
<li>Tôi viết được test script đỏ đúng lý do, kể cả script bất đồng bộ.</li>
<li>Tôi chạy được collection có auth, tệp dữ liệu và Newman trong CI, và đọc được một báo cáo đỏ.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The variable who is defined as a global ("global"), a collection variable ("collection") and in the loaded environment ("environment"). No data file, no script sets it. Which value is sent?|||Biến who được định nghĩa ở global ("global"), ở collection ("collection") và trong environment đang nạp ("environment"). Không có tệp dữ liệu, không script nào đặt nó. Giá trị nào được gửi?',
        options: [
          '"global" — globals are applied last, so they override everything.|||"global" — global được áp dụng sau cùng nên ghi đè tất cả.',
          '"environment" — the narrower scope wins: local > data > environment > collection > global.|||"environment" — tầng hẹp hơn thắng: local > data > environment > collection > global.',
          '"collection" — the collection file always wins over external files.|||"collection" — tệp collection luôn thắng các tệp bên ngoài.',
          'Newman stops with an error because the name is ambiguous.|||Newman dừng với lỗi vì tên bị mơ hồ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured in lesson 10B.1: with an environment loaded, the sent value was "environment"; adding a data row made it "data"; a local value set in the pre-request beat everything. A is the tempting one because "global" sounds strongest — it is the weakest scope, which is exactly why a forgotten global surprises you only when the stronger variable is deleted.|||VI: Đo ở bài 10B.1: có environment thì giá trị gửi đi là "environment"; thêm một dòng data thành "data"; giá trị local đặt trong pre-request thắng tất cả. A hấp dẫn vì "global" nghe mạnh nhất — nó là tầng yếu nhất, và chính vì thế một biến global bị quên chỉ làm bạn bất ngờ khi biến mạnh hơn bị xoá.',
      },
      {
        question: 'pm.test("every booking is CONFIRMED", () => pm.response.json().forEach((b) => pm.expect(b.status).to.eql("CONFIRMED"))) is green for a lecturer who has no bookings. What is going on?|||pm.test("every booking is CONFIRMED", () => pm.response.json().forEach((b) => pm.expect(b.status).to.eql("CONFIRMED"))) xanh với một giảng viên chưa có lượt đặt nào. Chuyện gì đang xảy ra?',
        options: [
          'Correct: an empty list has no unconfirmed booking, so the rule holds.|||Đúng: danh sách rỗng không có lượt đặt nào chưa xác nhận, nên luật được thoả.',
          'Postman skips tests on empty arrays to save time.|||Postman bỏ qua test trên mảng rỗng cho nhanh.',
          'The test made zero assertions — forEach never called its function. Assert the length first.|||Test không thực hiện assertion nào — forEach không gọi hàm lần nào. Khẳng định độ dài trước.',
          'The response was not JSON, so json() returned undefined.|||Phản hồi không phải JSON nên json() trả undefined.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: In lesson 10B.2 the trap T1 was green and its fixed version, which asks for length.above(0) first, was red for the same response. A is logically true but useless as a test: the test name promises a check that never ran. D is wrong — if json() had failed the test would throw and be red.|||VI: Ở bài 10B.2 bẫy T1 xanh còn bản sửa, đòi length.above(0) trước, đỏ với cùng phản hồi. A đúng về logic nhưng vô dụng như một test: tên test hứa một phép kiểm chưa từng chạy. D sai — nếu json() hỏng thì test đã ném lỗi và đỏ.',
      },
      {
        question: 'The request "Another student cannot read it" uses GET {{baseUrl}}/api/bookings/{{bookingID}} while the variable saved earlier is bookingId. The test expects 404 and is green. What is the best reaction?|||Request "Another student cannot read it" dùng GET {{baseUrl}}/api/bookings/{{bookingID}} trong khi biến đã lưu là bookingId. Test chờ 404 và xanh. Phản ứng tốt nhất là gì?',
        options: [
          'Treat the test as broken: the literal {{bookingID}} was sent and any API answers 404 to that. Fix the name and add a guard that the decoded URL contains no "{{".|||Coi test là hỏng: nguyên chữ {{bookingID}} đã được gửi và API nào cũng trả 404 cho cái đó. Sửa tên và thêm rào chắn rằng URL đã giải mã không còn "{{".',
          'Nothing — 404 is the expected answer, so the API is safe from IDOR.|||Không làm gì — 404 là câu trả lời mong đợi, nên API an toàn khỏi IDOR.',
          'Change the expectation to 403 so the test is stricter.|||Đổi kỳ vọng thành 403 cho test chặt hơn.',
          'Add pm.expect(pm.request.url.toString()).to.not.include("{{") — that alone catches it.|||Thêm pm.expect(pm.request.url.toString()).to.not.include("{{") — một mình nó là bắt được.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured in lesson 10B.2: the URL sent was /api/bookings/%7B%7BbookingID%7D%7D and the IDOR test passed. D is the most tempting — and it was the first version of the practice solution, which stayed green on the broken URL because toString() already encodes the braces as %7B%7B. Decode first, then check.|||VI: Đo ở bài 10B.2: URL gửi đi là /api/bookings/%7B%7BbookingID%7D%7D và test IDOR xanh. D hấp dẫn nhất — và nó chính là bản đầu của lời giải thực hành, vẫn xanh trên URL hỏng vì toString() đã mã hoá cặp ngoặc thành %7B%7B. Giải mã trước rồi mới kiểm.',
      },
      {
        question: 'Inside pm.test("admin list", () => { pm.sendRequest(url, (err, res) => pm.expect(res.code).to.eql(200)); }) the second request answers 401. What does the run report?|||Bên trong pm.test("admin list", () => { pm.sendRequest(url, (err, res) => pm.expect(res.code).to.eql(200)); }) request thứ hai trả 401. Lượt chạy báo gì?',
        options: [
          'A red test, because the assertion failed.|||Một test đỏ, vì assertion đã thất bại.',
          'A TypeError, because res is undefined inside a test.|||Một TypeError, vì res không xác định bên trong test.',
          'The run hangs until the callback finishes.|||Lượt chạy treo cho tới khi callback xong.',
          'A green test: the test function returned before the callback ran. Take a done parameter and call done() or done(err).|||Một test xanh: hàm test trả về trước khi callback chạy. Nhận tham số done và gọi done() hoặc done(err).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (trap T7): "callback assertion, no done" was ✓ while the log printed code 401; the same check with done was red. A is what you would expect — and why this trap survives code review. The same output showed a second lesson: pm.sendRequest does not inherit the collection auth.|||VI: Đã đo (bẫy T7): "callback assertion, no done" được ✓ trong khi log in mã 401; cùng phép kiểm có done thì đỏ. A là điều bạn tưởng — và vì thế bẫy này qua mặt được review. Cùng output còn bài học thứ hai: pm.sendRequest không kế thừa auth của collection.',
      },
      {
        question: 'A nightly collection logs in once, then makes 300 requests over 20 minutes. Tokens live 15 minutes. From request 230 on, everything is 401. Best fix?|||Collection chạy đêm đăng nhập một lần rồi gửi 300 request trong 20 phút. Token sống 15 phút. Từ request 230 trở đi, tất cả là 401. Cách sửa tốt nhất?',
        options: [
          'Ask the backend team for 24-hour tokens in all environments.|||Xin đội backend cấp token 24 giờ ở mọi môi trường.',
          'A collection-level pre-request script that logs in when the token is missing or expires within a margin, and saves token and expiry.|||Một pre-request script ở mức collection đăng nhập khi chưa có token hoặc token sắp hết hạn trong một khoảng biên, rồi lưu token và thời điểm hết hạn.',
          'Add --delay-request so the run is slower and more stable.|||Thêm --delay-request để lượt chạy chậm và ổn định hơn.',
          'Mark the 401 tests as allowed failures with --suppress-exit-code.|||Đánh dấu các test 401 là được phép đỏ bằng --suppress-exit-code.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured with a 2-second token in lesson 10B.3: logging in once gave 2 of 3 requests 401; the refresh script made 3 of 3 green. A changes the system to fit the test and weakens security. C makes it worse — the delay is what killed the token in the experiment. D hides every failure, not only this one.|||VI: Đo với token 2 giây ở bài 10B.3: đăng nhập một lần thì 2/3 request 401; script làm mới cho 3/3 xanh. A sửa hệ thống cho vừa test và làm yếu bảo mật. C làm tệ hơn — chính độ trễ là thứ giết token trong thí nghiệm. D giấu mọi lỗi, không chỉ lỗi này.',
      },
      {
        question: 'With body "seats": "{{seats}}" and a CSV of 15 boundary cases, 12 cases are red and 3 are green ("0 seats", "201 seats", "hour 24", all expecting 400 VALIDATION). What do the 3 green cases prove?|||Với body "seats": "{{seats}}" và một CSV 15 ca biên, 12 ca đỏ và 3 ca xanh ("0 seats", "201 seats", "hour 24", đều chờ 400 VALIDATION). Ba ca xanh chứng minh điều gì?',
        options: [
          'That the API validates seats and hours correctly.|||Rằng API kiểm số chỗ và giờ đúng.',
          'That CSV files are unreliable and JSON must always be used.|||Rằng tệp CSV không đáng tin và phải luôn dùng JSON.',
          'Nothing about their boundaries: every request was refused because seats was a string. Remove the quotes and assert details[0].path.|||Không gì về mép của chúng: mọi request đều bị từ chối vì seats là chuỗi. Bỏ ngoặc kép và khẳng định details[0].path.',
          'That the three rows are the only valid ones in the file.|||Rằng ba dòng đó là những dòng hợp lệ duy nhất trong tệp.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Lesson 10B.4: the API said "Invalid input: expected number, received string" for every row; the three rows that happened to expect 400 passed for the wrong field. A is the trap — green looks like proof. B overreacts: the CSV was fine, the body template was wrong (and JSON data would have had the same problem inside quotes).|||VI: Bài 10B.4: API trả "Invalid input: expected number, received string" cho mọi dòng; ba dòng tình cờ chờ 400 thì xanh vì sai ở trường khác. A là cái bẫy — xanh trông như bằng chứng. B phản ứng quá đà: CSV không sao, khuôn body mới sai (dữ liệu JSON đặt trong ngoặc kép cũng bị y như vậy).',
      },
      {
        question: 'A CI run of the collection shows 12 failed assertions: three "200 and a token" in 1 Auth, then 401s everywhere after. What should you look at first?|||Một lượt CI của collection có 12 assertion đỏ: ba cái "200 and a token" trong 1 Auth, rồi 401 khắp nơi phía sau. Bạn nhìn gì trước tiên?',
        options: [
          'The slowest request, because timeouts cause cascades.|||Request chậm nhất, vì hết giờ gây ra đỏ dây chuyền.',
          'The last failure, since it is closest to the end of the run.|||Lỗi cuối cùng, vì nó gần cuối lượt chạy nhất.',
          'Rerun until it is green — 12 failures at once is probably flakiness.|||Chạy lại tới khi xanh — 12 lỗi cùng lúc chắc là chập chờn.',
          'The first failure: the logins were refused, so the password secret given to --env-var is probably wrong; the other nine are consequences.|||Lỗi đầu tiên: đăng nhập bị từ chối, nên secret mật khẩu truyền vào --env-var có lẽ sai; chín lỗi còn lại là hệ quả.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Exactly the red run measured in lesson 10B.5 (PW=sai): 3 refused logins, 9 consequences, exit 1. Read top-down and stop at the first failure not explained by an earlier one. C is tempting but wrong — the cause is deterministic and the same 12 come back every time. A --bail run or a separate auth step makes the cause the only red line.|||VI: Đúng lượt đỏ đã đo ở bài 10B.5 (PW=sai): 3 lần đăng nhập bị từ chối, 9 hệ quả, exit 1. Đọc từ trên xuống và dừng ở lỗi đầu tiên không do lỗi trước gây ra. C hấp dẫn nhưng sai — nguyên nhân là tất định và lần nào cũng đúng 12 lỗi đó quay lại. Chạy --bail hoặc tách bước auth riêng làm nguyên nhân thành dòng đỏ duy nhất.',
      },
      {
        question: 'Your repository is public. Which Newman report is safe to upload as a CI artifact?|||Repo của bạn là công khai. Báo cáo Newman nào an toàn để tải lên làm artifact CI?',
        options: [
          'The JUnit XML — measured: no password and no token in it.|||JUnit XML — đã đo: không có mật khẩu, không có token.',
          'The htmlextra HTML report, because it is the easiest to read.|||Báo cáo HTML htmlextra, vì nó dễ đọc nhất.',
          'The JSON report, because it is machine-readable and complete.|||Báo cáo JSON, vì máy đọc được và đầy đủ.',
          'Any of them — CI artifacts are only visible to the repository owner.|||Cái nào cũng được — artifact CI chỉ chủ repo mới thấy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Lesson 10B.3 counted: JUnit 0 passwords / 0 tokens; htmlextra 3 passwords / 11 JWTs; JSON 4 passwords / 16 JWTs — full reports record every request and response. D is the dangerous belief: on a public repository, artifacts can be downloaded by anyone who can read the repository.|||VI: Bài 10B.3 đã đếm: JUnit 0 mật khẩu / 0 token; htmlextra 3 mật khẩu / 11 JWT; JSON 4 mật khẩu / 16 JWT — báo cáo đầy đủ ghi lại mọi request và phản hồi. D là niềm tin nguy hiểm: trên repo công khai, ai đọc được repo là tải được artifact.',
      },
      {
        question: 'The mobile team tests against a Prism mock built from the OpenAPI contract with examples. A booking starting at 09:15 (off the 30-minute grid) gets 201 Created. What does that tell you?|||Đội di động test vào một mock Prism dựng từ hợp đồng OpenAPI có ví dụ. Một lượt đặt bắt đầu lúc 09:15 (lệch lưới 30 phút) nhận 201 Created. Điều đó cho bạn biết gì?',
        options: [
          'The real API also accepts off-grid times — the contract says so.|||API thật cũng nhận giờ lệch lưới — hợp đồng nói vậy.',
          'Nothing about the rule: the mock returns the saved example, not the result of the business logic. Rules and permissions must be tested on the real API.|||Không gì về luật: mock trả example đã lưu, không phải kết quả của logic nghiệp vụ. Luật và phân quyền phải test trên API thật.',
          'The mock is broken and must be replaced by a Postman mock server.|||Mock bị hỏng và phải thay bằng mock server của Postman.',
          'The example in the contract is wrong and must be changed to 09:15.|||Example trong hợp đồng sai và phải đổi thành 09:15.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Lesson 10B.6: the mock answered 201 with "start": "09:00" — the example, not the request. The whole collection against the mock failed 10 of 43 assertions, all on rules and permissions. C is tempting but a Postman mock works the same way: it returns saved examples. A mock proves shapes; only the real API proves behaviour.|||VI: Bài 10B.6: mock trả 201 với "start": "09:00" — là example, không phải request. Cả collection chạy vào mock đỏ 10/43 assertion, toàn ở luật và phân quyền. C hấp dẫn nhưng mock của Postman cũng hoạt động y vậy: trả example đã lưu. Mock chứng minh hình dạng; chỉ API thật chứng minh hành vi.',
      },
      {
        question: 'In Lab 10B a learner books 11:00–12:00 in an empty lab BE-205 to test "back-to-back bookings are allowed". The grader says B3 (<= instead of < in the overlap check) is missed. Why?|||Ở Lab 10B một người học đặt 11:00–12:00 ở phòng trống BE-205 để test "hai lượt đặt sát giờ được phép". Máy chấm báo bỏ lọt B3 (<= thay vì < trong kiểm trùng giờ). Vì sao?',
        options: [
          'Because Newman does not support comparing times.|||Vì Newman không hỗ trợ so sánh giờ.',
          'Because B3 only affects lecturers.|||Vì B3 chỉ ảnh hưởng tới giảng viên.',
          'Because nothing ends at 11:00 in BE-205, so the buggy and the correct check give the same answer. The booking must touch an existing one in the same lab and day.|||Vì ở BE-205 không có gì kết thúc lúc 11:00, nên kiểm có bug và kiểm đúng cho cùng một câu trả lời. Lượt đặt phải chạm vào một lượt có sẵn, cùng phòng, cùng ngày.',
          'Because the test should expect 409 instead of 201.|||Vì test lẽ ra phải chờ 409 thay vì 201.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The measured first attempt scored 8/10 with B3 and B4 missed; the reference books 11:00–12:00 in BE-201 right after An’s 09:00–11:00 and catches B3. D is the tempting inversion — 409 is what the bug produces, so expecting it would make the test green only on the broken API. A test catches a bug only if its setup reaches the line where the bug lives.|||VI: Lần thử đầu đo được 8/10, bỏ lọt B3 và B4; lời giải đặt 11:00–12:00 ở BE-201 ngay sau lượt 09:00–11:00 của An và bắt được B3. D là cái đảo ngược hấp dẫn — 409 là thứ bug sinh ra, chờ nó thì test chỉ xanh trên API hỏng. Một test chỉ bắt được bug khi phần dựng dữ liệu của nó chạm tới đúng dòng có bug.',
      },
    ],
  },
};
