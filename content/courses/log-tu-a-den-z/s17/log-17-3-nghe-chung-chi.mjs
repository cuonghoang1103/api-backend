/**
 * 17.3 — Kỹ năng đọc log dẫn tới đâu: SOC, SRE/DevOps, backend trực sự cố; chứng chỉ và nền tảng luyện (soạn 24/11/2026, agent lgz).
 * Mọi tên/mã chứng chỉ đã GET kiểm trên trang chính thức ngày 24/11/2026:
 *   CompTIA Security+ V8 SY0-801 ra mắt 17/11/2026; SY0-701 (V7) tiếng Anh hết hạn thi 11/6/2027 (comptia.org/en/certifications/security/v7|v8)
 *   CompTIA CySA+ V4 CS0-004 ra mắt 23/6/2026, tối đa 85 câu (comptia.org/en/certifications/cybersecurity-analyst/v4)
 *   Microsoft SC-200 Security Operations Analyst Associate — Sentinel, Defender XDR, KQL (learn.microsoft.com)
 *   Splunk Core Certified User (trang splunk.com 200); BTL1 — Security Blue Team, bài thi thực hành, giá £399 trên trang chính thức (24/11/2026)
 *   Splunk BOTSv3 dataset: github.com/splunk/botsv3. Không ghi giá ngoài BTL1 (giá đổi thường xuyên — người học kiểm lại).
 * Không có lệnh chạy thật (bài nghề nghiệp) — các ví dụ dòng CV lấy số từ output thật của Lab 8/10/12 (đã có trong khoá).
 */
import { kv, nguon, lienKet } from '../_chung.mjs';

export default {
  title: 'Where this skill leads: SOC analyst, SRE/DevOps, backend on-call; certifications and practice platforms|||Kỹ năng này dẫn tới đâu: SOC analyst, SRE/DevOps, backend trực sự cố; chứng chỉ và nền tảng luyện',
  slug: 'log-17-3-nghe-chung-chi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba con đường dùng kỹ năng đọc log mỗi ngày — SOC analyst (tier 1–3), SRE/DevOps, lập trình viên backend trực sự cố: một ngày làm việc thật, log nào dùng nhiều nhất, công cụ, và chương nào của khoá tương ứng. Chứng chỉ có thật, đã kiểm mã hiện hành (24/11/2026): Security+ SY0-701/SY0-801, CySA+ CS0-004, Microsoft SC-200, Splunk Core Certified User, BTL1 — nên thi cái nào, khi nào, và khi nào KHÔNG cần. Nền tảng luyện hợp pháp (Blue Team Labs Online, CyberDefenders, LetsDefend, TryHackMe, bộ dữ liệu Splunk BOTS). Viết kỹ năng này vào CV bằng dòng có số thật; lộ trình 3–6–12 tháng cho sinh viên chuẩn bị OJT.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.3</span>
<h2>Three jobs that read logs all day — and how to get one</h2>
<p class="lead">Reading logs is not a job title. It is a skill that sits inside several jobs, and it pays off differently in each. This lesson shows the three most common, what a real day looks like, which certifications are worth it (and which are not, for you, yet), where to practise legally, and how to put this skill on a CV so a recruiter believes it.</p>

<h3>The everyday picture: the same stethoscope, three doctors</h3>
<p>A GP, an emergency doctor and a cardiologist all use a stethoscope. The tool is the same; what they listen for and how fast they must decide is different. Logs are the stethoscope; SOC, SRE and backend on-call are the three doctors.</p>

<h3>Path 1 — SOC analyst (security operations)</h3>
<ul>
<li><strong>A day</strong>: a queue of alerts from the SIEM. Tier 1 triages: is it real? (a 4625 burst from a known scanner vs a 4624 type 10 from a new country). Tier 2 investigates the real ones: builds a timeline across Windows, firewall, proxy, EDR, cloud audit logs. Tier 3/detection engineers write and tune rules (Sigma, KQL, SPL) and hunt.</li>
<li><strong>Logs used most</strong>: Windows Security + Sysmon, authentication (AD, Entra ID, VPN), firewall/proxy/DNS, EDR, cloud audit (CloudTrail).</li>
<li><strong>Tools</strong>: a SIEM (Splunk, Microsoft Sentinel, Elastic, Wazuh/OpenSearch), ticketing, threat intel.</li>
<li><strong>Chapters that train it</strong>: 3–5 (Windows), 8 (auth.log, auditd), 11 (network), 14 (investigation, ATT&CK, Sigma), 15 (central store), 18 (capstone).</li>
<li><strong>Reality check</strong>: entry SOC roles are often shift work (24/7), and alert fatigue is real. Many good SOC analysts started in IT support or system administration.</li>
</ul>

<h3>Path 2 — SRE / DevOps</h3>
<ul>
<li><strong>A day</strong>: building and running the platform — CI/CD, containers, Kubernetes, monitoring. Logs matter most during incidents and when building the logging pipeline itself (agents, retention, cost, alerting).</li>
<li><strong>Logs used most</strong>: journald/syslog, nginx/ingress, container and Kubernetes events, cloud logs; plus metrics and traces.</li>
<li><strong>Chapters</strong>: 7–8 (Linux), 10 (web), 13 (containers/cloud), 15 (Loki/ELK, alerts), 16 (retention, cost, integrity). Metrics and traces: the observability-monitoring course.</li>
</ul>

<h3>Path 3 — Backend developer on call (your most likely first job)</h3>
<ul>
<li><strong>A day</strong>: you write features in Node.js or Spring; when production breaks, you are expected to read <em>your own service's</em> logs, find the request, and fix the bug. In outsourcing companies you also answer client tickets with evidence from logs.</li>
<li><strong>What makes you stand out as a fresher</strong>: your service logs JSON with a request id; you can follow one request through nginx → app → database; you never log secrets; you can explain a 502 vs a 504.</li>
<li><strong>Chapters</strong>: 1–2 (fundamentals, grep/awk/jq), 9 (browser), 10 (web + Node + Spring), 12 (database), 13.1 (Docker), 16.3 (secrets).</li>
</ul>

<h3>Certifications — what exists today (checked 24/11/2026)</h3>
<table>
<thead><tr><th>Certification</th><th>Code / status</th><th>Fits</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>CompTIA Security+</td><td>SY0-701 (English retires 11 June 2027); new V8 <strong>SY0-801</strong> launched 17 Nov 2026</td><td>Any security role, often required by employers abroad</td><td>Broad foundation, not log-specific; multiple choice + performance-based questions</td></tr>
<tr><td>CompTIA CySA+</td><td><strong>CS0-004</strong> launched 23 June 2026 (max 85 questions)</td><td>SOC analyst</td><td>Analysis of logs/alerts, vulnerability management, incident response; after Security+</td></tr>
<tr><td>Microsoft SC-200</td><td>Security Operations Analyst Associate</td><td>SOC in Microsoft-heavy companies</td><td>Microsoft Sentinel, Defender XDR, hunting with KQL</td></tr>
<tr><td>Splunk Core Certified User</td><td>Entry Splunk certification</td><td>SOC/ops teams that use Splunk</td><td>Searching (SPL), fields, reports; free Splunk training exists</td></tr>
<tr><td>BTL1 (Security Blue Team)</td><td>Practical exam (hands-on investigation)</td><td>SOC tier 1</td><td>Phishing, threat intel, SIEM, forensics, incident response; price on official page £399</td></tr>
</tbody>
</table>
<p>Exam versions change every few years and prices change more often — check the official page on the day you book. Do not buy "dumps": they violate exam agreements and teach nothing.</p>

<h3>Which one, when — honest advice for a student</h3>
<ul>
<li><strong>Going for a backend OJT/fresher role</strong>: you need <em>no</em> certification for logs. A GitHub project whose README shows structured logs with request ids, plus the capstone report of this course, says more. Spend the money on English and your project.</li>
<li><strong>Going for SOC</strong>: Security+ first (foundation, widely recognised), then a practical one (BTL1 or CySA+). SC-200 if the target company runs Microsoft 365/Sentinel.</li>
<li><strong>Going for SRE/DevOps</strong>: log certifications are rare; cloud (AWS) and Kubernetes certifications matter more — see the cloud-aws course.</li>
<li>A certification never replaces being able to do round 5 of lesson 17.2 out loud.</li>
</ul>

<h3>Practise legally (free or freemium)</h3>
<ul>
<li><strong>Blue Team Labs Online</strong> (by Security Blue Team): investigation challenges with real log/PCAP files.</li>
<li><strong>CyberDefenders</strong>: blue-team "labs" — download evidence, answer questions; many are log/SIEM based.</li>
<li><strong>LetsDefend</strong>: a simulated SOC with an alert queue — closest to a tier 1 shift.</li>
<li><strong>TryHackMe</strong>: guided rooms; the SOC Level 1 path covers SIEM, Windows/Linux logs, Splunk and ELK.</li>
<li><strong>Splunk BOTS datasets</strong> (Boss of the SOC; v3 is public on GitHub): a full company's logs during an attack — load into a free Splunk and hunt.</li>
<li><strong>Your own lab</strong>: every chapter of this course. Write a report for each lab — that is your portfolio.</li>
</ul>
<p>Only practise on systems you own or platforms that give you permission (lesson 0.2).</p>

<h3>Putting it on your CV</h3>
<p>Weak: "Skills: Event Viewer, Linux logs, ELK." Every candidate writes that. Strong lines have an action, a tool, a real number and a result:</p>
<div class="callout ok"><ul>
<li>"Investigated a simulated SSH password-guessing attack from auth.log with grep/awk; identified the successful login after 15 failures and wrote a containment plan (lab)."</li>
<li>"Added structured JSON logging (pino / Logback + MDC) with request IDs to a Spring Boot + Node.js project; traced one request across nginx, API and PostgreSQL."</li>
<li>"Built a Loki + Grafana stack with alerts for SSH failures and 5xx rate; documented retention and redaction rules."</li>
<li>"Found a slow endpoint (1.4 s average) and an application crash behind intermittent 502/504 using nginx and application logs; one-page incident report on GitHub."</li>
</ul></div>
<p>Write "(lab)" or "(personal project)" honestly — interviewers respect it and will ask you about it, which is exactly the conversation you want.</p>

<h3>A 3–6–12 month plan</h3>
<ul>
<li><strong>3 months</strong> (before applying for OJT): Chapters 1–2, 7–10, 12, 16.3 of this course; structured logs + request id in your own project; lesson 17.1 answers recorded.</li>
<li><strong>6 months</strong>: Chapters 13, 15, 18; capstone report on GitHub; 10 LetsDefend/CyberDefenders challenges if you lean toward security.</li>
<li><strong>12 months</strong>: SOC path — Security+ then BTL1/CySA+; SRE path — a cloud certification and running a real logging pipeline for a project.</li>
</ul>

<h3>🛡️ Attacker's corner: why SOC work is harder than it looks</h3>
<p>In the Target breach (2013) the security tools <em>did</em> raise alerts while the malware was being installed — the US Senate committee report found they were not acted on. Attackers rely on defenders drowning in alerts. That is why interviewers for SOC roles ask how you would reduce false positives and prioritise, not only how you would detect.</p>

<h3>Real-world situations</h3>
<ul>
<li><strong>Outsourcing interview</strong>: "Do you have certifications?" — "Not yet; I focused on a project where I…" followed by one of the CV lines above is a fine answer for a fresher.</li>
<li><strong>Moving sideways later</strong>: many SOC and SRE engineers started as backend developers who were good at incidents. Volunteering for on-call and writing clean incident notes is how that door opens.</li>
</ul>

<h3>🎯 What interviewers will ask</h3>
<ol>
<li>"Why do you want SOC/SRE/backend?" — tie it to something you did in a lab, not to salary.</li>
<li>"Which SIEM have you used?" — name one you really installed (Loki/Grafana, Elastic, Wazuh from this course) and what you queried.</li>
<li>"How would you handle 500 alerts a day?" — triage by severity and asset, tune noisy rules, automate enrichment, measure false-positive rate.</li>
<li>"Tell me about a certification you are studying for" — say what you learned from it, not just the name.</li>
</ol>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Pick your path (1, 2 or 3) and write down the three chapters of this course you will redo first.</li>
<li>Rewrite one line of your CV in the "action + tool + number + result" form using output from a lab you actually did.</li>
<li>Create a free account on one practice platform and finish one beginner challenge; write a 5-line note of what logs you used.</li>
</ol>
<p><strong>Pass when:</strong> your CV line contains a real number from your own output, and your note names the log source, the filter you used, and the answer.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['SOC', 'Security Operations Center — team that monitors and responds to security alerts.'],
  ['Tier 1 / 2 / 3', 'Triage / investigation / engineering and hunting.'],
  ['SRE', 'Site Reliability Engineering — running systems reliably with engineering methods.'],
  ['On-call', 'Being reachable to respond to production incidents in a rota.'],
  ['SIEM', 'System that collects security logs, correlates and alerts.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Three paths: SOC, SRE/DevOps, backend on-call — same skill, different depth.</li>
<li>For a backend OJT, a project with good logging beats any certificate.</li>
<li>SOC: Security+ (SY0-701/SY0-801) then BTL1 or CySA+ (CS0-004); SC-200 for Microsoft shops.</li>
<li>Practise only where you have permission; your lab reports are your portfolio.</li>
<li>CV lines need an action, a tool, a real number and a result.</li>
</ul>
${nguon('📘', 'CompTIA — Security+ (V8, SY0-801)', 'Exam code, launch date 17/11/2026', 'https://www.comptia.org/en/certifications/security/v8/')}
${nguon('📘', 'CompTIA — CySA+ (V4, CS0-004)', 'Launch date 23/6/2026, max 85 questions', 'https://www.comptia.org/en/certifications/cybersecurity-analyst/v4/')}
${nguon('📘', 'Microsoft Learn — Security Operations Analyst Associate (SC-200)', 'Sentinel, Defender XDR, KQL', 'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/')}
${nguon('📘', 'Splunk — Core Certified User', 'Certification track page', 'https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-user.html')}
${nguon('📘', 'Security Blue Team — Blue Team Level 1', 'Practical SOC analyst certification', 'https://www.securityblue.team/certifications/blue-team-level-1')}
${nguon('🧪', 'GitHub — splunk/botsv3', 'Boss of the SOC v3 dataset', 'https://github.com/splunk/botsv3')}
${nguon('📰', 'NBC News — Target missed many warning signs (25/03/2014)', 'Summary of the US Senate committee staff report', 'https://www.nbcnews.com/business/consumer/target-missed-many-warning-signs-leading-breach-senate-report-n62021')}
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-2-du-an-cv', title: 'Interview prep 1.2 — Writing projects on your CV', sub: 'Role, decisions, incidents, results', cta: 'Open' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-13-2-chung-chi', title: 'Incident response 13.2 — Certifications related to incident response', sub: 'The IR side of the same decision', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-13-1-chung-chi', title: 'Blue team & SIEM 13.1 — Certifications for a SOC path', sub: 'Security+, CySA+, BTL1 and beyond', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.3</span>
<h2>Ba nghề đọc log cả ngày — và cách bước vào</h2>
<p class="lead">Đọc log không phải một chức danh. Nó là kỹ năng nằm bên trong nhiều nghề, và mỗi nghề trả công cho nó theo một kiểu. Bài này cho thấy ba nghề phổ biến nhất, một ngày làm việc thật trông thế nào, chứng chỉ nào đáng thi (và cái nào chưa cần với bạn lúc này), luyện hợp pháp ở đâu, và ghi kỹ năng này vào CV sao cho nhà tuyển dụng tin.</p>

<h3>Liên tưởng đời thường: cùng một ống nghe, ba bác sĩ</h3>
<p>Bác sĩ đa khoa, bác sĩ cấp cứu và bác sĩ tim mạch đều dùng ống nghe. Dụng cụ giống nhau; cái họ lắng nghe và tốc độ phải quyết định thì khác. Log là ống nghe; SOC, SRE và backend trực sự cố là ba bác sĩ.</p>

<h3>Con đường 1 — SOC analyst (vận hành an ninh)</h3>
<ul>
<li><strong>Một ngày</strong>: một hàng đợi cảnh báo từ SIEM. Tier 1 phân loại: thật hay giả? (một loạt 4625 từ máy quét quen thuộc khác với một 4624 kiểu 10 từ một nước lạ). Tier 2 điều tra cảnh báo thật: dựng dòng thời gian qua Windows, tường lửa, proxy, EDR, log kiểm toán cloud. Tier 3/kỹ sư phát hiện viết và tinh chỉnh quy tắc (Sigma, KQL, SPL) và săn mối đe doạ.</li>
<li><strong>Log dùng nhiều nhất</strong>: Windows Security + Sysmon, xác thực (AD, Entra ID, VPN), tường lửa/proxy/DNS, EDR, kiểm toán cloud (CloudTrail).</li>
<li><strong>Công cụ</strong>: một SIEM (Splunk, Microsoft Sentinel, Elastic, Wazuh/OpenSearch), hệ thống ticket, nguồn tin tình báo mối đe doạ.</li>
<li><strong>Chương luyện kỹ năng này</strong>: 3–5 (Windows), 8 (auth.log, auditd), 11 (mạng), 14 (điều tra, ATT&CK, Sigma), 15 (kho tập trung), 18 (dự án cuối).</li>
<li><strong>Sự thật</strong>: vị trí SOC đầu tiên thường làm theo ca (24/7), và mệt mỏi vì cảnh báo là có thật. Nhiều SOC analyst giỏi đi lên từ hỗ trợ IT hoặc quản trị hệ thống.</li>
</ul>

<h3>Con đường 2 — SRE / DevOps</h3>
<ul>
<li><strong>Một ngày</strong>: dựng và vận hành nền tảng — CI/CD, container, Kubernetes, giám sát. Log quan trọng nhất lúc có sự cố và lúc dựng chính đường ống log (agent, thời gian lưu, chi phí, cảnh báo).</li>
<li><strong>Log dùng nhiều nhất</strong>: journald/syslog, nginx/ingress, sự kiện container và Kubernetes, log cloud; cộng metric và trace.</li>
<li><strong>Chương</strong>: 7–8 (Linux), 10 (web), 13 (container/cloud), 15 (Loki/ELK, cảnh báo), 16 (thời gian lưu, chi phí, toàn vẹn). Metric và trace: khoá Observability & Monitoring.</li>
</ul>

<h3>Con đường 3 — Lập trình viên backend trực sự cố (công việc đầu tiên dễ gặp nhất của bạn)</h3>
<ul>
<li><strong>Một ngày</strong>: bạn viết tính năng bằng Node.js hoặc Spring; khi production hỏng, người ta chờ bạn đọc log của <em>chính dịch vụ mình</em>, tìm ra request, và sửa lỗi. Ở công ty outsourcing bạn còn trả lời ticket của khách bằng bằng chứng lấy từ log.</li>
<li><strong>Điều làm fresher nổi bật</strong>: dịch vụ của bạn ghi log JSON có request id; bạn lần được một request qua nginx → app → CSDL; bạn không bao giờ log bí mật; bạn giải thích được 502 khác 504 thế nào.</li>
<li><strong>Chương</strong>: 1–2 (nền tảng, grep/awk/jq), 9 (trình duyệt), 10 (web + Node + Spring), 12 (CSDL), 13.1 (Docker), 16.3 (bí mật).</li>
</ul>

<h3>Chứng chỉ — những gì đang có (kiểm ngày 24/11/2026)</h3>
<table>
<thead><tr><th>Chứng chỉ</th><th>Mã / tình trạng</th><th>Hợp với</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>CompTIA Security+</td><td>SY0-701 (bản tiếng Anh ngừng thi 11/6/2027); bản V8 mới <strong>SY0-801</strong> ra mắt 17/11/2026</td><td>Mọi vị trí bảo mật, nhà tuyển dụng nước ngoài hay yêu cầu</td><td>Nền tảng rộng, không riêng về log; trắc nghiệm + câu thực hành mô phỏng</td></tr>
<tr><td>CompTIA CySA+</td><td><strong>CS0-004</strong> ra mắt 23/6/2026 (tối đa 85 câu)</td><td>SOC analyst</td><td>Phân tích log/cảnh báo, quản lý lỗ hổng, ứng phó sự cố; thi sau Security+</td></tr>
<tr><td>Microsoft SC-200</td><td>Security Operations Analyst Associate</td><td>SOC ở công ty dùng nhiều đồ Microsoft</td><td>Microsoft Sentinel, Defender XDR, săn mối đe doạ bằng KQL</td></tr>
<tr><td>Splunk Core Certified User</td><td>Chứng chỉ Splunk đầu vào</td><td>Đội SOC/vận hành dùng Splunk</td><td>Tìm kiếm (SPL), trường, báo cáo; có khoá học Splunk miễn phí</td></tr>
<tr><td>BTL1 (Security Blue Team)</td><td>Bài thi thực hành (điều tra trên máy)</td><td>SOC tier 1</td><td>Phishing, tình báo mối đe doạ, SIEM, điều tra số, ứng phó sự cố; giá trên trang chính thức £399</td></tr>
</tbody>
</table>
<p>Phiên bản bài thi đổi vài năm một lần, giá đổi còn thường hơn — kiểm trang chính thức đúng ngày bạn đăng ký. Đừng mua "dump" (đề lộ): vi phạm cam kết thi và không dạy bạn gì cả.</p>

<h3>Thi cái nào, khi nào — lời khuyên thật cho sinh viên</h3>
<ul>
<li><strong>Nhắm OJT/fresher backend</strong>: bạn <em>không</em> cần chứng chỉ nào về log. Một dự án GitHub có README cho thấy log có cấu trúc kèm request id, cộng báo cáo dự án cuối của khoá này, nói được nhiều hơn. Dành tiền cho tiếng Anh và dự án.</li>
<li><strong>Nhắm SOC</strong>: Security+ trước (nền tảng, được công nhận rộng), rồi một chứng chỉ thực hành (BTL1 hoặc CySA+). SC-200 nếu công ty bạn nhắm chạy Microsoft 365/Sentinel.</li>
<li><strong>Nhắm SRE/DevOps</strong>: chứng chỉ riêng về log hiếm; chứng chỉ cloud (AWS) và Kubernetes quan trọng hơn — xem khoá cloud-aws.</li>
<li>Không chứng chỉ nào thay được việc bạn làm vòng 5 của bài 17.2 thành tiếng.</li>
</ul>

<h3>Luyện hợp pháp (miễn phí hoặc có bản miễn phí)</h3>
<ul>
<li><strong>Blue Team Labs Online</strong> (của Security Blue Team): thử thách điều tra với tệp log/PCAP thật.</li>
<li><strong>CyberDefenders</strong>: "lab" phía phòng thủ — tải bằng chứng về, trả lời câu hỏi; nhiều bài dựa trên log/SIEM.</li>
<li><strong>LetsDefend</strong>: một SOC mô phỏng có hàng đợi cảnh báo — gần nhất với một ca trực tier 1.</li>
<li><strong>TryHackMe</strong>: phòng học có hướng dẫn; lộ trình SOC Level 1 gồm SIEM, log Windows/Linux, Splunk và ELK.</li>
<li><strong>Bộ dữ liệu Splunk BOTS</strong> (Boss of the SOC; bản v3 công khai trên GitHub): log của cả một công ty trong lúc bị tấn công — nạp vào Splunk bản miễn phí rồi săn.</li>
<li><strong>Lab của chính bạn</strong>: mọi chương của khoá này. Viết báo cáo cho mỗi lab — đó là hồ sơ năng lực của bạn.</li>
</ul>
<p>Chỉ luyện trên hệ thống của mình hoặc nền tảng cho phép (bài 0.2).</p>

<h3>Ghi vào CV</h3>
<p>Yếu: "Kỹ năng: Event Viewer, log Linux, ELK." Ứng viên nào cũng viết vậy. Dòng mạnh có hành động, công cụ, con số thật và kết quả:</p>
<div class="callout ok"><ul>
<li>"Investigated a simulated SSH password-guessing attack from auth.log with grep/awk; identified the successful login after 15 failures and wrote a containment plan (lab)." — Điều tra một vụ dò mật khẩu SSH giả lập từ auth.log bằng grep/awk; tìm ra lần đăng nhập thành công sau 15 lần sai và viết kế hoạch khoanh vùng (lab).</li>
<li>"Added structured JSON logging (pino / Logback + MDC) with request IDs to a Spring Boot + Node.js project; traced one request across nginx, API and PostgreSQL." — Thêm log JSON có cấu trúc kèm request ID cho dự án Spring Boot + Node.js; lần một request qua nginx, API và PostgreSQL.</li>
<li>"Built a Loki + Grafana stack with alerts for SSH failures and 5xx rate; documented retention and redaction rules." — Dựng Loki + Grafana có cảnh báo SSH sai và tỉ lệ 5xx; viết quy định thời gian lưu và che dữ liệu.</li>
<li>"Found a slow endpoint (1.4 s average) and an application crash behind intermittent 502/504 using nginx and application logs; one-page incident report on GitHub." — Tìm ra một endpoint chậm (trung bình 1,4 giây) và một lần app sập đứng sau các lỗi 502/504 lúc có lúc không bằng log nginx và log app; báo cáo sự cố một trang trên GitHub.</li>
</ul></div>
<p>Ghi "(lab)" hay "(dự án cá nhân)" một cách trung thực — người phỏng vấn tôn trọng điều đó và sẽ hỏi bạn về nó, mà đó chính là cuộc trò chuyện bạn muốn.</p>

<h3>Lộ trình 3–6–12 tháng</h3>
<ul>
<li><strong>3 tháng</strong> (trước khi nộp OJT): Chương 1–2, 7–10, 12, 16.3 của khoá; log có cấu trúc + request id trong dự án của chính bạn; ghi âm các câu trả lời của bài 17.1.</li>
<li><strong>6 tháng</strong>: Chương 13, 15, 18; báo cáo dự án cuối trên GitHub; 10 thử thách LetsDefend/CyberDefenders nếu bạn nghiêng về bảo mật.</li>
<li><strong>12 tháng</strong>: hướng SOC — Security+ rồi BTL1/CySA+; hướng SRE — một chứng chỉ cloud và vận hành một đường ống log thật cho một dự án.</li>
</ul>

<h3>🛡️ Góc hacker: vì sao việc SOC khó hơn vẻ ngoài</h3>
<p>Trong vụ Target (2013), công cụ bảo mật <em>đã</em> bật cảnh báo trong lúc mã độc đang được cài — báo cáo của uỷ ban Thượng viện Mỹ kết luận các cảnh báo đó không được xử lý. Kẻ tấn công trông cậy vào việc người phòng thủ bị ngập trong cảnh báo. Vì vậy phỏng vấn SOC hỏi bạn giảm báo động giả và xếp ưu tiên thế nào, không chỉ hỏi bạn phát hiện thế nào.</p>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Phỏng vấn outsourcing</strong>: "Em có chứng chỉ gì không?" — "Dạ chưa; em tập trung vào một dự án mà em đã…" tiếp theo là một trong các dòng CV ở trên — câu trả lời ổn cho fresher.</li>
<li><strong>Chuyển hướng sau này</strong>: nhiều kỹ sư SOC và SRE khởi đầu là lập trình viên backend giỏi xử lý sự cố. Xung phong trực sự cố và viết ghi chú sự cố gọn gàng là cách cánh cửa đó mở ra.</li>
</ul>

<h3>🎯 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li>"Vì sao em muốn làm SOC/SRE/backend?" — gắn với việc bạn đã làm trong lab, không gắn với lương.</li>
<li>"Em đã dùng SIEM nào?" — nêu cái bạn thật sự đã cài (Loki/Grafana, Elastic, Wazuh trong khoá này) và bạn đã truy vấn gì.</li>
<li>"Mỗi ngày 500 cảnh báo thì em xử lý thế nào?" — phân loại theo mức độ và tài sản, tinh chỉnh quy tắc ồn, tự động làm giàu dữ liệu, đo tỉ lệ báo động giả.</li>
<li>"Kể về chứng chỉ em đang học" — nói bạn học được gì từ nó, không chỉ đọc tên.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn con đường của bạn (1, 2 hoặc 3) và ghi ra ba chương của khoá bạn sẽ làm lại trước.</li>
<li>Viết lại một dòng CV theo dạng "hành động + công cụ + con số + kết quả", dùng output của một lab bạn đã thật sự làm.</li>
<li>Tạo tài khoản miễn phí trên một nền tảng luyện và làm xong một thử thách mức nhập môn; viết ghi chú 5 dòng về những log bạn đã dùng.</li>
</ol>
<p><strong>Đạt khi:</strong> dòng CV có một con số thật lấy từ output của chính bạn, và ghi chú nêu được nguồn log, bộ lọc đã dùng, và đáp án.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['SOC', 'Security Operations Center — đội giám sát và ứng phó cảnh báo bảo mật.'],
  ['Tier 1 / 2 / 3', 'Phân loại / điều tra / kỹ nghệ phát hiện và săn mối đe doạ.'],
  ['SRE', 'Site Reliability Engineering — vận hành hệ thống tin cậy bằng phương pháp kỹ thuật.'],
  ['Trực sự cố (on-call)', 'Luân phiên sẵn sàng xử lý sự cố production.'],
  ['SIEM', 'Hệ thống gom log bảo mật, tương quan và cảnh báo.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba con đường: SOC, SRE/DevOps, backend trực sự cố — cùng kỹ năng, khác độ sâu.</li>
<li>Với OJT backend, một dự án ghi log tốt hơn mọi chứng chỉ.</li>
<li>SOC: Security+ (SY0-701/SY0-801) rồi BTL1 hoặc CySA+ (CS0-004); SC-200 cho công ty dùng Microsoft.</li>
<li>Chỉ luyện nơi được phép; báo cáo lab là hồ sơ năng lực của bạn.</li>
<li>Dòng CV cần hành động, công cụ, con số thật và kết quả.</li>
</ul>
${nguon('📘', 'CompTIA — Security+ (V8, SY0-801)', 'Mã bài thi, ra mắt 17/11/2026', 'https://www.comptia.org/en/certifications/security/v8/')}
${nguon('📘', 'CompTIA — CySA+ (V4, CS0-004)', 'Ra mắt 23/6/2026, tối đa 85 câu', 'https://www.comptia.org/en/certifications/cybersecurity-analyst/v4/')}
${nguon('📘', 'Microsoft Learn — Security Operations Analyst Associate (SC-200)', 'Sentinel, Defender XDR, KQL', 'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/')}
${nguon('📘', 'Splunk — Core Certified User', 'Trang lộ trình chứng chỉ', 'https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-user.html')}
${nguon('📘', 'Security Blue Team — Blue Team Level 1', 'Chứng chỉ thực hành SOC analyst', 'https://www.securityblue.team/certifications/blue-team-level-1')}
${nguon('🧪', 'GitHub — splunk/botsv3', 'Bộ dữ liệu Boss of the SOC v3', 'https://github.com/splunk/botsv3')}
${nguon('📰', 'NBC News — Target bỏ lỡ nhiều dấu hiệu cảnh báo (25/03/2014)', 'Tóm tắt báo cáo của uỷ ban Thượng viện Mỹ', 'https://www.nbcnews.com/business/consumer/target-missed-many-warning-signs-leading-breach-senate-report-n62021')}
${lienKet({ khoa: 'interview-prep', bai: 'pv-1-2-du-an-cv', title: 'Chuẩn bị phỏng vấn 1.2 — Viết dự án trong CV', sub: 'Vai trò, quyết định, sự cố, kết quả', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-13-2-chung-chi', title: 'Ứng phó sự cố 13.2 — Chứng chỉ liên quan tới ứng phó sự cố', sub: 'Cùng quyết định, nhìn từ phía ứng phó sự cố', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-13-1-chung-chi', title: 'Blue team & SIEM 13.1 — Chứng chỉ cho con đường SOC', sub: 'Security+, CySA+, BTL1 và xa hơn', cta: 'Mở bài' })}
</div>
`,
};
