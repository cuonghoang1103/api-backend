/**
 * 4.4 — Tắt máy và sập máy (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/tat-may'].
 * Số tất định: 2-vss_7-System rec 361–390: 1074 00:41:00.567 (svchost, "Operating System: Service pack (Planned)", 0x80020010, restart, NT AUTHORITY\SYSTEM) → 6006 00:41:38 → 109 → 13 → 12 00:41:50 → 172 → 6005/6013 00:41:59;
 * 1074 Win7: 18 winlogon restart…; boot không có 6006 trước: 0/0/1 (dbc = Lab 3 snapshot); system.evtx 42 16:22:16 → 107 16:42:30, Kernel-General 1 nhảy 07-20 16:42 → 07-23 07:16;
 * 6013 uptime 13 → 433175 s (5,0 ngày) → 9 s; 41/6008/BugCheck = 0 trong bộ mẫu; 1001: 167 LoadPerf + 63 WER (Application).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.4 — Shutdowns and crashes: 41 Kernel-Power, 6008, 6005/6006, 1074, 6013, 1001 BugCheck|||4.4 — Tắt máy và sập máy: 41 Kernel-Power, 6008, 6005/6006, 1074, 6013, 1001 BugCheck',
  slug: 'log-4-4-tat-may',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao máy tắt: người bấm, Windows Update, mất điện hay màn hình xanh? Chuỗi tắt sạch 1074 → 6006 → 109 → 13 → 12 → 6005; 1074 nói tiến trình, người và lý do; 6013 thời gian chạy liên tục; ngủ/thức 42/107; 41 Kernel-Power với BugcheckCode và PowerButtonTimestamp; 6008; 1001 BugCheck khác 1001 WER. Bảng quyết định 4 nhánh và tình huống laptop sập khi chơi game.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Why did this machine go down?</h2>
<p class="lead">"The server restarted by itself last night" is one of the most common tickets in operations. The System log can almost always answer it in minutes: a person, a program (often Windows Update), a crash, or a loss of power each leave a different set of events. You learn the clean sequence first, then the two shapes of a dirty one.</p>

<h3>The everyday picture: closing a shop</h3>
<p>A proper closing has steps: the manager decides (1074), the till is locked and the logbook closed (6006), lights off (109, 13). The next morning: lights on (12), logbook opened (6005), "open for 0 days" (6013). If the power cut out at night, the morning logbook has no closing entry — and the first line says "last night's closing was not recorded" (6008, and 41 from the kernel).</p>

${kv([
  ['1074 (USER32)', 'A process asked for shutdown/restart: which process, for which user, reason, type.'],
  ['6006 / 6005 (EventLog)', 'Event Log service stopped (clean shutdown) / started (boot).'],
  ['6008 (EventLog)', 'The previous shutdown was unexpected.'],
  ['6009, 6013', 'OS version at boot; system uptime in seconds (also daily at noon).'],
  ['12 / 13 (Kernel-General)', 'OS started / OS shutting down (exact kernel times).'],
  ['109 (Kernel-Power)', 'The kernel power manager started a shutdown transition.'],
  ['42 / 107 (Kernel-Power)', 'Entering sleep / resumed from sleep.'],
  ['41 (Kernel-Power)', 'Rebooted without a clean shutdown (crash, power button, power loss).'],
  ['1001 (BugCheck, System)', 'After a blue screen: the stop code and dump file. Not the same as Application 1001 (WER).'],
])}

<h3>Step 1 — a clean restart, second by second</h3>
${lenh('s04/tat-may', 0)}
${lenh('s04/tat-may', 1)}
<p>Real Windows 10 (public sample <code>2-vss_7-System.evtx</code>): at 00:41:00 <code>svchost.exe</code> (the Windows Update service runs inside svchost) asks for a <code>restart</code> as <code>NT AUTHORITY\\SYSTEM</code>, reason "Operating System: Service pack (Planned)", code 0x80020010. 38 seconds later the Event Log service stops (6006), the kernel starts the power transition (109) and stops (13); 6 seconds later the new kernel starts (12) and at 00:41:59 the Event Log is back (6005, with uptime 9 s in 6013). Total downtime: about 21 seconds. This is the "good" shape: 1074 → 6006 → 13 → 12 → 6005.</p>
<p><code>param1</code>…<code>param7</code> of 1074: process (and the machine that asked, in brackets), target computer, reason text, reason code, type (restart / power off / shutdown), comment, user.</p>

<h3>Step 2 — who restarts machines, in practice</h3>
${lenh('s04/tat-may', 2)}
<p>On a lab machine used by people (Windows 7 sample): <code>winlogon.exe</code> on behalf of the user (Start › Restart), <code>Explorer.EXE</code> "Other (Unplanned)" (the Shut down button), <code>TrustedInstaller.exe</code> "Upgrade (Planned)" (installing updates). On servers you will also see <code>shutdown.exe</code> with a comment typed by an admin, or a management agent. A 1074 by an unusual process, at an unusual hour, from a remote session, is worth a question.</p>

<h3>Step 3 — find the boots that had no clean shutdown</h3>
${lenh('s04/tat-may', 3)}
<p>Walk the 6005/6006 events in time order: two 6005 in a row means a boot with no clean stop before it. Two of the samples are clean; the Windows 7 one has exactly one — the snapshot restore you dissected in Lab 3 (record numbers going backwards). On a physical PC that boot would also carry <strong>6008</strong> and <strong>Kernel-Power 41</strong>. Note the algorithm sorts by time; sorting by record number would hide this case.</p>

<h3>Step 4 — sleep is not shutdown</h3>
${lenh('s04/tat-may', 4)}
<p>16:22:16 Kernel-Power 42: the PC goes to sleep. 16:42:30 Kernel-Power 107: it wakes up 20 minutes later, and Kernel-General 1 records the clock being corrected. Then the next line jumps from 20 July 16:42 to 23 July 07:16 with no 42 before it: the operating system did not decide to sleep — a virtual machine paused by its host looks exactly like this. Laptops that "restart by themselves" are often laptops that slept, ran out of battery and booted cold: look for 42 before you look for 41.</p>

<h3>Step 5 — uptime (6013) and timezone</h3>
${lenh('s04/tat-may', 5)}
${lenh('s04/tat-may', 6)}
<p>6013 is written at every boot and once a day around noon local time: uptime 13 s, then 1 day, 2, 3, 4, 5 days, then 9 s — the machine rebooted on 12 July (the Windows Update restart of Step 1). The last value is the timezone: <code>480 Pacific Standard Time</code> = UTC−8 (bias in minutes). The daily 6013 at 19:00 UTC is noon in California in summer (UTC−7). Useful when you only have the log and need the machine's local time.</p>

<h3>Step 6 — the dirty shapes: 41, 6008 and BugCheck</h3>
${lenh('s04/tat-may', 7)}
<p>None of the public samples crashed or lost power, so the count is 0 — you will create a real 41 in Lab 4 by hard-resetting your VM. What Microsoft documents for <strong>Kernel-Power 41</strong> ("The system has rebooted without cleanly shutting down first"):</p>
<ul>
<li><strong><code>BugcheckCode</code> ≠ 0</strong> → a stop error (blue screen). Convert to hex: 159 = 0x9F DRIVER_POWER_STATE_FAILURE. There should also be <strong>System 1001</strong> from BugCheck with the same code and the path of the memory dump. Next step: the driver named in the dump.</li>
<li><strong><code>PowerButtonTimestamp</code> ≠ 0</strong> → someone held the power button (the PC was frozen, or a person forced it off).</li>
<li><strong>All zero</strong> → the machine stopped without warning: power loss, power supply, overheating, a hard hang. Look at hardware, UPS logs, temperatures.</li>
</ul>
${lenh('s04/tat-may', 8)}
<p>And remember Lesson 3.2: <strong>1001 belongs to several providers</strong>. In Application, 1001 is Windows Error Reporting (an <em>application</em> crash report) or LoadPerf; only <em>System</em> 1001 from BugCheck/WER-SystemErrorReporting means "the whole machine crashed".</p>

<h3>Decision table: why did it restart?</h3>
${kv([
  ['1074 before 6006', 'Requested: read process, user, reason (Update, admin, application).'],
  ['6006 without 1074', 'Clean stop with no recorded request — check 109 reason, power button set to "shut down", scripts.'],
  ['41 + BugcheckCode ≠ 0 (+ System 1001)', 'Blue screen: stop code + dump → driver/hardware.'],
  ['41 + PowerButtonTimestamp ≠ 0', 'Power button held: frozen machine or forced off.'],
  ['41 all zero / 6008 only', 'Power loss, PSU, heat, hard hang.'],
  ['Gap with no 42, VM', 'Host paused/restored the VM — ask the hypervisor.'],
])}

<h3>Real-life case: "my laptop dies when I play games"</h3>
<p>Two possible stories with the same symptom. (a) Kernel-Power 41 with BugcheckCode 0, no System 1001, sometimes during charging — the power or heat path (battery, charger, fan); a driver update will not help. (b) Kernel-Power 41 with BugcheckCode 278 (0x116, VIDEO_TDR_FAILURE) and a System 1001 BugCheck pointing to the graphics driver — reinstall/roll back the GPU driver. Without the log, people replace the wrong part.</p>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># The last 15 shutdown/boot/crash events, newest first
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Id = 41,1074,6005,6006,6008,1001,42,107 } -MaxEvents 15 |
  Format-Table TimeCreated, Id, ProviderName, @{n='Text';e={ ($_.Message -split "\`n")[0] }} -AutoSize -Wrap
# Uptime right now
(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime</code></pre>

<h3>🛡️ Attacker's corner: reboots as a weapon</h3>
<p>Restarts are not only an operations topic. ATT&amp;CK T1529 (System Shutdown/Reboot) covers destructive malware rebooting machines to finish the damage — wipers reboot so the broken boot record takes effect. ATT&amp;CK T1688 (Safe Mode Boot) covers ransomware that reboots into Safe Mode, where most security software does not start, before encrypting. Both show up first as a 1074 by an unexpected process (often <code>shutdown.exe</code> or <code>bcdedit</code> just before), on many machines within minutes. A wave of 1074 across servers outside a maintenance window is an incident until proven otherwise.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you tell a clean shutdown from a crash?" — 1074/6006/13 vs 41 + 6008 at the next boot.</li>
<li>"Event 41 has BugcheckCode 0. What now?" — not a blue screen: power loss, power button (check PowerButtonTimestamp), hardware hang.</li>
<li>"Who restarted the server?" — 1074: process, user, reason; then the session of that user (Lesson 4.1).</li>
<li>"How do you get the uptime from logs?" — 6013, or the time since the last 6005/12.</li>
</ul>

<h3>At work</h3>
<p>For a "server rebooted at night" ticket, the answer that closes it in one message: "1074 at 02:03:11 UTC by TrustedInstaller.exe as SYSTEM, reason Operating System: Upgrade (Planned); clean sequence 6006 → 6005, downtime 2 min 40 s; KB… installed (WindowsUpdateClient 19, Lesson 4.8). Recommendation: set active hours / a maintenance window." If instead you find 41 + 6008, say so and attach the BugcheckCode — that is a hardware/driver ticket, not an "update" one.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>In <code>2-vss_7-System.evtx</code>, how many seconds passed between 13 (OS shutting down) and 12 (OS started) in the Step 1 restart?</li>
<li>Convert BugcheckCode 209 to hex and look up its name on Microsoft Learn's "Bug check code reference".</li>
<li>Your own PC: run the PowerShell above. Classify the last three restarts with the decision table.</li>
</ol>
<p><strong>Pass:</strong> (1) 00:41:44.511 → 00:41:50.944 ≈ 6.4 s; (2) 209 = 0xD1, DRIVER_IRQL_NOT_LESS_OR_EQUAL — a driver bug; (3) each restart labelled requested/clean, blue screen, power button or power loss, with the event that proves it.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['1074', 'Shutdown/restart requested: process, user, reason, type.'],
  ['6005 / 6006 / 6008', 'Log started (boot) / stopped (clean) / previous shutdown unexpected.'],
  ['6013', 'Uptime in seconds + timezone.'],
  ['41 Kernel-Power', 'Unclean reboot; BugcheckCode, PowerButtonTimestamp tell which kind.'],
  ['42 / 107', 'Sleep / resume.'],
  ['BugCheck 1001', 'Blue screen record in System: stop code and dump path.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Clean: 1074 → 6006 → 13 → 12 → 6005. Read 1074 for who and why.</li>
<li>Dirty: 41 (+6008) at the next boot; BugcheckCode and PowerButtonTimestamp split blue screen, button, power.</li>
<li>Sleep (42/107) and VM pauses are not shutdowns.</li>
<li>Always say which provider a 1001 came from.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Advanced troubleshooting for Event ID 41', 'Three scenarios: stop error, power button, zero codes', 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart')}
${nguon('📘', 'Microsoft Learn — Bug check code reference', 'Names of stop codes (0x9F, 0xD1, 0x116…)', 'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-code-reference2')}
${nguon('🛡️', 'MITRE ATT&CK T1529 — System Shutdown/Reboot', 'and T1688 Safe Mode Boot', 'https://attack.mitre.org/techniques/T1529/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-8-lab', title: 'Lab 3 — Why did my PC restart?', sub: 'The snapshot-restore boot found in Step 3', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Lesson 3.6 — Reliability Monitor and crashes', sub: 'Application crashes 1000/1001 in depth', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Vì sao máy này tắt?</h2>
<p class="lead">"Đêm qua máy chủ tự khởi động lại" là một trong những phiếu việc hay gặp nhất khi vận hành. Log System gần như luôn trả lời được trong vài phút: một người, một chương trình (thường là Windows Update), một lần sập, hay mất điện — mỗi thứ để lại một bộ sự kiện khác nhau. Bạn học chuỗi "sạch" trước, rồi hai hình dạng của chuỗi "bẩn".</p>

<h3>Liên tưởng đời thường: đóng cửa hàng</h3>
<p>Đóng cửa đúng cách có các bước: quản lý quyết định (1074), khoá két và đóng sổ (6006), tắt đèn (109, 13). Sáng hôm sau: bật đèn (12), mở sổ (6005), "đã mở cửa 0 ngày" (6013). Nếu đêm qua mất điện, sổ sáng nay không có dòng đóng cửa — và dòng đầu tiên ghi "lần đóng cửa đêm qua không được ghi nhận" (6008, và 41 từ nhân hệ điều hành).</p>

${kv([
  ['1074 (USER32)', 'Một tiến trình yêu cầu tắt/khởi động lại: tiến trình nào, cho người dùng nào, lý do, kiểu.'],
  ['6006 / 6005 (EventLog)', 'Dịch vụ Event Log dừng (tắt sạch) / chạy (khởi động).'],
  ['6008 (EventLog)', 'Lần tắt máy trước là bất thường.'],
  ['6009, 6013', 'Phiên bản hệ điều hành lúc khởi động; thời gian chạy liên tục tính bằng giây (cũng ghi mỗi ngày lúc trưa).'],
  ['12 / 13 (Kernel-General)', 'Hệ điều hành bắt đầu / đang tắt (giờ chính xác của nhân).'],
  ['109 (Kernel-Power)', 'Bộ quản lý nguồn của nhân bắt đầu chuyển sang tắt.'],
  ['42 / 107 (Kernel-Power)', 'Vào chế độ ngủ / thức dậy.'],
  ['41 (Kernel-Power)', 'Khởi động lại mà không tắt sạch (sập, giữ nút nguồn, mất điện).'],
  ['1001 (BugCheck, System)', 'Sau màn hình xanh: mã dừng và tệp dump. Không phải 1001 của Application (WER).'],
])}

<h3>Bước 1 — một lần khởi động lại sạch, từng giây một</h3>
${lenh('s04/tat-may', 0)}
${lenh('s04/tat-may', 1)}
<p>Windows 10 thật (mẫu công khai <code>2-vss_7-System.evtx</code>): lúc 00:41:00 <code>svchost.exe</code> (dịch vụ Windows Update chạy bên trong svchost) yêu cầu <code>restart</code> dưới quyền <code>NT AUTHORITY\\SYSTEM</code>, lý do "Operating System: Service pack (Planned)", mã 0x80020010. 38 giây sau dịch vụ Event Log dừng (6006), nhân bắt đầu chuyển nguồn (109) rồi tắt (13); 6 giây sau nhân mới khởi động (12) và lúc 00:41:59 Event Log chạy lại (6005, kèm uptime 9 giây ở 6013). Tổng thời gian gián đoạn: khoảng 21 giây. Đây là hình dạng "tốt": 1074 → 6006 → 13 → 12 → 6005.</p>
<p><code>param1</code>…<code>param7</code> của 1074: tiến trình (và tên máy đã yêu cầu, trong ngoặc), máy đích, lý do bằng chữ, mã lý do, kiểu (restart / power off / shutdown), ghi chú, người dùng.</p>

<h3>Bước 2 — thực tế ai hay khởi động lại máy</h3>
${lenh('s04/tat-may', 2)}
<p>Trên một máy lab có người dùng (mẫu Windows 7): <code>winlogon.exe</code> thay mặt người dùng (Start › Restart), <code>Explorer.EXE</code> "Other (Unplanned)" (nút Shut down), <code>TrustedInstaller.exe</code> "Upgrade (Planned)" (cài bản cập nhật). Trên máy chủ bạn còn gặp <code>shutdown.exe</code> kèm ghi chú do quản trị gõ, hoặc agent quản lý. Một 1074 do tiến trình lạ, vào giờ lạ, từ phiên từ xa, đáng để hỏi.</p>

<h3>Bước 3 — tìm các lần khởi động không có lần tắt sạch trước đó</h3>
${lenh('s04/tat-may', 3)}
<p>Đi qua các 6005/6006 theo thứ tự thời gian: hai 6005 liền nhau nghĩa là có một lần khởi động mà trước đó không tắt sạch. Hai mẫu sạch; mẫu Windows 7 có đúng một lần — chính lần khôi phục snapshot bạn đã mổ ở Lab 3 (số bản ghi đi lùi). Trên máy thật, lần khởi động đó sẽ kèm <strong>6008</strong> và <strong>Kernel-Power 41</strong>. Để ý thuật toán sắp theo thời gian; sắp theo số bản ghi sẽ giấu mất trường hợp này.</p>

<h3>Bước 4 — ngủ không phải là tắt</h3>
${lenh('s04/tat-may', 4)}
<p>16:22:16 Kernel-Power 42: máy đi ngủ. 16:42:30 Kernel-Power 107: 20 phút sau máy thức dậy, và Kernel-General 1 ghi lại việc chỉnh đồng hồ. Rồi dòng tiếp theo nhảy từ 16:42 ngày 20/7 sang 07:16 ngày 23/7 mà không có 42 nào trước đó: hệ điều hành không hề quyết định đi ngủ — một máy ảo bị máy chủ ảo hoá tạm dừng trông đúng như vậy. Laptop "tự khởi động lại" thường là laptop đã ngủ, hết pin rồi khởi động nguội: tìm 42 trước khi tìm 41.</p>

<h3>Bước 5 — thời gian chạy (6013) và múi giờ</h3>
${lenh('s04/tat-may', 5)}
${lenh('s04/tat-may', 6)}
<p>6013 được ghi mỗi lần khởi động và mỗi ngày một lần vào khoảng trưa giờ địa phương: uptime 13 giây, rồi 1 ngày, 2, 3, 4, 5 ngày, rồi 9 giây — máy khởi động lại ngày 12/7 (lần khởi động lại của Windows Update ở Bước 1). Giá trị cuối là múi giờ: <code>480 Pacific Standard Time</code> = UTC−8 (độ lệch tính bằng phút). 6013 hằng ngày lúc 19:00 UTC là đúng trưa ở California vào mùa hè (UTC−7). Hữu ích khi bạn chỉ có log và cần biết giờ địa phương của máy.</p>

<h3>Bước 6 — các hình dạng bẩn: 41, 6008 và BugCheck</h3>
${lenh('s04/tat-may', 7)}
<p>Không mẫu công khai nào bị sập hay mất điện, nên đếm ra 0 — bạn sẽ tạo một sự kiện 41 thật trong Lab 4 bằng cách reset cứng máy ảo. Điều Microsoft ghi lại về <strong>Kernel-Power 41</strong> ("Hệ thống khởi động lại mà không tắt sạch trước đó"):</p>
<ul>
<li><strong><code>BugcheckCode</code> ≠ 0</strong> → lỗi dừng (màn hình xanh). Đổi sang hex: 159 = 0x9F DRIVER_POWER_STATE_FAILURE. Phải có thêm <strong>System 1001</strong> của BugCheck với cùng mã và đường dẫn tệp dump bộ nhớ. Bước tiếp: driver được nêu trong dump.</li>
<li><strong><code>PowerButtonTimestamp</code> ≠ 0</strong> → có người giữ nút nguồn (máy bị treo, hoặc ai đó ép tắt).</li>
<li><strong>Tất cả bằng 0</strong> → máy dừng không báo trước: mất điện, bộ nguồn, quá nhiệt, treo cứng. Xem phần cứng, log UPS, nhiệt độ.</li>
</ul>
${lenh('s04/tat-may', 8)}
<p>Và nhớ Bài 3.2: <strong>1001 thuộc về nhiều provider</strong>. Trong Application, 1001 là Windows Error Reporting (báo cáo sập của <em>ứng dụng</em>) hoặc LoadPerf; chỉ 1001 trong <em>System</em> từ BugCheck/WER-SystemErrorReporting mới nghĩa là "cả máy đã sập".</p>

<h3>Bảng quyết định: vì sao máy khởi động lại?</h3>
${kv([
  ['1074 trước 6006', 'Có yêu cầu: đọc tiến trình, người dùng, lý do (Update, quản trị, ứng dụng).'],
  ['6006 mà không có 1074', 'Tắt sạch nhưng không ghi ai yêu cầu — xem lý do ở 109, nút nguồn đặt "shut down", script.'],
  ['41 + BugcheckCode ≠ 0 (+ System 1001)', 'Màn hình xanh: mã dừng + dump → driver/phần cứng.'],
  ['41 + PowerButtonTimestamp ≠ 0', 'Giữ nút nguồn: máy treo hoặc bị ép tắt.'],
  ['41 toàn số 0 / chỉ có 6008', 'Mất điện, bộ nguồn, nhiệt, treo cứng.'],
  ['Khoảng trống không có 42, máy ảo', 'Máy chủ ảo hoá đã tạm dừng/khôi phục máy ảo — hỏi bên ảo hoá.'],
])}

<h3>Tình huống đời thật: "laptop của em sập khi chơi game"</h3>
<p>Hai câu chuyện khác nhau với cùng một triệu chứng. (a) Kernel-Power 41 với BugcheckCode 0, không có System 1001, đôi khi xảy ra lúc đang sạc — đường nguồn hoặc nhiệt (pin, sạc, quạt); cập nhật driver không giúp gì. (b) Kernel-Power 41 với BugcheckCode 278 (0x116, VIDEO_TDR_FAILURE) và một System 1001 BugCheck chỉ vào driver đồ hoạ — cài lại/quay về bản driver GPU cũ. Không có log, người ta thay nhầm linh kiện.</p>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># 15 sự kiện tắt/khởi động/sập gần nhất, mới nhất lên đầu
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Id = 41,1074,6005,6006,6008,1001,42,107 } -MaxEvents 15 |
  Format-Table TimeCreated, Id, ProviderName, @{n='Text';e={ ($_.Message -split "\`n")[0] }} -AutoSize -Wrap
# Máy đã chạy liên tục bao lâu
(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime</code></pre>

<h3>🛡️ Góc hacker: khởi động lại như một vũ khí</h3>
<p>Khởi động lại không chỉ là chuyện vận hành. ATT&amp;CK T1529 (System Shutdown/Reboot) mô tả mã độc phá huỷ khởi động lại máy để hoàn tất phá hoại — mã xoá dữ liệu (wiper) khởi động lại để bản ghi khởi động bị hỏng có hiệu lực. ATT&amp;CK T1688 (Safe Mode Boot) mô tả mã độc tống tiền khởi động lại vào Safe Mode, nơi phần lớn phần mềm bảo mật không chạy, rồi mới mã hoá. Cả hai đều lộ ra trước tiên dưới dạng một 1074 do tiến trình bất ngờ (thường có <code>shutdown.exe</code> hoặc <code>bcdedit</code> ngay trước đó), trên nhiều máy trong vài phút. Một làn sóng 1074 trên các máy chủ ngoài khung giờ bảo trì là sự cố cho tới khi chứng minh được điều ngược lại.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Phân biệt tắt sạch với sập thế nào?" — 1074/6006/13 so với 41 + 6008 ở lần khởi động sau.</li>
<li>"Sự kiện 41 có BugcheckCode 0. Tiếp theo làm gì?" — không phải màn hình xanh: mất điện, nút nguồn (xem PowerButtonTimestamp), treo phần cứng.</li>
<li>"Ai đã khởi động lại máy chủ?" — 1074: tiến trình, người dùng, lý do; rồi phiên đăng nhập của người đó (Bài 4.1).</li>
<li>"Lấy uptime từ log thế nào?" — 6013, hoặc thời gian kể từ 6005/12 gần nhất.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Với phiếu "máy chủ khởi động lại ban đêm", câu trả lời đóng phiếu trong một tin nhắn: "1074 lúc 02:03:11 UTC do TrustedInstaller.exe dưới SYSTEM, lý do Operating System: Upgrade (Planned); chuỗi sạch 6006 → 6005, gián đoạn 2 phút 40 giây; đã cài KB… (WindowsUpdateClient 19, Bài 4.8). Đề xuất: đặt active hours / khung giờ bảo trì." Còn nếu bạn thấy 41 + 6008 thì nói rõ và kèm BugcheckCode — đó là phiếu phần cứng/driver, không phải phiếu "cập nhật".</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>2-vss_7-System.evtx</code>, từ 13 (đang tắt) tới 12 (đã khởi động) của lần khởi động lại ở Bước 1 mất bao nhiêu giây?</li>
<li>Đổi BugcheckCode 209 sang hex và tra tên trên trang "Bug check code reference" của Microsoft Learn.</li>
<li>Máy của bạn: chạy lệnh PowerShell ở trên. Phân loại ba lần khởi động lại gần nhất bằng bảng quyết định.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) 00:41:44.511 → 00:41:50.944 ≈ 6,4 giây; (2) 209 = 0xD1, DRIVER_IRQL_NOT_LESS_OR_EQUAL — lỗi driver; (3) mỗi lần được gắn nhãn có yêu cầu/sạch, màn hình xanh, nút nguồn hoặc mất điện, kèm sự kiện chứng minh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['1074', 'Yêu cầu tắt/khởi động lại: tiến trình, người dùng, lý do, kiểu.'],
  ['6005 / 6006 / 6008', 'Log chạy (khởi động) / dừng (sạch) / lần tắt trước bất thường.'],
  ['6013', 'Thời gian chạy liên tục (giây) + múi giờ.'],
  ['41 Kernel-Power', 'Khởi động lại không sạch; BugcheckCode, PowerButtonTimestamp cho biết loại nào.'],
  ['42 / 107', 'Ngủ / thức dậy.'],
  ['BugCheck 1001', 'Bản ghi màn hình xanh trong System: mã dừng và đường dẫn dump.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sạch: 1074 → 6006 → 13 → 12 → 6005. Đọc 1074 để biết ai và vì sao.</li>
<li>Bẩn: 41 (+6008) ở lần khởi động sau; BugcheckCode và PowerButtonTimestamp tách màn hình xanh, nút nguồn, mất điện.</li>
<li>Ngủ (42/107) và máy ảo bị tạm dừng không phải là tắt máy.</li>
<li>Luôn nói rõ 1001 đến từ provider nào.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Advanced troubleshooting for Event ID 41', 'Ba kịch bản: lỗi dừng, nút nguồn, mã bằng 0', 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart')}
${nguon('📘', 'Microsoft Learn — Bug check code reference', 'Tên các mã dừng (0x9F, 0xD1, 0x116…)', 'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-code-reference2')}
${nguon('🛡️', 'MITRE ATT&CK T1529 — System Shutdown/Reboot', 'và T1688 Safe Mode Boot', 'https://attack.mitre.org/techniques/T1529/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-8-lab', title: 'Lab 3 — Vì sao máy tôi khởi động lại?', sub: 'Lần khởi động do khôi phục snapshot ở Bước 3', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Bài 3.6 — Reliability Monitor và crash', sub: 'Crash ứng dụng 1000/1001 kỹ hơn', cta: 'Mở bài' })}
</div>
`,
};
