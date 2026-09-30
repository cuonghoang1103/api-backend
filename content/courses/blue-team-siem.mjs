/**
 * Blue Team: phát hiện xâm nhập, SIEM & điều tra số — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo kế hoạch
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm B). Soạn chi tiết SAU theo content/courses/docker/_HOP-DONG.md. Xem _chung/khung.mjs.
 * Phạm vi: THU THẬP log bảo mật → chuẩn hoá → PHÁT HIỆN (Sigma, ATT&CK) → săn mối đe doạ → ĐIỀU TRA SỐ (forensics).
 * KHÔNG dạy quy trình ứng phó/on-call/postmortem — đó là khoá incident-response (Nhóm A). Không trùng observability-monitoring
 * (log vận hành, metric, trace, cảnh báo SLO) và web-security Ch9 (log bảo mật cơ bản) — có bài "Nếu đã học …".
 * Ảnh bìa: người điều phối dựng (logo simple-icons elastic).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'security', name: 'Bảo mật', icon: 'Shield', sortOrder: 8 },
  course: {
    slug: 'blue-team-siem',
    title: 'Blue Team: Detection, SIEM & Forensics',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/blue-team-siem.png?v=1',
    shortDescription: 'The defender’s craft: security logs, a SIEM (Wazuh, OpenSearch), Sigma detections mapped to MITRE ATT&CK, threat hunting and digital forensics basics.|||Nghề của người phòng thủ: log bảo mật, SIEM (Wazuh, OpenSearch), quy tắc Sigma gắn MITRE ATT&CK, săn mối đe doạ và điều tra số nhập môn.',
    description: 'Khoá nâng cao về phía phòng thủ. Bắt đầu từ các vụ mà cảnh báo đã có nhưng không ai nhìn (Target 2013) hoặc công cụ giám sát bị mù (Equifax 2017), để thấy phát hiện là chuyện con người + quy trình + dữ liệu chứ không phải mua một sản phẩm. Học: log nào cần cho điều tra (auth.log, journald, nginx, auditd, Sysmon, PostgreSQL, Cloudflare, CloudTrail), chuẩn hoá theo Elastic Common Schema, dựng SIEM (Wazuh + OpenSearch, ELK, Graylog), viết quy tắc phát hiện bằng Sigma và gắn MITRE ATT&CK, phát hiện đăng nhập bất thường và leo thang quyền, giảm báo động giả, săn mối đe doạ theo giả thuyết, threat intelligence (IOC, STIX/TAXII, MISP), điều tra số nhập môn (thu bằng chứng, chuỗi lưu giữ, ảnh đĩa, bộ nhớ với Volatility, dòng thời gian với Plaso), và cách một SOC tổ chức tier 1–3. Dự án cuối khoá: dựng SOC mini giám sát VPS kiểu cuongthai.com và LabFlow, rồi điều tra một kịch bản tấn công được bơm trong lab.',
    whatYouLearn: 'Biết log nào phải bật trước khi có sự cố; thu log từ Linux, nginx, Docker, PostgreSQL, Cloudflare về một chỗ; dựng Wazuh/OpenSearch trên Docker Compose; viết và kiểm thử quy tắc Sigma; gắn phát hiện vào MITRE ATT&CK và đo độ phủ; bắt brute force SSH, đăng nhập bất thường, web shell, leo thang quyền; săn mối đe doạ có giả thuyết; thu và phân tích ảnh đĩa/bộ nhớ trong lab; dựng dòng thời gian sự kiện; hiểu công việc SOC tier 1–3 và chuẩn bị Security+/CySA+ hoặc tham khảo hướng GCFA.',
    requirements: 'Linux dòng lệnh thành thạo, mạng cơ bản (TCP/IP, DNS, HTTP), Docker Compose, đọc được log. Nên học trước: Linux & Bash, Bảo mật web, Observability & Monitoring.',
    documentsNote: 'Tài liệu chính: attack.mitre.org • github.com/SigmaHQ/sigma • documentation.wazuh.com • opensearch.org/docs • elastic.co/guide (ECS, Elastic Security) • NIST SP 800-92 (quản lý log) • NIST SP 800-86 (tích hợp forensics vào ứng phó sự cố) • volatilityfoundation.org • plaso.readthedocs.io • SANS DFIR posters (sans.org) • "The Practice of Network Security Monitoring" (Richard Bejtlich).',
  },
  sections: khung('siem', [
    ['Section 0 — Why defenders need to see', 'Mục 0 — Vì sao người phòng thủ phải nhìn thấy', 'Không thấy thì không phát hiện được, không phát hiện thì không phản ứng được.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What blue teams do, the history of SIEM, and breaches that were visible but missed', 'Bắt đầu tại đây (1/2) — Blue team làm gì, lịch sử SIEM, và những vụ tấn công đã hiện ra mà bị bỏ lỡ', 'Blue team vs red team bằng lời đời thường · Mốc: syslog thập niên 1980, IDS Snort 1998, thuật ngữ SIEM (Gartner, 2005), MITRE ATT&CK công khai 2015, Sigma 2017 · Target 2013: cảnh báo có, không ai xử lý · Equifax 2017: thiết bị soi lưu lượng mù vì chứng chỉ hết hạn · Thời gian kẻ tấn công ở trong hệ thống trước khi bị phát hiện'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, SOC careers and the learning path', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, nghề SOC và lộ trình', 'Vị trí: SOC Analyst tier 1–3, Detection Engineer, Threat Hunter, DFIR · Việc làm được sau khoá: SOC mini cho hệ thống của mình · Khác khoá Incident Response ở đâu (phát hiện & điều tra vs quy trình ứng phó) · Khoá nền nên học trước'],
      ['lab', 'Building the lab: SIEM stack in Docker Compose, a victim VM and an attacker VM', 'Dựng lab: SIEM bằng Docker Compose, một máy nạn nhân và một máy tấn công', 'RAM tối thiểu và cách chạy trên máy nhà · Mạng lab tách biệt · Máy nạn nhân Ubuntu + Windows eval · Atomic Red Team để tạo hành vi tấn công có kiểm soát · Chỉ trên máy của mình'],
    ]],
    ['Chapter 1 — Logs worth having', 'Chương 1 — Những log đáng có', 'Log nào trả lời được câu hỏi điều tra, và phải bật trước khi cần.', [
      ['neu-da-hoc-obs', 'If you took Observability & Monitoring: operational logs vs security logs', 'Nếu đã học Observability & Monitoring: log vận hành khác log bảo mật', 'Link /courses/observability-monitoring · Log vận hành hỏi "chạy có ổn không", log bảo mật hỏi "ai làm gì" · Thời gian lưu khác nhau · Cùng đường ống, khác mục đích'],
      ['linux', 'Linux: auth.log, journald, auditd and process accounting', 'Linux: auth.log, journald, auditd và ghi nhận tiến trình', 'SSH thành công/thất bại, sudo · Quy tắc auditd cho execve, file nhạy cảm · Log bị xoá thì còn gì · Đồng bộ giờ bằng chrony'],
      ['windows', 'Windows: Event Log, the event IDs that matter, and Sysmon', 'Windows: Event Log, những event ID quan trọng, và Sysmon', '4624/4625/4688/4720/7045 · Sysmon cấu hình theo SwiftOnSecurity/olafhartong · PowerShell script block logging · Vì sao vẫn cần học dù chạy Linux'],
      ['ung-dung', 'Application and edge logs: nginx, Docker, PostgreSQL, Cloudflare, CloudTrail', 'Log ứng dụng và rìa: nginx, Docker, PostgreSQL, Cloudflare, CloudTrail', 'Định dạng log nginx có IP thật sau Cloudflare · log_connections/pgaudit · Cloudflare firewall events và Logpush · Log đăng nhập của ứng dụng tự viết'],
      ['mang', 'Network visibility: Zeek, Suricata and flow logs', 'Nhìn mạng: Zeek, Suricata và flow log', 'Zeek sinh log theo giao thức · Suricata là IDS/IPS theo chữ ký · DNS log là mỏ vàng · Mã hoá TLS làm mù cái gì'],
    ]],
    ['Chapter 2 — Collecting and normalising', 'Chương 2 — Thu thập và chuẩn hoá', 'Đưa log từ mọi nơi về một chỗ, cùng một ngôn ngữ.', [
      ['agent', 'Shippers and agents: Filebeat, Fluent Bit, Vector, Wazuh agent', 'Công cụ chuyển log: Filebeat, Fluent Bit, Vector, Wazuh agent', 'Agent vs syslog không agent · Bộ đệm khi SIEM sập · Tài nguyên trên VPS nhỏ · Mã hoá đường truyền'],
      ['phan-tich', 'Parsing: grok, decoders and structured logging at the source', 'Phân tích cú pháp: grok, decoder và log có cấu trúc từ nguồn', 'Regex dễ vỡ · Log JSON từ ứng dụng · Trường thời gian và múi giờ (UTC trong container) · Kiểm parser bằng mẫu thật'],
      ['ecs', 'Normalisation with Elastic Common Schema (ECS)', 'Chuẩn hoá theo Elastic Common Schema (ECS)', 'source.ip, user.name, event.action, event.outcome · Vì sao chuẩn hoá mới viết được quy tắc chung · So với OCSF · Ánh xạ log nginx sang ECS'],
      ['lam-giau', 'Enrichment: GeoIP, asset inventory, user context', 'Làm giàu dữ liệu: GeoIP, danh mục tài sản, ngữ cảnh người dùng', 'IP → quốc gia/ASN · Máy nào là prod · Tài khoản nào là admin · Làm giàu lúc nạp hay lúc truy vấn'],
      ['luu-tru', 'Retention, storage cost and integrity of logs', 'Thời gian lưu, chi phí lưu trữ và tính toàn vẹn của log', 'Nóng/ấm/lạnh · Lưu bao lâu theo yêu cầu điều tra và pháp lý · Kẻ tấn công xoá log: gửi đi ngay, lưu chỉ-ghi-thêm · Băm/ký lô log'],
    ]],
    ['Chapter 3 — Running a SIEM', 'Chương 3 — Vận hành một SIEM', 'Chọn, dựng và giữ cho SIEM sống.', [
      ['chon', 'Choosing a SIEM: Wazuh, Elastic Security, OpenSearch Security Analytics, Graylog, Splunk', 'Chọn SIEM: Wazuh, Elastic Security, OpenSearch Security Analytics, Graylog, Splunk', 'Mã nguồn mở vs thương mại · Giấy phép Elastic và bản fork OpenSearch (2021) · Chi phí theo GB/ngày · Cái nào hợp đội nhỏ'],
      ['wazuh', 'Deploying Wazuh with Docker Compose', 'Triển khai Wazuh bằng Docker Compose', 'Manager, indexer, dashboard · Cài agent lên VPS · File integrity monitoring · Đánh giá cấu hình (SCA) có sẵn'],
      ['truy-van', 'Querying: KQL, Lucene, PPL and the questions investigators ask', 'Truy vấn: KQL, Lucene, PPL và những câu điều tra viên hay hỏi', 'Ai đăng nhập từ IP lạ · Tiến trình nào sinh ra shell · Đếm theo cửa sổ thời gian · Lưu truy vấn thành thư viện'],
      ['van-hanh', 'Keeping the SIEM healthy: capacity, index lifecycle, missing-data alerts', 'Giữ SIEM khoẻ: dung lượng, vòng đời index, cảnh báo mất dữ liệu', 'Nguồn log im lặng là một cảnh báo · ILM/ISM · Heap JVM và đĩa · Sao lưu cấu hình và quy tắc'],
    ]],
    ['Chapter 4 — MITRE ATT&CK and thinking like the adversary', 'Chương 4 — MITRE ATT&CK và nghĩ như kẻ tấn công', 'Một bản đồ chung để nói về hành vi tấn công.', [
      ['attack', 'ATT&CK: tactics, techniques, sub-techniques and procedures', 'ATT&CK: tactic, technique, sub-technique và procedure', 'Từ Initial Access tới Impact · Đọc một trang technique · Ma trận Enterprise, Cloud, Containers · Nhóm APT và phần mềm đã ghi nhận'],
      ['kill-chain', 'Kill chain, the Pyramid of Pain and why behaviour beats IOCs', 'Kill chain, Pyramid of Pain và vì sao hành vi quan trọng hơn IOC', 'Đổi IP thì dễ, đổi hành vi thì khó · Lockheed Martin Cyber Kill Chain · Phát hiện càng sớm càng rẻ'],
      ['do-phu', 'Measuring detection coverage with ATT&CK Navigator', 'Đo độ phủ phát hiện bằng ATT&CK Navigator', 'Tô màu technique đã có quy tắc · Ưu tiên technique hay gặp với hạ tầng Linux + web · Độ phủ không phải điểm số'],
      ['mo-phong', 'Adversary emulation: Atomic Red Team and Caldera in the lab', 'Mô phỏng đối thủ: Atomic Red Team và Caldera trong lab', 'Chạy một test nhỏ theo technique ID · Kiểm SIEM có thấy không · Chỉ trong lab tách biệt · Ghi kết quả thành ma trận'],
    ]],
    ['Chapter 5 — Detection engineering with Sigma', 'Chương 5 — Kỹ nghệ phát hiện với Sigma', 'Viết quy tắc như viết code: có kiểm thử, có phiên bản.', [
      ['sigma', 'Sigma rule anatomy: logsource, detection, condition, level', 'Cấu trúc quy tắc Sigma: logsource, detection, condition, level', 'Viết một quy tắc bắt sudo lạ · Modifiers contains/endswith/re · Gắn tag ATT&CK · Kho SigmaHQ'],
      ['chuyen-doi', 'Converting Sigma to your SIEM with pySigma/sigma-cli', 'Chuyển Sigma sang SIEM của bạn bằng pySigma/sigma-cli', 'Backend cho Elastic/OpenSearch/Splunk · Pipeline ánh xạ trường · Chỗ chuyển đổi hay sai'],
      ['kiem-thu', 'Testing detections: true positives, false positives and regression', 'Kiểm thử quy tắc: dương tính thật, dương tính giả và hồi quy', 'Log mẫu cho mỗi quy tắc · Detection-as-code trong Git + CI · Đo tỉ lệ báo động giả · Quy tắc nào nên xoá'],
      ['nguong', 'Thresholds, correlation and sequences', 'Ngưỡng, tương quan và chuỗi sự kiện', 'N lần thất bại rồi một lần thành công · Nhiều nguồn cùng một người dùng · Correlation trong Sigma · EQL sequence'],
      ['yara-suricata', 'Beyond logs: Suricata rules and YARA at a glance', 'Ngoài log: lướt qua quy tắc Suricata và YARA', 'Chữ ký mạng · YARA cho file · Khi nào dùng loại nào · YARA sâu hơn ở khoá Reverse Engineering'],
    ]],
    ['Chapter 6 — Detecting the attacks you will actually see', 'Chương 6 — Phát hiện những tấn công bạn sẽ thật sự gặp', 'Các kịch bản phổ biến trên hạ tầng Linux + web + cloud.', [
      ['brute-force', 'Brute force, password spraying and credential stuffing', 'Brute force, password spraying và credential stuffing', 'Nhiều lần sai từ một IP vs một lần sai trên nhiều tài khoản · Log đăng nhập ứng dụng · Liên hệ fail2ban và rate limit · Trỏ khoá Xác thực'],
      ['dang-nhap-la', 'Anomalous logins: impossible travel, new device, odd hours', 'Đăng nhập bất thường: di chuyển bất khả, thiết bị mới, giờ lạ', 'Đường cơ sở theo người dùng · GeoIP và VPN gây nhiễu · Đăng nhập admin từ nơi mới · Cảnh báo gửi cho chính người dùng'],
      ['web-shell', 'Web attacks in logs: scanning, injection attempts, web shells', 'Tấn công web trong log: dò quét, thử injection, web shell', 'Mẫu URL của công cụ quét · Tiến trình con lạ của web server/Java · File mới trong thư mục web · Log WAF Cloudflare'],
      ['leo-thang', 'Privilege escalation and persistence on Linux', 'Leo thang quyền và bám trụ trên Linux', 'sudo/su lạ, SUID mới · cron, systemd unit, authorized_keys bị thêm · Người dùng mới · Quy tắc auditd tương ứng'],
      ['exfil', 'Data exfiltration and cloud abuse', 'Rò rỉ dữ liệu và lạm dụng cloud', 'Lưu lượng ra bất thường · pg_dump lạ · Tải hàng loạt từ bucket · Khoá cloud dùng từ IP lạ · Đào coin làm CPU tăng'],
    ]],
    ['Chapter 7 — Alert triage and reducing noise', 'Chương 7 — Phân loại cảnh báo và giảm nhiễu', 'Cảnh báo quá nhiều thì không ai đọc — chính là bài học Target.', [
      ['phan-loai', 'Triage: severity, confidence, context in the first five minutes', 'Phân loại: mức độ, độ tin cậy, ngữ cảnh trong năm phút đầu', 'Câu hỏi tier 1 phải trả lời · Đóng, leo thang, hay theo dõi · Ghi chú để người sau hiểu'],
      ['met-moi', 'Alert fatigue: tuning, suppression and allow-lists done safely', 'Mệt mỏi vì cảnh báo: tinh chỉnh, tắt tiếng và danh sách cho phép làm cho an toàn', 'Allow-list rộng quá là lỗ hổng · Tắt tiếng có hạn · Đo cảnh báo/người/ngày'],
      ['soar', 'Automation and SOAR: enrichment and safe auto-response', 'Tự động hoá và SOAR: làm giàu và tự phản ứng an toàn', 'Shuffle/TheHive/Cortex · Tự tra IP, tự chặn tạm · Khi nào không tự động · Chuyển giao sang quy trình ứng phó (khoá Incident Response)'],
      ['ca', 'Case management: from alert to case to closed', 'Quản lý ca: từ cảnh báo tới ca tới đóng', 'TheHive hoặc ticket · Bằng chứng gắn vào ca · Chỉ số MTTD · Rút quy tắc mới từ ca đã đóng'],
    ]],
    ['Chapter 8 — Threat hunting and threat intelligence', 'Chương 8 — Săn mối đe doạ và tình báo mối đe doạ', 'Chủ động đi tìm thứ quy tắc chưa bắt được.', [
      ['gia-thuyet', 'Hypothesis-driven hunting', 'Săn theo giả thuyết', 'Từ ATT&CK ra giả thuyết · Dữ liệu cần có · Kết quả: phát hiện hoặc quy tắc mới · Ghi lại cả lần không thấy gì'],
      ['thong-ke', 'Stacking, long-tail analysis and baselines', 'Xếp chồng, phân tích đuôi dài và đường cơ sở', 'Tiến trình hiếm nhất trên toàn hệ thống · User-agent lạ · Đường cơ sở theo giờ · Jupyter/pandas trên dữ liệu SIEM'],
      ['cti', 'Threat intelligence: IOCs, STIX/TAXII, MISP and feeds', 'Tình báo mối đe doạ: IOC, STIX/TAXII, MISP và nguồn cấp', 'Nguồn chất lượng vs nhiễu · Hết hạn IOC · Tích hợp vào SIEM · Tin cảnh báo từ VNCERT/CC và CISA KEV'],
      ['honeypot', 'Deception: honeypots, canary tokens and tripwires', 'Đánh lừa: honeypot, canary token và dây bẫy', 'Canary token trong thư mục nhạy cảm · Tài khoản mồi · Cowrie SSH honeypot trong lab · Báo động giả gần bằng 0'],
    ]],
    ['Chapter 9 — Digital forensics foundations', 'Chương 9 — Nền tảng điều tra số', 'Thu bằng chứng sao cho còn dùng được.', [
      ['nguyen-tac', 'Principles: order of volatility, chain of custody, legal considerations', 'Nguyên tắc: thứ tự dễ mất, chuỗi lưu giữ bằng chứng, lưu ý pháp lý', 'RAM trước đĩa · Băm mọi thứ thu được · Biểu mẫu chain of custody · Khi nào phải gọi cơ quan chức năng/luật sư — ghi trung tính, kiểm văn bản'],
      ['thu-thap', 'Live response on Linux: what to collect before you pull the plug', 'Thu thập trực tiếp trên Linux: thu gì trước khi rút điện', 'Tiến trình, kết nối, người dùng đang đăng nhập · UAC (Unix-like Artifacts Collector) · Không cài thêm gì lên máy nghi nhiễm · Ghi lại mọi lệnh đã chạy'],
      ['anh-dia', 'Disk images and file system artefacts', 'Ảnh đĩa và dấu vết trên hệ thống file', 'dd/dc3dd/ewfacquire · Snapshot đĩa cloud · Mount chỉ đọc · Autopsy/The Sleuth Kit · File đã xoá và thời gian MAC'],
      ['bo-nho', 'Memory forensics with Volatility 3', 'Điều tra bộ nhớ với Volatility 3', 'Chụp RAM bằng LiME/AVML · pslist, netstat, malfind · Symbol cho kernel Linux · Mã độc chỉ sống trong RAM'],
      ['container-cloud', 'Forensics for containers and cloud', 'Điều tra số cho container và cloud', 'Container sống ngắn: thu gì trước khi bị xoá · docker export và checkpoint · Snapshot EBS · Nhật ký cloud là bằng chứng'],
    ]],
    ['Chapter 10 — Timelines and reconstructing an attack', 'Chương 10 — Dòng thời gian và dựng lại cuộc tấn công', 'Ghép mảnh bằng chứng thành câu chuyện có thể chứng minh.', [
      ['plaso', 'Super-timelines with Plaso and Timesketch', 'Siêu dòng thời gian với Plaso và Timesketch', 'log2timeline gom mọi nguồn · Lọc theo cửa sổ thời gian · Gắn nhãn cộng tác trên Timesketch'],
      ['tuong-quan', 'Correlating host, network and application evidence', 'Tương quan bằng chứng máy, mạng và ứng dụng', 'Căn giờ giữa các nguồn · Từ request nginx tới tiến trình tới kết nối ra · Khoảng trống bằng chứng'],
      ['bao-cao', 'Writing a forensic report that others can verify', 'Viết báo cáo điều tra người khác kiểm lại được', 'Sự kiện vs suy luận · Giữ băm và đường dẫn bằng chứng · Tóm tắt cho người không kỹ thuật · Mẫu báo cáo'],
    ]],
    ['Chapter 11 — How a SOC works', 'Chương 11 — Một SOC vận hành thế nào', 'Con người, ca trực và chỉ số.', [
      ['tier', 'SOC tiers 1–3, detection engineering and the hunt team', 'SOC tier 1–3, đội kỹ nghệ phát hiện và đội săn', 'Việc hằng ngày của mỗi tier · Leo thang thế nào · SOC nội bộ vs MSSP/MDR · Kiệt sức và xoay ca'],
      ['chi-so', 'SOC metrics that do not lie: MTTD, true-positive rate, coverage', 'Chỉ số SOC không nói dối: MTTD, tỉ lệ dương tính thật, độ phủ', 'Đếm cảnh báo đã đóng là chỉ số sai · Đo theo kết quả · Báo cáo cho quản lý'],
      ['soc-nho', 'A one-person SOC: what a small team can realistically run', 'SOC một người: đội nhỏ thật sự vận hành được gì', 'Ưu tiên 10 quy tắc giá trị nhất · Cảnh báo qua Telegram · Lịch rà soát hằng tuần · Khi nào nên thuê MDR'],
    ]],
    ['Chapter 12 — Capstone: a mini SOC for your own stack', 'Chương 12 — Dự án cuối khoá: SOC mini cho hệ thống của chính bạn', 'Giám sát hạ tầng kiểu cuongthai.com và LabFlow, rồi điều tra một cuộc tấn công bơm trong lab.', [
      ['dung', 'Build: Wazuh/OpenSearch collecting VPS, nginx, Docker, PostgreSQL, Cloudflare and GitHub audit logs', 'Dựng: Wazuh/OpenSearch thu log VPS, nginx, Docker, PostgreSQL, Cloudflare và GitHub audit', 'Agent trên VPS lab · Logpush Cloudflare (hoặc API) · Log Spring Boot của LabFlow dạng JSON · Chuẩn hoá ECS'],
      ['quy-tac', 'Detect: ten Sigma rules mapped to ATT&CK, tested in CI', 'Phát hiện: mười quy tắc Sigma gắn ATT&CK, kiểm thử trong CI', 'Brute force SSH, đăng nhập admin lạ, web shell, cron mới, pg_dump lạ · Log mẫu cho mỗi quy tắc · GitHub Actions chạy sigma-cli'],
      ['tan-cong', 'Exercise: a staged intrusion in the lab (Atomic Red Team) and the alerts it raises', 'Diễn tập: một cuộc xâm nhập dàn dựng trong lab (Atomic Red Team) và các cảnh báo nó gây ra', 'Kịch bản nhiều bước · Chỉ trên máy lab · Quy tắc nào bắt được, quy tắc nào lọt · Sửa và chạy lại'],
      ['dieu-tra', 'Investigate: timeline, memory image and a written report', 'Điều tra: dòng thời gian, ảnh bộ nhớ và báo cáo viết', 'Thu bằng chứng theo thứ tự dễ mất · Plaso + Volatility · Báo cáo điều tra · Bàn giao cho quy trình ứng phó'],
    ]],
    ['Chapter 13 — Interviews and certifications', 'Chương 13 — Phỏng vấn và chứng chỉ', 'Chuẩn bị cho vị trí SOC/Detection/DFIR.', [
      ['chung-chi', 'Certifications: Security+, CySA+, BTL1, and GCIH/GCFA as references', 'Chứng chỉ: Security+, CySA+, BTL1, và GCIH/GCFA để tham khảo', 'Chứng chỉ nào cho người mới · Chứng chỉ thực hành vs lý thuyết · GIAC đắt, nêu để biết hướng · Kiểm đề cương mới nhất trên trang chính thức'],
      ['luyen', 'Practice platforms: Blue Team Labs Online, CyberDefenders, LetsDefend, TryHackMe SOC paths', 'Nền tảng luyện: Blue Team Labs Online, CyberDefenders, LetsDefend, lộ trình SOC của TryHackMe', 'Bài điều tra có đáp án · Xây hồ sơ công khai · Viết write-up'],
      ['cau-hoi', 'Interview questions: walk me through an alert, and the forensic basics', 'Câu hỏi phỏng vấn: kể lại cách xử một cảnh báo, và kiến thức điều tra số cơ bản', 'Kể theo từng bước có dữ liệu · Event ID nào cho việc gì · Thứ tự dễ mất · Phân biệt IOC và IOA'],
    ]],
  ]),
};
