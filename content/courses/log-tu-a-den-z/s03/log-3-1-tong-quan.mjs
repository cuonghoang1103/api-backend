/**
 * 3.1 — Dạo một vòng Event Viewer (soạn 24/11/2026, agent lgz).
 * Máy soạn là Linux và điều phối KHÔNG cho dựng máy ảo Windows (24/11 17:40) ⇒ output thật lấy từ BỘ EVTX MẪU CÔNG KHAI (log thật của máy Windows thật):
 * github.com/omerbenamram/evtx/samples + github.com/Yamato-Security/hayabusa-sample-evtx (DeepBlueCLI, EVTX-to-MITRE-Attack), đọc bằng evtx-rec (_demo/s03/bin)
 * trong container lgz-c03 (PowerShell 7.4 + pyevtx-rs). Lệnh Event Viewer/Get-WinEvent cho máy Windows của người học là KHỐI MÃ (không kèm output giả).
 * Số tất định: 17 tệp, 8414 sự kiện System (5620 Service Control Manager), 10630 sự kiện / 419 Critical-Error-Warning, 263 × DNS-Client 1014.
 */
import { lenh, ma, ra, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.1 — Event Viewer tour: Windows Logs and Applications and Services Logs|||3.1 — Dạo một vòng Event Viewer: Windows Logs (Application, Security, Setup, System, Forwarded Events) và Applications and Services Logs',
  slug: 'log-3-1-tong-quan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở eventvwr.msc, hiểu cây bên trái: năm log Windows Logs, nhánh Applications and Services Logs, Custom Views › Administrative Events; ai ghi vào log nào, cần quyền gì để xem Security. Thực hành trên 17 tệp .evtx thật (bộ mẫu công khai) — đếm kênh, provider, lỗi/cảnh báo bằng PowerShell.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Event Viewer: the logbook every Windows machine already keeps</h2>
<p class="lead">Every Windows PC — your laptop, the company's file server, the build agent in the corner — writes thousands of events a day. The tool to read them has shipped with Windows since NT: <strong>Event Viewer</strong>. This lesson walks through its tree, explains which log holds what and who writes into it, and then reads 17 real <code>.evtx</code> files from real Windows machines so that the numbers you see are real, not invented.</p>

<h3>The everyday picture: a building with many logbooks</h3>
<p>Think of a big office building. The front desk keeps a visitor book (<strong>Security</strong>: who came in, who was refused). The building manager keeps a maintenance log (<strong>System</strong>: power, lifts, heating — drivers, services, boot and shutdown). Each tenant company keeps its own diary (<strong>Application</strong>: what each program says about itself). The renovation crew keeps a work log (<strong>Setup</strong>: Windows updates and feature installs). And some departments keep specialised notebooks — the IT room, the security camera team, the cleaning crew — those are <strong>Applications and Services Logs</strong>.</p>

<h3>Open it</h3>
<pre><code class="language-powershell"># On your Windows PC (Win + R, or a PowerShell window):
eventvwr.msc                 # the snap-in; "Run as administrator" to see Security
Get-WinEvent -ListLog Application,Security,Setup,System,ForwardedEvents |
  Format-Table LogName,RecordCount,FileSize,MaximumSizeInBytes,LogMode -AutoSize</code></pre>
<p>Event Viewer has three panes: the <strong>tree</strong> on the left, the <strong>event list + preview</strong> in the middle, the <strong>Actions</strong> pane on the right (Open Saved Log, Create Custom View, Filter Current Log, Find, Save All Events As, Attach a Task, Properties). The Security log needs administrator rights (or membership in <em>Event Log Readers</em>); a normal user opening it gets "Access is denied".</p>

<h3>The tree, branch by branch</h3>
<ul>
<li><strong>Custom Views › Administrative Events</strong> — a built-in filter: every Critical, Error and Warning from all administrative logs. A good first click when "something is wrong" but you don't know where.</li>
<li><strong>Windows Logs</strong> — the five classic logs:
<ul>
<li><strong>Application</strong> — programs and many Windows components (crashes 1000/1001, installers, .NET, SQL Server, antivirus).</li>
<li><strong>Security</strong> — the audit trail: logons 4624/4625, account changes, privilege use. Only the Local Security Authority writes here; what gets written depends on the <em>audit policy</em> (Chapter 5).</li>
<li><strong>Setup</strong> — Windows update/feature installation (servicing).</li>
<li><strong>System</strong> — the OS itself: services (Service Control Manager), drivers, boot/shutdown (6005/6006/1074/41), time, networking.</li>
<li><strong>Forwarded Events</strong> — empty on a normal PC; on a collector it receives events forwarded from other machines (Windows Event Forwarding, Lesson 5.7).</li>
</ul></li>
<li><strong>Applications and Services Logs</strong> — hundreds of per-component logs, mostly under <em>Microsoft › Windows › &lt;component&gt; › Operational</em>: TaskScheduler, PowerShell, Windows Defender, TerminalServices, DNS Client, Firewall… (Lesson 3.3).</li>
<li><strong>Subscriptions</strong> — Windows Event Forwarding subscriptions on a collector.</li>
</ul>

<h3>Real files: what a log looks like on disk</h3>
<p>Each log is one file under <code>%SystemRoot%\\System32\\winevt\\Logs</code>; a <code>/</code> in the log name becomes <code>%4</code> in the file name (<code>Microsoft-Windows-LiveId/Operational</code> → <code>Microsoft-Windows-LiveId%4Operational.evtx</code>). Event Viewer opens any such file through <em>Action › Open Saved Log</em>. We use a public collection of real files shared by the forensics community. Download them on your own PC with this script (it checks every SHA256):</p>
${ma('powershell', 's03/mau/tai-mau.ps1.txt')}
${ra('s03/mau/tai-mau')}
<div class="callout"><p><strong>How the output in Chapters 3–5 is produced.</strong> <code>Get-WinEvent</code> exists only on Windows. The course machine is Linux, so the real output below comes from reading these <em>same .evtx files</em> with <code>evtx-rec</code> — a 40-line reader built on the open-source Rust EVTX parser — inside PowerShell 7. On your Windows PC, <code>Get-WinEvent -Path .\\mau\\system.evtx</code> or Event Viewer › Open Saved Log shows the same events (plus the rendered "Message" text, Lesson 3.2).</p></div>
${ma('python', 's03/bin/evtx-rec')}

<h3>Step 1 — which file is which log</h3>
${lenh('s03/tong-quan', 0)}
${lenh('s03/tong-quan', 1)}
<p>Read the table like the Event Viewer tree: the <em>Kenh</em> (channel) column is the log name. Note the dates — some files cover days, some years: <code>dbc-many-events-system.evtx</code> spans 2009 → 2016 because those were lab machines turned on now and then. <code>Archive-ForwardedEvents-test.evtx</code> is a Forwarded Events log containing Application, Security and System events from <em>several</em> machines — that is what a collector looks like.</p>

<h3>Step 2 — who writes into System and Application</h3>
${lenh('s03/tong-quan', 2)}
${lenh('s03/tong-quan', 3)}
<p>The <em>provider</em> (Event Viewer's "Source" column) is the component that wrote the event. In System, <strong>Service Control Manager</strong> dominates (5620 of 8414): every service start/stop is an event 7036. Then Windows Update client, Plug and Play, DNS Client, Kernel-General (boot/shutdown time), EventLog (6005/6006), USER32 (1074 — who restarted the PC). In Application: licensing (Security-SPP), MsiInstaller (every install/uninstall), ESENT (the database engine under Windows Search), Restart Manager. Knowing the usual providers is how you notice an unusual one.</p>

<h3>Step 3 — "Administrative Events" by hand</h3>
${lenh('s03/tong-quan', 4)}
${lenh('s03/tong-quan', 5)}
<p>Of 10 630 events only <strong>419</strong> are Critical/Error/Warning — that is what the Administrative Events view would show. The top one is 263 × <code>DNS-Client 1014</code> ("name resolution timed out") — on a lab VM that often loses its network this is noise. The lesson: errors in Event Viewer are <em>normal</em>; a healthy Windows PC has hundreds. What matters is <strong>a new kind</strong> of error, or <strong>a burst</strong> at the time the problem started.</p>

<div class="pitfall co-tieu-de"><p><strong>"Event Viewer is full of red, my PC must be broken."</strong> No. Support scams have used exactly this for years: a caller asks you to open Event Viewer, points at the Errors and Warnings, and "proves" the PC is infected. Microsoft states plainly that it does not make unsolicited calls to offer technical support. A healthy PC has plenty of errors (Step 3). Read errors in context (when, how often, since when), never in bulk.</p></div>

<h3>Real-life situation: "the PC has been slow since I installed X"</h3>
<p>Open <em>Windows Logs › Application</em>, sort by Date, scroll to the day you installed X: you will see <code>MsiInstaller 11707/1033</code> ("Installation completed successfully") with the product name and version. Then look at <em>System</em> after that time for new services (<code>7045</code>), service errors (<code>7000/7009/7011</code>) and slow boots. Lab 3 does exactly this on a real machine.</p>

<h3>🛡️ Attacker's corner: the log is evidence, so it is a target</h3>
<p>Because Event Viewer records logons, new services and log clearing, attackers try to erase it: the NotPetya wiper (June 2017) ran <code>wevtutil cl</code> on Setup, System, Security and Application before rebooting the machine (Microsoft's analysis; MITRE ATT&amp;CK S0368). Clearing leaves its own trace — Security event 1102, System event 104 — which is why the first habit of a defender is to <strong>copy logs off the machine</strong> (Chapter 15). Lesson 4.3 reads those two events.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Name the logs under Windows Logs and what each contains." — Application, Security, Setup, System, Forwarded Events; one sentence each as above.</li>
<li>"Why can't a normal user see the Security log?" — it is protected; administrators or Event Log Readers only.</li>
<li>"Where are the log files on disk?" — <code>%SystemRoot%\\System32\\winevt\\Logs\\*.evtx</code>, <code>/</code> → <code>%4</code>.</li>
<li>"There are 300 errors in System. Is the server broken?" — not by itself; compare with a baseline, look for new event types and bursts at the time of the incident.</li>
</ul>

<h3>At work (outsourcing / OJT)</h3>
<p>A customer's Windows server "restarted by itself". Before anyone logs in to look around, ask for an export: <em>System</em> and <em>Application</em> as <code>.evtx</code> (Lesson 3.4). You can read them on your own laptop with Event Viewer › Open Saved Log — no remote access needed, nothing changed on the production server, and the evidence stays as it was.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your own Windows PC, run <code>Get-WinEvent -ListLog *</code> as administrator: how many logs exist, how many have events, how many are disabled?</li>
<li>Download the sample set with <code>tai-mau.ps1</code>, open <code>dbc-many-events-system.evtx</code> in Event Viewer (Open Saved Log). Sort by Source: which provider has the most events?</li>
<li>In the same file, Filter Current Log to Critical + Error. How many? Which Event ID is the most common error?</li>
</ol>
<p><strong>Pass:</strong> (1) numbers from <code>(Get-WinEvent -ListLog *).Count</code>, <code>| Where-Object RecordCount -gt 0</code> and <code>| Where-Object {-not $_.IsEnabled}</code>; (2) Service Control Manager, 5620; (3) 46 errors in System, the most common is Service Control Manager 7011 (25 — "a timeout was reached while waiting for a transaction response").</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Event Viewer (eventvwr.msc)', 'The built-in snap-in to read Windows event logs.'],
  ['Log / channel', 'A named stream of events (System, Security, Microsoft-Windows-PowerShell/Operational…), one .evtx file each.'],
  ['Provider (Source)', 'The component that wrote the event (Service Control Manager, USER32…).'],
  ['Administrative Events', 'Built-in custom view: Critical + Error + Warning from all admin logs.'],
  ['Applications and Services Logs', 'Per-component logs, mostly Microsoft › Windows › … › Operational.'],
  ['Forwarded Events', 'Log that receives events forwarded from other machines.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Five Windows Logs + hundreds of Applications and Services Logs; each is an .evtx file in winevt\\Logs.</li>
<li>The provider tells you who wrote the event; learn the usual ones.</li>
<li>Errors are normal; look for new kinds and bursts.</li>
<li>Security needs admin rights and is a target for attackers — copy logs off the machine.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Windows Event Log', 'Channels, logs, the event schema', 'https://learn.microsoft.com/en-us/windows/win32/wes/windows-event-log')}
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'Parameters -ListLog, -LogName, -Path, -FilterHashtable', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${nguon('🧰', 'omerbenamram/evtx — samples', 'Open-source EVTX parser and the real sample files used here', 'https://github.com/omerbenamram/evtx')}
${nguon('🧰', 'Yamato-Security/hayabusa-sample-evtx', 'Collection including DeepBlueCLI and EVTX-to-MITRE-Attack samples', 'https://github.com/Yamato-Security/hayabusa-sample-evtx')}
${nguon('🛡️', 'Microsoft Security Blog (27/6/2017) — Petya adds worm capabilities', 'NotPetya clears the System, Setup, Security, Application event logs', 'https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-1-3-windows', title: 'Blue Team & SIEM — 1.3 Windows Event Log', sub: 'The same logs seen from a SIEM', cta: 'Open' })}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-15-4-powershell-cho-nguoi-biet-bash', title: 'Linux & Bash — 15.4 PowerShell for bash users', sub: 'Objects and pipelines if PowerShell is new to you', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Event Viewer: cuốn sổ nhật ký mọi máy Windows đều tự ghi</h2>
<p class="lead">Mọi máy Windows — laptop của bạn, máy chủ tệp của công ty, máy build ở góc phòng — mỗi ngày ghi hàng nghìn sự kiện. Công cụ để đọc chúng có sẵn trong Windows từ thời NT: <strong>Event Viewer</strong>. Bài này đi một vòng cây thư mục của nó, giải thích log nào chứa gì và ai ghi vào, rồi đọc 17 tệp <code>.evtx</code> thật từ các máy Windows thật — để mọi con số bạn thấy là số thật, không bịa.</p>

<h3>Liên tưởng đời thường: một toà nhà có nhiều cuốn sổ</h3>
<p>Hình dung một toà văn phòng lớn. Quầy lễ tân giữ sổ khách (<strong>Security</strong>: ai vào, ai bị từ chối). Ban quản lý toà nhà giữ sổ bảo trì (<strong>System</strong>: điện, thang máy, điều hoà — tức driver, dịch vụ, bật/tắt máy). Mỗi công ty thuê văn phòng giữ nhật ký riêng (<strong>Application</strong>: mỗi chương trình tự kể về mình). Đội sửa chữa giữ sổ thi công (<strong>Setup</strong>: cập nhật Windows, cài tính năng). Và vài phòng ban giữ sổ chuyên môn — phòng IT, đội camera, đội vệ sinh — đó là <strong>Applications and Services Logs</strong>.</p>

<h3>Mở ra</h3>
<pre><code class="language-powershell"># Trên máy Windows của bạn (Win + R, hoặc một cửa sổ PowerShell):
eventvwr.msc                 # snap-in; "Run as administrator" thì mới xem được Security
Get-WinEvent -ListLog Application,Security,Setup,System,ForwardedEvents |
  Format-Table LogName,RecordCount,FileSize,MaximumSizeInBytes,LogMode -AutoSize</code></pre>
<p>Event Viewer có ba khung: <strong>cây</strong> bên trái, <strong>danh sách sự kiện + xem nhanh</strong> ở giữa, khung <strong>Actions</strong> bên phải (Open Saved Log, Create Custom View, Filter Current Log, Find, Save All Events As, Attach a Task, Properties). Log Security cần quyền quản trị (hoặc là thành viên nhóm <em>Event Log Readers</em>); người dùng thường mở sẽ nhận "Access is denied".</p>

<h3>Cây thư mục, từng nhánh</h3>
<ul>
<li><strong>Custom Views › Administrative Events</strong> — bộ lọc có sẵn: mọi Critical, Error, Warning từ tất cả log quản trị. Cú bấm đầu tiên tốt khi "có gì đó sai" mà chưa biết ở đâu.</li>
<li><strong>Windows Logs</strong> — năm log cổ điển:
<ul>
<li><strong>Application</strong> — chương trình và nhiều thành phần Windows (crash 1000/1001, trình cài đặt, .NET, SQL Server, phần mềm diệt virus).</li>
<li><strong>Security</strong> — dấu vết kiểm toán: đăng nhập 4624/4625, đổi tài khoản, dùng đặc quyền. Chỉ Local Security Authority được ghi vào đây; ghi gì phụ thuộc <em>audit policy</em> (Chương 5).</li>
<li><strong>Setup</strong> — cài cập nhật/tính năng của Windows (servicing).</li>
<li><strong>System</strong> — chính hệ điều hành: dịch vụ (Service Control Manager), driver, bật/tắt máy (6005/6006/1074/41), giờ, mạng.</li>
<li><strong>Forwarded Events</strong> — trống trên máy thường; trên máy thu gom thì chứa sự kiện chuyển tới từ máy khác (Windows Event Forwarding, Bài 5.7).</li>
</ul></li>
<li><strong>Applications and Services Logs</strong> — hàng trăm log riêng của từng thành phần, phần lớn nằm ở <em>Microsoft › Windows › &lt;thành phần&gt; › Operational</em>: TaskScheduler, PowerShell, Windows Defender, TerminalServices, DNS Client, Firewall… (Bài 3.3).</li>
<li><strong>Subscriptions</strong> — các đăng ký Windows Event Forwarding trên máy thu gom.</li>
</ul>

<h3>Tệp thật: một log trông thế nào trên đĩa</h3>
<p>Mỗi log là một tệp trong <code>%SystemRoot%\\System32\\winevt\\Logs</code>; dấu <code>/</code> trong tên log thành <code>%4</code> trong tên tệp (<code>Microsoft-Windows-LiveId/Operational</code> → <code>Microsoft-Windows-LiveId%4Operational.evtx</code>). Event Viewer mở được mọi tệp như vậy qua <em>Action › Open Saved Log</em>. Ta dùng một bộ tệp thật do cộng đồng điều tra số chia sẻ công khai. Tải về máy bạn bằng script này (có kiểm SHA256 từng tệp):</p>
${ma('powershell', 's03/mau/tai-mau.ps1.txt')}
${ra('s03/mau/tai-mau')}
<div class="callout"><p><strong>Output của Chương 3–5 được tạo ra thế nào.</strong> <code>Get-WinEvent</code> chỉ có trên Windows. Máy soạn bài chạy Linux, nên output thật dưới đây có được bằng cách đọc <em>chính các tệp .evtx này</em> bằng <code>evtx-rec</code> — một bộ đọc 40 dòng dựng trên bộ phân tích EVTX mã nguồn mở viết bằng Rust — trong PowerShell 7. Trên máy Windows của bạn, <code>Get-WinEvent -Path .\\mau\\system.evtx</code> hoặc Event Viewer › Open Saved Log cho thấy đúng các sự kiện đó (kèm câu "Message" đã được dựng sẵn, Bài 3.2).</p></div>
${ma('python', 's03/bin/evtx-rec')}

<h3>Bước 1 — tệp nào là log nào</h3>
${lenh('s03/tong-quan', 0)}
${lenh('s03/tong-quan', 1)}
<p>Đọc bảng như đọc cây của Event Viewer: cột <em>Kenh</em> (kênh) chính là tên log. Để ý ngày tháng — có tệp chỉ vài ngày, có tệp nhiều năm: <code>dbc-many-events-system.evtx</code> trải từ 2009 tới 2016 vì đó là máy lab thỉnh thoảng mới bật. <code>Archive-ForwardedEvents-test.evtx</code> là một log Forwarded Events chứa sự kiện Application, Security, System của <em>nhiều</em> máy — máy thu gom trông như thế.</p>

<h3>Bước 2 — ai ghi vào System và Application</h3>
${lenh('s03/tong-quan', 2)}
${lenh('s03/tong-quan', 3)}
<p><em>Provider</em> (cột "Source" trong Event Viewer) là thành phần đã ghi sự kiện. Trong System, <strong>Service Control Manager</strong> áp đảo (5620 trên 8414): mỗi lần một dịch vụ bật/tắt là một sự kiện 7036. Sau đó là Windows Update, Plug and Play, DNS Client, Kernel-General (giờ bật/tắt máy), EventLog (6005/6006), USER32 (1074 — ai khởi động lại máy). Trong Application: cấp phép (Security-SPP), MsiInstaller (mỗi lần cài/gỡ phần mềm), ESENT (bộ máy CSDL dưới Windows Search), Restart Manager. Thuộc mặt các provider quen thuộc là cách để nhận ra một provider lạ.</p>

<h3>Bước 3 — tự làm "Administrative Events"</h3>
${lenh('s03/tong-quan', 4)}
${lenh('s03/tong-quan', 5)}
<p>Trong 10 630 sự kiện chỉ <strong>419</strong> là Critical/Error/Warning — đó là thứ khung Administrative Events sẽ hiện. Đứng đầu là 263 lần <code>DNS-Client 1014</code> ("hết thời gian chờ phân giải tên") — trên một máy ảo lab hay mất mạng thì đây là nhiễu. Bài học: lỗi trong Event Viewer là <em>bình thường</em>; một máy Windows khoẻ mạnh có hàng trăm lỗi. Điều đáng chú ý là <strong>một loại lỗi mới</strong>, hoặc <strong>một đợt dồn dập</strong> đúng lúc sự cố bắt đầu.</p>

<div class="pitfall co-tieu-de"><p><strong>"Event Viewer toàn màu đỏ, chắc máy hỏng rồi."</strong> Không phải. Lừa đảo "hỗ trợ kỹ thuật" đã dùng đúng chiêu này nhiều năm: kẻ gọi điện bảo bạn mở Event Viewer, chỉ vào các Error và Warning, rồi "chứng minh" máy bị nhiễm. Microsoft nói rõ họ không tự gọi điện để "hỗ trợ kỹ thuật". Một máy khoẻ mạnh vẫn có rất nhiều lỗi (Bước 3). Đọc lỗi theo ngữ cảnh (lúc nào, bao nhiêu lần, từ khi nào), đừng đọc theo số lượng.</p></div>

<h3>Tình huống đời thường: "máy chậm từ hôm cài phần mềm X"</h3>
<p>Mở <em>Windows Logs › Application</em>, xếp theo Date, kéo tới ngày cài X: bạn sẽ thấy <code>MsiInstaller 11707/1033</code> ("Installation completed successfully") kèm tên và phiên bản sản phẩm. Rồi xem <em>System</em> sau thời điểm đó: dịch vụ mới (<code>7045</code>), dịch vụ lỗi (<code>7000/7009/7011</code>), khởi động chậm. Lab 3 làm đúng việc này trên một máy thật.</p>

<h3>🛡️ Góc hacker: log là bằng chứng, nên log là mục tiêu</h3>
<p>Vì Event Viewer ghi đăng nhập, dịch vụ mới và cả việc xoá log, kẻ tấn công tìm cách xoá nó: mã độc phá huỷ NotPetya (tháng 6/2017) chạy <code>wevtutil cl</code> với Setup, System, Security và Application trước khi khởi động lại máy (Microsoft đã phân tích công khai; MITRE ATT&amp;CK S0368). Việc xoá cũng để lại dấu — sự kiện Security 1102, System 104 — nên thói quen đầu tiên của người phòng thủ là <strong>chép log ra khỏi máy</strong> (Chương 15). Bài 4.3 đọc hai sự kiện đó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Kể tên các log trong Windows Logs và mỗi log chứa gì." — Application, Security, Setup, System, Forwarded Events; mỗi cái một câu như trên.</li>
<li>"Vì sao người dùng thường không xem được Security?" — log được bảo vệ; chỉ quản trị viên hoặc nhóm Event Log Readers.</li>
<li>"Tệp log nằm đâu trên đĩa?" — <code>%SystemRoot%\\System32\\winevt\\Logs\\*.evtx</code>, <code>/</code> thành <code>%4</code>.</li>
<li>"System có 300 lỗi. Máy chủ hỏng à?" — tự nó chưa nói lên gì; so với mức nền, tìm loại sự kiện mới và đợt dồn dập đúng giờ sự cố.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Máy chủ Windows của khách "tự khởi động lại". Trước khi ai đó đăng nhập vào ngó nghiêng, hãy xin bản xuất: <em>System</em> và <em>Application</em> dạng <code>.evtx</code> (Bài 3.4). Bạn đọc chúng ngay trên laptop của mình bằng Event Viewer › Open Saved Log — không cần truy cập từ xa, không thay đổi gì trên máy chủ thật, bằng chứng giữ nguyên.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy Windows của bạn, chạy <code>Get-WinEvent -ListLog *</code> bằng quyền quản trị: có bao nhiêu log, bao nhiêu log có sự kiện, bao nhiêu log đang tắt?</li>
<li>Tải bộ mẫu bằng <code>tai-mau.ps1</code>, mở <code>dbc-many-events-system.evtx</code> trong Event Viewer (Open Saved Log). Xếp theo Source: provider nào nhiều sự kiện nhất?</li>
<li>Cũng tệp đó, Filter Current Log lấy Critical + Error. Bao nhiêu sự kiện? Event ID lỗi nào hay gặp nhất?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) có số từ <code>(Get-WinEvent -ListLog *).Count</code>, <code>| Where-Object RecordCount -gt 0</code> và <code>| Where-Object {-not $_.IsEnabled}</code>; (2) Service Control Manager, 5620; (3) 46 lỗi trong System, hay gặp nhất là Service Control Manager 7011 (25 lần — "hết thời gian chờ phản hồi giao dịch").</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Event Viewer (eventvwr.msc)', 'Snap-in có sẵn để đọc log sự kiện Windows.'],
  ['Log / kênh (channel)', 'Một dòng sự kiện có tên (System, Security, Microsoft-Windows-PowerShell/Operational…), mỗi cái một tệp .evtx.'],
  ['Provider (Source)', 'Thành phần đã ghi sự kiện (Service Control Manager, USER32…).'],
  ['Administrative Events', 'Custom view có sẵn: Critical + Error + Warning của mọi log quản trị.'],
  ['Applications and Services Logs', 'Log riêng của từng thành phần, phần lớn ở Microsoft › Windows › … › Operational.'],
  ['Forwarded Events', 'Log nhận sự kiện chuyển tới từ máy khác.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm Windows Logs + hàng trăm Applications and Services Logs; mỗi log là một tệp .evtx trong winevt\\Logs.</li>
<li>Provider cho biết ai đã ghi; hãy thuộc mặt các provider quen.</li>
<li>Lỗi là bình thường; tìm loại mới và đợt dồn dập.</li>
<li>Security cần quyền quản trị và là mục tiêu của kẻ tấn công — chép log ra khỏi máy.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Windows Event Log', 'Kênh, log, lược đồ sự kiện', 'https://learn.microsoft.com/en-us/windows/win32/wes/windows-event-log')}
${nguon('📘', 'Microsoft Learn — Get-WinEvent', 'Tham số -ListLog, -LogName, -Path, -FilterHashtable', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent')}
${nguon('🧰', 'omerbenamram/evtx — samples', 'Bộ phân tích EVTX mã nguồn mở và các tệp mẫu thật dùng ở đây', 'https://github.com/omerbenamram/evtx')}
${nguon('🧰', 'Yamato-Security/hayabusa-sample-evtx', 'Bộ sưu tập gồm mẫu DeepBlueCLI và EVTX-to-MITRE-Attack', 'https://github.com/Yamato-Security/hayabusa-sample-evtx')}
${nguon('🛡️', 'Microsoft Security Blog (27/6/2017) — Petya thêm khả năng tự lây', 'NotPetya xoá các log System, Setup, Security, Application', 'https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-1-3-windows', title: 'Blue Team & SIEM — 1.3 Windows Event Log', sub: 'Cũng những log này nhìn từ SIEM', cta: 'Mở bài' })}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-15-4-powershell-cho-nguoi-biet-bash', title: 'Linux & Bash — 15.4 PowerShell cho người biết bash', sub: 'Đối tượng và pipeline nếu PowerShell còn mới với bạn', cta: 'Mở bài' })}
</div>
`,
};
