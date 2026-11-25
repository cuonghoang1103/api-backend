/**
 * Bắt đầu tại đây (1/2) — khoá agile-teamwork (agl-0-8-bat-dau-tai-day). Soạn 24/11/2026, agent agt.
 * Output: chạy THẬT bằng scratchpad/agt/lab/ch0 (tao-repo.sh + suc-khoe-nhom.mjs; git 2.55.0, Node 22.22.2), nhúng qua ./_ma.mjs (tệp sinh).
 * Nguồn lịch sử đã tra 24/11/2026: scrumguides.org (Scrum Guide 2020, phát hành 18/11/2020 — BusinessWire), agilemanifesto.org,
 * Takeuchi & Nonaka HBR 1986, Google re:Work "Understand team effectiveness" (Project Aristotle), github.com/google/eng-practices,
 * Kniberg & Ivarsson 2012 "Scaling Agile @ Spotify", DOJ OIG (FBI Sentinel). Tên người trong repo mẫu là GIẢ (C1…C5).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, out, js, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const DE_TAI = (t) => bang([t('Project', 'Đề tài'), t('What it is', 'Là gì'), t('Screens to split (≈ 5 people × 3–4)', 'Màn hình để chia (≈ 5 người × 3–4)'), t('Difficulty', 'Độ khó')], [
  ['<strong>LabFlow AI</strong> ' + t('(default — the owner\'s real SWP391 project)', '(mặc định — đồ án SWP391 thật của chủ kênh)'), t('Booking university labs and borrowing equipment; React + Spring Boot + PostgreSQL; an AI assistant answers "which lab is free on Friday?"', 'Đặt lịch phòng lab và mượn thiết bị của trường; React + Spring Boot + PostgreSQL; trợ lý AI trả lời "thứ Sáu lab nào trống?"'), t('login/roles · lab catalog · lab detail · booking form · my bookings · approve bookings · equipment list · borrow/return · incident report · dashboard · user admin · AI chat', 'đăng nhập/phân quyền · danh mục lab · chi tiết lab · form đặt lịch · lịch của tôi · duyệt đặt lịch · danh sách thiết bị · mượn/trả · báo hỏng · thống kê · quản trị người dùng · chat AI'), '★★★'],
  [t('Clinic appointment booking', 'Đặt lịch phòng khám'), t('Patients book a doctor slot, the clinic confirms, the doctor writes a visit note', 'Bệnh nhân đặt khung giờ bác sĩ, phòng khám xác nhận, bác sĩ ghi kết quả khám'), t('register · doctor list · slot calendar · booking · confirm · visit note · invoice · reports', 'đăng ký · danh sách bác sĩ · lịch khung giờ · đặt lịch · xác nhận · phiếu khám · hoá đơn · báo cáo'), '★★'],
  [t('Sports field booking', 'Đặt sân thể thao'), t('Book football/badminton courts by the hour, pay a deposit, owner manages fields', 'Đặt sân bóng/cầu lông theo giờ, đặt cọc, chủ sân quản lý sân'), t('field search · time grid · booking · deposit · owner dashboard · reviews · promotions', 'tìm sân · lưới giờ · đặt sân · đặt cọc · bảng chủ sân · đánh giá · khuyến mãi'), '★★'],
  [t('Library management', 'Quản lý thư viện'), t('Catalog, borrow and return books, fines for late returns', 'Danh mục sách, mượn trả, phạt trả trễ'), t('catalog · book detail · borrow · return · fines · member admin · reports', 'danh mục · chi tiết sách · mượn · trả · phạt · quản lý thành viên · báo cáo'), '★'],
  [t('Homestay booking', 'Đặt phòng homestay'), t('Hosts list rooms, guests book and review', 'Chủ nhà đăng phòng, khách đặt và đánh giá'), t('room list · room detail · booking · host calendar · payments · reviews · admin', 'danh sách phòng · chi tiết phòng · đặt phòng · lịch chủ nhà · thanh toán · đánh giá · quản trị'), '★★'],
]);

const LO_TRINH = (t) => bang([t('Part', 'Phần'), t('You will be able to…', 'Bạn sẽ làm được…'), t('Project milestone for YOUR team', 'Mốc dự án cho NHÓM bạn')], [
  [t('Section 0', 'Mục 0'), t('See how a real team works, read team health from git history, write a RACI, set up the repo and tools', 'Thấy đội thật làm việc ra sao, đọc sức khoẻ nhóm từ lịch sử git, viết RACI, dựng repo và công cụ'), t('RACI + team repo with hooks and PR template', 'RACI + repo nhóm có hook và mẫu PR')],
  [t('Ch 1 — Agile, Scrum, Kanban', 'Ch 1 — Agile, Scrum, Kanban'), t('Run a sprint, set WIP limits, pick a process for 5 students', 'Chạy một sprint, đặt giới hạn WIP, chọn quy trình cho nhóm 5 SV'), t('Team working agreement + sprint calendar for the term', 'Thoả thuận làm việc nhóm + lịch sprint cả kỳ')],
  [t('Ch 2 — Tickets & estimation', 'Ch 2 — Ticket & ước lượng'), t('Write tickets anyone can pick up, split by screen (vertical slices), estimate with story points', 'Viết ticket ai cũng nhận được, chia theo màn hình (lát cắt dọc), ước lượng bằng story point'), t('Backlog of the first iteration on CT Work', 'Backlog iteration 1 trên CT Work')],
  [t('Ch 3 — Branches, commits, PRs', 'Ch 3 — Nhánh, commit, PR'), t('Team Git flow, PRs that are easy to review, CI, resolve conflicts together', 'Git flow của nhóm, PR dễ review, CI, cùng giải xung đột'), t('Branch protection + first PRs merged', 'Bảo vệ nhánh + những PR đầu tiên được merge')],
  [t('Ch 4 — Code review', 'Ch 4 — Code review'), t('Review kindly and usefully, receive feedback, use a checklist', 'Review tử tế và có ích, nhận góp ý, dùng checklist'), t('Review checklist in the repo', 'Checklist review trong repo')],
  [t('Ch 5 — Technical writing', 'Ch 5 — Viết tài liệu'), t('README, ADR, design doc, blameless postmortem', 'README, ADR, tài liệu thiết kế, postmortem không đổ lỗi'), t('README + 2 ADRs for LabFlow', 'README + 2 ADR cho LabFlow')],
  [t('Ch 6 — Meetings & communication', 'Ch 6 — Họp & giao tiếp'), t('10-minute standups, planning/retro, weekly report to the lecturer, remote work', 'Standup 10 phút, planning/retro, báo cáo tuần cho giảng viên, làm từ xa'), t('Meeting minutes + weekly report template', 'Mẫu biên bản họp + báo cáo tuần')],
  [t('Ch 7 — Other roles', 'Ch 7 — Các vai trò khác'), t('Work with testers, BAs, designers, clients', 'Làm với tester, BA, designer, khách'), t('Bug report + Figma hand-off rules', 'Mẫu bug report + quy ước nhận thiết kế')],
  [t('Ch 8 — First 90 days', 'Ch 8 — 90 ngày đầu'), t('Onboard into a big codebase, ask good questions, deliver first tickets', 'Làm quen codebase lớn, hỏi đúng cách, giao những ticket đầu'), t('Onboarding guide for a new member', 'Tài liệu onboarding cho thành viên mới')],
  [t('Ch 9–11 — Outsourcing, security, clients', 'Ch 9–11 — Outsourcing, an ninh, khách hàng'), t('BD/DD, test spec, Q&A list, man-days, hourensou, NDA/ISMS, Japanese and US clients', 'BD/DD, test spec, Q&A list, man-day, hourensou, NDA/ISMS, khách Nhật và Mỹ'), t('OJT readiness', 'Sẵn sàng OJT')],
  [t('Ch 12 — Capstone', 'Ch 12 — Dự án cuối'), t('Run one full LabFlow sprint: planning → daily → review → retro → report', 'Điều hành trọn một sprint LabFlow: planning → hằng ngày → review → retro → báo cáo'), t('Sprint report + STAR stories for interviews', 'Báo cáo sprint + câu chuyện STAR cho phỏng vấn')],
]);

export const L08 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Start here', 'Mục 0 · Bắt đầu tại đây', `
<h2>${t('Start here (1/2) — How real software teams work, and why interviews probe it', 'Bắt đầu tại đây (1/2) — Đội phần mềm thật làm việc thế nào, vì sao phỏng vấn dò điều này')}</h2>
<p class="lead">${t(
    'Welcome. Maybe you are about to lead a team of five on a semester project and you have never managed anyone. Maybe you are heading to an internship where twenty people touch the same code every day. Either way, the hard part is rarely the code. It is knowing who does what, what "done" means, why one person disappeared for a week, why the merge on the last night broke everything — and what to say to your lecturer or your client about it. This course teaches that part, step by step, with real commands, real templates and real cases.',
    'Chào bạn. Có thể bạn sắp làm trưởng nhóm 5 người cho đồ án cả kỳ mà chưa từng quản lý ai. Có thể bạn sắp đi thực tập ở nơi hai mươi người cùng sửa một kho mã mỗi ngày. Dù là gì, phần khó hiếm khi nằm ở code. Nó nằm ở chỗ: ai làm gì, "xong" nghĩa là gì, vì sao một bạn biến mất cả tuần, vì sao lần merge đêm cuối làm hỏng hết — và nói gì với giảng viên hay khách hàng về chuyện đó. Khoá này dạy đúng phần đó, từng bước, có lệnh chạy thật, mẫu tài liệu thật và sự cố thật.')}</p>

<h3>${t('An everyday picture: a restaurant kitchen', 'Liên tưởng đời thường: bếp nhà hàng')}</h3>
<p>${t(
    'A good kitchen at 7 p.m. looks like chaos but runs on a system. Every dish starts as an <strong>order ticket</strong> clipped to a rail (a ticket on the board). The head chef decides which station cooks what (the leader splits work). Each cook preps their station before service — knives sharp, sauces ready (the Definition of Done and a working dev environment). Nobody sends a plate out without the pass checking it (code review and testing). If the grill runs out of beef, the cook shouts it <em>now</em>, not when the customer complains (reporting blockers early). After service, the team talks five minutes about what went wrong tonight (the retrospective). A kitchen where every cook cooks whatever they like and the head chef plates everything at 10 p.m. is exactly the team project that fails in week 10.',
    'Một bếp nhà hàng tốt lúc 7 giờ tối trông như hỗn loạn nhưng chạy theo hệ thống. Mỗi món bắt đầu bằng một <strong>phiếu order</strong> kẹp lên thanh treo (một ticket trên bảng). Bếp trưởng quyết khu nào nấu món gì (leader chia việc). Mỗi đầu bếp chuẩn bị khu của mình trước giờ mở cửa — dao sắc, nước sốt sẵn (Definition of Done và môi trường dev chạy được). Không đĩa nào ra khỏi bếp khi chưa qua quầy kiểm (code review và test). Khu nướng hết thịt bò thì đầu bếp hô <em>ngay</em>, không đợi khách phàn nàn (báo vướng mắc sớm). Hết ca, cả bếp nói năm phút về chuyện tối nay hỏng ở đâu (retrospective). Một bếp mà ai thích nấu gì thì nấu, rồi 10 giờ đêm bếp trưởng tự bày hết các đĩa — đó chính là đồ án nhóm vỡ ở tuần thứ 10.')}</p>

<h3>${t('What this course is about — the words, untangled', 'Khoá này nói về cái gì — gỡ rối các từ')}</h3>
<ul>
<li>${t('<strong>Agile</strong> is a set of values and principles: deliver working software in small pieces, talk to the customer often, adapt to change. It is not a process you can install.', '<strong>Agile</strong> là một bộ giá trị và nguyên tắc: giao phần mềm chạy được từng phần nhỏ, nói chuyện với khách thường xuyên, thích nghi với thay đổi. Nó không phải một quy trình cài vào là chạy.')}</li>
<li>${t('<strong>Scrum</strong> is one concrete framework that follows those values: fixed-length <em>sprints</em> (1–4 weeks), three roles (Product Owner, Scrum Master, Developers), five events and three artifacts. Chapter 1.', '<strong>Scrum</strong> là một khung làm việc cụ thể theo các giá trị đó: <em>sprint</em> độ dài cố định (1–4 tuần), ba trách nhiệm (Product Owner, Scrum Master, Developers), năm sự kiện và ba sản phẩm. Chương 1.')}</li>
<li>${t('<strong>Kanban</strong> is a flow method: a board, limits on work in progress, and measuring how long work takes to flow through. No sprints required. Chapter 1.', '<strong>Kanban</strong> là phương pháp dòng chảy: một bảng, giới hạn số việc đang làm dở, và đo xem việc chảy qua bảng mất bao lâu. Không bắt buộc có sprint. Chương 1.')}</li>
<li>${t('<strong>Teamwork practices</strong> are what you actually do every day whichever process you pick: tickets, estimates, branches, pull requests, code review, documents, meetings, reports. Chapters 2–8.', '<strong>Thực hành làm việc nhóm</strong> là những gì bạn thật sự làm mỗi ngày dù chọn quy trình nào: ticket, ước lượng, nhánh, pull request, code review, tài liệu, họp, báo cáo. Chương 2–8.')}</li>
</ul>

<h3>${t('A short history with dates you can check', 'Lịch sử ngắn, có mốc kiểm được')}</h3>
${bang([t('Year', 'Năm'), t('What happened', 'Chuyện gì xảy ra'), t('Why it matters to you', 'Vì sao liên quan tới bạn')], [
    ['1970', t('Winston Royce publishes "Managing the Development of Large Software Systems". He draws the sequential model later nicknamed <em>waterfall</em> — and in the same paper calls doing it in one pass "risky and invites failure".', 'Winston Royce đăng bài "Managing the Development of Large Software Systems". Ông vẽ mô hình tuần tự sau này bị gọi là <em>thác nước</em> — và ngay trong bài viết đó gọi việc làm một lượt từ đầu tới cuối là "rủi ro, dễ dẫn tới thất bại".'), t('Even the "father of waterfall" warned against big-bang delivery.', 'Ngay "cha đẻ của waterfall" cũng cảnh báo việc dồn giao một lần.')],
    ['1986', t('Takeuchi and Nonaka, Harvard Business Review, "The New New Product Development Game": the best product teams at Honda, Canon, Fuji-Xerox work like a rugby <em>scrum</em> — overlapping phases, self-organising.', 'Takeuchi và Nonaka, Harvard Business Review, "The New New Product Development Game": các đội sản phẩm giỏi nhất ở Honda, Canon, Fuji-Xerox làm việc như một pha <em>scrum</em> trong bóng bầu dục — các giai đoạn chồng lên nhau, tự tổ chức.'), t('The word "Scrum" comes from here, and from Japanese companies.', 'Chữ "Scrum" đến từ đây, và từ các công ty Nhật.')],
    ['1995', t('Ken Schwaber and Jeff Sutherland present Scrum for software at the OOPSLA conference.', 'Ken Schwaber và Jeff Sutherland trình bày Scrum cho phần mềm ở hội nghị OOPSLA.'), t('Scrum is 30 years old — it is not a fashion.', 'Scrum đã 30 năm tuổi — không phải mốt nhất thời.')],
    ['2001', t('Seventeen developers meet at Snowbird, Utah, and write the <strong>Manifesto for Agile Software Development</strong>: four values, twelve principles.', 'Mười bảy lập trình viên gặp nhau ở Snowbird, Utah, viết <strong>Tuyên ngôn phát triển phần mềm Agile</strong>: bốn giá trị, mười hai nguyên tắc.'), t('Lesson 1.1 reads it line by line.', 'Bài 1.1 đọc nó từng dòng.')],
    ['2010', t('David J. Anderson\'s book <em>Kanban</em> brings Toyota\'s production idea (visual cards, limited work in progress) to software. The first official Scrum Guide is written the same year.', 'Sách <em>Kanban</em> của David J. Anderson mang ý tưởng sản xuất của Toyota (thẻ trực quan, giới hạn việc dở dang) sang phần mềm. Cùng năm, bản Scrum Guide chính thức đầu tiên ra đời.'), t('Two different answers to "how do we organise work?".', 'Hai câu trả lời khác nhau cho "tổ chức công việc thế nào?".')],
    ['2015', t('Google\'s <strong>Project Aristotle</strong> studies 180 teams and finds the #1 factor of effective teams is <strong>psychological safety</strong> — members feel safe to admit mistakes and ask questions — ahead of who is on the team.', 'Nghiên cứu <strong>Project Aristotle</strong> của Google khảo sát 180 đội và thấy yếu tố số 1 của đội hiệu quả là <strong>an toàn tâm lý</strong> — thành viên dám nhận sai và dám hỏi — xếp trên cả việc đội gồm những ai.'), t('As a leader, how you react to "I am stuck" matters more than how good you are at code.', 'Làm leader, cách bạn phản ứng khi ai đó nói "em bí" quan trọng hơn bạn code giỏi tới đâu.')],
    ['2020', t('The current Scrum Guide (18 November 2020) — shorter, less prescriptive, "self-managing" teams, a Product Goal.', 'Scrum Guide hiện hành (18/11/2020) — ngắn hơn, ít quy định cứng hơn, đội "tự quản", thêm Product Goal.'), t('This course follows the 2020 guide.', 'Khoá này theo bản 2020.')],
  ])}

<h3>${t('How it differs from things you may confuse it with', 'Khác gì những thứ dễ nhầm')}</h3>
${bang([t('Thing', 'Thứ'), t('What it is', 'Là gì'), t('Where in this course / elsewhere', 'Ở đâu trong khoá / nơi khác')], [
    [t('Waterfall / V-model', 'Waterfall / V-model'), t('Phases in sequence, documents at each gate; still common on fixed-price outsourcing projects, often mixed with Agile', 'Các giai đoạn nối tiếp, mỗi cửa có tài liệu; vẫn phổ biến ở dự án outsourcing trọn gói, thường trộn với Agile'), ag('agl-9-2-vong-doi-v-model', t('Lesson 9.2', 'Bài 9.2')) + ' · ' + ac('introduction-to-software-engineering', 'swe201c-waterfall', 'SWE201c')],
    [t('Project management (PMP, PMG201c)', 'Quản lý dự án (PMP, PMG201c)'), t('Scope, cost, schedule, risk for the whole project — the manager\'s view', 'Phạm vi, chi phí, tiến độ, rủi ro cả dự án — góc nhìn của người quản lý'), ac('project-management', 'pmg201c-2-1-wbs-estimating', 'PMG201c 2.1') + ' · ' + ag('agl-9-6-uoc-luong-man-day', t('Lesson 9.6', 'Bài 9.6'))],
    [t('Requirements (SWR302)', 'Yêu cầu phần mềm (SWR302)'), t('Finding and writing what to build: user stories, use cases, SRS', 'Tìm ra và viết điều cần làm: user story, use case, SRS'), ac('software-requirements', 'swr302-gioi-thieu', 'SWR302') + t(' — this course uses stories, it does not teach writing an SRS', ' — khoá này dùng story, không dạy viết SRS')],
    ['DevOps / CI/CD', t('Automating build, test, deploy and operating the system', 'Tự động hoá build, test, deploy và vận hành hệ thống'), cs('github-actions', 'ga-0-5-bat-dau-tai-day', 'GitHub Actions') + t(' — here only "CI as a teammate" (3.3)', ' — ở đây chỉ "CI như một đồng đội" (3.3)')],
    ['Git', t('The tool that stores history and merges work', 'Công cụ lưu lịch sử và gộp công việc'), cs('git', 'git-kd-4-truong-nhom-tao-repo', t('Git — Quick start for teams', 'Khoá Git — Khởi động nhanh cho nhóm')) + t(' — here: the team rules around Git', ' — ở đây: luật nhóm quanh Git')],
  ])}

<h3>${t('What you need before starting', 'Cần biết gì trước')}</h3>
<ul>
<li>${t('Git basics: clone, commit, push, branch. If not, do the ', 'Git cơ bản: clone, commit, push, nhánh. Chưa có thì làm phần ')}${cs('git', 'git-kd-0-slides', t('Git quick start (Windows + Mac)', 'Git khởi động nhanh (Windows + Mac)'))}${t(' first — about two evenings.', ' trước — khoảng hai buổi tối.')}</li>
<li>${t('You have written some app in any stack (React, Spring, Node…). You do not need to be good — you need to know what a "screen", an "API" and a "table" are, because tickets talk about them.', 'Bạn đã viết một ứng dụng nào đó bằng bất kỳ stack nào (React, Spring, Node…). Không cần giỏi — cần biết "màn hình", "API", "bảng" là gì, vì ticket nói về chúng.')}</li>
<li>${t('Nothing else. Every term is explained where it first appears. The CT Work board on this site (<a href="/work">/work</a>) is free and is all the tooling you need.', 'Không cần gì thêm. Mọi thuật ngữ được giải nghĩa ngay chỗ nó xuất hiện lần đầu. Bảng CT Work trên chính trang này (<a href="/work">/work</a>) miễn phí, đủ làm công cụ cho cả khoá.')}</li>
</ul>

<h3>${t('After this course you can…', 'Học xong bạn làm được…')}</h3>
<ol>
<li>${t('<strong>Lead a team of five on SWP391</strong>: split work by <em>screen/feature</em> (not "you do frontend, you do backend") so that every member owns screens and their LOC grade, plan iterations as sprints, keep a backlog on CT Work, and agree a Definition of Done.', '<strong>Làm trưởng nhóm 5 người SWP391</strong>: chia việc theo <em>màn hình/chức năng</em> (không chia "bạn làm frontend, bạn làm backend") để ai cũng sở hữu màn hình và điểm LOC của mình, lên kế hoạch iteration như sprint, giữ backlog trên CT Work, thống nhất Definition of Done.')} ${ac('software-development-project', 'swp391-4-complexity-loc-grade', t('(How SWP391 grades LOC per screen — Academy 4.3)', '(SWP391 chấm LOC theo màn hình thế nào — Academy 4.3)'))}</li>
<li>${t('Run a Git flow with branches, pull requests and reviews so nobody pushes broken code to <code>main</code> the night before the demo.', 'Chạy Git flow có nhánh, pull request và review để không ai đẩy code hỏng lên <code>main</code> đêm trước buổi demo.')}</li>
<li>${t('Handle people problems with a script: the member who is late, who does nothing, two members who argue — and know when to escalate to the lecturer.', 'Xử lý chuyện con người theo kịch bản: thành viên trễ hạn, thành viên không làm, hai bạn cãi nhau — và biết khi nào đưa lên giảng viên.')}</li>
<li>${t('Report progress honestly with numbers: a weekly report, a burndown chart, a risk list.', 'Báo cáo tiến độ trung thực bằng số: báo cáo tuần, biểu đồ burndown, danh sách rủi ro.')}</li>
<li>${t('Walk into an internship at an outsourcing company (FPT Software and similar) and recognise daily reports, BD/DD documents, Q&A lists, test specs, NDA and ISMS rules on day one.', 'Bước vào kỳ thực tập ở công ty outsourcing (FPT Software và tương tự) mà nhận ra ngay daily report, tài liệu BD/DD, Q&A list, test spec, quy định NDA và ISMS từ ngày đầu.')}</li>
<li>${t('Answer behavioural interview questions ("tell me about a conflict in your team") with true STAR stories from your own project.', 'Trả lời câu hỏi phỏng vấn hành vi ("kể về một lần nhóm bạn có xung đột") bằng câu chuyện STAR có thật từ chính dự án của bạn.')} ${cs('interview-prep', 'pv-2-2-star', t('(STAR — Interview prep 2.2)', '(STAR — khoá Phỏng vấn 2.2)'))}</li>
</ol>

<h3>${t('Who really works this way — with sources', 'Ai thật sự làm như vậy — có nguồn')}</h3>
<ul>
<li>${t('<strong>Google</strong> publishes its internal code review guide: every change is reviewed before it lands, reviews should be fast and kind, and "the primary purpose of code review is to make sure the overall code health is improving over time".', '<strong>Google</strong> công khai hướng dẫn code review nội bộ: mọi thay đổi đều được review trước khi vào kho, review phải nhanh và tử tế, và "mục đích chính của code review là bảo đảm sức khoẻ tổng thể của mã tốt dần lên theo thời gian".')} ${ng('https://google.github.io/eng-practices/review/', 'google.github.io/eng-practices')}</li>
<li>${t('<strong>Google re:Work — Project Aristotle</strong>: five dynamics of effective teams — psychological safety, dependability, structure and clarity, meaning, impact.', '<strong>Google re:Work — Project Aristotle</strong>: năm yếu tố của đội hiệu quả — an toàn tâm lý, đáng tin cậy, cấu trúc và rõ ràng, ý nghĩa, tác động.')} ${ng('https://rework.withgoogle.com/en/guides/understanding-team-effectiveness', 'rework.withgoogle.com')}</li>
<li>${t('<strong>Spotify</strong> organised hundreds of engineers in small autonomous "squads" (Kniberg & Ivarsson, 2012). The authors themselves present it as a snapshot of one company, not a template to copy — a useful lesson: adapt, do not copy.', '<strong>Spotify</strong> tổ chức hàng trăm kỹ sư thành các "squad" nhỏ tự chủ (Kniberg & Ivarsson, 2012). Chính các tác giả trình bày nó như ảnh chụp của một công ty ở một thời điểm, không phải khuôn để chép — một bài học có ích: điều chỉnh, đừng sao chép.')} ${ng('https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf', 'Scaling Agile @ Spotify (PDF)')}</li>
<li>${t('<strong>FBI</strong>: the Virtual Case File system was abandoned in 2005 after about $170 million; its replacement, Sentinel, was finished after the FBI switched to agile development — tracked by the US Department of Justice Inspector General.', '<strong>FBI</strong>: hệ thống Virtual Case File bị bỏ năm 2005 sau khoảng 170 triệu USD; hệ thống thay thế, Sentinel, hoàn thành sau khi FBI chuyển sang phát triển agile — được Tổng thanh tra Bộ Tư pháp Mỹ theo dõi qua nhiều báo cáo.')} ${ng('https://oig.justice.gov/archives/reports/FBI/a0703/exec.htm', 'DOJ OIG — Sentinel Audit II')}</li>
<li>${t('<strong>Outsourcing companies</strong> in Vietnam serving Japanese and US clients run hybrid processes — sprints inside, V-model documents outside. Chapter 9 shows what that looks like in a normal day.', '<strong>Các công ty outsourcing</strong> ở Việt Nam làm cho khách Nhật và Mỹ chạy quy trình lai — bên trong là sprint, bên ngoài là tài liệu kiểu V-model. Chương 9 cho thấy một ngày bình thường trông thế nào.')}</li>
</ul>

<h3>${t('Your first 10 minutes: read a team\'s health from its git history', '10 phút đầu: đọc sức khoẻ một nhóm từ lịch sử git')}</h3>
<p>${t(
    'A repository remembers who did what and when. Before you learn any process, look at what two teams actually did in the same two-week sprint (4–15 January 2027, five members C1–C5, fake names). The script below builds both repositories so you can run everything yourself:',
    'Một kho mã nhớ ai làm gì, lúc nào. Trước khi học quy trình nào, hãy nhìn hai nhóm đã thật sự làm gì trong cùng một sprint hai tuần (4–15/01/2027, năm thành viên C1–C5, tên giả). Script dưới đây dựng cả hai kho để bạn tự chạy lại mọi thứ:')}</p>
${giai(t('tao-repo.sh — builds the two team repositories', 'tao-repo.sh — dựng hai kho của hai nhóm'), bash(MA.taoRepo))}
<p>${t('Now a 40-line Node script that reads <code>git log</code> and prints commits per person, active days, how much was pushed in the last two days, and late-night commits:', 'Giờ là một script Node 40 dòng đọc <code>git log</code> rồi in: số commit mỗi người, số ngày có commit, bao nhiêu phần dồn vào hai ngày cuối, và commit sau 22 giờ:')}</p>
${js(MA.sucKhoe)}
${out(RA.sucKhoe)}
<p>${t(
    'Team A: everyone pushes almost every day, 18 % of the work lands in the last two days, nobody works after 22:00. Team B: <strong>91 %</strong> of commits in the last two days, five silent working days, the leader with 14 commits including "làm nốt phần C5" (finishing C5\'s part) at 08:55 on demo day, and C5 with <strong>zero</strong>. Notice the first version of this script did not show C5 at all — someone with no commits is invisible in <code>git log</code>. That is the whole problem of a silent member, in one line of output. You need the team list to see who is missing.',
    'Nhóm A: ai cũng đẩy code gần như mỗi ngày, 18 % công việc rơi vào hai ngày cuối, không ai làm sau 22 giờ. Nhóm B: <strong>91 %</strong> commit nằm ở hai ngày cuối, năm ngày làm việc im lặng, leader 14 commit trong đó có "làm nốt phần C5" lúc 08:55 ngày demo, còn C5 <strong>không có</strong> commit nào. Để ý: bản đầu của script này không hiện C5 — người không commit thì vô hình trong <code>git log</code>. Đó chính là bài toán "thành viên im lặng", gói trong một dòng output. Phải có danh sách nhóm mới thấy ai vắng.')}</p>
${cl('warn', `<p><strong>${t('A leader trap', 'Bẫy của leader')}</strong> — ${t('in Team B the leader "saved" the project by doing C5\'s part. On SWP391 that means C5 has no screens and no LOC, the leader burns out, and the lecturer sees one person doing everything. Chapter 6 and lesson 12.2 give you the script for talking to C5 on day 3, not day 10.', 'ở Nhóm B, leader "cứu" dự án bằng cách làm luôn phần của C5. Ở SWP391 nghĩa là C5 không có màn hình, không có LOC, leader kiệt sức, còn giảng viên thấy một người làm tất cả. Chương 6 và bài 12.2 cho bạn kịch bản nói chuyện với C5 từ ngày thứ 3, không phải ngày thứ 10.')}</p>`)}
<p>${t('Plain git can show the same story without any script:', 'Git trần cũng kể được cùng câu chuyện, không cần script:')}</p>
${out(`$ git shortlog -sn HEAD
    14	Leader C1
     4	Dev C2
     4	Dev C3
     1	Dev C4
$ git log --format=%ad --date=short | sort | uniq -c
      1 2027-01-04
      1 2027-01-06
     12 2027-01-14
      9 2027-01-15`)}
${note(t('Commit counts are a smoke detector, not a grade. Ten tiny commits are not better than one good one, and pair programming puts two people\'s work under one name. Use these numbers to start a conversation ("I see nothing from you since Tuesday — what is blocking you?"), never to judge someone alone.', 'Số commit là chuông báo khói, không phải điểm số. Mười commit vụn không hơn một commit tốt, và lập trình cặp thì công của hai người nằm dưới một cái tên. Dùng con số để mở lời ("mình không thấy gì của bạn từ thứ Ba — đang vướng gì vậy?"), đừng bao giờ dùng riêng nó để phán xét ai.'))}

<h3>🧪 ${t('Practice (15 minutes)', 'Thực hành (15 phút)')}</h3>
<ol>
<li>${t('Create <code>~/lab0</code>, save the two scripts, run <code>bash tao-repo.sh ~/lab0</code>, then the health script on both repos with the team list. Your numbers must match the output above except commit hashes.', 'Tạo <code>~/lab0</code>, lưu hai script, chạy <code>bash tao-repo.sh ~/lab0</code>, rồi chạy script sức khoẻ trên cả hai kho kèm danh sách nhóm. Số liệu phải khớp output ở trên (trừ mã hash).')}</li>
<li>${t('Run it on a real repository of yours (an old group assignment). What do you see?', 'Chạy trên một kho thật của bạn (một bài nhóm cũ). Bạn thấy gì?')}</li>
<li>${t('Write three sentences: what would you, as Team B\'s leader, have done on 7 January?', 'Viết ba câu: là leader Nhóm B, ngày 07/01 bạn sẽ làm gì?')}</li>
</ol>
${giai(t('Model answer for question 3', 'Đáp án gợi ý câu 3'), `<p>${t(
    '"On 7 January (day 4) I notice nobody has pushed since the 6th. I message each member privately: what are you working on, what is blocking you, can you push a draft branch today even if unfinished. With C5 specifically I offer 20 minutes of pairing to get the environment running, and I note in the meeting minutes who owns which screen and the date of the next check — so if nothing changes by day 6 I have something concrete to show the lecturer."',
    '"Ngày 07/01 (ngày thứ 4) mình thấy từ 06/01 không ai đẩy gì. Mình nhắn riêng từng bạn: đang làm phần nào, vướng gì, hôm nay đẩy được một nhánh nháp dù chưa xong không. Riêng C5, mình đề nghị ngồi cùng 20 phút để chạy được môi trường, và ghi vào biên bản họp ai giữ màn hình nào cùng ngày kiểm tra kế tiếp — để nếu tới ngày thứ 6 vẫn không đổi thì có bằng chứng cụ thể đưa giảng viên."')}</p>`)}

<h3>🎯 ${t('Your course project: lead YOUR team through this course', 'Dự án của khoá: dẫn CHÍNH nhóm bạn đi qua khoá này')}</h3>
<p>${t(
    'This course has no toy project. Its project is the real team project you are doing or about to do (SWP391, a capstone, a club project). Every chapter ends with a <strong>🛠 project milestone</strong> that you apply to that team. If you have no team yet, pick one of these topics and play all five roles C1–C5 on CT Work, writing clearly that one person plays five roles.',
    'Khoá này không có dự án đồ chơi. Dự án của nó là dự án nhóm thật bạn đang hoặc sắp làm (SWP391, đồ án tốt nghiệp, dự án câu lạc bộ). Cuối mỗi chương có một <strong>🛠 mốc dự án</strong> để áp vào chính nhóm đó. Chưa có nhóm thì chọn một trong các đề tài dưới đây và tự đóng cả năm vai C1–C5 trên CT Work, ghi rõ là một người đóng năm vai.')}</p>
${DE_TAI(t)}
<p>${t('Write your choice on a new CT Work project (lesson 0.2 shows how), with the five members and their screens. You will refine it in every chapter.', 'Ghi lựa chọn của bạn vào một dự án mới trên CT Work (bài 0.2 hướng dẫn), kèm năm thành viên và màn hình của từng người. Mỗi chương bạn sẽ chỉnh dần nó.')}</p>

<h3>${t('The route through the course', 'Lộ trình các chương')}</h3>
${LO_TRINH(t)}

<h3>${t('Study alongside', 'Học kèm khoá nào')}</h3>
<ul>
<li>${t('Before or alongside: ', 'Trước hoặc song song: ')}${cs('git', 'git-kd-4-truong-nhom-tao-repo', t('Git — quick start for teams', 'Git — khởi động nhanh cho nhóm'))}, ${cs('git', 'git-6-1-giai-phau-pr', t('Git ch. 6 — pull requests', 'Git ch. 6 — pull request'))}, ${cs('git', 'git-16-2-sprint-mo-phong', t('Git ch. 16 — a simulated team sprint on GitHub', 'Git ch. 16 — sprint nhóm mô phỏng trên GitHub'))}.</li>
<li>${t('Same semester at university: ', 'Cùng kỳ ở trường: ')}${ac('software-development-project', 'swp391-gioi-thieu', 'SWP391')} (${t('the project you will lead', 'đồ án bạn sẽ dẫn')}), ${ac('software-requirements', 'swr302-gioi-thieu', 'SWR302')} (${t('user stories', 'user story')}), ${ac('software-testing', 'swt301-test-types', 'SWT301')} (${t('testing', 'kiểm thử')}).</li>
<li>${t('After: ', 'Sau đó: ')}${cs('interview-prep', 'pv-2-2-star', t('Interview prep — STAR', 'Phỏng vấn — STAR'))}, ${cs('tieng-anh-ky-thuat-di-lam', 'tak-0-9-bat-dau-khi-khong-co', t('Technical English at work', 'Tiếng Anh kỹ thuật khi đi làm'))}, ${cs('github-actions', 'ga-0-5-bat-dau-tai-day', 'GitHub Actions')}.</li>
</ul>

<h3>${t('How to study this course', 'Học khoá này thế nào cho hiệu quả')}</h3>
<ul>
<li>${t('<strong>Minimum path (2 weeks before your project starts)</strong>: Section 0 → Chapter 1 → Chapter 2 → Chapter 3 → lessons 6.1–6.3 → Chapter 12. That is enough to lead an SWP391 team.', '<strong>Lộ trình tối thiểu (2 tuần trước khi dự án bắt đầu)</strong>: Mục 0 → Chương 1 → Chương 2 → Chương 3 → bài 6.1–6.3 → Chương 12. Đủ để dẫn một nhóm SWP391.')}</li>
<li>${t('<strong>Full path</strong>: everything in order, about one lesson per day. Chapters 9–11 right before your internship.', '<strong>Lộ trình đầy đủ</strong>: học hết theo thứ tự, khoảng một bài mỗi ngày. Chương 9–11 học ngay trước khi đi thực tập.')}</li>
<li>${t('Do every 🧪 on your real team the same week. A process you only read about is forgotten in a month; a process you ran with your team becomes a story for your interview.', 'Làm mỗi 🧪 trên chính nhóm bạn ngay trong tuần. Quy trình chỉ đọc qua sẽ quên sau một tháng; quy trình đã chạy cùng nhóm sẽ thành câu chuyện cho buổi phỏng vấn.')}</li>
</ul>

${phongVan([
    [t('"Tell me about a time you worked in a team that had problems."', '"Kể về một lần bạn làm trong một nhóm gặp vấn đề."'), t('Use STAR: Situation (SWP391, 5 people, week 4, two members silent), Task (deliver iteration 2 with everyone owning screens), Action (what YOU did — private check-ins, re-split screens, daily async standup, escalated with evidence), Result (numbers: all 5 members had screens, iteration delivered, what you would do earlier next time). Never blame; show what you learned.', 'Dùng STAR: Bối cảnh (SWP391, 5 người, tuần 4, hai bạn im lặng), Nhiệm vụ (giao iteration 2 với ai cũng có màn hình), Hành động (BẠN đã làm gì — hỏi riêng từng người, chia lại màn hình, standup bất đồng bộ hằng ngày, báo giảng viên kèm bằng chứng), Kết quả (bằng số: cả 5 người đều có màn hình, iteration giao đúng hạn, lần sau sẽ làm sớm hơn điều gì). Không đổ lỗi; cho thấy bạn học được gì.')],
    [t('"What is the difference between Agile and Scrum?"', '"Agile và Scrum khác nhau thế nào?"'), t('Agile is a set of values and principles (the 2001 Manifesto). Scrum is one framework implementing them with sprints, three accountabilities, five events and three artifacts. Kanban is another way to be agile, without sprints.', 'Agile là bộ giá trị và nguyên tắc (Tuyên ngôn 2001). Scrum là một khung làm việc hiện thực chúng bằng sprint, ba trách nhiệm, năm sự kiện và ba sản phẩm. Kanban là một cách khác để agile, không cần sprint.')],
    [t('"How do you know your team is on track?"', '"Làm sao bạn biết nhóm đang đúng tiến độ?"'), t('Not by asking "is it OK?". By evidence: tickets moving on the board daily, small PRs merged daily, a burndown close to the ideal line, nobody silent for more than a day or two. Then a short conversation when a signal turns red.', 'Không phải bằng câu "ổn không?". Bằng bằng chứng: thẻ di chuyển trên bảng mỗi ngày, PR nhỏ được merge mỗi ngày, burndown bám đường lý tưởng, không ai im lặng quá một hai ngày. Rồi nói chuyện ngắn khi một tín hiệu chuyển đỏ.')],
  ], en)}

${thuatNgu([
    ['Agile', t('Values and principles for building software in small, frequent, adaptable steps (Manifesto 2001).', 'Bộ giá trị và nguyên tắc làm phần mềm theo bước nhỏ, thường xuyên, dễ thích nghi (Tuyên ngôn 2001).')],
    ['Scrum', t('A framework of fixed-length sprints with defined roles, events and artifacts.', 'Khung làm việc theo sprint độ dài cố định, có trách nhiệm, sự kiện và sản phẩm xác định.')],
    ['Kanban', t('A flow method: visual board + work-in-progress limits + flow metrics.', 'Phương pháp dòng chảy: bảng trực quan + giới hạn việc dở dang + chỉ số dòng chảy.')],
    ['sprint', t('A fixed time box (1–4 weeks) ending with a usable increment.', 'Một khung thời gian cố định (1–4 tuần) kết thúc bằng một phần sản phẩm dùng được.')],
    [t('psychological safety (an toàn tâm lý)', 'psychological safety (an toàn tâm lý)'), t('Team members feel safe to admit mistakes, ask questions, disagree.', 'Thành viên thấy an toàn khi nhận sai, đặt câu hỏi, phản đối.')],
    ['LOC (SWP391)', t('A converted size per screen (complexity × quality), not counted lines — why work must be split by screen.', 'Kích thước quy đổi theo màn hình (độ phức tạp × chất lượng), không phải đếm dòng — lý do phải chia việc theo màn hình.')],
  ], en)}

${tomTat([
    t('Agile = values; Scrum and Kanban = two ways to apply them; teamwork practices = what you do every day.', 'Agile = giá trị; Scrum và Kanban = hai cách áp dụng; thực hành làm nhóm = việc bạn làm mỗi ngày.'),
    t('History: Royce 1970 warned against one-pass delivery; Scrum from Takeuchi–Nonaka 1986 and OOPSLA 1995; Manifesto 2001; Scrum Guide 2020.', 'Lịch sử: Royce 1970 đã cảnh báo giao một lượt; Scrum từ Takeuchi–Nonaka 1986 và OOPSLA 1995; Tuyên ngôn 2001; Scrum Guide 2020.'),
    t('Google found psychological safety is the #1 factor of effective teams — a leader\'s reactions matter.', 'Google thấy an toàn tâm lý là yếu tố số 1 của đội hiệu quả — phản ứng của leader quan trọng.'),
    t('Git history shows team health: last-minute crunch, silent days, unequal load, missing members.', 'Lịch sử git cho thấy sức khoẻ nhóm: dồn cuối, ngày im lặng, lệch tải, người vắng mặt.'),
    t('The course project is your real team; every chapter ends with a milestone for it.', 'Dự án của khoá là chính nhóm bạn; mỗi chương kết thúc bằng một mốc cho nhóm đó.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-0-9-bat-dau-khi-khong-co', t('Start here (2/2) — how teams fail, with real cases', 'Bắt đầu tại đây (2/2) — đội hỏng ra sao, bằng sự cố thật'))}.</p>
`);
};

export default {
  title: 'Start here (1/2) — How real software teams work, and why interviews probe it|||Bắt đầu tại đây (1/2) — Đội phần mềm thật làm việc thế nào, vì sao phỏng vấn dò điều này',
  slug: 'agl-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Agile, Scrum, Kanban là gì và khác nhau ra sao, lịch sử có mốc (Royce 1970 → Scrum Guide 2020), Project Aristotle của Google, học xong làm leader nhóm SWP391 được gì, đọc sức khoẻ nhóm từ lịch sử git bằng script chạy thật, chọn dự án xuyên khoá.',
  content: L08(true) + L08(false),
};
