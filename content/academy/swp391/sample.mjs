/**
 * SWP391 · Sample project — a real SWP391 team (G5, "Job IT for Freelancer"), page by page.
 * Sources: SE1804_G5_JobITForFreelancer_Presentation.pptx (15 slides), the team's RDS Document
 * (213 pages), its ProjectTracking.xlsx and its SQL Server script (22 tables).
 * Every statistic about the tracking workbook and the SQL script was computed by a script
 * (row counts, complexity / iteration / quality counts, LOC sums) — see the numbers quoted as printed.
 *
 * PRIVACY (hard rule): the G5 files contain real students' names, IDs, usernames, e-mails, phones and
 * photos — in the member slide, the RDS cover/change log, the "Created By" rows, the PIC column and
 * in MANY screenshots (headers "Hello <name>", profile cards, applicant lists). Only pages that were
 * looked at one by one and show none of that are used here; people are "the G5 team", "a member",
 * "the leader", "Member A–E". Pages NOT in _slides.mjs `skip` but showing personal data in the
 * screenshot (so deliberately not used): RDS 110, 114, 118, 129, 134, 141, 147 (and 53 shows fake demo
 * names — not needed). Pages 75, 78, 79, 81, 86, 88, 89, 91–94, 111, 112, 132, 135, 137, 150, 151, 201
 * were added to `skip` by the main session after a hi-res OCR pass; none of them is used here.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const P = 'g5-present';
const R = 'g5-rds';

/* ───────────────────────── S.1 The final presentation ───────────────────────── */
const L1 = {
  title: 'S.1 — The G5 final presentation, slide by slide|||S.1 — Bài thuyết trình cuối kỳ của nhóm G5, từng slide',
  slug: 'swp391-sample-g5-presentation',
  type: 'VIDEO',
  description: 'Nhóm G5 (SE1804, hè 2024, hệ thống Job IT for Freelancer) bảo vệ trước hội đồng bằng 15 slide: giới thiệu, quản lý dự án, context diagram, use case, screen flow, sơ đồ CSDL, demo. Xem từng slide, nhóm làm tốt gì, giám khảo sẽ bắt lỗi gì và nhóm bạn nên làm hơn thế nào.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.1 · G5 presentation slides 1–15</span>
<h2>A real SWP391 team, from the last day backwards</h2>
<p class="lead">This section opens the complete package of one real SWP391 team: <strong>G5 of class SE1804, summer 2024</strong>, who built <strong>"Job IT for Freelancer"</strong> — a Java web system where IT freelancers find jobs posted by recruiters. We start with the <strong>final presentation</strong> (40% of the subject), then open the documents behind it: the 213-page RDS, the Project Tracking workbook and the database script.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Walk through every published slide of a real final presentation and say what it proves to the jury.</li>
<li>Name what the G5 slides do well and what two outside teachers would attack in Q&amp;A.</li>
<li>Rebuild the deck for your own team so that it covers all four grading criteria.</li>
</ul></div>
<h3>How the jury grades these 15 slides</h3>
<table>
<thead><tr><th>Criterion (Final Presentation = 40%)</th><th>Weight</th><th>Which G5 slides serve it</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>Team working (presentation, Q&amp;A)</td><td>20%</td><td>5, 6, 15</td><td>tools listed, but no evidence (no burndown, no issue board, no who-did-what)</td></tr>
<tr><td>Product / implementation</td><td>40%</td><td>13, 14 (live demo)</td><td>depends entirely on the demo — slides only show a clip-art "Demo" key and a business-process diagram</td></tr>
<tr><td>Requirement analysis</td><td>20%</td><td>4, 7, 8, 9</td><td>context + two use-case diagrams; no Admin diagram, no scope numbers</td></tr>
<tr><td>Design</td><td>20%</td><td>10, 11, 12</td><td>two screen flows + a SQL Server diagram; no architecture, no class/sequence design</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Privacy note.</strong> Slide 2 of the original deck lists the members with their student IDs — it is not published here, and nothing in this section names any G5 member. Do the same when you show another team's work.</div>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.1 · Slide thuyết trình G5 trang 1–15</span>
<h2>Một nhóm SWP391 thật, đi ngược từ ngày cuối cùng</h2>
<p class="lead">Mục này mở toàn bộ bộ hồ sơ của một nhóm SWP391 thật: <strong>nhóm G5 lớp SE1804, kỳ hè 2024</strong>, làm hệ thống <strong>"Job IT for Freelancer"</strong> — web Java nơi freelancer IT tìm việc do recruiter đăng. Ta bắt đầu từ <strong>bài thuyết trình cuối kỳ</strong> (40% điểm môn), rồi mở các tài liệu phía sau: RDS 213 trang, workbook Project Tracking và script CSDL.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Đi qua từng slide được công bố của một bài thuyết trình thật và nói slide đó chứng minh gì với hội đồng.</li>
<li>Chỉ ra điểm G5 làm tốt và điều hai giảng viên ngoài sẽ hỏi vặn trong phần Q&amp;A.</li>
<li>Dựng lại bộ slide cho nhóm mình sao cho phủ đủ bốn tiêu chí chấm.</li>
</ul></div>
<h3>Hội đồng chấm 15 slide này thế nào</h3>
<table>
<thead><tr><th>Tiêu chí (Final Presentation = 40%)</th><th>Trọng số</th><th>Slide G5 phục vụ</th><th>Nhận xét</th></tr></thead>
<tbody>
<tr><td>Làm việc nhóm (trình bày, Q&amp;A)</td><td>20%</td><td>5, 6, 15</td><td>có liệt kê công cụ, nhưng không có bằng chứng (burndown, issue board, ai làm gì)</td></tr>
<tr><td>Sản phẩm / hiện thực</td><td>40%</td><td>13, 14 (demo trực tiếp)</td><td>phụ thuộc hoàn toàn vào demo — slide chỉ có ảnh phím "Demo" và một sơ đồ quy trình nghiệp vụ</td></tr>
<tr><td>Phân tích yêu cầu</td><td>20%</td><td>4, 7, 8, 9</td><td>context + hai sơ đồ use case; thiếu sơ đồ Admin, không có số liệu phạm vi</td></tr>
<tr><td>Thiết kế</td><td>20%</td><td>10, 11, 12</td><td>hai screen flow + sơ đồ SQL Server; không có kiến trúc, không có thiết kế class/sequence</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Lưu ý quyền riêng tư.</strong> Slide 2 của bản gốc liệt kê thành viên kèm mã sinh viên — trang đó không được công bố ở đây, và cả mục này không nêu tên thành viên G5 nào. Khi trình bày bài của nhóm khác, bạn cũng làm như vậy.</div>`),
    walkHead(P, 1, 15, 'Page 2 (the member list) is not published.', 'Trang 2 (danh sách thành viên) không được công bố.'),
    walk(P, [
      [1, 'Title slide — SWP391 Final Project Presentation, Job IT for Freelancer System, SE1804 – Team 5',
        `<p class="y-chinh">🎯 The title slide is what the jury stares at while you plug in the laptop — it must say who you are and what you built.</p>
<p class="nhan">What G5 put on it</p>
<ul>
<li><strong>Subject and event</strong> — "SWP391: Final Project Presentation"</li>
<li><strong>System name</strong> — "Job IT for Freelancer System"</li>
<li><strong>Class and team</strong> — "SE1804 – Team 5"</li>
</ul>
<p class="nhan">What an examiner misses</p>
<ul>
<li><strong>A one-line value statement</strong> — who uses it and which problem it solves.</li>
<li><strong>The product's own name/logo</strong> — the UI calls itself "KofeJob", the slide never says so.</li>
<li><strong>Semester and supervisor</strong> — helps the jury match your package on CMS.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> title = <em>name · for whom · why · team</em>. Four facts, readable from the back row.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề là thứ hội đồng nhìn trong lúc bạn cắm máy — nó phải cho biết bạn là ai và đã làm gì.</p>
<p class="nhan">G5 đã đặt gì lên đó</p>
<ul>
<li><strong>Môn và sự kiện</strong> — "SWP391: Final Project Presentation"</li>
<li><strong>Tên hệ thống</strong> — "Job IT for Freelancer System"</li>
<li><strong>Lớp và nhóm</strong> — "SE1804 – Team 5"</li>
</ul>
<p class="nhan">Giám khảo thấy thiếu gì</p>
<ul>
<li><strong>Một câu giá trị</strong> — ai dùng và giải quyết vấn đề gì.</li>
<li><strong>Tên/logo của chính sản phẩm</strong> — giao diện tự gọi là "KofeJob", slide không hề nhắc.</li>
<li><strong>Học kỳ và giảng viên hướng dẫn</strong> — giúp hội đồng khớp bộ nộp của bạn trên CMS.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> slide tiêu đề = <em>tên · cho ai · để làm gì · nhóm</em>. Bốn ý, đọc được từ hàng ghế cuối.</p>`],
      [3, 'Table of Contents — Introduction, Context Diagrams, Use case diagrams, Screenflow, Database diagrams, Demonstration',
        `<p class="y-chinh">🎯 The agenda tells the jury how you will spend 15–20 minutes — G5's agenda is almost entirely "diagrams + demo".</p>
<p class="nhan">The six items, and what they cover</p>
<ol>
<li><strong>Introduction</strong> → slide 4</li>
<li><strong>Context diagrams</strong> → slide 7</li>
<li><strong>Use case diagrams</strong> → slides 8–9</li>
<li><strong>Screenflow</strong> → slides 10–11</li>
<li><strong>Database diagrams</strong> → slide 12</li>
<li><strong>Demonstration</strong> → slides 13–14</li>
</ol>
<div class="pitfall co-tieu-de"><strong>The agenda does not match the deck.</strong> Slides 5–6 (team management, tools) are not in the list, and nothing covers <em>results</em>: how many screens were delivered per iteration, known defects, what each member built, lessons learned. The "team working" criterion (20%) has no section of its own.</div>
<p class="dap-an">✅ Better agenda for your team: Problem &amp; scope → Process &amp; teamwork (with evidence) → Requirements → Design (architecture, DB, one class/sequence example) → Demo by scenario → Results &amp; lessons → Q&amp;A.</p>`,
        `<p class="y-chinh">🎯 Mục lục cho hội đồng biết bạn sẽ dùng 15–20 phút thế nào — mục lục của G5 gần như chỉ có "sơ đồ + demo".</p>
<p class="nhan">Sáu mục, và chúng ứng với slide nào</p>
<ol>
<li><strong>Introduction</strong> → slide 4</li>
<li><strong>Context diagrams</strong> → slide 7</li>
<li><strong>Use case diagrams</strong> → slide 8–9</li>
<li><strong>Screenflow</strong> → slide 10–11</li>
<li><strong>Database diagrams</strong> → slide 12</li>
<li><strong>Demonstration</strong> → slide 13–14</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Mục lục không khớp bộ slide.</strong> Slide 5–6 (quản lý nhóm, công cụ) không có trong danh sách, và không mục nào nói về <em>kết quả</em>: mỗi iteration giao bao nhiêu màn hình, lỗi còn tồn, mỗi người làm gì, bài học rút ra. Tiêu chí "làm việc nhóm" (20%) không có phần riêng.</div>
<p class="dap-an">✅ Mục lục tốt hơn cho nhóm bạn: Vấn đề &amp; phạm vi → Quy trình &amp; làm việc nhóm (có bằng chứng) → Yêu cầu → Thiết kế (kiến trúc, CSDL, một ví dụ class/sequence) → Demo theo kịch bản → Kết quả &amp; bài học → Q&amp;A.</p>`],
    ]),
    walk(P, [
      [4, 'Introduction — the one-sentence purpose, the "KofeJob" logo and a clip-art picture',
        `<p class="y-chinh">🎯 G5's whole introduction is one sentence: help freelance workers find IT jobs posted by companies that need labour.</p>
<p class="nhan">What works</p>
<ul>
<li><strong>Short and clear</strong> — actor (freelancer), domain (IT jobs), counterpart (companies).</li>
<li><strong>Same sentence as the RDS vision</strong> (RDS page 7) — the documents agree.</li>
</ul>
<p class="nhan">What the jury will ask</p>
<ul>
<li><strong>"Why would anyone use this instead of existing job boards?"</strong> — no problem statement, no differentiator.</li>
<li><strong>"How big is it?"</strong> — no scope numbers: 4 actors, 85 screens/functions in the tracking sheet, 22 tables.</li>
<li><strong>"Is KofeJob yours?"</strong> — it is the brand of the HTML template the UI was built from. Using a theme is allowed (the teacher ships 7), but say so and show what <em>you</em> built on top.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> introduction = <em>problem → users → what the system does → size</em>.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ phần giới thiệu của G5 là một câu: giúp người làm tự do tìm việc IT do các công ty cần nhân lực đăng tuyển.</p>
<p class="nhan">Điểm làm được</p>
<ul>
<li><strong>Ngắn và rõ</strong> — actor (freelancer), lĩnh vực (việc IT), phía đối tác (công ty).</li>
<li><strong>Trùng câu vision trong RDS</strong> (RDS trang 7) — các tài liệu thống nhất với nhau.</li>
</ul>
<p class="nhan">Hội đồng sẽ hỏi</p>
<ul>
<li><strong>"Sao người ta dùng cái này thay vì các trang tuyển dụng sẵn có?"</strong> — không có phát biểu vấn đề, không có điểm khác biệt.</li>
<li><strong>"Hệ thống lớn cỡ nào?"</strong> — không có số liệu phạm vi: 4 actor, 85 màn hình/chức năng trong sheet tracking, 22 bảng.</li>
<li><strong>"KofeJob là của nhóm à?"</strong> — đó là thương hiệu của template HTML mà giao diện dựa vào. Dùng theme là được phép (thầy/cô còn phát 7 theme), nhưng hãy nói rõ và cho thấy phần <em>nhóm</em> tự xây bên trên.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> giới thiệu = <em>vấn đề → người dùng → hệ thống làm gì → quy mô</em>.</p>`],
      [5, 'Team manage project — daily online meeting (Google Meet, Zalo, Slack), weekly offline meeting and report',
        `<p class="y-chinh">🎯 This is G5's only slide about how the team worked — it lists meeting habits but shows no evidence.</p>
<p class="nhan">What the slide claims</p>
<ul>
<li><strong>Daily online meeting</strong> — Google Meet, Zalo, Slack</li>
<li><strong>Weekly offline meeting and report</strong></li>
</ul>
<div class="pitfall co-tieu-de"><strong>Claims without proof score nothing.</strong> "Team working" is 20% of the presentation. The jury wants to see it: the weekly reports (Template6), the issue board with labels, who owned which screens, how a late member was handled. G5's own tracking sheet shows one of the five members with no screen at all — a fact the jury will find, better to address it yourself.</div>
<p class="dap-an">✅ Replace the stock photos with one screenshot of your issue board filtered by iteration, one chart of screens done per member per iteration, and one sentence about a problem the team solved.</p>`,
        `<p class="y-chinh">🎯 Đây là slide duy nhất của G5 về cách nhóm làm việc — liệt kê thói quen họp nhưng không có bằng chứng.</p>
<p class="nhan">Slide khẳng định gì</p>
<ul>
<li><strong>Họp online hằng ngày</strong> — Google Meet, Zalo, Slack</li>
<li><strong>Họp offline và báo cáo hằng tuần</strong></li>
</ul>
<div class="pitfall co-tieu-de"><strong>Khẳng định không có bằng chứng thì không được điểm.</strong> "Làm việc nhóm" chiếm 20% điểm thuyết trình. Hội đồng muốn <em>thấy</em>: báo cáo tuần (Template6), issue board có label, ai phụ trách màn hình nào, nhóm xử lý thế nào khi có người chậm. Chính sheet tracking của G5 cho thấy một trong năm thành viên không có màn hình nào — hội đồng sẽ phát hiện, tốt hơn là nhóm tự nói trước.</div>
<p class="dap-an">✅ Thay ảnh minh hoạ bằng một ảnh chụp issue board lọc theo iteration, một biểu đồ số màn hình xong theo từng người từng iteration, và một câu về vấn đề nhóm đã giải quyết.</p>`],
      [6, 'Tracking tool — GitHub; Google Sheet, Google Docs, Google Drive',
        `<p class="y-chinh">🎯 G5 tracked code on GitHub and documents on Google Drive — fine tools, but the slide shows logos instead of the tracking itself.</p>
<p class="nhan">Tool → what it should prove</p>
<ul>
<li><strong>GitHub / GitLab</strong> → one tag per iteration, issues labelled <code>1_To Do · 2_Doing · 3_Done · Defect · Leakage</code>, a commit history from every member.</li>
<li><strong>Google Sheet</strong> → the Project Tracking workbook (sheets <em>Use Cases</em> + <em>Product</em>) — see lesson S.7.</li>
<li><strong>Google Docs / Drive</strong> → the RDS with a real change log per iteration.</li>
</ul>
<p class="ghi-chu">The guides name GitLab; a team using GitHub should say that the teacher agreed, and still use the same labels and tags.</p>`,
        `<p class="y-chinh">🎯 G5 theo dõi code trên GitHub và tài liệu trên Google Drive — công cụ ổn, nhưng slide chỉ đưa logo chứ không đưa chính việc theo dõi.</p>
<p class="nhan">Công cụ → phải chứng minh được gì</p>
<ul>
<li><strong>GitHub / GitLab</strong> → mỗi iteration một tag, issue gắn label <code>1_To Do · 2_Doing · 3_Done · Defect · Leakage</code>, lịch sử commit của đủ mọi thành viên.</li>
<li><strong>Google Sheet</strong> → workbook Project Tracking (sheet <em>Use Cases</em> + <em>Product</em>) — xem bài S.7.</li>
<li><strong>Google Docs / Drive</strong> → RDS có change log thật theo từng iteration.</li>
</ul>
<p class="ghi-chu">Tài liệu môn học ghi GitLab; nhóm dùng GitHub nên nói rõ đã được thầy/cô đồng ý, và vẫn dùng đúng bộ label, tag như vậy.</p>`],
    ]),
    walk(P, [
      [7, 'Context diagram — Freelancer, Guest, Admin and Recruiter around the "Job IT For Freelancer System" bubble',
        `<p class="y-chinh">🎯 A context diagram draws the system as one bubble and every outside party that exchanges data with it.</p>
<p class="nhan">What G5 got right</p>
<ul>
<li><strong>All four human actors</strong> — Freelancer, Guest, Admin, Recruiter.</li>
<li><strong>Two directions per actor</strong> — an input arrow and an output arrow, each labelled.</li>
</ul>
<p class="nhan">What an examiner criticises</p>
<ul>
<li><strong>Labels are functions, not data</strong> — "Login", "Change Password", "Search job" are use cases. A context flow is a <em>thing</em>: "job post", "application + CV", "account status".</li>
<li><strong>A missing external system</strong> — passwords are reset and applicants notified by e-mail, so the mail server belongs on the diagram.</li>
<li><strong>Text cut off</strong> — the Recruiter labels run off the slide; the title overlaps the diagram.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> arrows on a context diagram carry <em>nouns</em>; verbs belong in the use-case diagram.</p>`,
        `<p class="y-chinh">🎯 Context diagram vẽ hệ thống thành một bong bóng và mọi bên ngoài có trao đổi dữ liệu với nó.</p>
<p class="nhan">G5 làm đúng</p>
<ul>
<li><strong>Đủ bốn actor là người</strong> — Freelancer, Guest, Admin, Recruiter.</li>
<li><strong>Mỗi actor hai chiều</strong> — một mũi tên vào, một mũi tên ra, đều có nhãn.</li>
</ul>
<p class="nhan">Giám khảo sẽ phê bình</p>
<ul>
<li><strong>Nhãn là chức năng, không phải dữ liệu</strong> — "Login", "Change Password", "Search job" là use case. Luồng trong context phải là <em>một thứ</em>: "tin tuyển dụng", "đơn ứng tuyển + CV", "trạng thái tài khoản".</li>
<li><strong>Thiếu một hệ thống ngoài</strong> — mật khẩu được reset và ứng viên được báo qua e-mail, nên mail server phải có mặt trên sơ đồ.</li>
<li><strong>Chữ bị cắt</strong> — nhãn của Recruiter tràn khỏi slide; tiêu đề đè lên sơ đồ.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mũi tên trên context diagram mang <em>danh từ</em>; động từ để dành cho sơ đồ use case.</p>`],
      [8, 'Use case diagram — Freelancer (Manage Profile, Manage Favourites, Manage Apply, Search Post Job; Freelancer → Guest)',
        `<p class="y-chinh">🎯 The Freelancer diagram groups 14 use cases under four "Manage …" bubbles — readable, but it misuses include and extend.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Actor generalisation</strong> — Freelancer → Guest: a freelancer can do everything a guest can.</li>
<li><strong>A system boundary</strong> with the system's name.</li>
</ul>
<p class="nhan">Defects an examiner circles</p>
<ol>
<li><strong>"Login" is included by every group</strong> — logging in is a <em>precondition</em>, not a step inside Manage Profile.</li>
<li><strong>View/Edit Profile, Change Password as «extend» of Manage Profile</strong> — they are separate goals of the user, not optional add-ons of one goal.</li>
<li><strong>"Apply for Job «include» View List Post Job"</strong> — include means the base <em>always</em> runs the included case; applying does not re-list posts.</li>
<li><strong>Typos in stereotypes</strong> — "«inculde»" appears twice.</li>
</ol>
<p class="dap-an">✅ Draw one ellipse per user goal (the screens you will build), connect the actor directly, and use «include»/«extend» only where the teacher's Requirement deck shows it.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ Freelancer gom 14 use case dưới bốn bong bóng "Manage …" — dễ đọc, nhưng dùng sai include và extend.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Tổng quát hoá actor</strong> — Freelancer → Guest: freelancer làm được mọi thứ guest làm được.</li>
<li><strong>Có đường biên hệ thống</strong> ghi tên hệ thống.</li>
</ul>
<p class="nhan">Lỗi giám khảo khoanh đỏ</p>
<ol>
<li><strong>Nhóm nào cũng «include» "Login"</strong> — đăng nhập là <em>điều kiện tiên quyết</em>, không phải một bước bên trong Manage Profile.</li>
<li><strong>View/Edit Profile, Change Password là «extend» của Manage Profile</strong> — đó là các mục tiêu riêng của người dùng, không phải phần mở rộng tuỳ chọn của một mục tiêu.</li>
<li><strong>"Apply for Job «include» View List Post Job"</strong> — include nghĩa là use case gốc <em>luôn</em> chạy use case được include; ứng tuyển không liệt kê lại danh sách tin.</li>
<li><strong>Sai chính tả stereotype</strong> — "«inculde»" xuất hiện hai lần.</li>
</ol>
<p class="dap-an">✅ Mỗi mục tiêu của người dùng (mỗi màn hình bạn sẽ làm) là một ellipse, nối thẳng với actor, và chỉ dùng «include»/«extend» ở chỗ deck Requirement của thầy/cô minh hoạ.</p>`],
    ]),
    walk(P, [
      [9, 'Use case diagram — Recruiter (Manage Profile, Log in, Manage Post, Manage Application List, Search Freelancer)',
        `<p class="y-chinh">🎯 The Recruiter diagram shows the hiring side — and repeats the include/extend mistakes, now with login-related nonsense.</p>
<p class="nhan">Defects, in the order a jury reads them</p>
<ol>
<li><strong>"Change Password «include» Log in", "Logout «include» Log in"</strong> — neither is a step of logging in; they are separate goals.</li>
<li><strong>"BookMark" extends Manage Post</strong> — in the product it bookmarks <em>freelancers</em> (table <code>Mark</code>), not posts.</li>
<li><strong>Spelling</strong> — "Proflie" three times, "Create News Post", "Connect to freelance".</li>
<li><strong>No Admin diagram in the deck</strong> — yet the tracking sheet gives Admin 37 of the 85 screens/functions (rows UC_49–UC_85).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Why this costs marks.</strong> Requirement analysis is 20% of the presentation. Two diagrams with wrong stereotypes and the largest actor missing tell the jury the model was drawn once and never reviewed.</div>`,
        `<p class="y-chinh">🎯 Sơ đồ Recruiter thể hiện phía tuyển dụng — và lặp lại lỗi include/extend, thêm cả những quan hệ vô lý quanh việc đăng nhập.</p>
<p class="nhan">Các lỗi, theo thứ tự hội đồng đọc</p>
<ol>
<li><strong>"Change Password «include» Log in", "Logout «include» Log in"</strong> — không cái nào là một bước của đăng nhập; chúng là các mục tiêu riêng.</li>
<li><strong>"BookMark" extend Manage Post</strong> — trong sản phẩm nó đánh dấu <em>freelancer</em> (bảng <code>Mark</code>), không phải đánh dấu tin.</li>
<li><strong>Chính tả</strong> — "Proflie" ba lần, "Create News Post", "Connect to freelance".</li>
<li><strong>Bộ slide không có sơ đồ Admin</strong> — trong khi sheet tracking giao cho Admin 37 trên 85 màn hình/chức năng (dòng UC_49–UC_85).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Vì sao mất điểm.</strong> Phân tích yêu cầu chiếm 20% điểm thuyết trình. Hai sơ đồ sai stereotype và thiếu actor lớn nhất cho hội đồng thấy mô hình được vẽ một lần rồi không ai review lại.</div>`],
      [10, 'Screen flow — Freelancer (Home → Login/Register, Profile, Job Favorites, Job Applied, Job for you, list Post → Job detail)',
        `<p class="y-chinh">🎯 A screen flow shows which screen leads to which — G5's Freelancer flow is clean: one hub (Home) and one shared detail screen.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Hub-and-spoke</strong> — every freelancer screen is reachable from Home.</li>
<li><strong>Reuse</strong> — four lists (Favorites, Applied, Job for you, list Post) all open the same <em>Job detail</em>.</li>
</ul>
<p class="nhan">Gaps</p>
<ul>
<li><strong>Screens in the tracking sheet but not here</strong> — Report post, search/filter of applied jobs, blog.</li>
<li><strong>Names that do not match the sheet</strong> — "Job Applied" vs "List Apply", "Lost Password" vs "Forget Password".</li>
<li><strong>No Logout, typos</strong> — "sigup", "accsess".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> one box = one row of the Product sheet, same name. The jury checks the three against each other.</p>`,
        `<p class="y-chinh">🎯 Screen flow cho biết màn hình nào dẫn tới màn hình nào — flow Freelancer của G5 gọn: một trung tâm (Home) và một màn hình chi tiết dùng chung.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Dạng trục–nan hoa</strong> — mọi màn hình của freelancer đều đi được từ Home.</li>
<li><strong>Tái sử dụng</strong> — bốn danh sách (Favorites, Applied, Job for you, list Post) cùng mở một <em>Job detail</em>.</li>
</ul>
<p class="nhan">Chỗ thiếu</p>
<ul>
<li><strong>Có trong sheet tracking nhưng không có ở đây</strong> — Report post, tìm/lọc việc đã ứng tuyển, blog.</li>
<li><strong>Tên không khớp sheet</strong> — "Job Applied" với "List Apply", "Lost Password" với "Forget Password".</li>
<li><strong>Không có Logout, sai chính tả</strong> — "sigup", "accsess".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một ô = một dòng của sheet Product, cùng một tên. Hội đồng sẽ đối chiếu ba thứ này với nhau.</p>`],
      [11, 'Screen flow — Recruiter (Home Page → Company, Profile, Find Freelancer, List post, Blog, Dashboard → Application list → Send mail, Post new post)',
        `<p class="y-chinh">🎯 The Recruiter flow covers the whole hiring loop, ending in "Application list → connect → Send mail".</p>
<p class="nhan">Good</p>
<ul>
<li><strong>The business goal is visible</strong> — from a post to an applicant to an e-mail.</li>
<li><strong>Arrows are labelled</strong> with the link or button ("detail", "search", "connect").</li>
</ul>
<p class="nhan">Gaps</p>
<ul>
<li><strong>Two login states mixed</strong> — Register/Login (before login) and Dashboard/Post new post (after) hang off the same Home.</li>
<li><strong>Missing screens</strong> — update/delete post, change project status, completed projects, marked freelancers.</li>
<li><strong>No Admin flow</strong> in the deck at all.</li>
</ul>
<p class="dap-an">✅ Draw one flow per role <em>after</em> login, plus one public (guest) flow; every screen of the Product sheet appears exactly once.</p>`,
        `<p class="y-chinh">🎯 Flow Recruiter phủ cả vòng tuyển dụng, kết thúc ở "Application list → connect → Send mail".</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Nhìn thấy mục tiêu nghiệp vụ</strong> — từ tin tuyển dụng tới ứng viên tới e-mail.</li>
<li><strong>Mũi tên có nhãn</strong> là link hoặc nút ("detail", "search", "connect").</li>
</ul>
<p class="nhan">Chỗ thiếu</p>
<ul>
<li><strong>Trộn hai trạng thái đăng nhập</strong> — Register/Login (trước khi đăng nhập) và Dashboard/Post new post (sau khi đăng nhập) cùng treo vào một Home.</li>
<li><strong>Thiếu màn hình</strong> — sửa/xoá tin, đổi trạng thái dự án, dự án đã hoàn thành, freelancer đã đánh dấu.</li>
<li><strong>Không có flow Admin</strong> trong bộ slide.</li>
</ul>
<p class="dap-an">✅ Vẽ mỗi vai trò một flow <em>sau khi</em> đăng nhập, cộng một flow công khai (guest); mỗi màn hình của sheet Product xuất hiện đúng một lần.</p>`],
    ]),
    walk(P, [
      [12, 'Database diagram — the SQL Server diagram of all 22 tables',
        `<p class="y-chinh">🎯 The diagram is generated from the real database, so it matches the code — but the design it shows invites hard questions.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Generated, not hand-drawn</strong> — it cannot drift from the script (25 foreign keys).</li>
<li><strong>Lookup tables</strong> — JobType, Duration, Categories, Degree, Team_Number, Role.</li>
</ul>
<p class="nhan">Questions the jury will ask (all verifiable in the script)</p>
<ol>
<li><strong>"Why is the freelancer key spelled three ways?"</strong> — <code>freelanceID</code>, <code>freelancerID</code>, <code>FreelancerID</code>.</li>
<li><strong>"Why is <code>Post.skill</code> a text column?"</strong> — skills are a comma list ("C++, Java, .NET") although <code>Skill_Set</code> exists; not first normal form.</li>
<li><strong>"Where is the primary key of <code>Mark</code>?"</strong> — 21 of 22 tables have one.</li>
<li><strong>"How are passwords stored?"</strong> — plain text in <code>User.password nvarchar(50)</code>.</li>
<li><strong>"Why four status types?"</strong> — text, int, bit and '0'/'1'/'2' strings.</li>
</ol>
<p class="ghi-chu">Too small to read on a projector: show 3–4 zoomed parts instead. Full review in lesson S.7.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ được sinh từ CSDL thật nên khớp với code — nhưng thiết kế nó thể hiện lại mời gọi những câu hỏi khó.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Sinh tự động, không vẽ tay</strong> — không thể lệch khỏi script (25 khoá ngoại).</li>
<li><strong>Có bảng tra cứu</strong> — JobType, Duration, Categories, Degree, Team_Number, Role.</li>
</ul>
<p class="nhan">Câu hội đồng sẽ hỏi (đều kiểm được trong script)</p>
<ol>
<li><strong>"Sao khoá của freelancer viết ba kiểu?"</strong> — <code>freelanceID</code>, <code>freelancerID</code>, <code>FreelancerID</code>.</li>
<li><strong>"Sao <code>Post.skill</code> là cột chữ?"</strong> — kỹ năng là chuỗi phẩy ("C++, Java, .NET") dù đã có bảng <code>Skill_Set</code>; vi phạm dạng chuẩn 1.</li>
<li><strong>"Khoá chính của <code>Mark</code> đâu?"</strong> — 21 trên 22 bảng có khoá chính.</li>
<li><strong>"Mật khẩu lưu thế nào?"</strong> — chữ thường trong <code>User.password nvarchar(50)</code>.</li>
<li><strong>"Sao có bốn kiểu trạng thái?"</strong> — chữ, int, bit và chuỗi '0'/'1'/'2'.</li>
</ol>
<p class="ghi-chu">Chiếu lên máy chiếu thì quá nhỏ: hãy đưa 3–4 phần phóng to. Phân tích đầy đủ ở bài S.7.</p>`],
      [13, 'Demo Project — a clip-art "Demo" key',
        `<p class="y-chinh">🎯 The demo carries the biggest criterion (product/implementation, 40%) — this slide is just a divider, the work is in the rehearsal.</p>
<ol>
<li><strong>A scenario, not a tour</strong> — follow the business flow of slide 14 end to end.</li>
<li><strong>Seeded data</strong> — accounts per role, posts, applications, so no screen is empty.</li>
<li><strong>Each member demos his own screens</strong> — the jury grades individuals too.</li>
<li><strong>A backup video</strong> — the same videos you submitted each iteration.</li>
</ol>`,
        `<p class="y-chinh">🎯 Demo gánh tiêu chí lớn nhất (sản phẩm/hiện thực, 40%) — slide này chỉ là vách ngăn, công sức nằm ở buổi tập.</p>
<ol>
<li><strong>Theo kịch bản, không phải đi dạo</strong> — đi hết luồng nghiệp vụ của slide 14.</li>
<li><strong>Có dữ liệu mẫu</strong> — tài khoản cho từng vai trò, tin, đơn ứng tuyển, để không màn hình nào trống.</li>
<li><strong>Ai làm màn hình nào thì người đó demo</strong> — hội đồng chấm cả từng cá nhân.</li>
<li><strong>Video dự phòng</strong> — chính các video đã nộp mỗi iteration.</li>
</ol>`],
      [14, 'Demonstration — a swim-lane business process (Recruiter lane / Freelancer lane)',
        `<p class="y-chinh">🎯 The best slide of the deck: one swim-lane diagram of the whole hiring process, usable as the demo script.</p>
<ul>
<li><strong>Recruiter lane</strong> — visit → registered? → log in → post job → view applications → evaluate CVs → accept/reject → e-mail.</li>
<li><strong>Freelancer lane</strong> — visit → log in → search → favourite? → view details → apply → wait → accepted? → contact recruiter.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The two "create profile" boxes are swapped.</strong> The Recruiter lane says "Create Freelancer profile", the Freelancer lane "Create Companny profile". Plus "Recuiter", "Sent email notification".</div>`,
        `<p class="y-chinh">🎯 Slide tốt nhất của bộ: một sơ đồ swim-lane cho cả quy trình tuyển dụng, dùng làm kịch bản demo được.</p>
<ul>
<li><strong>Làn Recruiter</strong> — vào web → đã đăng ký? → đăng nhập → đăng tin → xem đơn → đánh giá CV → nhận/từ chối → gửi e-mail.</li>
<li><strong>Làn Freelancer</strong> — vào web → đăng nhập → tìm → yêu thích? → xem chi tiết → ứng tuyển → chờ → được nhận? → liên hệ recruiter.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Hai ô "tạo hồ sơ" bị đảo chỗ.</strong> Làn Recruiter ghi "Create Freelancer profile", làn Freelancer ghi "Create Companny profile". Thêm "Recuiter", "Sent email notification".</div>`],
      [15, 'Q&A',
        `<p class="y-chinh">🎯 Q&amp;A is where the 20% "team working" mark is won — prepare answers, and decide who answers what.</p>
<p class="nhan">Questions this deck invites</p>
<ul>
<li>Why is every screen rated "Simple" in your tracking sheet?</li>
<li>Where is the Admin use-case diagram?</li>
<li>How do you protect passwords and prevent SQL injection?</li>
<li>What did each member build, and why does one member have no screen?</li>
</ul>`,
        `<p class="y-chinh">🎯 Q&amp;A là nơi giành 20% điểm "làm việc nhóm" — chuẩn bị câu trả lời, và phân công ai trả lời phần nào.</p>
<p class="nhan">Những câu bộ slide này gợi ra</p>
<ul>
<li>Sao mọi màn hình trong sheet tracking đều là "Simple"?</li>
<li>Sơ đồ use case của Admin đâu?</li>
<li>Nhóm bảo vệ mật khẩu và chống SQL injection thế nào?</li>
<li>Mỗi người làm gì, và sao có một người không có màn hình nào?</li>
</ul>`],
    ]),
    bi(`<h3>Rebuild it: a 15-slide deck that covers all four criteria</h3>
<table>
<thead><tr><th>#</th><th>Slide</th><th>Criterion</th><th>Evidence to show</th></tr></thead>
<tbody>
<tr><td>1</td><td>Title: product name, one-line value, class, team, supervisor</td><td>—</td><td>logo of <em>your</em> product</td></tr>
<tr><td>2</td><td>Problem &amp; scope: actors, number of screens, number of tables</td><td>Requirement</td><td>numbers from the Product sheet</td></tr>
<tr><td>3</td><td>Team &amp; process: 3 iterations, roles, who owns which screens</td><td>Team working</td><td>screens per member per iteration</td></tr>
<tr><td>4</td><td>Tracking evidence: issue board, tags, weekly reports</td><td>Team working</td><td>screenshots, not logos</td></tr>
<tr><td>5–6</td><td>Context diagram + use-case overview (all actors, Admin included)</td><td>Requirement</td><td>data flows as nouns; one ellipse per goal</td></tr>
<tr><td>7</td><td>One use case in full: flows + business rules</td><td>Requirement</td><td>the most complex screen</td></tr>
<tr><td>8</td><td>Architecture: MVC layers, packages, libraries</td><td>Design</td><td>package diagram</td></tr>
<tr><td>9–10</td><td>Database: ERD zoomed by area + 2 design decisions</td><td>Design</td><td>why this key, why this table</td></tr>
<tr><td>11</td><td>One class + sequence diagram of a real screen</td><td>Design</td><td>names that exist in the code</td></tr>
<tr><td>12</td><td>Business process = demo script</td><td>Product</td><td>like G5's slide 14, corrected</td></tr>
<tr><td>13</td><td>Demo (live, each member his screens)</td><td>Product</td><td>seeded data, backup video</td></tr>
<tr><td>14</td><td>Results &amp; lessons: done / defects / what we would change</td><td>Team working</td><td>honest numbers</td></tr>
<tr><td>15</td><td>Q&amp;A</td><td>Team working</td><td>prepared answer owners</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Beyond the syllabus — rehearse against the clock.</strong> Two outside teachers have never seen your system. Time a full rehearsal (target: 60% of your slot for the demo), let one teammate play the jury with the questions above, and cut any slide nobody asks about.</div>`,
    `<h3>Làm lại: bộ 15 slide phủ đủ bốn tiêu chí</h3>
<table>
<thead><tr><th>#</th><th>Slide</th><th>Tiêu chí</th><th>Bằng chứng cần đưa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tiêu đề: tên sản phẩm, một câu giá trị, lớp, nhóm, GV hướng dẫn</td><td>—</td><td>logo của <em>chính</em> sản phẩm</td></tr>
<tr><td>2</td><td>Vấn đề &amp; phạm vi: actor, số màn hình, số bảng</td><td>Yêu cầu</td><td>số liệu từ sheet Product</td></tr>
<tr><td>3</td><td>Nhóm &amp; quy trình: 3 iteration, vai trò, ai phụ trách màn hình nào</td><td>Làm việc nhóm</td><td>số màn hình theo người theo iteration</td></tr>
<tr><td>4</td><td>Bằng chứng theo dõi: issue board, tag, báo cáo tuần</td><td>Làm việc nhóm</td><td>ảnh chụp thật, không phải logo</td></tr>
<tr><td>5–6</td><td>Context diagram + tổng quan use case (đủ actor, có Admin)</td><td>Yêu cầu</td><td>luồng là danh từ; mỗi mục tiêu một ellipse</td></tr>
<tr><td>7</td><td>Một use case đầy đủ: các luồng + business rule</td><td>Yêu cầu</td><td>màn hình phức tạp nhất</td></tr>
<tr><td>8</td><td>Kiến trúc: các lớp MVC, package, thư viện</td><td>Thiết kế</td><td>package diagram</td></tr>
<tr><td>9–10</td><td>CSDL: ERD phóng theo vùng + 2 quyết định thiết kế</td><td>Thiết kế</td><td>vì sao khoá này, vì sao bảng này</td></tr>
<tr><td>11</td><td>Một class + sequence diagram của màn hình thật</td><td>Thiết kế</td><td>tên có thật trong code</td></tr>
<tr><td>12</td><td>Quy trình nghiệp vụ = kịch bản demo</td><td>Sản phẩm</td><td>như slide 14 của G5, đã sửa</td></tr>
<tr><td>13</td><td>Demo (trực tiếp, mỗi người demo màn hình của mình)</td><td>Sản phẩm</td><td>dữ liệu mẫu, video dự phòng</td></tr>
<tr><td>14</td><td>Kết quả &amp; bài học: xong / lỗi / sẽ làm khác đi</td><td>Làm việc nhóm</td><td>số liệu trung thực</td></tr>
<tr><td>15</td><td>Q&amp;A</td><td>Làm việc nhóm</td><td>đã phân người trả lời</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Ngoài giáo trình — tập dượt có bấm giờ.</strong> Hai giảng viên ngoài chưa từng thấy hệ thống của bạn. Bấm giờ một buổi tập đầy đủ (mục tiêu: 60% thời lượng cho demo), để một bạn đóng vai hội đồng với các câu hỏi ở trên, và bỏ slide nào không ai hỏi tới.</div>`),
    books([
      ['sommerville', 'Ch.2 §2.4 and Ch.24 (project presentation of process and quality evidence)', 'Chương 2 §2.4 và Chương 24 (trình bày bằng chứng quy trình và chất lượng)'],
      ['wiegers', 'Ch.5 "Establishing the business requirements" (vision &amp; scope — what slide 2 should say)', 'Chương 5 "Establishing the business requirements" (vision &amp; scope — slide 2 nên nói gì)'],
      ['fowler', 'Ch.9 "Use Cases" (include/extend used sparingly)', 'Chương 9 "Use Cases" (dùng include/extend có chừng mực)'],
    ]),
  ].join('\n'),
};

/* ─────────────── S.2 RDS part I — overview, use cases, flows, authorization, DB ─────────────── */
const L2 = {
  title: 'S.2 — The G5 RDS, part I: vision, actors, use cases, screen flows, authorization, database & packages|||S.2 — RDS của G5, phần I: vision, actor, use case, screen flow, phân quyền, CSDL & package',
  slug: 'swp391-sample-g5-rds-overview',
  type: 'VIDEO',
  description: 'RDS của G5 trang 7–29: vision & context diagram, bảng actor, bốn sơ đồ use case, bảng mô tả use case, screen flow theo vai trò, screen descriptions, ma trận phân quyền, non-UI functions, sơ đồ CSDL, mô tả bảng và code package — cái được, cái sai và cách viết tốt hơn.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.2 · G5 RDS pages 7–29</span>
<h2>The RDS, part I — the chapters that describe the whole system</h2>
<p class="lead">The <strong>RDS (Requirement &amp; Design Specification)</strong> is the document your team re-submits every iteration. G5's final version has <strong>213 pages</strong>. This lesson reads its first 29 pages: the parts that describe the <em>whole</em> system before any single feature.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Find every section of a real RDS by page number.</li>
<li>Judge each overview section the way a teacher does: complete? consistent with the other sections and the tracking sheet?</li>
<li>Write your own overview chapters without the three inconsistencies that cost G5 most.</li>
</ul></div>
<h3>Map of the 213 pages</h3>
<table>
<thead><tr><th>Pages</th><th>Section</th><th>Where on this site</th></tr></thead>
<tbody>
<tr><td>1–6</td><td>Cover, record of changes, contents</td><td>not published (names, IDs)</td></tr>
<tr><td>7–8</td><td>I.1 Vision &amp; scope (context diagram) · I.2.1 Actors</td><td>this lesson</td></tr>
<tr><td>8–16</td><td>I.2.3 Use cases: 4 diagrams + description table UC_01–UC_54</td><td>this lesson</td></tr>
<tr><td>16–18</td><td>I.3.1 Screens flow (Freelancer, Recruiter, Admin, Guest)</td><td>this lesson</td></tr>
<tr><td>18–25</td><td>I.3.2 Screen descriptions · I.3.3 Screen authorization · I.3.4 Non-UI functions</td><td>this lesson</td></tr>
<tr><td>25–29</td><td>"3." System high-level design: DB schema, 22 table descriptions, code packages</td><td>this lesson</td></tr>
<tr><td>30–49</td><td>II Requirement specifications (use-case specs + business rules)</td><td>lesson S.3</td></tr>
<tr><td>49–102</td><td>III Screen designs — common and freelancer features</td><td>lesson S.4</td></tr>
<tr><td>103–203</td><td>III Screen designs — recruiter and admin features</td><td>lesson S.5</td></tr>
<tr><td>204–213</td><td>IV Code designs · V Appendix (assumptions, exclusions, 13 business rules)</td><td>lesson S.6</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Three numbering systems for the same things.</strong> The use-case table says UC_01–UC_54, the screen-description table UC_01–UC_50, the tracking sheet's Use Cases sheet UC1–UC37 and its Product sheet UC_01–UC_85 — and the same ID points to different functions in each. Pick <em>one</em> ID per screen on day one and use it everywhere.</div>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.2 · RDS của G5 trang 7–29</span>
<h2>RDS, phần I — các chương mô tả toàn bộ hệ thống</h2>
<p class="lead"><strong>RDS (Requirement &amp; Design Specification)</strong> là tài liệu nhóm bạn nộp lại mỗi iteration. Bản cuối của G5 dày <strong>213 trang</strong>. Bài này đọc 29 trang đầu: phần mô tả <em>toàn bộ</em> hệ thống trước khi đi vào từng tính năng.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Tìm mọi mục của một RDS thật theo số trang.</li>
<li>Đánh giá từng mục tổng quan như giảng viên: đủ chưa? khớp với các mục khác và với sheet tracking không?</li>
<li>Viết các chương tổng quan của nhóm mình mà không mắc ba chỗ không nhất quán khiến G5 mất điểm nhiều nhất.</li>
</ul></div>
<h3>Bản đồ 213 trang</h3>
<table>
<thead><tr><th>Trang</th><th>Mục</th><th>Học ở đâu trên trang này</th></tr></thead>
<tbody>
<tr><td>1–6</td><td>Bìa, record of changes, mục lục</td><td>không công bố (tên, mã SV)</td></tr>
<tr><td>7–8</td><td>I.1 Vision &amp; scope (context diagram) · I.2.1 Actors</td><td>bài này</td></tr>
<tr><td>8–16</td><td>I.2.3 Use cases: 4 sơ đồ + bảng mô tả UC_01–UC_54</td><td>bài này</td></tr>
<tr><td>16–18</td><td>I.3.1 Screens flow (Freelancer, Recruiter, Admin, Guest)</td><td>bài này</td></tr>
<tr><td>18–25</td><td>I.3.2 Screen descriptions · I.3.3 Screen authorization · I.3.4 Non-UI functions</td><td>bài này</td></tr>
<tr><td>25–29</td><td>"3." System high-level design: sơ đồ CSDL, mô tả 22 bảng, code package</td><td>bài này</td></tr>
<tr><td>30–49</td><td>II Requirement specifications (đặc tả use case + business rule)</td><td>bài S.3</td></tr>
<tr><td>49–102</td><td>III Screen designs — tính năng chung và của freelancer</td><td>bài S.4</td></tr>
<tr><td>103–203</td><td>III Screen designs — tính năng của recruiter và admin</td><td>bài S.5</td></tr>
<tr><td>204–213</td><td>IV Code designs · V Appendix (giả định, loại trừ, 13 business rule)</td><td>bài S.6</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Ba hệ thống đánh số cho cùng một thứ.</strong> Bảng use case ghi UC_01–UC_54, bảng screen description UC_01–UC_50, sheet Use Cases của file tracking UC1–UC37 và sheet Product UC_01–UC_85 — và cùng một mã lại trỏ tới chức năng khác nhau ở mỗi nơi. Chọn <em>một</em> mã cho mỗi màn hình ngay ngày đầu và dùng nó ở mọi nơi.</div>`),
    walkHead(R, 7, 29, 'Only the first page of each section and every diagram is shown; repetitive pages are summarised in tables.', 'Chỉ đưa trang đầu của mỗi mục và mọi sơ đồ; các trang lặp lại được tóm tắt thành bảng.'),
    walk(R, [
      [7, 'I. Overview — 1.1 Product vision (one sentence) and 1.2 Scope (the context diagram)',
        `<p class="y-chinh">🎯 G5's vision-and-scope chapter is one sentence plus the same context diagram as the slides — enough to start, too thin to finish.</p>
<p class="nhan">What is there</p>
<ul>
<li><strong>1.1 Product vision</strong> — the introduction sentence of presentation slide 4.</li>
<li><strong>1.2 Scope</strong> — only the context diagram (captioned "Context Digram").</li>
</ul>
<p class="nhan">What a scope section needs (Wiegers' vision &amp; scope)</p>
<ol>
<li><strong>Major features</strong> — a numbered list (FE-1 Job posting, FE-2 Application, …) the rest of the RDS can reference.</li>
<li><strong>Scope per iteration</strong> — which features ship in iteration 1, 2, 3.</li>
<li><strong>Limitations &amp; exclusions</strong> — G5 wrote them (no payment, no contracts) but put them on page 212; they belong here.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> scope answers "what is in, what is out, and when" — a diagram alone answers none of the three.</p>`,
        `<p class="y-chinh">🎯 Chương vision-và-scope của G5 là một câu cộng đúng context diagram trên slide — đủ để bắt đầu, quá mỏng để kết thúc.</p>
<p class="nhan">Đang có gì</p>
<ul>
<li><strong>1.1 Product vision</strong> — câu giới thiệu ở slide thuyết trình 4.</li>
<li><strong>1.2 Scope</strong> — chỉ có context diagram (chú thích ghi "Context Digram").</li>
</ul>
<p class="nhan">Mục scope cần có (vision &amp; scope theo Wiegers)</p>
<ol>
<li><strong>Tính năng chính</strong> — danh sách đánh số (FE-1 Đăng tin, FE-2 Ứng tuyển, …) để phần sau của RDS tham chiếu.</li>
<li><strong>Phạm vi theo iteration</strong> — tính năng nào giao ở iteration 1, 2, 3.</li>
<li><strong>Giới hạn &amp; loại trừ</strong> — G5 có viết (không thanh toán, không hợp đồng) nhưng đặt ở trang 212; chỗ của chúng là ở đây.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> scope trả lời "có gì, không có gì, và khi nào" — một mình sơ đồ không trả lời được câu nào.</p>`],
      [8, '2.1 Actors — Administrator, Recruiter, Freelancer, Guest — and the start of 2.3 Use Cases',
        `<p class="y-chinh">🎯 The actor table gives each role three bullet points — a good habit, but several bullets promise features the system does not have.</p>
<p class="nhan">Check every bullet against the rest of the package</p>
<ul>
<li><strong>"view profiles and reviews of freelancers"</strong> — there is no review screen and no review table among the 22.</li>
<li><strong>"Verify and review information"</strong> (Admin) — a "Verify Identity" menu item exists, but no use case, screen or tracking row.</li>
<li><strong>Guest "can view freelancer information"</strong> — the authorization matrix (page 23) gives Guest no freelancer screen.</li>
</ul>
<p class="nhan">Form</p>
<ul>
<li><strong>Second person</strong> — "You can search…": an RDS describes roles in the third person.</li>
<li><strong>Numbering jumps</strong> from 2.1 Actors to 2.3 Use Cases.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bảng actor cho mỗi vai trò ba gạch đầu dòng — thói quen tốt, nhưng nhiều dòng hứa hẹn tính năng hệ thống không có.</p>
<p class="nhan">Đối chiếu từng dòng với phần còn lại của bộ hồ sơ</p>
<ul>
<li><strong>"view profiles and reviews of freelancers"</strong> — không có màn hình review và không có bảng review nào trong 22 bảng.</li>
<li><strong>"Verify and review information"</strong> (Admin) — có mục menu "Verify Identity", nhưng không có use case, màn hình hay dòng tracking nào.</li>
<li><strong>Guest "can view freelancer information"</strong> — ma trận phân quyền (trang 23) không cho Guest màn hình freelancer nào.</li>
</ul>
<p class="nhan">Hình thức</p>
<ul>
<li><strong>Ngôi thứ hai</strong> — "You can search…": RDS mô tả vai trò ở ngôi thứ ba.</li>
<li><strong>Đánh số nhảy cóc</strong> từ 2.1 Actors sang 2.3 Use Cases.</li>
</ul>`],
      [9, 'Use case diagram — Admin (Manage Freelancer, Manage Recruiter, Manage Projects, Manage Skills, Manage Position)',
        `<p class="y-chinh">🎯 The Admin diagram — the one missing from the presentation — shows five "Manage …" groups, each including a "View list …" case.</p>
<p class="nhan">Consistency problems</p>
<ul>
<li><strong>"Position" vs "Categories"</strong> — the database, screens and tracking rows all say <em>Categories</em>; the diagram says <em>Position</em>.</li>
<li><strong>Missing admin work</strong> — blog management (7 tracking rows), dashboard, admin profile.</li>
<li><strong>"Change status Post Job «include» View report of project"</strong> — the report list is a separate screen (RDS 4.29), not a step of changing a status.</li>
</ul>
<p class="dap-an">✅ Before each submission, list the ellipses of every diagram next to the Product sheet rows — every row needs an ellipse, every ellipse a row.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ Admin — cái bị thiếu trong bài thuyết trình — gồm năm nhóm "Manage …", mỗi nhóm include một use case "View list …".</p>
<p class="nhan">Chỗ không nhất quán</p>
<ul>
<li><strong>"Position" và "Categories"</strong> — CSDL, màn hình và dòng tracking đều gọi là <em>Categories</em>; sơ đồ lại ghi <em>Position</em>.</li>
<li><strong>Thiếu việc của admin</strong> — quản lý blog (7 dòng tracking), dashboard, hồ sơ admin.</li>
<li><strong>"Change status Post Job «include» View report of project"</strong> — danh sách report là màn hình riêng (RDS 4.29), không phải một bước của việc đổi trạng thái.</li>
</ul>
<p class="dap-an">✅ Trước mỗi lần nộp, đặt danh sách ellipse của mọi sơ đồ cạnh các dòng sheet Product — dòng nào cũng phải có ellipse, ellipse nào cũng phải có dòng.</p>`],
    ]),
    walk(R, [
      [10, 'Use case diagram — Freelancer (the same image as presentation slide 8)',
        `<p class="y-chinh">🎯 The RDS and the slides use the same Freelancer diagram — good for consistency, so the defects of S.1 slide 8 are in the document too.</p>
<p class="nhan">One more point the document makes visible</p>
<ul>
<li><strong>"Search Post Job" hangs on Freelancer</strong> — but Freelancer inherits from Guest, and the actor table says Guest can search jobs. Put the case on Guest; Freelancer gets it through the generalisation arrow.</li>
<li><strong>Reuse the S.1 fixes</strong> — Login as a precondition, no «include»/«extend» between separate goals, correct spelling of stereotypes.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> with actor generalisation, draw each shared case once, on the most general actor.</p>`,
        `<p class="y-chinh">🎯 RDS và slide dùng cùng một sơ đồ Freelancer — tốt cho sự nhất quán, nên các lỗi của slide 8 ở bài S.1 cũng nằm trong tài liệu.</p>
<p class="nhan">Thêm một điểm mà tài liệu làm lộ ra</p>
<ul>
<li><strong>"Search Post Job" gắn vào Freelancer</strong> — nhưng Freelancer kế thừa Guest, và bảng actor nói Guest tìm được việc. Đặt use case ở Guest; Freelancer có nó nhờ mũi tên tổng quát hoá.</li>
<li><strong>Dùng lại cách sửa ở S.1</strong> — Login là điều kiện tiên quyết, không «include»/«extend» giữa các mục tiêu riêng, viết đúng chính tả stereotype.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khi có tổng quát hoá actor, mỗi use case dùng chung chỉ vẽ một lần, ở actor tổng quát nhất.</p>`],
      [11, 'Use case diagram — Recruiter (same image as slide 9), then the heading "Diagram Guest"',
        `<p class="y-chinh">🎯 The Recruiter diagram repeats slide 9; the page ends with the heading "Diagram Guest" while the diagram itself falls on the next page.</p>
<ul>
<li><strong>Content</strong> — see S.1 slide 9: login-related «include»s, "BookMark" on the wrong object, "Proflie".</li>
<li><strong>Layout</strong> — a heading left alone at the bottom of a page. In Word, set headings to <em>Keep with next</em>; export to PDF and page through it before every submission.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sơ đồ Recruiter lặp lại slide 9; trang kết thúc bằng tiêu đề "Diagram Guest" còn sơ đồ thì rơi sang trang sau.</p>
<ul>
<li><strong>Nội dung</strong> — xem S.1 slide 9: các «include» quanh đăng nhập, "BookMark" gắn sai đối tượng, "Proflie".</li>
<li><strong>Trình bày</strong> — tiêu đề nằm trơ trọi cuối trang. Trong Word, đặt tiêu đề là <em>Keep with next</em>; xuất PDF và lật qua từng trang trước mỗi lần nộp.</li>
</ul>`],
      [12, 'Use case diagram — Guest (draw.io, still in edit mode) and 2.3 b. Use Case Description table, UC_01–UC_04',
        `<p class="y-chinh">🎯 The Guest diagram and the start of the use-case description table — the table is where the copying shows most.</p>
<p class="nhan">The Guest diagram</p>
<ul>
<li><strong>Captured while editing</strong> — blue selection handles and the draw.io grid are visible. Export the diagram (PNG/SVG), never screenshot the editor.</li>
<li><strong>Four cases</strong> — create account, view post, find job, view job details (+ company information).</li>
</ul>
<p class="nhan">The description table (UC_01–UC_54, pages 12–16)</p>
<ol>
<li><strong>It describes screens, not goals</strong> — "This is a pop-up screen that allows users to…".</li>
<li><strong>Register copied from Login</strong> — UC_01 and UC_02 "allow users to <em>log in</em>".</li>
<li><strong>Features that do not exist</strong> — "log in via Google, Facebook or Apple": the login screen and SQL (page 50) use username + password only.</li>
<li><strong>Duplicated three times</strong> — the same text is in 3.2 Screen Descriptions and in column D of the Product sheet.</li>
</ol>`,
        `<p class="y-chinh">🎯 Sơ đồ Guest và phần đầu bảng mô tả use case — bảng này là nơi dấu vết sao chép lộ rõ nhất.</p>
<p class="nhan">Sơ đồ Guest</p>
<ul>
<li><strong>Chụp khi đang sửa</strong> — còn thấy tay nắm chọn màu xanh và lưới của draw.io. Hãy export sơ đồ (PNG/SVG), đừng chụp màn hình trình soạn.</li>
<li><strong>Bốn use case</strong> — tạo tài khoản, xem tin, tìm việc, xem chi tiết việc (+ thông tin công ty).</li>
</ul>
<p class="nhan">Bảng mô tả (UC_01–UC_54, trang 12–16)</p>
<ol>
<li><strong>Mô tả màn hình, không mô tả mục tiêu</strong> — "This is a pop-up screen that allows users to…".</li>
<li><strong>Register chép từ Login</strong> — UC_01 và UC_02 "allow users to <em>log in</em>".</li>
<li><strong>Tính năng không tồn tại</strong> — "log in via Google, Facebook or Apple": màn hình đăng nhập và SQL (trang 50) chỉ dùng username + password.</li>
<li><strong>Lặp ba lần</strong> — cùng đoạn chữ có trong 3.2 Screen Descriptions và cột D của sheet Product.</li>
</ol>`],
    ]),
    walk(R, [
      [16, 'End of the use-case table (UC_51–UC_54) and 3.1 Screens Flow — a. Freelancer screens flow',
        `<p class="y-chinh">🎯 The use-case table ends with four admin post functions, two of which were never built; then the Freelancer screen flow (= slide 10) begins.</p>
<p class="nhan">Check the last rows against the tracking sheet</p>
<ul>
<li><strong>UC_52 Update post, UC_54 DeletePost (Admin)</strong> — no tracking row, no screen. The admin only approves and suspends projects (rows UC_78, UC_79).</li>
<li><strong>UC_53 Post moderation</strong> — built as "Approve / Suspend project" under a different name.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Promised but not built = requirement leakage.</strong> Every use case in the final RDS is read as "delivered". Delete or mark "out of scope" what you will not build, before iteration 3.</div>`,
        `<p class="y-chinh">🎯 Bảng use case kết thúc bằng bốn chức năng về tin của admin, hai trong số đó không bao giờ được làm; tiếp theo là screen flow Freelancer (= slide 10).</p>
<p class="nhan">Đối chiếu các dòng cuối với sheet tracking</p>
<ul>
<li><strong>UC_52 Update post, UC_54 DeletePost (Admin)</strong> — không có dòng tracking, không có màn hình. Admin chỉ duyệt và tạm dừng dự án (dòng UC_78, UC_79).</li>
<li><strong>UC_53 Post moderation</strong> — được làm dưới tên khác là "Approve / Suspend project".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Hứa mà không làm = yêu cầu bị rò rỉ.</strong> Mọi use case trong RDS cuối cùng đều được hiểu là "đã giao". Xoá hoặc ghi "ngoài phạm vi" những gì nhóm sẽ không làm, trước iteration 3.</div>`],
      [17, 'b. Recruiter screens flow (= slide 11) and c. Admin screens flow (login → authentication → dashboard → 8 pages)',
        `<p class="y-chinh">🎯 The Admin flow finally appears: login, an authentication decision, then a dashboard fanning out to eight management pages.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>The success/fail path of login</strong> is explicit.</li>
<li><strong>Every admin area</strong> is reachable from the dashboard in one click.</li>
</ul>
<p class="nhan">Problems</p>
<ul>
<li><strong>A flowchart diamond</strong> inside a screen flow — boxes should be screens; decisions go in the use-case flows.</li>
<li><strong>"Page Manage Position"</strong> again, and a "View Analytics" page that appears nowhere else.</li>
<li><strong>One level only</strong> — the add/edit pop-ups and detail screens (dozens of tracking rows) are not drawn.</li>
<li><strong>"d. guest screen flow"</strong> — heading at the bottom, diagram on the next page.</li>
</ul>`,
        `<p class="y-chinh">🎯 Flow Admin cuối cùng cũng xuất hiện: đăng nhập, một ô quyết định xác thực, rồi dashboard toả ra tám trang quản lý.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Nhánh thành công/thất bại của đăng nhập</strong> được vẽ rõ.</li>
<li><strong>Mọi khu vực của admin</strong> đều tới được từ dashboard trong một cú bấm.</li>
</ul>
<p class="nhan">Vấn đề</p>
<ul>
<li><strong>Ô quyết định kiểu flowchart</strong> nằm trong screen flow — ô phải là màn hình; quyết định để trong các luồng của use case.</li>
<li><strong>Lại "Page Manage Position"</strong>, và một trang "View Analytics" không xuất hiện ở đâu khác.</li>
<li><strong>Chỉ một tầng</strong> — các pop-up thêm/sửa và màn hình chi tiết (hàng chục dòng tracking) không được vẽ.</li>
<li><strong>"d. guest screen flow"</strong> — tiêu đề nằm cuối trang, sơ đồ sang trang sau.</li>
</ul>`],
      [18, 'd. Guest screen flow and 3.2 Screen Descriptions — header and UC_01–UC_03',
        `<p class="y-chinh">🎯 The Guest flow has four screens; the Screen Descriptions table then repeats the use-case table almost word for word.</p>
<p class="nhan">Guest flow</p>
<ul>
<li><strong>Home → view post → job details → company information</strong>, and Home → register.</li>
<li><strong>Missing</strong> — login, blog, About Us (the authorization matrix lets Guest view the blog).</li>
</ul>
<p class="nhan">Screen Descriptions (pages 18–23)</p>
<ul>
<li><strong>An empty orange row</strong> under the header — the template's sample row, never deleted.</li>
<li><strong>Same text as 2.3 b</strong> — including "Register … allows users to log in".</li>
<li><strong>Its own numbering</strong> — UC_01–UC_50, so UC_13 here ≠ UC_13 in the use-case table.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> 2.3 b describes <em>goals</em> ("the recruiter posts a job"), 3.2 describes <em>screens</em> (fields, buttons, where it leads). Same row IDs, different content.</p>`,
        `<p class="y-chinh">🎯 Flow Guest có bốn màn hình; sau đó bảng Screen Descriptions lặp lại bảng use case gần như từng chữ.</p>
<p class="nhan">Flow Guest</p>
<ul>
<li><strong>Home → xem tin → chi tiết việc → thông tin công ty</strong>, và Home → đăng ký.</li>
<li><strong>Thiếu</strong> — đăng nhập, blog, About Us (ma trận phân quyền cho Guest xem blog).</li>
</ul>
<p class="nhan">Screen Descriptions (trang 18–23)</p>
<ul>
<li><strong>Một dòng cam trống</strong> dưới tiêu đề — dòng mẫu của template, chưa xoá.</li>
<li><strong>Cùng chữ với 2.3 b</strong> — kể cả câu "Register … allows users to log in".</li>
<li><strong>Đánh số riêng</strong> — UC_01–UC_50, nên UC_13 ở đây ≠ UC_13 trong bảng use case.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 2.3 b mô tả <em>mục tiêu</em> ("recruiter đăng một tin"), 3.2 mô tả <em>màn hình</em> (trường, nút, dẫn đi đâu). Cùng mã dòng, khác nội dung.</p>`],
    ]),
    bi(`<h3>Pages not shown: 13–15 and 19–22 (the two description tables)</h3>
<table>
<thead><tr><th>Pages</th><th>Content</th><th>Defects found by reading every row</th></tr></thead>
<tbody>
<tr><td>13–15</td><td>Use-case table UC_05–UC_50</td><td>UC_11 used twice (View My List Post, Create post); UC_40 missing; UC_18 "View favorite" = "a list of all blog posts … allowing <em>admins</em> to edit"; UC_19 List Apply and UC_20 Search job describe <em>admin</em> work on a freelancer feature; UC_34 Add freelancer / UC_39 Add recruiter never built</td></tr>
<tr><td>19–22</td><td>Screen descriptions UC_04–UC_47</td><td>UC_12, UC_30, UC_33 missing; UC_29 has no screen name; the same admin-copied texts for View favorite and List Apply</td></tr>
</tbody>
</table>`,
    `<h3>Các trang không đưa: 13–15 và 19–22 (hai bảng mô tả)</h3>
<table>
<thead><tr><th>Trang</th><th>Nội dung</th><th>Lỗi tìm được khi đọc từng dòng</th></tr></thead>
<tbody>
<tr><td>13–15</td><td>Bảng use case UC_05–UC_50</td><td>UC_11 dùng hai lần (View My List Post, Create post); thiếu UC_40; UC_18 "View favorite" = "danh sách mọi bài blog … cho <em>admin</em> sửa"; UC_19 List Apply và UC_20 Search job mô tả việc của <em>admin</em> cho tính năng của freelancer; UC_34 Add freelancer / UC_39 Add recruiter không bao giờ được làm</td></tr>
<tr><td>19–22</td><td>Screen descriptions UC_04–UC_47</td><td>thiếu UC_12, UC_30, UC_33; UC_29 không có tên màn hình; lặp lại các đoạn chép kiểu admin cho View favorite và List Apply</td></tr>
</tbody>
</table>`),
    walk(R, [
      [23, 'End of Screen Descriptions (UC_48–UC_50) and 3.3 Screen Authorization — Register … View status job application',
        `<p class="y-chinh">🎯 The authorization matrix says which role may open which screen — it is what your login filter must enforce, so every X matters.</p>
<p class="nhan">Rows that grant the wrong role</p>
<ul>
<li><strong>Edit Recruiter's Profile</strong> — ticked for Freelancer and Admin, not only Recruiter.</li>
<li><strong>Update / Delete Recruiter</strong> (page 24) — ticked for <em>Recruiter</em>; account management is Admin work.</li>
<li><strong>View favorite</strong> — ticked for Recruiter, who has no favourite screen (he bookmarks freelancers).</li>
</ul>
<p class="nhan">Rows missing for the right role</p>
<ul>
<li><strong>Search job</strong> — no X for Guest, although the actor table lets a guest search.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ma trận phân quyền nói vai trò nào được mở màn hình nào — đó chính là thứ filter đăng nhập phải thực thi, nên từng dấu X đều quan trọng.</p>
<p class="nhan">Dòng cấp quyền cho sai vai trò</p>
<ul>
<li><strong>Edit Recruiter's Profile</strong> — đánh X cho cả Freelancer và Admin, không chỉ Recruiter.</li>
<li><strong>Update / Delete Recruiter</strong> (trang 24) — đánh X cho <em>Recruiter</em>; quản lý tài khoản là việc của Admin.</li>
<li><strong>View favorite</strong> — đánh X cho Recruiter, người không có màn hình yêu thích (họ đánh dấu freelancer).</li>
</ul>
<p class="nhan">Dòng thiếu quyền cho đúng vai trò</p>
<ul>
<li><strong>Search job</strong> — Guest không có X, dù bảng actor cho guest tìm việc.</li>
</ul>`],
      [24, 'Screen Authorization (continued) and 3.4 Non-UI Functions — Reset password by gmail, Log out',
        `<p class="y-chinh">🎯 The second half of the matrix has duplicate rows, and the Non-UI table lists two things that are not background functions.</p>
<p class="nhan">Matrix</p>
<ul>
<li><strong>Duplicates</strong> — "Change status account Freelancer" and "… Recruiter" appear twice each, "View Freelancers" and "View list freelancer" are the same screen.</li>
</ul>
<p class="nhan">Non-UI functions</p>
<ul>
<li><strong>"Customers can use their Gmail account"</strong> — "customers" is the word of an e-commerce template; this system has freelancers and recruiters.</li>
<li><strong>"Log out"</strong> — a button on every page, not a non-UI function.</li>
<li><strong>What should be here</strong> — the e-mail sending service, the authorization filter that applies this very matrix, the "Job for You" skill matching.</li>
</ul>
<p class="ghi-chu">The blue italic line "[Provide the descriptions for the functions which have no UI…]" is the template's instruction — delete such lines before submitting.</p>`,
        `<p class="y-chinh">🎯 Nửa sau của ma trận có dòng trùng, và bảng Non-UI liệt kê hai thứ không phải chức năng chạy nền.</p>
<p class="nhan">Ma trận</p>
<ul>
<li><strong>Dòng trùng</strong> — "Change status account Freelancer" và "… Recruiter" mỗi dòng xuất hiện hai lần, "View Freelancers" với "View list freelancer" là cùng một màn hình.</li>
</ul>
<p class="nhan">Non-UI functions</p>
<ul>
<li><strong>"Customers can use their Gmail account"</strong> — "customers" là từ của template thương mại điện tử; hệ thống này có freelancer và recruiter.</li>
<li><strong>"Log out"</strong> — một nút trên mọi trang, không phải chức năng non-UI.</li>
<li><strong>Chỗ này nên có</strong> — dịch vụ gửi e-mail, filter phân quyền thực thi chính ma trận này, việc so khớp kỹ năng của "Job for You".</li>
</ul>
<p class="ghi-chu">Dòng chữ nghiêng xanh "[Provide the descriptions for the functions which have no UI…]" là hướng dẫn của template — xoá những dòng như vậy trước khi nộp.</p>`],
    ]),
    walk(R, [
      [25, '"3." System High Level Design — 3.1 a. Database Schema and b. Table Descriptions (01 Admin, 02 Blogs)',
        `<p class="y-chinh">🎯 The design chapter opens with the database diagram and a "description" of each table — which is the CREATE TABLE code pasted into a cell.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>A generated schema diagram</strong> — all 22 tables with their links.</li>
<li><strong>Every table is listed</strong> (01–22, pages 25–29).</li>
</ul>
<p class="nhan">What a table description should say instead</p>
<ol>
<li><strong>Purpose</strong> — "one row per job post created by a recruiter".</li>
<li><strong>Keys</strong> — primary key, foreign keys and what they point to.</li>
<li><strong>Meaning of codes</strong> — what <code>Post.status</code> 0/1 and <code>Post.checking</code> mean, what JobApply status '0'/'1'/'2' mean.</li>
</ol>
<p class="ghi-chu">Numbering error: the chapter is "3." again, right after "3. Overall Functionalities" — it should be II or 4.</p>`,
        `<p class="y-chinh">🎯 Chương thiết kế mở đầu bằng sơ đồ CSDL và "mô tả" từng bảng — thực chất là đoạn code CREATE TABLE dán vào ô.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Sơ đồ schema sinh tự động</strong> — đủ 22 bảng cùng các liên kết.</li>
<li><strong>Bảng nào cũng được liệt kê</strong> (01–22, trang 25–29).</li>
</ul>
<p class="nhan">Mô tả bảng lẽ ra phải nói</p>
<ol>
<li><strong>Mục đích</strong> — "mỗi dòng là một tin tuyển dụng do một recruiter tạo".</li>
<li><strong>Khoá</strong> — khoá chính, khoá ngoại và chúng trỏ tới đâu.</li>
<li><strong>Ý nghĩa các mã</strong> — <code>Post.status</code> 0/1 và <code>Post.checking</code> nghĩa là gì, trạng thái JobApply '0'/'1'/'2' nghĩa là gì.</li>
</ol>
<p class="ghi-chu">Lỗi đánh số: chương lại là "3.", ngay sau "3. Overall Functionalities" — lẽ ra là II hoặc 4.</p>`],
    ]),
    bi(`<h3>Pages not shown: 26–28 (table descriptions 03–22)</h3>
<p>The same pattern for Categories … User: raw column lists, no purpose, no code meanings. The column lists themselves reveal the naming problems discussed in S.7 — <code>freelanceID</code> / <code>freelancerID</code>, <code>ExpertiID</code>, and a primary key spelled <code>dregeeID</code> in the Degree table.</p>`,
    `<h3>Các trang không đưa: 26–28 (mô tả bảng 03–22)</h3>
<p>Cùng một khuôn cho Categories … User: danh sách cột thô, không mục đích, không nghĩa của mã. Chính danh sách cột làm lộ các vấn đề đặt tên phân tích ở S.7 — <code>freelanceID</code> / <code>freelancerID</code>, <code>ExpertiID</code>, và khoá chính viết thành <code>dregeeID</code> trong bảng Degree.</p>`),
    walk(R, [
      [29, '3.2 Code Packages — package diagram and descriptions (Controller, Models, Dal)',
        `<p class="y-chinh">🎯 The package diagram shows a classic servlet MVC with DAOs — the architecture SWP391 teaches — but the descriptions do not match it.</p>
<p class="nhan">What the diagram shows</p>
<ul>
<li><strong>Web Pages</strong> → Views, Admin Views, Assets (JS, CSS, img, plugins, scripts)</li>
<li><strong>Controller</strong> → AdminController, AccountControll, CommonControll, FreelancerControll, RecruiterControll</li>
<li><strong>DAL</strong> → DBContext + AdminDAO, CommonDAO, FreelancerDAO, HomeDAO, RecruiterDAO</li>
<li><strong>Models</strong> → 12 entity classes (User, Post, Company, JobApply …)</li>
</ul>
<p class="nhan">What an examiner corrects</p>
<ul>
<li><strong>"Models … contains all the assets and resources … to display on the admin browser"</strong> — models are entity classes that map tables.</li>
<li><strong>Business logic inside servlets</strong> — no service layer, so validation and rules are scattered over controllers.</li>
<li><strong>Missing packages</strong> — a filter for the authorization matrix, a mail utility; names cut off ("…Controll").</li>
</ul>`,
        `<p class="y-chinh">🎯 Package diagram thể hiện mô hình MVC servlet kinh điển có DAO — đúng kiến trúc SWP391 dạy — nhưng phần mô tả lại không khớp.</p>
<p class="nhan">Sơ đồ thể hiện</p>
<ul>
<li><strong>Web Pages</strong> → Views, Admin Views, Assets (JS, CSS, img, plugins, scripts)</li>
<li><strong>Controller</strong> → AdminController, AccountControll, CommonControll, FreelancerControll, RecruiterControll</li>
<li><strong>DAL</strong> → DBContext + AdminDAO, CommonDAO, FreelancerDAO, HomeDAO, RecruiterDAO</li>
<li><strong>Models</strong> → 12 lớp thực thể (User, Post, Company, JobApply …)</li>
</ul>
<p class="nhan">Giám khảo sẽ sửa</p>
<ul>
<li><strong>"Models … contains all the assets and resources … to display on the admin browser"</strong> — model là lớp thực thể ánh xạ bảng.</li>
<li><strong>Logic nghiệp vụ nằm trong servlet</strong> — không có tầng service, nên validation và business rule rải rác khắp các controller.</li>
<li><strong>Thiếu package</strong> — filter thực thi ma trận phân quyền, tiện ích gửi mail; tên bị cắt cụt ("…Controll").</li>
</ul>`],
    ]),
    bi(`<h3>Write your overview chapters better — the consistency checklist</h3>
<table>
<thead><tr><th>Check</th><th>How</th><th>G5 result</th></tr></thead>
<tbody>
<tr><td>One ID per screen, used everywhere</td><td>Product sheet ID = use-case table ID = screen-design heading</td><td>✗ four numbering schemes</td></tr>
<tr><td>One name per thing</td><td>glossary: Categories (not Position), Post (not Project/Job)</td><td>✗ Position/Categories, Post/Project</td></tr>
<tr><td>Every actor bullet is a built feature</td><td>tick each bullet against a tracking row</td><td>✗ reviews, verify identity</td></tr>
<tr><td>Every ellipse has a row, every row an ellipse</td><td>side-by-side list before each submission</td><td>✗ admin post update/delete, blog missing</td></tr>
<tr><td>Matrix = login filter</td><td>generate the filter's role map from the matrix</td><td>✗ recruiter can delete recruiters</td></tr>
<tr><td>No template leftovers</td><td>search the PDF for "[", "Provide", "customer"</td><td>✗ instruction lines, sample rows</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Beyond the syllabus — one source of truth.</strong> Professional teams keep screens in one list (a sheet or a YAML file) and <em>generate</em> the ID tables, the authorization map and even the menu from it. For SWP391, the Product sheet can be that list: copy its ID + name columns into the RDS tables instead of retyping them.</div>`,
    `<h3>Viết các chương tổng quan tốt hơn — bảng kiểm tính nhất quán</h3>
<table>
<thead><tr><th>Kiểm</th><th>Cách làm</th><th>Kết quả của G5</th></tr></thead>
<tbody>
<tr><td>Mỗi màn hình một mã, dùng ở mọi nơi</td><td>mã sheet Product = mã bảng use case = tiêu đề screen design</td><td>✗ bốn hệ đánh số</td></tr>
<tr><td>Mỗi thứ một tên</td><td>có glossary: Categories (không phải Position), Post (không phải Project/Job)</td><td>✗ Position/Categories, Post/Project</td></tr>
<tr><td>Mỗi dòng mô tả actor là một tính năng đã làm</td><td>đánh dấu từng dòng với một dòng tracking</td><td>✗ review, verify identity</td></tr>
<tr><td>Ellipse nào cũng có dòng, dòng nào cũng có ellipse</td><td>đặt hai danh sách cạnh nhau trước mỗi lần nộp</td><td>✗ admin sửa/xoá tin, thiếu blog</td></tr>
<tr><td>Ma trận = filter đăng nhập</td><td>sinh bảng quyền của filter từ chính ma trận</td><td>✗ recruiter xoá được recruiter</td></tr>
<tr><td>Không sót phần thừa của template</td><td>tìm trong PDF các chuỗi "[", "Provide", "customer"</td><td>✗ dòng hướng dẫn, dòng mẫu</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Ngoài giáo trình — một nguồn sự thật duy nhất.</strong> Nhóm chuyên nghiệp giữ danh sách màn hình ở một chỗ (một sheet hoặc file YAML) rồi <em>sinh ra</em> bảng mã, bảng phân quyền, thậm chí cả menu từ đó. Với SWP391, sheet Product có thể là danh sách ấy: chép cột mã + tên của nó sang các bảng trong RDS thay vì gõ lại.</div>`),
    books([
      ['wiegers', 'Ch.5 (vision &amp; scope, limitations and exclusions) and Ch.8 (use cases)', 'Chương 5 (vision &amp; scope, giới hạn và loại trừ) và Chương 8 (use case)'],
      ['cockburn', 'Ch.2 "The use case as a contract for behavior" and Ch.10 "Includes and extends"', 'Chương 2 "The use case as a contract for behavior" và Chương 10 "Includes and extends"'],
      ['gomaa', 'Ch.6 "Use case modeling" and Ch.12 "Software architecture" (layers and packages)', 'Chương 6 "Use case modeling" và Chương 12 "Software architecture" (tầng và package)'],
    ]),
  ].join('\n'),
};

/* ─────────────── S.3 RDS part II — requirement specifications ─────────────── */
const L3 = {
  title: 'S.3 — The G5 RDS, part II: use-case specifications & business rules|||S.3 — RDS của G5, phần II: đặc tả use case & business rule',
  slug: 'swp391-sample-g5-rds-requirements',
  type: 'VIDEO',
  description: 'RDS của G5 trang 30–49: đặc tả use case theo template (trigger, pre/post, normal/alternative flow, exception, priority) và business rule — chỉ 17 use case được đặc tả cho 85 màn hình; lỗi chép từ dự án khác, mã UC trùng, rule rỗng; và một đặc tả mẫu viết lại đúng cách.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.3 · G5 RDS pages 30–49</span>
<h2>The RDS, part II — where each feature is specified</h2>
<p class="lead">Section II is the heart of the <em>requirement</em> grade: one <strong>use-case specification</strong> (the template's table) plus <strong>business rules</strong> per feature. G5's section runs over 20 pages — and specifies only <strong>17 use cases for a product of 85 screens/functions</strong>.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Read a use-case specification field by field and spot what does not belong in each field.</li>
<li>Tell a business rule from a validation, a precondition and a wish.</li>
<li>Write one complete specification for your own screen — the model is at the end of this lesson.</li>
</ul></div>
<h3>What pages 30–49 contain</h3>
<table>
<thead><tr><th>Pages</th><th>Feature / use case</th><th>Shown</th></tr></thead>
<tbody>
<tr><td>30–33</td><td>1.1 Login (UC-1) · 1.2–1.3 Register freelancer / recruiter (UC-2, UC-3)</td><td>33</td></tr>
<tr><td>34–37</td><td>1.4 Home page (UC-4) · 1.5 Forgot password (UC-5) · 1.6 Change password (UC-6)</td><td>—</td></tr>
<tr><td>38–41</td><td>2.1 View list freelancer (UC-6) · 2.2 View list recruiter (UC-7) · 2.3–2.4 Change status freelancer / recruiter</td><td>—</td></tr>
<tr><td>42–45</td><td>3.1–3.2 View / update freelancer profile · 3.3 Report post · 3.4–3.5 View post by category / location</td><td>43</td></tr>
<tr><td>46–49</td><td>4.1 Edit profile recruiter · 4.2 Company detail</td><td>47, 49</td></tr>
</tbody>
</table>
<p class="ghi-chu">Pages marked "—" carry the author's name or student ID in the "Created By" row and are not published; their text is analysed below without it.</p>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.3 · RDS của G5 trang 30–49</span>
<h2>RDS, phần II — nơi từng tính năng được đặc tả</h2>
<p class="lead">Mục II là trái tim của điểm <em>yêu cầu</em>: mỗi tính năng một <strong>đặc tả use case</strong> (bảng của template) cộng <strong>business rule</strong>. Mục này của G5 dài hơn 20 trang — và chỉ đặc tả <strong>17 use case cho một sản phẩm 85 màn hình/chức năng</strong>.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Đọc một đặc tả use case theo từng trường và nhận ra thứ gì không thuộc về trường đó.</li>
<li>Phân biệt business rule với validation, precondition và một mong muốn.</li>
<li>Viết một đặc tả hoàn chỉnh cho màn hình của mình — bản mẫu nằm ở cuối bài.</li>
</ul></div>
<h3>Trang 30–49 chứa gì</h3>
<table>
<thead><tr><th>Trang</th><th>Tính năng / use case</th><th>Có đưa</th></tr></thead>
<tbody>
<tr><td>30–33</td><td>1.1 Login (UC-1) · 1.2–1.3 Đăng ký freelancer / recruiter (UC-2, UC-3)</td><td>33</td></tr>
<tr><td>34–37</td><td>1.4 Home page (UC-4) · 1.5 Forgot password (UC-5) · 1.6 Change password (UC-6)</td><td>—</td></tr>
<tr><td>38–41</td><td>2.1 View list freelancer (UC-6) · 2.2 View list recruiter (UC-7) · 2.3–2.4 Đổi trạng thái freelancer / recruiter</td><td>—</td></tr>
<tr><td>42–45</td><td>3.1–3.2 Xem / sửa hồ sơ freelancer · 3.3 Report post · 3.4–3.5 Xem tin theo danh mục / địa điểm</td><td>43</td></tr>
<tr><td>46–49</td><td>4.1 Sửa hồ sơ recruiter · 4.2 Chi tiết công ty</td><td>47, 49</td></tr>
</tbody>
</table>
<p class="ghi-chu">Các trang ghi "—" có tên hoặc mã sinh viên của người viết ở dòng "Created By" nên không công bố; nội dung chữ của chúng được phân tích ở dưới mà không kèm thông tin đó.</p>`),
    walkHead(R, 30, 49, 'Only pages 33, 43, 47 and 49 are published; the others are analysed from their text.', 'Chỉ trang 33, 43, 47 và 49 được công bố; các trang còn lại được phân tích từ nội dung chữ.'),
    walk(R, [
      [33, 'b. Business Rules — BR-9 Strong Passwords, BR-10 Account Management (closing the Register sections)',
        `<p class="y-chinh">🎯 One real business rule and one wish share this table — learn to tell them apart.</p>
<p class="nhan">BR-9 Strong Passwords — a good rule</p>
<ul>
<li><strong>Testable</strong> — at least 8 characters, upper case + lower case + digit. A tester can write pass/fail cases from it.</li>
<li><strong>But not applied consistently</strong> — the Change Password screen (page 73) limits the new password to <code>String(8-16)</code>, the database column is <code>nvarchar(50)</code>, and the rule never states a maximum.</li>
</ul>
<p class="nhan">BR-10 Account Management — not a rule</p>
<ul>
<li><strong>"Allow users to manage … easily"</strong> — nothing to test, nothing to enforce. It is a feature wish; delete it or turn it into use cases.</li>
</ul>
<p class="nhan">Rule IDs</p>
<ul>
<li><strong>Three styles</strong> — "BR-9" here, "BR-09" in the appendix, "FR1/FR2" in Login. One list, one format, referenced by every spec.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a business rule is a <em>policy of the business</em> that constrains data or behaviour, and a tester can prove it true or false.</p>`,
        `<p class="y-chinh">🎯 Một business rule thật và một mong muốn nằm chung bảng — hãy học cách phân biệt.</p>
<p class="nhan">BR-9 Strong Passwords — một rule tốt</p>
<ul>
<li><strong>Kiểm thử được</strong> — tối thiểu 8 ký tự, có chữ hoa + chữ thường + chữ số. Tester viết được case pass/fail từ đó.</li>
<li><strong>Nhưng áp dụng không nhất quán</strong> — màn hình Change Password (trang 73) giới hạn mật khẩu mới <code>String(8-16)</code>, cột CSDL là <code>nvarchar(50)</code>, còn rule không hề nêu độ dài tối đa.</li>
</ul>
<p class="nhan">BR-10 Account Management — không phải rule</p>
<ul>
<li><strong>"Allow users to manage … easily"</strong> — không có gì để test, không có gì để ép buộc. Đó là mong muốn về tính năng; xoá đi hoặc biến thành use case.</li>
</ul>
<p class="nhan">Mã rule</p>
<ul>
<li><strong>Ba kiểu</strong> — "BR-9" ở đây, "BR-09" ở phụ lục, "FR1/FR2" ở Login. Một danh sách, một định dạng, mọi đặc tả cùng tham chiếu.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> business rule là <em>chính sách của nghiệp vụ</em> ràng buộc dữ liệu hay hành vi, và tester chứng minh được nó đúng hay sai.</p>`],
      [43, '3.3 Report Post — the use-case table (trigger … assumptions) and "b. Business Rules: None"',
        `<p class="y-chinh">🎯 The Report Post specification fills every field of the template — and shows every typical fault of a copied specification on one page.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Numbered pre/postconditions</strong> — PRF-1, POST-1, POST-2.</li>
<li><strong>A clear normal flow</strong> — select the post, give a reason, system validates, saves, confirms.</li>
</ul>
<p class="nhan">Faults an examiner marks</p>
<ol>
<li><strong>Business rule copied from Update Profile</strong> — "verify their identity before updating their profile" has nothing to do with reporting.</li>
<li><strong>"b. Business Rules: None"</strong> right under a table that lists one.</li>
<li><strong>Broken layout</strong> — the exception text runs outside the table; a literal <code>&lt;br&gt;</code> is printed in Assumptions.</li>
<li><strong>Priority and frequency mixed</strong> — "high, Must Have" / "High (Must Have)".</li>
<li><strong>No alternative flow</strong> — what if the freelancer reports the same post twice? The <code>Report</code> table has no unique key to stop it.</li>
<li><strong>No outcome</strong> — who reads reports, and when is a post suspended? (Admin screen 4.29 lists them.)</li>
</ol>`,
        `<p class="y-chinh">🎯 Đặc tả Report Post điền đủ mọi trường của template — và bày ra mọi lỗi điển hình của một đặc tả sao chép chỉ trên một trang.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Pre/postcondition có đánh số</strong> — PRF-1, POST-1, POST-2.</li>
<li><strong>Normal flow rõ ràng</strong> — chọn tin, nêu lý do, hệ thống kiểm tra, lưu, xác nhận.</li>
</ul>
<p class="nhan">Lỗi giám khảo đánh dấu</p>
<ol>
<li><strong>Business rule chép từ Update Profile</strong> — "verify their identity before updating their profile" chẳng liên quan gì tới báo cáo tin.</li>
<li><strong>"b. Business Rules: None"</strong> ngay dưới một bảng có liệt kê rule.</li>
<li><strong>Vỡ bố cục</strong> — chữ của exception tràn ra ngoài bảng; chữ <code>&lt;br&gt;</code> in nguyên văn ở Assumptions.</li>
<li><strong>Trộn priority với frequency</strong> — "high, Must Have" / "High (Must Have)".</li>
<li><strong>Không có alternative flow</strong> — nếu freelancer báo cáo cùng một tin hai lần thì sao? Bảng <code>Report</code> không có khoá unique để chặn.</li>
<li><strong>Không có kết cục</strong> — ai đọc báo cáo, và khi nào tin bị tạm dừng? (Màn hình admin 4.29 có liệt kê chúng.)</li>
</ol>`],
    ]),
    walk(R, [
      [47, '4.1 Edit profile recruiter — exceptions, priority, frequency, business rules, other information, assumptions',
        `<p class="y-chinh">🎯 This page reads well but says almost nothing specific to this system — generic sentences that fit any web application.</p>
<p class="nhan">Good instinct</p>
<ul>
<li><strong>Exceptions are separated</strong> from the normal flow.</li>
<li><strong>Role-based access</strong> is mentioned — it belongs in the authorization matrix, and should be enforced there.</li>
</ul>
<p class="nhan">Why an examiner gives little credit</p>
<ul>
<li><strong>Untestable rules</strong> — "Data integrity must be maintained at all times".</li>
<li><strong>Rules with no implementation</strong> — "All changes should be logged for audit purposes": none of the 22 tables is a log.</li>
<li><strong>Technical, not business, exceptions</strong> — "database connectivity issue". The real ones: invalid phone format, image larger than the 300×300 the screen allows, a website that is not a URL.</li>
<li><strong>"Secondary actors: System, Database"</strong> — the system is never an actor of itself.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> if a sentence would still be true after replacing "recruiter" with "student" and "company" with "course", it is not a requirement of <em>your</em> system.</p>`,
        `<p class="y-chinh">🎯 Trang này đọc trôi chảy nhưng gần như không nói gì riêng cho hệ thống này — những câu chung chung hợp với mọi ứng dụng web.</p>
<p class="nhan">Ý đúng</p>
<ul>
<li><strong>Exception được tách riêng</strong> khỏi normal flow.</li>
<li><strong>Có nhắc phân quyền theo vai trò</strong> — chỗ của nó là ma trận phân quyền, và phải được thực thi ở đó.</li>
</ul>
<p class="nhan">Vì sao giám khảo cho ít điểm</p>
<ul>
<li><strong>Rule không kiểm được</strong> — "Data integrity must be maintained at all times".</li>
<li><strong>Rule không có hiện thực</strong> — "All changes should be logged for audit purposes": không bảng nào trong 22 bảng là bảng log.</li>
<li><strong>Exception kỹ thuật, không phải nghiệp vụ</strong> — "database connectivity issue". Exception thật: số điện thoại sai định dạng, ảnh lớn hơn 300×300 mà màn hình cho phép, website không phải URL.</li>
<li><strong>"Secondary actors: System, Database"</strong> — hệ thống không bao giờ là actor của chính nó.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nếu một câu vẫn đúng sau khi thay "recruiter" bằng "sinh viên" và "company" bằng "khoá học", thì đó không phải yêu cầu của <em>hệ thống bạn</em>.</p>`],
      [49, '4.2 Company Detail — priority, frequency, business rules, assumptions; then "III. Screen Designs — 1.1 Login System"',
        `<p class="y-chinh">🎯 The last specification contradicts the product: it restricts a page that the rest of the package makes public.</p>
<ul>
<li><strong>"Only authorized recruiters can view company details"</strong> — yet the Guest flow (page 18) ends at "view company information", and the tracking sheet gives "View company detail by ID" to all four actors.</li>
<li><strong>"All views … should be logged for audit purposes"</strong> — logging every page view, with no log table.</li>
<li><strong>"b. Business Rules: None"</strong> — again, right after rules were listed.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Contradictions are found in Q&amp;A.</strong> A juror opens the company page as a guest during the demo and asks which one is true — the document or the product. Fix the document; the product is what you built.</div>
<p class="ghi-chu">The page ends with the heading of chapter III while its content starts on page 50 — lesson S.4.</p>`,
        `<p class="y-chinh">🎯 Đặc tả cuối cùng mâu thuẫn với sản phẩm: nó giới hạn một trang mà phần còn lại của bộ hồ sơ để công khai.</p>
<ul>
<li><strong>"Only authorized recruiters can view company details"</strong> — trong khi flow Guest (trang 18) kết thúc ở "view company information", và sheet tracking giao "View company detail by ID" cho cả bốn actor.</li>
<li><strong>"All views … should be logged for audit purposes"</strong> — ghi log mỗi lượt xem trang, mà không có bảng log.</li>
<li><strong>"b. Business Rules: None"</strong> — lại nữa, ngay sau khi vừa liệt kê rule.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Mâu thuẫn bị phát hiện ở Q&amp;A.</strong> Một thành viên hội đồng mở trang công ty dưới vai guest ngay lúc demo và hỏi cái nào đúng — tài liệu hay sản phẩm. Hãy sửa tài liệu; sản phẩm là thứ bạn đã làm ra.</div>
<p class="ghi-chu">Trang kết thúc bằng tiêu đề chương III trong khi nội dung bắt đầu từ trang 50 — bài S.4.</p>`],
    ]),
    bi(`<h3>The unpublished pages, read from their text</h3>
<table>
<thead><tr><th>Spec</th><th>What an examiner finds</th></tr></thead>
<tbody>
<tr><td>1.1 Login (UC-1)</td><td>copied from another project: the flow cites "2.0.E1", exits go to "UC-2_View Home Page", "UC-3_Reset Password", "UC-4_Register User Account" — IDs that mean other things here; postcondition logs to an "Activity Log" that no table stores; rule FR2 empty; Admin listed as <em>secondary</em> actor of his own login</td></tr>
<tr><td>1.2–1.3 Register freelancer / recruiter (UC-2, UC-3)</td><td>the recruiter spec is the freelancer one with one word changed — its trigger still says the recruiter wants "to <em>search for jobs</em>"; "username does not exist" and "information cannot be left blank" are input checks written as preconditions; UC-3 is Register recruiter here but "UC-3_Reset Password" in Login</td></tr>
<tr><td>1.4 Home page (UC-4)</td><td>its business-rule table is Login's FR1 pasted again</td></tr>
<tr><td>1.5 Forgot password (UC-5)</td><td>a new password is generated and <em>sent by e-mail in clear text</em>; a reset link with expiry is the safe design</td></tr>
<tr><td>1.6 Change password (UC-6)</td><td>"precondition: the current password is correct" and "postcondition: new password matches the re-entered one" are input checks, not conditions; BR-1 copied from Forgot password ("before a password reset")</td></tr>
<tr><td>2.1 View list freelancer</td><td>also numbered UC-6; lists "ratings" that do not exist; cites BR-4/5/6 (job matching, applications, hiring) — unrelated to a list</td></tr>
<tr><td>2.2 View list recruiter (UC-7)</td><td>flow still says "information about each <em>Freelancer</em>" — copied from 2.1</td></tr>
<tr><td>2.3 Change status freelancer (UC-8)</td><td>cites BR-1, BR-3, BR-7, then "b. Business Rules: None"</td></tr>
<tr><td>3.1–3.2 Freelancer profile</td><td>"Date created 27/5/2023" — a year before the project; "Priority: Medium, Must Have"; the rule is a paragraph in the UC table</td></tr>
<tr><td>3.4 View post by category</td><td>the UC is named "View Post By <em>Position</em>" — the old name of Categories</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Coverage is the biggest loss.</strong> 17 specifications for 85 screens/functions: every recruiter feature except profile and company detail (create post, applicants, dashboard, mark freelancer…) and almost all admin work has no specification at all. Each member must specify <em>his own</em> screens, every iteration.</div>`,
    `<h3>Các trang không công bố, đọc từ nội dung chữ</h3>
<table>
<thead><tr><th>Đặc tả</th><th>Giám khảo tìm thấy gì</th></tr></thead>
<tbody>
<tr><td>1.1 Login (UC-1)</td><td>chép từ dự án khác: luồng dẫn "2.0.E1", lối ra trỏ tới "UC-2_View Home Page", "UC-3_Reset Password", "UC-4_Register User Account" — những mã ở đây mang nghĩa khác; postcondition ghi vào "Activity Log" mà không bảng nào lưu; rule FR2 để trống; Admin được ghi là actor <em>phụ</em> của chính việc đăng nhập của mình</td></tr>
<tr><td>1.2–1.3 Đăng ký freelancer / recruiter (UC-2, UC-3)</td><td>đặc tả của recruiter là bản của freelancer đổi đúng một chữ — trigger vẫn ghi recruiter muốn "to <em>search for jobs</em>"; "username chưa tồn tại" và "không được để trống" là kiểm tra đầu vào bị viết thành precondition; ở đây UC-3 là Đăng ký recruiter nhưng trong Login lại là "UC-3_Reset Password"</td></tr>
<tr><td>1.4 Home page (UC-4)</td><td>bảng business rule là FR1 của Login dán lại</td></tr>
<tr><td>1.5 Forgot password (UC-5)</td><td>sinh mật khẩu mới rồi <em>gửi qua e-mail dạng chữ thường</em>; thiết kế an toàn là link đặt lại có hạn dùng</td></tr>
<tr><td>1.6 Change password (UC-6)</td><td>"precondition: mật khẩu hiện tại đúng" và "postcondition: mật khẩu mới khớp ô nhập lại" là kiểm tra đầu vào, không phải điều kiện; BR-1 chép từ Forgot password ("before a password reset")</td></tr>
<tr><td>2.1 View list freelancer</td><td>cũng đánh số UC-6; liệt kê "ratings" không hề tồn tại; dẫn BR-4/5/6 (so khớp việc, ứng tuyển, tuyển dụng) — chẳng liên quan tới một danh sách</td></tr>
<tr><td>2.2 View list recruiter (UC-7)</td><td>luồng vẫn ghi "information about each <em>Freelancer</em>" — chép từ 2.1</td></tr>
<tr><td>2.3 Change status freelancer (UC-8)</td><td>dẫn BR-1, BR-3, BR-7, rồi ghi "b. Business Rules: None"</td></tr>
<tr><td>3.1–3.2 Hồ sơ freelancer</td><td>"Date created 27/5/2023" — sớm hơn dự án một năm; "Priority: Medium, Must Have"; rule là một đoạn văn trong bảng UC</td></tr>
<tr><td>3.4 View post by category</td><td>UC mang tên "View Post By <em>Position</em>" — tên cũ của Categories</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Độ phủ là chỗ mất điểm lớn nhất.</strong> 17 đặc tả cho 85 màn hình/chức năng: mọi tính năng của recruiter trừ hồ sơ và chi tiết công ty (đăng tin, ứng viên, dashboard, đánh dấu freelancer…) và gần như toàn bộ việc của admin không có đặc tả nào. Mỗi thành viên phải đặc tả <em>màn hình của chính mình</em>, ở mọi iteration.</div>`),
    bi(`<h3>Do it better — one specification written properly</h3>
<p>The model below rewrites a G5 feature that has no specification at all: <strong>Apply job</strong> (Product sheet row UC_47). Same template fields, but every field holds what belongs there — and the ID is the tracking ID.</p>
<table>
<thead><tr><th>Field</th><th>Content</th></tr></thead>
<tbody>
<tr><td>UC ID and name</td><td>UC_47 Apply for a job</td></tr>
<tr><td>Primary / secondary actor</td><td>Freelancer / Recruiter (receives the application)</td></tr>
<tr><td>Trigger</td><td>The freelancer clicks <em>Apply Now</em> on a job card or on Job detail.</td></tr>
<tr><td>Description</td><td>As a freelancer, I want to apply to an open job with my CV so that the recruiter can consider me.</td></tr>
<tr><td>Preconditions</td><td>PRE-1 logged in with an active freelancer account. PRE-2 the post is approved (<code>checking = 1</code>) and active (<code>status = 1</code>).</td></tr>
<tr><td>Postconditions</td><td>POST-1 one <code>JobApply</code> row: status pending, <code>dateApply</code> today, <code>Resume</code> = file path. POST-2 the card shows "Applied". POST-3 the recruiter sees it under All applicants.</td></tr>
<tr><td>Normal flow</td><td>1. Freelancer clicks Apply Now. 2. System shows the apply pop-up. 3. Freelancer uploads a CV and confirms. 4. System checks BR-05, BR-14, BR-15. 5. System saves and shows "Applied".</td></tr>
<tr><td>Alternative flow</td><td>3a. Freelancer cancels → nothing is saved.</td></tr>
<tr><td>Exceptions</td><td>4.E1 post expired → "This job is closed". 4.E2 already applied → show the current status. 4.E3 CV missing, not PDF or &gt; 2 MB → field error.</td></tr>
<tr><td>Priority / frequency</td><td>Must have / many times a day per freelancer</td></tr>
<tr><td>Business rules</td><td>BR-05 apply only before <code>Post.expired</code>. BR-11 an application cannot be cancelled. BR-14 one application per freelancer per post (<code>UNIQUE(freelanceID, postID)</code>). BR-15 CV is a PDF of at most 2 MB.</td></tr>
</tbody>
</table>
<p class="ghi-chu">BR-05 and BR-11 are G5's own appendix rules; BR-14 and BR-15 are new — each is enforceable in code or in the database, and each gives a tester a pass/fail case.</p>`,
    `<h3>Làm tốt hơn — một đặc tả viết đúng cách</h3>
<p>Bản mẫu dưới đây viết lại một tính năng của G5 hoàn toàn không có đặc tả: <strong>Apply job</strong> (dòng UC_47 của sheet Product). Vẫn các trường của template, nhưng trường nào chứa đúng thứ của trường đó — và mã chính là mã trong tracking.</p>
<table>
<thead><tr><th>Trường</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td>UC ID và tên</td><td>UC_47 Apply for a job</td></tr>
<tr><td>Actor chính / phụ</td><td>Freelancer / Recruiter (nhận đơn ứng tuyển)</td></tr>
<tr><td>Trigger</td><td>Freelancer bấm <em>Apply Now</em> trên thẻ việc hoặc ở Job detail.</td></tr>
<tr><td>Description</td><td>Là freelancer, tôi muốn ứng tuyển một việc đang mở kèm CV để recruiter xem xét tôi.</td></tr>
<tr><td>Preconditions</td><td>PRE-1 đã đăng nhập bằng tài khoản freelancer đang hoạt động. PRE-2 tin đã được duyệt (<code>checking = 1</code>) và đang hoạt động (<code>status = 1</code>).</td></tr>
<tr><td>Postconditions</td><td>POST-1 có một dòng <code>JobApply</code>: trạng thái chờ duyệt, <code>dateApply</code> là hôm nay, <code>Resume</code> = đường dẫn file. POST-2 thẻ hiện "Applied". POST-3 recruiter thấy đơn trong All applicants.</td></tr>
<tr><td>Normal flow</td><td>1. Freelancer bấm Apply Now. 2. Hệ thống hiện pop-up ứng tuyển. 3. Freelancer tải CV lên và xác nhận. 4. Hệ thống kiểm BR-05, BR-14, BR-15. 5. Hệ thống lưu và hiện "Applied".</td></tr>
<tr><td>Alternative flow</td><td>3a. Freelancer huỷ → không lưu gì.</td></tr>
<tr><td>Exceptions</td><td>4.E1 tin đã hết hạn → "This job is closed". 4.E2 đã ứng tuyển rồi → hiện trạng thái hiện tại. 4.E3 thiếu CV, không phải PDF hoặc &gt; 2 MB → báo lỗi tại ô.</td></tr>
<tr><td>Priority / frequency</td><td>Must have / nhiều lần mỗi ngày với mỗi freelancer</td></tr>
<tr><td>Business rules</td><td>BR-05 chỉ ứng tuyển trước <code>Post.expired</code>. BR-11 không huỷ được đơn đã nộp. BR-14 mỗi freelancer một đơn cho mỗi tin (<code>UNIQUE(freelanceID, postID)</code>). BR-15 CV là file PDF tối đa 2 MB.</td></tr>
</tbody>
</table>
<p class="ghi-chu">BR-05 và BR-11 là rule trong phụ lục của chính G5; BR-14 và BR-15 là rule mới — rule nào cũng ép buộc được bằng code hoặc CSDL, và rule nào cũng cho tester một case pass/fail.</p>`),
    bi(`<h3>What belongs in each field — the checklist G5 needed</h3>
<table>
<thead><tr><th>Field</th><th>Belongs there</th><th>Does not belong (seen in G5)</th></tr></thead>
<tbody>
<tr><td>UC ID</td><td>the Product-sheet ID of the screen</td><td>IDs of another project, one ID used twice</td></tr>
<tr><td>Actors</td><td>people or external systems</td><td>"System", "Database"</td></tr>
<tr><td>Preconditions</td><td>what is true <em>before</em> the flow starts</td><td>input checks ("password is correct")</td></tr>
<tr><td>Postconditions</td><td>what the system guarantees <em>after</em> success</td><td>input checks, logs nobody stores</td></tr>
<tr><td>Normal flow</td><td>numbered actor/system steps</td><td>the actor's wish as step 1, references to "2.0.E1"</td></tr>
<tr><td>Exceptions</td><td>business failures with the system's response</td><td>"database unavailable" only</td></tr>
<tr><td>Priority / frequency</td><td>Must/Should/Could · how often</td><td>"High (Must Have)" in both</td></tr>
<tr><td>Business rules</td><td>IDs from one BR list, each testable</td><td>prose, copied rules, "None" after a list</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Beyond the syllabus — turn each rule into an acceptance test.</strong> Write BR-14 as <em>Given</em> a freelancer who already applied to post 12, <em>When</em> he clicks Apply Now on post 12 again, <em>Then</em> no new row is saved and "Already applied — Pending" is shown. The same sentence becomes a test case in Template3 (System Test) — requirement, code and test then share one ID.</div>`,
    `<h3>Trường nào chứa gì — bảng kiểm mà G5 cần</h3>
<table>
<thead><tr><th>Trường</th><th>Nên chứa</th><th>Không nên chứa (thấy ở G5)</th></tr></thead>
<tbody>
<tr><td>UC ID</td><td>mã của màn hình trong sheet Product</td><td>mã của dự án khác, một mã dùng hai lần</td></tr>
<tr><td>Actor</td><td>con người hoặc hệ thống bên ngoài</td><td>"System", "Database"</td></tr>
<tr><td>Preconditions</td><td>điều đúng <em>trước khi</em> luồng bắt đầu</td><td>kiểm tra đầu vào ("mật khẩu đúng")</td></tr>
<tr><td>Postconditions</td><td>điều hệ thống bảo đảm <em>sau khi</em> thành công</td><td>kiểm tra đầu vào, log mà không ai lưu</td></tr>
<tr><td>Normal flow</td><td>các bước actor/hệ thống có đánh số</td><td>mong muốn của actor làm bước 1, dẫn tới "2.0.E1"</td></tr>
<tr><td>Exceptions</td><td>lỗi nghiệp vụ kèm phản hồi của hệ thống</td><td>chỉ có "database unavailable"</td></tr>
<tr><td>Priority / frequency</td><td>Must/Should/Could · tần suất</td><td>"High (Must Have)" ở cả hai</td></tr>
<tr><td>Business rules</td><td>mã từ một danh sách BR, rule nào cũng kiểm được</td><td>đoạn văn, rule chép, "None" sau khi đã liệt kê</td></tr>
</tbody>
</table>
<div class="callout"><strong>★ Ngoài giáo trình — biến mỗi rule thành một acceptance test.</strong> Viết BR-14 thành <em>Given</em> một freelancer đã ứng tuyển tin 12, <em>When</em> anh ta lại bấm Apply Now ở tin 12, <em>Then</em> không có dòng mới nào được lưu và hiện "Already applied — Pending". Chính câu đó trở thành một test case trong Template3 (System Test) — yêu cầu, code và test cùng chung một mã.</div>`),
    books([
      ['wiegers', 'Ch.8 "Understanding user requirements" (use-case template) and Ch.9 "Playing by the rules" (business rules)', 'Chương 8 "Understanding user requirements" (template use case) và Chương 9 "Playing by the rules" (business rule)'],
      ['cockburn', 'Ch.5–7 (preconditions, guarantees, scenarios) and Ch.6 "Extensions" (exceptions)', 'Chương 5–7 (precondition, guarantee, kịch bản) và Chương 6 "Extensions" (exception)'],
      ['sommerville', 'Ch.4 §4.3 "Requirements specification"', 'Chương 4 §4.3 "Requirements specification"'],
    ]),
  ].join('\n'),
};

/* ─────────────── S.4 RDS part III-a — common & freelancer screen designs ─────────────── */
const L4 = {
  title: 'S.4 — The G5 RDS, part III-a: screen designs of the common and freelancer features|||S.4 — RDS của G5, phần III-a: thiết kế màn hình của tính năng chung và freelancer',
  slug: 'swp391-sample-g5-rds-screens-common',
  type: 'VIDEO',
  description: 'RDS của G5 trang 50–102: mỗi màn hình gồm ảnh giao diện thật, bảng trường (Field Name/Type/Description), bảng Database Access (CRUD) và câu SQL — login, home, quên/đổi mật khẩu, đăng ký, tìm tin, About Us, công ty, yêu thích, Job for You, báo cáo tin, lọc theo địa điểm.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.4 · G5 RDS pages 50–102</span>
<h2>The RDS, part III-a — one block per screen</h2>
<p class="lead">Chapter III is the longest part of the RDS (pages 49–203). For every screen the template asks for four things, and this is where your <strong>design</strong> grade and your <strong>LOC</strong> meet: the screen you document is the screen you are paid LOC for.</p>
<ol>
<li><strong>UI design</strong> — a picture of the screen</li>
<li><strong>Field table</strong> — Field Name · Field Type · Description (with length and validation)</li>
<li><strong>Database access</strong> — Table · CRUD · Description</li>
<li><strong>SQL commands</strong> — the exact statements the DAO runs</li>
</ol>
<div class="callout"><strong>What G5 does well throughout:</strong> the UI pictures are screenshots of the <em>working</em> application (proof of implementation), and the SQL is copied from the real DAO code, so design and code agree.</div>
<h3>Pages 49–102 at a glance</h3>
<table>
<thead><tr><th>Common feature (1.x)</th><th>Pages</th><th>Freelancer feature (2.x)</th><th>Pages</th></tr></thead>
<tbody>
<tr><td>1.1 Login</td><td>49–51</td><td>2.1 View profile</td><td>78–80</td></tr>
<tr><td>1.2 Home page</td><td>52–55</td><td>2.2 Edit profile</td><td>81–84</td></tr>
<tr><td>1.3 Forgot password</td><td>56–58</td><td>2.3 View post favorite</td><td>85–89</td></tr>
<tr><td>1.4 Register freelancer</td><td>59–65</td><td>2.4–2.5 Delete / add favorite</td><td>90–92</td></tr>
<tr><td>1.5 Register recruiter</td><td>65–71</td><td>2.6–2.7 Apply job, list apply</td><td>93–95</td></tr>
<tr><td>1.6 Search post · 1.7 Change password</td><td>72–74</td><td>2.8 Job for you</td><td>96–97</td></tr>
<tr><td>1.8 Post detail · 1.9 About Us</td><td>75–76</td><td>2.9 Report post</td><td>98–99</td></tr>
<tr><td>1.10 Company detail</td><td>77–78</td><td>2.10–2.11 Posts by location / category</td><td>99–102</td></tr>
</tbody>
</table>
<p class="ghi-chu">Pages 75, 78, 79, 81, 86, 88, 89 and 91–94 are not shown: their screenshots contain a member's name, e-mail or phone number (logged-in test accounts). Use fake data such as "Freelancer Demo 01" in your own screenshots.</p>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.4 · RDS của G5 trang 50–102</span>
<h2>RDS, phần III-a — mỗi màn hình một khối</h2>
<p class="lead">Chương III là phần dài nhất của RDS (trang 49–203). Với mỗi màn hình, template đòi bốn thứ, và đây là nơi điểm <strong>thiết kế</strong> gặp điểm <strong>LOC</strong>: màn hình bạn mô tả chính là màn hình bạn được tính LOC.</p>
<ol>
<li><strong>UI design</strong> — hình của màn hình</li>
<li><strong>Bảng trường</strong> — Field Name · Field Type · Description (kèm độ dài và validation)</li>
<li><strong>Database access</strong> — Table · CRUD · Description</li>
<li><strong>SQL commands</strong> — đúng các câu lệnh mà DAO chạy</li>
</ol>
<div class="callout"><strong>Điều G5 làm tốt xuyên suốt:</strong> hình giao diện là ảnh chụp ứng dụng <em>đang chạy</em> (bằng chứng đã hiện thực), và SQL được chép từ code DAO thật, nên thiết kế và code khớp nhau.</div>
<h3>Trang 49–102 trong một bảng</h3>
<table>
<thead><tr><th>Tính năng chung (1.x)</th><th>Trang</th><th>Tính năng freelancer (2.x)</th><th>Trang</th></tr></thead>
<tbody>
<tr><td>1.1 Login</td><td>49–51</td><td>2.1 Xem hồ sơ</td><td>78–80</td></tr>
<tr><td>1.2 Home page</td><td>52–55</td><td>2.2 Sửa hồ sơ</td><td>81–84</td></tr>
<tr><td>1.3 Forgot password</td><td>56–58</td><td>2.3 Xem tin yêu thích</td><td>85–89</td></tr>
<tr><td>1.4 Đăng ký freelancer</td><td>59–65</td><td>2.4–2.5 Xoá / thêm yêu thích</td><td>90–92</td></tr>
<tr><td>1.5 Đăng ký recruiter</td><td>65–71</td><td>2.6–2.7 Ứng tuyển, danh sách đã ứng tuyển</td><td>93–95</td></tr>
<tr><td>1.6 Tìm tin · 1.7 Đổi mật khẩu</td><td>72–74</td><td>2.8 Job for you</td><td>96–97</td></tr>
<tr><td>1.8 Chi tiết tin · 1.9 About Us</td><td>75–76</td><td>2.9 Báo cáo tin</td><td>98–99</td></tr>
<tr><td>1.10 Chi tiết công ty</td><td>77–78</td><td>2.10–2.11 Tin theo địa điểm / danh mục</td><td>99–102</td></tr>
</tbody>
</table>
<p class="ghi-chu">Không đưa trang 75, 78, 79, 81, 86, 88, 89 và 91–94: ảnh chụp có tên, e-mail hoặc số điện thoại của thành viên (tài khoản test đang đăng nhập). Ảnh chụp của nhóm bạn nên dùng dữ liệu giả như "Freelancer Demo 01".</p>`),
    walkHead(R, 50, 102, 'The first page of each screen block is shown; the tables above list what the other pages contain.', 'Đưa trang đầu của mỗi khối màn hình; bảng ở trên cho biết các trang còn lại chứa gì.'),
    walk(R, [
      [50, '1.1 Login System — UI design (Username, Password, Login Now, OR, Signup?, Lost Password?) and the field table',
        `<p class="y-chinh">🎯 The login block shows the most common screen-design fault: the field table describes a different screen from the picture.</p>
<p class="nhan">Picture vs table vs SQL</p>
<ul>
<li><strong>Picture</strong> — a <em>Username</em> field.</li>
<li><strong>Field table</strong> — "Email* — valid email address for logging in".</li>
<li><strong>SQL (page 51)</strong> — <code>WHERE u.username = ? AND u.password = ?</code>.</li>
</ul>
<p class="nhan">Also</p>
<ul>
<li><strong>"OR" leads to nothing</strong> — the Google/Facebook/Apple login of the use-case table was never built.</li>
<li><strong>"Setting, User — R"</strong> in Database Access — there is no Setting table; a template leftover.</li>
<li><strong>Good:</strong> every field has a type and length, and the SQL uses <code>?</code> parameters (PreparedStatement — no SQL injection).</li>
<li><strong>Bad:</strong> the password is compared in plain text inside SQL; hash it (BCrypt) and compare in Java.</li>
</ul>`,
        `<p class="y-chinh">🎯 Khối login cho thấy lỗi thiết kế màn hình phổ biến nhất: bảng trường mô tả một màn hình khác với hình.</p>
<p class="nhan">Hình vs bảng vs SQL</p>
<ul>
<li><strong>Hình</strong> — một ô <em>Username</em>.</li>
<li><strong>Bảng trường</strong> — "Email* — valid email address for logging in".</li>
<li><strong>SQL (trang 51)</strong> — <code>WHERE u.username = ? AND u.password = ?</code>.</li>
</ul>
<p class="nhan">Thêm nữa</p>
<ul>
<li><strong>"OR" không dẫn tới đâu</strong> — đăng nhập Google/Facebook/Apple trong bảng use case chưa bao giờ được làm.</li>
<li><strong>"Setting, User — R"</strong> ở Database Access — không có bảng Setting nào; phần thừa của template.</li>
<li><strong>Tốt:</strong> trường nào cũng có kiểu và độ dài, và SQL dùng tham số <code>?</code> (PreparedStatement — không bị SQL injection).</li>
<li><strong>Chưa tốt:</strong> mật khẩu được so sánh dạng chữ thường ngay trong SQL; hãy băm (BCrypt) và so trong Java.</li>
</ul>`],
      [52, '1.2 Home Page — screenshots: Browse Projects By Category, Top New Jobs Projects',
        `<p class="y-chinh">🎯 The home page is built on the KofeJob template and fed from the database — but some template text survived.</p>
<ul>
<li><strong>From the database</strong> — the category carousel (table <code>Categories</code>) and the newest posts (<code>Post</code>).</li>
<li><strong>Template text left in</strong> — "Get work done in over 60 different categories" (the database has 11), "Bid and stary the new Jobs".</li>
<li><strong>Same stock picture</strong> on every job card — posts have an <code>image</code> column; use it or drop it.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang chủ dựng trên template KofeJob và lấy dữ liệu từ CSDL — nhưng một số chữ của template vẫn còn nguyên.</p>
<ul>
<li><strong>Lấy từ CSDL</strong> — carousel danh mục (bảng <code>Categories</code>) và các tin mới nhất (<code>Post</code>).</li>
<li><strong>Chữ template còn sót</strong> — "Get work done in over 60 different categories" (CSDL có 11), "Bid and stary the new Jobs".</li>
<li><strong>Cùng một ảnh minh hoạ</strong> trên mọi thẻ việc — tin có cột <code>image</code>; hãy dùng hoặc bỏ đi.</li>
</ul>`],
      [54, '1.2 Home Page — Achievement counters, Featured Blogs, and the field table ("current active setting types")',
        `<p class="y-chinh">🎯 This page shows the clearest template leftover in the whole RDS: the home page is described with the teacher's "Setting list" example.</p>
<ul>
<li><strong>Field table</strong> — "For Freelancer: filled with the list of current active <em>setting types</em>… default value is 'All Types'", "Views All Categories: auto-increased identifier of the setting".</li>
<li><strong>SQL (page 55)</strong> — <code>SELECT setting_id, setting_name, mapped_values … FROM setting</code> and <code>UPDATE setting SET status = ?</code> — a table that is not among G5's 22.</li>
<li><strong>Counters</strong> — "919,207 Completed projects" is the template's number, not a query.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>An examiner needs one such page to doubt the rest.</strong> Search your RDS for the template's example words (setting, customer, product, order) before every submission.</div>`,
        `<p class="y-chinh">🎯 Trang này có phần thừa template lộ rõ nhất trong cả RDS: trang chủ được mô tả bằng ví dụ "Setting list" của thầy/cô.</p>
<ul>
<li><strong>Bảng trường</strong> — "For Freelancer: filled with the list of current active <em>setting types</em>… default value is 'All Types'", "Views All Categories: auto-increased identifier of the setting".</li>
<li><strong>SQL (trang 55)</strong> — <code>SELECT setting_id, setting_name, mapped_values … FROM setting</code> và <code>UPDATE setting SET status = ?</code> — một bảng không có trong 22 bảng của G5.</li>
<li><strong>Bộ đếm</strong> — "919,207 Completed projects" là con số của template, không phải kết quả truy vấn.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Giám khảo chỉ cần một trang như vậy để nghi ngờ phần còn lại.</strong> Trước mỗi lần nộp, tìm trong RDS các từ của ví dụ template (setting, customer, product, order).</div>`],
      [56, '1.3 Forgot Password — UI design, field table (Email Address, Send Now, Sign in?) and Database Access (User — RU)',
        `<p class="y-chinh">🎯 A small block done right: the table lists exactly the three controls in the picture, and the CRUD column matches the SQL.</p>
<ul>
<li><strong>Complete</strong> — every control is in the table, with type and length.</li>
<li><strong>A sensible mechanism</strong> — <code>LevelPass</code> marks the new password as temporary, so the user must change it at the next login.</li>
</ul>
<p class="nhan">Security review</p>
<ul>
<li><strong>Password by e-mail</strong> — send a one-time reset link that expires instead.</li>
<li><strong>"E-mail does not exist" message</strong> — lets anyone test which e-mails are registered; answer neutrally ("if the e-mail exists, a link was sent").</li>
</ul>`,
        `<p class="y-chinh">🎯 Một khối nhỏ làm đúng: bảng liệt kê đúng ba điều khiển trong hình, và cột CRUD khớp với SQL.</p>
<ul>
<li><strong>Đầy đủ</strong> — điều khiển nào cũng có trong bảng, kèm kiểu và độ dài.</li>
<li><strong>Cơ chế hợp lý</strong> — <code>LevelPass</code> đánh dấu mật khẩu mới là tạm thời, người dùng phải đổi ở lần đăng nhập sau.</li>
</ul>
<p class="nhan">Góc nhìn bảo mật</p>
<ul>
<li><strong>Gửi mật khẩu qua e-mail</strong> — thay bằng link đặt lại dùng một lần và có hạn.</li>
<li><strong>Thông báo "e-mail không tồn tại"</strong> — cho phép bất kỳ ai dò xem e-mail nào đã đăng ký; hãy trả lời trung tính ("nếu e-mail tồn tại, link đã được gửi").</li>
</ul>`],
    ]),
    walk(R, [
      [59, '1.4 Register account for Freelancer — step 1: User Name, Email Address, Password, Confirm Password, Sign Up Now',
        `<p class="y-chinh">🎯 Registration is split into three screens — account, account type, profile. Step 1 creates the <code>User</code> row.</p>
<p class="nhan">Checks an examiner makes</p>
<ul>
<li><strong>Same field, two specs</strong> — User Name is <code>String(8-32)</code> here (page 60) and <code>String(50)</code> in the recruiter version (page 67).</li>
<li><strong>Promises not on the screen</strong> — no Terms &amp; Conditions box, no social login, no hint of the BR-9 password rule.</li>
<li><strong>The documented SQL no longer runs</strong> — <code>INSERT INTO [User] VALUES (?,?,?,?,5,1)</code> supplies 6 values, but the final table has 7 insertable columns (<code>CreateDate</code> was added). SQL Server rejects it: "Column name or number of supplied values does not match table definition".</li>
<li><strong>Magic numbers</strong> — <code>5</code> (role) and <code>1</code> (LevelPass) with no explanation; always write the column list.</li>
</ul>`,
        `<p class="y-chinh">🎯 Đăng ký được chia làm ba màn hình — tài khoản, loại tài khoản, hồ sơ. Bước 1 tạo dòng <code>User</code>.</p>
<p class="nhan">Những điểm giám khảo kiểm tra</p>
<ul>
<li><strong>Cùng một trường, hai đặc tả</strong> — User Name là <code>String(8-32)</code> ở đây (trang 60) và <code>String(50)</code> ở bản recruiter (trang 67).</li>
<li><strong>Hứa mà màn hình không có</strong> — không có ô đồng ý Terms &amp; Conditions, không đăng nhập mạng xã hội, không gợi ý rule mật khẩu BR-9.</li>
<li><strong>SQL trong tài liệu không còn chạy được</strong> — <code>INSERT INTO [User] VALUES (?,?,?,?,5,1)</code> đưa 6 giá trị, nhưng bảng cuối cùng có 7 cột được chèn (<code>CreateDate</code> được thêm sau). SQL Server từ chối: "Column name or number of supplied values does not match table definition".</li>
<li><strong>Số ma thuật</strong> — <code>5</code> (role) và <code>1</code> (LevelPass) không có giải thích; luôn viết danh sách cột.</li>
</ul>`],
      [61, '1.4 Register — step 2: Select Account Type (Freelancer / Recruiter), Next; Database Access: None',
        `<p class="y-chinh">🎯 A clean choice screen — and a design question the RDS never answers: what if the user leaves here?</p>
<ul>
<li><strong>Good UX</strong> — two large cards, one button, a two-row field table.</li>
<li><strong>"Database Access: None"</strong> — true for this screen; the choice is written in step 3 (<code>UPDATE [User] SET roleID = ?</code>).</li>
<li><strong>Open question</strong> — after step 1 an account with the placeholder role already exists. If the user closes the browser now, a role-less account stays behind. Decide: finish registration in one transaction at the end, or let a half-registered user resume at step 2 on next login — and write the decision down.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một màn hình lựa chọn gọn gàng — và một câu hỏi thiết kế mà RDS không trả lời: nếu người dùng bỏ đi ở đây thì sao?</p>
<ul>
<li><strong>UX tốt</strong> — hai thẻ lớn, một nút, bảng trường hai dòng.</li>
<li><strong>"Database Access: None"</strong> — đúng với màn hình này; lựa chọn được ghi ở bước 3 (<code>UPDATE [User] SET roleID = ?</code>).</li>
<li><strong>Câu hỏi bỏ ngỏ</strong> — sau bước 1 đã có một tài khoản mang role tạm. Nếu người dùng đóng trình duyệt lúc này, một tài khoản không có role nằm lại. Hãy quyết định: hoàn tất đăng ký trong một transaction ở cuối, hoặc cho người đăng ký dở tiếp tục từ bước 2 ở lần đăng nhập sau — và ghi quyết định đó vào tài liệu.</li>
</ul>`],
      [62, '1.4 Register — step 3: Personal Info, Skills (checkbox list) and Experience',
        `<p class="y-chinh">🎯 The profile form is the biggest screen of registration — big enough to change its LOC class.</p>
<ul>
<li><strong>Count the fields</strong> — 7 personal fields + 14 skill boxes + 5 experience/education fields: well over 15. By the course's rule (≥ 15 fields) that is <em>Complex</em> (240 LOC); the tracking sheet rates "Register for freelancer" <em>Medium</em> (120).</li>
<li><strong>Data-driven skills</strong> — the checkboxes come from <code>SELECT * FROM Skill_Set</code>. Good — but "SQL Sever" is a typo in the data.</li>
<li><strong>E-mail asked twice</strong> — once for <code>User.email</code> (step 1), again for <code>Freelancer.email__contact</code>.</li>
<li><strong>Seven statements, no transaction</strong> — insert freelancer, read its ID, insert skills, experience, education. One failure leaves half a profile; and the documented <code>SELECT freelanceID FORM Freelancer</code> does not even parse.</li>
</ul>`,
        `<p class="y-chinh">🎯 Form hồ sơ là màn hình lớn nhất của phần đăng ký — đủ lớn để đổi hạng LOC.</p>
<ul>
<li><strong>Đếm trường</strong> — 7 trường cá nhân + 14 ô kỹ năng + 5 trường kinh nghiệm/học vấn: vượt xa 15. Theo quy tắc của môn (≥ 15 trường) đó là <em>Complex</em> (240 LOC); sheet tracking xếp "Register for freelancer" là <em>Medium</em> (120).</li>
<li><strong>Kỹ năng lấy từ dữ liệu</strong> — các checkbox lấy từ <code>SELECT * FROM Skill_Set</code>. Tốt — nhưng "SQL Sever" là lỗi chính tả trong dữ liệu.</li>
<li><strong>Hỏi e-mail hai lần</strong> — một lần cho <code>User.email</code> (bước 1), lần nữa cho <code>Freelancer.email__contact</code>.</li>
<li><strong>Bảy câu lệnh, không transaction</strong> — chèn freelancer, đọc ID, chèn kỹ năng, kinh nghiệm, học vấn. Một câu lỗi là còn lại nửa hồ sơ; và câu <code>SELECT freelanceID FORM Freelancer</code> trong tài liệu còn không parse được.</li>
</ul>`],
    ]),
    walk(R, [
      [72, '1.6 Search Post — field table and Database Access (no UI picture, no SQL)',
        `<p class="y-chinh">🎯 The Search Post block is the template's example table with a few words changed — no picture, no SQL, and a "table" that does not exist.</p>
<ul>
<li><strong>"Field Group Name"</strong> — the template's placeholder row, left in.</li>
<li><strong>"Search Post — Read — This table stores information related to posts"</strong> — there is no table <code>Search Post</code>; the real one is <code>Post</code> (joined with JobType, Duration, Categories, Company).</li>
<li><strong>A ".." row</strong> — another placeholder.</li>
<li><strong>Missing</strong> — which columns are searched (title? skill? location?), whether the search is <code>LIKE '%…%'</code>, and the result order.</li>
</ul>`,
        `<p class="y-chinh">🎯 Khối Search Post là bảng ví dụ của template đổi vài chữ — không có hình, không có SQL, và một "bảng" không tồn tại.</p>
<ul>
<li><strong>"Field Group Name"</strong> — dòng giữ chỗ của template, chưa xoá.</li>
<li><strong>"Search Post — Read — This table stores information related to posts"</strong> — không có bảng <code>Search Post</code>; bảng thật là <code>Post</code> (join với JobType, Duration, Categories, Company).</li>
<li><strong>Một dòng ".."</strong> — lại là chỗ giữ chỗ.</li>
<li><strong>Còn thiếu</strong> — tìm trên cột nào (tiêu đề? kỹ năng? địa điểm?), có dùng <code>LIKE '%…%'</code> không, và thứ tự kết quả.</li>
</ul>`],
      [73, '1.7 Change Password — UI design and field table (Current / New / Confirm New Password)',
        `<p class="y-chinh">🎯 A clean screen whose field table disagrees with itself, with the business rule and with the database.</p>
<ul>
<li><strong>Lengths</strong> — current password <code>String(8-32)</code>, new password <code>String(8-16)</code>; BR-9 says "at least 8", no maximum; the column is <code>nvarchar(50)</code>.</li>
<li><strong>Type "Text"</strong> for password fields — the picture shows masked inputs with a visibility toggle; the table should say Password box.</li>
<li><strong>SQL (page 74)</strong> — <code>UPDATE [freelancer].[dbo].[User] SET password = ? WHERE userID = ?</code>: the database name is hard-coded, so the query breaks if the teacher restores your script under another name.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> one rule, one number — put min/max length in the BR list and copy it to every screen that uses it.</p>`,
        `<p class="y-chinh">🎯 Một màn hình gọn gàng mà bảng trường mâu thuẫn với chính nó, với business rule và với CSDL.</p>
<ul>
<li><strong>Độ dài</strong> — mật khẩu hiện tại <code>String(8-32)</code>, mật khẩu mới <code>String(8-16)</code>; BR-9 nói "ít nhất 8", không có tối đa; cột là <code>nvarchar(50)</code>.</li>
<li><strong>Kiểu "Text"</strong> cho ô mật khẩu — hình cho thấy ô bị che kèm nút hiện/ẩn; bảng phải ghi Password box.</li>
<li><strong>SQL (trang 74)</strong> — <code>UPDATE [freelancer].[dbo].[User] SET password = ? WHERE userID = ?</code>: tên CSDL bị viết cứng, nên câu lệnh hỏng nếu thầy/cô khôi phục script của bạn dưới tên khác.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một rule, một con số — ghi độ dài min/max trong danh sách BR rồi chép sang mọi màn hình dùng nó.</p>`],
      [76, '1.8 Post Detail — empty "b. Database Access"; 1.9 About Us — UI (lorem ipsum) and a field table copied from Search Post',
        `<p class="y-chinh">🎯 Two blocks on one page, both unfinished — the kind of page that makes an examiner stop trusting the chapter.</p>
<ul>
<li><strong>1.8 Post Detail</strong> — "b. Database Access" is a heading with nothing under it. Post detail reads at least five tables.</li>
<li><strong>1.9 About Us</strong> — the page text is <em>lorem ipsum</em>; the field table lists a search input, search results, post title… (copied from 1.6); Database Access says "Search Post"; SQL Commands is empty.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Static pages still need an honest block.</strong> For About Us write: static content, no fields, no database access — three lines, all true. A copied table is worse than no table.</div>`,
        `<p class="y-chinh">🎯 Hai khối trên một trang, cả hai đều dở dang — kiểu trang khiến giám khảo thôi tin cả chương.</p>
<ul>
<li><strong>1.8 Post Detail</strong> — "b. Database Access" chỉ có tiêu đề, bên dưới trống. Trang chi tiết tin đọc ít nhất năm bảng.</li>
<li><strong>1.9 About Us</strong> — nội dung trang là <em>lorem ipsum</em>; bảng trường liệt kê ô tìm kiếm, kết quả tìm, tiêu đề tin… (chép từ 1.6); Database Access ghi "Search Post"; SQL Commands để trống.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trang tĩnh vẫn cần một khối trung thực.</strong> Với About Us hãy ghi: nội dung tĩnh, không có trường, không truy cập CSDL — ba dòng, dòng nào cũng đúng. Bảng chép còn tệ hơn không có bảng.</div>`],
      [77, '1.10 View company detail by ID — UI (Company Profile with a Budget / Apply Now widget) and the same copied field table',
        `<p class="y-chinh">🎯 The company page was taken from the template's "freelancer profile" layout — and it shows.</p>
<ul>
<li><strong>Template widget left in</strong> — "Budget $125–$180, Hourly Rate, Apply Now" on a <em>company</em> page; companies have no budget column.</li>
<li><strong>The copied table again</strong> — "Company Title: title of each post in the search results". The same block reappears in 3.15 and 3.16 (pages 127, 129): one table copied four times.</li>
<li><strong>"By ID" that is not</strong> — the SQL (page 78) filters <code>WHERE com.recruiterID = ?</code>, not by company ID.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang công ty lấy từ bố cục "hồ sơ freelancer" của template — và điều đó lộ rõ.</p>
<ul>
<li><strong>Widget của template còn sót</strong> — "Budget $125–$180, Hourly Rate, Apply Now" trên trang <em>công ty</em>; công ty không có cột ngân sách nào.</li>
<li><strong>Lại bảng chép</strong> — "Company Title: title of each post in the search results". Khối này xuất hiện lại ở 3.15 và 3.16 (trang 127, 129): một bảng chép bốn lần.</li>
<li><strong>"Theo ID" mà không phải</strong> — SQL (trang 78) lọc <code>WHERE com.recruiterID = ?</code>, không lọc theo mã công ty.</li>
</ul>`],
    ]),
    walk(R, [
      [85, '2.3 View Post Favorite — "a. UI Design" followed by an empty page',
        `<p class="y-chinh">🎯 A heading, then a blank page: the screenshots slid to pages 86–87, which carry only images and no text.</p>
<ul>
<li><strong>Why it happens</strong> — pictures inserted "in front of text" float away from their heading when earlier pages change.</li>
<li><strong>Fix</strong> — set every image to <em>In line with text</em>, keep the caption and heading with it, and page through the exported PDF before submitting.</li>
<li><strong>The field table (pages 88–89)</strong> lists the site header — Home, For Freelancer, For Job, Blog, My Profile… — not the controls of the favourite list (heart toggle, View Details, Apply Now, search, pagination). The same header table is pasted into almost every freelancer screen up to page 102.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> describe the shared header once (a "common layout" block); each screen table then lists only what is unique to that screen.</p>`,
        `<p class="y-chinh">🎯 Một tiêu đề, rồi một trang trắng: ảnh chụp đã trôi sang trang 86–87, hai trang chỉ có hình, không có chữ.</p>
<ul>
<li><strong>Vì sao</strong> — ảnh chèn kiểu "in front of text" sẽ trôi khỏi tiêu đề của nó khi các trang trước thay đổi.</li>
<li><strong>Cách sửa</strong> — đặt mọi ảnh là <em>In line with text</em>, giữ chú thích và tiêu đề đi cùng, và lật qua bản PDF xuất ra trước khi nộp.</li>
<li><strong>Bảng trường (trang 88–89)</strong> liệt kê thanh header của site — Home, For Freelancer, For Job, Blog, My Profile… — chứ không phải các điều khiển của danh sách yêu thích (nút tim, View Details, Apply Now, tìm kiếm, phân trang). Cùng bảng header ấy được dán vào gần như mọi màn hình freelancer tới trang 102.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mô tả header dùng chung một lần (khối "common layout"); bảng của từng màn hình chỉ liệt kê những gì riêng của màn hình đó.</p>`],
    ]),
    walk(R, [
      [90, '2.4 Delete Post Out Favorite — confirmation dialog, field table (Yes, Cancel) and Database Access',
        `<p class="y-chinh">🎯 A small block done almost right: picture, field table and CRUD agree, and the delete asks for confirmation first.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Consistent</strong> — two buttons in the picture, two rows in the table; Database Access says <code>FreelancerFavorites — D</code>.</li>
<li><strong>Confirmation before deleting</strong> — the right pattern for a destructive action.</li>
</ul>
<p class="nhan">To improve</p>
<ul>
<li><strong>Wording</strong> — "Deleting this will remove it permanently" under the title "Status": only the bookmark goes, the post stays. Say "Remove this job from your favourites?".</li>
<li><strong>No SQL</strong> — write it, with the owner in the filter: <code>DELETE FROM FreelancerFavorites WHERE favoritesID = ? AND freelanceID = ?</code>, so nobody can delete another user's favourite by changing an ID in the URL.</li>
<li><strong>No unique key on (freelanceID, postID)</strong> — "Add post in favorite" (2.5) can store the same post twice unless the code checks.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một khối nhỏ gần như làm đúng: hình, bảng trường và CRUD khớp nhau, và việc xoá có hỏi xác nhận trước.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Nhất quán</strong> — hai nút trong hình, hai dòng trong bảng; Database Access ghi <code>FreelancerFavorites — D</code>.</li>
<li><strong>Xác nhận trước khi xoá</strong> — đúng mẫu cho một thao tác phá huỷ.</li>
</ul>
<p class="nhan">Cần làm tốt hơn</p>
<ul>
<li><strong>Câu chữ</strong> — "Deleting this will remove it permanently" dưới tiêu đề "Status": chỉ mất dấu yêu thích, tin vẫn còn. Hãy ghi "Bỏ việc này khỏi danh sách yêu thích?".</li>
<li><strong>Không có SQL</strong> — hãy viết ra, kèm chủ sở hữu trong điều kiện lọc: <code>DELETE FROM FreelancerFavorites WHERE favoritesID = ? AND freelanceID = ?</code>, để không ai xoá được mục yêu thích của người khác bằng cách đổi ID trên URL.</li>
<li><strong>Không có khoá unique trên (freelanceID, postID)</strong> — "Add post in favorite" (2.5) có thể lưu cùng một tin hai lần nếu code không kiểm tra.</li>
</ul>`],
    ]),
    walk(R, [
      [96, 'Empty "b. Database Access" of 2.7 List Apply; 2.8 Job for You — UI (search filter + matching cards) and field table',
        `<p class="y-chinh">🎯 "Job for You" is G5's most interesting feature — a real skill-matching query — documented with a header table and nothing about how the matching works.</p>
<p class="nhan">The matching SQL (from the text of this section)</p>
<ul>
<li><strong>Idea</strong> — take the freelancer's skills, split each post's <code>skill</code> text with <code>STRING_SPLIT(p.skill, ',')</code>, keep posts where a piece matches. This implements appendix rule BR-04.</li>
<li><strong>Duplicates</strong> — a post matching three skills is returned three times; there is no <code>DISTINCT</code> and no ranking (best match first).</li>
<li><strong>Cost of the text column</strong> — splitting strings cannot use an index. A <code>PostSkill(postID, skill_set_ID)</code> table would make it one join plus <code>COUNT(*)</code> for ranking.</li>
</ul>
<p class="nhan">Also on the page</p>
<ul>
<li><strong>"b. Database Access" of 2.7 List Apply</strong> — empty.</li>
<li><strong>Test data in the screenshot</strong> — "Abccccc13", broken "author" images: seed readable demo data before taking pictures.</li>
</ul>`,
        `<p class="y-chinh">🎯 "Job for You" là tính năng thú vị nhất của G5 — một câu truy vấn so khớp kỹ năng thật — nhưng được mô tả bằng bảng header và không một chữ nào về cách so khớp.</p>
<p class="nhan">Câu SQL so khớp (theo nội dung chữ của mục này)</p>
<ul>
<li><strong>Ý tưởng</strong> — lấy kỹ năng của freelancer, tách chuỗi <code>skill</code> của từng tin bằng <code>STRING_SPLIT(p.skill, ',')</code>, giữ những tin có mảnh trùng. Nó hiện thực rule BR-04 trong phụ lục.</li>
<li><strong>Trùng lặp</strong> — tin khớp ba kỹ năng bị trả về ba lần; không có <code>DISTINCT</code> và không xếp hạng (khớp nhiều nhất lên trước).</li>
<li><strong>Cái giá của cột chữ</strong> — tách chuỗi thì không dùng được index. Một bảng <code>PostSkill(postID, skill_set_ID)</code> sẽ biến nó thành một phép join cộng <code>COUNT(*)</code> để xếp hạng.</li>
</ul>
<p class="nhan">Cũng trên trang này</p>
<ul>
<li><strong>"b. Database Access" của 2.7 List Apply</strong> — trống.</li>
<li><strong>Dữ liệu test trong ảnh chụp</strong> — "Abccccc13", ảnh "author" bị vỡ: hãy nạp dữ liệu demo đọc được trước khi chụp.</li>
</ul>`],
    ]),
    walk(R, [
      [98, '2.9 Report post — UI (Report Post pop-up: Spam, Inappropriate behavior, Abuse, Other) and field table',
        `<p class="y-chinh">🎯 The report pop-up is described control by control, with a small picture of each control — but the one input that matters is missing.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Icons in the table</strong> — flag, close ✕, CANCEL, SUBMIT: a reader matches rows to the picture instantly.</li>
<li><strong>Clever SQL (page 99)</strong> — <code>INSERT INTO report (…) SELECT f.freelanceID, ?, ?, ? FROM Freelancer f WHERE f.userID = ?</code> derives the reporter from the logged-in account instead of trusting a hidden field.</li>
</ul>
<p class="nhan">Missing or wrong</p>
<ul>
<li><strong>The reason radios</strong> — the only input of the form — are not in the table; "Other" has no text box, although the column <code>messeage nvarchar(max)</code> (sic) exists for it.</li>
<li><strong>The date comes from the client</strong> (a <code>?</code>) — use <code>GETDATE()</code> on the server.</li>
<li><strong>Heading "e. UI Design"</strong> — sections a–d do not exist.</li>
</ul>`,
        `<p class="y-chinh">🎯 Pop-up báo cáo được mô tả từng điều khiển, kèm hình nhỏ của từng cái — nhưng thiếu đúng ô nhập quan trọng nhất.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Có biểu tượng trong bảng</strong> — cờ, nút ✕, CANCEL, SUBMIT: người đọc khớp dòng với hình ngay lập tức.</li>
<li><strong>SQL khéo (trang 99)</strong> — <code>INSERT INTO report (…) SELECT f.freelanceID, ?, ?, ? FROM Freelancer f WHERE f.userID = ?</code> lấy người báo cáo từ tài khoản đang đăng nhập thay vì tin vào một trường ẩn.</li>
</ul>
<p class="nhan">Thiếu hoặc sai</p>
<ul>
<li><strong>Các radio lý do</strong> — ô nhập duy nhất của form — không có trong bảng; "Other" không có ô chữ, dù cột <code>messeage nvarchar(max)</code> (viết sai) tồn tại để lưu nó.</li>
<li><strong>Ngày lấy từ phía client</strong> (một <code>?</code>) — hãy dùng <code>GETDATE()</code> ở server.</li>
<li><strong>Tiêu đề "e. UI Design"</strong> — không hề có mục a–d.</li>
</ul>`],
      [100, 'End of 2.10 Views post By Locations — field table, "h. Database Access" with the SQL; heading 2.11 Views post By Categories',
        `<p class="y-chinh">🎯 The location filter works by exact text match on a free-text column — a design decision worth questioning.</p>
<ul>
<li><strong><code>WHERE p.location = ?</code></strong> — locations are typed by recruiters ("Nevada, USA", "London, UK"), so "Hanoi", "hanoi" and "Ha Noi" are three different places. Use a Location lookup table, or at least normalise the input.</li>
<li><strong>No status filter</strong> — the query does not check <code>p.status</code> or <code>p.checking</code>, so suspended or unapproved posts can be listed.</li>
<li><strong><code>SELECT p.*, j.*, du.*, re.*, ca.*, co.*</code></strong> — every column of six tables, including recruiter contact data, for a card that shows five values. Select what the screen shows.</li>
<li><strong>Form</strong> — the SQL sits under "h. Database Access" instead of a Table/CRUD table; the lettering jumps to h.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bộ lọc theo địa điểm so khớp chính xác trên một cột chữ tự do — một quyết định thiết kế đáng xem lại.</p>
<ul>
<li><strong><code>WHERE p.location = ?</code></strong> — địa điểm do recruiter tự gõ ("Nevada, USA", "London, UK"), nên "Hanoi", "hanoi" và "Ha Noi" là ba nơi khác nhau. Dùng bảng tra cứu Location, hoặc ít nhất chuẩn hoá dữ liệu nhập.</li>
<li><strong>Không lọc trạng thái</strong> — câu truy vấn không kiểm <code>p.status</code> hay <code>p.checking</code>, nên tin bị tạm dừng hoặc chưa duyệt vẫn có thể hiện ra.</li>
<li><strong><code>SELECT p.*, j.*, du.*, re.*, ca.*, co.*</code></strong> — mọi cột của sáu bảng, kể cả thông tin liên hệ của recruiter, cho một thẻ chỉ hiện năm giá trị. Chỉ chọn những gì màn hình hiển thị.</li>
<li><strong>Hình thức</strong> — SQL nằm dưới "h. Database Access" thay vì một bảng Table/CRUD; đánh chữ cái nhảy tới h.</li>
</ul>`],
    ]),
    bi(`<h3>Do it better — one screen block written properly</h3>
<p>The model rewrites G5's <strong>2.6 Apply Job</strong> pop-up (Product row UC_47, the same feature specified in lesson S.3). The picture would be the real pop-up with demo data; below are the three parts G5 left thin.</p>
<p class="nhan">Field table — only this screen's controls</p>
<table>
<thead><tr><th>Field</th><th>Type</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>CV file*</td><td>File, PDF ≤ 2 MB</td><td>required; BR-15</td></tr>
<tr><td>Cover note</td><td>Text area, String(0–1000)</td><td>optional</td></tr>
<tr><td>Submit</td><td>Button</td><td>checks BR-05, BR-14, BR-15; saves; shows "Applied"</td></tr>
<tr><td>Cancel</td><td>Button</td><td>closes the pop-up; nothing saved</td></tr>
</tbody>
</table>
<p class="nhan">Database access — real table names</p>
<table>
<thead><tr><th>Table</th><th>CRUD</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Post</td><td>R</td><td>status, checking and expired of the post</td></tr>
<tr><td>JobApply</td><td>C, R</td><td>existing application? (BR-14) · insert the new one</td></tr>
<tr><td>Freelancer</td><td>R</td><td>the freelanceID of the logged-in account</td></tr>
</tbody>
</table>
<p class="nhan">SQL — the DAO's statements, with owner and status in the filter</p>
<pre>SELECT status, checking, expired FROM Post WHERE postID = ?;
SELECT COUNT(*) FROM JobApply WHERE postID = ? AND freelanceID = ?;
INSERT INTO JobApply (freelanceID, postID, status, dateApply, Resume)
SELECT f.freelanceID, ?, N'0', CAST(GETDATE() AS date), ?
FROM Freelancer f WHERE f.userID = ?;</pre>
<div class="callout"><strong>★ Beyond the syllabus — let the database enforce the rule too.</strong> Add <code>UNIQUE (freelanceID, postID)</code> to JobApply. The COUNT check gives a friendly message; the constraint still stops a double click that sends two requests at the same moment.</div>`,
    `<h3>Làm tốt hơn — một khối màn hình viết đúng cách</h3>
<p>Bản mẫu viết lại pop-up <strong>2.6 Apply Job</strong> của G5 (dòng UC_47 của sheet Product, cùng tính năng đã đặc tả ở bài S.3). Hình sẽ là pop-up thật với dữ liệu demo; dưới đây là ba phần mà G5 viết còn mỏng.</p>
<p class="nhan">Bảng trường — chỉ các điều khiển của màn hình này</p>
<table>
<thead><tr><th>Trường</th><th>Kiểu</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>CV file*</td><td>File, PDF ≤ 2 MB</td><td>bắt buộc; BR-15</td></tr>
<tr><td>Cover note</td><td>Text area, String(0–1000)</td><td>tuỳ chọn</td></tr>
<tr><td>Submit</td><td>Button</td><td>kiểm BR-05, BR-14, BR-15; lưu; hiện "Applied"</td></tr>
<tr><td>Cancel</td><td>Button</td><td>đóng pop-up; không lưu gì</td></tr>
</tbody>
</table>
<p class="nhan">Database access — tên bảng thật</p>
<table>
<thead><tr><th>Bảng</th><th>CRUD</th><th>Để làm gì</th></tr></thead>
<tbody>
<tr><td>Post</td><td>R</td><td>status, checking và expired của tin</td></tr>
<tr><td>JobApply</td><td>C, R</td><td>đã ứng tuyển chưa? (BR-14) · chèn đơn mới</td></tr>
<tr><td>Freelancer</td><td>R</td><td>freelanceID của tài khoản đang đăng nhập</td></tr>
</tbody>
</table>
<p class="nhan">SQL — đúng các câu của DAO, có chủ sở hữu và trạng thái trong điều kiện lọc</p>
<pre>SELECT status, checking, expired FROM Post WHERE postID = ?;
SELECT COUNT(*) FROM JobApply WHERE postID = ? AND freelanceID = ?;
INSERT INTO JobApply (freelanceID, postID, status, dateApply, Resume)
SELECT f.freelanceID, ?, N'0', CAST(GETDATE() AS date), ?
FROM Freelancer f WHERE f.userID = ?;</pre>
<div class="callout"><strong>★ Ngoài giáo trình — để CSDL cùng thực thi rule.</strong> Thêm <code>UNIQUE (freelanceID, postID)</code> vào JobApply. Câu COUNT cho thông báo thân thiện; còn ràng buộc vẫn chặn được cú bấm đúp gửi hai request cùng một lúc.</div>`),
    bi(`<h3>Checklist for every screen block</h3>
<ol>
<li><strong>Picture</strong> — the real screen, demo data, no personal data, image "in line with text".</li>
<li><strong>Field table</strong> — every input of <em>this</em> screen with type, length, required, rule ID; the shared header described once elsewhere.</li>
<li><strong>Database access</strong> — real table names, CRUD letters that match the SQL.</li>
<li><strong>SQL</strong> — column lists, owner and status in the WHERE, no hard-coded database name.</li>
<li><strong>No leftovers</strong> — no "Field Group Name", "..", empty headings, or another screen's rows.</li>
</ol>`,
    `<h3>Bảng kiểm cho mỗi khối màn hình</h3>
<ol>
<li><strong>Hình</strong> — màn hình thật, dữ liệu demo, không có dữ liệu cá nhân, ảnh đặt "in line with text".</li>
<li><strong>Bảng trường</strong> — mọi ô nhập của <em>màn hình này</em> kèm kiểu, độ dài, bắt buộc, mã rule; header dùng chung mô tả một lần ở chỗ khác.</li>
<li><strong>Database access</strong> — tên bảng thật, chữ CRUD khớp với SQL.</li>
<li><strong>SQL</strong> — có danh sách cột, có chủ sở hữu và trạng thái trong WHERE, không viết cứng tên CSDL.</li>
<li><strong>Không sót phần thừa</strong> — không "Field Group Name", "..", tiêu đề trống, hay dòng của màn hình khác.</li>
</ol>`),
    books([
      ['wiegers', 'Ch.15 "Risk reduction through prototyping" (screens as a requirements tool)', 'Chương 15 "Risk reduction through prototyping" (màn hình như một công cụ yêu cầu)'],
      ['sommerville', 'Ch.7 "Design and implementation"', 'Chương 7 "Design and implementation"'],
    ]),
  ].join('\n'),
};

/* ─────────────── S.5 RDS part III-b — recruiter & admin screen designs ─────────────── */
const L5 = {
  title: 'S.5 — The G5 RDS, part III-b: screen designs of the recruiter and admin features|||S.5 — RDS của G5, phần III-b: thiết kế màn hình của tính năng recruiter và admin',
  slug: 'swp391-sample-g5-rds-screens-recruiter-admin',
  type: 'VIDEO',
  description: 'RDS của G5 trang 103–203: đăng tin, danh sách tin, blog, trang công ty của recruiter; dashboard, kỹ năng, duyệt/tạm dừng dự án, danh mục, báo cáo, blog và lọc kỹ năng của admin — hơn 70 trang lặp bảng menu điều hướng, cùng những điểm thiết kế tốt đáng học.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.5 · G5 RDS pages 103–203</span>
<h2>The RDS, part III-b — the recruiter and admin screens</h2>
<p class="lead">The second half of chapter III covers <strong>16 recruiter blocks</strong> (3.1–3.16, pages 103–129) and <strong>39 admin blocks</strong> (4.1–4.39, pages 130–203). The admin half is where the RDS grows from a document into a pile: most of its 74 pages repeat the same sidebar table.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Recognise the patterns that make an admin chapter long but empty — and the few blocks worth copying.</li>
<li>Describe a list screen (filter, table, row actions, pop-ups) in one compact block.</li>
<li>Explain to your team why "one block per action" inflates pages but not marks.</li>
</ul></div>
<h3>Pages 103–203 at a glance</h3>
<table>
<thead><tr><th>Recruiter (3.x)</th><th>Pages</th><th>Admin (4.x)</th><th>Pages</th></tr></thead>
<tbody>
<tr><td>3.1–3.2 Create / update post</td><td>103–107</td><td>4.1 Dashboard</td><td>130–131</td></tr>
<tr><td>3.3–3.4 My list post, manage list post</td><td>108–111</td><td>4.2–4.7 Freelancers &amp; recruiters: list, activate, suspend</td><td>132–143</td></tr>
<tr><td>3.5 Manage applicants</td><td>111–113</td><td>4.8–4.11 Skills: list, add, edit, delete</td><td>143–146</td></tr>
<tr><td>3.6–3.7 Dashboard, mark freelancer</td><td>114–117</td><td>4.12–4.17 Company, recruiter profile, details, filters</td><td>147–157</td></tr>
<tr><td>3.8–3.11 Freelancer list, search, approved, completed projects</td><td>118–123</td><td>4.18–4.20 Projects: list, suspend, approve</td><td>157–161</td></tr>
<tr><td>3.12–3.14 Blog grid, detail, search</td><td>123–126</td><td>4.21–4.29 Categories, filter project, reports</td><td>162–179</td></tr>
<tr><td>3.15–3.16 Company detail, edit recruiter setting</td><td>127–129</td><td>4.30–4.39 Blogs, filter skill, admin profile</td><td>180–203</td></tr>
</tbody>
</table>
<p class="ghi-chu">Not shown: pages 110–112, 114, 118, 129, 132, 134, 135, 137, 141, 147, 150, 151 and 201 — their screenshots show members' names, e-mails, phones or photos (logged-in accounts, applicant lists, profile cards).</p>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.5 · RDS của G5 trang 103–203</span>
<h2>RDS, phần III-b — các màn hình của recruiter và admin</h2>
<p class="lead">Nửa sau của chương III gồm <strong>16 khối của recruiter</strong> (3.1–3.16, trang 103–129) và <strong>39 khối của admin</strong> (4.1–4.39, trang 130–203). Nửa admin là nơi RDS phình từ một tài liệu thành một đống giấy: phần lớn 74 trang của nó lặp lại cùng một bảng thanh bên.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Nhận ra những khuôn mẫu làm chương admin dài mà rỗng — và vài khối đáng học theo.</li>
<li>Mô tả một màn hình danh sách (bộ lọc, bảng, thao tác trên dòng, pop-up) trong một khối gọn.</li>
<li>Giải thích cho nhóm vì sao "mỗi thao tác một khối" làm tăng số trang nhưng không tăng điểm.</li>
</ul></div>
<h3>Trang 103–203 trong một bảng</h3>
<table>
<thead><tr><th>Recruiter (3.x)</th><th>Trang</th><th>Admin (4.x)</th><th>Trang</th></tr></thead>
<tbody>
<tr><td>3.1–3.2 Tạo / sửa tin</td><td>103–107</td><td>4.1 Dashboard</td><td>130–131</td></tr>
<tr><td>3.3–3.4 Danh sách tin của tôi, quản lý tin</td><td>108–111</td><td>4.2–4.7 Freelancer &amp; recruiter: danh sách, kích hoạt, tạm dừng</td><td>132–143</td></tr>
<tr><td>3.5 Quản lý ứng viên</td><td>111–113</td><td>4.8–4.11 Kỹ năng: danh sách, thêm, sửa, xoá</td><td>143–146</td></tr>
<tr><td>3.6–3.7 Dashboard, đánh dấu freelancer</td><td>114–117</td><td>4.12–4.17 Công ty, hồ sơ recruiter, chi tiết, bộ lọc</td><td>147–157</td></tr>
<tr><td>3.8–3.11 Danh sách, tìm kiếm freelancer, đã duyệt, dự án hoàn thành</td><td>118–123</td><td>4.18–4.20 Dự án: danh sách, tạm dừng, duyệt</td><td>157–161</td></tr>
<tr><td>3.12–3.14 Lưới blog, chi tiết, tìm kiếm</td><td>123–126</td><td>4.21–4.29 Danh mục, lọc dự án, báo cáo</td><td>162–179</td></tr>
<tr><td>3.15–3.16 Chi tiết công ty, sửa thiết lập recruiter</td><td>127–129</td><td>4.30–4.39 Blog, lọc kỹ năng, hồ sơ admin</td><td>180–203</td></tr>
</tbody>
</table>
<p class="ghi-chu">Không đưa: trang 110–112, 114, 118, 129, 132, 134, 135, 137, 141, 147, 150, 151 và 201 — ảnh chụp có tên, e-mail, số điện thoại hoặc ảnh của thành viên (tài khoản đang đăng nhập, danh sách ứng viên, thẻ hồ sơ).</p>`),
    walkHead(R, 103, 203, 'The first page of each group of blocks is shown; the table above maps the rest.', 'Đưa trang đầu của mỗi nhóm khối; bảng ở trên cho biết các trang còn lại.'),
    walk(R, [
      [103, '3. Recruiter feature — 3.1 Create post: "Post a Project" form (the same screenshot twice)',
        `<p class="y-chinh">🎯 Create post is the recruiter's core screen — the SQL is the best-written insert in the RDS, the field table the worst.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>The insert (page 105)</strong> lists every column and stamps the date on the server: <code>INSERT INTO Post (title, image, …, checking) VALUES (?, ?, ?, ?, GETDATE(), …)</code>.</li>
</ul>
<p class="nhan">Wrong</p>
<ul>
<li><strong>Descriptions pasted from the admin sidebar</strong> (page 104) — "Project Title: click to go to the page Dashboard", "Upload Image: click to go to the page Projects".</li>
<li><strong>No expiry date</strong> — <code>expired</code> is not in the insert, so appendix rule BR-05 ("apply within the application period") has nothing to check.</li>
<li><strong>Three names for one screen</strong> — "Create post", "Post a Project", "Create News Post"; a label "Target" nobody explains; the same picture pasted twice.</li>
</ul>`,
        `<p class="y-chinh">🎯 Create post là màn hình cốt lõi của recruiter — SQL là câu insert viết tốt nhất trong RDS, còn bảng trường thì tệ nhất.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Câu insert (trang 105)</strong> liệt kê đủ cột và lấy ngày ở server: <code>INSERT INTO Post (title, image, …, checking) VALUES (?, ?, ?, ?, GETDATE(), …)</code>.</li>
</ul>
<p class="nhan">Chỗ sai</p>
<ul>
<li><strong>Mô tả dán từ thanh bên của admin</strong> (trang 104) — "Project Title: click to go to the page Dashboard", "Upload Image: click to go to the page Projects".</li>
<li><strong>Không có ngày hết hạn</strong> — <code>expired</code> không có trong câu insert, nên rule BR-05 trong phụ lục ("ứng tuyển trong thời hạn") không có gì để kiểm.</li>
<li><strong>Ba tên cho một màn hình</strong> — "Create post", "Post a Project", "Create News Post"; một nhãn "Target" không ai giải thích; cùng một hình dán hai lần.</li>
</ul>`],
      [108, '3.3 View My List Post — "My List Post Project" with search filter, cards and pagination; field table',
        `<p class="y-chinh">🎯 A good-looking list screen whose table again borrows the sidebar's sentences — and whose query hides the recruiter's own pending posts.</p>
<ul>
<li><strong>Field table</strong> — "Sort by: click to go to the page Dashboard", "Categories filter: click to go to the page Projects".</li>
<li><strong>The SQL filters <code>p.status = 1 AND p.checking = 1</code></strong> — a post waiting for admin approval never appears in "My list"; it only shows in 3.4 Manage list post, whose query has no status filter. Two screens list "my posts" with different rules and no sentence explaining why.</li>
<li><strong>Test data in the picture</strong> — "Teacherqeasad ssdff dsdsdf asas".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> when two screens show the same rows, write down the one rule that separates them — or merge them.</p>`,
        `<p class="y-chinh">🎯 Một màn hình danh sách đẹp mắt mà bảng trường lại mượn câu chữ của thanh bên — và câu truy vấn giấu luôn các tin đang chờ duyệt của chính recruiter.</p>
<ul>
<li><strong>Bảng trường</strong> — "Sort by: click to go to the page Dashboard", "Categories filter: click to go to the page Projects".</li>
<li><strong>SQL lọc <code>p.status = 1 AND p.checking = 1</code></strong> — tin đang chờ admin duyệt không bao giờ hiện ở "My list"; nó chỉ hiện ở 3.4 Manage list post, nơi câu truy vấn không lọc trạng thái. Hai màn hình cùng liệt kê "tin của tôi" theo hai quy tắc khác nhau mà không có câu nào giải thích.</li>
<li><strong>Dữ liệu test trong hình</strong> — "Teacherqeasad ssdff dsdsdf asas".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khi hai màn hình hiện cùng những dòng dữ liệu, hãy ghi ra quy tắc duy nhất phân biệt chúng — hoặc gộp chúng lại.</p>`],
      [124, '3.12 Blog grid (SQL) and 3.13 Blog detail — UI with lorem-ipsum text and an empty field table',
        `<p class="y-chinh">🎯 The blog blocks sit in the wrong chapter and are barely filled in.</p>
<ul>
<li><strong>Wrong chapter</strong> — blogs are written by the Admin and read by everyone (the matrix gives Guest, Freelancer and Recruiter "View blog"), yet they are documented under <em>Recruiter</em> feature.</li>
<li><strong>Empty field table</strong> — a header row and one blank row.</li>
<li><strong>Lorem ipsum</strong> in the blog body of the screenshot.</li>
<li><strong>SQL</strong> — <code>SELECT * FROM [freelancer].[dbo].[Blogs] WHERE statusBlog = 1</code>: correct filter, but <code>SELECT *</code> and a hard-coded database name.</li>
</ul>`,
        `<p class="y-chinh">🎯 Các khối blog nằm sai chương và gần như chưa được điền.</p>
<ul>
<li><strong>Sai chương</strong> — blog do Admin viết và ai cũng đọc (ma trận cho Guest, Freelancer và Recruiter quyền "View blog"), vậy mà được mô tả dưới tính năng <em>Recruiter</em>.</li>
<li><strong>Bảng trường trống</strong> — một dòng tiêu đề và một dòng rỗng.</li>
<li><strong>Lorem ipsum</strong> trong nội dung blog của ảnh chụp.</li>
<li><strong>SQL</strong> — <code>SELECT * FROM [freelancer].[dbo].[Blogs] WHERE statusBlog = 1</code>: lọc đúng, nhưng <code>SELECT *</code> và tên CSDL viết cứng.</li>
</ul>`],
      [127, '3.15 Company Detail — the recruiter\'s company page (Team Number, Established On, Website, Describe, Jobs Posted/Applicants/Open Jobs)',
        `<p class="y-chinh">🎯 The screenshot itself documents two bugs — a reviewer reads pictures as carefully as tables.</p>
<ul>
<li><strong>Website field</strong> shows <code>/Job_IT_For_Freelancer_G5/InputRecruiterProfile</code> — an internal page address saved as the company's website: missing URL validation.</li>
<li><strong>"ok laaaaaaa…"</strong> in Describe — test input left in the database used for screenshots.</li>
<li><strong>Good idea</strong> — the "Jobs Posted · Applicants · Open Jobs" counters give the recruiter a summary at a glance.</li>
<li><strong>The copied field table again</strong> (search input, search results, "Company Title: title of each post in the search results").</li>
</ul>`,
        `<p class="y-chinh">🎯 Chính ảnh chụp ghi lại hai lỗi — người review đọc hình cũng kỹ như đọc bảng.</p>
<ul>
<li><strong>Ô Website</strong> hiện <code>/Job_IT_For_Freelancer_G5/InputRecruiterProfile</code> — một địa chỉ trang nội bộ bị lưu làm website công ty: thiếu kiểm tra URL.</li>
<li><strong>"ok laaaaaaa…"</strong> ở Describe — dữ liệu test còn nằm trong CSDL dùng để chụp màn hình.</li>
<li><strong>Ý tưởng tốt</strong> — bộ đếm "Jobs Posted · Applicants · Open Jobs" cho recruiter thấy tổng quan ngay lập tức.</li>
<li><strong>Lại là bảng trường chép</strong> (ô tìm kiếm, kết quả tìm, "Company Title: title of each post in the search results").</li>
</ul>`],
    ]),
    walk(R, [
      [130, '4. Admin Feature — 4.1 Dashboard: counters (Users, Projects, Job application), "Over view" chart, sidebar field table',
        `<p class="y-chinh">🎯 The admin dashboard looks finished, but its numbers and its chart do not come from the system's data.</p>
<ul>
<li><strong>Counters vs data</strong> — the picture shows 146 users and 0 job applications; the final SQL script holds 154 users and 44 applications. Screenshots and data were never re-synced.</li>
<li><strong>A template chart</strong> — the x-axis runs 00:00–06:00 with two unlabelled curves; the documented SQL has only three counts, so nothing feeds the chart.</li>
<li><strong>The field table</strong> lists the sidebar buttons, not the counters and chart that make this screen a dashboard.</li>
<li><strong><code>COUNT(DISTINCT username)</code></strong> — the DISTINCT hides a real gap: <code>User.username</code> has no unique constraint.</li>
</ul>`,
        `<p class="y-chinh">🎯 Dashboard của admin trông như đã xong, nhưng các con số và biểu đồ không lấy từ dữ liệu của hệ thống.</p>
<ul>
<li><strong>Bộ đếm và dữ liệu</strong> — hình cho thấy 146 người dùng và 0 đơn ứng tuyển; script SQL cuối cùng có 154 người dùng và 44 đơn. Ảnh chụp và dữ liệu chưa bao giờ được đồng bộ lại.</li>
<li><strong>Biểu đồ của template</strong> — trục x chạy 00:00–06:00 với hai đường không có chú thích; SQL trong tài liệu chỉ có ba phép đếm, nên chẳng có gì cấp dữ liệu cho biểu đồ.</li>
<li><strong>Bảng trường</strong> liệt kê các nút ở thanh bên, không phải bộ đếm và biểu đồ — những thứ làm nên một dashboard.</li>
<li><strong><code>COUNT(DISTINCT username)</code></strong> — chữ DISTINCT che đi một lỗ hổng thật: <code>User.username</code> không có ràng buộc unique.</li>
</ul>`],
      [144, 'End of 4.8 view list skill (SQL) and 4.9 add skill — "Add New Skill" pop-up with its own field table',
        `<p class="y-chinh">🎯 Finally a field table that describes the pop-up's own fields — but no rule protects the data it creates.</p>
<ul>
<li><strong>Good</strong> — Skill Name, Description, Submit: three controls, three rows, types given.</li>
<li><strong>No uniqueness rule</strong> — nothing stops the same skill twice, and the Filter Skill screenshot (page 198) shows ".NET" four times.</li>
<li><strong>A column never filled</strong> — <code>INSERT INTO Skill_Set (skill_set_name, description, statusSkill) VALUES (?, ?, 1)</code> leaves <code>ExpertiID</code> empty, so new skills never appear in the "expertise" grouping used by List freelancer.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cuối cùng cũng có một bảng trường mô tả đúng các trường của pop-up — nhưng không rule nào bảo vệ dữ liệu nó tạo ra.</p>
<ul>
<li><strong>Tốt</strong> — Skill Name, Description, Submit: ba điều khiển, ba dòng, có ghi kiểu.</li>
<li><strong>Không có rule duy nhất</strong> — không gì chặn một kỹ năng được thêm hai lần, và ảnh chụp Filter Skill (trang 198) hiện ".NET" bốn lần.</li>
<li><strong>Một cột không bao giờ được điền</strong> — <code>INSERT INTO Skill_Set (skill_set_name, description, statusSkill) VALUES (?, ?, 1)</code> bỏ trống <code>ExpertiID</code>, nên kỹ năng mới không bao giờ nằm trong nhóm "expertise" mà List freelancer sử dụng.</li>
</ul>`],
      [158, '4.19 Suspend project — storyboard: project list with row menu → "Are you sure want to Suspend Project?" → "Suspend project successfully!"',
        `<p class="y-chinh">🎯 The best documentation idea in the admin chapter: one action shown as a three-frame storyboard — list, confirmation, result.</p>
<p class="nhan">Copy this</p>
<ul>
<li><strong>List → confirm → notify</strong> — a reader sees the whole interaction without running the system.</li>
</ul>
<p class="nhan">But fill the rest of the block</p>
<ul>
<li><strong>Which column changes?</strong> — <code>Post</code> has both <code>status</code> and <code>checking</code>; the block never says which one "suspend" sets.</li>
<li><strong>No reason, no notice</strong> — the admin cannot enter why, and the recruiter is not told. The report list (4.29) and suspension are not linked.</li>
<li><strong>The field table (page 159)</strong> is the sidebar again.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ý tưởng trình bày hay nhất của chương admin: một thao tác được thể hiện thành storyboard ba khung — danh sách, xác nhận, kết quả.</p>
<p class="nhan">Hãy học theo</p>
<ul>
<li><strong>Danh sách → xác nhận → thông báo</strong> — người đọc thấy trọn tương tác mà không cần chạy hệ thống.</li>
</ul>
<p class="nhan">Nhưng điền nốt phần còn lại của khối</p>
<ul>
<li><strong>Cột nào thay đổi?</strong> — <code>Post</code> có cả <code>status</code> lẫn <code>checking</code>; khối này không nói "suspend" đặt cột nào.</li>
<li><strong>Không lý do, không thông báo</strong> — admin không nhập được lý do, recruiter không được báo. Danh sách báo cáo (4.29) và việc tạm dừng không liên kết với nhau.</li>
<li><strong>Bảng trường (trang 159)</strong> lại là thanh bên.</li>
</ul>`],
      [160, '4.20 Approve project — the same storyboard with "Activate Project" and "Approve project successfully!"',
        `<p class="y-chinh">🎯 The approve storyboard exposes a missing design artefact: nobody wrote down the states a post goes through.</p>
<ul>
<li><strong>Two spellings of one state</strong> — the list shows "Approve" and "Approved" side by side; the menu says "Activate Project", the dialog "Approve project".</li>
<li><strong>What is missing</strong> — a small state diagram: <em>Pending → Approved → Suspended → Approved</em>, with who may move a post between states and which column stores it.</li>
</ul>
<p class="dap-an">✅ One state diagram per status column (Post, JobApply, User) answers half the questions a jury asks about the admin screens.</p>`,
        `<p class="y-chinh">🎯 Storyboard duyệt dự án lộ ra một sản phẩm thiết kế còn thiếu: không ai ghi lại các trạng thái mà một tin đi qua.</p>
<ul>
<li><strong>Hai cách viết cho một trạng thái</strong> — danh sách hiện "Approve" và "Approved" cạnh nhau; menu ghi "Activate Project", hộp thoại ghi "Approve project".</li>
<li><strong>Còn thiếu</strong> — một state diagram nhỏ: <em>Pending → Approved → Suspended → Approved</em>, kèm ai được chuyển tin giữa các trạng thái và cột nào lưu trạng thái đó.</li>
</ul>
<p class="dap-an">✅ Mỗi cột trạng thái (Post, JobApply, User) một state diagram là trả lời được một nửa số câu hội đồng hỏi về các màn hình admin.</p>`],
    ]),
    walk(R, [
      [162, '4.21 Filter Categories — Categories list with filter bar (name, status, Submit), table and row actions',
        `<p class="y-chinh">🎯 One list screen, documented as seven blocks (4.21–4.27, pages 162–177) — each with the same picture and the same sidebar table.</p>
<p class="nhan">Worth copying</p>
<ul>
<li><strong>The optional-filter SQL</strong> — <code>WHERE categories_name LIKE ? AND (statusCate = ? OR ? = -1)</code>: one query serves "all statuses" (-1) and a single status.</li>
</ul>
<p class="nhan">Worth fixing</p>
<ul>
<li><strong>Seven blocks for one screen</strong> — filter, view, add, edit, delete, details, activate. One block with a row-action table would take two pages.</li>
<li><strong>Copied SQL</strong> — 4.27 Active category shows the recruiter-profile query; 4.26 View details has no <code>WHERE</code>, so it returns every category.</li>
<li><strong>A column name shown to users</strong> — the filter label reads "StatusCate".</li>
</ul>`,
        `<p class="y-chinh">🎯 Một màn hình danh sách, được mô tả thành bảy khối (4.21–4.27, trang 162–177) — khối nào cũng cùng một hình và cùng bảng thanh bên.</p>
<p class="nhan">Đáng học theo</p>
<ul>
<li><strong>SQL lọc tuỳ chọn</strong> — <code>WHERE categories_name LIKE ? AND (statusCate = ? OR ? = -1)</code>: một câu truy vấn phục vụ cả "mọi trạng thái" (-1) lẫn một trạng thái cụ thể.</li>
</ul>
<p class="nhan">Đáng sửa</p>
<ul>
<li><strong>Bảy khối cho một màn hình</strong> — lọc, xem, thêm, sửa, xoá, chi tiết, kích hoạt. Một khối có bảng thao tác trên dòng chỉ cần hai trang.</li>
<li><strong>SQL chép nhầm</strong> — 4.27 Active category đưa câu truy vấn hồ sơ recruiter; 4.26 View details không có <code>WHERE</code>, nên trả về mọi danh mục.</li>
<li><strong>Tên cột hiện cho người dùng</strong> — nhãn bộ lọc ghi "StatusCate".</li>
</ul>`],
      [178, '4.29 View list report of project — project table with a Reports column, and the "Report List — No report!" pop-up',
        `<p class="y-chinh">🎯 The moderation view exists — reports are counted per project — but it is documented without a single report.</p>
<ul>
<li><strong>Good</strong> — a Reports column with a flag on the project list links freelancers' reports (2.9) to the admin.</li>
<li><strong>Shown empty</strong> — every row has 0 and the pop-up says "No report!". Document the case that matters: a project with reports, their reasons, and the admin's next step.</li>
<li><strong>No action from here</strong> — the admin reads reports but must go to another screen to suspend the project.</li>
</ul>`,
        `<p class="y-chinh">🎯 Màn hình kiểm duyệt có tồn tại — báo cáo được đếm theo dự án — nhưng được mô tả mà không có lấy một báo cáo.</p>
<ul>
<li><strong>Tốt</strong> — cột Reports kèm lá cờ trên danh sách dự án nối báo cáo của freelancer (2.9) tới admin.</li>
<li><strong>Chụp khi rỗng</strong> — dòng nào cũng 0 và pop-up ghi "No report!". Hãy mô tả trường hợp quan trọng: một dự án có báo cáo, lý do của chúng, và bước tiếp theo của admin.</li>
<li><strong>Không có thao tác tại đây</strong> — admin đọc báo cáo nhưng phải sang màn hình khác để tạm dừng dự án.</li>
</ul>`],
      [187, '4.33 View blog details — All Blog table (Active / Trash) and a "Blog Details" modal; empty field table',
        `<p class="y-chinh">🎯 A good data pattern and a bad seed: blogs are soft-deleted, but the sample article is a copied news story.</p>
<ul>
<li><strong>Soft delete</strong> — a deleted blog gets status "Trash" and a green ✓ to restore it, instead of a <code>DELETE</code>. The right choice for content.</li>
<li><strong>Seed content</strong> — the modal shows a political news article from a US newspaper: irrelevant to an IT-freelance site and not the team's to republish. Write your own short demo posts.</li>
<li><strong>Empty field table</strong> under the picture; "Data create" for "Date created".</li>
</ul>`,
        `<p class="y-chinh">🎯 Một mẫu dữ liệu tốt và một dữ liệu mẫu tệ: blog được xoá mềm, nhưng bài minh hoạ là một tin tức chép về.</p>
<ul>
<li><strong>Xoá mềm</strong> — blog bị xoá chuyển trạng thái "Trash" và có dấu ✓ xanh để khôi phục, thay vì <code>DELETE</code>. Lựa chọn đúng cho nội dung.</li>
<li><strong>Dữ liệu mẫu</strong> — modal hiện một bài tin chính trị của một tờ báo Mỹ: không liên quan tới trang việc làm IT và nhóm không có quyền đăng lại. Hãy tự viết vài bài demo ngắn.</li>
<li><strong>Bảng trường trống</strong> dưới hình; "Data create" thay cho "Date created".</li>
</ul>`],
      [194, '4.36 Activate blog — a heading on an otherwise blank page',
        `<p class="y-chinh">🎯 A whole page for a heading: the content follows on pages 195–197 as a picture and the sidebar table.</p>
<ul>
<li><strong>"Activate blog"</strong> is the restore action of the Trash status — one row in the blog list's action table, not a chapter.</li>
<li><strong>Page count is not a grade</strong> — the RDS is marked on correctness and consistency; 74 admin pages of repeated tables cost reading time and hide the good blocks.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cả một trang cho một tiêu đề: nội dung nằm ở trang 195–197 dưới dạng một hình và bảng thanh bên.</p>
<ul>
<li><strong>"Activate blog"</strong> là thao tác khôi phục trạng thái Trash — một dòng trong bảng thao tác của danh sách blog, không phải một chương.</li>
<li><strong>Số trang không phải điểm</strong> — RDS được chấm theo tính đúng và tính nhất quán; 74 trang admin lặp bảng làm tốn thời gian đọc và che mất các khối tốt.</li>
</ul>`],
      [198, '4.37 Filter Skill — Skills list (Skill, Description, Status, Actions) and the filter panel with Reset',
        `<p class="y-chinh">🎯 The skills list shows in one picture what happens when the database has no rules and nobody cleans the test data.</p>
<ul>
<li><strong>".NET" four times</strong> — no unique rule on the skill name (see 4.9).</li>
<li><strong>Descriptions "null", "abc", "gfeuihf", "nu"</strong> — test typing left in; the literal word "null" means a Java <code>null</code> was printed as text.</li>
<li><strong>Good</strong> — filter by name and status, with a Reset button; the same filter pattern as Categories.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> before the last screenshots, reset the database to a clean seed script — the teacher reads your sample data too.</p>`,
        `<p class="y-chinh">🎯 Danh sách kỹ năng cho thấy trong một hình điều gì xảy ra khi CSDL không có rule và không ai dọn dữ liệu test.</p>
<ul>
<li><strong>".NET" bốn lần</strong> — tên kỹ năng không có rule duy nhất (xem 4.9).</li>
<li><strong>Mô tả "null", "abc", "gfeuihf", "nu"</strong> — chữ gõ thử còn sót; chữ "null" nguyên văn nghĩa là một giá trị <code>null</code> của Java bị in ra thành chữ.</li>
<li><strong>Tốt</strong> — lọc theo tên và trạng thái, có nút Reset; cùng mẫu bộ lọc với Categories.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trước các ảnh chụp cuối cùng, hãy khôi phục CSDL về một script dữ liệu mẫu sạch — thầy/cô đọc cả dữ liệu mẫu của bạn.</p>`],
    ]),
    bi(`<h3>Do it better — one block for a whole list screen</h3>
<p>G5 spent seven blocks and about 16 pages on Categories (4.21–4.27). The same information fits in one block:</p>
<table>
<thead><tr><th>Part</th><th>Content</th></tr></thead>
<tbody>
<tr><td>Pictures</td><td>the list with its filter bar · the add/edit pop-up</td></tr>
<tr><td>Filter</td><td>Name (text, <code>LIKE</code>) · Status (All / Active / Inactive) · Submit</td></tr>
<tr><td>Row actions</td><td>Edit → pop-up · Delete → confirm, sets <code>statusCate = 0</code> · Activate → sets <code>statusCate = 1</code></td></tr>
<tr><td>Pop-up fields</td><td>Category name* String(1–50), unique · Description String(0–500)</td></tr>
<tr><td>Database access</td><td>Categories — C, R, U (delete is soft, so it is an update)</td></tr>
<tr><td>SQL</td><td>G5's own filter query · <code>INSERT INTO Categories (categories_name, description, statusCate) VALUES (?, ?, 1)</code> · <code>UPDATE Categories SET categories_name = ?, description = ? WHERE caID = ?</code> · <code>UPDATE Categories SET statusCate = ? WHERE caID = ?</code></td></tr>
</tbody>
</table>
<h3>Checklist for the admin chapter</h3>
<ol>
<li><strong>One block per screen</strong>, with a row-action table — not one block per button.</li>
<li><strong>A state diagram</strong> for every status column (Post, JobApply, User, Blogs).</li>
<li><strong>A storyboard</strong> (list → confirm → result) for every destructive action — G5's best idea.</li>
<li><strong>Each table describes its own screen</strong> — the sidebar is documented once, in a common-layout block.</li>
<li><strong>Clean seed data</strong> before screenshots — no duplicates, no "abc", no copied articles.</li>
</ol>`,
    `<h3>Làm tốt hơn — một khối cho cả một màn hình danh sách</h3>
<p>G5 dùng bảy khối và khoảng 16 trang cho Categories (4.21–4.27). Cùng lượng thông tin đó gói gọn trong một khối:</p>
<table>
<thead><tr><th>Phần</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td>Hình</td><td>danh sách kèm thanh lọc · pop-up thêm/sửa</td></tr>
<tr><td>Bộ lọc</td><td>Tên (chữ, <code>LIKE</code>) · Trạng thái (All / Active / Inactive) · Submit</td></tr>
<tr><td>Thao tác trên dòng</td><td>Edit → pop-up · Delete → xác nhận, đặt <code>statusCate = 0</code> · Activate → đặt <code>statusCate = 1</code></td></tr>
<tr><td>Trường của pop-up</td><td>Category name* String(1–50), không trùng · Description String(0–500)</td></tr>
<tr><td>Database access</td><td>Categories — C, R, U (xoá là xoá mềm, nên là một lệnh update)</td></tr>
<tr><td>SQL</td><td>chính câu lọc của G5 · <code>INSERT INTO Categories (categories_name, description, statusCate) VALUES (?, ?, 1)</code> · <code>UPDATE Categories SET categories_name = ?, description = ? WHERE caID = ?</code> · <code>UPDATE Categories SET statusCate = ? WHERE caID = ?</code></td></tr>
</tbody>
</table>
<h3>Bảng kiểm cho chương admin</h3>
<ol>
<li><strong>Mỗi màn hình một khối</strong>, kèm bảng thao tác trên dòng — không phải mỗi nút một khối.</li>
<li><strong>Một state diagram</strong> cho mỗi cột trạng thái (Post, JobApply, User, Blogs).</li>
<li><strong>Một storyboard</strong> (danh sách → xác nhận → kết quả) cho mỗi thao tác phá huỷ — ý tưởng hay nhất của G5.</li>
<li><strong>Bảng nào mô tả màn hình của chính nó</strong> — thanh bên được mô tả một lần, trong khối common layout.</li>
<li><strong>Dữ liệu mẫu sạch</strong> trước khi chụp — không trùng, không "abc", không bài viết chép về.</li>
</ol>`),
    books([
      ['fowler', 'Ch.10 "State Machine Diagrams" (one diagram per status column)', 'Chương 10 "State Machine Diagrams" (mỗi cột trạng thái một sơ đồ)'],
      ['gomaa', 'the chapter "Finite State Machines" (states, events, transitions)', 'chương "Finite State Machines" (trạng thái, sự kiện, chuyển trạng thái)'],
    ]),
  ].join('\n'),
};

/* ─────────────── S.6 RDS parts IV–V — code designs & appendix ─────────────── */
const L6 = {
  title: 'S.6 — The G5 RDS, parts IV–V: code designs (class & sequence diagrams) and the appendix|||S.6 — RDS của G5, phần IV–V: thiết kế code (class & sequence diagram) và phụ lục',
  slug: 'swp391-sample-g5-rds-code-appendix',
  type: 'VIDEO',
  description: 'RDS của G5 trang 204–213: thiết kế code cho 5 trên 85 chức năng — class diagram không có thuộc tính/phương thức, chỉ 2 sequence diagram — và phụ lục (giả định, loại trừ, 13 business rule). Cách vẽ class/sequence diagram khớp code thật.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.6 · G5 RDS pages 204–213</span>
<h2>The RDS, parts IV–V — code designs and appendix</h2>
<p class="lead">Chapter IV is where the design grade expects <strong>class and sequence diagrams that match the code</strong>. G5's chapter has nine pages for <strong>5 of 85 functions</strong>: Register, Home page, Freelancer profile, View list freelancer, View list recruiter — and only the last two have a sequence diagram.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Say what a class diagram in an RDS must show (attributes, operations, the real class names) and what G5's lack.</li>
<li>Read a sequence diagram of a servlet–DAO–database call and check it against the code.</li>
<li>Judge an appendix: which assumptions, exclusions and business rules are useful.</li>
</ul></div>
<table>
<thead><tr><th>Block</th><th>Class diagram</th><th>Sequence diagram</th><th>DB queries</th><th>Page</th></tr></thead>
<tbody>
<tr><td>1 Register</td><td>✓ (empty boxes)</td><td>heading only</td><td>1 insert</td><td>204–205</td></tr>
<tr><td>2 Home page common</td><td>✓ (Blogs only)</td><td>heading only</td><td>1 select</td><td>206–207</td></tr>
<tr><td>3 Profile freelancer</td><td>✓</td><td>heading only</td><td>6 selects (3 repeated)</td><td>208–209</td></tr>
<tr><td>4 View list freelancer</td><td>✓</td><td>✓</td><td>2</td><td>210</td></tr>
<tr><td>5 View list recruiter</td><td>✓</td><td>✓</td><td>2</td><td>211–212</td></tr>
<tr><td>V Appendix</td><td colspan="3">AS-1–2 assumptions · EX-1–2 exclusions · BR-01–BR-13 business rules</td><td>212–213</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.6 · RDS của G5 trang 204–213</span>
<h2>RDS, phần IV–V — thiết kế code và phụ lục</h2>
<p class="lead">Chương IV là nơi điểm thiết kế đòi hỏi <strong>class diagram và sequence diagram khớp với code</strong>. Chương này của G5 dài chín trang cho <strong>5 trên 85 chức năng</strong>: Register, Home page, Freelancer profile, View list freelancer, View list recruiter — và chỉ hai cái cuối có sequence diagram.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Nói được class diagram trong RDS phải có gì (thuộc tính, phương thức, tên lớp thật) và của G5 thiếu gì.</li>
<li>Đọc một sequence diagram cho lời gọi servlet–DAO–CSDL và đối chiếu nó với code.</li>
<li>Đánh giá một phụ lục: giả định, loại trừ và business rule nào có ích.</li>
</ul></div>
<table>
<thead><tr><th>Khối</th><th>Class diagram</th><th>Sequence diagram</th><th>Truy vấn CSDL</th><th>Trang</th></tr></thead>
<tbody>
<tr><td>1 Register</td><td>✓ (hộp rỗng)</td><td>chỉ có tiêu đề</td><td>1 insert</td><td>204–205</td></tr>
<tr><td>2 Home page common</td><td>✓ (chỉ có Blogs)</td><td>chỉ có tiêu đề</td><td>1 select</td><td>206–207</td></tr>
<tr><td>3 Profile freelancer</td><td>✓</td><td>chỉ có tiêu đề</td><td>6 select (3 câu lặp lại)</td><td>208–209</td></tr>
<tr><td>4 View list freelancer</td><td>✓</td><td>✓</td><td>2</td><td>210</td></tr>
<tr><td>5 View list recruiter</td><td>✓</td><td>✓</td><td>2</td><td>211–212</td></tr>
<tr><td>V Appendix</td><td colspan="3">giả định AS-1–2 · loại trừ EX-1–2 · business rule BR-01–BR-13</td><td>212–213</td></tr>
</tbody>
</table>`),
    walkHead(R, 204, 213),
    walk(R, [
      [204, 'IV. Code Designs — 1. Register: 1.1 Class Diagram (RegisterController, DAO, DBContext, User, Role); 1.2 Sequence Diagram(s) — empty',
        `<p class="y-chinh">🎯 A class diagram with empty boxes shows which classes talk to each other — and nothing about what they do.</p>
<ul>
<li><strong>Empty compartments</strong> — no attributes, no operations. The reader cannot see <code>register(user)</code>, <code>checkUsernameExists()</code> or the fields of <code>User</code>.</li>
<li><strong>A generic "DAO"</strong> — the package diagram (page 29) names FreelancerDAO, CommonDAO…; which one registers?</li>
<li><strong>Two lines User → Role</strong> — an aggregation labelled <code>roleID</code> and a dependency: pick one association with multiplicity.</li>
<li><strong>"1.2 Sequence Diagram(s)"</strong> — a heading with nothing under it.</li>
</ul>`,
        `<p class="y-chinh">🎯 Class diagram với các hộp rỗng cho thấy lớp nào nói chuyện với lớp nào — mà không nói gì về việc chúng làm.</p>
<ul>
<li><strong>Ngăn rỗng</strong> — không thuộc tính, không phương thức. Người đọc không thấy <code>register(user)</code>, <code>checkUsernameExists()</code> hay các trường của <code>User</code>.</li>
<li><strong>Một "DAO" chung chung</strong> — package diagram (trang 29) có FreelancerDAO, CommonDAO…; lớp nào lo việc đăng ký?</li>
<li><strong>Hai đường User → Role</strong> — một aggregation ghi <code>roleID</code> và một dependency: chọn một association kèm multiplicity.</li>
<li><strong>"1.2 Sequence Diagram(s)"</strong> — tiêu đề mà bên dưới trống trơn.</li>
</ul>`],
      [206, '2. Home Page common — 2.1 Class Diagram (HomeContronller, HomeDAO, DBContext, Blogs)',
        `<p class="y-chinh">🎯 The home page shows five kinds of data; its class diagram shows one.</p>
<ul>
<li><strong>Incomplete</strong> — the home page lists categories, newest posts, freelancers, companies and blogs (lesson S.4, pages 52–54), but only <code>Blogs</code> appears.</li>
<li><strong>Typo in a class name</strong> — "HomeContronller": if the code is spelled correctly, the diagram does not match it; if not, fix the code.</li>
<li><strong>Relation labels</strong> — "is" for inheritance from DBContext and "pDAO" for the controller's field: correct idea, but name the field as in the code.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> generate the class diagram from the code (NetBeans/IntelliJ plug-ins, or PlantUML by hand) — then it cannot drift.</p>`,
        `<p class="y-chinh">🎯 Trang chủ hiện năm loại dữ liệu; class diagram của nó chỉ có một.</p>
<ul>
<li><strong>Thiếu</strong> — trang chủ liệt kê danh mục, tin mới nhất, freelancer, công ty và blog (bài S.4, trang 52–54), nhưng chỉ có <code>Blogs</code> xuất hiện.</li>
<li><strong>Tên lớp sai chính tả</strong> — "HomeContronller": nếu code viết đúng thì sơ đồ không khớp code; nếu code cũng sai thì hãy sửa code.</li>
<li><strong>Nhãn quan hệ</strong> — "is" cho kế thừa DBContext và "pDAO" cho trường của controller: ý đúng, nhưng hãy đặt tên trường như trong code.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> sinh class diagram từ code (plug-in của NetBeans/IntelliJ, hoặc tự viết PlantUML) — như vậy nó không thể lệch khỏi code.</p>`],
    ]),
    walk(R, [
      [208, '3. Profile Freelancer — 3.1 Class Diagram (FreelancerDAO, DBContext, ViewProfile_Freelancer, Education, Experience, Skills, SkillSet); 3.2 empty',
        `<p class="y-chinh">🎯 One DAO loads the four parts of a profile — a sensible structure, drawn without a single method and backed by copy-pasted queries.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>One DAO per aggregate</strong> — FreelancerDAO reads Education, Experience, Skills and SkillSet for one freelancer.</li>
</ul>
<p class="nhan">To fix</p>
<ul>
<li><strong>Class naming</strong> — "ViewProfile_Freelancer" breaks Java naming (no underscores in class names) and differs from "FreelancerControll" in the package diagram.</li>
<li><strong>Duplicated queries (page 209)</strong> — the Education and Skills SELECTs are listed twice.</li>
<li><strong>A typo that spreads</strong> — every Education query must write <code>de.dregeeID</code> because the Degree primary key is misspelled in the schema.</li>
<li><strong>3.2 Sequence Diagram(s)</strong> — empty again.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một DAO nạp bốn phần của hồ sơ — cấu trúc hợp lý, nhưng vẽ không có lấy một phương thức và dựa trên các truy vấn chép dán.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Mỗi aggregate một DAO</strong> — FreelancerDAO đọc Education, Experience, Skills và SkillSet của một freelancer.</li>
</ul>
<p class="nhan">Cần sửa</p>
<ul>
<li><strong>Đặt tên lớp</strong> — "ViewProfile_Freelancer" vi phạm quy ước đặt tên Java (không dùng gạch dưới trong tên lớp) và khác "FreelancerControll" trong package diagram.</li>
<li><strong>Truy vấn lặp (trang 209)</strong> — câu SELECT của Education và Skills được liệt kê hai lần.</li>
<li><strong>Một lỗi chính tả lan rộng</strong> — mọi truy vấn Education phải viết <code>de.dregeeID</code> vì khoá chính của Degree bị viết sai ngay trong schema.</li>
<li><strong>3.2 Sequence Diagram(s)</strong> — lại trống.</li>
</ul>`],
      [210, '4. View list freelancer — 4.1 Class Diagram, 4.2 Sequence Diagram (Admin → Browser → ManageFreelancerAdmin → DAOs → Database), 4.3 Database Queries',
        `<p class="y-chinh">🎯 The first real sequence diagram of the RDS — its lifelines match the class diagram, which is exactly what an examiner checks.</p>
<p class="nhan">Good</p>
<ul>
<li><strong>Consistent names</strong> — ManageFreelancerAdmin, DashboardDAO, FreelancerInformationDAO appear in both diagrams.</li>
<li><strong>A view model</strong> — <code>FreelancerInformation</code> bundles a freelancer with his skills for the list: a sensible DTO.</li>
<li><strong>Returns drawn</strong> — total count and list come back before "Render page".</li>
</ul>
<p class="nhan">To fix</p>
<ul>
<li><strong>Multiplicity "1..1" almost everywhere</strong> — a freelancer has many skills.</li>
<li><strong>No parameters</strong> — the final list screen pages and filters, but the calls carry no page number or filter: the diagram shows iteration-1 behaviour.</li>
<li><strong><code>select * from [User] u join [freelancer] f … join [Role] r</code></strong> — <code>*</code> includes <code>User.password</code>; the list page never needs it.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sequence diagram thật đầu tiên của RDS — các lifeline khớp class diagram, đúng thứ giám khảo kiểm tra.</p>
<p class="nhan">Điểm tốt</p>
<ul>
<li><strong>Tên nhất quán</strong> — ManageFreelancerAdmin, DashboardDAO, FreelancerInformationDAO có mặt ở cả hai sơ đồ.</li>
<li><strong>Có view model</strong> — <code>FreelancerInformation</code> gói một freelancer cùng kỹ năng của họ cho danh sách: một DTO hợp lý.</li>
<li><strong>Có vẽ giá trị trả về</strong> — tổng số và danh sách trả về trước bước "Render page".</li>
</ul>
<p class="nhan">Cần sửa</p>
<ul>
<li><strong>Multiplicity "1..1" gần như khắp nơi</strong> — một freelancer có nhiều kỹ năng.</li>
<li><strong>Không có tham số</strong> — màn hình danh sách cuối cùng có phân trang và bộ lọc, nhưng các lời gọi không mang số trang hay điều kiện lọc: sơ đồ thể hiện hành vi của iteration 1.</li>
<li><strong><code>select * from [User] u join [freelancer] f … join [Role] r</code></strong> — <code>*</code> kéo theo cả <code>User.password</code>; trang danh sách không bao giờ cần nó.</li>
</ul>`],
      [211, '5. View list recruiter — 5.1 Class Diagram, 5.2 Sequence Diagram, 5.3 Database Queries',
        `<p class="y-chinh">🎯 The recruiter version repeats the freelancer pattern — and shows how hand-drawn diagrams drift from each other.</p>
<ul>
<li><strong>Name drift</strong> — "RecruiterInformationDAO" in the class diagram, "RecruiterInfomationDAO" as the lifeline; messages "getTotalRecuiter", "Return totalRecuiter".</li>
<li><strong>N+1 queries</strong> — the list's "Total post" column comes from <code>select count(postID) … from Post where recruiterID = ?</code>, run once per recruiter row. One <code>GROUP BY recruiterID</code> join returns all counts at once.</li>
<li><strong><code>SELECT *</code> over five joined tables</strong> — again including the password column.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a sequence diagram is checked against the code line by line — copy method and class names from the IDE, never type them.</p>`,
        `<p class="y-chinh">🎯 Bản recruiter lặp lại mẫu của freelancer — và cho thấy các sơ đồ vẽ tay trôi lệch khỏi nhau thế nào.</p>
<ul>
<li><strong>Tên bị trôi</strong> — "RecruiterInformationDAO" trong class diagram, "RecruiterInfomationDAO" ở lifeline; thông điệp "getTotalRecuiter", "Return totalRecuiter".</li>
<li><strong>N+1 truy vấn</strong> — cột "Total post" của danh sách lấy từ <code>select count(postID) … from Post where recruiterID = ?</code>, chạy một lần cho mỗi dòng recruiter. Một phép join với <code>GROUP BY recruiterID</code> trả về mọi con số trong một lần.</li>
<li><strong><code>SELECT *</code> trên năm bảng join</strong> — lại kéo theo cả cột mật khẩu.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> sequence diagram được đối chiếu với code từng dòng — hãy chép tên phương thức và tên lớp từ IDE, đừng bao giờ gõ tay.</p>`],
    ]),
    walk(R, [
      [212, 'V. Appendix — 1. Assumptions & Dependencies (AS-1, AS-2), 2. Limitations & Exclusions (EX-1, EX-2), 3. Business Rules BR-01–BR-11',
        `<p class="y-chinh">🎯 The appendix holds some of the RDS's most useful content — in the wrong place, and partly promising what the system does not do.</p>
<p class="nhan">Assumptions &amp; exclusions</p>
<ul>
<li><strong>AS-1 "enough users … to create supply and demand"</strong> — a business risk, not a project assumption.</li>
<li><strong>AS-2 "handle a large enough volume of traffic"</strong> — no number. Write it as a measurable requirement ("100 concurrent users, pages under 2 s") or list real dependencies (SQL Server version, Tomcat, the mail account).</li>
<li><strong>EX-1, EX-2</strong> — good exclusions (no contracts, no payments) that belong in Scope (lesson S.2). EX-2 still says "only integrate with external payment platforms" — nothing is integrated; say "no payments".</li>
</ul>
<p class="nhan">Business rules — check each against the product</p>
<ul>
<li><strong>Kept</strong> — BR-04 job matching (Job for You), BR-11 no cancelling an application (no cancel button).</li>
<li><strong>Not kept</strong> — BR-07 public reviews (no review table), BR-08 privacy (plain-text passwords), BR-05 application period (posts are created without an expiry date).</li>
<li><strong>Broken links</strong> — the specs cite "BR-1", "BR-9", "FR1"; this list says "BR-01" … "BR-13".</li>
</ul>`,
        `<p class="y-chinh">🎯 Phụ lục chứa vài nội dung hữu ích nhất của RDS — đặt sai chỗ, và một phần hứa hẹn điều hệ thống không làm.</p>
<p class="nhan">Giả định &amp; loại trừ</p>
<ul>
<li><strong>AS-1 "đủ người dùng … để tạo cung và cầu"</strong> — là rủi ro kinh doanh, không phải giả định của dự án.</li>
<li><strong>AS-2 "chịu được lượng truy cập đủ lớn"</strong> — không có con số. Hãy viết thành yêu cầu đo được ("100 người dùng đồng thời, trang dưới 2 giây") hoặc liệt kê phụ thuộc thật (phiên bản SQL Server, Tomcat, tài khoản mail).</li>
<li><strong>EX-1, EX-2</strong> — loại trừ tốt (không hợp đồng, không thanh toán) mà chỗ đúng là Scope (bài S.2). EX-2 vẫn ghi "chỉ tích hợp với nền tảng thanh toán bên ngoài" — không có tích hợp nào; hãy ghi "không có thanh toán".</li>
</ul>
<p class="nhan">Business rule — đối chiếu từng cái với sản phẩm</p>
<ul>
<li><strong>Đã giữ</strong> — BR-04 so khớp việc (Job for You), BR-11 không huỷ đơn ứng tuyển (không có nút huỷ).</li>
<li><strong>Không giữ</strong> — BR-07 đánh giá công khai (không có bảng review), BR-08 quyền riêng tư (mật khẩu chữ thường), BR-05 thời hạn ứng tuyển (tin được tạo không có ngày hết hạn).</li>
<li><strong>Tham chiếu gãy</strong> — các đặc tả dẫn "BR-1", "BR-9", "FR1"; danh sách này ghi "BR-01" … "BR-13".</li>
</ul>`],
      [213, 'Business Rules (end) — BR-12 Describe clearly, BR-13 Fair Recruitment',
        `<p class="y-chinh">🎯 The last two rules are good intentions that the system cannot check — rewrite them so it can.</p>
<ul>
<li><strong>BR-12 "Recruiters must provide detailed job descriptions"</strong> → enforceable version: "Description is required and has at least 100 characters; Skills and Duration are required."</li>
<li><strong>BR-13 "Job offers are not discriminatory"</strong> → a policy for the terms of use; the system's part is moderation: "A post reported 3 times is hidden until the admin reviews it."</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> for each rule ask "which screen or constraint enforces this, and which test proves it?" — no answer, no rule.</p>`,
        `<p class="y-chinh">🎯 Hai rule cuối là ý tốt mà hệ thống không kiểm được — hãy viết lại để nó kiểm được.</p>
<ul>
<li><strong>BR-12 "Recruiter phải mô tả công việc chi tiết"</strong> → bản ép buộc được: "Mô tả là bắt buộc và dài ít nhất 100 ký tự; Skills và Duration là bắt buộc."</li>
<li><strong>BR-13 "Tin tuyển dụng không phân biệt đối xử"</strong> → là chính sách của điều khoản sử dụng; phần của hệ thống là kiểm duyệt: "Tin bị báo cáo 3 lần sẽ bị ẩn cho tới khi admin xem xét."</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với mỗi rule hãy hỏi "màn hình hay ràng buộc nào thực thi nó, và test nào chứng minh nó?" — không trả lời được thì không phải rule.</p>`],
    ]),
    bi(`<h3>Do it better — the code design of one screen</h3>
<p>The model below is the code design of <strong>Apply Job</strong> (UC_47), continuing the specification of S.3 and the screen block of S.4. Written in PlantUML, it renders to a diagram and stays in the repository next to the code.</p>
<p class="nhan">Class diagram — real names, the attributes and operations this screen uses</p>
<pre>class ApplyJobController {
  - postDAO : PostDAO
  - applyDAO : JobApplyDAO
  + doPost(req, resp) : void
}
class PostDAO { + findOpenPost(postId : int) : Post }
class JobApplyDAO {
  + exists(freelanceId : int, postId : int) : boolean
  + insert(a : JobApply) : int
}
class JobApply {
  - applyId : int
  - freelanceId : int
  - postId : int
  - status : String
  - dateApply : Date
  - resume : String
}
DBContext &lt;|-- PostDAO
DBContext &lt;|-- JobApplyDAO
ApplyJobController --&gt; PostDAO
ApplyJobController --&gt; JobApplyDAO
JobApplyDAO ..&gt; JobApply</pre>
<p class="nhan">Sequence — normal path and the two exception paths</p>
<ol>
<li><strong>Browser → ApplyJobController</strong> — POST /apply with postId and the CV file.</li>
<li><strong>Controller</strong> — reads the freelancer from the session; none → redirect to Login.</li>
<li><strong>→ PostDAO.findOpenPost(postId)</strong> — null → "This job is closed" (4.E1).</li>
<li><strong>→ JobApplyDAO.exists(freelanceId, postId)</strong> — true → show the current status (4.E2).</li>
<li><strong>Controller</strong> — stores the CV file, then <strong>JobApplyDAO.insert(apply)</strong> runs the INSERT of S.4.</li>
<li><strong>Controller → Browser</strong> — redirect to Job detail, which now shows "Applied".</li>
</ol>
<h3>Checklist for chapter IV</h3>
<ol>
<li><strong>Every class name exists in the code</strong>, spelled the same way.</li>
<li><strong>Each class shows the attributes and operations</strong> the screen uses.</li>
<li><strong>One sequence diagram per screen</strong>, with the exception paths as <code>alt</code> fragments.</li>
<li><strong>The SQL in "Database Queries"</strong> is exactly what the DAO runs — each statement once.</li>
<li><strong>Every member, every iteration</strong> — a code design for each of his own screens, not five for the whole team.</li>
</ol>`,
    `<h3>Làm tốt hơn — thiết kế code của một màn hình</h3>
<p>Bản mẫu dưới đây là thiết kế code của <strong>Apply Job</strong> (UC_47), nối tiếp đặc tả ở S.3 và khối màn hình ở S.4. Viết bằng PlantUML, nó dựng ra được sơ đồ và nằm trong repository cạnh code.</p>
<p class="nhan">Class diagram — tên thật, thuộc tính và phương thức mà màn hình này dùng</p>
<pre>class ApplyJobController {
  - postDAO : PostDAO
  - applyDAO : JobApplyDAO
  + doPost(req, resp) : void
}
class PostDAO { + findOpenPost(postId : int) : Post }
class JobApplyDAO {
  + exists(freelanceId : int, postId : int) : boolean
  + insert(a : JobApply) : int
}
class JobApply {
  - applyId : int
  - freelanceId : int
  - postId : int
  - status : String
  - dateApply : Date
  - resume : String
}
DBContext &lt;|-- PostDAO
DBContext &lt;|-- JobApplyDAO
ApplyJobController --&gt; PostDAO
ApplyJobController --&gt; JobApplyDAO
JobApplyDAO ..&gt; JobApply</pre>
<p class="nhan">Sequence — luồng chính và hai luồng ngoại lệ</p>
<ol>
<li><strong>Browser → ApplyJobController</strong> — POST /apply kèm postId và file CV.</li>
<li><strong>Controller</strong> — đọc freelancer từ session; không có → chuyển tới Login.</li>
<li><strong>→ PostDAO.findOpenPost(postId)</strong> — null → "This job is closed" (4.E1).</li>
<li><strong>→ JobApplyDAO.exists(freelanceId, postId)</strong> — true → hiện trạng thái hiện tại (4.E2).</li>
<li><strong>Controller</strong> — lưu file CV, rồi <strong>JobApplyDAO.insert(apply)</strong> chạy câu INSERT ở S.4.</li>
<li><strong>Controller → Browser</strong> — chuyển về Job detail, lúc này hiện "Applied".</li>
</ol>
<h3>Bảng kiểm cho chương IV</h3>
<ol>
<li><strong>Tên lớp nào cũng có thật trong code</strong>, viết y hệt.</li>
<li><strong>Mỗi lớp thể hiện thuộc tính và phương thức</strong> mà màn hình dùng.</li>
<li><strong>Mỗi màn hình một sequence diagram</strong>, các luồng ngoại lệ vẽ bằng fragment <code>alt</code>.</li>
<li><strong>SQL ở "Database Queries"</strong> đúng là thứ DAO chạy — mỗi câu một lần.</li>
<li><strong>Mọi thành viên, mọi iteration</strong> — mỗi màn hình của mình một thiết kế code, không phải năm bản cho cả nhóm.</li>
</ol>`),
    books([
      ['fowler', 'Ch.3 "Class Diagrams: The Essentials" and Ch.4 "Sequence Diagrams"', 'Chương 3 "Class Diagrams: The Essentials" và Chương 4 "Sequence Diagrams"'],
      ['gomaa', 'the chapters "Static Modeling" and "Dynamic Interaction Modeling"', 'các chương "Static Modeling" và "Dynamic Interaction Modeling"'],
      ['wiegers', 'Ch.10 "Documenting the requirements" (assumptions, dependencies, exclusions)', 'Chương 10 "Documenting the requirements" (giả định, phụ thuộc, loại trừ)'],
    ]),
  ].join('\n'),
};

/* ─────────────── S.7 Project Tracking workbook & SQL script ─────────────── */
const L7 = {
  title: 'S.7 — The G5 Project Tracking workbook and database script, cell by cell|||S.7 — Workbook Project Tracking và script CSDL của G5, từng ô một',
  slug: 'swp391-sample-g5-tracking-sql',
  type: 'VIDEO',
  description: 'File ProjectTracking.xlsx và script SQL Server của G5: sheet Use Cases chép mô tả từ dự án thương mại điện tử, sheet Product 85 dòng đều "Simple" và "Completed", nhận xét thật của giảng viên, LOC từng thành viên theo iteration; 22 bảng CSDL — điểm tốt, lỗi đặt tên/chuẩn hoá/bảo mật và cách làm tốt hơn.',
  content: [
    bi(`<span class="eyebrow">Sample project · Lesson S.7 · ProjectTracking.xlsx + SQL script</span>
<h2>The two files a teacher opens first</h2>
<p class="lead">Before reading 213 pages, a teacher opens the <strong>Project Tracking workbook</strong> (what was built, by whom, in which iteration, how complex) and runs the <strong>database script</strong>. How the workbook and LOC grading work is taught in Chapter 4 (lessons "Project Tracking workbook" and "Complexity, LOC &amp; grade"); database design in Chapter 3. Here we audit G5's real files against those rules. Member usernames in the PIC column are replaced by Member A–E.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>Audit a tracking workbook the way the teacher does: IDs, descriptions, complexity, status, per-member LOC.</li>
<li>Review a SQL Server script for naming, keys, normalisation and security.</li>
<li>Fill your own workbook so that it survives the first five minutes of grading.</li>
</ul></div>
<h3>Sheet "Use Cases" — 37 rows, half of them from another project</h3>
<p>Columns: # · Feature · Use case · one tick column per actor (Freelancer, Recruiter, Admin, Guest) · Use case description. Rows UC1–UC37 are filled, UC38–UC52 are empty placeholders.</p>
<table>
<thead><tr><th>Row</th><th>Use case</th><th>Its description (column H)</th></tr></thead>
<tbody>
<tr><td>UC2</td><td>View Home Page</td><td>"the main landing page of the <em>e-commerce website</em>"</td></tr>
<tr><td>UC3</td><td>Forgot password</td><td>"allows previously logged in users to <em>log out</em>"</td></tr>
<tr><td>UC5</td><td>Change Password</td><td>"allows guests to <em>create a new user account</em>"</td></tr>
<tr><td>UC7</td><td>Search freelancer</td><td>"search a <em>product</em> with filter"</td></tr>
<tr><td>UC9</td><td>Create news post</td><td>"users editing their comments on <em>products</em>"</td></tr>
<tr><td>UC10 · UC11</td><td>Views post details · Views blog details</td><td>"change their password" · "change their avatar"</td></tr>
<tr><td>UC14–UC16</td><td>View favourite · Views List Apply · Manager List Application</td><td>"items selected for <em>purchase</em>", "adjust the quantity or remove products from the <em>cart</em>" (twice)</td></tr>
<tr><td>UC17 · UC18</td><td>Create news Blogs · Dashboard Admin</td><td>"review their <em>orders</em> list" · "detailed information about <em>orders</em>"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Thirteen of the first eighteen descriptions belong to a shop.</strong> The column was copied from an e-commerce project and shifted by one row, so every text sits next to the wrong use case. Rows UC19–UC37, added later, are correct. This is the first sheet the teacher opens.</div>`,
    `<span class="eyebrow">Dự án mẫu · Bài S.7 · ProjectTracking.xlsx + script SQL</span>
<h2>Hai file giảng viên mở đầu tiên</h2>
<p class="lead">Trước khi đọc 213 trang, giảng viên mở <strong>workbook Project Tracking</strong> (làm được gì, ai làm, iteration nào, độ phức tạp ra sao) và chạy <strong>script CSDL</strong>. Cách workbook và chấm LOC vận hành được dạy ở Chương 4 (bài "Workbook Project Tracking" và "Độ phức tạp, LOC &amp; điểm"); thiết kế CSDL ở Chương 3. Ở đây ta soát file thật của G5 theo đúng các quy tắc đó. Username thành viên ở cột PIC được thay bằng Member A–E.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li>Soát một workbook tracking như giảng viên: mã, mô tả, độ phức tạp, trạng thái, LOC từng người.</li>
<li>Review một script SQL Server về đặt tên, khoá, chuẩn hoá và bảo mật.</li>
<li>Điền workbook của nhóm mình sao cho qua được năm phút chấm đầu tiên.</li>
</ul></div>
<h3>Sheet "Use Cases" — 37 dòng, một nửa từ dự án khác</h3>
<p>Các cột: # · Feature · Use case · mỗi actor một cột đánh dấu (Freelancer, Recruiter, Admin, Guest) · Use case description. Dòng UC1–UC37 có nội dung, UC38–UC52 là dòng giữ chỗ trống.</p>
<table>
<thead><tr><th>Dòng</th><th>Use case</th><th>Mô tả của nó (cột H)</th></tr></thead>
<tbody>
<tr><td>UC2</td><td>View Home Page</td><td>"the main landing page of the <em>e-commerce website</em>"</td></tr>
<tr><td>UC3</td><td>Forgot password</td><td>"allows previously logged in users to <em>log out</em>"</td></tr>
<tr><td>UC5</td><td>Change Password</td><td>"allows guests to <em>create a new user account</em>"</td></tr>
<tr><td>UC7</td><td>Search freelancer</td><td>"search a <em>product</em> with filter"</td></tr>
<tr><td>UC9</td><td>Create news post</td><td>"users editing their comments on <em>products</em>"</td></tr>
<tr><td>UC10 · UC11</td><td>Views post details · Views blog details</td><td>"change their password" · "change their avatar"</td></tr>
<tr><td>UC14–UC16</td><td>View favourite · Views List Apply · Manager List Application</td><td>"items selected for <em>purchase</em>", "adjust the quantity or remove products from the <em>cart</em>" (hai lần)</td></tr>
<tr><td>UC17 · UC18</td><td>Create news Blogs · Dashboard Admin</td><td>"review their <em>orders</em> list" · "detailed information about <em>orders</em>"</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Mười ba trên mười tám mô tả đầu tiên thuộc về một cửa hàng.</strong> Cột này được chép từ một dự án thương mại điện tử và lệch đi một dòng, nên đoạn chữ nào cũng nằm cạnh sai use case. Các dòng UC19–UC37, thêm sau, thì đúng. Đây là sheet đầu tiên giảng viên mở.</div>`),
    bi(`<h3>Sheet "Product" — 85 screens/functions, audited column by column</h3>
<table>
<thead><tr><th>Column</th><th>G5's values</th><th>What the teacher concludes</th></tr></thead>
<tbody>
<tr><td>Complexity</td><td>83 Simple · 2 Medium (the two Register rows) · 0 Complex</td><td>no estimation was done: dashboards with charts and a 20-field profile form are "Simple" — which also <em>lowers</em> the team's LOC</td></tr>
<tr><td>Status (BA, SRS, SDS, Coding, UT/IT)</td><td>all 85 rows "Completed" in every phase</td><td>not credible: the RDS holds 17 specifications and 5 code designs</td></tr>
<tr><td>Quality</td><td>High 81 · Medium 1 · Low 2 · blank 1</td><td>self-rated; see the teacher's remark below</td></tr>
<tr><td>Effort</td><td>filled on 9 of 85 rows</td><td>no data to plan the next iteration</td></tr>
<tr><td>Details</td><td>empty on 46 rows</td><td>"Complected Project", "Freelancer connected" — nobody can tell what they are</td></tr>
<tr><td>Defects</td><td>recorded on 3 rows</td><td>contradicts "too many defects" in the remark</td></tr>
<tr><td>LOC plan / grade</td><td>5,220 / 5,070; 4 rows differ (UC_01 120→90, UC_16 and UC_17 60→30, UC_69 60→0)</td><td>UC_69 is graded 0 yet marked Completed</td></tr>
</tbody>
</table>
<h3>LOC per member and iteration (planned / graded, from the sheet)</h3>
<table>
<thead><tr><th>Member</th><th>Iteration 1</th><th>Iteration 2</th><th>Iteration 3</th></tr></thead>
<tbody>
<tr><td>A</td><td>3 rows · 300 / 270</td><td>6 rows · 360 / 360</td><td>9 rows · 540 / 540</td></tr>
<tr><td>B</td><td>5 rows · 300 / 300</td><td>6 rows · 360 / 360</td><td>10 rows · 600 / 600</td></tr>
<tr><td>C</td><td>2 rows · 120 / 60</td><td>5 rows · 300 / 300</td><td>11 rows · 660 / 660</td></tr>
<tr><td>D</td><td>5 rows · 300 / 300</td><td>11 rows · 660 / 660</td><td>12 rows · 720 / 660</td></tr>
<tr><td>E</td><td>—</td><td>—</td><td>—</td></tr>
</tbody>
</table>
<p>Compare with the MaxLOC of each iteration — <strong>180 / 240 / 660</strong> in the Subject Guides, <strong>240 / 240 / 720</strong> in the Student Guides (follow your teacher's current guide). Member C's iteration 1 is far below either value. Member E is in the MasterData team list but owns no row at all.</p>
<h3>Sheets "MasterData" and "Sheet1"</h3>
<ul>
<li><strong>Iteration dates</strong> — ITER1 06/05–31/05/2024, ITER2 01/06–21/06, ITER3 22/06–12/07.</li>
<li><strong>Grading factors</strong> — Complex 240 · Medium 120 · Simple 60 LOC; quality High 1 · Medium 0.75 · Low 0.5: the course's C × Q table.</li>
<li><strong>Status list</strong> — New, Doing, Done, ToDo <em>and</em> Completed: two words for "finished".</li>
<li><strong>The teacher's remarks</strong> (Sheet1): "Sai và loạn hết các khái niệm, không đồng bộ giữa các màn hình" — concepts wrong and muddled, screens inconsistent with each other; and one member, short of LOC and with too many defects, was not allowed to defend.</li>
</ul>`,
    `<h3>Sheet "Product" — 85 màn hình/chức năng, soát từng cột</h3>
<table>
<thead><tr><th>Cột</th><th>Giá trị của G5</th><th>Giảng viên kết luận gì</th></tr></thead>
<tbody>
<tr><td>Complexity</td><td>83 Simple · 2 Medium (hai dòng Register) · 0 Complex</td><td>không hề ước lượng: dashboard có biểu đồ và form hồ sơ 20 trường đều "Simple" — điều đó còn <em>giảm</em> LOC của nhóm</td></tr>
<tr><td>Status (BA, SRS, SDS, Coding, UT/IT)</td><td>cả 85 dòng "Completed" ở mọi pha</td><td>không đáng tin: RDS chỉ có 17 đặc tả và 5 thiết kế code</td></tr>
<tr><td>Quality</td><td>High 81 · Medium 1 · Low 2 · trống 1</td><td>tự chấm; xem nhận xét của giảng viên bên dưới</td></tr>
<tr><td>Effort</td><td>điền ở 9 trên 85 dòng</td><td>không có dữ liệu để lập kế hoạch iteration sau</td></tr>
<tr><td>Details</td><td>trống ở 46 dòng</td><td>"Complected Project", "Freelancer connected" — không ai biết đó là gì</td></tr>
<tr><td>Defects</td><td>ghi ở 3 dòng</td><td>mâu thuẫn với "quá nhiều lỗi" trong nhận xét</td></tr>
<tr><td>LOC plan / grade</td><td>5.220 / 5.070; 4 dòng lệch (UC_01 120→90, UC_16 và UC_17 60→30, UC_69 60→0)</td><td>UC_69 được 0 điểm mà vẫn ghi Completed</td></tr>
</tbody>
</table>
<h3>LOC theo thành viên và iteration (kế hoạch / được chấm, theo sheet)</h3>
<table>
<thead><tr><th>Thành viên</th><th>Iteration 1</th><th>Iteration 2</th><th>Iteration 3</th></tr></thead>
<tbody>
<tr><td>A</td><td>3 dòng · 300 / 270</td><td>6 dòng · 360 / 360</td><td>9 dòng · 540 / 540</td></tr>
<tr><td>B</td><td>5 dòng · 300 / 300</td><td>6 dòng · 360 / 360</td><td>10 dòng · 600 / 600</td></tr>
<tr><td>C</td><td>2 dòng · 120 / 60</td><td>5 dòng · 300 / 300</td><td>11 dòng · 660 / 660</td></tr>
<tr><td>D</td><td>5 dòng · 300 / 300</td><td>11 dòng · 660 / 660</td><td>12 dòng · 720 / 660</td></tr>
<tr><td>E</td><td>—</td><td>—</td><td>—</td></tr>
</tbody>
</table>
<p>So với MaxLOC của từng iteration — <strong>180 / 240 / 660</strong> theo Subject Guides, <strong>240 / 240 / 720</strong> theo Student Guides (theo hướng dẫn hiện hành của thầy/cô). Iteration 1 của Member C thấp xa cả hai mức. Member E có tên trong danh sách nhóm ở MasterData nhưng không sở hữu dòng nào.</p>
<h3>Sheet "MasterData" và "Sheet1"</h3>
<ul>
<li><strong>Ngày của iteration</strong> — ITER1 06/05–31/05/2024, ITER2 01/06–21/06, ITER3 22/06–12/07.</li>
<li><strong>Hệ số chấm</strong> — Complex 240 · Medium 120 · Simple 60 LOC; chất lượng High 1 · Medium 0.75 · Low 0.5: đúng bảng C × Q của môn.</li>
<li><strong>Danh sách trạng thái</strong> — New, Doing, Done, ToDo <em>và</em> Completed: hai từ cho "đã xong".</li>
<li><strong>Nhận xét của giảng viên</strong> (Sheet1): "Sai và loạn hết các khái niệm, không đồng bộ giữa các màn hình"; và một thành viên thiếu LOC, quá nhiều lỗi, đã không được bảo vệ.</li>
</ul>`),
    bi(`<h3>The database script — 22 tables, audited</h3>
<p>The script is a SQL Server "Generate Scripts" export: <code>CREATE TABLE</code> for 22 tables, then the data (154 users, 96 freelancers, 52 recruiters, 32 companies, 51 posts, 44 applications…), then keys. Database design is taught in Chapter 3; here is how G5's script measures up.</p>
<table>
<thead><tr><th>Area</th><th>What the script does</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>Keys</td><td>21 of 22 tables have a primary key (not <code>Mark</code>); 25 foreign keys</td><td>✓ relations enforced · ✗ <code>Mark</code> can store the same pair twice</td></tr>
<tr><td>Uniqueness</td><td>4 UNIQUE constraints: one Admin / Freelancer / Recruiter profile per account, one company per recruiter</td><td>✓ the 1:1 links are enforced · ✗ nothing on <code>User.username</code>, JobApply, FreelancerFavorites, Report, skill names</td></tr>
<tr><td>Other constraints</td><td>no CHECK, no DEFAULT</td><td>✗ statuses and budgets accept any value</td></tr>
<tr><td>Normalisation</td><td><code>Post.skill nvarchar(50)</code> holds "C++, Java, .NET"</td><td>✗ not 1NF, and 50 characters cap a post at a handful of skills</td></tr>
<tr><td>Duplication</td><td>e-mail and phone in <code>User</code>, <code>Admin</code>, <code>Recruiter</code>, <code>Freelancer</code></td><td>✗ four copies to keep in sync</td></tr>
<tr><td>Naming</td><td><code>freelanceID</code> / <code>freelancerID</code> / <code>FreelancerID</code>, <code>dregeeID</code>, <code>ExpertiID</code>, <code>messeage</code>, <code>email__contact</code>, tables in singular and plural</td><td>✗ every query inherits the typos</td></tr>
<tr><td>Status columns</td><td><code>User.status</code> text, <code>Post.status</code> + <code>checking</code> int, JobApply '0'/'1'/'2' as text, <code>statusSkill</code> bit</td><td>✗ four conventions, none documented</td></tr>
<tr><td>Types</td><td><code>Recruiter.image varchar(100)</code> vs <code>Freelancer.image nvarchar(220)</code>; <code>Post.title nvarchar(50)</code></td><td>✗ the same kind of data typed differently; short titles</td></tr>
<tr><td>Security</td><td><code>User.password nvarchar(50)</code> in plain text</td><td>✗ store a BCrypt hash (60 characters)</td></tr>
<tr><td>Portability</td><td>starts with <code>USE [freelancer]</code>; DAO queries repeat <code>[freelancer].[dbo]</code></td><td>✗ breaks when restored under another name</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Seed data is part of your submission.</strong> G5's data rows contain names, e-mail addresses and phone numbers of real people. A submitted or published script must use invented data only — "Freelancer Demo 01", demo01@example.com.</div>`,
    `<h3>Script CSDL — 22 bảng, soát lại</h3>
<p>Script là bản xuất "Generate Scripts" của SQL Server: <code>CREATE TABLE</code> cho 22 bảng, rồi dữ liệu (154 user, 96 freelancer, 52 recruiter, 32 công ty, 51 tin, 44 đơn ứng tuyển…), rồi các khoá. Thiết kế CSDL được dạy ở Chương 3; đây là script của G5 khi đặt lên bàn cân.</p>
<table>
<thead><tr><th>Khía cạnh</th><th>Script làm gì</th><th>Nhận xét</th></tr></thead>
<tbody>
<tr><td>Khoá</td><td>21 trên 22 bảng có khoá chính (trừ <code>Mark</code>); 25 khoá ngoại</td><td>✓ quan hệ được ép buộc · ✗ <code>Mark</code> lưu được cùng một cặp hai lần</td></tr>
<tr><td>Tính duy nhất</td><td>4 ràng buộc UNIQUE: mỗi tài khoản một hồ sơ Admin / Freelancer / Recruiter, mỗi recruiter một công ty</td><td>✓ các liên kết 1:1 được ép buộc · ✗ không có gì trên <code>User.username</code>, JobApply, FreelancerFavorites, Report, tên kỹ năng</td></tr>
<tr><td>Ràng buộc khác</td><td>không CHECK, không DEFAULT</td><td>✗ trạng thái và ngân sách nhận mọi giá trị</td></tr>
<tr><td>Chuẩn hoá</td><td><code>Post.skill nvarchar(50)</code> chứa "C++, Java, .NET"</td><td>✗ không đạt 1NF, và 50 ký tự giới hạn mỗi tin chỉ vài kỹ năng</td></tr>
<tr><td>Trùng lặp</td><td>e-mail và điện thoại nằm ở <code>User</code>, <code>Admin</code>, <code>Recruiter</code>, <code>Freelancer</code></td><td>✗ bốn bản sao phải giữ đồng bộ</td></tr>
<tr><td>Đặt tên</td><td><code>freelanceID</code> / <code>freelancerID</code> / <code>FreelancerID</code>, <code>dregeeID</code>, <code>ExpertiID</code>, <code>messeage</code>, <code>email__contact</code>, tên bảng lúc số ít lúc số nhiều</td><td>✗ mọi câu truy vấn thừa hưởng lỗi chính tả</td></tr>
<tr><td>Cột trạng thái</td><td><code>User.status</code> chữ, <code>Post.status</code> + <code>checking</code> int, JobApply '0'/'1'/'2' dạng chữ, <code>statusSkill</code> bit</td><td>✗ bốn quy ước, không cái nào được ghi lại</td></tr>
<tr><td>Kiểu dữ liệu</td><td><code>Recruiter.image varchar(100)</code> và <code>Freelancer.image nvarchar(220)</code>; <code>Post.title nvarchar(50)</code></td><td>✗ cùng loại dữ liệu mà khác kiểu; tiêu đề quá ngắn</td></tr>
<tr><td>Bảo mật</td><td><code>User.password nvarchar(50)</code> dạng chữ thường</td><td>✗ lưu mã băm BCrypt (60 ký tự)</td></tr>
<tr><td>Tính di động</td><td>mở đầu bằng <code>USE [freelancer]</code>; truy vấn trong DAO lặp <code>[freelancer].[dbo]</code></td><td>✗ hỏng khi khôi phục dưới tên khác</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Dữ liệu mẫu là một phần của bài nộp.</strong> Các dòng dữ liệu của G5 chứa tên, địa chỉ e-mail và số điện thoại của người thật. Script nộp hay công bố chỉ được dùng dữ liệu bịa — "Freelancer Demo 01", demo01@example.com.</div>`),
    bi(`<h3>Do it better — fill the workbook so it survives the first five minutes</h3>
<table>
<thead><tr><th>Column</th><th>Rule for your team</th></tr></thead>
<tbody>
<tr><td>ID</td><td>one ID per screen, identical to the RDS heading and the GitLab issue</td></tr>
<tr><td>Description</td><td>written by the owner, one sentence in <em>this</em> system's words — never pasted</td></tr>
<tr><td>Complexity</td><td>count fields and transactions with the course table and write the counts in Details ("18 fields, 4 transactions → Complex")</td></tr>
<tr><td>Status per phase</td><td>"Completed" only when the artefact exists: spec in the RDS, code design, merged code, tests run</td></tr>
<tr><td>Effort · Defects</td><td>hours on every row · defects counted from issues labelled Defect (Leakage comes from the teacher)</td></tr>
<tr><td>PIC</td><td>every member owns 3–4 rows in every iteration — check the filter before each submission</td></tr>
</tbody>
</table>
<p class="nhan">Three fixes to G5's schema</p>
<pre>CREATE TABLE PostSkill (
  postID       int NOT NULL REFERENCES Post(postID),
  skill_set_ID int NOT NULL REFERENCES Skill_Set(skill_set_ID),
  CONSTRAINT PK_PostSkill PRIMARY KEY (postID, skill_set_ID)
);
ALTER TABLE JobApply ADD CONSTRAINT UQ_JobApply UNIQUE (freelanceID, postID);
ALTER TABLE [User] ADD CONSTRAINT UQ_User_username UNIQUE (username);
ALTER TABLE [User] ALTER COLUMN password varchar(60) NOT NULL;  -- BCrypt hash
ALTER TABLE JobApply ADD CONSTRAINT CK_JobApply_status CHECK (status IN ('0','1','2'));</pre>
<p class="ghi-chu">Remove existing duplicates before adding a UNIQUE constraint, or the ALTER fails.</p>
<div class="callout"><strong>★ Beyond the syllabus — let a query find the defects.</strong> Before every submission run checks such as
<code>SELECT skill_set_name, COUNT(*) FROM Skill_Set GROUP BY skill_set_name HAVING COUNT(*) &gt; 1</code> and
<code>SELECT freelanceID, postID, COUNT(*) FROM JobApply GROUP BY freelanceID, postID HAVING COUNT(*) &gt; 1</code>.
An empty result is your proof; a non-empty one is a defect to log before the teacher finds it as a leakage.</div>`,
    `<h3>Làm tốt hơn — điền workbook sao cho qua được năm phút đầu</h3>
<table>
<thead><tr><th>Cột</th><th>Quy tắc cho nhóm bạn</th></tr></thead>
<tbody>
<tr><td>ID</td><td>mỗi màn hình một mã, trùng với tiêu đề trong RDS và issue trên GitLab</td></tr>
<tr><td>Description</td><td>do người phụ trách viết, một câu bằng ngôn ngữ của <em>chính</em> hệ thống này — không bao giờ dán</td></tr>
<tr><td>Complexity</td><td>đếm trường và giao dịch theo bảng của môn, ghi số đếm vào Details ("18 trường, 4 giao dịch → Complex")</td></tr>
<tr><td>Status từng pha</td><td>chỉ "Completed" khi sản phẩm có thật: đặc tả trong RDS, thiết kế code, code đã merge, đã chạy test</td></tr>
<tr><td>Effort · Defects</td><td>số giờ ở mọi dòng · số lỗi đếm từ issue gắn nhãn Defect (Leakage do giảng viên tìm ra)</td></tr>
<tr><td>PIC</td><td>mỗi thành viên sở hữu 3–4 dòng ở mọi iteration — lọc kiểm tra trước mỗi lần nộp</td></tr>
</tbody>
</table>
<p class="nhan">Ba chỗ sửa cho schema của G5</p>
<pre>CREATE TABLE PostSkill (
  postID       int NOT NULL REFERENCES Post(postID),
  skill_set_ID int NOT NULL REFERENCES Skill_Set(skill_set_ID),
  CONSTRAINT PK_PostSkill PRIMARY KEY (postID, skill_set_ID)
);
ALTER TABLE JobApply ADD CONSTRAINT UQ_JobApply UNIQUE (freelanceID, postID);
ALTER TABLE [User] ADD CONSTRAINT UQ_User_username UNIQUE (username);
ALTER TABLE [User] ALTER COLUMN password varchar(60) NOT NULL;  -- BCrypt hash
ALTER TABLE JobApply ADD CONSTRAINT CK_JobApply_status CHECK (status IN ('0','1','2'));</pre>
<p class="ghi-chu">Xoá các dòng trùng hiện có trước khi thêm ràng buộc UNIQUE, nếu không lệnh ALTER sẽ lỗi.</p>
<div class="callout"><strong>★ Ngoài giáo trình — để câu truy vấn tự tìm lỗi.</strong> Trước mỗi lần nộp hãy chạy các phép kiểm như
<code>SELECT skill_set_name, COUNT(*) FROM Skill_Set GROUP BY skill_set_name HAVING COUNT(*) &gt; 1</code> và
<code>SELECT freelanceID, postID, COUNT(*) FROM JobApply GROUP BY freelanceID, postID HAVING COUNT(*) &gt; 1</code>.
Kết quả rỗng là bằng chứng của bạn; kết quả có dòng là một lỗi cần ghi lại trước khi giảng viên tìm ra nó thành leakage.</div>`),
    books([
      ['gomaa', 'the chapter "Static Modeling" (entity classes, multiplicity) — the basis of the Database Design deck', 'chương "Static Modeling" (lớp thực thể, multiplicity) — nền tảng của deck Database Design'],
      ['sommerville', 'Ch.22 "Project management" and Ch.23 "Project planning" (tracking effort and progress)', 'Chương 22 "Project management" và Chương 23 "Project planning" (theo dõi công sức và tiến độ)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────── Quiz ───────────────────────── */
const L8 = {
  title: 'Quiz S — Reading a real SWP391 package like an examiner|||Quiz S — Đọc một bộ hồ sơ SWP391 thật như giám khảo',
  slug: 'swp391-quiz-sample',
  type: 'QUIZ',
  quiz: {
    timeLimitSeconds: 1500,
    questions: [
      { question: "In G5's Use Cases sheet, row UC5 “Change Password” is described as “allows guests to create a new user account”. What most likely happened?|||Trong sheet Use Cases của G5, dòng UC5 “Change Password” được mô tả là “cho phép khách tạo tài khoản mới”. Nhiều khả năng chuyện gì đã xảy ra?",
        options: ["The description column was copied from another project and shifted by one row|||Cột mô tả được chép từ dự án khác và bị lệch một dòng", "Change Password really creates an account in this system|||Change Password thật sự tạo tài khoản trong hệ thống này", "The teacher edited the row during grading|||Giảng viên đã sửa dòng đó khi chấm", "Guests must change a password before registering|||Khách phải đổi mật khẩu trước khi đăng ký"],
        correctIndex: 0,
        explanation: "The first eighteen descriptions talk about products, carts and orders — texts of an e-commerce project — and each sits next to the wrong use case. Descriptions must be written by the screen owner in this system's words.|||Mười tám mô tả đầu nói về sản phẩm, giỏ hàng, đơn hàng — chữ của một dự án thương mại điện tử — và câu nào cũng nằm cạnh sai use case. Mô tả phải do người phụ trách màn hình viết bằng ngôn ngữ của chính hệ thống này." },
      { question: "83 of the 85 rows of G5's Product sheet are rated “Simple”. Why does an examiner criticise this?|||83 trên 85 dòng của sheet Product của G5 được xếp “Simple”. Vì sao giám khảo phê bình điều này?",
        options: ["Simple screens are forbidden in SWP391|||SWP391 cấm màn hình Simple", "It shows no real estimation: screens with 15 or more fields or many transactions are Medium or Complex, and under-rating also lowers the team's Converted-LOC|||Nó cho thấy không hề ước lượng: màn hình từ 15 trường trở lên hoặc nhiều giao dịch là Medium hay Complex, và xếp thấp còn làm giảm Converted-LOC của nhóm", "Simple screens are graded 0 LOC|||Màn hình Simple được 0 LOC", "Every admin screen must be Complex|||Mọi màn hình admin phải là Complex"],
        correctIndex: 1,
        explanation: "Complexity follows the course table (fields and transactions). The registration profile form alone has more than 15 fields; rating everything Simple (60 LOC) is neither honest nor in the team's interest.|||Độ phức tạp theo bảng của môn (số trường và số giao dịch). Riêng form hồ sơ đăng ký đã hơn 15 trường; xếp tất cả là Simple (60 LOC) vừa không trung thực vừa bất lợi cho nhóm." },
      { question: "Which sheet and column of the Project Tracking workbook record who owns a screen?|||Sheet và cột nào của workbook Project Tracking ghi ai phụ trách một màn hình?",
        options: ["Use Cases — the description column|||Use Cases — cột mô tả", "MasterData — ITERATOR|||MasterData — ITERATOR", "Product — the PIC column|||Product — cột PIC", "Product — the Quality column|||Product — cột Quality"],
        correctIndex: 2,
        explanation: "PIC (person in charge) in the Product sheet names the owner of each screen; MasterData only holds the lists (team, statuses, iterations, factors). In G5's file one member of the MasterData team list owns no row at all.|||PIC (người phụ trách) trong sheet Product ghi chủ của từng màn hình; MasterData chỉ chứa các danh sách (nhóm, trạng thái, iteration, hệ số). Trong file của G5, một thành viên có tên trong danh sách nhóm của MasterData không sở hữu dòng nào." },
      { question: "How is the Converted-LOC of one screen computed in SWP391?|||Converted-LOC của một màn hình được tính thế nào trong SWP391?",
        options: ["Number of fields times 10|||Số trường nhân 10", "Number of Java lines written|||Số dòng Java đã viết", "Quality divided by complexity|||Chất lượng chia cho độ phức tạp", "C × Q: complexity LOC (240 / 120 / 60) times quality (100% / 75% / 50%)|||C × Q: LOC theo độ phức tạp (240 / 120 / 60) nhân chất lượng (100% / 75% / 50%)"],
        correctIndex: 3,
        explanation: "G5's MasterData sheet contains exactly this table. A Medium screen of Medium quality gives 120 × 75% = 90, which is why the Register row was planned at 120 and graded 90.|||Sheet MasterData của G5 chứa đúng bảng này. Màn hình Medium chất lượng Medium được 120 × 75% = 90, vì vậy dòng Register có kế hoạch 120 mà được chấm 90." },
      { question: "G5's Login specification cites “2.0.E1” and exits to “UC-3_Reset Password”, while in G5 UC-3 is “Register account for Recruiter”. What is the lesson?|||Đặc tả Login của G5 dẫn “2.0.E1” và thoát sang “UC-3_Reset Password”, trong khi ở G5 UC-3 là “Register account for Recruiter”. Bài học là gì?",
        options: ["Use one ID scheme for every artefact and re-check every reference after reusing a specification|||Dùng một hệ mã cho mọi sản phẩm và kiểm lại mọi tham chiếu sau khi dùng lại một đặc tả", "IDs copied from the template are acceptable|||Mã chép từ template là chấp nhận được", "Exceptions do not need IDs|||Exception không cần mã", "Use-case IDs are optional in the RDS|||Mã use case trong RDS là tuỳ chọn"],
        correctIndex: 0,
        explanation: "The flow was copied from another project, whose numbering it kept. G5 ended with four numbering schemes (UC_01–UC_54, UC_01–UC_50, UC1–UC37, UC_01–UC_85) for the same screens.|||Luồng được chép từ dự án khác và giữ nguyên cách đánh số của nó. G5 kết thúc với bốn hệ đánh số (UC_01–UC_54, UC_01–UC_50, UC1–UC37, UC_01–UC_85) cho cùng các màn hình." },
      { question: "Which of these sentences from G5's RDS is a real business rule?|||Câu nào trong RDS của G5 là một business rule thật sự?",
        options: ["Data integrity must be maintained at all times|||Tính toàn vẹn dữ liệu phải luôn được duy trì", "Allow users to manage personal information easily|||Cho phép người dùng quản lý thông tin cá nhân dễ dàng", "A password has at least 8 characters with upper case, lower case and a digit|||Mật khẩu có ít nhất 8 ký tự gồm chữ hoa, chữ thường và chữ số", "The system is available and responsive|||Hệ thống luôn sẵn sàng và phản hồi nhanh"],
        correctIndex: 2,
        explanation: "BR-9 is a policy a tester can prove true or false. The other three cannot be tested as written: they are wishes or vague quality goals.|||BR-9 là chính sách mà tester chứng minh được đúng hay sai. Ba câu còn lại không kiểm được như đang viết: chúng là mong muốn hoặc mục tiêu chất lượng mơ hồ." },
      { question: "G5's Change Password spec has the precondition “The current password is correct” and the postcondition “New password matches the re-entered password”. What is wrong?|||Đặc tả Change Password của G5 có precondition “Mật khẩu hiện tại đúng” và postcondition “Mật khẩu mới khớp ô nhập lại”. Sai ở đâu?",
        options: ["Nothing, both are correct|||Không sai gì, cả hai đều đúng", "Both are input checks made during the flow, not conditions true before it starts or guaranteed after it succeeds|||Cả hai là kiểm tra đầu vào trong luồng, không phải điều đúng trước khi bắt đầu hay được bảo đảm sau khi thành công", "Postconditions must always be empty|||Postcondition luôn phải để trống", "Preconditions must name a database table|||Precondition phải nêu tên một bảng CSDL"],
        correctIndex: 1,
        explanation: "Precondition: the user is logged in. Postcondition: the new password (hashed) is stored and the user is told. The two checks belong in the normal flow and the exceptions.|||Precondition: người dùng đã đăng nhập. Postcondition: mật khẩu mới (đã băm) được lưu và người dùng được thông báo. Hai phép kiểm kia thuộc về normal flow và exception." },
      { question: "G5's screen authorization matrix ticks “Delete Recruiter” for the Recruiter role. Why does this matter beyond the document?|||Ma trận phân quyền của G5 đánh dấu “Delete Recruiter” cho vai trò Recruiter. Vì sao điều này quan trọng hơn cả chuyện tài liệu?",
        options: ["It does not matter|||Không quan trọng", "Recruiters are allowed to delete themselves|||Recruiter được phép tự xoá mình", "Only the Admin column is read by the teacher|||Giảng viên chỉ đọc cột Admin", "The matrix is what the authorization filter should enforce, so a wrong tick becomes a security hole|||Ma trận là thứ filter phân quyền phải thực thi, nên một dấu sai trở thành lỗ hổng bảo mật"],
        correctIndex: 3,
        explanation: "Build the role map of your login filter from the matrix. In G5 the matrix also gives Freelancer the right to edit a recruiter's profile.|||Hãy dựng bảng quyền của filter đăng nhập từ chính ma trận. Ở G5, ma trận còn cho Freelancer quyền sửa hồ sơ của recruiter." },
      { question: "On G5's Login block the picture shows “Username”, the field table says “Email*”, and the SQL filters “username = ? AND password = ?”. Which fix is right?|||Ở khối Login của G5, hình có ô “Username”, bảng trường ghi “Email*”, còn SQL lọc “username = ? AND password = ?”. Cách sửa nào đúng?",
        options: ["Make picture, table and SQL describe the same field, and check a password hash in Java instead of comparing plain text in SQL|||Cho hình, bảng và SQL cùng mô tả một trường, và kiểm mã băm mật khẩu trong Java thay vì so chữ thường trong SQL", "Delete the field table|||Xoá bảng trường", "Change the SQL to search by e-mail only|||Đổi SQL sang chỉ tìm theo e-mail", "Leave it: the teacher only looks at the picture|||Để nguyên: giảng viên chỉ nhìn hình"],
        correctIndex: 0,
        explanation: "The three parts of a screen block must agree. G5 stores passwords in plain text (User.password nvarchar(50)); store a BCrypt hash and verify it in code.|||Ba phần của một khối màn hình phải khớp nhau. G5 lưu mật khẩu dạng chữ thường (User.password nvarchar(50)); hãy lưu mã băm BCrypt và kiểm trong code." },
      { question: "RDS page 54 describes G5's home page with “Filled with the list of current active setting types” and SQL “SELECT … FROM setting”. What does this reveal?|||Trang 54 của RDS mô tả trang chủ của G5 bằng câu “Filled with the list of current active setting types” và SQL “SELECT … FROM setting”. Điều đó cho thấy gì?",
        options: ["A Setting table stores the home-page configuration|||Một bảng Setting lưu cấu hình trang chủ", "The home page is visible to admins only|||Trang chủ chỉ admin mới xem được", "The template's example was never replaced — there is no Setting table among G5's 22|||Ví dụ của template chưa bao giờ được thay — không có bảng Setting nào trong 22 bảng của G5", "Every home page must query a setting table|||Trang chủ nào cũng phải truy vấn bảng setting"],
        correctIndex: 2,
        explanation: "Search your RDS for the template's example words (setting, customer, product, order) before each submission; one such page makes an examiner doubt the rest.|||Trước mỗi lần nộp, hãy tìm trong RDS các từ của ví dụ template (setting, customer, product, order); chỉ một trang như vậy là giám khảo nghi ngờ phần còn lại." },
      { question: "The documented statement INSERT INTO [User] VALUES (?,?,?,?,5,1) fails against G5's final schema. Why?|||Câu lệnh trong tài liệu INSERT INTO [User] VALUES (?,?,?,?,5,1) lỗi khi chạy trên schema cuối cùng của G5. Vì sao?",
        options: ["IDENTITY columns must always be inserted|||Cột IDENTITY luôn phải được chèn giá trị", "It supplies 6 values while the table has 7 insertable columns — always write the column list|||Nó đưa 6 giá trị trong khi bảng có 7 cột được chèn — luôn viết danh sách cột", "SQL Server does not accept ? parameters|||SQL Server không chấp nhận tham số ?", "Role 5 does not exist|||Không tồn tại role 5"],
        correctIndex: 1,
        explanation: "CreateDate was added to User after the statement was documented. A positional INSERT breaks whenever a column is added; INSERT INTO [User] (username, password, …) VALUES (…) does not.|||CreateDate được thêm vào bảng User sau khi câu lệnh được ghi vào tài liệu. INSERT theo vị trí sẽ hỏng mỗi khi thêm cột; INSERT INTO [User] (username, password, …) VALUES (…) thì không." },
      { question: "G5 stores a post's skills in Post.skill as “C++, Java, .NET”. Which design fixes the problem?|||G5 lưu kỹ năng của tin trong Post.skill dạng “C++, Java, .NET”. Thiết kế nào sửa được vấn đề?",
        options: ["Widen the column to nvarchar(max)|||Mở rộng cột thành nvarchar(max)", "Store the skills as JSON in the User table|||Lưu kỹ năng dạng JSON trong bảng User", "Add STRING_SPLIT to every query|||Thêm STRING_SPLIT vào mọi câu truy vấn", "A PostSkill(postID, skill_set_ID) table with a composite primary key|||Một bảng PostSkill(postID, skill_set_ID) với khoá chính ghép"],
        correctIndex: 3,
        explanation: "A comma list breaks first normal form, cannot use an index and caps a post at a few skills (nvarchar(50)). A junction table makes matching a join and ranking a COUNT.|||Chuỗi phẩy vi phạm dạng chuẩn 1, không dùng được index và giới hạn mỗi tin chỉ vài kỹ năng (nvarchar(50)). Bảng trung gian biến việc so khớp thành một phép join và xếp hạng thành một phép COUNT." },
      { question: "G5's “Job for You” query splits Post.skill with CROSS APPLY STRING_SPLIT and keeps pieces that match the freelancer's skills, with SELECT * and no DISTINCT. A post matching three of those skills is…|||Câu truy vấn “Job for You” của G5 tách Post.skill bằng CROSS APPLY STRING_SPLIT và giữ các mảnh khớp kỹ năng của freelancer, dùng SELECT * và không DISTINCT. Một tin khớp ba kỹ năng sẽ…",
        options: ["returned three times|||bị trả về ba lần", "returned once, at the top|||được trả về một lần, ở đầu danh sách", "hidden from the result|||bị ẩn khỏi kết quả", "rejected with an error|||bị báo lỗi"],
        correctIndex: 0,
        explanation: "Each matching piece produces one row. Use DISTINCT or, better, GROUP BY postID with COUNT(*) to rank posts by the number of matching skills.|||Mỗi mảnh khớp sinh ra một dòng. Hãy dùng DISTINCT hoặc tốt hơn là GROUP BY postID kèm COUNT(*) để xếp hạng tin theo số kỹ năng khớp." },
      { question: "RDS pages 158 and 160 document Suspend and Approve project as a three-frame storyboard. What should your team copy, and what should it add?|||Trang 158 và 160 của RDS mô tả Suspend và Approve project bằng storyboard ba khung. Nhóm bạn nên học theo điều gì, và nên bổ sung gì?",
        options: ["Copy the sidebar field table; add nothing|||Học theo bảng trường của thanh bên; không cần bổ sung", "Copy nothing; add more dashboard screenshots|||Không học gì; thêm ảnh chụp dashboard", "Copy the list → confirm → result storyboard; add which column changes and a state diagram of the post's statuses|||Học theo storyboard danh sách → xác nhận → kết quả; bổ sung cột nào thay đổi và state diagram cho các trạng thái của tin", "Copy the storyboard; add one block per button|||Học theo storyboard; thêm mỗi nút một khối"],
        correctIndex: 2,
        explanation: "The storyboard shows a whole interaction at a glance. What is missing is the data side: Post has both status and checking, and the list shows both “Approve” and “Approved”.|||Storyboard cho thấy trọn một tương tác trong một cái nhìn. Còn thiếu là phía dữ liệu: Post có cả status lẫn checking, và danh sách hiện cả “Approve” lẫn “Approved”." },
      { question: "G5's RDS holds 17 use-case specifications and code designs for 5 functions, yet the Product sheet marks all 85 rows “Completed” for SRS and SDS. What does the examiner conclude?|||RDS của G5 có 17 đặc tả use case và thiết kế code cho 5 chức năng, nhưng sheet Product ghi cả 85 dòng “Completed” ở SRS và SDS. Giám khảo kết luận gì?",
        options: ["The RDS must be missing pages|||RDS hẳn là bị thiếu trang", "The status columns are not credible — “Completed” must mean the artefact exists|||Các cột trạng thái không đáng tin — “Completed” phải có nghĩa là sản phẩm có thật", "SRS and SDS are only graded in iteration 3|||SRS và SDS chỉ được chấm ở iteration 3", "The teacher filled the status columns|||Giảng viên đã điền các cột trạng thái"],
        correctIndex: 1,
        explanation: "Teachers sample rows and look for the matching specification, design and code. One false “Completed” costs trust in every other row.|||Giảng viên lấy mẫu vài dòng rồi tìm đặc tả, thiết kế và code tương ứng. Một chữ “Completed” sai là mất niềm tin vào mọi dòng khác." },
      { question: "Which slide gives the best evidence for the “team working” criterion (20%) of the final presentation?|||Slide nào là bằng chứng tốt nhất cho tiêu chí “làm việc nhóm” (20%) của buổi bảo vệ?",
        options: ["Logos of Google Meet, Zalo and Slack|||Logo Google Meet, Zalo và Slack", "A clip-art “Demo” picture|||Một ảnh minh hoạ “Demo”", "The table of contents|||Mục lục", "A screenshot of the issue board and a chart of screens done per member per iteration|||Ảnh chụp issue board và biểu đồ số màn hình xong theo từng người từng iteration"],
        correctIndex: 3,
        explanation: "G5's slides 5–6 list tools and meeting habits but prove nothing. The jury wants to see who built what and how the work was tracked.|||Slide 5–6 của G5 liệt kê công cụ và thói quen họp nhưng không chứng minh được gì. Hội đồng muốn thấy ai làm gì và công việc được theo dõi ra sao." },
      { question: "A screenshot in your RDS shows a test account with a real person's name, e-mail and phone. What should you do before submitting or sharing it?|||Một ảnh chụp trong RDS của bạn hiện tài khoản test mang tên, e-mail và số điện thoại của người thật. Bạn nên làm gì trước khi nộp hoặc chia sẻ?",
        options: ["Re-take it with invented demo data|||Chụp lại bằng dữ liệu demo bịa ra", "Blur only the photo|||Chỉ làm mờ ảnh đại diện", "Keep it — the RDS is an internal document|||Giữ nguyên — RDS là tài liệu nội bộ", "Move the page to the appendix|||Chuyển trang đó vào phụ lục"],
        correctIndex: 0,
        explanation: "Many of G5's screenshots show members' names, e-mails and phones, so those pages cannot be published. Seed a demo database (“Freelancer Demo 01”, demo01@example.com) before taking screenshots.|||Nhiều ảnh chụp của G5 hiện tên, e-mail và số điện thoại của thành viên, nên các trang đó không thể công bố. Hãy nạp CSDL demo (“Freelancer Demo 01”, demo01@example.com) trước khi chụp màn hình." },
      { question: "G5's admin chapter uses 74 pages for 39 blocks, most of them repeating the sidebar table. Which statement is right?|||Chương admin của G5 dùng 74 trang cho 39 khối, phần lớn lặp lại bảng thanh bên. Nhận định nào đúng?",
        options: ["More pages give a higher design grade|||Nhiều trang hơn thì điểm thiết kế cao hơn", "Admin screens do not need field tables|||Màn hình admin không cần bảng trường", "Page count is not graded — one block per screen with a row-action table and a state diagram communicates more than one block per button|||Số trang không được chấm — mỗi màn hình một khối kèm bảng thao tác trên dòng và state diagram truyền đạt nhiều hơn mỗi nút một khối", "Every button must have its own block|||Nút nào cũng phải có khối riêng"],
        correctIndex: 2,
        explanation: "The RDS is graded on correctness and consistency. G5's Categories screen alone took seven blocks and about 16 pages; one block of two pages says the same.|||RDS được chấm theo tính đúng và tính nhất quán. Riêng màn hình Categories của G5 đã tốn bảy khối và khoảng 16 trang; một khối hai trang nói được đúng những điều đó." },
    ],
  },
};

export default {
  title: 'Sample project — a real SWP391 team (G5, Job IT for Freelancer), page by page|||Dự án mẫu — một nhóm SWP391 thật (G5, Job IT for Freelancer), từng trang một',
  description: 'Mổ xẻ trọn bộ hồ sơ của một nhóm SWP391 thật (G5, Job IT for Freelancer): slide bảo vệ, tài liệu RDS 213 trang, workbook Project Tracking và script CSDL — điểm làm tốt, lỗi giám khảo bắt, và cách nhóm bạn làm tốt hơn.',
  lessons: [L1, L2, L3, L4, L5, L6, L7, L8],
};
