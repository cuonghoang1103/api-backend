/**
 * 5.5 — Bật cái đang tắt: auditpol, Advanced Audit Policy, CommandLine trong 4688, log PowerShell (soạn 24/11/2026, agent lgz).
 * auditpol/gpedit/registry chỉ chạy trên Windows ⇒ khối mã. Output thật: OUT['s05/audit-policy'] — SUY RA audit policy từ chính log mẫu (Kiem-DoPhu.ps1, bảng Task → subcategory mau/task-subcategory.tsv).
 * Số tất định: dbc IE10Win7 8346 × 4688 (7472 có CommandLine), IE8Win7/IE9Win7/37L4247D28-05 không 4688; security.evtx WIN-03DLIIOFRRA không 4688; dirty DESKTOP-0QT8017 142 × 4688 không CommandLine,
 * WIN-LL0C19JS506 12 × 4688 không CommandLine; không máy nào có 4625; ps-tai-payload: 4104 IEX(New-Object Net.WebClient).downloadString(... lúc 8:11:11 PM 1/24/2022.
 */
import { lenh, nguon, lienKet, kv, ma } from '../_chung.mjs';

export default {
  title: '5.5 — Turning on what is off: auditpol, Advanced Audit Policy, command line in 4688, PowerShell logging|||5.5 — Bật những gì đang tắt: auditpol, Advanced Audit Policy, dòng lệnh trong 4688, log PowerShell',
  slug: 'log-5-5-audit-policy',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Log Windows chỉ ghi những gì được bảo ghi. Basic vs Advanced Audit Policy (9 nhóm thô so với hàng chục subcategory), auditpol /get /set /backup, "Force audit policy subcategory settings", bật CommandLine cho 4688, Module/Script Block/Transcription của PowerShell (5.1 và 7), cỡ log phải tăng theo. Thực hành không cần Windows: đọc log của 7 máy mẫu để SUY RA chính sách kiểm toán của chúng — máy nào không có 4688, máy nào có 4688 mà thiếu dòng lệnh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Windows only logs what it is told to log</h2>
<p class="lead">Chapters 3–4 read events that existed. The uncomfortable question of every investigation is the opposite: <em>"Why is there no 4688? No 4104? No 4663?"</em> — usually because nobody turned it on. This lesson shows where the switches are (audit policy, command-line inclusion, PowerShell logging), how to turn them on safely, and how to tell from a log alone what a machine was configured to record.</p>

<h3>The everyday picture: CCTV that was never plugged in</h3>
<p>A building can have cameras on every floor and still record nothing in the server room because that one was never connected. After a break-in the guard says "the footage is missing" — it was never there. Audit policy is the wiring diagram of Windows' cameras; checking it <em>before</em> an incident is part of the job.</p>

${kv([
  ['Basic audit policy', '9 old categories (Audit logon events, Audit process tracking…) — coarse switches.'],
  ['Advanced Audit Policy', '10 categories, dozens of subcategories (Logon, Process Creation, File Share, Audit Policy Change…) — the modern, fine-grained one.'],
  ['Force audit policy subcategory settings', 'Security option that makes Advanced override Basic. Mixing both without it gives "my setting did not apply".'],
  ['auditpol', 'Command line for Advanced Audit Policy: /get, /set, /list, /backup, /restore, /clear.'],
  ['ProcessCreationIncludeCmdLine_Enabled', 'Policy "Include command line in process creation events" → CommandLine in 4688.'],
  ['4103 / 4104', 'PowerShell Module logging / Script Block logging (Microsoft-Windows-PowerShell/Operational).'],
])}

<h3>Step 1 — see the current policy (Windows, admin)</h3>
<pre><code class="language-bat">:: Every subcategory and its setting (No Auditing / Success / Failure / Success and Failure)
auditpol /get /category:*

:: Only one subcategory
auditpol /get /subcategory:"Process Creation"

:: The effective result of Group Policy, including Advanced Audit Policy
gpresult /h C:\\lab\\gp.html</code></pre>
<p>On a fresh Windows client a lot is "No Auditing" — for example <strong>Process Creation</strong>. Domain controllers and servers have more on by default, but still not command lines, not PowerShell script blocks, and not file access.</p>

<h3>Step 2 — infer the policy from the logs (no Windows needed)</h3>
<p>Often you get only the logs. The Security log tells you what was being audited: each event carries a <strong>Task</strong> number = its subcategory (12544 Logon, 13312 Process Creation, 13824 User Account Management…). <code>Kiem-DoPhu.ps1</code> counts events per subcategory and checks the three things most often missing:</p>
${ma('powershell', 's05/mau/Kiem-DoPhu.ps1.txt')}
${lenh('s05/audit-policy', 0)}
${lenh('s05/audit-policy', 1)}
${lenh('s05/audit-policy', 2)}
<p>Seven machines, three situations — exactly what you meet in real companies:</p>
<ul>
<li><strong>No 4688 at all</strong> (IE8Win7, IE9Win7, WIN-03DLIIOFRRA, two 37L… machines): Process Creation not audited. If malware ran there, the Security log cannot tell you.</li>
<li><strong>4688 without CommandLine</strong> (DESKTOP-0QT8017: 142 events, WIN-LL0C19JS506: 12): you know <em>that</em> <code>powershell.exe</code> started, not <em>what</em> it ran — Lesson 5.4 showed how much detective work that costs.</li>
<li><strong>4688 with CommandLine</strong> (IE10Win7: 7472 of 8346): the good state.</li>
</ul>
<p>Also: <em>none</em> of the seven has a single 4625. Either nobody ever mistyped a password, or Logon is audited for Success only — on a real machine check with <code>auditpol /get /subcategory:Logon</code>. "Audit Policy Change" with thousands of 4907 (DESKTOP-0QT8017: 6103) is the opposite problem: noise from object-SACL changes during updates (Lesson 3.5).</p>

<div class="callout"><p><strong>The Task → subcategory table</strong> (<code>task-subcategory.tsv</code>) comes from Microsoft's audit subcategory documentation; three rows (12544 Logon, 13824 User Account Management, 13826 Security Group Management) are confirmed directly by the <code>RenderingInfo</code> of the forwarded events in Lesson 5.7, which carry the display name next to the number.</p></div>

<h3>Step 3 — turn on what you need (in a VM first)</h3>
<pre><code class="language-bat">:: 1) Let Advanced Audit Policy win over the old basic categories
::    (GPO: Security Options › "Audit: Force audit policy subcategory settings…" = Enabled)
reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa /v SCENoApplyLegacyAuditPolicy /t REG_DWORD /d 1 /f

:: 2) A sensible minimum for a member server / workstation
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Special Logon" /success:enable
auditpol /set /subcategory:"Process Creation" /success:enable
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable
auditpol /set /subcategory:"Security Group Management" /success:enable
auditpol /set /subcategory:"Audit Policy Change" /success:enable
auditpol /set /subcategory:"Security System Extension" /success:enable
auditpol /set /subcategory:"Other Object Access Events" /success:enable

:: 3) Command line in 4688 (GPO: Administrative Templates › System › Audit Process Creation)
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f

:: 4) Save / restore the whole policy (before a change, for the ticket)
auditpol /backup /file:C:\\lab\\audit-truoc.csv
auditpol /restore /file:C:\\lab\\audit-truoc.csv</code></pre>
<pre><code class="language-powershell"># 5) Windows PowerShell 5.1 — Script Block + Module logging (GPO: Administrative Templates › Windows Components › Windows PowerShell)
New-Item -Path HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging -Force | Out-Null
Set-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging EnableScriptBlockLogging 1
New-Item -Path HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging\\ModuleNames -Force | Out-Null
Set-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging EnableModuleLogging 1
Set-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging\\ModuleNames '*' '*'

# 6) PowerShell 7 writes to its OWN log "PowerShellCore/Operational" — register it once
& "$PSHOME\\RegisterManifest.ps1"

# 7) Then make room (Lesson 3.5): process + script block auditing multiply the volume
wevtutil sl Security /ms:1073741824
wevtutil sl Microsoft-Windows-PowerShell/Operational /ms:268435456</code></pre>
<p>Microsoft's "Audit Policy Recommendations" page gives baseline tables per role (workstation, member server, domain controller) — use it rather than "turn everything on": Object Access › File System or Filtering Platform Connection on a busy server can produce millions of events a day (the 62 000-event server sample of Lesson 5.4 was 78 % WFP connection events — Lesson 3.5).</p>

<h3>Step 4 — what PowerShell logging buys you</h3>
${lenh('s05/audit-policy', 3)}
<p>One line of a real sample: Script Block logging (4104) captured the exact command <code>IEX(New-Object Net.WebClient).downloadString('https://…')</code> — "download a script and run it in memory", a pattern Lesson 4.6 decoded in detail. Without 4104, the only trace would be a 4688 for <code>powershell.exe</code> (if Process Creation was on) and a network connection. Note the Level: 4104 is <strong>Verbose</strong> normally; PowerShell 5 also logs script blocks it considers suspicious automatically at <strong>Warning</strong> level even when Script Block logging is not enabled (Microsoft PowerShell team, "PowerShell ♥ the Blue Team", 2015) — a "record of last resort", not a replacement.</p>

<h3>🛡️ Attacker's corner: switching the cameras off</h3>
<p>Because audit policy is just a setting, attackers change it. MITRE records that during the <strong>SolarWinds compromise</strong> (campaign C0024, 2020) APT29 "used AUDITPOL to prevent the collection of audit logs" (T1685.001 Disable or Modify Windows Event Log). The trace is 4719 "System audit policy was changed" (Lesson 4.3) — if Audit Policy Change is itself audited. A second trick is the <strong>downgrade attack</strong> (ATT&amp;CK T1689, formerly T1562.010): running <code>powershell.exe -Version 2</code>, an engine that predates Script Block logging, so 4104 never appears. Defences: audit Audit Policy Change, forward 4719 off the machine, and remove the "Windows PowerShell 2.0" optional feature.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"There is no 4688 on this server. Why, and how do you fix it?" — Process Creation subcategory not audited; <code>auditpol /set /subcategory:"Process Creation" /success:enable</code> plus the command-line policy, via GPO for many machines.</li>
<li>"Basic vs Advanced audit policy?" — 9 coarse categories vs dozens of fine subcategories; enable "Force audit policy subcategory settings" so they do not fight.</li>
<li>"4103 vs 4104?" — module/pipeline execution details vs the full text of script blocks.</li>
<li>"How can you tell from a log what was audited?" — Task/subcategory of the events present; 4688 version and empty CommandLine; 4719 history.</li>
</ul>

<h3>At work</h3>
<p>In an outsourcing contract, audit policy belongs to the customer's security/infra team, not to developers. Your realistic contribution: when you deliver a Windows server for your application, include a one-page "logging readiness" note — the output of <code>auditpol /get /category:*</code>, Security log size, whether 4688 includes command lines, and PowerShell logging status — and flag gaps. That note is what the incident responders will wish existed when something goes wrong in year two.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>Kiem-DoPhu.ps1</code> on <code>mau/Archive-ForwardedEvents-test.evtx</code>. Which subcategories does slad1 audit? Can you conclude anything about Process Creation on slad1?</li>
<li>On a Windows VM: <code>auditpol /backup</code>, enable Process Creation + command line, run <code>cmd /c whoami</code>, find the 4688, then <code>auditpol /restore</code>. Did a 4719 appear?</li>
<li>Write the three registry values needed for Script Block logging in PowerShell 5.1 and say where PowerShell 7 writes its events.</li>
</ol>
<p><strong>Pass:</strong> (1) Logon, User Account Management, Security Group Management (from what was forwarded); no — the collector only receives what the subscription selects, so a missing 4688 in ForwardedEvents says nothing about the source's audit policy (Lesson 5.7); (2) yes, one 4719 per changed subcategory, plus the 4688 with CommandLine <code>cmd /c whoami</code>; (3) EnableScriptBlockLogging = 1 under …\\PowerShell\\ScriptBlockLogging (optionally EnableModuleLogging + ModuleNames) — PowerShell 7 → PowerShellCore/Operational after RegisterManifest.ps1.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Subcategory', 'One switch of Advanced Audit Policy; equals the Task of the event.'],
  ['auditpol', '/get /set /backup /restore.'],
  ['Command line in 4688', 'Separate policy; needs 4688 version 1+.'],
  ['Script Block logging', '4104 with the text of PowerShell code.'],
  ['Downgrade attack', 'Run an older engine to avoid logging.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Missing events are usually missing configuration — check before the incident.</li>
<li>Use Advanced Audit Policy + force subcategory settings; follow Microsoft's role baselines.</li>
<li>Turn on command lines and Script Block logging; grow the logs accordingly.</li>
<li>From a log alone, infer coverage via Task, 4688 version and empty fields.</li>
</ul>
${nguon('📘', 'Microsoft Learn — auditpol', 'get, set, backup, restore', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/auditpol')}
${nguon('📘', 'Microsoft Learn — Audit Policy Recommendations', 'Baselines per role', 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations')}
${nguon('📘', 'Microsoft Learn — Command line process auditing', 'The policy, the registry value, what 4688 shows', 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing')}
${nguon('📘', 'Microsoft Learn — about_Logging_Windows', 'PowerShell 7 logging, PowerShellCore/Operational, RegisterManifest', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows')}
${nguon('📰', 'Microsoft PowerShell Team — PowerShell ♥ the Blue Team (9/6/2015)', 'Script block logging, automatic logging of suspicious blocks', 'https://devblogs.microsoft.com/powershell/powershell-the-blue-team/')}
${nguon('🛡️', 'MITRE ATT&CK C0024 — SolarWinds Compromise', 'APT29 used AUDITPOL to prevent the collection of audit logs', 'https://attack.mitre.org/campaigns/C0024/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-6-tien-trinh-tac-vu', title: 'Lesson 4.6 — Processes, tasks and PowerShell', sub: 'Reading 4688 and 4104 in detail', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-6-sysmon', title: 'Lesson 5.6 — Sysmon', sub: 'When built-in auditing is not enough', cta: 'Next' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Windows chỉ ghi những gì được bảo ghi</h2>
<p class="lead">Chương 3–4 đọc những sự kiện có sẵn. Câu hỏi khó chịu của mọi cuộc điều tra lại là chiều ngược: <em>"Sao không có 4688? Không có 4104? Không có 4663?"</em> — thường là vì chẳng ai bật nó. Bài này chỉ ra công tắc nằm ở đâu (audit policy, ghi kèm dòng lệnh, log PowerShell), cách bật an toàn, và cách nhìn riêng vào log mà biết một máy đã được cấu hình để ghi những gì.</p>

<h3>Liên tưởng đời thường: camera an ninh chưa từng được cắm điện</h3>
<p>Một toà nhà có thể có camera ở mọi tầng mà vẫn không ghi được gì trong phòng máy chủ, vì cái camera đó chưa bao giờ được nối dây. Sau vụ đột nhập, bảo vệ nói "mất đoạn phim" — thật ra nó chưa từng tồn tại. Audit policy là sơ đồ nối dây camera của Windows; kiểm nó <em>trước</em> sự cố là một phần công việc.</p>

${kv([
  ['Basic audit policy', '9 nhóm cũ (Audit logon events, Audit process tracking…) — công tắc thô.'],
  ['Advanced Audit Policy', '10 nhóm, hàng chục subcategory (Logon, Process Creation, File Share, Audit Policy Change…) — loại hiện đại, chi tiết.'],
  ['Force audit policy subcategory settings', 'Tuỳ chọn bảo mật khiến Advanced đè lên Basic. Trộn cả hai mà thiếu nó là gặp "thiết lập của tôi không ăn".'],
  ['auditpol', 'Dòng lệnh cho Advanced Audit Policy: /get, /set, /list, /backup, /restore, /clear.'],
  ['ProcessCreationIncludeCmdLine_Enabled', 'Chính sách "Include command line in process creation events" → có CommandLine trong 4688.'],
  ['4103 / 4104', 'Log Module / log Script Block của PowerShell (Microsoft-Windows-PowerShell/Operational).'],
])}

<h3>Bước 1 — xem chính sách hiện tại (Windows, quyền quản trị)</h3>
<pre><code class="language-bat">:: Mọi subcategory và thiết lập của nó (No Auditing / Success / Failure / Success and Failure)
auditpol /get /category:*

:: Chỉ một subcategory
auditpol /get /subcategory:"Process Creation"

:: Kết quả thực tế của Group Policy, gồm cả Advanced Audit Policy
gpresult /h C:\\lab\\gp.html</code></pre>
<p>Trên một máy trạm Windows mới cài, rất nhiều thứ là "No Auditing" — ví dụ <strong>Process Creation</strong>. Domain controller và máy chủ bật sẵn nhiều hơn, nhưng vẫn không có dòng lệnh, không có script block PowerShell, và không có truy cập tệp.</p>

<h3>Bước 2 — suy ra chính sách từ log (không cần Windows)</h3>
<p>Nhiều khi bạn chỉ nhận được log. Log Security cho biết điều gì đang được kiểm toán: mỗi sự kiện mang một số <strong>Task</strong> = subcategory của nó (12544 Logon, 13312 Process Creation, 13824 User Account Management…). <code>Kiem-DoPhu.ps1</code> đếm sự kiện theo subcategory và kiểm ba thứ hay thiếu nhất:</p>
${ma('powershell', 's05/mau/Kiem-DoPhu.ps1.txt')}
${lenh('s05/audit-policy', 0)}
${lenh('s05/audit-policy', 1)}
${lenh('s05/audit-policy', 2)}
<p>Bảy máy, ba tình huống — đúng như bạn gặp ở các công ty thật:</p>
<ul>
<li><strong>Không có 4688 nào</strong> (IE8Win7, IE9Win7, WIN-03DLIIOFRRA, hai máy 37L…): Process Creation không được kiểm toán. Nếu mã độc từng chạy ở đó, log Security không kể được.</li>
<li><strong>Có 4688 nhưng thiếu CommandLine</strong> (DESKTOP-0QT8017: 142 sự kiện, WIN-LL0C19JS506: 12): bạn biết <code>powershell.exe</code> <em>đã</em> chạy, không biết nó chạy <em>cái gì</em> — Bài 5.4 đã cho thấy điều đó tốn bao nhiêu công suy luận.</li>
<li><strong>4688 có CommandLine</strong> (IE10Win7: 7472 trên 8346): trạng thái tốt.</li>
</ul>
<p>Thêm nữa: <em>không</em> máy nào trong bảy máy có lấy một 4625. Hoặc chẳng ai từng gõ sai mật khẩu, hoặc Logon chỉ được kiểm toán phần Success — trên máy thật thì kiểm bằng <code>auditpol /get /subcategory:Logon</code>. "Audit Policy Change" với hàng nghìn 4907 (DESKTOP-0QT8017: 6103) là vấn đề ngược lại: tiếng ồn do đổi SACL của đối tượng khi cập nhật (Bài 3.5).</p>

<div class="callout"><p><strong>Bảng Task → subcategory</strong> (<code>task-subcategory.tsv</code>) lấy từ tài liệu subcategory kiểm toán của Microsoft; ba dòng (12544 Logon, 13824 User Account Management, 13826 Security Group Management) được xác nhận trực tiếp bằng <code>RenderingInfo</code> của các sự kiện chuyển tiếp ở Bài 5.7, vốn mang sẵn tên hiển thị bên cạnh con số.</p></div>

<h3>Bước 3 — bật những gì cần (làm trong máy ảo trước)</h3>
<pre><code class="language-bat">:: 1) Cho Advanced Audit Policy thắng các nhóm cơ bản cũ
::    (GPO: Security Options › "Audit: Force audit policy subcategory settings…" = Enabled)
reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa /v SCENoApplyLegacyAuditPolicy /t REG_DWORD /d 1 /f

:: 2) Mức tối thiểu hợp lý cho máy chủ thành viên / máy trạm
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Special Logon" /success:enable
auditpol /set /subcategory:"Process Creation" /success:enable
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable
auditpol /set /subcategory:"Security Group Management" /success:enable
auditpol /set /subcategory:"Audit Policy Change" /success:enable
auditpol /set /subcategory:"Security System Extension" /success:enable
auditpol /set /subcategory:"Other Object Access Events" /success:enable

:: 3) Dòng lệnh trong 4688 (GPO: Administrative Templates › System › Audit Process Creation)
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f

:: 4) Lưu / khôi phục toàn bộ chính sách (trước khi đổi, để đính vào ticket)
auditpol /backup /file:C:\\lab\\audit-truoc.csv
auditpol /restore /file:C:\\lab\\audit-truoc.csv</code></pre>
<pre><code class="language-powershell"># 5) Windows PowerShell 5.1 — log Script Block + Module (GPO: Administrative Templates › Windows Components › Windows PowerShell)
New-Item -Path HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging -Force | Out-Null
Set-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging EnableScriptBlockLogging 1
New-Item -Path HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging\\ModuleNames -Force | Out-Null
Set-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging EnableModuleLogging 1
Set-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ModuleLogging\\ModuleNames '*' '*'

# 6) PowerShell 7 ghi vào log RIÊNG "PowerShellCore/Operational" — đăng ký một lần
& "$PSHOME\\RegisterManifest.ps1"

# 7) Rồi nới chỗ (Bài 3.5): kiểm toán tiến trình + script block nhân khối lượng lên nhiều lần
wevtutil sl Security /ms:1073741824
wevtutil sl Microsoft-Windows-PowerShell/Operational /ms:268435456</code></pre>
<p>Trang "Audit Policy Recommendations" của Microsoft có bảng nền theo vai trò (máy trạm, máy chủ thành viên, domain controller) — dùng nó thay vì "bật hết": Object Access › File System hay Filtering Platform Connection trên máy chủ bận có thể sinh hàng triệu sự kiện mỗi ngày (mẫu máy chủ 62 000 sự kiện ở Bài 5.4 có 78 % là sự kiện kết nối WFP — Bài 3.5).</p>

<h3>Bước 4 — log PowerShell mang lại gì</h3>
${lenh('s05/audit-policy', 3)}
<p>Một dòng của mẫu thật: log Script Block (4104) bắt được đúng câu lệnh <code>IEX(New-Object Net.WebClient).downloadString('https://…')</code> — "tải một script về rồi chạy ngay trong bộ nhớ", khuôn mẫu mà Bài 4.6 đã giải mã chi tiết. Không có 4104, dấu vết duy nhất sẽ là một 4688 cho <code>powershell.exe</code> (nếu bật Process Creation) và một kết nối mạng. Để ý Level: 4104 bình thường là <strong>Verbose</strong>; PowerShell 5 còn tự động ghi những script block nó coi là đáng ngờ ở mức <strong>Warning</strong> kể cả khi chưa bật log Script Block (nhóm PowerShell của Microsoft, "PowerShell ♥ the Blue Team", 2015) — một "bản ghi cứu cánh cuối cùng", không thay thế được việc bật đầy đủ.</p>

<h3>🛡️ Góc hacker: tắt camera đi</h3>
<p>Vì audit policy chỉ là một thiết lập, kẻ tấn công đổi nó. MITRE ghi nhận trong <strong>vụ SolarWinds</strong> (chiến dịch C0024, 2020) APT29 "dùng AUDITPOL để ngăn việc thu log kiểm toán" (T1685.001 Disable or Modify Windows Event Log). Dấu vết là 4719 "System audit policy was changed" (Bài 4.3) — nếu chính Audit Policy Change được kiểm toán. Mánh thứ hai là <strong>tấn công hạ cấp</strong> (ATT&amp;CK T1689, số cũ T1562.010): chạy <code>powershell.exe -Version 2</code>, một bộ máy ra đời trước log Script Block, nên 4104 không bao giờ xuất hiện. Phòng thủ: kiểm toán Audit Policy Change, chuyển tiếp 4719 ra khỏi máy, và gỡ tính năng tuỳ chọn "Windows PowerShell 2.0".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Máy chủ này không có 4688. Vì sao, sửa thế nào?" — subcategory Process Creation không được kiểm toán; <code>auditpol /set /subcategory:"Process Creation" /success:enable</code> cộng chính sách dòng lệnh, qua GPO nếu nhiều máy.</li>
<li>"Basic khác Advanced audit policy thế nào?" — 9 nhóm thô so với hàng chục subcategory chi tiết; bật "Force audit policy subcategory settings" để chúng không giẫm chân nhau.</li>
<li>"4103 khác 4104 thế nào?" — chi tiết thực thi module/đường ống, so với toàn văn script block.</li>
<li>"Nhìn log thì biết điều gì đã được kiểm toán bằng cách nào?" — Task/subcategory của các sự kiện có mặt; phiên bản 4688 và CommandLine rỗng; lịch sử 4719.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Trong hợp đồng outsourcing, audit policy thuộc về đội bảo mật/hạ tầng của khách, không phải lập trình viên. Đóng góp thực tế của bạn: khi bàn giao một máy chủ Windows cho ứng dụng, kèm một trang "sẵn sàng về log" — output của <code>auditpol /get /category:*</code>, kích thước log Security, 4688 có dòng lệnh chưa, trạng thái log PowerShell — và đánh dấu chỗ thiếu. Trang đó là thứ người ứng cứu sự cố sẽ ước là có, khi chuyện xảy ra vào năm thứ hai.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>Kiem-DoPhu.ps1</code> trên <code>mau/Archive-ForwardedEvents-test.evtx</code>. slad1 kiểm toán những subcategory nào? Có kết luận được gì về Process Creation trên slad1 không?</li>
<li>Trên máy ảo Windows: <code>auditpol /backup</code>, bật Process Creation + dòng lệnh, chạy <code>cmd /c whoami</code>, tìm 4688, rồi <code>auditpol /restore</code>. Có 4719 xuất hiện không?</li>
<li>Viết ba giá trị registry cần cho log Script Block trong PowerShell 5.1 và nói PowerShell 7 ghi sự kiện vào đâu.</li>
</ol>
<p><strong>Đạt:</strong> (1) Logon, User Account Management, Security Group Management (theo những gì được chuyển tiếp); không — máy gom chỉ nhận thứ subscription chọn, nên thiếu 4688 trong ForwardedEvents không nói gì về audit policy của máy nguồn (Bài 5.7); (2) có, mỗi subcategory bị đổi một 4719, cộng 4688 có CommandLine <code>cmd /c whoami</code>; (3) EnableScriptBlockLogging = 1 dưới …\\PowerShell\\ScriptBlockLogging (tuỳ chọn thêm EnableModuleLogging + ModuleNames) — PowerShell 7 → PowerShellCore/Operational sau khi chạy RegisterManifest.ps1.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Subcategory', 'Một công tắc của Advanced Audit Policy; bằng Task của sự kiện.'],
  ['auditpol', '/get /set /backup /restore.'],
  ['Dòng lệnh trong 4688', 'Chính sách riêng; cần 4688 phiên bản 1 trở lên.'],
  ['Log Script Block', '4104 chứa văn bản mã PowerShell.'],
  ['Tấn công hạ cấp', 'Chạy bộ máy cũ hơn để né log.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thiếu sự kiện thường là thiếu cấu hình — kiểm trước khi có sự cố.</li>
<li>Dùng Advanced Audit Policy + force subcategory settings; theo bảng nền của Microsoft cho từng vai trò.</li>
<li>Bật dòng lệnh và log Script Block; nới log cho tương xứng.</li>
<li>Chỉ có log trong tay, suy ra độ phủ qua Task, phiên bản 4688 và trường rỗng.</li>
</ul>
${nguon('📘', 'Microsoft Learn — auditpol', 'get, set, backup, restore', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/auditpol')}
${nguon('📘', 'Microsoft Learn — Audit Policy Recommendations', 'Bảng nền theo vai trò', 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations')}
${nguon('📘', 'Microsoft Learn — Command line process auditing', 'Chính sách, giá trị registry, những gì 4688 hiện ra', 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing')}
${nguon('📘', 'Microsoft Learn — about_Logging_Windows', 'Log của PowerShell 7, PowerShellCore/Operational, RegisterManifest', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows')}
${nguon('📰', 'Microsoft PowerShell Team — PowerShell ♥ the Blue Team (9/6/2015)', 'Log script block, tự động ghi script block đáng ngờ', 'https://devblogs.microsoft.com/powershell/powershell-the-blue-team/')}
${nguon('🛡️', 'MITRE ATT&CK C0024 — SolarWinds Compromise', 'APT29 dùng AUDITPOL để ngăn thu log kiểm toán', 'https://attack.mitre.org/campaigns/C0024/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-6-tien-trinh-tac-vu', title: 'Bài 4.6 — Tiến trình, tác vụ và PowerShell', sub: 'Đọc 4688 và 4104 chi tiết', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-6-sysmon', title: 'Bài 5.6 — Sysmon', sub: 'Khi kiểm toán dựng sẵn chưa đủ', cta: 'Bài tiếp' })}
</div>
`,
};
