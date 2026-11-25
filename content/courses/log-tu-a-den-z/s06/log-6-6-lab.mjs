/**
 * 6.6 — Lab 6: máy Mac ngủ/thức lúc nào, ai dùng sudo tuần này, và chữ "crash" trong last (soạn 25/11/2026, agent Mac tiếp quản lgz).
 * Chạy thật trên MacBook macOS 27.2.1: OUT['s06/lab6'] (đáp án) — pmset -g log, loginwindow, sudo, last, khoảng trống unified log 19:10→19:16
 * ngày 24/11, suhelperd "Rebooting" + reboot3, install.log, pmset SoftwareUpdate. Đã ẩn danh. Người không có Mac: làm trên output in sẵn.
 */
import { lenh, kv } from '../_chung.mjs';

export default {
  title: '6.6 — Lab 6 — When did my Mac sleep and wake, and who used sudo this week?|||6.6 — Lab 6 — Máy Mac của tôi ngủ/thức lúc nào, và ai đã dùng sudo tuần này?',
  slug: 'log-6-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab có chấm, chỉ đọc, không sudo: dựng dòng thời gian 7 ngày của một máy Mac thật từ pmset -g log (ngủ/thức/DarkWake theo ngày) và loginwindow (khoá/mở màn hình), trả lời ai đã dùng sudo, rồi điều tra chữ "crash" mà last ghi lúc 19:06–19:16 ngày 24/11: khoảng trống 6 phút trong unified log, suhelperd "Rebooting … reboot3", install.log và pmset cùng chỉ về một lần khởi động lại để cập nhật macOS lên 27.2.1 — không phải sự cố. Kèm bẫy --end vắt qua lần khởi động lại, mẫu báo cáo 5 dòng, câu hỏi phỏng vấn; người không có Mac làm trên output thật in sẵn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab 6</span>
<h2>Lab 6 — A week in the life of a Mac, from its logs</h2>
<p class="lead">Monday 08:30, a message from IT security: "Routine check on your MacBook. Send us (1) when it slept and woke during the last 7 days, (2) who used sudo, and (3) an explanation for the 'crash' that <code>last</code> shows on 24/11 around 19:06–19:16 — was the machine compromised or did it really crash?" You may only read. No sudo, no configuration changes.</p>

<h3>Setup (5 min)</h3>
<ol>
<li>On your own Mac: Terminal, nothing to install. Dates in the answers below are from the lab MacBook; yours will differ — the method is what is graded.</li>
<li><strong>No Mac?</strong> Do the lab on paper: read each question, open <em>only</em> the "commands and output" block (real output from the lab MacBook, anonymised), write your answers, then compare with the explanation.</li>
</ol>
<div class="callout warn"><p><strong>Rules.</strong> Read-only — like a production server under investigation. Every claim in your report needs a command and a quoted log line. Do not include personal data in what you send (network names, file names, app lists).</p></div>

<h3>Questions</h3>
<ol>
<li><strong>Sleep and wake.</strong> For each of the last 7 days: how many Sleep, Wake and DarkWake events? When was the last real wake by a person?</li>
<li><strong>Presence.</strong> List screen lock/unlock times. Which of them match the wake events of question 1?</li>
<li><strong>sudo.</strong> Who used sudo in the last 7 days? Prove it — and say how you would tell a real sudo line from a fake one.</li>
<li><strong>The "crash".</strong> What happened between 19:06 and 19:16 on 24/11? Give at least three independent sources that agree.</li>
<li><strong>Trap.</strong> While answering 4 you will use a <code>--start/--end</code> window. Check that the output really stops at <code>--end</code>.</li>
</ol>
<details><summary>Hint for 1–2</summary><p><code>pmset -g log</code> + <code>awk</code> on column 4 (lesson 6.4); the loginwindow predicate with <code>sendDistributedNotification: com.apple.screenIs</code>.</p></details>
<details><summary>Hint for 3</summary><p><code>process == "sudo"</code>; remember the header line in <code>wc -l</code>; lesson 6.5 step 2.</p></details>
<details><summary>Hint for 4–5</summary><p><code>last</code> (reboot/shutdown lines), events per minute with ndjson + jq (lesson 6.3), <code>suhelperd</code>/<code>softwareupdated</code>, <code>/var/log/install.log</code>, <code>pmset -g log | grep SoftwareUpdate</code>.</p></details>

<h3>Solution</h3>
<details><summary>Show the commands and output — questions 1–3</summary>
${lenh('s06/lab6', 0)}
${lenh('s06/lab6', 1)}
${lenh('s06/lab6', 2)}
${lenh('s06/lab6', 3)}
${lenh('s06/lab6', 4)}
</details>
<details><summary>Show the commands and output — questions 4–5</summary>
${lenh('s06/lab6', 5)}
${lenh('s06/lab6', 6)}
${lenh('s06/lab6', 7)}
${lenh('s06/lab6', 8)}
${lenh('s06/lab6', 9)}
${lenh('s06/lab6', 10)}
${lenh('s06/lab6', 11)}
</details>
<details><summary>Show the explanation</summary>
<ol>
<li><strong>Sleep/wake.</strong> The power log starts on 18/11 (first line). Counts: 21/11 22 Sleep / 22 Wake / 21 DarkWake; 22/11 76 / 81 / 72; 23/11 6 / 7 / 6; nothing after 23/11 10:32 — the Mac has stayed awake since (on AC power, in use). Most wakes are <strong>DarkWake</strong> ("Sleep Service", "Maintenance"): the Mac woke itself without the screen for network and housekeeping, not a person. The last wake by a person: <code>23/11 10:32:51 … DarkWake to FullWake … due to UserActivity</code>.</li>
<li><strong>Presence.</strong> Locked 23/11 00:21:04 → unlocked 10:32:55 (four seconds after the UserActivity wake above — same event, two logs agree); locked 24/11 13:07:36 → unlocked 13:25:51; locked 19:18:44 → unlocked 19:19:04 (right after the reboot of question 4: the login screen).</li>
<li><strong>sudo.</strong> <code>process == "sudo"</code> over 7 days returns 0 records: nobody used sudo. A real line would have <code>process</code> sudo and <code>processImagePath</code> <code>/usr/bin/sudo</code>; a line written with <code>logger -t sudo</code> is <code>/usr/bin/logger</code> with the user's UID (lesson 6.5). Limit: the unified log on this Mac covers 12 days — enough for "this week", not for a month.</li>
<li><strong>The "crash".</strong> Four sources tell one story:
<ul>
<li><code>last</code>: <code>reboot time … 19:16</code> with no <code>shutdown time</code>; a <code>root console</code> session 19:06 – crash.</li>
<li>pmset: <code>SoftwareUpdate.BeforePostlogout</code> 19:03–19:04 and the update's notification manager ending at 19:06 — the user chose "Restart / Update now" and was logged out.</li>
<li>install.log: Command Line Tools 27.2 installed 19:09:32; at 19:10:22 <code>SUOSUPostLogoutInstallOperation: Rebooting (success = 1 …)</code>, <code>Calling reboot3</code>.</li>
<li>Unified log: <code>suhelperd</code> "Rebooting" + <code>reboot3</code> at 19:10:22, a time-sync event at 19:10:26, then <strong>silence until 19:16</strong> (events per minute: 3,023 in 19:10, nothing 19:11–19:15, 4,206 in 19:16) — the update was being applied while macOS was not running. The update is named in install.log at that second: <code>MSU_UPDATE_26B131_patch_27.2.1</code> — and <code>sw_vers</code> now reports 27.2.1.</li>
</ul>
Conclusion: a <strong>user-started macOS update and restart</strong>, not a crash and no sign of compromise. "crash" appears because the update's post-logout session (the <code>root console</code> login, our interpretation of the 19:06 record) never wrote a logout before the machine rebooted.</li>
<li><strong>Trap.</strong> The events-per-minute output goes on to 19:17 and 19:18 although <code>--end</code> was 19:16:30 — on this macOS release <code>--end</code> was ignored for a window crossing a reboot. Our <code>awk … exit</code> stopped it; without that, the command printed millions of lines until "now".</li>
</ol>
</details>

<h3>Report template (5 lines)</h3>
<pre><code class="language-text">Subject: MacBook macbook-lab — power, sudo and 24/11 restart (log review, read-only)
1. Sleep/wake 18–25/11: mostly DarkWake maintenance; last user wake 23/11 10:32 (pmset), matches unlock 10:32:55 (loginwindow).
2. sudo: 0 uses in 7 days (unified log, process == "sudo"; store covers 13–25/11).
3. 24/11 19:10:22 reboot by macOS update to 27.2.1 (26B131) (install.log "Rebooting… reboot3", suhelperd; log gap 19:10–19:16).
4. "crash" in last = no logout record for the update session; no sign of compromise.
5. Evidence attached: commands + quoted lines; no personal data included.</code></pre>

<h3>Interviewers will ask</h3>
<details><summary>"Where are logs on macOS, and how do you read them?"</summary><p>Most are in the unified log: binary files under <code>/var/db/diagnostics</code> with format strings in <code>/var/db/uuidtext</code>, read with <code>log show</code>/<code>log stream</code> or Console. Some text logs remain in <code>/var/log</code> (install.log is the useful one) and <code>~/Library/Logs</code>; crash reports are <code>.ips</code> JSON in <code>DiagnosticReports</code>; power history via <code>pmset -g log</code>; logins via <code>last</code>.</p></details>
<details><summary>"Why do Mac logs show &lt;private&gt;, and what do you do about it?"</summary><p>Dynamic values are redacted by default to protect user data. For your own app, mark non-sensitive fields <code>.public</code> and keep secrets out entirely; for someone else's app, reproduce in a controlled environment or ask the vendor. Enabling private data globally needs a configuration profile — not something to do casually on a work machine.</p></details>
<details><summary>"An app crashes on a tester's Mac only. How do you investigate?"</summary><p>Get the <code>.ips</code>, compare OS build, read <code>exception</code>/<code>termination</code> and the first frame of the faulting thread in our binary (symbolicate with the dSYM if needed), then read the unified log at the same second with <code>process == "app"</code> to see the input. If <code>termination.namespace</code> is CODESIGNING, it is signing/notarisation, not code.</p></details>
<details><summary>"How would you check a Mac for persistence?"</summary><p>New or unknown plists in <code>~/Library/LaunchAgents</code>, <code>/Library/LaunchAgents</code>, <code>/Library/LaunchDaemons</code>; Login Items in System Settings; Background Task Management events (and <code>sfltool dumpbtm</code> with admin rights); <code>launchctl print</code> for unknown labels; look for shells or scripts in <code>ProgramArguments</code> running from user-writable paths — the Silver Sparrow pattern.</p></details>
<details><summary>"Compare the macOS unified log with journald and Windows Event Log."</summary><p>All three are binary, structured and queried with their own tool. macOS filters with NSPredicate on process/subsystem/category/type, keeps data by size budget and per-message TTL, never stores debug, and redacts dynamic values. journald filters by fields like _SYSTEMD_UNIT, PRIORITY with size/time limits. Windows uses channels, Provider + Event ID, and FilterHashtable/XPath.</p></details>

<div class="callout ok"><p><strong>Done when:</strong> your answer to 4 cites at least three sources with times that agree within a minute; question 3 states the time range the unified log actually covers; question 5 shows you noticed (and stopped) the over-long output; nothing in your report reveals personal data.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['pmset -g log', 'Power-management history (Sleep, Wake, DarkWake, assertions) in /var/log/powermanagement.'],
  ['DarkWake', 'Wake without the display, for maintenance/network — not a person.'],
  ['screenIsLocked / screenIsUnlocked', 'loginwindow notifications marking presence.'],
  ['corroboration', 'Several independent sources agreeing before you conclude.'],
])}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab 6</span>
<h2>Lab 6 — Một tuần của máy Mac, đọc từ log của nó</h2>
<p class="lead">Thứ Hai 08:30, tin nhắn từ đội bảo mật IT: "Kiểm tra định kỳ MacBook của em. Gửi bọn anh (1) 7 ngày qua máy ngủ và thức lúc nào, (2) ai đã dùng sudo, và (3) giải thích chữ 'crash' mà <code>last</code> ghi ngày 24/11 khoảng 19:06–19:16 — máy bị xâm nhập hay thật sự sập?" Bạn chỉ được đọc. Không sudo, không đổi cấu hình.</p>

<h3>Chuẩn bị (5 phút)</h3>
<ol>
<li>Trên Mac của bạn: Terminal, không cần cài gì. Ngày giờ trong đáp án là của MacBook lab; của bạn sẽ khác — thứ được chấm là cách làm.</li>
<li><strong>Không có Mac?</strong> Làm lab trên giấy: đọc từng câu hỏi, chỉ mở khối "lệnh và output" (output thật từ MacBook lab, đã ẩn danh), viết câu trả lời, rồi so với phần giải thích.</li>
</ol>
<div class="callout warn"><p><strong>Luật.</strong> Chỉ đọc — như với máy chủ production đang bị điều tra. Mỗi khẳng định trong báo cáo cần một lệnh và một dòng log trích dẫn. Không đưa dữ liệu cá nhân vào thứ bạn gửi (tên mạng, tên tệp, danh sách ứng dụng).</p></div>

<h3>Câu hỏi</h3>
<ol>
<li><strong>Ngủ và thức.</strong> Với mỗi ngày trong 7 ngày qua: bao nhiêu sự kiện Sleep, Wake và DarkWake? Lần cuối một người thật đánh thức máy là lúc nào?</li>
<li><strong>Có mặt.</strong> Liệt kê giờ khoá/mở màn hình. Lần nào khớp với sự kiện thức ở câu 1?</li>
<li><strong>sudo.</strong> Ai đã dùng sudo trong 7 ngày qua? Chứng minh — và nói cách phân biệt dòng sudo thật với dòng giả.</li>
<li><strong>Chữ "crash".</strong> Chuyện gì xảy ra từ 19:06 tới 19:16 ngày 24/11? Đưa ít nhất ba nguồn độc lập cùng nói một điều.</li>
<li><strong>Bẫy.</strong> Khi trả lời câu 4 bạn sẽ dùng khung <code>--start/--end</code>. Kiểm xem output có thật sự dừng ở <code>--end</code> không.</li>
</ol>
<details><summary>Gợi ý câu 1–2</summary><p><code>pmset -g log</code> + <code>awk</code> trên cột 4 (bài 6.4); predicate loginwindow với <code>sendDistributedNotification: com.apple.screenIs</code>.</p></details>
<details><summary>Gợi ý câu 3</summary><p><code>process == "sudo"</code>; nhớ dòng tiêu đề trong <code>wc -l</code>; bài 6.5 bước 2.</p></details>
<details><summary>Gợi ý câu 4–5</summary><p><code>last</code> (dòng reboot/shutdown), số sự kiện mỗi phút bằng ndjson + jq (bài 6.3), <code>suhelperd</code>/<code>softwareupdated</code>, <code>/var/log/install.log</code>, <code>pmset -g log | grep SoftwareUpdate</code>.</p></details>

<h3>Lời giải</h3>
<details><summary>Xem lệnh và output — câu 1–3</summary>
${lenh('s06/lab6', 0)}
${lenh('s06/lab6', 1)}
${lenh('s06/lab6', 2)}
${lenh('s06/lab6', 3)}
${lenh('s06/lab6', 4)}
</details>
<details><summary>Xem lệnh và output — câu 4–5</summary>
${lenh('s06/lab6', 5)}
${lenh('s06/lab6', 6)}
${lenh('s06/lab6', 7)}
${lenh('s06/lab6', 8)}
${lenh('s06/lab6', 9)}
${lenh('s06/lab6', 10)}
${lenh('s06/lab6', 11)}
</details>
<details><summary>Xem phần giải thích</summary>
<ol>
<li><strong>Ngủ/thức.</strong> Log nguồn điện bắt đầu từ 18/11 (dòng đầu). Số đếm: 21/11 22 Sleep / 22 Wake / 21 DarkWake; 22/11 76 / 81 / 72; 23/11 6 / 7 / 6; không có gì sau 23/11 10:32 — từ đó máy luôn thức (cắm điện, đang dùng). Phần lớn lần thức là <strong>DarkWake</strong> ("Sleep Service", "Maintenance"): Mac tự dậy mà không bật màn hình để lo mạng và việc vặt, không phải người. Lần cuối một người đánh thức máy: <code>23/11 10:32:51 … DarkWake to FullWake … due to UserActivity</code>.</li>
<li><strong>Có mặt.</strong> Khoá 23/11 00:21:04 → mở 10:32:55 (bốn giây sau lần thức do UserActivity ở trên — cùng một sự việc, hai log khớp nhau); khoá 24/11 13:07:36 → mở 13:25:51; khoá 19:18:44 → mở 19:19:04 (ngay sau lần khởi động lại ở câu 4: màn hình đăng nhập).</li>
<li><strong>sudo.</strong> <code>process == "sudo"</code> trong 7 ngày ra 0 bản ghi: không ai dùng sudo. Một dòng thật sẽ có <code>process</code> sudo và <code>processImagePath</code> <code>/usr/bin/sudo</code>; dòng viết bằng <code>logger -t sudo</code> là <code>/usr/bin/logger</code> với UID của người dùng (bài 6.5). Giới hạn: unified log của máy này phủ 12 ngày — đủ cho "tuần này", không đủ cho một tháng.</li>
<li><strong>Chữ "crash".</strong> Bốn nguồn kể cùng một câu chuyện:
<ul>
<li><code>last</code>: <code>reboot time … 19:16</code> mà không có <code>shutdown time</code>; một phiên <code>root console</code> 19:06 – crash.</li>
<li>pmset: <code>SoftwareUpdate.BeforePostlogout</code> lúc 19:03–19:04 và trình báo cập nhật kết thúc lúc 19:06 — người dùng đã chọn "Restart / Update now" và bị đăng xuất.</li>
<li>install.log: Command Line Tools 27.2 cài xong 19:09:32; lúc 19:10:22 <code>SUOSUPostLogoutInstallOperation: Rebooting (success = 1 …)</code>, <code>Calling reboot3</code>.</li>
<li>Unified log: <code>suhelperd</code> "Rebooting" + <code>reboot3</code> lúc 19:10:22, một sự kiện đồng bộ giờ lúc 19:10:26, rồi <strong>im lặng tới 19:16</strong> (số sự kiện mỗi phút: 3.023 trong phút 19:10, không có gì 19:11–19:15, 4.206 trong phút 19:16) — bản cập nhật đang được áp trong lúc macOS không chạy. Tên bản cập nhật có trong install.log đúng giây đó: <code>MSU_UPDATE_26B131_patch_27.2.1</code> — và <code>sw_vers</code> giờ báo 27.2.1.</li>
</ul>
Kết luận: <strong>một lần cập nhật macOS và khởi động lại do người dùng bắt đầu</strong>, không phải sập máy, không có dấu hiệu xâm nhập. Chữ "crash" xuất hiện vì phiên cài đặt sau khi đăng xuất (lần đăng nhập <code>root console</code> — cách hiểu của chúng tôi cho bản ghi 19:06) chưa kịp ghi đăng xuất thì máy đã khởi động lại.</li>
<li><strong>Bẫy.</strong> Output số sự kiện mỗi phút chạy tiếp sang 19:17 và 19:18 dù <code>--end</code> là 19:16:30 — trên bản macOS này <code>--end</code> bị bỏ qua với khung vắt qua một lần khởi động lại. Lệnh <code>awk … exit</code> của ta đã chặn lại; không có nó, lệnh in hàng triệu dòng tới tận "bây giờ".</li>
</ol>
</details>

<h3>Mẫu báo cáo (5 dòng)</h3>
<pre><code class="language-text">Tiêu đề: MacBook macbook-lab — nguồn điện, sudo và lần khởi động lại 24/11 (rà log, chỉ đọc)
1. Ngủ/thức 18–25/11: phần lớn là DarkWake bảo trì; lần thức cuối do người 23/11 10:32 (pmset), khớp lần mở khoá 10:32:55 (loginwindow).
2. sudo: 0 lần trong 7 ngày (unified log, process == "sudo"; kho phủ 13–25/11).
3. 24/11 19:10:22 khởi động lại do cập nhật macOS lên 27.2.1 (26B131) (install.log "Rebooting… reboot3", suhelperd; log trống 19:10–19:16).
4. "crash" trong last = phiên cập nhật không có bản ghi đăng xuất; không có dấu hiệu xâm nhập.
5. Đính kèm bằng chứng: lệnh + dòng trích dẫn; không có dữ liệu cá nhân.</code></pre>

<h3>Phỏng vấn viên sẽ hỏi</h3>
<details><summary>"Log trên macOS nằm ở đâu, đọc bằng gì?"</summary><p>Phần lớn ở unified log: tệp nhị phân trong <code>/var/db/diagnostics</code>, chuỗi định dạng trong <code>/var/db/uuidtext</code>, đọc bằng <code>log show</code>/<code>log stream</code> hoặc Console. Còn vài log chữ trong <code>/var/log</code> (install.log là cái có ích) và <code>~/Library/Logs</code>; báo cáo crash là JSON <code>.ips</code> trong <code>DiagnosticReports</code>; lịch sử nguồn điện qua <code>pmset -g log</code>; đăng nhập qua <code>last</code>.</p></details>
<details><summary>"Vì sao log Mac hiện &lt;private&gt;, và bạn xử lý thế nào?"</summary><p>Giá trị động bị che mặc định để bảo vệ dữ liệu người dùng. Với ứng dụng của mình, đánh dấu <code>.public</code> các trường không nhạy cảm và tuyệt đối không ghi bí mật; với ứng dụng của người khác, tái hiện trong môi trường mình kiểm soát hoặc hỏi nhà cung cấp. Bật dữ liệu riêng tư cho cả máy cần hồ sơ cấu hình — không làm tuỳ tiện trên máy công ty.</p></details>
<details><summary>"Một ứng dụng chỉ văng trên máy Mac của tester. Bạn điều tra thế nào?"</summary><p>Lấy tệp <code>.ips</code>, so bản dựng hệ điều hành, đọc <code>exception</code>/<code>termination</code> và khung đầu tiên của luồng gây lỗi trong tệp chạy của mình (dịch ký hiệu bằng dSYM nếu cần), rồi đọc unified log đúng giây đó với <code>process == "app"</code> để thấy đầu vào. Nếu <code>termination.namespace</code> là CODESIGNING thì là chuyện ký/notarize, không phải mã.</p></details>
<details><summary>"Bạn kiểm một máy Mac có bị cài bám trụ không thế nào?"</summary><p>Plist mới hoặc lạ trong <code>~/Library/LaunchAgents</code>, <code>/Library/LaunchAgents</code>, <code>/Library/LaunchDaemons</code>; Login Items trong System Settings; sự kiện Background Task Management (và <code>sfltool dumpbtm</code> khi có quyền quản trị); <code>launchctl print</code> các label lạ; tìm shell hay script trong <code>ProgramArguments</code> chạy từ đường dẫn người dùng ghi được — đúng mẫu Silver Sparrow.</p></details>
<details><summary>"So sánh unified log của macOS với journald và Windows Event Log."</summary><p>Cả ba đều nhị phân, có cấu trúc và truy vấn bằng công cụ riêng. macOS lọc bằng NSPredicate trên process/subsystem/category/type, giữ dữ liệu theo ngân sách dung lượng và TTL từng thông điệp, không bao giờ lưu debug, và che giá trị động. journald lọc theo trường như _SYSTEMD_UNIT, PRIORITY với giới hạn dung lượng/thời gian. Windows dùng kênh, Provider + Event ID, và FilterHashtable/XPath.</p></details>

<div class="callout ok"><p><strong>Đạt khi:</strong> câu trả lời câu 4 dẫn ít nhất ba nguồn có giờ khớp nhau trong vòng một phút; câu 3 nêu khoảng thời gian mà unified log thật sự phủ; câu 5 cho thấy bạn đã nhận ra (và chặn) output dài quá mức; báo cáo không lộ dữ liệu cá nhân nào.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['pmset -g log', 'Lịch sử quản lý nguồn điện (Sleep, Wake, DarkWake, assertion) trong /var/log/powermanagement.'],
  ['DarkWake', 'Thức mà không bật màn hình, để bảo trì/mạng — không phải người.'],
  ['screenIsLocked / screenIsUnlocked', 'Thông báo của loginwindow đánh dấu có người trước máy.'],
  ['đối chứng', 'Nhiều nguồn độc lập cùng khớp trước khi kết luận.'],
])}
</div>
`,
};
