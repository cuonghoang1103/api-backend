/**
 * 4.5 — Dịch vụ và ứng dụng (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/dich-vu'].
 * Số tất định: system.evtx 7045: 18 driver demand start System32\drivers, 4 VMware Tools auto start…; PsExec 09:27:56.082 7045 PSEXESVC → .102 running → .248 stopped;
 * Metasploit 03:40:41 104 (IEUser) → 03:41:02 7045 KgXItsbKgTJzdzwl %SYSTEMROOT%\duKhLYUX.exe → running/stopped → 03:41:13 7045 hgabms "cmd.exe /c echo hgabms > \\.\pipe\hgabms" → 7009 30000 ms;
 * dbc 7040: 377/376 Windows Modules Installer, 12/12 BITS; 7036 top Multimedia Class Scheduler 222; Windows Update 7036 6 dòng 10-23; 1000: 4 crash c0000005 (svchost ở c:\windows\system32\dllhost\); 7034/7031/1026 = 0.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.5 — Services and applications: 7034, 7036, 7040, 7045, 1000 Application Error, 1001 WER, 1026 .NET Runtime|||4.5 — Dịch vụ và ứng dụng: 7034, 7036, 7040, 7045, 1000 Application Error, 1001 WER, 1026 .NET Runtime',
  slug: 'log-4-5-dich-vu-ung-dung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Service Control Manager kể chuyện dịch vụ: 7045 cài mới, 7036 chạy/dừng, 7040 đổi kiểu khởi động, 7034/7031 chết bất ngờ, 7009 hết giờ chờ; ứng dụng sập 1000/1001 và .NET 1026. Đường nền bình thường (driver, VMware Tools, Windows Modules Installer bật tắt hàng trăm lần) so với dấu vân tay PsExec và Metasploit psexec (tên ngẫu nhiên, named pipe), và một svchost.exe nằm sai thư mục.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Services: the programs that run without anyone logged on</h2>
<p class="lead">A Windows service starts with the machine, runs as a powerful account (often LocalSystem) and needs no user. That makes services the favourite place for software vendors — and for attackers who want to run a command as SYSTEM or survive a reboot. Every service install, start, stop and start-type change is written by the Service Control Manager (SCM) into the System log. Learn the normal noise first, then the fingerprints of remote-execution tools.</p>

<h3>The everyday picture: the building's contractor register</h3>
<p>A new contractor is registered with a badge (7045 — service installed), clocks in and out (7036 — running/stopped), has their contract changed from "on call" to "permanent" (7040 — start type), collapses on the job (7034), and the building calls them back automatically (7031 — recovery action).</p>

${kv([
  ['7045', 'A service was installed: ServiceName, ImagePath, ServiceType, StartType, AccountName.'],
  ['7036', 'Service entered running / stopped state.'],
  ['7040', 'Start type changed (auto start, demand start, disabled).'],
  ['7034 / 7031', 'Service terminated unexpectedly (N times) / … and a recovery action will run.'],
  ['7000 / 7009 / 7011', 'Service failed to start / timed out waiting for it / timeout on a transaction.'],
  ['4697 (Security)', 'A service was installed — the Security-log twin of 7045 (needs auditing).'],
  ['1000 / 1001 (Application)', 'Application crash (Application Error) / its Windows Error Reporting record.'],
  ['1026 (.NET Runtime)', 'A .NET app died from an unhandled exception — with the stack trace.'],
])}

<h3>Step 1 — normal service installs</h3>
${lenh('s04/dich-vu', 0)}
<p>On a fresh Windows 10 (sample <code>system.evtx</code>), 7045 is mostly <strong>kernel drivers</strong> in <code>\\SystemRoot\\System32\\drivers</code> with "demand start" — Windows installs a driver when it detects a device — plus VMware Tools services under <code>C:\\Program Files</code>, and a Defender driver from the definition-update folder. Normal looks like: a known vendor folder, a signed driver, an install time that matches setup or an update.</p>

<h3>Step 2 — PsExec: remote command as SYSTEM</h3>
${lenh('s04/dich-vu', 1)}
<p>Sysinternals PsExec (a legitimate admin tool) copies <code>PSEXESVC.exe</code> to the target's ADMIN$ share, installs it as a service, starts it, runs the command and removes it. The log shape is unmistakable: <strong>7045 PSEXESVC → 7036 running → 7036 stopped</strong>, here within 166 ms, LocalSystem, demand start. On the target's Security log you will also find a 4624 type 3 from the admin's machine just before. Whether it is an attack depends on <em>who</em> and <em>from where</em> — the event alone proves "someone ran PsExec here".</p>

<h3>Step 3 — the same idea, by an attack framework</h3>
${lenh('s04/dich-vu', 2)}
<p>DeepBlueCLI's sample of Metasploit's psexec module: the System log is cleared first (104 by IEUser), then a service with a <strong>random 16-letter name</strong> and a <strong>random .exe in %SYSTEMROOT%</strong> runs for 2 ms. Eleven seconds later a second service whose ImagePath is not a program but a command — <code>cmd.exe /c echo hgabms &gt; \\\\.\\pipe\\hgabms</code> — and 7009 "timeout 30000 ms": the "service" never answers because it was only a trick to make SYSTEM connect to a named pipe so the attacker can impersonate it (a privilege-escalation technique). Random names, a cmd.exe ImagePath, a pipe — three red flags in one event.</p>

<h3>Step 4 — the noise you must not alarm on</h3>
${lenh('s04/dich-vu', 3)}
${lenh('s04/dich-vu', 4)}
${lenh('s04/dich-vu', 5)}
<p><strong>Windows Modules Installer</strong> (TrustedInstaller) flips between auto and demand start 753 times; BITS 24 times — Windows does this around updates. 7036 is the noisiest SCM event of all (thousands per day on a busy server). Rules of thumb: 7040 matters when the service is security-relevant (EventLog — Lesson 4.3; WinDefend; the firewall MpsSvc; Sysmon) or goes to <em>disabled</em>; 7036 matters for <em>your</em> application's service ("did our API service stop at 14:02?") and as the second half of a 7045 story.</p>

<h3>Step 5 — application crashes: one line from Lesson 3.6, one new trick</h3>
${lenh('s04/dich-vu', 6)}
<p>Lesson 3.6 taught how to read an Application Error 1000 (faulting app, module, exception code c0000005 = access violation, offset). Look at the <strong>path</strong> column now: <code>svchost.exe</code> crashed from <code>c:\\windows\\system32\\dllhost\\svchost.exe</code>. The real svchost lives in <code>C:\\Windows\\System32\\</code>; a "svchost" in a sub-folder named after another Windows program is <strong>masquerading</strong> (ATT&amp;CK T1036.005) — and <code>adberdr813.exe</code> crashing from a Downloads folder looks like a fake "Adobe Reader" installer. Crash logs are a cheap way to spot programs that should not exist.</p>

<h3>Step 6 — 7034, 7031 and .NET 1026 (not in the samples)</h3>
${lenh('s04/dich-vu', 7)}
<p>The samples contain no crashed service and no .NET crash, so here is what to read when you meet them (you will create a 7034/7031 in Lab 4):</p>
<ul>
<li><strong>7034</strong>: "The <em>X</em> service terminated unexpectedly. It has done this <em>N</em> time(s)." — N rising every hour means a crash loop.</li>
<li><strong>7031</strong>: the same plus "The following corrective action will be taken in 60000 milliseconds: Restart the service." — recovery is configured; the service may look "up" in monitoring while it crashes every minute.</li>
<li><strong>1026</strong> (.NET Runtime, Application): "Application: MyApi.exe · CoreCLR Version … · Description: The process was terminated due to an unhandled exception. · Exception Info: System.NullReferenceException … at …" — a full stack trace, often the only one you get from a crashed Windows service written in C#. For Node.js or Java services wrapped as Windows services (NSSM, WinSW, Tomcat), the stack trace is in the app's own log (Chapter 10); the SCM only tells you that it died.</li>
</ul>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Services installed on this PC, newest first — anything you don't recognise?
Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Service Control Manager'; Id = 7045 } -ErrorAction SilentlyContinue |
  ForEach-Object { $x = [xml]$_.ToXml(); $d = @{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }
    [pscustomobject]@{ Time = $_.TimeCreated; Name = $d.ServiceName; Path = $d.ImagePath; Account = $d.AccountName } } |
  Format-Table -AutoSize -Wrap
# Services that crashed in the last 7 days
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Id = 7031,7034; StartTime = (Get-Date).AddDays(-7) } -ErrorAction SilentlyContinue | Format-Table TimeCreated, Message -Wrap</code></pre>

<h3>🛡️ Attacker's corner: services for lateral movement and persistence</h3>
<p>Installing a service on a remote machine is the classic way to run code as SYSTEM over the network (ATT&amp;CK T1569.002 Service Execution) and to survive reboots (T1543.003 Windows Service). PsExec (MITRE S0029) is used by admins and attackers alike: Microsoft's analysis of <strong>NotPetya</strong> (June 2017) describes it spreading inside networks with a PsExec copy — MITRE notes it dropped PsExec under the name <code>dllhost.dat</code> — together with stolen credentials. On the defender side, 7045 is one of the highest-value events in Windows: few per month on a stable server, and each new one has a name, a path and an account you can check against a list of approved software.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Which event shows a new service, and what do you look at?" — 7045 (and 4697): name, ImagePath (folder, cmd.exe, random names), account, start type.</li>
<li>"What does PsExec leave on the target?" — 4624 type 3 from the source, 7045 PSEXESVC, 7036 running/stopped (and the file in ADMIN$).</li>
<li>"A service keeps restarting but monitoring says it is up. How do you prove it?" — count 7031/7034 over time; read the app's own log for the crash.</li>
<li>"svchost.exe crashed — always benign?" — check the path; svchost outside System32/SysWOW64 is masquerading.</li>
</ul>

<h3>At work</h3>
<p>Deploying a Node.js or Spring Boot API as a Windows service (NSSM, WinSW, or <code>sc create</code>) is common in outsourcing projects for customers on Windows Server. When "the API is down": 7036 tells you when the service stopped, 7034/7031 whether it crashed and restarted, 7040 if someone set it to disabled, and 1000/1026 or your app log why. Put the service name in your runbook so the on-call person can filter in one click.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>In <code>psexec-msf-system.evtx</code>, list the three properties of the first 7045 that point to an attack tool rather than an admin.</li>
<li>Why does the second 7045 end with 7009 and not with 7036 running?</li>
<li>On your own PC, run the first PowerShell block. Pick one service you do not recognise and find out what it is (vendor, path, signature).</li>
</ol>
<p><strong>Pass:</strong> (1) random 16-letter service name, random .exe name, binary directly in %SYSTEMROOT% (plus: the System log was cleared 21 s before); (2) cmd.exe is not a real service — it never reports "running" to the SCM, which waits 30 s and gives up; its only purpose was to make SYSTEM touch the named pipe; (3) the answer names the vendor and the signed path, or flags it for review.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['SCM', 'Service Control Manager — writes 70xx events in System.'],
  ['7045 / 4697', 'Service installed (System / Security).'],
  ['7036 / 7040', 'State change / start-type change.'],
  ['7034 / 7031', 'Unexpected termination / termination with recovery action.'],
  ['ImagePath', 'What the service runs — the field to check first.'],
  ['Masquerading', 'A malicious file named like a Windows one, in the wrong folder.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>7045 is rare and valuable: name, path, account, start type.</li>
<li>PsExec = 7045 PSEXESVC + 7036 running/stopped; frameworks add random names and pipes.</li>
<li>7040/7036 are noisy — care about security services, "disabled", and your own services.</li>
<li>Crash events reveal wrong-folder binaries; 7031/7034/1026 explain restarting services.</li>
</ul>
${nguon('🛡️', 'MITRE ATT&CK T1543.003 — Windows Service', 'and T1569.002 Service Execution', 'https://attack.mitre.org/techniques/T1543/003/')}
${nguon('🛡️', 'MITRE ATT&CK S0029 — PsExec', 'Who uses it, how it works', 'https://attack.mitre.org/software/S0029/')}
${nguon('📰', 'Microsoft Security Blog (27/6/2017) — New ransomware, old techniques: Petya adds worm capabilities', 'NotPetya lateral movement with PsExec/WMIC', 'https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/')}
${nguon('📘', 'Microsoft Learn — 4697(S): A service was installed in the system', 'Security-log twin of 7045', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4697')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Lesson 3.6 — Reliability Monitor and crashes', sub: 'Reading 1000/1001 field by field', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-6-java-slf4j-cau-hinh', title: 'Lesson 10.6 — Java/Spring logging', sub: 'Where the stack trace of a crashed service really is', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Dịch vụ: những chương trình chạy khi không ai đăng nhập</h2>
<p class="lead">Một dịch vụ Windows khởi động cùng máy, chạy dưới một tài khoản mạnh (thường là LocalSystem) và không cần người dùng. Vì thế dịch vụ là nơi ưa thích của các hãng phần mềm — và của kẻ tấn công muốn chạy một lệnh dưới quyền SYSTEM hoặc sống sót qua lần khởi động lại. Mỗi lần cài, chạy, dừng và đổi kiểu khởi động một dịch vụ đều được Service Control Manager (SCM) ghi vào log System. Học tiếng ồn bình thường trước, rồi tới dấu vân tay của các công cụ chạy lệnh từ xa.</p>

<h3>Liên tưởng đời thường: sổ nhà thầu của toà nhà</h3>
<p>Một nhà thầu mới được đăng ký và cấp thẻ (7045 — cài dịch vụ), chấm công vào và ra (7036 — chạy/dừng), được đổi hợp đồng từ "gọi khi cần" sang "thường trực" (7040 — kiểu khởi động), ngã quỵ khi đang làm (7034), và toà nhà tự động gọi họ quay lại (7031 — hành động phục hồi).</p>

${kv([
  ['7045', 'Một dịch vụ được cài: ServiceName, ImagePath, ServiceType, StartType, AccountName.'],
  ['7036', 'Dịch vụ chuyển sang trạng thái running / stopped.'],
  ['7040', 'Kiểu khởi động bị đổi (auto start, demand start, disabled).'],
  ['7034 / 7031', 'Dịch vụ chết bất ngờ (N lần) / … và sẽ chạy hành động phục hồi.'],
  ['7000 / 7009 / 7011', 'Dịch vụ không khởi động được / hết giờ chờ nó / hết giờ chờ một giao dịch.'],
  ['4697 (Security)', 'Một dịch vụ được cài — bản sinh đôi của 7045 trong log Security (cần bật kiểm toán).'],
  ['1000 / 1001 (Application)', 'Ứng dụng sập (Application Error) / bản ghi Windows Error Reporting của nó.'],
  ['1026 (.NET Runtime)', 'Ứng dụng .NET chết vì ngoại lệ không được bắt — kèm stack trace.'],
])}

<h3>Bước 1 — cài dịch vụ bình thường</h3>
${lenh('s04/dich-vu', 0)}
<p>Trên một Windows 10 mới cài (mẫu <code>system.evtx</code>), 7045 phần lớn là <strong>driver nhân</strong> trong <code>\\SystemRoot\\System32\\drivers</code> với "demand start" — Windows cài driver khi phát hiện thiết bị — cộng các dịch vụ VMware Tools dưới <code>C:\\Program Files</code>, và một driver của Defender từ thư mục cập nhật mẫu nhận diện. Bình thường trông như: thư mục của một hãng quen thuộc, driver có chữ ký, thời điểm cài khớp với lúc cài máy hoặc cập nhật.</p>

<h3>Bước 2 — PsExec: chạy lệnh từ xa dưới quyền SYSTEM</h3>
${lenh('s04/dich-vu', 1)}
<p>PsExec của Sysinternals (một công cụ quản trị hợp lệ) chép <code>PSEXESVC.exe</code> vào thư mục chia sẻ ADMIN$ của máy đích, cài nó thành dịch vụ, chạy, thực thi lệnh rồi gỡ đi. Hình dạng trong log không lẫn đi đâu được: <strong>7045 PSEXESVC → 7036 running → 7036 stopped</strong>, ở đây trong 166 ms, LocalSystem, demand start. Trong log Security của máy đích bạn còn thấy một 4624 type 3 từ máy của quản trị viên ngay trước đó. Có phải tấn công không phụ thuộc vào <em>ai</em> và <em>từ đâu</em> — riêng sự kiện này chỉ chứng minh "có người đã chạy PsExec ở đây".</p>

<h3>Bước 3 — cùng ý tưởng, do một bộ công cụ tấn công làm</h3>
${lenh('s04/dich-vu', 2)}
<p>Mẫu của DeepBlueCLI về module psexec của Metasploit: log System bị xoá trước (104 bởi IEUser), rồi một dịch vụ có <strong>tên ngẫu nhiên 16 chữ cái</strong> và <strong>một tệp .exe tên ngẫu nhiên trong %SYSTEMROOT%</strong> chạy trong 2 ms. Mười một giây sau là dịch vụ thứ hai mà ImagePath không phải chương trình mà là một câu lệnh — <code>cmd.exe /c echo hgabms &gt; \\\\.\\pipe\\hgabms</code> — và 7009 "hết giờ chờ 30000 ms": "dịch vụ" đó không bao giờ trả lời vì nó chỉ là mánh để SYSTEM kết nối vào một named pipe, cho kẻ tấn công mạo danh SYSTEM (một kỹ thuật leo thang đặc quyền). Tên ngẫu nhiên, ImagePath là cmd.exe, một pipe — ba dấu đỏ trong một sự kiện.</p>

<h3>Bước 4 — tiếng ồn không được báo động</h3>
${lenh('s04/dich-vu', 3)}
${lenh('s04/dich-vu', 4)}
${lenh('s04/dich-vu', 5)}
<p><strong>Windows Modules Installer</strong> (TrustedInstaller) lật qua lại giữa auto và demand start 753 lần; BITS 24 lần — Windows làm vậy quanh các đợt cập nhật. 7036 là sự kiện SCM ồn nhất (hàng nghìn dòng mỗi ngày trên máy chủ bận). Luật nhớ nhanh: 7040 đáng quan tâm khi dịch vụ liên quan bảo mật (EventLog — Bài 4.3; WinDefend; tường lửa MpsSvc; Sysmon) hoặc bị chuyển sang <em>disabled</em>; 7036 đáng quan tâm với dịch vụ của <em>chính ứng dụng bạn</em> ("dịch vụ API của mình có dừng lúc 14:02 không?") và như nửa sau của một câu chuyện 7045.</p>

<h3>Bước 5 — ứng dụng sập: một dòng ôn Bài 3.6, một mánh mới</h3>
${lenh('s04/dich-vu', 6)}
<p>Bài 3.6 đã dạy đọc Application Error 1000 (ứng dụng lỗi, module, mã ngoại lệ c0000005 = vi phạm truy cập bộ nhớ, offset). Giờ nhìn cột <strong>đường dẫn</strong>: <code>svchost.exe</code> sập từ <code>c:\\windows\\system32\\dllhost\\svchost.exe</code>. svchost thật nằm trong <code>C:\\Windows\\System32\\</code>; một "svchost" trong thư mục con mang tên một chương trình Windows khác là <strong>giả danh</strong> (ATT&amp;CK T1036.005) — còn <code>adberdr813.exe</code> sập từ thư mục Downloads trông như một bộ cài "Adobe Reader" giả. Log sập là cách rẻ để phát hiện các chương trình lẽ ra không được tồn tại.</p>

<h3>Bước 6 — 7034, 7031 và .NET 1026 (không có trong mẫu)</h3>
${lenh('s04/dich-vu', 7)}
<p>Bộ mẫu không có dịch vụ nào sập và không có lần sập .NET nào, nên đây là những gì cần đọc khi bạn gặp chúng (bạn sẽ tạo một 7034/7031 trong Lab 4):</p>
<ul>
<li><strong>7034</strong>: "Dịch vụ <em>X</em> đã dừng bất ngờ. Nó đã làm vậy <em>N</em> lần." — N tăng mỗi giờ nghĩa là vòng lặp sập.</li>
<li><strong>7031</strong>: như trên cộng "Hành động khắc phục sau sẽ được thực hiện sau 60000 mili giây: Restart the service." — đã cấu hình phục hồi; hệ giám sát có thể thấy dịch vụ "vẫn sống" trong khi nó sập mỗi phút.</li>
<li><strong>1026</strong> (.NET Runtime, Application): "Application: MyApi.exe · CoreCLR Version … · Description: The process was terminated due to an unhandled exception. · Exception Info: System.NullReferenceException … at …" — một stack trace đầy đủ, thường là cái duy nhất bạn có từ một dịch vụ Windows viết bằng C# bị sập. Với dịch vụ Node.js hoặc Java được bọc thành dịch vụ Windows (NSSM, WinSW, Tomcat), stack trace nằm trong log riêng của ứng dụng (Chương 10); SCM chỉ cho biết nó đã chết.</li>
</ul>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Các dịch vụ đã cài trên máy này, mới nhất lên đầu — có cái nào bạn không nhận ra?
Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Service Control Manager'; Id = 7045 } -ErrorAction SilentlyContinue |
  ForEach-Object { $x = [xml]$_.ToXml(); $d = @{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }
    [pscustomobject]@{ Luc = $_.TimeCreated; Ten = $d.ServiceName; DuongDan = $d.ImagePath; TaiKhoan = $d.AccountName } } |
  Format-Table -AutoSize -Wrap
# Dịch vụ bị sập trong 7 ngày qua
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Id = 7031,7034; StartTime = (Get-Date).AddDays(-7) } -ErrorAction SilentlyContinue | Format-Table TimeCreated, Message -Wrap</code></pre>

<h3>🛡️ Góc hacker: dịch vụ để di chuyển ngang và bám trụ</h3>
<p>Cài một dịch vụ lên máy ở xa là cách kinh điển để chạy mã dưới quyền SYSTEM qua mạng (ATT&amp;CK T1569.002 Service Execution) và để sống sót qua khởi động lại (T1543.003 Windows Service). PsExec (MITRE S0029) được cả quản trị viên lẫn kẻ tấn công dùng: phân tích của Microsoft về <strong>NotPetya</strong> (tháng 6/2017) mô tả nó lây trong mạng nội bộ bằng một bản PsExec — MITRE ghi nhận nó thả PsExec dưới tên <code>dllhost.dat</code> — cùng với thông tin đăng nhập đánh cắp được. Ở phía phòng thủ, 7045 là một trong những sự kiện giá trị nhất của Windows: chỉ vài lần mỗi tháng trên một máy chủ ổn định, và mỗi lần mới đều có tên, đường dẫn và tài khoản để đối chiếu với danh sách phần mềm được phép.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Sự kiện nào cho thấy một dịch vụ mới, và bạn xem gì?" — 7045 (và 4697): tên, ImagePath (thư mục, cmd.exe, tên ngẫu nhiên), tài khoản, kiểu khởi động.</li>
<li>"PsExec để lại gì trên máy đích?" — 4624 type 3 từ máy nguồn, 7045 PSEXESVC, 7036 running/stopped (và tệp trong ADMIN$).</li>
<li>"Một dịch vụ cứ khởi động lại nhưng hệ giám sát báo vẫn chạy. Chứng minh thế nào?" — đếm 7031/7034 theo thời gian; đọc log riêng của ứng dụng để biết vì sao sập.</li>
<li>"svchost.exe sập — lúc nào cũng vô hại?" — xem đường dẫn; svchost ngoài System32/SysWOW64 là giả danh.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Triển khai API Node.js hoặc Spring Boot thành dịch vụ Windows (NSSM, WinSW, hoặc <code>sc create</code>) rất hay gặp trong dự án outsourcing cho khách dùng Windows Server. Khi "API chết": 7036 cho biết dịch vụ dừng lúc nào, 7034/7031 cho biết nó có sập rồi tự chạy lại không, 7040 nếu có ai đặt nó thành disabled, và 1000/1026 hoặc log ứng dụng cho biết vì sao. Ghi tên dịch vụ vào runbook để người trực lọc được bằng một cú bấm.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>psexec-msf-system.evtx</code>, kể ba đặc điểm của 7045 đầu tiên cho thấy đây là công cụ tấn công chứ không phải quản trị viên.</li>
<li>Vì sao 7045 thứ hai kết thúc bằng 7009 chứ không phải 7036 running?</li>
<li>Trên máy của bạn, chạy khối PowerShell đầu tiên. Chọn một dịch vụ bạn không nhận ra và tìm hiểu nó là gì (hãng, đường dẫn, chữ ký).</li>
</ol>
<p><strong>Đạt khi:</strong> (1) tên dịch vụ ngẫu nhiên 16 chữ cái, tên .exe ngẫu nhiên, tệp nằm thẳng trong %SYSTEMROOT% (thêm: log System bị xoá 21 giây trước đó); (2) cmd.exe không phải dịch vụ thật — nó không bao giờ báo "running" cho SCM, SCM chờ 30 giây rồi bỏ cuộc; mục đích duy nhất của nó là khiến SYSTEM chạm vào named pipe; (3) câu trả lời nêu được hãng và đường dẫn có chữ ký, hoặc đánh dấu để xem xét.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['SCM', 'Service Control Manager — ghi các sự kiện 70xx vào System.'],
  ['7045 / 4697', 'Cài dịch vụ (System / Security).'],
  ['7036 / 7040', 'Đổi trạng thái / đổi kiểu khởi động.'],
  ['7034 / 7031', 'Dừng bất ngờ / dừng kèm hành động phục hồi.'],
  ['ImagePath', 'Thứ mà dịch vụ chạy — trường cần xem đầu tiên.'],
  ['Giả danh', 'Tệp độc hại đặt tên như tệp Windows, nằm sai thư mục.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>7045 hiếm và quý: tên, đường dẫn, tài khoản, kiểu khởi động.</li>
<li>PsExec = 7045 PSEXESVC + 7036 running/stopped; bộ công cụ tấn công thêm tên ngẫu nhiên và pipe.</li>
<li>7040/7036 ồn — chỉ quan tâm dịch vụ bảo mật, "disabled", và dịch vụ của chính bạn.</li>
<li>Sự kiện sập lộ ra tệp nằm sai thư mục; 7031/7034/1026 giải thích dịch vụ cứ khởi động lại.</li>
</ul>
${nguon('🛡️', 'MITRE ATT&CK T1543.003 — Windows Service', 'và T1569.002 Service Execution', 'https://attack.mitre.org/techniques/T1543/003/')}
${nguon('🛡️', 'MITRE ATT&CK S0029 — PsExec', 'Ai dùng, hoạt động thế nào', 'https://attack.mitre.org/software/S0029/')}
${nguon('📰', 'Microsoft Security Blog (27/6/2017) — New ransomware, old techniques: Petya adds worm capabilities', 'NotPetya lây ngang bằng PsExec/WMIC', 'https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/')}
${nguon('📘', 'Microsoft Learn — 4697(S): A service was installed in the system', 'Bản sinh đôi của 7045 trong log Security', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4697')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Bài 3.6 — Reliability Monitor và crash', sub: 'Đọc 1000/1001 từng trường', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-6-java-slf4j-cau-hinh', title: 'Bài 10.6 — Log Java/Spring', sub: 'Stack trace của dịch vụ bị sập thật ra nằm ở đâu', cta: 'Mở bài' })}
</div>
`,
};
