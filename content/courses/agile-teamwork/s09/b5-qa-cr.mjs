/**
 * 9.5 — Q&A list với khách và change request (agl-9-5-qa-cr). Soạn 24/11/2026.
 * Vụ Đại học Y Asahikawa v. NTT East: Toà quận Asahikawa 29/03/2016 (sơ thẩm), Toà cấp cao Sapporo 31/08/2017 (phúc thẩm, phía bệnh viện
 * chịu trách nhiệm chính, phải trả ~1,41 tỷ yên). Số mục yêu cầu (625 nhận trước khi đóng băng; sau đóng băng 171 yêu cầu, nhận 136) theo
 * loạt bài phân tích phán quyết của @IT (ITmedia) 10/2017: atmarkit.itmedia.co.jp/ait/articles/1710/23/news018.html và …/1710/30/news017.html.
 * Bản tiếng Anh của cùng tình huống: khoá tieng-anh-ky-thuat-di-lam ch5 (tak-5-*). Quản lý thay đổi lý thuyết: SWR302 7.5–7.6.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, ac, ag, cs, ng, vo, taiMau } from '../_chung.mjs';
import { QA, bangHtml, tsv } from '../_mau.mjs';

export const L95 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.5 — The Q&amp;A list and change requests (CR)', '9.5 — Q&amp;A list với khách và change request (CR)')}</h2>
<p class="lead">${t(
    'Offshore developers rarely talk to the customer, yet they discover most of the gaps in the requirements. The bridge is a shared spreadsheet: the Q&amp;A list (QA表). A good question gets answered in a day and turns into a test case; a bad one waits a week, or produces an answer that changes the scope without anyone noticing. This lesson teaches the process, how to write questions that get fast answers, and how to recognise the moment a question has become a change request.',
    'Dev offshore hiếm khi nói chuyện trực tiếp với khách, nhưng lại là người phát hiện phần lớn lỗ hổng trong yêu cầu. Cây cầu là một bảng tính dùng chung: Q&amp;A list (QA表). Câu hỏi tốt được trả lời trong một ngày và biến thành test case; câu hỏi tồi chờ cả tuần, hoặc nhận về câu trả lời làm đổi phạm vi mà không ai để ý. Bài này dạy quy trình, cách viết câu hỏi được trả lời nhanh, và cách nhận ra lúc một câu hỏi đã biến thành change request.')}</p>

<h3>${t('Why a spreadsheet and not chat?', 'Sao là bảng tính mà không phải chat?')}</h3>
<ul>
<li>${t('<strong>Traceability</strong>: each answer has an ID that code, tests and document versions can cite (QA-001 → DD v1.3 → TC-REG-019).', '<strong>Truy vết</strong>: mỗi câu trả lời có mã để code, test và phiên bản tài liệu dẫn lại (QA-001 → DD v1.3 → TC-REG-019).')}</li>
<li>${t('<strong>Status</strong>: everyone sees what is still open and who is late.', '<strong>Trạng thái</strong>: ai cũng thấy câu nào còn mở và ai đang trễ.')}</li>
<li>${t('<strong>Contract record</strong>: in a dispute, the Q&amp;A list shows what the customer decided and when. Chat messages get lost; the sheet is versioned.', '<strong>Hồ sơ hợp đồng</strong>: khi tranh chấp, Q&amp;A list cho thấy khách đã quyết gì, khi nào. Tin nhắn chat thì trôi mất; sheet thì có phiên bản.')}</li>
</ul>
${note(t('Chat is fine for "is the test server down?". Anything that affects behaviour, scope or documents goes into the Q&amp;A list — if it was agreed in chat or a meeting, copy it into the list the same day and ask for confirmation.', 'Chat dùng cho "server test đang sập à?". Thứ gì ảnh hưởng hành vi, phạm vi hay tài liệu thì phải vào Q&amp;A list — nếu đã chốt qua chat hay trong họp, chép vào list ngay trong ngày và xin xác nhận.'))}

<h3>${t('The process', 'Quy trình')}</h3>
<pre><code>${t(
`Dev finds a gap ─▶ writes Q&A row (draft) ─▶ Leader/BrSE reviews & merges duplicates
      ▲                                              │  translates, sends (daily batch)
      │                                              ▼
Dev updates code, ◀── Leader assigns follow-up ◀── Customer answers in the sheet
tests, documents         (doc update, CR?)              │
                                                         └─ answer changes scope? ─▶ CR`,
`Dev phát hiện chỗ hổng ─▶ viết dòng Q&A (nháp) ─▶ Leader/BrSE soát, gộp câu trùng
      ▲                                                    │  dịch, gửi (gom theo ngày)
      │                                                    ▼
Dev sửa code, test,  ◀── Leader giao việc tiếp ◀──── Khách trả lời trong sheet
tài liệu                  (sửa tài liệu, CR?)              │
                                                           └─ câu trả lời đổi phạm vi? ─▶ CR`)}</code></pre>

<h3>${t('The columns', 'Các cột')}</h3>
${taiMau('QA-list-mau.xlsx', en)}
${bangHtml(QA, { chiCot: [1, 2, 3, 4, 5, 6, 9, 12, 13] })}
<p>${t('Full sheet (14 columns) to paste into Excel/Google Sheets:', 'Nguyên sheet (14 cột) để dán vào Excel/Google Sheets:')}</p>
${tsv(QA)}

<h3>${t('Writing a question that gets answered in one day', 'Viết câu hỏi được trả lời trong một ngày')}</h3>
${bang([t('Rule', 'Quy tắc'), t('Bad', 'Tồi'), t('Good', 'Tốt')], [
    [t('Say <strong>where</strong>: document, version, sheet, ID', 'Nói <strong>ở đâu</strong>: tài liệu, phiên bản, sheet, mã'), t('"About the phone field…"', '"Về ô số điện thoại…"'), t('"AT-DD-PAT-REG-01 v1.2, Item definitions, ITM-03"', '"AT-DD-PAT-REG-01 v1.2, Định nghĩa mục, ITM-03"')],
    [t('Ask a <strong>closed</strong> question (yes/no or A/B)', 'Hỏi câu <strong>đóng</strong> (có/không hoặc A/B)'), t('"How should phone numbers work?"', '"Số điện thoại xử lý thế nào ạ?"'), t('"If the user types 090-123-4567, do we show MSG-E004 or strip the dashes?"', '"Người dùng gõ 090-123-4567 thì báo MSG-E004 hay tự bỏ dấu gạch?"')],
    [t('Always add <strong>your proposal</strong> and its impact', 'Luôn kèm <strong>đề xuất</strong> và ảnh hưởng của nó'), t('(no proposal)', '(không có đề xuất)'), t('"We propose MSG-E004 (no document change) plus a placeholder example."', '"Chúng tôi đề xuất báo MSG-E004 (không phải sửa tài liệu) và thêm chữ gợi ý."')],
    [t('<strong>One</strong> question per row', '<strong>Một</strong> câu mỗi dòng'), t('"Also, what about the birth date and the password?"', '"Còn ngày sinh và mật khẩu thì sao ạ?"'), t('Separate rows QA-003, QA-006', 'Tách thành QA-003, QA-006')],
    [t('Give a <strong>due date</strong> and say what is blocked', 'Ghi <strong>hạn</strong> và việc đang bị chặn'), t('(no date)', '(không có hạn)'), t('"Due 25/11 — coding of BTN-01 step 3 waits for this."', '"Hạn 25/11 — code BTN-01 bước 3 đang chờ câu này."')],
    [t('Make it <strong>self-contained</strong> — a screenshot or example data', 'Viết cho <strong>tự đủ ý</strong> — kèm ảnh hoặc dữ liệu ví dụ'), t('"As discussed…"', '"Như đã trao đổi…"'), t('"Example: An.Nguyen@Example.com vs an.nguyen@example.com"', '"Ví dụ: An.Nguyen@Example.com và an.nguyen@example.com"')],
  ])}
<p>${t(
    'The proposal is the single most important column. A Japanese customer who receives "How should this work?" must think, discuss internally and write a design — that takes days. A customer who receives "We assume X; is that correct?" can answer "OK" in a minute. It also shows that the team understood the system.',
    'Đề xuất là cột quan trọng nhất. Khách Nhật nhận câu "Cái này xử lý thế nào?" phải suy nghĩ, bàn nội bộ, viết thiết kế — mất nhiều ngày. Khách nhận câu "Chúng tôi giả định X, như vậy có đúng không?" trả lời "OK" trong một phút. Nó còn cho thấy đội đã hiểu hệ thống.')}</p>
<p>${t('The English wording of the same patterns ("We assume… Could you confirm…") is practised in ', 'Cách viết bằng tiếng Anh cho đúng những mẫu này ("We assume… Could you confirm…") được luyện ở ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-5-2-cau-hoi-dong', t('Technical English 5.2', 'Tiếng Anh kỹ thuật 5.2'))}.</p>

<h3>${t('Statuses and follow-up', 'Trạng thái và theo dõi')}</h3>
<ul>
<li>${t('<strong>Draft → Sent → Answered → Closed</strong>. "Closed" means the answer has been applied: document updated (new version), code changed, test case added. Who closes it is set by the project — usually the leader or the asker after checking.', '<strong>Nháp → Đã gửi → Đã trả lời → Đã đóng</strong>. "Đã đóng" nghĩa là câu trả lời đã được áp dụng: tài liệu đã sửa (lên phiên bản), code đã đổi, test case đã thêm. Ai đóng do dự án quy định — thường là leader hoặc người hỏi sau khi kiểm.')}</li>
<li>${t('While waiting, code according to your proposal and mark it (<code>// QA-003: chờ trả lời, đang theo đề xuất</code>). Mention open items in the daily report (lesson 9.7) until they close.', 'Trong lúc chờ, code theo đề xuất và đánh dấu (<code>// QA-003: chờ trả lời, đang theo đề xuất</code>). Nhắc các câu còn mở trong báo cáo ngày (bài 9.7) cho tới khi đóng.')}</li>
<li>${t('Overdue answers are a project risk — escalate through the leader, not by sending the same question again.', 'Câu trả lời quá hạn là rủi ro dự án — báo qua leader, đừng tự gửi lại câu hỏi.')}</li>
</ul>

<h3>${t('When an answer becomes a change request', 'Khi câu trả lời thành change request')}</h3>
<p>${t('A Q&amp;A clarifies what was <em>already</em> agreed. A change request (CR, 仕様変更) asks for something <em>new or different</em>. Signs that you are looking at a CR:', 'Q&amp;A làm rõ điều <em>đã</em> thống nhất. Change request (CR, 仕様変更) đòi thứ <em>mới hoặc khác</em>. Dấu hiệu bạn đang nhìn thấy một CR:')}</p>
<ul>
<li>${t('The answer adds a function, screen, field, message, report or integration that is not in the scope documents (QA-008: send an activation e-mail).', 'Câu trả lời thêm chức năng, màn hình, mục, thông báo, báo cáo hay tích hợp không có trong tài liệu phạm vi (QA-008: gửi email kích hoạt).')}</li>
<li>${t('It reverses something already approved and implemented ("actually, allow dashes").', 'Nó đảo ngược điều đã duyệt và đã làm ("thôi cho phép dấu gạch đi").')}</li>
<li>${t('It changes non-functional requirements (performance, browsers, languages).', 'Nó đổi yêu cầu phi chức năng (hiệu năng, trình duyệt, ngôn ngữ).')}</li>
<li>${t('Your honest estimate for applying it is larger than "noise" — the project defines a threshold.', 'Ước lượng trung thực để làm nó lớn hơn mức "lặt vặt" — dự án tự đặt ngưỡng.')}</li>
</ul>
<p>${t('A developer does not decide that something is a CR — you <strong>flag</strong> it ("this looks like a scope change; estimate 2.5 MD") and the PM handles it with the customer. A typical CR record contains:', 'Lập trình viên không quyết cái gì là CR — bạn <strong>cắm cờ</strong> ("cái này có vẻ đổi phạm vi; ước lượng 2,5 MD") và PM xử lý với khách. Một bản ghi CR thường có:')}</p>
${bang([t('Field', 'Mục'), t('Example (CR-003)', 'Ví dụ (CR-003)')], [
    [t('Origin', 'Nguồn'), 'QA-008'],
    [t('Description', 'Mô tả'), t('Send an activation e-mail after registration; activation link valid 24 h; status 0 → 1 on click', 'Gửi email kích hoạt sau đăng ký; liên kết hiệu lực 24 giờ; bấm vào thì status 0 → 1')],
    [t('Impact analysis', 'Phân tích ảnh hưởng'), t('New screen SCR-PAT-ACT-01, new table activation_token, mail server settings, MSG-I001 kept; BD, DD, UT/IT specs to update', 'Màn hình mới SCR-PAT-ACT-01, bảng mới activation_token, cấu hình máy chủ mail, giữ MSG-I001; phải sửa BD, DD, UT/IT spec')],
    [t('Effort', 'Công'), t('2.5 MD (design 0.5, code 1, test + evidence 0.75, review 0.25)', '2,5 MD (thiết kế 0,5, code 1, test + evidence 0,75, review 0,25)')],
    [t('Schedule / cost', 'Tiến độ / chi phí'), t('Release 1 +2 days, or move to release 2', 'Bản phát hành 1 thêm 2 ngày, hoặc dời sang bản 2')],
    [t('Decision', 'Quyết định'), t('Approved / rejected / deferred, by whom, date', 'Duyệt / từ chối / hoãn, ai, ngày nào')],
  ])}
${cl('warn', t('<strong>Never start coding a CR before it is approved.</strong> If the customer rejects or defers it, the hours you spent cannot be billed, and the half-built feature becomes a source of bugs.', '<strong>Không bao giờ code CR trước khi được duyệt.</strong> Nếu khách từ chối hay hoãn, công bạn bỏ ra không tính tiền được, và tính năng làm dở thành nguồn bug.'))}
<p>${t('Change-control theory (policy, CCB, impact analysis) is in ', 'Lý thuyết kiểm soát thay đổi (chính sách, CCB, phân tích ảnh hưởng) ở ')}${ac('software-requirements', 'swr302-7-5-ch28-change-control', 'SWR302 7.5')} ${t('and', 'và')} ${ac('software-requirements', 'swr302-7-6-ch28-impact-analysis', '7.6')}.</p>

<h3>${t('A real case: 171 requests after the freeze', 'Chuyện thật: 171 yêu cầu sau khi đã đóng băng')}</h3>
<p>${t(
    'Asahikawa Medical University (Japan) contracted NTT East to build a hospital information system. During development the hospital\'s doctors kept adding requirements; according to the analysis of the judgment published by ITmedia\'s @IT, NTT East accepted 625 additional items and then <strong>froze the specification</strong> with the university\'s agreement — after which 171 more requests arrived, of which it accepted 136. The project slipped, the university cancelled the contract and both sides sued. The Asahikawa District Court (2016) split the blame; on 31 August 2017 the Sapporo High Court found the <strong>university</strong> mainly responsible — the vendor had warned repeatedly, managed the requests and frozen the specification, while the customer had breached its duty to cooperate — and ordered it to pay about 1.4 billion yen.',
    'Đại học Y Asahikawa (Nhật) thuê NTT East xây hệ thống thông tin bệnh viện. Trong lúc làm, các bác sĩ liên tục thêm yêu cầu; theo bài phân tích phán quyết đăng trên @IT (ITmedia), NTT East đã nhận 625 mục bổ sung rồi <strong>đóng băng đặc tả</strong> với sự đồng ý của trường — sau đó vẫn có thêm 171 yêu cầu, và họ nhận 136. Dự án trễ, trường huỷ hợp đồng, hai bên kiện nhau. Toà quận Asahikawa (2016) chia trách nhiệm; ngày 31/08/2017 Toà cấp cao Sapporo xác định <strong>phía trường</strong> chịu trách nhiệm chính — vendor đã cảnh báo nhiều lần, quản lý yêu cầu và đóng băng đặc tả, còn khách vi phạm nghĩa vụ hợp tác — và buộc trường trả khoảng 1,4 tỷ yên.')}
${ng('https://atmarkit.itmedia.co.jp/ait/articles/1710/23/news018.html', '@IT, 23/10/2017')} · ${ng('https://atmarkit.itmedia.co.jp/ait/articles/1710/30/news017.html', '@IT, 30/10/2017')} ${t('(Japanese).', '(tiếng Nhật).')}</p>
<p>${t('What saved the vendor was paper: the frozen specification, the written warnings, the record of which requests were accepted and which were not. That paper is built, row by row, by people like you filling the Q&amp;A list and flagging CRs. Compare with the Suruga case in lesson 9.1, where the vendor lost.', 'Thứ cứu vendor là giấy tờ: đặc tả đã đóng băng, những lần cảnh báo bằng văn bản, hồ sơ yêu cầu nào được nhận và yêu cầu nào không. Đống giấy đó được xây, từng dòng một, bởi chính những người như bạn điền Q&amp;A list và cắm cờ CR. So với vụ Suruga ở bài 9.1, nơi vendor thua.')}</p>

<h3>${t('Hacker\'s corner: the "customer" who asks for data', 'Góc hacker: "khách" xin dữ liệu')}</h3>
<p>${t('Attackers love the Q&amp;A channel because it is trusted. A message "from the customer\'s new PM" asking you to attach the test database "to answer QA-012 faster", or to send the staging admin password by e-mail, is a classic pretext. Rules: answers go only into the agreed sheet; data and credentials never travel through Q&amp;A; anything unusual is verified through a second channel with your leader. Chapter 10 covers this in depth (', 'Kẻ tấn công thích kênh Q&amp;A vì nó được tin. Một tin nhắn "từ PM mới bên khách" nhờ bạn gửi kèm database test "để trả lời QA-012 cho nhanh", hay gửi mật khẩu admin môi trường staging qua email, là kịch bản giả danh kinh điển. Quy tắc: câu trả lời chỉ đi vào đúng sheet đã thống nhất; dữ liệu và mật khẩu không bao giờ đi qua Q&amp;A; thứ gì bất thường phải xác minh qua kênh thứ hai cùng leader. Chương 10 nói kỹ (')}${ag('agl-10-6-lua-dao', t('lesson 10.6', 'bài 10.6'))}).</p>

<h3>${t('Exercise: Q&amp;A or CR?', 'Bài tập: Q&amp;A hay CR?')}</h3>
<ol>
<li>${t('The DD does not say whether the e-mail check is case-sensitive.', 'DD không nói kiểm email có phân biệt hoa/thường không.')}</li>
<li>${t('The customer answers QA-003: "Also add a field for a guardian\'s name when the patient is under 18."', 'Khách trả lời QA-003: "Thêm luôn mục tên người giám hộ khi bệnh nhân dưới 18 tuổi."')}</li>
<li>${t('MSG-E004 has a typo in the DD.', 'MSG-E004 trong DD có lỗi chính tả.')}</li>
<li>${t('The customer asks to support Internet Explorer 11.', 'Khách yêu cầu hỗ trợ Internet Explorer 11.')}</li>
<li>${t('The customer says in a meeting: "the list should show 50 rows, not 20" — the BD says 20.', 'Khách nói trong họp: "danh sách hiện 50 dòng chứ không phải 20" — BD ghi 20.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('Q&amp;A (clarification) — with a proposal.', 'Q&amp;A (làm rõ) — kèm đề xuất.')}</li>
<li>${t('CR: new item, new rule, new DB column — flag it, do not just add it.', 'CR: mục mới, quy tắc mới, cột DB mới — cắm cờ, không tự thêm.')}</li>
<li>${t('Q&amp;A (document defect) — confirm the correct text; usually no CR.', 'Q&amp;A (lỗi tài liệu) — xác nhận câu đúng; thường không phải CR.')}</li>
<li>${t('CR (non-functional scope; large testing impact) — and a risk to discuss: IE11 support ended on 15 June 2022.', 'CR (phạm vi phi chức năng; ảnh hưởng test lớn) — và là rủi ro cần bàn: Microsoft đã ngừng hỗ trợ IE11 từ 15/06/2022.')}</li>
<li>${t('Changes an approved document ⇒ write it into the Q&amp;A list the same day for written confirmation; the PM decides whether it is a small agreed change or a CR.', 'Đổi tài liệu đã duyệt ⇒ ghi vào Q&amp;A list ngay trong ngày để xin xác nhận bằng văn bản; PM quyết đó là thay đổi nhỏ đã thống nhất hay là CR.')}</li>
</ol>`)}

${phongVan([
    [t('How do you clarify unclear requirements with a customer you cannot talk to directly?', 'Bạn làm rõ yêu cầu với khách mà mình không nói chuyện trực tiếp được thế nào?'), t('Through the Q&amp;A list: precise location, one closed question per row, a proposal with its impact, a due date; I code according to the proposal while waiting and track it in my daily report.', 'Qua Q&amp;A list: vị trí chính xác, mỗi dòng một câu đóng, có đề xuất và ảnh hưởng, có hạn; trong lúc chờ code theo đề xuất và theo dõi trong báo cáo ngày.')],
    [t('What is the difference between a clarification and a change request?', 'Làm rõ yêu cầu khác change request thế nào?'), t('A clarification resolves ambiguity in what was agreed; a CR adds or changes scope and therefore needs impact analysis, an estimate and approval before work starts.', 'Làm rõ là gỡ chỗ mơ hồ trong điều đã thống nhất; CR thêm hay đổi phạm vi nên cần phân tích ảnh hưởng, ước lượng và phê duyệt trước khi làm.')],
    [t('The customer asks for a change in a meeting and wants it by tomorrow. What do you do?', 'Khách yêu cầu thay đổi trong họp và muốn có ngay mai. Bạn làm gì?'), t('Acknowledge, not commit; write it down in the minutes and Q&amp;A the same day; give my leader an estimate and impact; let the PM agree the schedule. If it is urgent and small, it can still be fast — but recorded.', 'Ghi nhận, không hứa; ghi vào biên bản và Q&amp;A trong ngày; đưa leader ước lượng và ảnh hưởng; để PM chốt tiến độ. Nếu gấp và nhỏ thì vẫn làm nhanh được — nhưng phải có ghi lại.')],
  ], en)}

${thuatNgu([
    [t('Q&amp;A list (QA表)', 'Q&amp;A list (QA表)'), t('Shared sheet of questions and answers between vendor and customer', 'Bảng câu hỏi – trả lời dùng chung giữa vendor và khách')],
    [t('Closed question', 'Câu hỏi đóng'), t('A question answerable with yes/no or a choice', 'Câu trả lời được bằng có/không hoặc chọn phương án')],
    [t('Change request (CR, 仕様変更)', 'Change request (CR, 仕様変更)'), t('Formal request to change agreed scope', 'Yêu cầu chính thức đổi phạm vi đã thống nhất')],
    [t('Specification freeze', 'Đóng băng đặc tả'), t('Point after which changes go through CR only', 'Mốc sau đó mọi thay đổi chỉ đi qua CR')],
    [t('Impact analysis', 'Phân tích ảnh hưởng'), t('Listing documents, code, tests, schedule affected by a change', 'Liệt kê tài liệu, code, test, tiến độ bị ảnh hưởng bởi thay đổi')],
    [t('Scope creep', 'Phình phạm vi (scope creep)'), t('Uncontrolled growth of scope through small additions', 'Phạm vi phình dần không kiểm soát qua những bổ sung nhỏ')],
  ], en)}

${tomTat([
    t('Everything that affects behaviour or scope goes into the Q&amp;A list, not only chat.', 'Mọi thứ ảnh hưởng hành vi hay phạm vi phải vào Q&amp;A list, không chỉ nằm trong chat.'),
    t('Location + one closed question + proposal + due date = fast answers.', 'Vị trí + một câu đóng + đề xuất + hạn = trả lời nhanh.'),
    t('Closed means applied: document version, code, test case.', 'Đã đóng nghĩa là đã áp dụng: phiên bản tài liệu, code, test case.'),
    t('New or changed scope ⇒ flag as CR, estimate, wait for approval.', 'Phạm vi mới hoặc đổi ⇒ cắm cờ CR, ước lượng, chờ duyệt.'),
  ], en)}
<p>${t('English version of the same skills: ', 'Bản tiếng Anh của cùng kỹ năng: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-5-1-qa-list', t('Technical English chapter 5', 'Tiếng Anh kỹ thuật chương 5'))}. ${t('Next', 'Tiếp theo')}: ${ag('agl-9-6-uoc-luong-man-day', t('9.6 — estimating in man-days', '9.6 — ước lượng bằng man-day'))}.</p>
`);
};
