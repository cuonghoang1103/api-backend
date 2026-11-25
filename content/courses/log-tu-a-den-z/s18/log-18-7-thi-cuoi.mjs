/**
 * 18.7 — Bài thi cuối khoá (soạn 24/11/2026, agent lgz). 30 câu phủ Mục 0 → Chương 18; câu về Ch18 dựa trên OUT['s18/*'].
 * Phân bố đáp án: A ×8 · B ×8 · C ×7 · D ×7 (kiểm bằng node khi soạn).
 */
const C = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

export default {
  title: '18.7 — Final exam|||18.7 — Bài thi cuối khoá',
  slug: 'log-18-7-thi-cuoi',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Ba mươi câu tổng hợp cả khoá: định dạng và mức syslog, grep/jq, mã sự kiện Windows (4624/4625/4672/4740/1102, Logon Type, Sysmon), Get-WinEvent, journalctl và journal bền vững, auth.log/auditd, inode khi log bị sed -i, biến thời gian của nginx, Log4Shell, MDC và request id, HAR và sự cố Okta 2023, không ghi bí mật (Twitter 2018), xoay log Docker, nhãn Loki, log truy vấn chậm PostgreSQL, thời gian lưu PCI DSS, và các tình huống của dự án cuối khoá. Mỗi câu có giải thích.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Final exam</span>
<h2>Reading &amp; Mastering Logs A–Z — final exam</h2>
<p class="lead">Thirty questions across the whole course. Aim for 24/30. For every question you miss, reopen the lesson named in the explanation.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can open, filter and explain the logs of Windows, Linux, web servers, applications, databases, containers and network devices.</li>
<li>I can normalise time, correlate by IP/user/request id, and prove tampering.</li>
<li>I can turn an investigation into a UTC timeline, an ATT&amp;CK mapping and a report.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Thi cuối khoá</span>
<h2>Đọc &amp; làm chủ log từ A–Z — bài thi cuối khoá</h2>
<p class="lead">Ba mươi câu trải khắp khoá học. Mục tiêu 24/30. Câu nào sai, mở lại bài được nhắc trong phần giải thích.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi mở, lọc và giải thích được log của Windows, Linux, web server, ứng dụng, CSDL, container và thiết bị mạng.</li>
<li>Tôi chuẩn hoá được thời gian, tương quan theo IP/người dùng/request id, và chứng minh được log bị sửa.</li>
<li>Tôi biến được một cuộc điều tra thành dòng thời gian UTC, bảng ATT&amp;CK và báo cáo.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 2700,
    questions: [
      C('Which syslog standard adds the year, a time zone offset and STRUCTURED-DATA to each message?|||Chuẩn syslog nào thêm năm, độ lệch múi giờ và STRUCTURED-DATA vào mỗi thông điệp?',
        ['RFC 3164|||RFC 3164', 'RFC 5424|||RFC 5424', 'RFC 3339 alone|||Riêng RFC 3339', 'RFC 7230|||RFC 7230'], 1,
        'EN: RFC 5424 (2009) replaced the BSD format of RFC 3164, whose timestamp has no year or zone (Lesson 1.4).|||VI: RFC 5424 (2009) thay định dạng BSD của RFC 3164 — vốn không có năm và múi giờ (bài 1.4).'),
      C('A syslog message has severity 3. What is it?|||Thông điệp syslog có severity 3. Đó là mức nào?',
        ['warning|||warning', 'notice|||notice', 'crit|||crit', 'err|||err'], 3,
        'EN: 0 emerg, 1 alert, 2 crit, 3 err, 4 warning, 5 notice, 6 info, 7 debug — lower number = more severe (Lesson 1.3).|||VI: 0 emerg, 1 alert, 2 crit, 3 err, 4 warning, 5 notice, 6 info, 7 debug — số càng nhỏ càng nặng (bài 1.3).'),
      C('A line contains the same IP three times. Which command counts OCCURRENCES rather than matching lines?|||Một dòng chứa cùng một IP ba lần. Lệnh nào đếm SỐ LẦN XUẤT HIỆN thay vì số dòng khớp?',
        ['grep -o IP file | wc -l|||grep -o IP tệp | wc -l', 'grep -c IP file|||grep -c IP tệp', 'grep -l IP file|||grep -l IP tệp', 'grep -v IP file | wc -l|||grep -v IP tệp | wc -l'], 0,
        'EN: -c counts lines; -o prints each match on its own line, so wc -l counts occurrences (Lesson 2.2).|||VI: -c đếm dòng; -o in mỗi lần khớp một dòng nên wc -l đếm số lần xuất hiện (bài 2.2).'),
      C('In a pino JSON log, what does "level":50 mean?|||Trong log JSON của pino, "level":50 nghĩa là gì?',
        ['warn|||warn', 'info|||info', 'error|||error', 'fatal|||fatal'], 2,
        'EN: pino: 10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal (Lessons 2.4, 10.4).|||VI: pino: 10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal (bài 2.4, 10.4).'),
      C('Which Windows event says "special privileges assigned to new logon" (an admin-level logon)?|||Sự kiện Windows nào báo "special privileges assigned to new logon" (đăng nhập có quyền quản trị)?',
        ['4634|||4634', '4648|||4648', '4672|||4672', '4720|||4720'], 2,
        'EN: 4672 follows a 4624 when the account has sensitive privileges; 4634 is logoff, 4648 explicit credentials, 4720 account created (Chapter 4).|||VI: 4672 đi sau 4624 khi tài khoản có đặc quyền nhạy cảm; 4634 là đăng xuất, 4648 dùng thông tin đăng nhập tường minh, 4720 tạo tài khoản (Chương 4).'),
      C('A 4624 event has LogonType 10. What kind of logon?|||Sự kiện 4624 có LogonType 10. Kiểu đăng nhập nào?',
        ['Remote Desktop (RemoteInteractive)|||Remote Desktop (RemoteInteractive)', 'Network (e.g. SMB share)|||Mạng (vd thư mục chia sẻ SMB)', 'Service|||Dịch vụ', 'Unlock of a locked screen|||Mở khoá màn hình'], 0,
        'EN: 2 interactive, 3 network, 5 service, 7 unlock, 10 RemoteInteractive (RDP) (Lesson 4.1).|||VI: 2 tại máy, 3 mạng, 5 dịch vụ, 7 mở khoá, 10 RemoteInteractive (RDP) (bài 4.1).'),
      C('Which event ID tells you the Security log was cleared?|||Mã sự kiện nào cho biết Security log đã bị xoá?',
        ['4719|||4719', '6005|||6005', '7045|||7045', '1102|||1102'], 3,
        'EN: 1102 "The audit log was cleared" (Security); 104 is the System-log equivalent; 4719 = audit policy changed (Lessons 4.3, 14.4).|||VI: 1102 "The audit log was cleared" (Security); 104 là tương đương ở System log; 4719 = đổi audit policy (bài 4.3, 14.4).'),
      C('Monday morning a user cannot log in; the Security log shows 4740 at 22:57 on Saturday. What happened?|||Sáng thứ Hai người dùng không đăng nhập được; Security log có 4740 lúc 22:57 tối thứ Bảy. Chuyện gì đã xảy ra?',
        ['The password expired|||Mật khẩu hết hạn', 'The account was locked out after too many failed attempts|||Tài khoản bị khoá do sai mật khẩu quá nhiều lần', 'The account was deleted|||Tài khoản bị xoá', 'The computer rebooted unexpectedly|||Máy khởi động lại bất thường'], 1,
        'EN: 4740 = account locked out; look at the 4625s before it for the source (Lesson 4.2, Chapter 18).|||VI: 4740 = tài khoản bị khoá; xem các 4625 ngay trước để biết nguồn (bài 4.2, Chương 18).'),
      C('Why is Get-WinEvent -FilterHashtable much faster than piping everything to Where-Object?|||Vì sao Get-WinEvent -FilterHashtable nhanh hơn nhiều so với lấy hết rồi lọc bằng Where-Object?',
        ['It uses multiple CPU cores|||Nó dùng nhiều nhân CPU', 'It skips events older than 7 days|||Nó bỏ qua sự kiện cũ hơn 7 ngày', 'The filter is applied by the event log service before events reach PowerShell|||Bộ lọc được dịch vụ event log áp dụng trước khi sự kiện tới PowerShell', 'It reads only the XML header|||Nó chỉ đọc phần đầu XML'], 2,
        'EN: FilterHashtable becomes an XPath query evaluated by the log service — only matching events are materialised (Lesson 5.2).|||VI: FilterHashtable thành truy vấn XPath do dịch vụ log thực thi — chỉ sự kiện khớp mới được tạo ra (bài 5.2).'),
      C('Sysmon Event ID 1 records…|||Sysmon Event ID 1 ghi lại…',
        ['process creation with command line and hashes|||tạo tiến trình kèm dòng lệnh và mã băm', 'network connections|||kết nối mạng', 'file creation|||tạo tệp', 'registry value set|||đặt giá trị registry'], 0,
        'EN: 1 ProcessCreate, 3 NetworkConnect, 11 FileCreate, 13 RegistryEvent (value set) (Lesson 5.6).|||VI: 1 ProcessCreate, 3 NetworkConnect, 11 FileCreate, 13 RegistryEvent (đặt giá trị) (bài 5.6).'),
      C('journalctl -b -1 shows nothing on a server whose journal lives only in /run/log/journal. Why?|||journalctl -b -1 không ra gì trên máy chủ mà journal chỉ nằm ở /run/log/journal. Vì sao?',
        ['The previous boot had no errors|||Lần khởi động trước không có lỗi', 'The journal is volatile (RAM) and was lost at reboot|||Journal nằm trong RAM và đã mất khi khởi động lại', 'You need sudo for -b|||Cần sudo mới dùng được -b', '-b -1 means "one hour ago"|||-b -1 nghĩa là "một giờ trước"'], 1,
        'EN: /run is tmpfs; enable persistence with Storage=persistent or by creating /var/log/journal (Lesson 7.1).|||VI: /run là tmpfs; bật lưu bền bằng Storage=persistent hoặc tạo /var/log/journal (bài 7.1).'),
      C('journalctl -p err shows…|||journalctl -p err hiển thị…',
        ['only messages of priority err|||chỉ thông điệp mức err', 'err and everything less severe|||err và mọi mức nhẹ hơn', 'only errors from the kernel|||chỉ lỗi của nhân', 'err, crit, alert and emerg|||err, crit, alert và emerg'], 3,
        'EN: -p X shows X and all MORE severe levels; use -p err..err for one level only (Lesson 7.2).|||VI: -p X hiện X và mọi mức NẶNG hơn; muốn đúng một mức dùng -p err..err (bài 7.2).'),
      C('On Fedora/RHEL, the equivalent of Ubuntu’s /var/log/auth.log is…|||Trên Fedora/RHEL, tệp tương đương /var/log/auth.log của Ubuntu là…',
        ['/var/log/messages|||/var/log/messages', '/var/log/secure|||/var/log/secure', '/var/log/audit/audit.log|||/var/log/audit/audit.log', '/var/log/btmp|||/var/log/btmp'], 1,
        'EN: rsyslog on RHEL-family writes authpriv to /var/log/secure (Lesson 8.1).|||VI: rsyslog họ RHEL ghi authpriv vào /var/log/secure (bài 8.1).'),
      C('In auditd, why is auid more useful than uid for attribution?|||Trong auditd, vì sao auid hữu ích hơn uid khi quy trách nhiệm?',
        ['auid is encrypted|||auid được mã hoá', 'auid is the login user and stays the same after sudo or su|||auid là người đăng nhập ban đầu và giữ nguyên sau sudo hay su', 'auid only exists for root|||auid chỉ có với root', 'auid is the process ID|||auid là mã tiến trình'], 1,
        'EN: uid becomes 0 after sudo; auid keeps the original login account (Lessons 8.4, 14.3).|||VI: uid thành 0 sau sudo; auid giữ tài khoản đăng nhập gốc (bài 8.4, 14.3).'),
      C('An attacker runs sed -i on auth.log. rsyslog keeps running. Which command shows that rsyslog still writes to a deleted file?|||Kẻ tấn công chạy sed -i lên auth.log. rsyslog vẫn chạy. Lệnh nào cho thấy rsyslog vẫn ghi vào một tệp đã bị xoá?',
        ['lsof +L1|||lsof +L1', 'ls -la /var/log|||ls -la /var/log', 'tail -f auth.log|||tail -f auth.log', 'journalctl --verify|||journalctl --verify'], 0,
        'EN: sed -i replaces the file (new inode); rsyslog’s open descriptor still points to the old, unlinked inode — lsof +L1 lists open files with link count 0 (Chapter 18).|||VI: sed -i thay tệp (inode mới); bộ mô tả tệp rsyslog đang mở vẫn trỏ vào inode cũ đã bị gỡ — lsof +L1 liệt kê tệp đang mở có số liên kết 0 (Chương 18).'),
      C('Which nginx variable measures ONLY the time spent waiting for the backend (Node/Spring)?|||Biến nginx nào đo RIÊNG thời gian chờ backend (Node/Spring)?',
        ['$request_time|||$request_time', '$msec|||$msec', '$upstream_response_time|||$upstream_response_time', '$connection_time|||$connection_time'], 2,
        'EN: $request_time covers the whole request including sending to a slow client; $upstream_response_time is the backend part (Lesson 10.2).|||VI: $request_time tính cả request kể cả gửi cho client chậm; $upstream_response_time là phần backend (bài 10.2).'),
      C('What made Log4Shell (CVE-2021-44228) possible?|||Điều gì khiến Log4Shell (CVE-2021-44228) xảy ra được?',
        ['Logs were stored unencrypted|||Log lưu không mã hoá', 'Log4j 2 evaluated ${jndi:…} lookups inside logged strings|||Log4j 2 thực thi lookup ${jndi:…} nằm trong chuỗi được ghi log', 'Log files were world-writable|||Tệp log ai cũng ghi được', 'Logback sent logs over UDP|||Logback gửi log qua UDP'], 1,
        'EN: message lookup substitution let attacker-controlled text trigger a JNDI/LDAP fetch and code loading (Lesson 10.7).|||VI: cơ chế thay thế lookup trong thông điệp cho phép chuỗi kẻ tấn công điều khiển kích hoạt tải JNDI/LDAP và nạp mã (bài 10.7).'),
      C('What is the SLF4J MDC used for in a Spring application?|||SLF4J MDC được dùng làm gì trong ứng dụng Spring?',
        ['Compressing log files|||Nén tệp log', 'Sending logs to Kafka|||Gửi log sang Kafka', 'Choosing the log level at runtime|||Chọn mức log lúc chạy', 'Attaching per-request context (e.g. requestId, userId) to every log line of that thread|||Gắn ngữ cảnh theo request (vd requestId, userId) vào mọi dòng log của luồng đó'], 3,
        'EN: MDC is a thread-local map printed by the pattern/encoder; clear it at the end of the request (Lesson 10.7).|||VI: MDC là map theo luồng, được pattern/encoder in ra; nhớ xoá ở cuối request (bài 10.7).'),
      C('nginx sets $request_id and forwards it as X-Request-Id to the app, which logs it. What does this give you?|||nginx đặt $request_id và chuyển tiếp thành X-Request-Id cho ứng dụng, ứng dụng ghi lại. Điều này cho bạn gì?',
        ['Faster responses|||Phản hồi nhanh hơn', 'Protection against SQL injection|||Chống SQL injection', 'A key to join the access-log line with the app log lines of the same request|||Một khoá để nối dòng access log với các dòng log ứng dụng của cùng request', 'Automatic log rotation|||Tự xoay log'], 2,
        'EN: correlation id — used in Chapter 18 to follow a sqlmap request into the app log (Lesson 10.7, Chapter 18).|||VI: correlation id — Chương 18 dùng nó để lần một request sqlmap sang log ứng dụng (bài 10.7, Chương 18).'),
      C('Why are HAR files dangerous to send to a vendor’s support (Okta, October 2023)?|||Vì sao gửi tệp HAR cho bộ phận hỗ trợ của nhà cung cấp lại nguy hiểm (Okta, tháng 10/2023)?',
        ['They contain session cookies and tokens that can be replayed|||Chúng chứa cookie phiên và token có thể dùng lại', 'They are too large to scan|||Chúng quá lớn để quét', 'They include the browser’s saved passwords|||Chúng chứa mật khẩu trình duyệt đã lưu', 'They run JavaScript when opened|||Chúng chạy JavaScript khi mở'], 0,
        'EN: attackers who reached Okta’s support system used session tokens from uploaded HAR files; sanitise before sharing (Lesson 9.3).|||VI: kẻ tấn công vào được hệ thống hỗ trợ của Okta đã dùng token phiên trong các tệp HAR khách tải lên; phải làm sạch trước khi gửi (bài 9.3).'),
      C('Twitter (2018) and GitHub (2018) found passwords in internal logs. The main lesson for developers:|||Twitter (2018) và GitHub (2018) phát hiện mật khẩu nằm trong log nội bộ. Bài học chính cho lập trình viên:',
        ['Encrypt the log disk|||Mã hoá ổ đĩa log', 'Rotate logs daily|||Xoay log mỗi ngày', 'Use JSON logs|||Dùng log JSON', 'Never log request bodies or secrets unmasked — redact at the source, then scan logs for leaks|||Không bao giờ ghi thân request hay bí mật chưa che — che tại nguồn, rồi quét log tìm rò rỉ'], 3,
        'EN: masking must happen before the line is written; encryption does not help readers who are allowed to read logs (Chapter 16).|||VI: phải che trước khi dòng log được ghi; mã hoá không giúp gì trước người được phép đọc log (Chương 16).'),
      C('A container writes 2 GB of logs per day with Docker’s default logging configuration. What happens?|||Một container ghi 2 GB log mỗi ngày với cấu hình log mặc định của Docker. Điều gì xảy ra?',
        ['Docker drops lines above 100 MB|||Docker bỏ dòng khi vượt 100 MB', 'The json-file grows without limit until the disk fills|||Tệp json-file lớn mãi tới khi đầy đĩa', 'journald rotates it automatically|||journald tự xoay', 'Docker compresses it hourly|||Docker nén mỗi giờ'], 1,
        'EN: json-file has no max-size by default — set log-opts max-size/max-file (or use the local driver) (Chapter 13, Lab 16).|||VI: json-file mặc định không có max-size — đặt log-opts max-size/max-file (hoặc dùng driver local) (Chương 13, Lab 16).'),
      C('Why should you NOT make request_id a Loki label?|||Vì sao KHÔNG nên đặt request_id làm nhãn (label) của Loki?',
        ['Labels cannot contain hyphens|||Nhãn không được chứa gạch nối', 'LogQL cannot filter labels|||LogQL không lọc được nhãn', 'Every unique value creates a new stream — high cardinality explodes the index|||Mỗi giá trị mới tạo một luồng mới — số giá trị quá lớn làm phình chỉ mục', 'Labels are not stored|||Nhãn không được lưu'], 2,
        'EN: keep labels few and stable (host, source); search ids with |= or json filters (Chapter 15, Lesson 18.2).|||VI: nhãn ít và ổn định (máy, nguồn); tìm id bằng |= hoặc lọc json (Chương 15, bài 18.2).'),
      C('PostgreSQL has log_min_duration_statement = 1000 and no pgAudit. An attacker runs a 0.3 s SELECT on the customer table. What do you see?|||PostgreSQL đặt log_min_duration_statement = 1000 và không có pgAudit. Kẻ tấn công chạy SELECT 0,3 giây vào bảng khách hàng. Bạn thấy gì?',
        ['Only connection/disconnection lines (if log_connections is on) — not the statement|||Chỉ dòng kết nối/ngắt kết nối (nếu bật log_connections) — không có câu lệnh', 'The full statement with duration|||Toàn bộ câu lệnh kèm thời gian', 'An ERROR line|||Một dòng ERROR', 'Nothing at all, even with log_connections on|||Hoàn toàn không có gì, kể cả khi bật log_connections'], 0,
        'EN: only statements ≥ 1 s are logged; Chapter 18 caught the COPY only because it took 8.4 s — use pgAudit for sensitive tables (Lessons 12.2, 12.3).|||VI: chỉ câu ≥ 1 giây được ghi; Chương 18 bắt được lệnh COPY chỉ vì nó chạy 8,4 giây — dùng pgAudit cho bảng nhạy cảm (bài 12.2, 12.3).'),
      C('Capstone: sudo was refused for deploy, yet two minutes later the attacker acted as root. Which fact explains it?|||Dự án cuối: sudo từ chối deploy, vậy mà hai phút sau kẻ tấn công hành động như root. Sự thật nào giải thích?',
        ['deploy had an SSH key|||deploy có khoá SSH', 'PasswordAuthentication was on|||PasswordAuthentication đang bật', 'cron runs as root|||cron chạy bằng root', 'deploy was in group docker, and the Docker daemon can mount the host filesystem (T1611)|||deploy thuộc nhóm docker, và Docker daemon mount được hệ thống tệp của máy (T1611)'], 3,
        'EN: id deploy → groups …988(docker); container b0a9… started 15:44:30Z (Lesson 18.3, Q8).|||VI: id deploy → groups …988(docker); container b0a9… khởi động 15:44:30Z (bài 18.3, câu 8).'),
      C('Capstone: why were auth lines between 16:19:55Z and 17:00:02Z missing even though they did not contain the attacker’s IP?|||Dự án cuối: vì sao các dòng auth từ 16:19:55Z tới 17:00:02Z bị mất dù không chứa IP của kẻ tấn công?',
        ['logrotate deleted them|||logrotate đã xoá', 'After sed -i replaced the file, rsyslog wrote into the old deleted inode until logrotate HUPed it|||Sau khi sed -i thay tệp, rsyslog ghi vào inode cũ đã bị xoá cho tới khi logrotate gửi HUP', 'journald was stopped|||journald bị dừng', 'The clock jumped|||Đồng hồ nhảy giờ'], 1,
        'EN: proven by stat (Birth 16:19:55Z), the cron heartbeat gap and the journal still having those lines (Lesson 18.3, Q7).|||VI: chứng minh bằng stat (Birth 16:19:55Z), nhịp cron bị đứt và journal vẫn còn các dòng đó (bài 18.3, câu 7).'),
      C('Capstone: how was the router’s clock skew (97 s slow) measured?|||Dự án cuối: độ lệch đồng hồ router (chậm 97 giây) được đo thế nào?',
        ['By asking the ISP|||Hỏi nhà mạng', 'By comparing with the nginx access log|||So với access log của nginx', 'By matching the same TCP connection: SPT in the firewall log = IpPort in Windows 4625|||Ghép cùng một kết nối TCP: SPT trong log tường lửa = IpPort trong 4625 của Windows', 'By reading uci ntp settings|||Đọc cấu hình ntp của uci'], 2,
        'EN: 15 pairs, −98.1 to −97.2 s; the config only tells you NTP is off, not by how much (Lesson 18.2).|||VI: 15 cặp, từ −98,1 tới −97,2 giây; cấu hình chỉ cho biết NTP tắt, không cho biết lệch bao nhiêu (bài 18.2).'),
      C('Capstone: PostgreSQL shows connections from 172.18.0.1 and from 172.18.0.3. What is 172.18.0.1?|||Dự án cuối: PostgreSQL có kết nối từ 172.18.0.1 và từ 172.18.0.3. 172.18.0.1 là gì?',
        ['The Docker bridge gateway — a process on the host reaching the published port|||Cổng bridge của Docker — một tiến trình trên chính máy chủ đi qua cổng được publish', 'The attacker’s public IP|||IP công cộng của kẻ tấn công', 'The tour-api container|||Container tour-api', 'The office router|||Router văn phòng'], 0,
        'EN: the app container connects directly (172.18.0.3); host processes go through docker-proxy and appear as the gateway — the web shell’s psql did (Lesson 18.3, Q11).|||VI: container ứng dụng kết nối trực tiếp (172.18.0.3); tiến trình trên máy chủ đi qua docker-proxy nên hiện là cổng bridge — psql của webshell là như vậy (bài 18.3, câu 11).'),
      C('PCI DSS requirement 10.5.1 asks you to keep audit logs…|||Yêu cầu 10.5.1 của PCI DSS bắt giữ audit log…',
        ['30 days|||30 ngày', '7 years, all online|||7 năm, luôn trực tuyến', 'until the disk is full|||tới khi đầy đĩa', 'at least 12 months, with the most recent 3 months immediately available|||ít nhất 12 tháng, 3 tháng gần nhất sẵn sàng ngay'], 3,
        'EN: an international example; Vietnamese rules and contracts may require other periods (Chapter 16).|||VI: ví dụ quốc tế; quy định Việt Nam và hợp đồng có thể yêu cầu khác (Chương 16).'),
      C('A customer sends you a zip of logs and asks "were we hacked?". What do you do first?|||Khách hàng gửi bạn tệp zip log và hỏi "chúng tôi có bị hack không?". Việc đầu tiên bạn làm?',
        ['Hash the files and record where they came from, then work on copies|||Băm các tệp và ghi lại nguồn gốc, rồi làm việc trên bản sao', 'Grep for "hack"|||grep chữ "hack"', 'Load everything into Excel|||Nạp tất cả vào Excel', 'Reply "no" if you find no errors|||Trả lời "không" nếu không thấy lỗi'], 0,
        'EN: preserve first (chain of custody), then time zones, then questions and search (Lessons 18.1–18.2).|||VI: bảo toàn trước (chuỗi lưu giữ), rồi múi giờ, rồi mới đặt câu hỏi và tìm (bài 18.1–18.2).'),
    ],
  },
};
