/**
 * 12.6 — Kiểm tra Chương 12 (soạn 24/11/2026, agent lgz). 8 câu; đáp số dựa trên output thật OUT['s12/*'].
 * Phân bố đáp án: A ×2 (2, 7) · B ×2 (1, 5) · C ×2 (3, 8) · D ×2 (4, 6).
 */
export default {
  title: '12.6 — Chapter 12 quiz|||12.6 — Kiểm tra Chương 12',
  slug: 'log-12-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Tám câu: collector làm docker logs im lặng, đọc phiên theo PID, 53300, log chậm so với pg_stat_statements, cái giá của ngưỡng 0, log_statement bỏ sót khối DO, mật khẩu lọt qua câu lỗi, và state của lỗi 18456.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Database logs</h2>
<p class="lead">Eight questions built on the real output of this chapter. For each one, ask: which log line — or which missing line — answers it?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can find any PostgreSQL log with <code>pg_current_logfile()</code>.</li>
<li>My <code>log_line_prefix</code> has user, database, application and client.</li>
<li>I can read a lock wait, a deadlock and a 53300.</li>
<li>I use the slow log for "which execution" and pg_stat_statements for "which query in total".</li>
<li>I know what <code>log_statement</code> misses and what pgAudit adds.</li>
<li>I can tell SQL Server's 18456 State 5 from State 8.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Log cơ sở dữ liệu</h2>
<p class="lead">Tám câu dựa trên output thật của chương này. Với mỗi câu, tự hỏi: dòng log nào — hay dòng log nào vắng mặt — trả lời được nó?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tìm được log PostgreSQL bất kỳ bằng <code>pg_current_logfile()</code>.</li>
<li><code>log_line_prefix</code> của tôi có người dùng, CSDL, ứng dụng và máy khách.</li>
<li>Tôi đọc được một lần chờ khoá, một deadlock và một 53300.</li>
<li>Tôi dùng slow log cho "lần chạy nào" và pg_stat_statements cho "câu nào tính tổng".</li>
<li>Tôi biết <code>log_statement</code> bỏ sót gì và pgAudit thêm được gì.</li>
<li>Tôi phân biệt được State 5 và State 8 của lỗi 18456 trong SQL Server.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'After ALTER SYSTEM SET logging_collector = on and a restart, `docker logs db` shows only "redirecting log output to logging collector process" and nothing new afterwards. What happened?|||Sau ALTER SYSTEM SET logging_collector = on và khởi động lại, `docker logs db` chỉ còn "redirecting log output to logging collector process" và không có gì mới sau đó. Chuyện gì đã xảy ra?',
        options: [
          'Logging is now disabled until pg_reload_conf() is called|||Log đã bị tắt cho tới khi gọi pg_reload_conf()',
          'PostgreSQL now writes its log to files under $PGDATA/log; stderr is no longer used for log lines|||PostgreSQL giờ ghi log vào tệp trong $PGDATA/log; stderr không còn dùng cho dòng log',
          'Docker\'s json-file driver stopped because the file reached max-size|||Driver json-file của Docker dừng vì tệp đạt max-size',
          'The collector sends logs to journald instead|||Collector gửi log sang journald',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In 12.1 the last two Docker lines were the redirect LOG and HINT ("Future log output will appear in directory log"); then ls log/ showed .log and .json files. Pick one path on purpose.|||VI: Ở 12.1, hai dòng cuối Docker thấy là LOG chuyển hướng và HINT ("Future log output will appear in directory log"); sau đó ls log/ có tệp .log và .json. Hãy chọn một đường có chủ đích.',
      },
      {
        question: 'A session log shows: "connection authenticated: identity="app" … connection authorized: user=app database=shopp … FATAL: database "shopp" does not exist". What do you tell the developer?|||Log một phiên có: "connection authenticated: identity="app" … connection authorized: user=app database=shopp … FATAL: database "shopp" does not exist". Bạn nói gì với lập trình viên?',
        options: [
          'The password is correct; the database name in the connection string is wrong|||Mật khẩu đúng; tên CSDL trong chuỗi kết nối sai',
          'The password is wrong|||Mật khẩu sai',
          'pg_hba.conf rejected the client IP|||pg_hba.conf từ chối IP máy khách',
          'The server is out of connection slots|||Máy chủ hết chỗ kết nối',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: "authenticated" means the password check passed. The client only saw "database does not exist"; the server log proves it is not a credentials problem (SQLSTATE 3D000, not 28P01).|||VI: "authenticated" nghĩa là kiểm mật khẩu đã qua. Máy khách chỉ thấy "database does not exist"; log máy chủ chứng minh không phải lỗi thông tin đăng nhập (SQLSTATE 3D000, không phải 28P01).',
      },
      {
        question: 'max_connections = 12, superuser_reserved_connections = 3, nine app sessions are open. The API gets "remaining connection slots are reserved for roles with the SUPERUSER attribute". Best first action on a real project?|||max_connections = 12, superuser_reserved_connections = 3, đang có chín phiên của ứng dụng. API nhận "remaining connection slots are reserved for roles with the SUPERUSER attribute". Việc nên làm đầu tiên ở dự án thật?',
        options: [
          'Grant SUPERUSER to the app role so it can use the reserved slots|||Cấp SUPERUSER cho vai trò ứng dụng để nó dùng chỗ dành riêng',
          'Restart PostgreSQL to drop all connections|||Khởi động lại PostgreSQL để cắt mọi kết nối',
          'Compute pool size × app instances and look for leaks or slow queries holding connections, before raising max_connections|||Tính kích thước pool × số bản chạy ứng dụng, tìm rò kết nối hoặc truy vấn chậm giữ kết nối, trước khi tăng max_connections',
          'Lower deadlock_timeout|||Giảm deadlock_timeout',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: 53300 is capacity: 9 normal slots were full. Raising max_connections costs memory per process; superuser for the app is a security hole (12.3). Fix the demand side first (pool, PgBouncer, slow queries).|||VI: 53300 là chuyện năng lực: 9 chỗ thường đã đầy. Tăng max_connections tốn bộ nhớ cho mỗi tiến trình; cho ứng dụng quyền siêu người dùng là lỗ hổng bảo mật (12.3). Sửa phía nhu cầu trước (pool, PgBouncer, truy vấn chậm).',
      },
      {
        question: 'With log_min_duration_statement = 50ms, a report job ran a 15 ms query 600 times and left 0 lines in the log. pg_stat_statements shows 9016 ms total for it, versus 88 ms for the one "slow" e-mail lookup. Conclusion?|||Với log_min_duration_statement = 50ms, một job báo cáo chạy câu 15 ms 600 lần và không để lại dòng nào trong log. pg_stat_statements ghi câu đó tốn tổng 9016 ms, so với 88 ms của câu tra email "chậm" duy nhất. Kết luận?',
        options: [
          'pg_stat_statements is wrong because the log has no lines|||pg_stat_statements sai vì log không có dòng nào',
          'Lower the threshold to 0 permanently|||Hạ ngưỡng về 0 vĩnh viễn',
          'The e-mail lookup is the bigger problem because it is the slowest|||Câu tra email là vấn đề lớn hơn vì nó chậm nhất',
          'The report query costs ~100× more DB time; the slow log cannot see frequent fast queries — use both tools|||Câu báo cáo tốn thời gian CSDL gấp ~100 lần; slow log không thấy câu nhanh chạy nhiều — dùng cả hai công cụ',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 12.2 step 4 — the "thousand small cuts". The log is per execution above a threshold; pg_stat_statements aggregates all executions.|||VI: Bài 12.2 bước 4 — "nghìn vết cắt nhỏ". Log là từng lần chạy vượt ngưỡng; pg_stat_statements cộng dồn mọi lần chạy.',
      },
      {
        question: 'Measured in 12.2 with pgbench: threshold -1 gave 64 960 tps; threshold 0 gave 40 874 tps and 9 + 9 MiB of log in 10 s. Which proposal follows from it?|||Đo ở 12.2 bằng pgbench: ngưỡng -1 cho 64 960 tps; ngưỡng 0 cho 40 874 tps và 9 + 9 MiB log trong 10 giây. Đề xuất nào rút ra được?',
        options: [
          'Use threshold 0 but only the JSON destination|||Dùng ngưỡng 0 nhưng chỉ ghi ra JSON',
          'Keep a realistic threshold, and use sampling (log_min_duration_sample + log_statement_sample_rate) or pg_stat_statements for the full picture|||Giữ ngưỡng hợp lý, và dùng lấy mẫu (log_min_duration_sample + log_statement_sample_rate) hoặc pg_stat_statements để có bức tranh toàn cảnh',
          'Turn off logging_collector to make logging free|||Tắt logging_collector để ghi log không tốn gì',
          'Increase max_connections to compensate|||Tăng max_connections để bù',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: −37% throughput and ~150 GB/day for lines saying "0.023 ms" — plus every parameter value in the log. Sampling keeps a view of all traffic at a fraction of the cost.|||VI: −37% thông lượng và ~150 GB/ngày cho những dòng ghi "0.023 ms" — cộng mọi giá trị tham số trong log. Lấy mẫu giữ được góc nhìn toàn bộ lưu lượng với một phần nhỏ chi phí.',
      },
      {
        question: 'log_statement = \'mod\'. Someone runs DO $$ BEGIN EXECUTE \'DELETE FROM \' || \'orders_old\' || \' WHERE id > 50\'; END $$; — 40 rows disappear. What does the log show, and what would have recorded it?|||log_statement = \'mod\'. Có người chạy DO $$ BEGIN EXECUTE \'DELETE FROM \' || \'orders_old\' || \' WHERE id > 50\'; END $$; — 40 dòng biến mất. Log ghi gì, và thứ gì lẽ ra ghi được nó?',
        options: [
          'A "statement: DELETE" line, because mod covers DELETE|||Một dòng "statement: DELETE", vì mod bao gồm DELETE',
          'An ERROR line with the statement|||Một dòng ERROR kèm câu lệnh',
          'A "statement: DO" line with the dynamic SQL expanded|||Một dòng "statement: DO" với câu SQL động đã được mở ra',
          'Nothing; pgAudit session audit (class write) would log the executed DELETE|||Không gì cả; pgAudit kiểm toán phiên (lớp write) sẽ ghi câu DELETE đã thực thi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: In 12.3 the table went from 90 to 50 rows with no log line; after enabling pgaudit.log = \'write, ddl, role\' the same pattern produced "AUDIT: SESSION,1,1,WRITE,DELETE,TABLE,public.orders_old,…".|||VI: Ở 12.3 bảng từ 90 còn 50 dòng mà log không có dòng nào; sau khi bật pgaudit.log = \'write, ddl, role\', cùng kiểu đó sinh ra "AUDIT: SESSION,1,1,WRITE,DELETE,TABLE,public.orders_old,…".',
      },
      {
        question: 'log_statement = \'none\', pgAudit loaded. A DBA types ALTER ROLE intern PASSWORD \'Secret-1\' VALID UNTL \'infinity\' (typo). Is the password in the log?|||log_statement = \'none\', đã nạp pgAudit. Một DBA gõ ALTER ROLE intern PASSWORD \'Secret-1\' VALID UNTL \'infinity\' (gõ sai). Mật khẩu có nằm trong log không?',
        options: [
          'Yes — the failing statement is written as STATEMENT: by log_min_error_statement = error (the default)|||Có — câu lỗi được ghi thành STATEMENT: do log_min_error_statement = error (mặc định)',
          'No — pgAudit redacts it|||Không — pgAudit che nó đi',
          'No — log_statement is none|||Không — log_statement là none',
          'Only in the JSON log|||Chỉ trong log JSON',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: In 12.3 the typo produced "STATEMENT: ALTER ROLE intern PASSWORD \'Intern-Moi-2026!\' VALID UNTL …" in both text and JSON logs. pgAudit never saw it: the statement failed at parse time. Use \\password.|||VI: Ở 12.3 câu gõ sai sinh ra "STATEMENT: ALTER ROLE intern PASSWORD \'Intern-Moi-2026!\' VALID UNTL …" trong cả log chữ lẫn log JSON. pgAudit chưa từng thấy nó: câu lệnh hỏng ngay lúc phân tích cú pháp. Hãy dùng \\password.',
      },
      {
        question: 'The client gets "Login failed for user \'app\'." twice. ERRORLOG has "Error: 18456, Severity: 14, State: 38" for the first and "State: 8" for the second. Meaning?|||Máy khách nhận "Login failed for user \'app\'." hai lần. ERRORLOG có "Error: 18456, Severity: 14, State: 38" cho lần đầu và "State: 8" cho lần sau. Nghĩa là gì?',
        options: [
          'First: login disabled; second: login does not exist|||Lần đầu: login bị vô hiệu hoá; lần sau: login không tồn tại',
          'Both are wrong passwords; the state is a counter|||Cả hai đều sai mật khẩu; state là bộ đếm',
          'First: correct login but the requested database cannot be opened; second: wrong password|||Lần đầu: đăng nhập đúng nhưng không mở được CSDL yêu cầu; lần sau: sai mật khẩu',
          'First: server starting up; second: too many connections|||Lần đầu: máy chủ đang khởi động; lần sau: quá nhiều kết nối',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: 12.4: State 38 = "Failed to open the explicitly specified database", State 8 = "Password did not match", State 5 = unknown login; a disabled login is a different error, 18470.|||VI: 12.4: State 38 = "Failed to open the explicitly specified database", State 8 = "Password did not match", State 5 = không có login; login bị vô hiệu hoá là một mã lỗi khác, 18470.',
      },
    ],
  },
};
