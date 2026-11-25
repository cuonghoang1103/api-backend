/**
 * 5.6 — Sysmon (soạn 24/11/2026, agent lgz). Cài/cấu hình Sysmon chỉ làm được trên Windows ⇒ khối mã. Output thật: OUT['s05/sysmon'] — mau/sysmon.evtx + 13 tệp Sysmon công khai (sm/, tai-mau-ch5.ps1: 13 OK).
 * Số tất định: ID 1×876, 3×29, 5×2, 7×18, 8×84, 10×73, 11×47, 12×12, 13×61, 15×2, 16×1, 19/20/21×2; 22 = 0 (không mẫu công khai nào có); sysmon.workstations.cfg SHA1=2EF394EA…;
 * webshell w3wp→cmd /c net user→net→net1 (IIS APPPOOL\DefaultAppPool); rotten potato 15:47:56 w3wp→notepad High → 10/8 → 127.0.0.1:135/49167… → notepad SYSTEM System → 10.0.2.18:888;
 * powercat 10.0.2.13:4444 ← 10.0.2.18:38208 Initiated=false, whoami, systeminfo; lsass 0x1010 mimikatz.exe, 0x143a powershell + 151.101.36.133:443; psinject 82 × 8 powershell→notepad, 7 System.Management.Automation.ni.dll;
 * COM hijack HKCU\Software\Classes\CLSID\{BCDE0395…}\InprocServer32 = C:\ProgramData\demo.dll; Run key a.exe → "c:\windows\tasks\taskhost.exe"; FilterManager 1 SysmonDrv 5/30/2024.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '5.6 — Sysmon: install, a sane config, and reading Event IDs 1, 3, 7, 8, 10, 11, 12–14, 22|||5.6 — Sysmon: cài đặt, một cấu hình hợp lý, và đọc Event ID 1, 3, 7, 8, 10, 11, 12–14, 22',
  slug: 'log-5-6-sysmon',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sysmon (Sysinternals) lấp chỗ trống của log Security: tiến trình kèm hash và tiến trình cha, kết nối mạng theo tiến trình, nạp DLL, CreateRemoteThread, mở bộ nhớ LSASS, tạo tệp, sửa registry, truy vấn DNS. Cài với cấu hình cộng đồng (SwiftOnSecurity, sysmon-modular), ProcessGuid để nối sự kiện. Đọc 7 câu chuyện tấn công THẬT trong mẫu công khai: webshell IIS, Rotten Potato lên SYSTEM, reverse/bind shell powercat, Mimikatz đọc LSASS, tiêm PowerShell vào notepad, chiếm COM, khoá Run — và kẻ tấn công gỡ driver Sysmon.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.6</span>
<h2>The camera Windows forgot to install</h2>
<p class="lead">Even with perfect audit policy (5.5), the Security log cannot tell you which process opened a network connection, which DLL was loaded, or who read the memory of LSASS. <strong>Sysmon</strong> (System Monitor, Sysinternals — by Mark Russinovich and Thomas Garnier; v15.22, September 2026) is a free Microsoft driver + service that writes exactly those facts into its own log, <code>Microsoft-Windows-Sysmon/Operational</code>. Most security teams install it on every Windows machine; most detection rules you will meet (Sigma, Lesson 14.7) assume it.</p>

<h3>The everyday picture: a flight recorder</h3>
<p>The Security log is the passenger list and the boarding gate. Sysmon is the flight data recorder: every control the pilot touched, with exact time and a unique ID per flight (<strong>ProcessGuid</strong>) so you can join the records afterwards even if seat numbers (PIDs) were reused.</p>

${kv([
  ['1 Process creation', 'Image, CommandLine, User, IntegrityLevel, Hashes, ParentImage, ParentCommandLine, ProcessGuid.'],
  ['3 Network connection', 'Process + SourceIp:Port → DestinationIp:Port, Protocol, Initiated (true = outbound).'],
  ['5 Process terminated', 'End of a ProcessGuid.'],
  ['7 Image loaded', 'A DLL loaded into a process (off by default — noisy).'],
  ['8 CreateRemoteThread', 'A process starts a thread inside another — classic injection.'],
  ['10 ProcessAccess', 'A process opens another; GrantedAccess = the rights requested.'],
  ['11 FileCreate', 'A file was created or overwritten.'],
  ['12 / 13 / 14', 'Registry key create/delete / value set / rename.'],
  ['16', 'Sysmon configuration changed.'],
  ['22 DNSEvent', 'A process made a DNS query: QueryName, QueryResults, Image.'],
  ['23 / 26', 'File delete (archived) / file delete detected.'],
])}

<h3>Step 1 — install with a real configuration (Windows, admin)</h3>
<pre><code class="language-powershell"># Download Sysmon from Sysinternals and a community config, then install
Invoke-WebRequest https://download.sysinternals.com/files/Sysmon.zip -OutFile Sysmon.zip; Expand-Archive Sysmon.zip .\\Sysmon
Invoke-WebRequest https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml -OutFile sysmonconfig.xml
.\\Sysmon\\Sysmon64.exe -accepteula -i .\\sysmonconfig.xml

# Later: update the config (no reboot), show the active config, uninstall
.\\Sysmon\\Sysmon64.exe -c .\\sysmonconfig.xml
.\\Sysmon\\Sysmon64.exe -c
.\\Sysmon\\Sysmon64.exe -u

# Read it like any other log (Lessons 5.1–5.3)
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-Sysmon/Operational'; Id = 1 } -MaxEvents 5 | Format-List TimeCreated, Message</code></pre>
<p>Never install Sysmon without a configuration: the defaults (process creation with SHA1 hashes, no network) miss most of the value, and "log everything" (all image loads, all registry writes) drowns a machine. Two well-known starting points: <strong>SwiftOnSecurity/sysmon-config</strong> (one heavily commented file, "high-quality events" philosophy) and <strong>olafhartong/sysmon-modular</strong> (modules mapped to ATT&amp;CK techniques, merged into one file). Every configuration change writes Event ID 16:</p>
${lenh('s05/sysmon', 1)}

<h3>Step 2 — what is in the samples</h3>
${lenh('s05/sysmon', 0)}
<p>One real workstation log plus 13 attack recordings (EVTX-ATTACK-SAMPLES, EVTX-to-MITRE-Attack). Note what is <strong>missing</strong>:</p>
${lenh('s05/sysmon', 10)}
<p>No public sample here contains a DNS query event (ID 22). Read its fields from Microsoft's documentation — <code>QueryName</code>, <code>QueryStatus</code>, <code>QueryResults</code>, <code>Image</code> — and you will generate your own in Lab 5 by running <code>Resolve-DnsName example.com</code> on your Sysmon VM. ID 22 is how you find which process talked to a malicious domain when the firewall only saw the IP.</p>

<h3>Step 3 — Event ID 1: a process with its whole family</h3>
${lenh('s05/sysmon', 2)}
<p>Compare with 4688 (Lesson 4.6): Sysmon adds <strong>Hashes</strong> (look the SHA256 up in VirusTotal or your EDR), the <strong>parent's full command line</strong>, <strong>IntegrityLevel</strong>, the working directory, and <strong>ProcessGuid</strong> — a unique ID that never repeats, unlike PIDs. This ping was started by a batch file running as SYSTEM from <code>C:\\Windows\\Temp</code> — routine for an updater, suspicious for anything else.</p>

<h3>Step 4 — four attacks, told by Sysmon</h3>
<p><strong>A web shell on IIS</strong> (ATT&amp;CK T1505.003):</p>
${lenh('s05/sysmon', 3)}
<p>The web server worker <code>w3wp.exe</code> should serve pages, not start <code>cmd.exe</code>. Parent = w3wp, user = <code>IIS APPPOOL\\DefaultAppPool</code>, command = <code>net user</code>: someone uploaded a script page and is running commands through it. The rule "w3wp/php-cgi/java (Tomcat)/node spawns cmd or powershell" catches web shells in every stack — remember it for Chapter 10.</p>
<p><strong>From web shell to SYSTEM</strong> (Rotten Potato, T1134.001 token impersonation):</p>
${lenh('s05/sysmon', 4)}
<p>Read it in order: w3wp starts notepad (High integrity, still the app-pool account), opens it with full rights (10, 0x1fffff) and injects a thread (8) — the attacker's code now lives in a harmless-looking notepad. Connections to 127.0.0.1:135 and high ports are the local DCOM/RPC trick of the "potato" family; seconds later a <strong>new notepad runs as NT AUTHORITY\\SYSTEM</strong> (System integrity), receives another injected thread and calls home to 10.0.2.18:888. Six Sysmon IDs, one privilege escalation.</p>
<p><strong>A PowerShell shell over the network</strong> (powercat):</p>
${lenh('s05/sysmon', 5)}
<p><code>Initiated=false</code>: the connection came <em>in</em> to powershell.exe listening on port 4444 — a <strong>bind shell</strong> (outbound would be a reverse shell). The first commands an intruder types are always reconnaissance: <code>whoami</code>, <code>systeminfo</code>, <code>netstat -na</code> (Lesson 5.4).</p>
<p><strong>Stealing credentials from LSASS</strong> (T1003.001):</p>
${lenh('s05/sysmon', 6)}
<p>LSASS holds the secrets of logged-on users. Mimikatz <code>sekurlsa::logonpasswords</code> opens it with <strong>GrantedAccess 0x1010</strong> = PROCESS_QUERY_LIMITED_INFORMATION (0x1000) + PROCESS_VM_READ (0x0010) — "let me read your memory". The <code>CallTrace</code> ends in <code>mimikatz.exe+…</code> (the tool was not even renamed). The second sample is <em>Invoke-Mimikatz</em> loaded from GitHub into PowerShell: ID 3 to 151.101.36.133:443 (GitHub's CDN) then ID 10 on lsass with 0x143a. Any non-security process opening lsass with VM_READ deserves an alert.</p>

<h3>Step 5 — injection, persistence, and tampering</h3>
${lenh('s05/sysmon', 7)}
<p><strong>Unmanaged PowerShell injection</strong> (T1055): 82 CreateRemoteThread from powershell.exe into notepad.exe, and notepad loads <code>System.Management.Automation</code> — the PowerShell engine DLL. Notepad has no reason to run PowerShell; this is how attackers execute PowerShell without a <code>powershell.exe</code> process for defenders to watch. ID 7 is off by default precisely because it is noisy — enable it for a short list of DLLs like this one.</p>
${lenh('s05/sysmon', 8)}
${lenh('s05/sysmon', 9)}
<p><strong>Persistence</strong>: a COM hijack (T1546.015) — a per-user <code>InprocServer32</code> pointing a system CLSID to <code>C:\\ProgramData\\demo.dll</code> (ID 11 creates the DLL, ID 13 sets the registry value) — and a classic <strong>Run key</strong> (T1547.001) launching a fake <code>taskhost.exe</code> from <code>C:\\Windows\\Tasks</code>. The unrelated <code>svchost.exe … NetworkList</code> lines are Windows noticing a network change — the kind of background noise your config should filter.</p>
${lenh('s05/sysmon', 11)}
<p><strong>Tampering</strong>: the System log (not Sysmon's) records FilterManager event 1 — the <code>SysmonDrv</code> minifilter was unloaded (for example with <code>fltmc unload SysmonDrv</code>). From that moment Sysmon is blind. Also watch Sysmon ID 4 (service state changed), 16 (configuration changed) and a sudden stop of events from a machine at the collector (Lesson 5.7).</p>

<h3>🛡️ Attacker's corner: they read the same blog posts</h3>
<p>Because Sysmon is everywhere, attackers check for it (<code>fltmc</code>, the service name, the registry key of its config), rename tools, inject into innocent processes and unload the driver — MITRE files driver unloading of security tools under T1685 (Disable or Modify Tools; formerly T1562.001). The defence is layering: Security log + Sysmon + forwarding + an alert on "machine stopped sending Sysmon events". Mimikatz (MITRE S0002) has been used by dozens of groups since 2011; the 0x1010 access mask in this lesson is one of the most-written detection rules in the world, and it still catches intruders who do not bother to change their tools.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Why Sysmon if we have 4688?" — hashes, parent command line, ProcessGuid, network/DLL/registry/file/DNS events, process access to LSASS — none of which the Security log gives.</li>
<li>"How do you detect a web shell in logs?" — a web server process (w3wp, httpd, java, node) spawning cmd/powershell/sh (Sysmon 1 or 4688 with parent).</li>
<li>"What does GrantedAccess 0x1010 on lsass.exe mean?" — query-limited + VM read: reading LSASS memory, typical of credential dumping.</li>
<li>"How would an attacker blind Sysmon, and how do you notice?" — unload the driver/stop the service/replace the config; FilterManager 1, Sysmon 4/16, and silence at the collector.</li>
</ul>

<h3>At work</h3>
<p>If your customer's servers run Sysmon, your application is in that log too: every child process your Java or Node service spawns, every outbound connection (ID 3 shows the database, the payment API, the S3 endpoint), every DNS query. When the security team asks "why does <code>java.exe</code> connect to 52.x.x.x:443 every minute?", answer with your architecture — and expect your deploy scripts (<code>cmd /c</code>, <code>powershell -enc</code>) to trigger their rules; agree on exclusions instead of being surprised.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>In <code>rotten-potato-1-8-3.evtx</code>, list both notepad processes with their ProcessGuid, User and IntegrityLevel. Which Sysmon ID proves the privilege change?</li>
<li>Write a one-line PowerShell filter that finds Sysmon ID 10 events whose TargetImage ends with <code>lsass.exe</code> and whose GrantedAccess contains the 0x10 bit.</li>
<li>On a Windows VM with Sysmon + SwiftOnSecurity config: run <code>Resolve-DnsName example.com</code> and <code>notepad</code>, then find your ID 22 and ID 1. Which fields link them?</li>
</ol>
<p><strong>Pass:</strong> (1) first notepad: IIS APPPOOL\\DefaultAppPool, High; second: NT AUTHORITY\\SYSTEM, System — ID 1 (User, IntegrityLevel) of the second notepad; (2) e.g. <code>Where-Object { $d = ConvertFrom-EventData …; $d.TargetImage -like '*\\lsass.exe' -and ([Convert]::ToInt32($d.GrantedAccess, 16) -band 0x10) }</code>; (3) ID 22 Image = the PowerShell process; join by ProcessGuid/ProcessId with ID 1.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Sysmon', 'Sysinternals driver + service writing Microsoft-Windows-Sysmon/Operational.'],
  ['ProcessGuid', 'Unique process ID across the machine\'s lifetime — join key.'],
  ['GrantedAccess', 'Rights requested when opening a process (ID 10).'],
  ['CreateRemoteThread (8)', 'Thread started in another process — injection.'],
  ['Sysmon config', 'XML include/exclude rules; start from a community config.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Sysmon adds what Security lacks: hashes, parents, network, DLLs, registry, files, DNS, process access.</li>
<li>Install with a curated config; every change is ID 16.</li>
<li>Web server spawning a shell, lsass read access, injection, Run/COM keys — learn their shapes.</li>
<li>Watch for tampering: driver unload, service stop, silence.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Sysmon v15.22', 'Install options, every Event ID and its fields', 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon')}
${nguon('🧰', 'SwiftOnSecurity — sysmon-config', 'Commented starting configuration', 'https://github.com/SwiftOnSecurity/sysmon-config')}
${nguon('🧰', 'olafhartong — sysmon-modular', 'ATT&CK-mapped modular configuration', 'https://github.com/olafhartong/sysmon-modular')}
${nguon('🛡️', 'MITRE ATT&CK T1003.001 — LSASS Memory', 'Credential dumping and its detection', 'https://attack.mitre.org/techniques/T1003/001/')}
${nguon('🛡️', 'MITRE ATT&CK T1505.003 — Web Shell', 'Server software component persistence', 'https://attack.mitre.org/techniques/T1505/003/')}
${nguon('🛡️', 'MITRE ATT&CK T1055 — Process Injection', 'CreateRemoteThread and friends', 'https://attack.mitre.org/techniques/T1055/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-6-tien-trinh-tac-vu', title: 'Lesson 4.6 — Processes, tasks and PowerShell', sub: '4688 and 4104 for comparison', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-7-siem-sigma', title: 'Lesson 14.7 — SIEM and Sigma rules', sub: 'Detection rules written on Sysmon fields', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.6</span>
<h2>Chiếc camera mà Windows quên lắp</h2>
<p class="lead">Kể cả khi audit policy hoàn hảo (5.5), log Security vẫn không cho biết tiến trình nào mở kết nối mạng, DLL nào được nạp, hay ai đã đọc bộ nhớ của LSASS. <strong>Sysmon</strong> (System Monitor, bộ Sysinternals — của Mark Russinovich và Thomas Garnier; v15.22, tháng 9/2026) là một driver + dịch vụ miễn phí của Microsoft ghi đúng những điều đó vào log riêng, <code>Microsoft-Windows-Sysmon/Operational</code>. Phần lớn đội bảo mật cài nó lên mọi máy Windows; phần lớn quy tắc phát hiện bạn sẽ gặp (Sigma, Bài 14.7) mặc định là có nó.</p>

<h3>Liên tưởng đời thường: hộp đen máy bay</h3>
<p>Log Security là danh sách hành khách và cửa lên máy bay. Sysmon là hộp đen: mọi cần điều khiển phi công đã chạm, kèm giờ chính xác và một mã riêng cho từng chuyến bay (<strong>ProcessGuid</strong>) để sau này ghép các bản ghi lại với nhau kể cả khi số ghế (PID) đã được dùng lại.</p>

${kv([
  ['1 Tạo tiến trình', 'Image, CommandLine, User, IntegrityLevel, Hashes, ParentImage, ParentCommandLine, ProcessGuid.'],
  ['3 Kết nối mạng', 'Tiến trình + SourceIp:Port → DestinationIp:Port, Protocol, Initiated (true = đi ra).'],
  ['5 Tiến trình kết thúc', 'Điểm cuối của một ProcessGuid.'],
  ['7 Nạp image', 'Một DLL được nạp vào tiến trình (mặc định tắt — ồn).'],
  ['8 CreateRemoteThread', 'Một tiến trình khởi một luồng bên trong tiến trình khác — tiêm mã kinh điển.'],
  ['10 ProcessAccess', 'Một tiến trình mở tiến trình khác; GrantedAccess = quyền xin cấp.'],
  ['11 FileCreate', 'Một tệp được tạo hoặc ghi đè.'],
  ['12 / 13 / 14', 'Registry: tạo/xoá khoá / đặt giá trị / đổi tên.'],
  ['16', 'Cấu hình Sysmon bị đổi.'],
  ['22 DNSEvent', 'Một tiến trình truy vấn DNS: QueryName, QueryResults, Image.'],
  ['23 / 26', 'Xoá tệp (có lưu bản) / phát hiện xoá tệp.'],
])}

<h3>Bước 1 — cài với một cấu hình thật (Windows, quyền quản trị)</h3>
<pre><code class="language-powershell"># Tải Sysmon từ Sysinternals và một cấu hình cộng đồng, rồi cài
Invoke-WebRequest https://download.sysinternals.com/files/Sysmon.zip -OutFile Sysmon.zip; Expand-Archive Sysmon.zip .\\Sysmon
Invoke-WebRequest https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml -OutFile sysmonconfig.xml
.\\Sysmon\\Sysmon64.exe -accepteula -i .\\sysmonconfig.xml

# Về sau: cập nhật cấu hình (không cần khởi động lại), xem cấu hình đang chạy, gỡ cài
.\\Sysmon\\Sysmon64.exe -c .\\sysmonconfig.xml
.\\Sysmon\\Sysmon64.exe -c
.\\Sysmon\\Sysmon64.exe -u

# Đọc như mọi log khác (Bài 5.1–5.3)
Get-WinEvent -FilterHashtable @{ LogName = 'Microsoft-Windows-Sysmon/Operational'; Id = 1 } -MaxEvents 5 | Format-List TimeCreated, Message</code></pre>
<p>Đừng bao giờ cài Sysmon mà không có cấu hình: mặc định (tạo tiến trình kèm hash SHA1, không theo dõi mạng) bỏ lỡ phần lớn giá trị, còn "ghi hết" (mọi lần nạp DLL, mọi lần ghi registry) thì nhấn chìm cả máy. Hai điểm xuất phát nổi tiếng: <strong>SwiftOnSecurity/sysmon-config</strong> (một tệp chú thích rất kỹ, triết lý "sự kiện chất lượng cao") và <strong>olafhartong/sysmon-modular</strong> (các mô-đun gắn với kỹ thuật ATT&amp;CK, gộp thành một tệp). Mỗi lần đổi cấu hình đều ghi Event ID 16:</p>
${lenh('s05/sysmon', 1)}

<h3>Bước 2 — trong bộ mẫu có gì</h3>
${lenh('s05/sysmon', 0)}
<p>Một log máy trạm thật cộng 13 bản ghi tấn công (EVTX-ATTACK-SAMPLES, EVTX-to-MITRE-Attack). Để ý cái <strong>thiếu</strong>:</p>
${lenh('s05/sysmon', 10)}
<p>Không mẫu công khai nào ở đây có sự kiện truy vấn DNS (ID 22). Đọc các trường của nó theo tài liệu Microsoft — <code>QueryName</code>, <code>QueryStatus</code>, <code>QueryResults</code>, <code>Image</code> — và bạn sẽ tự tạo ra ở Lab 5 bằng cách chạy <code>Resolve-DnsName example.com</code> trên máy ảo có Sysmon. ID 22 là cách tìm tiến trình nào đã nói chuyện với một tên miền độc hại khi tường lửa chỉ thấy IP.</p>

<h3>Bước 3 — Event ID 1: một tiến trình cùng cả gia đình của nó</h3>
${lenh('s05/sysmon', 2)}
<p>So với 4688 (Bài 4.6): Sysmon thêm <strong>Hashes</strong> (tra SHA256 trên VirusTotal hoặc EDR), <strong>dòng lệnh đầy đủ của tiến trình cha</strong>, <strong>IntegrityLevel</strong>, thư mục làm việc, và <strong>ProcessGuid</strong> — một mã duy nhất không bao giờ lặp lại, khác với PID. Lệnh ping này được một tệp batch chạy dưới quyền SYSTEM từ <code>C:\\Windows\\Temp</code> khởi động — bình thường với một chương trình cập nhật, đáng ngờ với mọi thứ khác.</p>

<h3>Bước 4 — bốn cuộc tấn công, do Sysmon kể lại</h3>
<p><strong>Webshell trên IIS</strong> (ATT&amp;CK T1505.003):</p>
${lenh('s05/sysmon', 3)}
<p>Tiến trình worker của web server <code>w3wp.exe</code> lẽ ra chỉ phục vụ trang web, không khởi động <code>cmd.exe</code>. Cha = w3wp, người dùng = <code>IIS APPPOOL\\DefaultAppPool</code>, lệnh = <code>net user</code>: ai đó đã tải lên một trang script và đang chạy lệnh qua nó. Quy tắc "w3wp/php-cgi/java (Tomcat)/node sinh ra cmd hoặc powershell" bắt được webshell ở mọi nền tảng — nhớ nó cho Chương 10.</p>
<p><strong>Từ webshell lên SYSTEM</strong> (Rotten Potato, T1134.001 mạo danh token):</p>
${lenh('s05/sysmon', 4)}
<p>Đọc theo thứ tự: w3wp khởi động notepad (High integrity, vẫn là tài khoản app pool), mở nó với toàn quyền (10, 0x1fffff) và tiêm một luồng (8) — mã của kẻ tấn công giờ sống trong một notepad trông vô hại. Các kết nối tới 127.0.0.1:135 và cổng cao là mánh DCOM/RPC cục bộ của họ "potato"; vài giây sau một <strong>notepad mới chạy dưới NT AUTHORITY\\SYSTEM</strong> (System integrity), nhận thêm một luồng tiêm và gọi về 10.0.2.18:888. Sáu loại ID Sysmon, một lần leo thang đặc quyền.</p>
<p><strong>Shell PowerShell qua mạng</strong> (powercat):</p>
${lenh('s05/sysmon', 5)}
<p><code>Initiated=false</code>: kết nối đi <em>vào</em> powershell.exe đang nghe ở cổng 4444 — một <strong>bind shell</strong> (đi ra thì là reverse shell). Những lệnh đầu tiên kẻ xâm nhập gõ luôn là trinh sát: <code>whoami</code>, <code>systeminfo</code>, <code>netstat -na</code> (Bài 5.4).</p>
<p><strong>Đánh cắp thông tin đăng nhập từ LSASS</strong> (T1003.001):</p>
${lenh('s05/sysmon', 6)}
<p>LSASS giữ bí mật của những người đang đăng nhập. Lệnh <code>sekurlsa::logonpasswords</code> của Mimikatz mở nó với <strong>GrantedAccess 0x1010</strong> = PROCESS_QUERY_LIMITED_INFORMATION (0x1000) + PROCESS_VM_READ (0x0010) — "cho tôi đọc bộ nhớ của anh". <code>CallTrace</code> kết thúc ở <code>mimikatz.exe+…</code> (công cụ còn chẳng được đổi tên). Mẫu thứ hai là <em>Invoke-Mimikatz</em> tải từ GitHub vào PowerShell: ID 3 tới 151.101.36.133:443 (CDN của GitHub) rồi ID 10 vào lsass với 0x143a. Bất kỳ tiến trình không phải phần mềm bảo mật nào mở lsass với VM_READ đều đáng một cảnh báo.</p>

<h3>Bước 5 — tiêm mã, bám trụ và phá hoại</h3>
${lenh('s05/sysmon', 7)}
<p><strong>Tiêm PowerShell không qua powershell.exe</strong> (T1055): 82 CreateRemoteThread từ powershell.exe vào notepad.exe, và notepad nạp <code>System.Management.Automation</code> — DLL bộ máy PowerShell. Notepad chẳng có lý do gì chạy PowerShell; đây là cách kẻ tấn công thực thi PowerShell mà không để lại tiến trình <code>powershell.exe</code> cho người phòng thủ theo dõi. ID 7 mặc định tắt chính vì nó ồn — bật nó cho một danh sách ngắn DLL như cái này.</p>
${lenh('s05/sysmon', 8)}
${lenh('s05/sysmon', 9)}
<p><strong>Bám trụ</strong>: chiếm COM (T1546.015) — một <code>InprocServer32</code> theo người dùng trỏ một CLSID của hệ thống sang <code>C:\\ProgramData\\demo.dll</code> (ID 11 tạo DLL, ID 13 đặt giá trị registry) — và một <strong>khoá Run</strong> kinh điển (T1547.001) chạy một <code>taskhost.exe</code> giả từ <code>C:\\Windows\\Tasks</code>. Mấy dòng <code>svchost.exe … NetworkList</code> không liên quan là Windows ghi nhận đổi mạng — loại tiếng ồn nền mà cấu hình của bạn nên lọc.</p>
${lenh('s05/sysmon', 11)}
<p><strong>Phá hoại</strong>: log System (không phải của Sysmon) ghi sự kiện FilterManager 1 — minifilter <code>SysmonDrv</code> đã bị gỡ (ví dụ bằng <code>fltmc unload SysmonDrv</code>). Từ lúc đó Sysmon mù. Theo dõi thêm Sysmon ID 4 (dịch vụ đổi trạng thái), 16 (đổi cấu hình) và việc một máy đột nhiên ngừng gửi sự kiện về máy gom (Bài 5.7).</p>

<h3>🛡️ Góc hacker: họ cũng đọc cùng các bài blog</h3>
<p>Vì Sysmon có mặt khắp nơi, kẻ tấn công kiểm xem nó có không (<code>fltmc</code>, tên dịch vụ, khoá registry chứa cấu hình), đổi tên công cụ, tiêm vào tiến trình vô hại và gỡ driver — MITRE xếp việc gỡ driver của công cụ bảo mật vào T1685 (Disable or Modify Tools; số cũ T1562.001). Cách phòng thủ là nhiều lớp: log Security + Sysmon + chuyển tiếp + cảnh báo "máy ngừng gửi sự kiện Sysmon". Mimikatz (MITRE S0002) được hàng chục nhóm dùng từ 2011; mặt nạ quyền 0x1010 trong bài này là một trong những quy tắc phát hiện được viết nhiều nhất thế giới, và nó vẫn bắt được những kẻ xâm nhập lười đổi công cụ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Đã có 4688 sao còn cần Sysmon?" — hash, dòng lệnh của cha, ProcessGuid, sự kiện mạng/DLL/registry/tệp/DNS, truy cập tiến trình vào LSASS — log Security không cho cái nào.</li>
<li>"Phát hiện webshell trong log thế nào?" — tiến trình web server (w3wp, httpd, java, node) sinh ra cmd/powershell/sh (Sysmon 1 hoặc 4688 có tiến trình cha).</li>
<li>"GrantedAccess 0x1010 vào lsass.exe nghĩa là gì?" — query-limited + VM read: đọc bộ nhớ LSASS, điển hình của trích xuất thông tin đăng nhập.</li>
<li>"Kẻ tấn công làm Sysmon mù thế nào, và bạn nhận ra thế nào?" — gỡ driver/dừng dịch vụ/thay cấu hình; FilterManager 1, Sysmon 4/16, và sự im lặng ở máy gom.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Nếu máy chủ của khách chạy Sysmon, ứng dụng của bạn cũng nằm trong log đó: mọi tiến trình con mà dịch vụ Java hay Node của bạn sinh ra, mọi kết nối đi ra (ID 3 cho thấy CSDL, API thanh toán, endpoint S3), mọi truy vấn DNS. Khi đội bảo mật hỏi "vì sao <code>java.exe</code> kết nối tới 52.x.x.x:443 mỗi phút?", trả lời bằng kiến trúc của bạn — và lường trước rằng script triển khai (<code>cmd /c</code>, <code>powershell -enc</code>) sẽ kích hoạt quy tắc của họ; thống nhất danh sách loại trừ thay vì để bị bất ngờ.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>rotten-potato-1-8-3.evtx</code>, liệt kê hai tiến trình notepad với ProcessGuid, User và IntegrityLevel. Sysmon ID nào chứng minh việc đổi đặc quyền?</li>
<li>Viết một bộ lọc PowerShell một dòng tìm Sysmon ID 10 có TargetImage kết thúc bằng <code>lsass.exe</code> và GrantedAccess chứa bit 0x10.</li>
<li>Trên máy ảo Windows có Sysmon + cấu hình SwiftOnSecurity: chạy <code>Resolve-DnsName example.com</code> và <code>notepad</code>, rồi tìm ID 22 và ID 1 của bạn. Trường nào nối chúng lại?</li>
</ol>
<p><strong>Đạt:</strong> (1) notepad thứ nhất: IIS APPPOOL\\DefaultAppPool, High; thứ hai: NT AUTHORITY\\SYSTEM, System — ID 1 (User, IntegrityLevel) của notepad thứ hai; (2) ví dụ <code>Where-Object { $d = ConvertFrom-EventData …; $d.TargetImage -like '*\\lsass.exe' -and ([Convert]::ToInt32($d.GrantedAccess, 16) -band 0x10) }</code>; (3) Image của ID 22 = tiến trình PowerShell; nối với ID 1 qua ProcessGuid/ProcessId.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Sysmon', 'Driver + dịch vụ Sysinternals ghi vào Microsoft-Windows-Sysmon/Operational.'],
  ['ProcessGuid', 'Mã tiến trình duy nhất suốt đời máy — khoá để nối.'],
  ['GrantedAccess', 'Quyền xin cấp khi mở một tiến trình (ID 10).'],
  ['CreateRemoteThread (8)', 'Luồng được khởi trong tiến trình khác — tiêm mã.'],
  ['Cấu hình Sysmon', 'Luật include/exclude dạng XML; bắt đầu từ cấu hình cộng đồng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sysmon thêm thứ Security thiếu: hash, tiến trình cha, mạng, DLL, registry, tệp, DNS, truy cập tiến trình.</li>
<li>Cài với cấu hình đã chọn lọc; mỗi lần đổi là một ID 16.</li>
<li>Web server sinh shell, đọc bộ nhớ lsass, tiêm mã, khoá Run/COM — thuộc hình dạng của chúng.</li>
<li>Canh phá hoại: gỡ driver, dừng dịch vụ, im lặng.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Sysmon v15.22', 'Tuỳ chọn cài đặt, mọi Event ID và trường của chúng', 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon')}
${nguon('🧰', 'SwiftOnSecurity — sysmon-config', 'Cấu hình khởi đầu có chú thích', 'https://github.com/SwiftOnSecurity/sysmon-config')}
${nguon('🧰', 'olafhartong — sysmon-modular', 'Cấu hình mô-đun gắn với ATT&CK', 'https://github.com/olafhartong/sysmon-modular')}
${nguon('🛡️', 'MITRE ATT&CK T1003.001 — LSASS Memory', 'Trích xuất thông tin đăng nhập và cách phát hiện', 'https://attack.mitre.org/techniques/T1003/001/')}
${nguon('🛡️', 'MITRE ATT&CK T1505.003 — Web Shell', 'Bám trụ qua thành phần phần mềm máy chủ', 'https://attack.mitre.org/techniques/T1505/003/')}
${nguon('🛡️', 'MITRE ATT&CK T1055 — Process Injection', 'CreateRemoteThread và họ hàng', 'https://attack.mitre.org/techniques/T1055/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-6-tien-trinh-tac-vu', title: 'Bài 4.6 — Tiến trình, tác vụ và PowerShell', sub: '4688 và 4104 để so sánh', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-7-siem-sigma', title: 'Bài 14.7 — SIEM và quy tắc Sigma', sub: 'Quy tắc phát hiện viết trên trường của Sysmon', cta: 'Mở bài' })}
</div>
`,
};
