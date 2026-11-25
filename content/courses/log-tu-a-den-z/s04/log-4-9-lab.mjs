/**
 * 4.9 — Lab 4 (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/lab4'] (bảng tra từ 40 tệp mẫu + 6 thẻ sự kiện) và OUT['s04/tai-mau'] (tải 40 tệp, kiểm SHA256: 40 OK).
 * Phần A chạy trên MÁY ẢO Windows của người học — máy soạn là Linux, điều phối không cho dựng VM ⇒ khối lệnh, không kèm output giả.
 * Đáp án thẻ: A 4625 SMB đoán mật khẩu (Administrator, 0xc000006a, máy khách ngẫu nhiên); B 7045 Metasploit psexec; C 4697 dịch vụ rdphijack2 = tscon (chiếm phiên); D 4732 IEUser vào Administrators lúc cài máy IE8Win7 (bình thường);
 * E 4722 bật Guest trên jump01 bởi admmig (đáng ngờ); F 1102 user01 xoá Security trên PC01.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.9 — Lab 4 — Build your own event cheat sheet by triggering each event safely in a VM|||4.9 — Lab 4 — Tự làm bảng tra mã sự kiện bằng cách tạo từng sự kiện một cách an toàn trong máy ảo',
  slug: 'log-4-9-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba phần: (A) trong máy ảo Windows của bạn, tự gây ra từng sự kiện — sai mật khẩu, khoá tài khoản, tạo người dùng, thêm vào Administrators, cài dịch vụ thử, đổi audit policy, tắt Defender, xoá log, reset cứng — và xuất XML; (B) dựng bảng tra từ 40 tệp EVTX mẫu công khai; (C) đọc sáu "thẻ sự kiện" thật và kể chuyện gì đã xảy ra. Lời giải che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab 4</span>
<h2>Make every event happen once — then you will never forget it</h2>
<p class="lead">Reading about 4740 is not the same as watching your own account lock and finding the event. In this lab you trigger the key events of Chapter 4 yourself, in a throw-away virtual machine, and build a one-page cheat sheet with the XML of each. Then you practise on the real public samples: a table of what exists where, and six event "cards" to read like sentences.</p>

<div class="pitfall co-tieu-de"><p><strong>Only in a VM you can throw away.</strong> Part A clears logs, disables Defender and hard-resets the machine. Use a Windows 10/11 or Server evaluation VM (Hyper-V, VirtualBox, VMware — Lesson 0.1), take a snapshot before you start, and revert it at the end. Never do this on your own PC, a school machine or a company server.</p></div>

<h3>Part A — trigger the events in your VM (60 min)</h3>
<p>Open PowerShell <strong>as administrator</strong> in the VM. After each block, note the time; at the end you will collect everything at once.</p>
<pre><code class="language-powershell"># 0. Prepare: snapshot taken? Turn on what Windows does not audit by default (Lesson 5.5)
auditpol /set /subcategory:"Process Creation" /success:enable            # → 4719 + from now on 4688
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f
net accounts /lockoutthreshold:3 /lockoutwindow:15 /lockoutduration:15   # lockout after 3 bad passwords

# 1. Accounts: create, add to Administrators, flags (→ 4720 4722 4724 4738 4732)
net user lab4 'Lab4-Pass!2026' /add
net localgroup Administrators lab4 /add
net user lab4 /expires:never

# 2. Wrong password three times, then once more (→ 4625 ×3, 4740; the 4th try fails with 0xC0000234)
#    Run each line and type a WRONG password when asked:
runas /user:lab4 cmd
runas /user:lab4 cmd
runas /user:lab4 cmd
runas /user:lab4 cmd
#    Unlock: lusrmgr.msc › Users › lab4 › untick "Account is locked out"  (→ 4767)

# 3. A test service that is not really a service (→ 7045, then 7009/7000 when started; 4697 if auditing "Security System Extension")
sc.exe create lab4svc binPath= "C:\\Windows\\System32\\cmd.exe /c exit" start= demand
sc.exe start lab4svc
sc.exe delete lab4svc

# 4. Scheduled task (→ 4698, 4702, 4699 if "Other Object Access Events" is audited)
schtasks /create /tn Lab4Task /tr "cmd.exe /c echo lab4" /sc daily /st 03:00 /ru SYSTEM
schtasks /change /tn Lab4Task /st 04:00
schtasks /delete /tn Lab4Task /f

# 5. Time change (→ 4616), Defender (→ 5001, then 5000/5013), PowerShell (→ 4104)
Set-Date (Get-Date).AddMinutes(5); Set-Date (Get-Date).AddMinutes(-5)
Set-MpPreference -DisableRealtimeMonitoring $true      # blocked with 5013 if Tamper Protection is on — that is also a result
Set-MpPreference -DisableRealtimeMonitoring $false
powershell -NoProfile -Command "Write-Output 'lab4 script block'"

# 6. Clean up the account, then clear Application and Security (→ 4726, 104, 1102)
net user lab4 /delete
wevtutil cl Application
wevtutil cl Security

# 7. Hard reset the VM from the hypervisor (Reset / Power off) — after reboot: Kernel-Power 41 + EventLog 6008</code></pre>
<p>Collect after the reboot — one XML file per event ID, the first one of each:</p>
<pre><code class="language-powershell">$ra = 'C:\\lab4'; New-Item -ItemType Directory -Force $ra | Out-Null
$muc = @{ Security = 4719,4688,4720,4722,4724,4738,4732,4625,4740,4767,4697,4698,4702,4616,4726,1102
          System = 7045,7009,7000,104,41,6008,6005,6006,1074
          'Microsoft-Windows-Windows Defender/Operational' = 5001,5013
          'Microsoft-Windows-PowerShell/Operational' = 4104 }
foreach ($log in $muc.Keys) { foreach ($id in $muc[$log]) {
  $e = Get-WinEvent -FilterHashtable @{ LogName = $log; Id = $id } -MaxEvents 1 -ErrorAction SilentlyContinue
  if ($e) { $e.ToXml() | Set-Content "$ra\\$id.xml"; '{0,-6} {1}' -f $id, $e.TimeCreated } else { '{0,-6} (không có — vì sao?)' -f $id } } }</code></pre>
<p>Expected surprises (that is the point): Security was cleared in step 6, so only events <em>after</em> 1102 remain there — you must collect Security events before step 6, or export the log first (<code>wevtutil epl Security C:\\lab4\\sec.evtx</code>). 4697/4699 appear only if their subcategories are audited. Write down every "why is it missing?" — each answer is a line of your cheat sheet.</p>

<details>
<summary><strong>Checklist for Part A — what you should end up with</strong></summary>
<p>A folder of XML files and a one-page table with columns: <em>Event ID · log · what I did · key fields (Logon Type, Sub Status, TargetUserName, Caller Computer Name, ImagePath, PreviousTime/NewTime, BugcheckCode…) · audited by default?</em>. Typical findings: 4688 only after step 0; 4740's TargetDomainName = your VM's name (the caller); 7045 ImagePath = the cmd.exe line; 7000/7009 because cmd.exe never talks to the SCM; 1102 is the first record of the new Security log and its record number continues the old numbering; 41 has BugcheckCode 0 and PowerButtonTimestamp 0 (reset = "power loss" shape, Lesson 4.4); with Tamper Protection on, 5013 instead of 5001.</p>
</details>

<h3>Part B — a cheat sheet from 40 real samples (20 min)</h3>
<p>Download the chapter's sample pack (40 public EVTX files, ~3 MB) and check every SHA256:</p>
${ma('powershell', 's04/mau/tai-mau-ch4.ps1.txt')}
${lenh('s04/tai-mau', 0)}
<p>Then list which (log, Event ID) exists in which file:</p>
${lenh('s04/lab4', 0)}
<p><strong>Task:</strong> copy the table and add a column "meaning in 8 words" and a column "lesson". Mark the IDs you would alert on every time.</p>
<details>
<summary><strong>Solution B — the alert-every-time column</strong></summary>
<p>Always alert: <strong>1102, 104</strong> (log cleared — 4.3), <strong>4719</strong> by a person (4.3), <strong>4720, 4732</strong> into Administrators/Backup Operators (4.2), <strong>7045</strong> outside a change window (4.5), <strong>4697</strong>, <strong>4698/4702</strong> running as SYSTEM or from a user folder (4.6), <strong>5007</strong> touching Exclusions and <strong>5001</strong> (4.8), <strong>4778</strong> with an account different from the connecting one (4.7), <strong>1116 without 1117</strong>. Alert on thresholds/patterns: 4625 bursts (4.1), 1149/4624 type 10 from public IPs or across many hosts (4.7), 4616 jumps &gt; a few minutes (4.3). Context only: 4624 type 5, 7036, 4634, 4672 for SYSTEM.</p>
</details>

<h3>Part C — six event cards: what happened? (25 min)</h3>
<p>Each card is one real event (time UTC, ID, log, machine, key data). For each, write: what happened, normal or suspicious, and the next query you would run.</p>
${lenh('s04/lab4', 1)}
${lenh('s04/lab4', 2)}
${lenh('s04/lab4', 3)}
${lenh('s04/lab4', 4)}
${lenh('s04/lab4', 5)}
${lenh('s04/lab4', 6)}
<details>
<summary><strong>Solution C — cards A to F</strong></summary>
<ul>
<li><strong>A</strong> — 4625, type 3, Administrator, 0xC000006D/0xC000006A (wrong password) from 192.168.198.149, client name random letters: one attempt of an automated SMB password-guessing run. Next: count 4625 from that IP per minute, and look for the first 4624 from it (Lesson 4.1).</li>
<li><strong>B</strong> — 7045: random service name, random .exe in %SYSTEMROOT%, LocalSystem, demand start: remote execution by an attack tool (Metasploit psexec style). Next: 4624 type 3 just before (source IP), 7036, 104/1102 (Lesson 4.5).</li>
<li><strong>C</strong> — 4697 (Security twin of 7045): service <code>rdphijack2</code> whose file is <code>cmd.exe /k tscon 2 /dest rdp-tcp#14</code> — a service used to run tscon as SYSTEM and hijack RDP session 2. Next: 4778/4779 for rdp-tcp#14 (Lesson 4.7).</li>
<li><strong>D</strong> — 4732: SID …-1000 added to Administrators by the machine account WIN-QALA5Q3KJ43$ on IE8Win7 in October 2013: the first user created during Windows setup (the "IEUser" of Microsoft's test VMs). Normal. Next: confirm it is the same minute as the setup's 4720.</li>
<li><strong>E</strong> — 4722: the built-in <strong>Guest</strong> account (RID 501) enabled by admmig on a jump server. Suspicious: Guest should stay disabled; an enabled Guest is an easy backdoor. Next: 4724/4738 for Guest, 4624 by Guest afterwards (Lesson 4.2).</li>
<li><strong>F</strong> — 1102: user01 of domain EXAMPLE cleared the Security log on PC01. Always an incident until explained. Next: Logon ID 0x17dad → 4624 (from where?), and everything this machine sent to the SIEM before the clear (Lesson 4.3).</li>
</ul>
</details>

<h3>Pass criteria</h3>
<div class="callout ok"><ul>
<li>Part A: at least 18 of the 24 IDs collected as XML, and a written reason for each missing one.</li>
<li>Part B: the table with meaning + lesson + "alert always / pattern / context".</li>
<li>Part C: six cards answered with the evidence field named (not "it looks bad").</li>
<li>VM reverted to the snapshot; the lab account and task do not exist anywhere else.</li>
</ul></div>

<h3>At work</h3>
<p>This one-page sheet is the kind of thing you will pin next to your screen during the first months of an OJT in a support or SOC team — and the "why is it missing" notes are what interviewers love to hear: they show you know logging is configured, not magic.</p>

${nguon('📦', 'Yamato-Security/hayabusa-sample-evtx', 'The public EVTX collection used in this chapter (EVTX-ATTACK-SAMPLES, EVTX-to-MITRE-Attack, DeepBlueCLI…)', 'https://github.com/Yamato-Security/hayabusa-sample-evtx')}
${nguon('📘', 'Microsoft Learn — Advanced security audit policy settings', 'What each subcategory logs, and defaults', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/advanced-security-audit-policy-settings')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-0-1-moi-truong-lab', title: 'Lesson 0.1 — Setting up a safe lab', sub: 'Windows VM with snapshots', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-5-audit-policy', title: 'Lesson 5.5 — Audit policy', sub: 'Why some IDs were missing in Part A', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab 4</span>
<h2>Tự làm cho từng sự kiện xảy ra một lần — rồi sẽ không bao giờ quên</h2>
<p class="lead">Đọc về 4740 không giống với tận mắt thấy tài khoản của mình bị khoá rồi đi tìm sự kiện. Trong lab này bạn tự gây ra các sự kiện chính của Chương 4 trong một máy ảo dùng xong vứt, và làm một bảng tra một trang kèm XML của từng sự kiện. Sau đó bạn luyện trên các mẫu công khai thật: một bảng xem cái gì có ở đâu, và sáu "thẻ sự kiện" để đọc như đọc câu.</p>

<div class="pitfall co-tieu-de"><p><strong>Chỉ làm trong máy ảo vứt đi được.</strong> Phần A xoá log, tắt Defender và reset cứng máy. Dùng máy ảo Windows 10/11 hoặc Server bản đánh giá (Hyper-V, VirtualBox, VMware — Bài 0.1), chụp snapshot trước khi bắt đầu, và quay về snapshot khi xong. Đừng bao giờ làm trên máy của chính bạn, máy của trường hay máy chủ của công ty.</p></div>

<h3>Phần A — gây ra các sự kiện trong máy ảo (60 phút)</h3>
<p>Mở PowerShell <strong>bằng quyền quản trị</strong> trong máy ảo. Sau mỗi khối, ghi lại giờ; cuối cùng bạn sẽ thu gom tất cả một lần.</p>
<pre><code class="language-powershell"># 0. Chuẩn bị: đã chụp snapshot chưa? Bật những thứ Windows mặc định không kiểm toán (Bài 5.5)
auditpol /set /subcategory:"Process Creation" /success:enable            # → 4719 + từ giờ có 4688
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Audit /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f
net accounts /lockoutthreshold:3 /lockoutwindow:15 /lockoutduration:15   # khoá sau 3 lần sai mật khẩu

# 1. Tài khoản: tạo, thêm vào Administrators, đổi cờ (→ 4720 4722 4724 4738 4732)
net user lab4 'Lab4-Pass!2026' /add
net localgroup Administrators lab4 /add
net user lab4 /expires:never

# 2. Sai mật khẩu ba lần, rồi thêm một lần (→ 4625 ×3, 4740; lần thứ 4 thất bại với 0xC0000234)
#    Chạy từng dòng và gõ SAI mật khẩu khi được hỏi:
runas /user:lab4 cmd
runas /user:lab4 cmd
runas /user:lab4 cmd
runas /user:lab4 cmd
#    Mở khoá: lusrmgr.msc › Users › lab4 › bỏ chọn "Account is locked out"  (→ 4767)

# 3. Một dịch vụ thử không thật sự là dịch vụ (→ 7045, rồi 7009/7000 khi chạy; 4697 nếu kiểm toán "Security System Extension")
sc.exe create lab4svc binPath= "C:\\Windows\\System32\\cmd.exe /c exit" start= demand
sc.exe start lab4svc
sc.exe delete lab4svc

# 4. Tác vụ hẹn giờ (→ 4698, 4702, 4699 nếu kiểm toán "Other Object Access Events")
schtasks /create /tn Lab4Task /tr "cmd.exe /c echo lab4" /sc daily /st 03:00 /ru SYSTEM
schtasks /change /tn Lab4Task /st 04:00
schtasks /delete /tn Lab4Task /f

# 5. Đổi giờ (→ 4616), Defender (→ 5001, rồi 5000/5013), PowerShell (→ 4104)
Set-Date (Get-Date).AddMinutes(5); Set-Date (Get-Date).AddMinutes(-5)
Set-MpPreference -DisableRealtimeMonitoring $true      # bị chặn kèm 5013 nếu bật Tamper Protection — đó cũng là một kết quả
Set-MpPreference -DisableRealtimeMonitoring $false
powershell -NoProfile -Command "Write-Output 'lab4 script block'"

# 6. Dọn tài khoản, rồi xoá Application và Security (→ 4726, 104, 1102)
net user lab4 /delete
wevtutil cl Application
wevtutil cl Security

# 7. Reset cứng máy ảo từ phần mềm ảo hoá (Reset / Power off) — sau khi khởi động lại: Kernel-Power 41 + EventLog 6008</code></pre>
<p>Thu gom sau khi khởi động lại — mỗi Event ID một tệp XML, lấy cái đầu tiên tìm được:</p>
<pre><code class="language-powershell">$ra = 'C:\\lab4'; New-Item -ItemType Directory -Force $ra | Out-Null
$muc = @{ Security = 4719,4688,4720,4722,4724,4738,4732,4625,4740,4767,4697,4698,4702,4616,4726,1102
          System = 7045,7009,7000,104,41,6008,6005,6006,1074
          'Microsoft-Windows-Windows Defender/Operational' = 5001,5013
          'Microsoft-Windows-PowerShell/Operational' = 4104 }
foreach ($log in $muc.Keys) { foreach ($id in $muc[$log]) {
  $e = Get-WinEvent -FilterHashtable @{ LogName = $log; Id = $id } -MaxEvents 1 -ErrorAction SilentlyContinue
  if ($e) { $e.ToXml() | Set-Content "$ra\\$id.xml"; '{0,-6} {1}' -f $id, $e.TimeCreated } else { '{0,-6} (không có — vì sao?)' -f $id } } }</code></pre>
<p>Những bất ngờ sẽ gặp (đó chính là mục đích): Security đã bị xoá ở bước 6, nên ở đó chỉ còn các sự kiện <em>sau</em> 1102 — bạn phải thu gom sự kiện Security trước bước 6, hoặc xuất log ra trước (<code>wevtutil epl Security C:\\lab4\\sec.evtx</code>). 4697/4699 chỉ xuất hiện khi nhóm con của chúng được kiểm toán. Ghi lại mọi câu "vì sao thiếu?" — mỗi câu trả lời là một dòng trong bảng tra của bạn.</p>

<details>
<summary><strong>Danh sách kiểm cho Phần A — cuối cùng bạn phải có gì</strong></summary>
<p>Một thư mục các tệp XML và một bảng một trang với các cột: <em>Event ID · log · tôi đã làm gì · trường chính (Logon Type, Sub Status, TargetUserName, Caller Computer Name, ImagePath, PreviousTime/NewTime, BugcheckCode…) · mặc định có kiểm toán không?</em>. Phát hiện thường gặp: 4688 chỉ có sau bước 0; TargetDomainName của 4740 = tên máy ảo của bạn (máy gây khoá); ImagePath của 7045 = dòng cmd.exe; 7000/7009 vì cmd.exe không bao giờ nói chuyện với SCM; 1102 là bản ghi đầu tiên của log Security mới và số bản ghi của nó nối tiếp số cũ; 41 có BugcheckCode 0 và PowerButtonTimestamp 0 (reset = hình dạng "mất điện", Bài 4.4); có Tamper Protection thì gặp 5013 thay cho 5001.</p>
</details>

<h3>Phần B — bảng tra từ 40 mẫu thật (20 phút)</h3>
<p>Tải bộ mẫu của chương (40 tệp EVTX công khai, ~3 MB) và kiểm SHA256 từng tệp:</p>
${ma('powershell', 's04/mau/tai-mau-ch4.ps1.txt')}
${lenh('s04/tai-mau', 0)}
<p>Rồi liệt kê cặp (log, Event ID) nào có trong tệp nào:</p>
${lenh('s04/lab4', 0)}
<p><strong>Việc cần làm:</strong> chép bảng và thêm một cột "nghĩa trong 8 từ" và một cột "bài". Đánh dấu những ID bạn sẽ cảnh báo mọi lần.</p>
<details>
<summary><strong>Lời giải B — cột "cảnh báo mọi lần"</strong></summary>
<p>Luôn cảnh báo: <strong>1102, 104</strong> (xoá log — 4.3), <strong>4719</strong> do một người (4.3), <strong>4720, 4732</strong> vào Administrators/Backup Operators (4.2), <strong>7045</strong> ngoài khung giờ thay đổi (4.5), <strong>4697</strong>, <strong>4698/4702</strong> chạy dưới SYSTEM hoặc từ thư mục người dùng (4.6), <strong>5007</strong> đụng Exclusions và <strong>5001</strong> (4.8), <strong>4778</strong> với tài khoản khác tài khoản đã kết nối (4.7), <strong>1116 không có 1117</strong>. Cảnh báo theo ngưỡng/hình dạng: chuỗi 4625 dồn dập (4.1), 1149/4624 type 10 từ IP công cộng hoặc trên nhiều máy (4.7), 4616 nhảy &gt; vài phút (4.3). Chỉ để làm bối cảnh: 4624 type 5, 7036, 4634, 4672 của SYSTEM.</p>
</details>

<h3>Phần C — sáu thẻ sự kiện: chuyện gì đã xảy ra? (25 phút)</h3>
<p>Mỗi thẻ là một sự kiện thật (giờ UTC, ID, log, máy, dữ liệu chính). Với mỗi thẻ, viết: chuyện gì đã xảy ra, bình thường hay đáng ngờ, và câu truy vấn tiếp theo bạn sẽ chạy.</p>
${lenh('s04/lab4', 1)}
${lenh('s04/lab4', 2)}
${lenh('s04/lab4', 3)}
${lenh('s04/lab4', 4)}
${lenh('s04/lab4', 5)}
${lenh('s04/lab4', 6)}
<details>
<summary><strong>Lời giải C — thẻ A tới F</strong></summary>
<ul>
<li><strong>A</strong> — 4625, type 3, Administrator, 0xC000006D/0xC000006A (sai mật khẩu) từ 192.168.198.149, tên máy khách là chữ ngẫu nhiên: một lần thử trong đợt đoán mật khẩu SMB tự động. Tiếp theo: đếm 4625 từ IP đó theo phút, và tìm 4624 đầu tiên từ nó (Bài 4.1).</li>
<li><strong>B</strong> — 7045: tên dịch vụ ngẫu nhiên, tệp .exe ngẫu nhiên trong %SYSTEMROOT%, LocalSystem, demand start: chạy lệnh từ xa bằng công cụ tấn công (kiểu Metasploit psexec). Tiếp theo: 4624 type 3 ngay trước đó (IP nguồn), 7036, 104/1102 (Bài 4.5).</li>
<li><strong>C</strong> — 4697 (bản sinh đôi trong Security của 7045): dịch vụ <code>rdphijack2</code> có tệp là <code>cmd.exe /k tscon 2 /dest rdp-tcp#14</code> — một dịch vụ dùng để chạy tscon dưới SYSTEM và chiếm phiên RDP số 2. Tiếp theo: 4778/4779 cho rdp-tcp#14 (Bài 4.7).</li>
<li><strong>D</strong> — 4732: SID …-1000 được thêm vào Administrators bởi tài khoản máy WIN-QALA5Q3KJ43$ trên IE8Win7 tháng 10/2013: người dùng đầu tiên được tạo lúc cài Windows (chính "IEUser" của các máy ảo thử nghiệm của Microsoft). Bình thường. Tiếp theo: xác nhận nó cùng phút với 4720 của lúc cài đặt.</li>
<li><strong>E</strong> — 4722: tài khoản <strong>Guest</strong> có sẵn (RID 501) bị admmig bật lên trên một máy chủ trung chuyển. Đáng ngờ: Guest phải luôn tắt; Guest được bật là cửa hậu dễ dãi. Tiếp theo: 4724/4738 cho Guest, 4624 bằng Guest sau đó (Bài 4.2).</li>
<li><strong>F</strong> — 1102: user01 của domain EXAMPLE đã xoá log Security trên PC01. Luôn là sự cố cho tới khi được giải thích. Tiếp theo: Logon ID 0x17dad → 4624 (từ đâu?), và mọi thứ máy này đã gửi về SIEM trước lần xoá (Bài 4.3).</li>
</ul>
</details>

<h3>Tiêu chí đạt</h3>
<div class="callout ok"><ul>
<li>Phần A: thu được ít nhất 18 trong 24 ID dưới dạng XML, và có lý do viết ra cho mỗi ID thiếu.</li>
<li>Phần B: bảng có nghĩa + bài + "luôn cảnh báo / theo hình dạng / bối cảnh".</li>
<li>Phần C: trả lời sáu thẻ kèm tên trường làm bằng chứng (không phải "trông có vẻ xấu").</li>
<li>Máy ảo đã quay về snapshot; tài khoản và tác vụ của lab không tồn tại ở nơi nào khác.</li>
</ul></div>

<h3>Đi làm thật</h3>
<p>Bảng một trang này đúng là thứ bạn sẽ ghim cạnh màn hình trong những tháng đầu OJT ở một đội hỗ trợ hoặc SOC — và các ghi chú "vì sao thiếu" là điều phỏng vấn viên rất thích nghe: chúng cho thấy bạn hiểu log là thứ được cấu hình, không phải phép màu.</p>

${nguon('📦', 'Yamato-Security/hayabusa-sample-evtx', 'Bộ EVTX công khai dùng trong chương này (EVTX-ATTACK-SAMPLES, EVTX-to-MITRE-Attack, DeepBlueCLI…)', 'https://github.com/Yamato-Security/hayabusa-sample-evtx')}
${nguon('📘', 'Microsoft Learn — Advanced security audit policy settings', 'Mỗi nhóm con ghi gì, mặc định ra sao', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/advanced-security-audit-policy-settings')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-0-1-moi-truong-lab', title: 'Bài 0.1 — Dựng lab an toàn', sub: 'Máy ảo Windows có snapshot', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-5-audit-policy', title: 'Bài 5.5 — Audit policy', sub: 'Vì sao vài ID bị thiếu ở Phần A', cta: 'Mở bài' })}
</div>
`,
};
