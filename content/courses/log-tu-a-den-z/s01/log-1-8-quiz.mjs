/**
 * 1.8 — Kiểm tra Chương 1 (soạn 22/11/2026). 10 câu tình huống; đáp số có lệnh đã chạy thật (OUT['s01/thoi-gian'], OUT['s01/muc-log']).
 * Phân bố đáp án: A ×2 (câu 2, 5) · B ×2 (4, 7) · C ×3 (1, 6, 9) · D ×3 (3, 8, 10).
 */
export default {
  title: '1.8 — Chapter 1 quiz|||1.8 — Kiểm tra Chương 1',
  slug: 'log-1-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười tình huống: epoch giây hay mili giây, bẫy date -u, giải mã PRI, mức của pino, máy tự khởi động lại xem log nào, RFC 3164 thiếu gì, bản xuất Windows kiểu Mỹ, nginx báo upstream timed out, 25 lỗi giống nhau, và chứng minh lệch đồng hồ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations you will meet for real. Every answer with a number was produced by a command in this chapter. Read the explanation after submitting — especially for questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the six fields of a log line and find them in a format I have never seen.</li>
<li>I can translate levels between syslog (0–7), Windows, pino (10–60) and PostgreSQL.</li>
<li>I can read RFC 3164, RFC 5424, JSON lines, logfmt and CEF, and pick a tool for each.</li>
<li>I can convert epoch seconds and milliseconds, and local times without a zone, to UTC correctly.</li>
<li>I can prove a clock offset with an event that two sources recorded.</li>
<li>I know where each kind of log lives and how to check how long it is kept.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống bạn sẽ gặp thật. Đáp án nào có con số đều do một lệnh trong chương này tạo ra. Đọc phần giải thích sau khi nộp — nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi tên được sáu trường của một dòng log và tìm ra chúng trong một định dạng chưa gặp bao giờ.</li>
<li>Tôi dịch được mức log giữa syslog (0–7), Windows, pino (10–60) và PostgreSQL.</li>
<li>Tôi đọc được RFC 3164, RFC 5424, JSON lines, logfmt, CEF và chọn được công cụ cho mỗi loại.</li>
<li>Tôi đổi đúng epoch giây, mili giây, và giờ địa phương không ghi múi giờ sang UTC.</li>
<li>Tôi chứng minh được độ lệch đồng hồ bằng một sự kiện mà hai nguồn cùng ghi.</li>
<li>Tôi biết mỗi loại log nằm ở đâu và kiểm được nó được giữ bao lâu.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'An app log has "time": 1795158253088. A teammate runs date -u -d @1795158253088 and gets "Wed Apr 19 14:18:08 UTC 58856". What happened?|||Log của app có "time": 1795158253088. Bạn cùng nhóm chạy date -u -d @1795158253088 và nhận "Wed Apr 19 14:18:08 UTC 58856". Chuyện gì đã xảy ra?',
        options: [
          'The server clock was wrong when the line was written, so the log is corrupt|||Đồng hồ server sai lúc ghi dòng đó, nên log bị hỏng',
          'date cannot handle dates after 2038 on 64-bit systems|||date không xử lý được ngày sau năm 2038 trên hệ 64-bit',
          'The value is in milliseconds; date expects seconds — divide by 1000 first|||Giá trị tính bằng mili giây; date chờ giây — phải chia 1000 trước',
          'The -u flag adds a UTC offset of several thousand years|||Cờ -u cộng thêm một độ lệch UTC vài nghìn năm',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Thirteen digits = milliseconds. date -u -d @1795158253 prints Fri Nov 20 07:04:13 UTC 2026. The 2038 problem concerns 32-bit seconds, and -u only chooses how to display, it adds nothing.|||VI: Mười ba chữ số = mili giây. date -u -d @1795158253 in ra Fri Nov 20 07:04:13 UTC 2026. Vấn đề năm 2038 là chuyện số giây 32-bit, còn -u chỉ chọn cách hiển thị, không cộng thêm gì.',
      },
      {
        question: 'An nginx error log line on a server in Vietnam reads "2026/11/20 14:05:15 [error] …". You run date -u -d "2026/11/20 14:05:15" +%FT%TZ and get 2026-11-20T14:05:15Z. What is the true UTC time?|||Một dòng error log nginx trên server ở Việt Nam ghi "2026/11/20 14:05:15 [error] …". Bạn chạy date -u -d "2026/11/20 14:05:15" +%FT%TZ và nhận 2026-11-20T14:05:15Z. Giờ UTC thật là bao nhiêu?',
        options: [
          '2026-11-20T07:05:15Z — with -u, date read the zone-less time as UTC; the local time must be stated with TZ="Asia/Ho_Chi_Minh"|||2026-11-20T07:05:15Z — với -u, date đọc giờ không múi giờ thành UTC; phải nói rõ giờ địa phương bằng TZ="Asia/Ho_Chi_Minh"',
          '2026-11-20T14:05:15Z — nginx always writes its error log in UTC|||2026-11-20T14:05:15Z — nginx luôn ghi error log theo UTC',
          '2026-11-20T21:05:15Z — Vietnam is 7 hours behind UTC, so add 7|||2026-11-20T21:05:15Z — Việt Nam chậm hơn UTC 7 giờ, nên cộng 7',
          'It cannot be known without the year, which the line does not contain|||Không biết được vì thiếu năm, mà dòng này không có năm',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: nginx error log times are server local time with no offset. Vietnam is UTC+7, so subtract 7 hours: putting TZ="Asia/Ho_Chi_Minh" inside the date string prints 07:05:15Z. The year is in the line (2026/11/20); it is the zone that is missing.|||VI: Giờ trong error log nginx là giờ địa phương của server, không có độ lệch. Việt Nam là UTC+7, nên trừ 7 giờ: đặt TZ="Asia/Ho_Chi_Minh" ngay trong chuỗi ngày giờ thì in ra 07:05:15Z. Năm có trong dòng (2026/11/20); cái thiếu là múi giờ.',
      },
      {
        question: 'A router sends syslog messages that start with <86>. What are the facility and severity?|||Một router gửi thông điệp syslog bắt đầu bằng <86>. Facility và severity là gì?',
        options: [
          'Facility 8 (uucp), severity 6 (info) — the first digit is the facility|||Facility 8 (uucp), severity 6 (info) — chữ số đầu là facility',
          'Facility 6, severity 8 — PRI is severity × 10 + facility|||Facility 6, severity 8 — PRI là severity × 10 + facility',
          'Severity 86 on a 0–100 scale: a critical alarm|||Severity 86 trên thang 0–100: báo động nghiêm trọng',
          'Facility 10 (authpriv), severity 6 (info) — PRI = facility × 8 + severity|||Facility 10 (authpriv), severity 6 (info) — PRI = facility × 8 + severity',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: 86 / 8 = 10 remainder 6 (the shell gives "facility 10, severity 6"). Reading digits separately is the tempting mistake; severity only goes 0–7.|||VI: 86 / 8 = 10 dư 6 (shell in ra "facility 10, severity 6"). Đọc từng chữ số riêng là sai lầm dễ mắc; severity chỉ chạy từ 0 tới 7.',
      },
      {
        question: 'A Node.js app uses pino. jq -r .level app.jsonl | sort | uniq -c prints "695 30", "22 40", "25 50". How many error records are there?|||Một app Node.js dùng pino. jq -r .level app.jsonl | sort | uniq -c in ra "695 30", "22 40", "25 50". Có bao nhiêu bản ghi lỗi?',
        options: [
          '695 — level 30 is the highest-priority group, like syslog 3 = err|||695 — mức 30 là nhóm ưu tiên cao nhất, giống syslog 3 = err',
          '25 — pino uses 50 for error (30 info, 40 warn); bigger means worse|||25 — pino dùng 50 cho error (30 info, 40 warn); số càng lớn càng tệ',
          '47 — warnings and errors together (22 + 25)|||47 — cảnh báo và lỗi cộng lại (22 + 25)',
          'None — JSON logs have no levels; those numbers are HTTP status codes divided by 10|||Không có — log JSON không có mức; các số đó là mã HTTP chia 10',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: pino: 10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal — the opposite direction to syslog, which is exactly why mixing the two scales misleads. Warnings are not errors.|||VI: pino: 10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal — ngược chiều với syslog, chính vì vậy trộn hai thang là dễ nhầm. Cảnh báo không phải lỗi.',
      },
      {
        question: 'Your Windows laptop restarted by itself at night. Which log do you open first?|||Laptop Windows của bạn tự khởi động lại trong đêm. Bạn mở nhật ký nào đầu tiên?',
        options: [
          'Windows Logs → System — power, kernel, drivers and updates write there|||Windows Logs → System — nguồn điện, nhân, driver và bản cập nhật ghi vào đó',
          'Windows Logs → Security — every restart is an audit event|||Windows Logs → Security — mỗi lần khởi động lại là một sự kiện kiểm toán',
          'Windows Logs → Application — the app that was open caused it|||Windows Logs → Application — app đang mở đã gây ra nó',
          'The browser history, to see what was being downloaded|||Lịch sử trình duyệt, để xem đang tải gì',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Unexpected restarts leave Kernel-Power 41, EventLog 6008, and for planned ones User32 1074 — all in the System log (Chapter 4). Security is about logons and permissions; apps rarely restart the machine.|||VI: Khởi động lại bất thường để lại Kernel-Power 41, EventLog 6008, còn khởi động lại có chủ đích là User32 1074 — đều ở nhật ký System (Chương 4). Security là chuyện đăng nhập và quyền; app hiếm khi khởi động lại máy.',
      },
      {
        question: 'Which line is in the old RFC 3164 syslog format, and what does it lack compared with RFC 5424?|||Dòng nào theo định dạng syslog cũ RFC 3164, và nó thiếu gì so với RFC 5424?',
        options: [
          '{"time":"2026-11-20T02:10:03+07:00","app":"sshd"} — it lacks a message|||{"time":"2026-11-20T02:10:03+07:00","app":"sshd"} — nó thiếu thông điệp',
          '<38>1 2026-11-20T02:10:03.512+07:00 web-01 sshd 41001 - - … — it lacks a host name|||<38>1 2026-11-20T02:10:03.512+07:00 web-01 sshd 41001 - - … — nó thiếu tên máy',
          '<38>Nov 20 02:10:03 web-01 sshd[41001]: … — it has no year and no time zone|||<38>Nov 20 02:10:03 web-01 sshd[41001]: … — nó không có năm và không có múi giờ',
          'CEF:0|OpenBSD|OpenSSH|9.6|… — it lacks a severity|||CEF:0|OpenBSD|OpenSSH|9.6|… — nó thiếu severity',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: RFC 3164 timestamps are "Mmm dd hh:mm:ss" — no year, no zone, no fraction. The second option is RFC 5424 (version "1" after PRI) and has the host web-01; the first is JSON and the last is CEF.|||VI: Thời điểm RFC 3164 có dạng "Mmm dd hh:mm:ss" — không năm, không múi giờ, không phần lẻ giây. Phương án thứ hai là RFC 5424 (số phiên bản "1" sau PRI) và có tên máy web-01; phương án đầu là JSON, phương án cuối là CEF.',
      },
      {
        question: 'An Event Viewer export made on a PC set to UTC+7 shows TimeCreated "11/20/2026 2:07:41 PM". What is it in UTC?|||Một bản xuất Event Viewer làm trên máy đặt UTC+7 ghi TimeCreated "11/20/2026 2:07:41 PM". Đổi ra UTC là bao nhiêu?',
        options: [
          '2026-11-20T14:07:41Z — Windows always stores and shows UTC|||2026-11-20T14:07:41Z — Windows luôn lưu và hiển thị UTC',
          '2026-11-20T07:07:41Z — exports show the viewing PC’s local time; subtract 7 hours|||2026-11-20T07:07:41Z — bản xuất hiện giờ địa phương của máy đang xem; trừ 7 giờ',
          '2026-11-11T07:07:41Z — 11/20 means the 11th, month 20 is rolled over|||2026-11-11T07:07:41Z — 11/20 nghĩa là ngày 11, tháng 20 bị tràn',
          '2026-11-20T21:07:41Z — add 7 hours to get UTC|||2026-11-20T21:07:41Z — cộng 7 giờ để ra UTC',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Windows stores UTC but Event Viewer and CSV exports display local time without a zone, US month/day order. PowerShell ConvertTimeToUtc with Asia/Ho_Chi_Minh prints 2026-11-20T07:07:41. Under Vietnamese culture "11/20/2026" is not even a valid date.|||VI: Windows lưu UTC nhưng Event Viewer và bản xuất CSV hiện giờ địa phương không ghi múi giờ, thứ tự tháng/ngày kiểu Mỹ. PowerShell ConvertTimeToUtc với Asia/Ho_Chi_Minh in ra 2026-11-20T07:07:41. Theo văn hoá Việt Nam, "11/20/2026" thậm chí không phải ngày hợp lệ.',
      },
      {
        question: 'nginx’s error log says "upstream timed out (110: Connection timed out) while reading response header from upstream … upstream: http://10.0.0.30:4000/…". Where do you look next?|||Error log nginx ghi "upstream timed out (110: Connection timed out) while reading response header from upstream … upstream: http://10.0.0.30:4000/…". Bạn xem tiếp ở đâu?',
        options: [
          'nginx’s own configuration — nginx crashed and must be restarted|||Cấu hình của chính nginx — nginx đã sập và phải khởi động lại',
          'The client’s browser, because the client disconnected too early|||Trình duyệt của máy khách, vì máy khách ngắt kết nối quá sớm',
          'The DNS server, because 10.0.0.30 could not be resolved|||Server DNS, vì 10.0.0.30 không phân giải được',
          'The app behind nginx at 10.0.0.30:4000 — it accepted the request but did not answer in time|||App đứng sau nginx ở 10.0.0.30:4000 — nó nhận request nhưng không trả lời kịp',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The source (nginx) is not the subject. nginx is working; the upstream did not send a response header within the timeout, so the app (and then what the app waits for, such as the database) is next. An IP address needs no DNS.|||VI: Nguồn (nginx) không phải chủ thể. nginx vẫn chạy; upstream không gửi phần đầu phản hồi trong thời gian chờ, nên tiếp theo là app (rồi thứ app đang chờ, như CSDL). Địa chỉ IP thì không cần DNS.',
      },
      {
        question: 'During an outage the app logged 25 errors in four minutes, all with msg "database query failed". What does that most likely mean?|||Trong một lần sự cố, app ghi 25 lỗi trong bốn phút, tất cả đều msg "database query failed". Điều đó nhiều khả năng nghĩa là gì?',
        options: [
          '25 separate bugs, one per request, each needing its own fix|||25 bug riêng biệt, mỗi request một cái, cái nào cũng cần sửa riêng',
          'The log is duplicated; only one error really happened|||Log bị ghi trùng; thật ra chỉ có một lỗi',
          'One cause producing a burst of identical errors — find the first one and its context|||Một nguyên nhân sinh ra một tràng lỗi giống hệt nhau — tìm lỗi đầu tiên và ngữ cảnh của nó',
          'The level is wrong; these must really be warnings|||Mức bị đặt sai; đây chắc chắn là cảnh báo',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Count by message, not only by level: identical messages in a short window usually share one root cause (here: the database server lost power). Each line had its own request id, so they are not duplicates.|||VI: Đếm theo thông điệp, đừng chỉ đếm theo mức: thông điệp giống nhau trong một khoảng ngắn thường chung một nguyên nhân gốc (ở đây: server CSDL mất điện). Mỗi dòng có request id riêng, nên không phải ghi trùng.',
      },
      {
        question: 'nginx on proxy-01 logs "no live upstreams" at 14:09:05, but the API’s own journal on api-01 shows it was down only from 14:06:02 to 14:06:07 (both Vietnam time). What is the best conclusion and next step?|||nginx trên proxy-01 ghi "no live upstreams" lúc 14:09:05, nhưng journal của chính API trên api-01 cho thấy nó chỉ chết từ 14:06:02 tới 14:06:07 (cả hai đều giờ Việt Nam). Kết luận và bước tiếp theo tốt nhất là gì?',
        options: [
          'The API crashed a second time at 14:09 without writing to its journal|||API sập lần thứ hai lúc 14:09 mà không ghi vào journal',
          'The journal is binary and therefore always correct; ignore nginx|||Journal là nhị phân nên luôn đúng; bỏ qua nginx',
          'nginx writes UTC, so 14:09 is really 21:09 Vietnam time|||nginx ghi UTC, nên 14:09 thật ra là 21:09 giờ Việt Nam',
          'proxy-01’s clock is probably about 3 minutes fast — confirm with more anchor events and timedatectl/chronyc on proxy-01|||Đồng hồ proxy-01 nhiều khả năng nhanh khoảng 3 phút — xác nhận bằng thêm sự kiện mốc và timedatectl/chronyc trên proxy-01',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: "No live upstreams" only fits the five seconds the API was down; shifting nginx by −180 s makes every nginx line match (the first timeout lands 60 s after the app’s first DB error). A format does not make a clock right, and a second crash would have left journal lines.|||VI: "No live upstreams" chỉ khớp với năm giây API chết; lùi nginx 180 giây thì mọi dòng nginx đều khớp (lần hết giờ đầu tiên rơi đúng 60 giây sau lỗi CSDL đầu tiên của app). Định dạng không làm đồng hồ đúng, và một lần sập thứ hai thì đã để lại dòng trong journal.',
      },
    ],
  },
};
