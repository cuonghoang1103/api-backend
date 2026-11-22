/**
 * Bắt đầu tại đây (1/2) — Log là gì, ra đời thế nào, vì sao quan trọng (soạn 22/11/2026).
 * Output: ../_ma.mjs (OUT['s00/nem-thu']) — chạy thật trong Ubuntu 24.04 trên gói log mẫu (_demo/tao-goi-log.py).
 * Nguồn đã kiểm: Wikipedia Syslog (Allman/Sendmail 1980s, RFC 3164 08/2001, RFC 5424 03/2009), Wikipedia Event Viewer
 * (NT 1993, Vista đổi sang XML), 0pointer "Introducing the Journal" 18/11/2011, GAO-18-559 (Equifax: chứng chỉ hết hạn ~10 tháng,
 * 76 ngày, 29/07/2017, ~9.000 truy vấn đọc lại từ log), NBC News 25/03/2014 tóm báo cáo Thượng viện Mỹ về Target.
 */
import { ra, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Start here (1/2) — What logs are, where they came from, and why they matter to you|||Bắt đầu tại đây (1/2) — Log là gì, ra đời thế nào, và vì sao nó quan trọng với bạn',
  slug: 'log-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Log là gì bằng hình ảnh đời thường; lịch sử có nguồn từ syslog (thập niên 1980) tới Event Log của Windows NT (1993), RFC 3164/5424, journald (2011), OpenTelemetry; log khác metric và trace ra sao; hai vụ thật Target 2013 và Equifax 2017 qua tài liệu chính thức; và một phút đọc log mẫu tìm ra kẻ đoán mật khẩu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What logs are, where they came from, and why they matter to you</h2>
<p class="lead">Hi — welcome. If you have ever stared at a server that "just died", a web page that says <em>502 Bad Gateway</em>, or a laptop that rebooted itself in the night and thought "I have no idea what happened", this course is for you. The answer was almost always written down somewhere, seconds after it happened. That written record is a <strong>log</strong>. By the end of this first lesson you will know what a log is, where the idea came from, how it differs from metrics and traces, two real incidents where logs (or the lack of them) decided the outcome — and you will already have caught a password-guessing attack in a sample log with three commands.</p>

<h3>An everyday picture: three things you already know</h3>
<ul>
<li><strong>A flight's black box.</strong> Nobody reads it on a normal day. After something goes wrong it is the first thing investigators look for, because it recorded events <em>while</em> they happened, not from memory afterwards.</li>
<li><strong>The security guard's shift book</strong> at your dormitory: "22:15 — room 304 had a visitor, left at 23:40". Short lines, each with a time, who, what. A log line is exactly that.</li>
<li><strong>The building's CCTV.</strong> It records everything, so the hard part is not recording — it is finding the 20 seconds that matter in 24 hours of footage. Reading logs is the same skill: searching, filtering, lining things up by time.</li>
</ul>
<p>Technically: a <strong>log</strong> is an append-only, time-ordered record of events written by software — the operating system, a web server, a database, your own app. Each line (or record) usually says <em>when</em>, <em>where</em> (which machine, which program), <em>how serious</em>, and <em>what happened</em>. Chapter 1 takes one line apart field by field.</p>

<h3>Where logs came from — a short history with sources</h3>
<table>
<thead><tr><th>When</th><th>What happened</th><th>Why it matters today</th></tr></thead>
<tbody>
<tr><td>1980s</td><td><strong>syslog</strong> was written by Eric Allman as part of the Sendmail mail server project; other Unix programs started sending their messages to the same daemon.</td><td>The idea "every program sends its messages to one logging service, with a facility and a severity" is still how Linux, routers and firewalls work.</td></tr>
<tr><td>1993</td><td>Windows NT shipped with <strong>event logs</strong> (System, Application, Security) and the Event Viewer.</td><td>The Security log is where Windows records logons — Chapters 3–5 live here.</td></tr>
<tr><td>08/2001</td><td><strong>RFC 3164</strong> documented the existing "BSD syslog" format — it described practice rather than inventing a standard.</td><td>The <code>Nov 20 02:10:03 host sshd[41001]: …</code> lines you still see in <code>/var/log/auth.log</code>.</td></tr>
<tr><td>2007</td><td>Windows Vista rewrote the event system around a structured XML format (the <code>.evtx</code> files).</td><td>Why you can filter Windows events precisely with XPath and PowerShell (Chapter 5).</td></tr>
<tr><td>03/2009</td><td><strong>RFC 5424</strong> standardised syslog: full date with year and time zone, structured data.</td><td>Fixes the "which year? which time zone?" problem of the old format (lesson 1.5).</td></tr>
<tr><td>11/2011</td><td>Lennart Poettering introduced <strong>the journal</strong> for systemd (journald): binary, indexed, key=value fields.</td><td><code>journalctl</code> on every modern Linux server (Chapter 7).</td></tr>
<tr><td>2010s</td><td>Centralised log platforms (the ELK stack, later Grafana Loki) and cloud logging became normal.</td><td>At work you rarely <code>ssh</code> into ten servers; you search one central place (Chapter 15).</td></tr>
<tr><td>2020s</td><td><strong>OpenTelemetry</strong> defined one data model for logs, alongside metrics and traces.</td><td>Logs carry a trace id so you can jump from one failed request to every service it touched.</td></tr>
</tbody></table>
<p>Notice the direction: from free text that only a human can read, towards <strong>structured</strong> records a machine can filter. You will meet every stage of that history in real systems — old routers still speak RFC 3164, your Node app speaks JSON.</p>

<h3>Log, metric, trace: three different questions</h3>
<p>Monitoring people talk about "three pillars". You only need to know which question each one answers, so you open the right tool:</p>
<table>
<thead><tr><th></th><th>Answers</th><th>Looks like</th><th>Everyday picture</th></tr></thead>
<tbody>
<tr><td><strong>Metric</strong></td><td>"How much / how many, over time?" — CPU 95%, 40 errors per minute</td><td>A number sampled every few seconds</td><td>The electricity meter: tells you <em>that</em> usage spiked</td></tr>
<tr><td><strong>Log</strong></td><td>"What exactly happened, and to whom?"</td><td>One record per event, with details</td><td>The guard's shift book: tells you <em>what</em> happened</td></tr>
<tr><td><strong>Trace</strong></td><td>"Where did this one request spend its time across services?"</td><td>A tree of timed spans</td><td>A parcel tracking page: every hop of one parcel</td></tr>
</tbody></table>
<p>Typical rhythm at work: a <em>metric</em> alert wakes you up ("error rate 12%"), a <em>log</em> tells you why ("connect ECONNREFUSED 10.0.0.20:5432"), a <em>trace</em> shows which service was slow. This course is about the middle one — reading and investigating logs — on every source you will meet. Building dashboards and SLOs is taught in the observability course.</p>
<div class="callout warn"><p><strong>An audit trail is a special kind of log.</strong> "Who changed this salary, when, from which account" must be complete and tamper-evident, and is often required by law or by a customer contract. You will meet it in Windows Security events (Chapter 4), <code>auditd</code> (Chapter 8) and database auditing (Chapter 12).</p></div>

<h3>Two real incidents — logs decided the story</h3>
<p><strong>Target, 2013.</strong> In late 2013 attackers stole payment card data from the US retailer Target. A US Senate committee staff report released on 25 March 2014 concluded that Target "failed to respond to multiple automated warnings from the company's anti-intrusion software", and that other ignored warnings even showed how the data would be carried out of the network. It also found the attackers got in through a third-party vendor's access. The lesson for us: <em>the evidence existed</em>. Logs and alerts are useless if nobody reads them, or if there are so many that the important one drowns.</p>
<p><strong>Equifax, 2017.</strong> The US GAO report on the Equifax breach (GAO-18-559, August 2018) describes attackers who used an unpatched web application flaw, then stole personal data for about <strong>76 days</strong> before being discovered. Equifax had a device to inspect network traffic, but its digital certificate had <strong>expired about 10 months before the breach</strong>, so encrypted traffic passed without inspection. On 29 July 2017 an administrator renewed the certificate, inspection resumed, and the intrusion became visible almost immediately. Afterwards, investigators "reviewing system log files that recorded the attackers' actions" reconstructed that the attackers ran about 9,000 queries. Two lessons in one story: a monitoring source that silently stops working is worse than none (you think you are watching), and good logs are what let you say afterwards exactly what was taken.</p>
<div class="pitfall co-tieu-de"><p><strong>Not "more logs" — logs someone can actually use.</strong> Both stories are about people and process as much as technology. Throughout this course every lab ends with a question a real person would ask ("did that login succeed?"), not with "run command X".</p></div>

<h3>Your first minute of log reading</h3>
<p>You will set up the sample log pack in lesson 0.1. Here is a preview so you see where this is going: 24 hours of a web server's access log, about 4,000 lines. Three commands answer "is someone guessing passwords, and did they get in?":</p>
${ra('s00/nem-thu')}
<p>Read it slowly. Line 1: 420 requests ended with HTTP 401 (wrong credentials). Line 2: <em>all 420</em> came from one address, <code>203.0.113.66</code>. Line 3: the requests from that address that were <em>not</em> 401 — a <strong>200 on the login endpoint at 02:41:07</strong>, then a call to <code>/api/v1/me</code> two seconds later. In plain words: someone tried hundreds of passwords at 2 a.m., one worked, and they immediately looked at the account. That is a real incident pattern (Chapter 14), found in under a minute. Do not worry about the syntax yet — Chapter 2 explains every piece.</p>

<h3>Why this matters for you specifically</h3>
<ul>
<li><strong>Your group project (SWP391, capstone):</strong> "it works on my machine but the demo server returns 500" is answered by the server's log, not by guessing. You will be the teammate who finds the cause.</li>
<li><strong>Internship and first job:</strong> on-call, support tickets and "the customer says they could not log in yesterday at 9" all start with logs.</li>
<li><strong>Interviews:</strong> backend, DevOps and SOC interviews regularly ask "a service is slow / down — what do you check first?" Chapter 17 collects those questions.</li>
<li><strong>Your own computers:</strong> why the laptop restarted, who logged in, which program crashed — Windows and macOS keep those answers too.</li>
</ul>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
<li>On Windows: press <code>Win + R</code>, type <code>eventvwr.msc</code>, Enter. Open <em>Windows Logs → System</em>. Just scroll — notice every row has a Level, a Date and Time, a Source and an Event ID.</li>
<li>On macOS: open the <em>Console</em> app and click <em>Start streaming</em> for 10 seconds, then stop. On Linux/WSL: run <code>journalctl -n 20</code> (or <code>sudo journalctl -n 20</code>).</li>
<li>Pick any one line and write in your notebook: when? which program? how serious? what happened? Leave blanks if you cannot tell — that is fine for now.</li>
</ol>
<p><strong>Done when:</strong> you have opened the log viewer of your own operating system and written down the four parts of one real line.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['log', 'A time-ordered, append-only record of events written by software.'],
  ['event', 'One thing that happened (a logon, a crash, a request) — one log record.'],
  ['syslog', 'The classic Unix logging service and its message format (RFC 3164, RFC 5424).'],
  ['journald / journalctl', 'The systemd logging service on modern Linux, and the command to read it.'],
  ['Event Viewer', 'The Windows tool to read event logs (System, Application, Security…).'],
  ['metric / trace', 'A number over time / the path of one request through services.'],
  ['audit trail', 'A complete record of who did what, required to be trustworthy.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A log is what software writes down while events happen — the black box of your systems.</li>
<li>History runs from syslog (1980s) and Windows NT event logs (1993) to RFC 5424 (2009), journald (2011) and OpenTelemetry: from free text towards structured records.</li>
<li>Metrics say <em>that</em> something is wrong, logs say <em>what</em> happened, traces say <em>where</em> a request spent its time.</li>
<li>Target 2013: alerts existed and were not acted on. Equifax 2017: a monitoring device was silently blind for months; logs later showed what was taken.</li>
<li>Three commands on a sample log already revealed a password-guessing attack that succeeded at 02:41.</li>
</ul>
${nguon('📗', 'Wikipedia — Syslog', 'Origin (Eric Allman, Sendmail, 1980s), RFC 3164 (2001) and RFC 5424 (2009)', 'https://en.wikipedia.org/wiki/Syslog')}
${nguon('📘', 'RFC 5424 — The Syslog Protocol', 'The current syslog standard: header, structured data, severity', 'https://www.rfc-editor.org/rfc/rfc5424')}
${nguon('📗', 'Lennart Poettering — Introducing the Journal (18/11/2011)', 'The announcement of systemd-journald', 'https://0pointer.de/blog/projects/the-journal.html')}
${nguon('📊', 'GAO-18-559 — Equifax data breach (PDF)', 'Expired certificate, 76 days undetected, reconstruction from system logs', 'https://www.gao.gov/assets/gao-18-559.pdf')}
${nguon('📰', 'NBC News — Target missed many warning signs (25/03/2014)', 'Summary of the US Senate committee staff report on the Target breach', 'https://www.nbcnews.com/business/consumer/target-missed-many-warning-signs-leading-breach-senate-report-n62021')}
${nguon('📘', 'OpenTelemetry — Logs data model', 'How modern systems describe a log record next to metrics and traces', 'https://opentelemetry.io/docs/specs/otel/logs/data-model/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-2-ba-tru-cot', title: 'Observability — the three pillars', sub: 'Metrics, logs and traces in depth, from the side of building monitoring', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Log là gì, ra đời thế nào, và vì sao nó quan trọng với bạn</h2>
<p class="lead">Chào bạn. Nếu bạn từng nhìn một server "tự nhiên chết", một trang web báo <em>502 Bad Gateway</em>, hay một chiếc laptop tự khởi động lại lúc nửa đêm mà nghĩ "chẳng biết chuyện gì đã xảy ra" — khoá này dành cho bạn. Câu trả lời gần như luôn đã được ghi lại ở đâu đó, chỉ vài giây sau khi sự việc xảy ra. Bản ghi ấy là <strong>log (nhật ký)</strong>. Hết bài đầu tiên này bạn sẽ biết log là gì, ý tưởng ấy từ đâu ra, log khác metric và trace thế nào, hai sự cố thật mà log (hoặc việc không đọc log) quyết định kết cục — và bạn sẽ tự bắt được một vụ dò mật khẩu trong log mẫu chỉ bằng ba lệnh.</p>

<h3>Liên tưởng đời thường: ba thứ bạn đã biết</h3>
<ul>
<li><strong>Hộp đen máy bay.</strong> Ngày bình thường chẳng ai mở. Khi có chuyện, đó là thứ đầu tiên người ta đi tìm, vì nó ghi lại sự kiện <em>trong lúc</em> chúng xảy ra, không phải nhớ lại sau.</li>
<li><strong>Sổ giao ca của bác bảo vệ</strong> ký túc xá: "22:15 — phòng 304 có khách, 23:40 khách về". Từng dòng ngắn, mỗi dòng có giờ, ai, làm gì. Một dòng log đúng là như thế.</li>
<li><strong>Camera của toà nhà.</strong> Nó ghi tất cả, nên cái khó không phải là ghi — mà là tìm ra 20 giây quan trọng trong 24 giờ băng hình. Đọc log cũng là kỹ năng đó: tìm, lọc, xếp mọi thứ theo thời gian.</li>
</ul>
<p>Nói cho chính xác: <strong>log</strong> là bản ghi sự kiện theo thứ tự thời gian, chỉ ghi thêm vào cuối (append-only — không sửa dòng cũ), do phần mềm viết ra — hệ điều hành, web server, cơ sở dữ liệu, chính app của bạn. Mỗi dòng (hay mỗi bản ghi) thường cho biết <em>lúc nào</em>, <em>ở đâu</em> (máy nào, chương trình nào), <em>nghiêm trọng tới đâu</em>, và <em>chuyện gì xảy ra</em>. Chương 1 sẽ mổ một dòng log ra từng trường.</p>

<h3>Log ra đời thế nào — lịch sử ngắn, có nguồn</h3>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì</th><th>Vì sao hôm nay còn quan trọng</th></tr></thead>
<tbody>
<tr><td>Thập niên 1980</td><td><strong>syslog</strong> do Eric Allman viết trong dự án máy chủ thư Sendmail; các chương trình Unix khác dần gửi thông điệp của mình về cùng dịch vụ đó.</td><td>Ý tưởng "mọi chương trình gửi thông điệp về MỘT dịch vụ ghi log, kèm nhóm nguồn (facility) và mức độ (severity)" vẫn là cách Linux, router, tường lửa làm việc.</td></tr>
<tr><td>1993</td><td>Windows NT ra đời đã có <strong>event log</strong> (System, Application, Security) và Event Viewer.</td><td>Nhật ký Security là nơi Windows ghi các lần đăng nhập — Chương 3–5 sống ở đây.</td></tr>
<tr><td>08/2001</td><td><strong>RFC 3164</strong> ghi lại định dạng "BSD syslog" đang dùng — mô tả thực tế chứ không đặt ra chuẩn mới.</td><td>Chính là những dòng <code>Nov 20 02:10:03 host sshd[41001]: …</code> bạn vẫn thấy trong <code>/var/log/auth.log</code>.</td></tr>
<tr><td>2007</td><td>Windows Vista viết lại hệ thống sự kiện quanh định dạng XML có cấu trúc (tệp <code>.evtx</code>).</td><td>Vì thế lọc sự kiện Windows chính xác được bằng XPath và PowerShell (Chương 5).</td></tr>
<tr><td>03/2009</td><td><strong>RFC 5424</strong> chuẩn hoá syslog: ngày đầy đủ có năm và múi giờ, có dữ liệu cấu trúc.</td><td>Vá chuyện "năm nào? múi giờ nào?" của định dạng cũ (bài 1.5).</td></tr>
<tr><td>11/2011</td><td>Lennart Poettering giới thiệu <strong>journal</strong> của systemd (journald): nhị phân, có chỉ mục, trường dạng khoá=giá trị.</td><td>Lệnh <code>journalctl</code> trên mọi server Linux đời mới (Chương 7).</td></tr>
<tr><td>Thập niên 2010</td><td>Nền tảng gom log tập trung (bộ ELK, sau này Grafana Loki) và log trên cloud thành chuyện thường.</td><td>Đi làm hiếm khi phải <code>ssh</code> vào mười server; bạn tìm ở một chỗ chung (Chương 15).</td></tr>
<tr><td>Thập niên 2020</td><td><strong>OpenTelemetry</strong> đưa ra một mô hình dữ liệu chung cho log, đặt cạnh metric và trace.</td><td>Log mang theo trace id, nên từ một request lỗi bạn nhảy được tới mọi dịch vụ nó đi qua.</td></tr>
</tbody></table>
<p>Để ý chiều đi: từ chữ tự do mà chỉ người đọc được, tiến dần tới bản ghi <strong>có cấu trúc</strong> mà máy lọc được. Bạn sẽ gặp đủ mọi giai đoạn của lịch sử ấy trong hệ thống thật — router cũ vẫn nói RFC 3164, app Node của bạn nói JSON.</p>

<h3>Log, metric, trace: ba câu hỏi khác nhau</h3>
<p>Dân giám sát hệ thống hay nói "ba trụ cột". Bạn chỉ cần biết mỗi thứ trả lời câu hỏi nào, để mở đúng công cụ:</p>
<table>
<thead><tr><th></th><th>Trả lời</th><th>Trông như</th><th>Liên tưởng</th></tr></thead>
<tbody>
<tr><td><strong>Metric (số đo)</strong></td><td>"Bao nhiêu, theo thời gian?" — CPU 95%, 40 lỗi mỗi phút</td><td>Một con số lấy mẫu mỗi vài giây</td><td>Đồng hồ điện: cho biết <em>có</em> lúc dùng vọt lên</td></tr>
<tr><td><strong>Log (nhật ký)</strong></td><td>"Chính xác chuyện gì, với ai?"</td><td>Mỗi sự kiện một bản ghi, có chi tiết</td><td>Sổ giao ca: cho biết <em>chuyện gì</em> đã xảy ra</td></tr>
<tr><td><strong>Trace (vết request)</strong></td><td>"Request này tốn thời gian ở đâu, qua những dịch vụ nào?"</td><td>Cây các đoạn (span) có đo giờ</td><td>Trang tra cứu vận đơn: từng chặng của MỘT kiện hàng</td></tr>
</tbody></table>
<p>Nhịp thường gặp khi đi làm: một <em>metric</em> báo động đánh thức bạn ("tỉ lệ lỗi 12%"), <em>log</em> cho biết vì sao ("connect ECONNREFUSED 10.0.0.20:5432"), <em>trace</em> chỉ ra dịch vụ nào chậm. Khoá này dạy cái ở giữa — đọc và điều tra log — trên mọi nguồn bạn sẽ gặp. Dựng dashboard, SLO thì đã có khoá observability dạy.</p>
<div class="callout warn"><p><strong>Nhật ký kiểm toán (audit trail) là một loại log đặc biệt.</strong> "Ai đổi mức lương này, lúc nào, bằng tài khoản nào" phải đầy đủ và khó sửa lén, nhiều khi luật hoặc hợp đồng với khách bắt buộc phải có. Bạn sẽ gặp nó ở sự kiện Security của Windows (Chương 4), <code>auditd</code> (Chương 8) và kiểm toán CSDL (Chương 12).</p></div>

<h3>Hai sự cố thật — log quyết định câu chuyện</h3>
<p><strong>Target, 2013.</strong> Cuối năm 2013, kẻ tấn công lấy cắp dữ liệu thẻ thanh toán của chuỗi bán lẻ Mỹ Target. Báo cáo của ban nhân viên một uỷ ban Thượng viện Mỹ, công bố ngày 25/03/2014, kết luận Target đã "không phản ứng trước nhiều cảnh báo tự động từ phần mềm chống xâm nhập của chính công ty", và những cảnh báo khác bị bỏ qua thậm chí còn cho thấy dữ liệu sẽ được mang ra khỏi mạng bằng cách nào. Báo cáo cũng nói kẻ tấn công vào được qua quyền truy cập của một nhà cung cấp bên thứ ba. Bài học cho chúng ta: <em>bằng chứng đã có sẵn</em>. Log và cảnh báo vô dụng nếu không ai đọc, hoặc nếu nhiều tới mức cái quan trọng bị chìm.</p>
<p><strong>Equifax, 2017.</strong> Báo cáo của GAO (cơ quan kiểm toán Quốc hội Mỹ) về vụ Equifax (GAO-18-559, tháng 8/2018) mô tả kẻ tấn công lợi dụng một lỗ hổng ứng dụng web chưa vá, rồi lấy dữ liệu cá nhân trong khoảng <strong>76 ngày</strong> mới bị phát hiện. Equifax có một thiết bị soi lưu lượng mạng, nhưng chứng chỉ số của nó đã <strong>hết hạn khoảng 10 tháng trước vụ xâm nhập</strong>, nên lưu lượng mã hoá đi qua mà không bị soi. Ngày 29/07/2017, một quản trị viên thay chứng chỉ, thiết bị soi lại, và dấu hiệu xâm nhập lộ ra gần như ngay lập tức. Sau đó, nhờ "xem lại các tệp log hệ thống đã ghi hành động của kẻ tấn công", người điều tra dựng lại được rằng chúng đã chạy khoảng 9.000 câu truy vấn. Hai bài học trong một chuyện: một nguồn giám sát âm thầm ngừng hoạt động còn tệ hơn không có (vì bạn tưởng mình đang canh), và log tốt là thứ cho phép nói chính xác sau đó cái gì đã bị lấy.</p>
<div class="pitfall co-tieu-de"><p><strong>Không phải "thêm log" — mà là log có người dùng được.</strong> Cả hai chuyện đều là chuyện con người và quy trình không kém gì công nghệ. Suốt khoá này, mỗi lab đều kết thúc bằng một câu hỏi người thật sẽ hỏi ("lần đăng nhập đó có thành công không?"), không phải "hãy chạy lệnh X".</p></div>

<h3>Phút đọc log đầu tiên của bạn</h3>
<p>Bạn sẽ dựng gói log mẫu ở bài 0.1. Đây là phần xem trước để thấy khoá sẽ đi tới đâu: 24 giờ access log (nhật ký truy cập) của một web server, khoảng 4.000 dòng. Ba lệnh trả lời câu "có ai đang đoán mật khẩu không, và họ có vào được không?":</p>
${ra('s00/nem-thu')}
<p>Đọc chậm thôi. Dòng 1: 420 request kết thúc bằng mã HTTP 401 (sai thông tin đăng nhập). Dòng 2: <em>cả 420</em> đều từ một địa chỉ, <code>203.0.113.66</code>. Dòng 3: những request của địa chỉ đó mà <em>không phải</em> 401 — một <strong>mã 200 ở trang đăng nhập lúc 02:41:07</strong>, rồi hai giây sau là một lời gọi <code>/api/v1/me</code>. Nói bằng lời thường: ai đó thử hàng trăm mật khẩu lúc 2 giờ sáng, một cái đúng, và họ lập tức xem thông tin tài khoản. Đó là một mẫu sự cố thật (Chương 14), tìm ra trong chưa tới một phút. Chưa cần hiểu cú pháp — Chương 2 giải thích từng mảnh.</p>

<h3>Vì sao chuyện này quan trọng với chính bạn</h3>
<ul>
<li><strong>Đồ án nhóm (SWP391, đồ án tốt nghiệp):</strong> "máy em chạy được mà server demo trả 500" được trả lời bằng log của server, không phải bằng đoán. Bạn sẽ là người trong nhóm tìm ra nguyên nhân.</li>
<li><strong>Thực tập và công việc đầu tiên:</strong> trực sự cố, xử lý ticket hỗ trợ, "khách nói hôm qua 9 giờ không đăng nhập được" — tất cả bắt đầu từ log.</li>
<li><strong>Phỏng vấn:</strong> phỏng vấn backend, DevOps, SOC (trung tâm giám sát an ninh) hay hỏi "một dịch vụ chậm / chết — bạn kiểm gì đầu tiên?". Chương 17 gom các câu đó.</li>
<li><strong>Máy của chính bạn:</strong> vì sao laptop tự khởi động lại, ai đã đăng nhập, chương trình nào bị sập — Windows và macOS cũng giữ những câu trả lời ấy.</li>
</ul>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Trên Windows: bấm <code>Win + R</code>, gõ <code>eventvwr.msc</code>, Enter. Mở <em>Windows Logs → System</em>. Chỉ cần cuộn xem — để ý mỗi hàng đều có Level (mức), Date and Time (giờ), Source (nguồn) và Event ID (mã sự kiện).</li>
<li>Trên macOS: mở ứng dụng <em>Console</em>, bấm <em>Start streaming</em> chừng 10 giây rồi dừng. Trên Linux/WSL: chạy <code>journalctl -n 20</code> (hoặc <code>sudo journalctl -n 20</code>).</li>
<li>Chọn một dòng bất kỳ và ghi vào sổ: lúc nào? chương trình nào? nghiêm trọng tới đâu? chuyện gì xảy ra? Chỗ nào chưa đọc ra thì để trống — lúc này như vậy là bình thường.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã mở được trình xem log của chính hệ điều hành mình và ghi được bốn phần của một dòng log thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['log (nhật ký)', 'Bản ghi sự kiện theo thứ tự thời gian, chỉ ghi thêm, do phần mềm viết ra.'],
  ['event (sự kiện)', 'Một việc đã xảy ra (đăng nhập, sập, một request) — tương ứng một bản ghi log.'],
  ['syslog', 'Dịch vụ ghi log kinh điển của Unix và định dạng thông điệp của nó (RFC 3164, RFC 5424).'],
  ['journald / journalctl', 'Dịch vụ ghi log của systemd trên Linux đời mới, và lệnh để đọc nó.'],
  ['Event Viewer (trình xem sự kiện)', 'Công cụ của Windows để đọc các nhật ký System, Application, Security…'],
  ['metric / trace (số đo / vết request)', 'Một con số theo thời gian / đường đi của một request qua các dịch vụ.'],
  ['audit trail (nhật ký kiểm toán)', 'Bản ghi đầy đủ ai làm gì, phải đáng tin và khó sửa lén.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log là thứ phần mềm ghi lại trong lúc sự việc xảy ra — hộp đen của hệ thống.</li>
<li>Lịch sử đi từ syslog (thập niên 1980) và event log của Windows NT (1993) tới RFC 5424 (2009), journald (2011) và OpenTelemetry: từ chữ tự do tới bản ghi có cấu trúc.</li>
<li>Metric nói <em>có</em> chuyện, log nói <em>chuyện gì</em>, trace nói request tốn thời gian <em>ở đâu</em>.</li>
<li>Target 2013: cảnh báo đã có mà không ai hành động. Equifax 2017: thiết bị giám sát âm thầm "mù" nhiều tháng; log về sau cho biết cái gì đã bị lấy.</li>
<li>Ba lệnh trên log mẫu đã lộ ra một vụ đoán mật khẩu thành công lúc 02:41.</li>
</ul>
${nguon('📗', 'Wikipedia — Syslog', 'Nguồn gốc (Eric Allman, Sendmail, thập niên 1980), RFC 3164 (2001), RFC 5424 (2009)', 'https://en.wikipedia.org/wiki/Syslog')}
${nguon('📘', 'RFC 5424 — The Syslog Protocol', 'Chuẩn syslog hiện hành: phần đầu, dữ liệu cấu trúc, mức độ', 'https://www.rfc-editor.org/rfc/rfc5424')}
${nguon('📗', 'Lennart Poettering — Introducing the Journal (18/11/2011)', 'Bài giới thiệu systemd-journald', 'https://0pointer.de/blog/projects/the-journal.html')}
${nguon('📊', 'GAO-18-559 — vụ rò rỉ dữ liệu Equifax (PDF)', 'Chứng chỉ hết hạn, 76 ngày không bị phát hiện, dựng lại từ log hệ thống', 'https://www.gao.gov/assets/gao-18-559.pdf')}
${nguon('📰', 'NBC News — Target bỏ lỡ nhiều dấu hiệu cảnh báo (25/03/2014)', 'Tóm tắt báo cáo của uỷ ban Thượng viện Mỹ về vụ Target', 'https://www.nbcnews.com/business/consumer/target-missed-many-warning-signs-leading-breach-senate-report-n62021')}
${nguon('📘', 'OpenTelemetry — Logs data model', 'Cách hệ thống đời mới mô tả một bản ghi log cạnh metric và trace', 'https://opentelemetry.io/docs/specs/otel/logs/data-model/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-2-ba-tru-cot', title: 'Observability — ba trụ cột', sub: 'Metric, log, trace chuyên sâu, từ phía người dựng hệ thống giám sát' })}
</div>
`,
};
