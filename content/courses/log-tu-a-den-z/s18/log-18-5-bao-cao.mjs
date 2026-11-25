/**
 * 18.5 — Báo cáo sự cố + trình bày 5 phút + thang chấm (soạn 24/11/2026, agent lgz). Không có lệnh mới: mọi con số lấy từ OUT['s18/*'] (18.2–18.4).
 * Báo cáo mẫu dựa trên đáp án 18.3/18.4. Nguồn: NIST SP 800-61 Rev. 3 (4/2025, kiểm csrc.nist.gov 24/11/2026), Luật 91/2025/QH15 (như bài 14.5, 16.1).
 */
import { nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '18.5 — Step 4 — Write the incident report and present it in five minutes|||18.5 — Bước 4 — Viết báo cáo sự cố và trình bày trong năm phút',
  slug: 'log-18-5-bao-cao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sản phẩm cuối của dự án: báo cáo sự cố cho công ty Hoa Sen Travel — tóm tắt cho lãnh đạo trong năm câu, phạm vi và nguồn, dòng thời gian, phát hiện có bằng chứng, nguyên nhân gốc (sáu mặc định nguy hiểm, không đổ lỗi cá nhân), tác động (dữ liệu khách hàng có số hộ chiếu, nghĩa vụ thông báo 72 giờ theo Luật 91/2025/QH15), việc đã làm và khuyến nghị theo thứ tự ưu tiên, câu hỏi còn mở, phụ lục mã băm. Kèm báo cáo mẫu đầy đủ, dàn ý trình bày 5 phút, thang chấm 100 điểm, tiêu chí "Đạt khi" và cách đưa dự án vào CV/hồ sơ năng lực.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Capstone · 18.5</span>
<h2>The report is the product</h2>
<p class="lead">Nobody outside the investigation will read your grep commands. They will read three pages and decide what to fix, whom to notify, and whether to trust you next time. This lesson gives you the structure, a complete model report for the Hoa Sen case, a five-minute talk, and the rubric.</p>

<h3>The everyday picture</h3>
<p>A doctor's discharge letter: diagnosis in one line, what was done, what the tests showed, what to do next, when to come back — not the raw lab printouts (those are attached).</p>

<h3>Structure (follows the spirit of NIST SP 800-61 Rev. 3)</h3>
${kv([
  ['1. Executive summary', '5 sentences: what happened, since when, what was affected, is it contained, what you need from management.'],
  ['2. Scope and sources', 'Machines, log sources, time range, hashes (appendix), assumptions (time zones, router skew).'],
  ['3. Timeline', 'The 18.4 table, UTC, with confidence.'],
  ['4. Findings', 'One paragraph per stage with the evidence lines.'],
  ['5. Root causes', 'Conditions that made each step possible — systems, not people (blameless).'],
  ['6. Impact', 'Data, people, systems, legal duties.'],
  ['7. Actions taken / recommended', 'Ordered: now · this week · this month. Each with an owner.'],
  ['8. Detection & logging improvements', 'What would have caught it earlier; the visibility gaps.'],
  ['9. Open questions', 'What you could not prove, and what would answer it.'],
  ['Appendix', 'SHA256SUMS, commands used, ATT&amp;CK table.'],
])}
${nguon('📘', 'NIST SP 800-61 Rev. 3 (April 2025)', 'Incident Response Recommendations and Considerations for Cybersecurity Risk Management (CSF 2.0 profile)', 'https://csrc.nist.gov/pubs/sp/800/61/r3/final')}

<h3>Model report (compare with yours after writing it)</h3>
<details><summary><strong>Show the model report</strong></summary>
<p><strong>1. Executive summary.</strong> On Saturday 21/11/2026 between 14:48 and 19:31 UTC an outside attacker guessed the password of the server account <code>deploy</code> on vps01, became administrator through Docker, installed a hidden scheduled task, planted a web back door, and copied the customer table — names, e-mails, phone numbers, <strong>passport numbers</strong>, dates of birth — out of the company (3.5 MB compressed). An attempt to break into the office PC of a developer failed. The scheduled task was still running when the logs were collected on Monday 23/11 02:00 UTC. We need approval to rotate all credentials, rebuild vps01, and notify the data protection authority and affected customers.</p>
<p><strong>2. Scope.</strong> vps01 (auth.log, syslog, journal export, nginx, tour-api container log, PostgreSQL csvlog), rt01 (logread, firewall config), PC-DEV01 (Security events 4624/4625/4647/4672/4740), admin-collected command output; 15–23/11/2026; 24 files hashed (appendix). Assumptions: vps01 and rt01 local time +07:00; rt01 clock measured 97 s slow and corrected.</p>
<p><strong>4. Findings (short).</strong> Scanning of the tour API with sqlmap was blocked by input validation (no SQL errors). SSH password spraying from three addresses hit <code>deploy</code> at 15:34:17Z; the operator logged in at 15:41:07Z from 198.51.100.77. <code>sudo</code> was refused, but membership in group <code>docker</code> gave root via a container (15:44:30–16:21:40Z). From that container the attacker added <code>/etc/cron.d/apt-compat</code> (curl | sh every 10 min, 206 runs), mapped the office network through the WireGuard tunnel and tried SMB passwords on PC-DEV01 (account <code>minh</code> locked at 15:57:53Z, no success), created <code>cache.php</code> with a faked date, and edited <code>auth.log</code> at 16:19:55Z. On Sunday 19:14Z the attacker used the web shell to run <code>psql</code> with the application's database password from a world-readable <code>.env</code>, exported the customer table and downloaded it at 19:19:12Z, then deleted the file.</p>
<p><strong>5. Root causes (no blame).</strong> (1) SSH password login enabled by a cloud-init file; (2) deploy account in the <code>docker</code> group = root; (3) tunnel allowed into the whole office LAN; (4) secrets file readable by every user; (5) PHP executable in the uploads folder; (6) logs only on the attacked machine, no alerting on login failures.</p>
<p><strong>6. Impact.</strong> Personal data of the customers in <code>khach_hang</code> (count to be confirmed from the database), including passport numbers — high risk of identity fraud and targeted phishing. vps01 must be considered fully compromised (root, unknown payload run 206 times). No evidence of compromise of office PCs. Legal: Law 91/2025/QH15 on Personal Data Protection (in force 1/1/2026) requires notifying the competent authority within 72 hours of discovery — discovery was 23/11 01:33Z; confirm the exact duty with a lawyer today.</p>
<p><strong>7. Actions.</strong> <em>Now:</em> isolate vps01 (snapshot disk first), block 203.0.113.50–52 and 198.51.100.77, disable the WireGuard peer, rotate the <code>deploy</code>, database and all <code>.env</code> secrets, unlock and reset <code>minh</code>. <em>This week:</em> rebuild vps01 from a clean image with <code>PasswordAuthentication no</code>, no user in <code>docker</code>, secrets 0600, no PHP in uploads, restrict wg→lan to the NAS port 873 only; notify authority and customers. <em>This month:</em> central log server + alerts (failed SSH, new cron files, 4740, large downloads), auditd rules, pgAudit on customer tables, NTP on the router.</p>
<p><strong>9. Open questions.</strong> What <code>u.sh</code> did (206 runs); exact commands sent to the web shell; whether other data was read with queries faster than 1 s; how many customers' records were in the export.</p>
</details>

<h3>Five-minute talk</h3>
<ol>
<li><strong>0:00–0:45</strong> — What happened, in one sentence, and the business impact (passport data left the company).</li>
<li><strong>0:45–2:30</strong> — The timeline on one slide: 7 stages, UTC, one evidence screenshot each.</li>
<li><strong>2:30–3:30</strong> — Why it was possible: the six defaults. No names.</li>
<li><strong>3:30–4:30</strong> — What we have done, what we need approved, deadlines (72 hours).</li>
<li><strong>4:30–5:00</strong> — What we still do not know and how we will find out.</li>
</ol>

<h3>Rubric (100 points) — "Pass" at 70 with no zero in the first three rows</h3>
${kv([
  ['Evidence (25)', 'Every claim has a log line; ≥ 4 sources used; hashes recorded.'],
  ['Time (15)', 'All UTC; router skew found and corrected; error.log zone handled.'],
  ['Story (20)', 'Entry, escalation, persistence, lateral attempt, web shell, data access, exfiltration, tampering — all found.'],
  ['Tampering proof (10)', 'journal vs auth.log difference, orphans, heartbeat gap, birth time.'],
  ['ATT&amp;CK (10)', 'Current IDs (v19.2), each with evidence.'],
  ['Report (15)', 'Executive summary a manager understands; root causes blameless; prioritised actions with owners; open questions.'],
  ['Talk (5)', 'Five minutes, one timeline slide, ends with decisions needed.'],
])}

<h3>Put it in your CV</h3>
<p>"Investigated a simulated multi-source intrusion (Linux journald/auth.log, nginx, Docker, PostgreSQL csvlog, OpenWrt, Windows Security): proved log tampering, built a UTC timeline of 21 events mapped to 19 MITRE ATT&amp;CK techniques, wrote the incident report. Tools: grep/awk/jq, Python, Loki/LogQL." Link the report (PDF) in your portfolio — it is the strongest thing you can show in a SOC, DevOps or backend interview.</p>

<h3>🛡️ Attacker's corner</h3>
<p>Reports get leaked or forwarded. Do not include live passwords, full customer records or anything that helps a second attacker; refer to the appendix that stays inside the company.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What is a blameless postmortem?" — focus on conditions and systems that allowed the failure, so people report honestly next time.</li>
<li>"How do you write for executives?" — impact and decisions first, technical detail in the appendix.</li>
<li>"What do you put in 'open questions'?" — anything unproven, with the data that would answer it.</li>
</ul>

<h3>At work</h3>
<p>At an outsourcing company, the report often goes to a Japanese or European customer: write in clear English, UTC plus their local time in brackets, no internal jokes, and get it reviewed by your lead before sending.</p>

<h3>🧪 Practice (2 hours)</h3>
<ol>
<li>Write your report (≤ 3 pages + appendix) before opening the model. Then score yourself with the rubric.</li>
<li>Record yourself giving the five-minute talk. Cut anything a non-technical manager would not need.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Executive summary', 'The few sentences decision-makers read first.'],
  ['Root cause', 'Condition that, if removed, prevents the failure from recurring.'],
  ['Blameless', 'Analysing systems, not blaming individuals.'],
  ['Containment', 'Stopping the attacker from doing more while you investigate.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Impact and decisions first, evidence behind, unknowns stated.</li>
<li>Root causes are conditions; fixes are prioritised and owned.</li>
<li>Legal clocks (72 hours) start at discovery — say so in the first paragraph.</li>
</ul>
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-10-3-bao-cao', title: 'Blue Team course › 10.3 Investigation report', sub: 'A report others can verify', cta: 'Open' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-5-4-viet-thong-bao', title: 'Incident Response course › 5.4 Writing for users', sub: 'Honest, specific, no blame', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Dự án cuối khoá · 18.5</span>
<h2>Báo cáo mới là sản phẩm</h2>
<p class="lead">Ngoài nhóm điều tra, không ai đọc lệnh grep của bạn. Họ đọc ba trang rồi quyết định sửa gì, báo cho ai, và lần sau có tin bạn không. Bài này cho bạn cấu trúc, một báo cáo mẫu đầy đủ cho vụ Hoa Sen, bài nói năm phút và thang chấm.</p>

<h3>Liên tưởng đời thường</h3>
<p>Giấy ra viện của bác sĩ: chẩn đoán một dòng, đã làm gì, xét nghiệm cho thấy gì, về nhà làm gì, khi nào tái khám — không phải xấp kết quả xét nghiệm thô (cái đó đính kèm).</p>

<h3>Cấu trúc (theo tinh thần NIST SP 800-61 Rev. 3)</h3>
${kv([
  ['1. Tóm tắt cho lãnh đạo', '5 câu: chuyện gì xảy ra, từ khi nào, ảnh hưởng gì, đã khống chế chưa, cần lãnh đạo quyết gì.'],
  ['2. Phạm vi và nguồn', 'Máy, nguồn log, khoảng thời gian, mã băm (phụ lục), giả định (múi giờ, lệch đồng hồ router).'],
  ['3. Dòng thời gian', 'Bảng của 18.4, UTC, có độ tin cậy.'],
  ['4. Phát hiện', 'Mỗi giai đoạn một đoạn văn kèm dòng bằng chứng.'],
  ['5. Nguyên nhân gốc', 'Điều kiện khiến từng bước làm được — hệ thống, không phải con người (không đổ lỗi).'],
  ['6. Tác động', 'Dữ liệu, con người, hệ thống, nghĩa vụ pháp lý.'],
  ['7. Việc đã làm / khuyến nghị', 'Theo thứ tự: ngay · tuần này · tháng này. Mỗi việc có người chịu trách nhiệm.'],
  ['8. Cải thiện phát hiện & log', 'Điều gì sẽ bắt được sớm hơn; các khoảng mù.'],
  ['9. Câu hỏi còn mở', 'Điều chưa chứng minh được, và dữ liệu nào sẽ trả lời nó.'],
  ['Phụ lục', 'SHA256SUMS, lệnh đã dùng, bảng ATT&amp;CK.'],
])}
${nguon('📘', 'NIST SP 800-61 Rev. 3 (4/2025)', 'Khuyến nghị ứng phó sự cố trong quản trị rủi ro an ninh mạng (hồ sơ CSF 2.0)', 'https://csrc.nist.gov/pubs/sp/800/61/r3/final')}

<h3>Báo cáo mẫu (so với bài của bạn SAU khi viết xong)</h3>
<details><summary><strong>Xem báo cáo mẫu</strong></summary>
<p><strong>1. Tóm tắt cho lãnh đạo.</strong> Thứ Bảy 21/11/2026, từ 14:48 tới 19:31 UTC, một kẻ tấn công bên ngoài đoán được mật khẩu tài khoản máy chủ <code>deploy</code> trên vps01, lên quyền quản trị qua Docker, cài một tác vụ định kỳ ẩn, cài cửa hậu trên web, và chép bảng khách hàng — họ tên, email, số điện thoại, <strong>số hộ chiếu</strong>, ngày sinh — ra khỏi công ty (3,5 MB đã nén). Một lần thử đột nhập máy văn phòng của lập trình viên đã thất bại. Tác vụ định kỳ vẫn đang chạy lúc thu thập log 02:00 UTC thứ Hai 23/11. Cần lãnh đạo duyệt: đổi toàn bộ thông tin đăng nhập, dựng lại vps01, thông báo cơ quan bảo vệ dữ liệu và khách hàng bị ảnh hưởng.</p>
<p><strong>2. Phạm vi.</strong> vps01 (auth.log, syslog, bản xuất journal, nginx, log container tour-api, csvlog PostgreSQL), rt01 (logread, cấu hình tường lửa), PC-DEV01 (sự kiện Security 4624/4625/4647/4672/4740), output lệnh quản trị viên thu; 15–23/11/2026; 24 tệp đã băm (phụ lục). Giả định: vps01 và rt01 đặt giờ địa phương +07:00; đồng hồ rt01 đo được chậm 97 giây và đã sửa.</p>
<p><strong>4. Phát hiện (ngắn).</strong> Dò API tour bằng sqlmap bị lớp kiểm tra đầu vào chặn (không có lỗi SQL). Rải mật khẩu SSH từ ba địa chỉ trúng <code>deploy</code> lúc 15:34:17Z; người điều khiển đăng nhập lúc 15:41:07Z từ 198.51.100.77. <code>sudo</code> bị từ chối, nhưng thuộc nhóm <code>docker</code> nên lên root qua một container (15:44:30–16:21:40Z). Từ container đó kẻ tấn công thêm <code>/etc/cron.d/apt-compat</code> (curl | sh mỗi 10 phút, 206 lần), dò mạng văn phòng qua đường hầm WireGuard và đoán mật khẩu SMB vào PC-DEV01 (tài khoản <code>minh</code> bị khoá 15:57:53Z, không thành công), tạo <code>cache.php</code> với ngày giả, và sửa <code>auth.log</code> lúc 16:19:55Z. Chủ nhật 19:14Z kẻ tấn công dùng webshell chạy <code>psql</code> bằng mật khẩu CSDL của ứng dụng lấy từ tệp <code>.env</code> ai cũng đọc được, xuất bảng khách hàng, tải về lúc 19:19:12Z, rồi xoá tệp.</p>
<p><strong>5. Nguyên nhân gốc (không đổ lỗi).</strong> (1) Đăng nhập SSH bằng mật khẩu bị một tệp cloud-init bật; (2) tài khoản deploy trong nhóm <code>docker</code> = root; (3) đường hầm được vào cả LAN văn phòng; (4) tệp bí mật mọi người dùng đều đọc được; (5) PHP chạy được trong thư mục uploads; (6) log chỉ nằm trên máy bị tấn công, không có cảnh báo khi đăng nhập hỏng.</p>
<p><strong>6. Tác động.</strong> Dữ liệu cá nhân của khách trong bảng <code>khach_hang</code> (số lượng cần xác nhận từ CSDL), gồm số hộ chiếu — rủi ro cao bị mạo danh và lừa đảo nhắm đích. vps01 phải coi là bị chiếm hoàn toàn (root, một mã chưa rõ đã chạy 206 lần). Chưa có bằng chứng máy văn phòng bị chiếm. Pháp lý: Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (hiệu lực 1/1/2026) yêu cầu thông báo cơ quan chuyên trách trong 72 giờ kể từ khi phát hiện — phát hiện lúc 01:33Z ngày 23/11; xác nhận nghĩa vụ cụ thể với luật sư ngay hôm nay.</p>
<p><strong>7. Việc cần làm.</strong> <em>Ngay:</em> cách ly vps01 (chụp đĩa trước), chặn 203.0.113.50–52 và 198.51.100.77, tắt peer WireGuard, đổi mật khẩu <code>deploy</code>, CSDL và mọi bí mật trong <code>.env</code>, mở khoá và đặt lại <code>minh</code>. <em>Tuần này:</em> dựng lại vps01 từ ảnh sạch với <code>PasswordAuthentication no</code>, không ai trong nhóm <code>docker</code>, bí mật 0600, không cho PHP chạy trong uploads, chỉ cho wg→lan tới cổng 873 của NAS; thông báo cơ quan và khách hàng. <em>Tháng này:</em> máy chủ log tập trung + cảnh báo (SSH hỏng, tệp cron mới, 4740, tải về dung lượng lớn), luật auditd, pgAudit cho bảng khách hàng, NTP cho router.</p>
<p><strong>9. Câu hỏi còn mở.</strong> <code>u.sh</code> đã làm gì (206 lần); lệnh chính xác gửi qua webshell; có dữ liệu nào khác bị đọc bằng truy vấn nhanh hơn 1 giây không; tệp xuất chứa bao nhiêu khách hàng.</p>
</details>

<h3>Bài nói năm phút</h3>
<ol>
<li><strong>0:00–0:45</strong> — Chuyện gì xảy ra, trong một câu, và tác động kinh doanh (dữ liệu hộ chiếu đã ra khỏi công ty).</li>
<li><strong>0:45–2:30</strong> — Dòng thời gian trên một slide: 7 giai đoạn, UTC, mỗi giai đoạn một ảnh bằng chứng.</li>
<li><strong>2:30–3:30</strong> — Vì sao làm được: sáu mặc định. Không nêu tên người.</li>
<li><strong>3:30–4:30</strong> — Đã làm gì, cần duyệt gì, hạn chót (72 giờ).</li>
<li><strong>4:30–5:00</strong> — Điều còn chưa biết và sẽ tìm ra bằng cách nào.</li>
</ol>

<h3>Thang chấm (100 điểm) — "Đạt" từ 70 và không có 0 điểm ở ba hàng đầu</h3>
${kv([
  ['Bằng chứng (25)', 'Mọi khẳng định có dòng log; dùng ≥ 4 nguồn; có ghi mã băm.'],
  ['Thời gian (15)', 'Toàn bộ UTC; tìm ra và sửa lệch router; xử lý đúng múi giờ của error.log.'],
  ['Câu chuyện (20)', 'Tìm đủ: vào, leo thang, bám trụ, thử lan ngang, webshell, truy cập dữ liệu, rút dữ liệu, xoá dấu vết.'],
  ['Chứng minh sửa log (10)', 'Chênh lệch journal và auth.log, dòng mồ côi, nhịp cron đứt, thời điểm sinh tệp.'],
  ['ATT&amp;CK (10)', 'Số hiệu hiện hành (v19.2), mỗi kỹ thuật có bằng chứng.'],
  ['Báo cáo (15)', 'Tóm tắt lãnh đạo đọc hiểu; nguyên nhân gốc không đổ lỗi; khuyến nghị có ưu tiên và người phụ trách; câu hỏi mở.'],
  ['Trình bày (5)', 'Năm phút, một slide dòng thời gian, kết thúc bằng các quyết định cần có.'],
])}

<h3>Đưa vào CV</h3>
<p>"Điều tra một vụ xâm nhập mô phỏng đa nguồn (journald/auth.log Linux, nginx, Docker, csvlog PostgreSQL, OpenWrt, Windows Security): chứng minh log bị sửa, dựng dòng thời gian UTC 21 sự việc gắn 19 kỹ thuật MITRE ATT&amp;CK, viết báo cáo sự cố. Công cụ: grep/awk/jq, Python, Loki/LogQL." Đặt liên kết tới báo cáo (PDF) trong hồ sơ năng lực — đó là thứ mạnh nhất bạn có thể đưa ra ở buổi phỏng vấn SOC, DevOps hay backend.</p>

<h3>🛡️ Góc hacker</h3>
<p>Báo cáo hay bị lộ hoặc bị chuyển tiếp lung tung. Đừng ghi mật khẩu còn dùng được, bản ghi khách hàng đầy đủ hay bất cứ gì giúp kẻ tấn công thứ hai; chỉ dẫn tới phụ lục giữ trong nội bộ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Postmortem không đổ lỗi là gì?" — tập trung vào điều kiện và hệ thống đã cho phép sự cố xảy ra, để lần sau mọi người báo cáo trung thực.</li>
<li>"Viết cho lãnh đạo thế nào?" — tác động và quyết định trước, chi tiết kỹ thuật để phụ lục.</li>
<li>"Mục 'câu hỏi còn mở' ghi gì?" — mọi điều chưa chứng minh, kèm dữ liệu sẽ trả lời được nó.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Ở công ty outsourcing, báo cáo thường gửi khách Nhật hoặc châu Âu: viết tiếng Anh rõ ràng, UTC kèm giờ địa phương của họ trong ngoặc, không đùa nội bộ, và nhờ trưởng nhóm duyệt trước khi gửi.</p>

<h3>🧪 Thực hành (2 giờ)</h3>
<ol>
<li>Viết báo cáo của bạn (≤ 3 trang + phụ lục) trước khi mở bản mẫu. Rồi tự chấm theo thang.</li>
<li>Tự quay video bài nói năm phút. Cắt mọi thứ một giám đốc không chuyên kỹ thuật không cần.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Tóm tắt cho lãnh đạo', 'Vài câu người ra quyết định đọc đầu tiên.'],
  ['Nguyên nhân gốc', 'Điều kiện mà bỏ đi thì sự cố không lặp lại.'],
  ['Không đổ lỗi (blameless)', 'Phân tích hệ thống, không quy trách nhiệm cá nhân.'],
  ['Khống chế (containment)', 'Chặn kẻ tấn công làm thêm trong lúc điều tra.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tác động và quyết định trước, bằng chứng phía sau, điều chưa biết ghi rõ.</li>
<li>Nguyên nhân gốc là điều kiện; việc sửa có ưu tiên và có người phụ trách.</li>
<li>Đồng hồ pháp lý (72 giờ) chạy từ lúc phát hiện — nói ngay ở đoạn đầu.</li>
</ul>
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-10-3-bao-cao', title: 'Khoá Blue Team › 10.3 Báo cáo điều tra', sub: 'Báo cáo người khác kiểm lại được', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-5-4-viet-thong-bao', title: 'Khoá Incident Response › 5.4 Viết cho người dùng', sub: 'Thật, cụ thể, không đổ lỗi', cta: 'Mở bài' })}
</div>
`,
};
