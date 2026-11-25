/**
 * 3.6 — Reliability Monitor và báo cáo sự cố (soạn 24/11/2026, agent lgz). Output thật: OUT['s03/reliability'] — Application.evtx + dbc-many-events-application.evtx (3.1).
 * Reliability Monitor/Win32_ReliabilityRecords chỉ có trên Windows ⇒ khối mã cho máy người học; dòng thời gian crash dựng lại từ chính các sự kiện nó dùng (1000/1001/1002).
 * Số tất định: 4 crash Application Error (adberdr813.exe, mcupdmgr.exe, rundll32.exe, svchost.exe); adberdr813.exe 1.5.0.7 / msvcrt.dll / c0000005 / 00018e17 / 2011-08-28 22:35:36Z;
 * WER: 3 APPCRASH, 3 PnPDriverNotFound, 2 BEX…; 36 lỗi IE8Win7 2014-11, 19 WKS-WIN732BITA 2011-07.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.6 — Reliability Monitor and problem reports: the friendly crash timeline|||3.6 — Reliability Monitor và báo cáo sự cố: dòng thời gian crash dễ đọc',
  slug: 'log-3-6-reliability-monitor',
  type: 'LESSON',
  isFreePreview: true,
  description: 'perfmon /rel: chỉ số ổn định 1–10, các hàng Application failures / Windows failures / Miscellaneous failures / Warnings / Information; nó dựng từ Event 1000/1001/1002 và Windows Error Reporting. Đọc thật một crash (ứng dụng, module, mã ngoại lệ c0000005, offset, ReportArchive) và dựng lại dòng thời gian crash theo máy/tháng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>Reliability Monitor: the crash diary your users can read</h2>
<p class="lead">When a user says "it keeps crashing", Event Viewer is the wrong first screen for them. Windows has a friendlier one: <strong>Reliability Monitor</strong> — a day-by-day chart with red crosses for crashes and blue "i" for installs. Behind it are the same events you already know. This lesson shows both sides: the chart, and the raw crash events you read when the chart is not enough.</p>

<h3>The everyday picture: a health booklet</h3>
<p>A doctor's booklet lists the day you were sick, the day you got a vaccine, the day you changed medicine. You see at once "the headaches started the week after the new pills". Reliability Monitor is that booklet for a PC: crashes, failed updates, new installs, on one timeline.</p>

<h3>Open it and read it</h3>
<pre><code class="language-powershell"># Windows: Start › "View reliability history", or:
perfmon /rel
# The same data for scripts (Windows only):
Get-CimInstance Win32_ReliabilityRecords | Select-Object -First 10 TimeGenerated,SourceName,EventIdentifier,ProductName
Get-CimInstance Win32_ReliabilityStabilityMetrics | Select-Object -Last 7 TimeGenerated,SystemStabilityIndex</code></pre>
<ul>
<li><strong>Stability index</strong> 1–10 (the line at the top): drops after each failure, climbs back slowly on quiet days. Use it as a trend, not a score.</li>
<li>Rows: <strong>Application failures</strong> (crash = Event 1000 "Application Error", hang = Event 1002 "Application Hang"), <strong>Windows failures</strong> (blue screen, unexpected shutdown — Lesson 4.4), <strong>Miscellaneous failures</strong>, <strong>Warnings</strong> (failed installs/updates), <strong>Information</strong> (successful installs — MsiInstaller, Windows Update).</li>
<li>Click a day, then a line: <em>View technical details</em> shows exactly the fields of the events below. <em>View all problem reports</em> lists Windows Error Reporting (WER) reports.</li>
</ul>

<h3>Step 1 — the crash list, rebuilt from events</h3>
${lenh('s03/reliability', 0)}
<p>Only "Application Error 1000" and "Application Hang 1002" count — Lesson 3.2 showed that ID 1000 from other providers is not a crash. Four crashes across two machines' Application logs.</p>

<h3>Step 2 — read one crash like an engineer</h3>
${lenh('s03/reliability', 1)}
<p>Event 1000 stores 13 unnamed values; the friendly sentence is "Faulting application name: %1, version: %2 … Exception code: %7, Fault offset: %8 …". Read it in this order:</p>
<ol>
<li><strong>Application + path</strong>: <code>adberdr813.exe</code> from <code>C:\\Users\\nromanoff\\Downloads</code>.</li>
<li><strong>Faulting module</strong>: <code>msvcrt.dll</code> — the C runtime. The crash happened inside a Windows DLL, but the DLL is rarely the culprit: something passed it bad data.</li>
<li><strong>Exception code</strong> <code>c0000005</code> = <em>access violation</em> (read/write to an invalid address — null pointer, freed memory, buffer overrun). Other common ones: <code>c0000409</code> stack buffer overrun, <code>e0434352</code> unhandled .NET exception (paired with Event 1026), <code>c00000fd</code> stack overflow.</li>
<li><strong>Offset</strong> <code>00018e17</code> — the address inside the module; same offset + same module + same version across many users = one bug.</li>
<li><strong>Report Id</strong> — joins this event with the WER report and Event 1001.</li>
</ol>
<p>And one detail an investigator would not let pass: a file named like Adobe Reader 8.1.3 ("adberdr813") with version <strong>1.5.0.7</strong>, running from Downloads. A crash event is sometimes the only trace a suspicious program leaves — treat it as a lead, check the hash.</p>

<h3>Step 3 — Windows Error Reporting (Event 1001)</h3>
${lenh('s03/reliability', 2)}
${lenh('s03/reliability', 3)}
<p>Event 1001 (provider Windows Error Reporting) is the "report filed" stamp: <strong>event type</strong> (APPCRASH, BEX = buffer overflow/DEP stop, AppHangB1, PnPDriverNotFound for missing drivers…), the same fields as 1000, and the folder with the report files: <code>C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive\\AppCrash_…</code> (sent) or <code>ReportQueue</code> (waiting). Inside: <code>Report.wer</code> (text) and sometimes a minidump. Blue screens write <code>C:\\Windows\\Minidump\\*.dmp</code> and <code>MEMORY.DMP</code> (Lesson 4.4).</p>

<h3>Step 4 — the timeline view</h3>
${lenh('s03/reliability', 4)}
<p>Group errors by machine and month and the "bad month" stands out: IE8Win7 in November 2014, WKS-WIN732BITA in July 2011. That is what the Reliability chart does visually. Next question is always the same: <strong>what changed just before?</strong> — installs (MsiInstaller 11707), updates (WindowsUpdateClient 19/20), drivers (UserPnp 20001). Lab 3 asks it for restarts.</p>

<h3>Real-life situation: "my game/IDE crashes since the driver update"</h3>
<p>Open Reliability Monitor, find the first red cross, look at the blue "i" a day before: "Successfully installed: NVIDIA … driver". The crash details show the faulting module <code>nvwgf2umx.dll</code> (an NVIDIA user-mode driver DLL). You now have a hypothesis to test: roll back the driver (Device Manager › Roll Back Driver) and watch the next days.</p>

<h3>🛡️ Attacker's corner: crashes as alarms</h3>
<p>Exploits that fail often crash the target: a burst of 1000/1001 for a browser, Office or a service (<code>c0000005</code>, <code>c0000409</code>, BEX) right after a user opened a document is worth a look. Crashes of security software itself (antivirus, EDR agent) are a classic sign someone is trying to disable it.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"A user says an app crashes several times a day. What do you collect?" — Reliability Monitor screenshot/export, Event 1000/1001 details, WER report folder, app version, recent changes.</li>
<li>"What does exception code 0xc0000005 mean?" — access violation.</li>
<li>"Event 1000 vs 1001?" — 1000 Application Error = the crash; 1001 WER = the report about it (also used for hangs, driver problems).</li>
</ul>

<h3>At work</h3>
<p>Many outsourcing teams ship Windows desktop tools to customers. A crash ticket with <em>application version + faulting module + exception code + offset</em> from Event 1000 lets a developer find the bug; "it crashed" does not. Put a short "how to send us Event 1000/1001" guide in the user manual.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Open <code>perfmon /rel</code> on your PC. What is today's stability index, and which day had the most red crosses?</li>
<li>Pick one Application failure, <em>View technical details</em>, and match each field to the values of the Event 1000 in Event Viewer.</li>
<li>In the sample Application.evtx, which WER event types appear and which folder holds the adberdr813 crash report?</li>
</ol>
<p><strong>Pass:</strong> (1)/(2) your own numbers; fields match name, version, module, exception code, offset; (3) APPCRASH, PnPDriverNotFound, BEX, PnPGenericDriverFound, PnPRequestAdditionalSoftware, ShellBrowserCancel; <code>…\\WER\\ReportArchive\\AppCrash_adberdr813.exe_…</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Reliability Monitor', 'perfmon /rel — daily timeline of failures and installs with a stability index.'],
  ['Event 1000 / 1002', 'Application Error (crash) / Application Hang.'],
  ['Event 1001 (WER)', 'Windows Error Reporting filed a report; type, bucket, report folder.'],
  ['Exception code', 'Why the program died: c0000005 access violation, e0434352 .NET…'],
  ['ReportArchive / ReportQueue', 'WER report folders under ProgramData\\Microsoft\\Windows\\WER.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Reliability Monitor = a friendly timeline built from crash/hang/install events.</li>
<li>Read a crash as app + module + exception code + offset + report id.</li>
<li>Always ask what changed just before the first crash.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Windows Error Reporting', 'What WER collects and where', 'https://learn.microsoft.com/en-us/windows/win32/wer/windows-error-reporting')}
${nguon('📘', 'Microsoft Learn — Win32_ReliabilityRecords', 'The WMI class behind Reliability Monitor', 'https://learn.microsoft.com/en-us/previous-versions/windows/desktop/racwmiprov/win32-reliabilityrecords')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-4-gia-thuyet', title: 'Debugging methodically — 1.4 Hypotheses', sub: 'Turning a crash report into a hypothesis you can test', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>Reliability Monitor: cuốn nhật ký crash người dùng cũng đọc được</h2>
<p class="lead">Khi người dùng nói "nó cứ văng liên tục", Event Viewer không phải màn hình đầu tiên nên đưa họ. Windows có một màn hình thân thiện hơn: <strong>Reliability Monitor</strong> — biểu đồ theo ngày, dấu X đỏ là crash, chữ "i" xanh là lần cài đặt. Đằng sau nó vẫn là những sự kiện bạn đã biết. Bài này chỉ cả hai mặt: biểu đồ, và các sự kiện crash gốc khi biểu đồ không đủ.</p>

<h3>Liên tưởng đời thường: sổ khám bệnh</h3>
<p>Sổ khám bệnh ghi ngày bạn ốm, ngày tiêm, ngày đổi thuốc. Nhìn là thấy ngay "đau đầu bắt đầu từ tuần sau khi uống thuốc mới". Reliability Monitor là cuốn sổ đó của một máy tính: crash, cập nhật hỏng, cài đặt mới, trên cùng một trục thời gian.</p>

<h3>Mở ra và đọc</h3>
<pre><code class="language-powershell"># Windows: Start › "View reliability history", hoặc:
perfmon /rel
# Cùng dữ liệu cho script (chỉ trên Windows):
Get-CimInstance Win32_ReliabilityRecords | Select-Object -First 10 TimeGenerated,SourceName,EventIdentifier,ProductName
Get-CimInstance Win32_ReliabilityStabilityMetrics | Select-Object -Last 7 TimeGenerated,SystemStabilityIndex</code></pre>
<ul>
<li><strong>Chỉ số ổn định</strong> 1–10 (đường trên cùng): tụt sau mỗi lỗi, leo lại chậm vào những ngày yên ổn. Xem như xu hướng, đừng xem như điểm số.</li>
<li>Các hàng: <strong>Application failures</strong> (crash = Event 1000 "Application Error", treo = Event 1002 "Application Hang"), <strong>Windows failures</strong> (màn hình xanh, tắt bất ngờ — Bài 4.4), <strong>Miscellaneous failures</strong>, <strong>Warnings</strong> (cài đặt/cập nhật hỏng), <strong>Information</strong> (cài đặt thành công — MsiInstaller, Windows Update).</li>
<li>Bấm vào một ngày, rồi một dòng: <em>View technical details</em> hiện đúng các trường của sự kiện bên dưới. <em>View all problem reports</em> liệt kê các báo cáo Windows Error Reporting (WER).</li>
</ul>

<h3>Bước 1 — danh sách crash, dựng lại từ sự kiện</h3>
${lenh('s03/reliability', 0)}
<p>Chỉ "Application Error 1000" và "Application Hang 1002" mới tính — Bài 3.2 đã cho thấy ID 1000 của provider khác không phải crash. Bốn lần crash trong log Application của hai máy.</p>

<h3>Bước 2 — đọc một crash như kỹ sư</h3>
${lenh('s03/reliability', 1)}
<p>Event 1000 lưu 13 giá trị không tên; câu dễ đọc là "Faulting application name: %1, version: %2 … Exception code: %7, Fault offset: %8 …". Đọc theo thứ tự này:</p>
<ol>
<li><strong>Ứng dụng + đường dẫn</strong>: <code>adberdr813.exe</code> chạy từ <code>C:\\Users\\nromanoff\\Downloads</code>.</li>
<li><strong>Module lỗi</strong>: <code>msvcrt.dll</code> — thư viện C của Windows. Crash xảy ra bên trong DLL của Windows, nhưng DLL hiếm khi là thủ phạm: có thứ gì đó đã đưa dữ liệu hỏng cho nó.</li>
<li><strong>Mã ngoại lệ</strong> <code>c0000005</code> = <em>access violation</em> (đọc/ghi vào địa chỉ không hợp lệ — con trỏ null, vùng nhớ đã giải phóng, tràn bộ đệm). Vài mã hay gặp khác: <code>c0000409</code> tràn bộ đệm ngăn xếp, <code>e0434352</code> ngoại lệ .NET không ai bắt (đi kèm Event 1026), <code>c00000fd</code> tràn ngăn xếp.</li>
<li><strong>Offset</strong> <code>00018e17</code> — địa chỉ bên trong module; cùng offset + cùng module + cùng phiên bản trên nhiều người dùng = cùng một lỗi.</li>
<li><strong>Report Id</strong> — nối sự kiện này với báo cáo WER và Event 1001.</li>
</ol>
<p>Và một chi tiết người điều tra không bỏ qua: tệp đặt tên giống Adobe Reader 8.1.3 ("adberdr813") nhưng phiên bản là <strong>1.5.0.7</strong>, chạy từ thư mục Downloads. Một sự kiện crash đôi khi là dấu vết duy nhất một chương trình đáng ngờ để lại — coi đó là manh mối, kiểm mã băm.</p>

<h3>Bước 3 — Windows Error Reporting (Event 1001)</h3>
${lenh('s03/reliability', 2)}
${lenh('s03/reliability', 3)}
<p>Event 1001 (provider Windows Error Reporting) là con dấu "đã lập báo cáo": <strong>loại sự kiện</strong> (APPCRASH, BEX = bị chặn vì tràn bộ đệm/DEP, AppHangB1, PnPDriverNotFound khi thiếu driver…), các trường giống 1000, và thư mục chứa tệp báo cáo: <code>C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive\\AppCrash_…</code> (đã gửi) hoặc <code>ReportQueue</code> (đang chờ). Bên trong có <code>Report.wer</code> (chữ) và đôi khi một minidump. Màn hình xanh ghi <code>C:\\Windows\\Minidump\\*.dmp</code> và <code>MEMORY.DMP</code> (Bài 4.4).</p>

<h3>Bước 4 — khung nhìn theo thời gian</h3>
${lenh('s03/reliability', 4)}
<p>Gom lỗi theo máy và tháng là "tháng xấu" lộ ngay: IE8Win7 tháng 11/2014, WKS-WIN732BITA tháng 7/2011. Đó chính là việc biểu đồ Reliability làm bằng hình. Câu hỏi tiếp theo luôn là: <strong>ngay trước đó đã thay đổi gì?</strong> — cài đặt (MsiInstaller 11707), cập nhật (WindowsUpdateClient 19/20), driver (UserPnp 20001). Lab 3 hỏi đúng câu này cho các lần khởi động lại.</p>

<h3>Tình huống đời thường: "game/IDE văng liên tục từ khi cập nhật driver"</h3>
<p>Mở Reliability Monitor, tìm dấu X đỏ đầu tiên, nhìn chữ "i" xanh một ngày trước đó: "Successfully installed: NVIDIA … driver". Chi tiết crash cho thấy module lỗi là <code>nvwgf2umx.dll</code> (DLL driver chế độ người dùng của NVIDIA). Giờ bạn có một giả thuyết để thử: quay lại driver cũ (Device Manager › Roll Back Driver) và theo dõi mấy ngày sau.</p>

<h3>🛡️ Góc hacker: crash như chuông báo</h3>
<p>Khai thác thất bại thường làm chương trình mục tiêu crash: một đợt 1000/1001 dồn dập của trình duyệt, Office hay một dịch vụ (<code>c0000005</code>, <code>c0000409</code>, BEX) ngay sau khi người dùng mở một tài liệu là thứ đáng xem. Chính phần mềm bảo mật (diệt virus, agent EDR) bị crash là dấu hiệu kinh điển có kẻ đang tìm cách vô hiệu hoá nó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Người dùng nói một ứng dụng văng vài lần mỗi ngày. Bạn thu thập gì?" — ảnh/bản xuất Reliability Monitor, chi tiết Event 1000/1001, thư mục báo cáo WER, phiên bản ứng dụng, các thay đổi gần đây.</li>
<li>"Mã ngoại lệ 0xc0000005 nghĩa là gì?" — access violation.</li>
<li>"Event 1000 khác 1001 thế nào?" — 1000 Application Error = vụ crash; 1001 WER = báo cáo về nó (cũng dùng cho treo, lỗi driver).</li>
</ul>

<h3>Đi làm thật</h3>
<p>Nhiều đội outsourcing giao công cụ desktop Windows cho khách. Một ticket crash có <em>phiên bản ứng dụng + module lỗi + mã ngoại lệ + offset</em> lấy từ Event 1000 giúp lập trình viên tìm ra lỗi; "nó bị văng" thì không. Hãy để sẵn một hướng dẫn ngắn "cách gửi Event 1000/1001 cho chúng tôi" trong tài liệu người dùng.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Mở <code>perfmon /rel</code> trên máy bạn. Chỉ số ổn định hôm nay là bao nhiêu, ngày nào nhiều dấu X đỏ nhất?</li>
<li>Chọn một Application failure, <em>View technical details</em>, rồi khớp từng trường với các giá trị của Event 1000 trong Event Viewer.</li>
<li>Trong tệp mẫu Application.evtx, có những loại sự kiện WER nào và thư mục nào chứa báo cáo crash của adberdr813?</li>
</ol>
<p><strong>Đạt khi:</strong> (1)/(2) số của chính máy bạn; các trường khớp tên, phiên bản, module, mã ngoại lệ, offset; (3) APPCRASH, PnPDriverNotFound, BEX, PnPGenericDriverFound, PnPRequestAdditionalSoftware, ShellBrowserCancel; <code>…\\WER\\ReportArchive\\AppCrash_adberdr813.exe_…</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Reliability Monitor', 'perfmon /rel — dòng thời gian theo ngày của lỗi và cài đặt, kèm chỉ số ổn định.'],
  ['Event 1000 / 1002', 'Application Error (crash) / Application Hang (treo).'],
  ['Event 1001 (WER)', 'Windows Error Reporting đã lập báo cáo; loại, bucket, thư mục báo cáo.'],
  ['Mã ngoại lệ', 'Lý do chương trình chết: c0000005 access violation, e0434352 .NET…'],
  ['ReportArchive / ReportQueue', 'Thư mục báo cáo WER trong ProgramData\\Microsoft\\Windows\\WER.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Reliability Monitor = dòng thời gian dễ đọc dựng từ sự kiện crash/treo/cài đặt.</li>
<li>Đọc một crash theo: ứng dụng + module + mã ngoại lệ + offset + report id.</li>
<li>Luôn hỏi ngay trước crash đầu tiên đã thay đổi gì.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Windows Error Reporting', 'WER thu thập gì và để ở đâu', 'https://learn.microsoft.com/en-us/windows/win32/wer/windows-error-reporting')}
${nguon('📘', 'Microsoft Learn — Win32_ReliabilityRecords', 'Lớp WMI đứng sau Reliability Monitor', 'https://learn.microsoft.com/en-us/previous-versions/windows/desktop/racwmiprov/win32-reliabilityrecords')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-4-gia-thuyet', title: 'Gỡ lỗi có phương pháp — 1.4 Giả thuyết', sub: 'Biến một báo cáo crash thành giả thuyết thử được', cta: 'Mở bài' })}
</div>
`,
};
