/**
 * 1.3 — Mức log ở mọi hệ (soạn 22/11/2026).
 * Output: OUT['s01/muc-log'] chạy thật. Nguồn: RFC 5424 §6.2.1 (facility 0–23, severity 0–7, PRI = facility×8 + severity),
 * Microsoft Learn (mức sự kiện Windows), PostgreSQL docs (bảng severity), pino (mức dạng số).
 * Không trùng: obs-1-3-muc-log (chọn mức khi VIẾT log) — ở đây là ĐỌC và LỌC theo mức.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.3 — Log levels across systems: syslog 0–7, Windows levels, application levels|||1.3 — Mức log ở mọi hệ: syslog 0–7, mức của Windows, mức của ứng dụng',
  slug: 'log-1-3-muc-log',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảng đối chiếu mức: syslog 0–7 (emerg→debug) ↔ Windows Critical/Error/Warning/Information/Verbose ↔ ứng dụng fatal/error/warn/info/debug/trace ↔ PostgreSQL và pino (số 10–60); facility của syslog và cách giải mã PRI <86> = authpriv.info; đếm và lọc theo mức trên log mẫu bằng jq/grep; vì sao "Error" không phải lúc nào cũng là sự cố còn "Information" có thể là thứ quan trọng nhất.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Log levels across systems: one idea, four vocabularies</h2>
<p class="lead">Every log system lets the writer say "how serious is this?" — but each uses its own words and numbers. Syslog counts 0 to 7 where <em>smaller is worse</em>; pino counts 10 to 60 where <em>bigger is worse</em>; Windows uses words; PostgreSQL has a level called <code>LOG</code> that sits in a surprising place. After this lesson you can translate between them, filter by level on any system, and avoid the classic mistake of trusting the level too much.</p>

<h3>The everyday picture: a hospital triage desk</h3>
<p>Emergency departments sort patients by colour: red (now), yellow (soon), green (can wait). Every hospital uses colours, but some have five, some four, and the words differ. A log level is a triage colour chosen <em>by the program</em>, in a hurry, without seeing the whole picture — useful for sorting, not a diagnosis.</p>

<h3>Step 1 — the master table</h3>
<table>
<thead><tr><th>Syslog (RFC 5424)</th><th>Windows event level</th><th>Typical app (pino number)</th><th>PostgreSQL</th><th>Meaning in plain words</th></tr></thead>
<tbody>
<tr><td>0 emerg</td><td rowspan="3">Critical</td><td rowspan="3">fatal (60)</td><td>PANIC</td><td>The whole system is unusable</td></tr>
<tr><td>1 alert</td><td></td><td>Act immediately</td></tr>
<tr><td>2 crit</td><td>FATAL</td><td>A component died (for PostgreSQL: one session ended)</td></tr>
<tr><td>3 err</td><td>Error</td><td>error (50)</td><td>ERROR</td><td>An operation failed</td></tr>
<tr><td>4 warning</td><td>Warning</td><td>warn (40)</td><td>WARNING</td><td>Something unusual; may become a problem</td></tr>
<tr><td>5 notice</td><td rowspan="2">Information</td><td rowspan="2">info (30)</td><td>NOTICE</td><td>Normal but worth noting</td></tr>
<tr><td>6 info</td><td>INFO, LOG</td><td>Normal operation</td></tr>
<tr><td>7 debug</td><td>Verbose</td><td>debug (20), trace (10)</td><td>DEBUG1–5</td><td>Detail for developers</td></tr>
</tbody></table>
<p>Two oddities worth remembering. In PostgreSQL, <code>LOG</code> is used for administrative messages (checkpoints, connections, slow statements) and in the server log it ranks <em>between</em> ERROR and FATAL when deciding what to write — so do not read "LOG" as "unimportant debug". And Windows has a fifth event kind in the Security log that is not a level at all: <em>Audit Success</em> / <em>Audit Failure</em> (Chapter 4).</p>

<h3>Step 2 — count by level in a real file</h3>
<p>The sample app writes pino-style JSON with a numeric <code>level</code>. Count them, then translate the numbers into names:</p>
${lenh('s01/muc-log', 0)}
${lenh('s01/muc-log', 4)}
<p>And look at what the errors actually say — a level only tells you where to look; the message tells you what happened:</p>
${lenh('s01/muc-log', 1)}
<p>All 25 errors are the same message. That is typical: one root cause produces a burst of identical errors. "25 errors" sounds like 25 problems; it is one.</p>

<h3>Step 3 — levels in text logs</h3>
<p>Text formats put the level in brackets or after the timestamp. A short pattern pulls it out (Chapter 2 explains <code>grep -o</code>):</p>
${lenh('s01/muc-log', 2)}
${lenh('s01/muc-log', 3)}
<p>nginx's error log uses <code>debug, info, notice, warn, error, crit, alert, emerg</code> — the syslog names. PostgreSQL wrote five <code>LOG</code> lines during the outage, including "database system was not properly shut down" — a very important message at a modest-looking level.</p>

<h3>Step 4 — syslog facilities and the &lt;PRI&gt; number</h3>
<p>Syslog adds a second label: the <strong>facility</strong> — which part of the system sent the message (0 kern, 1 user, 3 daemon, 4 auth, 10 authpriv, 16–23 local0–local7, among others). On the wire, a syslog message starts with <code>&lt;PRI&gt;</code> where <strong>PRI = facility × 8 + severity</strong>. You will see raw PRI numbers in router logs and in syslog captures:</p>
${lenh('s01/muc-log', 5)}
${lenh('s01/muc-log', 6)}
<p>So <code>&lt;86&gt;</code> is facility 10 (authpriv), severity 6 (info) — a normal authentication message. Rsyslog rules such as <code>authpriv.* /var/log/auth.log</code> (Chapter 8) route messages by exactly these two numbers.</p>

<h3>Step 5 — filtering by level on each system (preview)</h3>
<table>
<thead><tr><th>System</th><th>"Errors and worse only"</th><th>Taught in</th></tr></thead>
<tbody>
<tr><td>Linux journal</td><td><code>journalctl -p err</code> (means priority 0–3)</td><td>7.2</td></tr>
<tr><td>Windows</td><td>Event Viewer → Filter Current Log → Critical + Error; or <code>Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}</code></td><td>3.4, 5.2</td></tr>
<tr><td>JSON app log</td><td><code>jq 'select(.level &gt;= 50)'</code></td><td>2.4</td></tr>
<tr><td>Text log</td><td><code>grep -E '\\[(error|crit|alert|emerg)\\]'</code></td><td>2.2</td></tr>
</tbody></table>
<p>Windows level numbers in queries are 1 Critical, 2 Error, 3 Warning, 4 Information, 5 Verbose (Information events are sometimes stored as 0). Chapter 5 handles that quirk.</p>

<h3>Real situation: "Event Viewer is full of red errors — is my PC broken?"</h3>
<p>Almost every healthy Windows machine has hundreds of Error events: a driver that retries, a service that times out once at boot, an app that logs a harmless failure. Errors that repeat for months without symptoms are background noise. What deserves attention is <strong>a change</strong>: a new error that started the day the problem started, or an error right before the symptom. Conversely, the most important security events are often <em>Information</em> level — "a new user account was created" is not an error at all.</p>
<div class="pitfall co-tieu-de"><p><strong>The level is the writer's opinion.</strong> Programmers choose levels in a hurry: some log expected failures as ERROR, some log real problems as INFO. Use levels to sort, never to dismiss. In an investigation, read the INFO lines around the moment that matters.</p></div>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok"><ol>
<li>In the pack, run the jq and grep commands from Steps 2–3 yourself and check you get the same counts (695 / 22 / 25; 3 <code>[error]</code>; 5 <code>LOG:</code>).</li>
<li>Decode by hand: <code>&lt;38&gt;</code>, <code>&lt;11&gt;</code>, <code>&lt;134&gt;</code> (facility and severity names). Check with the shell arithmetic from Step 4.</li>
<li>On your own machine, count errors in the last day: Windows — Event Viewer → System → Filter Current Log → Error, Logged: Last 24 hours; Linux/WSL — <code>journalctl -p err --since yesterday | wc -l</code>. Pick one error and decide: noise or symptom? Write why.</li>
</ol>
<p><strong>Done when:</strong> your counts match, you decoded <code>&lt;38&gt;</code> = auth.info, <code>&lt;11&gt;</code> = user.err, <code>&lt;134&gt;</code> = local0.info, and you wrote a one-line verdict on one real error from your machine.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['severity / level', 'How serious the writer thinks an event is.'],
  ['facility', 'Syslog’s label for which part of the system sent a message (auth, kern, local0…).'],
  ['PRI', 'Syslog’s number at the start of a message: facility × 8 + severity.'],
  ['Verbose', 'Windows’ most detailed level, like debug.'],
  ['Audit Success / Failure', 'Windows Security log outcomes, separate from levels.'],
  ['noise', 'Repeated, harmless messages that hide the important ones.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Syslog: 0 emerg … 7 debug, smaller is worse; pino: 10 trace … 60 fatal, bigger is worse; Windows uses words.</li>
<li>PostgreSQL's <code>LOG</code> carries important admin messages — not "debug".</li>
<li>PRI = facility × 8 + severity; <code>&lt;86&gt;</code> = authpriv.info.</li>
<li>Many identical errors usually mean one cause; count messages, not just levels.</li>
<li>Levels sort, they do not diagnose: look for changes, and read INFO lines around the key moment.</li>
</ul>
${nguon('📘', 'RFC 5424 §6.2.1 — PRI, facility and severity', 'The tables of facility codes 0–23 and severity 0–7', 'https://www.rfc-editor.org/rfc/rfc5424#section-6.2.1')}
${nguon('📘', 'PostgreSQL — Message severity levels', 'Table of DEBUG…PANIC and where LOG sits', 'https://www.postgresql.org/docs/current/runtime-config-logging.html')}
${nguon('📗', 'pino — log levels', 'Numeric values of trace, debug, info, warn, error, fatal', 'https://getpino.io/#/docs/api')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-3-muc-log', title: 'Observability 1.3 — choosing log levels', sub: 'The writer’s side: which level to use when you write logs', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Mức log ở mọi hệ: một ý tưởng, bốn bộ từ vựng</h2>
<p class="lead">Hệ thống log nào cũng cho người viết nói "chuyện này nghiêm trọng tới đâu?" — nhưng mỗi nơi dùng chữ và số riêng. Syslog đếm 0 tới 7, <em>số càng nhỏ càng tệ</em>; pino đếm 10 tới 60, <em>số càng lớn càng tệ</em>; Windows dùng chữ; PostgreSQL có một mức tên <code>LOG</code> nằm ở chỗ bất ngờ. Hết bài bạn dịch qua lại được giữa chúng, lọc theo mức trên mọi hệ, và tránh được sai lầm kinh điển: tin mức log quá nhiều.</p>

<h3>Liên tưởng đời thường: bàn phân loại ở phòng cấp cứu</h3>
<p>Phòng cấp cứu xếp bệnh nhân theo màu: đỏ (ngay lập tức), vàng (sớm), xanh (chờ được). Bệnh viện nào cũng dùng màu, nhưng nơi năm màu, nơi bốn màu, tên gọi khác nhau. Mức log là một màu phân loại do <em>chương trình</em> chọn, trong lúc vội, không thấy toàn cảnh — có ích để sắp xếp, không phải chẩn đoán.</p>

<h3>Bước 1 — bảng đối chiếu tổng</h3>
<table>
<thead><tr><th>Syslog (RFC 5424)</th><th>Mức sự kiện Windows</th><th>App thường gặp (số của pino)</th><th>PostgreSQL</th><th>Nghĩa bằng lời thường</th></tr></thead>
<tbody>
<tr><td>0 emerg</td><td rowspan="3">Critical</td><td rowspan="3">fatal (60)</td><td>PANIC</td><td>Cả hệ thống không dùng được</td></tr>
<tr><td>1 alert</td><td></td><td>Phải xử lý ngay</td></tr>
<tr><td>2 crit</td><td>FATAL</td><td>Một thành phần chết (với PostgreSQL: một phiên kết thúc)</td></tr>
<tr><td>3 err</td><td>Error</td><td>error (50)</td><td>ERROR</td><td>Một thao tác thất bại</td></tr>
<tr><td>4 warning</td><td>Warning</td><td>warn (40)</td><td>WARNING</td><td>Có điều bất thường; có thể thành vấn đề</td></tr>
<tr><td>5 notice</td><td rowspan="2">Information</td><td rowspan="2">info (30)</td><td>NOTICE</td><td>Bình thường nhưng đáng ghi chú</td></tr>
<tr><td>6 info</td><td>INFO, LOG</td><td>Hoạt động bình thường</td></tr>
<tr><td>7 debug</td><td>Verbose</td><td>debug (20), trace (10)</td><td>DEBUG1–5</td><td>Chi tiết cho lập trình viên</td></tr>
</tbody></table>
<p>Hai điểm lạ nên nhớ. Ở PostgreSQL, <code>LOG</code> dùng cho thông điệp quản trị (checkpoint, kết nối, câu lệnh chậm) và khi quyết định ghi gì vào log server, nó được xếp <em>giữa</em> ERROR và FATAL — nên đừng đọc "LOG" thành "debug vớ vẩn". Còn Windows có loại sự kiện thứ năm trong nhật ký Security mà chẳng phải mức: <em>Audit Success</em> / <em>Audit Failure</em> (kiểm toán thành công / thất bại — Chương 4).</p>

<h3>Bước 2 — đếm theo mức trong một tệp thật</h3>
<p>App mẫu ghi JSON kiểu pino với trường số <code>level</code>. Đếm chúng, rồi dịch số ra tên:</p>
${lenh('s01/muc-log', 0)}
${lenh('s01/muc-log', 4)}
<p>Và xem các lỗi thật sự nói gì — mức chỉ cho biết nhìn vào đâu; thông điệp mới cho biết chuyện gì xảy ra:</p>
${lenh('s01/muc-log', 1)}
<p>Cả 25 lỗi là cùng một thông điệp. Rất điển hình: một nguyên nhân gốc sinh ra một tràng lỗi giống hệt nhau. "25 lỗi" nghe như 25 vấn đề; thực ra là một.</p>

<h3>Bước 3 — mức trong log văn bản</h3>
<p>Định dạng văn bản đặt mức trong ngoặc vuông hoặc ngay sau thời điểm. Một mẫu ngắn rút nó ra (Chương 2 giải thích <code>grep -o</code>):</p>
${lenh('s01/muc-log', 2)}
${lenh('s01/muc-log', 3)}
<p>Error log của nginx dùng <code>debug, info, notice, warn, error, crit, alert, emerg</code> — chính tên của syslog. PostgreSQL ghi năm dòng <code>LOG</code> trong lúc sự cố, trong đó có "database system was not properly shut down" — một thông điệp rất quan trọng ở một mức trông khiêm tốn.</p>

<h3>Bước 4 — facility của syslog và con số &lt;PRI&gt;</h3>
<p>Syslog thêm nhãn thứ hai: <strong>facility</strong> (nhóm nguồn) — phần nào của hệ thống gửi thông điệp (0 kern, 1 user, 3 daemon, 4 auth, 10 authpriv, 16–23 local0–local7, cùng vài nhóm khác). Khi truyền đi, thông điệp syslog bắt đầu bằng <code>&lt;PRI&gt;</code> với <strong>PRI = facility × 8 + severity</strong>. Bạn sẽ gặp con số PRI thô trong log router và khi bắt gói syslog:</p>
${lenh('s01/muc-log', 5)}
${lenh('s01/muc-log', 6)}
<p>Vậy <code>&lt;86&gt;</code> là facility 10 (authpriv), severity 6 (info) — một thông điệp xác thực bình thường. Luật của rsyslog như <code>authpriv.* /var/log/auth.log</code> (Chương 8) chia đường thông điệp theo đúng hai con số này.</p>

<h3>Bước 5 — lọc theo mức trên từng hệ (xem trước)</h3>
<table>
<thead><tr><th>Hệ thống</th><th>"Chỉ lỗi và tệ hơn"</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>Journal của Linux</td><td><code>journalctl -p err</code> (nghĩa là mức 0–3)</td><td>7.2</td></tr>
<tr><td>Windows</td><td>Event Viewer → Filter Current Log → Critical + Error; hoặc <code>Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}</code></td><td>3.4, 5.2</td></tr>
<tr><td>Log JSON của app</td><td><code>jq 'select(.level &gt;= 50)'</code></td><td>2.4</td></tr>
<tr><td>Log văn bản</td><td><code>grep -E '\\[(error|crit|alert|emerg)\\]'</code></td><td>2.2</td></tr>
</tbody></table>
<p>Số mức của Windows khi truy vấn là 1 Critical, 2 Error, 3 Warning, 4 Information, 5 Verbose (sự kiện Information đôi khi được lưu là 0). Chương 5 xử lý chỗ lắt léo này.</p>

<h3>Tình huống thật: "Event Viewer đỏ lòm toàn Error — máy em hỏng à?"</h3>
<p>Gần như máy Windows khoẻ mạnh nào cũng có hàng trăm sự kiện Error: một driver thử lại, một dịch vụ hết thời gian chờ một lần lúc khởi động, một app ghi một lỗi vô hại. Lỗi lặp lại nhiều tháng mà không có triệu chứng gì là tiếng ồn nền. Cái đáng chú ý là <strong>sự thay đổi</strong>: một lỗi mới xuất hiện đúng ngày vấn đề bắt đầu, hay một lỗi ngay trước lúc có triệu chứng. Ngược lại, những sự kiện bảo mật quan trọng nhất thường ở mức <em>Information</em> — "một tài khoản người dùng mới được tạo" chẳng phải lỗi gì cả.</p>
<div class="pitfall co-tieu-de"><p><strong>Mức log là ý kiến của người viết.</strong> Lập trình viên chọn mức trong lúc vội: có người ghi lỗi dự kiến là ERROR, có người ghi sự cố thật là INFO. Dùng mức để sắp xếp, đừng bao giờ dùng để gạt bỏ. Khi điều tra, hãy đọc cả các dòng INFO quanh thời điểm quan trọng.</p></div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Trong gói mẫu, tự chạy các lệnh jq và grep ở Bước 2–3 và kiểm ra đúng các con số (695 / 22 / 25; 3 <code>[error]</code>; 5 <code>LOG:</code>).</li>
<li>Giải mã bằng tay: <code>&lt;38&gt;</code>, <code>&lt;11&gt;</code>, <code>&lt;134&gt;</code> (tên facility và severity). Kiểm lại bằng phép tính shell ở Bước 4.</li>
<li>Trên máy của bạn, đếm lỗi trong một ngày qua: Windows — Event Viewer → System → Filter Current Log → Error, Logged: Last 24 hours; Linux/WSL — <code>journalctl -p err --since yesterday | wc -l</code>. Chọn một lỗi và quyết định: tiếng ồn hay triệu chứng? Ghi lý do.</li>
</ol>
<p><strong>Đạt khi:</strong> số đếm của bạn khớp, bạn giải ra <code>&lt;38&gt;</code> = auth.info, <code>&lt;11&gt;</code> = user.err, <code>&lt;134&gt;</code> = local0.info, và đã viết một dòng kết luận về một lỗi thật trên máy mình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['severity / level (mức)', 'Người viết cho rằng sự kiện nghiêm trọng tới đâu.'],
  ['facility (nhóm nguồn)', 'Nhãn của syslog cho biết phần nào của hệ thống gửi thông điệp (auth, kern, local0…).'],
  ['PRI', 'Con số ở đầu thông điệp syslog: facility × 8 + severity.'],
  ['Verbose', 'Mức chi tiết nhất của Windows, giống debug.'],
  ['Audit Success / Failure', 'Kết quả kiểm toán trong nhật ký Security của Windows, tách riêng khỏi mức.'],
  ['noise (tiếng ồn)', 'Thông điệp lặp lại, vô hại, che mất những cái quan trọng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Syslog: 0 emerg … 7 debug, số nhỏ là tệ; pino: 10 trace … 60 fatal, số lớn là tệ; Windows dùng chữ.</li>
<li><code>LOG</code> của PostgreSQL mang thông điệp quản trị quan trọng — không phải "debug".</li>
<li>PRI = facility × 8 + severity; <code>&lt;86&gt;</code> = authpriv.info.</li>
<li>Nhiều lỗi giống hệt nhau thường chỉ là một nguyên nhân; đếm theo thông điệp, đừng chỉ đếm theo mức.</li>
<li>Mức để sắp xếp, không để chẩn đoán: tìm sự thay đổi, và đọc cả dòng INFO quanh thời điểm then chốt.</li>
</ul>
${nguon('📘', 'RFC 5424 §6.2.1 — PRI, facility và severity', 'Bảng mã facility 0–23 và severity 0–7', 'https://www.rfc-editor.org/rfc/rfc5424#section-6.2.1')}
${nguon('📘', 'PostgreSQL — Message severity levels', 'Bảng DEBUG…PANIC và vị trí của LOG', 'https://www.postgresql.org/docs/current/runtime-config-logging.html')}
${nguon('📗', 'pino — các mức log', 'Giá trị số của trace, debug, info, warn, error, fatal', 'https://getpino.io/#/docs/api')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-3-muc-log', title: 'Observability 1.3 — chọn mức log', sub: 'Phía người viết: dùng mức nào khi ghi log' })}
</div>
`,
};
