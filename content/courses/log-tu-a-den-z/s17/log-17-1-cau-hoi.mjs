/**
 * 17.1 — Câu hỏi về log trong phỏng vấn backend, DevOps/SRE và SOC (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s17/tra-loi'] (gói log mẫu tao-goi-log.py, container lgz-lab:1 — Ubuntu 24.04, mawk 1.3.4, jq 1.7, TZ Asia/Ho_Chi_Minh).
 * Số trong lời (tất định theo gói log): 137 lỗi 5xx đều trong giờ 14 (80×502 + 57×504), /api/v1/feed 65 · notifications 41 · me 31,
 * 25 dòng "connect ECONNREFUSED 10.0.0.20:5432" từ 14:04:25 tới 14:08:20; auth.log: 1 Accepted (deploy, 192.0.2.10, khoá), 74/45/41 lần sai từ 3 IP.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

const C = (en, vi) => ({ en, vi });
// 30 câu: [nhóm, câu EN, câu VI, gợi ý EN, gợi ý VI, bài trong khoá]
const CAU = [
  // A — nền tảng (ai cũng bị hỏi)
  ['A', 'What is the difference between a log, a metric and a trace? When is a log the wrong tool?', 'Log, metric và trace khác nhau thế nào? Khi nào log là công cụ sai?',
    'Log = one record per event, with detail (who, what, error text). Metric = a number over time (requests/s, p95 latency), cheap to store and alert on. Trace = the path of one request through many services with timing per hop. Wrong tool: counting "how many 5xx per minute over 30 days" by grepping logs — use a metric; finding "which service made this request slow" — use a trace.',
    'Log = một bản ghi cho mỗi sự kiện, có chi tiết (ai, làm gì, thông điệp lỗi). Metric = một con số theo thời gian (request/giây, độ trễ p95), lưu rẻ, cảnh báo dễ. Trace = đường đi của MỘT request qua nhiều dịch vụ, có thời gian từng chặng. Dùng sai: đếm "bao nhiêu 5xx mỗi phút trong 30 ngày" bằng cách grep log — nên dùng metric; tìm "dịch vụ nào làm request này chậm" — nên dùng trace.', 'log-1-1-log-la-gi'],
  ['A', 'What makes a good log line?', 'Một dòng log tốt cần có gì?',
    'Timestamp with time zone (ideally UTC, ISO 8601), level, service/host, a fixed message, and context fields: request id, user id (not the user\'s secrets), the key business id (orderId), duration, error type + stack. Structured (JSON) so a machine can filter by field. And it answers the 5W: who, what, when, where, result.',
    'Thời điểm có múi giờ (tốt nhất UTC, ISO 8601), mức, dịch vụ/máy, thông điệp cố định, và trường ngữ cảnh: request id, user id (không phải bí mật của người dùng), mã nghiệp vụ chính (orderId), thời gian xử lý, loại lỗi + stack. Có cấu trúc (JSON) để máy lọc theo trường. Và trả lời đủ 5W: ai, làm gì, lúc nào, ở đâu, kết quả.', 'log-1-2-giai-phau'],
  ['A', 'Explain log levels. What do you log at INFO vs DEBUG vs ERROR in production?', 'Giải thích mức log. Ở production bạn ghi gì ở INFO, DEBUG, ERROR?',
    'ERROR = something failed and someone may need to act (request failed, job failed). WARN = unusual but handled (retry succeeded, slow query). INFO = business events and lifecycle (started, order created, payment confirmed). DEBUG = detail for developers, normally off in production. Rule of thumb: if ERROR fires and nobody needs to do anything, it is not an ERROR — that noise is how real errors get ignored.',
    'ERROR = có thứ thất bại và có thể cần người xử lý (request lỗi, job lỗi). WARN = bất thường nhưng đã xử lý được (thử lại thành công, truy vấn chậm). INFO = sự kiện nghiệp vụ và vòng đời (khởi động, tạo đơn, thanh toán xong). DEBUG = chi tiết cho lập trình viên, thường tắt ở production. Mẹo: ERROR bắn ra mà không ai cần làm gì thì nó không phải ERROR — chính tiếng ồn đó làm lỗi thật bị bỏ qua.', 'log-1-3-muc-log'],
  ['A', 'Why do time zones break investigations, and how do you avoid it?', 'Vì sao múi giờ làm hỏng cuộc điều tra, và tránh thế nào?',
    'Sources mix UTC and local time (Windows stores UTC but shows local; nginx $time_local; PostgreSQL log_timezone), and clocks drift. Merge sources in one zone (UTC), write the offset explicitly, and check NTP (timedatectl, chronyc tracking, w32tm). In Lab 1 of this course one proxy was 180 s fast — the "cause" appeared after the "effect" until we corrected it.',
    'Các nguồn trộn UTC và giờ địa phương (Windows lưu UTC nhưng hiện giờ máy; nginx $time_local; PostgreSQL log_timezone), và đồng hồ lệch. Gộp các nguồn về một múi (UTC), ghi rõ độ lệch, kiểm NTP (timedatectl, chronyc tracking, w32tm). Ở Lab 1 của khoá, một proxy nhanh 180 giây — "nguyên nhân" xuất hiện sau "hậu quả" cho tới khi sửa.', 'log-1-5-thoi-gian'],
  ['A', 'What should never be written to a log?', 'Thứ gì không bao giờ được ghi vào log?',
    'Passwords, tokens (Bearer/JWT, API keys, session cookies), full card numbers/CVV, secrets in URLs (?token=), and personal data beyond what you need (mask email/phone). Real incidents: Twitter 2018 and Facebook 2019 both found passwords in plain text in internal logs. Defence: redact at the logger (pino redact, Logback masking), never log whole request objects, scan logs with gitleaks-like rules, and limit who can read logs.',
    'Mật khẩu, token (Bearer/JWT, khoá API, cookie phiên), số thẻ đầy đủ/CVV, bí mật trên URL (?token=), và dữ liệu cá nhân quá mức cần (che email/số điện thoại). Sự cố thật: Twitter 2018 và Facebook 2019 đều phát hiện mật khẩu dạng chữ thường trong log nội bộ. Phòng: che ngay ở logger (redact của pino, masking của Logback), không bao giờ log nguyên đối tượng request, quét log bằng luật kiểu gitleaks, giới hạn người được đọc log.', 'log-16-3-khong-log-bi-mat'],
  ['A', 'How long should logs be kept?', 'Log nên giữ bao lâu?',
    'It depends on purpose and law, not on disk size: debugging needs days to weeks (hot, searchable), security investigations need months (attackers stay unnoticed for a long time — Equifax: 76 days), and regulations set minimums (Vietnam: Decree 333/2026 asks system logs ≥ 12 months; PCI DSS: 12 months, 3 immediately available). Tier it: hot → cheap cold storage → delete; and personal data must not be kept longer than needed.',
    'Tuỳ mục đích và luật, không tuỳ ổ đĩa: gỡ lỗi cần vài ngày tới vài tuần (nóng, tìm được ngay), điều tra bảo mật cần nhiều tháng (kẻ tấn công nằm lâu không bị phát hiện — Equifax: 76 ngày), và quy định đặt mức tối thiểu (Việt Nam: Nghị định 333/2026 yêu cầu nhật ký hệ thống ≥ 12 tháng; PCI DSS: 12 tháng, 3 tháng có sẵn ngay). Chia tầng: nóng → kho lạnh rẻ → xoá; dữ liệu cá nhân không giữ lâu hơn mức cần.', 'log-16-1-luu-bao-lau'],
  // B — backend (Node.js / Spring)
  ['B', 'Users report errors on the website. Walk me through what you do.', 'Người dùng báo web lỗi. Kể tôi nghe bạn làm gì, từng bước.',
    'See the worked example above: when did it start and how many (access log by status and time) → where (which paths) → what the application says in that window (app log, level ≥ error) → follow one request id → confirm in the dependency\'s own log (DB, upstream) → mitigate first, then root cause. Say the commands you would run.',
    'Xem ví dụ mẫu ở trên: bắt đầu lúc nào, bao nhiêu (access log theo mã và giờ) → ở đâu (đường nào) → ứng dụng nói gì trong khung giờ đó (log app, mức ≥ error) → theo một request id → xác nhận ở log của chính phụ thuộc (CSDL, upstream) → giảm thiệt hại trước, tìm gốc sau. Nói ra lệnh bạn sẽ chạy.', 'log-10-10-lab'],
  ['B', '502 vs 504 from nginx — what does each tell you?', 'nginx trả 502 và 504 — mỗi mã nói gì?',
    '502 Bad Gateway: nginx could not get a valid answer — error.log shows "connect() failed (111: Connection refused)" (app down / wrong port) or "upstream prematurely closed". 504 Gateway Timeout: the app accepted but did not answer within proxy_read_timeout — "upstream timed out (110)", and rt ≈ the timeout (5.000 in Lab 10). 502 → is the process alive? 504 → what is it waiting for (DB, external API)? Raising the timeout hides 504 but not slowness.',
    '502 Bad Gateway: nginx không nhận được câu trả lời hợp lệ — error.log có "connect() failed (111: Connection refused)" (app chết / sai cổng) hoặc "upstream prematurely closed". 504 Gateway Timeout: app nhận nhưng không trả lời kịp proxy_read_timeout — "upstream timed out (110)", và rt ≈ đúng ngưỡng (5.000 ở Lab 10). 502 → tiến trình còn sống không? 504 → nó đang chờ cái gì (CSDL, API ngoài)? Tăng timeout làm hết 504 nhưng không hết chậm.', 'log-10-1-ma-trang-thai'],
  ['B', 'What is a correlation (request) id and how do you implement it in Node.js and Spring?', 'Correlation id (request id) là gì, làm thế nào trong Node.js và Spring?',
    'One id per request, taken from an incoming header (X-Request-Id / traceparent) or generated at the edge, returned in the response, and attached to every log line of that request and every downstream call. Node: pino-http genReqId + child logger (or AsyncLocalStorage). Spring: a filter puts it in MDC (MDC.put("requestId", …)) and the JSON encoder writes it; with Micrometer Tracing traceId/spanId are added automatically. Trap: MDC is per thread — copy it into @Async/executor threads (TaskDecorator).',
    'Mỗi request một mã, lấy từ header vào (X-Request-Id / traceparent) hoặc sinh ở rìa, trả lại trong response, gắn vào MỌI dòng log của request đó và mọi lời gọi xuống dưới. Node: genReqId của pino-http + child logger (hoặc AsyncLocalStorage). Spring: một filter đặt vào MDC (MDC.put("requestId", …)) và encoder JSON ghi nó ra; có Micrometer Tracing thì traceId/spanId tự thêm. Bẫy: MDC gắn theo luồng — phải chép sang luồng @Async/executor (TaskDecorator).', 'log-10-7-java-mdc-json-hieu-nang'],
  ['B', 'Why structured (JSON) logs instead of plain text?', 'Vì sao log có cấu trúc (JSON) thay vì văn bản thường?',
    'Fields are explicit, so you filter by field (level, requestId, status) instead of fragile regex; adding a field does not break parsers; central stores (Loki, Elasticsearch) index them directly. Costs: bigger lines and harder to read raw — use pino-pretty locally. Rule: keep the message constant ("order created") and put variables in fields, so you can count by message.',
    'Trường rõ ràng nên lọc theo trường (level, requestId, status) thay vì regex dễ vỡ; thêm trường không làm hỏng bộ đọc; kho tập trung (Loki, Elasticsearch) lấy thẳng. Cái giá: dòng to hơn, đọc trần khó hơn — dùng pino-pretty khi chạy máy mình. Quy tắc: giữ thông điệp cố định ("order created"), biến số đặt vào trường, để đếm được theo thông điệp.', 'log-10-8-log-cau-truc'],
  ['B', 'Can logging slow down an application?', 'Ghi log có làm ứng dụng chậm không?',
    'Yes: synchronous writes to a slow disk or network, string building for disabled levels (log.debug("..." + bigObject) still builds the string — 342 ms vs near zero with placeholders in lesson 10.7), logging huge objects, stack traces in hot loops. Fix: placeholders/lazy arguments, async appenders (Logback AsyncAppender, pino transport in a worker), sample noisy logs, and never log per item inside a big loop.',
    'Có: ghi đồng bộ xuống đĩa/mạng chậm, dựng chuỗi cho mức đang tắt (log.debug("..." + vatTo) vẫn dựng chuỗi — 342 ms so với gần 0 khi dùng placeholder ở bài 10.7), log đối tượng khổng lồ, stack trace trong vòng lặp nóng. Sửa: placeholder/đối số lười, appender bất đồng bộ (AsyncAppender của Logback, transport pino chạy ở worker), lấy mẫu log ồn, không log từng phần tử trong vòng lặp lớn.', 'log-10-7-java-mdc-json-hieu-nang'],
  ['B', 'What was Log4Shell and what did it teach about logging?', 'Log4Shell là gì và nó dạy gì về chuyện ghi log?',
    'CVE-2021-44228 (December 2021): Log4j 2 up to 2.14.1 evaluated ${jndi:ldap://…} lookups inside logged strings, so logging a User-Agent could make the server load remote code. Lessons: log data is attacker-controlled input; keep logging libraries patched (2.17.1+); know your dependency tree (mvn dependency:tree); and your access logs show the attempts — search for "${jndi".',
    'CVE-2021-44228 (12/2021): Log4j 2 tới 2.14.1 thực thi lookup ${jndi:ldap://…} nằm trong chuỗi được log, nên chỉ log một User-Agent cũng có thể khiến máy chủ tải mã từ xa. Bài học: dữ liệu đem đi log là đầu vào do kẻ tấn công kiểm soát; cập nhật thư viện log (2.17.1+); biết cây phụ thuộc (mvn dependency:tree); và access log ghi lại các lần thử — tìm "${jndi".', 'log-10-7-java-mdc-json-hieu-nang'],
  ['B', 'A query is slow only sometimes. Which logs help?', 'Một truy vấn lúc chậm lúc không. Log nào giúp?',
    'The app log with duration per request (find the slow ones and their ids), the database slow log (log_min_duration_statement, with parameters) for "which execution", pg_stat_statements for "which query in total", auto_explain for the plan at that moment, and lock waits (log_lock_waits) — "sometimes slow" is often waiting for a lock, not a bad plan.',
    'Log app có thời gian từng request (tìm request chậm và mã của nó), slow log của CSDL (log_min_duration_statement, kèm tham số) cho "lần chạy nào", pg_stat_statements cho "câu nào tính tổng", auto_explain cho kế hoạch đúng lúc đó, và chờ khoá (log_lock_waits) — "lúc chậm lúc không" thường là chờ khoá, không phải kế hoạch tồi.', 'log-12-2-slow-query'],
  ['B', 'The app works locally but fails in Docker/Kubernetes and you see nothing in the logs. Why?', 'App chạy ở máy mình nhưng hỏng trong Docker/Kubernetes và log trống trơn. Vì sao?',
    'Common causes: the app writes to a file inside the container instead of stdout/stderr; output is buffered (Python without PYTHONUNBUFFERED — empty log until the buffer flushes); the container already restarted, so you need docker logs of the old one or kubectl logs --previous; or the process died before logging (exit 137 OOMKilled, 139 segfault) — read docker inspect / kubectl describe, not only logs.',
    'Hay gặp: app ghi vào tệp trong container thay vì stdout/stderr; output bị đệm (Python thiếu PYTHONUNBUFFERED — log trống tới khi đệm đầy); container đã khởi động lại nên cần log của lần trước (kubectl logs --previous); hoặc tiến trình chết trước khi kịp log (exit 137 OOMKilled, 139 segfault) — đọc docker inspect / kubectl describe, không chỉ đọc log.', 'log-13-1-docker-logs'],
  // C — DevOps / SRE
  ['C', 'journald vs syslog (rsyslog) — what is the difference?', 'journald và syslog (rsyslog) khác nhau thế nào?',
    'journald (systemd) stores binary, indexed records with trusted fields (_PID, _SYSTEMD_UNIT, _BOOT_ID), queried with journalctl (-u, -b, -p, --since, -o json). rsyslog is the classic daemon that writes text files (/var/log/syslog, auth.log) and forwards over the network (TCP/TLS, RFC 5424). On Ubuntu both run: journald receives, rsyslog reads from it and writes files. Persistence: without /var/log/journal (Storage=auto) the journal is lost on reboot.',
    'journald (systemd) lưu bản ghi nhị phân có chỉ mục, có trường tin cậy (_PID, _SYSTEMD_UNIT, _BOOT_ID), truy vấn bằng journalctl (-u, -b, -p, --since, -o json). rsyslog là daemon cổ điển ghi tệp văn bản (/var/log/syslog, auth.log) và chuyển qua mạng (TCP/TLS, RFC 5424). Trên Ubuntu cả hai cùng chạy: journald nhận, rsyslog đọc từ nó rồi ghi tệp. Lưu bền: không có /var/log/journal (Storage=auto) thì journal mất khi khởi động lại.', 'log-8-2-rsyslog'],
  ['C', 'A server rebooted at night. How do you find out why?', 'Máy chủ tự khởi động lại ban đêm. Tìm nguyên nhân thế nào?',
    'journalctl --list-boots, then the END of the previous boot: journalctl -b -1 -n 50. A clean shutdown ends with "Journal stopped" after systemd stopping units, and you look for who ran reboot (sudo in auth.log, unattended-upgrades). A power loss/kernel crash just stops mid-sentence, and the next boot says "uncleanly shut down"/"not properly unmounted". Also check -k for kernel panic/OOM and the hypervisor/cloud console. Windows equivalent: 1074 (who restarted), 6008 + 41 (unexpected).',
    'journalctl --list-boots, rồi xem CUỐI lần khởi động trước: journalctl -b -1 -n 50. Tắt sạch kết thúc bằng "Journal stopped" sau khi systemd dừng các unit, và tìm ai chạy reboot (sudo trong auth.log, unattended-upgrades). Mất điện/nhân sập thì log đứt giữa chừng, lần khởi động sau báo "uncleanly shut down"/"not properly unmounted". Xem thêm -k tìm kernel panic/OOM và bảng điều khiển hypervisor/cloud. Bên Windows: 1074 (ai khởi động lại), 6008 + 41 (bất ngờ).', 'log-7-1-journald-luu'],
  ['C', 'The disk is full because of logs. What do you do now, and what do you change after?', 'Đĩa đầy vì log. Làm gì ngay, và sửa gì sau đó?',
    'Now: find the culprit (du -xh /var/log | sort -h, journalctl --disk-usage, docker container sizes), free space safely (journalctl --vacuum-size, compress/move old files; truncate an open file with : > file — deleting it does not free space while a process holds it open, check lsof +L1). After: logrotate with size + rotate + compress, journald SystemMaxUse, Docker log-opts max-size/max-file, alert on disk %, lower noisy levels.',
    'Ngay: tìm thủ phạm (du -xh /var/log | sort -h, journalctl --disk-usage, kích thước log container), giải phóng an toàn (journalctl --vacuum-size, nén/chuyển tệp cũ; tệp đang mở thì làm rỗng bằng : > tep — xoá tệp không trả chỗ khi tiến trình còn giữ nó, kiểm bằng lsof +L1). Sau đó: logrotate với size + rotate + compress, SystemMaxUse của journald, max-size/max-file của Docker, cảnh báo theo % đĩa, hạ mức log ồn.', 'log-8-5-logrotate'],
  ['C', 'copytruncate vs create in logrotate?', 'copytruncate và create trong logrotate khác gì?',
    'create: rename the file and create a new one — the app must reopen it (postrotate sends a signal, e.g. nginx USR1), otherwise it keeps writing into the renamed file. copytruncate: copy then truncate in place — works with apps that cannot reopen, but lines written between copy and truncate are lost (lesson 8.5 measured exactly that).',
    'create: đổi tên tệp và tạo tệp mới — app phải mở lại tệp (postrotate gửi tín hiệu, vd USR1 cho nginx), nếu không nó vẫn ghi vào tệp đã đổi tên. copytruncate: chép rồi cắt rỗng tại chỗ — dùng được với app không mở lại tệp, nhưng các dòng ghi giữa lúc chép và lúc cắt bị mất (bài 8.5 đã đo đúng chuyện đó).', 'log-8-5-logrotate'],
  ['C', 'Loki vs Elasticsearch — how would you choose?', 'Loki và Elasticsearch — chọn thế nào?',
    'Loki indexes only labels (service, host, level) and stores compressed chunks — cheap to run, fast when you know which stream, slower for "search everything for this string"; queries in LogQL; fits a Grafana stack. Elasticsearch indexes the content (full text and fields) — powerful search and aggregations (KQL, ES|QL), but needs much more RAM and disk (≈3 GB RAM just to start in Lab 15). Small team, cost-sensitive → Loki; security search/analytics → Elastic or a SIEM. Trap in Loki: high-cardinality labels (user id) explode the index.',
    'Loki chỉ đánh chỉ mục nhãn (dịch vụ, máy, mức) và lưu khối nén — chạy rẻ, nhanh khi biết luồng nào, chậm hơn khi "tìm chuỗi này trong mọi thứ"; truy vấn bằng LogQL; hợp với Grafana. Elasticsearch đánh chỉ mục nội dung (toàn văn và trường) — tìm và gộp mạnh (KQL, ES|QL) nhưng tốn RAM, đĩa hơn nhiều (≈3 GB RAM chỉ để khởi động ở Lab 15). Nhóm nhỏ, cần rẻ → Loki; tìm kiếm/phân tích bảo mật → Elastic hoặc SIEM. Bẫy Loki: nhãn nhiều giá trị (user id) làm nổ chỉ mục.', 'log-15-1-vi-sao-tap-trung'],
  ['C', 'How do you alert from logs without drowning in alerts?', 'Cảnh báo từ log thế nào để không ngập cảnh báo?',
    'Alert on symptoms users feel (5xx rate, payment failures), not on every ERROR line; use thresholds over a window plus a "for" duration; group and deduplicate; route by severity (page only for urgent); every alert has a runbook link; and alert on silence too — a service that stops logging is often dead. Prefer metrics for rates; use log alerts for events that have no metric (a new admin user, a cleared log).',
    'Cảnh báo theo triệu chứng người dùng cảm thấy (tỉ lệ 5xx, thanh toán lỗi), không theo từng dòng ERROR; dùng ngưỡng trong một cửa sổ cộng thời gian "for"; gom và bỏ trùng; định tuyến theo mức (chỉ gọi dậy khi khẩn); mỗi cảnh báo có liên kết runbook; và cảnh báo cả sự im lặng — dịch vụ ngừng ghi log thường là đã chết. Tỉ lệ thì dùng metric; cảnh báo log cho sự kiện không có metric (tạo admin mới, xoá log).', 'log-15-5-canh-bao'],
  ['C', 'How do you get logs from 50 servers into one place safely?', 'Đưa log của 50 máy chủ về một chỗ an toàn thế nào?',
    'An agent on each host (Alloy/Promtail-successor, Filebeat, Fluent Bit, rsyslog, Winlogbeat for Windows) ships to a central store over TLS (ideally mTLS), with buffering on disk so a network cut does not lose logs; parse at the edge into fields; add labels host/service/env; restrict write vs read permissions; and ship off the host quickly — an attacker with root can edit local logs, not ones already shipped.',
    'Mỗi máy một agent (Alloy, Filebeat, Fluent Bit, rsyslog, Winlogbeat cho Windows) gửi về kho trung tâm qua TLS (tốt nhất mTLS), có đệm trên đĩa để đứt mạng không mất log; tách trường ngay ở rìa; gắn nhãn host/service/env; tách quyền ghi và quyền đọc; và đưa log rời máy càng sớm càng tốt — kẻ có root sửa được log trên máy, không sửa được log đã gửi đi.', 'log-15-2-loki-grafana'],
  ['C', 'Logs cost too much. How do you reduce the bill without going blind?', 'Log tốn tiền quá. Giảm hoá đơn thế nào mà không thành mù?',
    'Measure first (which service/message produces most bytes), then: drop health-check and static-file noise, lower DEBUG in production, sample repetitive success logs but keep 100% of errors, shorten retention in the hot tier and move to cold storage, remove duplicated fields. In lesson 16.2 the same 1000 requests made 158 890 bytes at info and 962 450 bytes at debug — six times more.',
    'Đo trước (dịch vụ/thông điệp nào sinh nhiều byte nhất), rồi: bỏ tiếng ồn health-check và tệp tĩnh, hạ DEBUG ở production, lấy mẫu log thành công lặp lại nhưng giữ 100% lỗi, rút thời gian ở tầng nóng và chuyển sang kho lạnh, bỏ trường trùng lặp. Ở bài 16.2 cùng 1000 request sinh 158 890 byte ở mức info và 962 450 byte ở mức debug — gấp sáu lần.', 'log-16-2-dung-luong-chi-phi'],
  // D — SOC / bảo mật
  ['D', 'Windows 4624 vs 4625 — and what is a logon type?', 'Windows 4624 và 4625 khác gì — logon type là gì?',
    '4624 = successful logon, 4625 = failed logon (with Status/SubStatus codes, e.g. 0xC000006A wrong password, 0xC0000064 user does not exist). Logon type tells how: 2 interactive (keyboard), 3 network (file share, many services), 10 RemoteInteractive (RDP), 5 service, 7 unlock. Many 4625 then a 4624 type 10 from the same IP = password guessing that succeeded over RDP.',
    '4624 = đăng nhập thành công, 4625 = đăng nhập thất bại (có mã Status/SubStatus, vd 0xC000006A sai mật khẩu, 0xC0000064 tài khoản không tồn tại). Logon type cho biết đăng nhập kiểu gì: 2 tại bàn phím, 3 qua mạng (chia sẻ tệp, nhiều dịch vụ), 10 RemoteInteractive (RDP), 5 dịch vụ, 7 mở khoá màn hình. Nhiều 4625 rồi một 4624 kiểu 10 từ cùng IP = dò mật khẩu đã thành công qua RDP.', 'log-4-1-dang-nhap'],
  ['D', 'How do you detect a brute-force attack in logs? And password spraying?', 'Phát hiện dò mật khẩu (brute force) trong log thế nào? Còn password spraying?',
    'Brute force: many failures for one account (or from one IP) in a short window — count "Failed password" by IP/user, or 4625 by account. Spraying: one or two common passwords tried against MANY accounts, so each account has few failures (under the lockout threshold) — count distinct users per source IP. The most important line is the success after the failures: same IP, Accepted/4624.',
    'Brute force: nhiều lần sai cho một tài khoản (hoặc từ một IP) trong thời gian ngắn — đếm "Failed password" theo IP/user, hoặc 4625 theo tài khoản. Spraying: một hai mật khẩu phổ biến thử trên RẤT NHIỀU tài khoản, nên mỗi tài khoản chỉ sai vài lần (dưới ngưỡng khoá) — đếm số user KHÁC NHAU theo IP nguồn. Dòng quan trọng nhất là lần THÀNH CÔNG sau chuỗi thất bại: cùng IP, Accepted/4624.', 'log-14-1-brute-force'],
  ['D', 'An attacker cleared the logs. Is the investigation over?', 'Kẻ tấn công đã xoá log. Cuộc điều tra kết thúc chưa?',
    'No. Clearing leaves its own event (Windows 1102 for Security, 104 for System — with the account that did it); a gap in an otherwise continuous log is evidence; logs already shipped to a central store are untouched; and other sources remain (firewall, proxy, EDR, cloud audit). That is why we forward logs off the host and restrict who can clear them (MITRE now files this under T1685.005).',
    'Chưa. Xoá log để lại chính sự kiện của nó (Windows 1102 cho Security, 104 cho System — kèm tài khoản đã làm); một khoảng trống trong log vốn liên tục là bằng chứng; log đã gửi về kho trung tâm không bị ảnh hưởng; và còn nguồn khác (tường lửa, proxy, EDR, kiểm toán cloud). Vì thế ta đưa log rời máy và giới hạn quyền xoá (MITRE nay xếp hành vi này vào T1685.005).', 'log-4-3-xoa-log-chinh-sach'],
  ['D', 'Which Linux logs show privilege escalation and persistence?', 'Log Linux nào cho thấy leo thang quyền và cài bám trụ?',
    'auth.log/secure: sudo lines (user, TTY, COMMAND), "not in the sudoers file", su; useradd/usermod/chpasswd; auditd with rules on /etc/sudoers, /etc/passwd, ~/.ssh/authorized_keys, cron and systemd unit directories (ausearch -k); journald for new services (systemd "Started …" for unknown units). Lesson 8.4 of this course caught a NOPASSWD sudoers backdoor exactly this way.',
    'auth.log/secure: dòng sudo (user, TTY, COMMAND), "not in the sudoers file", su; useradd/usermod/chpasswd; auditd với luật theo dõi /etc/sudoers, /etc/passwd, ~/.ssh/authorized_keys, thư mục cron và unit systemd (ausearch -k); journald cho dịch vụ mới (systemd "Started …" của unit lạ). Bài 8.4 của khoá bắt được cửa sau NOPASSWD trong sudoers đúng theo cách này.', 'log-8-4-auditd'],
  ['D', 'What is Sysmon and why do defenders install it?', 'Sysmon là gì và vì sao người phòng thủ cài nó?',
    'A free Microsoft Sysinternals driver + service that writes detailed events to its own channel: 1 process creation with full command line and hashes, 3 network connection, 11 file create, 13 registry value set, 22 DNS query, and more. Default Windows auditing does not record command lines; Sysmon does, which is what most detection rules need. Configure it (e.g. a community config) — the default config is too noisy or too quiet.',
    'Driver + dịch vụ miễn phí của Microsoft Sysinternals, ghi sự kiện chi tiết vào kênh riêng: 1 tạo tiến trình kèm dòng lệnh đầy đủ và hash, 3 kết nối mạng, 11 tạo tệp, 13 đặt giá trị registry, 22 truy vấn DNS, và nhiều nữa. Audit mặc định của Windows không ghi dòng lệnh; Sysmon ghi — đó là thứ đa số quy tắc phát hiện cần. Phải có cấu hình (vd cấu hình cộng đồng) — mặc định thì quá ồn hoặc quá im.', 'log-5-6-sysmon'],
  ['D', 'What are MITRE ATT&CK and Sigma, and how do they relate to logs?', 'MITRE ATT&CK và Sigma là gì, liên quan gì tới log?',
    'ATT&CK is a public catalogue of attacker behaviours (tactics → techniques with IDs, e.g. T1110 Brute Force, T1078 Valid Accounts), each with the data sources that reveal it — a shared vocabulary for reports. Sigma is a vendor-neutral YAML format for detection rules over logs (logsource + detection + condition) that converts to Splunk, Elastic, Loki queries. Note: ATT&CK renumbered some techniques in 2026 (log clearing moved from T1070.001 to T1685.005) — always check the current site.',
    'ATT&CK là danh mục công khai các hành vi của kẻ tấn công (chiến thuật → kỹ thuật có mã, vd T1110 Brute Force, T1078 Valid Accounts), mỗi kỹ thuật kèm nguồn dữ liệu làm lộ nó — ngôn ngữ chung cho báo cáo. Sigma là định dạng YAML trung lập cho quy tắc phát hiện trên log (logsource + detection + condition), chuyển được sang truy vấn Splunk, Elastic, Loki. Lưu ý: ATT&CK đã đánh số lại một số kỹ thuật năm 2026 (xoá log chuyển từ T1070.001 sang T1685.005) — luôn kiểm trang hiện hành.', 'log-14-6-mitre-attack'],
  ['D', 'How do you build an incident timeline from several sources?', 'Dựng dòng thời gian sự cố từ nhiều nguồn thế nào?',
    'Collect each source with its time zone and clock offset, normalise to UTC, merge-sort by time, keep the source tag on each line, then mark the key moments (first sign, entry, escalation, impact, detection, containment). Validate with a second source for every important claim. Lesson 1.7 did exactly this with Windows CSV, PostgreSQL, app JSON, nginx (+180 s drift) and journald.',
    'Lấy từng nguồn kèm múi giờ và độ lệch đồng hồ, đưa về UTC, gộp và sắp theo thời gian, giữ nhãn nguồn trên mỗi dòng, rồi đánh dấu các mốc chính (dấu hiệu đầu tiên, xâm nhập, leo thang, tác động, phát hiện, khoanh vùng). Mỗi khẳng định quan trọng xác nhận bằng nguồn thứ hai. Bài 1.7 làm đúng như vậy với CSV Windows, PostgreSQL, JSON app, nginx (lệch +180 giây) và journald.', 'log-1-7-lab'],
  ['D', 'A web log shows many 404s for /.env, /wp-admin, /.git/config from one IP. Is it an attack? What do you do?', 'Log web có nhiều 404 tới /.env, /wp-admin, /.git/config từ một IP. Có phải tấn công? Làm gì?',
    'It is automated scanning — internet background noise every public server gets within minutes. The 404s themselves are fine; the question is whether any returned 200 (a leaked .env or .git is a real incident). Check: same IP with status 200/403 on sensitive paths, response size. Then rate-limit or block at the edge, make sure such files are never deployed, and do not page anyone for 404s.',
    'Đó là quét tự động — tiếng ồn nền mọi máy chủ công khai nhận trong vài phút. Bản thân 404 là ổn; câu hỏi là có lần nào trả 200 không (lộ .env hay .git là sự cố thật). Kiểm: cùng IP có mã 200/403 trên đường nhạy cảm không, kích thước phản hồi. Sau đó giới hạn tốc độ/chặn ở rìa, bảo đảm không bao giờ deploy các tệp đó, và đừng gọi ai dậy vì 404.', 'log-10-9-tan-cong-web'],
];
const NHOM = {
  A: C('A. Fundamentals (asked in every role)', 'A. Nền tảng (vai trò nào cũng bị hỏi)'),
  B: C('B. Backend (Node.js / Spring)', 'B. Backend (Node.js / Spring)'),
  C: C('C. DevOps / SRE', 'C. DevOps / SRE'),
  D: C('D. SOC / security', 'D. SOC / bảo mật'),
};
const dsCau = (ngon) => {
  let n = 0, html = '';
  for (const g of ['A', 'B', 'C', 'D']) {
    html += `<h4>${NHOM[g][ngon]}</h4>\n`;
    for (const [nhom, qEn, qVi, aEn, aVi, bai] of CAU) {
      if (nhom !== g) continue;
      n++;
      const q = ngon === 'en' ? qEn : qVi, a = ngon === 'en' ? aEn : aVi;
      html += `<details><summary><strong>${n}.</strong> ${q}</summary><p>${a}</p><p class="small">↪ ${ngon === 'en' ? 'Lesson' : 'Bài'}: <a href="/courses/log-tu-a-den-z/learn?lessonSlug=${bai}">${bai}</a></p></details>\n`;
    }
  }
  return html;
};
if (CAU.length !== 30) throw new Error('17.1: cần đúng 30 câu, đang có ' + CAU.length);

export default {
  title: 'Log questions in backend, DevOps/SRE and SOC interviews, with model answers|||Câu hỏi về log trong phỏng vấn backend, DevOps/SRE và SOC, kèm gợi ý trả lời',
  slug: 'log-17-1-cau-hoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khung trả lời 4 bước cho mọi câu hỏi về log (giả thuyết → nguồn → lệnh → bằng chứng) minh hoạ bằng lệnh chạy thật trên gói log mẫu: "người dùng báo web lỗi" (137 lỗi 5xx trong giờ 14, ba đường API, 25 lần ECONNREFUSED tới CSDL) và "ai đã vào máy chủ". 30 câu hay gặp chia 4 nhóm (nền tảng, backend Node/Spring, DevOps/SRE, SOC) có gợi ý trả lời và dẫn về bài trong khoá; những câu nói làm mất điểm; kể kinh nghiệm từ lab theo STAR; Twitter 2018 và Facebook 2019; vòng phỏng vấn OJT/outsourcing.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.1</span>
<h2>Answering log questions like someone who has done it</h2>
<p class="lead">Interviewers rarely want an event ID recited. They want to hear how you <em>find out</em>: which log you open first, what you type, what the output would tell you, and what you do next. This lesson gives you one answer frame, two fully worked answers with real output, and 30 questions with model answers that point back to the lesson where you practised them.</p>

<h3>The everyday picture: a doctor, not a dictionary</h3>
<p>A good doctor does not list every disease. They ask where it hurts, form a guess, order the one test that separates the guesses, read the result, and only then treat. A log answer works the same way. "I would check the logs" is the patient saying "I feel bad". The interviewer is waiting for the test you would order.</p>

<h3>The four-step answer frame</h3>
<ol>
<li><strong>Hypothesis</strong> — say out loud what could cause it (two or three candidates, not twenty).</li>
<li><strong>Source</strong> — which log separates the candidates, and where it lives on that system.</li>
<li><strong>Command</strong> — the actual filter: grep/awk/jq, journalctl, Get-WinEvent, a LogQL query.</li>
<li><strong>Evidence → action</strong> — what output would confirm or kill the hypothesis, what you do (mitigate first), and what you change so it does not happen again.</li>
</ol>
<p>Then stop and let them ask the follow-up. Talking for five minutes without a pause loses more points than a short answer.</p>

<h3>Worked answer 1: "Users say the website is failing. What do you do?"</h3>
<p>Spoken answer (about 90 seconds), with the commands run for real on the course log pack (lesson 0.1):</p>
<p><em>"First I want to know when it started and how big it is, from the access log, counting 5xx per hour."</em></p>
${lenh('s17/tra-loi', 0)}
${lenh('s17/tra-loi', 1)}
<p><em>"All 137 are in the 14:00 hour, within ten minutes, a mix of 502 and 504 — so the proxy cannot reach the app or the app is too slow. Not a single endpoint bug? Let me check which paths."</em></p>
${lenh('s17/tra-loi', 2)}
<p><em>"Three different API paths — something shared underneath. Now the application log in the same window, errors only."</em></p>
${lenh('s17/tra-loi', 3)}
${lenh('s17/tra-loi', 4)}
${lenh('s17/tra-loi', 5)}
<p><em>"Every error is the app being refused by 10.0.0.20 port 5432 — the database — from 14:04:25 to 14:08:20. So my next stop is the PostgreSQL log and that host's system log: did the database restart or crash? Meanwhile I would tell users we are aware, and after recovery I would make sure the app retries DB connections and we alert on DB availability, not only on 5xx."</em></p>
<p>That answer shows the frame (hypothesis → source → command → evidence), uses real numbers, and ends with mitigation and prevention. The "next stop" really exists in the pack: <code>incident/postgresql.log</code> shows "database system was not properly shut down" at 07:08 UTC = 14:08 Vietnam time — you investigate it in Lab 1.</p>

<h3>Worked answer 2: "Who has logged into this server?"</h3>
${lenh('s17/tra-loi', 6)}
${lenh('s17/tra-loi', 7)}
${lenh('s17/tra-loi', 8)}
<p><em>"One successful login: deploy, by SSH key, from 192.0.2.10 at 09:02 — and that IP never failed before. The three noisy IPs failed 74, 45 and 41 times and never got in. So: scanning, not a breach. I would still confirm the key fingerprint belongs to our CI, check what deploy did with sudo afterwards, and disable password login if it is still on."</em> The last line of output is the question SOC interviewers love: did any IP that failed later succeed?</p>

<h3>30 questions you will meet, with model answers</h3>
<p>Try to answer each one out loud first (use the frame), then open it. Each answer names the lesson where you did it with real output — mention that lab in the interview.</p>
${dsCau('en')}

<h3>Phrases that lose points</h3>
<ul>
<li>"I would just Google it" / "I would ask ChatGPT" — say what you would check; tools are fine, but the reasoning must be yours.</li>
<li>"I would restart the server" as the first step — you destroy evidence (in-memory state, sometimes a volatile journal). Capture first, restart if needed.</li>
<li>"I would log everything at DEBUG" — cost, noise, and secrets in logs.</li>
<li>Guessing an event ID with confidence. "I don't remember the exact ID; I would filter Security for failed logons — I believe it is 4625 — and check" is a better answer.</li>
<li>Blaming: "the DBA broke it". Describe the system, not the person (blameless).</li>
</ul>

<h3>Tell it as your own experience (STAR)</h3>
<p>"Have you ever debugged a production problem?" — you have no job yet, but you have the labs of this course. Be honest that it was a lab, and tell it precisely:</p>
<div class="callout ok"><p><strong>S</strong>ituation: in a lab I built nginx + a Node.js API; users saw intermittent 502/504. <strong>T</strong>ask: find the cause from logs only. <strong>A</strong>ction: counted statuses per minute with awk, matched the 504 rid to the "upstream timed out" line, found that /api/report averaged 1.366 s and the app crashed on /api/crash (supervisor restarts in the app log). <strong>R</strong>esult: separated two problems (a slow endpoint and a crash), proposed a timeout per route and a fix; I wrote it up as a one-page report.</p></div>
<p>Details make it believable: the real number (1.366 s), the real field (rid), the command. The full STAR method is taught in the interview-prep course (link below).</p>

<h3>🛡️ Attacker's corner: "what should never be in a log" is a real-incident question</h3>
<p>In May 2018 Twitter asked its 330 million users to change passwords after a bug wrote passwords unmasked into an internal log. In March 2019 Facebook confirmed that hundreds of millions of passwords had been stored in plain text in internal logs and were searchable by employees. Neither was a hack — they were logging mistakes, and anyone who could read the logs could have taken the passwords. Interviewers ask this because it happens. Answer with the defence: redact at the logger, never log whole requests, scan logs for secrets, restrict who reads logs (lesson 16.3 demonstrates pino redact and gitleaks on real output).</p>

<h3>Real-world situations</h3>
<ul>
<li><strong>OJT/fresher interview at an outsourcing company</strong> (e.g. FPT Software): technical questions are mostly Java/Spring, SQL and API — logs come in as "how do you debug" or "how do you trace a request". Answer 9 (correlation id + MDC) and answer 7 cover it. The self-introduction and project story are often in English: practise saying "I filtered the access log by status code and correlated the request ID with the application log".</li>
<li><strong>Japanese or European clients</strong>: tickets often arrive with a screenshot and "error occurred at 10:32 JST". Converting the time zone (JST = UTC+9, two hours ahead of Vietnam) before you search is the first thing a senior will check you did.</li>
<li><strong>On-call during the internship</strong>: you will not be asked to fix production alone; you will be asked to <em>collect</em>: the time window, request ids, the relevant lines. Doing that cleanly is how a fresher earns trust.</li>
</ul>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok"><ol>
<li>Generate the course log pack and run the nine commands of the two worked answers yourself. Your numbers must match.</li>
<li>Record yourself (phone) answering questions 7, 16, 23 and 25 with the four-step frame, under two minutes each. Listen back: did you name a source and a command each time?</li>
<li>Write your own STAR story from one lab of this course (Lab 7, 8, 10 or 12) with at least two real numbers from your output.</li>
</ol>
<p><strong>Pass when:</strong> (1) you get 137 / 80 + 57 / 25 ECONNREFUSED / one Accepted for deploy; (2) every recorded answer contains hypothesis, a named log, a concrete command, and an action; (3) the story fits in 90 seconds and an outsider can repeat what the problem was.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Four-step frame', 'Hypothesis → source → command → evidence/action.'],
  ['Mitigate first', 'Restore service before hunting the root cause; capture evidence before restarting.'],
  ['STAR', 'Situation, Task, Action, Result — the shape of an experience story.'],
  ['Blameless', 'Describe what the system allowed, not who is guilty.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Interviewers grade how you find out, not what you memorised.</li>
<li>Use the frame: hypothesis → source → command → evidence → action.</li>
<li>Real numbers from your labs make answers believable.</li>
<li>Know the four groups: fundamentals, backend, DevOps/SRE, SOC.</li>
<li>Never-log-secrets is asked because Twitter and Facebook really did it.</li>
</ul>
${nguon('🛡️', 'The Register — Twitter: everyone needs to change their password (3/5/2018)', '330 million users, passwords unmasked in an internal log', 'https://www.theregister.com/2018/05/03/twitter_no_big_deal_but_everyone_needs_to_change_their_password_right_now/')}
${nguon('🛡️', 'Facebook Newsroom — Keeping Passwords Secure (21/3/2019)', 'Facebook\'s own confirmation', 'https://about.fb.com/news/2019/03/keeping-passwords-secure/')}
${nguon('📘', 'OWASP Logging Cheat Sheet', 'What to log, what never to log', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${lienKet({ khoa: 'interview-prep', bai: 'pv-2-2-star', title: 'Interview prep 2.2 — STAR stories from your project', sub: 'How to tell an experience story', cta: 'Open' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-5-4-linux-cloud', title: 'Interview prep 5.4 — Linux, network and cloud questions', sub: 'URL journey, processes, 502/504, DNS, SSH', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.1</span>
<h2>Trả lời câu hỏi về log như người đã từng làm</h2>
<p class="lead">Người phỏng vấn hiếm khi muốn nghe bạn đọc thuộc mã sự kiện. Họ muốn nghe bạn <em>tìm ra</em> thế nào: mở log nào trước, gõ lệnh gì, output sẽ nói gì, rồi làm gì tiếp. Bài này cho bạn một khung trả lời, hai câu trả lời mẫu đầy đủ kèm output thật, và 30 câu hay gặp có gợi ý trả lời, mỗi câu dẫn về đúng bài bạn đã thực hành.</p>

<h3>Liên tưởng đời thường: bác sĩ, không phải cuốn từ điển</h3>
<p>Một bác sĩ giỏi không kể tên mọi bệnh. Họ hỏi đau ở đâu, đoán vài khả năng, chỉ định đúng một xét nghiệm tách được các khả năng đó, đọc kết quả, rồi mới chữa. Trả lời về log cũng vậy. "Em sẽ xem log" giống bệnh nhân nói "tôi thấy mệt". Người phỏng vấn đang chờ nghe bạn chỉ định xét nghiệm gì.</p>

<h3>Khung trả lời 4 bước</h3>
<ol>
<li><strong>Giả thuyết</strong> — nói ra điều gì có thể gây ra chuyện này (hai ba khả năng, không phải hai mươi).</li>
<li><strong>Nguồn</strong> — log nào tách được các khả năng đó, và nó nằm ở đâu trên hệ thống ấy.</li>
<li><strong>Lệnh</strong> — bộ lọc cụ thể: grep/awk/jq, journalctl, Get-WinEvent, một truy vấn LogQL.</li>
<li><strong>Bằng chứng → hành động</strong> — output nào xác nhận hay loại giả thuyết, bạn làm gì (giảm thiệt hại trước), và sửa gì để không lặp lại.</li>
</ol>
<p>Rồi dừng lại để họ hỏi tiếp. Nói liền năm phút không nghỉ mất điểm hơn một câu trả lời ngắn.</p>

<h3>Trả lời mẫu 1: "Người dùng báo web lỗi. Bạn làm gì?"</h3>
<p>Lời nói (khoảng 90 giây), các lệnh chạy thật trên gói log mẫu của khoá (bài 0.1):</p>
<p><em>"Trước tiên em muốn biết lỗi bắt đầu lúc nào và lớn cỡ nào, từ access log, đếm số 5xx theo giờ."</em></p>
${lenh('s17/tra-loi', 0)}
${lenh('s17/tra-loi', 1)}
<p><em>"Cả 137 lỗi đều trong giờ 14, gói trong mười phút, trộn 502 và 504 — tức proxy không tới được app hoặc app quá chậm. Có phải lỗi của một endpoint không? Em xem theo đường dẫn."</em></p>
${lenh('s17/tra-loi', 2)}
<p><em>"Ba đường API khác nhau — vậy là thứ gì đó dùng chung bên dưới. Giờ em mở log ứng dụng đúng khung giờ đó, chỉ lấy lỗi."</em></p>
${lenh('s17/tra-loi', 3)}
${lenh('s17/tra-loi', 4)}
${lenh('s17/tra-loi', 5)}
<p><em>"Mọi lỗi đều là app bị 10.0.0.20 cổng 5432 — tức CSDL — từ chối, từ 14:04:25 tới 14:08:20. Nên chỗ tiếp theo là log PostgreSQL và log hệ thống của máy đó: CSDL có khởi động lại hay sập không? Trong lúc đó em báo người dùng là đã biết sự cố; sau khi hồi phục, em đề xuất app tự thử lại kết nối CSDL và cảnh báo theo tình trạng CSDL, không chỉ theo 5xx."</em></p>
<p>Câu trả lời đó thể hiện đủ khung (giả thuyết → nguồn → lệnh → bằng chứng), dùng số thật, và kết bằng giảm thiệt hại + phòng lần sau. "Chỗ tiếp theo" có thật trong gói log: <code>incident/postgresql.log</code> ghi "database system was not properly shut down" lúc 07:08 UTC = 14:08 giờ Việt Nam — bạn đã điều tra nó ở Lab 1.</p>

<h3>Trả lời mẫu 2: "Ai đã đăng nhập vào máy chủ này?"</h3>
${lenh('s17/tra-loi', 6)}
${lenh('s17/tra-loi', 7)}
${lenh('s17/tra-loi', 8)}
<p><em>"Có đúng một lần đăng nhập thành công: deploy, bằng khoá SSH, từ 192.0.2.10 lúc 09:02 — và IP đó chưa từng sai lần nào. Ba IP ồn ào sai 74, 45 và 41 lần, không lần nào vào được. Vậy đây là bị quét, không phải bị xâm nhập. Em vẫn sẽ kiểm vân tay khoá có đúng của CI không, deploy đã làm gì bằng sudo sau đó, và tắt đăng nhập bằng mật khẩu nếu còn bật."</em> Dòng output cuối là câu người phỏng vấn SOC rất thích: có IP nào sai rồi sau đó vào được không?</p>

<h3>30 câu bạn sẽ gặp, kèm gợi ý trả lời</h3>
<p>Tự trả lời thành tiếng trước (dùng khung 4 bước), rồi mới mở gợi ý. Mỗi gợi ý ghi bài bạn đã làm với output thật — hãy nhắc tới lab đó khi phỏng vấn.</p>
${dsCau('vi')}

<h3>Những câu nói làm mất điểm</h3>
<ul>
<li>"Em sẽ Google" / "em hỏi ChatGPT" — hãy nói bạn sẽ kiểm gì; dùng công cụ không sao, nhưng lập luận phải của bạn.</li>
<li>"Em khởi động lại máy chủ" làm bước đầu tiên — bạn huỷ bằng chứng (trạng thái trong RAM, có khi cả journal không lưu bền). Thu bằng chứng trước, cần thì mới khởi động lại.</li>
<li>"Em bật DEBUG cho mọi thứ" — tốn tiền, ồn, và bí mật lọt vào log.</li>
<li>Đoán mã sự kiện một cách chắc nịch. "Em không nhớ chính xác mã; em sẽ lọc Security theo đăng nhập thất bại — em nghĩ là 4625 — rồi kiểm lại" là câu trả lời tốt hơn.</li>
<li>Đổ lỗi: "anh DBA làm hỏng". Mô tả hệ thống, không mô tả người (không đổ lỗi — blameless).</li>
</ul>

<h3>Kể như kinh nghiệm của chính bạn (STAR)</h3>
<p>"Bạn đã bao giờ gỡ lỗi production chưa?" — bạn chưa đi làm, nhưng bạn có các lab của khoá này. Nói thật đó là lab, và kể thật chính xác:</p>
<div class="callout ok"><p><strong>S</strong> — Tình huống: trong lab em dựng nginx + API Node.js; người dùng gặp 502/504 lúc có lúc không. <strong>T</strong> — Nhiệm vụ: tìm nguyên nhân chỉ bằng log. <strong>A</strong> — Hành động: đếm mã trạng thái theo phút bằng awk, khớp rid của 504 với dòng "upstream timed out", thấy /api/report trung bình 1,366 giây và app sập ở /api/crash (log app có dòng supervisor khởi động lại). <strong>R</strong> — Kết quả: tách được hai vấn đề (endpoint chậm và app sập), đề xuất timeout theo từng route và cách sửa; em viết thành báo cáo một trang.</p></div>
<p>Chi tiết làm câu chuyện đáng tin: con số thật (1,366 giây), trường thật (rid), lệnh thật. Phương pháp STAR đầy đủ ở khoá Chuẩn bị phỏng vấn (liên kết bên dưới).</p>

<h3>🛡️ Góc hacker: "thứ gì không được ghi vào log" là câu hỏi từ sự cố thật</h3>
<p>Tháng 5/2018, Twitter đề nghị 330 triệu người dùng đổi mật khẩu sau khi một lỗi ghi mật khẩu không che vào một log nội bộ. Tháng 3/2019, Facebook xác nhận hàng trăm triệu mật khẩu đã được lưu dạng chữ thường trong log nội bộ và nhân viên tìm kiếm được. Cả hai đều không phải bị hack — đó là lỗi ghi log, và bất kỳ ai đọc được log đều có thể lấy mật khẩu. Người phỏng vấn hỏi vì chuyện này có xảy ra. Hãy trả lời bằng cách phòng: che ngay ở logger, không bao giờ log nguyên request, quét log tìm bí mật, giới hạn người đọc log (bài 16.3 minh hoạ redact của pino và gitleaks trên output thật).</p>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Phỏng vấn OJT/fresher ở công ty outsourcing</strong> (vd FPT Software): câu kỹ thuật chủ yếu là Java/Spring, SQL, API — log xuất hiện dưới dạng "em gỡ lỗi thế nào" hay "em lần theo một request thế nào". Câu 9 (correlation id + MDC) và câu 7 là đủ. Phần giới thiệu và kể dự án thường bằng tiếng Anh: tập nói "I filtered the access log by status code and correlated the request ID with the application log".</li>
<li><strong>Khách hàng Nhật hoặc châu Âu</strong>: ticket thường kèm ảnh chụp và "error occurred at 10:32 JST". Đổi múi giờ (JST = UTC+9, sớm hơn Việt Nam hai giờ) trước khi tìm là điều đầu tiên anh chị senior kiểm xem bạn đã làm chưa.</li>
<li><strong>Trực sự cố khi thực tập</strong>: không ai bắt bạn sửa production một mình; bạn sẽ được nhờ <em>thu thập</em>: khung giờ, request id, các dòng liên quan. Làm việc đó gọn gàng là cách một fresher lấy được lòng tin.</li>
</ul>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Sinh gói log mẫu của khoá và tự chạy chín lệnh của hai câu trả lời mẫu. Số của bạn phải khớp.</li>
<li>Tự ghi âm (điện thoại) trả lời câu 7, 16, 23 và 25 theo khung 4 bước, mỗi câu dưới hai phút. Nghe lại: lần nào bạn cũng gọi tên một nguồn và một lệnh chưa?</li>
<li>Viết một câu chuyện STAR của riêng bạn từ một lab trong khoá (Lab 7, 8, 10 hoặc 12), có ít nhất hai con số thật lấy từ output của bạn.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) ra 137 / 80 + 57 / 25 ECONNREFUSED / một Accepted của deploy; (2) mỗi câu ghi âm có đủ giả thuyết, tên log, lệnh cụ thể và hành động; (3) câu chuyện vừa 90 giây và một người ngoài nghe xong kể lại được vấn đề là gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Khung 4 bước', 'Giả thuyết → nguồn → lệnh → bằng chứng/hành động.'],
  ['Giảm thiệt hại trước (mitigate first)', 'Khôi phục dịch vụ trước khi truy gốc; thu bằng chứng trước khi khởi động lại.'],
  ['STAR', 'Tình huống, Nhiệm vụ, Hành động, Kết quả — dáng của một câu chuyện kinh nghiệm.'],
  ['Không đổ lỗi (blameless)', 'Mô tả hệ thống đã cho phép điều gì, không tìm ai có tội.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Người phỏng vấn chấm cách bạn tìm ra, không chấm thứ bạn học thuộc.</li>
<li>Dùng khung: giả thuyết → nguồn → lệnh → bằng chứng → hành động.</li>
<li>Số thật từ lab làm câu trả lời đáng tin.</li>
<li>Nắm bốn nhóm câu: nền tảng, backend, DevOps/SRE, SOC.</li>
<li>Câu "không log bí mật" được hỏi vì Twitter và Facebook đã thật sự mắc.</li>
</ul>
${nguon('🛡️', 'The Register — Twitter: everyone needs to change their password (3/5/2018)', '330 triệu người dùng, mật khẩu không che trong log nội bộ', 'https://www.theregister.com/2018/05/03/twitter_no_big_deal_but_everyone_needs_to_change_their_password_right_now/')}
${nguon('🛡️', 'Facebook Newsroom — Keeping Passwords Secure (21/3/2019)', 'Xác nhận của chính Facebook', 'https://about.fb.com/news/2019/03/keeping-passwords-secure/')}
${nguon('📘', 'OWASP Logging Cheat Sheet', 'Ghi gì, không bao giờ ghi gì', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${lienKet({ khoa: 'interview-prep', bai: 'pv-2-2-star', title: 'Chuẩn bị phỏng vấn 2.2 — Câu chuyện STAR từ dự án của bạn', sub: 'Cách kể một câu chuyện kinh nghiệm', cta: 'Mở bài' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-5-4-linux-cloud', title: 'Chuẩn bị phỏng vấn 5.4 — Câu hỏi Linux, mạng và cloud', sub: 'Hành trình URL, tiến trình, 502/504, DNS, SSH', cta: 'Mở bài' })}
</div>
`,
};
