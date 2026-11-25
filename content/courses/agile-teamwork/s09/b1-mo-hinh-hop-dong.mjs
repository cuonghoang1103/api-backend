/**
 * 9.1 — Mô hình hợp đồng và vai trò (agl-9-1-mo-hinh-hop-dong). Soạn 24/11/2026.
 * Nguồn: Bộ luật Dân sự Nhật (民法) sửa đổi hiệu lực 01/04/2020 — 請負 (Điều 632) và 準委任 (Điều 656, thêm loại "theo thành quả" Điều 648-2);
 * vụ Suruga Bank v. IBM Japan: Toà quận Tokyo 03/2012 (~7,4 tỷ yên), Toà cấp cao Tokyo 26/09/2013 (~4,17 tỷ yên) — tóm tắt SOFTIC
 * (softic.or.jp/semi/2013/6_131219/study.pdf). Không nêu quy định nội bộ của công ty cụ thể nào.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo } from '../_chung.mjs';

export const L91 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.1 — Contract models and roles: ODC, fixed price, T&amp;M, onsite/offshore, BrSE', '9.1 — Mô hình hợp đồng và vai trò: ODC, trọn gói, T&amp;M, onsite/offshore, BrSE')}</h2>
<p class="lead">${t(
    'In an outsourcing company the contract is invisible to a junior developer — yet it decides why your leader rejects "just one more button", why you log hours every evening, and who you are allowed to email. This lesson explains the three contract models, the people around you, and what each model changes in your daily work.',
    'Ở công ty outsourcing, lập trình viên mới không bao giờ thấy bản hợp đồng — vậy mà chính nó quyết định vì sao leader từ chối "thêm một nút nhỏ thôi", vì sao tối nào bạn cũng phải ghi giờ công, và bạn được phép email cho ai. Bài này giải thích ba mô hình hợp đồng, những người quanh bạn, và mỗi mô hình đổi gì trong việc hằng ngày của bạn.')}</p>

<h3>${t('A first-week situation', 'Tình huống tuần đầu OJT')}</h3>
<p>${t(
    'You are implementing the patient registration screen. While testing, you notice users cannot see their password. Adding an "eye" icon to show/hide the password takes you twenty minutes, so you add it and mention it proudly at stand-up. Your leader asks you to remove it. Why would anyone reject a free improvement? By the end of this lesson you will be able to explain it — and know the right way to propose it.',
    'Bạn đang làm màn hình đăng ký bệnh nhân. Lúc tự test, bạn thấy người dùng không xem lại được mật khẩu vừa gõ. Thêm biểu tượng "con mắt" ẩn/hiện mật khẩu mất có hai mươi phút, nên bạn thêm luôn rồi hào hứng kể ở buổi standup. Leader bảo bạn gỡ ra. Sao lại từ chối một cải tiến miễn phí? Hết bài này bạn sẽ giải thích được — và biết cách đề xuất đúng.')}</p>

<h3>${t('Everyday analogy: three ways to get a house built', 'Liên tưởng đời thường: ba cách thuê người xây nhà')}</h3>
${bang([t('Way', 'Cách'), t('What you pay for', 'Bạn trả tiền cho gì'), t('Who carries the risk of overrun', 'Ai chịu rủi ro vượt'), t('Software equivalent', 'Tương đương phần mềm')], [
    [t('Turnkey contract: "a 3-storey house per these drawings for 2 billion VND"', 'Khoán trọn gói: "nhà 3 tầng theo bản vẽ này, 2 tỷ"'), t('The finished house', 'Ngôi nhà hoàn chỉnh'), t('The builder — extra days are his loss', 'Nhà thầu — làm lâu thì nhà thầu lỗ'), '<strong>Fixed price</strong>'],
    [t('Hiring workers by the day', 'Thuê thợ theo ngày công'), t('Days worked', 'Số ngày công'), t('You — every extra day costs you', 'Bạn — thêm ngày nào trả ngày đó'), '<strong>Time &amp; Materials (T&amp;M)</strong>'],
    [t('Keeping your own crew all year for a big estate', 'Giữ hẳn một đội thợ riêng cả năm cho một khu nhà lớn'), t('The crew, per month', 'Cả đội, theo tháng'), t('You decide what they build next', 'Bạn quyết định họ làm gì tiếp'), '<strong>ODC / '+t('dedicated team', 'đội riêng')+'</strong>'],
  ])}
<p>${t(
    'Change the drawings halfway through a turnkey contract and the builder will (rightly) ask for more money and time. That is exactly what a change request is in software.',
    'Đang xây khoán trọn gói mà đổi bản vẽ thì nhà thầu sẽ (rất đúng) đòi thêm tiền và thêm thời gian. Trong phần mềm, đó chính là change request (yêu cầu thay đổi).')}</p>

<h3>${t('1. Fixed price (turnkey)', '1. Trọn gói (fixed price)')}</h3>
<p>${t(
    'The customer and vendor agree on a <strong>scope</strong> (a list of functions and documents), a <strong>price</strong> and a <strong>deadline</strong>. The vendor earns the same amount whether the work takes 800 or 1,200 man-days, so every hour spent on something outside the scope is a loss. In Japanese contracts this is <em>ukeoi</em> (請負, contract for work): the vendor is obliged to deliver a finished result.',
    'Khách và bên làm (vendor) chốt <strong>phạm vi</strong> (danh sách chức năng và tài liệu), <strong>giá</strong> và <strong>hạn</strong>. Vendor nhận đúng số tiền đó dù làm hết 800 hay 1.200 ngày công, nên mỗi giờ bỏ vào việc ngoài phạm vi là một giờ lỗ. Trong hợp đồng Nhật đây là <em>ukeoi</em> (請負, hợp đồng nhận thầu): vendor có nghĩa vụ giao một kết quả hoàn chỉnh.')}</p>
<ul>
<li>${t('<strong>What it changes for you:</strong> the scope document (requirements list, BD) is the boundary. Anything not in it — even an "obvious" improvement — goes through a Q&amp;A or a change request (lesson 9.5), never straight into code.', '<strong>Đổi gì với bạn:</strong> tài liệu phạm vi (danh sách yêu cầu, BD) là ranh giới. Thứ gì không có trong đó — kể cả cải tiến "hiển nhiên" — phải đi qua Q&amp;A hoặc change request (bài 9.5), không bao giờ vào thẳng code.')}</li>
<li>${t('Estimates matter enormously: the price was computed from them (lesson 9.6).', 'Ước lượng cực kỳ quan trọng: giá được tính từ chính nó (bài 9.6).')}</li>
<li>${t('Quality is checked at acceptance: the customer tests (UAT) and may refuse delivery until defects are fixed — at the vendor\'s cost.', 'Chất lượng được kiểm lúc nghiệm thu: khách test (UAT) và có thể không nhận cho tới khi sửa xong lỗi — vendor chịu chi phí.')}</li>
</ul>

<h3>${t('2. Time &amp; Materials (T&amp;M)', '2. Theo thời gian và nguồn lực (T&amp;M)')}</h3>
<p>${t(
    'The customer pays for effort actually spent — so many man-months at an agreed rate per role. Scope can move; the customer carries the risk of overrun. In Japan the close equivalent is <em>jun-inin</em> (準委任, quasi-mandate): the vendor owes careful, professional work, not a guaranteed result. Since the revised Japanese Civil Code took effect on 1 April 2020, a quasi-mandate can also be paid "per outcome", so always ask which type your project uses.',
    'Khách trả tiền cho công sức thực bỏ ra — bao nhiêu man-month theo đơn giá đã chốt cho từng vai trò. Phạm vi được phép xê dịch; khách chịu rủi ro vượt. Ở Nhật, gần tương đương là <em>jun-inin</em> (準委任, hợp đồng uỷ thác dịch vụ): vendor có nghĩa vụ làm cẩn thận, chuyên nghiệp, không bảo đảm một kết quả cụ thể. Từ khi Bộ luật Dân sự Nhật sửa đổi có hiệu lực 01/04/2020, loại này cũng có thể trả "theo thành quả", nên hãy hỏi dự án của bạn thuộc kiểu nào.')}</p>
<ul>
<li>${t('<strong>What it changes for you:</strong> your <strong>timesheet</strong> (effort log) becomes an invoice line. Log every day, truthfully, against the right task code. Hours logged to the wrong task, or invented at the end of the month, are a billing error the customer can audit.', '<strong>Đổi gì với bạn:</strong> <strong>timesheet</strong> (ghi giờ công) của bạn trở thành một dòng trên hoá đơn. Ghi mỗi ngày, đúng sự thật, đúng mã công việc. Ghi nhầm việc, hay cuối tháng mới "bịa" lại, là sai hoá đơn — và khách có quyền kiểm tra.')}</li>
<li>${t('The customer often sees your velocity directly and can re-prioritise every sprint.', 'Khách thường thấy trực tiếp tốc độ làm việc của đội và có thể đổi ưu tiên mỗi sprint.')}</li>
</ul>

<h3>${t('3. ODC — Offshore Development Center (dedicated team, "labo")', '3. ODC — Offshore Development Center (đội riêng, "labo")')}</h3>
<p>${t(
    'A team on the vendor\'s premises works long-term for one customer, usually paid per person per month. Japanese customers call it <em>labo-gata kaihatsu</em> (ラボ型開発, "lab-style development"). It behaves like a T&amp;M contract that lasts years: the customer sets priorities, the team accumulates domain knowledge, and the security rules of that customer apply inside the ODC (separate room or network, badges, no phones — chapter 10).',
    'Một đội ngồi ở văn phòng vendor làm lâu dài cho một khách, thường tính tiền theo đầu người mỗi tháng. Khách Nhật gọi là <em>labo-gata kaihatsu</em> (ラボ型開発, "phát triển kiểu lab"). Nó giống một hợp đồng T&amp;M kéo dài nhiều năm: khách đặt ưu tiên, đội tích luỹ hiểu biết nghiệp vụ, và quy định bảo mật của khách đó áp dụng bên trong ODC (phòng hoặc mạng riêng, thẻ ra vào, không mang điện thoại — chương 10).')}</p>

<h3>${t('Side by side', 'Đặt cạnh nhau')}</h3>
${bang(['', t('Fixed price', 'Trọn gói'), 'T&amp;M', 'ODC'], [
    [t('Customer pays for', 'Khách trả cho'), t('An agreed result', 'Kết quả đã chốt'), t('Effort spent', 'Công sức bỏ ra'), t('A team per month', 'Một đội theo tháng')],
    [t('Scope', 'Phạm vi'), t('Frozen; changes = CR', 'Đóng băng; đổi = CR'), t('Flexible', 'Linh hoạt'), t('Flexible, backlog of the customer', 'Linh hoạt, theo backlog của khách')],
    [t('Overrun risk', 'Rủi ro vượt'), 'Vendor', t('Customer', 'Khách'), t('Customer', 'Khách')],
    [t('Typical process', 'Quy trình hay gặp'), t('V-model, heavy documents', 'V-model, nhiều tài liệu'), t('Agile or hybrid', 'Agile hoặc lai'), t('Agile/hybrid, long-lived', 'Agile/lai, lâu dài')],
    [t('What a dev must watch', 'Dev phải để ý'), t('Never code outside scope; estimate honestly', 'Không code ngoài phạm vi; ước lượng trung thực'), t('Accurate timesheet', 'Timesheet chính xác'), t('Customer\'s security rules, domain knowledge', 'Quy định bảo mật của khách, hiểu nghiệp vụ')],
  ])}
${note(t('Real projects mix models: a fixed-price phase 1, then T&amp;M maintenance; or an ODC that takes small fixed-price packages. Ask your leader on day one: "What type of contract is this project, and what is in scope?"', 'Dự án thật hay trộn mô hình: giai đoạn 1 trọn gói, rồi bảo trì T&amp;M; hoặc một ODC nhận thêm gói nhỏ trọn gói. Ngày đầu, hãy hỏi leader: "Dự án mình hợp đồng kiểu gì, phạm vi gồm những gì?"'))}

<h3>${t('Onsite, offshore, nearshore', 'Onsite, offshore, nearshore')}</h3>
<ul>
<li>${t('<strong>Onsite</strong>: you work at the customer\'s office (e.g. in Tokyo) — closest to requirements, most expensive.', '<strong>Onsite</strong>: bạn làm ở văn phòng khách (ví dụ ở Tokyo) — gần yêu cầu nhất, đắt nhất.')}</li>
<li>${t('<strong>Offshore</strong>: the team works in Vietnam for a customer abroad — cheaper, but every question crosses language, culture and time zone. Most OJT positions are offshore.', '<strong>Offshore</strong>: đội làm ở Việt Nam cho khách nước ngoài — rẻ hơn, nhưng mọi câu hỏi đều phải vượt qua ngôn ngữ, văn hoá và múi giờ. Đa số vị trí OJT là offshore.')}</li>
<li>${t('<strong>Nearshore</strong>: a nearby country or region with similar time zone.', '<strong>Nearshore</strong>: nước/vùng gần, cùng múi giờ tương tự.')}</li>
<li>${t('A common mix: one or two people onsite (often the BrSE) plus the main team offshore.', 'Kiểu trộn hay gặp: một hai người onsite (thường là BrSE) cộng đội chính offshore.')}</li>
</ul>

<h3>${t('Who is who around you', 'Ai là ai quanh bạn')}</h3>
${bang([t('Role', 'Vai trò'), t('Does', 'Làm gì'), t('You go to them when…', 'Bạn tìm họ khi…')], [
    ['<strong>PM</strong> (Project Manager)', t('Owns scope, schedule, cost, risk, the contract relationship', 'Chịu trách nhiệm phạm vi, tiến độ, chi phí, rủi ro, quan hệ hợp đồng'), t('Through your leader: delays, scope questions', 'Qua leader: trễ hạn, câu hỏi về phạm vi')],
    ['<strong>BrSE</strong> (Bridge System Engineer, ブリッジSE)', t('Engineer who speaks the customer\'s language: translates and clarifies requirements, sends Q&amp;A, attends customer meetings, often reviews designs', 'Kỹ sư nói được tiếng của khách: dịch và làm rõ yêu cầu, gửi Q&amp;A, dự họp với khách, thường review thiết kế'), t('Your question needs the customer', 'Câu hỏi của bạn cần khách trả lời')],
    [t('<strong>Comtor</strong> (communicator)', '<strong>Comtor</strong> (phiên dịch IT)'), t('Interpreter/translator for documents and meetings, not necessarily an engineer', 'Phiên dịch tài liệu và cuộc họp, không nhất thiết là kỹ sư'), t('You need a document translated', 'Cần dịch tài liệu')],
    [t('<strong>Team leader / Tech lead</strong>', '<strong>Team leader / Tech lead</strong>'), t('Splits work, reviews code, first escalation point', 'Chia việc, review code, nơi báo cáo đầu tiên'), t('Every day: progress, blockers, review', 'Hằng ngày: tiến độ, vướng mắc, review')],
    [t('<strong>QA</strong> (Quality Assurance)', '<strong>QA</strong> (đảm bảo chất lượng)'), t('In many Vietnamese outsourcing firms: audits the <em>process</em> — are reviews recorded, documents versioned, metrics collected (CMMI/ISO)', 'Ở nhiều công ty outsourcing Việt Nam: kiểm tra <em>quy trình</em> — có ghi biên bản review, quản lý phiên bản tài liệu, thu số liệu không (CMMI/ISO)'), t('An audit finds your review record missing', 'Đợt audit phát hiện thiếu biên bản review')],
    [t('<strong>Tester / QC</strong>', '<strong>Tester / QC</strong>'), t('Tests the <em>product</em>: integration and system tests, files bugs', 'Test <em>sản phẩm</em>: test tích hợp, test hệ thống, ghi bug'), t('A bug is assigned to you', 'Bị giao bug')],
    [t('<strong>Customer</strong> (PO, their PM, their users)', '<strong>Khách</strong> (PO, PM bên khách, người dùng)'), t('Owns requirements, answers Q&amp;A, accepts the delivery', 'Sở hữu yêu cầu, trả lời Q&amp;A, nghiệm thu'), t('Usually NOT directly as a junior — via BrSE/leader', 'Thường KHÔNG trực tiếp khi bạn còn mới — qua BrSE/leader')],
  ])}
${cl('warn', t('<strong>Do not contact the customer on your own.</strong> In an offshore project every message to the customer is part of the contract record. Ask your leader which channel you may use (chat group, Q&amp;A sheet, email with BrSE in CC). Writing to the customer privately — even to be helpful — can create a commitment the PM never priced.', '<strong>Đừng tự liên lạc với khách.</strong> Ở dự án offshore, mọi tin nhắn gửi khách đều là một phần hồ sơ hợp đồng. Hỏi leader bạn được dùng kênh nào (nhóm chat, sheet Q&amp;A, email có BrSE trong CC). Tự nhắn riêng cho khách — dù có ý tốt — có thể tạo ra một cam kết mà PM chưa hề tính giá.'))}

<h3>${t('Back to the "eye" icon', 'Quay lại biểu tượng "con mắt"')}</h3>
<p>${t(
    'The project is fixed price; the screen is defined in the design document. Your icon (1) is not in scope, so nobody will pay for it; (2) has no test cases, so it ships untested; (3) changes the screen the customer will compare against the document during acceptance — a difference is reported as a defect; (4) creates an expectation: next time the customer will assume small extras are free. The right move: write it as a Q&amp;A proposal ("We propose adding a show/hide icon to ITM-05. Effort 0.5 MD including tests. Shall we add it?"). If the customer says yes, it becomes a documented, priced change.',
    'Dự án là trọn gói; màn hình đã được định nghĩa trong tài liệu thiết kế. Biểu tượng của bạn (1) không có trong phạm vi, nên không ai trả tiền cho nó; (2) không có test case, nên ra hàng mà chưa ai kiểm; (3) làm màn hình khác tài liệu — lúc nghiệm thu khách so với tài liệu và ghi đó là lỗi; (4) tạo kỳ vọng: lần sau khách sẽ coi việc nhỏ thêm vào là miễn phí. Cách đúng: viết thành một đề xuất trong Q&amp;A ("Chúng tôi đề xuất thêm biểu tượng ẩn/hiện cho ITM-05. Công 0,5 MD gồm cả test. Có thêm không ạ?"). Khách đồng ý thì nó thành một thay đổi có tài liệu, có giá.')}</p>

<h3>${t('A real case: when the vendor fails to manage the project', 'Chuyện thật: khi vendor không quản lý được dự án')}</h3>
<p>${t(
    'Suruga Bank v. IBM Japan. In 2004 the Japanese bank contracted IBM Japan to replace its core banking system; the project was abandoned and the bank sued. In March 2012 the Tokyo District Court ordered IBM to pay about 7.4 billion yen; on 26 September 2013 the Tokyo High Court reduced it to about 4.17 billion yen, still holding the vendor liable for breaching its <strong>project-management duty</strong> — the duty to manage the project and to warn the customer about risks in time. Japanese IT contracts are read in the light of cases like this, which is why vendors document everything: meeting minutes, Q&amp;A answers, change approvals.',
    'Vụ Suruga Bank kiện IBM Nhật. Năm 2004, ngân hàng Nhật này thuê IBM Nhật thay hệ thống ngân hàng lõi; dự án bị bỏ dở và ngân hàng khởi kiện. Tháng 3/2012 Toà quận Tokyo buộc IBM trả khoảng 7,4 tỷ yên; ngày 26/09/2013 Toà cấp cao Tokyo giảm còn khoảng 4,17 tỷ yên, nhưng vẫn xác định vendor vi phạm <strong>nghĩa vụ quản lý dự án</strong> — nghĩa vụ điều hành dự án và cảnh báo khách về rủi ro kịp thời. Hợp đồng IT ở Nhật được hiểu dưới ánh sáng những vụ như vậy, nên vendor ghi lại mọi thứ: biên bản họp, câu trả lời Q&amp;A, phê duyệt thay đổi.')}
${ng('https://softic.or.jp/semi/2013/6_131219/study.pdf', t('SOFTIC case summary (Japanese, PDF)', 'Tóm tắt vụ án của SOFTIC (tiếng Nhật, PDF)'))}. ${t('Lesson 9.5 shows the opposite case, where the customer lost.', 'Bài 9.5 kể vụ ngược lại, khi khách thua.')}</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<p>${t('For each situation say which contract model it suggests and what you, as a developer, must do differently.', 'Với mỗi tình huống, cho biết gợi ý mô hình hợp đồng nào và bạn — lập trình viên — phải làm gì khác đi.')}</p>
<ol>
<li>${t('Your leader asks everyone to fill the timesheet before 18:00 every day, against task codes.', 'Leader yêu cầu cả đội ghi timesheet trước 18:00 mỗi ngày, theo mã công việc.')}</li>
<li>${t('The kickoff slide says: "Delivery 15/03, 42 screens, acceptance test 2 weeks".', 'Slide kickoff ghi: "Giao 15/03, 42 màn hình, nghiệm thu 2 tuần".')}</li>
<li>${t('You need a badge to enter a separate room; phones stay in a locker; the customer\'s PO joins your sprint review every two weeks.', 'Bạn phải quẹt thẻ để vào một phòng riêng; điện thoại để trong tủ; PO của khách dự sprint review hai tuần một lần.')}</li>
<li>${t('The customer\'s tester writes in chat: "Could you also make the list sortable? Small thing."', 'Tester bên khách nhắn: "Bạn làm thêm cho danh sách sắp xếp được nhé? Việc nhỏ thôi."')}</li>
</ol>
${giai(t('Suggested answers', 'Đáp án gợi ý'), `<ol>
<li>${t('T&amp;M (or ODC): effort is billed. Log accurately, daily, to the correct task code; never round to "8 h" by habit.', 'T&amp;M (hoặc ODC): công được tính tiền. Ghi chính xác, hằng ngày, đúng mã việc; đừng theo thói quen ghi tròn "8 h".')}</li>
<li>${t('Fixed price: scope and date fixed. Stay inside the 42 screens; raise anything unclear as Q&amp;A early; estimate honestly.', 'Trọn gói: phạm vi và ngày cố định. Chỉ làm trong 42 màn hình; chỗ nào chưa rõ hỏi Q&amp;A sớm; ước lượng trung thực.')}</li>
<li>${t('ODC: follow the customer\'s security rules strictly; learn the domain; priorities come from the customer\'s backlog.', 'ODC: theo đúng quy định bảo mật của khách; học nghiệp vụ; ưu tiên lấy từ backlog của khách.')}</li>
<li>${t('Whatever the model, do not just do it. Reply politely that you will check, then tell your leader/BrSE: it is either a Q&amp;A (was sorting intended?) or a change request with an estimate.', 'Mô hình nào cũng vậy, đừng làm luôn. Trả lời lịch sự là bạn sẽ kiểm tra, rồi báo leader/BrSE: hoặc là Q&amp;A (sắp xếp có nằm trong yêu cầu không?), hoặc là change request kèm ước lượng.')}</li>
</ol>`)}

${phongVan([
    [t('What is the difference between fixed-price and T&amp;M from a developer\'s point of view?', 'Từ góc nhìn lập trình viên, trọn gói khác T&amp;M thế nào?'), t('Fixed price: scope is the boundary, overruns are the vendor\'s loss, so changes go through CR and estimates must be honest. T&amp;M: effort is billed, so accurate timesheets matter and scope can change sprint by sprint. Then give an example from your project.', 'Trọn gói: phạm vi là ranh giới, vượt là vendor lỗ, nên thay đổi phải qua CR và ước lượng phải trung thực. T&amp;M: công được tính tiền, nên timesheet chính xác là quan trọng và phạm vi có thể đổi theo từng sprint. Rồi kể một ví dụ từ dự án của bạn.')],
    [t('What does a BrSE do, and how would you work with one?', 'BrSE làm gì, bạn sẽ làm việc với BrSE thế nào?'), t('Bridges language and requirements between the customer and the offshore team. I would send questions in writing, already formulated as closed questions with a proposal, referencing document IDs, so the BrSE can forward them without rewriting.', 'Làm cầu nối ngôn ngữ và yêu cầu giữa khách và đội offshore. Tôi gửi câu hỏi bằng văn bản, viết sẵn dạng câu hỏi đóng có đề xuất, ghi rõ mã tài liệu, để BrSE chuyển đi mà không phải viết lại.')],
    [t('A customer asks you directly for a small extra feature. What do you do?', 'Khách nhờ trực tiếp bạn thêm một tính năng nhỏ. Bạn làm gì?'), t('Acknowledge politely, do not commit, inform my leader/BrSE the same day, and let it go through Q&amp;A/CR with an estimate. Explain why: untested, unpriced changes hurt both sides.', 'Ghi nhận lịch sự, không hứa, báo leader/BrSE ngay trong ngày, để nó đi qua Q&amp;A/CR có ước lượng. Giải thích vì sao: thay đổi không test, không tính giá thì hại cả hai bên.')],
  ], en)}

${thuatNgu([
    [t('Fixed price / ukeoi (請負)', 'Trọn gói / ukeoi (請負)'), t('Contract for a defined result at a fixed price', 'Hợp đồng giao kết quả xác định với giá cố định')],
    [t('T&amp;M / jun-inin (準委任)', 'T&amp;M / jun-inin (準委任)'), t('Paying for effort or service actually provided', 'Trả theo công sức/dịch vụ thực tế')],
    ['ODC / labo', t('Dedicated long-term team for one customer', 'Đội riêng dài hạn cho một khách')],
    [t('Man-month (MM, 人月)', 'Man-month (MM, 人月)'), t('One person working one month — the usual billing unit', 'Một người làm một tháng — đơn vị tính tiền thường gặp')],
    ['BrSE', t('Bridge engineer between customer and offshore team', 'Kỹ sư cầu nối giữa khách và đội offshore')],
    [t('Scope', 'Phạm vi (scope)'), t('The agreed list of what will be delivered', 'Danh sách đã chốt những gì sẽ giao')],
    [t('Change request (CR)', 'Change request (CR)'), t('A formal, estimated, approved change to scope', 'Thay đổi phạm vi chính thức, có ước lượng, có phê duyệt')],
    ['Timesheet', t('Daily log of effort per task code', 'Ghi giờ công hằng ngày theo mã việc')],
  ], en)}

${tomTat([
    t('Fixed price = scope frozen, vendor carries overrun ⇒ no code outside scope, honest estimates.', 'Trọn gói = phạm vi đóng băng, vendor chịu vượt ⇒ không code ngoài phạm vi, ước lượng trung thực.'),
    t('T&amp;M/ODC = customer pays effort ⇒ accurate daily timesheets; priorities come from the customer.', 'T&amp;M/ODC = khách trả theo công ⇒ timesheet chính xác hằng ngày; ưu tiên do khách đặt.'),
    t('Talk to the customer through the agreed channel (BrSE, Q&amp;A), never privately.', 'Liên lạc khách qua kênh đã thống nhất (BrSE, Q&amp;A), không nhắn riêng.'),
    t('Even a "free" improvement is a change: propose it in writing with an estimate.', 'Cải tiến "miễn phí" cũng là thay đổi: đề xuất bằng văn bản kèm ước lượng.'),
  ], en)}
<p>${t('Related: the company side of offers and contracts — ', 'Liên quan: phía hợp đồng lao động và offer — ')}${cs('interview-prep', 'pv-9-3-offer', t('Interview prep 9.3', 'Chuẩn bị phỏng vấn 9.3'))}; ${t('next', 'tiếp theo')}: ${ag('agl-9-2-vong-doi-v-model', t('9.2 — the V-model day to day', '9.2 — V-model ngày thường'))}.</p>
`);
};
