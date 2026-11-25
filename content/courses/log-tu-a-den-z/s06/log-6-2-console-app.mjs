/**
 * 6.2 — Ứng dụng Console, báo cáo crash và treo, /var/log còn lại (soạn 25/11/2026, agent Mac tiếp quản lgz).
 * Output thật: OUT['s06/crash'] (motep.swift văng thật, .ips do ReportCrash sinh), OUT['s06/varlog'] — MacBook macOS 27.2.1, đã ẩn danh.
 * Giao diện Console mô tả bằng chữ (không chụp màn hình máy thật). Nguồn: Apple Console User Guide; Apple Developer
 * "Interpreting the JSON format of a crash report" / "Examining the fields in a crash report".
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

const manHinh = (dong) => `<pre><code class="language-text">${dong.join('\n')}</code></pre>`;
const consoleEn = manHinh([
  '┌ Console ───────────────────────────────────────────────────────────────────────────┐',
  '│ ▶ Start  ⏸ Pause  ⟳ Clear   Now   Activities   🔍 [ process:motep  subsystem:com.ex… ] │',
  '├──────────────┬─────────────────────────────────────────────────────────────────────┤',
  '│ Devices      │ Type  Time          Process  Subsystem          Category  Message   │',
  '│  ▸ This Mac  │ ●     12:30:18.182  motep    com.example.motep  config    Mở tệp…   │',
  '│ Reports      │ ●     12:30:18.182  motep                                 Fatal…    │',
  '│  Crash Rep.  ├─────────────────────────────────────────────────────────────────────┤',
  '│  Spin Rep.   │ (details of the selected line: library, PID, thread, activity)       │',
  '│  Log Reports │                                                                     │',
  '│  Diagnostic  │                                                                     │',
  '└──────────────┴─────────────────────────────────────────────────────────────────────┘',
]);
const consoleVi = manHinh([
  '┌ Console ───────────────────────────────────────────────────────────────────────────┐',
  '│ ▶ Bắt đầu  ⏸ Tạm dừng  ⟳ Xoá   Bây giờ   Activities  🔍 [ process:motep  subsystem:… ] │',
  '├──────────────┬─────────────────────────────────────────────────────────────────────┤',
  '│ Thiết bị     │ Loại  Giờ           Tiến trình Subsystem        Category  Thông điệp │',
  '│  ▸ Máy Mac   │ ●     12:30:18.182  motep    com.example.motep  config    Mở tệp…   │',
  '│ Báo cáo      │ ●     12:30:18.182  motep                                 Fatal…    │',
  '│  Crash Rep.  ├─────────────────────────────────────────────────────────────────────┤',
  '│  Spin Rep.   │ (chi tiết dòng đang chọn: thư viện, PID, luồng, activity)            │',
  '│  Log Reports │                                                                     │',
  '│  Diagnostic  │                                                                     │',
  '└──────────────┴─────────────────────────────────────────────────────────────────────┘',
]);

export default {
  title: '6.2 — The Console app: live streaming, filters, crash and spin reports|||6.2 — Ứng dụng Console: xem trực tiếp, bộ lọc, báo cáo crash và treo',
  slug: 'log-6-2-console-app',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Console là giao diện của unified log: bấm Start streaming, lọc bằng ô tìm kiếm theo process/subsystem/category, bật Include Info/Debug, lưu bộ lọc; nhánh Reports (Crash Reports, Spin Reports, Log Reports, Diagnostic Reports). Tình huống thật dựng lại bằng mã: một ứng dụng Swift văng mỗi khi mở một tệp cấu hình — đọc báo cáo .ips (dòng tiêu đề JSON + thân JSON: exception EXC_BREAKPOINT/SIGTRAP, exit 133 = 128 + 5, faultingThread, khung main motep.swift:11), đối chiếu dòng "Fatal error" trong unified log, và dạo /var/log còn lại (system.log gần trống, zcat hỏng trên macOS, install.log).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The Console app, crash reports, and what is left in /var/log</h2>
<p class="lead">Console (Applications › Utilities › Console) is the graphical window onto the unified log and onto the folders where macOS keeps reports. This lesson describes it screen by screen, then works through a real case: a small app that dies every time it opens one particular file. We find the crash report, read it field by field, and match it with the unified log.</p>

<h3>The everyday picture: the black box and the cockpit voice recorder</h3>
<p>When a plane has an incident, investigators use two things: the continuous flight data (altitude, speed every second) and a separate, detailed report written at the moment something went wrong. On a Mac, the unified log is the continuous data; a <strong>crash report</strong> is the detailed snapshot written when a process dies: which thread, which instruction, which libraries were loaded. You need both.</p>

<h3>Console, screen by screen</h3>
${consoleEn}
<ul>
<li><strong>Left sidebar — Devices:</strong> this Mac, plus iPhones/iPads connected by cable (developers read device logs here).</li>
<li><strong>Start / Pause:</strong> Console does <em>not</em> show anything until you press <strong>Start streaming</strong> — it is a live view, like <code>log stream</code>. Older messages are not in this view; for history use <code>log show</code> (lesson 6.3).</li>
<li><strong>Search field:</strong> type a word, then pick what it means from the menu: <em>process</em>, <em>subsystem</em>, <em>category</em>, <em>message</em>, <em>PID</em>… Several tokens combine (AND). Prefix with <code>-</code> to exclude. <strong>Save</strong> keeps the filter as a button for next time.</li>
<li><strong>Action menu › Include Info Messages / Include Debug Messages:</strong> off by default, so Console hides the same levels as <code>log show</code> without flags (lesson 6.1).</li>
<li><strong>Reports:</strong> <em>Crash Reports</em> (process died), <em>Spin Reports</em> (an app hung — the spinning beach ball — and the system sampled its threads), <em>Log Reports</em> (text log files: <code>/var/log</code>, <code>~/Library/Logs</code>), <em>Diagnostic Reports</em> (resource use, wake-ups, system-level reports in <code>/Library/Logs/DiagnosticReports</code>).</li>
</ul>
<p>Console is the fastest way to <em>look</em>; the command line is how you <em>repeat, filter, count and send</em> the result to someone. Everything below is done with commands so that you can reproduce it.</p>

<h3>The case: "the app crashes every time I open this file"</h3>
<p>A colleague's tool reads a configuration file. With one file it works; with another it dies instantly. Here is the tool (the bug is on line 11):</p>
${ma('swift', 's06/app/motep.swift')}
${lenh('s06/crash', 0)}
${lenh('s06/crash', 1)}
${lenh('s06/crash', 2)}
<p>The terminal shows the Swift runtime's last words and <code>exit=133</code>. As in lesson 7.5, an exit code above 128 means "killed by signal (code − 128)": 133 − 128 = <strong>5 = SIGTRAP</strong>. Swift turns a failed <code>!</code> unwrap into a trap instruction on purpose.</p>

<h3>Step 1 — find the report</h3>
${lenh('s06/crash', 3)}
<p>Reports of your own processes go to <code>~/Library/Logs/DiagnosticReports</code>; reports of system processes and other users go to <code>/Library/Logs/DiagnosticReports</code>. The name is <code>process-date-time.ips</code>. A few seconds pass between the crash and the file (ReportCrash symbolicates first).</p>

<h3>Step 2 — the header line</h3>
${lenh('s06/crash', 4)}
<p>An <code>.ips</code> file is <strong>two JSON documents</strong>: line 1 is a small header, the rest is the body. <code>bug_type</code> tells you the kind of report: <strong>309 = crash</strong> (spin, hang and panic reports carry other numbers — read the field and the body instead of guessing from the folder). The header also records the OS build — the first thing to compare when "it only crashes on her Mac".</p>

<h3>Step 3 — what killed it</h3>
${lenh('s06/crash', 5)}
<ul>
<li><code>exception.type</code> <strong>EXC_BREAKPOINT</strong> / <code>signal</code> <strong>SIGTRAP</strong>: a deliberate trap — in Swift almost always a failed <code>!</code>, an array index out of range, a failed <code>precondition</code>, or integer overflow. Compare: <strong>EXC_BAD_ACCESS / SIGSEGV</strong> = invalid memory access (the 139 of lesson 7.5); <strong>EXC_CRASH / SIGABRT</strong> = the program called <code>abort()</code> (uncaught Objective-C/C++ exception); <strong>EXC_RESOURCE</strong> = too much CPU/memory; <code>termination.namespace</code> <strong>CODESIGNING</strong> = killed for an invalid signature.</li>
<li><code>termination.indicator</code> "Trace/BPT trap: 5" — the same 5 as in exit 133.</li>
<li><code>procPath</code> "/private/tmp/*/motep" — macOS itself replaced the folders with <code>*</code>; user-specific paths are redacted in reports. Still: <strong>read a report before you forward it</strong> — it can contain file names, user IDs and machine model.</li>
<li><code>responsibleProc</code> — who is accountable for the process (here the terminal app); <code>procLaunch</code> vs <code>captureTime</code> — it died 63 ms after starting.</li>
</ul>

<h3>Step 4 — where it died</h3>
${lenh('s06/crash', 6)}
${lenh('s06/crash', 7)}
<p><code>faultingThread</code> is 0, so we read thread 0's frames, top = most recent. Each frame points into <code>usedImages</code> by index: 1 = <code>libswiftCore.dylib</code> (the runtime raising the trap), 0 = <code>motep</code> itself. Skip the runtime frames: the first frame in <em>your</em> binary is the answer — <strong><code>main</code>, <code>motep.swift</code> line 11</strong>, the <code>Int(…)!</code>. We compiled with <code>-g</code>, so file and line are there; for a release build without symbols you would see only addresses and need the matching <code>.dSYM</code>.</p>

<h3>Step 5 — the same minute in the unified log</h3>
${lenh('s06/crash', 8)}
<p>The report tells you <em>where</em>; the log tells you <em>what was happening</em>: "Mở tệp cấu hình hong.txt" (which file), then the runtime's exact message <code>Fatal error: Unexpectedly found nil while unwrapping an Optional value</code> (the report does not show it in the fields we printed), then the kernel (<code>Corpse allowed 1 of 5</code>: the dead process is kept as a "corpse" while the report is written; core dumps are denied by default) and finally <code>osanalyticshelper</code> saving the report. The first two kernel lines (AMFI) are the system checking the signature of our freshly compiled, ad-hoc-signed binary — lesson 6.5.</p>
<div class="callout ok"><p><strong>Conclusion you can send:</strong> "motep crashes with SIGTRAP at motep.swift:11 when the config file has a non-numeric <code>cong=</code> value (hong.txt contains <code>cong=80 80</code>). Force-unwrap of <code>Int(…)</code>. Fix: validate and show an error instead of <code>!</code>." One line from the report, one from the log, the input that triggers it.</p></div>
${lenh('s06/crash', 9)}
<p>Our own report folder holds 23 <code>.ips</code> files — mostly from browsers and Node. A developer Mac collects them quietly; Console shows the same list under Crash Reports.</p>

<h3>Spin reports: when nothing crashes but everything hangs</h3>
<p>When an app stops responding long enough to show the beach ball, macOS can sample all its threads several times and write a <strong>spin</strong> or <strong>hang</strong> report. You read it differently from a crash: there is no faulting thread; look at the <strong>main thread</strong> and see what it was doing in every sample — waiting on a lock, a network call on the main thread, a huge synchronous file read. The fix is usually "move that work off the main thread".</p>

<h3>Log Reports: what is left in /var/log</h3>
${lenh('s06/varlog', 0)}
${lenh('s06/varlog', 1)}
${lenh('s06/varlog', 2)}
${lenh('s06/varlog', 3)}
<p><code>system.log</code> — the main log before 2016 — now has 92 lines, mostly <code>syslogd</code> saying "ASL Sender Statistics". <code>install.log</code> is the opposite: 290 thousand lines, because the installer still writes text. Rotated files are compressed with gzip, and here is a classic Mac trap:</p>
${lenh('s06/varlog', 4)}
${lenh('s06/varlog', 5)}
<p>On macOS, <code>zcat</code> is the old <code>.Z</code> decompressor; use <code>gzcat</code> (or <code>gunzip -c</code>). The <code>.bz2</code> files need <code>bzcat</code>. Other files worth knowing: <code>install.log</code> (every installer and update — lesson 6.5 uses it for XProtect and the Lab for a reboot), <code>shutdown_monitor.log</code>, <code>fsck_apfs.log</code> (disk checks at boot), <code>powermanagement/</code> (read with <code>pmset -g log</code>), <code>com.apple.xpc.launchd/</code>.</p>
${lenh('s06/varlog', 6)}
${lenh('s06/varlog', 7)}

<h3>Real-life situations</h3>
<ul>
<li><strong>QA: "the app crashes on my machine only".</strong> Ask for the <code>.ips</code> (Console › Crash Reports › right-click › Reveal in Finder), compare <code>os_version</code>, then read the first frame in your own binary. Ask what file or action triggered it — match with the unified log at the same second.</li>
<li><strong>Your Electron/Node desktop app dies at start on a teammate's Mac.</strong> Check <code>termination.namespace</code>: <code>CODESIGNING</code> means a signing/notarisation problem, not your code.</li>
<li><strong>Mac "freezes" for seconds.</strong> Look for spin/hang reports and for <code>kernel</code> lines at the same time (memory pressure, disk).</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Open Console, Start streaming, filter <code>process:motep</code>. Run the crashing command again. Which line is the last one from motep itself?</li>
<li>Find the new report in Console › Crash Reports and in Finder. Are they the same file?</li>
<li>With <code>jq</code>, print <code>exception.type</code>, <code>termination.indicator</code> and the first frame that belongs to image 0.</li>
<li>Change line 11 to use an array index out of range (<code>[1,2][5]</code>). Predict the exception type, then check.</li>
</ol>
<p><strong>Done when:</strong> 1 is the "Fatal error" line from <code>libswiftCore.dylib</code>; 3 names <code>main</code> + the line number; 4 is still EXC_BREAKPOINT/SIGTRAP (Swift traps on bounds checks too) with a different runtime message.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Console', 'Live view of the unified log + browser for crash/spin/log/diagnostic reports.'],
  ['.ips', 'Crash report: header JSON line + body JSON; bug_type 309 = crash.'],
  ['EXC_BREAKPOINT / SIGTRAP', 'Deliberate trap — in Swift: failed !, bounds check, precondition.'],
  ['EXC_BAD_ACCESS / SIGSEGV', 'Invalid memory access.'],
  ['faultingThread', 'Index of the thread that crashed; read its frames top-down to the first in your binary.'],
  ['spin / hang report', 'Samples of a non-responding app; read the main thread.'],
  ['gzcat', 'Read .gz on macOS (zcat expects .Z).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Console streams live only after Start; history is <code>log show</code>.</li>
<li>Crash = report (where) + unified log (what was happening) + input (why).</li>
<li>Read <code>exception</code>, <code>termination</code>, then the faulting thread's first frame in your own image.</li>
<li><code>/var/log/system.log</code> is nearly empty today; <code>install.log</code> is still rich.</li>
</ul>
${nguon('📘', 'Apple — Console User Guide', 'Streaming, searching, saving searches, reports', 'https://support.apple.com/guide/console/welcome/mac')}
${nguon('📘', 'Apple Developer — Interpreting the JSON format of a crash report', 'Header and body of .ips, field meanings', 'https://developer.apple.com/documentation/xcode/interpreting-the-json-format-of-a-crash-report')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-5-kernel-dmesg', title: 'Lesson 7.5 — Kernel messages, segfaults, exit 139', sub: 'Signals and exit codes on Linux', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Lesson 3.6 — Reliability Monitor', sub: 'The Windows view of app crashes (1000/1001)', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Ứng dụng Console, báo cáo crash, và /var/log còn lại gì</h2>
<p class="lead">Console (Applications › Utilities › Console) là cửa sổ đồ hoạ nhìn vào unified log và vào các thư mục nơi macOS giữ báo cáo. Bài này mô tả nó từng màn hình, rồi đi qua một ca thật: một ứng dụng nhỏ chết mỗi khi mở một tệp nhất định. Ta tìm báo cáo crash, đọc từng trường, và khớp nó với unified log.</p>

<h3>Liên tưởng đời thường: hộp đen và bản báo cáo sự cố</h3>
<p>Khi máy bay gặp sự cố, điều tra viên dùng hai thứ: dữ liệu bay liên tục (độ cao, tốc độ từng giây) và một bản báo cáo chi tiết ghi đúng lúc có chuyện. Trên Mac, unified log là dữ liệu liên tục; <strong>báo cáo crash</strong> là ảnh chụp chi tiết ghi lúc một tiến trình chết: luồng nào, lệnh máy nào, thư viện nào đang nạp. Cần cả hai.</p>

<h3>Console, từng màn hình</h3>
${consoleVi}
<ul>
<li><strong>Thanh bên trái — Thiết bị:</strong> máy Mac này, cộng iPhone/iPad cắm cáp (lập trình viên đọc log thiết bị ở đây).</li>
<li><strong>Start / Pause:</strong> Console <em>không</em> hiện gì cho tới khi bạn bấm <strong>Start streaming</strong> — đây là màn hình trực tiếp, như <code>log stream</code>. Thông điệp cũ không có ở đây; xem lịch sử thì dùng <code>log show</code> (bài 6.3).</li>
<li><strong>Ô tìm kiếm:</strong> gõ một từ, rồi chọn nghĩa của nó trong menu: <em>process</em>, <em>subsystem</em>, <em>category</em>, <em>message</em>, <em>PID</em>… Nhiều thẻ ghép với nhau (VÀ). Thêm <code>-</code> phía trước để loại trừ. <strong>Save</strong> giữ bộ lọc thành một nút cho lần sau.</li>
<li><strong>Menu Action › Include Info Messages / Include Debug Messages:</strong> mặc định tắt, nên Console giấu đúng những mức mà <code>log show</code> không cờ cũng giấu (bài 6.1).</li>
<li><strong>Reports:</strong> <em>Crash Reports</em> (tiến trình chết), <em>Spin Reports</em> (ứng dụng treo — quả bóng xoay — và hệ thống lấy mẫu các luồng của nó), <em>Log Reports</em> (tệp log dạng chữ: <code>/var/log</code>, <code>~/Library/Logs</code>), <em>Diagnostic Reports</em> (dùng tài nguyên, đánh thức, báo cáo cấp hệ thống trong <code>/Library/Logs/DiagnosticReports</code>).</li>
</ul>
<p>Console là cách nhanh nhất để <em>nhìn</em>; dòng lệnh là cách để <em>lặp lại, lọc, đếm và gửi</em> kết quả cho người khác. Mọi thứ dưới đây làm bằng lệnh để bạn tái hiện được.</p>

<h3>Ca thật: "ứng dụng văng mỗi khi tôi mở tệp này"</h3>
<p>Công cụ của một đồng nghiệp đọc tệp cấu hình. Với tệp này thì chạy; với tệp kia thì chết ngay. Đây là công cụ (lỗi ở dòng 11):</p>
${ma('swift', 's06/app/motep.swift')}
${lenh('s06/crash', 0)}
${lenh('s06/crash', 1)}
${lenh('s06/crash', 2)}
<p>Terminal cho lời trăng trối của runtime Swift và <code>exit=133</code>. Như bài 7.5, mã thoát trên 128 nghĩa là "bị tín hiệu giết (mã − 128)": 133 − 128 = <strong>5 = SIGTRAP</strong>. Swift cố ý biến một lần ép <code>!</code> thất bại thành lệnh bẫy.</p>

<h3>Bước 1 — tìm báo cáo</h3>
${lenh('s06/crash', 3)}
<p>Báo cáo của tiến trình do bạn chạy nằm ở <code>~/Library/Logs/DiagnosticReports</code>; của tiến trình hệ thống và người dùng khác nằm ở <code>/Library/Logs/DiagnosticReports</code>. Tên là <code>tiến-trình-ngày-giờ.ips</code>. Mất vài giây từ lúc văng tới lúc có tệp (ReportCrash dịch ký hiệu trước).</p>

<h3>Bước 2 — dòng tiêu đề</h3>
${lenh('s06/crash', 4)}
<p>Một tệp <code>.ips</code> là <strong>hai tài liệu JSON</strong>: dòng 1 là tiêu đề nhỏ, phần còn lại là thân. <code>bug_type</code> cho biết loại báo cáo: <strong>309 = crash</strong> (báo cáo spin, treo và panic mang số khác — đọc trường này và phần thân thay vì đoán theo thư mục). Tiêu đề còn ghi bản dựng của hệ điều hành — thứ đầu tiên cần so khi "chỉ văng trên máy chị ấy".</p>

<h3>Bước 3 — cái gì đã giết nó</h3>
${lenh('s06/crash', 5)}
<ul>
<li><code>exception.type</code> <strong>EXC_BREAKPOINT</strong> / <code>signal</code> <strong>SIGTRAP</strong>: bẫy cố ý — trong Swift gần như luôn là một lần <code>!</code> thất bại, chỉ số mảng vượt khoảng, <code>precondition</code> sai, hoặc tràn số nguyên. So sánh: <strong>EXC_BAD_ACCESS / SIGSEGV</strong> = truy cập bộ nhớ sai (con số 139 của bài 7.5); <strong>EXC_CRASH / SIGABRT</strong> = chương trình gọi <code>abort()</code> (ngoại lệ Objective-C/C++ không ai bắt); <strong>EXC_RESOURCE</strong> = dùng quá CPU/bộ nhớ; <code>termination.namespace</code> <strong>CODESIGNING</strong> = bị giết vì chữ ký không hợp lệ.</li>
<li><code>termination.indicator</code> "Trace/BPT trap: 5" — đúng con số 5 trong exit 133.</li>
<li><code>procPath</code> "/private/tmp/*/motep" — chính macOS đã thay các thư mục bằng <code>*</code>; đường dẫn riêng của người dùng bị che trong báo cáo. Dù vậy: <strong>đọc báo cáo trước khi chuyển tiếp</strong> — nó có thể chứa tên tệp, mã người dùng và đời máy.</li>
<li><code>responsibleProc</code> — ai chịu trách nhiệm cho tiến trình (ở đây là ứng dụng terminal); <code>procLaunch</code> so với <code>captureTime</code> — nó chết 63 ms sau khi khởi động.</li>
</ul>

<h3>Bước 4 — chết ở đâu</h3>
${lenh('s06/crash', 6)}
${lenh('s06/crash', 7)}
<p><code>faultingThread</code> là 0, nên ta đọc các khung của luồng 0, trên cùng = mới nhất. Mỗi khung trỏ vào <code>usedImages</code> theo chỉ số: 1 = <code>libswiftCore.dylib</code> (runtime bật bẫy), 0 = chính <code>motep</code>. Bỏ qua các khung runtime: khung đầu tiên thuộc tệp chạy <em>của bạn</em> là câu trả lời — <strong><code>main</code>, <code>motep.swift</code> dòng 11</strong>, chỗ <code>Int(…)!</code>. Chúng tôi dịch với <code>-g</code> nên có tên tệp và số dòng; với bản phát hành không có ký hiệu bạn chỉ thấy địa chỉ và cần <code>.dSYM</code> tương ứng.</p>

<h3>Bước 5 — cùng phút đó trong unified log</h3>
${lenh('s06/crash', 8)}
<p>Báo cáo cho biết <em>ở đâu</em>; log cho biết <em>lúc đó đang làm gì</em>: "Mở tệp cấu hình hong.txt" (tệp nào), rồi nguyên văn thông điệp của runtime <code>Fatal error: Unexpectedly found nil while unwrapping an Optional value</code> (các trường ta in từ báo cáo không có câu này), rồi nhân (<code>Corpse allowed 1 of 5</code>: tiến trình chết được giữ lại như một "xác" trong lúc viết báo cáo; core dump bị từ chối mặc định) và cuối cùng <code>osanalyticshelper</code> lưu báo cáo. Hai dòng nhân đầu (AMFI) là hệ thống kiểm chữ ký của tệp chạy vừa dịch, ký kiểu ad-hoc — bài 6.5.</p>
<div class="callout ok"><p><strong>Kết luận gửi được:</strong> "motep văng SIGTRAP ở motep.swift:11 khi tệp cấu hình có giá trị <code>cong=</code> không phải số (hong.txt chứa <code>cong=80 80</code>). Ép <code>!</code> kết quả <code>Int(…)</code>. Sửa: kiểm tra và báo lỗi thay vì <code>!</code>." Một dòng từ báo cáo, một dòng từ log, và đầu vào gây lỗi.</p></div>
${lenh('s06/crash', 9)}
<p>Thư mục báo cáo của chính chúng tôi có 23 tệp <code>.ips</code> — phần lớn của trình duyệt và Node. Máy Mac của lập trình viên lặng lẽ gom chúng; Console hiện đúng danh sách đó ở Crash Reports.</p>

<h3>Spin report: khi không có gì văng mà mọi thứ đứng hình</h3>
<p>Khi một ứng dụng ngừng phản hồi đủ lâu để hiện quả bóng xoay, macOS có thể lấy mẫu mọi luồng của nó nhiều lần và viết báo cáo <strong>spin</strong> hoặc <strong>hang</strong>. Đọc khác với crash: không có luồng gây lỗi; hãy nhìn <strong>luồng chính</strong> xem nó làm gì trong mọi mẫu — chờ khoá, gọi mạng ngay trên luồng chính, đọc đồng bộ một tệp khổng lồ. Cách sửa thường là "chuyển việc đó khỏi luồng chính".</p>

<h3>Log Reports: /var/log còn lại gì</h3>
${lenh('s06/varlog', 0)}
${lenh('s06/varlog', 1)}
${lenh('s06/varlog', 2)}
${lenh('s06/varlog', 3)}
<p><code>system.log</code> — log chính trước 2016 — giờ chỉ có 92 dòng, phần lớn là <code>syslogd</code> báo "ASL Sender Statistics". <code>install.log</code> thì ngược lại: 290 nghìn dòng, vì trình cài đặt vẫn viết chữ. Tệp đã xoay vòng được nén gzip, và đây là cái bẫy kinh điển trên Mac:</p>
${lenh('s06/varlog', 4)}
${lenh('s06/varlog', 5)}
<p>Trên macOS, <code>zcat</code> là bộ giải nén <code>.Z</code> đời cũ; dùng <code>gzcat</code> (hoặc <code>gunzip -c</code>). Tệp <code>.bz2</code> cần <code>bzcat</code>. Các tệp khác nên biết: <code>install.log</code> (mọi lần cài và cập nhật — bài 6.5 dùng nó cho XProtect, còn Lab dùng cho một lần khởi động lại), <code>shutdown_monitor.log</code>, <code>fsck_apfs.log</code> (kiểm đĩa lúc khởi động), <code>powermanagement/</code> (đọc bằng <code>pmset -g log</code>), <code>com.apple.xpc.launchd/</code>.</p>
${lenh('s06/varlog', 6)}
${lenh('s06/varlog', 7)}

<h3>Tình huống đi làm</h3>
<ul>
<li><strong>QA: "ứng dụng chỉ văng trên máy em".</strong> Xin tệp <code>.ips</code> (Console › Crash Reports › chuột phải › Reveal in Finder), so <code>os_version</code>, rồi đọc khung đầu tiên trong tệp chạy của mình. Hỏi tệp hay thao tác nào gây ra — khớp với unified log đúng giây đó.</li>
<li><strong>Ứng dụng desktop Electron/Node của bạn chết ngay khi mở trên Mac đồng nghiệp.</strong> Xem <code>termination.namespace</code>: <code>CODESIGNING</code> nghĩa là vấn đề ký/notarize, không phải mã của bạn.</li>
<li><strong>Mac "đơ" vài giây.</strong> Tìm spin/hang report và dòng <code>kernel</code> cùng lúc (thiếu bộ nhớ, đĩa).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Mở Console, Start streaming, lọc <code>process:motep</code>. Chạy lại lệnh gây văng. Dòng cuối cùng do chính motep ghi là dòng nào?</li>
<li>Tìm báo cáo mới trong Console › Crash Reports và trong Finder. Có phải cùng một tệp?</li>
<li>Dùng <code>jq</code> in <code>exception.type</code>, <code>termination.indicator</code> và khung đầu tiên thuộc image 0.</li>
<li>Sửa dòng 11 thành truy cập mảng vượt khoảng (<code>[1,2][5]</code>). Đoán loại exception, rồi kiểm.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 là dòng "Fatal error" từ <code>libswiftCore.dylib</code>; câu 3 nêu được <code>main</code> + số dòng; câu 4 vẫn là EXC_BREAKPOINT/SIGTRAP (Swift cũng bẫy khi kiểm biên) với thông điệp runtime khác.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Console', 'Màn hình trực tiếp của unified log + nơi duyệt báo cáo crash/spin/log/diagnostic.'],
  ['.ips', 'Báo cáo crash: một dòng JSON tiêu đề + JSON thân; bug_type 309 = crash.'],
  ['EXC_BREAKPOINT / SIGTRAP', 'Bẫy cố ý — trong Swift: ! thất bại, kiểm biên, precondition.'],
  ['EXC_BAD_ACCESS / SIGSEGV', 'Truy cập bộ nhớ không hợp lệ.'],
  ['faultingThread', 'Chỉ số luồng gây văng; đọc các khung từ trên xuống tới khung đầu tiên thuộc tệp chạy của bạn.'],
  ['spin / hang report', 'Các mẫu của ứng dụng không phản hồi; đọc luồng chính.'],
  ['gzcat', 'Đọc .gz trên macOS (zcat chờ .Z).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Console chỉ chạy trực tiếp sau khi bấm Start; lịch sử là <code>log show</code>.</li>
<li>Crash = báo cáo (ở đâu) + unified log (lúc đó làm gì) + đầu vào (vì sao).</li>
<li>Đọc <code>exception</code>, <code>termination</code>, rồi khung đầu tiên của luồng gây lỗi nằm trong image của bạn.</li>
<li><code>/var/log/system.log</code> hôm nay gần trống; <code>install.log</code> vẫn giàu thông tin.</li>
</ul>
${nguon('📘', 'Apple — Console User Guide', 'Xem trực tiếp, tìm kiếm, lưu bộ lọc, báo cáo', 'https://support.apple.com/guide/console/welcome/mac')}
${nguon('📘', 'Apple Developer — Interpreting the JSON format of a crash report', 'Tiêu đề và thân của .ips, nghĩa các trường', 'https://developer.apple.com/documentation/xcode/interpreting-the-json-format-of-a-crash-report')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-5-kernel-dmesg', title: 'Bài 7.5 — Thông điệp nhân, segfault, exit 139', sub: 'Tín hiệu và mã thoát trên Linux', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-3-6-reliability-monitor', title: 'Bài 3.6 — Reliability Monitor', sub: 'Góc nhìn Windows về ứng dụng văng (1000/1001)', cta: 'Mở bài' })}
</div>
`,
};
