/**
 * 0.1 — Vai trò (agl-0-1-vai-tro). Soạn 24/11/2026, agent agt.
 * Lab RACI: scratchpad/agt/lab/ch0/kiem-raci.mjs + raci-nhap.csv / raci.csv / raci-sua.csv, output THẬT (Node 22.22.2) qua ./_ma.mjs.
 * Định nghĩa trách nhiệm Scrum theo Scrum Guide 2020 (scrumguides.org). Ranh giới: BA/yêu cầu ⇒ SWR302; tester ⇒ SWT301 + 7.1; BrSE ⇒ 9.1.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const doan = (ra, tep) => {
  const i = ra.indexOf('$ node kiem-raci.mjs ' + tep);
  const j = ra.indexOf('$ node', i + 5);
  return ra.slice(i, j < 0 ? undefined : j).trim();
};

export const L01 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Lesson 0.1', 'Mục 0 · Bài 0.1', `
<h2>${t('0.1 — Roles: dev, tester, BA, PM, PO, Scrum Master', '0.1 — Vai trò: dev, tester, BA, PM, PO, Scrum Master')}</h2>
<p class="lead">${t(
    'On your first day at a company someone says "ask the PO, not the PM — and tell the BrSE before you email the client". On a student team nobody has a title and the leader ends up doing everything. This lesson names every role you will meet, what each one produces, how the roles collapse into five students, and gives you a tool — the RACI matrix — that you will check with a real script.',
    'Ngày đầu đi làm, ai đó bảo "hỏi PO chứ đừng hỏi PM — và báo BrSE trước khi email khách". Ở nhóm sinh viên chẳng ai có chức danh và leader thành người làm tất cả. Bài này gọi tên mọi vai trò bạn sẽ gặp, mỗi vai tạo ra cái gì, các vai gộp vào năm sinh viên ra sao, và đưa bạn một công cụ — ma trận RACI — mà bạn sẽ kiểm bằng script chạy thật.')}</p>

<h3>${t('Everyday picture: building a house', 'Liên tưởng đời thường: xây một căn nhà')}</h3>
<p>${t(
    'The <strong>owner</strong> decides what house they want and pays (client / Product Owner). The <strong>architect</strong> turns wishes into drawings precise enough to build (BA and designer). The <strong>site manager</strong> plans who comes which day, orders materials, reports to the owner (PM, team leader). The <strong>builders</strong> build (developers). The <strong>inspector</strong> checks the wiring before the walls are closed (tester/QA). If the owner phones a builder directly and says "add a window here", the builder must say "please talk to the site manager" — otherwise the plan, the price and the inspection all go wrong. Software teams work the same way.',
    '<strong>Chủ nhà</strong> quyết muốn nhà thế nào và trả tiền (khách hàng / Product Owner). <strong>Kiến trúc sư</strong> biến mong muốn thành bản vẽ đủ chính xác để xây (BA và designer). <strong>Cai thầu</strong> lên lịch ai làm ngày nào, đặt vật tư, báo cáo chủ nhà (PM, trưởng nhóm). <strong>Thợ</strong> xây (lập trình viên). <strong>Giám sát</strong> kiểm đường điện trước khi trát tường (tester/QA). Nếu chủ nhà gọi thẳng cho một thợ và bảo "trổ thêm cái cửa sổ ở đây", người thợ phải nói "anh/chị trao đổi với cai thầu giúp em" — nếu không thì kế hoạch, giá và việc nghiệm thu đều lệch. Đội phần mềm cũng y như vậy.')}</p>

<h3>${t('The roles you will meet', 'Các vai trò bạn sẽ gặp')}</h3>
${bang([t('Role', 'Vai'), t('Does', 'Làm gì'), t('Produces', 'Tạo ra'), t('You go to them when…', 'Bạn tìm họ khi…')], [
    [t('<strong>Developer</strong> (dev)', '<strong>Developer</strong> (lập trình viên)'), t('Designs and writes code, unit tests, reviews colleagues\' code', 'Thiết kế và viết code, unit test, review code đồng nghiệp'), t('Pull requests, tests, technical notes', 'Pull request, test, ghi chú kỹ thuật'), t('You need help understanding a module', 'Bạn cần hiểu một module')],
    [t('<strong>Tester / QA</strong>', '<strong>Tester / QA</strong>'), t('Designs test cases, tests, reports bugs; QA also improves the process that prevents bugs', 'Thiết kế test case, kiểm thử, báo lỗi; QA còn cải tiến quy trình để ngăn lỗi'), t('Test cases, bug reports, test reports', 'Test case, bug report, báo cáo test'), t('A bug report is unclear; you want to know how a feature will be tested', 'Bug report không rõ; bạn muốn biết tính năng sẽ được test thế nào')],
    [t('<strong>BA</strong> (business analyst)', '<strong>BA</strong> (phân tích nghiệp vụ)'), t('Finds out what users need and writes it so it can be built', 'Tìm hiểu người dùng cần gì và viết lại để làm được'), t('User stories, use cases, SRS, acceptance criteria', 'User story, use case, SRS, tiêu chí chấp nhận'), t('A requirement is ambiguous', 'Một yêu cầu mơ hồ')],
    [t('<strong>PO</strong> (Product Owner)', '<strong>PO</strong> (Product Owner)'), t('Decides <em>what</em> is built and in which order; accountable for the product\'s value', 'Quyết định làm <em>cái gì</em> và theo thứ tự nào; chịu trách nhiệm giá trị sản phẩm'), t('Ordered Product Backlog, Product Goal', 'Product Backlog có thứ tự, Product Goal'), t('Two tasks compete; "is this in scope?"', 'Hai việc tranh nhau; "cái này có trong phạm vi không?"')],
    [t('<strong>Scrum Master</strong>', '<strong>Scrum Master</strong>'), t('Helps the team use Scrum well, removes obstacles, coaches — does not assign tasks', 'Giúp đội dùng Scrum cho tốt, gỡ vật cản, huấn luyện — không giao việc'), t('Working events, removed impediments', 'Các sự kiện chạy tốt, vật cản được gỡ'), t('Something outside the team blocks you', 'Có thứ ngoài đội chặn bạn')],
    [t('<strong>PM</strong> (project manager)', '<strong>PM</strong> (quản lý dự án)'), t('Scope, schedule, cost, risk, contract; reports to management and client', 'Phạm vi, tiến độ, chi phí, rủi ro, hợp đồng; báo cáo lãnh đạo và khách'), t('Plan, reports, risk register', 'Kế hoạch, báo cáo, danh sách rủi ro'), t('Deadline or effort will change', 'Hạn chót hoặc khối lượng sẽ thay đổi')],
    [t('<strong>Tech lead / team leader</strong>', '<strong>Tech lead / trưởng nhóm</strong>'), t('Technical direction, splits work, reviews, unblocks developers', 'Định hướng kỹ thuật, chia việc, review, gỡ vướng cho dev'), t('Architecture decisions, task split', 'Quyết định kiến trúc, cách chia việc'), t('You are stuck for more than 30 minutes', 'Bạn bí quá 30 phút')],
    [t('<strong>BrSE</strong> (bridge engineer)', '<strong>BrSE</strong> (kỹ sư cầu nối)'), t('Engineer who speaks the client\'s language (often Japanese) and carries questions and answers', 'Kỹ sư nói được tiếng của khách (thường là tiếng Nhật), chuyển câu hỏi và câu trả lời'), t('Q&A list, translated specs', 'Q&A list, spec đã dịch'), t('You need to ask the client anything', 'Bạn cần hỏi khách bất cứ điều gì')],
    [t('<strong>Designer</strong> (UI/UX)', '<strong>Designer</strong> (UI/UX)'), t('Screens, flows, visual system', 'Màn hình, luồng thao tác, hệ thống giao diện'), t('Figma files, design tokens', 'Tệp Figma, quy ước giao diện'), t('The design does not cover an error/empty state', 'Thiết kế thiếu trạng thái lỗi/rỗng')],
  ])}
<p>${t('Deeper lessons: tester ⇒ ', 'Học sâu hơn: tester ⇒ ')}${ag('agl-7-1-tester', '7.1')} ${t('and', 'và')} ${ac('software-testing', 'swt301-test-types', 'SWT301')}; BA/PO ⇒ ${ag('agl-7-2-ba-po', '7.2')} ${t('and', 'và')} ${ac('software-requirements', 'swr302-gioi-thieu', 'SWR302')}; BrSE ⇒ ${ag('agl-9-1-mo-hinh-hop-dong', '9.1')}; designer ⇒ ${ag('agl-7-3-designer', '7.3')}.</p>

<h3>${t('Scrum says "accountabilities", and there are only three', 'Scrum nói "trách nhiệm", và chỉ có ba')}</h3>
<p>${t(
    'The 2020 Scrum Guide does not list "PM", "tester" or "BA". A Scrum Team has exactly three accountabilities: the <strong>Product Owner</strong> (maximises value, owns the backlog order), the <strong>Scrum Master</strong> (makes Scrum work, serves the team), and the <strong>Developers</strong> — everyone who builds the increment, including people who test or analyse. Companies still have job titles; inside the Scrum Team the titles do not create sub-teams. So "it is not my job, I am a tester" is not a Scrum answer: quality belongs to all Developers.',
    'Scrum Guide 2020 không có "PM", "tester" hay "BA". Một Scrum Team có đúng ba trách nhiệm: <strong>Product Owner</strong> (tối đa hoá giá trị, quyết thứ tự backlog), <strong>Scrum Master</strong> (làm cho Scrum chạy được, phục vụ đội), và <strong>Developers</strong> — mọi người làm ra phần sản phẩm, kể cả người test hay phân tích. Công ty vẫn có chức danh; bên trong Scrum Team chức danh không tạo ra nhóm con. Nên câu "đó không phải việc của em, em là tester" không phải câu trả lời kiểu Scrum: chất lượng là việc của mọi Developer.')} ${ng('https://scrumguides.org/scrum-guide.html', 'scrumguides.org')}</p>
${cl('warn', `<p><strong>${t('Common misunderstanding', 'Hiểu sai phổ biến')}</strong>: ${t('"Scrum Master = boss of the team". No — the Scrum Master has no authority to assign work; the Developers choose how to do the work in the sprint. A leader who acts like a boss and assigns every task by message is running something, but not Scrum.', '"Scrum Master = sếp của đội". Không — Scrum Master không có quyền giao việc; Developers tự quyết cách làm việc trong sprint. Một leader hành xử như sếp và giao từng việc bằng tin nhắn là đang chạy một thứ gì đó, nhưng không phải Scrum.')}</p>`)}

<h3>${t('Five students, many hats', 'Năm sinh viên, nhiều chiếc mũ')}</h3>
<p>${t('In SWP391 nobody is hired as a tester. The roles still exist — they become hats someone wears for a while:', 'Ở SWP391 không ai được thuê làm tester. Các vai vẫn tồn tại — chúng thành những chiếc mũ ai đó đội trong một thời gian:')}</p>
${bang([t('Role in a company', 'Vai ở công ty'), t('Who wears it in a 5-person SWP391 team', 'Ai đội nó trong nhóm SWP391 5 người'), t('Watch out', 'Cẩn thận')], [
    [t('Client + acceptance', 'Khách + nghiệm thu'), t('The lecturer (and the topic description)', 'Giảng viên (và mô tả đề tài)'), t('The lecturer is also the grader — every "can we change this?" goes in writing', 'Giảng viên cũng là người chấm — mọi câu "đổi cái này được không?" phải có văn bản')],
    ['PO', t('The leader, with the lecturer\'s approval of scope', 'Leader, với phạm vi được giảng viên đồng ý'), t('PO decides order, not who works harder', 'PO quyết thứ tự, không quyết ai phải làm nhiều hơn')],
    [t('Scrum Master / facilitator', 'Scrum Master / người điều phối'), t('The leader, or rotate weekly so the leader can code', 'Leader, hoặc luân phiên hằng tuần để leader còn code'), t('Rotating teaches everyone to run a standup', 'Luân phiên giúp ai cũng biết điều phối standup')],
    [t('Developers', 'Developers'), t('All five, each owning 3–4 screens end to end (UI + API + DB part)', 'Cả năm người, mỗi người sở hữu 3–4 màn hình từ đầu tới cuối (giao diện + API + phần CSDL)'), t('Never split by layer — LOC is graded per screen per person', 'Đừng chia theo tầng — LOC chấm theo màn hình từng người')],
    [t('Tester', 'Tester'), t('Cross-testing: C2 tests C3\'s screens, C3 tests C4\'s…', 'Test chéo: C2 test màn của C3, C3 test màn của C4…'), t('Nobody tests their own screen as the only test', 'Không ai tự test màn của mình làm lần test duy nhất')],
    [t('BA / document owner', 'BA / chủ tài liệu'), t('One member owns the SRS/SDS structure; each member writes the part for their screens', 'Một người giữ khung SRS/SDS; mỗi người viết phần cho màn hình của mình'), t('Documents by one person = that person has no time to code', 'Tài liệu do một người viết = người đó hết thời gian code')],
  ])}
${note(t('SWP391 grading of screens: ', 'Cách SWP391 chấm màn hình: ') + ac('software-development-project', 'swp391-4-complexity-loc-grade', t('Academy SWP391 4.3 — complexity × quality = LOC', 'Academy SWP391 4.3 — độ phức tạp × chất lượng = LOC')) + t('. Team roles and ethics in the subject itself: ', '. Vai trò và đạo đức nhóm trong chính môn học: ') + ac('software-development-project', 'swp391-1-1-de-tai-nhom-vai-tro', 'SWP391 1.1') + '.')}

<h3>${t('The leader\'s job, honestly', 'Việc của leader, nói thật')}</h3>
${bang([t('A good student leader does', 'Leader sinh viên giỏi làm'), t('A good student leader does not', 'Leader sinh viên giỏi KHÔNG làm')], [
    [t('Splits work so everyone owns screens and the split is written down', 'Chia việc để ai cũng sở hữu màn hình và cách chia được ghi lại'), t('Code everything "because it is faster"', 'Code hết "vì làm cho nhanh"')],
    [t('Checks the board every day and talks to anyone silent for a day', 'Xem bảng mỗi ngày và nói chuyện với ai im lặng quá một ngày'), t('Wait until the deadline to discover a problem', 'Chờ tới hạn chót mới phát hiện vấn đề')],
    [t('Owns integration: main always runs; reviews or assigns reviewers', 'Chịu trách nhiệm tích hợp: main luôn chạy; review hoặc phân người review'), t('Merge their own PRs without review', 'Tự merge PR của mình không qua review')],
    [t('Reports honestly to the lecturer with evidence', 'Báo cáo trung thực với giảng viên kèm bằng chứng'), t('Cover for a member who does nothing (then everyone loses)', 'Che cho thành viên không làm (rồi cả nhóm cùng thiệt)')],
    [t('Keeps 60–70 % of their time for their own screens', 'Giữ 60–70 % thời gian cho màn hình của chính mình'), t('Spend all week in meetings and messages', 'Dành cả tuần cho họp và nhắn tin')],
  ])}

<h3>${t('RACI: one owner per task, written down', 'RACI: mỗi việc một người chịu trách nhiệm, ghi ra giấy')}</h3>
<p>${t('A RACI matrix lists tasks in rows, people in columns, and one letter in each cell:', 'Ma trận RACI liệt kê việc theo hàng, người theo cột, mỗi ô một chữ:')}</p>
<ul>
<li>${t('<strong>R — Responsible</strong>: does the work. At least one per task.', '<strong>R — Responsible (thực hiện)</strong>: người làm việc đó. Mỗi việc ít nhất một.')}</li>
<li>${t('<strong>A — Accountable</strong>: owns the result, says "done", answers for it. <strong>Exactly one</strong> per task. A/R means the same person does and owns it.', '<strong>A — Accountable (chịu trách nhiệm cuối)</strong>: sở hữu kết quả, nói "xong", chịu trách nhiệm nếu hỏng. Mỗi việc <strong>đúng một</strong> người. A/R nghĩa là cùng một người vừa làm vừa chịu trách nhiệm.')}</li>
<li>${t('<strong>C — Consulted</strong>: asked before deciding (two-way).', '<strong>C — Consulted (được hỏi ý kiến)</strong>: được hỏi trước khi quyết (hai chiều).')}</li>
<li>${t('<strong>I — Informed</strong>: told after the decision (one-way).', '<strong>I — Informed (được báo)</strong>: được báo sau khi quyết (một chiều).')}</li>
</ul>
<p>${t('Why exactly one A? Remember Knight Capital\'s 97 warning emails sent to a group: when two people own something, each assumes the other is handling it. When nobody owns it, nobody does it.', 'Vì sao đúng một A? Nhớ 97 email cảnh báo của Knight Capital gửi cho "một nhóm": khi hai người cùng sở hữu, ai cũng tưởng người kia đang lo. Khi không ai sở hữu, không ai làm.')}</p>

<h3>${t('Lab: check a RACI with a script', 'Lab: kiểm một bảng RACI bằng script')}</h3>
<p>${t('A leader\'s first draft for LabFlow (the kind most of us write the first time):', 'Bản nháp đầu tiên của một leader cho LabFlow (kiểu bảng phần lớn chúng ta viết lần đầu):')}</p>
${out(MA.raciNhap)}
<p>${t('The rules a good RACI follows, as a 30-line checker:', 'Các luật một bảng RACI tốt phải đạt, viết thành bộ kiểm 30 dòng:')}</p>
${js(MA.kiemRaci)}
${out(doan(RA.raci, 'raci-nhap.csv'))}
<p>${t('Three problems — and the third is the real one: the leader is accountable for everything, which is the Team B pattern from the previous lesson. A second attempt moves each screen to its owner:', 'Ba lỗi — và lỗi thứ ba mới là lỗi thật: leader chịu trách nhiệm mọi thứ, chính là kiểu Nhóm B ở bài trước. Lần thứ hai, mỗi màn hình được giao cho chủ của nó:')}</p>
${out(doan(RA.raci, 'raci.csv'))}
<p>${t('Better, but the leader still owns 7 of 11 decisions. Hand the database design to C2 (who has the most data-heavy screens) and the review process to C3:', 'Khá hơn, nhưng leader vẫn giữ 7/11 quyết định. Giao thiết kế CSDL cho C2 (người có nhiều màn hình nặng dữ liệu nhất) và quy trình review cho C3:')}</p>
${out(MA.raciSua)}
${out(doan(RA.raci, 'raci-sua.csv'))}
${note(t('The 50 % threshold is a team rule of thumb, not a standard. What matters: the script makes the conversation concrete ("you hold A on 11 of 11 tasks") instead of a feeling ("you control everything").', 'Ngưỡng 50 % là quy ước tự đặt của nhóm, không phải tiêu chuẩn. Điều quan trọng: script biến cuộc nói chuyện thành cụ thể ("bạn giữ A ở 11/11 việc") thay vì cảm giác ("bạn ôm hết").'))}

<h3>${t('Situation at work (OJT, first week)', 'Tình huống đi làm (OJT, tuần đầu)')}</h3>
<p>${t(
    'A tester from the client side messages you directly on Teams: "the date picker accepts 31/02 — can you fix it today?". Who do you tell, and what do you answer? Think before opening.',
    'Một tester phía khách nhắn thẳng cho bạn trên Teams: "ô chọn ngày nhận 31/02 — sửa luôn hôm nay được không?". Bạn báo ai, trả lời gì? Nghĩ trước khi mở.')}</p>
${giai(t('A good answer', 'Cách trả lời tốt'), `<p>${t(
    'Reply politely that you received it and will confirm the plan shortly — no promise of "today". Tell your team leader (and BrSE if the client is Japanese) so it becomes a logged bug with an ID and priority; the leader/PM decides when it is fixed, because it may change the plan or even be out of scope. Then reply to the tester with the bug ID and the agreed date. Chapter 9 (Q&A and CR) and 11.4 go deeper.',
    'Trả lời lịch sự là đã nhận và sẽ xác nhận kế hoạch sớm — không hứa "hôm nay". Báo trưởng nhóm (và BrSE nếu khách Nhật) để nó thành một bug có mã và độ ưu tiên; leader/PM quyết khi nào sửa, vì có thể ảnh hưởng kế hoạch hoặc thậm chí ngoài phạm vi. Rồi trả lời tester kèm mã bug và ngày đã thống nhất. Chương 9 (Q&A và CR) và bài 11.4 đi sâu hơn.')}</p>`)}

<h3>🕵️ ${t('The attacker\'s angle: impersonating a role', 'Góc kẻ xấu: giả danh một vai trò')}</h3>
<p>${t(
    'Roles are trust. Attackers know a developer will act fast on a message from "the PM" or "IT support". In September 2022 an attacker got into Uber\'s internal systems after flooding a contractor with login push requests and then contacting them pretending to be Uber IT — Uber described this in its own security update. In business email compromise, criminals pose as a manager or client and ask for a transfer or a document. The defence is role-based too: know the real channel each role uses, and verify unusual requests through a second channel (call the person, ask in the team channel).',
    'Vai trò là niềm tin. Kẻ tấn công biết một lập trình viên sẽ làm ngay khi tin nhắn đến từ "PM" hay "IT". Tháng 9/2022, kẻ tấn công vào được hệ thống nội bộ Uber sau khi dội liên tục yêu cầu xác nhận đăng nhập vào điện thoại một nhân viên hợp đồng rồi liên lạc giả làm IT của Uber — chính Uber mô tả trong bản cập nhật an ninh của họ. Trong lừa đảo email doanh nghiệp, kẻ gian giả làm quản lý hoặc khách để đòi chuyển tiền hay gửi tài liệu. Cách phòng cũng dựa trên vai trò: biết kênh thật mỗi vai dùng, và xác minh yêu cầu bất thường qua kênh thứ hai (gọi điện, hỏi trong kênh nhóm).')}
${ng('https://www.uber.com/newsroom/security-update/', 'Uber — Security update (09/2022)')} · ${ag('agl-10-6-lua-dao', t('Lesson 10.6 — phishing aimed at developers', 'Bài 10.6 — lừa đảo nhắm vào lập trình viên'))}</p>

<h3>🧪 ${t('Practice (20 minutes)', 'Thực hành (20 phút)')}</h3>
<ol>
<li>${t('Write the RACI for your own team (or LabFlow if you have none): at least 10 rows, including every screen, "merge into main", "weekly report", "demo".', 'Viết RACI cho nhóm của bạn (hoặc LabFlow nếu chưa có nhóm): ít nhất 10 hàng, gồm mọi màn hình, "merge vào main", "báo cáo tuần", "demo".')}</li>
<li>${t('Save as CSV, run <code>node kiem-raci.mjs raci.csv</code> until it passes.', 'Lưu thành CSV, chạy <code>node kiem-raci.mjs raci.csv</code> tới khi đạt.')}</li>
<li>${t('Add one rule to the checker: nobody should be R on more than 40 % of rows. Test it on <code>raci-nhap.csv</code>.', 'Thêm một luật vào bộ kiểm: không ai được R ở quá 40 % số hàng. Thử trên <code>raci-nhap.csv</code>.')}</li>
</ol>
${giai(t('Solution for 3', 'Lời giải câu 3'), `<p>${t('Inside the <code>for (const n of nguoi)</code> loop add:', 'Trong vòng <code>for (const n of nguoi)</code> thêm:')}</p>
${js("if (demR[n] / dong.length > 0.4) loi.push(`${n} làm R ở ${demR[n]}/${dong.length} việc — quá tải`);")}
<p>${t('Real output: on <code>raci-nhap.csv</code> it adds "C1 làm R ở 7/11 việc — quá tải" (64 %). Surprise: <code>raci-sua.csv</code> now fails too — "C1 làm R ở 5/11 việc — quá tải" (45 %), because the leader is still R on review, merge and the weekly report. Two honest options: give "Merge vào main" to the reviewer of the day, or decide as a team that 45 % is acceptable for a leader and write that decision down. A checker does not decide for you; it makes the trade-off visible.', 'Output thật: trên <code>raci-nhap.csv</code> nó thêm "C1 làm R ở 7/11 việc — quá tải" (64 %). Bất ngờ: <code>raci-sua.csv</code> giờ cũng trượt — "C1 làm R ở 5/11 việc — quá tải" (45 %), vì leader vẫn R ở review, merge và báo cáo tuần. Hai lựa chọn trung thực: giao "Merge vào main" cho người review trong ngày, hoặc cả nhóm thống nhất 45 % là chấp nhận được với leader và ghi quyết định đó lại. Bộ kiểm không quyết thay bạn; nó làm cho sự đánh đổi hiện ra.')}</p>`)}
<p>🛠 <strong>${t('Project milestone (part 1 of Section 0)', 'Mốc dự án (phần 1 của Mục 0)')}</strong>: ${t('your RACI passes the checker and is pinned in your team channel and in the repo README.', 'bảng RACI của nhóm bạn qua bộ kiểm và được ghim trong kênh nhóm cùng README của repo.')}</p>

${phongVan([
    [t('"What is the difference between a Scrum Master and a project manager?"', '"Scrum Master khác project manager thế nào?"'), t('A PM plans and controls scope, schedule, cost and reports up; a Scrum Master has no authority over work, coaches the team in Scrum and removes impediments. In practice many companies combine them; say what you saw in your team.', 'PM lập kế hoạch và kiểm soát phạm vi, tiến độ, chi phí, báo cáo lên trên; Scrum Master không có quyền giao việc, huấn luyện đội dùng Scrum và gỡ vật cản. Thực tế nhiều công ty gộp hai vai; kể điều bạn thấy ở nhóm mình.')],
    [t('"As a team leader, how did you divide the work?"', '"Làm trưởng nhóm, bạn chia việc thế nào?"'), t('By feature/screen with one owner each, written in a RACI, roughly equal complexity per person, cross-testing, and a rule that the leader keeps time for their own screens. Mention a number (each of 5 members owned 3–4 screens).', 'Theo chức năng/màn hình, mỗi màn một chủ, ghi trong RACI, độ phức tạp gần đều mỗi người, test chéo, và quy ước leader giữ thời gian cho màn hình của mình. Nêu một con số (5 người, mỗi người 3–4 màn hình).')],
    [t('"A tester reports a bug you think is not a bug. What do you do?"', '"Tester báo một lỗi mà bạn cho là không phải lỗi. Bạn làm gì?"'), t('Reproduce it, check the requirement/acceptance criteria together; if the spec is unclear it is a question for the BA/PO, not a fight between dev and tester. Record the decision on the ticket.', 'Tái hiện, cùng xem yêu cầu/tiêu chí chấp nhận; nếu spec không rõ thì đó là câu hỏi cho BA/PO, không phải cuộc cãi nhau dev–tester. Ghi quyết định vào ticket.')],
  ], en)}

${thuatNgu([
    ['Product Owner', t('Accountable for product value and the order of the backlog.', 'Chịu trách nhiệm giá trị sản phẩm và thứ tự backlog.')],
    ['Scrum Master', t('Accountable for the team\'s effectiveness with Scrum; coach, not boss.', 'Chịu trách nhiệm đội dùng Scrum hiệu quả; huấn luyện viên, không phải sếp.')],
    ['Developers (Scrum)', t('Everyone who creates the increment, including testing and analysis.', 'Mọi người tạo ra phần sản phẩm, kể cả test và phân tích.')],
    ['BrSE', t('Bridge engineer between an offshore team and a foreign client.', 'Kỹ sư cầu nối giữa đội offshore và khách nước ngoài.')],
    ['RACI', t('Responsible / Accountable / Consulted / Informed matrix; exactly one A per task.', 'Ma trận Thực hiện / Chịu trách nhiệm / Được hỏi / Được báo; mỗi việc đúng một A.')],
    [t('cross-testing', 'cross-testing (test chéo)'), t('Members test each other\'s features.', 'Thành viên test tính năng của nhau.')],
  ], en)}

${tomTat([
    t('Company roles: dev, tester/QA, BA, PO, Scrum Master, PM, tech lead, BrSE, designer — each produces something specific.', 'Vai ở công ty: dev, tester/QA, BA, PO, Scrum Master, PM, tech lead, BrSE, designer — mỗi vai tạo ra một thứ cụ thể.'),
    t('Scrum 2020 has three accountabilities: Product Owner, Scrum Master, Developers.', 'Scrum 2020 có ba trách nhiệm: Product Owner, Scrum Master, Developers.'),
    t('In a 5-student team roles become hats; everyone is a developer owning screens end to end.', 'Ở nhóm 5 sinh viên, vai thành mũ; ai cũng là developer sở hữu màn hình từ đầu tới cuối.'),
    t('RACI: at least one R, exactly one A per task; a leader with every A is a warning sign.', 'RACI: mỗi việc ít nhất một R, đúng một A; leader giữ mọi chữ A là dấu hiệu cảnh báo.'),
    t('Attackers impersonate roles; verify unusual requests on a second channel.', 'Kẻ xấu giả danh vai trò; xác minh yêu cầu bất thường qua kênh thứ hai.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-0-2-cong-cu', t('0.2 — The toolbox', '0.2 — Bộ công cụ'))}.</p>
`);
};

export default {
  title: '0.1 — Roles: dev, tester, BA, PM, PO, Scrum Master|||0.1 — Vai trò: dev, tester, BA, PM, PO, Scrum Master',
  slug: 'agl-0-1-vai-tro',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chín vai trò trong đội phần mềm và mỗi vai tạo ra gì, ba trách nhiệm của Scrum 2020, các vai gộp vào nhóm 5 SV SWP391 thế nào, việc của leader, ma trận RACI kiểm bằng script chạy thật, góc kẻ xấu giả danh vai trò (Uber 2022).',
  content: L01(true) + L01(false),
};
