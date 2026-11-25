/**
 * 10.11 — Kiểm tra Chương 10 (soạn 24/11/2026). 12 câu; mọi đáp số dựa trên output thật của OUT['s10/*'].
 * Phân bố đáp án: A ×3 (2, 7, 11) · B ×3 (1, 5, 10) · C ×3 (3, 8, 12) · D ×3 (4, 6, 9).
 */
export default {
  title: '10.11 — Chapter 10 quiz|||10.11 — Kiểm tra Chương 10',
  slug: 'log-10-11-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười hai câu: ai sinh ra 499/502/504, urt=- nghĩa là gì, đọc rt và urt, connect() failed (111), jq dừng ở dòng không phải JSON, request id giữa nginx và app, chuỗi Caused by của Java, placeholder {} của SLF4J, MDC qua @Async, additivity, Log4Shell và log-api vs log-core, chèn log bằng ký tự xuống dòng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Web server and application logs</h2>
<p class="lead">Twelve questions built on the real output of this chapter's lab. Think about which component wrote each line before you answer.</p>
<h3>Self-check before you start</h3>
<ul>
<li>For any status code I can say who produced it and which log I open next.</li>
<li>I can tell "slow in the app" from "slow to the client" with rt and urt.</li>
<li>I can follow one request id from nginx into a Node or Spring log.</li>
<li>I read Java stack traces from the last "Caused by".</li>
<li>I can configure Logback appenders, levels, MDC and rolling files, and I know the SLF4J traps.</li>
<li>I can explain Log4Shell and find its traces; I recognise scanners, password spraying and log injection.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Log web server và log ứng dụng</h2>
<p class="lead">Mười hai câu dựa trên output thật của lab trong chương. Trước khi trả lời, hãy nghĩ xem thành phần nào đã viết ra dòng đó.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Với bất kỳ mã trạng thái nào, tôi nói được ai sinh ra nó và tiếp theo phải mở log nào.</li>
<li>Tôi phân biệt được "chậm trong app" với "chậm khi gửi về khách" bằng rt và urt.</li>
<li>Tôi lần theo được một request id từ nginx sang log Node hoặc Spring.</li>
<li>Tôi đọc stack trace Java từ dòng "Caused by" cuối cùng.</li>
<li>Tôi cấu hình được appender, mức log, MDC và rolling file của Logback, và biết các bẫy của SLF4J.</li>
<li>Tôi giải thích được Log4Shell và tìm được dấu vết của nó; tôi nhận ra máy quét, password spraying và chèn log.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1080,
    questions: [
      {
        question: 'An nginx access line ends with "499 0 … rt=0.500 urt=0.500". What happened?|||Một dòng access của nginx kết thúc bằng "499 0 … rt=0.500 urt=0.500". Chuyện gì đã xảy ra?',
        options: [
          'The app returned an error code 499 after 0.5 s|||App trả mã lỗi 499 sau 0,5 giây',
          'The client closed the connection after 0.5 s, before nginx could answer|||Khách đóng kết nối sau 0,5 giây, trước khi nginx kịp trả lời',
          'nginx’s proxy_read_timeout of 0.5 s expired|||proxy_read_timeout 0,5 giây của nginx hết hạn',
          'A rate limit rejected the request|||Giới hạn tốc độ đã từ chối request',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: 499 is nginx-only: client closed request. The upstream time equals the request time because nginx stopped the upstream request when the client left. A timeout would be 504; a rate limit 429/503 with urt=-.|||VI: 499 là mã riêng của nginx: khách đóng request. Thời gian upstream bằng thời gian request vì nginx dừng request sang upstream khi khách bỏ đi. Hết giờ chờ sẽ là 504; giới hạn tốc độ là 429/503 với urt=-.',
      },
      {
        question: 'In Lab 10, a burst of 502s comes with "connect() failed (111: Connection refused) while connecting to upstream". The most likely cause is…|||Trong Lab 10, một loạt 502 đi kèm "connect() failed (111: Connection refused) while connecting to upstream". Nguyên nhân khả dĩ nhất là…',
        options: [
          'Nothing is listening on the app port — the app crashed or is restarting|||Không có gì lắng nghe ở cổng app — app đã sập hoặc đang khởi động lại',
          'The app is slow and nginx gave up waiting|||App chậm và nginx đã thôi chờ',
          'The client sent a body that was too large|||Khách gửi body quá lớn',
          'DNS cannot resolve the upstream name|||DNS không phân giải được tên upstream',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: errno 111 = ECONNREFUSED: the host answered "no listener". In the lab the Node process had died from an unhandled rejection and restarted 3 s later. Slow app = 504 "upstream timed out (110)"; large body = 413.|||VI: errno 111 = ECONNREFUSED: máy trả lời "không có ai lắng nghe". Trong lab, tiến trình Node đã chết vì một rejection không được xử lý và khởi động lại sau 3 giây. App chậm = 504 "upstream timed out (110)"; body quá lớn = 413.',
      },
      {
        question: 'A line shows rt=2.400 urt=0.020 with status 200. Where did most of the time go?|||Một dòng ghi rt=2.400 urt=0.020 với mã 200. Phần lớn thời gian đã tiêu vào đâu?',
        options: [
          'In the app’s database query|||Vào câu truy vấn CSDL của app',
          'In nginx’s rate limiting queue|||Vào hàng đợi giới hạn tốc độ của nginx',
          'Between nginx and the client: slow network, large response or a slow-reading client|||Giữa nginx và khách: mạng chậm, phản hồi lớn hoặc khách đọc chậm',
          'In DNS resolution of the upstream|||Vào việc phân giải DNS của upstream',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The app answered in 20 ms (urt). rt ≫ urt means the time was spent receiving the request or sending the response to the client. The app team is not the place to start.|||VI: App trả lời trong 20 ms (urt). rt ≫ urt nghĩa là thời gian tiêu vào việc nhận request hoặc gửi phản hồi về khách. Không nên bắt đầu từ đội app.',
      },
      {
        question: 'jq -c \'select(.level >= 50) | .msg\' app.log prints 8 lines, then "parse error: Invalid numeric literal at line 109". What is the right conclusion?|||jq -c \'select(.level >= 50) | .msg\' app.log in 8 dòng, rồi "parse error: Invalid numeric literal at line 109". Kết luận đúng là gì?',
        options: [
          'There are exactly 8 errors in the file|||Tệp có đúng 8 lỗi',
          'The file is corrupted and must be restored from backup|||Tệp hỏng, phải khôi phục từ bản sao lưu',
          'pino wrote an invalid JSON number at line 109|||pino đã ghi một số JSON không hợp lệ ở dòng 109',
          'Line 109 is not JSON (a crash trace); results after it are missing — use jq -R \'fromjson?\' and count skipped lines|||Dòng 109 không phải JSON (một báo cáo sập); kết quả sau nó bị thiếu — dùng jq -R \'fromjson?\' và đếm số dòng bị bỏ',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Node printed a plain-text crash report into the same file. jq stops at the first non-JSON line, so the 8 results are only the part before the crash; with fromjson? the real count was 58 error records.|||VI: Node in báo cáo sập dạng chữ vào cùng tệp. jq dừng ở dòng không phải JSON đầu tiên, nên 8 kết quả chỉ là phần trước cú sập; với fromjson? con số thật là 58 bản ghi lỗi.',
      },
      {
        question: 'How did one grep find the same request in nginx access.log and in the Node app log?|||Vì sao chỉ một lệnh grep đã tìm thấy cùng một request trong access.log của nginx và log app Node?',
        options: [
          'Both logs use the same timestamp to the millisecond|||Hai log dùng cùng một mốc thời gian tới mili giây',
          'nginx generated $request_id, passed it as X-Request-Id, and pino-http used it as req.id|||nginx sinh $request_id, chuyển đi dưới dạng X-Request-Id, và pino-http dùng nó làm req.id',
          'The client IP is unique per request|||IP khách là duy nhất cho mỗi request',
          'Node reads nginx’s log file|||Node đọc tệp log của nginx',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: A shared request id is the "tracking number". Timestamps differ slightly between components and IPs repeat. In Spring the same idea is MDC requestId and the traceId from Micrometer Tracing.|||VI: Request id dùng chung chính là "mã vận đơn". Mốc thời gian giữa các thành phần lệch nhau chút ít, còn IP thì lặp lại. Trong Spring cùng ý tưởng đó là requestId trong MDC và traceId của Micrometer Tracing.',
      },
      {
        question: 'A Java stack trace: "OrderLoadException: cannot load order 13 … Caused by: IllegalStateException: bad price row … Caused by: NumberFormatException: For input string: "13.5"". What do you fix first?|||Một stack trace Java: "OrderLoadException: cannot load order 13 … Caused by: IllegalStateException: bad price row … Caused by: NumberFormatException: For input string: "13.5"". Bạn sửa cái gì trước?',
        options: [
          'OrderLoadException, because it is on top|||OrderLoadException, vì nó nằm trên cùng',
          'The Tomcat frames, because they are the most numerous|||Các khung Tomcat, vì chúng nhiều nhất',
          'IllegalStateException, because it is in the middle|||IllegalStateException, vì nó ở giữa',
          'The root cause: the value "13.5" where an integer was expected (a data problem)|||Nguyên nhân gốc: giá trị "13.5" ở chỗ cần số nguyên (một vấn đề dữ liệu)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Read Java chains from the last "Caused by" — the root cause. Upper exceptions are wrappers that add context. Then find the first frame in your own package for file and line.|||VI: Đọc chuỗi Java từ "Caused by" cuối cùng — nguyên nhân gốc. Các ngoại lệ phía trên là lớp bọc thêm ngữ cảnh. Sau đó tìm khung đầu tiên thuộc package của bạn để có tệp và dòng.',
      },
      {
        question: 'With the level at INFO, LogBench measured about 342 ms for log.debug("cart = " + cart) but about 0.1 ms for log.debug("cart = {}", cart). Why?|||Với mức INFO, LogBench đo được khoảng 342 ms cho log.debug("cart = " + cart) nhưng chỉ khoảng 0,1 ms cho log.debug("cart = {}", cart). Vì sao?',
        options: [
          'The concatenation builds the string (and calls toString) before debug() checks the level; the placeholder is only formatted if the line will be written|||Phép nối dựng chuỗi (và gọi toString) trước khi debug() kiểm tra mức; chỗ giữ chỗ chỉ được định dạng nếu dòng thật sự được ghi',
          'The first form writes to disk, the second does not|||Cách đầu ghi ra đĩa, cách sau thì không',
          'SLF4J caches the second form|||SLF4J lưu đệm cách thứ hai',
          'The JIT compiler cannot optimise string concatenation|||Trình biên dịch JIT không tối ưu được phép nối chuỗi',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Nothing was written in either case. Java evaluates arguments before the call, so "+" ran the expensive toString 200 000 times. Use {} placeholders; use isDebugEnabled() when computing the argument itself is expensive.|||VI: Cả hai trường hợp đều không ghi gì. Java tính đối số trước khi gọi hàm, nên "+" chạy toString đắt đỏ 200 000 lần. Dùng chỗ giữ chỗ {}; dùng isDebugEnabled() khi chính việc tính đối số đã đắt.',
      },
      {
        question: 'After an @Async call, the log line on thread mail-1 shows [rid=] (empty) while the request thread showed rid=req-c0ffee03. What is missing?|||Sau một lời gọi @Async, dòng log trên luồng mail-1 hiện [rid=] (rỗng) trong khi luồng request hiện rid=req-c0ffee03. Thiếu gì?',
        options: [
          'The MDC key was misspelled in the pattern|||Khoá MDC bị gõ sai trong pattern',
          'Logback does not support threads|||Logback không hỗ trợ đa luồng',
          'A TaskDecorator that copies the MDC map from the submitting thread to the pool thread|||Một TaskDecorator chép bảng MDC từ luồng giao việc sang luồng của pool',
          'An X-Request-Id header on the response|||Header X-Request-Id trên phản hồi',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: MDC lives in a ThreadLocal; work handed to another thread does not carry it. The lab ran the same app with MDC_DECORATOR=false to show exactly this.|||VI: MDC sống trong ThreadLocal; công việc giao sang luồng khác không mang theo nó. Lab đã chạy cùng app với MDC_DECORATOR=false để cho thấy đúng điều này.',
      },
      {
        question: 'Every line from MailService appears twice on the console. The logger has its own CONSOLE appender and root also uses CONSOLE. Fix?|||Mỗi dòng từ MailService xuất hiện hai lần trên console. Logger đó có appender CONSOLE riêng và root cũng dùng CONSOLE. Sửa thế nào?',
        options: [
          'Lower the root level to WARN|||Hạ mức của root xuống WARN',
          'Use AsyncAppender|||Dùng AsyncAppender',
          'Delete the CONSOLE appender everywhere|||Xoá appender CONSOLE ở mọi nơi',
          'Set additivity="false" on the MailService logger (or remove its own appender-ref)|||Đặt additivity="false" cho logger MailService (hoặc bỏ appender-ref riêng của nó)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Additivity (default true) passes each event to the parent’s appenders too. Turning it off stops the event at the child logger. Lowering root would hide other INFO logs.|||VI: Additivity (mặc định true) còn chuyển mỗi sự kiện lên appender của cha. Tắt nó đi thì sự kiện dừng ở logger con. Hạ mức root sẽ làm mất các log INFO khác.',
      },
      {
        question: 'A Spring Boot jar contains log4j-api-2.25.5.jar and log4j-to-slf4j-2.25.5.jar but no log4j-core. During a Log4Shell audit you answer…|||Một tệp jar Spring Boot chứa log4j-api-2.25.5.jar và log4j-to-slf4j-2.25.5.jar nhưng không có log4j-core. Trong đợt rà soát Log4Shell bạn trả lời…',
        options: [
          'Vulnerable — any jar named log4j is affected|||Có lỗ hổng — jar nào tên log4j cũng bị ảnh hưởng',
          'Not affected by CVE-2021-44228: the vulnerable lookup code is in log4j-core; these jars only route the Log4j API to SLF4J/Logback|||Không bị CVE-2021-44228: mã lookup có lỗ hổng nằm trong log4j-core; các jar này chỉ chuyển API Log4j sang SLF4J/Logback',
          'Affected only on Java 8|||Chỉ bị ảnh hưởng trên Java 8',
          'Safe only if the logs are JSON|||Chỉ an toàn nếu log ở dạng JSON',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Log4Shell is in log4j-core ≤ 2.14.1 (fully fixed through 2.17.1). log4j-api + log4j-to-slf4j is Spring Boot’s default bridge. Still keep dependencies up to date and check with mvn dependency:tree.|||VI: Log4Shell nằm ở log4j-core ≤ 2.14.1 (vá hoàn chỉnh qua tới 2.17.1). log4j-api + log4j-to-slf4j là cầu nối mặc định của Spring Boot. Vẫn phải cập nhật phụ thuộc và kiểm tra bằng mvn dependency:tree.',
      },
      {
        question: 'In the Log4Shell demo (container without network), what proved that log4j-core 2.14.1 was dangerous?|||Trong demo Log4Shell (container không có mạng), điều gì chứng minh log4j-core 2.14.1 nguy hiểm?',
        options: [
          'Logging a string replaced ${java:version} with the real Java version and made the logger open a TCP connection to port 1389|||Ghi log một chuỗi đã thay ${java:version} bằng phiên bản Java thật và khiến thư viện log mở kết nối TCP tới cổng 1389',
          'The JVM crashed|||JVM bị sập',
          'The log file grew very large|||Tệp log phình rất to',
          '2.14.1 printed an ERROR line for every message|||2.14.1 in một dòng ERROR cho mọi thông điệp',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lookups were evaluated on logged data; with ${jndi:ldap://…} the logger connected out (the listener received an LDAP bind). 2.17.1 logged the text literally and connected nowhere.|||VI: Lookup được tính trên dữ liệu được log; với ${jndi:ldap://…} thư viện log đã kết nối ra ngoài (tai nghe nhận một gói LDAP bind). 2.17.1 ghi nguyên văn và không kết nối đi đâu.',
      },
      {
        question: 'An attacker submits the username "bob\\n2026-11-24T03:00:00Z INFO login ok user=admin". Which logger output is fooled?|||Kẻ tấn công gửi tên đăng nhập "bob\\n2026-11-24T03:00:00Z INFO login ok user=admin". Output của logger nào bị lừa?',
        options: [
          'pino JSON — it writes the newline as is|||pino JSON — nó ghi nguyên ký tự xuống dòng',
          'Both, equally|||Cả hai, như nhau',
          'A plain-text logger writing "login failed user=%s": the newline creates a fake second line|||Logger dạng chữ ghi "login failed user=%s": ký tự xuống dòng tạo ra một dòng thứ hai giả',
          'Neither — logs cannot contain newlines|||Không cái nào — log không thể chứa ký tự xuống dòng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Log injection (CWE-117). JSON escapes \\n, so pino kept one record (level 40) with the forged text inside the user field. For text logs, escape CR/LF before writing; also escape HTML in log viewers.|||VI: Chèn log (CWE-117). JSON thoát \\n, nên pino giữ một bản ghi (mức 40) với đoạn chữ giả nằm trong trường user. Với log chữ, phải thoát CR/LF trước khi ghi; trình xem log cũng phải thoát HTML.',
      },
    ],
  },
};
