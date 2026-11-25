/**
 * 3.7 — Log văn bản Windows giữ ngoài Event Viewer (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s03/van-ban'] — sự kiện WindowsUpdateClient trong dbc-many-events-system.evtx (409 × 19, 345 × 18, 26 × 27, 6 × 21…; không có 20).
 * Các log VĂN BẢN (WindowsUpdate.log, CBS.log, dism.log, setupapi.dev.log, Panther, MPLog) chỉ có trên máy Windows ⇒ bài cho LỆNH để người học chạy trên máy mình
 * và mô tả định dạng theo tài liệu Microsoft; KHÔNG in dòng log mẫu tự chế. pfirewall.log có output thật ở Bài 11.3.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.7 — Text logs Windows keeps outside Event Viewer: Windows Update, CBS/DISM, setupapi, firewall, Defender|||3.7 — Những log văn bản Windows giữ ngoài Event Viewer: Windows Update, CBS/DISM, setupapi, tường lửa, Defender',
  slug: 'log-3-7-log-van-ban',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi Event Viewer chỉ nói "cập nhật hỏng" hay "driver lỗi", chi tiết nằm ở log văn bản: Get-WindowsUpdateLog (ETL → văn bản), CBS.log và dism.log khi sfc/DISM hỏng, setupapi.dev.log khi cài driver, Panther khi nâng cấp Windows, pfirewall.log, Defender MPLog và Get-MpThreatDetection, log cài đặt MSI. Bản đồ thư mục + lệnh đọc + cách lọc bằng Select-String.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.7</span>
<h2>When the event says "failed", the text log says why</h2>
<p class="lead">Event Viewer tells you <em>that</em> an update failed, a driver did not install, an upgrade rolled back. The <em>why</em> is usually in a plain text log that the component writes for its own engineers. You don't read these every day — you read them when a ticket says "Windows Update stuck at 0x800f0922" or "the USB device isn't recognised". This lesson is the map.</p>

<h3>The everyday picture: the receipt and the kitchen notes</h3>
<p>The receipt (event) says "order #19 cancelled". The kitchen's notebook (text log) says "out of eggs, 19:42". You need both, and you only open the notebook when the receipt is not enough.</p>

<h3>The map</h3>
<ul>
<li><strong>Windows Update</strong> — events in System (provider WindowsUpdateClient: 19 installed, 20 failed, 21 restart required, 43/44 started/downloading) and in <em>WindowsUpdateClient/Operational</em>; the detailed trace is binary ETW in <code>C:\\Windows\\Logs\\WindowsUpdate\\*.etl</code>, turned into text with <code>Get-WindowsUpdateLog</code>.</li>
<li><strong>CBS (Component-Based Servicing)</strong> — <code>C:\\Windows\\Logs\\CBS\\CBS.log</code>: installing updates/features, and the results of <code>sfc /scannow</code> (lines tagged <code>[SR]</code>).</li>
<li><strong>DISM</strong> — <code>C:\\Windows\\Logs\\DISM\\dism.log</code>: image repair (<code>DISM /Online /Cleanup-Image /RestoreHealth</code>), feature on/off.</li>
<li><strong>Drivers</strong> — <code>C:\\Windows\\INF\\setupapi.dev.log</code>: every device install, one section per device, starting with <code>&gt;&gt;&gt;</code> and ending with <code>&lt;&lt;&lt;</code>; lines with <code>!!!</code> are errors, <code>!</code> warnings.</li>
<li><strong>Windows setup/upgrade</strong> — <code>C:\\Windows\\Panther\\setupact.log</code> / <code>setuperr.log</code> (and <code>$WINDOWS.~BT\\Sources\\Panther</code> during an in-place upgrade).</li>
<li><strong>Firewall</strong> — <code>C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log</code> (off by default, Lesson 11.3). Same folder: <code>HTTPERR</code> for errors of the kernel HTTP driver (http.sys) used by IIS.</li>
<li><strong>Defender</strong> — <code>C:\\ProgramData\\Microsoft\\Windows Defender\\Support\\MPLog-*.log</code> (engine diagnostics); detection history via <code>Get-MpThreatDetection</code>.</li>
<li><strong>Installers</strong> — MSI writes a verbose log only if asked (<code>msiexec /i app.msi /l*v C:\\ra\\install.log</code>); many setups write to <code>%TEMP%</code>. IIS: <code>C:\\inetpub\\logs\\LogFiles</code> (Lesson 10.3).</li>
</ul>

<h3>Step 1 — the event side of Windows Update (real sample)</h3>
${lenh('s03/van-ban', 0)}
${lenh('s03/van-ban', 1)}
${lenh('s03/van-ban', 2)}
<p>On these lab machines: 345 "ready to install" (18), 409 "installed" (19), 6 "restart required" (21) — and no 20 (failure). The event has the KB number and title; for a failure it would also carry an <code>errorCode</code> such as <code>0x800f0922</code>. Search that code in the text logs below.</p>

<h3>Step 2 — Windows Update: from ETL to text</h3>
<pre><code class="language-powershell"># Windows 10/11/Server 2016+: Windows Update writes ETW traces, not a text file
Get-ChildItem C:\\Windows\\Logs\\WindowsUpdate          # *.etl
Get-WindowsUpdateLog -LogPath C:\\ra\\WindowsUpdate.log  # decode + merge (takes a minute)
Select-String -Path C:\\ra\\WindowsUpdate.log -Pattern 'FATAL|0x8024|0x800f' | Select-Object -Last 20
# the newer, structured view (Windows 11): Get-WinEvent -LogName Microsoft-Windows-WindowsUpdateClient/Operational</code></pre>
<p>Each line: date, time, process id, thread id, component (Agent, Handler, DownloadManager…), message. Look for <code>FATAL</code> and for the error code from the event; the lines just before tell you which update and which phase (download, install, commit).</p>

<h3>Step 3 — CBS and DISM when "sfc" or an update breaks</h3>
<pre><code class="language-powershell">sfc /scannow                                                     # system file check (admin)
findstr /c:"[SR]" %windir%\\Logs\\CBS\\CBS.log > %userprofile%\\Desktop\\sfcdetails.txt   # Microsoft's own recipe
Select-String -Path C:\\Windows\\Logs\\CBS\\CBS.log -Pattern 'Cannot repair|corrupt' | Select-Object -Last 10
DISM /Online /Cleanup-Image /RestoreHealth                       # then read the tail of dism.log
Get-Content C:\\Windows\\Logs\\DISM\\dism.log -Tail 30</code></pre>
<p>CBS.log grows to hundreds of MB and is rotated into <code>CbsPersist_*.cab</code>; always filter. <code>[SR]</code> marks lines written by sfc: "Repairing corrupted file …", "Cannot repair member file …". If sfc cannot repair, DISM RestoreHealth fetches clean copies; its log says where from and whether it succeeded.</p>

<h3>Step 4 — a driver that won't install</h3>
<pre><code class="language-powershell"># Last device install sections, then the errors inside them
Select-String -Path C:\\Windows\\INF\\setupapi.dev.log -Pattern '^>>>  \\[Device Install' | Select-Object -Last 5
Select-String -Path C:\\Windows\\INF\\setupapi.dev.log -Pattern '^!!!' | Select-Object -Last 10
Get-WinEvent -LogName Microsoft-Windows-Kernel-PnP/Configuration -MaxEvents 10   # the event side (400/410/411)</code></pre>
<p>Each section header carries the hardware ID (e.g. <code>USB\\VID_…&amp;PID_…</code>) and a start time; <code>!!!</code> lines give the failure ("driver is not signed", "no matching driver"). The sample Application log had WER 1001 <em>PnPDriverNotFound</em> (Lesson 3.6) — the setupapi section for that device is where you'd confirm which ID had no driver.</p>

<h3>Step 5 — Defender's own records</h3>
<pre><code class="language-powershell">Get-MpThreatDetection | Select-Object InitialDetectionTime,ThreatID,ActionSuccess,Resources
Get-MpThreat | Select-Object ThreatName,SeverityID,IsActive
& "$env:ProgramFiles\\Windows Defender\\MpCmdRun.exe" -GetFiles     # collects MPLog + more into MpSupportFiles.cab for support</code></pre>
<p>Use the events (1116/1117, Lesson 3.3) for timelines; use <code>Get-MpThreatDetection</code> for "what is still detected on this PC", and MPLog only when Microsoft support asks or the events are gone.</p>

<h3>🛡️ Attacker's corner: text logs are easier to edit</h3>
<p>An .evtx file is written by a protected service and clearing it leaves 1102/104. A text log is just a file: anyone with write access can delete a line and nobody is told. Treat text logs as <em>supporting</em> evidence, hash and copy them early in an investigation, and prefer the events (or a copy shipped off the machine) when they disagree.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Windows Update fails with an error code. Where do you look?" — System/WindowsUpdateClient events for the code and KB, then <code>Get-WindowsUpdateLog</code>, CBS.log.</li>
<li>"sfc says it found corrupt files it cannot fix. Next?" — read the <code>[SR]</code> lines of CBS.log, run DISM RestoreHealth, read dism.log, rerun sfc.</li>
<li>"A USB device is not recognised. Which log?" — setupapi.dev.log section for its hardware ID + Kernel-PnP events.</li>
</ul>

<h3>At work</h3>
<p>Before you escalate a Windows Update or driver ticket to a senior or to Microsoft, attach: the event (XML), the matching section of the text log (not the whole 300 MB file), the OS build (<code>winver</code>), and what you already tried. That is the difference between a ticket that is solved and one that bounces back.</p>

<h3>🧪 Practice (30 min, on your Windows PC)</h3>
<div class="callout ok"><ol>
<li>Run <code>Get-WindowsUpdateLog</code>. How big is the result, and what are the last three updates it mentions?</li>
<li>Find the last device installed on your PC in <code>setupapi.dev.log</code>. Is there any <code>!!!</code> line in its section?</li>
<li>Run <code>sfc /verifyonly</code> (does not change anything) and find its <code>[SR]</code> lines in CBS.log.</li>
</ol>
<p><strong>Pass:</strong> each answer quotes the exact line(s) and the time; you used <code>Select-String</code>/<code>findstr</code>, not scrolling.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['ETW / .etl', 'Event Tracing for Windows — binary traces; Windows Update writes these.'],
  ['Get-WindowsUpdateLog', 'Decodes Windows Update .etl files into WindowsUpdate.log.'],
  ['CBS.log / [SR]', 'Servicing log; sfc results are tagged [SR].'],
  ['dism.log', 'Log of DISM image repair and feature changes.'],
  ['setupapi.dev.log', 'Device/driver installation log; >>> sections, !!! errors.'],
  ['Panther', 'Windows setup/upgrade logs (setupact.log, setuperr.log).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Events say what; component text logs say why.</li>
<li>Know the folders: Logs\\WindowsUpdate, Logs\\CBS, Logs\\DISM, INF\\setupapi.dev.log, Panther, LogFiles\\Firewall, Defender\\Support.</li>
<li>Filter with Select-String; send the relevant section, not the whole file.</li>
<li>Text logs are easy to tamper with; copy and hash them early.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Windows Update log files', 'ETW traces and Get-WindowsUpdateLog', 'https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-logs')}
${nguon('📘', 'Microsoft Learn — Analyze SFC log entries', 'findstr "[SR]" recipe for CBS.log', 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/deployment/analyze-sfc-program-log-file-entries')}
${nguon('📘', 'Microsoft Learn — SetupAPI text logs', 'Sections, entry prefixes, log levels', 'https://learn.microsoft.com/en-us/windows-hardware/drivers/install/setupapi-text-logs')}
${nguon('📘', 'Microsoft Learn — Get-MpThreatDetection', 'Defender detection history', 'https://learn.microsoft.com/en-us/powershell/module/defender/get-mpthreatdetection')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-3-firewall-windows', title: 'Lesson 11.3 — pfirewall.log', sub: 'Real firewall log output from Windows Server 2025', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.7</span>
<h2>Khi sự kiện nói "hỏng", log văn bản nói vì sao</h2>
<p class="lead">Event Viewer cho bạn biết <em>rằng</em> một bản cập nhật hỏng, một driver không cài được, một lần nâng cấp bị quay lui. Còn <em>vì sao</em> thì thường nằm trong một log văn bản thường mà chính thành phần đó ghi cho kỹ sư của nó. Bạn không đọc chúng mỗi ngày — bạn đọc khi ticket ghi "Windows Update kẹt ở 0x800f0922" hay "thiết bị USB không nhận". Bài này là tấm bản đồ.</p>

<h3>Liên tưởng đời thường: tờ hoá đơn và sổ tay nhà bếp</h3>
<p>Hoá đơn (sự kiện) ghi "đơn số 19 bị huỷ". Sổ tay nhà bếp (log văn bản) ghi "hết trứng, 19:42". Bạn cần cả hai, và chỉ mở sổ tay khi hoá đơn không đủ.</p>

<h3>Tấm bản đồ</h3>
<ul>
<li><strong>Windows Update</strong> — sự kiện trong System (provider WindowsUpdateClient: 19 đã cài, 20 hỏng, 21 cần khởi động lại, 43/44 bắt đầu/đang tải) và trong <em>WindowsUpdateClient/Operational</em>; dấu vết chi tiết là ETW nhị phân trong <code>C:\\Windows\\Logs\\WindowsUpdate\\*.etl</code>, đổi ra chữ bằng <code>Get-WindowsUpdateLog</code>.</li>
<li><strong>CBS (Component-Based Servicing)</strong> — <code>C:\\Windows\\Logs\\CBS\\CBS.log</code>: cài cập nhật/tính năng, và kết quả của <code>sfc /scannow</code> (các dòng gắn nhãn <code>[SR]</code>).</li>
<li><strong>DISM</strong> — <code>C:\\Windows\\Logs\\DISM\\dism.log</code>: sửa ảnh hệ thống (<code>DISM /Online /Cleanup-Image /RestoreHealth</code>), bật/tắt tính năng.</li>
<li><strong>Driver</strong> — <code>C:\\Windows\\INF\\setupapi.dev.log</code>: mỗi lần cài thiết bị là một đoạn, mở đầu bằng <code>&gt;&gt;&gt;</code> và kết thúc bằng <code>&lt;&lt;&lt;</code>; dòng có <code>!!!</code> là lỗi, <code>!</code> là cảnh báo.</li>
<li><strong>Cài/nâng cấp Windows</strong> — <code>C:\\Windows\\Panther\\setupact.log</code> / <code>setuperr.log</code> (và <code>$WINDOWS.~BT\\Sources\\Panther</code> trong lúc nâng cấp tại chỗ).</li>
<li><strong>Tường lửa</strong> — <code>C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log</code> (tắt sẵn, Bài 11.3). Cùng thư mục: <code>HTTPERR</code> ghi lỗi của driver HTTP nhân (http.sys) mà IIS dùng.</li>
<li><strong>Defender</strong> — <code>C:\\ProgramData\\Microsoft\\Windows Defender\\Support\\MPLog-*.log</code> (chẩn đoán engine); lịch sử phát hiện xem bằng <code>Get-MpThreatDetection</code>.</li>
<li><strong>Trình cài đặt</strong> — MSI chỉ ghi log chi tiết khi được yêu cầu (<code>msiexec /i app.msi /l*v C:\\ra\\install.log</code>); nhiều bộ cài ghi vào <code>%TEMP%</code>. IIS: <code>C:\\inetpub\\logs\\LogFiles</code> (Bài 10.3).</li>
</ul>

<h3>Bước 1 — phía sự kiện của Windows Update (mẫu thật)</h3>
${lenh('s03/van-ban', 0)}
${lenh('s03/van-ban', 1)}
${lenh('s03/van-ban', 2)}
<p>Trên các máy lab này: 345 lần "sẵn sàng cài" (18), 409 lần "đã cài" (19), 6 lần "cần khởi động lại" (21) — và không có 20 (hỏng). Sự kiện có số KB và tên bản cập nhật; nếu hỏng nó còn mang <code>errorCode</code> kiểu <code>0x800f0922</code>. Tìm mã đó trong các log văn bản dưới đây.</p>

<h3>Bước 2 — Windows Update: từ ETL ra chữ</h3>
<pre><code class="language-powershell"># Windows 10/11/Server 2016+: Windows Update ghi dấu vết ETW, không ghi tệp văn bản
Get-ChildItem C:\\Windows\\Logs\\WindowsUpdate          # *.etl
Get-WindowsUpdateLog -LogPath C:\\ra\\WindowsUpdate.log  # giải mã + gộp (mất chừng một phút)
Select-String -Path C:\\ra\\WindowsUpdate.log -Pattern 'FATAL|0x8024|0x800f' | Select-Object -Last 20
# khung nhìn mới, có cấu trúc (Windows 11): Get-WinEvent -LogName Microsoft-Windows-WindowsUpdateClient/Operational</code></pre>
<p>Mỗi dòng: ngày, giờ, mã tiến trình, mã luồng, thành phần (Agent, Handler, DownloadManager…), thông điệp. Tìm <code>FATAL</code> và mã lỗi lấy từ sự kiện; mấy dòng ngay trước đó cho biết bản cập nhật nào và giai đoạn nào (tải, cài, chốt).</p>

<h3>Bước 3 — CBS và DISM khi "sfc" hay bản cập nhật hỏng</h3>
<pre><code class="language-powershell">sfc /scannow                                                     # kiểm tệp hệ thống (quyền quản trị)
findstr /c:"[SR]" %windir%\\Logs\\CBS\\CBS.log > %userprofile%\\Desktop\\sfcdetails.txt   # công thức của chính Microsoft
Select-String -Path C:\\Windows\\Logs\\CBS\\CBS.log -Pattern 'Cannot repair|corrupt' | Select-Object -Last 10
DISM /Online /Cleanup-Image /RestoreHealth                       # rồi đọc đuôi dism.log
Get-Content C:\\Windows\\Logs\\DISM\\dism.log -Tail 30</code></pre>
<p>CBS.log phình tới hàng trăm MB và được xoay thành <code>CbsPersist_*.cab</code>; luôn lọc. <code>[SR]</code> đánh dấu dòng do sfc ghi: "Repairing corrupted file …", "Cannot repair member file …". Nếu sfc không sửa được, DISM RestoreHealth lấy bản sạch về; log của nó ghi lấy từ đâu và có thành công không.</p>

<h3>Bước 4 — driver không chịu cài</h3>
<pre><code class="language-powershell"># Các đoạn cài thiết bị gần nhất, rồi các lỗi bên trong
Select-String -Path C:\\Windows\\INF\\setupapi.dev.log -Pattern '^>>>  \\[Device Install' | Select-Object -Last 5
Select-String -Path C:\\Windows\\INF\\setupapi.dev.log -Pattern '^!!!' | Select-Object -Last 10
Get-WinEvent -LogName Microsoft-Windows-Kernel-PnP/Configuration -MaxEvents 10   # phía sự kiện (400/410/411)</code></pre>
<p>Mỗi tiêu đề đoạn mang mã phần cứng (vd. <code>USB\\VID_…&amp;PID_…</code>) và giờ bắt đầu; dòng <code>!!!</code> cho biết lỗi ("driver chưa ký", "không có driver phù hợp"). Log Application mẫu có WER 1001 <em>PnPDriverNotFound</em> (Bài 3.6) — đoạn setupapi của thiết bị đó là nơi xác nhận mã phần cứng nào không có driver.</p>

<h3>Bước 5 — hồ sơ riêng của Defender</h3>
<pre><code class="language-powershell">Get-MpThreatDetection | Select-Object InitialDetectionTime,ThreatID,ActionSuccess,Resources
Get-MpThreat | Select-Object ThreatName,SeverityID,IsActive
& "$env:ProgramFiles\\Windows Defender\\MpCmdRun.exe" -GetFiles     # gom MPLog và hơn nữa vào MpSupportFiles.cab để gửi hỗ trợ</code></pre>
<p>Dùng sự kiện (1116/1117, Bài 3.3) cho dòng thời gian; dùng <code>Get-MpThreatDetection</code> cho câu "máy này còn bị phát hiện gì", và chỉ đọc MPLog khi bên hỗ trợ Microsoft yêu cầu hoặc khi sự kiện đã mất.</p>

<h3>🛡️ Góc hacker: log văn bản dễ sửa hơn</h3>
<p>Tệp .evtx do một dịch vụ được bảo vệ ghi, và xoá nó để lại 1102/104. Log văn bản chỉ là một tệp: ai có quyền ghi đều xoá được một dòng mà chẳng ai được báo. Coi log văn bản là bằng chứng <em>bổ trợ</em>, băm và chép chúng sớm khi điều tra, và ưu tiên sự kiện (hoặc bản đã chuyển ra khỏi máy) khi hai bên mâu thuẫn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Windows Update hỏng với một mã lỗi. Bạn tìm ở đâu?" — sự kiện System/WindowsUpdateClient để lấy mã và KB, rồi <code>Get-WindowsUpdateLog</code>, CBS.log.</li>
<li>"sfc báo có tệp hỏng không sửa được. Tiếp theo?" — đọc dòng <code>[SR]</code> trong CBS.log, chạy DISM RestoreHealth, đọc dism.log, chạy lại sfc.</li>
<li>"Thiết bị USB không nhận. Log nào?" — đoạn setupapi.dev.log của mã phần cứng đó + sự kiện Kernel-PnP.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Trước khi chuyển một ticket Windows Update hay driver lên senior hoặc lên Microsoft, hãy đính kèm: sự kiện (XML), đúng đoạn tương ứng của log văn bản (không phải cả tệp 300 MB), bản dựng hệ điều hành (<code>winver</code>), và những gì bạn đã thử. Đó là khác biệt giữa ticket được giải quyết và ticket bị trả về.</p>

<h3>🧪 Thực hành (30 phút, trên máy Windows của bạn)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>Get-WindowsUpdateLog</code>. Tệp kết quả lớn bao nhiêu, ba bản cập nhật cuối cùng nó nhắc tới là gì?</li>
<li>Tìm thiết bị được cài gần nhất trên máy bạn trong <code>setupapi.dev.log</code>. Đoạn của nó có dòng <code>!!!</code> nào không?</li>
<li>Chạy <code>sfc /verifyonly</code> (không thay đổi gì) và tìm các dòng <code>[SR]</code> của nó trong CBS.log.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi câu trả lời trích đúng (các) dòng và giờ; bạn dùng <code>Select-String</code>/<code>findstr</code>, không kéo chuột.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['ETW / .etl', 'Event Tracing for Windows — dấu vết nhị phân; Windows Update ghi loại này.'],
  ['Get-WindowsUpdateLog', 'Giải mã tệp .etl của Windows Update thành WindowsUpdate.log.'],
  ['CBS.log / [SR]', 'Log servicing; kết quả sfc gắn nhãn [SR].'],
  ['dism.log', 'Log của DISM khi sửa ảnh hệ thống và đổi tính năng.'],
  ['setupapi.dev.log', 'Log cài thiết bị/driver; đoạn >>>, lỗi !!!.'],
  ['Panther', 'Log cài/nâng cấp Windows (setupact.log, setuperr.log).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sự kiện nói cái gì; log văn bản của thành phần nói vì sao.</li>
<li>Thuộc các thư mục: Logs\\WindowsUpdate, Logs\\CBS, Logs\\DISM, INF\\setupapi.dev.log, Panther, LogFiles\\Firewall, Defender\\Support.</li>
<li>Lọc bằng Select-String; gửi đúng đoạn liên quan, không gửi cả tệp.</li>
<li>Log văn bản dễ bị sửa; chép và băm sớm.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Windows Update log files', 'Dấu vết ETW và Get-WindowsUpdateLog', 'https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-logs')}
${nguon('📘', 'Microsoft Learn — Analyze SFC log entries', 'Công thức findstr "[SR]" cho CBS.log', 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/deployment/analyze-sfc-program-log-file-entries')}
${nguon('📘', 'Microsoft Learn — SetupAPI text logs', 'Đoạn log, tiền tố dòng, mức log', 'https://learn.microsoft.com/en-us/windows-hardware/drivers/install/setupapi-text-logs')}
${nguon('📘', 'Microsoft Learn — Get-MpThreatDetection', 'Lịch sử phát hiện của Defender', 'https://learn.microsoft.com/en-us/powershell/module/defender/get-mpthreatdetection')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-3-firewall-windows', title: 'Bài 11.3 — pfirewall.log', sub: 'Output log tường lửa thật từ Windows Server 2025', cta: 'Mở bài' })}
</div>
`,
};
