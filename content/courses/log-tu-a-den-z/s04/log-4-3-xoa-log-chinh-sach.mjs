/**
 * 4.3 — Dấu hiệu can thiệp (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/xoa-log'].
 * Số tất định: clear-104-1102 = 1 × 1102 (rec 109054, 18:09:51) + 90 × 104 (18:04:30 System rec 5073; 89 lần 18:11:09→18:11:12), OFFSEC\admmig;
 * clear-4688-native: 14 × wevtutil cl (19:07:25.659→19:07:26.143); dung-eventlog: 104 21:04:25, 7040 EventLog auto→disabled 21:04:32, disabled→auto 21:04:51 (jwrig);
 * audit-4719: 30 nhóm con trong 0 s bởi admmig (%%8448 / %%8448, %%8450); dbc 4719 bởi IE10WIN7$ 2016-08-18; time-4616 +259200 s bằng powershell.exe, −259423.8 s svchost (LOCAL SERVICE);
 * security.evtx 4616: 18 lần lệch < 5 s + 8 lần nhảy lớn (vmtoolsd). ATT&CK: T1685.005 (số cũ T1070.001), T1685.001 (số cũ T1562.002) — kiểm 24/11/2026.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.3 — Tampering signals: 1102 security log cleared, 104 system log cleared, 4719 audit policy changed, 4616 time changed|||4.3 — Dấu hiệu can thiệp: 1102 xoá Security log, 104 xoá System log, 4719 đổi audit policy, 4616 đổi giờ',
  slug: 'log-4-3-xoa-log-chinh-sach',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Xoá log cũng để lại dấu: 1102 (Security) và 104 (mọi log khác) cho biết ai xoá, log nào, lúc nào; wevtutil cl trong 4688; tắt dịch vụ Event Log (7040); 4719 tắt audit policy — giải mã GUID nhóm con; 4616 đổi giờ hệ thống và khác biệt với đồng bộ giờ bình thường. Đọc trên mẫu thật: 90 log bị xoá trong 3 giây, 30 nhóm audit bị tắt trong cùng một giây, đồng hồ bị đẩy 3 ngày.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Erasing the log is itself an event</h2>
<p class="lead">After doing damage, an intruder wants to remove the evidence. On Windows the quick ways are: clear the logs, stop the Event Log service, switch auditing off, or move the clock. Each of these is recorded — by the very system they try to blind. This lesson teaches the five events to treat as <strong>always worth an alert</strong>, and how to tell them from legitimate maintenance.</p>

<h3>The everyday picture: the shop's CCTV recorder</h3>
<p>A thief can wipe the recorder's disk, but the recorder writes "disk formatted at 02:13 by user admin" on the new disk. They can unplug the camera — and the recording shows a black gap. They can change the recorder's clock — and the next sync shows a jump. Each trick leaves a different mark; you need to know all four.</p>

<h3>1102 and 104 — who cleared which log</h3>
${lenh('s04/xoa-log', 0)}
${lenh('s04/xoa-log', 1)}
${lenh('s04/xoa-log', 2)}
<ul>
<li><strong>1102</strong> (Security log, provider <code>Microsoft-Windows-Eventlog</code>): "The audit log was cleared". It is the <em>first</em> event of the new, empty Security log, with <code>SubjectUserName</code> and <code>SubjectLogonId</code> of whoever did it.</li>
<li><strong>104</strong> (written in the <em>System</em> log): "The <code>Channel</code> log file was cleared" — for System, Application and every other log. <code>data.Channel</code> names the victim.</li>
</ul>
<p>The story in this sample (EVTX-to-MITRE-Attack, domain OFFSEC): admmig clears System at 18:04, Security at 18:09, then <strong>89 more logs in 3 seconds</strong> — no person clicks that fast; it is a loop like <code>wevtutil el | ForEach-Object { wevtutil cl $_ }</code>. Note the record number: the 1102 is record <strong>109054</strong>. Clearing empties the file but the numbering continues, so a SIEM that last received record 108 900 can tell how many events were destroyed.</p>

<h3>The command that did it (4688)</h3>
${lenh('s04/xoa-log', 3)}
<p>If process creation with command line is audited (Lesson 4.6, 5.5), the clearing tool itself is recorded: 14 <code>wevtutil cl</code> in half a second by admmig. Other ways — PowerShell <code>Clear-EventLog</code>/<code>Remove-EventLog</code>, the .NET API, WMI — produce PowerShell 4104 or WMI traces instead; 1102/104 come in every case.</p>

<h3>Stopping the Event Log service (7040, 7036)</h3>
${lenh('s04/xoa-log', 4)}
<p>Sample from DeepBlueCLI: user jwrig clears System, sets the Windows Event Log service to <strong>disabled</strong> (7040), and 19 seconds later back to auto start. While the service is stopped, <em>nothing</em> is written — the evidence is the gap and the two 7040 events around it (ATT&amp;CK T1685.001, "Disable or Modify Windows Event Log"). In Lesson 4.5 you will see Service Control Manager events like these in detail.</p>

<h3>4719 — auditing switched off</h3>
${lenh('s04/xoa-log', 5)}
${lenh('s04/xoa-log', 6)}
<p>4719 = "System audit policy was changed". The subcategory comes as a GUID; the course's table <code>guid-auditpol.tsv</code> (from Microsoft's [MS-GPAC] specification — on Windows, <code>auditpol /list /subcategory:* /v</code> prints the same) turns it into a name. <code>AuditPolicyChanges</code>: <code>%%8448</code> = Success removed, <code>%%8450</code> = Failure removed (the "added" values are 8449/8451). Here <strong>30 subcategories lost success and failure auditing in the same second</strong> — Logon, Account Lockout, Special Logon, Process Creation, User Account Management, Audit Policy Change… That is <code>auditpol /clear</code> or <code>auditpol /remove</code>: from this second on, 4624/4625/4688/4720 simply stop appearing.</p>
${lenh('s04/xoa-log', 7)}
<p>Compare: on the Windows 7 sample, 4719 comes from <code>IE10WIN7$</code> — the machine applying its own policy at setup or Group Policy refresh. Subject = computer account, at boot/GPO time → normal; Subject = a person, many subcategories removed at once → incident.</p>

<h3>4616 — the clock was moved</h3>
${lenh('s04/xoa-log', 8)}
${lenh('s04/xoa-log', 9)}
<p>4616 records <code>PreviousTime</code>, <code>NewTime</code>, who and which process. In the attack sample, admmig moves the clock <strong>+3 days (259 200 s)</strong> with powershell.exe (<code>Set-Date</code>); minutes later the Windows Time service (svchost as LOCAL SERVICE) jumps it back. Why would anyone do that? To make later actions look like they happened on another day, to confuse timelines, or to defeat time-limited licences and certificates. Normal 4616: the Time service correcting a few seconds, VMware Tools fixing the clock after a VM resumes (the 8 big jumps on <code>security.evtx</code> are <code>vmtoolsd.exe</code>), a person changing timezone in Settings (<code>dllhost.exe</code>). Ask: which process, which account, how big?</p>

<div class="pitfall co-tieu-de"><p><strong>Missing events do not always mean tampering.</strong> A log that is full and set to "Overwrite" (Lesson 3.5) also loses old events — silently, without 1102. Before you write "attacker cleared the logs", check the log size and mode, the record numbers, and whether 1102/104 exist.</p></div>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Run as administrator: has anything been cleared, audit changed or time moved on this PC?
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 1102,4719,4616 } -MaxEvents 50 -ErrorAction SilentlyContinue | Format-Table TimeCreated, Id, Message -Wrap
Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Microsoft-Windows-Eventlog'; Id = 104 } -ErrorAction SilentlyContinue | Format-Table TimeCreated, Message -Wrap
auditpol /get /category:*     # what is audited right now</code></pre>

<h3>🛡️ Attacker's corner: Olympic Destroyer and friends</h3>
<p>Clearing Windows event logs is ATT&amp;CK <strong>T1685.005</strong> "Clear Windows Event Logs" (old number T1070.001 — ATT&amp;CK renumbered it; the old link redirects). It is in the playbook of real malware: MITRE documents that <strong>Olympic Destroyer</strong> — which disrupted the opening of the PyeongChang Winter Olympics in February 2018 — tries to clear the System and Security logs with <code>wevtutil</code>; NotPetya (2017, Lesson 3.1) cleared them too. Defence is boring and effective: forward events off the machine in near real time (Windows Event Forwarding or an agent, Chapter 15), alert on 1102/104/4719 <em>every time</em>, and limit who holds "Manage auditing and security log".</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you know logs were cleared?" — 1102 in Security, 104 in System (with the channel), plus record-number gaps and the clearing command in 4688/4104.</li>
<li>"Can an attacker clear logs without leaving 1102?" — stopping the service or patching it in memory avoids 1102 but leaves 7040/7036 or a silent gap; that is why forwarding beats local logs.</li>
<li>"What is 4719?" — audit policy changed; many subcategories removed at once by a user is a strong signal.</li>
<li>"Why care about 4616?" — moved clocks break timelines; check process, account and size of the jump.</li>
</ul>

<h3>At work</h3>
<p>Your SIEM fires "Security log cleared" on a customer's server at 22:40. Before escalating: who (Subject) and from which session (Logon ID → 4624 → IP); is there a change ticket (some admins clear a full log during maintenance — bad practice, but not an attack); what happened in the minutes before on <em>other</em> sources that were not cleared (firewall, EDR, the SIEM copy). Write down the record number of the 1102: it tells the customer exactly how much evidence the clear destroyed on the machine.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>In <code>clear-104-1102.evtx</code>, which log was cleared first and how many minutes before the Security log?</li>
<li>In <code>audit-4719.evtx</code>, find the subcategory that would have recorded the attacker's <em>next</em> new user account. Was it switched off?</li>
<li>Is the 4616 by <code>dllhost.exe</code> (−8.1 s) suspicious? Explain in one sentence.</li>
</ol>
<p><strong>Pass:</strong> (1) System at 18:04:30, about 5 minutes before Security (18:09:51); (2) User Account Management (0cce9235) — yes, it is in the list of 30; (3) not by itself: dllhost hosts the Settings/Date-and-Time UI, the user admmig adjusted a few seconds right after the Time service resync — but in this sample it follows a +3-day move, so it belongs to the same story.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['1102', 'Security log cleared (first record of the new log).'],
  ['104', 'Another log cleared; data.Channel = which one.'],
  ['4719', 'System audit policy changed; %%8448 Success removed, %%8450 Failure removed.'],
  ['4616', 'System time changed: PreviousTime, NewTime, process.'],
  ['7040', 'A service’s start type changed — for EventLog, a red flag.'],
  ['T1685.005', 'ATT&amp;CK: Clear Windows Event Logs (formerly T1070.001).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Clearing, stopping, de-auditing and clock-moving each leave a distinct event.</li>
<li>1102/104/4719 deserve an alert every time; check who and from which session.</li>
<li>Record numbers survive a clear and measure the loss.</li>
<li>The cure is forwarding: evidence that has already left the machine cannot be wiped.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 1102(S): The audit log was cleared', 'Fields and recommendation', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-1102')}
${nguon('📘', 'Microsoft Learn — 4719(S): System audit policy was changed', 'Subcategory GUID and Changes values', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4719')}
${nguon('📘', '[MS-GPAC] Subcategory and SubcategoryGUID', 'The GUID table used by guid-auditpol.tsv', 'https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-gpac/77878370-0712-47cd-997d-b07053429f6d')}
${nguon('📘', 'Microsoft Learn — 4616(S): The system time was changed', 'PreviousTime, NewTime, process', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4616')}
${nguon('🛡️', 'MITRE ATT&CK T1685.005 — Clear Windows Event Logs', 'Procedure examples incl. Olympic Destroyer (S0365)', 'https://attack.mitre.org/techniques/T1685/005/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-5-kich-thuoc-luu-tru', title: 'Lesson 3.5 — Log size, overwrite and retention', sub: 'Silent loss without 1102', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: 'Chapter 14 — Security investigation with logs', sub: 'Investigating a clear across several sources', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Xoá log cũng là một sự kiện</h2>
<p class="lead">Gây chuyện xong, kẻ xâm nhập muốn xoá bằng chứng. Trên Windows có mấy cách nhanh: xoá log, dừng dịch vụ Event Log, tắt kiểm toán, hoặc vặn đồng hồ. Cách nào cũng bị ghi lại — bởi chính hệ thống mà chúng định bịt mắt. Bài này dạy năm sự kiện phải coi là <strong>lúc nào cũng đáng cảnh báo</strong>, và cách phân biệt chúng với công việc bảo trì hợp lệ.</p>

<h3>Liên tưởng đời thường: đầu ghi camera của cửa hàng</h3>
<p>Kẻ trộm có thể xoá ổ của đầu ghi, nhưng đầu ghi viết lên ổ mới dòng "ổ được định dạng lúc 02:13 bởi admin". Chúng có thể rút dây camera — và đoạn ghi có một khoảng đen. Chúng có thể chỉnh đồng hồ đầu ghi — và lần đồng bộ sau lộ ra một cú nhảy. Mỗi mánh để lại một dấu khác nhau; bạn cần biết cả bốn.</p>

<h3>1102 và 104 — ai đã xoá log nào</h3>
${lenh('s04/xoa-log', 0)}
${lenh('s04/xoa-log', 1)}
${lenh('s04/xoa-log', 2)}
<ul>
<li><strong>1102</strong> (log Security, provider <code>Microsoft-Windows-Eventlog</code>): "The audit log was cleared". Nó là sự kiện <em>đầu tiên</em> của log Security mới, rỗng, kèm <code>SubjectUserName</code> và <code>SubjectLogonId</code> của người đã xoá.</li>
<li><strong>104</strong> (ghi trong log <em>System</em>): "Tệp log <code>Channel</code> đã bị xoá" — cho System, Application và mọi log khác. <code>data.Channel</code> gọi tên nạn nhân.</li>
</ul>
<p>Câu chuyện trong mẫu này (EVTX-to-MITRE-Attack, domain OFFSEC): admmig xoá System lúc 18:04, Security lúc 18:09, rồi <strong>thêm 89 log nữa trong 3 giây</strong> — không ai bấm chuột nhanh như vậy; đó là một vòng lặp kiểu <code>wevtutil el | ForEach-Object { wevtutil cl $_ }</code>. Để ý số bản ghi: 1102 là bản ghi số <strong>109054</strong>. Xoá làm rỗng tệp nhưng việc đánh số vẫn tiếp tục, nên một SIEM đã nhận tới bản ghi 108 900 sẽ tính được bao nhiêu sự kiện đã bị huỷ.</p>

<h3>Lệnh đã làm việc đó (4688)</h3>
${lenh('s04/xoa-log', 3)}
<p>Nếu bật kiểm toán tạo tiến trình kèm dòng lệnh (Bài 4.6, 5.5), chính công cụ xoá cũng bị ghi lại: 14 lệnh <code>wevtutil cl</code> trong nửa giây do admmig chạy. Các cách khác — PowerShell <code>Clear-EventLog</code>/<code>Remove-EventLog</code>, API .NET, WMI — để lại dấu PowerShell 4104 hoặc WMI thay vào đó; còn 1102/104 thì cách nào cũng có.</p>

<h3>Dừng dịch vụ Event Log (7040, 7036)</h3>
${lenh('s04/xoa-log', 4)}
<p>Mẫu của DeepBlueCLI: người dùng jwrig xoá System, đặt dịch vụ Windows Event Log thành <strong>disabled</strong> (7040), và 19 giây sau đặt lại auto start. Trong lúc dịch vụ dừng, <em>không có gì</em> được ghi — bằng chứng là khoảng trống và hai sự kiện 7040 hai bên (ATT&amp;CK T1685.001, "Disable or Modify Windows Event Log"). Ở Bài 4.5 bạn sẽ gặp các sự kiện Service Control Manager kiểu này kỹ hơn.</p>

<h3>4719 — kiểm toán bị tắt</h3>
${lenh('s04/xoa-log', 5)}
${lenh('s04/xoa-log', 6)}
<p>4719 = "Chính sách kiểm toán hệ thống đã bị thay đổi". Nhóm con đi kèm dưới dạng GUID; bảng <code>guid-auditpol.tsv</code> của khoá (lấy từ đặc tả [MS-GPAC] của Microsoft — trên Windows, <code>auditpol /list /subcategory:* /v</code> in ra đúng bảng đó) đổi nó thành tên. <code>AuditPolicyChanges</code>: <code>%%8448</code> = Success removed, <code>%%8450</code> = Failure removed (giá trị "added" là 8449/8451). Ở đây <strong>30 nhóm con mất cả kiểm toán thành công lẫn thất bại trong cùng một giây</strong> — Logon, Account Lockout, Special Logon, Process Creation, User Account Management, Audit Policy Change… Đó là <code>auditpol /clear</code> hoặc <code>auditpol /remove</code>: kể từ giây này, 4624/4625/4688/4720 đơn giản là không còn xuất hiện.</p>
${lenh('s04/xoa-log', 7)}
<p>So sánh: trên mẫu Windows 7, 4719 đến từ <code>IE10WIN7$</code> — chính cái máy áp chính sách của nó lúc cài đặt hoặc khi Group Policy làm mới. Subject = tài khoản máy, vào lúc khởi động/áp GPO → bình thường; Subject = một con người, nhiều nhóm con bị gỡ cùng lúc → sự cố.</p>

<h3>4616 — đồng hồ bị vặn</h3>
${lenh('s04/xoa-log', 8)}
${lenh('s04/xoa-log', 9)}
<p>4616 ghi <code>PreviousTime</code>, <code>NewTime</code>, ai làm và tiến trình nào. Trong mẫu tấn công, admmig đẩy đồng hồ <strong>+3 ngày (259 200 giây)</strong> bằng powershell.exe (<code>Set-Date</code>); vài phút sau dịch vụ Windows Time (svchost dưới LOCAL SERVICE) kéo nó về. Sao lại có người làm vậy? Để các hành động sau trông như xảy ra vào ngày khác, để làm rối dòng thời gian, hoặc để qua mặt giấy phép và chứng chỉ có hạn dùng. 4616 bình thường: dịch vụ Time chỉnh vài giây, VMware Tools sửa giờ sau khi máy ảo chạy tiếp (8 cú nhảy lớn trong <code>security.evtx</code> là của <code>vmtoolsd.exe</code>), một người đổi múi giờ trong Settings (<code>dllhost.exe</code>). Hỏi: tiến trình nào, tài khoản nào, nhảy bao nhiêu?</p>

<div class="pitfall co-tieu-de"><p><strong>Thiếu sự kiện không phải lúc nào cũng là bị can thiệp.</strong> Một log đầy và đặt chế độ "Overwrite" (Bài 3.5) cũng mất sự kiện cũ — lặng lẽ, không có 1102. Trước khi viết "kẻ tấn công đã xoá log", hãy kiểm kích thước và chế độ của log, số bản ghi, và xem có 1102/104 hay không.</p></div>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Chạy bằng quyền quản trị: máy này đã từng bị xoá log, đổi kiểm toán hay vặn giờ chưa?
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 1102,4719,4616 } -MaxEvents 50 -ErrorAction SilentlyContinue | Format-Table TimeCreated, Id, Message -Wrap
Get-WinEvent -FilterHashtable @{ LogName = 'System'; ProviderName = 'Microsoft-Windows-Eventlog'; Id = 104 } -ErrorAction SilentlyContinue | Format-Table TimeCreated, Message -Wrap
auditpol /get /category:*     # hiện đang kiểm toán những gì</code></pre>

<h3>🛡️ Góc hacker: Olympic Destroyer và đồng bọn</h3>
<p>Xoá log sự kiện Windows là ATT&amp;CK <strong>T1685.005</strong> "Clear Windows Event Logs" (số cũ T1070.001 — ATT&amp;CK đã đánh số lại; liên kết cũ tự chuyển hướng). Nó nằm trong bài bản của mã độc thật: MITRE ghi nhận <strong>Olympic Destroyer</strong> — thứ đã phá rối lễ khai mạc Thế vận hội mùa đông PyeongChang tháng 2/2018 — tìm cách xoá log System và Security bằng <code>wevtutil</code>; NotPetya (2017, Bài 3.1) cũng xoá chúng. Cách phòng nhàm chán nhưng hiệu quả: chuyển sự kiện ra khỏi máy gần như tức thời (Windows Event Forwarding hoặc agent, Chương 15), cảnh báo 1102/104/4719 <em>mọi lần</em>, và giới hạn ai được giữ quyền "Manage auditing and security log".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Làm sao biết log đã bị xoá?" — 1102 trong Security, 104 trong System (kèm tên kênh), cộng chỗ hụt số bản ghi và lệnh xoá trong 4688/4104.</li>
<li>"Kẻ tấn công có xoá log mà không để lại 1102 được không?" — dừng dịch vụ hoặc vá nó trong bộ nhớ thì tránh được 1102 nhưng để lại 7040/7036 hoặc một khoảng lặng; vì thế chuyển log ra ngoài tốt hơn giữ log tại chỗ.</li>
<li>"4719 là gì?" — chính sách kiểm toán bị đổi; một người gỡ nhiều nhóm con cùng lúc là tín hiệu mạnh.</li>
<li>"Vì sao phải để ý 4616?" — đồng hồ bị vặn làm vỡ dòng thời gian; xem tiến trình, tài khoản và độ lớn cú nhảy.</li>
</ul>

<h3>Đi làm thật</h3>
<p>SIEM báo "Security log cleared" trên máy chủ của khách lúc 22:40. Trước khi báo lên: ai (Subject) và từ phiên nào (Logon ID → 4624 → IP); có phiếu thay đổi không (vài quản trị viên xoá log đầy trong lúc bảo trì — thói quen xấu, nhưng không phải tấn công); vài phút trước đó trên các nguồn <em>khác</em> không bị xoá (tường lửa, EDR, bản sao trong SIEM) đã có gì. Ghi lại số bản ghi của 1102: nó cho khách biết chính xác lần xoá đã huỷ bao nhiêu bằng chứng trên máy.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>clear-104-1102.evtx</code>, log nào bị xoá đầu tiên và trước log Security bao nhiêu phút?</li>
<li>Trong <code>audit-4719.evtx</code>, tìm nhóm con lẽ ra sẽ ghi lại tài khoản mới <em>tiếp theo</em> của kẻ tấn công. Nó có bị tắt không?</li>
<li>4616 do <code>dllhost.exe</code> (−8,1 giây) có đáng ngờ không? Giải thích trong một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) System lúc 18:04:30, trước Security (18:09:51) khoảng 5 phút; (2) User Account Management (0cce9235) — có, nó nằm trong danh sách 30; (3) tự nó thì không: dllhost chứa giao diện Settings/Date and Time, người dùng admmig chỉnh vài giây ngay sau lần đồng bộ của dịch vụ Time — nhưng trong mẫu này nó đi sau một cú đẩy +3 ngày, nên thuộc cùng một câu chuyện.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['1102', 'Log Security bị xoá (bản ghi đầu tiên của log mới).'],
  ['104', 'Một log khác bị xoá; data.Channel = log nào.'],
  ['4719', 'Chính sách kiểm toán bị đổi; %%8448 Success removed, %%8450 Failure removed.'],
  ['4616', 'Giờ hệ thống bị đổi: PreviousTime, NewTime, tiến trình.'],
  ['7040', 'Kiểu khởi động của một dịch vụ bị đổi — với EventLog là dấu đỏ.'],
  ['T1685.005', 'ATT&amp;CK: Clear Windows Event Logs (số cũ T1070.001).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xoá, dừng, tắt kiểm toán và vặn giờ — mỗi trò để lại một sự kiện riêng.</li>
<li>1102/104/4719 đáng cảnh báo mọi lần; kiểm ai làm và từ phiên nào.</li>
<li>Số bản ghi sống sót qua lần xoá và đo được thiệt hại.</li>
<li>Thuốc chữa là chuyển log ra ngoài: bằng chứng đã rời máy thì không xoá được nữa.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 1102(S): The audit log was cleared', 'Các trường và khuyến nghị', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-1102')}
${nguon('📘', 'Microsoft Learn — 4719(S): System audit policy was changed', 'GUID nhóm con và giá trị Changes', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4719')}
${nguon('📘', '[MS-GPAC] Subcategory and SubcategoryGUID', 'Bảng GUID dùng cho guid-auditpol.tsv', 'https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-gpac/77878370-0712-47cd-997d-b07053429f6d')}
${nguon('📘', 'Microsoft Learn — 4616(S): The system time was changed', 'PreviousTime, NewTime, tiến trình', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4616')}
${nguon('🛡️', 'MITRE ATT&CK T1685.005 — Clear Windows Event Logs', 'Ví dụ thực tế gồm Olympic Destroyer (S0365)', 'https://attack.mitre.org/techniques/T1685/005/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-5-kich-thuoc-luu-tru', title: 'Bài 3.5 — Kích thước, ghi đè và lưu giữ log', sub: 'Mất log lặng lẽ mà không có 1102', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: 'Chương 14 — Điều tra bảo mật bằng log', sub: 'Điều tra một lần xoá log qua nhiều nguồn', cta: 'Mở bài' })}
</div>
`,
};
