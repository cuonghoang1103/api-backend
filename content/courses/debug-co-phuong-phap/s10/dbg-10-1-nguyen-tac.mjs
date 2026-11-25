/**
 * 10.1 — Luật vàng trên production (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 22.22 + CDP (breakpoint/logpoint vào tiến trình đang phục vụ), Spring Boot 4.1.1 + JDI (Suspend All/Thread),
 * PostgreSQL 16 (vai trò chỉ đọc, sửa tay có quy trình, log_statement=mod), Docker Compose + node --report-on-signal — scratchpad/dbg/lab/ch10.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { APP101, TREO_NODE, TREO_JAVA, SEED, DOC_SQL, SUA_SQL, BC_APP, BC_SH } from './_ma-10.mjs';
import { BP, LOGPOINT, APPLOG, JAVA101, DOC, SUA, AUDIT, BANG_CHUNG } from './_ra-10.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;
const chiTiet = (tom, noiDung) => `<details><summary>${tom}</summary>${noiDung}</details>`;

const BANG_EN = `<table>
<thead><tr><th>Tempting on production</th><th>What actually happens</th><th>Do this instead</th></tr></thead>
<tbody>
<tr><td>Attach a debugger, set a breakpoint "for a second"</td><td>Node: the whole process stops — every user waits. Java: IntelliJ's default <em>Suspend: All</em> freezes every thread; even <em>Thread</em> blocks everyone who reaches that line. Health checks fail ⇒ the orchestrator restarts the instance under you.</td><td>Temporary structured log (10.2), reproduce on staging with a copy of the request, metrics</td></tr>
<tr><td>Open <code>--inspect</code> / JDWP "just today"</td><td>Anyone who can reach the port runs code as your server (lesson 3.4)</td><td>Never on production. If the team truly needs it: SSH tunnel to localhost, one person, time-boxed, written down</td></tr>
<tr><td>"Quick" UPDATE in a SQL client</td><td>A missing parenthesis changes 210 rows instead of 20; autocommit makes it permanent</td><td>Read-only role for looking; for changing: ticket, transaction, count, backup, RETURNING, second pair of eyes</td></tr>
<tr><td>Restart first, look later</td><td>Logs of the old container, the stuck queue, the thread state — gone</td><td>One minute of evidence (logs, inspect, report/thread dump), then restore</td></tr>
<tr><td>Copy the production database to your laptop to reproduce</td><td>Personal data leaves the controlled system — a legal problem, not just a technical one</td><td>Ask for an anonymised extract or the exact failing input with personal fields replaced</td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Điều hấp dẫn trên production</th><th>Chuyện thật sự xảy ra</th><th>Làm thế này thay vào đó</th></tr></thead>
<tbody>
<tr><td>Attach debugger, đặt breakpoint "một giây thôi"</td><td>Node: cả tiến trình dừng — mọi người dùng chờ. Java: mặc định <em>Suspend: All</em> của IntelliJ treo mọi luồng; kể cả <em>Thread</em> cũng chặn mọi người đi qua dòng đó. Health check trượt ⇒ hệ điều phối khởi động lại instance ngay dưới tay bạn.</td><td>Log có cấu trúc tạm thời (10.2), tái hiện trên staging bằng bản sao request, số đo</td></tr>
<tr><td>Mở <code>--inspect</code> / JDWP "hôm nay thôi"</td><td>Ai chạm được cổng là chạy được mã dưới danh nghĩa server (bài 3.4)</td><td>Không bao giờ trên production. Nếu nhóm thật sự cần: SSH tunnel về localhost, một người, có giờ kết thúc, có ghi lại</td></tr>
<tr><td>UPDATE "nhanh" trong trình SQL</td><td>Thiếu một cặp ngoặc là đổi 210 dòng thay vì 20; autocommit biến nó thành vĩnh viễn</td><td>Vai trò chỉ đọc để xem; muốn sửa: ticket, transaction, đếm, sao lưu, RETURNING, người thứ hai soát</td></tr>
<tr><td>Restart trước, xem sau</td><td>Log của container cũ, hàng đợi bị kẹt, trạng thái luồng — mất hết</td><td>Một phút lấy bằng chứng (log, inspect, report/thread dump), rồi mới khôi phục</td></tr>
<tr><td>Chép DB production về laptop để tái hiện</td><td>Dữ liệu cá nhân rời khỏi hệ thống được kiểm soát — chuyện pháp lý, không chỉ kỹ thuật</td><td>Xin bản trích đã ẩn danh, hoặc đúng input gây lỗi với các trường cá nhân đã thay</td></tr>
</tbody></table>`;

const QUY_TRINH_EN = `<ol>
<li><strong>Ticket first.</strong> What, why, who asked, expected number of rows. No ticket, no change.</li>
<li><strong>Open a transaction by hand</strong> (<code>BEGIN</code>) and tag the session: <code>SET application_name = 'LAB-1042 your-name'</code>.</li>
<li><strong>Count with the exact WHERE</strong> you will use. Compare with the number in the ticket. Different ⇒ stop.</li>
<li><strong>Back up exactly those rows</strong> (<code>CREATE TABLE sao_luu_… AS SELECT …</code>) — restoring 20 rows beats restoring a database.</li>
<li><strong>Change with <code>RETURNING</code></strong> and read the command tag (<code>UPDATE 20</code>).</li>
<li><strong>Verify</strong> with a query that would catch the mistake you fear (rows outside room 3?).</li>
<li><strong>A second person reads it</strong>, then <code>COMMIT</code>. Paste the whole session into the ticket.</li>
</ol>`;
const QUY_TRINH_VI = `<ol>
<li><strong>Có ticket trước.</strong> Đổi gì, vì sao, ai yêu cầu, số dòng mong đợi. Không ticket, không sửa.</li>
<li><strong>Mở transaction bằng tay</strong> (<code>BEGIN</code>) và gắn tên phiên: <code>SET application_name = 'LAB-1042 ten-ban'</code>.</li>
<li><strong>Đếm bằng đúng mệnh đề WHERE</strong> sẽ dùng. So với con số trong ticket. Khác ⇒ dừng.</li>
<li><strong>Sao lưu đúng những dòng đó</strong> (<code>CREATE TABLE sao_luu_… AS SELECT …</code>) — khôi phục 20 dòng dễ hơn khôi phục cả cơ sở dữ liệu.</li>
<li><strong>Sửa kèm <code>RETURNING</code></strong> và đọc thẻ lệnh (<code>UPDATE 20</code>).</li>
<li><strong>Kiểm</strong> bằng một truy vấn bắt được đúng cái sai bạn sợ (có dòng nào ngoài phòng 3 không?).</li>
<li><strong>Người thứ hai đọc lại</strong>, rồi mới <code>COMMIT</code>. Dán cả phiên vào ticket.</li>
</ol>`;

const NGUON = [
  nguon('📘', 'JetBrains — Breakpoints: Suspend policy', 'All (mặc định) treo mọi luồng; Thread chỉ treo luồng chạm breakpoint.', 'https://www.jetbrains.com/help/idea/using-breakpoints.html'),
  nguon('📘', 'Node.js — Diagnostic report', '--report-on-signal: ghi báo cáo JSON khi nhận tín hiệu, tiến trình chạy tiếp.', 'https://nodejs.org/api/report.html'),
  nguon('📘', 'PostgreSQL 16 — Predefined roles', 'pg_read_all_data: đọc mọi bảng, không ghi.', 'https://www.postgresql.org/docs/16/predefined-roles.html'),
  nguon('📘', 'PostgreSQL 16 — log_statement, log_line_prefix', 'mod: ghi mọi câu thay đổi dữ liệu; %u người dùng, %a application_name.', 'https://www.postgresql.org/docs/16/runtime-config-logging.html'),
  nguon('🧯', 'Atlassian — Post-incident review, April 2022 outage', '775 khách hàng mất truy cập tới 14 ngày: script xoá nhận ID của cả site thay vì ID ứng dụng.', 'https://www.atlassian.com/engineering/post-incident-review-april-2022-outage'),
  nguon('🧯', 'AWS — Amazon S3 Service Disruption (us-east-1), 28/02/2017', 'Một đầu vào của lệnh theo playbook bị gõ sai ⇒ gỡ nhiều server hơn dự định.', 'https://aws.amazon.com/message/41926/'),
  nguon('🧯', 'GitLab — Postmortem of database outage of January 31 (2017)', 'Lệnh xoá thư mục chạy nhầm máy chủ DB chính trong lúc gỡ sự cố đêm khuya.', 'https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-4-attach', title: 'Bài 3.4 — Attach vào tiến trình đang chạy', sub: 'Vì sao inspector mở ra ngoài là RCE — đã chạy thật ở chương 3.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-6-5-khoi-phuc', title: 'Incident Response 6.5 — Khôi phục theo từng bước', sub: 'Khôi phục và canh tái phát — khoá này không dạy lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-4-3-thay-doi', title: 'Incident Response 4.3 — Cái gì vừa thay đổi?', sub: 'Nối sự cố với deploy và cấu hình.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.1 — Golden rules: read-only first, never pause production, never hand-edit data|||10.1 — Luật vàng: chỉ đọc trước, không dừng production, không sửa tay dữ liệu',
  slug: 'dbg-10-1-nguyen-tac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao các công cụ của chương 3–5 bị cấm trên production, đo thật: breakpoint vào tiến trình Node đang phục vụ ⇒ 9/9 người dùng (kể cả /health) bỏ cuộc sau 3 s, bấm Continue thì dừng tiếp 4 lần ở request của người khác; logpoint không dừng nhưng vẫn cần inspector mở. Spring Boot: Suspend All treo 36/36 luồng JVM (cả actuator), Suspend Thread vẫn chặn mọi request đi qua đúng dòng đó. Chỉ đọc trước: vai trò pg_read_all_data + default_transaction_read_only (và vì sao BEGIN READ WRITE vượt được lớp này). Sửa tay có quy trình: AND/OR thiếu ngoặc ⇒ UPDATE 210 thay vì 20, bắt được nhờ đếm trước trong transaction; sao lưu, RETURNING, kiểm, log_statement=mod ghi ai sửa (cả câu đã rollback). Khôi phục trước, điều tra sau — nhưng một phút bằng chứng: docker compose logs, docker inspect, node --report-on-signal; recreate xoá sạch log. Atlassian 2022, AWS S3 2017, GitLab 2017.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Production is not your laptop</h2>
<p class="lead">Chapters 3–5 gave you power tools: breakpoints that stop time, consoles that run any expression, attaching to a running process. On production those tools hurt the people you are trying to help. This lesson measures exactly how — on a Node process and a Spring Boot app that are serving other users while you "just look" — and replaces each habit with a safe one: read-only access, a procedure for the rare data fix, and one minute of evidence before you restart anything.</p>

<h3>An everyday picture: the surgeon and the patient on the table</h3>
<p>A doctor examining you in a clinic can ask you to hold your breath, try a medicine and come back next week. A surgeon with a patient open on the table cannot "try something and see". Every action is planned, announced, checked by a second person, written down. Your laptop is the clinic. Production is the operating theatre: real people are attached to it, and they cannot wait while you think.</p>

<h3>1. A breakpoint on a server stops everyone</h3>
<p>A tiny LabFlow "production": one Node process serving all users, started with the inspector open on localhost (never do this for real — it is only so we can measure).</p>
${ma(APP101)}
${chiTiet('treo-node.mjs — the measuring client (CDP, same protocol as VS Code)', ma(TREO_NODE))}
${ra(BP)}
<p>You paused on one request to "look at <code>d</code> for five seconds". During those five seconds the process ran <strong>nothing else</strong>: Node has one JavaScript thread, and a breakpoint stops it. Eight other users — including the load balancer's <code>/health</code> — gave up after their 3-second timeout. A real load balancer would now mark the instance dead; Kubernetes' liveness probe would kill and restart the container, ending your debugging session too. And look at what happened after you pressed Continue: the breakpoint was still there, so the next queued request — someone else's — stopped on the same line, four times in a row.</p>
<p>A <strong>logpoint</strong> (a breakpoint whose condition prints and returns <code>false</code>) does not pause:</p>
${ra(LOGPOINT)}
${ra(APPLOG)}
<p>Everyone is served in milliseconds. It is still not a production tool: it needs the inspector port open (lesson 3.4: whoever reaches that port runs code as your server), the output lands in the production log without review, and a typo in the expression runs on every request. What you actually want is the same idea done properly — a temporary, reviewed, structured log line (lesson 10.2).</p>

<h3>2. The same on the JVM: "Suspend: All" is the default</h3>
<p>Spring Boot is multi-threaded, so you might think only one request stops. The answer depends on a setting most people never open: right-click the red dot in IntelliJ ⇒ <em>Suspend: All / Thread</em>. All is the default. The tiny client below uses JDI — the API IntelliJ's debugger is built on — to set the same breakpoint with each policy:</p>
${chiTiet('Treo.java — a 40-line debugger on JDI', ma(TREO_JAVA, 'java'))}
${ra(JAVA101)}
<p>With <em>All</em>, all 36 JVM threads froze: Tomcat's workers, the actuator's own connector, the scheduler, the connection pool's housekeeping. Even the separate management port timed out. With <em>Thread</em> only the thread that hit the line stopped, so <code>/actuator/health</code> answered in milliseconds — but every other user who called <code>/dat-lich/7</code> reached the same line and stopped too, and with enough of them Tomcat's 200 worker threads are all parked on your breakpoint. Either way you are running an outage. Remote debugging into a JVM belongs to a dev or staging environment (lesson 4.5), with the port reachable only through a tunnel.</p>

<h3>3. Look with read-only access</h3>
<p>Most production investigation is reading: logs, metrics, a few SELECTs. Give the reading person a role that <em>cannot</em> write, so a slip of the keyboard cannot become an incident:</p>
${ma(SEED, 'sql')}
${ma(DOC_SQL, 'sql')}
${ra(DOC)}
<p>Two layers stopped the UPDATE. <code>default_transaction_read_only</code> refused it first — but notice the second attempt: <code>BEGIN READ WRITE</code> overrides that default, so it is a seat belt, not a lock. The real lock is the permission: <code>pg_read_all_data</code> grants SELECT only, hence <code>permission denied</code>. <code>statement_timeout</code> on the same role stops a heavy "quick look" from slowing the database for everyone. Ask your team lead for such a role on your first OJT week; most companies already have one ("readonly", "support").</p>

<h3>4. When data must be changed: a procedure, not courage</h3>
<p>Sometimes the fix <em>is</em> a data change: a room goes into maintenance and its bookings must be cancelled. Ticket LAB-1042: "room 3, 25 and 26 November — 20 bookings". Follow the procedure even when it feels slow:</p>
${QUY_TRINH_EN}
${ma(SUA_SQL, 'sql')}
${ra(SUA)}
<p>The first WHERE reads naturally in English and is wrong: <code>AND</code> binds tighter than <code>OR</code>, so it means "(room 3 on the 25th) or (any room on the 26th)" — 210 rows across every room. The count caught it before anything changed; the person who skips the count runs the UPDATE, reads <code>UPDATE 210</code>, and is saved only because the transaction was opened by hand. In a GUI client with autocommit on, there is no second chance. Then the database's own record:</p>
${ra(AUDIT)}
<p><code>log_statement = mod</code> writes every data-changing statement with the user and <code>application_name</code> — including the one that was rolled back (the log records what was <em>attempted</em>). That is why you set <code>application_name</code> to the ticket: the audit trail then answers "who, when, why" without anyone's memory.</p>
<div class="callout warn"><p><strong>Real incidents, same shape.</strong> Atlassian, April 2022: a maintenance script was given the IDs of whole cloud sites instead of the IDs of an app to remove; 775 customers lost access for up to 14 days. AWS S3, 28 February 2017: during routine work one input of a playbook command was typed wrong and far more servers were removed than intended, taking down a large part of us-east-1. GitLab, January 2017: an engineer debugging replication late at night deleted a data directory on the wrong server. None of these people were careless beginners — the systems let one typed value do too much. Counting first, scoping by ID lists, dry runs and a second reader are how teams make that impossible.</p></div>

<h3>5. Restore first, investigate later — after one minute of evidence</h3>
<p>When users are hurting, restoring service beats understanding it. But restarting destroys the state that would explain the bug. Here a report-export service gets stuck: one bad request throws before resetting a flag, and every request after it waits forever.</p>
${ma(BC_APP)}
${chiTiet('c101-bang-chung.sh — the evidence-then-restore script', ma(BC_SH, 'bash'))}
${ra(BANG_CHUNG)}
<p>Three commands, under a minute: the container's log (with timestamps), its state (exit code, OOMKilled, restart count, start time), and a Node diagnostic report taken with a signal — the process keeps running. Then the redeploy: <code>up --force-recreate</code> creates a new container, and <code>docker compose logs</code> now shows <strong>zero</strong> of the five requests; the only surviving record is the file you saved, which still contains the one line that explains everything: <code>học kỳ không hợp lệ: HK0</code>. For a JVM the equivalent minute is <code>jcmd &lt;pid&gt; Thread.print</code> and <code>GC.heap_info</code> (lesson 8.4) before the restart. Write the evidence step into the runbook so that the person on call at 2 a.m. does it without thinking.</p>

<h3>6. The rules on one page</h3>
${BANG_EN}
<p>Two more that are about people, not tools. <strong>Access is personal and logged</strong>: never share a production account, use the break-glass procedure your company has, and say in the team channel what you are about to do ("I'm running a read-only query on orders for LAB-1042"). <strong>Personal data stays where it is</strong>: Vietnam's Decree 13/2023/NĐ-CP on personal data protection (and the Personal Data Protection Law in force from 1 January 2026) applies to that database dump too. How a team runs the incident itself — who decides, who talks to the customer, the postmortem — is the subject of the Incident Response course; this chapter stays on the debugging side.</p>

<h3>On the job</h3>
<p>In an outsourcing project you often have <em>no</em> access to production at all: the customer's operations team does. Then these rules turn into what you ask for: "please send the last 15 minutes of the API log for request id 7f3a…", "please run this read-only query", "please take a thread dump before restarting". Write the exact commands in the ticket — the customer's engineer runs them faster, and your request looks professional. When you do have access as an intern, expect it to be read-only; if someone hands you write access "to save time", ask your lead to confirm in writing.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>c101-node.sh</code>. Change the client so the breakpoint is set on the <code>/health</code> handler instead. How long until a real load balancer with a 2-second timeout and 3 failures would remove the instance?</li>
<li>Run <code>c101-java.sh</code>; then in IntelliJ, open the breakpoint dialog and find where to make <em>Thread</em> the default for new breakpoints.</li>
<li>Create the <code>truc_doc</code> role on your project database. Try UPDATE, DELETE, <code>BEGIN READ WRITE</code> + UPDATE, and a <code>pg_sleep(10)</code>. Note which layer stopped each.</li>
<li>Write the cancellation of ticket LAB-1042 for your own schema following the 7 steps, with a deliberate AND/OR mistake. Make sure your count catches it.</li>
<li>Add the "one minute of evidence" commands for your project (Docker or JVM) to a <code>RUNBOOK.md</code>.</li>
</ol>
<p><strong>Done when:</strong> you can explain in two sentences why a breakpoint on production is an outage, and you have a runbook section with evidence commands and a data-fix procedure.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Suspend policy</span><span class="v">What a Java breakpoint stops: All threads (IntelliJ default) or only the thread that hit it.</span></div>
  <div class="kv"><span class="k">Logpoint</span><span class="v">A breakpoint that prints and continues; still needs the debugger port.</span></div>
  <div class="kv"><span class="k">Least privilege</span><span class="v">Give each person exactly the access the task needs — reading needs no write grant.</span></div>
  <div class="kv"><span class="k">pg_read_all_data</span><span class="v">Built-in PostgreSQL role: SELECT on everything, nothing else.</span></div>
  <div class="kv"><span class="k">Audit trail</span><span class="v">A record of who changed what, when and why — <code>log_statement=mod</code> + <code>application_name</code>.</span></div>
  <div class="kv"><span class="k">Evidence before restart</span><span class="v">Logs, container state, diagnostic report or thread dump — taken in a minute, saved outside the instance.</span></div>
  <div class="kv"><span class="k">Diagnostic report</span><span class="v">Node's JSON snapshot (stack, heap, handles) on a signal, without stopping the process.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A breakpoint on a server is an outage: Node stops entirely; Java's default Suspend All freezes every thread, and Suspend Thread still blocks every request through that line.</li>
<li>Look with a role that cannot write; the permission is the lock, read-only defaults are a seat belt.</li>
<li>Data fixes follow a procedure: ticket, manual transaction, count, backup, RETURNING, verify, second reader.</li>
<li>Restore first — after one minute of evidence, because recreating an instance erases its logs and state.</li>
<li>Access is personal and logged; production personal data does not travel to laptops.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Production không phải laptop của bạn</h2>
<p class="lead">Chương 3–5 trao cho bạn những công cụ mạnh: breakpoint làm dừng thời gian, console chạy được mọi biểu thức, attach vào tiến trình đang chạy. Trên production, chính các công cụ đó làm hại người bạn đang muốn giúp. Bài này đo chính xác hại thế nào — trên một tiến trình Node và một ứng dụng Spring Boot đang phục vụ người khác trong lúc bạn "chỉ xem thôi" — rồi thay từng thói quen bằng một cách an toàn: quyền chỉ đọc, quy trình cho lần hiếm hoi phải sửa dữ liệu, và một phút lấy bằng chứng trước khi khởi động lại bất cứ thứ gì.</p>

<h3>Liên tưởng đời thường: bác sĩ phẫu thuật và bệnh nhân trên bàn mổ</h3>
<p>Bác sĩ khám ở phòng khám có thể bảo bạn nín thở, thử một loại thuốc rồi tuần sau quay lại. Bác sĩ phẫu thuật với bệnh nhân đang mở trên bàn thì không thể "thử xem sao". Mọi thao tác đều được tính trước, nói to lên, người thứ hai soát, ghi lại. Laptop của bạn là phòng khám. Production là phòng mổ: người thật đang nối vào nó, và họ không thể chờ trong lúc bạn suy nghĩ.</p>

<h3>1. Một breakpoint trên server làm dừng tất cả mọi người</h3>
<p>Một "production" LabFlow tí hon: một tiến trình Node phục vụ mọi người dùng, chạy với inspector mở trên localhost (đời thật đừng bao giờ làm thế — ở đây chỉ để đo).</p>
${ma(APP101)}
${chiTiet('treo-node.mjs — client đo (CDP, cùng giao thức với VS Code)', ma(TREO_NODE))}
${ra(BP)}
<p>Bạn dừng ở một request để "xem <code>d</code> năm giây". Trong năm giây đó tiến trình <strong>không chạy gì khác</strong>: Node chỉ có một luồng JavaScript, và breakpoint làm luồng đó dừng. Tám người dùng khác — kể cả <code>/health</code> của load balancer — bỏ cuộc sau 3 giây chờ. Load balancer thật lúc này sẽ đánh dấu instance đã chết; liveness probe của Kubernetes sẽ giết và khởi động lại container, chấm dứt luôn phiên debug của bạn. Và nhìn chuyện xảy ra sau khi bạn bấm Continue: breakpoint vẫn còn, nên request kế tiếp đang xếp hàng — của người khác — lại dừng ở đúng dòng đó, bốn lần liền.</p>
<p>Một <strong>logpoint</strong> (breakpoint có điều kiện in ra rồi trả <code>false</code>) thì không dừng:</p>
${ra(LOGPOINT)}
${ra(APPLOG)}
<p>Mọi người được phục vụ trong vài mili giây. Nhưng nó vẫn không phải công cụ cho production: cần mở cổng inspector (bài 3.4: ai chạm được cổng đó là chạy được mã dưới danh nghĩa server), output rơi thẳng vào log production mà không ai review, và gõ sai biểu thức là nó chạy sai trên mọi request. Thứ bạn thật sự cần là cùng ý tưởng đó làm cho đúng — một dòng log có cấu trúc, tạm thời, có review (bài 10.2).</p>

<h3>2. Trên JVM cũng vậy: "Suspend: All" là mặc định</h3>
<p>Spring Boot chạy nhiều luồng, nên bạn có thể nghĩ chỉ một request dừng. Câu trả lời phụ thuộc một thiết lập ít ai mở ra: chuột phải vào chấm đỏ trong IntelliJ ⇒ <em>Suspend: All / Thread</em>. All là mặc định. Client tí hon dưới đây dùng JDI — API mà debugger của IntelliJ dựa trên — để đặt cùng một breakpoint với từng chế độ:</p>
${chiTiet('Treo.java — debugger 40 dòng trên JDI', ma(TREO_JAVA, 'java'))}
${ra(JAVA101)}
<p>Với <em>All</em>, cả 36 luồng JVM đứng im: các worker của Tomcat, connector riêng của actuator, bộ lập lịch, luồng dọn dẹp của connection pool. Đến cổng quản trị riêng cũng hết giờ chờ. Với <em>Thread</em> chỉ luồng chạm dòng đó dừng, nên <code>/actuator/health</code> trả lời trong vài mili giây — nhưng mọi người dùng khác gọi <code>/dat-lich/7</code> đều chạm cùng dòng và cũng dừng, đủ nhiều người là cả 200 luồng worker của Tomcat nằm chờ ở breakpoint của bạn. Đằng nào bạn cũng đang gây ra một sự cố. Remote debug vào JVM là việc của môi trường dev hoặc staging (bài 4.5), cổng chỉ với tới được qua tunnel.</p>

<h3>3. Xem bằng quyền chỉ đọc</h3>
<p>Phần lớn việc điều tra trên production là đọc: log, số đo, vài câu SELECT. Hãy cho người đọc một vai trò <em>không thể</em> ghi, để một lần trượt tay không thành sự cố:</p>
${ma(SEED, 'sql')}
${ma(DOC_SQL, 'sql')}
${ra(DOC)}
<p>Hai lớp đã chặn lệnh UPDATE. <code>default_transaction_read_only</code> từ chối trước — nhưng để ý lần thử thứ hai: <code>BEGIN READ WRITE</code> ghi đè được mặc định đó, nên nó là dây an toàn, không phải ổ khoá. Ổ khoá thật là quyền: <code>pg_read_all_data</code> chỉ cấp SELECT, vì vậy mới có <code>permission denied</code>. <code>statement_timeout</code> trên cùng vai trò ngăn một câu "xem nhanh" nặng làm chậm cơ sở dữ liệu của mọi người. Tuần đầu OJT, hãy xin trưởng nhóm một vai trò như thế; hầu hết công ty đã có sẵn ("readonly", "support").</p>

<h3>4. Khi buộc phải sửa dữ liệu: cần quy trình, không cần can đảm</h3>
<p>Có lúc bản sửa <em>chính là</em> sửa dữ liệu: một phòng vào bảo trì và các lượt đặt phải huỷ. Ticket LAB-1042: "phòng 3, ngày 25 và 26/11 — 20 lượt đặt". Làm đúng quy trình kể cả khi thấy chậm:</p>
${QUY_TRINH_VI}
${ma(SUA_SQL, 'sql')}
${ra(SUA)}
<p>Mệnh đề WHERE đầu tiên đọc rất xuôi tai mà sai: <code>AND</code> gắn chặt hơn <code>OR</code>, nên nó nghĩa là "(phòng 3 ngày 25) hoặc (mọi phòng ngày 26)" — 210 dòng trải khắp các phòng. Phép đếm bắt được trước khi có gì bị đổi; người bỏ qua bước đếm sẽ chạy UPDATE, đọc thấy <code>UPDATE 210</code>, và chỉ thoát vì transaction được mở bằng tay. Trong trình SQL có giao diện đang bật autocommit thì không có cơ hội thứ hai. Rồi đến bản ghi của chính cơ sở dữ liệu:</p>
${ra(AUDIT)}
<p><code>log_statement = mod</code> ghi mọi câu thay đổi dữ liệu kèm người dùng và <code>application_name</code> — kể cả câu đã bị rollback (log ghi điều đã được <em>thử</em>). Vì thế bạn đặt <code>application_name</code> bằng mã ticket: dấu vết kiểm toán tự trả lời "ai, lúc nào, vì sao" mà không cần trí nhớ của ai.</p>
<div class="callout warn"><p><strong>Sự cố thật, cùng một hình dạng.</strong> Atlassian, tháng 4/2022: một script bảo trì được đưa ID của cả site cloud thay vì ID của ứng dụng cần gỡ; 775 khách hàng mất truy cập tới 14 ngày. AWS S3, 28/02/2017: trong một việc thường ngày, một đầu vào của lệnh theo playbook bị gõ sai và số server bị gỡ nhiều hơn hẳn dự định, làm sập một phần lớn vùng us-east-1. GitLab, tháng 1/2017: một kỹ sư gỡ lỗi replication lúc nửa đêm đã xoá thư mục dữ liệu trên nhầm máy chủ. Không ai trong số họ là người mới ẩu — hệ thống đã cho một giá trị gõ tay làm quá nhiều việc. Đếm trước, giới hạn bằng danh sách ID, chạy thử và người thứ hai đọc lại là cách các nhóm làm cho chuyện đó không thể xảy ra.</p></div>

<h3>5. Khôi phục trước, điều tra sau — sau một phút lấy bằng chứng</h3>
<p>Khi người dùng đang khổ, khôi phục dịch vụ quan trọng hơn hiểu nó. Nhưng khởi động lại sẽ phá huỷ đúng trạng thái giải thích được lỗi. Ở đây một dịch vụ xuất báo cáo bị kẹt: một request hỏng ném lỗi trước khi kịp đặt lại cờ, và mọi request sau đó chờ mãi.</p>
${ma(BC_APP)}
${chiTiet('c101-bang-chung.sh — script lấy bằng chứng rồi mới khôi phục', ma(BC_SH, 'bash'))}
${ra(BANG_CHUNG)}
<p>Ba lệnh, dưới một phút: log của container (kèm mốc giờ), trạng thái của nó (mã thoát, OOMKilled, số lần restart, giờ khởi động), và một báo cáo chẩn đoán của Node lấy bằng tín hiệu — tiến trình vẫn chạy tiếp. Rồi mới deploy lại: <code>up --force-recreate</code> tạo container mới, và <code>docker compose logs</code> giờ cho thấy <strong>không</strong> request nào trong năm request kia; bản ghi duy nhất còn sống là tệp bạn đã lưu, vẫn chứa đúng một dòng giải thích mọi chuyện: <code>học kỳ không hợp lệ: HK0</code>. Với JVM, một phút tương đương là <code>jcmd &lt;pid&gt; Thread.print</code> và <code>GC.heap_info</code> (bài 8.4) trước khi restart. Hãy viết bước lấy bằng chứng vào runbook để người trực lúc 2 giờ sáng làm mà không cần nghĩ.</p>

<h3>6. Gói các luật vào một trang</h3>
${BANG_VI}
<p>Thêm hai luật về con người chứ không về công cụ. <strong>Quyền truy cập là của riêng từng người và được ghi lại</strong>: không bao giờ dùng chung tài khoản production, dùng đúng quy trình "phá kính khẩn cấp" của công ty, và nói trong kênh nhóm việc bạn sắp làm ("mình chạy một câu chỉ đọc trên bảng đơn hàng cho LAB-1042"). <strong>Dữ liệu cá nhân ở yên chỗ của nó</strong>: Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (và Luật Bảo vệ dữ liệu cá nhân có hiệu lực từ 01/01/2026) áp dụng cho cả bản dump cơ sở dữ liệu đó. Cách một nhóm điều hành chính sự cố — ai quyết, ai nói với khách hàng, postmortem — là nội dung của khoá Incident Response; chương này chỉ ở phía gỡ lỗi.</p>

<h3>Đi làm thật</h3>
<p>Trong dự án outsourcing, nhiều khi bạn <em>không</em> có quyền gì trên production: đội vận hành của khách hàng mới có. Khi đó các luật này biến thành điều bạn xin: "nhờ anh gửi 15 phút log API gần nhất của request id 7f3a…", "nhờ chị chạy giúp câu chỉ đọc này", "nhờ lấy thread dump trước khi restart". Viết đúng lệnh vào ticket — kỹ sư bên khách chạy nhanh hơn, và yêu cầu của bạn trông chuyên nghiệp. Khi là intern mà có quyền, hãy chờ đợi nó là quyền chỉ đọc; nếu ai đó đưa quyền ghi "cho nhanh", hãy nhờ trưởng nhóm xác nhận bằng văn bản.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>c101-node.sh</code>. Sửa client để đặt breakpoint ở handler <code>/health</code>. Một load balancer thật với timeout 2 giây và ngưỡng 3 lần trượt sẽ gỡ instance sau bao lâu?</li>
<li>Chạy <code>c101-java.sh</code>; rồi trong IntelliJ, mở hộp thoại breakpoint và tìm chỗ đặt <em>Thread</em> làm mặc định cho breakpoint mới.</li>
<li>Tạo vai trò <code>truc_doc</code> trên cơ sở dữ liệu dự án của bạn. Thử UPDATE, DELETE, <code>BEGIN READ WRITE</code> + UPDATE, và một câu <code>pg_sleep(10)</code>. Ghi lại lớp nào chặn từng lệnh.</li>
<li>Viết lệnh huỷ của ticket LAB-1042 cho schema của bạn theo 7 bước, cố ý cài một lỗi AND/OR. Đảm bảo phép đếm bắt được nó.</li>
<li>Thêm các lệnh "một phút bằng chứng" cho dự án của bạn (Docker hoặc JVM) vào <code>RUNBOOK.md</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được trong hai câu vì sao breakpoint trên production là một sự cố, và có một mục runbook gồm lệnh lấy bằng chứng và quy trình sửa dữ liệu.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Suspend policy</span><span class="v">Breakpoint Java làm dừng cái gì: mọi luồng (mặc định IntelliJ) hay chỉ luồng chạm nó.</span></div>
  <div class="kv"><span class="k">Logpoint</span><span class="v">Breakpoint in ra rồi chạy tiếp; vẫn cần cổng debugger.</span></div>
  <div class="kv"><span class="k">Đặc quyền tối thiểu</span><span class="v">Mỗi người đúng quyền việc cần — đọc thì không cần quyền ghi.</span></div>
  <div class="kv"><span class="k">pg_read_all_data</span><span class="v">Vai trò có sẵn của PostgreSQL: SELECT mọi thứ, không gì khác.</span></div>
  <div class="kv"><span class="k">Dấu vết kiểm toán</span><span class="v">Bản ghi ai đổi gì, lúc nào, vì sao — <code>log_statement=mod</code> + <code>application_name</code>.</span></div>
  <div class="kv"><span class="k">Bằng chứng trước khi restart</span><span class="v">Log, trạng thái container, báo cáo chẩn đoán hoặc thread dump — lấy trong một phút, lưu ra ngoài instance.</span></div>
  <div class="kv"><span class="k">Diagnostic report</span><span class="v">Ảnh chụp JSON của Node (stack, heap, handle) khi nhận tín hiệu, không dừng tiến trình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Breakpoint trên server là một sự cố: Node dừng toàn bộ; Suspend All mặc định của Java treo mọi luồng, Suspend Thread vẫn chặn mọi request đi qua dòng đó.</li>
<li>Xem bằng vai trò không ghi được; quyền là ổ khoá, mặc định chỉ đọc chỉ là dây an toàn.</li>
<li>Sửa dữ liệu theo quy trình: ticket, transaction mở tay, đếm, sao lưu, RETURNING, kiểm, người thứ hai.</li>
<li>Khôi phục trước — sau một phút lấy bằng chứng, vì tạo lại instance là xoá log và trạng thái của nó.</li>
<li>Quyền truy cập là của riêng và được ghi lại; dữ liệu cá nhân production không đi về laptop.</li>
</ul>
${NGUON}
</div>
`,
};
