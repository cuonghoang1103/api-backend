/**
 * 6.6 — Kiểm tra Chương 6 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 6.1–6.5
 * (curl 8.18, nginx 1.27.5, API node:http Node 22, Spring Boot 4.1.1, Chrome 150 + CDP). Phân bố đáp án: A3 B3 C2 D2.
 */
export default {
  title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
  slug: 'dbg-6-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: curl exit 7 với 28, 502 mà log app ghi 200, 504 và việc vẫn chạy tiếp, 404 do ai nói, -d gửi form, Copy as cURL rút gọn, id 64 bit bị JavaScript làm tròn, giờ không múi giờ lệch 7 tiếng, POST bị 301 thành GET, correlation ID bị mất ở chặng giữa, lỗi 400 trơn của Spring.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I name the failing layer (DNS, TCP, TLS, proxy, app) from one line of client output or one proxy log line.</li>
<li>I turn a browser request into a minimal curl and know four ways a curl reproduction can lie.</li>
<li>I recognise big-number, encoding and time-zone bugs from their symptoms and know the contract that prevents each.</li>
<li>I can follow one request through nginx, Node and Spring with a correlation id, and I know where ids get lost.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi tên được tầng hỏng (DNS, TCP, TLS, proxy, app) từ một dòng output của client hoặc một dòng log của proxy.</li>
<li>Tôi biến được một request của trình duyệt thành curl tối giản và biết bốn cách một bản tái hiện bằng curl nói dối.</li>
<li>Tôi nhận ra lỗi số lớn, mã hoá ký tự, múi giờ qua triệu chứng và biết hợp đồng nào chặn từng loại.</li>
<li>Tôi lần theo được một request qua nginx, Node và Spring bằng correlation id, và biết id hay bị mất ở đâu.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'curl answers "curl: (7) Failed to connect to 127.0.0.1 port 41619 after 0 ms" immediately. A teammate gets "curl: (28) Connection timed out after 3002 milliseconds" against another host. Which reading is right?|||curl trả ngay "curl: (7) Failed to connect to 127.0.0.1 port 41619 after 0 ms". Một bạn khác gọi máy khác thì nhận "curl: (28) Connection timed out after 3002 milliseconds". Cách hiểu nào đúng?',
        options: [
          '(7): the machine answered but nothing listens on that port; (28): packets got no answer at all (firewall, wrong IP)|||(7): máy có trả lời nhưng không ai nghe cổng đó; (28): gói tin không nhận được trả lời nào (tường lửa, sai IP)',
          'Both mean the API returned 500|||Cả hai đều nghĩa là API trả 500',
          '(7) is a TLS error, (28) is a DNS error|||(7) là lỗi TLS, (28) là lỗi DNS',
          'Both mean the server is slow and need a larger timeout|||Cả hai đều nghĩa là server chậm, cần tăng thời hạn',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Below HTTP there is no status code. Refused (7) is fast: the target kernel rejected the connection, so the process is down or bound elsewhere. Timeout (28) is slow: packets vanish — firewall, security group, wrong IP (lesson 6.1).|||VI: Dưới tầng HTTP thì không có mã trạng thái. Bị từ chối (7) đến ngay: nhân hệ điều hành máy đích từ chối kết nối, nên tiến trình đã chết hoặc nghe chỗ khác. Hết giờ (28) thì chậm: gói tin biến mất — tường lửa, security group, sai IP (bài 6.1).',
      },
      {
        question: 'Users get 502 on /api/header-to. The Node app log for that request says status 200. What do you check next?|||Người dùng nhận 502 ở /api/header-to. Log app Node của đúng request đó ghi status 200. Bạn xem gì tiếp?',
        options: [
          'Nothing — the app says 200, so the user is wrong|||Không cần — app ghi 200 nên người dùng nhầm',
          'The database slow query log|||Log truy vấn chậm của cơ sở dữ liệu',
          'The nginx error.log line for that request (here: "upstream sent too big header")|||Dòng error.log của nginx cho request đó (ở đây: "upstream sent too big header")',
          'Restart the browser|||Khởi động lại trình duyệt',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: 502 is written by the proxy, so its error log names the cause. In lesson 6.1 the app answered 200 with a 16 KB header; nginx refused it (proxy_buffer_size) and returned 502. Never close a 502 by reading only the app log.|||VI: 502 do proxy viết, nên error log của proxy gọi tên nguyên nhân. Ở bài 6.1 app trả 200 kèm một header 16 KB; nginx từ chối (proxy_buffer_size) và trả 502. Đừng bao giờ đóng một ticket 502 chỉ bằng việc đọc log app.',
      },
      {
        question: 'A "send invoice email" endpoint sometimes returns 504 after exactly 60 s. Users click again. What is the most likely consequence?|||Endpoint "gửi email hoá đơn" thỉnh thoảng trả 504 sau đúng 60 s. Người dùng bấm lại. Hậu quả dễ xảy ra nhất là gì?',
        options: [
          'Nothing happened the first time, so no duplicates|||Lần đầu chưa có gì xảy ra, nên không trùng',
          'Duplicate emails: the app kept working after nginx gave up, so the first send may still have completed|||Email bị gửi trùng: app vẫn làm tiếp sau khi nginx bỏ cuộc, nên lần gửi đầu có thể vẫn hoàn tất',
          'The browser automatically cancels the first request on the server|||Trình duyệt tự huỷ request đầu tiên trên server',
          'nginx retries the request for the user|||nginx tự gửi lại request giúp người dùng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: 504 means the proxy stopped waiting (proxy_read_timeout), not that the work stopped. In lesson 6.1 the app finished after nginx had already returned 504. Make such operations idempotent and move slow work to a background job.|||VI: 504 nghĩa là proxy thôi chờ (proxy_read_timeout), không phải việc đã dừng. Ở bài 6.1 app làm xong sau khi nginx đã trả 504. Hãy làm thao tác đó idempotent và chuyển việc chậm sang job chạy nền.',
      },
      {
        question: 'Three 404 responses all carry "Server: nginx/1.27.5". Bodies: (a) {"loi":"Không có phòng 999"} (b) {"loi":"Không có tuyến GET /api/phongg"} (c) an HTML page ending in "nginx/1.27.5". Which statement is right?|||Ba response 404 đều có "Server: nginx/1.27.5". Body: (a) {"loi":"Không có phòng 999"} (b) {"loi":"Không có tuyến GET /api/phongg"} (c) một trang HTML có "nginx/1.27.5" ở cuối. Câu nào đúng?',
        options: [
          'All three come from nginx because of the Server header|||Cả ba do nginx trả vì có header Server',
          'All three mean the record does not exist|||Cả ba đều nghĩa là bản ghi không tồn tại',
          '(c) comes from the app, (a) and (b) from nginx|||(c) do app trả, (a) và (b) do nginx trả',
          '(a) missing data, (b) wrong route, both from the app; (c) from nginx — the request never reached the app|||(a) thiếu dữ liệu, (b) sai tuyến, cả hai do app trả; (c) do nginx trả — request chưa hề tới app',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A proxy adds its Server header to every response it relays, so the header does not tell who answered. The body does: the app\'s JSON format vs nginx\'s HTML page (lesson 6.1).|||VI: Proxy gắn header Server cho mọi response nó chuyển qua, nên header đó không cho biết ai trả lời. Body mới cho biết: JSON đúng kiểu của app khác với trang HTML của nginx (bài 6.1).',
      },
      {
        question: 'curl -d \'{"phong":401,…}\' http://…/api/dat-cho returns 400 "Thiếu trường…", while the same JSON in Postman (raw, JSON) returns 201. Why?|||curl -d \'{"phong":401,…}\' http://…/api/dat-cho trả 400 "Thiếu trường…", còn đúng JSON đó trong Postman (raw, JSON) trả 201. Vì sao?',
        options: [
          '-d sends Content-Type: application/x-www-form-urlencoded, so the server did not parse the body as JSON|||-d gửi Content-Type: application/x-www-form-urlencoded, nên server không đọc body như JSON',
          'curl cannot send JSON|||curl không gửi được JSON',
          'Postman adds the missing fields automatically|||Postman tự thêm các trường còn thiếu',
          'The server blocks the curl User-Agent|||Server chặn User-Agent của curl',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: The server reads the body according to Content-Type. curl -v shows "> Content-Type: application/x-www-form-urlencoded"; --json sets application/json (lesson 6.2). A browser fetch with a string body sends text/plain (Lab 6.5).|||VI: Server đọc body theo Content-Type. curl -v cho thấy "> Content-Type: application/x-www-form-urlencoded"; --json đặt application/json (bài 6.2). fetch của trình duyệt với body chuỗi thì gửi text/plain (Lab 6.5).',
      },
      {
        question: 'You copied a failing request from DevTools with "Copy as cURL": 15 headers and 9 cookies. What is the best next step?|||Bạn chép một request hỏng từ DevTools bằng "Copy as cURL": 15 header và 9 cookie. Bước tiếp theo tốt nhất là gì?',
        options: [
          'Paste it unchanged into the public ticket|||Dán nguyên văn vào ticket công khai',
          'Remove headers one at a time, keeping each removal if the result stays the same, until a minimal request remains; mask secrets|||Xoá từng header một, giữ việc xoá nếu kết quả không đổi, cho tới khi còn request tối giản; che bí mật',
          'Rewrite it from memory in Postman|||Viết lại theo trí nhớ trong Postman',
          'Add -k to make it work|||Thêm -k cho chạy được',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Reducing header by header is the diagnosis: the header whose removal flips the result is part of the bug (Lab 6.5: Content-Type, Cookie). The raw copy contains cookies and tokens — mask before sharing (lesson 6.2).|||VI: Rút gọn từng header một chính là chẩn đoán: header nào xoá đi mà kết quả đổi thì nó là một phần của lỗi (Lab 6.5: Content-Type, Cookie). Bản chép thô chứa cookie và token — che trước khi chia sẻ (bài 6.2).',
      },
      {
        question: 'Spring returns {"id":1864276489217638401,…}. The front end opens the detail page with id 1864276489217638400 and gets 404. What is the best contract fix?|||Spring trả {"id":1864276489217638401,…}. Front-end mở trang chi tiết với id 1864276489217638400 và nhận 404. Cách sửa hợp đồng tốt nhất là gì?',
        options: [
          'Use parseFloat instead of JSON.parse|||Dùng parseFloat thay cho JSON.parse',
          'Add 1 to every id in the front end|||Cộng 1 vào mọi id ở front-end',
          'Send the id as a JSON string (e.g. @JsonFormat(shape = STRING)), like Twitter\'s id_str|||Gửi id dạng chuỗi JSON (ví dụ @JsonFormat(shape = STRING)), giống id_str của Twitter',
          'Switch the database to smaller ids next sprint|||Đổi cơ sở dữ liệu sang id nhỏ hơn vào sprint sau',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: JS numbers are exact only up to 2^53 − 1; JSON.parse rounds the 64-bit id to the nearest double. Strings keep every digit for every client. A consumer you control can also read ctx.source in a JSON.parse reviver (lesson 6.3).|||VI: Số JS chỉ chính xác tới 2^53 − 1; JSON.parse làm tròn id 64 bit về số double gần nhất. Chuỗi giữ đủ chữ số cho mọi client. Phía dùng mà bạn kiểm soát cũng có thể đọc ctx.source trong reviver của JSON.parse (bài 6.3).',
      },
      {
        question: 'The booking form sends "2026-11-26T08:00" (no offset). On the developer\'s laptop the booking shows 08:00; in production it shows 15:00 for users in Vietnam. Why?|||Form đặt lượt gửi "2026-11-26T08:00" (không có độ lệch). Trên laptop của dev lượt hiện 08:00; trên production người dùng Việt Nam thấy 15:00. Vì sao?',
        options: [
          'The production database is slow|||Cơ sở dữ liệu production chậm',
          'The string is parsed in the time zone of the machine running the code: UTC+7 on the laptop, UTC on the server|||Chuỗi được hiểu theo múi giờ của máy đang chạy mã: UTC+7 trên laptop, UTC trên server',
          'Browsers always add 7 hours|||Trình duyệt luôn cộng 7 tiếng',
          'nginx rewrites the time|||nginx viết lại giờ',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Without an offset the value is "local time" — local to whichever process parses it. Send instants with Z or +07:00, convert in the browser with toISOString(), reject offset-less strings in the API (lesson 6.3, BUG-602).|||VI: Không có độ lệch thì giá trị là "giờ địa phương" — địa phương của tiến trình nào đọc nó. Gửi thời điểm kèm Z hoặc +07:00, đổi ở trình duyệt bằng toISOString(), API từ chối chuỗi không có độ lệch (bài 6.3, BUG-602).',
      },
      {
        question: 'Network shows: POST /api/dat-cho/1/ghi-chu/ → 301, then GET /api/dat-cho/1/ghi-chu → 200. The UI says "saved", nothing is saved. What happened?|||Network hiện: POST /api/dat-cho/1/ghi-chu/ → 301, rồi GET /api/dat-cho/1/ghi-chu → 200. Giao diện báo "đã lưu", không có gì được lưu. Chuyện gì đã xảy ra?',
        options: [
          'The API saved it twice|||API đã lưu hai lần',
          'The browser cache returned an old response|||Cache của trình duyệt trả response cũ',
          'CORS blocked the POST|||CORS chặn POST',
          'A trailing-slash rewrite answered the POST with 301; the browser followed it as a GET, which only reads the note|||Một quy tắc bỏ dấu / cuối trả 301 cho POST; trình duyệt đi theo bằng GET, vốn chỉ đọc ghi chú',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: After 301/302 browsers (and curl -L) change POST to GET and drop the body. Keep API URLs out of SEO rewrites; if a redirect is needed, 307/308 preserve method and body (Lab 6.5, BUG-603).|||VI: Sau 301/302, trình duyệt (và curl -L) đổi POST thành GET và bỏ body. Đừng để URL của API dính rewrite SEO; nếu thật sự cần chuyển hướng, 307/308 giữ nguyên method và body (Lab 6.5, BUG-603).',
      },
      {
        question: 'A customer\'s reference code is found only in the Node gateway log ("hoa-don returned 500"); the Spring log has the stack trace but with rid=-. Which pair of fixes addresses both problems?|||Mã tham chiếu của khách chỉ tìm thấy trong log cổng Node ("hoa-don trả 500"); log Spring có stack trace nhưng rid=-. Cặp sửa nào giải quyết cả hai vấn đề?',
        options: [
          'Forward X-Request-Id on Node\'s outgoing fetch, and handle exceptions in @RestControllerAdvice so they are logged while MDC still holds the id|||Chuyền X-Request-Id trong lời gọi fetch đi ra của Node, và bắt ngoại lệ trong @RestControllerAdvice để chúng được ghi khi MDC còn giữ id',
          'Increase the log level to DEBUG everywhere|||Tăng mức log lên DEBUG ở mọi nơi',
          'Generate a new id in every service|||Sinh id mới ở mọi dịch vụ',
          'Search by timestamp instead|||Tìm theo giờ thay thế',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: The id stops at the first hop that does not forward it, and Tomcat logs uncaught exceptions after the filter has cleared MDC (lesson 6.4: before/after runs). Generating new ids per service is exactly the bug.|||VI: Id dừng ở chặng đầu tiên không chuyền nó, và Tomcat ghi ngoại lệ không bắt sau khi filter đã xoá MDC (bài 6.4: lần chạy trước/sau). Mỗi dịch vụ tự sinh id mới chính là lỗi.',
      },
    ],
  },
};
