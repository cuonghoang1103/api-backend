/**
 * 8.4 — Phát triển: phản hồi, 1:1 và sự nghiệp (agl-8-4-phat-trien — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: góp ý cho thành viên (SBI, 1:1 của trưởng nhóm) ⇒ agl-6-5; kể chuyện STAR khi phỏng vấn ⇒ pv-2-2-star, agl-9-4-tong-ket;
 * offer/hợp đồng ⇒ pv-9-3-offer; NDA khi kể thành tích ⇒ agl-10-1. Bài này dạy phía NGƯỜI MỚI: xin và nhận phản hồi, 1:1 do mình chủ động,
 * kế hoạch 30-60-90 kiểm được, sổ thành tích (brag document).
 * Lab THẬT (scratchpad/agt/lab/ch8): kiem-muc-tieu.mjs (v1 0/7, v2 lần 1 6/7 ⇒ viết lại ⇒ 7/7); tao-brag.mjs từ sổ việc 90 ngày (dữ liệu minh hoạ)
 * + git log thật của repo lich-hen-api; LẦN 1 tách CSV bằng split(',') cắt "4,2 s" ⇒ sửa theo RFC 4180.
 * Nguồn: Julia Evans "Get your work recognized: write a brag document" 28/06/2019; Google re:Work "Understanding team effectiveness" (Project Aristotle).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L84 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 8 · Lesson 8.4', 'Chương 8 · Bài 8.4', `
<h2>${t('8.4 — Growing: feedback, 1:1s and career', '8.4 — Phát triển: phản hồi, 1:1 và sự nghiệp')}</h2>
<p class="lead">${t(
    'Doing good work is half of growing; the other half is making sure the right people know what you did, hearing early what you should change, and agreeing on what "doing well" means before you are evaluated. None of that happens by itself for a newcomer. This lesson gives you four tools you run yourself: how to ask for feedback that is usable, a 1:1 you own, a 30-60-90 plan whose goals can be checked by a script, and a brag document generated from your own work log.',
    'Làm việc tốt là một nửa của phát triển; nửa còn lại là đảm bảo đúng người biết bạn đã làm gì, nghe sớm điều bạn nên thay đổi, và thống nhất "làm tốt" nghĩa là gì trước khi bị đánh giá. Với người mới, không điều nào tự xảy ra. Bài này cho bạn bốn công cụ do chính bạn vận hành: cách xin phản hồi dùng được, buổi 1:1 do bạn chủ động, kế hoạch 30-60-90 có mục tiêu kiểm được bằng script, và sổ thành tích sinh từ nhật ký công việc của chính bạn.')}</p>

<h3>${t('Everyday picture: learning to drive', 'Liên tưởng đời thường: học lái xe')}</h3>
<p>${t(
    'A good driving instructor says after each lap "you braked late at the second corner" — not "you’re doing fine" for three weeks and then "fail" on exam day. As a learner you can make any instructor better by asking the precise question: "At the roundabout, was my lane change too early?" Work is the same, except nobody is assigned to sit next to you every lap. You have to ask.',
    'Thầy dạy lái giỏi nói sau mỗi vòng "em phanh muộn ở khúc cua thứ hai" — chứ không phải "ổn đấy" ba tuần liền rồi "trượt" vào ngày thi. Là học viên, bạn làm bất kỳ thầy nào tốt lên được bằng cách hỏi đúng câu: "Ở vòng xuyến, em chuyển làn sớm quá không ạ?" Đi làm cũng vậy, chỉ khác là không ai được phân công ngồi cạnh bạn mỗi vòng. Bạn phải hỏi.')}</p>

<h3>${t('1. Asking for feedback people can actually give', '1. Xin phản hồi mà người ta trả lời được')}</h3>
${bang([t('Instead of', 'Thay vì'), t('Ask', 'Hãy hỏi'), t('Why it works', 'Vì sao hiệu quả')], [
    [t('"Am I doing OK?"', '"Em làm ổn không ạ?"'), t('"In PR LH-212, what is one thing I should do differently next time?"', '"Ở PR LH-212, có một điều gì em nên làm khác lần sau không ạ?"'), t('Concrete artefact, one item, future-facing', 'Có sản phẩm cụ thể, một điều, nhìn về sau')],
    [t('"Any feedback?" at the end of a meeting', '"Có góp ý gì không ạ?" cuối buổi họp'), t('"Was my demo of the reschedule screen too long for the customer?"', '"Phần demo màn đổi lịch của em có dài quá với khách không ạ?"'), t('Easy to answer in 20 seconds', 'Trả lời được trong 20 giây')],
    [t('Waiting for the 3-month review', 'Chờ tới buổi đánh giá 3 tháng'), t('One question every week in the 1:1', 'Mỗi tuần một câu trong buổi 1:1'), t('No surprises at evaluation time', 'Không có bất ngờ lúc đánh giá')],
  ])}
<p>${t(
    '<strong>Receiving it:</strong> say thank you, ask for an example if you do not understand ("could you point me to where?"), do not defend in the same breath, and come back a week later with what you changed. The person who sees their advice used will give you more. The leader’s side — giving feedback with situation, behaviour, impact — is in ',
    '<strong>Nhận phản hồi:</strong> nói cảm ơn, xin ví dụ nếu chưa hiểu ("anh chỉ giúp em chỗ nào ạ?"), đừng giải thích chống chế ngay câu sau, và một tuần sau quay lại kể mình đã đổi gì. Người thấy góp ý của mình được dùng sẽ góp ý cho bạn nhiều hơn. Phía trưởng nhóm — góp ý theo tình huống, hành vi, tác động — ở ')}${ag('agl-6-5-thanh-vien', t('lesson 6.5', 'bài 6.5'))}${t('; receiving code review specifically, ', '; nhận review code nói riêng, ')}${ag('agl-4-3-nhan-review', '4.3')}.</p>

<h3>${t('2. The 1:1 is your meeting', '2. Buổi 1:1 là cuộc họp của bạn')}</h3>
<p>${t(
    'A 1:1 is a regular (weekly or every two weeks), private, 20–30 minute talk with your mentor or manager. It is not a status meeting — status goes in the standup and the daily report. Bring the agenda yourself, in a shared document both of you can see, newest on top:',
    '1:1 là buổi nói chuyện riêng, đều đặn (hằng tuần hoặc hai tuần một lần), 20–30 phút với mentor hoặc quản lý. Đó không phải họp báo cáo tình trạng — tình trạng đã nằm ở daily và báo cáo ngày. Bạn tự mang chương trình, trong một tài liệu chung cả hai cùng xem, mục mới nhất ở trên cùng:')}</p>
${out(t('## 1:1 — 16/07/2027 (mentor: Minh)\nFrom me\n- Blocked: staging login expired twice — who owns staging accounts? (LH-205 adds it to README)\n- Feedback question: in LH-212 review, was splitting test/fix commits useful or noise?\n- Growth: I would like a 5-point feature in August (30-60-90 plan, 60-day goal)\nFrom mentor\n- …\nActions\n- [ ] me: ask IT for a staging service account, by 19/07\n- [ ] Minh: pick a 5-point ticket for sprint 15',
    '## 1:1 — 16/07/2027 (mentor: anh Minh)\nTừ em\n- Vướng: đăng nhập staging hết hạn hai lần — ai quản lý tài khoản staging? (LH-205 đã thêm vào README)\n- Câu hỏi xin góp ý: ở review LH-212, tách commit test/sửa có ích hay rườm rà ạ?\n- Phát triển: em muốn nhận một tính năng 5 điểm trong tháng 8 (kế hoạch 30-60-90, mục tiêu 60 ngày)\nTừ mentor\n- …\nViệc cần làm\n- [ ] em: xin IT tài khoản dịch vụ staging, trước 19/07\n- [ ] anh Minh: chọn ticket 5 điểm cho sprint 15'))}
<p>${t(
    'Three standing headings — blocked, a feedback question, growth — keep it from turning into small talk or a status report. The action list makes the next 1:1 start with "did we do what we said?".',
    'Ba mục cố định — vướng mắc, một câu hỏi xin góp ý, phát triển — giữ cho buổi 1:1 không thành chuyện phiếm hay báo cáo tình trạng. Danh sách việc cần làm khiến buổi sau bắt đầu bằng "mình đã làm điều đã hứa chưa?".')}</p>

<h3>${t('3. Lab: a 30-60-90 plan whose goals can be checked', '3. Lab: kế hoạch 30-60-90 có mục tiêu kiểm được')}</h3>
<p>${t('Agree it with your mentor in week one. Two drafts:', 'Thống nhất với mentor ngay tuần đầu. Hai bản nháp:')}</p>
${out(MA.kh1)}
${out(MA.kh2)}
<p>${t('A goal is checkable if it names a visible product and a number or a date. The script flags vague verbs:', 'Một mục tiêu kiểm được nếu nó nêu sản phẩm nhìn thấy được và một con số hoặc một ngày. Script đánh dấu các động từ mơ hồ:')}</p>
${js(MA.kiemMucTieu)}
${out('$ node kiem-muc-tieu.mjs 30-60-90-v1.md 30-60-90-v2.md\n' + RA.mucTieuLan1.split('\n').slice(1).join('\n'))}
<p>${t(
    'Draft 1 scores 0/7: "learn", "understand", "try hard", "better" — at day 90 nobody, including you, can say whether they happened. Draft 2 scored 6/7 on the first run. The flagged goal — "be on staging bug duty for one week, triage new bugs the same day" — <em>is</em> checkable to a human; the script simply found no product word. Instead of arguing with the script, the goal was made sharper:',
    'Bản 1 được 0/7: "làm quen", "hiểu", "cố gắng", "tốt hơn" — tới ngày 90 không ai, kể cả bạn, nói được chúng đã xảy ra chưa. Bản 2 lần chạy đầu được 6/7. Mục bị đánh dấu — "trực hỗ trợ bug staging 1 tuần, phân loại bug mới trong ngày" — với người đọc <em>là</em> kiểm được; script chỉ không thấy từ chỉ sản phẩm. Thay vì cãi với script, mục tiêu được viết sắc hơn:')}</p>
${out('- Trực hỗ trợ bug staging 1 tuần (tuần 37): mọi bug mới có người nhận + ưu tiên trong ngày, tổng kết số bug trong ticket trực')}
${out(RA.mucTieuLan2)}
${cl('tip', `<p>${t('The script is a nudge, not a judge: it caught seven vague goals and one false alarm. The false alarm still led to a better goal — "same day" became "every new bug has an owner and a priority", with a ticket to prove it.', 'Script là lời nhắc, không phải quan toà: nó bắt bảy mục mơ hồ và một báo động nhầm. Báo động nhầm vẫn dẫn tới mục tiêu tốt hơn — "trong ngày" thành "mọi bug mới có người nhận và ưu tiên", có ticket làm bằng chứng.')}</p>`)}

<h3>${t('4. Lab: a brag document from your own log', '4. Lab: sổ thành tích từ nhật ký của chính bạn')}</h3>
<p>${t(
    'Julia Evans’ essay "Get your work recognized: write a brag document" (28 June 2019) makes the point plainly: "your manager doesn’t remember everything you did" — and when they argue for your promotion or contract, they need the list. She also says to include the "fuzzy work": reviews, helping others, documentation (',
    'Bài viết "Get your work recognized: write a brag document" của Julia Evans (28/06/2019) nói thẳng: "quản lý của bạn không nhớ hết mọi thứ bạn đã làm" — và khi họ đề xuất tăng lương hay giữ bạn lại, họ cần danh sách đó. Bà cũng khuyên ghi cả "việc khó đo": review, giúp người khác, viết tài liệu (')}${ng('https://jvns.ca/blog/brag-documents/', 'jvns.ca, 2019')}${t('). Keep a one-line-per-item work log as you go; generate the document before each review:', '). Ghi sổ việc mỗi việc một dòng trong lúc làm; sinh tài liệu trước mỗi buổi đánh giá:')}</p>
${out(MA.viecCsv)}
${js(MA.taoBrag)}
<p>${t('First run — read the July section carefully:', 'Lần chạy đầu — đọc kỹ phần tháng 7:')}</p>
${out(RA.bragLan1.split('\n').slice(0, 10).join('\n'))}
<p>${t(
    'LH-224 reads "report from 4" — the best number in the whole document cut in half. The first version split lines with <code>split(\',\')</code>, and the Vietnamese decimal comma in "4,2 s" became a column boundary. The fix is the CSV rule from lesson 2.4 (RFC 4180): quote a field that contains a comma, and parse quotes. After the fix:',
    'LH-224 hiện "báo cáo tháng từ 4" — con số đẹp nhất của cả tài liệu bị cắt mất nửa. Bản đầu tách dòng bằng <code>split(\',\')</code>, và dấu phẩy thập phân kiểu Việt trong "4,2 s" thành ranh giới cột. Cách sửa là luật CSV ở bài 2.4 (RFC 4180): đặt trường có dấu phẩy trong nháy kép, và đọc theo nháy. Sau khi sửa:')}</p>
${out(RA.brag)}
<p>${t(
    'The generated draft gives you the summary line (6 tickets, 14 points, one round of 7 reviews, two docs contributions), a month-by-month list, and three rows with no result yet. "Fixed the date format in reminder e-mails" means little; "reminder e-mails showed 07/13 to Vietnamese patients; after LH-219, 0 complaints in two weeks" is what an evaluator can use. Fill the results while you still remember them — that is the whole point of writing as you go.',
    'Bản nháp sinh ra cho bạn dòng tóm tắt (6 ticket, 14 điểm, một đợt 7 review, hai đóng góp tài liệu), danh sách theo tháng, và ba dòng chưa có kết quả. "Sửa định dạng ngày trong email nhắc lịch" ít ý nghĩa; "email nhắc lịch hiện 07/13 cho bệnh nhân Việt; sau LH-219, hai tuần không còn phàn nàn" mới là thứ người đánh giá dùng được. Điền kết quả khi còn nhớ — đó chính là lý do ghi trong lúc làm.')}</p>
${note(t('The work log is illustrative data for the world of this chapter; the commit count comes from the real lab repository. Results like "0.3 s" must be measured, not estimated — write how you measured them.', 'Sổ việc là dữ liệu minh hoạ trong thế giới của chương; số commit lấy từ repo lab thật. Kết quả như "0,3 s" phải đo, không ước — ghi cách bạn đo.'))}

<h3>${t('Why teams where you can ask are better teams', 'Vì sao đội mà ai cũng dám hỏi lại là đội tốt hơn')}</h3>
<p>${t(
    'Google’s internal study of its own teams (Project Aristotle) found that who is on a team matters less than how the team works together, and named <em>psychological safety</em> — whether members feel safe to take risks and be vulnerable in front of each other — as the most important of the dynamics it identified (',
    'Nghiên cứu nội bộ của Google trên chính các đội của họ (Project Aristotle) thấy rằng ai ở trong đội ít quan trọng hơn cách đội làm việc cùng nhau, và gọi tên <em>an toàn tâm lý</em> — thành viên có thấy an toàn để chấp nhận rủi ro và để lộ điểm yếu trước nhau không — là yếu tố quan trọng nhất trong các yếu tố họ xác định (')}${ng('https://rework.withgoogle.com/en/guides/understanding-team-effectiveness', 'Google re:Work — Understanding team effectiveness')}${t(
    '). For a newcomer it is a two-way street: asking good questions (8.2), admitting a slipped estimate at the checkpoint (8.3) and thanking people for feedback all make the team safer — and as SWP391 leader, you set that tone in week one.',
    '). Với người mới, đó là đường hai chiều: hỏi câu tốt (8.2), nhận trễ ước lượng ở mốc kiểm (8.3), cảm ơn người góp ý — đều làm đội an toàn hơn; còn khi là trưởng nhóm SWP391, chính bạn đặt giọng điệu đó từ tuần đầu.')}</p>

<h3>${t('From fresher to the next step', 'Từ fresher sang bước tiếp theo')}</h3>
<ul>
  <li>${t('<strong>Fresher → junior</strong> is mostly about independence: tickets that come back from review with fewer comments, estimates that hold, questions that are rarer and better.', '<strong>Fresher → junior</strong> chủ yếu là mức tự lập: ticket quay về từ review ít nhận xét hơn, ước lượng đúng hơn, câu hỏi ít hơn mà tốt hơn.')}</li>
  <li>${t('<strong>Depth plus breadth:</strong> become the person who knows one module well (your bao-cao), while staying able to work across the stack.', '<strong>Sâu cộng rộng:</strong> trở thành người hiểu rõ một module (bao-cao của bạn), đồng thời vẫn làm được khắp các tầng.')}</li>
  <li>${t('<strong>Your brag document is also your CV and interview material</strong> — turned into STAR stories (', '<strong>Sổ thành tích cũng là chất liệu CV và phỏng vấn</strong> — chuyển thành câu chuyện STAR (')}${cs('interview-prep', 'pv-2-2-star', t('Interview prep 2.2', 'Phỏng vấn 2.2'))}${t(', and the capstone ', ', và dự án cuối khoá ')}${ag('agl-9-4-tong-ket', '12.4')}${t('), without customer names or confidential details (', '), không kèm tên khách hay chi tiết mật (')}${ag('agl-10-1-nda', '10.1')}).</li>
</ul>

<h3>${t('At work (OJT at FPT Software and similar)', 'Khi đi làm (OJT ở FPT Software và công ty tương tự)')}</h3>
<p>${t(
    'An internship usually ends with an evaluation form filled by your mentor and, if it goes well, a fresher offer. Make the mentor’s job easy: share your 30-60-90 plan in week one, keep the brag document current, and two weeks before the end send a one-page summary that mirrors the evaluation criteria (technical work, process/quality, communication, attitude). Read the offer itself carefully — commitment periods and NDA clauses are in ',
    'Kỳ thực tập thường kết thúc bằng phiếu đánh giá do mentor điền và, nếu suôn sẻ, một lời mời làm fresher. Hãy làm việc của mentor dễ đi: chia sẻ kế hoạch 30-60-90 ngay tuần đầu, giữ sổ thành tích luôn mới, và hai tuần trước khi kết thúc gửi một bản tóm tắt một trang theo đúng các tiêu chí đánh giá (kỹ thuật, quy trình/chất lượng, giao tiếp, thái độ). Đọc kỹ chính lời mời — thời gian cam kết và điều khoản NDA có ở ')}${cs('interview-prep', 'pv-9-3-offer', t('Interview prep 9.3', 'Phỏng vấn 9.3'))}.</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
  <li>${t('Rewrite the three "no result yet" rows of the brag document with results you could have measured. Run <code>tao-brag.mjs</code> until the last line says 0/9.', 'Viết lại ba dòng "chưa ghi kết quả" của sổ thành tích bằng kết quả bạn có thể đã đo. Chạy <code>tao-brag.mjs</code> tới khi dòng cuối là 0/9.')}</li>
  <li>${t('Write your own 30-60-90 plan for SWP391 as team leader (iteration 1 = 30 days…) and make it pass <code>kiem-muc-tieu.mjs</code>.', 'Viết kế hoạch 30-60-90 của chính bạn cho SWP391 với vai trưởng nhóm (iteration 1 = 30 ngày…) và cho nó qua <code>kiem-muc-tieu.mjs</code>.')}</li>
  <li>${t('Prepare the agenda for your first 1:1 with your supervisor (giảng viên) using the three headings.', 'Soạn chương trình cho buổi 1:1 đầu tiên với giảng viên hướng dẫn theo ba mục cố định.')}</li>
</ol>
${giai(t('Solution hints', 'Gợi ý lời giải'), `<p>${t(
    '1: results must be observable — a count, a time, a person who confirmed it: "LH-240: export used by the clinic manager every Monday since 15/09, replaces 30 minutes of copy-paste". Remember to quote any field with a comma. 2: e.g. "Iteration 1 (to 31/01): 5 members each merged one PR through CI and review; backlog of 28 screens with owners on CT Work; weekly report sent every Friday". 3: blocked (e.g. waiting for the database server account), one feedback question about the first report, growth (what the supervisor expects for an A).',
    '1: kết quả phải quan sát được — một con số, một khoảng thời gian, một người xác nhận: "LH-240: chị quản lý dùng bản xuất mỗi thứ Hai từ 15/09, thay 30 phút chép dán". Nhớ đặt trong nháy kép trường nào có dấu phẩy. 2: ví dụ "Iteration 1 (tới 31/01): 5 thành viên mỗi người merge một PR qua CI và review; backlog 28 màn có người phụ trách trên CT Work; báo cáo tuần gửi mỗi thứ Sáu". 3: vướng mắc (ví dụ chờ tài khoản máy chủ CSDL), một câu xin góp ý về báo cáo đầu tiên, phát triển (giảng viên kỳ vọng gì cho điểm A).')}</p>`)}

${phongVan([
    [t('"How do you handle critical feedback?"', '"Bạn đón nhận góp ý thẳng thắn thế nào?"'), t('I thank the person, ask for a concrete example if needed, and come back later with what I changed. I also ask for it: one specific question per week in my 1:1 — e.g. whether splitting test and fix commits helped the reviewer.', 'Tôi cảm ơn, xin ví dụ cụ thể nếu cần, và sau đó quay lại cho biết tôi đã đổi gì. Tôi cũng chủ động xin: mỗi tuần một câu hỏi cụ thể trong buổi 1:1 — ví dụ việc tách commit test và commit sửa có giúp người review không.')],
    [t('"What did you achieve in your internship?"', '"Bạn đạt được gì trong kỳ thực tập?"'), t('Answer from the brag document with results: a docs PR that cut setup from most of a day to 40 minutes, a report query from 4.2 s to 0.3 s measured on staging, a 5-point feature delivered in the committed sprint with no QA bugs after two weeks.', 'Trả lời từ sổ thành tích, kèm kết quả: một PR tài liệu rút thời gian cài đặt từ gần một ngày còn 40 phút, một truy vấn báo cáo từ 4,2 s còn 0,3 s đo trên staging, một tính năng 5 điểm giao đúng sprint đã cam kết, hai tuần không có bug từ QA.')],
    [t('"Where do you see yourself in a year?"', '"Một năm nữa bạn thấy mình ở đâu?"'), t('A junior who owns one module end to end and is trusted with features without close supervision; I track it with a written plan agreed with my mentor and reviewed every month.', 'Một junior làm chủ một module từ đầu tới cuối và được giao tính năng mà không cần kèm sát; tôi theo dõi bằng kế hoạch viết ra, thống nhất với mentor và xem lại mỗi tháng.')],
    [t('"What makes a team work well?"', '"Điều gì làm một đội làm việc tốt?"'), t('Clear goals and roles, and psychological safety — Google’s Project Aristotle found it mattered most. In practice: people ask early, admit slipped estimates, and reviews are about code, not people.', 'Mục tiêu và vai trò rõ, và an toàn tâm lý — Project Aristotle của Google thấy yếu tố này quan trọng nhất. Thực tế là: mọi người hỏi sớm, dám nhận trễ ước lượng, và review nói về mã chứ không nói về người.')],
  ], en)}

${thuatNgu([
    ['1:1', t('Regular private meeting with your mentor/manager; your agenda, not status.', 'Buổi họp riêng đều đặn với mentor/quản lý; chương trình do bạn mang, không phải báo cáo tình trạng.')],
    [t('30-60-90 plan', 'kế hoạch 30-60-90'), t('Checkable goals for the first three months, agreed in week one.', 'Mục tiêu kiểm được cho ba tháng đầu, thống nhất ngay tuần đầu.')],
    [t('brag document', 'sổ thành tích'), t('A running list of what you did and its result, for reviews and CV.', 'Danh sách liên tục những gì bạn làm và kết quả, cho buổi đánh giá và CV.')],
    [t('psychological safety', 'an toàn tâm lý'), t('Feeling safe to ask, admit mistakes and take risks in the team.', 'Cảm giác an toàn để hỏi, nhận lỗi và thử điều mới trong đội.')],
  ], en)}

${tomTat([
    t('Ask for feedback about one concrete thing, every week; come back with what you changed.', 'Xin góp ý về một việc cụ thể, mỗi tuần; quay lại kể mình đã đổi gì.'),
    t('Own your 1:1: blocked · one feedback question · growth · actions.', 'Làm chủ buổi 1:1: vướng mắc · một câu xin góp ý · phát triển · việc cần làm.'),
    t('Goals need a product and a number/date: v1 0/7 → v2 7/7.', 'Mục tiêu cần sản phẩm và con số/ngày: v1 0/7 → v2 7/7.'),
    t('Write the brag log as you go, with results; quote CSV fields with commas ("4,2 s").', 'Ghi sổ thành tích trong lúc làm, kèm kết quả; trường CSV có dấu phẩy phải đặt trong nháy ("4,2 s").'),
    t('Psychological safety is built by small acts — including yours as a newcomer and as a leader.', 'An toàn tâm lý được xây bằng hành động nhỏ — của bạn khi là người mới lẫn khi là trưởng nhóm.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-8-5-lab', t('8.5 — Lab: your first two weeks, checked', '8.5 — Lab: hai tuần đầu, có kiểm'))}.</p>
`);
};

export default {
  title: '8.4 — Growing: feedback, 1:1s and career|||8.4 — Phát triển: phản hồi, 1:1 và sự nghiệp',
  slug: 'agl-8-4-phat-trien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Phía người mới của sự phát triển: xin phản hồi về một việc cụ thể, buổi 1:1 do mình mang chương trình (vướng mắc · câu xin góp ý · phát triển · việc cần làm); lab chạy thật kiem-muc-tieu.mjs — kế hoạch 30-60-90 bản mơ hồ 0/7, bản kiểm được 6/7 rồi 7/7; tao-brag.mjs sinh sổ thành tích từ sổ việc + git log, lần đầu cắt "4,2 s" vì split(\',\') ⇒ đọc CSV theo RFC 4180, 3/9 dòng chưa có kết quả; Julia Evans 2019, an toàn tâm lý (Google Project Aristotle); OJT: phiếu đánh giá và lời mời fresher.',
  content: L84(true) + L84(false),
};
