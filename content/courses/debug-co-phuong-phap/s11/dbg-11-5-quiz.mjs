/**
 * 11.5 — Kiểm tra Chương 11 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 11.1–11.4
 * (Chrome 150 + CDP, HAR, node --test, git, PostgreSQL 16, dữ liệu Lab 10.5). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '11.5 — Chapter 11 quiz|||11.5 — Kiểm tra Chương 11',
  slug: 'dbg-11-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: báo cáo "Lỗi đặt lịch" thiếu gì, thu nhỏ ra biên 255/256 và đếm ký tự hay byte, severity khác priority, HAR "sanitized" của Chrome còn sót mật khẩu và token trong body/URL, request id trong bug report, commit "fix bug" chỉ thêm maxlength, test chặn tái phát phải đỏ trước, .length đếm đơn vị UTF-16, 5 Whys dừng ở một người, hành động postmortem có người và hạn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can turn "it doesn't work" into a report a stranger reproduces in five minutes.</li>
<li>I can tell severity from priority and justify both.</li>
<li>I never attach a HAR, log or cURL command without scanning it for secrets.</li>
<li>I only trust a regression test I have seen fail on the old code.</li>
<li>I can write a one-page postmortem with data, factors and owned actions, without blame.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biến được câu "nó không chạy" thành một báo cáo mà người lạ tái hiện trong năm phút.</li>
<li>Tôi phân biệt được severity với priority và giải thích được cả hai.</li>
<li>Tôi không bao giờ đính kèm HAR, log hay lệnh cURL khi chưa soát bí mật.</li>
<li>Tôi chỉ tin một test chặn tái phát khi đã thấy nó hỏng trên mã cũ.</li>
<li>Tôi viết được postmortem một trang có dữ liệu, các yếu tố và hành động có người nhận, không đổ lỗi.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'You receive: "Booking error — booking doesn\'t work, please fix asap" with a screenshot of "Có lỗi xảy ra". What is the most useful first reply?|||Bạn nhận được: "Lỗi đặt lịch — đặt lịch không được, fix gấp" kèm ảnh "Có lỗi xảy ra". Câu trả lời đầu tiên có ích nhất là gì?',
        options: [
          'Close it as "cannot reproduce"|||Đóng ticket với lý do "không tái hiện được"',
          'Reply with the report template, fill in what you can, and ask only for the missing items: account, input (the note), time, frequency|||Trả lời bằng mẫu báo cáo, tự điền những gì có thể, và chỉ hỏi phần còn thiếu: tài khoản, đầu vào (ghi chú), thời điểm, tần suất',
          'Ask for the user\'s password to log in as them|||Xin mật khẩu của người dùng để đăng nhập thử bằng tài khoản họ',
          'Restart the server and ask them to try again|||Restart server rồi bảo họ thử lại',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: A vague report needs the missing context, not a verdict. Never ask for a password; use a test account or ask for a sanitized HAR.|||VI: Báo cáo mơ hồ cần bổ sung bối cảnh, không cần một phán quyết. Đừng bao giờ xin mật khẩu; dùng tài khoản test hoặc xin HAR đã che.',
      },
      {
        question: 'Bisecting the note length gives 255 → 201, 256 → 500; 255 Vietnamese characters (765 bytes) → 201. What can the report title now say?|||Chia đôi độ dài ghi chú cho ra 255 → 201, 256 → 500; 255 chữ tiếng Việt (765 byte) → 201. Tiêu đề báo cáo giờ nói được gì?',
        options: [
          '"POST /api/dat-lich returns 500 when the note is longer than 255 characters"|||"POST /api/dat-lich trả 500 khi ghi chú dài hơn 255 ký tự"',
          '"POST /api/dat-lich returns 500 when the note is longer than 255 bytes"|||"POST /api/dat-lich trả 500 khi ghi chú dài hơn 255 byte"',
          '"Booking fails with Vietnamese characters"|||"Đặt lịch lỗi khi có chữ tiếng Việt"',
          '"Database error on booking"|||"Lỗi cơ sở dữ liệu khi đặt lịch"',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: 765 bytes passed, so the limit counts characters. "Database error" is a guess; the symptom, place and boundary are facts.|||VI: 765 byte vẫn qua, vậy giới hạn đếm theo ký tự. "Lỗi cơ sở dữ liệu" là phỏng đoán; triệu chứng, nơi xảy ra và biên mới là sự thật.',
      },
      {
        question: 'The customer\'s company name is misspelled on the home page; the demo is tomorrow morning. Severity and priority?|||Tên công ty của khách bị viết sai trên trang chủ; sáng mai demo. Severity và priority?',
        options: [
          'Critical / P0|||Critical / P0',
          'Major / P3|||Major / P3',
          'Trivial / P1|||Trivial / P1',
          'Trivial / P3, cosmetic bugs always wait|||Trivial / P3, lỗi giao diện thì luôn để sau',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Technically trivial, but the business wants it fixed today. Severity and priority are independent; the lead decides priority.|||VI: Về kỹ thuật là trivial, nhưng doanh nghiệp muốn sửa trong hôm nay. Severity và priority độc lập với nhau; trưởng nhóm quyết định priority.',
      },
      {
        question: 'You export "HAR (sanitized)" from Chrome DevTools after logging in. In lesson 11.1, what was still inside?|||Bạn xuất "HAR (sanitized)" từ Chrome DevTools sau khi đăng nhập. Ở bài 11.1, trong đó vẫn còn gì?',
        options: [
          'Nothing — sanitized removes all secrets|||Không gì cả — sanitized xoá hết bí mật',
          'Only the Cookie header|||Chỉ còn header Cookie',
          'The Authorization header|||Header Authorization',
          'The password in the login request body, the token in the login response body and the token in a URL query|||Mật khẩu trong body request đăng nhập, token trong body phản hồi đăng nhập và token trong query của URL',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Chrome documents that the sanitized export excludes Cookie, Set-Cookie and Authorization headers — nothing more. 4 of 8 secrets remained. Okta 2023: session tokens in support HAR files were used to hijack 5 customers\' sessions.|||VI: Chrome ghi rõ bản sanitized bỏ header Cookie, Set-Cookie và Authorization — không hơn. Còn 4 trên 8 chỗ bí mật. Okta 2023: session token trong HAR gửi bộ phận hỗ trợ bị dùng để chiếm phiên của 5 khách.',
      },
      {
        question: 'Why should the request id from the 500 response go into the bug report?|||Vì sao nên đưa request id của phản hồi 500 vào bug report?',
        options: [
          'It proves the user was logged in|||Nó chứng minh người dùng đã đăng nhập',
          'One grep finds the exact server log line — here PostgreSQL 22001 "value too long for type character varying(255)"|||Một lệnh grep ra đúng dòng log server — ở đây là PostgreSQL 22001 "value too long for type character varying(255)"',
          'The developer can replay the request with it|||Dev dùng nó để gửi lại request',
          'It is required by HTTP|||HTTP bắt buộc phải có',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Without it, the developer searches logs by time and guesses. With it, the report links directly to the server\'s view of the failure.|||VI: Không có nó, dev phải lục log theo giờ rồi đoán. Có nó, báo cáo nối thẳng tới góc nhìn của server về lỗi.',
      },
      {
        question: 'Commit 8e9a023 "fix bug" added maxlength="255" to the textarea and all project tests are green. What is true?|||Commit 8e9a023 "fix bug" thêm maxlength="255" cho textarea và mọi test của dự án đều xanh. Điều nào đúng?',
        options: [
          'LAB-1107 is fixed|||LAB-1107 đã được sửa',
          'It is a symptom fix: curl with 256 characters still returns 500, and the only test books a short note|||Đó là sửa triệu chứng: curl với 256 ký tự vẫn trả 500, và test duy nhất chỉ đặt lịch với ghi chú ngắn',
          'The tests are broken|||Các test bị hỏng',
          'maxlength also validates on the server|||maxlength cũng kiểm ở phía server',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: A UI limit is not a rule; every other client bypasses it. Green tests that never exercise the bug prove nothing about it.|||VI: Giới hạn trên giao diện không phải luật; mọi client khác đều đi vòng qua được. Test xanh mà không bao giờ chạy tới lỗi thì chẳng chứng minh gì về lỗi đó.',
      },
      {
        question: 'You wrote a fix and a new test; the test passes. What must you still do before trusting the test?|||Bạn đã viết bản sửa và một test mới; test qua. Còn phải làm gì trước khi tin test này?',
        options: [
          'Nothing; passing is enough|||Không gì cả; qua là đủ',
          'Run it ten more times|||Chạy thêm mười lần',
          'Run it against the code without the fix and see it fail for the reported reason (here 500 !== 400)|||Chạy nó trên mã chưa có bản sửa và thấy nó hỏng đúng vì lỗi đã báo (ở đây 500 !== 400)',
          'Ask a reviewer to read it|||Nhờ người review đọc nó',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: A regression test proves the fix only if it is red without it. In 11.2 two of the three new tests were green on the old code too — useful guards, not proof.|||VI: Test chặn tái phát chỉ chứng minh được bản sửa khi nó đỏ lúc chưa có bản sửa. Ở 11.2, hai trong ba test mới cũng xanh trên mã cũ — là lưới chặn hữu ích, không phải bằng chứng.',
      },
      {
        question: 'A fix checks String(ghiChu).length > 255. Which test catches that it is wrong for PostgreSQL varchar(255)?|||Một bản sửa kiểm String(ghiChu).length > 255. Test nào bắt được nó sai so với varchar(255) của PostgreSQL?',
        options: [
          '256 × "x" ⇒ 400|||256 × "x" ⇒ 400',
          'An empty note ⇒ 201|||Ghi chú rỗng ⇒ 201',
          '255 emoji ⇒ 201 (the fix returns 400: an emoji is 2 UTF-16 units)|||255 emoji ⇒ 201 (bản sửa trả 400: một emoji là 2 đơn vị UTF-16)',
          '255 × "x" ⇒ 201|||255 × "x" ⇒ 201',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: JavaScript .length counts UTF-16 code units; PostgreSQL counts characters. [...s].length counts code points. Boundary tests with multi-byte data catch it.|||VI: .length của JavaScript đếm đơn vị UTF-16; PostgreSQL đếm ký tự. [...s].length đếm code point. Test biên với dữ liệu nhiều byte bắt được lỗi này.',
      },
      {
        question: 'Five whys on LAB-1050 ends with "because pm-linh changed the flag". What is wrong with stopping there?|||5 Whys trên LAB-1050 kết thúc bằng "vì pm-linh đổi cờ". Dừng ở đó sai chỗ nào?',
        options: [
          'Nothing; that is the root cause|||Không sai; đó là nguyên nhân gốc',
          'It should end at the developer instead|||Lẽ ra phải dừng ở dev',
          'Five is too few; ask seven times|||Năm lần là quá ít; phải hỏi bảy lần',
          'It stops at a person and follows one chain, missing the event-loop blocking that slowed every route; list contributing factors instead|||Nó dừng ở một con người và chỉ đi theo một chuỗi, bỏ sót việc event loop bị chặn làm mọi route chậm; hãy liệt kê các yếu tố góp phần',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Allspaw (2014): we "find" a root cause where we stop looking. The flag tool allowed a 0 → 25% jump, test data had no null rooms, the app histogram missed the wait — all contributed.|||VI: Allspaw (2014): ta "tìm thấy" nguyên nhân gốc ở chỗ ta thôi tìm. Công cụ cờ cho nhảy 0 → 25%, dữ liệu test không có phòng null, histogram của ứng dụng không thấy thời gian chờ — đều góp phần.',
      },
      {
        question: 'Which is a good postmortem action item?|||Việc cần làm nào trong postmortem là tốt?',
        options: [
          '"Alert on event-loop lag p99 > 100 ms — Minh, 28/11"|||"Cảnh báo event loop lag p99 > 100 ms — Minh, 28/11"',
          '"Everyone be more careful with flags"|||"Mọi người cẩn thận hơn khi bật cờ"',
          '"Improve monitoring — the team"|||"Cải thiện giám sát — cả đội"',
          '"pm-linh must get approval next time"|||"Lần sau pm-linh phải xin duyệt"',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: One owner, a date, and a change to the system that does not depend on people remembering. "Be careful" and person-targeted rules are not actions.|||VI: Một người phụ trách, một hạn, và một thay đổi trong hệ thống không phụ thuộc vào trí nhớ con người. "Cẩn thận hơn" và luật nhắm vào một người không phải hành động.',
      },
    ],
  },
};
