/**
 * Authentication · Mục 0 · Bắt đầu tại đây (2/2) — auth-0-9-bat-dau-su-co (BÀI MỚI 01/11/2026, đợt mẫu).
 * Bảy sự cố thật, mỗi cái KIỂM NGUỒN bằng WebFetch ngày 01/11/2026 và gắn với chương ngăn nó; phát lại LinkedIn 2012 chạy thật
 * (demo0/linkedin-replay.mjs: 10.001 SHA-1 trong 11,8 ms); tình huống SV (minh hoạ); học thế nào không nản.
 */
import G from '../giang/auth-00-9.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🎵', 'Wikipedia — RockYou', 'December 2009; over 32 million accounts; “plaintext passwords” in an unencrypted database (read 01/11/2026).', 'https://en.wikipedia.org/wiki/RockYou'),
  nguon('💼', 'TechCrunch (6 June 2012) — 6.5 million LinkedIn passwords leaked', 'Passwords “stored as unsalted SHA-1 hashes” (read 01/11/2026).', 'https://techcrunch.com/2012/06/06/6-5-million-linkedin-passwords-reportedly-leaked-linkedin-is-looking-into-it/'),
  nguon('💼', 'Wikipedia — 2012 LinkedIn hack', 'Hacked 5 June 2012; in May 2016 another 100 million emails and hashed passwords surfaced (read 01/11/2026).', 'https://en.wikipedia.org/wiki/2012_LinkedIn_hack'),
  nguon('📘', 'Krebs on Security (21 March 2019) — Facebook stored passwords in plain text', 'Between 200 and 600 million users, searchable by more than 20,000 employees, archives back to 2012 (read 01/11/2026).', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  nguon('🎧', 'Okta Security — support system incident root cause (Nov 2023)', 'HAR files with session tokens; 134 customers; sessions of 5 hijacked; 28 Sep – 17 Oct 2023 (read 01/11/2026).', 'https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause'),
  nguon('✉️', 'Microsoft Security Blog (14 July 2023) — Storm-0558', 'An acquired MSA consumer signing key forged tokens for OWA and Outlook.com; a validation flaw let it sign enterprise tokens (read 01/11/2026).', 'https://www.microsoft.com/en-us/security/blog/2023/07/14/analysis-of-storm-0558-techniques-for-unauthorized-email-access/'),
  nguon('🧬', 'Wikipedia — 23andMe data leak', 'Credential stuffing; data of about 6.9 million users confirmed 6 October 2023 (read 01/11/2026).', 'https://en.wikipedia.org/wiki/23andMe_data_leak'),
  nguon('❄️', 'Google Cloud / Mandiant (11 June 2024) — UNC5537 and Snowflake', 'Infostealer credentials, accounts without MFA, ~165 organizations notified, no breach of Snowflake itself (read 01/11/2026).', 'https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion'),
].join('\n');
const NGUON_VI = [
  nguon('🎵', 'Wikipedia — RockYou', 'Tháng 12/2009; hơn 32 triệu tài khoản; "plaintext passwords" trong một CSDL không mã hoá (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/RockYou'),
  nguon('💼', 'TechCrunch (06/06/2012) — 6,5 triệu mật khẩu LinkedIn bị lộ', 'Mật khẩu "stored as unsalted SHA-1 hashes" (đọc 01/11/2026).', 'https://techcrunch.com/2012/06/06/6-5-million-linkedin-passwords-reportedly-leaked-linkedin-is-looking-into-it/'),
  nguon('💼', 'Wikipedia — 2012 LinkedIn hack', 'Bị tấn công 05/06/2012; tháng 5/2016 lộ thêm 100 triệu email và mật khẩu đã băm (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/2012_LinkedIn_hack'),
  nguon('📘', 'Krebs on Security (21/03/2019) — Facebook lưu mật khẩu dạng chữ thường', 'Từ 200 tới 600 triệu người dùng, hơn 20.000 nhân viên tra được, lưu trữ từ 2012 (đọc 01/11/2026).', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  nguon('🎧', 'Okta Security — nguyên nhân sự cố hệ thống hỗ trợ (11/2023)', 'Tệp HAR chứa token phiên; 134 khách hàng; 5 phiên bị chiếm; 28/9 – 17/10/2023 (đọc 01/11/2026).', 'https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause'),
  nguon('✉️', 'Microsoft Security Blog (14/07/2023) — Storm-0558', 'Một khoá ký MSA dành cho người dùng cá nhân bị lấy, dùng giả token vào OWA và Outlook.com; lỗi kiểm cho phép nó ký cả token doanh nghiệp (đọc 01/11/2026).', 'https://www.microsoft.com/en-us/security/blog/2023/07/14/analysis-of-storm-0558-techniques-for-unauthorized-email-access/'),
  nguon('🧬', 'Wikipedia — 23andMe data leak', 'Credential stuffing; dữ liệu của khoảng 6,9 triệu người được xác nhận ngày 06/10/2023 (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/23andMe_data_leak'),
  nguon('❄️', 'Google Cloud / Mandiant (11/06/2024) — UNC5537 và Snowflake', 'Thông tin đăng nhập từ mã độc đánh cắp, tài khoản không bật MFA, ~165 tổ chức được báo, Snowflake không bị xâm nhập (đọc 01/11/2026).', 'https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion'),
].join('\n');

const SC_EN = `<table>
<thead><tr><th>Incident</th><th>What went wrong</th><th>The chapter that prevents it</th></tr></thead>
<tbody>
<tr><td><strong>RockYou</strong>, Dec 2009</td><td>32 million+ passwords stored in <strong>plaintext</strong>; the list became the attackers' standard dictionary</td><td>Ch2 — never store the password, only a slow salted hash</td></tr>
<tr><td><strong>LinkedIn</strong>, Jun 2012</td><td>~6.5 million passwords as <strong>unsalted SHA-1</strong>; a further 100 million surfaced in 2016</td><td>Ch2 — salt and a slow hash (replay below)</td></tr>
<tr><td><strong>Facebook</strong>, reported Mar 2019</td><td>200–600 million passwords in <strong>internal logs</strong>, searchable by 20,000+ employees, since 2012</td><td>Ch1 lesson 1.5 — log an allow-list, never the request body</td></tr>
<tr><td><strong>Microsoft Storm-0558</strong>, 2023</td><td>A stolen <strong>signing key</strong> forged tokens for email; a validation flaw accepted a consumer key for enterprise tokens</td><td>Ch1.4 + Ch4 — who holds which key; check the issuer and key id</td></tr>
<tr><td><strong>Okta support</strong>, Sep–Oct 2023</td><td><strong>Session tokens</strong> inside HAR files uploaded for support; 5 customers' sessions hijacked</td><td>Ch1.1 + Ch3 — bearer tokens travel; bind and expire them</td></tr>
<tr><td><strong>23andMe</strong>, Oct 2023</td><td><strong>Credential stuffing</strong> with passwords reused from other breaches; data of ~6.9 million people</td><td>Ch2.4 + Ch7 + Ch10 — breached-password checks, MFA, rate limits</td></tr>
<tr><td><strong>Snowflake customers</strong>, 2024</td><td>Passwords stolen by infostealer malware, accounts <strong>without MFA</strong>, ~165 organizations</td><td>Ch7 + Ch11 — require a second factor, rotate credentials</td></tr>
</tbody>
</table>`;
const SC_VI = `<table>
<thead><tr><th>Sự cố</th><th>Hỏng ở đâu</th><th>Chương ngăn được nó</th></tr></thead>
<tbody>
<tr><td><strong>RockYou</strong>, 12/2009</td><td>Hơn 32 triệu mật khẩu lưu <strong>dạng chữ thường</strong>; danh sách đó thành từ điển chuẩn của kẻ tấn công</td><td>Ch2 — không bao giờ lưu mật khẩu, chỉ lưu bản băm chậm có muối</td></tr>
<tr><td><strong>LinkedIn</strong>, 6/2012</td><td>~6,5 triệu mật khẩu dạng <strong>SHA-1 không muối</strong>; năm 2016 lộ thêm 100 triệu</td><td>Ch2 — muối và hàm băm chậm (phát lại bên dưới)</td></tr>
<tr><td><strong>Facebook</strong>, công bố 3/2019</td><td>200–600 triệu mật khẩu nằm trong <strong>log nội bộ</strong>, hơn 20.000 nhân viên tra được, từ 2012</td><td>Ch1 bài 1.5 — log theo danh sách cho phép, không bao giờ log thân request</td></tr>
<tr><td><strong>Microsoft Storm-0558</strong>, 2023</td><td>Một <strong>khoá ký</strong> bị lấy dùng để giả token vào email; lỗi kiểm chấp nhận khoá cá nhân cho token doanh nghiệp</td><td>Ch1.4 + Ch4 — ai giữ khoá nào; kiểm bên phát hành và mã khoá</td></tr>
<tr><td><strong>Hỗ trợ của Okta</strong>, 9–10/2023</td><td><strong>Token phiên</strong> nằm trong tệp HAR gửi kèm yêu cầu hỗ trợ; phiên của 5 khách hàng bị chiếm</td><td>Ch1.1 + Ch3 — token kiểu "ai cầm là người đó" đi xa; gắn và cho nó hết hạn</td></tr>
<tr><td><strong>23andMe</strong>, 10/2023</td><td><strong>Nhồi tín vật (credential stuffing)</strong> bằng mật khẩu dùng lại từ vụ lộ khác; dữ liệu của ~6,9 triệu người</td><td>Ch2.4 + Ch7 + Ch10 — kiểm mật khẩu đã lộ, MFA, giới hạn tần suất</td></tr>
<tr><td><strong>Khách hàng Snowflake</strong>, 2024</td><td>Mật khẩu bị mã độc đánh cắp, tài khoản <strong>không bật MFA</strong>, ~165 tổ chức</td><td>Ch7 + Ch11 — bắt buộc yếu tố thứ hai, xoay vòng thông tin đăng nhập</td></tr>
</tbody>
</table>`;

const LO_EN = `<table>
<thead><tr><th></th><th>Minimum path (~4 weeks)</th><th>Full path (~10 weeks)</th></tr></thead>
<tbody>
<tr><td>Read</td><td>Mục 0, Ch1, Ch2, Ch3, Ch4, Ch5, Ch9</td><td>All 13 sections in order</td></tr>
<tr><td>Do</td><td>Every 🧪 Practice; Labs 1, 2, 3, 5</td><td>Every Practice, every Lab, the Code Lab sets</td></tr>
<tr><td>Check</td><td>The chapter quiz (≥ 7/10) before moving on</td><td>Quiz + Lab grader ≥ 7/10, then the final project</td></tr>
<tr><td>Enough for</td><td>A correct login + sessions/JWT in SWP391</td><td>A production-grade identity service and interview stories</td></tr>
</tbody>
</table>`;
const LO_VI = `<table>
<thead><tr><th></th><th>Lộ trình tối thiểu (~4 tuần)</th><th>Lộ trình đầy đủ (~10 tuần)</th></tr></thead>
<tbody>
<tr><td>Đọc</td><td>Mục 0, Ch1, Ch2, Ch3, Ch4, Ch5, Ch9</td><td>Cả 13 mục theo thứ tự</td></tr>
<tr><td>Làm</td><td>Mọi 🧪 Thực hành; Lab 1, 2, 3, 5</td><td>Mọi Thực hành, mọi Lab, các bộ Code Lab</td></tr>
<tr><td>Kiểm</td><td>Quiz chương (≥ 7/10) trước khi đi tiếp</td><td>Quiz + máy chấm Lab ≥ 7/10, rồi dự án cuối khoá</td></tr>
<tr><td>Đủ để</td><td>Đăng nhập đúng + phiên/JWT cho SWP391</td><td>Một dịch vụ danh tính chạy production và chuyện để kể khi phỏng vấn</td></tr>
</tbody>
</table>`;

export default {
  title: 'Start here (2/2) — Real incidents, and how to study this course without burning out|||Bắt đầu tại đây (2/2) — Sự cố thật, và cách học khoá này không nản',
  slug: 'auth-0-9-bat-dau-su-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy sự cố xác thực thật có nguồn (RockYou 2009, LinkedIn 2012, Facebook 2019, Storm-0558 2023, Okta 2023, 23andMe 2023, Snowflake 2024), mỗi cái gắn với chương ngăn được nó; phát lại vụ LinkedIn chạy thật (10.001 SHA-1 trong 11,8 ms, mật khẩu của Bình lộ ngay), thêm muối rồi vẫn đoán được Bình trong 0,26 ms; một tình huống đồ án minh hoạ; lộ trình tối thiểu/đầy đủ và nhịp một buổi học.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>What happens when authentication goes wrong — and how to learn it without burning out</h2>
<p class="lead">Lesson 1/2 showed what authentication is. This one shows what it costs to get it wrong: seven real incidents from companies far larger than any you will join first, each traced to one mistake and to the chapter of this course that prevents it. Then you will replay one of them on your laptop in under a second — and get a study plan you can keep.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>tell seven real authentication incidents in one sentence each, with the root cause and a source;</li>
<li>explain why “we hashed the passwords” was not enough in 2012, with a replay you ran yourself;</li>
<li>see the pattern: almost no incident broke cryptography — they stored, logged or carried a credential carelessly;</li>
<li>pick the minimum or the full path through this course and plan a study session.</li>
</ul>
<p><strong>Why it is worth your time:</strong> these stories are how senior engineers argue in design reviews (“remember Okta's HAR files?”), and naming one correctly in an interview is worth more than any definition.</p>
</div>

<h3>Seven incidents, seven lessons</h3>
<p>Every line below was checked against the source in the cards at the end (read 01/11/2026). Numbers are the ones the sources give — some are estimates, and we say so.</p>
${SC_EN}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Created</span><span class="lz-t">weak or reused</span><span class="lz-d">RockYou list, 23andMe stuffing — Ch2, Ch10</span></div>
  <div class="lz-step"><span class="lz-k">Stored</span><span class="lz-t">plaintext or fast hash</span><span class="lz-d">RockYou, LinkedIn — Ch2</span></div>
  <div class="lz-step"><span class="lz-k">Logged / attached</span><span class="lz-t">logs, HAR files</span><span class="lz-d">Facebook, Okta — Ch1.5, Ch3</span></div>
  <div class="lz-step"><span class="lz-k">Signed</span><span class="lz-t">a key that leaked or was over-trusted</span><span class="lz-d">Storm-0558 — Ch1.4, Ch4, Ch11</span></div>
  <div class="lz-step"><span class="lz-k">Used alone</span><span class="lz-t">no second factor</span><span class="lz-d">Snowflake customers — Ch7</span></div>
</div>
<p>Look at the pattern: not one of these attackers broke SHA-1, AES or a signature algorithm. They found a credential that was <strong>stored, logged, attached or trusted</strong> carelessly — the exact places this course measures.</p>

<h3>Replay LinkedIn 2012 on your laptop</h3>
<p>LinkedIn stored passwords as unsalted SHA-1. Unsalted means the same password always produces the same hash, for every user, on every site. So an attacker hashes a list of common passwords <strong>once</strong> and looks every leaked hash up in that table. Here is that attack against a three-user “leak” of LabFlow (the 10,001-line SecLists list is downloaded into <code>wordlists/</code> in lesson 0.3):</p>
${ma('javascript', CODE.linkedin)}
${ra(OUT['09-linkedin'])}
<p>11.8 ms to hash ten thousand passwords, and Bình's <code>123456</code> falls instantly — it is the second line of the list. An and Cô Lan survive only because their passwords are not common <em>yet</em>. And the table is reusable: computed once, it cracks every account with a common password in every unsalted dump, forever.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — “we hash passwords” sounds safe and is not a sentence that means anything.</strong> Which hash? With a salt? How slow? SHA-1 and SHA-256 are designed to be <em>fast</em>; Node computes millions per second on one core. Chapter 2 measures it and replaces it with argon2id. The practice below shows that adding a salt alone is not enough either.</p>
</div>

<h3>A scenario you may recognise <em>(illustration, not a real incident)</em></h3>
<p>A SWP391 team builds a booking site in three weeks. Passwords go into the <code>users</code> table as typed — “we will hash them later”. For the demo, a teammate exports the database to a shared drive so everyone can test. Someone pastes a failing request, session token and all, into the team chat to ask for help. On demo day the lecturer opens the export: every classmate's password, several of them the same password they use for their FPT email. Nobody attacked anything. Every step was a shortcut — and each one is a lesson in this course: plaintext (Ch2), a token in a chat log (1.5), a session that never expires (Ch3).</p>

<h3>How to study this course without burning out</h3>
${LO_EN}
<p><strong>One session, about 90 minutes:</strong></p>
<ol>
<li><strong>10 min — slides.</strong> Read the slides and the short explanation under each; just get the shape of the idea.</li>
<li><strong>40 min — the written lesson, terminal open.</strong> Run every command yourself; compare your output with ours. Different numbers are fine; a different <em>shape</em> means stop and find out why.</li>
<li><strong>25 min — 🧪 Practice.</strong> Try before reading the solution. “Done when” tells you when to stop.</li>
<li><strong>15 min — Code Lab.</strong> The “🏋️ Practice” button under the lesson opens exercises graded in the browser; aim for Accepted, not for speed.</li>
</ol>
<p>Rules that keep you going: one lesson per session, never two; if a lesson takes more than two sessions, skip its last section and come back after the chapter quiz; keep your LabFlow ID folder — every chapter builds on it; and when an output differs from ours, that is the most valuable moment of the lesson, not a failure.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Tell me about a security incident you learned from.”</strong> — Pick one from the table, give the root cause in one sentence and the control that prevents it. Okta 2023 (session tokens in HAR files) and Storm-0558 (an over-trusted signing key) are recent and impressive.</li>
<li><strong>“Is MFA worth it?”</strong> — Snowflake 2024: the affected accounts had valid stolen passwords and no MFA; Mandiant found no breach of Snowflake itself.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo0/linkedin-replay.mjs</code>. Then edit the three “leaked” passwords to ones of your own choosing (not your real ones) and see which fall.</li>
<li>Write <code>demo0/th09.mjs</code>: store Bình's password with a random 16-byte <strong>salt</strong> (<code>sha1(salt + password)</code>), check whether the precomputed table still finds her, then guess her password directly using her salt.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th09)}
${ra(OUT['09-thuc-hanh'])}
<p>The salt killed the shared table: <code>false</code>. But an attacker who targets one user just hashes the list again with her salt — and <code>123456</code> is guess number 2, found in a quarter of a millisecond. Salt stops <em>one</em> computation from cracking <em>everyone</em>; only a slow hash (and a policy that rejects <code>123456</code>) makes each guess expensive. That is Chapter 2.</p>
<p><strong>Done when:</strong> you can say why the first line is <code>false</code> and why the second still finds the password, and you have picked your path (minimum or full) from the table above.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">plaintext password</span><span class="v">A password stored exactly as typed; one leak exposes all of them.</span></div>
  <div class="kv"><span class="k">salt</span><span class="v">Random bytes stored with each hash so equal passwords hash differently; kills precomputed tables.</span></div>
  <div class="kv"><span class="k">credential stuffing</span><span class="v">Trying username/password pairs leaked from other sites; works because people reuse passwords.</span></div>
  <div class="kv"><span class="k">HAR file</span><span class="v">A browser export of network traffic — headers, cookies and tokens included.</span></div>
  <div class="kv"><span class="k">signing key</span><span class="v">The key that makes tokens trustworthy; whoever holds it can issue them.</span></div>
  <div class="kv"><span class="k">infostealer</span><span class="v">Malware that copies saved passwords and cookies from a victim's computer.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Seven incidents, one pattern: credentials stored, logged, attached or trusted carelessly — not broken crypto.</li>
<li>Unsalted fast hashes fall to a table built once: 10,001 SHA-1 hashes in 11.8 ms, <code>123456</code> found instantly.</li>
<li>A salt kills the shared table but not targeted guessing (0.26 ms for Bình) — slow hashing is Chapter 2.</li>
<li>Each incident maps to a chapter; the course follows a credential's life from creation to revocation.</li>
<li>Study one lesson per session: slides → run it → practice → Code Lab; minimum path in ~4 weeks.</li>
</ul>
${NGUON_EN}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khi xác thực làm sai thì chuyện gì xảy ra — và học thế nào để không nản</h2>
<p class="lead">Bài 1/2 cho thấy xác thực là gì. Bài này cho thấy làm sai nó thì phải trả giá thế nào: bảy sự cố thật ở những công ty lớn hơn rất nhiều so với nơi bạn sẽ làm đầu tiên, mỗi cái truy về một lỗi và về chương của khoá này ngăn được nó. Rồi bạn sẽ phát lại một vụ trong số đó trên laptop chưa tới một giây — và nhận một kế hoạch học giữ được lâu.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>kể bảy sự cố xác thực thật, mỗi cái một câu, kèm nguyên nhân gốc và nguồn;</li>
<li>giải thích vì sao năm 2012 "chúng tôi đã băm mật khẩu" vẫn chưa đủ, bằng một lần phát lại tự tay chạy;</li>
<li>thấy được quy luật: gần như không vụ nào phá mật mã — chúng lưu, ghi log hay mang theo tín vật một cách cẩu thả;</li>
<li>chọn lộ trình tối thiểu hoặc đầy đủ của khoá và lên kế hoạch một buổi học.</li>
</ul>
<p><strong>Vì sao đáng thời gian của bạn:</strong> những câu chuyện này là cách kỹ sư lâu năm tranh luận khi duyệt thiết kế ("nhớ vụ tệp HAR của Okta không?"), và kể đúng một vụ khi phỏng vấn đáng giá hơn mọi định nghĩa.</p>
</div>

<h3>Bảy sự cố, bảy bài học</h3>
<p>Mỗi dòng dưới đây đã đối chiếu với nguồn ở các thẻ cuối bài (đọc 01/11/2026). Con số là số nguồn đưa ra — có cái là ước tính, và bài nói rõ.</p>
${SC_VI}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tạo ra</span><span class="lz-t">yếu hoặc dùng lại</span><span class="lz-d">danh sách RockYou, nhồi tín vật 23andMe — Ch2, Ch10</span></div>
  <div class="lz-step"><span class="lz-k">Lưu trữ</span><span class="lz-t">chữ thường hoặc băm nhanh</span><span class="lz-d">RockYou, LinkedIn — Ch2</span></div>
  <div class="lz-step"><span class="lz-k">Ghi log / đính kèm</span><span class="lz-t">log, tệp HAR</span><span class="lz-d">Facebook, Okta — Ch1.5, Ch3</span></div>
  <div class="lz-step"><span class="lz-k">Ký</span><span class="lz-t">một khoá bị lộ hoặc được tin quá mức</span><span class="lz-d">Storm-0558 — Ch1.4, Ch4, Ch11</span></div>
  <div class="lz-step"><span class="lz-k">Dùng một mình</span><span class="lz-t">không có yếu tố thứ hai</span><span class="lz-d">khách hàng Snowflake — Ch7</span></div>
</div>
<p>Nhìn quy luật: không kẻ tấn công nào ở đây phá được SHA-1, AES hay thuật toán chữ ký. Họ tìm thấy một tín vật được <strong>lưu, ghi log, đính kèm hay tin tưởng</strong> một cách cẩu thả — đúng những chỗ khoá học này đo đạc.</p>

<h3>Phát lại vụ LinkedIn 2012 trên laptop</h3>
<p>LinkedIn lưu mật khẩu dạng SHA-1 không muối. Không muối nghĩa là cùng một mật khẩu luôn ra cùng một bản băm, với mọi người dùng, ở mọi trang. Nên kẻ tấn công băm một danh sách mật khẩu phổ biến <strong>một lần</strong> rồi tra mọi bản băm bị lộ trong bảng đó. Đây là đòn đó, đánh vào một "vụ lộ" ba người dùng của LabFlow (danh sách SecLists 10.001 dòng được tải về <code>wordlists/</code> ở bài 0.3):</p>
${ma('javascript', CODE.linkedin)}
${ra(OUT['09-linkedin'])}
<p>11,8 ms để băm mười nghìn mật khẩu, và <code>123456</code> của Bình rơi ngay lập tức — nó là dòng thứ hai của danh sách. An và Cô Lan sống sót chỉ vì mật khẩu của họ <em>chưa</em> phổ biến. Và cái bảng dùng lại được: tính một lần, nó phá mọi tài khoản có mật khẩu phổ biến trong mọi bản dump không muối, mãi mãi.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chúng tôi có băm mật khẩu" nghe an toàn nhưng là một câu chẳng nói lên gì.</strong> Băm bằng gì? Có muối không? Chậm cỡ nào? SHA-1 và SHA-256 được thiết kế để <em>nhanh</em>; Node tính hàng triệu lần mỗi giây trên một nhân. Chương 2 đo điều đó và thay bằng argon2id. Bài thực hành dưới đây cho thấy chỉ thêm muối thôi cũng chưa đủ.</p>
</div>

<h3>Một tình huống có thể bạn thấy quen <em>(minh hoạ, không phải sự cố thật)</em></h3>
<p>Một nhóm SWP391 làm trang đặt lịch trong ba tuần. Mật khẩu vào bảng <code>users</code> đúng như người dùng gõ — "để sau băm". Để demo, một bạn xuất cơ sở dữ liệu lên ổ chung cho cả nhóm thử. Một bạn khác dán nguyên một request lỗi, kèm cả token phiên, vào nhóm chat để hỏi. Hôm demo, giảng viên mở tệp xuất: mật khẩu của mọi bạn cùng lớp, vài người dùng đúng mật khẩu email FPT của mình. Chẳng ai tấn công gì cả. Mỗi bước đều là một lối tắt — và mỗi lối tắt là một bài trong khoá này: chữ thường (Ch2), token trong log chat (1.5), phiên không bao giờ hết hạn (Ch3).</p>

<h3>Học khoá này thế nào để không nản</h3>
${LO_VI}
<p><strong>Một buổi học, khoảng 90 phút:</strong></p>
<ol>
<li><strong>10 phút — slide.</strong> Xem slide và lời giảng ngắn dưới mỗi slide; chỉ cần nắm hình dạng ý tưởng.</li>
<li><strong>40 phút — bài đọc, mở sẵn terminal.</strong> Tự chạy mọi lệnh; so output của bạn với của mình. Số khác là bình thường; <em>hình dạng</em> khác thì dừng lại tìm hiểu vì sao.</li>
<li><strong>25 phút — 🧪 Thực hành.</strong> Tự làm trước khi đọc lời giải. "Đạt khi" cho biết lúc nào dừng.</li>
<li><strong>15 phút — Code Lab.</strong> Nút "🏋️ Luyện tập" dưới bài mở bộ đề chấm ngay trong trình duyệt; nhắm tới Accepted, không nhắm tới tốc độ.</li>
</ol>
<p>Luật giữ cho bạn đi đường dài: mỗi buổi một bài, không bao giờ hai; bài nào quá hai buổi thì bỏ qua mục cuối và quay lại sau quiz chương; giữ nguyên thư mục LabFlow ID — chương nào cũng xây tiếp trên nó; và khi output khác của mình, đó là khoảnh khắc đáng giá nhất của bài, không phải thất bại.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Kể một sự cố bảo mật bạn rút ra bài học."</strong> — Chọn một vụ trong bảng, nói nguyên nhân gốc trong một câu và biện pháp ngăn nó. Okta 2023 (token phiên trong tệp HAR) và Storm-0558 (một khoá ký được tin quá mức) gần đây và gây ấn tượng.</li>
<li><strong>"MFA có đáng không?"</strong> — Snowflake 2024: các tài khoản bị ảnh hưởng có mật khẩu bị đánh cắp còn hiệu lực và không bật MFA; Mandiant không thấy Snowflake bị xâm nhập.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo0/linkedin-replay.mjs</code>. Rồi sửa ba mật khẩu "bị lộ" thành vài mật khẩu bạn tự chọn (không phải mật khẩu thật của bạn) và xem cái nào rơi.</li>
<li>Viết <code>demo0/th09.mjs</code>: lưu mật khẩu của Bình kèm một <strong>muối (salt)</strong> ngẫu nhiên 16 byte (<code>sha1(salt + password)</code>), kiểm xem bảng tính sẵn còn tìm ra cô ấy không, rồi đoán trực tiếp mật khẩu của cô ấy bằng chính muối đó.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th09)}
${ra(OUT['09-thuc-hanh'])}
<p>Muối giết cái bảng dùng chung: <code>false</code>. Nhưng kẻ tấn công nhắm vào một người chỉ cần băm lại danh sách với muối của người đó — và <code>123456</code> là lần đoán thứ 2, tìm ra trong một phần tư mili giây. Muối ngăn <em>một</em> lần tính phá được <em>tất cả mọi người</em>; chỉ hàm băm chậm (và chính sách từ chối <code>123456</code>) mới làm mỗi lần đoán trở nên đắt. Đó là Chương 2.</p>
<p><strong>Đạt khi:</strong> bạn nói được vì sao dòng đầu là <code>false</code> và vì sao dòng thứ hai vẫn tìm ra mật khẩu, và bạn đã chọn lộ trình (tối thiểu hay đầy đủ) từ bảng ở trên.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">plaintext password (mật khẩu chữ thường)</span><span class="v">Mật khẩu lưu đúng như người dùng gõ; lộ một lần là lộ tất cả.</span></div>
  <div class="kv"><span class="k">salt (muối)</span><span class="v">Các byte ngẫu nhiên lưu kèm mỗi bản băm để mật khẩu giống nhau ra bản băm khác nhau; giết bảng tính sẵn.</span></div>
  <div class="kv"><span class="k">credential stuffing (nhồi tín vật)</span><span class="v">Thử các cặp tên đăng nhập/mật khẩu lộ ra từ trang khác; hiệu quả vì người ta dùng lại mật khẩu.</span></div>
  <div class="kv"><span class="k">HAR file (tệp HAR)</span><span class="v">Bản xuất lưu lượng mạng từ trình duyệt — có cả header, cookie và token.</span></div>
  <div class="kv"><span class="k">signing key (khoá ký)</span><span class="v">Khoá làm cho token đáng tin; ai giữ nó thì phát được token.</span></div>
  <div class="kv"><span class="k">infostealer (mã độc đánh cắp thông tin)</span><span class="v">Mã độc chép mật khẩu và cookie đã lưu trên máy nạn nhân.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảy sự cố, một quy luật: tín vật bị lưu, ghi log, đính kèm hay tin tưởng cẩu thả — không phải mật mã bị phá.</li>
<li>Băm nhanh không muối thua một cái bảng dựng một lần: 10.001 bản SHA-1 trong 11,8 ms, <code>123456</code> lộ ngay.</li>
<li>Muối giết bảng dùng chung nhưng không ngăn đoán có chủ đích (0,26 ms với Bình) — băm chậm là Chương 2.</li>
<li>Mỗi sự cố ứng với một chương; khoá học đi theo đời sống của một tín vật từ lúc tạo tới lúc thu hồi.</li>
<li>Mỗi buổi một bài: slide → tự chạy → thực hành → Code Lab; lộ trình tối thiểu khoảng 4 tuần.</li>
</ul>
${NGUON_VI}
</div>
`,
};
