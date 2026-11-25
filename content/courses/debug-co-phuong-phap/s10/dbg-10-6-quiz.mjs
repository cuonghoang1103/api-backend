/**
 * 10.6 — Kiểm tra Chương 10 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 10.1–10.5
 * (Node 22 + CDP, Spring Boot 4.1 + JDI, PostgreSQL 16, pino 9, nginx 1.27, Docker Compose). Phân bố đáp án: A2 B3 C2 D3.
 */
export default {
  title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra Chương 10',
  slug: 'dbg-10-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: breakpoint vào tiến trình Node đang phục vụ, Suspend All và Suspend Thread của IntelliJ, BEGIN READ WRITE vượt default_transaction_read_only, AND/OR thiếu ngoặc bị bắt nhờ đếm trước, recreate container xoá log, log DTO Java lộ mật khẩu, log debug tạm thời cho một người dùng, chia nhóm cờ bằng băm ổn định, canary 1,65% tổng thể nhưng 33% theo phiên bản, rollback mã mà để nguyên cờ (Knight Capital), histogram của app không thấy event loop bị chặn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a breakpoint on a server is an outage, in Node and in Java.</li>
<li>I can investigate with read-only access, and change data with a procedure that catches mistakes.</li>
<li>I take evidence before restarting, and I know what a recreate destroys.</li>
<li>I can add a temporary, scoped, safe debug log and remove it afterwards.</li>
<li>I know which lever to pull — flag, traffic, rollback — and what each one undoes.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao breakpoint trên server là một sự cố, ở Node lẫn Java.</li>
<li>Tôi điều tra được bằng quyền chỉ đọc, và sửa dữ liệu theo một quy trình bắt được sai sót.</li>
<li>Tôi lấy bằng chứng trước khi restart, và biết recreate phá huỷ những gì.</li>
<li>Tôi thêm được một log debug tạm thời, giới hạn phạm vi, an toàn, và gỡ nó đi sau đó.</li>
<li>Tôi biết kéo cần gạt nào — cờ, lưu lượng, rollback — và mỗi cái gỡ được gì.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A Node API runs with --inspect on production "just today". You set a breakpoint in GET /dat-lich/:id and look at a variable for five seconds. What happens to a user calling GET /health during those five seconds?|||Một API Node chạy với --inspect trên production "hôm nay thôi". Bạn đặt breakpoint trong GET /dat-lich/:id và xem một biến trong năm giây. Người dùng gọi GET /health trong năm giây đó gặp gì?',
        options: [
          'Nothing — /health is a different route|||Không gì cả — /health là route khác',
          'It is served by another worker thread|||Nó được một luồng worker khác phục vụ',
          'It waits, because the breakpoint stops the only JavaScript thread; with a 3 s timeout it gives up|||Nó phải chờ, vì breakpoint dừng luồng JavaScript duy nhất; với timeout 3 s thì bỏ cuộc',
          'It gets a 503 from Node immediately|||Nó nhận ngay 503 từ Node',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 10.1: 9/9 users including /health gave up after 3 s; after Continue the breakpoint stopped four more times on other users\' requests. A load balancer would mark the instance dead.|||VI: Bài 10.1: 9/9 người dùng kể cả /health bỏ cuộc sau 3 s; sau Continue, breakpoint dừng thêm bốn lần ở request của người khác. Load balancer sẽ đánh dấu instance đã chết.',
      },
      {
        question: 'In IntelliJ you remote-debug a Spring Boot service and set a breakpoint with the default settings. What stops?|||Trong IntelliJ bạn remote debug một dịch vụ Spring Boot và đặt breakpoint với thiết lập mặc định. Cái gì dừng?',
        options: [
          'Every thread of the JVM, including other requests and the actuator — Suspend: All is the default|||Mọi luồng của JVM, kể cả request khác và actuator — Suspend: All là mặc định',
          'Only the thread that hit the breakpoint|||Chỉ luồng chạm breakpoint',
          'Nothing until you press Pause|||Không gì cho tới khi bạn bấm Pause',
          'Only threads of the same controller|||Chỉ các luồng của cùng controller',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 10.1: Suspend All froze 36/36 threads; even the separate management port timed out. Suspend Thread kept /actuator/health alive but every user reaching the same line still stopped.|||VI: Bài 10.1: Suspend All treo 36/36 luồng; cả cổng quản trị riêng cũng hết giờ chờ. Suspend Thread giữ /actuator/health sống nhưng mọi người dùng chạm cùng dòng đó vẫn dừng.',
      },
      {
        question: 'The on-call role has default_transaction_read_only = on. Someone runs BEGIN READ WRITE; UPDATE … — what actually prevents the change?|||Vai trò của người trực có default_transaction_read_only = on. Có người chạy BEGIN READ WRITE; UPDATE … — thứ gì thật sự ngăn được lệnh đổi?',
        options: [
          'default_transaction_read_only — it cannot be overridden|||default_transaction_read_only — nó không ghi đè được',
          'Nothing — the UPDATE succeeds|||Không gì cả — UPDATE thành công',
          'statement_timeout|||statement_timeout',
          'The role only has pg_read_all_data, so the UPDATE fails with permission denied|||Vai trò chỉ có pg_read_all_data, nên UPDATE lỗi permission denied',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 10.1: BEGIN READ WRITE overrides the read-only default (a seat belt); the permission is the lock — "permission denied for table dat_lich".|||VI: Bài 10.1: BEGIN READ WRITE ghi đè mặc định chỉ đọc (dây an toàn); quyền mới là ổ khoá — "permission denied for table dat_lich".',
      },
      {
        question: 'Ticket: cancel 20 bookings of room 3 on the 25th and 26th. You count with "WHERE phong_id = 3 AND ngay = \'2026-11-25\' OR ngay = \'2026-11-26\'" and get 210. What is the right next step?|||Ticket: huỷ 20 lượt đặt của phòng 3 ngày 25 và 26. Bạn đếm bằng "WHERE phong_id = 3 AND ngay = \'2026-11-25\' OR ngay = \'2026-11-26\'" và ra 210. Bước tiếp theo đúng là gì?',
        options: [
          'Run the UPDATE — the ticket number was probably wrong|||Chạy UPDATE — chắc con số trong ticket sai',
          'Stop: AND binds tighter than OR; rewrite with IN, count again until it matches 20|||Dừng: AND gắn chặt hơn OR; viết lại bằng IN, đếm lại tới khi khớp 20',
          'Add LIMIT 20 to the UPDATE|||Thêm LIMIT 20 vào UPDATE',
          'Restore the database from last night\'s backup first|||Khôi phục cơ sở dữ liệu từ bản sao lưu đêm qua trước đã',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The count is there to disagree with the ticket. The WHERE meant "(room 3 on the 25th) or (any room on the 26th)". With IN it is 20; back up those rows, UPDATE … RETURNING, verify, second reader, COMMIT.|||VI: Phép đếm có mặt để bất đồng với ticket. Mệnh đề WHERE nghĩa là "(phòng 3 ngày 25) hoặc (mọi phòng ngày 26)". Dùng IN thì ra 20; sao lưu đúng những dòng đó, UPDATE … RETURNING, kiểm, người thứ hai đọc, COMMIT.',
      },
      {
        question: 'A service is stuck. You run "docker compose up -d --force-recreate" to restore it, then want to read why it got stuck. What do you find in "docker compose logs"?|||Một dịch vụ bị kẹt. Bạn chạy "docker compose up -d --force-recreate" để khôi phục, rồi muốn đọc vì sao nó kẹt. "docker compose logs" còn gì?',
        options: [
          'Everything — Docker keeps logs per service|||Mọi thứ — Docker giữ log theo dịch vụ',
          'Only the error lines|||Chỉ các dòng lỗi',
          'Only lines of the new container — the old container\'s log is gone with it|||Chỉ dòng của container mới — log của container cũ mất cùng nó',
          'The logs of the last 24 hours|||Log của 24 giờ gần nhất',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 10.1: zero of the five requests remained; only the file saved beforehand had "học kỳ không hợp lệ: HK0". One minute of evidence first: logs, docker inspect, a diagnostic report or thread dump.|||VI: Bài 10.1: không còn request nào trong năm request; chỉ tệp lưu từ trước còn dòng "học kỳ không hợp lệ: HK0". Một phút bằng chứng trước: log, docker inspect, báo cáo chẩn đoán hoặc thread dump.',
      },
      {
        question: 'A Spring controller logs log.info("login body={}", dto) where dto is a record DangNhap(String email, String matKhau). What ends up in the log?|||Một controller Spring log log.info("login body={}", dto) với dto là record DangNhap(String email, String matKhau). Thứ gì nằm trong log?',
        options: [
          'Only the class name|||Chỉ tên lớp',
          'The e-mail and the password in plain text — a record\'s toString() prints every field|||Email và mật khẩu dạng rõ — toString() của record in mọi trường',
          'Nothing — SLF4J masks fields named matKhau|||Không gì cả — SLF4J tự che trường tên matKhau',
          'A hash of the object|||Mã băm của đối tượng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 10.2: "body=DangNhap[email=…, matKhau=An@2005-fpt]". Log chosen fields with addKeyValue (email_hash, co_mat_khau), never the DTO; add redaction as a safety net.|||VI: Bài 10.2: "body=DangNhap[email=…, matKhau=An@2005-fpt]". Log các trường đã chọn bằng addKeyValue (email_hash, co_mat_khau), đừng log DTO; thêm redact làm lưới an toàn.',
      },
      {
        question: 'One student reports a wrong fee. Info-level logs show nothing useful. What is the best production-safe next step?|||Một sinh viên báo phí tính sai. Log mức info không có gì hữu ích. Bước kế tiếp tốt nhất mà an toàn cho production là gì?',
        options: [
          'Set the whole app to DEBUG until tomorrow|||Đặt cả ứng dụng ở DEBUG tới mai',
          'Attach a debugger with a conditional breakpoint on that student id|||Attach debugger với breakpoint điều kiện theo id sinh viên đó',
          'Ask the student to send their password so you can reproduce|||Nhờ sinh viên gửi mật khẩu để tái hiện',
          'Turn on debug for that one user for a few minutes, with an audit line, then read their request by request id|||Bật debug cho đúng người dùng đó vài phút, có dòng kiểm toán, rồi đọc request của họ theo request id',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 10.2: the scoped debug line showed khoa "K20-CLC", giamPhanTram 0 (Number("20-CLC") = NaN); other users got no debug lines and it switched itself off after 20 s.|||VI: Bài 10.2: dòng debug giới hạn phạm vi cho thấy khoa "K20-CLC", giamPhanTram 0 (Number("20-CLC") = NaN); người khác không có dòng debug nào và nó tự tắt sau 20 s.',
      },
      {
        question: 'A canary gets 5% of traffic. The dashboard shows 1.65% errors overall, below the 2% alert. What should you look at?|||Canary nhận 5% lưu lượng. Bảng theo dõi cho thấy tổng thể 1,65% lỗi, dưới ngưỡng cảnh báo 2%. Bạn nên nhìn vào đâu?',
        options: [
          'The error rate per version — the canary may be failing far more than the average shows|||Tỉ lệ lỗi theo từng phiên bản — canary có thể hỏng nhiều hơn hẳn con số trung bình',
          'Nothing — it is under the threshold|||Không gì cả — nó dưới ngưỡng',
          'The CPU of the database|||CPU của cơ sở dữ liệu',
          'Yesterday\'s error rate|||Tỉ lệ lỗi hôm qua',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 10.3: 2.3.1 had 0% errors, 2.4.0 had 33%. A canary is a comparison between groups at the same time; every response must say which version produced it.|||VI: Bài 10.3: 2.3.1 có 0% lỗi, 2.4.0 có 33%. Canary là phép so giữa các nhóm cùng lúc; mọi response phải nói rõ phiên bản nào tạo ra nó.',
      },
      {
        question: 'During an incident like Knight Capital\'s, the team rolls the new code back on all servers but leaves the reused flag on. What happens?|||Trong một sự cố kiểu Knight Capital, nhóm rollback mã mới trên mọi server nhưng để nguyên cờ đã bị tái dùng. Chuyện gì xảy ra?',
        options: [
          'The incident stops, because the new code is gone|||Sự cố dừng, vì mã mới đã bị gỡ',
          'Only the server that was missed keeps failing|||Chỉ server bị sót còn hỏng',
          'Nothing changes|||Không có gì thay đổi',
          'Every server now runs the old code path behind the flag, so it gets worse|||Mọi server giờ chạy đường mã cũ nằm sau cờ, nên tình hình tệ hơn',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 10.3: after the code rollback all 8 machines sent 10 million child orders; only switching the flag off stopped it. A rollback undoes code, not flags or data.|||VI: Bài 10.3: sau khi rollback mã, cả 8 máy gửi 10 triệu lệnh con; chỉ tắt cờ mới dừng được. Rollback gỡ mã, không gỡ cờ hay dữ liệu.',
      },
      {
        question: 'nginx shows 822 of 8,564 /phong requests slower than 250 ms, but the app\'s own histogram says all of them finished under 250 ms. nodejs_eventloop_lag_p99_ms is 184. What is the most likely explanation?|||nginx cho thấy 822 trên 8.564 request /phong chậm hơn 250 ms, nhưng histogram của chính ứng dụng nói tất cả xong dưới 250 ms. nodejs_eventloop_lag_p99_ms là 184. Giải thích khả dĩ nhất là gì?',
        options: [
          'nginx is slow|||nginx chậm',
          'Requests wait for a blocked event loop before the handler starts; the app timer only measures the handler|||Request phải chờ event loop đang bị chặn trước khi handler bắt đầu; đồng hồ của ứng dụng chỉ đo phần handler',
          'The network between nginx and the app drops packets|||Mạng giữa nginx và ứng dụng rớt gói',
          'The histogram buckets are wrong|||Các bucket của histogram sai',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 10.5: pbkdf2Sync for every calendar event blocked the only JavaScript thread, so every route on the instance waited. Measure latency at the edge and watch event-loop lag.|||VI: Bài 10.5: pbkdf2Sync cho mỗi sự kiện lịch chặn luồng JavaScript duy nhất, nên mọi route trên instance đó phải chờ. Đo độ trễ ở rìa và theo dõi event loop lag.',
      },
    ],
  },
};
