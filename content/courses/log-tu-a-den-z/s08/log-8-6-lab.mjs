/**
 * 8.6 — Lab 8: một đêm bị dò SSH (soạn 24/11/2026, agent lgz).
 * Dựng thật: OUT['s08/lab8-tan-cong'] — máy keodo (192.168.56.66/.77/.88/.20) tấn công lab7 (192.168.56.10) trong mạng lab nội bộ;
 * đồng hồ lab7 được tua (22:41 → 07:58 hôm sau) rồi bật NTP lại. Đáp án: OUT['s08/lab8'] (chỉ đọc log) + OUT['s08/lab8-ngan'] (ngăn chặn).
 * Output lệnh "ls -la /home/test/.ssh" trong lab8 là của lượt chạy đầu, trước bước ngăn chặn chuyển tệp đi (ghi chú trong lab8.bash).
 * Mẫu sự cố thật cùng dạng: FritzFrog (Guardicore Labs 2020, Threatpost) — dò SSH rồi cài khoá vào authorized_keys.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Lab 8 — Someone tried to SSH into my VM all night: who, how many, and did anyone get in?|||Lab 8 — Có kẻ thử SSH vào máy ảo của tôi cả đêm: ai, bao nhiêu lần, và có ai vào được không?',
  slug: 'log-8-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Máy ảo thứ hai đóng vai kẻ dò trong mạng lab nội bộ: hydra 136 lần lúc 23h, rải một mật khẩu qua 25 tên lúc 1h, rồi đoán chậm 7 giây một lần vào tài khoản "test" mà một đồng nghiệp tạo lúc 22:41 — trúng ở lần 12, cài khoá cửa sau vào authorized_keys. Chỉ bằng auth.log, wtmp/btmp, auditd và journal: đếm theo IP, tên, khung giờ; bắt "vào được sau chuỗi thất bại"; khớp dấu vân tay khoá; liệt kê việc kẻ đột nhập đã làm và không làm được. Đáp án chạy thật (che), báo cáo 5 dòng, 5 câu phỏng vấn viên sẽ hỏi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8</span>
<h2>Lab 8 — A night of SSH guessing: who, how many, and did anyone get in?</h2>
<p class="lead">08:00. The lab7 VM has password login enabled (lessons 8.1–8.3) and you left it on overnight. Your lead: "Monitoring shows a lot of SSH traffic to lab7 last night. Did anyone get in? If yes: who, how, what did they do, and is it closed now? One page." You have auth.log, wtmp/btmp, the auditd rules from 8.4 and the journal.</p>

<h3>Setup (30 min) — only on your own lab machines</h3>
<ol>
<li><strong>Two VMs on a private network</strong> (VirtualBox host-only / Hyper-V internal / UTM shared): <code>lab7</code> = 192.168.56.10, attacker VM <code>keodo</code> with several addresses so you can tell "people" apart: <code>sudo ip addr add 192.168.56.66/24 dev &lt;nic&gt;</code> (and .77, .88; .20 = the admin's usual machine). Never point these tools at a machine that is not yours.</li>
<li>On lab7: password login on (lesson 8.1 setup), users <code>an</code> (sudo) and <code>dev</code> from 8.3, rsyslog writing auth.log, the auditd rules of 8.4 loaded.</li>
<li>On keodo: <code>sudo apt install hydra sshpass</code> and the four word lists below.</li>
<li>Run the night script from keodo + lab7 (it moves lab7's clock — lab VM only — and turns NTP back on at the end).</li>
</ol>
<details><summary>The word lists and the night script (do not read until you have finished)</summary>
${ma('text', 's08/lab8/users.txt')}
${ma('text', 's08/lab8/spray.txt')}
${ma('text', 's08/lab8/test-pass.txt')}
${ma('bash', 's08/lab8-tan-cong.bash')}
${lenh('s08/lab8-tan-cong', 3)}
${lenh('s08/lab8-tan-cong', 7)}
</details>
<div class="callout warn"><p><strong>Rules.</strong> Answer only from logs on lab7 — not from the script or the attacker's screen. Read-only until question 6. Every claim needs a command and a quoted line. Beware of counting your own commands (8.3).</p></div>

<h3>The questions</h3>
<ol>
<li><strong>Volume:</strong> how many failed password attempts and invalid-user attempts happened between 22:40 and 08:30?</li>
<li><strong>Sources:</strong> which IPs, how many attempts each, at what time, and what kind of attack each looks like (many passwords for few names, one password for many names, slow guessing)?</li>
<li><strong>Did anyone get in?</strong> List every <code>Accepted</code> line and separate normal from suspicious. Which account, from where, at what second, by which method?</li>
<li><strong>Root cause:</strong> where did the account that was broken into come from? Who created it, when, and with what kind of password (judge from the logs)?</li>
<li><strong>What did the intruder do — and fail to do?</strong> Use auditd. Did they get root? Did they leave a way back in?</li>
<li><strong>Contain:</strong> close the door without destroying evidence, and show the log line that proves it.</li>
</ol>

<h3>Hints (open one at a time)</h3>
<details><summary>Hint for 1–2</summary><p>Copy the window to a file first (<code>awk '$1&gt;="2026-11-24T22:40" &amp;&amp; $1&lt;"2026-11-25T08:30"'</code>) and count on the copy. Group by IP and by hour (<code>substr($1,12,2)</code>). The list of names tried tells you the attack type.</p></details>
<details><summary>Hint for 3</summary><p>The awk "success after failures" program from 8.3. Then read the method: password vs publickey, and the fingerprint.</p></details>
<details><summary>Hint for 4</summary><p><code>useradd</code>, <code>chpasswd</code>, and the sudo line just before them. The account's comment field is in the sudo command.</p></details>
<details><summary>Hint for 5</summary><p><code>ausearch -ua test --format text</code>, filter out what sshd/systemd do as root. Then compare the publickey fingerprint with <code>ssh-keygen -lf</code> on the account's <code>authorized_keys</code>. Date format for <code>-ts</code> follows the locale.</p></details>

<h3>Answer key (run for real — open after you finish)</h3>
<details><summary>Show the commands and output (questions 1–5)</summary>
${ma('bash', 's08/lab8.bash')}
${lenh('s08/lab8', 0)}
${lenh('s08/lab8', 1)}
${lenh('s08/lab8', 2)}
${lenh('s08/lab8', 3)}
${lenh('s08/lab8', 4)}
${lenh('s08/lab8', 5)}
${lenh('s08/lab8', 6)}
${lenh('s08/lab8', 7)}
${lenh('s08/lab8', 8)}
${lenh('s08/lab8', 9)}
${lenh('s08/lab8', 10)}
${lenh('s08/lab8', 11)}
${lenh('s08/lab8', 12)}
${lenh('s08/lab8', 13)}
${lenh('s08/lab8', 14)}
${lenh('s08/lab8', 15)}
${lenh('s08/lab8', 16)}
</details>
<details><summary>Show question 6 (containment)</summary>
${lenh('s08/lab8-ngan', 0)}
${lenh('s08/lab8-ngan', 1)}
</details>

<h3>Reading the answers</h3>
<details><summary>Show the explanation</summary>
<ol>
<li><strong>172</strong> failed passwords, <strong>47</strong> invalid-user lines in 677 lines. Counted on a copy, so our own sudo commands are not inside. The journal agrees: <code>journalctl -u ssh … | grep -c 'Failed password'</code> = 172. <code>lastb</code> gives other numbers (160/70/11) because btmp records attempts differently from sshd's text lines — always name the source of a number.</li>
<li>Three sources, three patterns:
<ul>
<li><code>192.168.56.66</code> — 136 failures in under 4 minutes (23:05:02–23:08:46), 34 each for root, admin, ubuntu, user: a <strong>dictionary attack tool</strong> (many passwords, few names).</li>
<li><code>192.168.56.88</code> — 25 failures at 01h, each a different name (oracle, postgres, git, jenkins…), one try per name: <strong>password spraying</strong>.</li>
<li><code>192.168.56.77</code> — 11 failures for <code>test</code> only, one every ~7 seconds from 03:41:02: <strong>slow, targeted guessing</strong>, quiet enough to stay under many rate-based alerts.</li>
</ul></li>
<li><strong>Yes.</strong> <code>03:42:17 Accepted password for test from 192.168.56.77</code> right after 11 failures from the same IP (the red line), then <code>03:52:00 Accepted publickey for test … SHA256:Thc+lqQJ…</code>. Normal lines: <code>an</code> from .20 at 22:41 (admin's usual machine) and <code>hv</code> from .20 at 07:58; the 172.17.0.1 lines are the lab's own control channel.</li>
<li>At <code>22:41:00</code> <code>an</code> ran, through sudo, <code>useradd … -c "tai khoan thu cho dev" test</code> followed by <code>chpasswd</code>: a "temporary test account for dev" with a password that fell after 12 guesses. The real root cause is a weak password on a forgotten test account on a host with password login enabled — not "the hacker".</li>
<li>auditd, by login user <code>test</code>: <code>id</code>, <code>uname</code>, <code>grep</code> (counting users with bash), <code>ls</code> (/home), <code>cat</code> → <strong>unsuccessfully opened-file /etc/shadow</strong>, <code>sudo</code> → <strong>unsuccessfully ran-command list</strong> (auth.log: <code>test : command not allowed</code>), then <code>mkdir</code>, <code>tee</code>, <code>chmod</code> — writing <code>~/.ssh/authorized_keys</code>. The key in that file has comment <code>x@kali</code> and fingerprint <code>SHA256:Thc+lqQJ…</code> — <strong>the same</strong> as the 03:52 publickey login: a back door, exactly FritzFrog's technique. No root: shadow and sudo were denied. The second session ran <code>w</code> and <code>head</code>; anything typed that was "command not found" leaves no audit trace — logs show what happened, not what was intended. Note the trap: <code>-ts 11/24/2026</code> fails, the C locale wants <code>11/24/26</code>.</li>
<li>Lock and expire the account (<code>usermod -L -e 1</code>), kill its processes, <strong>move</strong> (not delete) the planted key to a root-only evidence folder. The log shows <code>lock user 'test' password</code>. Then: disable password login (<code>PasswordAuthentication no</code>), delete the test account after the investigation, check every other <code>authorized_keys</code>, review <code>an</code>'s practice.</li>
</ol>
<p>One more clue for real cases: <code>ls -la /home/test/.ssh</code> printed <code>Nov 25  2026</code> with a year instead of a time. <code>ls</code> does that for times more than six months old <em>or in the future</em> — after NTP put the clock back, these files were "from the future". On a real server, future timestamps are a sign that someone played with the clock.</p>
</details>

<h3>Write the report (five lines)</h3>
<pre><code class="language-text">[Incident lab7 24–25/11] Account "test" compromised by password guessing; attacker did not get root. Window 23:05–03:52 ICT.
Attacks: 192.168.56.66 dictionary 136 fails (23:05–23:08); .88 spraying 25 names (01h); .77 slow guessing 11 fails then SUCCESS 03:42:17.
Root cause: "test" created 22:41 by an via sudo (comment "tai khoan thu cho dev") with weak password; PasswordAuthentication yes.
Attacker actions (auditd auid=test): recon (id, uname, ls /home); cat /etc/shadow DENIED; sudo -l DENIED; planted SSH key x@kali SHA256:Thc+lqQJ…, used 03:52.
Actions: test locked+expired (05:55, after NTP restored the clock), sessions killed, key kept as evidence; next: PasswordAuthentication no, remove test, audit all authorized_keys, alert on "Accepted after N fails".</code></pre>

<h3>🎤 Interviewers will ask</h3>
<details><summary>"How do you know whether an SSH brute force on a server succeeded?"</summary><p>Not by counting failures. Take the time window, list every <code>Accepted</code> line with user, method and source IP, and look for an <code>Accepted</code> from an IP that failed before. Then check what that session did (auditd by auid, <code>last</code>, shell history), and look for persistence: new keys in <code>authorized_keys</code>, new users, sudoers changes, cron/systemd units. Compare fingerprints of key logins with known keys.</p></details>
<details><summary>"auth.log shows root did something via sudo. How do you know which person it was?"</summary><p>The sudo line itself starts with the invoking user (<code>an : … USER=root</code>). For actions done later inside a root shell, auth.log knows nothing — auditd does: its <code>auid</code> is set at login and survives sudo/su, so <code>ausearch -ua an</code> shows "an, acting as root, …".</p></details>
<details><summary>"copytruncate or create + postrotate?"</summary><p><code>create</code> + a postrotate that makes the program reopen its file loses nothing (we measured 0). <code>copytruncate</code> needs no cooperation from the program but loses the lines written between copy and truncate (we measured 2,000 at ~140k lines/s). Use copytruncate only when the program cannot reopen files.</p></details>
<details><summary>"df says the disk is full but du says /var/log is small. What happened?"</summary><p>A file was deleted while a process still has it open; the space is freed only when the last descriptor closes. Find it with <code>lsof +L1</code> or <code>find /proc/*/fd -lname '*(deleted)'</code>, then make the service reopen its logs or restart it. Next time truncate (<code>: &gt; file</code>) instead of <code>rm</code>.</p></details>
<details><summary>"Why not just send syslog over UDP to the SIEM?"</summary><p>UDP has no delivery guarantee: in our test a frozen receiver got 217 of 200,000 lines and the sender never knew. It is also plain text and accepts spoofed senders. Use TCP with a disk-assisted queue (or RELP when every line counts) and TLS on 6514 with certificate name checking.</p></details>

<h3>🛠 Project milestone</h3>
<p>On the VM that runs your project's backend: password login off, a short auditd rule set (identity, sudoers, sshd_config, your app's config folder, <code>-e 2</code>), rsyslog forwarding auth logs to a second machine over TCP with a queue, and a logrotate (or logback) policy for the app's own log file. Write in the README the one-line command that lists every successful SSH login of the last 24 hours.</p>

<h3>Done when</h3>
<div class="callout ok"><ol>
<li>All six questions answered, each with a command and a quoted line, with counts that do not include your own commands.</li>
<li>The successful login is given to the second, with IP, account and method, and the planted key is matched by fingerprint.</li>
<li>You state clearly what the intruder could <em>not</em> do (root), with the denying lines.</li>
<li>A five-line report with the root cause (weak test account) and next steps, NTP back on, and the test account locked.</li>
</ol></div>

<h3>🗂 Key terms</h3>
${kv([
  ['dictionary attack', 'Many passwords against a few names, fast — one source, minutes.'],
  ['password spraying', 'One password against many names, slowly — avoids account lockout.'],
  ['persistence', 'A way back in that survives a password change: SSH key, new user, cron, service.'],
  ['containment', 'Close the door while keeping evidence: lock, expire, kill sessions, move (not delete).'],
])}
${nguon('📰', 'Threatpost (2020) — FritzFrog botnet', 'The same chain in the wild: SSH guessing + authorized_keys back door', 'https://threatpost.com/fritzfrog-botnet-millions-ssh-servers/158489/')}
${nguon('🛡', 'MITRE ATT&CK T1098.004', 'Account Manipulation: SSH Authorized Keys', 'https://attack.mitre.org/techniques/T1098/004/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-5-dong-thoi-gian', title: 'Lesson 14.5 — Building a timeline', sub: 'Turn these findings into a multi-source incident timeline' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8</span>
<h2>Lab 8 — Một đêm bị dò SSH: ai, bao nhiêu lần, và có ai vào được không?</h2>
<p class="lead">08:00. Máy ảo lab7 đang bật đăng nhập bằng mật khẩu (Bài 8.1–8.3) và bạn để nó chạy qua đêm. Trưởng nhóm nhắn: "Giám sát thấy rất nhiều lưu lượng SSH vào lab7 đêm qua. Có ai vào được không? Nếu có: ai, bằng cách nào, đã làm gì, và giờ đã đóng chưa? Một trang." Bạn có auth.log, wtmp/btmp, bộ quy tắc auditd ở Bài 8.4 và journal.</p>

<h3>Chuẩn bị (30 phút) — chỉ trên máy lab của chính bạn</h3>
<ol>
<li><strong>Hai máy ảo trong một mạng riêng</strong> (VirtualBox host-only / Hyper-V internal / UTM shared): <code>lab7</code> = 192.168.56.10, máy kẻ dò <code>keodo</code> mang nhiều địa chỉ để phân biệt "từng người": <code>sudo ip addr add 192.168.56.66/24 dev &lt;card mạng&gt;</code> (và .77, .88; .20 = máy quen của quản trị viên). Tuyệt đối không chĩa các công cụ này vào máy không phải của bạn.</li>
<li>Trên lab7: bật đăng nhập bằng mật khẩu (phần chuẩn bị của Bài 8.1), hai người dùng <code>an</code> (sudo) và <code>dev</code> từ Bài 8.3, rsyslog đang ghi auth.log, bộ quy tắc auditd của Bài 8.4 đã nạp.</li>
<li>Trên keodo: <code>sudo apt install hydra sshpass</code> và bốn danh sách từ bên dưới.</li>
<li>Chạy kịch bản "một đêm" từ keodo + lab7 (nó tua đồng hồ lab7 — chỉ trên máy ảo lab — và bật lại NTP ở cuối).</li>
</ol>
<details><summary>Danh sách từ và kịch bản một đêm (đừng đọc trước khi làm xong)</summary>
${ma('text', 's08/lab8/users.txt')}
${ma('text', 's08/lab8/spray.txt')}
${ma('text', 's08/lab8/test-pass.txt')}
${ma('bash', 's08/lab8-tan-cong.bash')}
${lenh('s08/lab8-tan-cong', 3)}
${lenh('s08/lab8-tan-cong', 7)}
</details>
<div class="callout warn"><p><strong>Luật chơi.</strong> Chỉ trả lời từ log trên lab7 — không từ kịch bản, không từ màn hình kẻ dò. Chỉ đọc cho tới câu 6. Mỗi khẳng định cần một lệnh và một dòng log trích nguyên văn. Coi chừng đếm cả lệnh của chính mình (Bài 8.3).</p></div>

<h3>Các câu hỏi</h3>
<ol>
<li><strong>Khối lượng:</strong> từ 22:40 tới 08:30 có bao nhiêu lần sai mật khẩu và bao nhiêu lần thử tên không tồn tại?</li>
<li><strong>Nguồn:</strong> những IP nào, mỗi IP bao nhiêu lần, lúc mấy giờ, và mỗi nguồn giống kiểu tấn công nào (nhiều mật khẩu cho ít tên, một mật khẩu cho nhiều tên, đoán chậm)?</li>
<li><strong>Có ai vào được không?</strong> Liệt kê mọi dòng <code>Accepted</code> và tách bình thường với đáng ngờ. Tài khoản nào, từ đâu, ở giây nào, bằng phương thức nào?</li>
<li><strong>Nguyên nhân gốc:</strong> tài khoản bị đột nhập từ đâu ra? Ai tạo, lúc nào, và mật khẩu kiểu gì (suy từ log)?</li>
<li><strong>Kẻ đột nhập đã làm gì — và không làm được gì?</strong> Dùng auditd. Họ có lên được root không? Có để lại đường quay lại không?</li>
<li><strong>Ngăn chặn:</strong> đóng cửa mà không phá bằng chứng, và chỉ ra dòng log chứng minh.</li>
</ol>

<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý cho câu 1–2</summary><p>Chép cửa sổ thời gian ra tệp trước (<code>awk '$1&gt;="2026-11-24T22:40" &amp;&amp; $1&lt;"2026-11-25T08:30"'</code>) rồi đếm trên bản chép. Gom theo IP và theo giờ (<code>substr($1,12,2)</code>). Danh sách tên bị thử cho biết kiểu tấn công.</p></details>
<details><summary>Gợi ý cho câu 3</summary><p>Chương trình awk "vào được sau chuỗi thất bại" ở Bài 8.3. Rồi đọc phương thức: password hay publickey, và dấu vân tay.</p></details>
<details><summary>Gợi ý cho câu 4</summary><p><code>useradd</code>, <code>chpasswd</code>, và dòng sudo ngay trước chúng. Trường chú thích của tài khoản nằm trong lệnh sudo.</p></details>
<details><summary>Gợi ý cho câu 5</summary><p><code>ausearch -ua test --format text</code>, lọc bỏ những gì sshd/systemd làm dưới quyền root. Rồi so dấu vân tay của lần vào bằng khoá với <code>ssh-keygen -lf</code> trên <code>authorized_keys</code> của tài khoản. Định dạng ngày cho <code>-ts</code> theo locale.</p></details>

<h3>Đáp án (chạy thật — mở sau khi làm xong)</h3>
<details><summary>Hiện lệnh và output (câu 1–5)</summary>
${ma('bash', 's08/lab8.bash')}
${lenh('s08/lab8', 0)}
${lenh('s08/lab8', 1)}
${lenh('s08/lab8', 2)}
${lenh('s08/lab8', 3)}
${lenh('s08/lab8', 4)}
${lenh('s08/lab8', 5)}
${lenh('s08/lab8', 6)}
${lenh('s08/lab8', 7)}
${lenh('s08/lab8', 8)}
${lenh('s08/lab8', 9)}
${lenh('s08/lab8', 10)}
${lenh('s08/lab8', 11)}
${lenh('s08/lab8', 12)}
${lenh('s08/lab8', 13)}
${lenh('s08/lab8', 14)}
${lenh('s08/lab8', 15)}
${lenh('s08/lab8', 16)}
</details>
<details><summary>Hiện câu 6 (ngăn chặn)</summary>
${lenh('s08/lab8-ngan', 0)}
${lenh('s08/lab8-ngan', 1)}
</details>

<h3>Đọc đáp án</h3>
<details><summary>Hiện lời giải thích</summary>
<ol>
<li><strong>172</strong> lần sai mật khẩu, <strong>47</strong> dòng tên không tồn tại, trong 677 dòng. Đếm trên bản chép nên không lẫn lệnh sudo của chính ta. Journal khớp: <code>journalctl -u ssh … | grep -c 'Failed password'</code> = 172. <code>lastb</code> cho con số khác (160/70/11) vì btmp ghi lần thử theo cách khác dòng văn bản của sshd — luôn ghi rõ nguồn của mỗi con số.</li>
<li>Ba nguồn, ba kiểu:
<ul>
<li><code>192.168.56.66</code> — 136 lần sai trong chưa tới 4 phút (23:05:02–23:08:46), mỗi tên root, admin, ubuntu, user 34 lần: một <strong>công cụ dò theo từ điển</strong> (nhiều mật khẩu, ít tên).</li>
<li><code>192.168.56.88</code> — 25 lần sai lúc 1 giờ, mỗi lần một tên khác (oracle, postgres, git, jenkins…), mỗi tên thử một lần: <strong>rải mật khẩu</strong> (password spraying).</li>
<li><code>192.168.56.77</code> — 11 lần sai chỉ cho <code>test</code>, khoảng 7 giây một lần từ 03:41:02: <strong>đoán chậm, có chủ đích</strong>, đủ lặng để lọt dưới nhiều cảnh báo dựa trên tốc độ.</li>
</ul></li>
<li><strong>Có.</strong> <code>03:42:17 Accepted password for test from 192.168.56.77</code> ngay sau 11 lần sai từ cùng IP (dòng đỏ), rồi <code>03:52:00 Accepted publickey for test … SHA256:Thc+lqQJ…</code>. Các dòng bình thường: <code>an</code> từ .20 lúc 22:41 (máy quen của quản trị viên) và <code>hv</code> từ .20 lúc 07:58; các dòng 172.17.0.1 là kênh điều khiển của chính lab.</li>
<li>Lúc <code>22:41:00</code>, <code>an</code> chạy qua sudo lệnh <code>useradd … -c "tai khoan thu cho dev" test</code> rồi <code>chpasswd</code>: một "tài khoản thử tạm cho dev" với mật khẩu bị đoán trúng sau 12 lần. Nguyên nhân gốc thật là mật khẩu yếu trên một tài khoản thử bị bỏ quên, trên máy đang bật đăng nhập bằng mật khẩu — không phải "tại hacker".</li>
<li>auditd, theo người đăng nhập <code>test</code>: <code>id</code>, <code>uname</code>, <code>grep</code> (đếm người dùng có bash), <code>ls</code> (/home), <code>cat</code> → <strong>unsuccessfully opened-file /etc/shadow</strong>, <code>sudo</code> → <strong>unsuccessfully ran-command list</strong> (auth.log: <code>test : command not allowed</code>), rồi <code>mkdir</code>, <code>tee</code>, <code>chmod</code> — ghi <code>~/.ssh/authorized_keys</code>. Khoá trong tệp đó có chú thích <code>x@kali</code> và dấu vân tay <code>SHA256:Thc+lqQJ…</code> — <strong>trùng</strong> với lần vào bằng khoá lúc 03:52: một cửa sau, đúng kỹ thuật của FritzFrog. Không có root: shadow và sudo đều bị từ chối. Phiên thứ hai chạy <code>w</code> và <code>head</code>; những gì gõ mà "command not found" thì không để lại dấu vết audit — log cho thấy điều đã xảy ra, không cho thấy ý định. Để ý bẫy: <code>-ts 11/24/2026</code> báo lỗi, locale C đòi <code>11/24/26</code>.</li>
<li>Khoá và cho hết hạn tài khoản (<code>usermod -L -e 1</code>), giết các tiến trình của nó, <strong>chuyển</strong> (không xoá) khoá bị cài sang thư mục bằng chứng chỉ root đọc được. Log hiện <code>lock user 'test' password</code>. Sau đó: tắt đăng nhập bằng mật khẩu (<code>PasswordAuthentication no</code>), xoá tài khoản test khi điều tra xong, kiểm mọi <code>authorized_keys</code> khác, xem lại thói quen của <code>an</code>.</li>
</ol>
<p>Thêm một manh mối cho ca thật: <code>ls -la /home/test/.ssh</code> in <code>Nov 25  2026</code> có năm thay vì giờ. <code>ls</code> làm vậy với thời điểm cũ hơn sáu tháng <em>hoặc ở tương lai</em> — sau khi NTP chỉnh đồng hồ về đúng, các tệp này thành "đến từ tương lai". Trên máy chủ thật, mốc thời gian ở tương lai là dấu hiệu có người nghịch đồng hồ.</p>
</details>

<h3>Viết báo cáo (năm dòng)</h3>
<pre><code class="language-text">[Sự cố lab7 24–25/11] Tài khoản "test" bị đoán mật khẩu và đột nhập; kẻ tấn công KHÔNG lên được root. Cửa sổ 23:05–03:52 (giờ VN).
Tấn công: 192.168.56.66 dò từ điển 136 lần sai (23:05–23:08); .88 rải mật khẩu 25 tên (1h); .77 đoán chậm 11 lần sai rồi VÀO ĐƯỢC 03:42:17.
Nguyên nhân gốc: "test" do an tạo lúc 22:41 qua sudo (chú thích "tai khoan thu cho dev") với mật khẩu yếu; PasswordAuthentication yes.
Hành vi (auditd auid=test): do thám (id, uname, ls /home); cat /etc/shadow BỊ TỪ CHỐI; sudo -l BỊ TỪ CHỐI; cài khoá SSH x@kali SHA256:Thc+lqQJ…, dùng lúc 03:52.
Xử lý: khoá + cho hết hạn test (05:55, sau khi NTP chỉnh lại đồng hồ), giết phiên, giữ khoá làm bằng chứng; tiếp: PasswordAuthentication no, xoá test, rà mọi authorized_keys, cảnh báo "Accepted sau N lần sai".</code></pre>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<details><summary>"Làm sao biết một vụ dò mật khẩu SSH vào máy chủ đã thành công hay chưa?"</summary><p>Không phải bằng cách đếm số lần sai. Lấy cửa sổ thời gian, liệt kê mọi dòng <code>Accepted</code> kèm người dùng, phương thức và IP nguồn, rồi tìm dòng <code>Accepted</code> từ một IP đã sai trước đó. Tiếp theo xem phiên đó làm gì (auditd theo auid, <code>last</code>, lịch sử shell), và tìm cách bám trụ: khoá mới trong <code>authorized_keys</code>, người dùng mới, sudoers bị sửa, unit cron/systemd. So dấu vân tay các lần vào bằng khoá với khoá đã biết.</p></details>
<details><summary>"auth.log cho thấy root đã làm gì đó qua sudo. Làm sao biết là ai?"</summary><p>Chính dòng sudo bắt đầu bằng người gọi (<code>an : … USER=root</code>). Với thao tác làm sau đó bên trong shell root, auth.log không biết gì — auditd thì biết: <code>auid</code> được đặt lúc đăng nhập và giữ nguyên qua sudo/su, nên <code>ausearch -ua an</code> hiện "an, acting as root, …".</p></details>
<details><summary>"copytruncate hay create + postrotate?"</summary><p><code>create</code> + một postrotate bảo chương trình mở lại tệp thì không mất gì (ta đo được 0). <code>copytruncate</code> không cần chương trình hợp tác nhưng mất các dòng ghi giữa lúc chép và lúc cắt (ta đo được 2.000 dòng ở ~140 nghìn dòng/giây). Chỉ dùng copytruncate khi chương trình không mở lại được tệp.</p></details>
<details><summary>"df báo đĩa đầy nhưng du thấy /var/log nhỏ. Chuyện gì xảy ra?"</summary><p>Một tệp đã bị xoá trong khi tiến trình vẫn còn mở nó; chỗ trống chỉ nhả khi mã mô tả cuối cùng đóng. Tìm bằng <code>lsof +L1</code> hoặc <code>find /proc/*/fd -lname '*(deleted)'</code>, rồi bảo dịch vụ mở lại log hoặc khởi động lại. Lần sau cắt tệp (<code>: &gt; tệp</code>) thay vì <code>rm</code>.</p></details>
<details><summary>"Sao không gửi syslog qua UDP thẳng vào SIEM cho xong?"</summary><p>UDP không bảo đảm tới nơi: trong phép thử của ta, máy nhận bị đơ chỉ nhận 217 trên 200.000 dòng và bên gửi không hề biết. Nó còn là văn bản rõ và chấp nhận bên gửi giả mạo. Dùng TCP có hàng đợi đĩa đỡ (hoặc RELP khi từng dòng đều quan trọng) và TLS cổng 6514 có kiểm tên chứng chỉ.</p></details>

<h3>🛠 Mốc dự án</h3>
<p>Trên máy ảo chạy backend của dự án: tắt đăng nhập bằng mật khẩu, một bộ quy tắc auditd ngắn (identity, sudoers, sshd_config, thư mục cấu hình ứng dụng, <code>-e 2</code>), rsyslog chuyển log xác thực sang máy thứ hai qua TCP có hàng đợi, và chính sách logrotate (hoặc logback) cho tệp log của ứng dụng. Ghi vào README lệnh một dòng liệt kê mọi lần đăng nhập SSH thành công trong 24 giờ qua.</p>

<h3>Đạt khi</h3>
<div class="callout ok"><ol>
<li>Trả lời đủ sáu câu, mỗi câu có lệnh và dòng trích, với con số không lẫn lệnh của chính bạn.</li>
<li>Lần đăng nhập thành công được chỉ tới từng giây, kèm IP, tài khoản và phương thức, và khoá bị cài được khớp bằng dấu vân tay.</li>
<li>Bạn nói rõ kẻ đột nhập <em>không</em> làm được gì (root), kèm các dòng từ chối.</li>
<li>Báo cáo năm dòng có nguyên nhân gốc (tài khoản thử yếu) và bước tiếp theo, NTP đã bật lại, tài khoản test đã khoá.</li>
</ol></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['dò theo từ điển', 'Nhiều mật khẩu cho vài tên, nhanh — một nguồn, vài phút.'],
  ['rải mật khẩu', 'Một mật khẩu cho nhiều tên, chậm — né khoá tài khoản.'],
  ['bám trụ (persistence)', 'Đường quay lại sống sót qua việc đổi mật khẩu: khoá SSH, người dùng mới, cron, dịch vụ.'],
  ['ngăn chặn (containment)', 'Đóng cửa mà giữ bằng chứng: khoá, cho hết hạn, giết phiên, chuyển (không xoá).'],
])}
${nguon('📰', 'Threatpost (2020) — botnet FritzFrog', 'Cùng chuỗi đó ngoài đời: dò SSH + cửa sau authorized_keys', 'https://threatpost.com/fritzfrog-botnet-millions-ssh-servers/158489/')}
${nguon('🛡', 'MITRE ATT&CK T1098.004', 'Thao túng tài khoản: SSH Authorized Keys', 'https://attack.mitre.org/techniques/T1098/004/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-5-dong-thoi-gian', title: 'Bài 14.5 — Dựng dòng thời gian', sub: 'Biến các phát hiện này thành dòng thời gian sự cố đa nguồn' })}
</div>
`,
};
