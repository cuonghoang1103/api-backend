/**
 * 14.7 — SIEM và đọc quy tắc Sigma (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/sigma'] — 6 quy tắc SigmaHQ (bản tải 24/11/2026, _demo/s14/mau/sigma/*.yml + .json)
 * chấm bằng bộ chấm tối giản tự viết _demo/s14/mau/sigma-mini.py trên 57 tệp EVTX mẫu công khai (Ch3 + Ch4) = 120 390 sự kiện, và trên auth.log của vu14/lab14.
 * Số tất định: Security Eventlog Cleared 7 khớp; Eventlog Cleared 89 khớp (97 × 104: 91 kênh khác − 2 Sysmon bị lọc; 6 lần xoá System bị lọc vì quy tắc khác phủ);
 * User Added to Local Administrator Group 8; Service Installation in Suspicious Folder 1 (Pathfinder, AppData\Local\Temp\pytest — dương tính giả); Suspicious Failed Logon Reasons 0
 * (2 × 4625 SubStatus 0xc0000072 bị filter SubjectUserSid S-1-0-0 loại — đăng nhập mạng vào Administrator bị vô hiệu từ 192.168.198.149); Suspicious OpenSSH Daemon Error 0 trên log SSH bị rải mật khẩu.
 * Target 2013: Senate Commerce staff report 26/3/2014 "A 'Kill Chain' Analysis of the 2013 Target Data Breach".
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.7 — SIEM in one lesson, and reading Sigma rules: logsource, detection, condition, level, falsepositives|||14.7 — SIEM trong một bài, và đọc quy tắc Sigma: logsource, detection, condition, level, falsepositives',
  slug: 'log-14-7-siem-sigma',
  type: 'LESSON',
  isFreePreview: true,
  description: 'SIEM làm năm việc: gom, chuẩn hoá, tương quan, cảnh báo, lưu giữ — chính những việc bạn đã làm tay suốt chương. Sigma là định dạng quy tắc phát hiện viết một lần, chuyển sang mọi SIEM. Bài này đọc 6 quy tắc thật của SigmaHQ từng dòng (logsource, detection, condition, filter, level, falsepositives), rồi CHẤM chúng bằng một bộ chấm 80 dòng Python trên 120 390 sự kiện EVTX công khai: quy tắc "xoá log" bắt 7 + 89 lần, nhưng bỏ qua 6 lần xoá System vì đã có quy tắc khác phủ; quy tắc "lý do đăng nhập lạ" ra 0 vì bộ lọc loại đúng hai lần đăng nhập mạng vào tài khoản bị vô hiệu; quy tắc SSH ra 0 trên một đợt rải mật khẩu thật. Bài học: đọc filter trước khi tin một quy tắc. Sự cố thật: Target 2013 — cảnh báo có kêu, nhưng không ai làm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.7</span>
<h2>The machine that does what you did by hand</h2>
<p class="lead">Everything in this chapter — collecting logs from many machines, converting times, joining by IP and user, applying thresholds, raising an alarm, keeping the evidence — is what a <strong>SIEM</strong> (Security Information and Event Management) automates. Detection rules are its brain; <strong>Sigma</strong> is the open, vendor-neutral format most of those rules are shared in. Here you only <em>read</em> rules and check them against real logs; writing, converting and testing rules belongs to the Blue Team course.</p>

<h3>The everyday picture</h3>
<p>A smoke detector system in a hotel: sensors in every room (log sources), wiring to one panel (collection), the panel knows which sensor is which floor (normalisation), "two rooms on the same floor within a minute" means real fire (correlation), the alarm (alert), and the event log the fire brigade reads afterwards (retention). Sigma rules are the panel's settings — and a setting that ignores the kitchen will never ring for a kitchen fire.</p>

${kv([
  ['Collect', 'Agents/forwarders bring logs from hosts, apps, cloud, network (Chapter 15).'],
  ['Normalise', 'Map fields to one schema (ECS, OCSF…) and one clock (14.5).'],
  ['Correlate', 'Join and count across sources and time (14.1 thresholds, 14.2 baselines).'],
  ['Alert', 'Rules fire → triage queue, with severity and context.'],
  ['Retain', 'Keep raw evidence long enough for investigations and law (Chapter 16).'],
])}
<p>Common SIEMs you will meet: Splunk, Microsoft Sentinel, Elastic Security, Wazuh (open source), Google SecOps; on smaller projects, Grafana Loki or OpenSearch with alert rules play the same role (Lesson 15.5).</p>

<h3>Step 1 — anatomy of a Sigma rule</h3>
${ma('yaml', 's14/mau/sigma/win_system_eventlog_cleared.yml')}
${kv([
  ['title / id / status', 'Name, stable UUID, maturity (experimental → test → stable).'],
  ['tags', 'ATT&CK tactic/technique (note attack.defense-impairment — already the v19 vocabulary).'],
  ['logsource', 'WHICH log the rule reads: product windows, service system. A SIEM maps this to its own index/table.'],
  ['detection', 'Named blocks (selection, filter_…). Inside one block: fields are AND-ed, list values are OR-ed.'],
  ['condition', 'How blocks combine: "selection and not 1 of filter_main_*".'],
  ['falsepositives / level', 'What innocent activity also matches; how urgent (informational → critical).'],
])}
<p>Field modifiers: <code>ImagePath|contains</code>, <code>TargetUserName|startswith</code>, <code>SubjectUserName|endswith</code>. A <code>keywords</code> block (list of strings) is searched in the whole raw line — used for plain-text logs like sshd.</p>

<h3>Step 2 — run real rules on real logs</h3>
<p>A real SIEM would convert these rules with pySigma/sigma-cli. To <em>understand</em> them, a tiny evaluator is enough (≈ 80 lines, supports what these six rules use):</p>
<details><summary><strong>sigma-mini.py</strong></summary>
${ma('python', 's14/mau/sigma-mini.py')}
</details>
${lenh('s14/sigma', 0)}
${lenh('s14/sigma', 1)}
<p>"Security log cleared" fires on every 1102 in the 57 sample files — 7 clears. Good. Now the System-side rule:</p>
${lenh('s14/sigma', 2)}
${lenh('s14/sigma', 3)}
<p>97 events 104, 89 alerts. The 6 clears of <em>System</em> itself and 2 of Sysmon are filtered out on purpose — the rule's comment says another rule (100ef69e…) covers them. If your SIEM imported this rule but not that one, clearing System is invisible. Also note a <strong>field ambiguity</strong>: in a 104 event, "Channel" exists twice — the channel the event is written in (always System) and the channel that was cleared (UserData). The rule means the second; a naive field mapping uses the first and the rule never fires.</p>
${lenh('s14/sigma', 4)}
${lenh('s14/sigma', 5)}
<p>8 additions to Administrators — some are attack samples, some are a normal admin; the rule says so in <code>falsepositives</code>. The only "suspicious service folder" hit is a pytest test service in AppData\\Local\\Temp — a false positive you would allow-list by name.</p>
${lenh('s14/sigma', 6)}
${lenh('s14/sigma', 7)}
${lenh('s14/sigma', 8)}
<p>Zero alerts, yet two 4625 with SubStatus 0xC0000072 (account disabled) exist. The filter <code>SubjectUserSid: S-1-0-0</code> removes them: network logons have a null subject. The author chose this to reduce noise; the price is that someone guessing a disabled Administrator over SMB (Lesson 4.1) is not flagged. Read the filter before you trust a rule.</p>
${lenh('s14/sigma', 9)}
<p>Zero on two auth.logs that contain a spray and a compromise. Not a bug: this rule looks for exploit-like sshd <em>errors</em>, not for guessing. Brute force needs a <strong>threshold/correlation rule</strong> (Sigma has a correlation format: <code>event_count</code>, <code>value_count</code> over a timespan) — the same logic as the awk of 14.1:</p>
<pre><code class="language-yaml"># Sigma correlation (format illustration — evaluated by a SIEM backend, not by sigma-mini)
title: SSH password spraying from one source
correlation:
  type: value_count          # count DISTINCT values…
  rules: [sshd_failed_password]
  group-by: [src_ip]
  timespan: 1h
  condition: { field: user, gte: 10 }   # …of user per IP per hour ≥ 10 (14.1, Step 2)</code></pre>

<h3>🛡️ Real incident: Target, 2013</h3>
<p>The US Senate Commerce Committee staff report "A 'Kill Chain' Analysis of the 2013 Target Data Breach" (26 March 2014) lists missed opportunities; among them, citing press reports, Target's intrusion-detection system raised alerts when the data-exfiltration malware was installed, and they were not acted on. About 40 million card numbers were stolen. Detection that nobody triages is decoration: a SIEM project is rules <em>and</em> people, queues, and tuning so that the real alert is not alert number 4 000 of the day.</p>
${nguon('📘', 'U.S. Senate Commerce Committee — Kill Chain analysis of the 2013 Target data breach (2014)', 'Missed opportunities, including unanswered alerts', 'https://www.commerce.senate.gov/services/files/24d3c229-4f2f-405d-b8db-a3a67f183883')}
${nguon('📘', 'SigmaHQ — rule repository and specification', 'Rules, correlation format, pySigma', 'https://github.com/SigmaHQ/sigma')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What does a SIEM do that grep cannot?" — continuous collection from many sources, normalisation, correlation over time, alert workflow, retention.</li>
<li>"Explain a Sigma rule's condition 'all of selection_* and not 1 of filter_*'."</li>
<li>"A rule produced zero alerts for a month. Good news?" — maybe; check the log source is arriving, field mapping, and filters (silence ≠ safety, 14.4).</li>
</ul>

<h3>At work</h3>
<p>As a junior on a SOC or DevOps team you will mostly <em>tune</em> rules: read why an alert fired, decide if it is a false positive, propose a precise filter (name + path, not "ignore this host"), and document it.</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Read <code>win_security_user_added_to_local_administrators.yml</code>: why is there a filter on names ending in <code>$</code>?</li>
<li>Change the Pathfinder false positive into a filter block and rerun sigma-mini to get 0 hits.</li>
<li>Write a Sigma rule (keywords) for <code>Accepted password for deploy</code> on web01 and run it on both auth logs. Which file finds it? Why (14.4)?</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['SIEM', 'System that collects, normalises, correlates, alerts on and retains security logs.'],
  ['Sigma', 'Generic YAML format for detection rules, converted to each SIEM\'s query language.'],
  ['logsource', 'Which log a rule applies to (product/service/category).'],
  ['Filter', 'Block that removes known-benign matches; also where blind spots hide.'],
  ['Correlation rule', 'Rule over counts/sequences of events across time.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>SIEM = collect, normalise, correlate, alert, retain.</li>
<li>Read logsource, detection, condition, filter, falsepositives before trusting a rule.</li>
<li>Thresholds need correlation rules; alerts need people.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-5-canh-bao', title: 'Lesson 15.5 — Alerts on centralised logs', sub: 'Loki/Grafana and Elastic rules in practice', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-5-1-sigma', title: 'Blue Team course › 5.1 Sigma rule structure', sub: 'Writing, converting and testing rules', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.7</span>
<h2>Cỗ máy làm thay những gì bạn đã làm tay</h2>
<p class="lead">Mọi việc trong chương này — gom log từ nhiều máy, đổi giờ, ghép theo IP và tài khoản, đặt ngưỡng, báo động, giữ bằng chứng — chính là thứ một <strong>SIEM</strong> (Security Information and Event Management) tự động hoá. Quy tắc phát hiện là bộ não của nó; <strong>Sigma</strong> là định dạng mở, không phụ thuộc hãng, mà phần lớn quy tắc được chia sẻ bằng nó. Ở đây bạn chỉ <em>đọc</em> quy tắc và đối chiếu với log thật; viết, chuyển đổi và kiểm thử quy tắc thuộc khoá Blue Team.</p>

<h3>Liên tưởng đời thường</h3>
<p>Hệ thống báo cháy của khách sạn: cảm biến trong từng phòng (nguồn log), dây dẫn về một tủ điều khiển (gom), tủ biết cảm biến nào ở tầng nào (chuẩn hoá), "hai phòng cùng tầng trong một phút" là cháy thật (tương quan), chuông kêu (cảnh báo), và nhật ký sự kiện mà lính cứu hoả đọc sau đó (lưu giữ). Quy tắc Sigma là phần cài đặt của tủ — và một cài đặt bỏ qua nhà bếp sẽ không bao giờ kêu khi bếp cháy.</p>

${kv([
  ['Gom (collect)', 'Agent/forwarder đưa log từ máy, ứng dụng, cloud, mạng về (Chương 15).'],
  ['Chuẩn hoá (normalise)', 'Đưa trường về một lược đồ (ECS, OCSF…) và một đồng hồ (14.5).'],
  ['Tương quan (correlate)', 'Ghép và đếm qua nhiều nguồn theo thời gian (ngưỡng 14.1, đường nền 14.2).'],
  ['Cảnh báo (alert)', 'Quy tắc kêu → hàng đợi phân loại, kèm mức độ và bối cảnh.'],
  ['Lưu giữ (retain)', 'Giữ bằng chứng gốc đủ lâu cho điều tra và luật (Chương 16).'],
])}
<p>Các SIEM hay gặp: Splunk, Microsoft Sentinel, Elastic Security, Wazuh (mã nguồn mở), Google SecOps; ở dự án nhỏ, Grafana Loki hoặc OpenSearch kèm luật cảnh báo đóng cùng vai (Bài 15.5).</p>

<h3>Bước 1 — giải phẫu một quy tắc Sigma</h3>
${ma('yaml', 's14/mau/sigma/win_system_eventlog_cleared.yml')}
${kv([
  ['title / id / status', 'Tên, UUID cố định, độ chín (experimental → test → stable).'],
  ['tags', 'Chiến thuật/kỹ thuật ATT&CK (để ý attack.defense-impairment — đã dùng từ vựng của v19).'],
  ['logsource', 'Quy tắc đọc log NÀO: product windows, service system. SIEM ánh xạ cái này sang index/bảng của nó.'],
  ['detection', 'Các khối có tên (selection, filter_…). Trong một khối: các trường nối bằng AND, các giá trị trong danh sách nối bằng OR.'],
  ['condition', 'Cách ghép các khối: "selection and not 1 of filter_main_*".'],
  ['falsepositives / level', 'Hoạt động vô hại nào cũng khớp; mức khẩn (informational → critical).'],
])}
<p>Bổ ngữ của trường: <code>ImagePath|contains</code> (chứa), <code>TargetUserName|startswith</code> (bắt đầu bằng), <code>SubjectUserName|endswith</code> (kết thúc bằng). Khối <code>keywords</code> (danh sách chuỗi) được tìm trong cả dòng thô — dùng cho log văn bản như sshd.</p>

<h3>Bước 2 — chạy quy tắc thật trên log thật</h3>
<p>SIEM thật sẽ chuyển các quy tắc này bằng pySigma/sigma-cli. Để <em>hiểu</em> chúng, một bộ chấm tí hon là đủ (≈ 80 dòng, hỗ trợ đúng những gì sáu quy tắc này dùng):</p>
<details><summary><strong>sigma-mini.py</strong></summary>
${ma('python', 's14/mau/sigma-mini.py')}
</details>
${lenh('s14/sigma', 0)}
${lenh('s14/sigma', 1)}
<p>"Security log cleared" kêu ở mọi 1102 trong 57 tệp mẫu — 7 lần xoá. Tốt. Giờ tới quy tắc phía System:</p>
${lenh('s14/sigma', 2)}
${lenh('s14/sigma', 3)}
<p>97 sự kiện 104, 89 cảnh báo. 6 lần xoá chính log <em>System</em> và 2 lần xoá Sysmon bị lọc có chủ đích — chú thích trong quy tắc nói một quy tắc khác (100ef69e…) đã phủ chúng. Nếu SIEM của bạn nhập quy tắc này mà quên quy tắc kia, việc xoá System trở nên vô hình. Để ý thêm một chỗ <strong>mơ hồ của trường</strong>: trong sự kiện 104, "Channel" xuất hiện hai lần — kênh mà sự kiện được ghi vào (luôn là System) và kênh bị xoá (trong UserData). Quy tắc muốn nói cái thứ hai; một ánh xạ trường ngây thơ lấy cái thứ nhất và quy tắc không bao giờ kêu.</p>
${lenh('s14/sigma', 4)}
${lenh('s14/sigma', 5)}
<p>8 lần thêm vào Administrators — có cái là mẫu tấn công, có cái là quản trị viên làm việc bình thường; quy tắc nói rõ điều đó trong <code>falsepositives</code>. Lần khớp duy nhất của "dịch vụ ở thư mục đáng ngờ" là một dịch vụ thử của pytest trong AppData\\Local\\Temp — dương tính giả, bạn sẽ thêm ngoại lệ theo tên.</p>
${lenh('s14/sigma', 6)}
${lenh('s14/sigma', 7)}
${lenh('s14/sigma', 8)}
<p>Không cảnh báo nào, dù có hai 4625 với SubStatus 0xC0000072 (tài khoản bị vô hiệu). Bộ lọc <code>SubjectUserSid: S-1-0-0</code> đã loại chúng: đăng nhập qua mạng có chủ thể rỗng. Tác giả chọn vậy để giảm nhiễu; cái giá là ai đó đoán tài khoản Administrator đã vô hiệu qua SMB (Bài 4.1) không bị gắn cờ. Đọc filter trước khi tin một quy tắc.</p>
${lenh('s14/sigma', 9)}
<p>Không khớp gì trên hai auth.log có cả một đợt rải mật khẩu lẫn một lần bị chiếm. Không phải lỗi: quy tắc này tìm các <em>lỗi</em> của sshd giống dấu hiệu khai thác, không tìm việc đoán mật khẩu. Brute force cần <strong>quy tắc ngưỡng/tương quan</strong> (Sigma có định dạng correlation: <code>event_count</code>, <code>value_count</code> trong một khoảng thời gian) — đúng lô-gíc của lệnh awk ở 14.1:</p>
<pre><code class="language-yaml"># Sigma correlation (minh hoạ định dạng — SIEM chạy, không phải sigma-mini)
title: SSH password spraying from one source
correlation:
  type: value_count          # đếm số giá trị KHÁC NHAU…
  rules: [sshd_failed_password]
  group-by: [src_ip]
  timespan: 1h
  condition: { field: user, gte: 10 }   # …của user theo mỗi IP mỗi giờ ≥ 10 (14.1, Bước 2)</code></pre>

<h3>🛡️ Sự cố thật: Target, 2013</h3>
<p>Báo cáo của ban chuyên viên Uỷ ban Thương mại Thượng viện Mỹ "A 'Kill Chain' Analysis of the 2013 Target Data Breach" (26/3/2014) liệt kê các cơ hội bị bỏ lỡ; trong đó, dẫn theo báo chí, hệ thống phát hiện xâm nhập của Target đã cảnh báo khi phần mềm rút dữ liệu được cài, và không ai xử lý. Khoảng 40 triệu số thẻ bị đánh cắp. Phát hiện mà không ai phân loại thì chỉ là đồ trang trí: một dự án SIEM là quy tắc <em>và</em> con người, hàng đợi, và tinh chỉnh để cảnh báo thật không phải là cảnh báo thứ 4 000 trong ngày.</p>
${nguon('📘', 'U.S. Senate Commerce Committee — Kill Chain analysis of the 2013 Target data breach (2014)', 'Các cơ hội bị bỏ lỡ, gồm cảnh báo không ai xử lý', 'https://www.commerce.senate.gov/services/files/24d3c229-4f2f-405d-b8db-a3a67f183883')}
${nguon('📘', 'SigmaHQ — kho quy tắc và đặc tả', 'Quy tắc, định dạng correlation, pySigma', 'https://github.com/SigmaHQ/sigma')}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"SIEM làm được gì mà grep không làm được?" — gom liên tục từ nhiều nguồn, chuẩn hoá, tương quan theo thời gian, quy trình xử lý cảnh báo, lưu giữ.</li>
<li>"Giải thích condition 'all of selection_* and not 1 of filter_*' của một quy tắc Sigma."</li>
<li>"Một quy tắc không ra cảnh báo nào suốt một tháng. Tin vui à?" — có thể; kiểm nguồn log có về không, ánh xạ trường, và các filter (im lặng ≠ an toàn, 14.4).</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Là người mới trong đội SOC hay DevOps, phần lớn thời gian bạn sẽ <em>tinh chỉnh</em> quy tắc: đọc vì sao cảnh báo kêu, quyết định có phải dương tính giả không, đề xuất filter chính xác (tên + đường dẫn, không phải "bỏ qua máy này"), và ghi lại.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Đọc <code>win_security_user_added_to_local_administrators.yml</code>: vì sao có filter cho tên kết thúc bằng <code>$</code>?</li>
<li>Biến dương tính giả Pathfinder thành một khối filter và chạy lại sigma-mini để còn 0 khớp.</li>
<li>Viết một quy tắc Sigma (keywords) cho <code>Accepted password for deploy</code> trên web01 và chạy trên cả hai auth log. Tệp nào tìm thấy? Vì sao (14.4)?</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['SIEM', 'Hệ thống gom, chuẩn hoá, tương quan, cảnh báo và lưu giữ log bảo mật.'],
  ['Sigma', 'Định dạng YAML chung cho quy tắc phát hiện, chuyển sang ngôn ngữ truy vấn của từng SIEM.'],
  ['logsource', 'Quy tắc áp vào log nào (product/service/category).'],
  ['Filter', 'Khối loại các khớp vô hại đã biết; cũng là nơi điểm mù ẩn náu.'],
  ['Quy tắc tương quan', 'Quy tắc trên số đếm/chuỗi sự kiện theo thời gian.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>SIEM = gom, chuẩn hoá, tương quan, cảnh báo, lưu giữ.</li>
<li>Đọc logsource, detection, condition, filter, falsepositives trước khi tin một quy tắc.</li>
<li>Ngưỡng cần quy tắc tương quan; cảnh báo cần con người.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-5-canh-bao', title: 'Bài 15.5 — Cảnh báo trên log tập trung', sub: 'Luật của Loki/Grafana và Elastic trong thực tế', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-5-1-sigma', title: 'Khoá Blue Team › 5.1 Cấu trúc quy tắc Sigma', sub: 'Viết, chuyển đổi và kiểm thử quy tắc', cta: 'Mở bài' })}
</div>
`,
};
