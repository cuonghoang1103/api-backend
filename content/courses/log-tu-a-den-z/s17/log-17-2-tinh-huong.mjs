/**
 * 17.2 — Vòng tình huống: đọc một đoạn log trong năm phút và giải thích thành tiếng (soạn 24/11/2026, agent lgz).
 * 8 đoạn log là OUTPUT THẬT đã chạy ở các chương trước (không bịa): OUT['s10/trang-thai'], OUT['s07/mat-dien'], OUT['s13/docker'],
 * OUT['s12/pglog'], OUT['s08/auth'], OUT['s10/spring-mdc-json'], OUT['s11/fw-win'], OUT['s16/bi-mat'] — lấy theo khoảng dòng.
 * Chạy lại các chương đó ⇒ giờ/PID/số đổi: soát lời giải (20:34:46/20:35:01, 04:09:53/04:10:24, RestartCount=3, PID 155/157, 15 lần sai .88, req-c0ffee01, 192.168.56.66→135, MatKhau-GIA-123).
 */
import { OUT } from '../_ma.mjs';
import { escHtml, kv, nguon, lienKet } from '../_chung.mjs';

/** Đoạn log: lấy dòng [a, b] (1-based) của OUT[key]; boLenh = bỏ các dòng "$ …"/"PS> …" để chỉ còn log. */
const doan = (key, a, b, boLenh = true) => {
  const s = OUT[key];
  if (s == null) throw new Error(`17.2: thiếu OUT['${key}']`);
  let d = s.split('\n').slice(a - 1, b);
  if (boLenh) d = d.filter((x) => !x.startsWith('$ ') && !x.startsWith('PS> ') && x.trim() !== '');
  if (!d.length) throw new Error(`17.2: đoạn rỗng ${key} ${a}-${b}`);
  return `<div class="out">${escHtml(d.join('\n'))}</div>`;
};

// [khoá OUT, a, b, boLenh, bối cảnh EN, VI, câu hỏi EN, VI, lời giải EN, VI, bài]
const TH = [
  ['s10/trang-thai', 28, 35, true,
    'Monday 20:35. The on-call channel: "checkout and reports are broken". You get the nginx access and error log lines below.',
    'Thứ hai 20:35. Kênh trực sự cố: "thanh toán và báo cáo hỏng rồi". Bạn nhận được mấy dòng access log và error log nginx dưới đây.',
    'Is this one problem or two? What exactly failed, and what do you check next?',
    'Đây là một vấn đề hay hai? Chính xác cái gì hỏng, và bạn kiểm gì tiếp?',
    '<p><strong>Two problems.</strong> (1) 20:34:46: the 504 on <code>/api/export</code> has rt=5.000 and urt=5.000, matching "upstream timed out (110)" — the app accepted the request and did not answer within the 5-second proxy timeout. Export is slow. (2) 20:35:01: a 502 on <code>/api/report</code> after 0.191 s, and in the same second "connect() failed (111: Connection refused)" for <code>/api/products</code> — the app process stopped listening: it crashed or restarted. Next: the app log/journal around 20:35:01 (exception, restart, OOM), <code>systemctl status</code> or <code>docker inspect</code>; for export, the slow query or external call inside it. Do not "fix" 504 by raising the timeout without knowing why it is slow.</p><p>Key phrases: <em>"rt equals the timeout"</em>, <em>"connection refused means nothing is listening on that port"</em>.</p>',
    '<p><strong>Hai vấn đề.</strong> (1) 20:34:46: 504 ở <code>/api/export</code> có rt=5.000 và urt=5.000, khớp với "upstream timed out (110)" — app nhận request nhưng không trả lời trong 5 giây timeout của proxy. Xuất dữ liệu đang chậm. (2) 20:35:01: 502 ở <code>/api/report</code> sau 0,191 giây, và cùng giây đó "connect() failed (111: Connection refused)" cho <code>/api/products</code> — tiến trình app không còn nghe cổng: nó sập hoặc đang khởi động lại. Tiếp theo: log app/journal quanh 20:35:01 (exception, khởi động lại, OOM), <code>systemctl status</code> hoặc <code>docker inspect</code>; với export thì tìm câu truy vấn chậm hoặc lời gọi API ngoài bên trong. Đừng "sửa" 504 bằng cách tăng timeout khi chưa biết vì sao chậm.</p><p>Cụm nên nói: <em>"rt equals the timeout"</em> (rt bằng đúng ngưỡng timeout), <em>"connection refused means nothing is listening on that port"</em> (bị từ chối kết nối nghĩa là không có gì nghe ở cổng đó).</p>',
    'log-10-1-ma-trang-thai'],
  ['s07/mat-dien', 1, 13, false,
    'A small company server "rebooted by itself" early in the morning. The owner swears nobody touched it. You have SSH access and run these journalctl commands (boot -3 is the oldest).',
    'Máy chủ của một công ty nhỏ "tự khởi động lại" lúc sáng sớm. Chủ máy thề không ai đụng vào. Bạn có SSH và chạy các lệnh journalctl này (boot -3 là lần cũ nhất).',
    'What happened between boot -3 and boot -2, and how did boot -2 end? How sure are you?',
    'Chuyện gì xảy ra giữa boot -3 và boot -2, và boot -2 kết thúc thế nào? Bạn chắc tới đâu?',
    '<p>Boot -3 ends in the middle of normal traffic (shop-api answering 200 at 04:09:53) with no shutdown messages at all — no "Stopping…", no "Journal stopped". The next boot (-2) opens at 04:10:24 with journald saying the journal files were "corrupted or uncleanly shut down" and the kernel saying the FAT partition "was not properly unmounted". That is the signature of a <strong>sudden power loss or hard reset</strong>, not a software reboot. Boot -2 ends differently: a sudo session by user hv, then "Journal stopped" — an orderly shutdown started by someone with sudo; auth.log/the sudo line will show the exact command. Certainty: high for "abrupt stop" (two independent signs); the cause of the abrupt stop (power, hypervisor, hardware) needs the host/cloud console or UPS logs. Windows equivalent: 41 + 6008.</p>',
    '<p>Boot -3 dừng ngay giữa lúc đang phục vụ bình thường (shop-api trả 200 lúc 04:09:53) mà không có dòng tắt máy nào — không "Stopping…", không "Journal stopped". Lần khởi động sau (-2) mở đầu lúc 04:10:24 với journald báo tệp journal "corrupted or uncleanly shut down" và nhân báo phân vùng FAT "was not properly unmounted". Đó là dấu hiệu của <strong>mất điện hoặc reset cứng</strong>, không phải khởi động lại bằng phần mềm. Boot -2 kết thúc khác hẳn: một phiên sudo của người dùng hv, rồi "Journal stopped" — tắt máy có trật tự do ai đó có sudo ra lệnh; auth.log/dòng sudo sẽ cho thấy đúng lệnh. Độ chắc: cao với kết luận "dừng đột ngột" (hai dấu hiệu độc lập); còn vì sao đột ngột (điện, hypervisor, phần cứng) thì cần bảng điều khiển máy chủ/cloud hoặc log UPS. Bên Windows tương đương: 41 + 6008.</p>',
    'log-7-1-journald-luu'],
  ['s13/docker', 52, 57, false,
    'A teammate: "I deployed orders-service, it keeps dying, I added --restart on-failure:3 but it still won\'t stay up."',
    'Một bạn cùng nhóm: "Mình deploy orders-service, nó cứ chết, đã thêm --restart on-failure:3 mà vẫn không chạy được."',
    'Why is it dying, why does restarting not help, and what would exit code 137 have meant instead?',
    'Vì sao nó chết, vì sao khởi động lại không giúp gì, và nếu mã thoát là 137 thì nghĩa là gì?',
    '<p>Exit code 1 with OOMKilled=false and the app\'s own last line "FATAL: thiếu biến môi trường DB_URL" (missing environment variable): the app checked its configuration and exited on purpose. Docker restarted it three times (RestartCount=3), and it failed three times for the same reason — <strong>restarts only help transient failures, not configuration errors</strong>. Fix: pass DB_URL (env/secret), and make the deploy fail fast instead of looping. If it were 137: the process received SIGKILL — with OOMKilled=true it hit the memory limit; with OOMKilled=false it was usually <code>docker stop</code> waiting 10 s because PID 1 ignored SIGTERM (use <code>--init</code>/handle SIGTERM; then you see 143). 139 = segfault.</p>',
    '<p>Mã thoát 1, OOMKilled=false, và dòng cuối của chính app là "FATAL: thiếu biến môi trường DB_URL": app tự kiểm cấu hình rồi chủ động thoát. Docker khởi động lại ba lần (RestartCount=3), và cả ba lần đều hỏng cùng lý do — <strong>khởi động lại chỉ cứu lỗi thoáng qua, không cứu lỗi cấu hình</strong>. Sửa: truyền DB_URL (biến môi trường/secret), và cho bước deploy báo lỗi ngay thay vì chạy vòng lặp. Nếu là 137: tiến trình nhận SIGKILL — OOMKilled=true là chạm giới hạn RAM; OOMKilled=false thường là <code>docker stop</code> chờ 10 giây vì PID 1 lờ SIGTERM (dùng <code>--init</code>/xử lý SIGTERM; khi đó thấy 143). 139 = segfault.</p>',
    'log-13-1-docker-logs'],
  ['s12/pglog', 90, 97, true,
    'The finance team: "about once a day a money transfer fails with an error and has to be retried". The PostgreSQL log has this.',
    'Phòng tài chính: "mỗi ngày có khoảng một lần chuyển tiền bị lỗi và phải làm lại". Log PostgreSQL có đoạn này.',
    'Explain the error to a developer in plain words, and propose a fix that is not "add more RAM".',
    'Giải thích lỗi cho một lập trình viên bằng lời dễ hiểu, và đề xuất cách sửa không phải "thêm RAM".',
    '<p>A <strong>deadlock</strong>: two transfers ran at the same time in opposite order. Process 155 (app=chuyen-tien-A) locked account 1 and then wanted account 2; process 157 locked account 2 and then wanted account 1. Each waits for the other forever, so PostgreSQL picked one victim (155) and aborted it with "deadlock detected" (SQLSTATE 40P01); 157 finished. It is a logic/order problem, not a performance one. Fix: always lock rows in the same order (e.g. <code>SELECT … FOR UPDATE</code> ordered by id, or update the smaller id first), keep transactions short (no sleeps or remote calls inside), and retry 40P01 in the application. Bonus: <code>log_line_prefix</code> with app= and client= is what told us which job was involved.</p>',
    '<p>Một <strong>deadlock</strong> (khoá chết): hai lần chuyển tiền chạy cùng lúc theo thứ tự ngược nhau. Tiến trình 155 (app=chuyen-tien-A) khoá tài khoản 1 rồi muốn tài khoản 2; tiến trình 157 khoá tài khoản 2 rồi muốn tài khoản 1. Mỗi bên chờ bên kia mãi mãi, nên PostgreSQL chọn một nạn nhân (155) và huỷ nó với "deadlock detected" (SQLSTATE 40P01); 157 chạy xong. Đây là lỗi logic/thứ tự, không phải hiệu năng. Sửa: luôn khoá các dòng theo cùng một thứ tự (vd <code>SELECT … FOR UPDATE</code> sắp theo id, hoặc cập nhật id nhỏ trước), giữ giao dịch ngắn (không sleep, không gọi mạng bên trong), và ở ứng dụng thử lại khi gặp 40P01. Điểm cộng: <code>log_line_prefix</code> có app= và client= chính là thứ cho ta biết job nào dính vào.</p>',
    'log-12-1-postgres-log'],
  ['s08/auth', 64, 76, false,
    'SOC interview, tier 1. "Here is what we pulled from a Linux server\'s auth.log. Talk me through it."',
    'Phỏng vấn SOC, tier 1. "Đây là thứ bọn tôi lấy từ auth.log của một máy chủ Linux. Giải thích cho tôi nghe."',
    'Is this a successful attack? Which account, from where, and what are your first three actions?',
    'Đây có phải tấn công thành công không? Tài khoản nào, từ đâu, và ba việc đầu tiên bạn làm là gì?',
    '<p>Yes — <strong>a successful password-guessing attack</strong>. 192.168.56.88 failed 15 times — the usernames tried include root, dev and accounts that do not exist (oracle, postgres, admin) — then logged in with a <em>password</em> as <code>dev</code> at 05:15:47. Failures for usernames that do not exist (oracle, postgres) are the tell-tale of a dictionary tool, and "Accepted password" right after them from the same IP is the line that matters. First actions: (1) contain — lock <code>dev</code> (<code>usermod -L</code>/expire), kill its sessions, block the IP; (2) scope — what did dev do after 05:15:47 (sudo lines, auditd, bash history, new keys in authorized_keys, new cron/systemd units); (3) fix the cause — disable PasswordAuthentication, rotate dev\'s password/keys, add fail2ban/MaxAuthTries, and check other servers for the same IP. Report it as an incident, not just "blocked an IP". ATT&CK: T1110.001 then T1078.</p>',
    '<p>Có — <strong>dò mật khẩu đã thành công</strong>. 192.168.56.88 sai 15 lần — các tên đã thử gồm root, dev và cả tài khoản không tồn tại (oracle, postgres, admin) — rồi đăng nhập bằng <em>mật khẩu</em> vào <code>dev</code> lúc 05:15:47. Sai với tên người dùng không tồn tại (oracle, postgres) là dấu hiệu của công cụ dò theo từ điển, và "Accepted password" ngay sau đó từ cùng IP là dòng quan trọng nhất. Ba việc đầu: (1) khoanh vùng — khoá <code>dev</code> (<code>usermod -L</code>/hết hạn), ngắt các phiên của nó, chặn IP; (2) xác định phạm vi — dev đã làm gì sau 05:15:47 (dòng sudo, auditd, lịch sử bash, khoá mới trong authorized_keys, cron/unit systemd mới); (3) sửa gốc — tắt PasswordAuthentication, đổi mật khẩu/khoá của dev, thêm fail2ban/MaxAuthTries, và kiểm các máy chủ khác xem có cùng IP không. Báo cáo như một sự cố, không chỉ "đã chặn IP". ATT&CK: T1110.001 rồi T1078.</p>',
    'log-8-3-auth-log'],
  ['s10/spring-mdc-json', 5, 7, true,
    'Backend interview (Spring). "These two JSON lines come from one request to confirm order 7. What can you tell me about our logging setup?"',
    'Phỏng vấn backend (Spring). "Hai dòng JSON này đến từ một request xác nhận đơn 7. Bạn nói gì được về cách bọn tôi cấu hình log?"',
    'What links the two lines, why is that not automatic, and is there any privacy problem in this request?',
    'Cái gì nối hai dòng, vì sao chuyện đó không tự nhiên mà có, và request này có vấn đề quyền riêng tư nào không?',
    '<p>Both lines share <code>requestId=req-c0ffee01</code> (taken from the X-Request-Id header) and the same <code>traceId</code>, although they run on different threads: <code>http-nio-8080-exec-1</code> (controller) and <code>mail-1</code> (MailService). MDC is stored per thread, so the mail thread only has it because the executor copies the MDC (a TaskDecorator) — without it the second line would have no id and you could not join them. The logs are JSON with logger and thread names, so you can filter by field. Privacy: the log masks the email (<code>a***@example.com</code>) — good — but the request put the email in the <strong>query string</strong> (<code>?email=an@example.com</code>), so it is in the nginx access log, browser history and any proxy log in full. Move it to the body.</p>',
    '<p>Hai dòng có chung <code>requestId=req-c0ffee01</code> (lấy từ header X-Request-Id) và chung <code>traceId</code>, dù chạy trên hai luồng khác nhau: <code>http-nio-8080-exec-1</code> (controller) và <code>mail-1</code> (MailService). MDC lưu theo luồng, nên luồng gửi mail có nó chỉ vì executor chép MDC sang (một TaskDecorator) — thiếu bước đó dòng thứ hai không có mã và bạn không nối được. Log là JSON có tên logger và tên luồng, nên lọc theo trường được. Quyền riêng tư: log đã che email (<code>a***@example.com</code>) — tốt — nhưng request đặt email trên <strong>query string</strong> (<code>?email=an@example.com</code>), nên nó nằm nguyên trong access log nginx, lịch sử trình duyệt và log của mọi proxy. Chuyển nó vào body.</p>',
    'log-10-7-java-mdc-json-hieu-nang'],
  ['s11/fw-win', 92, 110, true,
    'A Windows Server in the office network. The admin enabled "Filtering Platform Connection" auditing and found many events with ID 5157 like this one in the Security log.',
    'Một Windows Server trong mạng văn phòng. Quản trị viên bật audit "Filtering Platform Connection" và thấy rất nhiều sự kiện mã 5157 như thế này trong log Security.',
    'Read the event field by field. Is the server compromised? What do you look at next?',
    'Đọc sự kiện từng trường. Máy chủ có bị xâm nhập không? Bạn xem gì tiếp?',
    '<p>Event 5157: the Windows Filtering Platform <strong>blocked</strong> an <em>inbound</em> TCP (protocol 6) connection from 192.168.56.66 to this server\'s port 135 (RPC endpoint mapper, owned by svchost PID 972), by a default rule ("Query User Default"), not a rule someone created. So: someone on the LAN tried to reach RPC and the firewall did its job — not a compromise by itself. Next: count 5157 by source IP and destination port over time (many ports in seconds = a scan; 135/139/445/3389 = looking for Windows services), identify the machine .66 (DHCP lease, asset list), check the same IP in 4625 (failed logons) and any 5156 (allowed) — an allowed connection from it would matter more than a blocked one. Note: 5156/5157 are very noisy; enable them for an investigation, not forever.</p>',
    '<p>Sự kiện 5157: Windows Filtering Platform đã <strong>chặn</strong> một kết nối TCP (protocol 6) <em>đi vào</em> từ 192.168.56.66 tới cổng 135 của máy này (RPC endpoint mapper, do svchost PID 972 giữ), bởi luật mặc định ("Query User Default"), không phải luật ai đó tạo. Tức là: một máy trong LAN thử chạm RPC và tường lửa đã làm đúng việc — tự nó chưa phải bị xâm nhập. Tiếp theo: đếm 5157 theo IP nguồn và cổng đích theo thời gian (nhiều cổng trong vài giây = quét; 135/139/445/3389 = đang tìm dịch vụ Windows), xác định máy .66 là máy nào (DHCP lease, danh sách tài sản), tìm cùng IP trong 4625 (đăng nhập thất bại) và trong 5156 (được cho qua) — một kết nối được cho qua từ nó đáng lo hơn một kết nối bị chặn. Lưu ý: 5156/5157 rất ồn; bật để điều tra, đừng bật mãi.</p>',
    'log-11-3-firewall-windows'],
  ['s16/bi-mat', 3, 4, true,
    'Code review before go-live. You run the login endpoint once and look at the JSON the logger produced for it.',
    'Review mã trước khi lên production. Bạn gọi endpoint đăng nhập một lần và xem dòng JSON logger sinh ra.',
    'List every secret or personal datum in this line, say why each is dangerous, and how you fix the logger.',
    'Liệt kê mọi bí mật hay dữ liệu cá nhân trong dòng này, vì sao mỗi thứ nguy hiểm, và sửa logger thế nào.',
    '<p>Four secrets (all fake values in this lab): an API token in the URL (<code>?token=sk_test_…</code>), a <code>Bearer</code> JWT in Authorization, a session cookie (<code>sid=…</code>), and the plain password in the body; plus personal data (the email). Anyone who can read logs — colleagues, a log vendor, an attacker who reaches the log server — can replay the token/session or reuse the password. The URL token is also in nginx/proxy logs and browser history. Fix: never log whole req/body; redact paths in the logger (pino <code>redact: [\'req.headers.authorization\', \'req.headers.cookie\', \'body.password\']</code>, Logback masking), strip query strings or move tokens out of URLs, scan logs with gitleaks in CI, and if real secrets already reached logs: rotate them and purge the logs. This is exactly what Twitter (2018) and Facebook (2019) had to clean up.</p>',
    '<p>Bốn bí mật (trong lab đều là giá trị giả): token API trên URL (<code>?token=sk_test_…</code>), JWT <code>Bearer</code> trong Authorization, cookie phiên (<code>sid=…</code>), và mật khẩu dạng chữ thường trong body; cộng dữ liệu cá nhân (email). Ai đọc được log — đồng nghiệp, nhà cung cấp dịch vụ log, kẻ tấn công chạm tới máy chủ log — đều dùng lại được token/phiên hoặc mật khẩu. Token trên URL còn nằm trong log nginx/proxy và lịch sử trình duyệt. Sửa: không bao giờ log nguyên req/body; che theo đường trường ngay ở logger (pino <code>redact: [\'req.headers.authorization\', \'req.headers.cookie\', \'body.password\']</code>, masking của Logback), bỏ query string hoặc đưa token ra khỏi URL, quét log bằng gitleaks trong CI, và nếu bí mật thật đã lọt vào log: đổi chúng ngay và xoá log đó. Đây đúng là việc Twitter (2018) và Facebook (2019) đã phải dọn.</p>',
    'log-16-3-khong-log-bi-mat'],
];

const RUBRIC = {
  en: [['Fields read correctly', 'Time (with zone), source, level/status, the actor (user/IP/process).'], ['What happened', 'One clear sentence; separate problems kept separate.'], ['Certain vs guessed', 'Says what the log proves and what it only suggests.'], ['Next step', 'Names the next log and the command/filter.'], ['Action + prevention', 'Mitigation first, then a change so it does not repeat.']],
  vi: [['Đọc đúng trường', 'Thời gian (kèm múi giờ), nguồn, mức/mã, tác nhân (user/IP/tiến trình).'], ['Chuyện gì đã xảy ra', 'Một câu rõ ràng; vấn đề riêng thì tách riêng.'], ['Chắc chắn hay phỏng đoán', 'Nói rõ log chứng minh điều gì, chỉ gợi ý điều gì.'], ['Bước tiếp theo', 'Gọi tên log tiếp theo và lệnh/bộ lọc.'], ['Hành động + phòng', 'Giảm thiệt hại trước, rồi một thay đổi để không lặp lại.']],
};
const bangRubric = (ngon) => `<table><thead><tr><th>${ngon === 'en' ? 'Criterion (0–2 points)' : 'Tiêu chí (0–2 điểm)'}</th><th>${ngon === 'en' ? '2 points when…' : 'Được 2 điểm khi…'}</th></tr></thead><tbody>\n` +
  RUBRIC[ngon].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('\n') + '\n</tbody></table>';

const dsTH = (ngon) => TH.map(([k, a, b, bo, bcEn, bcVi, qEn, qVi, gEn, gVi, bai], i) => {
  const en = ngon === 'en';
  return `<h4>${en ? 'Round' : 'Vòng'} ${i + 1}</h4>\n<p>${en ? bcEn : bcVi}</p>\n${doan(k, a, b, bo)}\n<p><strong>⏱ 5 ${en ? 'min' : 'phút'}:</strong> ${en ? qEn : qVi}</p>\n` +
    `<details><summary>${en ? 'Model answer (open after you have spoken)' : 'Lời giải mẫu (mở sau khi đã nói xong)'}</summary>${en ? gEn : gVi}<p class="small">↪ ${en ? 'Lesson' : 'Bài'}: <a href="/courses/log-tu-a-den-z/learn?lessonSlug=${bai}">${bai}</a></p></details>`;
}).join('\n');
if (TH.length !== 8) throw new Error('17.2: cần 8 vòng');

const CUM = [
  ['The request timed out upstream after five seconds.', 'Request bị timeout ở phía upstream sau năm giây.'],
  ['Nothing was listening on that port, so the connection was refused.', 'Không có gì nghe ở cổng đó nên kết nối bị từ chối.'],
  ['The previous boot ended abruptly; there are no shutdown messages.', 'Lần khởi động trước dừng đột ngột; không có dòng tắt máy nào.'],
  ['It exited with code 1, so restarting will not help.', 'Nó thoát với mã 1, nên khởi động lại không giúp gì.'],
  ['Postgres picked one transaction as the deadlock victim.', 'Postgres chọn một giao dịch làm nạn nhân của deadlock.'],
  ['The same IP failed fifteen times and then logged in successfully.', 'Cùng một IP sai mười lăm lần rồi đăng nhập thành công.'],
  ['Both lines share the same trace ID, so I can correlate them.', 'Hai dòng có chung trace ID nên em nối được chúng.'],
  ['The connection was blocked by the default inbound rule.', 'Kết nối bị luật mặc định chiều vào chặn.'],
  ['These values must be redacted before they reach the log.', 'Các giá trị này phải được che trước khi vào log.'],
  ['I am fairly confident about X, but I would verify Y in the database log.', 'Em khá chắc về X, nhưng em sẽ kiểm Y trong log CSDL.'],
];
const bangCum = (ngon) => `<table><thead><tr><th>${ngon === 'en' ? 'Say it in English' : 'Câu tiếng Anh'}</th><th>${ngon === 'en' ? 'Meaning (Vietnamese)' : 'Nghĩa'}</th></tr></thead><tbody>\n` +
  CUM.map(([e, v]) => `<tr><td>${e}</td><td>${v}</td></tr>`).join('\n') + '\n</tbody></table>';

export default {
  title: 'Live scenario rounds: read a log excerpt in five minutes and explain it out loud|||Vòng tình huống: đọc một đoạn log trong năm phút và giải thích thành tiếng',
  slug: 'log-17-2-tinh-huong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám vòng tình huống, mỗi vòng một đoạn log THẬT lấy từ lab của các chương trước: nginx 502/504, journald mất điện, container chết vì thiếu biến môi trường, deadlock PostgreSQL, dò mật khẩu SSH thành công, JSON Spring có requestId/traceId qua hai luồng, sự kiện 5157 của tường lửa Windows, và bí mật lọt vào log. Mỗi vòng: bối cảnh, câu hỏi năm phút, lời giải mẫu (che), phiếu chấm 5 tiêu chí × 2 điểm, bảng câu nói tiếng Anh để luyện song ngữ, cách tự luyện một mình bằng ghi âm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.2</span>
<h2>Five minutes, one excerpt, out loud</h2>
<p class="lead">Many technical interviews — and almost every SOC interview — include a round where you get a screen of log lines and are asked "what happened here?". You have a few minutes and you must think aloud. This lesson gives you eight such rounds built only from <strong>real output</strong> of this course's labs, a scoring rubric, and English phrases to say it with.</p>

<h3>The everyday picture: the driving test, not the theory test</h3>
<p>Knowing the traffic signs is the theory test. The driving test puts you in a real street and watches what you look at and when. A log round is the driving test: the examiner watches your eyes — do you look at the time first? the status? the source? — and listens to how you reason.</p>

<h3>How to run a round on your own</h3>
<ol>
<li>Start a 5-minute timer and your phone's voice recorder.</li>
<li>Read the context and the excerpt. Say what you see, field by field, then what you think happened.</li>
<li>Answer the question. Name the next log and command. End with an action.</li>
<li>Stop. Open the model answer and score yourself with the rubric below (0–2 per criterion, 10 total). Note what you missed.</li>
<li>Next day, redo the rounds you scored under 7 — without opening the answer first.</li>
</ol>
<p>Sequence that works under pressure: <strong>time → source → what is normal here → what is not → one sentence of what happened → how sure → next step → action</strong>.</p>

<h3>Rubric (10 points per round)</h3>
${bangRubric('en')}
<p>7–8 is a pass for an intern/fresher; 9–10 sounds like someone who has been on call.</p>

<h3>The eight rounds</h3>
${dsTH('en')}

<h3>Speaking bilingual: phrases to practise</h3>
<p>In Vietnamese companies the discussion is often Vietnamese with English terms; with foreign clients or in an English interview it is all English. Practise both. Keep the technical words in English (timeout, upstream, deadlock, trace ID) and say them clearly.</p>
${bangCum('en')}

<h3>🛡️ Attacker's corner: the interviewer's favourite trap</h3>
<p>Round 5 hides the trap SOC interviewers use most: candidates count the failures, say "brute force, block the IP" and stop. The one line that turns noise into an incident is the <em>success</em> after the failures. Since 2016 the Mirai botnet and its descendants have hijacked hundreds of thousands of devices with exactly this pattern — trying factory default usernames and passwords until one works. Always ask: "did any of them get in?"</p>

<h3>Real-world situations</h3>
<ul>
<li><strong>Outsourcing teams</strong>: a client sends 50 lines pasted in a ticket and asks for an explanation by end of day. The rubric above is also a good shape for that written reply: what happened, how sure, next step, action.</li>
<li><strong>Interview over video call</strong>: if they share their screen, ask "can I take a minute to read it?" — it is expected. Read first, then talk.</li>
<li><strong>When you do not know a field</strong> (e.g. "Filter Run-Time ID"): say so, say what you would look up, and move on to the fields that matter.</li>
</ul>

<h3>🧪 Practice (60 min)</h3>
<div class="callout ok"><ol>
<li>Do all eight rounds with timer and recorder, then score each.</li>
<li>Pick your two lowest rounds; open the lesson linked from the model answer, redo its lab step, then redo the round the next day.</li>
<li>Build a ninth round yourself from your own lab output (any chapter): context + 5–15 lines + question + model answer. Give it to a classmate.</li>
</ol>
<p><strong>Pass when:</strong> average ≥ 7/10 over the eight rounds, no round under 5, and your ninth round has a single correct answer that is provable from the lines shown.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Scenario round', 'Interview step: read an excerpt, explain it aloud in minutes.'],
  ['Think aloud', 'Say your reasoning while you read, so the examiner can follow it.'],
  ['Rubric', 'Fixed scoring criteria, so practice is measurable.'],
  ['Certain vs suggested', 'What the log proves vs what it only hints at.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read in a fixed order: time, source, normal vs abnormal.</li>
<li>One sentence for what happened; separate problems stay separate.</li>
<li>Say how sure you are and which log would confirm.</li>
<li>End with an action and a prevention.</li>
<li>Practise with a timer and a recorder; score with the rubric.</li>
</ul>
${nguon('🛡️', 'USENIX Security 2017 — Understanding the Mirai Botnet', 'Default-credential guessing at internet scale', 'https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/antonakakis')}
${lienKet({ khoa: 'interview-prep', bai: 'pv-8-4-khi-khong-hieu', title: 'Interview prep 8.4 — When you do not understand the question', sub: 'Ask to repeat, rephrase, buy time — in English', cta: 'Open' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-5-5-lab-mock-devops', title: 'Interview prep 5.5 — Mock DevOps interview around an incident drill', sub: '45 minutes with a scoring sheet', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.2</span>
<h2>Năm phút, một đoạn log, nói thành tiếng</h2>
<p class="lead">Nhiều buổi phỏng vấn kỹ thuật — và gần như mọi buổi phỏng vấn SOC — có một vòng đưa bạn một màn hình log và hỏi "chuyện gì đã xảy ra?". Bạn có vài phút và phải nghĩ thành tiếng. Bài này cho bạn tám vòng như thế, dựng hoàn toàn từ <strong>output thật</strong> của các lab trong khoá, một phiếu chấm, và các câu tiếng Anh để nói.</p>

<h3>Liên tưởng đời thường: thi sa hình, không phải thi lý thuyết</h3>
<p>Thuộc biển báo là thi lý thuyết. Thi sa hình đặt bạn lên đường thật và quan sát bạn nhìn gì, lúc nào. Vòng đọc log là thi sa hình: giám khảo nhìn mắt bạn — bạn xem thời gian trước? mã trạng thái? nguồn? — và nghe cách bạn suy luận.</p>

<h3>Tự luyện một vòng một mình</h3>
<ol>
<li>Bật đồng hồ 5 phút và máy ghi âm của điện thoại.</li>
<li>Đọc bối cảnh và đoạn log. Nói ra bạn thấy gì, từng trường một, rồi bạn nghĩ chuyện gì đã xảy ra.</li>
<li>Trả lời câu hỏi. Gọi tên log tiếp theo và lệnh. Kết bằng một hành động.</li>
<li>Dừng. Mở lời giải mẫu và tự chấm theo phiếu bên dưới (0–2 điểm mỗi tiêu chí, tổng 10). Ghi lại chỗ bỏ sót.</li>
<li>Hôm sau làm lại những vòng dưới 7 điểm — không mở lời giải trước.</li>
</ol>
<p>Trình tự chịu được áp lực: <strong>thời gian → nguồn → ở đây cái gì là bình thường → cái gì không → một câu chuyện gì đã xảy ra → chắc tới đâu → bước tiếp → hành động</strong>.</p>

<h3>Phiếu chấm (10 điểm mỗi vòng)</h3>
${bangRubric('vi')}
<p>7–8 điểm là đạt với thực tập sinh/fresher; 9–10 nghe như người đã từng trực sự cố.</p>

<h3>Tám vòng</h3>
${dsTH('vi')}

<h3>Nói song ngữ: các câu nên luyện</h3>
<p>Ở công ty Việt Nam, trao đổi thường bằng tiếng Việt chen thuật ngữ tiếng Anh; với khách nước ngoài hay phỏng vấn tiếng Anh thì toàn bộ là tiếng Anh. Luyện cả hai. Giữ thuật ngữ bằng tiếng Anh (timeout, upstream, deadlock, trace ID) và nói rõ ràng.</p>
${bangCum('vi')}

<h3>🛡️ Góc hacker: cái bẫy người phỏng vấn thích nhất</h3>
<p>Vòng 5 giấu cái bẫy người phỏng vấn SOC dùng nhiều nhất: ứng viên đếm số lần sai, nói "brute force, chặn IP" rồi dừng. Dòng duy nhất biến tiếng ồn thành sự cố là lần <em>thành công</em> sau chuỗi thất bại. Từ năm 2016, botnet Mirai và các biến thể đã chiếm hàng trăm nghìn thiết bị đúng theo kiểu này — thử tên và mật khẩu mặc định của nhà sản xuất tới khi có cái đúng. Luôn hỏi: "có lần nào vào được không?"</p>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Đội outsourcing</strong>: khách dán 50 dòng log vào ticket và đòi giải thích trước cuối ngày. Phiếu chấm ở trên cũng là dàn ý tốt cho câu trả lời viết: chuyện gì đã xảy ra, chắc tới đâu, bước tiếp, hành động.</li>
<li><strong>Phỏng vấn qua video</strong>: nếu họ chia sẻ màn hình, hỏi "em xin một phút để đọc được không ạ?" — điều đó được chờ đợi. Đọc trước, nói sau.</li>
<li><strong>Gặp trường không biết</strong> (vd "Filter Run-Time ID"): nói thẳng là không biết, nói bạn sẽ tra ở đâu, rồi chuyển sang các trường quan trọng.</li>
</ul>

<h3>🧪 Thực hành (60 phút)</h3>
<div class="callout ok"><ol>
<li>Làm cả tám vòng với đồng hồ và máy ghi âm, rồi chấm từng vòng.</li>
<li>Chọn hai vòng điểm thấp nhất; mở bài được dẫn trong lời giải, làm lại bước lab của bài đó, rồi hôm sau làm lại vòng đó.</li>
<li>Tự dựng vòng thứ chín từ output lab của chính bạn (chương nào cũng được): bối cảnh + 5–15 dòng + câu hỏi + lời giải mẫu. Đưa cho một bạn cùng lớp làm.</li>
</ol>
<p><strong>Đạt khi:</strong> trung bình ≥ 7/10 trên tám vòng, không vòng nào dưới 5, và vòng thứ chín của bạn có một đáp án đúng duy nhất chứng minh được từ chính các dòng đã đưa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Vòng tình huống (scenario round)', 'Bước phỏng vấn: đọc một đoạn log, giải thích thành tiếng trong vài phút.'],
  ['Nghĩ thành tiếng (think aloud)', 'Nói lập luận trong lúc đọc để giám khảo theo kịp.'],
  ['Phiếu chấm (rubric)', 'Tiêu chí chấm cố định, để việc luyện đo được.'],
  ['Chắc chắn hay gợi ý', 'Điều log chứng minh so với điều nó chỉ gợi ý.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc theo thứ tự cố định: thời gian, nguồn, bình thường hay bất thường.</li>
<li>Một câu cho chuyện đã xảy ra; vấn đề riêng thì tách riêng.</li>
<li>Nói rõ chắc tới đâu và log nào sẽ xác nhận.</li>
<li>Kết bằng hành động và cách phòng.</li>
<li>Luyện với đồng hồ và máy ghi âm; chấm bằng phiếu.</li>
</ul>
${nguon('🛡️', 'USENIX Security 2017 — Understanding the Mirai Botnet', 'Dò mật khẩu mặc định ở quy mô cả Internet', 'https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/antonakakis')}
${lienKet({ khoa: 'interview-prep', bai: 'pv-8-4-khi-khong-hieu', title: 'Chuẩn bị phỏng vấn 8.4 — Khi không hiểu câu hỏi', sub: 'Xin nhắc lại, diễn đạt lại, mua thời gian — bằng tiếng Anh', cta: 'Mở bài' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-5-5-lab-mock-devops', title: 'Chuẩn bị phỏng vấn 5.5 — Phỏng vấn thử DevOps quanh một buổi diễn tập sự cố', sub: '45 phút có phiếu chấm', cta: 'Mở bài' })}
</div>
`,
};
