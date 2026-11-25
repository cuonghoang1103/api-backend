/**
 * 3.2 — Đọc một sự kiện (soạn 24/11/2026, agent lgz). Output thật: OUT['s03/doc-su-kien'] — bộ EVTX mẫu công khai (xem 3.1), đọc bằng evtx-xml/evtx-rec.
 * Số tất định: 1074 rec 258 (máy 37L4247D28-05, param2 WIN-QALA5Q3KJ43); 4624 rec 1288 (Logon Type 7, fsir); Event ID 1 của 3 provider (208 Kernel-General);
 * Event ID 1000 của 4 provider (121 LoadPerf, 1 Application Error); Keywords 2744 × 0x8020…, 130 × 0x8010…, 37 × 0x4020…; 429 × 4624 / 130 × 4625.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.2 — Reading one event: Level, Provider, Event ID, Task Category, Keywords, User, Computer, and the XML details|||3.2 — Đọc một sự kiện: Level, Provider, Event ID, Task Category, Keywords, User, Computer và chi tiết XML',
  slug: 'log-3-2-doc-su-kien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tab General và Details (Friendly/XML) của một sự kiện; phần System (Provider, EventID, Level, Task, Keywords, TimeCreated UTC, EventRecordID, Execution, Channel, Computer, Security UserID) và EventData; vì sao tệp .evtx không chứa câu Message; Event ID trùng số giữa các provider; Keywords Audit Success/Failure. Mổ thật sự kiện 1074, 4624 và Sysmon 1.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>One event, field by field</h2>
<p class="lead">Double-click any line in Event Viewer and a window opens with two tabs: <strong>General</strong> (a readable sentence plus a grid of fields) and <strong>Details</strong> (Friendly View or XML View). Everything you will ever filter on, search for or send to a SIEM is in that XML. This lesson takes three real events apart — a restart (1074), a logon (4624) and a Sysmon process creation — so you know what each field means and which ones to trust.</p>

<h3>The everyday picture: a delivery slip</h3>
<p>A courier slip has a fixed header (company, form number, date, slip number, branch) and a body with the details of this parcel. An event is the same: <strong>System</strong> is the header, identical for every event of every provider; <strong>EventData</strong> is the body, different for each event type. The friendly sentence on the General tab is like the printed text on the slip — "Parcel from %1 to %2" — filled in with the body's values.</p>

<h3>Event 1 — who restarted this PC (System, USER32 1074)</h3>
${lenh('s03/doc-su-kien', 0)}
<p>The header (<code>&lt;System&gt;</code>):</p>
<ul>
<li><code>Provider Name="USER32"</code> — the Source column. Classic providers have only a name; modern (manifest) providers also have a <code>Guid</code>.</li>
<li><code>EventID Qualifiers="32768"</code> — the number you look up. <em>Qualifiers</em> appear on classic events; ignore them when searching.</li>
<li><code>Level</code> 4 = Information (1 Critical, 2 Error, 3 Warning, 4 Information, 5 Verbose; 0 = "log always", used by Security).</li>
<li><code>Task</code> = Event Viewer's "Task Category" (0 = None). <code>Keywords</code> — bit flags, see below.</li>
<li><code>TimeCreated SystemTime</code> — <strong>always UTC</strong> (the trailing Z). Event Viewer shows it in <em>your PC's</em> local time; a colleague in another timezone sees a different clock for the same event (Lesson 1.5).</li>
<li><code>EventRecordID</code> — the sequence number inside this log file. Gaps or numbers going backwards are a clue (Lab 3).</li>
<li><code>Channel</code> (the log), <code>Computer</code> (the machine name <em>when the event was written</em>), <code>Security UserID</code> (the SID the provider ran as; S-1-5-18 = SYSTEM).</li>
</ul>
${lenh('s03/doc-su-kien', 1)}
<p>The body is seven unnamed <code>&lt;Data&gt;</code> values. On a Windows PC, Event Viewer turns them into this sentence using USER32's message template: <em>"The process <strong>%1</strong> has initiated the <strong>%5</strong> of computer <strong>%2</strong> on behalf of user <strong>%7</strong> for the following reason: <strong>%3</strong> … Reason Code: %4 … Comment: %6"</em>. So: winlogon.exe restarted the computer for NT AUTHORITY\\SYSTEM, reason "Operating System: Upgrade (Planned)". Note <code>%2 = WIN-QALA5Q3KJ43</code> while <code>Computer = 37L4247D28-05</code>: the PC was renamed during that upgrade — the header and the body disagree, and both are true.</p>
<div class="pitfall co-tieu-de"><p><strong>The .evtx file does not contain the sentence.</strong> Only the template number and the values are stored; the readable text is built on the machine that <em>displays</em> it, from the provider's message DLL. Open an exported .evtx on a PC without that software (or on Linux, as here) and you get "The description for Event ID … cannot be found" — the data is still all there in Details. That is also why you should export with <em>Display information</em> or send the XML when you ask a vendor for help.</p></div>

<h3>Event 2 — a logon (Security 4624)</h3>
${lenh('s03/doc-su-kien', 2)}
<p>A modern provider: <code>Microsoft-Windows-Security-Auditing</code> with a GUID, <code>Task 12544</code> (= Task Category "Logon"), <code>Execution ProcessID</code> (here 504, the lsass.exe that wrote it), and named data fields — <code>TargetUserName</code> fsir, <code>LogonType</code> 7 (unlock the screen), <code>IpAddress</code> 127.0.0.1. Named fields are what you filter on (<code>Data[@Name='LogonType']='10'</code>, Lesson 5.3). Chapter 4 reads every field of 4624.</p>

<h3>Same number, different meaning: always read Event ID with its provider</h3>
${lenh('s03/doc-su-kien', 3)}
${lenh('s03/doc-su-kien', 4)}
<p>Event ID 1 in one System log comes from three providers: Kernel-General (the system time changed), Power-Troubleshooter (the system woke from sleep) and Lfsvc (geolocation). Event ID 1000 in Application is "Application Error" (a crash!) only once — 121 times it is LoadPerf (performance counters loaded) and 13 times VMware Tools. A blog that says "Event 1000 = crash" is right only when the Source is <em>Application Error</em>. Look IDs up on <strong>Microsoft Learn</strong> by provider + ID; avoid "event ID encyclopedia" sites that mix providers.</p>

<h3>Keywords: Audit Success and Audit Failure</h3>
${lenh('s03/doc-su-kien', 5)}
${lenh('s03/doc-su-kien', 6)}
<p>Keywords is a 64-bit mask; the top 16 bits are reserved by Microsoft (<em>winmeta</em>). In the Security log the readable meaning is in the third hex digit: <code>0x80<strong>2</strong>0…</code> = <strong>Audit Success</strong>, <code>0x80<strong>1</strong>0…</code> = <strong>Audit Failure</strong>. All 429 × 4624 are success and all 130 × 4625 are failure — that is exactly the "Keywords" column Event Viewer shows with a key or a padlock icon. Classic events like 1074 carry <code>0x80000000000000</code> (the "classic" bit).</p>

<h3>Event 3 — Sysmon process creation: everything in EventData</h3>
${lenh('s03/doc-su-kien', 7)}
<p>Sysmon (Lesson 5.6) puts almost everything in named Data: <code>UtcTime</code>, <code>ProcessGuid</code>, image, command line, hashes, parent. <code>Version 5</code> in the header matters: a newer Sysmon version may add fields, so a parser must read by <em>name</em>, not by position.</p>

<h3>Activity ID and correlation</h3>
<p>The empty <code>&lt;Correlation/&gt;</code> element can hold an <code>ActivityID</code>: modern components stamp the same GUID on every event of one operation (one logon, one Windows Update run), so you can pull a whole story with one filter. It plays the same role as the correlation/trace id of Lesson 10.7.</p>

<h3>🛡️ Attacker's corner: fields lie less than sentences</h3>
<p>An attacker can name a malicious service "Windows Update Helper"; the sentence looks harmless. The fields don't care: <code>ImagePath</code> in C:\\Users\\Public, account LocalSystem, provider Service Control Manager 7045. Defenders filter on fields, never on friendly text — which also changes with the display language of the PC.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What is in the System part of an event?" — provider, ID, level, task, keywords, time (UTC), record id, process/thread, channel, computer, user SID.</li>
<li>"Why do I see 'description cannot be found'?" — message templates live on the source machine; the data is still in Details/XML.</li>
<li>"Is Event ID 1000 always a crash?" — only with Source Application Error; IDs are per provider.</li>
<li>"How do you tell a failed logon from a successful one without reading the text?" — ID 4625 vs 4624, and Keywords Audit Failure vs Audit Success.</li>
</ul>

<h3>At work</h3>
<p>When you paste an event into a ticket or a chat with a customer's IT team, paste the <strong>XML</strong> (Details › XML View › copy), not a screenshot of the General tab: the XML has the UTC time, the record id, the exact field names, and it survives translation (a Japanese Windows shows the sentence in Japanese, the XML is the same).</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>On your Windows PC, open any 7036 in System, switch to Details › XML View. Which <code>Data Name</code> fields does it have and what are their values?</li>
<li>In the sample <code>security.evtx</code>, open event record 1288: what are TargetUserName, LogonType and the process that wrote it?</li>
<li>Explain in one sentence why the same event shows 23:13 on your PC and 07:13 (next day) on a colleague's PC in Japan.</li>
</ol>
<p><strong>Pass:</strong> (1) <code>param1</code> = service display name, <code>param2</code> = state (running/stopped), plus a binary; (2) fsir, 7 (unlock), ProcessID 504 (lsass); (3) the file stores UTC (16/7/2016 22:13:49Z); each Event Viewer converts to its own timezone (UTC+1 vs UTC+9 in this example).</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['System / EventData', 'Fixed header of every event / event-specific body.'],
  ['Level', '1 Critical, 2 Error, 3 Warning, 4 Information, 5 Verbose, 0 LogAlways.'],
  ['Task Category', 'Sub-category inside a provider (Logon, Process Creation…).'],
  ['Keywords', '64-bit flags; Audit Success 0x0020…, Audit Failure 0x0010….'],
  ['EventRecordID', 'Sequence number of the event in this log file.'],
  ['Message template', 'Sentence with %1, %2… stored in the provider DLL, not in the .evtx.'],
  ['ActivityID', 'GUID that ties events of one operation together.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Header = who/what/when (UTC)/where; body = the details. Filter on fields.</li>
<li>The sentence is rendered at display time; the XML is the truth.</li>
<li>Event ID only means something together with the provider.</li>
<li>Keywords tell success vs failure in Security; record ids reveal gaps and resets.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Event schema elements', 'System, EventData, UserData, Correlation…', 'https://learn.microsoft.com/en-us/windows/win32/wes/eventschema-elements')}
${nguon('📘', 'Microsoft Learn — Defining keywords', 'Low 48 bits by the provider, top 16 bits by Microsoft (winmeta)', 'https://learn.microsoft.com/en-us/windows/win32/wes/defining-keywords-used-to-classify-types-of-events')}
${nguon('📘', 'Microsoft Learn — 4624(S): An account was successfully logged on', 'How an official event page looks: fields, logon types, recommendations', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Lesson 1.5 — Time, timezones and clock skew', sub: 'Why UTC in the file and local time on screen', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Một sự kiện, từng trường một</h2>
<p class="lead">Bấm đúp vào một dòng bất kỳ trong Event Viewer, một cửa sổ mở ra với hai tab: <strong>General</strong> (một câu dễ đọc và lưới các trường) và <strong>Details</strong> (Friendly View hoặc XML View). Mọi thứ bạn sẽ lọc, tìm hay gửi lên SIEM đều nằm trong XML đó. Bài này mổ ba sự kiện thật — một lần khởi động lại (1074), một lần đăng nhập (4624) và một lần Sysmon ghi tiến trình mới — để bạn biết từng trường nghĩa là gì và nên tin trường nào.</p>

<h3>Liên tưởng đời thường: tờ phiếu gửi hàng</h3>
<p>Phiếu chuyển phát có phần đầu cố định (hãng, số mẫu, ngày, số phiếu, chi nhánh) và phần thân ghi chi tiết của kiện hàng này. Sự kiện cũng vậy: <strong>System</strong> là phần đầu, giống nhau cho mọi sự kiện của mọi provider; <strong>EventData</strong> là phần thân, khác nhau theo từng loại sự kiện. Câu chữ dễ đọc ở tab General giống dòng in sẵn trên phiếu — "Kiện hàng từ %1 tới %2" — được điền bằng các giá trị ở phần thân.</p>

<h3>Sự kiện 1 — ai đã khởi động lại máy này (System, USER32 1074)</h3>
${lenh('s03/doc-su-kien', 0)}
<p>Phần đầu (<code>&lt;System&gt;</code>):</p>
<ul>
<li><code>Provider Name="USER32"</code> — cột Source. Provider kiểu cũ (classic) chỉ có tên; provider hiện đại (có manifest) có thêm <code>Guid</code>.</li>
<li><code>EventID Qualifiers="32768"</code> — con số bạn tra cứu. <em>Qualifiers</em> chỉ có ở sự kiện kiểu cũ; bỏ qua khi tìm.</li>
<li><code>Level</code> 4 = Information (1 Critical, 2 Error, 3 Warning, 4 Information, 5 Verbose; 0 = "luôn ghi", Security hay dùng).</li>
<li><code>Task</code> = "Task Category" trong Event Viewer (0 = None). <code>Keywords</code> — các bit cờ, xem bên dưới.</li>
<li><code>TimeCreated SystemTime</code> — <strong>luôn là UTC</strong> (chữ Z ở cuối). Event Viewer hiển thị theo giờ <em>máy bạn</em>; đồng nghiệp ở múi giờ khác thấy giờ khác cho cùng một sự kiện (Bài 1.5).</li>
<li><code>EventRecordID</code> — số thứ tự trong tệp log này. Bị hụt số hoặc số đi lùi là manh mối (Lab 3).</li>
<li><code>Channel</code> (log), <code>Computer</code> (tên máy <em>lúc ghi sự kiện</em>), <code>Security UserID</code> (SID mà provider chạy dưới quyền; S-1-5-18 = SYSTEM).</li>
</ul>
${lenh('s03/doc-su-kien', 1)}
<p>Phần thân là bảy giá trị <code>&lt;Data&gt;</code> không tên. Trên máy Windows, Event Viewer biến chúng thành câu nhờ mẫu thông điệp của USER32: <em>"The process <strong>%1</strong> has initiated the <strong>%5</strong> of computer <strong>%2</strong> on behalf of user <strong>%7</strong> for the following reason: <strong>%3</strong> … Reason Code: %4 … Comment: %6"</em>. Tức là: winlogon.exe khởi động lại máy thay mặt NT AUTHORITY\\SYSTEM, lý do "Operating System: Upgrade (Planned)". Để ý <code>%2 = WIN-QALA5Q3KJ43</code> trong khi <code>Computer = 37L4247D28-05</code>: máy được đổi tên trong lần nâng cấp đó — phần đầu và phần thân "cãi nhau", và cả hai đều đúng.</p>
<div class="pitfall co-tieu-de"><p><strong>Tệp .evtx không chứa câu chữ.</strong> Tệp chỉ lưu số hiệu mẫu và các giá trị; câu dễ đọc được dựng trên máy <em>hiển thị</em> nó, từ DLL thông điệp của provider. Mở một tệp .evtx đã xuất trên máy không có phần mềm đó (hoặc trên Linux như ở đây) bạn sẽ gặp "The description for Event ID … cannot be found" — dữ liệu vẫn đủ cả trong Details. Đó cũng là lý do khi nhờ hãng hỗ trợ, nên xuất kèm <em>Display information</em> hoặc gửi XML.</p></div>

<h3>Sự kiện 2 — một lần đăng nhập (Security 4624)</h3>
${lenh('s03/doc-su-kien', 2)}
<p>Một provider hiện đại: <code>Microsoft-Windows-Security-Auditing</code> có GUID, <code>Task 12544</code> (= Task Category "Logon"), <code>Execution ProcessID</code> (ở đây 504, tức lsass.exe đã ghi nó), và các trường dữ liệu có tên — <code>TargetUserName</code> fsir, <code>LogonType</code> 7 (mở khoá màn hình), <code>IpAddress</code> 127.0.0.1. Trường có tên là thứ bạn lọc (<code>Data[@Name='LogonType']='10'</code>, Bài 5.3). Chương 4 đọc hết mọi trường của 4624.</p>

<h3>Cùng con số, khác ý nghĩa: luôn đọc Event ID kèm provider</h3>
${lenh('s03/doc-su-kien', 3)}
${lenh('s03/doc-su-kien', 4)}
<p>Event ID 1 trong một log System đến từ ba provider: Kernel-General (giờ hệ thống bị đổi), Power-Troubleshooter (máy thức dậy từ chế độ ngủ) và Lfsvc (định vị). Event ID 1000 trong Application chỉ đúng một lần là "Application Error" (crash!) — 121 lần là LoadPerf (nạp bộ đếm hiệu năng) và 13 lần là VMware Tools. Bài blog nào nói "Event 1000 = crash" chỉ đúng khi Source là <em>Application Error</em>. Tra ID trên <strong>Microsoft Learn</strong> theo provider + ID; tránh các trang "từ điển event ID" trộn lẫn provider.</p>

<h3>Keywords: Audit Success và Audit Failure</h3>
${lenh('s03/doc-su-kien', 5)}
${lenh('s03/doc-su-kien', 6)}
<p>Keywords là mặt nạ 64 bit; 16 bit cao do Microsoft quy định (<em>winmeta</em>). Trong log Security, ý nghĩa đọc được nằm ở chữ số hex thứ ba: <code>0x80<strong>2</strong>0…</code> = <strong>Audit Success</strong>, <code>0x80<strong>1</strong>0…</code> = <strong>Audit Failure</strong>. Toàn bộ 429 lần 4624 là thành công và toàn bộ 130 lần 4625 là thất bại — đúng là cột "Keywords" mà Event Viewer vẽ bằng biểu tượng chìa khoá hoặc ổ khoá. Sự kiện kiểu cũ như 1074 mang <code>0x80000000000000</code> (bit "classic").</p>

<h3>Sự kiện 3 — Sysmon ghi tiến trình mới: mọi thứ nằm trong EventData</h3>
${lenh('s03/doc-su-kien', 7)}
<p>Sysmon (Bài 5.6) đặt gần như mọi thứ vào Data có tên: <code>UtcTime</code>, <code>ProcessGuid</code>, tệp chạy, dòng lệnh, mã băm, tiến trình cha. <code>Version 5</code> ở phần đầu là quan trọng: Sysmon bản mới có thể thêm trường, nên bộ phân tích phải đọc theo <em>tên</em>, không theo vị trí.</p>

<h3>Activity ID và việc nối sự kiện</h3>
<p>Phần tử <code>&lt;Correlation/&gt;</code> đang trống có thể chứa <code>ActivityID</code>: các thành phần hiện đại đóng cùng một GUID lên mọi sự kiện của một thao tác (một lần đăng nhập, một lượt Windows Update), nên một bộ lọc lấy ra được cả câu chuyện. Nó đóng vai như correlation/trace id ở Bài 10.7.</p>

<h3>🛡️ Góc hacker: trường dữ liệu ít nói dối hơn câu chữ</h3>
<p>Kẻ tấn công có thể đặt tên dịch vụ độc là "Windows Update Helper"; câu chữ trông vô hại. Trường dữ liệu thì không quan tâm: <code>ImagePath</code> trong C:\\Users\\Public, tài khoản LocalSystem, provider Service Control Manager 7045. Người phòng thủ lọc theo trường, không bao giờ theo câu chữ — thứ còn đổi theo ngôn ngữ hiển thị của máy.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Phần System của một sự kiện có gì?" — provider, ID, level, task, keywords, thời gian (UTC), record id, tiến trình/luồng, kênh, máy, SID người dùng.</li>
<li>"Vì sao tôi thấy 'description cannot be found'?" — mẫu thông điệp nằm trên máy nguồn; dữ liệu vẫn có trong Details/XML.</li>
<li>"Event ID 1000 có luôn là crash không?" — chỉ khi Source là Application Error; ID tính theo provider.</li>
<li>"Phân biệt đăng nhập thất bại với thành công mà không đọc câu chữ?" — ID 4625 với 4624, và Keywords Audit Failure với Audit Success.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Khi dán một sự kiện vào ticket hay khung chat với đội IT của khách, hãy dán <strong>XML</strong> (Details › XML View › chép), đừng chụp màn hình tab General: XML có giờ UTC, record id, đúng tên trường, và không bị dịch (Windows tiếng Nhật hiện câu chữ tiếng Nhật, còn XML thì y hệt).</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy Windows của bạn, mở một sự kiện 7036 bất kỳ trong System, chuyển sang Details › XML View. Nó có những trường <code>Data Name</code> nào, giá trị là gì?</li>
<li>Trong tệp mẫu <code>security.evtx</code>, mở bản ghi 1288: TargetUserName, LogonType và tiến trình đã ghi nó là gì?</li>
<li>Giải thích trong một câu vì sao cùng một sự kiện hiện 23:13 trên máy bạn và 07:13 (hôm sau) trên máy đồng nghiệp ở Nhật.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) <code>param1</code> = tên hiển thị của dịch vụ, <code>param2</code> = trạng thái (running/stopped), kèm một khối binary; (2) fsir, 7 (mở khoá), ProcessID 504 (lsass); (3) tệp lưu UTC (16/7/2016 22:13:49Z); mỗi Event Viewer tự đổi sang múi giờ của nó (UTC+1 và UTC+9 trong ví dụ này).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['System / EventData', 'Phần đầu cố định của mọi sự kiện / phần thân riêng của từng loại.'],
  ['Level', '1 Critical, 2 Error, 3 Warning, 4 Information, 5 Verbose, 0 LogAlways.'],
  ['Task Category', 'Nhóm con trong một provider (Logon, Process Creation…).'],
  ['Keywords', 'Cờ 64 bit; Audit Success 0x0020…, Audit Failure 0x0010….'],
  ['EventRecordID', 'Số thứ tự của sự kiện trong tệp log.'],
  ['Mẫu thông điệp', 'Câu có %1, %2… nằm trong DLL của provider, không nằm trong .evtx.'],
  ['ActivityID', 'GUID nối các sự kiện của cùng một thao tác.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phần đầu = ai/cái gì/khi nào (UTC)/ở đâu; phần thân = chi tiết. Lọc theo trường.</li>
<li>Câu chữ được dựng lúc hiển thị; XML mới là sự thật.</li>
<li>Event ID chỉ có nghĩa khi đi cùng provider.</li>
<li>Keywords phân biệt thành công/thất bại trong Security; record id lộ chỗ hụt và chỗ bị quay lui.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Event schema elements', 'System, EventData, UserData, Correlation…', 'https://learn.microsoft.com/en-us/windows/win32/wes/eventschema-elements')}
${nguon('📘', 'Microsoft Learn — Defining keywords', '48 bit thấp do provider đặt, 16 bit cao do Microsoft (winmeta)', 'https://learn.microsoft.com/en-us/windows/win32/wes/defining-keywords-used-to-classify-types-of-events')}
${nguon('📘', 'Microsoft Learn — 4624(S): An account was successfully logged on', 'Trang sự kiện chính thức trông thế nào: trường, logon type, khuyến nghị', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Bài 1.5 — Thời gian, múi giờ và lệch đồng hồ', sub: 'Vì sao tệp lưu UTC còn màn hình hiện giờ địa phương', cta: 'Mở bài' })}
</div>
`,
};
