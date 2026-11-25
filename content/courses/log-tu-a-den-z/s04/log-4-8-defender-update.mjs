/**
 * 4.8 — Defender và Windows Update (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/defender'].
 * Số tất định: defender-5007: 08:44:06 BỎ Paths\C:\TOOLS\mimikatz.exe, THÊM Paths\C:\TOOLS\mimikatz 08:44:27, Processes\virus.exe 08:44:51, Extensions\.mimi 08:45:04;
 * atomic: 6 × 1116 (20:40:00→20:51:50), 5 × 1117 (20:51:50, 20:53:31 ×4), 1117 đầu: Action ID 2, Error 0x80508023, Remediation NT AUTHORITY\SYSTEM, sig 1.297.1333.0; 5001 = 0 trong bộ mẫu;
 * WU (system.evtx + 2-vss_7): 253 × 19, 7 × 20; KB4025342 lỗi 0x80248007 ×4 (07-23/24/27/31 2017), 0 lần thành công; KB890830 0x80246013; 2 app Store 0x8024001e (2018-07-12).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.8 — Defender and Windows Update events: 1116/1117, 5001, 5007 and WindowsUpdateClient 19/20|||4.8 — Sự kiện Defender và Windows Update: 1116/1117, 5001, 5007 và WindowsUpdateClient 19/20',
  slug: 'log-4-8-defender-update',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Defender/Operational: 1116 phát hiện, 1117 đã xử lý (kèm Error Code), 1118/1119 xử lý thất bại, 5001 tắt bảo vệ thời gian thực, 5007 đổi cấu hình, 5013 Tamper Protection chặn; ghép cặp 1116↔1117 và đọc khoảng trống giữa chúng. Mẫu thật: kẻ tấn công thêm loại trừ thư mục/tiến trình/đuôi tệp cho mimikatz. WindowsUpdateClient 19/20: một bản cập nhật tích luỹ lỗi 4 lần trong 8 ngày, tra mã lỗi trên Microsoft Learn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.8</span>
<h2>The antivirus and the updater keep diaries too</h2>
<p class="lead">Microsoft Defender Antivirus and Windows Update are on every Windows machine you will touch, and both write precise logs. Defender's answer "what did you find, what did you do, and did anyone change your settings?"; Windows Update's answer "is this machine patched, and if not, why?". Attackers care about the first (they switch it off or carve holes in it), auditors and customers about the second.</p>

<h3>The everyday picture: the security guard's notebook and the maintenance sheet</h3>
<p>The guard writes "suspicious bag seen at 20:40" (1116) and later "bag removed" (1117) — or "could not remove" (1118). If the manager tells the guard "don't check room C:\\TOOLS anymore", that instruction is written too (5007). The maintenance sheet lists each repair: done (19) or failed with an error code (20).</p>

${kv([
  ['1116', 'Malware or PUA detected (not yet handled).'],
  ['1117', 'Action taken (quarantine, remove…); read Error Code / Error Description.'],
  ['1118 / 1119', 'Action failed / critically failed — the threat may still be there.'],
  ['5001', 'Real-time protection disabled.'],
  ['5007', 'Configuration changed: Old Value / New Value (exclusions, settings).'],
  ['5013', 'Tamper Protection blocked a change to Defender.'],
  ['WindowsUpdateClient 19 / 20', 'Update installed successfully / installation failed (errorCode, updateTitle).'],
])}

<h3>Step 1 — 5007: the attacker carves an exclusion</h3>
${lenh('s04/defender', 0)}
<p>EVTX-to-MITRE-Attack sample. 5007 stores the registry value before and after. In under one minute: an exclusion for the file <code>C:\\TOOLS\\mimikatz.exe</code> is removed and replaced by the whole folder <code>C:\\TOOLS\\mimikatz</code>, then the <em>process</em> <code>virus.exe</code> and the <em>extension</em> <code>.mimi</code> are excluded. Defender is still "on" — the dashboard is green — but it no longer looks where the tools are. That is ATT&amp;CK T1685 "Disable or Modify Tools" (the technique formerly numbered T1562.001). Every 5007 touching <code>Exclusions</code> deserves a question: which admin, which ticket?</p>

<h3>Step 2 — 1116 and 1117: detection, then action</h3>
${lenh('s04/defender', 1)}
${lenh('s04/defender', 3)}
<p>A test machine running Atomic Red Team (a library of safe attack simulations): six detections between 20:40 and 20:51 — PowerSploit keystroke logger, a malicious XSL, a JSP webshell, an ASPX backdoor, a DLL. The actions (1117) arrive <strong>11–13 minutes later</strong>. Pair them by Threat Name (and path): every threat here has its 1117. In real investigations, the <em>gap</em> matters: between 1116 and 1117 the file was on disk and may have run; a 1116 with no 1117, or a 1118/1119, means "still there".</p>
${lenh('s04/defender', 2)}
<p>Read the 1117 to the end. <code>Process Name</code> = powershell.exe (what touched the file), <code>Detection User</code> = MSEDGEWIN10\\IEUser, <code>Remediation User</code> = SYSTEM (Defender itself acted). <code>Error Code 0x80508023</code> — "The program could not find the malware…": by the time Defender acted, the file was already gone (here: the test script deleted it). A 1117 is therefore not proof that Defender removed the file — read the error.</p>

<h3>Step 3 — 5001: protection switched off (not in the samples)</h3>
${lenh('s04/defender', 4)}
<p>No public sample here contains 5001, so read it from the documentation and create it yourself in Lab 4 (turn off Real-time protection in Windows Security on your VM): <strong>5001 "Real-time protection is disabled"</strong>. Legitimate causes: another antivirus took over, a short troubleshooting window. Attack cause: <code>Set-MpPreference -DisableRealtimeMonitoring $true</code> run by an intruder — which also appears in PowerShell 4104 (Lesson 4.6). On Windows 10/11 with <strong>Tamper Protection</strong> on, the attempt is blocked and you get <strong>5013</strong> instead — a blocked attempt is still a signal that someone tried.</p>

<h3>Step 4 — Windows Update: is this machine patched?</h3>
${lenh('s04/defender', 5)}
${lenh('s04/defender', 6)}
${lenh('s04/defender', 7)}
<p>Two Windows 10 samples: 253 updates installed (19), 7 failures (20). The July 2017 cumulative update <strong>KB4025342 failed four times in eight days</strong> with <code>0x80248007</code> and never succeeded in this log. Microsoft's Windows Update error reference: <code>0x80248007</code> = WU_E_DS_NODATA, "The information requested isn't in the data store" (the local update database is missing data — the usual fix is resetting the update components); <code>0x8024001E</code> = WU_E_SERVICE_STOP, "Operation didn't complete because the service or system was being shut down" (two Store apps cut off by a restart). Not every code is in that table (0x80246013 is not) — then search Microsoft Learn/Q&amp;A by the exact code and KB.</p>
<div class="pitfall co-tieu-de"><p><strong>"Update failed" is a security finding, not only an IT annoyance.</strong> A cumulative update that fails silently for weeks leaves the machine exposed to everything that update fixed. Lesson 3.7 shows where the detailed WindowsUpdate.log / CBS.log are when 19/20 are not enough.</p></div>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Defender: detections, actions, config changes and RTP switches in the last 30 days
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-Windows Defender/Operational'; Id = 1116,1117,1118,1119,5001,5007,5013; StartTime = (Get-Date).AddDays(-30) } -ErrorAction SilentlyContinue |
  Format-Table TimeCreated, Id, @{n='Text';e={ ($_.Message -split "\`n")[0] }} -AutoSize -Wrap
Get-MpPreference | Select-Object ExclusionPath, ExclusionProcess, ExclusionExtension   # current exclusions (admin)
Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled, IsTamperProtected, AntivirusSignatureLastUpdated
# Windows Update: last 10 failures with their codes
Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Microsoft-Windows-WindowsUpdateClient'; Id = 20 } -MaxEvents 10 -ErrorAction SilentlyContinue |
  Format-Table TimeCreated, Message -Wrap</code></pre>

<h3>🛡️ Attacker's corner: blind the guard, don't fight it</h3>
<p>Fighting antivirus is noisy; blinding it is quiet. Common moves (all under ATT&amp;CK T1685): add exclusions for the tools' folder, process or extension (Step 1); disable real-time protection; uninstall or stop the service; downgrade signatures. Each one has an event: 5007 with <code>Exclusions</code>, 5001, 7036/7040 on WinDefend (Lesson 4.5), or 5013 if Tamper Protection stopped it. Defence: Tamper Protection on, exclusions managed centrally (so a local 5007 exclusion is always unexpected), and an alert on all of these.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Defender shows 1116 but no 1117 — what does it mean?" — detected, not (yet) handled; the threat may still be present.</li>
<li>"How would an attacker evade Defender without disabling it, and how do you see it?" — exclusions; 5007 with Exclusions in Old/New Value.</li>
<li>"How do you prove a server is patched?" — WindowsUpdateClient 19 for the KB, or Get-HotFix; and no repeating 20 for the same KB.</li>
<li>"What is Tamper Protection and which event shows it working?" — blocks changes to Defender settings; 5013.</li>
</ul>

<h3>At work</h3>
<p>Customers in outsourcing contracts often require monthly patch reports. A small script that lists 19 and 20 per server for the month, plus the KBs that failed more than once with their codes, answers the report and gives the ops team a to-do list. When a security alert says "Defender detected X on server Y", reply with the 1116/1117 pair: threat, path, process, user, action, error — that is the whole first-level triage.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>In <code>defender-5007.evtx</code>, which three kinds of exclusion were added (path, process, extension)? Which value was removed?</li>
<li>For the Atomic sample, compute the gap between the 1116 and the 1117 of <code>Backdoor:ASP/Ace.T</code>.</li>
<li>Look up 0x8024402C in Microsoft's Windows Update error reference and write the meaning in one sentence.</li>
</ol>
<p><strong>Pass:</strong> (1) path C:\\TOOLS\\mimikatz, process virus.exe, extension .mimi; removed: path C:\\TOOLS\\mimikatz.exe; (2) 20:41:17 → 20:53:31 ≈ 12 min 14 s; (3) WU_E_PT_WINHTTP_NAME_NOT_RESOLVED — the update server name could not be resolved (a DNS/proxy problem, not a broken update).</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['1116 / 1117', 'Defender detected / acted (read Error Code).'],
  ['1118 / 1119', 'Action failed / critically failed.'],
  ['5001 / 5007 / 5013', 'RTP disabled / config changed / Tamper Protection blocked a change.'],
  ['Exclusion', 'Path, process or extension Defender does not scan.'],
  ['WindowsUpdateClient 19 / 20', 'Update installed / failed with errorCode.'],
  ['WU_E_…', 'Symbolic names of Windows Update error codes.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Pair 1116 with 1117 and read the gap and the error; 1118/1119 = still there.</li>
<li>5007 with Exclusions and 5001 are how attackers blind Defender; 5013 shows a blocked try.</li>
<li>19/20 tell patch status; repeated 20 for one KB is a finding; look codes up on Microsoft Learn.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Microsoft Defender Antivirus event IDs and error codes', '1116–1119, 5001, 5007, 5013…', 'https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus')}
${nguon('📘', 'Microsoft Learn — Windows Update error code list by component', '0x80248007, 0x8024001E, 0x8024402C…', 'https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-error-reference')}
${nguon('🛡️', 'MITRE ATT&CK T1685 — Disable or Modify Tools', 'formerly T1562.001 (renumbered)', 'https://attack.mitre.org/techniques/T1685/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-7-log-van-ban', title: 'Lesson 3.7 — Windows text logs', sub: 'WindowsUpdate.log, CBS.log, MPLog when events are not enough', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-3-nhanh-ung-dung', title: 'Lesson 3.3 — Applications and Services Logs', sub: 'Where Defender/Operational lives', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.8</span>
<h2>Phần mềm diệt virus và trình cập nhật cũng viết nhật ký</h2>
<p class="lead">Microsoft Defender Antivirus và Windows Update có mặt trên mọi máy Windows bạn sẽ đụng tới, và cả hai đều ghi log rất chính xác. Log của Defender trả lời "đã thấy gì, đã làm gì, và có ai đổi cài đặt của nó không?"; log của Windows Update trả lời "máy này đã vá chưa, nếu chưa thì vì sao?". Kẻ tấn công quan tâm tới cái thứ nhất (chúng tắt nó hoặc khoét lỗ trong nó), người kiểm toán và khách hàng quan tâm tới cái thứ hai.</p>

<h3>Liên tưởng đời thường: sổ của bảo vệ và phiếu bảo trì</h3>
<p>Bảo vệ ghi "thấy túi khả nghi lúc 20:40" (1116) và sau đó "đã mang túi đi" (1117) — hoặc "không mang đi được" (1118). Nếu quản lý dặn bảo vệ "đừng kiểm phòng C:\\TOOLS nữa", lời dặn đó cũng được ghi (5007). Phiếu bảo trì liệt kê từng lần sửa: xong (19) hoặc hỏng kèm mã lỗi (20).</p>

${kv([
  ['1116', 'Phát hiện mã độc hoặc phần mềm không mong muốn (chưa xử lý).'],
  ['1117', 'Đã thực hiện hành động (cách ly, xoá…); đọc Error Code / Error Description.'],
  ['1118 / 1119', 'Hành động thất bại / thất bại nghiêm trọng — mối nguy có thể vẫn còn.'],
  ['5001', 'Bảo vệ thời gian thực bị tắt.'],
  ['5007', 'Cấu hình bị đổi: Old Value / New Value (loại trừ, thiết lập).'],
  ['5013', 'Tamper Protection đã chặn một thay đổi vào Defender.'],
  ['WindowsUpdateClient 19 / 20', 'Cài bản cập nhật thành công / thất bại (errorCode, updateTitle).'],
])}

<h3>Bước 1 — 5007: kẻ tấn công khoét một vùng loại trừ</h3>
${lenh('s04/defender', 0)}
<p>Mẫu EVTX-to-MITRE-Attack. 5007 lưu giá trị registry trước và sau. Trong chưa đầy một phút: vùng loại trừ cho tệp <code>C:\\TOOLS\\mimikatz.exe</code> bị gỡ và thay bằng cả thư mục <code>C:\\TOOLS\\mimikatz</code>, rồi <em>tiến trình</em> <code>virus.exe</code> và <em>đuôi tệp</em> <code>.mimi</code> cũng được loại trừ. Defender vẫn "bật" — bảng điều khiển vẫn xanh — nhưng nó không còn nhìn vào chỗ để công cụ nữa. Đó là ATT&amp;CK T1685 "Disable or Modify Tools" (kỹ thuật trước đây mang số T1562.001). Mỗi 5007 đụng vào <code>Exclusions</code> đáng một câu hỏi: quản trị viên nào, phiếu nào?</p>

<h3>Bước 2 — 1116 và 1117: phát hiện, rồi hành động</h3>
${lenh('s04/defender', 1)}
${lenh('s04/defender', 3)}
<p>Một máy thử chạy Atomic Red Team (thư viện mô phỏng tấn công an toàn): sáu lần phát hiện từ 20:40 tới 20:51 — bộ ghi phím PowerSploit, một tệp XSL độc, một webshell JSP, một cửa hậu ASPX, một DLL. Các hành động (1117) đến <strong>11–13 phút sau</strong>. Ghép cặp theo Threat Name (và đường dẫn): mối nguy nào ở đây cũng có 1117 của nó. Trong điều tra thật, <em>khoảng trống</em> mới quan trọng: giữa 1116 và 1117 tệp vẫn nằm trên đĩa và có thể đã chạy; 1116 không có 1117, hoặc có 1118/1119, nghĩa là "vẫn còn đó".</p>
${lenh('s04/defender', 2)}
<p>Đọc 1117 tới cuối. <code>Process Name</code> = powershell.exe (thứ đã chạm vào tệp), <code>Detection User</code> = MSEDGEWIN10\\IEUser, <code>Remediation User</code> = SYSTEM (chính Defender đã hành động). <code>Error Code 0x80508023</code> — "Chương trình không tìm thấy mã độc…": tới lúc Defender ra tay thì tệp đã biến mất (ở đây: script thử nghiệm đã xoá nó). Vậy một 1117 không chứng minh Defender đã xoá tệp — hãy đọc mã lỗi.</p>

<h3>Bước 3 — 5001: bảo vệ bị tắt (không có trong mẫu)</h3>
${lenh('s04/defender', 4)}
<p>Không mẫu công khai nào ở đây có 5001, nên đọc nó từ tài liệu và tự tạo trong Lab 4 (tắt Real-time protection trong Windows Security trên máy ảo): <strong>5001 "Real-time protection is disabled"</strong>. Nguyên nhân hợp lệ: một phần mềm diệt virus khác thay thế, một khoảng ngắn để xử lý sự cố. Nguyên nhân tấn công: kẻ xâm nhập chạy <code>Set-MpPreference -DisableRealtimeMonitoring $true</code> — lệnh này cũng hiện trong PowerShell 4104 (Bài 4.6). Trên Windows 10/11 có bật <strong>Tamper Protection</strong>, nỗ lực đó bị chặn và bạn nhận <strong>5013</strong> thay vào — một lần thử bị chặn vẫn là tín hiệu rằng có người đã thử.</p>

<h3>Bước 4 — Windows Update: máy này đã vá chưa?</h3>
${lenh('s04/defender', 5)}
${lenh('s04/defender', 6)}
${lenh('s04/defender', 7)}
<p>Hai mẫu Windows 10: 253 bản cập nhật cài thành công (19), 7 lần thất bại (20). Bản cập nhật tích luỹ tháng 7/2017 <strong>KB4025342 thất bại bốn lần trong tám ngày</strong> với <code>0x80248007</code> và chưa bao giờ thành công trong log này. Bảng mã lỗi Windows Update của Microsoft: <code>0x80248007</code> = WU_E_DS_NODATA, "Thông tin cần tìm không có trong kho dữ liệu" (cơ sở dữ liệu cập nhật cục bộ bị thiếu — cách sửa thường là đặt lại các thành phần cập nhật); <code>0x8024001E</code> = WU_E_SERVICE_STOP, "Thao tác chưa xong vì dịch vụ hoặc hệ thống đang tắt" (hai ứng dụng Store bị một lần khởi động lại cắt ngang). Không phải mã nào cũng có trong bảng (0x80246013 thì không) — khi đó tìm trên Microsoft Learn/Q&amp;A bằng đúng mã và KB.</p>
<div class="pitfall co-tieu-de"><p><strong>"Cập nhật thất bại" là một phát hiện bảo mật, không chỉ là phiền toái của IT.</strong> Một bản cập nhật tích luỹ lặng lẽ thất bại suốt nhiều tuần để máy hở trước mọi thứ mà bản đó sửa. Bài 3.7 chỉ chỗ có WindowsUpdate.log / CBS.log chi tiết khi 19/20 chưa đủ.</p></div>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Defender: phát hiện, hành động, đổi cấu hình và bật/tắt RTP trong 30 ngày qua
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-Windows Defender/Operational'; Id = 1116,1117,1118,1119,5001,5007,5013; StartTime = (Get-Date).AddDays(-30) } -ErrorAction SilentlyContinue |
  Format-Table TimeCreated, Id, @{n='Text';e={ ($_.Message -split "\`n")[0] }} -AutoSize -Wrap
Get-MpPreference | Select-Object ExclusionPath, ExclusionProcess, ExclusionExtension   # các loại trừ hiện tại (cần quyền quản trị)
Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled, IsTamperProtected, AntivirusSignatureLastUpdated
# Windows Update: 10 lần thất bại gần nhất kèm mã lỗi
Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Microsoft-Windows-WindowsUpdateClient'; Id = 20 } -MaxEvents 10 -ErrorAction SilentlyContinue |
  Format-Table TimeCreated, Message -Wrap</code></pre>

<h3>🛡️ Góc hacker: bịt mắt người gác, đừng đánh nhau với nó</h3>
<p>Đánh nhau với phần mềm diệt virus thì ồn; bịt mắt nó thì êm. Các nước đi phổ biến (đều thuộc ATT&amp;CK T1685): thêm loại trừ cho thư mục, tiến trình hoặc đuôi tệp của công cụ (Bước 1); tắt bảo vệ thời gian thực; gỡ hoặc dừng dịch vụ; hạ cấp mẫu nhận diện. Nước nào cũng có sự kiện: 5007 với <code>Exclusions</code>, 5001, 7036/7040 trên WinDefend (Bài 4.5), hoặc 5013 nếu Tamper Protection đã chặn. Phòng thủ: bật Tamper Protection, quản lý loại trừ tập trung (để một 5007 loại trừ tại máy luôn là bất thường), và cảnh báo tất cả những sự kiện này.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Defender có 1116 mà không có 1117 — nghĩa là gì?" — đã phát hiện, chưa (hoặc chưa được) xử lý; mối nguy có thể vẫn còn.</li>
<li>"Kẻ tấn công né Defender mà không tắt nó bằng cách nào, và bạn thấy thế nào?" — thêm loại trừ; 5007 có Exclusions trong Old/New Value.</li>
<li>"Chứng minh một máy chủ đã được vá thế nào?" — WindowsUpdateClient 19 cho KB đó, hoặc Get-HotFix; và không có 20 lặp lại cho cùng KB.</li>
<li>"Tamper Protection là gì và sự kiện nào cho thấy nó hoạt động?" — chặn việc đổi cài đặt Defender; 5013.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Khách hàng trong hợp đồng outsourcing thường yêu cầu báo cáo vá lỗi hằng tháng. Một script nhỏ liệt kê 19 và 20 theo từng máy chủ trong tháng, cộng các KB thất bại hơn một lần kèm mã lỗi, vừa trả lời báo cáo vừa cho đội vận hành một danh sách việc cần làm. Khi cảnh báo bảo mật báo "Defender phát hiện X trên máy chủ Y", hãy trả lời bằng cặp 1116/1117: mối nguy, đường dẫn, tiến trình, người dùng, hành động, mã lỗi — đó là toàn bộ bước phân loại cấp một.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>defender-5007.evtx</code>, ba loại loại trừ nào được thêm (đường dẫn, tiến trình, đuôi tệp)? Giá trị nào bị gỡ?</li>
<li>Với mẫu Atomic, tính khoảng cách giữa 1116 và 1117 của <code>Backdoor:ASP/Ace.T</code>.</li>
<li>Tra 0x8024402C trong bảng mã lỗi Windows Update của Microsoft và viết nghĩa trong một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) đường dẫn C:\\TOOLS\\mimikatz, tiến trình virus.exe, đuôi .mimi; bị gỡ: đường dẫn C:\\TOOLS\\mimikatz.exe; (2) 20:41:17 → 20:53:31 ≈ 12 phút 14 giây; (3) WU_E_PT_WINHTTP_NAME_NOT_RESOLVED — không phân giải được tên máy chủ cập nhật (lỗi DNS/proxy, không phải bản cập nhật hỏng).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['1116 / 1117', 'Defender phát hiện / đã hành động (đọc Error Code).'],
  ['1118 / 1119', 'Hành động thất bại / thất bại nghiêm trọng.'],
  ['5001 / 5007 / 5013', 'Tắt RTP / đổi cấu hình / Tamper Protection chặn một thay đổi.'],
  ['Loại trừ (exclusion)', 'Đường dẫn, tiến trình hoặc đuôi tệp mà Defender không quét.'],
  ['WindowsUpdateClient 19 / 20', 'Cài bản cập nhật thành công / thất bại kèm errorCode.'],
  ['WU_E_…', 'Tên ký hiệu của các mã lỗi Windows Update.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ghép 1116 với 1117, đọc khoảng trống và mã lỗi; 1118/1119 = vẫn còn đó.</li>
<li>5007 có Exclusions và 5001 là cách kẻ tấn công bịt mắt Defender; 5013 cho thấy một lần thử bị chặn.</li>
<li>19/20 cho biết tình trạng vá; 20 lặp lại cho một KB là một phát hiện; tra mã trên Microsoft Learn.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Microsoft Defender Antivirus event IDs and error codes', '1116–1119, 5001, 5007, 5013…', 'https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus')}
${nguon('📘', 'Microsoft Learn — Windows Update error code list by component', '0x80248007, 0x8024001E, 0x8024402C…', 'https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-error-reference')}
${nguon('🛡️', 'MITRE ATT&CK T1685 — Disable or Modify Tools', 'số cũ T1562.001 (đã đánh số lại)', 'https://attack.mitre.org/techniques/T1685/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-7-log-van-ban', title: 'Bài 3.7 — Log văn bản của Windows', sub: 'WindowsUpdate.log, CBS.log, MPLog khi sự kiện chưa đủ', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-3-nhanh-ung-dung', title: 'Bài 3.3 — Applications and Services Logs', sub: 'Nơi có Defender/Operational', cta: 'Mở bài' })}
</div>
`,
};
