/**
 * 0.3 — Kiểm tra Mục 0 (soạn 22/11/2026). 10 câu: log để làm gì, metric/trace, lịch sử, sự cố có nguồn (Target, Equifax),
 * lab an toàn, gói log tất định, đạo đức/pháp lý, che dữ liệu. Phân bố: A ×3 (2, 6, 9) · B ×2 (1, 7) · C ×3 (3, 5, 10) · D ×2 (4, 8).
 */
export default {
  title: '0.3 — Section 0 quiz|||0.3 — Kiểm tra Mục 0',
  slug: 'log-0-3-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: log trả lời câu hỏi nào còn metric và trace trả lời câu nào, syslog và journald, bài học Target 2013 và Equifax 2017, dựng lab an toàn, vì sao gói log mẫu tự sinh, được đọc log của ai, dữ liệu cá nhân trong một dòng log, che trước khi chia sẻ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Before Chapter 1: check the foundations</h2>
<p class="lead">Ten short situations about why logs matter, where they came from, how to practise safely and what you may read. Read every explanation — they repeat the points that matter for the rest of the course.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the difference between a log, a metric and a trace with an everyday example.</li>
<li>I can name the main milestones from syslog to journald and OpenTelemetry.</li>
<li>I can say what Target 2013 and Equifax 2017 teach about logs and monitoring.</li>
<li>I have a lab (Linux environment + generated log pack) and know what I must not do on my real machine.</li>
<li>I know whose logs I may read and how to mask a line before sharing it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Trước Chương 1: kiểm lại phần nền</h2>
<p class="lead">Mười tình huống ngắn về vì sao log quan trọng, log từ đâu ra, luyện tập an toàn thế nào và được đọc những gì. Đọc kỹ mọi lời giải thích — chúng nhắc lại những điểm quan trọng cho cả khoá.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được log, metric, trace khác nhau ra sao bằng một ví dụ đời thường.</li>
<li>Tôi kể được các mốc chính từ syslog tới journald và OpenTelemetry.</li>
<li>Tôi nói được Target 2013 và Equifax 2017 dạy gì về log và giám sát.</li>
<li>Tôi đã có lab (môi trường Linux + gói log tự sinh) và biết không được làm gì trên máy thật.</li>
<li>Tôi biết được đọc log của ai và cách che một dòng trước khi chia sẻ.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      {
        question: 'An alert says "error rate 12% for 5 minutes". Which source tells you WHAT the errors were, for which user?|||Cảnh báo báo "tỉ lệ lỗi 12% trong 5 phút". Nguồn nào cho biết lỗi CỤ THỂ là gì, với người dùng nào?',
        options: [
          'The metric that fired the alert|||Chính metric đã kích hoạt cảnh báo',
          'The application log around that time|||Log của ứng dụng quanh thời điểm đó',
          'The CPU graph of the server|||Đồ thị CPU của server',
          'A trace of one random request from yesterday|||Trace của một request ngẫu nhiên hôm qua',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Metrics say THAT something is wrong (a number over time); logs say WHAT happened to whom; traces show where one request spent its time. Yesterday’s trace says nothing about today.|||VI: Metric nói CÓ chuyện (một con số theo thời gian); log nói CHUYỆN GÌ xảy ra với ai; trace cho thấy một request tốn thời gian ở đâu. Trace của hôm qua chẳng nói gì về hôm nay.',
      },
      {
        question: 'Which statement about the history of logging is correct?|||Câu nào về lịch sử ghi log là đúng?',
        options: [
          'syslog came from the Sendmail project in the 1980s; RFC 5424 (2009) standardised it with year and time zone|||syslog ra đời từ dự án Sendmail thập niên 1980; RFC 5424 (2009) chuẩn hoá nó với năm và múi giờ',
          'syslog was invented for Windows NT in 1993|||syslog được phát minh cho Windows NT năm 1993',
          'journald replaced Windows Event Log in 2011|||journald thay thế Windows Event Log năm 2011',
          'RFC 3164 (2001) is the newest syslog standard|||RFC 3164 (2001) là chuẩn syslog mới nhất',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Eric Allman wrote syslog for Sendmail in the 1980s; RFC 3164 (2001) only documented existing practice; RFC 5424 (2009) is the standard. Windows NT (1993) had its own event logs; journald (2011) is Linux systemd.|||VI: Eric Allman viết syslog cho Sendmail thập niên 1980; RFC 3164 (2001) chỉ ghi lại thực tế; RFC 5424 (2009) mới là chuẩn. Windows NT (1993) có event log riêng; journald (2011) thuộc systemd của Linux.',
      },
      {
        question: 'According to the US GAO report, what made Equifax’s network monitoring blind for months?|||Theo báo cáo của GAO (Mỹ), điều gì khiến hệ thống giám sát mạng của Equifax bị "mù" nhiều tháng?',
        options: [
          'Nobody had installed any monitoring device|||Không ai lắp thiết bị giám sát nào',
          'The logs were deleted every night by a cron job|||Log bị một cron job xoá mỗi đêm',
          'An expired digital certificate, so encrypted traffic passed without inspection|||Một chứng chỉ số hết hạn, nên lưu lượng mã hoá đi qua mà không bị soi',
          'The attackers turned off the power to the data centre|||Kẻ tấn công cắt điện trung tâm dữ liệu',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: GAO-18-559: the inspection device’s certificate had expired about 10 months before the breach; after renewal on 29 July 2017 the intrusion became visible. A monitor that silently stops is worse than none — you think you are watching.|||VI: GAO-18-559: chứng chỉ của thiết bị soi lưu lượng đã hết hạn khoảng 10 tháng trước vụ xâm nhập; thay xong ngày 29/07/2017 thì dấu hiệu lộ ra. Thiết bị giám sát âm thầm ngừng còn tệ hơn không có — vì bạn tưởng mình đang canh.',
      },
      {
        question: 'What is the main lesson of the Target 2013 breach for someone who reads logs?|||Bài học chính của vụ Target 2013 với người đọc log là gì?',
        options: [
          'Retail companies do not need security logs|||Công ty bán lẻ không cần log bảo mật',
          'Logs are only useful after a breach, never before|||Log chỉ có ích sau vụ xâm nhập, không bao giờ trước đó',
          'More logs always prevent attacks|||Càng nhiều log càng chắc chắn ngăn được tấn công',
          'The warnings existed but were not acted on — evidence nobody reads protects nobody|||Cảnh báo đã có mà không ai hành động — bằng chứng không ai đọc thì không bảo vệ được ai',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The US Senate committee staff report (March 2014) said Target failed to respond to multiple automated warnings from its anti-intrusion software. The issue was people and process, not missing data.|||VI: Báo cáo của ban nhân viên uỷ ban Thượng viện Mỹ (03/2014) nói Target đã không phản ứng trước nhiều cảnh báo tự động từ phần mềm chống xâm nhập. Vấn đề là con người và quy trình, không phải thiếu dữ liệu.',
      },
      {
        question: 'Lesson 5.5 will change the audit policy on Windows. What should you do first on your real laptop?|||Bài 5.5 sẽ đổi audit policy trên Windows. Bạn nên làm gì trước tiên trên laptop thật?',
        options: [
          'Clear all event logs so the new events are easier to see|||Xoá hết nhật ký sự kiện cho dễ nhìn sự kiện mới',
          'Disable Windows Defender to avoid interference|||Tắt Windows Defender để khỏi bị cản',
          'Create a restore point (or do it in a VM with a snapshot)|||Tạo một điểm khôi phục (hoặc làm trong máy ảo có snapshot)',
          'Nothing — audit policy changes cannot break anything|||Không cần gì — đổi audit policy không thể làm hỏng gì',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Read on your real machine, experiment only where you can undo. Clearing logs destroys evidence and is itself a suspicious event (1102); disabling protection is never part of a lab.|||VI: Trên máy thật thì đọc, chỉ thử nghiệm ở nơi hoàn tác được. Xoá log là huỷ bằng chứng và bản thân nó là sự kiện đáng ngờ (1102); tắt bảo vệ không bao giờ là một phần của lab.',
      },
      {
        question: 'Why does the course generate its sample log pack with a script instead of offering a zip of real logs?|||Vì sao khoá tự sinh gói log mẫu bằng script thay vì đưa một tệp zip log thật?',
        options: [
          'The script is deterministic (same bytes everywhere, so your numbers match the lessons) and uses only documentation IPs — no real person’s data|||Script tất định (mọi máy cùng từng byte, nên số của bạn khớp bài) và chỉ dùng IP dành cho tài liệu — không có dữ liệu người thật',
          'Real logs are too small to practise on|||Log thật quá nhỏ để luyện',
          'Zip files cannot contain text files|||Tệp zip không chứa được tệp chữ',
          'Python logs are faster to grep than nginx logs|||Log do Python sinh grep nhanh hơn log nginx',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Its own number generator makes every run identical, and all IPs come from RFC 5737 (192.0.2.x, 198.51.100.x, 203.0.113.x). Real logs would carry real people’s data. If a file looks wrong, regenerate it.|||VI: Bộ sinh số tự viết làm mọi lần chạy giống hệt nhau, và mọi IP lấy từ RFC 5737 (192.0.2.x, 198.51.100.x, 203.0.113.x). Log thật sẽ mang dữ liệu của người thật. Tệp trông sai thì sinh lại.',
      },
      {
        question: 'While on the university Wi-Fi you notice you can open the router’s admin page and its system log without a password. What should you do?|||Đang dùng Wi-Fi của trường, bạn thấy mở được trang quản trị router và system log của nó mà không cần mật khẩu. Bạn nên làm gì?',
        options: [
          'Read the logs to practise — it is not hacking if there is no password|||Đọc log để luyện — không có mật khẩu thì không phải hack',
          'Do not read or download anything; report it to the IT department|||Không đọc, không tải gì; báo cho phòng CNTT',
          'Download the logs and share them with classmates for the lab|||Tải log về và chia cho các bạn trong lớp để làm lab',
          'Change the admin password so nobody else can abuse it|||Đổi mật khẩu quản trị để người khác không lạm dụng được',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Reachable is not authorised. Accessing someone else’s system without permission may be an offence (Article 289, 2015 Penal Code); changing its password is even more clearly unauthorised. Report it.|||VI: Truy cập được không có nghĩa là được phép. Vào hệ thống của người khác khi chưa được phép có thể là tội (Điều 289 BLHS 2015); đổi mật khẩu của nó thì càng rõ là trái phép. Hãy báo lại.',
      },
      {
        question: 'Which list contains only personal data you can find in ONE nginx access-log line?|||Danh sách nào chỉ gồm dữ liệu cá nhân có thể thấy trong MỘT dòng access log nginx?',
        options: [
          'Full name, date of birth, phone number|||Họ tên, ngày sinh, số điện thoại',
          'Password, bank account, national ID|||Mật khẩu, tài khoản ngân hàng, số CCCD',
          'GPS location, contacts, photos|||Vị trí GPS, danh bạ, ảnh',
          'IP address, exact time of activity, pages visited, browser and OS|||Địa chỉ IP, thời điểm hoạt động chính xác, trang đã xem, trình duyệt và hệ điều hành',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A combined-format line holds IP, timestamp, request, status, referrer and User-Agent. Over time these reveal daily habits, which is why logs are personal data. Passwords must never be in logs at all.|||VI: Một dòng định dạng combined chứa IP, thời điểm, request, mã trạng thái, referrer và User-Agent. Gom theo thời gian, chúng lộ ra thói quen hằng ngày — vì thế log là dữ liệu cá nhân. Mật khẩu thì không bao giờ được có trong log.',
      },
      {
        question: 'A teammate needs to see three error lines from the production server. What is the right way to share them?|||Bạn cùng nhóm cần xem ba dòng lỗi từ server production. Chia sẻ thế nào là đúng?',
        options: [
          'Mask IPs, tokens and e-mails, then send only those three lines as text|||Che IP, token và email, rồi chỉ gửi đúng ba dòng đó dạng chữ',
          'Screenshot the whole terminal into the group chat|||Chụp cả màn hình terminal gửi vào nhóm chat',
          'Paste the full log file into a public AI chatbot and ask it|||Dán cả tệp log vào một chatbot AI công cộng rồi hỏi',
          'Upload the log to a public pastebin and send the link|||Đưa log lên một trang pastebin công khai rồi gửi link',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Least data, masked, as searchable text. Screenshots spread uncontrollably and often show more than intended; public tools may keep what you paste, including session tokens and customer data.|||VI: Ít dữ liệu nhất, đã che, dạng chữ tìm được. Ảnh chụp lan đi không kiểm soát và thường lộ nhiều hơn ý định; công cụ công cộng có thể giữ lại những gì bạn dán, kể cả token phiên và dữ liệu khách hàng.',
      },
      {
        question: 'You use WSL2 for the first chapters. What will be missing compared with a Linux virtual machine?|||Bạn dùng WSL2 cho các chương đầu. So với máy ảo Linux, cái gì sẽ thiếu?',
        options: [
          'journalctl — WSL can never run systemd|||journalctl — WSL không bao giờ chạy được systemd',
          'grep, awk and jq do not exist on WSL|||grep, awk và jq không có trên WSL',
          'A realistic boot, real SSH attacks and a separate network — good enough for Chapters 1–2, not for Chapter 8 labs|||Một lần khởi động như thật, các vụ dò SSH thật và mạng riêng — đủ cho Chương 1–2, không đủ cho lab Chương 8',
          'Nothing — WSL2 is identical to a VPS|||Không thiếu gì — WSL2 giống hệt một VPS',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Ubuntu installed with wsl --install runs systemd by default, so journalctl works, and the text tools are normal Linux tools. What WSL lacks is a real boot, real exposure and its own network — hence the VM from Chapter 7.|||VI: Ubuntu cài bằng wsl --install mặc định chạy systemd, nên journalctl dùng được, còn các công cụ chữ là công cụ Linux bình thường. Thứ WSL thiếu là quá trình khởi động thật, phơi ra ngoài thật và mạng riêng — vì thế từ Chương 7 mới cần máy ảo.',
      },
    ],
  },
};
