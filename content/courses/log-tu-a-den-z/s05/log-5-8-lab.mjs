/**
 * Lab 5 — Báo cáo buổi sáng bằng PowerShell (soạn 24/11/2026, agent lgz). Output thật: OUT['s05/lab5'] — Bao-CaoSang.ps1 trên dbc-many-events-system/security/application (máy IE10Win7), "bây giờ" đóng băng.
 * Số tất định: Now 2016-09-20 08:00: 0 × 4625, 9 × 7045 (20:36:09→21:23:37: 4 powershell -nop -w hidden, 3 %SYSTEMROOT%\<8 chữ>.exe, 2 cmd.exe echo > \\.\pipe\…), 1 lần khởi động 09-19 15:13:03, 0 sập;
 * Now 2016-08-19 08:00: 13 × 7045 (3 hợp lệ: Intel E1G60I32.sys 14:49:42, gupdate/gupdatem 15:32:23; 10 tấn công 19:59:33→20:40:21), 6 lần khởi động (6005 lúc 18:46:20 không có 1074/6006 trước = khôi phục snapshot, Lab 3), 1 × 1000 rundll32.exe.
 * Phần A (máy ảo Windows của người học) là khối lệnh, không output.
 */
import { lenh, nguon, lienKet, kv, ma } from '../_chung.mjs';

export default {
  title: '5.8 — Lab 5 — A PowerShell "morning report": failed logons, new services, reboots and crashes of the last 24 h|||5.8 — Lab 5 — "Báo cáo buổi sáng" bằng PowerShell: đăng nhập hỏng, dịch vụ mới, khởi động lại và sập ứng dụng trong 24 giờ qua',
  slug: 'log-5-8-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gộp cả chương thành một công cụ đi làm dùng được ngay: script Bao-CaoSang.ps1 đọc System/Security/Application bằng FilterHashtable có StartTime, tách EventData theo tên, lọc đúng nhà cung cấp (tránh bẫy ID 1000/4625 trùng), và in bốn mục: đăng nhập hỏng, dịch vụ mới, tắt/khởi động, sập/treo. Phần A tạo sự kiện thật trên máy ảo Windows của bạn; phần B chạy trên log mẫu công khai và phát hiện 9 rồi 13 dịch vụ của Metasploit lẫn giữa dịch vụ hợp lệ; phần C hẹn giờ chạy mỗi sáng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab 5</span>
<h2>The report you read with your morning coffee</h2>
<p class="lead">Operations teams in many companies start the day with the same four questions for every Windows server: <em>did anyone fail to log on, was anything installed as a service, did it restart, did anything crash?</em> In this lab you build a PowerShell script that answers them for the last 24 hours, test it on events you create yourself, then run it on public logs of a machine that was attacked — and see whether a tired admin would have noticed.</p>

${kv([
  ['Time', '90–120 minutes.'],
  ['You need', 'Part A: a Windows 10/11 or Server evaluation VM (snapshot first). Parts B–C: PowerShell 7 anywhere + the sample logs (Lessons 3.1/4.9).'],
  ['You practise', 'FilterHashtable with StartTime/EndTime (5.2), EventData by name (5.3), provider pitfalls, reading 7045/1074/6005/6006/1000.'],
  ['Deliverable', 'Bao-CaoSang.ps1 + two reports on the samples + your answers to the questions.'],
])}

<h3>The specification</h3>
<ol>
<li>Parameters: <code>-Gio</code> (hours, default 24), <code>-Now</code> (default: now), <code>-Tep</code> (exported .evtx files instead of live logs), <code>-May</code> (machine name filter for multi-machine files).</li>
<li>Section 1 — <strong>failed logons</strong>: Security 4625, grouped by TargetUserName, IpAddress, SubStatus, LogonType.</li>
<li>Section 2 — <strong>new services</strong>: System 7045 with time, ServiceName, StartType, AccountName, ImagePath (shortened).</li>
<li>Section 3 — <strong>shutdowns and boots</strong>: System 1074 (who/why), 6006 (clean stop), 6005 (start), 6008 and Kernel-Power 41 (unexpected).</li>
<li>Section 4 — <strong>crashes and hangs</strong>: Application 1000/1002 <em>only from Application Error / Application Hang</em>, plus System 7031/7034, grouped by application.</li>
<li>Read every field <strong>by name</strong> when the event has names; for old events with unnamed Data use p0, p1…</li>
</ol>

<h3>Part A — create your own events (Windows VM, PowerShell as admin)</h3>
<div class="pitfall co-tieu-de"><p><strong>Only in a VM.</strong> Part A creates a service, restarts the machine and generates failed logons. Take a snapshot first and revert at the end.</p></div>
<pre><code class="language-powershell"># 0) Make sure the events will exist (Lesson 5.5)
auditpol /set /subcategory:"Logon" /success:enable /failure:enable

# 1) Three failed logons over SMB to yourself (4625, LogonType 3)
1..3 | ForEach-Object { net use \\\\localhost\\c$ /user:labkhach SaiMatKhau$_ 2>$null }

# 2) A service that is not a real program (7045, then 7009/7000 when started)
sc.exe create LabSvc binPath= "C:\\Windows\\System32\\cmd.exe /c echo lab" start= demand
sc.exe start LabSvc

# 3) A test crash in the Application log: write one 1000-like event via eventcreate is NOT the same provider —
#    instead crash a real program:
Start-Process powershell -ArgumentList '-c [Environment]::FailFast(\"Lab 5\")'

# 4) A clean restart with a reason (1074 → 6006 → 6005)
shutdown /r /t 5 /c "Lab 5 restart" /d p:4:1</code></pre>
<p>After the restart, run your script on the live logs (<code>.\\Bao-CaoSang.ps1</code>) and check that each of the four sections shows what you did. Note which provider wrote the FailFast crash (1000 from Application Error, plus a .NET Runtime event carrying your FailFast message — Lesson 4.5). Then <code>sc.exe delete LabSvc</code> and revert the snapshot.</p>

<h3>Part B — run it on a machine that was attacked</h3>
<p>The three logs <code>dbc-many-events-system/security/application.evtx</code> (DeepBlueCLI) come from a Windows 7 lab machine, IE10Win7, that its author attacked repeatedly with Metasploit. Freeze "now" at two mornings and answer:</p>
<ol>
<li>Morning of <strong>20/9/2016 08:00</strong>: how many services were installed in the previous 24 hours? Sort them into three kinds by ImagePath and say what each kind is.</li>
<li>Morning of <strong>19/8/2016 08:00</strong>: which of the new services are legitimate, which are not, and when does the first malicious one appear?</li>
<li>In the same report, one 6005 (boot) has no 1074 or 6006 before it. What happened? (Chapter 3, Lab 3.)</li>
<li>Both reports show <strong>zero</strong> failed logons. Is the machine safe from password attacks? What would you check?</li>
<li>Why does section 4 filter on the provider name? What would it have printed for 3/9/2016 without the filter?</li>
</ol>

<h3>Part C — make it a habit</h3>
<pre><code class="language-powershell"># Every morning at 07:30, write the report to a dated file (run as SYSTEM so Security can be read)
$a = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -File C:\\BaoCao\\Bao-CaoSang.ps1 | Out-File -Encoding utf8 ("C:\\BaoCao\\" + (Get-Date -f yyyy-MM-dd) + ".txt")'
$t = New-ScheduledTaskTrigger -Daily -At 7:30
Register-ScheduledTask -TaskName 'Bao cao sang' -Action $a -Trigger $t -User 'SYSTEM' -RunLevel Highest
# Extension ideas: add a Sysmon section (ID 1 parent = w3wp/sqlservr; ID 10 on lsass), run it on 20 servers with Invoke-Command (Lesson 5.7),
# output ConvertTo-Html for e-mail, and compare today's 7045 list with yesterday's.</code></pre>
<p>Note that this scheduled task is itself a 4698 + a Task Scheduler event (Lesson 4.6) — write it in the change ticket so the security team does not chase you.</p>

<details>
<summary><strong>Solution — the script</strong></summary>
${ma('powershell', 's05/mau/Bao-CaoSang.ps1.txt')}
</details>

<details>
<summary><strong>Solution — output on the samples, run for real</strong></summary>
${lenh('s05/lab5', 0)}
${lenh('s05/lab5', 1)}
</details>

<details>
<summary><strong>Solution — answers</strong></summary>
<ol>
<li><strong>9 services</strong> between 20:36 and 21:23 on 19/9. Three kinds, all LocalSystem / demand start with random names: (a) <code>%COMSPEC% /b /c start /b /min powershell.exe -nop -w hidden …</code> — Metasploit's PowerShell psexec payload; (b) <code>%SYSTEMROOT%\\&lt;8 random letters&gt;.exe</code> — classic psexec module dropping a binary (Lesson 4.5); (c) <code>cmd.exe /c echo xxxx &gt; \\\\.\\pipe\\xxxx</code> — the named-pipe impersonation trick of "getsystem" (Lesson 4.5). Any one of them in a morning report is an incident.</li>
<li>Legitimate: the Intel NIC driver at 14:49:42 (installed right after a boot — new virtual hardware) and Google Update (two services, 15:32:23, a known vendor path). Malicious: the 10 random names from <strong>19:59:33</strong> to 20:40:21. Real reports mix both — that is why the ImagePath must be printed, not just the count.</li>
<li>18:46:20 boot without a preceding stop: the VM was <strong>restored from a snapshot</strong> (Lab 3 found the same moment by a record going back in time). A physical server would show 6008/41 instead — an unexpected shutdown.</li>
<li>No: the Security log of IE10Win7 never contains a 4625 (Lesson 5.5's coverage check), so "zero" may mean "not audited". Check <code>auditpol /get /subcategory:Logon</code>; the report should print a warning when the subcategory produces no events at all for days.</li>
<li>IDs are reused (Lessons 3.6 and 5.2): on 3/9/2016 the 45 "1000/1002" events of IE10Win7 come from <strong>Microsoft-Windows-LoadPerf</strong> (performance counters) and VMware Tools, not from crashes. Without the provider filter the report would claim 45 crashes on a quiet day.</li>
</ol>
</details>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Walk me through a script you wrote to check Windows servers every morning." — the four sections, FilterHashtable with StartTime, named fields, provider filter, scheduled task, Invoke-Command for many servers.</li>
<li>"Your report shows 0 failed logons. Do you trust it?" — only if Logon failure auditing is on; otherwise it is a blind spot.</li>
<li>"How do you tell a legitimate new service from a malicious one?" — name, ImagePath folder, signature/vendor, account, time vs change window.</li>
</ul>

<h3>At work</h3>
<p>Morning checks are a classic first task for a newcomer in an ops or support team at an outsourcing company — usually done by hand in Event Viewer on five servers. Turning it into a script, run by Task Scheduler, with the output attached to the daily stand-up note, is the kind of small automation that gets noticed. Keep it read-only, keep it in Git, and agree with the customer which hours "the last 24 h" means (their time zone, not yours).</p>

<h3>📌 Summary</h3>
<ul>
<li>Four sections, one FilterHashtable each, fields by name.</li>
<li>Filter by provider — ID 1000 and 4625 are not unique.</li>
<li>Print ImagePath and reasons, not only counts; zero can mean "not audited".</li>
<li>Schedule it, version it, and tell the security team it exists.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'FilterHashtable with StartTime/EndTime', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${nguon('🧰', 'SANS / Eric Conrad — DeepBlueCLI', 'Source of the many-events sample logs', 'https://github.com/sans-blue-team/DeepBlueCLI')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-5-dich-vu-ung-dung', title: 'Lesson 4.5 — Services and applications', sub: 'PsExec and Metasploit service fingerprints', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-8-lab', title: 'Lab 3', sub: 'The snapshot restore found another way', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab 5</span>
<h2>Bản báo cáo đọc cùng ly cà phê sáng</h2>
<p class="lead">Đội vận hành ở nhiều công ty bắt đầu ngày làm việc bằng cùng bốn câu hỏi cho mọi máy chủ Windows: <em>có ai đăng nhập hỏng không, có gì được cài thành dịch vụ không, máy có khởi động lại không, có gì bị sập không?</em> Trong lab này bạn viết một script PowerShell trả lời chúng cho 24 giờ qua, thử nó trên những sự kiện chính bạn tạo ra, rồi chạy trên log công khai của một máy đã bị tấn công — và xem một quản trị viên mệt mỏi có nhận ra không.</p>

${kv([
  ['Thời gian', '90–120 phút.'],
  ['Cần có', 'Phần A: máy ảo Windows 10/11 hoặc Server bản đánh giá (chụp snapshot trước). Phần B–C: PowerShell 7 ở đâu cũng được + bộ log mẫu (Bài 3.1/4.9).'],
  ['Luyện', 'FilterHashtable với StartTime/EndTime (5.2), EventData theo tên (5.3), bẫy nhà cung cấp, đọc 7045/1074/6005/6006/1000.'],
  ['Nộp', 'Bao-CaoSang.ps1 + hai báo cáo trên bộ mẫu + câu trả lời cho các câu hỏi.'],
])}

<h3>Đặc tả</h3>
<ol>
<li>Tham số: <code>-Gio</code> (số giờ, mặc định 24), <code>-Now</code> (mặc định: bây giờ), <code>-Tep</code> (tệp .evtx đã xuất thay cho log đang chạy), <code>-May</code> (lọc tên máy với tệp nhiều máy).</li>
<li>Mục 1 — <strong>đăng nhập hỏng</strong>: Security 4625, gom theo TargetUserName, IpAddress, SubStatus, LogonType.</li>
<li>Mục 2 — <strong>dịch vụ mới</strong>: System 7045 với giờ, ServiceName, StartType, AccountName, ImagePath (rút gọn).</li>
<li>Mục 3 — <strong>tắt và khởi động</strong>: System 1074 (ai/vì sao), 6006 (dừng sạch), 6005 (khởi động), 6008 và Kernel-Power 41 (bất thường).</li>
<li>Mục 4 — <strong>sập và treo</strong>: Application 1000/1002 <em>chỉ từ Application Error / Application Hang</em>, cộng System 7031/7034, gom theo ứng dụng.</li>
<li>Đọc mọi trường <strong>theo tên</strong> khi sự kiện có tên; với sự kiện cũ có Data không tên thì dùng p0, p1…</li>
</ol>

<h3>Phần A — tự tạo sự kiện (máy ảo Windows, PowerShell quyền quản trị)</h3>
<div class="pitfall co-tieu-de"><p><strong>Chỉ làm trong máy ảo.</strong> Phần A tạo một dịch vụ, khởi động lại máy và sinh đăng nhập hỏng. Chụp snapshot trước và quay về khi xong.</p></div>
<pre><code class="language-powershell"># 0) Bảo đảm sự kiện sẽ được ghi (Bài 5.5)
auditpol /set /subcategory:"Logon" /success:enable /failure:enable

# 1) Ba lần đăng nhập hỏng qua SMB vào chính máy mình (4625, LogonType 3)
1..3 | ForEach-Object { net use \\\\localhost\\c$ /user:labkhach SaiMatKhau$_ 2>$null }

# 2) Một dịch vụ không phải chương trình thật (7045, rồi 7009/7000 khi khởi động)
sc.exe create LabSvc binPath= "C:\\Windows\\System32\\cmd.exe /c echo lab" start= demand
sc.exe start LabSvc

# 3) Một lần sập thật trong log Application: eventcreate KHÔNG cùng nhà cung cấp —
#    thay vào đó cho một chương trình thật sập:
Start-Process powershell -ArgumentList '-c [Environment]::FailFast(\"Lab 5\")'

# 4) Khởi động lại sạch có lý do (1074 → 6006 → 6005)
shutdown /r /t 5 /c "Lab 5 restart" /d p:4:1</code></pre>
<p>Sau khi khởi động lại, chạy script trên log đang chạy (<code>.\\Bao-CaoSang.ps1</code>) và kiểm mỗi mục trong bốn mục có hiện đúng việc bạn làm không. Ghi lại nhà cung cấp nào ghi lần sập FailFast (1000 từ Application Error, cộng một sự kiện .NET Runtime mang câu FailFast của bạn — Bài 4.5). Rồi <code>sc.exe delete LabSvc</code> và quay về snapshot.</p>

<h3>Phần B — chạy trên một máy đã bị tấn công</h3>
<p>Ba log <code>dbc-many-events-system/security/application.evtx</code> (DeepBlueCLI) đến từ một máy lab Windows 7, IE10Win7, mà tác giả đã tấn công nhiều lần bằng Metasploit. Đóng băng "bây giờ" ở hai buổi sáng và trả lời:</p>
<ol>
<li>Sáng <strong>20/9/2016 08:00</strong>: 24 giờ trước đó có bao nhiêu dịch vụ được cài? Chia chúng thành ba loại theo ImagePath và nói mỗi loại là gì.</li>
<li>Sáng <strong>19/8/2016 08:00</strong>: dịch vụ mới nào hợp lệ, cái nào không, và cái độc hại đầu tiên xuất hiện lúc nào?</li>
<li>Trong cùng báo cáo đó, một 6005 (khởi động) không có 1074 hay 6006 nào trước nó. Chuyện gì đã xảy ra? (Chương 3, Lab 3.)</li>
<li>Cả hai báo cáo đều có <strong>không</strong> lần đăng nhập hỏng. Máy có an toàn trước tấn công mật khẩu không? Bạn sẽ kiểm gì?</li>
<li>Vì sao mục 4 lọc theo tên nhà cung cấp? Không lọc thì ngày 3/9/2016 nó sẽ in ra gì?</li>
</ol>

<h3>Phần C — biến nó thành thói quen</h3>
<pre><code class="language-powershell"># Mỗi sáng 07:30, ghi báo cáo ra tệp theo ngày (chạy dưới SYSTEM để đọc được Security)
$a = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -File C:\\BaoCao\\Bao-CaoSang.ps1 | Out-File -Encoding utf8 ("C:\\BaoCao\\" + (Get-Date -f yyyy-MM-dd) + ".txt")'
$t = New-ScheduledTaskTrigger -Daily -At 7:30
Register-ScheduledTask -TaskName 'Bao cao sang' -Action $a -Trigger $t -User 'SYSTEM' -RunLevel Highest
# Ý tưởng mở rộng: thêm mục Sysmon (ID 1 có cha là w3wp/sqlservr; ID 10 vào lsass), chạy trên 20 máy chủ bằng Invoke-Command (Bài 5.7),
# xuất ConvertTo-Html để gửi e-mail, và so danh sách 7045 hôm nay với hôm qua.</code></pre>
<p>Để ý chính tác vụ hẹn giờ này cũng là một 4698 + một sự kiện Task Scheduler (Bài 4.6) — ghi nó vào change ticket để đội bảo mật không đuổi theo bạn.</p>

<details>
<summary><strong>Lời giải — script</strong></summary>
${ma('powershell', 's05/mau/Bao-CaoSang.ps1.txt')}
</details>

<details>
<summary><strong>Lời giải — output trên bộ mẫu, chạy thật</strong></summary>
${lenh('s05/lab5', 0)}
${lenh('s05/lab5', 1)}
</details>

<details>
<summary><strong>Lời giải — đáp án</strong></summary>
<ol>
<li><strong>9 dịch vụ</strong> từ 20:36 tới 21:23 ngày 19/9. Ba loại, đều LocalSystem / demand start với tên ngẫu nhiên: (a) <code>%COMSPEC% /b /c start /b /min powershell.exe -nop -w hidden …</code> — payload PowerShell của module psexec trong Metasploit; (b) <code>%SYSTEMROOT%\\&lt;8 chữ ngẫu nhiên&gt;.exe</code> — module psexec kinh điển thả một tệp chạy (Bài 4.5); (c) <code>cmd.exe /c echo xxxx &gt; \\\\.\\pipe\\xxxx</code> — mánh mạo danh qua named pipe của "getsystem" (Bài 4.5). Chỉ một trong số đó xuất hiện trong báo cáo buổi sáng là đã thành sự cố.</li>
<li>Hợp lệ: driver card mạng Intel lúc 14:49:42 (cài ngay sau một lần khởi động — phần cứng ảo mới) và Google Update (hai dịch vụ, 15:32:23, đường dẫn của một hãng quen). Độc hại: 10 tên ngẫu nhiên từ <strong>19:59:33</strong> tới 20:40:21. Báo cáo thật luôn trộn cả hai — vì vậy phải in ImagePath, không chỉ in con số.</li>
<li>Lần khởi động 18:46:20 không có lần dừng trước đó: máy ảo được <strong>khôi phục từ snapshot</strong> (Lab 3 đã tìm ra cùng thời điểm này qua một bản ghi đi lùi thời gian). Máy chủ vật lý thì sẽ hiện 6008/41 — một lần tắt bất thường.</li>
<li>Không: log Security của IE10Win7 không bao giờ chứa 4625 (kiểm độ phủ ở Bài 5.5), nên "không" có thể nghĩa là "không được kiểm toán". Kiểm bằng <code>auditpol /get /subcategory:Logon</code>; báo cáo nên in cảnh báo khi một subcategory không sinh sự kiện nào suốt nhiều ngày.</li>
<li>ID bị dùng lại (Bài 3.6 và 5.2): ngày 3/9/2016, 45 sự kiện "1000/1002" của IE10Win7 đến từ <strong>Microsoft-Windows-LoadPerf</strong> (bộ đếm hiệu năng) và VMware Tools, không phải lần sập nào. Không lọc nhà cung cấp, báo cáo sẽ khẳng định có 45 lần sập trong một ngày yên ả.</li>
</ol>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Kể về một script bạn viết để kiểm máy chủ Windows mỗi sáng." — bốn mục, FilterHashtable có StartTime, trường theo tên, lọc nhà cung cấp, tác vụ hẹn giờ, Invoke-Command cho nhiều máy chủ.</li>
<li>"Báo cáo của bạn ghi 0 lần đăng nhập hỏng. Có tin không?" — chỉ khi kiểm toán Logon failure đang bật; nếu không đó là điểm mù.</li>
<li>"Phân biệt dịch vụ mới hợp lệ với dịch vụ độc hại thế nào?" — tên, thư mục ImagePath, chữ ký/hãng, tài khoản, thời điểm so với khung giờ được duyệt thay đổi.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Kiểm tra buổi sáng là việc đầu tiên kinh điển của người mới vào đội vận hành hay hỗ trợ ở công ty outsourcing — thường làm tay trong Event Viewer trên năm máy chủ. Biến nó thành script, chạy bằng Task Scheduler, đính output vào ghi chú họp đầu ngày, là loại tự động hoá nhỏ khiến bạn được để ý. Giữ nó chỉ-đọc, giữ nó trong Git, và thống nhất với khách "24 giờ qua" là theo giờ nào (múi giờ của họ, không phải của bạn).</p>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn mục, mỗi mục một FilterHashtable, trường đọc theo tên.</li>
<li>Lọc theo nhà cung cấp — ID 1000 và 4625 không độc nhất.</li>
<li>In ImagePath và lý do, không chỉ con số; số không có thể nghĩa là "không được kiểm toán".</li>
<li>Hẹn giờ, quản lý phiên bản, và báo cho đội bảo mật biết nó tồn tại.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'FilterHashtable với StartTime/EndTime', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${nguon('🧰', 'SANS / Eric Conrad — DeepBlueCLI', 'Nguồn của bộ log mẫu many-events', 'https://github.com/sans-blue-team/DeepBlueCLI')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-5-dich-vu-ung-dung', title: 'Bài 4.5 — Dịch vụ và ứng dụng', sub: 'Dấu vân tay dịch vụ của PsExec và Metasploit', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-8-lab', title: 'Lab 3', sub: 'Lần khôi phục snapshot tìm ra bằng cách khác', cta: 'Mở bài' })}
</div>
`,
};
