/**
 * 0.1 — Bắt đầu tại đây (1/2): Khoá này là gì và vì sao một người đóng 5 vai (dm5-0-1-bat-dau-1).
 * Đủ 6 ý mở đầu (feedback_mo_dau_khoa_6_y): là gì + lịch sử có nguồn · khác khoá lân cận · nền cần trước ·
 * học xong làm được gì · ví dụ/sự cố thật có nguồn · bản đồ học kèm.
 * Nguồn đã kiểm: Fred Brooks "The Mythical Man-Month" (1975, Chief Programmer Team — Harlan Mills IBM 1971),
 * Jason Schreier "Blood, Sweat, and Pixels" (2017 — Stardew Valley / Eric Barone), NASA Mars Climate Orbiter
 * Mishap Investigation Board Report (1999), SEC Press Release 2013-222 (Knight Capital 2012),
 * DOJ OIG / IEEE Spectrum (FBI Virtual Case File 2005), Scrum Guide 2020.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L01 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Lesson 0.1', 'Mục 0 · Bài 0.1', `
<h2>${t('0.1 — Start here (1/2): What this course is and why one person plays 5 roles', '0.1 — Bắt đầu tại đây (1/2): Khoá này là gì và vì sao một người đóng 5 vai')}</h2>
<p class="lead">${t(
    'Imagine opening a small coffee shop completely alone. If you only focus on brewing coffee and never write down recipes, never track cash flow, never taste-test before serving, and never write down opening hours, the shop will collapse in two weeks — even if you brew great espresso. Building a software graduation project alone is no different. This course teaches you how to run a real software project — LabFlow AI — as a disciplined 5-role company from day zero, even when all five seats are occupied by one person.',
    'Hãy tưởng tượng bạn tự mở một quán cà phê nhỏ một mình. Nếu bạn chỉ chăm chăm pha cà phê mà không ghi công thức, không ghi sổ thu chi, không nếm thử trước khi đưa khách, không chốt giờ mở cửa, quán sẽ sập sau hai tuần — kể cả khi bạn pha espresso rất ngon. Làm đồ án phần mềm một mình cũng hệt như vậy. Khoá học này dạy bạn vận hành một dự án phần mềm thật — LabFlow AI — như một công ty năm vai bài bản từ con số 0, ngay cả khi cả năm chiếc ghế đều do một mình bạn ngồi.')}</p>

<h3>${t('Everyday picture: the one-person coffee shop with five notebooks', 'Liên tưởng đời thường: quán cà phê một người nhưng có năm cuốn sổ')}</h3>
<p>${t(
    'When one owner runs a small coffee shop professionally, they do not dump everything into one messy notebook. They keep five separate responsibilities in mind: the <strong>shop manager</strong> sets opening hours, budgets, and weekly targets; the <strong>menu designer</strong> writes exact recipes so every cup tastes the same; the <strong>kitchen/barista back-end</strong> prepares ingredients and tracks stock; the <strong>front counter</strong> designs how customers order cleanly without confusion; and the <strong>quality taster</strong> checks every new drink before it reaches the menu. If the barista says "I think the syrup is enough" without the taster checking, quality drifts silently. In software engineering, those five hats are',
    'Khi một chủ quán tự vận hành quán cà phê nhỏ một cách chuyên nghiệp, họ không gom mọi thứ vào một cuốn sổ nháp rối tinh. Họ tách rõ năm trách nhiệm trong đầu: <strong>quản lý quán</strong> chốt giờ mở cửa, ngân sách và mục tiêu tuần; <strong>người thiết kế thực đơn</strong> viết công thức định lượng để ly nào cũng đều vị; <strong>bếp pha chế phía sau</strong> chuẩn bị nguyên liệu và kiểm kho; <strong>quầy đón khách phía trước</strong> thiết kế cách gọi món gọn gàng, không gây hiểu nhầm; và <strong>người kiểm chất lượng</strong> nếm thử mọi món mới trước khi đưa lên bảng. Nếu người pha chế tự nhủ "chắc đủ đường rồi" mà không có người kiểm lại, chất lượng sẽ trượt đi trong im lặng. Trong kỹ nghệ phần mềm, năm chiếc mũ đó chính là')}
${mu('C1', en)} ${mu('C2', en)} ${mu('C3', en)} ${mu('C4', en)} ${mu('C5', en)}.</p>

<h3>${t('1. What this course is — and the real history behind "one person, multiple roles"', '1. Khoá này là gì — và lịch sử có thật của mô hình "một người đóng nhiều vai"')}</h3>
<p>${t(
    'This course is an <strong>end-to-end project operations playbook</strong> built specifically for students preparing for SWP391 (Software Development Project), SEP490 (Capstone Project), and OJT internships at software companies such as FPT Software. Instead of only teaching how to write Spring Boot controllers or React components, it teaches the <strong>orchestration thread</strong> that turns code into an 8–9/10 defended product: planning, scope control, requirements (SRS), architecture and design (SDS), vertical-slice development, testing (Unit / Integration / System / UAT), weekly enterprise reporting, change control, release packaging, and thesis defense.',
    'Khoá này là <strong>cẩm nang vận hành dự án trọn vòng</strong> viết riêng cho sinh viên chuẩn bị làm SWP391 (Đồ án phát triển phần mềm), SEP490 (Đồ án tốt nghiệp) và kỳ thực tập OJT tại các công ty phần mềm như FPT Software. Thay vì chỉ dạy gõ controller Spring Boot hay component React, khoá dạy <strong>sợi chỉ điều phối</strong> biến mã nguồn thành một sản phẩm bảo vệ 8–9 điểm: lập kế hoạch, kiểm soát phạm vi, phân tích yêu cầu (SRS), thiết kế kiến trúc và chi tiết (SDS), lập trình theo lát cắt dọc, kiểm thử (Unit / Integration / System / UAT), báo cáo tuần chuẩn doanh nghiệp, quản lý thay đổi, đóng gói phát hành và bảo vệ hội đồng.')}</p>
<p>${t(
    'Keeping clear boundaries between design, coding, documentation, and verification has deep roots in software engineering history — and explains why a solo builder still separates these hats:',
    'Việc giữ ranh giới rõ ràng giữa thiết kế, lập trình, tài liệu và kiểm chứng có gốc rễ sâu trong lịch sử ngành phần mềm — và đó cũng là lý do khi một người làm tất cả, bạn vẫn cần tách rạch ròi các chiếc mũ:')}</p>

${bang(
  [t('Milestone & source', 'Mốc lịch sử & nguồn'), t('What actually happened', 'Chuyện gì đã thật sự xảy ra'), t('Lesson for your solo 5-role project', 'Bài học cho đồ án 1 mình 5 vai')],
  [
    [
      t('<strong>1971 / 1975</strong> — Harlan Mills (IBM) &amp; Fred Brooks, <em>The Mythical Man-Month</em>', '<strong>1971 / 1975</strong> — Harlan Mills (IBM) &amp; Fred Brooks, <em>The Mythical Man-Month</em>'),
      t('In the New York Times Information Bank project, IBM used a small specialised <em>Chief Programmer Team</em> so one core architectural mind preserved <strong>conceptual integrity</strong> (one coherent design vision) while separate team members handled documentation, tooling, and verification.', 'Trong dự án New York Times Information Bank, IBM dùng mô hình nhóm chuyên môn hoá nhỏ <em>Chief Programmer Team</em> để một đầu mối kiến trúc giữ <strong>sự nhất quán về ý tưởng thiết kế (conceptual integrity)</strong>, đồng thời tách rõ phần tài liệu, công cụ và kiểm chứng cho các vị trí riêng.'),
      t('Even in a real team, separating design, documentation, and verification is what protects quality — that is why, when one person does everything, you still keep strict role boundaries instead of mixing all tasks together.', 'Ngay cả trong đội nhiều người, tách rạch ròi thiết kế, tài liệu và kiểm chứng mới bảo vệ được chất lượng — đó là lý do khi một người làm tất cả, bạn vẫn phải giữ ranh giới vai nghiêm ngặt thay vì làm lẫn lộn.')
    ],
    [
      t('<strong>1999</strong> — NASA <em>Mars Climate Orbiter</em> Mishap Investigation Board Report', '<strong>1999</strong> — Báo cáo Uỷ ban Điều tra sự cố <em>Mars Climate Orbiter</em> (NASA)'),
      t('A $125 million spacecraft burned up in the Martian atmosphere because one software piece output thrust in pound-force seconds (Imperial) while the navigation software expected newton-seconds (metric). Interface specifications and end-to-end verification failed to catch the mismatch.', 'Tàu vũ trụ trị giá 125 triệu USD cháy rụi trên khí quyển sao Hoả vì một phần mềm xuất lực đẩy theo đơn vị hệ Anh (lbf·s) trong khi phần mềm dẫn đường kỳ vọng hệ mét (N·s). Đặc tả giao diện và kiểm thử đầu-cuối đã không bắt được độ lệch này.'),
      t('Even one developer can mismatch their own backend API and frontend screen if they skip writing an explicit contract (BA/Design hat) and running independent checks (QA hat).', 'Ngay cả một người tự code cả backend lẫn frontend vẫn dễ tự làm lệch hợp đồng API của chính mình nếu bỏ qua bước chốt đặc tả (mũ BA/Thiết kế) và kiểm chứng độc lập (mũ QA).')
    ],
    [
      t('<strong>2012–2016</strong> — Eric Barone (ConcernedApe), <em>Stardew Valley</em> (Jason Schreier, <em>Blood, Sweat, and Pixels</em>, 2017, chapter "Stardew Valley")', '<strong>2012–2016</strong> — Eric Barone (ConcernedApe), <em>Stardew Valley</em> (Jason Schreier, <em>Blood, Sweat, and Pixels</em>, 2017, chương "Stardew Valley")'),
      t('One developer built an entire commercial game alone over ~4.5 years — handling programming, design, pixel art, writing, and music — working gruelling hours and openly describing severe burnout and self-doubt before shipping in 2016.', 'Một lập trình viên tự xây cả trò chơi thương mại trong khoảng 4,5 năm — tự làm từ lập trình, thiết kế, vẽ pixel, viết kịch bản tới soạn nhạc — làm việc cường độ cực cao và công khai kể lại tình trạng kiệt sức, nghi ngờ bản thân nặng nề trước khi phát hành năm 2016.'),
      t('One person <em>can</em> ship a complete multi-discipline product — which is why this course adds a PM hat with realistic capacity planning, WIP limits, and a 6+1 weekly rhythm to protect you from burnout.', 'Một người <em>hoàn toàn có thể</em> hoàn thiện sản phẩm đa vai trò — nhưng cũng chính vì nguy cơ kiệt sức có thật, khoá này đặt ra mũ PM với bảng tính giờ thật, giới hạn WIP và nhịp 6+1 để giữ sức.')
    ],
    [
      t('<strong>2012 / 2013</strong> — Knight Capital (SEC Press Release 2013-222) &amp; HealthCare.gov (GAO-14-694)', '<strong>2012 / 2013</strong> — Knight Capital (Thông cáo SEC 2013-222) &amp; HealthCare.gov (Báo cáo GAO-14-694)'),
      t('Knight Capital lost over $460 million in 45 minutes when a manual deploy missed 1 of 8 servers with no verification checklist. HealthCare.gov crashed on launch day because separate pieces were never integrated and load-verified under one owner.', 'Knight Capital mất hơn 460 triệu USD trong 45 phút khi triển khai tay sót 1 trên 8 máy chủ mà không có checklist kiểm lại. HealthCare.gov sập ngày ra mắt vì các mảnh tách rời không có ai chịu trách nhiệm tích hợp và kiểm tải tổng thể.'),
      t('Code that "runs on my laptop" is not a delivered system. You need checklists, CI, repeatable Docker deployment, and end-to-end QA before defense day.', 'Code "chạy trên máy mình" chưa phải hệ thống bàn giao. Bạn cần checklist, CI, triển khai Docker lặp lại được và kiểm thử đầu-cuối trước ngày bảo vệ.')
    ],
    [
      t('<strong>2020</strong> — Ken Schwaber &amp; Jeff Sutherland, <em>The Scrum Guide 2020</em>', '<strong>2020</strong> — Ken Schwaber &amp; Jeff Sutherland, <em>Scrum Guide 2020</em>'),
      t('Clarified that a Scrum Team is structured around <em>accountabilities</em> (Product Owner, Scrum Master, Developers) rather than rigid job titles, and commits every increment to a clear Definition of Done.', 'Làm rõ một Scrum Team được tổ chức quanh các <em>trách nhiệm</em> (Product Owner, Scrum Master, Developers) thay vì chức danh cứng, và gắn mọi phần tăng trưởng sản phẩm với một Definition of Done rõ ràng.'),
      t('<em>(Course adaptation — not from the Scrum Guide itself):</em> Inspired by separating accountabilities from job titles, this course lets one disciplined student time-box and rotate the 5 hats — as long as each hat has its own artifact, checklist, and transparent audit trail.', '<em>(Suy luận của khoá — không phải quy định trong Scrum Guide):</em> Mượn ý tưởng tách trách nhiệm khỏi chức danh, khoá cho phép một sinh viên kỷ luật phân khung thời gian và luân phiên 5 chiếc mũ — miễn là mỗi mũ có sản phẩm đầu ra, checklist và dấu vết minh bạch riêng.')
    ]
  ]
)}

<h3>${t('2. How this course differs from neighbouring courses (zero overlap)', '2. Khoá này khác các khoá lân cận thế nào (không học trùng)')}</h3>
<p>${t(
    'You already have strong technical and subject courses on cuongthai.com. This course does <strong>not</strong> repeat them; it acts as the <strong>conductor\'s score</strong> that tells you <em>which</em> role uses <em>which</em> skill, <em>when</em> in the 10–20 week timeline, and <em>what</em> deliverable proves it is done.',
    'Trên cuongthai.com đã có sẵn các khoá chuyên môn và môn học rất sâu. Khoá này <strong>không</strong> dạy lại nội dung của chúng; nó đóng vai <strong>bản tổng phổ của nhạc trưởng</strong>, chỉ rõ vai <em>nào</em> dùng kiến thức <em>nào</em>, vào tuần <em>nào</em> trong lộ trình 10–20 tuần, và nộp tạo tác <em>nào</em> để chứng minh đã xong.')}</p>

${bang(
  [t('Course / Resource', 'Khoá / Tài nguyên'), t('What it teaches best', 'Nó dạy sâu phần nào'), t('What THIS course adds instead of repeating', 'Khoá NÀY bổ sung gì thay vì lặp lại')],
  [
    [
      ac('software-development-project', 'swp391-gioi-thieu', 'Academy SWP391'),
      t('Subject syllabus, 3 iterations, LOC calculation formula, school templates, sample G5, defense rubric for a 5-student team.', 'Đề cương môn, 3 iteration, công thức tính LOC, mẫu của trường, bài mẫu G5, rubric bảo vệ cho nhóm 5 sinh viên.'),
      t('Adds the <strong>solo 5-hat operating model</strong>: how one person fills all 5 roles cleanly without cheating, runs CT Work LF #2 daily, and bridges SWP391 straight into SEP490.', 'Bổ sung <strong>mô hình vận hành một mình 5 vai</strong>: cách một người đóng trọn 5 vai minh bạch không gian lận, chạy CT Work LF #2 mỗi ngày và nối thẳng SWP391 sang SEP490.')
    ],
    [
      cs('agile-teamwork', 'agl-0-8-bat-dau-tai-day', t('Agile Teamwork', 'Làm việc nhóm phần mềm')),
      t('Scrum, Kanban, WIP limits, writing tickets, PRs, code review, outsourcing (BD/DD, man-day, hourensou), information security.', 'Scrum, Kanban, giới hạn WIP, viết ticket, PR, code review, quy trình outsourcing (BD/DD, man-day, hourensou), an ninh thông tin.'),
      t('Applies those rules directly onto <strong>LabFlow AI</strong> and teaches the solo counter-measures (self-review with cooling-off period, AI devil\'s advocate, solo meetings).', 'Áp thẳng các luật đó lên <strong>LabFlow AI</strong> và dạy kỹ thuật riêng khi làm một mình (tự review sau khoảng nghỉ, AI phản biện, họp với chính mình).')
    ],
    [
      cs('fullstack-project', 'fp-0-8-bat-dau-tai-day', t('Full-Stack Project', 'Xây dựng dự án Full-Stack')),
      t('Step-by-step coding of a full-stack web app (Node/Express/React) from schema to VPS deployment.', 'Code từng bước một ứng dụng web full-stack (Node/Express/React) từ lược đồ tới deploy VPS.'),
      t('Focuses on <strong>project governance, documentation (Report 1–7, Weekly, RTM), quality gates, and defense</strong> — and respects the 100% hand-coded rule (no ready-made LabFlow code to copy).', 'Tập trung vào <strong>quản trị dự án, bộ hồ sơ (Report 1–7, Weekly, RTM), cổng chất lượng và bảo vệ</strong> — đồng thời giữ nghiêm luật tự code tay 100% (không bày sẵn code LabFlow để chép).')
    ],
    [
      lf('/projects/labflow-ai'),
      t('The living blueprint of LabFlow AI: problem, architecture, ERD, anti-double-booking design, 4 state machines, 46 screens, 14 BRs, 20-week roadmap.', 'Bản vẽ sống của LabFlow AI: bài toán, kiến trúc, ERD, chống đặt trùng, 4 máy trạng thái, 46 màn hình, 14 BR, lộ trình 20 tuần.'),
      t('Does <strong>not</strong> copy that blueprint; teaches <strong>how each role C1–C5 produces, reviews, tests, and defends</strong> every piece of it.', '<strong>Không</strong> chép lại bản vẽ đó; dạy <strong>cách từng vai C1–C5 tạo ra, review, kiểm thử và bảo vệ</strong> từng mảnh trong bản vẽ.')
    ]
  ]
)}

<h3>${t('3. Prerequisites — what you need before starting (and what you do NOT need)', '3. Kiến thức nền cần trước (và thứ bạn CHƯA cần giỏi ngay)')}</h3>
<p>${t(
    'On the <strong>process side</strong>, this course starts from absolute zero: every word (charter, WBS, RAID, RTM, SRS, SDS, UAT, leakage, DoD) is explained with everyday examples before you use it. On the <strong>technical side</strong>, you do not need to be a senior engineer on day one, because you will learn Spring Boot and React alongside the iterations — but you should have basic footing in four areas:',
    'Về mặt <strong>quy trình</strong>, khoá này dạy từ con số 0 tuyệt đối: mọi khái niệm (charter, WBS, RAID, RTM, SRS, SDS, UAT, leakage, DoD) đều được giải thích bằng ví dụ đời thường trước khi dùng. Về mặt <strong>kỹ thuật</strong>, bạn không cần giỏi như senior từ ngày đầu vì sẽ vừa học vừa làm theo từng iteration — nhưng cần nền cơ bản ở bốn mảng sau:')}</p>
<ul>
<li>${t('<strong>Git basics</strong> (clone, branch, commit, push, PR): if shaky, finish ', '<strong>Git cơ bản</strong> (clone, nhánh, commit, push, PR): nếu chưa chắc, học nhanh ')}${cs('git', 'git-0-5-bat-dau-tai-day', t('Git &amp; GitHub — Start here', 'Git &amp; GitHub — Bắt đầu tại đây'))} ${t('in two evenings.', 'trong hai buổi tối.')}</li>
<li>${t('<strong>Backend &amp; SQL foundations</strong> (what a REST API, table, primary/foreign key, and transaction are): pair with ', '<strong>Nền backend &amp; SQL</strong> (biết REST API, bảng, khoá chính/ngoại, transaction là gì): học kèm ')}${cs('spring-boot', 'sb-0-8-bat-dau-tai-day', 'Spring Boot')} ${t('and ', 'và ')}${ac('introduction-to-databases', 'dbi202-bat-dau-tai-day', 'DBI202')}.</li>
<li>${t('<strong>Frontend basics</strong> (components, forms, calling an API): pair with ', '<strong>Nền frontend</strong> (component, form, gọi API): học kèm ')}${cs('react', 'rx-0-8-bat-dau-tai-day', 'React')} ${t('or ', 'hoặc ')}${ac('front-end-web-development-with-react', 'fer202-0-1-gioi-thieu', 'FER202')}.</li>
<li>${t('<strong>CT Work basics</strong> (opening a board and a card): 15-minute walkthrough in ', '<strong>CT Work cơ bản</strong> (mở bảng và mở thẻ): xem 15 phút ở ')}${cs('huong-dan-ct-work', 'ctw-01-bat-dau', t('CT Work Tutorial — Getting started', 'Hướng dẫn CT Work — Bắt đầu'))}.</li>
</ul>

<h3>${t('4. What you will be able to do after finishing this course', '4. Học xong khoá này bạn làm được gì cụ thể?')}</h3>
<p>${t(
    'This is not a "watch and nod" theory course. By Chapter 12, you will hold tangible proof across both university grades and real job readiness:',
    'Đây không phải khoá lý thuyết "xem rồi gật đầu". Tới Chương 12, trên tay bạn có những bằng chứng cụ thể cho cả điểm đại học lẫn hồ sơ đi làm:')}</p>
<ol>
<li>${t('<strong>Ship LabFlow AI v1 (SWP391)</strong> — a working modular-monolith system (Spring Boot 3 + React/TypeScript + PostgreSQL + Flyway + Docker Compose) with proven concurrency protection against double-booking, role-based access control, and repeatable tests.', '<strong>Hoàn thiện LabFlow AI v1 (SWP391)</strong> — hệ thống modular monolith chạy thật (Spring Boot 3 + React/TypeScript + PostgreSQL + Flyway + Docker Compose) có kiểm chứng chống đặt trùng lịch, phân quyền chặt ở backend và bộ test chạy lại được.')}</li>
<li>${t('<strong>Assemble an enterprise-grade documentation set</strong> — official SWP391 submissions (Project Tracking PT26, Template1 SRS, Template2 SDS, Template3 System Test, Template5 AI Usage, Template6 Weekly Report, FRD22 Final Release, Template7 Slides) plus practice on the full SEP490 Report 1–7 &amp; RTM framework (completed formally through Report 7 in SEP490 Week 20).', '<strong>Hoàn chỉnh bộ hồ sơ chuẩn doanh nghiệp</strong> — đầy đủ bản nộp thật của SWP391 (Project Tracking PT26, Template1 SRS, Template2 SDS, Template3 System Test, Template5 AI Usage, Template6 Weekly Report, FRD22 Final Release, Slide Template7) kết hợp luyện theo khung trọn bộ Report 1–7 &amp; RTM của SEP490 (hoàn thiện chính thức tới Report 7 ở Tuần 20 SEP490).')}</li>
<li>${t('<strong>Defend at 8–9/10 from all five angles</strong> — answer council questions fluently whether the examiner asks like a PM (schedule/risk), a BA (use case/business rule), a Backend Lead (DB constraint/state machine), a Frontend Dev (form validation/error path), or a QA Lead (test levels/leakage).', '<strong>Bảo vệ 8–9 điểm từ đủ năm góc nhìn</strong> — trả lời trôi chảy dù hội đồng hỏi như PM (tiến độ/rủi ro), BA (use case/business rule), Dev BE (ràng buộc DB/máy trạng thái), Dev FE (validate/luồng lỗi) hay QA Lead (các cấp test/leakage).')}</li>
<li>${t('<strong>Transition effortlessly into a real 5-person team (SEP490 &amp; OJT)</strong> — when you join a real team at university or FPT Software, you already know every document, ceremony, handoff, and red flag because you personally operated all five seats.', '<strong>Bước thẳng vào đội thật 5 người (SEP490 &amp; OJT)</strong> — khi vào nhóm thật ở trường hay FPT Software, bạn đã quen mọi biểu mẫu, nghi thức, điểm bàn giao và dấu hiệu rủi ro vì chính tay bạn từng vận hành đủ cả năm chiếc ghế.')}</li>
</ol>

<h3>${t('5. The 5-hat architecture of this course (one loop you repeat every iteration)', '5. Sơ đồ 5 chiếc mũ của khoá (một vòng lặp bạn chạy qua mỗi iteration)')}</h3>
<p>${t(
    'Every feature (Req) of LabFlow travels through five distinct hats before it can touch the <code>Done</code> column. Look at how responsibility passes cleanly instead of collapsing into a blur:',
    'Mỗi chức năng (Req) của LabFlow đều đi qua năm chiếc mũ rạch ròi trước khi được phép chạm cột <code>Done</code>. Hãy nhìn cách trách nhiệm truyền tay nhau thay vì trộn lẫn thành một mớ bòng bong:')}</p>
<pre><code>  +-------------------------------------------------------------------+
  |  [C1 Leader/PM]  Plan sprint, set scope/RAID, enforce DoD &amp; tag   |
  +---------------------------------+---------------------------------+
                                    | picks Req into Iteration
                                    v
  +-------------------------------------------------------------------+
  |  [C2 BA]         Write UC, Business Rules, Wireframe, AC (SRS)    |
  +---------------------------------+---------------------------------+
                                    | Dev &amp; QA cross-check spec
                                    v
  +---------------------------------+---------------------------------+
  |  [C3 Dev BE]     DB Flyway, API contract, service, unit/int test  |
  |  [C4 Dev FE]     Shared layout, form validation, API integration  |
  |   (In SWP391 LOC grading: vertical slice per screen per seat!)    |
  +---------------------------------+---------------------------------+
                                    | PR + CI green + cooling-off review
                                    v
  +-------------------------------------------------------------------+
  |  [C5 QA/Tester]  Run test cases (happy + 3 unhappy), log Defects  |
  +---------------------------------+---------------------------------+
                                    | 0 P0/P1 bugs + Evidence attached
                                    v
  +-------------------------------------------------------------------+
  |  [C1 Leader/PM]  Verify DoD, move to Done, update Tracking/Weekly |
  +-------------------------------------------------------------------+</code></pre>
${note(t(
    '<strong>Crucial distinction for SWP391:</strong> Notice the two ways we use C1–C5 in LabFlow. By <em>professional discipline</em> (how companies work), the 5 hats represent PM, BA, Dev BE, Dev FE, and QA. By <em>SWP391 LOC grading</em> (each seat owns vertical screens end-to-end), C1–C5 also divide the 46 screens into 5 vertical domains. For example, screen <code>S22</code> (Create reservation wizard) belongs to <strong>C1\'s vertical domain</strong> for LOC tracking, yet when building <code>S22</code> you still rotate through the 5 process hats sequentially (C2 writes spec → C3/C4 code BE &amp; FE → C5 tests unhappy cases → C1 merges and signs off DoD). Lessons 0.3 and 1.3 unpack this further.',
    '<strong>Điểm phân biệt sống còn cho SWP391:</strong> Hãy để ý hai lớp nghĩa của C1–C5 trong LabFlow. Theo <em>kỷ luật nghề nghiệp doanh nghiệp</em>, năm chiếc mũ đại diện cho PM, BA, Dev BE, Dev FE và QA. Theo <em>luật chấm LOC của SWP391</em> (mỗi vị trí sở hữu trọn màn hình theo chiều dọc), C1–C5 cũng chia 46 màn hình thành 5 miền dọc. Ví dụ, màn <code>S22</code> (Create reservation wizard) thuộc <strong>miền dọc của C1</strong> khi tính LOC, nhưng khi làm <code>S22</code> một mình bạn vẫn đội lần lượt 5 mũ quy trình (C2 viết spec → C3/C4 code BE &amp; FE → C5 test unhappy case → C1 merge và chốt DoD). Bài 0.3 và Bài 1.3 sẽ mổ xẻ kỹ hơn.'))}

<h3>${t('6. Course roadmap (13 sections) &amp; companion courses map', '6. Bản đồ 13 phần của khoá &amp; bản đồ học kèm trên cuongthai.com')}</h3>
${bang(
  [t('Chapters', 'Chương'), t('Main hats active', 'Chiếc mũ chính'), t('Core deliverable on LabFlow', 'Sản phẩm tạo ra trên LabFlow')],
  [
    [t('Section 0 — Start here', 'Mục 0 — Bắt đầu tại đây'), `${mu('C1', en)}`, t('Workspace LF #2, one account + role mode C1–C5, GitHub repo, study schedule', 'Không gian LF #2, một tài khoản + chế độ đóng vai C1–C5, repo GitHub, lịch học')],
    [t('Ch 1 — Five hats &amp; rules', 'Ch 1 — Năm chiếc mũ &amp; luật đổi mũ'), `${mu('C1', en)} ${mu('C2', en)} ${mu('C3', en)} ${mu('C4', en)} ${mu('C5', en)}`, t('RACI matrix, hat-switching checklist, weekly time-box', 'Bảng RACI, checklist đổi mũ, lịch khung giờ tuần')],
    [t('Ch 2–3 — Plan &amp; company rhythm', 'Ch 2–3 — Lập kế hoạch &amp; nhịp doanh nghiệp'), `${mu('C1', en)}`, t('Project Charter, WBS, RAID, PT26/Template6 (plus SEP490 Report 1–2 practice), CR process', 'Điều lệ dự án, WBS, RAID, PT26/Template6 (luyện thêm khung Report 1–2 SEP490), quy trình CR')],
    [t('Ch 4 — Requirements', 'Ch 4 — Yêu cầu phần mềm'), `${mu('C2', en)}`, t('Q&amp;A list, UC specs, BR-01..14, wireframes, SRS (Template1 / Report 3 frame) + RTM', 'Q&amp;A list, đặc tả UC, BR-01..14, wireframe, SRS (Template1 / khung Report 3) + RTM')],
    [t('Ch 5–6 — Design &amp; code pipeline', 'Ch 5–6 — Thiết kế &amp; quy trình code'), `${mu('C3', en)} ${mu('C4', en)}`, t('ADR, ERD/Flyway, OpenAPI, SDS (Template2 / Report 4 frame), Git flow, Docker, CI', 'ADR, ERD/Flyway, OpenAPI, SDS (Template2 / khung Report 4), Git flow, Docker, CI')],
    [t('Ch 7–8 — Iteration 1 &amp; 2', 'Ch 7–8 — Iteration 1 &amp; 2'), `${mu('C1', en)} ${mu('C2', en)} ${mu('C3', en)} ${mu('C4', en)} ${mu('C5', en)}`, t('Full Req lifecycle, demo scripts, burndown, CR handling, tech debt', 'Vòng đời trọn 1 Req, kịch bản demo, burndown, xử lý CR, nợ kỹ thuật')],
    [t('Ch 9–10 — QA &amp; release', 'Ch 9–10 — Kiểm thử &amp; phát hành'), `${mu('C5', en)} ${mu('C1', en)}`, t('Template3 / Report 5.0–5.3, defect lifecycle, UAT portal, OWASP check, FRD22 (SWP391) &amp; Report 6 (SEP490), Release', 'Template3 / khung Report 5.0–5.3, vòng đời lỗi, cổng UAT, soát OWASP, FRD22 (SWP391) &amp; Report 6 (SEP490), Release')],
    [t('Ch 11–12 — Defense &amp; next step', 'Ch 11–12 — Bảo vệ 8–9 điểm &amp; sau đồ án'), `${mu('C1', en)}`, t('Template7 slides &amp; 5-role defense rehearsal (SWP391), Report 7 + final RTM (SEP490 W20), CV/OJT handover', 'Slide Template7 &amp; tổng duyệt hỏi đáp 5 vai (SWP391), Report 7 + RTM cuối (SEP490 W20), bàn giao CV/OJT')]
  ]
)}

${bang(
  [t('When you reach…', 'Khi bạn học tới…'), t('Open alongside', 'Mở học kèm'), t('Why', 'Để làm gì')],
  [
    [t('Section 0 &amp; Ch 6 (Git/Repo)', 'Mục 0 &amp; Ch 6 (Git/Repo)'), `${cs('git', 'git-kd-10-noi-ct-work', 'Git KĐ.10')} · ${cs('huong-dan-ct-work', 'ctw-05-moi-nhom-phan-quyen', 'CT Work 05')}`, t('Connect GitHub webhook to CT Work and configure member permissions.', 'Nối webhook GitHub vào CT Work và cấu hình quyền thành viên.')],
    [t('Ch 2–3 (Planning &amp; Agile)', 'Ch 2–3 (Kế hoạch &amp; Agile)'), `${cs('agile-teamwork', 'agl-1-4-chon', 'Agile Teamwork 1.4')} · ${ac('software-development-project', 'swp391-p-1-ban-do-ca-ky', 'SWP391 P.1')}`, t('Compare Scrum/Kanban rhythms and SWP391 grading milestones.', 'So sánh nhịp Scrum/Kanban và mốc chấm điểm SWP391.')],
    [t('Ch 4 (Requirements)', 'Ch 4 (Yêu cầu)'), ac('software-requirements', 'swr302-5-1-srs-ieee-830', 'SWR302 5.1'), t('Write testable requirements without ambiguous words.', 'Viết yêu cầu kiểm thử được, tránh từ mơ hồ.')],
    [t('Ch 5 (Design &amp; API)', 'Ch 5 (Thiết kế &amp; API)'), `${ac('software-architecture-and-design', 'swd392-bat-dau-tai-day', 'SWD392')} · ${cs('api-design', 'api-0-8-bat-dau-tai-day', 'API Design')}`, t('Map UML class/sequence diagrams to Spring Boot and clean REST contracts.', 'Ánh xạ sơ đồ class/sequence sang Spring Boot và hợp đồng REST sạch.')],
    [t('Ch 6–8 (Coding &amp; Docker)', 'Ch 6–8 (Code &amp; Docker)'), `${cs('spring-boot', 'sb-7-5-khoa-lac-quan', 'Spring Boot 7.5')} · ${cs('react', 'rx-0-8-bat-dau-tai-day', 'React')} · ${cs('docker', 'dk-9-1-file-dau-tien', 'Docker 9.1')}`, t('Build concurrency-safe backend, typed React UI, and Docker Compose.', 'Xây backend chống tranh chấp, giao diện React có kiểu và Docker Compose.')],
    [t('Ch 9–10 (Testing &amp; Deploy)', 'Ch 9–10 (Kiểm thử &amp; Deploy)'), `${ac('software-testing', 'swt301-lab2-labflow-nghiep-vu', 'SWT301 Lab 2')} · ${cs('testing', 'tst-0-8-bat-dau-tai-day', 'Testing')} · ${cs('deploy-vps', 'deploy-0-5-bat-dau-tai-day', 'Deploy VPS')}`, t('Write Unit/Integration/System test reports and deploy safely for demo.', 'Viết báo cáo Unit/Integration/System test và deploy an toàn cho demo.')],
    [t('Ch 11–12 (Defense &amp; OJT)', 'Ch 11–12 (Bảo vệ &amp; OJT)'), `${ac('software-development-project', 'swp391-bao-ve-du-an', 'SWP391 Bảo vệ')} · ${cs('thuc-tap-cung-claude', 'thuc-tap-cung-claude-0-8-bat-dau-tai-day', t('Internship with AI Senior', 'Thực tập cùng Claude'))}`, t('Rehearse defense questions and keep shipping tickets by hand.', 'Luyện hỏi đáp hội đồng và duy trì thói quen tự gõ ticket thật.')]
  ]
)}

<h3>🕵️ ${t('The red-flag / attacker\'s angle: fake teamwork and "process theatre"', 'Góc rủi ro &amp; kẻ gian: giả mạo teamwork và "diễn quy trình"')}</h3>
<p>${t(
    'Every semester, some students try to game project tracking: they create four fake Git accounts to push commits on the last night so the contribution graph looks balanced, or copy an old senior team\'s SRS and Find-and-Replace the project name. Examiners catch both in under two minutes: Git commit timestamps expose last-night bursts, leftover names from the old project hide in Excel formulas or figure captions, and asking one "why did you choose this constraint?" question breaks the facade instantly. In real companies, falsifying audit trails or test evidence is a fireable compliance breach. This course builds <strong>real discipline with full honesty</strong> — you openly label your workspace "1 person playing 5 roles" and let real artifacts speak for themselves.',
    'Học kỳ nào cũng có sinh viên thử lách luật theo dõi dự án: tạo bốn tài khoản Git giả rồi đêm cuối tự đẩy commit cho biểu đồ đóng góp trông "đều", hoặc lấy file SRS khoá trước rồi Find-and-Replace tên đề tài. Hội đồng bắt bài cả hai chỉ trong dưới hai phút: dấu thời gian commit Git tố cáo đợt đẩy dồn đêm cuối, tên dự án cũ còn sót trong công thức Excel hoặc chú thích hình, và chỉ cần một câu hỏi "vì sao chọn ràng buộc này?" là vỏ bọc vỡ ngay. Ở công ty thật, làm giả dấu vết kiểm toán hay bằng chứng test là lỗi kỷ luật đủ bị sa thải. Khoá này xây <strong>kỷ luật thật đi kèm trung thực tuyệt đối</strong> — bạn ghi công khai trên không gian làm việc "1 người đóng 5 vai" và để sản phẩm thật tự chứng minh.')}</p>

<h3>📋 ${t('Fillable Day-0 Readiness Snapshot (copy to your personal note)', 'Mẫu phiếu tự đánh giá Ngày 0 (chép vào sổ tay cá nhân)')}</h3>
<p>${t(
    '<strong>Scoring scale (0–3):</strong> <code>0</code> = never done it · <code>1</code> = can do it by following a guide · <code>2</code> = can do it independently · <code>3</code> = can explain it clearly to someone else.',
    '<strong>Mốc chấm điểm (0–3):</strong> <code>0</code> = chưa từng làm · <code>1</code> = làm được theo hướng dẫn · <code>2</code> = tự làm được · <code>3</code> = giải thích rõ được cho người khác.')}</p>
${bang(
  [t('Area', 'Mảng'), t('Current level (0–3)', 'Mức hiện tại (0–3)'), t('Biggest gap right now', 'Lỗ hổng lớn nhất lúc này'), t('Companion lesson to open this week', 'Bài học kèm mở trong tuần này')],
  [
    [t('Git &amp; Pull Requests', 'Git &amp; Pull Request'), '___ / 3', t('e.g. Never protected main or resolved merge conflict', 'vd: Chưa từng bảo vệ main hoặc giải xung đột merge'), cs('git', 'git-0-5-bat-dau-tai-day', 'Git 0.5')],
    [t('Spring Boot + PostgreSQL', 'Spring Boot + PostgreSQL'), '___ / 3', t('e.g. Unsure about Flyway and @Transactional', 'vd: Chưa chắc về Flyway và @Transactional'), cs('spring-boot', 'sb-0-8-bat-dau-tai-day', 'Spring Boot 0.8')],
    [t('React + TypeScript', 'React + TypeScript'), '___ / 3', t('e.g. Form validation and API error handling', 'vd: Validate form và xử lý lỗi API'), cs('react', 'rx-0-8-bat-dau-tai-day', 'React 0.8')],
    [t('Process &amp; Reports (SRS/SDS/Test)', 'Quy trình &amp; Hồ sơ (SRS/SDS/Test)'), '___ / 3', t('e.g. Starting from 0 on documentation &amp; tracking', 'vd: Bắt đầu từ số 0 về tài liệu &amp; theo dõi tiến độ'), t('This course — Ch 1 to Ch 11', 'Chính khoá này — Ch 1 tới Ch 11')]
  ]
)}

${cl('warn', `<p><strong>${t('Common beginner mistake', 'Lỗi người mới hay gặp')}</strong> — ${t('jumping straight into IntelliJ/VS Code on Day 1 and coding screens before understanding the 5 roles, grading rules, and milestones. Two weeks later you discover your screens have no unhappy cases (50% LOC loss), no wireframe approval, and zero tracking history. Spend Section 0 setting the rails first — trains run fast only after tracks are laid.', 'nhảy thẳng vào IntelliJ/VS Code ngay Ngày 1 và code màn hình trước khi hiểu 5 vai, luật chấm điểm và các mốc nộp. Hai tuần sau bạn mới phát hiện màn hình thiếu unhappy case (mất 50% điểm LOC), chưa duyệt wireframe và không có lịch sử theo dõi. Hãy dành trọn Mục 0 đặt đường ray trước — tàu chỉ chạy nhanh khi đường ray đã chắc.')}</p>`)}

${viecLabflow([
  [
    t('Fill out the <strong>Day-0 Readiness Snapshot</strong> table above honestly (scores 0–3) and save it in a new CT Work Docs page titled <code>00-Solo-Charter-Notes</code> inside project <strong>LF #2</strong>.', 'Điền trung thực bảng <strong>Phiếu tự đánh giá Ngày 0</strong> ở trên (chấm 0–3) và lưu vào một trang tài liệu mới trong mục <code>docs</code> của dự án <strong>LF #2</strong> trên CT Work với tiêu đề <code>00-Solo-Charter-Notes</code>.'),
    t('The page exists in CT Work <code>docs</code> with all 4 rows filled and at least 2 companion lessons bookmarked for Week 1.', 'Trang tồn tại trong <code>docs</code> của CT Work với đủ 4 dòng đã điền và ít nhất 2 bài học kèm được đánh dấu cho Tuần 1.')
  ],
  [
    t('Write one 3-sentence personal goal at the top of that page: target defense score (8–9/10), target v1 completion date, and why you are practicing all 5 roles.', 'Viết một đoạn mục tiêu cá nhân 3 câu ở đầu trang đó: mục tiêu điểm bảo vệ (8–9/10), ngày chốt v1 dự kiến, và lý do bạn luyện đủ 5 vai.'),
    t('Your goal has concrete dates and numbers — no vague words like "try my best".', 'Mục tiêu có ngày và con số cụ thể — không dùng chữ mơ hồ kiểu "cố gắng hết sức".')
  ]
], en)}

${apDung([
  [t('Multi-vendor E-commerce Marketplace (topic switch)', 'Sàn thương mại điện tử nhiều người bán (đổi đề tài)'), t('Keep the exact 5-hat loop (C1–C5) and vertical-slice ownership: C2 writes Business Rules for stock deduction on checkout, order cancellation windows, and refund disputes across Buyer/Seller/Admin; C3/C4 build Cart → Order → Payment → Shipping → Review screens with backend lock/validation; C5 attacks overselling concurrency and seller IDOR; C1 guards milestones and DoD.', 'Giữ nguyên vòng 5 mũ (C1–C5) và chia lát cắt dọc: C2 viết Business Rule cho trừ tồn kho lúc đặt hàng, hạn huỷ đơn và khiếu nại hoàn tiền giữa Người mua/Người bán/Admin; C3/C4 làm trọn chuỗi Giỏ hàng → Đơn hàng → Thanh toán → Vận chuyển → Đánh giá kèm khoá tồn kho ở backend; C5 tấn công lỗi bán quá tồn kho (overselling) và IDOR đơn của shop khác; C1 giữ mốc và DoD.')],
  [t('Real 5-student SEP490 team', 'Đồ án SEP490 nhóm 5 sinh viên thật'), t('Each teammate takes one primary hat (PM/BA/BE/FE/QA) plus vertical screens; the same DoD, RTM, and cross-review gates eliminate last-night merge disasters.', 'Mỗi bạn nhận một mũ chính (PM/BA/BE/FE/QA) kèm miền màn hình dọc; bộ DoD, RTM và cổng review chéo giữ nguyên giúp chặn thảm hoạ merge đêm cuối.')],
  [t('Enterprise company (FPT Software, 20–100 person outsourcing project)', 'Công ty lớn (FPT Software, dự án outsourcing 20–100 người)'), t('The 5 hats expand into specialised teams — PO, Scrum Master, Solution Architect, DevOps, Security, and QA Lead under CMMI/ISO gates; having practised all 5 seats solo lets you read SRS, BD/DD, Defect Logs, and release checklists fluently from day one.', 'Năm mũ mở rộng thành các vai chuyên trách — PO, Scrum Master, Kiến trúc sư, DevOps, Bảo mật, QA Lead theo quy trình CMMI/ISO; nhờ đã tự đóng đủ 5 vai, bạn đọc hiểu trôi chảy SRS, BD/DD, Defect Log và checklist phát hành ngay ngày đầu.')]
], en)}

${thuatNgu([
  [t('conceptual integrity (design coherence)', 'conceptual integrity (nhất quán về ý tưởng thiết kế)'), t('Fred Brooks\'s principle that a software system should reflect one coherent set of design ideas rather than conflicting styles.', 'Nguyên lý của Fred Brooks: hệ thống phần mềm cần phản ánh một bộ ý tưởng thiết kế nhất quán thay vì nhiều kiểu chắp vá đối lập.')],
  [t('vertical slice (lát cắt dọc)', 'vertical slice (lát cắt dọc)'), t('Splitting work by end-to-end screen/feature (DB + API + UI + test) rather than by technical layer.', 'Chia việc theo trọn một màn hình/tính năng từ đầu tới cuối (CSDL + API + giao diện + test) thay vì chia theo tầng kỹ thuật.')],
  ['LOC (SWP391)', t('Converted effort points per screen (Complexity S/M/C × Quality L1/L2/L3), not raw lines of code.', 'Điểm quy đổi công sức theo màn hình (Độ phức tạp S/M/C × Chất lượng L1/L2/L3), không phải đếm số dòng code thô.')],
  ['Definition of Done (DoD)', t('The shared checklist of conditions every ticket must satisfy before it can move to Done.', 'Danh sách điều kiện bắt buộc mọi thẻ việc phải đạt trước khi được kéo sang cột Done.')],
  ['RTM (Requirements Traceability Matrix)', t('A table linking each Requirement/Use Case to its design, code, and test cases so nothing is dropped.', 'Bảng nối từng Yêu cầu/Use Case tới thiết kế, mã nguồn và test case để không sót hạng mục nào.')]
], en)}

${tomTat([
  t('This course is the orchestration layer: it teaches how one student operates all 5 enterprise roles (PM, BA, Dev BE, Dev FE, QA) to ship LabFlow AI and defend at 8–9/10.', 'Khoá này là lớp điều phối: dạy cách một sinh viên vận hành đủ 5 vai doanh nghiệp (PM, BA, Dev BE, Dev FE, QA) để làm xong LabFlow AI và bảo vệ 8–9 điểm.'),
  t('Real history (IBM Chief Programmer Team 1971, Mars Climate Orbiter 1999, Stardew Valley 2016, Knight Capital 2012) proves that clear role boundaries and verification checklists matter even more when one person holds the keys.', 'Lịch sử thật (IBM Chief Programmer Team 1971, Mars Climate Orbiter 1999, Stardew Valley 2016, Knight Capital 2012) chứng minh ranh giới vai trò và checklist kiểm chứng càng quan trọng hơn khi một người cầm mọi chìa khoá.'),
  t('Zero duplication: technical and subject depth stays in SWP391, Agile Teamwork, Spring Boot, React, Testing, and /projects/labflow-ai — linked directly where needed.', 'Không học trùng: kiến thức kỹ thuật và môn học nằm ở SWP391, Agile Teamwork, Spring Boot, React, Testing và /projects/labflow-ai — dẫn link thẳng đúng chỗ cần.'),
  t('Honesty first: never fake commits or copy senior reports; declare "1 person, 5 roles" openly and prove competence with real artifacts.', 'Trung thực đứng đầu: không bao giờ giả commit hay chép báo cáo khoá trước; công khai "1 người 5 vai" và chứng minh năng lực bằng sản phẩm thật.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-0-2-bat-dau-2', t('0.2 — How to study, wearing 5 hats, honesty rules & AI as mentor', '0.2 — Cách học, "đội mũ", luật trung thực & AI làm mentor'))}.</p>
`);
};

export default {
  title: '0.1 — Start here (1/2): What this course is and why one person plays 5 roles|||0.1 — Bắt đầu tại đây (1/2): Khoá này là gì và vì sao một người đóng 5 vai',
  slug: 'dm5-0-1-bat-dau-1',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đủ 6 ý mở đầu khoá Đồ án một mình đóng 5 vai: khoá này là gì, lịch sử có nguồn thật (Brooks/IBM 1971, Mars Climate Orbiter 1999, Stardew Valley 2016, Knight Capital 2012), khác SWP391/Agile/Fullstack thế nào, kiến thức nền, đầu ra bảo vệ 8–9 điểm, bản đồ 13 chương và khoá học kèm.',
  content: L01(true) + L01(false),
};
