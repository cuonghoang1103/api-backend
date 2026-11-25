/**
 * 3.3 — Các nhánh Applications and Services Logs (soạn 24/11/2026, agent lgz). Output thật: OUT['s03/nhanh'] — bộ EVTX mẫu công khai (3.1).
 * Số tất định: 6 kênh ngoài Windows Logs; 5 × RDP 1149 (mpowers 174.127.93.2 ×2, administrator 31.14.75.59 ×2, "A" 103.11.244.223); PowerShell 23×4103, 4×4104,
 * 40961/40962/53504; Defender 5×1116 + 1×1117 Quarantine (HackTool Mimikatz); 1151 RTP Enabled; Firewall 2004 "Gentil-rule" do WmiPrvSE; Sysmon 227×1 … 1×16.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.3 — Applications and Services Logs worth knowing|||3.3 — Các nhánh Applications and Services Logs đáng biết: TaskScheduler, PowerShell, Defender, TerminalServices, WLAN, DNS Client, Firewall',
  slug: 'log-3-3-nhanh-ung-dung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Microsoft › Windows › <thành phần> › Operational: log nào trả lời câu hỏi nào. Đọc thật RDP 1149, PowerShell 4103/4104, Defender 1116/1117/1151, Firewall 2004, Sysmon; nhánh TaskScheduler/DNS Client tắt sẵn — bật thế nào; hiện log Analytic/Debug.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>The other logbooks: where the interesting details live</h2>
<p class="lead">The five Windows Logs answer "what happened to the machine". The hundreds of <strong>Applications and Services Logs</strong> answer the precise questions: who connected by Remote Desktop and from which IP, which PowerShell code actually ran, what the antivirus caught, who changed the firewall, which scheduled task ran at 3 a.m. Most of them live under <em>Microsoft › Windows › &lt;component&gt; › Operational</em>.</p>

<h3>The everyday picture: specialist notebooks</h3>
<p>The front desk book (Security) says "Mr. An entered at 9:02". The meeting-room booking sheet says <em>which room</em> and <em>with whom</em>. Neither replaces the other; an investigator reads both. Operational logs are those specialist sheets.</p>

<h3>Which branch answers which question</h3>
<ul>
<li><strong>TerminalServices-RemoteConnectionManager/Operational</strong> (1149: RDP user authenticated, with source IP) and <strong>TerminalServices-LocalSessionManager/Operational</strong> (21 logon, 24 disconnect, 25 reconnect) — "who used Remote Desktop?" (Lesson 4.7).</li>
<li><strong>PowerShell/Operational</strong> (4103 module/pipeline logging, 4104 script block logging) and <strong>Windows PowerShell</strong> (400/600/800) — "what did that script really do?" (Lesson 4.6).</li>
<li><strong>Windows Defender/Operational</strong> (1116 detected, 1117 action taken, 5001 real-time protection off, 5007 settings changed, 1151 health report) — "what did the antivirus see?" (Lesson 4.8).</li>
<li><strong>Windows Firewall With Advanced Security/Firewall</strong> (rule added/changed/deleted) — "who opened that port?" (Lesson 11.3).</li>
<li><strong>TaskScheduler/Operational</strong> (106 registered, 200/201 action started/finished) — "what ran at 3 a.m.?" — <em>disabled by default</em> on client Windows.</li>
<li><strong>DNS Client Events/Operational</strong> (3006/3008/3020 queries) — "which names did this PC look up?" — <em>disabled by default</em>.</li>
<li><strong>WLAN-AutoConfig/Operational</strong> (8001 connected, 8003 disconnected, with SSID) — "which Wi‑Fi was the laptop on?".</li>
<li><strong>Sysmon/Operational</strong> — only if Sysmon is installed (Lesson 5.6).</li>
</ul>

<h3>Step 1 — the branches present in the sample set</h3>
${lenh('s03/nhanh', 0)}

<h3>Step 2 — Remote Desktop: who came in, from where</h3>
${lenh('s03/nhanh', 1)}
<p>Event 1149 says "Remote Desktop Services: User authentication succeeded" with <code>Param1</code> = user, <code>Param2</code> = domain, <code>Param3</code> = source IP. Five successful authentications in 42 minutes from three public IPs; one user name is just "A". This file also has 1 790 events 261 ("listener received a connection") — this machine's RDP port was reachable from the Internet and being knocked on. Security 4624 would tell you the same logons as type 10, but 1149 is the quickest list of <em>source IPs</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>1149 is not "logon succeeded".</strong> It means the network-level authentication passed; the desktop session may still fail. Confirm with LocalSessionManager 21/25 and Security 4624 type 10 (Lesson 4.7).</p></div>

<h3>Step 3 — PowerShell: the code that actually ran</h3>
${lenh('s03/nhanh', 2)}
${lenh('s03/nhanh', 3)}
<p>4104 (script block logging) records the <strong>text of the code</strong> PowerShell compiled — after any decoding. Here an administrator installs OpenSSH Server with <code>Add-WindowsCapability</code>; 4103 (23 events) records each command invocation with its parameters; 40961/40962 mark a PowerShell console starting. Windows logs 4104 at Warning level for "suspicious" blocks even without configuration; full logging needs a policy (Lesson 5.5).</p>

<h3>Step 4 — Defender: detected, then acted</h3>
${lenh('s03/nhanh', 4)}
${lenh('s03/nhanh', 5)}
<p>Read 1116 and 1117 as a pair: <strong>1116 = detected</strong> (Warning; action not yet applied), <strong>1117 = action taken</strong> (here Quarantine). Five detections of Mimikatz files in a user's Documents within 43 seconds, one quarantine. If you see 1116 without a matching 1117, the threat may still be there. 1151 is a periodic health report: engine/signature versions and whether real-time protection (RTP) is on — useful when a machine "had antivirus" but its signatures were months old.</p>

<h3>Step 5 — Firewall: who added a rule</h3>
${lenh('s03/nhanh', 6)}
<p>Rule "Gentil-rule" for <code>idm.exe</code>, created through <code>WmiPrvSE.exe</code> (i.e. via WMI/PowerShell, not the GUI) by a domain user SID. Many values are codes: Direction 2 = outbound (1 = inbound), Protocol 256 = any protocol; the General tab shows them as words. Rule changes are exactly what you check when a server "suddenly" accepts connections.</p>

<h3>Step 6 — Sysmon at a glance</h3>
${lenh('s03/nhanh', 7)}
<p>1 = process created, 10 = process accessed, 11 = file created, 12/13 = registry, 3 = network connection, 15 = file stream, 16 = config change. Lesson 5.6 reads each.</p>

<h3>Turning on a log that is off, and hidden logs</h3>
<pre><code class="language-powershell"># On your Windows PC, as administrator — or right-click the log in Event Viewer › Enable Log
wevtutil sl Microsoft-Windows-TaskScheduler/Operational /e:true
wevtutil sl Microsoft-Windows-DNS-Client/Operational /e:true
Get-WinEvent -ListLog Microsoft-Windows-TaskScheduler/Operational,Microsoft-Windows-DNS-Client/Operational |
  Format-Table LogName,IsEnabled,RecordCount</code></pre>
<p>Analytic and Debug logs (very verbose, for troubleshooting a single component) are hidden: <em>View › Show Analytic and Debug Logs</em>. Turn them on briefly and off again — they are high-volume and some stop collecting when full.</p>

<h3>🛡️ Attacker's corner: RDP open to the Internet</h3>
<p>Step 2 is not hypothetical: exposed Remote Desktop is one of the most abused entry points of ransomware gangs (MITRE ATT&amp;CK T1021.001). The defender's quick checks are exactly these logs: 261/1149 volume and source IPs, 4625 bursts, 4624 type 10 from unknown IPs. Defence: no RDP to the Internet — VPN or a gateway, MFA, lockout policy.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Where do you look to see who connected by RDP and from which IP?" — RemoteConnectionManager 1149, LocalSessionManager 21/24/25, Security 4624 type 10.</li>
<li>"How do you see the PowerShell code an attacker ran, even if it was base64-encoded?" — PowerShell/Operational 4104 script block logging.</li>
<li>"Defender shows 1116 but no 1117. What does that mean?" — detection without (successful) remediation.</li>
<li>"Why is my TaskScheduler log empty?" — disabled by default; enable it.</li>
</ul>

<h3>At work</h3>
<p>For a "the job did not run last night" ticket on a Windows server, TaskScheduler/Operational answers in one minute — if it was enabled <em>before</em> the night. Enabling the useful Operational logs is part of setting up a server, not of investigating it.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your own PC: is TaskScheduler/Operational enabled? Enable it, create a task that runs <code>cmd /c echo hi</code>, run it, and find the events 106, 200, 201.</li>
<li>In the sample RDP file, how many 261 events are there, and how many distinct source IPs in 1149?</li>
<li>In <code>defender-1116-1117.evtx</code>, which file was quarantined and at what UTC time?</li>
</ol>
<p><strong>Pass:</strong> (1) 106 (registered), 200 (action started), 201 (action completed) in order; (2) 1 790 × 261; 3 IPs (174.127.93.2, 31.14.75.59, 103.11.244.223); (3) <code>C:\\Users\\admmig\\Documents\\mimikatz.exe</code>, 11/12/2020 12:28:44 UTC.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Operational log', 'Per-component log under Microsoft › Windows › … for administrators.'],
  ['Analytic / Debug log', 'Hidden, very verbose logs for troubleshooting one component.'],
  ['1149 / 21 / 24 / 25', 'RDP authentication succeeded / session logon / disconnect / reconnect.'],
  ['4103 / 4104', 'PowerShell module logging / script block logging.'],
  ['1116 / 1117', 'Defender detected / Defender took action.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Windows Logs tell you what happened; Operational logs tell you the details.</li>
<li>RDP, PowerShell, Defender, Firewall, TaskScheduler, DNS Client: know which question each answers.</li>
<li>Some useful logs are off by default — enable them before you need them.</li>
</ul>
${nguon('📘', 'Microsoft Learn — about_Logging_Windows (PowerShell)', 'Script block and module logging, event IDs 4103/4104', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows')}
${nguon('📘', 'Microsoft Learn — Defender Antivirus event IDs', '1116, 1117, 1151, 5001, 5007…', 'https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus')}
${nguon('🛡️', 'MITRE ATT&CK T1021.001 — Remote Desktop Protocol', 'How attackers use RDP, and detection data sources', 'https://attack.mitre.org/techniques/T1021/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-3-firewall-windows', title: 'Lesson 11.3 — Windows Firewall logging', sub: 'pfirewall.log and 5156/5157 run on a real Windows Server 2025', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Những cuốn sổ khác: nơi chứa chi tiết đáng giá</h2>
<p class="lead">Năm Windows Logs trả lời "máy đã gặp chuyện gì". Hàng trăm <strong>Applications and Services Logs</strong> trả lời những câu hỏi cụ thể: ai vào bằng Remote Desktop và từ IP nào, đoạn mã PowerShell nào đã thật sự chạy, phần mềm diệt virus bắt được gì, ai đã sửa tường lửa, tác vụ hẹn giờ nào chạy lúc 3 giờ sáng. Phần lớn nằm ở <em>Microsoft › Windows › &lt;thành phần&gt; › Operational</em>.</p>

<h3>Liên tưởng đời thường: những cuốn sổ chuyên môn</h3>
<p>Sổ lễ tân (Security) ghi "Anh An vào lúc 9:02". Phiếu đặt phòng họp ghi <em>phòng nào</em> và <em>với ai</em>. Cái này không thay cái kia; người điều tra đọc cả hai. Log Operational chính là những phiếu chuyên môn đó.</p>

<h3>Nhánh nào trả lời câu hỏi nào</h3>
<ul>
<li><strong>TerminalServices-RemoteConnectionManager/Operational</strong> (1149: người dùng RDP xác thực thành công, kèm IP nguồn) và <strong>TerminalServices-LocalSessionManager/Operational</strong> (21 đăng nhập, 24 ngắt, 25 nối lại) — "ai đã dùng Remote Desktop?" (Bài 4.7).</li>
<li><strong>PowerShell/Operational</strong> (4103 ghi module/pipeline, 4104 ghi script block) và <strong>Windows PowerShell</strong> (400/600/800) — "đoạn script đó thật ra đã làm gì?" (Bài 4.6).</li>
<li><strong>Windows Defender/Operational</strong> (1116 phát hiện, 1117 đã xử lý, 5001 tắt bảo vệ thời gian thực, 5007 đổi cấu hình, 1151 báo cáo sức khoẻ) — "phần mềm diệt virus đã thấy gì?" (Bài 4.8).</li>
<li><strong>Windows Firewall With Advanced Security/Firewall</strong> (thêm/sửa/xoá luật) — "ai đã mở cổng đó?" (Bài 11.3).</li>
<li><strong>TaskScheduler/Operational</strong> (106 đăng ký, 200/201 bắt đầu/xong hành động) — "cái gì chạy lúc 3 giờ sáng?" — <em>tắt sẵn</em> trên Windows máy trạm.</li>
<li><strong>DNS Client Events/Operational</strong> (truy vấn 3006/3008/3020) — "máy này đã tra những tên miền nào?" — <em>tắt sẵn</em>.</li>
<li><strong>WLAN-AutoConfig/Operational</strong> (8001 đã kết nối, 8003 ngắt, kèm SSID) — "laptop đã vào Wi‑Fi nào?".</li>
<li><strong>Sysmon/Operational</strong> — chỉ có khi đã cài Sysmon (Bài 5.6).</li>
</ul>

<h3>Bước 1 — các nhánh có trong bộ mẫu</h3>
${lenh('s03/nhanh', 0)}

<h3>Bước 2 — Remote Desktop: ai vào, từ đâu</h3>
${lenh('s03/nhanh', 1)}
<p>Sự kiện 1149 nói "Remote Desktop Services: User authentication succeeded" với <code>Param1</code> = người dùng, <code>Param2</code> = domain, <code>Param3</code> = IP nguồn. Năm lần xác thực thành công trong 42 phút từ ba IP công cộng; một tên người dùng chỉ là "A". Tệp này còn có 1 790 sự kiện 261 ("listener nhận một kết nối") — cổng RDP của máy này với tới được từ Internet và đang bị gõ cửa. Security 4624 cũng cho biết những lần đăng nhập đó với type 10, nhưng 1149 là danh sách <em>IP nguồn</em> nhanh nhất.</p>
<div class="pitfall co-tieu-de"><p><strong>1149 không phải "đăng nhập thành công".</strong> Nó nghĩa là bước xác thực ở tầng mạng đã qua; phiên làm việc vẫn có thể hỏng. Xác nhận bằng LocalSessionManager 21/25 và Security 4624 type 10 (Bài 4.7).</p></div>

<h3>Bước 3 — PowerShell: đoạn mã đã thật sự chạy</h3>
${lenh('s03/nhanh', 2)}
${lenh('s03/nhanh', 3)}
<p>4104 (script block logging) ghi <strong>chữ của đoạn mã</strong> mà PowerShell đã biên dịch — sau khi đã giải mã mọi lớp mã hoá. Ở đây một quản trị viên cài OpenSSH Server bằng <code>Add-WindowsCapability</code>; 4103 (23 sự kiện) ghi từng lệnh được gọi kèm tham số; 40961/40962 đánh dấu một cửa sổ PowerShell khởi động. Windows tự ghi 4104 mức Warning cho các khối "đáng ngờ" kể cả khi chưa cấu hình gì; muốn ghi đầy đủ phải bật chính sách (Bài 5.5).</p>

<h3>Bước 4 — Defender: phát hiện, rồi xử lý</h3>
${lenh('s03/nhanh', 4)}
${lenh('s03/nhanh', 5)}
<p>Đọc 1116 và 1117 thành cặp: <strong>1116 = phát hiện</strong> (Warning; chưa xử lý), <strong>1117 = đã xử lý</strong> (ở đây là Quarantine — cách ly). Năm lần phát hiện tệp Mimikatz trong thư mục Documents của một người dùng trong 43 giây, một lần cách ly. Nếu thấy 1116 mà không có 1117 đi kèm, mối nguy có thể vẫn còn đó. 1151 là báo cáo sức khoẻ định kỳ: phiên bản engine/mẫu nhận diện và bảo vệ thời gian thực (RTP) có bật không — hữu ích khi một máy "có cài diệt virus" nhưng mẫu nhận diện đã cũ mấy tháng.</p>

<h3>Bước 5 — Tường lửa: ai đã thêm luật</h3>
${lenh('s03/nhanh', 6)}
<p>Luật "Gentil-rule" cho <code>idm.exe</code>, được tạo qua <code>WmiPrvSE.exe</code> (tức qua WMI/PowerShell, không phải giao diện) bởi một SID người dùng domain. Nhiều giá trị là mã số: Direction 2 = đi ra (1 = đi vào), Protocol 256 = mọi giao thức; tab General hiển thị chúng thành chữ. Thay đổi luật chính là thứ cần kiểm khi một máy chủ "tự dưng" nhận kết nối.</p>

<h3>Bước 6 — Sysmon lướt qua</h3>
${lenh('s03/nhanh', 7)}
<p>1 = tạo tiến trình, 10 = truy cập tiến trình khác, 11 = tạo tệp, 12/13 = registry, 3 = kết nối mạng, 15 = luồng dữ liệu tệp, 16 = đổi cấu hình. Bài 5.6 đọc từng loại.</p>

<h3>Bật một log đang tắt, và các log bị ẩn</h3>
<pre><code class="language-powershell"># Trên máy Windows của bạn, quyền quản trị — hoặc chuột phải vào log trong Event Viewer › Enable Log
wevtutil sl Microsoft-Windows-TaskScheduler/Operational /e:true
wevtutil sl Microsoft-Windows-DNS-Client/Operational /e:true
Get-WinEvent -ListLog Microsoft-Windows-TaskScheduler/Operational,Microsoft-Windows-DNS-Client/Operational |
  Format-Table LogName,IsEnabled,RecordCount</code></pre>
<p>Log Analytic và Debug (rất chi tiết, để gỡ lỗi một thành phần) bị ẩn: <em>View › Show Analytic and Debug Logs</em>. Bật trong thời gian ngắn rồi tắt — chúng sinh rất nhiều sự kiện và một số log loại này ngừng ghi khi đầy.</p>

<h3>🛡️ Góc hacker: RDP mở ra Internet</h3>
<p>Bước 2 không phải giả định: Remote Desktop phơi ra Internet là một trong những lối vào bị các nhóm mã độc tống tiền lạm dụng nhiều nhất (MITRE ATT&amp;CK T1021.001). Việc kiểm nhanh của người phòng thủ chính là các log này: số lượng 261/1149 và IP nguồn, các đợt 4625 dồn dập, 4624 type 10 từ IP lạ. Phòng thủ: không mở RDP ra Internet — dùng VPN hoặc cổng trung gian, MFA, chính sách khoá tài khoản.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Xem ai đã vào bằng RDP và từ IP nào ở đâu?" — RemoteConnectionManager 1149, LocalSessionManager 21/24/25, Security 4624 type 10.</li>
<li>"Làm sao thấy đoạn PowerShell kẻ tấn công đã chạy, kể cả khi nó mã hoá base64?" — PowerShell/Operational 4104 script block logging.</li>
<li>"Defender có 1116 mà không có 1117 nghĩa là gì?" — đã phát hiện nhưng chưa xử lý (hoặc xử lý không thành).</li>
<li>"Vì sao log TaskScheduler của tôi trống?" — tắt sẵn; phải bật.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Với ticket "tối qua job không chạy" trên máy chủ Windows, TaskScheduler/Operational trả lời trong một phút — nếu nó đã được bật <em>trước</em> đêm đó. Bật các log Operational hữu ích là một phần của việc dựng máy chủ, không phải của việc điều tra.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy bạn: TaskScheduler/Operational có đang bật không? Bật nó, tạo một tác vụ chạy <code>cmd /c echo hi</code>, chạy thử, rồi tìm các sự kiện 106, 200, 201.</li>
<li>Trong tệp RDP mẫu, có bao nhiêu sự kiện 261, và bao nhiêu IP nguồn khác nhau trong 1149?</li>
<li>Trong <code>defender-1116-1117.evtx</code>, tệp nào bị cách ly và lúc mấy giờ UTC?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) thấy lần lượt 106 (đăng ký), 200 (bắt đầu hành động), 201 (hành động xong); (2) 1 790 sự kiện 261; 3 IP (174.127.93.2, 31.14.75.59, 103.11.244.223); (3) <code>C:\\Users\\admmig\\Documents\\mimikatz.exe</code>, 11/12/2020 12:28:44 UTC.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Log Operational', 'Log riêng của từng thành phần ở Microsoft › Windows › … dành cho quản trị.'],
  ['Log Analytic / Debug', 'Log ẩn, rất chi tiết, để gỡ lỗi một thành phần.'],
  ['1149 / 21 / 24 / 25', 'RDP xác thực thành công / đăng nhập phiên / ngắt / nối lại.'],
  ['4103 / 4104', 'PowerShell ghi module / ghi script block.'],
  ['1116 / 1117', 'Defender phát hiện / Defender đã xử lý.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Windows Logs cho biết chuyện gì xảy ra; log Operational cho biết chi tiết.</li>
<li>RDP, PowerShell, Defender, Firewall, TaskScheduler, DNS Client: nhớ mỗi cái trả lời câu hỏi nào.</li>
<li>Một số log hữu ích tắt sẵn — bật trước khi cần.</li>
</ul>
${nguon('📘', 'Microsoft Learn — about_Logging_Windows (PowerShell)', 'Script block và module logging, sự kiện 4103/4104', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows')}
${nguon('📘', 'Microsoft Learn — Mã sự kiện Defender Antivirus', '1116, 1117, 1151, 5001, 5007…', 'https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus')}
${nguon('🛡️', 'MITRE ATT&CK T1021.001 — Remote Desktop Protocol', 'Kẻ tấn công dùng RDP thế nào, nguồn dữ liệu để phát hiện', 'https://attack.mitre.org/techniques/T1021/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-3-firewall-windows', title: 'Bài 11.3 — Ghi log tường lửa Windows', sub: 'pfirewall.log và 5156/5157 chạy trên Windows Server 2025 thật', cta: 'Mở bài' })}
</div>
`,
};
