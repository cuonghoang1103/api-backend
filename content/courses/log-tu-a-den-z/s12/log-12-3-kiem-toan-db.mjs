/**
 * 12.3 — Kiểm toán truy cập CSDL (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s12/kiemtoan'] + OUT['s12/do-mat-khau'] — máy chủ lgz-pg12 (tiếp 12.2), pgAudit 17 (gói postgresql-17-pgaudit);
 * máy khách giả: 10.20.0.15 (laptop An), 10.20.0.23 (máy dùng tài khoản app chung), 203.0.113.66 (máy "ngoài Internet", dải tài liệu RFC 5737).
 * Chuỗi dò mật khẩu → siêu người dùng → COPY … FROM PROGRAM mô phỏng PG_MEM/JINX-0126, chỉ trong container --network none.
 * Chạy lại ⇒ giờ/PID đổi: soát số trong lời ("PID 77, 10.20.0.23", "50 dòng", "35 lần, 9/9/8/9", "15:58:55 → 15:58:57", "line 128").
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '12.3 — Auditing database access: log_statement, pgAudit, who ran DROP/DELETE, connection brute force|||12.3 — Kiểm toán truy cập CSDL: log_statement, pgAudit, ai chạy DROP/DELETE, dò mật khẩu kết nối',
  slug: 'log-12-3-kiem-toan-db',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trả lời "ai đã xoá bảng coupons?" bằng log_statement=ddl và phát hiện vì sao tài khoản dùng chung làm hỏng câu trả lời; thấy log_statement=mod bỏ sót DELETE trong khối DO còn pgAudit bắt được; kiểm toán theo đối tượng (ai đọc bảng khách hàng); mật khẩu lọt vào log qua ALTER ROLE và qua câu lỗi; đọc một vụ dò mật khẩu → tạo siêu người dùng → COPY FROM PROGRAM giống chiến dịch PG_MEM/JINX-0126 có thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Who did what in the database? Auditing with log_statement and pgAudit</h2>
<p class="lead">Monday morning, the <code>coupons</code> table is gone and some old orders are missing. The boss asks the only question that matters: <em>who, when, from where?</em> Lesson 12.1's prefix gives you who/where for every line — but only for the statements PostgreSQL decided to log. This lesson shows what <code>log_statement</code> catches and what it silently misses, what pgAudit adds, how passwords leak into these logs, and how a real attack on an exposed PostgreSQL looks line by line.</p>

<h3>The everyday picture: the building's visitor book vs the CCTV</h3>
<p>A building's visitor book records who entered and which floor they said they were going to (<code>log_statement</code>: the text of the command as typed). A visitor can write "3rd floor" and then take the stairs to the 7th. The CCTV inside the corridors records what really happened on each floor (<code>pgAudit</code>: the operations actually executed, table by table). And if everyone in the company signs the book as "IT Department", the book is useless — that is the shared database account.</p>

<h3>Step 1 — log_statement = 'ddl': who dropped the table?</h3>
<p>During the morning, An works from a laptop (10.20.0.15) with a personal account; another machine (10.20.0.23) connects with the <code>app</code> account whose password sits in the project's <code>.env</code>. The server has <code>log_statement = 'ddl'</code>:</p>
${lenh('s12/kiemtoan', 0)}
${lenh('s12/kiemtoan', 1)}
${lenh('s12/kiemtoan', 2)}
<p>The DROP is there, at 15:58:53.142, PID 77, from <code>10.20.0.23</code>, with DBeaver's SQL editor. But look at the user: <code>app</code> — the account the <em>application</em> uses. The log cannot tell you which <strong>person</strong> it was; only which machine. From here the investigation leaves the database: who had 10.20.0.23 at that time (DHCP lease, VPN log — Chapter 11), who had the <code>.env</code>?</p>
<div class="pitfall co-tieu-de"><p><strong>The shared account destroys accountability.</strong> If humans log in with the application's account, every audit line says "the application did it". The fix is organisational, not a log setting: one role per person (with only the rights they need), the app account usable only from the app servers (a <code>pg_hba.conf</code> line per subnet), and its password in a secret manager rather than in every developer's <code>.env</code>.</p></div>

<h3>Step 2 — DELETE is not DDL</h3>
${lenh('s12/kiemtoan', 3)}
<p>Zero. The same session also ran <code>DELETE FROM orders_old WHERE id &gt; 100</code>, but <code>ddl</code> logs only CREATE/ALTER/DROP. The levels:</p>
<table>
<thead><tr><th>log_statement</th><th>Logs</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><code>none</code> (default)</td><td>nothing (errors still log their STATEMENT)</td><td>—</td></tr>
<tr><td><code>ddl</code></td><td>CREATE, ALTER, DROP…</td><td>the minimum every production DB should have — low volume</td></tr>
<tr><td><code>mod</code></td><td>ddl + INSERT, UPDATE, DELETE, TRUNCATE, COPY FROM…</td><td>small/low-write systems, short investigations</td></tr>
<tr><td><code>all</code></td><td>every statement, including SELECT</td><td>debugging only, briefly (12.2: the cost)</td></tr>
</tbody></table>
${lenh('s12/kiemtoan', 4)}
${lenh('s12/kiemtoan', 5)}
${lenh('s12/kiemtoan', 6)}
<p>With <code>mod</code>, the plain <code>DELETE … WHERE id &gt; 90</code> is logged. But the session also ran a <code>DO</code> block that built a DELETE dynamically — and the table now has <strong>50</strong> rows instead of 90. Nothing in the log: <code>log_statement</code> classifies the <em>top-level</em> statement text. A <code>DO</code> block, a function call (<code>SELECT cleanup()</code>) or a trigger is not "mod" by its text, so whatever it executes inside is invisible. Anyone who wants to avoid the visitor book just takes the stairs.</p>

<h3>Step 3 — pgAudit session audit: log what was executed</h3>
${lenh('s12/kiemtoan', 7)}
${lenh('s12/kiemtoan', 8)}
<p>pgAudit (an extension, loaded through <code>shared_preload_libraries</code> like auto_explain — the server here preloads <code>pg_stat_statements, auto_explain, pgaudit</code>) hooks into the executor, so the DELETE built inside the DO block is logged as what it is. Reading the CSV-like fields:</p>
<p><code>AUDIT: SESSION,1,1,WRITE,DELETE,TABLE,public.orders_old,DELETE FROM orders_old WHERE id &gt; 40,&lt;not logged&gt;</code></p>
<ul>
<li><code>SESSION</code> — session auditing (by statement class) · <code>1,1</code> — statement id and sub-statement id in this session.</li>
<li><code>WRITE</code> — the class (<code>pgaudit.log</code> accepts read, write, function, role, ddl, misc, misc_set, all) · <code>DELETE</code> — the command.</li>
<li><code>TABLE,public.orders_old</code> — object type and name (<code>pgaudit.log_relation = on</code> writes one line per table touched).</li>
<li>The SQL actually executed, then the parameters — <code>&lt;not logged&gt;</code> because <code>pgaudit.log_parameter</code> is off (the default; keep it off unless you must).</li>
</ul>
<p>Who/where is still in the prefix: <code>app@shop app=DBeaver … client=10.20.0.23</code>.</p>

<h3>Step 4 — object audit: "who read the customers table?"</h3>
<p>Session audit for <code>read</code> would log every SELECT on every table — far too much. Object audit logs only the tables you choose: create a role that no one logs in as, grant it the privileges you want to audit, and point <code>pgaudit.role</code> at it.</p>
${lenh('s12/kiemtoan', 9)}
${lenh('s12/kiemtoan', 10)}
<p>An ran two queries: one on <code>customers</code> (phone numbers) and one on <code>accounts</code>. Only the first one is logged, as <code>OBJECT,…,READ,SELECT,TABLE,public.customers</code>. This is what regulations ask for in practice (access to personal data must be traceable — lesson 16.6) without logging the whole workload.</p>

<h3>Step 5 — how passwords end up in the log</h3>
${lenh('s12/kiemtoan', 11)}
${lenh('s12/kiemtoan', 12)}
${lenh('s12/kiemtoan', 13)}
${lenh('s12/kiemtoan', 14)}
<p>Three lines, two leaks:</p>
<ol>
<li><code>log_statement</code> (any level from <code>ddl</code>) writes <code>ALTER ROLE intern PASSWORD 'Intern-Moi-2026!'</code> <strong>in clear text</strong> — the text log and the JSON log both.</li>
<li>pgAudit writes the same command as <code>PASSWORD &lt;REDACTED&gt;</code>. Better, but useless if log_statement already wrote it one line above.</li>
<li>The typo (<code>VALID UNTL</code>) failed — and <code>log_min_error_statement = error</code> (the <strong>default</strong>) wrote the failing statement, password included, even if log_statement were <code>none</code>.</li>
</ol>
<p>How to change a password without leaking it: in psql use <code>\\password intern</code>, which hashes the password on the client and sends <code>ALTER ROLE … PASSWORD 'SCRAM-SHA-256$4096:…'</code> — only the verifier reaches the server and the log. Applications should do the same (most drivers and admin tools offer it). If a cleartext password has reached a log, treat it as leaked: change it, and remember the log is also in backups and in the log pipeline.</p>

<h3>Step 6 — a real attack shape: brute force → superuser → OS command</h3>
<p>Thousands of PostgreSQL servers sit on the Internet with port 5432 open. In 2024 Aqua Security described <strong>PG_MEM</strong>: attackers guess weak passwords, create a superuser for themselves, then use <code>COPY … FROM PROGRAM</code> — a legitimate superuser feature that runs a shell command — to download and start a cryptominer. On 31 March 2025 Wiz reported a newer variant (tracked as JINX-0126) and estimated <strong>more than 1,500</strong> compromised servers. We replay the same shape against our lab server (inside a container with no network; the "attacker" is 203.0.113.66, and the <code>postgres</code> account has been given the weak password <code>postgres123</code>):</p>
${lenh('s12/do-mat-khau', 0)}
${lenh('s12/do-mat-khau', 1)}
${lenh('s12/do-mat-khau', 2)}
${lenh('s12/do-mat-khau', 5)}
${lenh('s12/do-mat-khau', 4)}
<p>35 failures from one address in about two seconds, against the user names every scanner tries: <code>admin</code>, <code>pgsql</code>, <code>root</code> (which do not even exist — the DETAIL says <code>Role "admin" does not exist</code>) and <code>postgres</code>, which failed only 8 times. Eight failures, then silence on that user, is the sign that the 9th guess worked. Now everything else that came from that address:</p>
${lenh('s12/do-mat-khau', 3)}
<ol>
<li><code>connection authenticated: identity="postgres"</code> — the guess succeeded.</li>
<li>A second session creates <code>pgg_sync … SUPERUSER</code> — a backdoor account that survives a password change on <code>postgres</code>. log_statement (ddl) shows its password in clear; pgAudit (role class) shows it redacted.</li>
<li><code>COPY tmp_out FROM PROGRAM 'id; uname -m'</code> — <strong>only pgAudit</strong> logged it (class WRITE). With log_statement at <code>ddl</code> the line that matters most — running an OS command on the DB server — would be absent.</li>
<li>The table is created and dropped around it: the attacker cleans up, but the log keeps the trace.</li>
</ol>
${lenh('s12/do-mat-khau', 6)}
${lenh('s12/do-mat-khau', 7)}
<p>The current state confirms the story — a second superuser that nobody created on purpose — and <code>pg_hba_file_rules</code> shows why it was possible: rule 128, <code>host all all all scram-sha-256</code>, accepts any user from any address with a password (and lines 119–121 trust localhost with no password at all — fine in a container, dangerous on a shared host). This maps to MITRE ATT&amp;CK T1110.001 (Password Guessing), then T1136 (Create Account) and T1059 (command execution). What stops it, in order: do not expose 5432 to the Internet (VPN/bastion, firewall), restrict pg_hba by address and user, strong passwords or certificate auth, <code>auth_delay</code> to slow guessing, alert on <code>28P01</code> bursts (Chapter 15) or ban with fail2ban (network-security course), and never give the app account superuser.</p>

<h3>A real incident about logs nobody read: GitLab, 31 January 2017</h3>
<p>An engineer, working late on replication problems, ran a command to wipe the PostgreSQL data directory on what they believed was the secondary; it was the primary. About 300 GB were deleted before the command was stopped. Then the team found that the daily <code>pg_dump</code> backups had been failing for a long time — the backup job used pg_dump 9.2 against a 9.6 database and errored out. The errors <em>were</em> reported, by e-mail from cron, but those e-mails were rejected by DMARC, so nobody ever saw them. GitLab restored from an LVM snapshot taken about 6 hours earlier and estimated the loss at roughly 5,000 projects, 5,000 comments and 700 new user accounts. The lesson for this chapter: an error that is logged but reaches no human is the same as no log. Audit and backup logs need an alert path that is itself tested.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, "a row in the price table changed by itself":</strong> check <code>SHOW log_statement</code> and whether pgaudit is loaded <em>before</em> promising an answer. If only <code>ddl</code> is logged, the log cannot answer an UPDATE question — say so, and propose <code>pgaudit.log = 'write'</code> on that table (object audit) from now on.</li>
<li><strong>Outsourcing, Japanese/Korean customers' security checklists</strong> often ask "are privileged operations on the DB logged and reviewed?" The honest answer needs three parts: which settings (ddl + pgAudit role/ddl, object audit on personal-data tables), where the log goes (not only on the DB host), who reviews it.</li>
<li><strong>AI coding agents with DB access:</strong> in July 2025 SaaStr's founder reported that Replit's AI agent deleted the company's production database during a declared code freeze. An agent should have its <em>own</em> role, without DROP/DELETE rights on production — then the audit log names it, and the permission system stops it first.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Install pgAudit (<code>apt-get install postgresql-17-pgaudit</code> in a <code>postgres:17</code> container), preload it, <code>CREATE EXTENSION pgaudit</code>.</li>
<li>With <code>log_statement = 'mod'</code>, delete rows through a <code>DO</code> block and confirm the log has nothing; then enable <code>pgaudit.log = 'write, ddl, role'</code> and repeat.</li>
<li>Set up object audit on one table and show that a SELECT on it is logged while a SELECT on another table is not.</li>
<li>Change a password once with <code>ALTER ROLE … PASSWORD '…'</code> and once with <code>\\password</code>; compare the log lines.</li>
</ol>
<p><strong>Done when:</strong> you can show an <code>AUDIT: SESSION,…,WRITE,DELETE</code> line for the dynamic DELETE; an <code>AUDIT: OBJECT,…,READ,SELECT</code> line for exactly one table; and the <code>\\password</code> change leaves only a <code>SCRAM-SHA-256$…</code> verifier in the log, never the cleartext.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['log_statement', 'none · ddl · mod · all — logs top-level statement text; misses what DO blocks/functions execute.'],
  ['pgAudit session audit', 'pgaudit.log = classes (read, write, function, role, ddl, misc…); logs what the executor ran.'],
  ['pgAudit object audit', 'pgaudit.role + GRANTs to that role decide which tables/operations are logged.'],
  ['AUDIT line fields', 'type, statement id, substatement id, class, command, object type, object name, statement, parameter.'],
  ['<REDACTED>', 'pgAudit hides passwords in CREATE/ALTER ROLE; log_statement and error STATEMENT lines do not.'],
  ['\\password', 'psql command that sends only a SCRAM verifier, so the cleartext never reaches the server log.'],
  ['COPY … FROM PROGRAM', 'Superuser (or pg_execute_server_program) runs an OS command — abused by PG_MEM/JINX-0126.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>log_statement = 'ddl'</code> is the minimum; it answers "who dropped", not "who deleted".</li>
<li>Shared accounts make audit logs point at "the app" — one role per human.</li>
<li>log_statement reads text; pgAudit records execution (DO blocks, functions).</li>
<li>Object audit = targeted "who read personal data".</li>
<li>Passwords leak via log_statement and failing statements; use <code>\\password</code>.</li>
<li>Brute force reads as a burst of <code>28P01</code> followed by a success and new roles.</li>
</ul>
${nguon('🧰', 'pgAudit (GitHub)', 'Session vs object audit, classes, log format, redaction', 'https://github.com/pgaudit/pgaudit')}
${nguon('🛡️', 'Wiz (31/3/2025) — fileless cryptominer targeting exposed PostgreSQL', 'JINX-0126: weak credentials, COPY … FROM PROGRAM, likely over 1,500 victims', 'https://www.wiz.io/blog/postgresql-cryptomining')}
${nguon('🛡️', 'Aqua Nautilus (2024) — PG_MEM', 'Brute force, superuser role, COPY FROM PROGRAM, XMRig', 'https://www.aquasec.com/blog/pg_mem-a-malware-hidden-in-the-postgres-processes/')}
${nguon('🛡️', 'GitLab — Postmortem of database outage of January 31 (2017)', '300 GB removed on the primary; pg_dump backups failing, alert e-mails rejected', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/')}
${nguon('📰', 'The Register (21/7/2025) — Replit deleted production database', 'AI agent ignored a code freeze', 'https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/')}
${nguon('🎯', 'MITRE ATT&CK T1110.001 — Password Guessing', 'Technique page, detections', 'https://attack.mitre.org/techniques/T1110/001/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-4-5-chong-do', title: 'Network security 4.5 — Stopping brute force', sub: 'fail2ban/CrowdSec — the same idea for 28P01 bursts', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-16-3-khong-log-bi-mat', title: 'Lesson 16.3 — Never log secrets', sub: 'Masking, gitleaks on logs, what to do after a leak', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Ai đã làm gì trong CSDL? Kiểm toán bằng log_statement và pgAudit</h2>
<p class="lead">Sáng thứ Hai, bảng <code>coupons</code> biến mất và một ít đơn hàng cũ cũng mất. Sếp hỏi đúng một câu: <em>ai, lúc nào, từ đâu?</em> Tiền tố ở bài 12.1 cho bạn ai/từ đâu trên mọi dòng — nhưng chỉ cho những câu PostgreSQL quyết định ghi. Bài này cho thấy <code>log_statement</code> bắt được gì và lặng lẽ bỏ sót gì, pgAudit thêm được gì, mật khẩu lọt vào các log này ra sao, và một cuộc tấn công thật vào PostgreSQL mở ra Internet trông thế nào từng dòng một.</p>

<h3>Liên tưởng đời thường: sổ khách của toà nhà và camera hành lang</h3>
<p>Sổ khách ở sảnh toà nhà ghi ai vào và họ <em>nói</em> sẽ lên tầng nào (<code>log_statement</code>: chữ của lệnh như được gõ). Khách có thể ghi "tầng 3" rồi đi thang bộ lên tầng 7. Camera trong hành lang ghi lại thật sự đã xảy ra gì ở từng tầng (<code>pgAudit</code>: các thao tác đã thực thi, từng bảng một). Còn nếu cả công ty đều ký sổ là "Phòng IT", thì cuốn sổ vô dụng — đó chính là tài khoản CSDL dùng chung.</p>

<h3>Bước 1 — log_statement = 'ddl': ai đã xoá bảng?</h3>
<p>Buổi sáng, An làm việc từ laptop (10.20.0.15) bằng tài khoản của chính mình; một máy khác (10.20.0.23) kết nối bằng tài khoản <code>app</code> mà mật khẩu nằm trong <code>.env</code> của dự án. Máy chủ đặt <code>log_statement = 'ddl'</code>:</p>
${lenh('s12/kiemtoan', 0)}
${lenh('s12/kiemtoan', 1)}
${lenh('s12/kiemtoan', 2)}
<p>Lệnh DROP có đó, lúc 15:58:53.142, PID 77, từ <code>10.20.0.23</code>, bằng trình soạn SQL của DBeaver. Nhưng nhìn người dùng: <code>app</code> — tài khoản của <em>ứng dụng</em>. Log không thể cho biết <strong>người</strong> nào; chỉ biết máy nào. Từ đây cuộc điều tra rời khỏi CSDL: lúc đó ai đang giữ 10.20.0.23 (DHCP lease, log VPN — Chương 11), ai có tệp <code>.env</code>?</p>
<div class="pitfall co-tieu-de"><p><strong>Tài khoản dùng chung phá hỏng trách nhiệm giải trình.</strong> Nếu người đăng nhập bằng tài khoản của ứng dụng, mọi dòng kiểm toán đều nói "ứng dụng đã làm". Cách sửa là tổ chức, không phải một thiết lập log: mỗi người một vai trò (chỉ đủ quyền cần), tài khoản ứng dụng chỉ dùng được từ máy chủ ứng dụng (mỗi dải mạng một dòng <code>pg_hba.conf</code>), và mật khẩu của nó nằm trong kho bí mật chứ không nằm trong <code>.env</code> của mọi lập trình viên.</p></div>

<h3>Bước 2 — DELETE không phải DDL</h3>
${lenh('s12/kiemtoan', 3)}
<p>Không dòng nào. Cùng phiên đó đã chạy <code>DELETE FROM orders_old WHERE id &gt; 100</code>, nhưng <code>ddl</code> chỉ ghi CREATE/ALTER/DROP. Các mức:</p>
<table>
<thead><tr><th>log_statement</th><th>Ghi</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>none</code> (mặc định)</td><td>không gì cả (lỗi vẫn ghi STATEMENT)</td><td>—</td></tr>
<tr><td><code>ddl</code></td><td>CREATE, ALTER, DROP…</td><td>mức tối thiểu CSDL production nào cũng nên có — ít dòng</td></tr>
<tr><td><code>mod</code></td><td>ddl + INSERT, UPDATE, DELETE, TRUNCATE, COPY FROM…</td><td>hệ nhỏ/ít ghi, điều tra ngắn hạn</td></tr>
<tr><td><code>all</code></td><td>mọi câu, kể cả SELECT</td><td>chỉ để debug, thật ngắn (12.2: cái giá)</td></tr>
</tbody></table>
${lenh('s12/kiemtoan', 4)}
${lenh('s12/kiemtoan', 5)}
${lenh('s12/kiemtoan', 6)}
<p>Với <code>mod</code>, câu <code>DELETE … WHERE id &gt; 90</code> trơn đã được ghi. Nhưng phiên đó còn chạy một khối <code>DO</code> dựng câu DELETE động — và bảng giờ còn <strong>50</strong> dòng thay vì 90. Log không có gì: <code>log_statement</code> phân loại theo chữ của câu <em>cấp ngoài cùng</em>. Một khối <code>DO</code>, một lời gọi hàm (<code>SELECT cleanup()</code>) hay một trigger không phải "mod" xét theo chữ, nên mọi thứ chúng thực thi bên trong đều vô hình. Ai muốn né sổ khách thì chỉ việc đi thang bộ.</p>

<h3>Bước 3 — pgAudit kiểm toán phiên: ghi thứ đã thực thi</h3>
${lenh('s12/kiemtoan', 7)}
${lenh('s12/kiemtoan', 8)}
<p>pgAudit (một extension, nạp qua <code>shared_preload_libraries</code> như auto_explain — máy chủ ở đây nạp sẵn <code>pg_stat_statements, auto_explain, pgaudit</code>) móc vào bộ thực thi, nên câu DELETE dựng trong khối DO được ghi đúng bản chất của nó. Đọc các trường kiểu CSV:</p>
<p><code>AUDIT: SESSION,1,1,WRITE,DELETE,TABLE,public.orders_old,DELETE FROM orders_old WHERE id &gt; 40,&lt;not logged&gt;</code></p>
<ul>
<li><code>SESSION</code> — kiểm toán phiên (theo lớp câu lệnh) · <code>1,1</code> — mã câu và mã câu con trong phiên này.</li>
<li><code>WRITE</code> — lớp (<code>pgaudit.log</code> nhận read, write, function, role, ddl, misc, misc_set, all) · <code>DELETE</code> — lệnh.</li>
<li><code>TABLE,public.orders_old</code> — loại và tên đối tượng (<code>pgaudit.log_relation = on</code> ghi mỗi bảng bị chạm một dòng).</li>
<li>Câu SQL thực sự đã chạy, rồi tới tham số — <code>&lt;not logged&gt;</code> vì <code>pgaudit.log_parameter</code> đang tắt (mặc định; cứ để tắt trừ khi bắt buộc).</li>
</ul>
<p>Ai/từ đâu vẫn nằm ở tiền tố: <code>app@shop app=DBeaver … client=10.20.0.23</code>.</p>

<h3>Bước 4 — kiểm toán đối tượng: "ai đã đọc bảng khách hàng?"</h3>
<p>Kiểm toán phiên cho lớp <code>read</code> sẽ ghi mọi SELECT trên mọi bảng — quá nhiều. Kiểm toán đối tượng chỉ ghi những bảng bạn chọn: tạo một vai trò không ai đăng nhập, cấp cho nó những quyền muốn kiểm toán, và trỏ <code>pgaudit.role</code> vào nó.</p>
${lenh('s12/kiemtoan', 9)}
${lenh('s12/kiemtoan', 10)}
<p>An chạy hai câu: một trên <code>customers</code> (số điện thoại) và một trên <code>accounts</code>. Chỉ câu đầu được ghi, thành <code>OBJECT,…,READ,SELECT,TABLE,public.customers</code>. Đây là thứ luật thực sự đòi trong thực tế (truy cập dữ liệu cá nhân phải truy vết được — bài 16.6) mà không phải ghi cả khối lượng công việc.</p>

<h3>Bước 5 — mật khẩu lọt vào log bằng cách nào</h3>
${lenh('s12/kiemtoan', 11)}
${lenh('s12/kiemtoan', 12)}
${lenh('s12/kiemtoan', 13)}
${lenh('s12/kiemtoan', 14)}
<p>Ba dòng, hai chỗ rò:</p>
<ol>
<li><code>log_statement</code> (từ mức <code>ddl</code> trở lên) ghi <code>ALTER ROLE intern PASSWORD 'Intern-Moi-2026!'</code> <strong>nguyên chữ</strong> — cả log chữ lẫn log JSON.</li>
<li>pgAudit ghi cùng lệnh đó thành <code>PASSWORD &lt;REDACTED&gt;</code>. Tốt hơn, nhưng vô ích nếu log_statement đã ghi nó ngay dòng trên.</li>
<li>Câu gõ sai (<code>VALID UNTL</code>) hỏng — và <code>log_min_error_statement = error</code> (giá trị <strong>mặc định</strong>) đã ghi câu hỏng, kèm mật khẩu, kể cả khi log_statement là <code>none</code>.</li>
</ol>
<p>Đổi mật khẩu mà không rò: trong psql dùng <code>\\password intern</code>, lệnh này băm mật khẩu ở máy khách rồi gửi <code>ALTER ROLE … PASSWORD 'SCRAM-SHA-256$4096:…'</code> — chỉ bộ xác minh tới được máy chủ và log. Ứng dụng nên làm y vậy (phần lớn driver và công cụ quản trị đều hỗ trợ). Nếu mật khẩu nguyên chữ đã vào log, coi như đã lộ: đổi nó, và nhớ rằng log còn nằm trong bản sao lưu và trong đường ống log.</p>

<h3>Bước 6 — hình dạng một cuộc tấn công thật: dò mật khẩu → siêu người dùng → lệnh hệ điều hành</h3>
<p>Hàng nghìn máy chủ PostgreSQL nằm trên Internet với cổng 5432 mở. Năm 2024 Aqua Security mô tả <strong>PG_MEM</strong>: kẻ tấn công đoán mật khẩu yếu, tự tạo một siêu người dùng, rồi dùng <code>COPY … FROM PROGRAM</code> — tính năng hợp lệ của siêu người dùng để chạy một lệnh shell — tải về và chạy máy đào tiền ảo. Ngày 31/3/2025 Wiz báo cáo một biến thể mới (theo dõi với tên JINX-0126) và ước tính <strong>hơn 1.500</strong> máy chủ đã bị chiếm. Ta diễn lại đúng hình dạng đó trên máy chủ lab (trong container không có mạng; "kẻ tấn công" là 203.0.113.66, và tài khoản <code>postgres</code> được gán mật khẩu yếu <code>postgres123</code>):</p>
${lenh('s12/do-mat-khau', 0)}
${lenh('s12/do-mat-khau', 1)}
${lenh('s12/do-mat-khau', 2)}
${lenh('s12/do-mat-khau', 5)}
${lenh('s12/do-mat-khau', 4)}
<p>35 lần hỏng từ một địa chỉ trong khoảng hai giây, nhắm vào những tên mà máy quét nào cũng thử: <code>admin</code>, <code>pgsql</code>, <code>root</code> (thậm chí không tồn tại — DETAIL ghi <code>Role "admin" does not exist</code>) và <code>postgres</code>, chỉ hỏng 8 lần. Tám lần hỏng rồi im bặt trên tên đó là dấu hiệu lần đoán thứ 9 đã trúng. Giờ là mọi thứ khác đến từ địa chỉ ấy:</p>
${lenh('s12/do-mat-khau', 3)}
<ol>
<li><code>connection authenticated: identity="postgres"</code> — đoán trúng.</li>
<li>Phiên thứ hai tạo <code>pgg_sync … SUPERUSER</code> — tài khoản cửa sau sống sót kể cả khi đổi mật khẩu <code>postgres</code>. log_statement (ddl) cho thấy mật khẩu nguyên chữ; pgAudit (lớp role) che đi.</li>
<li><code>COPY tmp_out FROM PROGRAM 'id; uname -m'</code> — <strong>chỉ pgAudit</strong> ghi lại (lớp WRITE). Nếu log_statement chỉ ở mức <code>ddl</code>, dòng quan trọng nhất — chạy lệnh hệ điều hành trên máy chủ CSDL — sẽ vắng mặt.</li>
<li>Bảng được tạo rồi xoá quanh lệnh đó: kẻ tấn công dọn dẹp, nhưng log giữ lại dấu vết.</li>
</ol>
${lenh('s12/do-mat-khau', 6)}
${lenh('s12/do-mat-khau', 7)}
<p>Trạng thái hiện tại xác nhận câu chuyện — một siêu người dùng thứ hai không ai cố ý tạo — và <code>pg_hba_file_rules</code> cho thấy vì sao làm được: luật 128, <code>host all all all scram-sha-256</code>, nhận mọi người dùng từ mọi địa chỉ chỉ cần mật khẩu (còn dòng 119–121 tin localhost không cần mật khẩu — ổn trong container, nguy hiểm trên máy dùng chung). Chuỗi này ứng với MITRE ATT&amp;CK T1110.001 (Password Guessing), rồi T1136 (Create Account) và T1059 (chạy lệnh). Thứ chặn được nó, theo thứ tự: đừng mở 5432 ra Internet (VPN/bastion, tường lửa), giới hạn pg_hba theo địa chỉ và người dùng, mật khẩu mạnh hoặc xác thực bằng chứng chỉ, <code>auth_delay</code> để làm chậm việc đoán, cảnh báo khi <code>28P01</code> dồn dập (Chương 15) hoặc chặn bằng fail2ban (khoá network-security), và không bao giờ cho tài khoản ứng dụng quyền siêu người dùng.</p>

<h3>Một sự cố thật về log không ai đọc: GitLab, 31/01/2017</h3>
<p>Một kỹ sư, làm khuya để xử lý trục trặc sao chép dữ liệu, chạy lệnh xoá thư mục dữ liệu PostgreSQL trên máy mà người đó tưởng là máy phụ; đó lại là máy chính. Khoảng 300 GB đã bị xoá trước khi lệnh được dừng. Rồi cả đội phát hiện bản sao lưu <code>pg_dump</code> hằng ngày đã hỏng từ lâu — job sao lưu dùng pg_dump 9.2 với CSDL 9.6 nên báo lỗi rồi dừng. Lỗi <em>có</em> được báo, bằng email từ cron, nhưng các email đó bị DMARC từ chối, nên chẳng ai từng thấy. GitLab khôi phục từ một snapshot LVM chụp khoảng 6 giờ trước và ước tính mất chừng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới. Bài học cho chương này: một lỗi được ghi mà không tới được người nào thì cũng như không có log. Log kiểm toán và log sao lưu cần một đường cảnh báo mà chính nó cũng được kiểm thử.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, "một dòng trong bảng giá tự đổi":</strong> kiểm <code>SHOW log_statement</code> và pgaudit có được nạp không <em>trước khi</em> hứa câu trả lời. Nếu chỉ ghi <code>ddl</code>, log không trả lời được câu hỏi về UPDATE — hãy nói thẳng, và đề xuất <code>pgaudit.log = 'write'</code> cho bảng đó (kiểm toán đối tượng) từ giờ.</li>
<li><strong>Outsourcing, checklist bảo mật của khách Nhật/Hàn</strong> hay hỏi "các thao tác đặc quyền trên CSDL có được ghi log và rà soát không?". Câu trả lời trung thực cần ba phần: thiết lập nào (ddl + pgAudit role/ddl, kiểm toán đối tượng trên bảng dữ liệu cá nhân), log đi đâu (không chỉ nằm trên máy CSDL), ai rà soát.</li>
<li><strong>Agent AI viết mã có quyền vào CSDL:</strong> tháng 7/2025 nhà sáng lập SaaStr kể agent AI của Replit đã xoá CSDL production của mình ngay trong lúc đã tuyên bố đóng băng mã. Agent nên có vai trò <em>riêng</em>, không có quyền DROP/DELETE trên production — khi đó log kiểm toán gọi đúng tên nó, và hệ thống phân quyền chặn nó trước đã.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Cài pgAudit (<code>apt-get install postgresql-17-pgaudit</code> trong container <code>postgres:17</code>), nạp sẵn, <code>CREATE EXTENSION pgaudit</code>.</li>
<li>Với <code>log_statement = 'mod'</code>, xoá dòng qua một khối <code>DO</code> và xác nhận log không có gì; rồi bật <code>pgaudit.log = 'write, ddl, role'</code> và làm lại.</li>
<li>Đặt kiểm toán đối tượng trên một bảng và cho thấy SELECT trên bảng đó được ghi còn SELECT trên bảng khác thì không.</li>
<li>Đổi mật khẩu một lần bằng <code>ALTER ROLE … PASSWORD '…'</code> và một lần bằng <code>\\password</code>; so các dòng log.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được dòng <code>AUDIT: SESSION,…,WRITE,DELETE</code> cho câu DELETE động; dòng <code>AUDIT: OBJECT,…,READ,SELECT</code> cho đúng một bảng; và lần đổi bằng <code>\\password</code> chỉ để lại bộ xác minh <code>SCRAM-SHA-256$…</code> trong log, không bao giờ có mật khẩu nguyên chữ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['log_statement', 'none · ddl · mod · all — ghi chữ của câu cấp ngoài; bỏ sót thứ khối DO/hàm thực thi.'],
  ['pgAudit kiểm toán phiên', 'pgaudit.log = các lớp (read, write, function, role, ddl, misc…); ghi thứ bộ thực thi đã chạy.'],
  ['pgAudit kiểm toán đối tượng', 'pgaudit.role + các GRANT cho vai trò đó quyết định bảng/thao tác nào được ghi.'],
  ['Các trường dòng AUDIT', 'loại, mã câu, mã câu con, lớp, lệnh, loại đối tượng, tên đối tượng, câu lệnh, tham số.'],
  ['<REDACTED>', 'pgAudit che mật khẩu trong CREATE/ALTER ROLE; log_statement và dòng STATEMENT của lỗi thì không.'],
  ['\\password', 'Lệnh psql chỉ gửi bộ xác minh SCRAM, nên mật khẩu nguyên chữ không bao giờ tới log máy chủ.'],
  ['COPY … FROM PROGRAM', 'Siêu người dùng (hoặc pg_execute_server_program) chạy lệnh hệ điều hành — bị PG_MEM/JINX-0126 lạm dụng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>log_statement = 'ddl'</code> là tối thiểu; trả lời "ai DROP", không trả lời "ai DELETE".</li>
<li>Tài khoản dùng chung khiến log kiểm toán chỉ vào "ứng dụng" — mỗi người một vai trò.</li>
<li>log_statement đọc chữ; pgAudit ghi việc thực thi (khối DO, hàm).</li>
<li>Kiểm toán đối tượng = nhắm đúng "ai đọc dữ liệu cá nhân".</li>
<li>Mật khẩu rò qua log_statement và câu lỗi; dùng <code>\\password</code>.</li>
<li>Dò mật khẩu đọc ra là một tràng <code>28P01</code> rồi một lần thành công và vai trò mới.</li>
</ul>
${nguon('🧰', 'pgAudit (GitHub)', 'Kiểm toán phiên và đối tượng, các lớp, định dạng dòng, che mật khẩu', 'https://github.com/pgaudit/pgaudit')}
${nguon('🛡️', 'Wiz (31/3/2025) — máy đào không tệp nhắm PostgreSQL mở ra Internet', 'JINX-0126: mật khẩu yếu, COPY … FROM PROGRAM, có thể hơn 1.500 nạn nhân', 'https://www.wiz.io/blog/postgresql-cryptomining')}
${nguon('🛡️', 'Aqua Nautilus (2024) — PG_MEM', 'Dò mật khẩu, vai trò siêu người dùng, COPY FROM PROGRAM, XMRig', 'https://www.aquasec.com/blog/pg_mem-a-malware-hidden-in-the-postgres-processes/')}
${nguon('🛡️', 'GitLab — Postmortem of database outage of January 31 (2017)', '300 GB bị xoá trên máy chính; sao lưu pg_dump hỏng, email cảnh báo bị từ chối', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/')}
${nguon('📰', 'The Register (21/7/2025) — Replit xoá CSDL production', 'Agent AI phớt lờ lệnh đóng băng mã', 'https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/')}
${nguon('🎯', 'MITRE ATT&CK T1110.001 — Password Guessing', 'Trang kỹ thuật, cách phát hiện', 'https://attack.mitre.org/techniques/T1110/001/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-4-5-chong-do', title: 'Network security 4.5 — Chống dò mật khẩu', sub: 'fail2ban/CrowdSec — cùng ý tưởng cho tràng 28P01', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-16-3-khong-log-bi-mat', title: 'Bài 16.3 — Đừng bao giờ log bí mật', sub: 'Che dữ liệu, gitleaks trên log, làm gì sau khi lộ', cta: 'Mở bài' })}
</div>
`,
};
