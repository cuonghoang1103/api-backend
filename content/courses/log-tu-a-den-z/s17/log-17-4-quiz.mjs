/**
 * 17.4 — Kiểm tra Chương 17 (soạn 24/11/2026, agent lgz). 10 câu tình huống kiểu phỏng vấn; số liệu từ output thật OUT['s17/tra-loi'] và các đoạn log của 17.2.
 * Phân bố đáp án: A ×2 (3, 8) · B ×3 (1, 5, 10) · C ×3 (2, 6, 9) · D ×2 (4, 7).
 */
export default {
  title: '17.4 — Chapter 17 quiz|||17.4 — Kiểm tra Chương 17',
  slug: 'log-17-4-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống kiểu phỏng vấn: bước đầu tiên khi web lỗi, đọc 502/504, lần thành công sau chuỗi thất bại, vì sao khởi động lại không cứu lỗi cấu hình, deadlock, MDC qua luồng, dữ liệu cá nhân trên query string, câu nói làm mất điểm, chọn chứng chỉ, và viết dòng CV.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Quiz</span>
<h2>Interviews and career</h2>
<p class="lead">Ten interview-style situations. For each one, pick the answer a senior engineer would be happy to hear — the one that names evidence and a next step.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can answer with the frame hypothesis → source → command → evidence/action.</li>
<li>I did the eight rounds of lesson 17.2 out loud with a timer.</li>
<li>I know which certification fits which path, and that a backend OJT needs none.</li>
<li>I have at least one CV line with a real number from my own lab.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Kiểm tra</span>
<h2>Phỏng vấn và nghề nghiệp</h2>
<p class="lead">Mười tình huống kiểu phỏng vấn. Với mỗi câu, chọn đáp án mà một kỹ sư senior nghe sẽ hài lòng — đáp án gọi tên bằng chứng và bước tiếp theo.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi trả lời được theo khung giả thuyết → nguồn → lệnh → bằng chứng/hành động.</li>
<li>Tôi đã làm tám vòng của bài 17.2 thành tiếng, có bấm giờ.</li>
<li>Tôi biết chứng chỉ nào hợp con đường nào, và OJT backend thì không cần cái nào.</li>
<li>Tôi có ít nhất một dòng CV chứa con số thật từ lab của chính mình.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Interviewer: "Users report the site is failing. What is the FIRST thing you do?"|||Người phỏng vấn: "Người dùng báo web lỗi. Việc ĐẦU TIÊN em làm là gì?"',
        options: [
          'Restart the application server so users are unblocked quickly|||Khởi động lại máy chủ ứng dụng để người dùng dùng lại được ngay',
          'Measure when it started and how big it is: count 5xx per time window in the access log|||Đo xem bắt đầu lúc nào và lớn cỡ nào: đếm 5xx theo khung giờ trong access log',
          'Turn on DEBUG logging everywhere and wait for it to happen again|||Bật DEBUG ở mọi nơi rồi chờ lỗi xảy ra lần nữa',
          'Ask the database team whether they changed anything|||Hỏi đội CSDL xem họ có đổi gì không',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Size and start time come first — they tell you whether it is one endpoint or everything, and which window to read in other logs. In 17.1: 137 errors, all in the 14:00 hour, 80×502 + 57×504. Restarting first destroys evidence; DEBUG everywhere costs and leaks.|||VI: Quy mô và thời điểm bắt đầu đi trước — chúng cho biết lỗi ở một endpoint hay toàn bộ, và cần đọc khung giờ nào ở các log khác. Ở 17.1: 137 lỗi, đều trong giờ 14, 80×502 + 57×504. Khởi động lại trước tiên là huỷ bằng chứng; bật DEBUG khắp nơi vừa tốn vừa lộ dữ liệu.',
      },
      {
        question: 'An access log shows a 504 with rt=5.000 urt=5.000, and error.log says "upstream timed out (110)". What is the best reading?|||Access log có một 504 với rt=5.000 urt=5.000, error.log ghi "upstream timed out (110)". Cách đọc đúng nhất?',
        options: [
          'The app process is down; nothing listens on the port|||Tiến trình app đã chết; không có gì nghe ở cổng',
          'The client closed the connection before the answer|||Máy khách đóng kết nối trước khi có câu trả lời',
          'The app accepted the request but did not answer within the 5-second proxy timeout; find what it was waiting for|||App đã nhận request nhưng không trả lời trong 5 giây timeout của proxy; tìm xem nó đang chờ cái gì',
          'nginx itself is overloaded and should get more workers|||Chính nginx quá tải và cần thêm worker',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: rt equal to the timeout plus "upstream timed out" = slow upstream (504). "Connection refused (111)" would be a dead app (502); a client closing early is nginx\'s 499. Raising the timeout hides the 504 but not the slowness.|||VI: rt bằng đúng ngưỡng timeout cộng "upstream timed out" = upstream chậm (504). "Connection refused (111)" mới là app chết (502); máy khách đóng sớm là mã 499 của nginx. Tăng timeout làm mất 504 nhưng không hết chậm.',
      },
      {
        question: 'auth.log: an IP failed 15 times (including usernames that do not exist), then "Accepted password for dev" from the same IP. What do you say first?|||auth.log: một IP sai 15 lần (cả với tên người dùng không tồn tại), rồi "Accepted password for dev" từ cùng IP. Bạn nói gì đầu tiên?',
        options: [
          'A password-guessing attack succeeded on account dev: contain it (lock dev, kill sessions), then scope what dev did after that time|||Dò mật khẩu đã thành công vào tài khoản dev: khoanh vùng (khoá dev, ngắt phiên), rồi xác định dev đã làm gì sau thời điểm đó',
          'Normal internet noise; block the IP and close the ticket|||Tiếng ồn Internet bình thường; chặn IP và đóng ticket',
          'A user forgot their password; reset it for them|||Người dùng quên mật khẩu; đặt lại giúp họ',
          'Nothing can be concluded without packet captures|||Không kết luận được gì nếu không có bản bắt gói tin',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: The success after the failures turns noise into an incident (round 5 of 17.2; T1110.001 then T1078). Blocking the IP alone leaves the attacker\'s session, keys or cron jobs in place.|||VI: Lần thành công sau chuỗi thất bại biến tiếng ồn thành sự cố (vòng 5 của 17.2; T1110.001 rồi T1078). Chỉ chặn IP thì phiên, khoá hay cron kẻ tấn công cài vẫn còn nguyên.',
      },
      {
        question: 'A container exits with code 1, OOMKilled=false, RestartCount=3, last log line "FATAL: missing environment variable DB_URL". The team wants to raise the restart limit to 10. Your answer?|||Một container thoát mã 1, OOMKilled=false, RestartCount=3, dòng log cuối "FATAL: thiếu biến môi trường DB_URL". Nhóm muốn nâng giới hạn khởi động lại lên 10. Bạn trả lời?',
        options: [
          'Good idea; the network may come back|||Ý hay; có thể mạng sẽ có lại',
          'Give it more memory instead|||Thay vào đó hãy cấp thêm RAM',
          'Switch the log driver to see more lines|||Đổi log driver để thấy thêm dòng',
          'Restarting cannot fix a configuration error; provide DB_URL and make the deploy fail fast|||Khởi động lại không sửa được lỗi cấu hình; cung cấp DB_URL và cho bước deploy báo lỗi ngay',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Exit 1 with the app\'s own FATAL message is a deliberate exit; it will fail identically every time. Memory would show exit 137 with OOMKilled=true.|||VI: Mã 1 kèm thông điệp FATAL của chính app là thoát có chủ đích; lần nào cũng hỏng y như vậy. Thiếu RAM thì sẽ thấy mã 137 với OOMKilled=true.',
      },
      {
        question: 'PostgreSQL logs "deadlock detected": process A locked account 1 then wanted 2; process B locked 2 then wanted 1. The best fix to propose?|||PostgreSQL ghi "deadlock detected": tiến trình A khoá tài khoản 1 rồi muốn 2; tiến trình B khoá 2 rồi muốn 1. Cách sửa nên đề xuất?',
        options: [
          'Increase max_connections|||Tăng max_connections',
          'Always lock rows in the same order, keep transactions short, and retry on SQLSTATE 40P01|||Luôn khoá các dòng theo cùng một thứ tự, giữ giao dịch ngắn, và thử lại khi gặp SQLSTATE 40P01',
          'Add more RAM to the database server|||Thêm RAM cho máy chủ CSDL',
          'Turn off log_lock_waits so the error disappears|||Tắt log_lock_waits để lỗi biến mất',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: A deadlock is an ordering problem, not a capacity one. PostgreSQL aborts one victim; consistent lock order removes the cycle and a retry covers the rare remaining case.|||VI: Deadlock là lỗi thứ tự, không phải thiếu tài nguyên. PostgreSQL huỷ một nạn nhân; khoá theo thứ tự thống nhất xoá vòng chờ, còn thử lại lo phần hiếm gặp còn sót.',
      },
      {
        question: 'In a Spring app, the controller\'s log line has requestId but the line written by an @Async mail sender does not. Why, and what fixes it?|||Trong app Spring, dòng log của controller có requestId nhưng dòng do bộ gửi mail @Async ghi thì không. Vì sao, sửa thế nào?',
        options: [
          'The JSON encoder drops fields from other classes; switch to plain text|||Encoder JSON bỏ trường của lớp khác; chuyển sang văn bản thường',
          'The mail sender logs at DEBUG; raise its level|||Bộ gửi mail log ở DEBUG; nâng mức lên',
          'MDC is per thread; copy it into executor threads with a TaskDecorator (or use tracing context propagation)|||MDC gắn theo luồng; chép nó sang luồng của executor bằng TaskDecorator (hoặc dùng cơ chế truyền ngữ cảnh của tracing)',
          'requestId only works with Logback, not with SLF4J|||requestId chỉ chạy với Logback, không chạy với SLF4J',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: In 17.2 round 6 both lines share req-c0ffee01 across http-nio-8080-exec-1 and mail-1 precisely because the executor copies the MDC.|||VI: Ở vòng 6 của 17.2, hai dòng có chung req-c0ffee01 qua luồng http-nio-8080-exec-1 và mail-1 chính vì executor đã chép MDC sang.',
      },
      {
        question: 'Your logger masks the email (a***@example.com), but the endpoint is POST /api/orders/7/confirm?email=an@example.com. Is there still a privacy problem?|||Logger của bạn đã che email (a***@example.com), nhưng endpoint là POST /api/orders/7/confirm?email=an@example.com. Còn vấn đề quyền riêng tư không?',
        options: [
          'No — masking in the app log is enough|||Không — che trong log app là đủ',
          'No — HTTPS encrypts the query string everywhere|||Không — HTTPS mã hoá query string ở mọi nơi',
          'Only if the database is not encrypted|||Chỉ khi CSDL không được mã hoá',
          'Yes — the full email is in the URL, so it lands in nginx/proxy access logs and browser history; move it to the body|||Có — email đầy đủ nằm trên URL nên rơi vào access log của nginx/proxy và lịch sử trình duyệt; chuyển nó vào body',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: HTTPS protects the URL on the wire, but the server, proxies and the browser still record it in clear. Secrets and personal data do not belong in URLs.|||VI: HTTPS bảo vệ URL trên đường truyền, nhưng máy chủ, proxy và trình duyệt vẫn ghi lại nó ở dạng rõ. Bí mật và dữ liệu cá nhân không thuộc về URL.',
      },
      {
        question: 'Which answer to "what is event ID for a failed Windows logon?" sounds best when you are not 100 % sure?|||Khi không chắc 100 %, câu trả lời nào cho "mã sự kiện đăng nhập Windows thất bại là gì?" nghe tốt nhất?',
        options: [
          '"I believe it is 4625; I would filter the Security log for failed logons and confirm, then look at the logon type and status code."|||"Em nghĩ là 4625; em sẽ lọc log Security theo đăng nhập thất bại để xác nhận, rồi xem logon type và mã status."',
          '"It is definitely 4624."|||"Chắc chắn là 4624."',
          '"I would ask ChatGPT."|||"Em sẽ hỏi ChatGPT."',
          '"Windows does not log failed logons."|||"Windows không ghi đăng nhập thất bại."',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Honest confidence plus a way to verify plus the next fields to read is what interviewers want. 4624 is a success; guessing confidently and wrongly loses more than saying "I believe".|||VI: Tự tin vừa phải + cách kiểm lại + các trường cần đọc tiếp là điều người phỏng vấn muốn nghe. 4624 là thành công; đoán chắc nịch mà sai mất điểm hơn nói "em nghĩ là".',
      },
      {
        question: 'A student aiming for a backend OJT at an outsourcing company asks which certification to buy first for "log skills". Best advice?|||Một sinh viên nhắm OJT backend ở công ty outsourcing hỏi nên mua chứng chỉ nào trước cho "kỹ năng log". Lời khuyên tốt nhất?',
        options: [
          'CySA+ CS0-004, because it is the newest|||CySA+ CS0-004, vì nó mới nhất',
          'SC-200, because every company uses Microsoft|||SC-200, vì công ty nào cũng dùng Microsoft',
          'None for now — a project with structured logs and request ids, plus an incident report on GitHub, is worth more; spend on English|||Chưa cần cái nào — một dự án có log cấu trúc và request id, cộng một báo cáo sự cố trên GitHub, đáng giá hơn; dành tiền cho tiếng Anh',
          'Buy exam dumps to pass several quickly|||Mua đề lộ (dump) để thi nhanh nhiều cái',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Security certifications fit SOC paths; for a backend fresher, demonstrable work matters most. Dumps violate exam agreements and teach nothing.|||VI: Chứng chỉ bảo mật hợp con đường SOC; với fresher backend, sản phẩm chứng minh được quan trọng nhất. Dump vi phạm cam kết thi và không dạy gì.',
      },
      {
        question: 'Which CV line is strongest?|||Dòng CV nào mạnh nhất?',
        options: [
          '"Skills: Event Viewer, Linux logs, ELK, Splunk."|||"Kỹ năng: Event Viewer, log Linux, ELK, Splunk."',
          '"Investigated a simulated SSH password-guessing attack from auth.log with grep/awk; found the successful login after 15 failures; wrote a containment plan (lab)."|||"Điều tra một vụ dò mật khẩu SSH giả lập từ auth.log bằng grep/awk; tìm ra lần đăng nhập thành công sau 15 lần sai; viết kế hoạch khoanh vùng (lab)."',
          '"Passionate about cybersecurity and logs."|||"Đam mê an ninh mạng và log."',
          '"Expert in all logging technologies."|||"Chuyên gia mọi công nghệ log."',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Action + tool + real number + result, honestly labelled "(lab)". It also gives the interviewer a concrete thing to ask about.|||VI: Hành động + công cụ + con số thật + kết quả, ghi trung thực "(lab)". Nó còn cho người phỏng vấn một điều cụ thể để hỏi tiếp.',
      },
    ],
  },
};
