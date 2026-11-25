/**
 * 7.6 — Lab 7: vì sao dịch vụ khởi động lại lúc 03:12? (soạn 24/11/2026, agent lgz).
 * Chạy thật trên máy ảo lab7: timer shop-report 03:12 gọi /report, app giữ 10 MiB mỗi 0,2 s, chạm MemoryMax=150M, bị OOM trong cgroup,
 * systemd tự khởi động lại sau 2 s. "Đêm" tạo bằng cách tắt NTP và đặt giờ máy ảo 03:11:40 ngày 25/11 (OUT['s07/lab7-dong-ho']).
 * Đáp án: CODE/OUT['s07/lab7']. Unit + app: CODE['s07/vm/*'].
 */
import { ma, ra, lenh, kv } from '../_chung.mjs';

export default {
  title: '7.6 — Lab 7 — Why did the service restart at 03:12? (an OOM kill reproduced in a VM)|||7.6 — Lab 7 — Vì sao dịch vụ khởi động lại lúc 03:12? (tái hiện OOM kill trong máy ảo)',
  slug: 'log-7-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab có chấm trên máy ảo của bạn: shop-api chạy dưới systemd với MemoryMax=150M, một timer báo cáo đêm lúc 03:12 làm app phình bộ nhớ; sáng ra chỉ có tin "nó tự restart lúc 03:12". Chỉ dùng journalctl -u, -k, -b, --list-boots, -o json + jq để trả lời: máy hay chỉ dịch vụ khởi động lại, ai giết, vì sao, cái gì kích hoạt, ảnh hưởng ra sao, đêm nay có lặp lại không — rồi viết báo cáo 5 dòng. Kèm bật lưu bền + giới hạn dung lượng, câu hỏi phỏng vấn và mốc dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab 7</span>
<h2>Lab 7 — "It restarted by itself at 03:12": find out why, with the journal only</h2>
<p class="lead">08:30, first message of the day from your lead: "shop-api on lab7 restarted at 03:12 last night, monitoring caught it. Was it the server? Is it going to happen again? Write it up." No one changed anything. You have SSH and the journal. This lab uses everything in Chapter 7.</p>

<h3>Setup (20 min)</h3>
<ol>
<li>Use the VM and the shop units from lesson 7.1 (<code>cai.sh</code> installs everything, including the nightly timer below).</li>
<li>Make sure the journal is persistent and capped — lesson 7.4: <code>/var/log/journal</code> exists, and a drop-in with <code>SystemMaxUse=</code> you chose. Check with journald's start line.</li>
<li>"Fast-forward to the night" — only on a lab VM: <code>sudo timedatectl set-ntp false</code>, then <code>sudo timedatectl set-time 'YYYY-MM-DD 03:11:40'</code> with tomorrow's date. Wait two minutes. Afterwards <code>sudo timedatectl set-ntp true</code>.</li>
</ol>
<details><summary>The timer and the report unit (read only after you finish)</summary>
${ma('ini', 's07/vm/shop-report.timer')}
${ma('ini', 's07/vm/shop-report.service')}
</details>
<p>Changing the clock is itself logged — a real investigator would see it:</p>
${lenh('s07/lab7-dong-ho', 0)}
<div class="callout warn"><p><strong>Rules.</strong> Do not read <code>api.py</code> or the timer until you have answered. Read only — no restarts, no edits — the way you would treat a production server during an investigation. Every answer needs a command and a quoted log line.</p></div>

<h3>The questions</h3>
<ol>
<li><strong>What restarted?</strong> The machine, or only the service? At what second did the new process start, and with which PID?</li>
<li><strong>Who killed it, and why?</strong> Name the component that ended the old process, the limit involved, and how much memory the process really used.</li>
<li><strong>What triggered it?</strong> What started at 03:12:00, and how fast did memory grow?</li>
<li><strong>Impact:</strong> how long was the API down, and what else failed because of it?</li>
<li><strong>Will it happen again?</strong> When?</li>
<li><strong>Bonus:</strong> a teammate ran <code>journalctl -u shop-api -p err</code> and "saw nothing important". Why?</li>
</ol>

<h3>Hints (open one at a time)</h3>
<details><summary>Hint for 1</summary><p><code>--list-boots</code> (lesson 7.2), <code>systemctl status</code>, <code>systemctl show -p NRestarts</code>.</p></details>
<details><summary>Hint for 2</summary><p>The kernel, not the app: <code>journalctl -k --since … -g 'Killed process'</code> (lesson 7.5); the unit's <code>MemoryMax</code> from <code>systemctl show</code>.</p></details>
<details><summary>Hint for 3</summary><p><code>journalctl -p warning --since 03:11 --until 03:13</code> shows every unhappy unit; <code>systemctl list-timers</code>; debug lines of the app have timestamps — <code>__MONOTONIC_TIMESTAMP</code> in JSON is precise.</p></details>
<details><summary>Hint for 4</summary><p>Count lines per <code>_PID</code>/<code>_SYSTEMD_INVOCATION_ID</code> around 03:12 (lesson 7.3), and look at the other unit that failed.</p></details>

<h3>Answer key (run for real — open after you finish)</h3>
<details><summary>Show the commands and output</summary>
${ma('bash', 's07/lab7.bash')}
${ra('s07/lab7')}
</details>

<h3>Reading the answers</h3>
<details><summary>Show the explanation</summary>
<ul>
<li><strong>1 — only the service.</strong> One boot (boot 0, running since 24/11 04:13), so the machine did not restart. <code>NRestarts=1</code>; new main PID 18996 started at <strong>03:12:05</strong> (<code>Started shop-api.service</code>, then <code>shop-api 1.4.2 starting, pid=18996</code>).</li>
<li><strong>2 — the kernel's OOM killer, inside the unit's cgroup.</strong> <code>03:12:03.274614 kernel: Memory cgroup out of memory: Killed process 424 (python3) … anon-rss:152960kB</code> = 149.4 MiB, against <code>MemoryMax=157286400</code> = 150 MiB. <code>constraint=CONSTRAINT_MEMCG … oom_memcg=/system.slice/shop-api.service</code>: the unit's own limit, not the machine's RAM. systemd confirms: <code>killed by the OOM killer</code>, <code>status=9/KILL</code>, <code>Failed with result 'oom-kill'</code>, <code>Scheduled restart job, restart counter is at 1</code> after <code>RestartSec=2</code>. The OOM report header says <code>python3 … Not tainted</code> — nothing unusual loaded in the kernel.</li>
<li><strong>3 — the nightly report.</strong> <code>shop-report.timer</code> fired at 03:12:00 and started <code>shop-report.service</code>; the app logged <code>nightly report started</code> and then <code>report: loaded 10 … 130 MiB of orders</code> (debug level). Monotonic timestamps: +30 MiB every ~0.61 s ≈ 49 MiB/s, from 757.44 s to 759.89 s after boot; two more 10 MiB steps after the last debug line (130 MiB) reach the 150 MiB limit. The report keeps everything in memory — a bug, not a capacity problem.</li>
<li><strong>4 — impact.</strong> No process listening from 03:12:03 to 03:12:05 (~2 s): requests in that window failed (behind nginx they would be 502 with <code>connect() failed (111)</code> — lesson 10.4). The report itself failed: <code>curl</code> exit status 52 (empty reply from server), <code>Failed to start shop-report.service</code>. So the business impact is "no nightly report", plus a 2-second blip. The JSON count shows the boundary: 28 lines from PID 424 (invocation 6f09…), 5 lines from PID 1 (systemd about the unit), 15 from PID 18996 (new invocation 5951…).</li>
<li><strong>5 — yes, every night.</strong> <code>list-timers</code>: next run Thu 26/11 03:12:00. Until the report is fixed, it will OOM again.</li>
<li><strong>Bonus.</strong> <code>-u shop-api -p err</code> keeps only priority 0–3. The kernel's OOM report is at warning level and lives under <code>-k</code>, not <code>-u</code>; systemd's <code>Failed with result 'oom-kill'</code> is not an error-level line; and the app's own debug lines are priority 7. The only err line in that window belongs to <code>shop-report</code>. Filtering too early by priority hid the whole story — use <code>-p warning</code> across all units for the time window first.</li>
</ul>
</details>

<h3>Write the report (five lines)</h3>
<pre><code class="language-text">[Incident 25/11 03:12 ICT] shop-api was killed and auto-restarted once; server did not reboot. Down ~2 s (03:12:03–03:12:05).
Cause: nightly report (shop-report.timer 03:12) loads all orders into memory (+49 MiB/s) and hit the unit limit MemoryMax=150M -&gt; kernel OOM kill (cgroup).
Evidence: kernel 03:12:03.274 "Memory cgroup out of memory: Killed process 424 (python3) anon-rss:152960kB"; systemd "Failed with result 'oom-kill'", restart counter 1.
Impact: nightly report not produced (shop-report exit 52); requests in the 2 s window failed. Will repeat every night at 03:12 (next: 26/11).
Actions: stream/paginate the report query (owner: backend); short term run the report as its own unit with its own limit; alert on "oom-kill" (Chapter 15). Raising MemoryMax alone is NOT a fix.</code></pre>
<p>Notice what the report does not say: "it restarted by itself so it is fine". The automatic restart hid the symptom; the cause will come back tonight.</p>

<h3>🎤 Interviewers will ask</h3>
<details><summary>"A Linux service restarted overnight. Walk me through how you find out why."</summary><p>Check whether the machine rebooted (<code>journalctl --list-boots</code>, last lines of <code>-b -1</code>); read the unit's result (<code>systemctl status</code>: exit-code, signal, oom-kill, start-limit-hit); read <code>journalctl -u X</code> around that time; then <code>-k</code> for OOM, segfault or I/O errors; then what else ran at that time (timers, cron, deploys). Conclude with one quoted line per claim.</p></details>
<details><summary>"What is the difference between dmesg and journalctl -k?"</summary><p>dmesg reads the kernel's ring buffer in RAM: root-only by default, timestamps since boot, lost at reboot and overwritten when full. <code>journalctl -k</code> reads the copy journald stored: wall-clock times, previous boots, the usual filters — but subject to journal size limits and vacuum.</p></details>
<details><summary>"Exit code 137 versus 139?"</summary><p>Both are 128 + a signal. 137 = SIGKILL (9): killed from outside, typically the OOM killer or <code>kill -9</code>, or Docker/Kubernetes enforcing a memory limit. 139 = SIGSEGV (11): the program crashed itself on an invalid memory access.</p></details>
<details><summary>"After a reboot, the logs from before are gone. Why, and how do you prevent it?"</summary><p>journald was in volatile mode — <code>Storage=volatile</code>, or <code>auto</code> without <code>/var/log/journal</code> — so the journal lived in <code>/run</code>. Create the folder or set <code>Storage=persistent</code>, set a size limit, and ship logs off the machine because a dead disk takes local logs with it. Also: a power cut can lose the last minutes (<code>SyncIntervalSec</code>).</p></details>
<details><summary>"How would you know if someone edited the logs on a server?"</summary><p><code>journalctl --verify</code> detects corruption but not a careful edit by root. Forward Secure Sealing with the verification key kept off the machine detects modification of sealed periods. Deletion leaves traces (vacuum lines, sudo commands, missing boots) — and the real protection is a copy on another system the attacker cannot reach.</p></details>

<h3>🛠 Project milestone</h3>
<p>Run your own project's backend (Node or Spring) as a systemd unit on your VM: <code>MemoryMax=</code> set, output to the journal with correct priorities (a <code>&lt;3&gt;</code> prefix or JSON read with <code>-o cat | jq</code>), persistent journal with a size cap. Write in your project README the three commands you would use at 08:30 the morning after an incident.</p>

<h3>Done when</h3>
<div class="callout ok"><ol>
<li>All five questions answered, each with a command and a quoted line.</li>
<li>The restart time is exact to the second and the killed PID and new PID are named.</li>
<li>Memory used vs limit is stated in MiB, and you say whether the limit was the unit's or the machine's.</li>
<li>A five-line report with a real fix (not "raise the limit"), and NTP turned back on.</li>
</ol></div>

<h3>🗂 Key terms</h3>
${kv([
  ['NRestarts', 'How many times systemd has automatically restarted the unit (systemctl show -p NRestarts).'],
  ['oom-kill (result)', 'systemd’s result when a unit’s process was killed by the OOM killer.'],
  ['MemoryMax=', 'Hard memory ceiling of a unit’s cgroup; exceeding it triggers a cgroup OOM kill.'],
  ['OnCalendar=', 'Timer schedule in calendar form (*-*-* 03:12:00 = every day at 03:12).'],
  ['curl exit 52', 'Empty reply from server: the connection closed without an HTTP response.'],
])}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab 7</span>
<h2>Lab 7 — "Nó tự khởi động lại lúc 03:12": tìm ra vì sao, chỉ bằng journal</h2>
<p class="lead">8 giờ 30, tin nhắn đầu ngày của trưởng nhóm: "shop-api trên lab7 khởi động lại lúc 03:12 đêm qua, giám sát bắt được. Có phải tại máy chủ không? Có lặp lại không? Viết báo cáo nhé." Không ai đổi gì cả. Bạn có SSH và journal. Lab này dùng mọi thứ trong Chương 7.</p>

<h3>Chuẩn bị (20 phút)</h3>
<ol>
<li>Dùng máy ảo và các unit shop từ bài 7.1 (<code>cai.sh</code> cài tất cả, kể cả timer đêm bên dưới).</li>
<li>Bảo đảm journal lưu bền và có trần — bài 7.4: có <code>/var/log/journal</code>, và một drop-in với <code>SystemMaxUse=</code> do bạn chọn. Kiểm bằng dòng khởi động của journald.</li>
<li>"Tua tới đêm" — chỉ trên máy ảo lab: <code>sudo timedatectl set-ntp false</code>, rồi <code>sudo timedatectl set-time 'YYYY-MM-DD 03:11:40'</code> với ngày mai. Chờ hai phút. Xong thì <code>sudo timedatectl set-ntp true</code>.</li>
</ol>
<details><summary>Timer và unit báo cáo (chỉ đọc sau khi làm xong)</summary>
${ma('ini', 's07/vm/shop-report.timer')}
${ma('ini', 's07/vm/shop-report.service')}
</details>
<p>Chính việc đổi giờ cũng được ghi lại — người điều tra thật sẽ thấy:</p>
${lenh('s07/lab7-dong-ho', 0)}
<div class="callout warn"><p><strong>Luật.</strong> Đừng đọc <code>api.py</code> hay timer cho tới khi đã trả lời. Chỉ đọc — không khởi động lại, không sửa — như cách bạn đối xử với máy chủ production trong lúc điều tra. Mỗi câu trả lời cần một lệnh và một dòng log trích dẫn.</p></div>

<h3>Các câu hỏi</h3>
<ol>
<li><strong>Cái gì đã khởi động lại?</strong> Cả máy, hay chỉ dịch vụ? Tiến trình mới bắt đầu ở giây nào, PID bao nhiêu?</li>
<li><strong>Ai đã giết nó, và vì sao?</strong> Nêu thành phần đã kết liễu tiến trình cũ, giới hạn liên quan, và tiến trình thực sự đã dùng bao nhiêu bộ nhớ.</li>
<li><strong>Cái gì kích hoạt?</strong> Thứ gì bắt đầu lúc 03:12:00, và bộ nhớ tăng nhanh cỡ nào?</li>
<li><strong>Ảnh hưởng:</strong> API ngừng bao lâu, và còn gì khác hỏng theo?</li>
<li><strong>Có lặp lại không?</strong> Khi nào?</li>
<li><strong>Thêm:</strong> một đồng nghiệp chạy <code>journalctl -u shop-api -p err</code> và "không thấy gì quan trọng". Vì sao?</li>
</ol>

<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý cho câu 1</summary><p><code>--list-boots</code> (bài 7.2), <code>systemctl status</code>, <code>systemctl show -p NRestarts</code>.</p></details>
<details><summary>Gợi ý cho câu 2</summary><p>Nhân, không phải app: <code>journalctl -k --since … -g 'Killed process'</code> (bài 7.5); <code>MemoryMax</code> của unit lấy từ <code>systemctl show</code>.</p></details>
<details><summary>Gợi ý cho câu 3</summary><p><code>journalctl -p warning --since 03:11 --until 03:13</code> cho thấy mọi unit không ổn; <code>systemctl list-timers</code>; các dòng debug của app có mốc giờ — <code>__MONOTONIC_TIMESTAMP</code> trong JSON rất chính xác.</p></details>
<details><summary>Gợi ý cho câu 4</summary><p>Đếm số dòng theo <code>_PID</code>/<code>_SYSTEMD_INVOCATION_ID</code> quanh 03:12 (bài 7.3), và nhìn unit còn lại đã hỏng.</p></details>

<h3>Đáp án (chạy thật — mở sau khi làm xong)</h3>
<details><summary>Hiện lệnh và output</summary>
${ma('bash', 's07/lab7.bash')}
${ra('s07/lab7')}
</details>

<h3>Đọc đáp án</h3>
<details><summary>Hiện phần giải thích</summary>
<ul>
<li><strong>1 — chỉ dịch vụ.</strong> Một lần khởi động (lần 0, chạy từ 04:13 ngày 24/11), nên máy không khởi động lại. <code>NRestarts=1</code>; PID chính mới 18996 bắt đầu lúc <strong>03:12:05</strong> (<code>Started shop-api.service</code>, rồi <code>shop-api 1.4.2 starting, pid=18996</code>).</li>
<li><strong>2 — OOM killer của nhân, bên trong cgroup của unit.</strong> <code>03:12:03.274614 kernel: Memory cgroup out of memory: Killed process 424 (python3) … anon-rss:152960kB</code> = 149,4 MiB, so với <code>MemoryMax=157286400</code> = 150 MiB. <code>constraint=CONSTRAINT_MEMCG … oom_memcg=/system.slice/shop-api.service</code>: giới hạn của chính unit, không phải RAM của máy. systemd xác nhận: <code>killed by the OOM killer</code>, <code>status=9/KILL</code>, <code>Failed with result 'oom-kill'</code>, <code>Scheduled restart job, restart counter is at 1</code> sau <code>RestartSec=2</code>. Đầu báo cáo OOM ghi <code>python3 … Not tainted</code> — nhân không nạp gì bất thường.</li>
<li><strong>3 — báo cáo đêm.</strong> <code>shop-report.timer</code> kích lúc 03:12:00 và chạy <code>shop-report.service</code>; app ghi <code>nightly report started</code> rồi <code>report: loaded 10 … 130 MiB of orders</code> (mức debug). Mốc monotonic: +30 MiB mỗi ~0,61 giây ≈ 49 MiB/giây, từ giây 757,44 tới 759,89 sau khi khởi động; thêm hai bước 10 MiB sau dòng debug cuối (130 MiB) là chạm giới hạn 150 MiB. Báo cáo giữ mọi thứ trong bộ nhớ — một lỗi lập trình, không phải thiếu tài nguyên.</li>
<li><strong>4 — ảnh hưởng.</strong> Không có tiến trình nào lắng nghe từ 03:12:03 tới 03:12:05 (~2 giây): request trong khoảng đó thất bại (sau nginx sẽ là 502 với <code>connect() failed (111)</code> — bài 10.4). Chính báo cáo cũng hỏng: <code>curl</code> thoát với mã 52 (máy chủ trả lời rỗng), <code>Failed to start shop-report.service</code>. Vậy ảnh hưởng nghiệp vụ là "không có báo cáo đêm", cộng một lần chập chờn 2 giây. Phép đếm JSON cho thấy ranh giới: 28 dòng từ PID 424 (lần chạy 6f09…), 5 dòng từ PID 1 (systemd nói về unit), 15 dòng từ PID 18996 (lần chạy mới 5951…).</li>
<li><strong>5 — có, đêm nào cũng vậy.</strong> <code>list-timers</code>: lần chạy tới là thứ Năm 26/11 03:12:00. Chưa sửa báo cáo thì nó còn OOM.</li>
<li><strong>Thêm.</strong> <code>-u shop-api -p err</code> chỉ giữ mức 0–3. Báo cáo OOM của nhân ở mức warning và nằm dưới <code>-k</code>, không phải <code>-u</code>; dòng <code>Failed with result 'oom-kill'</code> của systemd không phải mức err; còn dòng debug của app là mức 7. Dòng err duy nhất trong khoảng đó thuộc về <code>shop-report</code>. Lọc theo mức quá sớm đã giấu cả câu chuyện — hãy dùng <code>-p warning</code> trên mọi unit trong khung giờ trước.</li>
</ul>
</details>

<h3>Viết báo cáo (năm dòng)</h3>
<pre><code class="language-text">[Sự cố 25/11 03:12 ICT] shop-api bị giết và tự khởi động lại một lần; máy chủ KHÔNG khởi động lại. Ngừng ~2 giây (03:12:03–03:12:05).
Nguyên nhân: báo cáo đêm (shop-report.timer 03:12) nạp toàn bộ đơn hàng vào bộ nhớ (+49 MiB/giây), chạm giới hạn unit MemoryMax=150M -&gt; nhân OOM kill (cgroup).
Bằng chứng: kernel 03:12:03.274 "Memory cgroup out of memory: Killed process 424 (python3) anon-rss:152960kB"; systemd "Failed with result 'oom-kill'", restart counter 1.
Ảnh hưởng: không có báo cáo đêm (shop-report thoát mã 52); request trong 2 giây đó thất bại. Sẽ lặp lại mỗi đêm lúc 03:12 (lần tới: 26/11).
Việc cần làm: đọc báo cáo theo từng trang/luồng (người phụ trách: backend); trước mắt chạy báo cáo thành unit riêng có giới hạn riêng; cảnh báo khi có "oom-kill" (Chương 15). Chỉ tăng MemoryMax thì KHÔNG phải cách sửa.</code></pre>
<p>Để ý điều báo cáo không nói: "nó tự khởi động lại rồi nên ổn". Việc tự khởi động lại đã che triệu chứng; nguyên nhân sẽ quay lại đêm nay.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<details><summary>"Một dịch vụ Linux khởi động lại trong đêm. Hãy kể bạn tìm nguyên nhân thế nào."</summary><p>Xem cả máy có khởi động lại không (<code>journalctl --list-boots</code>, các dòng cuối của <code>-b -1</code>); đọc kết quả của unit (<code>systemctl status</code>: exit-code, signal, oom-kill, start-limit-hit); đọc <code>journalctl -u X</code> quanh lúc đó; rồi <code>-k</code> để tìm OOM, segfault hay lỗi I/O; rồi xem lúc đó còn gì khác chạy (timer, cron, deploy). Kết luận với mỗi khẳng định một dòng trích dẫn.</p></details>
<details><summary>"dmesg và journalctl -k khác nhau thế nào?"</summary><p>dmesg đọc vòng đệm của nhân trong RAM: mặc định chỉ root, mốc giờ tính từ lúc khởi động, mất khi khởi động lại và bị ghi đè khi đầy. <code>journalctl -k</code> đọc bản journald đã lưu: giờ đồng hồ thật, cả các lần khởi động trước, đủ bộ lọc — nhưng chịu giới hạn dung lượng journal và vacuum.</p></details>
<details><summary>"Mã thoát 137 và 139 khác nhau ra sao?"</summary><p>Cả hai đều là 128 + một tín hiệu. 137 = SIGKILL (9): bị giết từ bên ngoài, thường là OOM killer hay <code>kill -9</code>, hoặc Docker/Kubernetes thực thi giới hạn bộ nhớ. 139 = SIGSEGV (11): chương trình tự sập vì truy cập bộ nhớ không hợp lệ.</p></details>
<details><summary>"Khởi động lại xong, log trước đó mất sạch. Vì sao, và phòng thế nào?"</summary><p>journald đang ở chế độ volatile — <code>Storage=volatile</code>, hoặc <code>auto</code> mà không có <code>/var/log/journal</code> — nên journal nằm trong <code>/run</code>. Tạo thư mục hoặc đặt <code>Storage=persistent</code>, đặt trần dung lượng, và gửi log ra ngoài máy vì đĩa chết thì log tại chỗ chết theo. Thêm nữa: mất điện có thể mất vài phút cuối (<code>SyncIntervalSec</code>).</p></details>
<details><summary>"Làm sao biết có ai đã sửa log trên máy chủ?"</summary><p><code>journalctl --verify</code> phát hiện hỏng hóc nhưng không phát hiện một lần sửa cẩn thận của root. Forward Secure Sealing với khoá kiểm cất ngoài máy phát hiện được việc sửa các giai đoạn đã niêm phong. Việc xoá để lại dấu vết (dòng vacuum, lệnh sudo, lần khởi động biến mất) — và bảo vệ thật sự là một bản sao trên hệ thống khác mà kẻ tấn công không với tới.</p></details>

<h3>🛠 Mốc dự án</h3>
<p>Chạy backend dự án của chính bạn (Node hoặc Spring) thành một unit systemd trên máy ảo: đặt <code>MemoryMax=</code>, output vào journal với mức đúng (tiền tố <code>&lt;3&gt;</code> hoặc JSON đọc bằng <code>-o cat | jq</code>), journal lưu bền có trần dung lượng. Ghi vào README dự án ba lệnh bạn sẽ dùng lúc 8 giờ 30 sáng hôm sau một sự cố.</p>

<h3>Đạt khi</h3>
<div class="callout ok"><ol>
<li>Trả lời đủ năm câu, mỗi câu có một lệnh và một dòng trích dẫn.</li>
<li>Mốc khởi động lại chính xác tới giây, nêu được PID bị giết và PID mới.</li>
<li>Nêu bộ nhớ đã dùng so với giới hạn theo MiB, và nói rõ đó là giới hạn của unit hay của máy.</li>
<li>Báo cáo năm dòng có cách sửa thật (không phải "tăng giới hạn"), và đã bật lại NTP.</li>
</ol></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['NRestarts', 'Số lần systemd đã tự khởi động lại unit (systemctl show -p NRestarts).'],
  ['oom-kill (kết quả)', 'Kết quả systemd ghi khi tiến trình của unit bị OOM killer giết.'],
  ['MemoryMax=', 'Trần bộ nhớ cứng của cgroup một unit; vượt là bị OOM kill trong cgroup.'],
  ['OnCalendar=', 'Lịch của timer dạng lịch (*-*-* 03:12:00 = mỗi ngày lúc 03:12).'],
  ['curl mã 52', 'Máy chủ trả lời rỗng: kết nối bị đóng mà không có phản hồi HTTP.'],
])}
</div>
`,
};
