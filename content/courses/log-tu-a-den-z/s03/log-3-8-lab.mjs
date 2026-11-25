/**
 * 3.8 — Lab 3: Vì sao máy tôi khởi động lại? (soạn 24/11/2026, agent lgz). Output thật: OUT['s03/lab3'] — máy IE10Win7 trong dbc-many-events-system/application.evtx (mẫu DeepBlueCLI).
 * Số tất định: IE10Win7 15 × 12, 15 × 13, 26 × 1074, 15 × 6005, 14 × 6006, 36 × 6013; 18/08/2016: rundll32 Hardware: Installation (Planned) 14:47:18Z, 3 power off/restart người dùng,
 * Recovery (Planned) 16:51:57Z, khởi động 18:46:20Z rec 5004 (< 5848) không có 6006/13 trước đó; 26/11/2014 23:25:02Z = 15:25:02 giờ máy (UTC-8) msiexec khởi động lại để xong cài VMware Tools 9.6.2.
 */
import { lenh, ma, kv, lienKet } from '../_chung.mjs';

export default {
  title: '3.8 — Lab 3 — Why did my PC restart last night? Answer it with Event Viewer only|||3.8 — Lab 3 — Vì sao máy tôi khởi động lại đêm qua? Trả lời chỉ bằng Event Viewer',
  slug: 'log-3-8-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab trên log System + Application THẬT của máy IE10Win7: dựng dòng thời gian tắt/bật (12, 13, 1074, 6005, 6006, 6013), phân loại từng lần (người dùng, trình cài đặt, driver, phục hồi), tìm lần khởi động không có tắt sạch (số bản ghi đi lùi), quy đổi giờ máy, và truy ra chương trình nào bắt khởi động lại. Có lời giải che, phiếu chấm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab 3</span>
<h2>"It restarts by itself!" — prove what happened</h2>
<p class="lead">A user of the machine <strong>IE10Win7</strong> (a Windows 7 PC in Pacific time) complains: "It restarted by itself several times, once in the middle of my work." You have its real System and Application logs. Answer with events only — no guessing, every claim backed by an Event ID, a time and a field value.</p>

<h3>Setup</h3>
<ul>
<li><strong>Windows:</strong> download the samples (<code>tai-mau.ps1</code>, Lesson 3.1), open <code>dbc-many-events-system.evtx</code> and <code>dbc-many-events-application.evtx</code> with <em>Open Saved Log</em>. Create the Custom View of Lesson 3.4 (IDs 12, 13, 41, 1074, 6005, 6006, 6008, 6013) on the System file, filter Computer = IE10Win7.</li>
<li><strong>PowerShell (any OS):</strong> <code>evtx-rec</code> (Lesson 3.1) + the commands in the solutions.</li>
</ul>

<h3>What the IDs mean (cheat sheet for this lab)</h3>
${kv([
  ['1074 (USER32)', 'A process asked to shut down/restart: process, reason, type (restart / power off), user.'],
  ['6006 (EventLog)', 'Event log service stopped — the last event of a clean shutdown.'],
  ['13 (Kernel-General)', 'OS shutdown time.'],
  ['12 (Kernel-General)', 'OS start time.'],
  ['6005 (EventLog)', 'Event log service started — the first event after a boot.'],
  ['6013 (EventLog)', 'Daily uptime report: uptime in seconds + timezone.'],
  ['6008 / 41', 'Previous shutdown was unexpected / rebooted without cleanly shutting down (Lesson 4.4).'],
])}

<h3>Your tasks</h3>
<ol>
<li><strong>Inventory:</strong> how many boots and clean shutdowns does IE10Win7 have in this log? Does every boot have a shutdown before it?</li>
<li><strong>18 August 2016:</strong> list every shutdown/restart of that day with time, who/what initiated it and the stated reason. Classify each: user, installer/driver, system recovery, unknown.</li>
<li><strong>The odd one:</strong> find the boot that has <em>no</em> clean shutdown before it. Look at its EventRecordID compared with its neighbours. What does that suggest?</li>
<li><strong>Local time:</strong> what timezone does the machine use (which event tells you), and what local time was the odd boot?</li>
<li><strong>26 November 2014:</strong> the user says "it restarted in the afternoon while I was working". Which program restarted it, on behalf of which account, and why? Confirm with the Application log.</li>
<li><strong>Report:</strong> five lines (what happened, evidence, cause, impact, recommendation).</li>
</ol>
<p><strong>Pass:</strong> 6 answers, each citing at least one Event ID + time (UTC and local) + a field value; the odd boot explained with record numbers; the 2014 restart traced to the installer in Application.</p>

<h3>Hints (one at a time)</h3>
<ul>
<li>A clean shutdown leaves 1074 → 6006 → 13; a boot starts 12 → 6005 → 6013.</li>
<li>Sort by time, then look at the record numbers: they should only go up.</li>
<li>6013's data holds the timezone as minutes + name.</li>
<li>For 2014, filter Application on MsiInstaller and Restart Manager in the 10 minutes before the restart.</li>
</ul>

<details>
<summary><strong>Solution 1–2 — inventory and the day of 18/08/2016</strong></summary>
${lenh('s03/lab3', 0)}
${lenh('s03/lab3', 1)}
<p>15 boots (6005/12) but only 14 clean shutdowns (6006) — one boot is unexplained. On 18/08/2016 (UTC): 14:47 <code>rundll32.exe</code> "Hardware: Installation (Planned)", restart — a driver install asked for it (the user clicked "Restart now" in the device dialog, initiated by IEUser); 14:48 and 15:28 the user powered off (Explorer.EXE, "Other (Unplanned)", power off); 16:51 "Operating System: Recovery (Planned)" restart by the user; 19:55 user restart. Each has its pair <code>winlogon.exe</code> 1074 two seconds later, then 6006 and 13 — all clean.</p>
</details>
<details>
<summary><strong>Solution 3–4 — the odd boot and local time</strong></summary>
${lenh('s03/lab3', 2)}
${lenh('s03/lab3', 3)}
<p>At 18:46:20Z there is a 6005 with <strong>record 5004</strong> — lower than the records of the events of 14:47–16:52 (5107…5870). Record numbers in a log only go up, unless the log file itself went back in time: this is a <strong>virtual machine restored to an earlier snapshot</strong> (or a disk image rolled back). There is no 6006/13 and no 6008 because, from that restored disk's point of view, the previous session never ended badly. On a physical PC, a boot without a preceding 6006 would come with 6008 and Kernel-Power 41. Timezone from 6013: <code>480 Pacific Standard Time</code> (UTC−8 in winter; in August the PC shows PDT, UTC−7) → the odd boot was 11:46 local.</p>
</details>
<details>
<summary><strong>Solution 5 — 26/11/2014: who restarted it</strong></summary>
${lenh('s03/lab3', 4)}
${lenh('s03/lab3', 5)}
<p>15:25 local (23:25Z), <code>msiexec.exe</code> on behalf of <code>NT AUTHORITY\\SYSTEM</code>: "The Windows Installer initiated a system restart to complete or continue the configuration of 'VMware Tools'." Application shows the chain: Visual C++ 2008 runtime installed (1033/11707), VMware Tools 9.6.2 installed (11707 "completed successfully"), 1038 "restart required", Restart Manager closing Print Spooler, then 1005 "Windows Installer initiated a restart" — three seconds before the 1074. Cause: the VMware Tools installer, not Windows Update and not a crash.</p>
</details>
<details>
<summary><strong>Model report (5 lines)</strong></summary>
<ol>
<li><strong>What:</strong> IE10Win7 restarted 15 times in the log; on 26/11/2014 15:25 (local) during working hours.</li>
<li><strong>Evidence:</strong> System 1074 msiexec.exe/SYSTEM 23:25:02Z + Application MsiInstaller 1038/1005 VMware Tools 9.6.2; boots 6005/12, shutdowns 6006/13.</li>
<li><strong>Cause:</strong> installer-forced restart; all other restarts were user-initiated or driver/recovery restarts; one boot (18/08/2016 18:46Z, record 5004) came from a VM snapshot restore.</li>
<li><strong>Impact:</strong> unsaved work lost once; no crash (no 41/6008/1001 BugCheck).</li>
<li><strong>Recommendation:</strong> install agents/tools with <code>REBOOT=ReallySuppress</code> and schedule restarts; tell users before snapshot restores.</li>
</ol>
</details>

<h3>🗂 Key terms</h3>
${kv([
  ['Clean shutdown', '1074 → 6006 → 13 in the System log.'],
  ['Boot', '12 → 6005 → 6013.'],
  ['Record numbers going backwards', 'The log file was restored to an older copy (VM snapshot, backup).'],
  ['REBOOT=ReallySuppress', 'MSI property that stops an installer from restarting the PC.'],
])}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-4-tat-may', title: 'Lesson 4.4 — Shutdowns and crashes', sub: '41 Kernel-Power, 6008, BugCheck in depth', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab 3</span>
<h2>"Nó tự khởi động lại!" — chứng minh chuyện gì đã xảy ra</h2>
<p class="lead">Người dùng máy <strong>IE10Win7</strong> (một máy Windows 7 đặt giờ Thái Bình Dương) than: "Máy tự khởi động lại mấy lần, có lần ngay giữa lúc tôi đang làm." Bạn có log System và Application thật của nó. Trả lời chỉ bằng sự kiện — không đoán, mỗi khẳng định phải có Event ID, giờ và giá trị trường làm bằng chứng.</p>

<h3>Chuẩn bị</h3>
<ul>
<li><strong>Windows:</strong> tải bộ mẫu (<code>tai-mau.ps1</code>, Bài 3.1), mở <code>dbc-many-events-system.evtx</code> và <code>dbc-many-events-application.evtx</code> bằng <em>Open Saved Log</em>. Tạo Custom View của Bài 3.4 (ID 12, 13, 41, 1074, 6005, 6006, 6008, 6013) trên tệp System, lọc Computer = IE10Win7.</li>
<li><strong>PowerShell (mọi hệ điều hành):</strong> <code>evtx-rec</code> (Bài 3.1) + các lệnh trong lời giải.</li>
</ul>

<h3>Các ID nghĩa là gì (bảng tra cho lab này)</h3>
${kv([
  ['1074 (USER32)', 'Một tiến trình yêu cầu tắt/khởi động lại: tiến trình, lý do, kiểu (restart / power off), người dùng.'],
  ['6006 (EventLog)', 'Dịch vụ event log dừng — sự kiện cuối cùng của một lần tắt sạch.'],
  ['13 (Kernel-General)', 'Giờ hệ điều hành tắt.'],
  ['12 (Kernel-General)', 'Giờ hệ điều hành khởi động.'],
  ['6005 (EventLog)', 'Dịch vụ event log bật — sự kiện đầu tiên sau khi khởi động.'],
  ['6013 (EventLog)', 'Báo cáo uptime hằng ngày: số giây đã chạy + múi giờ.'],
  ['6008 / 41', 'Lần tắt trước là bất ngờ / khởi động lại mà không tắt sạch (Bài 4.4).'],
])}

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Kiểm kê:</strong> trong log này IE10Win7 có bao nhiêu lần khởi động và bao nhiêu lần tắt sạch? Lần khởi động nào cũng có một lần tắt trước nó không?</li>
<li><strong>Ngày 18/8/2016:</strong> liệt kê mọi lần tắt/khởi động lại trong ngày với giờ, ai/cái gì khởi xướng và lý do ghi lại. Phân loại từng lần: người dùng, trình cài đặt/driver, phục hồi hệ thống, không rõ.</li>
<li><strong>Lần bất thường:</strong> tìm lần khởi động <em>không</em> có lần tắt sạch nào trước nó. So EventRecordID của nó với các sự kiện xung quanh. Điều đó gợi ý gì?</li>
<li><strong>Giờ địa phương:</strong> máy dùng múi giờ nào (sự kiện nào cho biết), và lần khởi động bất thường là mấy giờ theo giờ máy?</li>
<li><strong>Ngày 26/11/2014:</strong> người dùng nói "buổi chiều đang làm thì máy khởi động lại". Chương trình nào đã khởi động lại máy, thay mặt tài khoản nào, vì sao? Xác nhận bằng log Application.</li>
<li><strong>Báo cáo:</strong> năm dòng (chuyện gì, bằng chứng, nguyên nhân, ảnh hưởng, khuyến nghị).</li>
</ol>
<p><strong>Đạt khi:</strong> đủ 6 câu, mỗi câu dẫn ít nhất một Event ID + giờ (UTC và giờ máy) + một giá trị trường; lần khởi động bất thường được giải thích bằng số bản ghi; lần khởi động lại năm 2014 được truy tới trình cài đặt trong Application.</p>

<h3>Gợi ý (mở từng cái một)</h3>
<ul>
<li>Một lần tắt sạch để lại 1074 → 6006 → 13; một lần khởi động bắt đầu 12 → 6005 → 6013.</li>
<li>Xếp theo thời gian, rồi nhìn số bản ghi: chúng chỉ được phép tăng.</li>
<li>Dữ liệu của 6013 chứa múi giờ dạng số phút + tên.</li>
<li>Với năm 2014, lọc Application theo MsiInstaller và Restart Manager trong 10 phút trước lần khởi động lại.</li>
</ul>

<details>
<summary><strong>Lời giải 1–2 — kiểm kê và ngày 18/8/2016</strong></summary>
${lenh('s03/lab3', 0)}
${lenh('s03/lab3', 1)}
<p>15 lần khởi động (6005/12) nhưng chỉ 14 lần tắt sạch (6006) — có một lần khởi động không lý giải được. Ngày 18/8/2016 (UTC): 14:47 <code>rundll32.exe</code> "Hardware: Installation (Planned)", restart — một lần cài driver yêu cầu (người dùng bấm "Restart now" trong hộp thoại thiết bị, IEUser khởi xướng); 14:48 và 15:28 người dùng tắt máy (Explorer.EXE, "Other (Unplanned)", power off); 16:51 người dùng khởi động lại với lý do "Operating System: Recovery (Planned)"; 19:55 người dùng khởi động lại. Mỗi lần đều có cặp 1074 của <code>winlogon.exe</code> hai giây sau, rồi 6006 và 13 — đều tắt sạch.</p>
</details>
<details>
<summary><strong>Lời giải 3–4 — lần khởi động bất thường và giờ máy</strong></summary>
${lenh('s03/lab3', 2)}
${lenh('s03/lab3', 3)}
<p>Lúc 18:46:20Z có một 6005 mang <strong>bản ghi 5004</strong> — nhỏ hơn số bản ghi của các sự kiện 14:47–16:52 (5107…5870). Số bản ghi trong một log chỉ tăng, trừ khi chính tệp log bị quay về quá khứ: đây là <strong>máy ảo được khôi phục về một snapshot cũ</strong> (hoặc ảnh đĩa bị quay lui). Không có 6006/13 và cũng không có 6008 vì, theo góc nhìn của ổ đĩa đã khôi phục, phiên trước chưa từng kết thúc tồi. Trên máy thật, một lần khởi động không có 6006 trước nó sẽ đi kèm 6008 và Kernel-Power 41. Múi giờ lấy từ 6013: <code>480 Pacific Standard Time</code> (UTC−8 mùa đông; tháng 8 máy dùng giờ mùa hè PDT, UTC−7) → lần khởi động bất thường là 11:46 giờ máy.</p>
</details>
<details>
<summary><strong>Lời giải 5 — 26/11/2014: ai đã khởi động lại máy</strong></summary>
${lenh('s03/lab3', 4)}
${lenh('s03/lab3', 5)}
<p>15:25 giờ máy (23:25Z), <code>msiexec.exe</code> thay mặt <code>NT AUTHORITY\\SYSTEM</code>: "The Windows Installer initiated a system restart to complete or continue the configuration of 'VMware Tools'." Log Application cho thấy cả chuỗi: cài thư viện Visual C++ 2008 (1033/11707), cài VMware Tools 9.6.2 (11707 "completed successfully"), 1038 "cần khởi động lại", Restart Manager đóng Print Spooler, rồi 1005 "Windows Installer đã yêu cầu khởi động lại" — ba giây trước 1074. Nguyên nhân: trình cài VMware Tools, không phải Windows Update cũng không phải crash.</p>
</details>
<details>
<summary><strong>Báo cáo mẫu (5 dòng)</strong></summary>
<ol>
<li><strong>Chuyện gì:</strong> IE10Win7 khởi động lại 15 lần trong log; ngày 26/11/2014 lúc 15:25 (giờ máy) ngay trong giờ làm.</li>
<li><strong>Bằng chứng:</strong> System 1074 msiexec.exe/SYSTEM 23:25:02Z + Application MsiInstaller 1038/1005 VMware Tools 9.6.2; khởi động 6005/12, tắt 6006/13.</li>
<li><strong>Nguyên nhân:</strong> trình cài đặt ép khởi động lại; các lần khác do người dùng hoặc do cài driver/phục hồi; một lần khởi động (18/8/2016 18:46Z, bản ghi 5004) đến từ việc khôi phục snapshot máy ảo.</li>
<li><strong>Ảnh hưởng:</strong> mất dữ liệu chưa lưu một lần; không có crash (không có 41/6008/1001 BugCheck).</li>
<li><strong>Khuyến nghị:</strong> cài agent/công cụ với <code>REBOOT=ReallySuppress</code> và lên lịch khởi động lại; báo người dùng trước khi khôi phục snapshot.</li>
</ol>
</details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Tắt sạch', '1074 → 6006 → 13 trong log System.'],
  ['Khởi động', '12 → 6005 → 6013.'],
  ['Số bản ghi đi lùi', 'Tệp log bị khôi phục về bản cũ (snapshot máy ảo, bản sao lưu).'],
  ['REBOOT=ReallySuppress', 'Thuộc tính MSI ngăn trình cài đặt khởi động lại máy.'],
])}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-4-tat-may', title: 'Bài 4.4 — Tắt máy và sập máy', sub: '41 Kernel-Power, 6008, BugCheck chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
