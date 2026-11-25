/**
 * 7.1 — Lập trình viên và tester (agl-7-1-tester — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: cách VIẾT bug report đã dạy ở dbg-11-1 (khoá debug) + tak-2-2 (tiếng Anh) ⇒ chỉ liên kết; vòng đời bug lý thuyết ở SWT301 (swt301-bug-lifecycle);
 * test spec Excel ở agl-9-4. Bài này dạy QUAN HỆ dev–tester + vai tester trong nhóm 5 SV không có tester (test chéo) + đọc số liệu bug của nhóm.
 * Lab chạy THẬT (scratchpad/agt/lab/ch7): tai-hien.mjs chạy bước tái hiện trong report JSON trên đúng phiên bản + TZ ⇒ "máy em chạy được" (TZ máy) vs staging UTC;
 * vong-doi.mjs đọc lịch sử 16 bug (dữ liệu minh hoạ thế giới LabFlow) ⇒ report thiếu bước/môi trường đi qua lại nhiều hơn.
 * Sự cố thật: Post Office Horizon (Bates v Post Office, phán quyết "Horizon Issues" 16/12/2019).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L71 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 7 · Lesson 7.1', 'Chương 7 · Bài 7.1', `
<h2>${t('7.1 — Developers and testers', '7.1 — Lập trình viên và tester')}</h2>
<p class="lead">${t(
    'A tester’s job is to find out what is true about the software before a user does. A developer who sees that as an attack spends the project arguing; a developer who sees it as free information ships fewer bugs. This lesson is about the relationship: what a tester needs from you, what you need from a tester, how a bug travels between you, why "it works on my machine" is usually a missing piece of environment — and how a five-student SWP391 team with no tester at all still gets the job done.',
    'Việc của tester là tìm ra sự thật về phần mềm trước khi người dùng tìm ra. Lập trình viên coi đó là bị tấn công sẽ tốn cả dự án để cãi nhau; lập trình viên coi đó là thông tin miễn phí sẽ giao ít lỗi hơn. Bài này nói về mối quan hệ: tester cần gì ở bạn, bạn cần gì ở tester, một bug đi qua lại giữa hai bên thế nào, vì sao "máy em chạy được" thường là thiếu một mẩu môi trường — và một nhóm SWP391 năm sinh viên không có tester nào vẫn làm được việc này ra sao.')}</p>

<h3>${t('Everyday picture: the second cook who tastes the soup', 'Liên tưởng đời thường: người nếm canh thứ hai')}</h3>
<p>${t(
    'The cook who made the soup tasted it twenty times while cooking and no longer notices it is too salty. A second person tastes once and says so immediately. The cook can answer "you have no taste" — or ask "salty compared with what, which bowl, after how long on the stove?" The second answer is the one that fixes the soup. Testing is a second pair of eyes; your own tests are the first taster, never the only one.',
    'Người nấu nồi canh đã nếm hai mươi lần trong lúc nấu và không còn nhận ra canh mặn. Người thứ hai nếm một lần là nói ngay. Người nấu có thể đáp "cậu không biết ăn" — hoặc hỏi "mặn so với gì, bát nào, đun bao lâu rồi?" Cách đáp thứ hai mới sửa được nồi canh. Kiểm thử là đôi mắt thứ hai; test của chính bạn là người nếm đầu tiên, không bao giờ là duy nhất.')}</p>

<h3>${t('What each side needs from the other', 'Mỗi bên cần gì ở bên kia')}</h3>
${bang([t('A tester needs from the developer', 'Tester cần ở lập trình viên'), t('A developer needs from the tester', 'Lập trình viên cần ở tester')], [
    [t('Which build/commit is on which environment, and what changed (release note, PR link)', 'Bản build/commit nào đang ở môi trường nào, và đã đổi gì (ghi chú phát hành, liên kết PR)'), t('Steps that reproduce, on a named build and environment', 'Các bước tái hiện được, trên bản build và môi trường có tên')],
    [t('Acceptance criteria written before coding (lesson 2.1)', 'Tiêu chí chấp nhận viết ra trước khi code (bài 2.1)'), t('Expected vs actual, with the exact message or status code', 'Mong đợi và thực tế, kèm đúng thông báo hoặc mã trạng thái')],
    [t('Test data and accounts that work', 'Dữ liệu test và tài khoản dùng được'), t('Evidence: screenshot, HAR, log line with time', 'Bằng chứng: ảnh chụp, tệp HAR, dòng log có giờ')],
    [t('Known limitations, said in advance ("export is not in this build")', 'Giới hạn đã biết, nói trước ("bản này chưa có xuất tệp")'), t('Severity from the user’s point of view; how often it happens', 'Mức độ nghiêm trọng theo góc người dùng; xảy ra thường đến đâu')],
    [t('A reply within a day — including "rejected, because…"', 'Phản hồi trong một ngày — kể cả "từ chối, vì…"'), t('A retest soon after "Fixed", and a regression check nearby', 'Test lại sớm sau "Đã sửa", và kiểm hồi quy quanh chỗ sửa')],
  ])}
<p>${t('How to <em>write</em> a bug report is taught in two other courses — read them rather than a third copy here: ', 'Cách <em>viết</em> một bug report đã dạy ở hai khoá khác — đọc ở đó thay vì một bản thứ ba ở đây: ')}${cs('debug-co-phuong-phap', 'dbg-11-1-bug-report', t('Debugging 11.1 — bug reports others can act on', 'Debug 11.1 — bug report người khác làm được ngay'))}, ${cs('tieng-anh-ky-thuat-di-lam', 'tak-2-2-bug-report', t('Technical English 2.2 — bug reports in English', 'Tiếng Anh kỹ thuật 2.2 — bug report bằng tiếng Anh'))}. ${t('The theory of the defect life cycle is in ', 'Lý thuyết vòng đời lỗi ở ')}${ac('software-testing', 'swt301-bug-lifecycle', 'SWT301 — bug life cycle')}.</p>

<h3>${t('Severity is the tester’s call, priority is the product owner’s', 'Mức độ do tester đánh giá, ưu tiên do PO quyết')}</h3>
<p>${t(
    '<strong>Severity</strong> says how badly the software is broken for the user: a crash that loses data is Critical whatever the deadline. <strong>Priority</strong> says when the team will fix it, and that is a business decision: a typo in the university’s name on the login page is Minor severity and top priority before the demo. Developers do not lower a severity because the fix is hard; testers do not raise a priority because the bug is annoying. In SWP391 the "product owner" for priority is the leader, after asking the supervisor when in doubt.',
    '<strong>Mức độ (severity)</strong> nói phần mềm hỏng nặng thế nào với người dùng: sập mà mất dữ liệu là Critical dù hạn chót ra sao. <strong>Ưu tiên (priority)</strong> nói khi nào nhóm sửa, và đó là quyết định nghiệp vụ: gõ sai tên trường đại học ở trang đăng nhập là mức độ Minor nhưng ưu tiên cao nhất trước buổi demo. Lập trình viên không hạ mức độ vì sửa khó; tester không nâng ưu tiên vì bug gây khó chịu. Ở SWP391, "PO" quyết ưu tiên là trưởng nhóm, hỏi giảng viên khi phân vân.')}</p>

<h3>${t('How a bug travels — and where it bounces', 'Bug đi thế nào — và nảy ngược ở đâu')}</h3>
${out('New → Assigned → Fixed → (retest) → Closed\n                 ↘ Rejected: cannot reproduce | as designed | duplicate | won’t fix\n          Fixed → (retest fails) → Reopened → Fixed → …')}
<p>${t(
    'Every arrow back — <em>Rejected</em> then reopened, or <em>Reopened</em> after a failed retest — is a "ping-pong" round: a day lost and some goodwill lost. Two rejections are legitimate and useful: <strong>duplicate</strong> (link the original) and <strong>as designed</strong> (link the requirement). Two are warning signs: <strong>cannot reproduce</strong> usually means a missing piece of environment, and many <strong>as designed</strong> mean the tester and developer read the requirement differently — that is a requirements problem (lesson 7.2), not a bug.',
    'Mỗi mũi tên quay lại — <em>Rejected</em> rồi mở lại, hoặc <em>Reopened</em> sau khi test lại thất bại — là một vòng "bóng bàn": mất một ngày và mất chút thiện cảm. Hai kiểu từ chối là chính đáng và có ích: <strong>trùng</strong> (gắn liên kết bug gốc) và <strong>đúng thiết kế</strong> (gắn liên kết yêu cầu). Hai kiểu là tín hiệu cảnh báo: <strong>không tái hiện được</strong> thường là thiếu một mẩu môi trường, và nhiều <strong>đúng thiết kế</strong> nghĩa là tester và lập trình viên đọc yêu cầu khác nhau — đó là vấn đề yêu cầu (bài 7.2), không phải bug.')}</p>

<h3>${t('Lab 1: "it works on my machine" — run the report instead of arguing', 'Lab 1: "máy em chạy được" — chạy report thay vì cãi')}</h3>
<p>${t(
    'Sprint 3, Saturday 06/03/2027. C3, cross-testing C1’s booking screen on staging, files LF-B12: booking 07:00–09:00 is rejected as "outside opening hours". C1 tries it on their laptop, it works, and they mark it <em>Rejected — cannot reproduce</em>. Instead of a second round of chat, the team writes reports as JSON so a script can replay them on the exact build and environment. Here is the report and the API version that was on staging:',
    'Sprint 3, thứ Bảy 06/03/2027. C3 test chéo màn đặt lịch của C1 trên staging, mở LF-B12: đặt 07:00–09:00 bị từ chối "ngoài giờ mở cửa". C1 thử trên laptop, chạy bình thường, và đánh dấu <em>Rejected — không tái hiện</em>. Thay vì cãi thêm một vòng trên chat, nhóm viết report dạng JSON để script chạy lại được trên đúng bản build và môi trường. Đây là report và bản API đang ở staging:')}</p>
${out(MA.b12)}
${js(MA.serverV1)}
<p>${t('The replay script refuses incomplete reports, starts the named version with the named time zone, sends the steps and compares the answer with the report’s "actual":', 'Script chạy lại từ chối report thiếu, bật đúng phiên bản với đúng múi giờ ghi trong report, gửi các bước và so câu trả lời với phần "thực tế" của report:')}</p>
${js(MA.taiHien)}
<p>${t('Three runs — as C1’s laptop (time zone of the machine), as staging (TZ=UTC, from the report), and the fixed v2 on staging:', 'Ba lần chạy — như laptop của C1 (múi giờ của máy), như staging (TZ=UTC, lấy từ report), và bản v2 đã sửa trên staging:')}</p>
${out(RA.mayDev)}
${out(RA.staging)}
${out(RA.v2)}
<p>${t(
    'Both people were telling the truth. On a laptop set to Vietnam time, <code>getHours()</code> of 07:00+07:00 is 7; on a server running UTC it is 0, so every booking before 14:00 is rejected. The report contained the one field that mattered — <code>TZ: UTC</code> — and the developer ignored it because the steps "worked". The fix computes the hour in Vietnam time explicitly:',
    'Cả hai người đều nói thật. Trên laptop đặt giờ Việt Nam, <code>getHours()</code> của 07:00+07:00 là 7; trên máy chủ chạy UTC nó là 0, nên mọi lượt đặt trước 14:00 đều bị từ chối. Report đã có đúng trường quyết định — <code>TZ: UTC</code> — và lập trình viên bỏ qua nó vì các bước "chạy được". Bản sửa tính giờ theo giờ Việt Nam một cách tường minh:')}</p>
${out(RA.diffServer)}
<p>${t('Date and time-zone bugs have a whole lesson in the debugging course: ', 'Lỗi ngày giờ và múi giờ có cả một bài ở khoá debug: ')}${cs('debug-co-phuong-phap', 'dbg-6-3-du-lieu', t('Debugging 6.3', 'Debug 6.3'))}.</p>
<p>${t('And the four-word report from C2 on the same day, run through the same script:', 'Còn report bốn chữ của C2 cùng ngày, chạy qua cùng script:')}</p>
${out(MA.b13)}
${out(RA.thieu)}
${cl('tip', `<p>${t(
    '<strong>The rule the team adopted:</strong> a developer may not mark "cannot reproduce" until they have reproduced on the environment written in the report — or written back which field is missing. "Works on my machine" is the start of an investigation, not a resolution.',
    '<strong>Luật nhóm thống nhất sau đó:</strong> lập trình viên không được đánh "không tái hiện" khi chưa thử trên đúng môi trường ghi trong report — hoặc chưa viết lại là thiếu trường nào. "Máy em chạy được" là điểm bắt đầu điều tra, không phải kết luận.')}</p>`)}

<h3>${t('Lab 2: what the team’s bug history says', 'Lab 2: lịch sử bug của nhóm nói gì')}</h3>
<p>${t(
    'At the end of sprint 3 the leader exports the bug list from CT Work (16 bugs from cross-testing; illustrative data from the LabFlow world of this course) and asks one question: does the quality of the report change how many rounds a bug bounces?',
    'Cuối sprint 3, trưởng nhóm xuất danh sách bug từ CT Work (16 bug từ test chéo; dữ liệu minh hoạ thuộc thế giới LabFlow của khoá) và hỏi một câu: chất lượng report có làm đổi số vòng bug nảy qua lại không?')}</p>
${out(MA.loiCsv)}
${js(MA.vongDoi)}
${out('$ node vong-doi.mjs\n' + RA.vongDoi)}
<p>${t(
    'Reports with steps <em>and</em> environment bounced 0.4 rounds on average and closed in 1.6 days; incomplete ones bounced 1.1 rounds and took 2.7 days, and every "cannot reproduce" came from them. Sixteen bugs is a small sample, so treat it as a conversation starter for the retro, not a law. What it does give you is something better than "please write better reports": a number the team can watch next sprint. The three "as designed" rejections on S23 and S25 go to lesson 7.2 — they are disagreements about the requirement.',
    'Report có đủ bước <em>và</em> môi trường nảy trung bình 0,4 vòng và đóng sau 1,6 ngày; report thiếu nảy 1,1 vòng, mất 2,7 ngày, và mọi ca "không tái hiện" đều thuộc nhóm này. Mười sáu bug là mẫu nhỏ, nên coi đây là chủ đề mở cho buổi retro, không phải định luật. Điều nó cho bạn tốt hơn câu "mọi người viết report tốt hơn nhé": một con số cả nhóm theo dõi được ở sprint sau. Ba lần từ chối "đúng thiết kế" ở S23 và S25 chuyển sang bài 7.2 — đó là bất đồng về yêu cầu.')}</p>

<h3>${t('A five-student team has no tester: cross-testing', 'Nhóm năm sinh viên không có tester: test chéo')}</h3>
<ul>
  <li>${t('<strong>Nobody tests their own screen as the final check.</strong> Rotate: C1 tests C2’s screens, C2 tests C3’s… and avoid pairing the tester with the same person who reviews the code (the rotation of chapter 4), so each screen gets two different pairs of eyes.', '<strong>Không ai tự test màn của mình làm bước kiểm cuối.</strong> Xoay vòng: C1 test màn của C2, C2 test màn của C3… và tránh để người test trùng với người review mã (xoay vòng ở chương 4), để mỗi màn có hai đôi mắt khác nhau.')}</li>
  <li>${t('<strong>Test on staging, not on the author’s laptop.</strong> LF-B12 exists only because staging runs UTC.', '<strong>Test trên staging, không trên laptop của tác giả.</strong> LF-B12 tồn tại chỉ vì staging chạy UTC.')}</li>
  <li>${t('<strong>Time-box it.</strong> 30 minutes per screen against its acceptance criteria plus three "evil" inputs (empty, very long, boundary — see ', '<strong>Giới hạn thời gian.</strong> 30 phút mỗi màn, theo tiêu chí chấp nhận cộng ba đầu vào "ác" (rỗng, rất dài, giá trị biên — xem ')}${cs('testing', 'tst-1-4-ham-thuan', t('Testing 1.4', 'Testing 1.4'))}).</li>
  <li>${t('<strong>A short triage twice a week</strong> (10 minutes after the daily): leader + reporter + author look at new bugs, set priority, close duplicates. Bugs without an owner or priority after triage do not exist.', '<strong>Phân loại ngắn hai lần một tuần</strong> (10 phút sau daily): trưởng nhóm + người báo + tác giả xem bug mới, đặt ưu tiên, đóng bug trùng. Bug không có chủ hay ưu tiên sau buổi phân loại coi như không tồn tại.')}</li>
  <li>${t('<strong>The supervisor is your hardest tester.</strong> At the iteration review they click what you did not. Run your own cross-test the day before, on the build you will demo.', '<strong>Giảng viên là tester khó tính nhất của bạn.</strong> Ở buổi review iteration họ bấm vào đúng chỗ bạn không bấm. Tự test chéo trước một ngày, trên đúng bản sẽ demo.')}</li>
</ul>

<h3>${t('Words that keep the relationship working', 'Những câu giữ cho quan hệ không hỏng')}</h3>
${bang([t('Instead of', 'Thay vì'), t('Say', 'Hãy nói')], [
    [t('"Works on my machine."', '"Máy em chạy được."'), t('"I can’t reproduce on local with TZ=Asia/Ho_Chi_Minh — I’ll try staging; which build were you on?"', '"Mình chưa tái hiện được ở local với TZ=Asia/Ho_Chi_Minh — mình thử staging; bạn test trên bản nào?"')],
    [t('"That’s not a bug."', '"Cái đó đâu phải bug."'), t('"The AC for S25 says X (link). If it should be Y, let’s ask the PO and turn it into a ticket."', '"Tiêu chí của S25 ghi X (liên kết). Nếu đúng ra phải là Y thì mình hỏi PO và chuyển thành ticket."')],
    [t('"Why do you test such weird cases?"', '"Sao bạn test mấy ca kỳ cục thế?"'), t('"Good catch. Users will do this — I’ll add a test for it."', '"Bắt hay đấy. Người dùng sẽ làm thế thật — mình thêm test cho ca này."')],
    [t('(silently mark Fixed)', '(lặng lẽ đánh Fixed)'), t('"Fixed in PR #52, on staging build 0.3.2 — the 21:30 boundary is covered too."', '"Đã sửa ở PR #52, có trên staging bản 0.3.2 — biên 21:30 cũng được phủ."')],
  ])}

<h3>🕵️ ${t('A real case: when "the system is fine" was the default answer (Post Office Horizon)', 'Chuyện thật: khi "hệ thống không sai" là câu trả lời mặc định (Post Office Horizon)')}</h3>
<p>${t(
    'From 1999 the UK Post Office ran branch accounts on Horizon, a system built by Fujitsu. When sub-postmasters reported unexplained shortfalls, the default answer was that the system was reliable and the user was at fault; hundreds were prosecuted for theft and false accounting. In the group litigation <em>Bates v Post Office</em>, the "Horizon Issues" judgment of 16 December 2019 found that bugs, errors and defects in Horizon had the potential to cause discrepancies in branch accounts; the court’s appendix lists them (',
    'Từ năm 1999 Bưu điện Anh vận hành sổ sách các chi nhánh trên Horizon, hệ thống do Fujitsu xây. Khi các chủ bưu cục báo thiếu hụt không rõ lý do, câu trả lời mặc định là hệ thống tin cậy và lỗi ở người dùng; hàng trăm người bị truy tố tội trộm cắp và gian lận sổ sách. Trong vụ kiện tập thể <em>Bates v Post Office</em>, phán quyết "Horizon Issues" ngày 16/12/2019 kết luận các bug, lỗi và khiếm khuyết của Horizon có khả năng gây chênh lệch trong sổ sách chi nhánh; phụ lục của toà liệt kê chúng (')}${ng('https://www.judiciary.uk/wp-content/uploads/2019/12/bates-v-post-office-appendix-2.pdf', t('Appendix 2 — bugs, errors and defects', 'Phụ lục 2 — bug, lỗi và khiếm khuyết'))}${t('; background: ', '; bối cảnh: ')}${ng('https://en.wikipedia.org/wiki/British_Post_Office_scandal', 'British Post Office scandal')}). ${t(
    'Known errors had been recorded internally in "Known Error Logs". The engineering lesson is uncomfortable and simple: "cannot reproduce" and "user error" are hypotheses, not verdicts. A team that closes reports by default stops learning about its own software — at student scale that costs a demo; at national scale it destroyed lives.',
    'Các lỗi đã biết từng được ghi nội bộ trong "Known Error Log". Bài học kỹ thuật vừa khó chịu vừa đơn giản: "không tái hiện được" và "lỗi người dùng" là giả thuyết, không phải phán quyết. Một đội đóng report theo mặc định sẽ thôi học về chính phần mềm của mình — ở quy mô sinh viên cái giá là một buổi demo; ở quy mô quốc gia nó đã huỷ hoại nhiều cuộc đời.')}</p>

<h3>${t('At work (OJT, outsourcing)', 'Khi đi làm (OJT, outsourcing)')}</h3>
<p>${t(
    'In an outsourcing project the QA team is often separate, and bugs come in two streams: internal QA during the project, and the customer during acceptance. Internal bugs are cheap; customer bugs are counted, reported and sometimes written into the contract’s quality targets (defects per KLOC or per screen — see ',
    'Ở dự án outsourcing, đội QA thường tách riêng, và bug đến từ hai luồng: QA nội bộ trong dự án, và khách hàng lúc nghiệm thu. Bug nội bộ rẻ; bug khách hàng thì được đếm, báo cáo và đôi khi ghi vào chỉ tiêu chất lượng của hợp đồng (số lỗi trên KLOC hoặc trên màn hình — xem ')}${ag('agl-9-4-test-spec', t('9.4 — test specifications', '9.4 — test spec'))}). ${t(
    'Every internal QA bug you dismiss is a candidate customer bug. As a fresher: reply to every bug assigned to you within the day, never close as "cannot reproduce" without trying the QA environment, and when a QA engineer finds something good, thank them in the ticket — they will test your next feature first and more kindly.',
    'Mỗi bug QA nội bộ bạn gạt đi là một ứng viên bug của khách. Là fresher: trả lời mọi bug giao cho bạn trong ngày, không bao giờ đóng "không tái hiện" khi chưa thử trên môi trường của QA, và khi một bạn QA bắt được lỗi hay, cảm ơn trong ticket — lần sau họ sẽ test tính năng của bạn sớm hơn và dễ chịu hơn.')}</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
  <li>${t('After LF-B12 was fixed, C4 tested the boundary: a booking 19:30–21:30 was accepted although the room closes at 21:00. Write <code>LF-B14.json</code> so that <code>tai-hien.mjs</code> reproduces it on v1 and shows it fixed on v2.', 'Sau khi LF-B12 được sửa, C4 test giá trị biên: đặt 19:30–21:30 vẫn được nhận dù phòng đóng cửa 21:00. Viết <code>LF-B14.json</code> sao cho <code>tai-hien.mjs</code> tái hiện được trên v1 và cho thấy đã sửa trên v2.')}</li>
  <li>${t('Look at v1’s code: why did 21:30 pass? Did the LF-B12 fix also fix LF-B14 — and does that mean LF-B14 can be closed without a retest?', 'Nhìn mã v1: vì sao 21:30 lọt qua? Bản sửa LF-B12 có vô tình sửa luôn LF-B14 không — và như vậy có được đóng LF-B14 mà không test lại không?')}</li>
  <li>${t('Pick three rows of <code>loi.csv</code> with "khong-tai-hien" or two or more rounds. For each, write the one sentence that, added to the original report, would have avoided a round.', 'Chọn ba dòng của <code>loi.csv</code> có "khong-tai-hien" hoặc từ hai vòng trở lên. Với mỗi dòng, viết một câu mà nếu thêm vào report gốc thì đã tránh được một vòng.')}</li>
</ol>
${giai(t('Solution for 1 and 2', 'Lời giải câu 1 và 2'), out(MA.b14) + out(RA.b14) + `<p>${t(
    'In v1, <code>b.getHours() &gt; DONG</code> compares only whole hours: 21:30 has hour 21, and 21 &gt; 21 is false. (On UTC staging it passes for an even simpler reason — 14:30 UTC.) v2’s <code>gioVN()</code> includes minutes, so 21.5 &gt; 21 is rejected: the LF-B12 fix did fix LF-B14 too. That is exactly why LF-B14 still needs its own retest and its own regression test — "probably fixed by another change" is how bugs come back when someone refactors <code>gioVN()</code> later.',
    'Ở v1, <code>b.getHours() &gt; DONG</code> chỉ so giờ chẵn: 21:30 có giờ là 21, mà 21 &gt; 21 là sai. (Trên staging UTC nó lọt vì lý do còn đơn giản hơn — 14:30 UTC.) <code>gioVN()</code> của v2 tính cả phút, nên 21,5 &gt; 21 bị từ chối: bản sửa LF-B12 đúng là sửa luôn LF-B14. Chính vì vậy LF-B14 vẫn cần lần test lại và test hồi quy riêng — "chắc được sửa bởi thay đổi khác" là con đường để bug quay lại khi ai đó refactor <code>gioVN()</code> về sau.')}</p>`)}

${phongVan([
    [t('"A tester reports a bug you cannot reproduce. What do you do?"', '"Tester báo một bug bạn không tái hiện được. Bạn làm gì?"'), t('Treat it as missing information, not as a false report: check the build and environment in the report, try on that environment, compare configuration (time zone, data, browser, flags). If still nothing, write back exactly what I tried and which field I need, and offer to look at it together for ten minutes. In our project a "cannot reproduce" turned out to be the server running UTC.', 'Coi đó là thiếu thông tin, không phải report sai: xem bản build và môi trường trong report, thử trên đúng môi trường đó, so cấu hình (múi giờ, dữ liệu, trình duyệt, cờ). Nếu vẫn không thấy, viết lại chính xác tôi đã thử gì và cần thêm trường nào, và đề nghị ngồi xem cùng mười phút. Trong dự án của chúng tôi, một ca "không tái hiện" hoá ra là máy chủ chạy UTC.')],
    [t('"What is the difference between severity and priority?"', '"Severity và priority khác nhau thế nào?"'), t('Severity is impact on the user, set by the tester; priority is when we fix it, set by the product owner. A typo on the login page before a demo: low severity, high priority. A crash in a feature nobody uses yet: high severity, lower priority.', 'Severity là tác động lên người dùng, do tester đặt; priority là khi nào sửa, do PO đặt. Lỗi chính tả ở trang đăng nhập trước buổi demo: severity thấp, priority cao. Sập ở tính năng chưa ai dùng: severity cao, priority thấp hơn.')],
    [t('"How did you test in a student team with no QA?"', '"Nhóm sinh viên không có QA thì các bạn test thế nào?"'), t('Cross-testing on a rotation different from code review, on staging, 30 minutes per screen against the acceptance criteria plus boundary cases, triage twice a week, and we tracked how many rounds bugs bounced — reports with environment and steps bounced about a third as often.', 'Test chéo theo vòng xoay khác với vòng review mã, trên staging, 30 phút mỗi màn theo tiêu chí chấp nhận cộng ca biên, phân loại hai lần mỗi tuần, và theo dõi số vòng bug nảy qua lại — report có môi trường và bước tái hiện nảy ít hơn khoảng ba lần.')],
    [t('"How do you handle disagreement with QA about whether something is a bug?"', '"Bạn xử lý bất đồng với QA về chuyện một thứ có phải bug không thế nào?"'), t('Go to the requirement, not to opinions. If the acceptance criteria decide it, link them. If they are silent or ambiguous, it is a question for the PO or BA, and the answer becomes a ticket or a CR — not a win for either of us.', 'Đi về yêu cầu, không đi về ý kiến. Nếu tiêu chí chấp nhận đã quyết, gắn liên kết. Nếu tiêu chí im lặng hoặc mơ hồ, đó là câu hỏi cho PO hay BA, và câu trả lời thành ticket hoặc CR — không phải phần thắng của ai.')],
  ], en)}

${thuatNgu([
    ['severity / priority', t('Impact on the user (tester) / when to fix (product owner).', 'Tác động lên người dùng (tester) / khi nào sửa (PO).')],
    [t('cannot reproduce', 'không tái hiện được'), t('A hypothesis that the report lacks information — never a verdict by itself.', 'Giả thuyết rằng report thiếu thông tin — tự nó không bao giờ là phán quyết.')],
    ['retest / regression', t('Re-running the failed case after a fix / checking nearby behaviour did not break.', 'Chạy lại ca lỗi sau khi sửa / kiểm hành vi xung quanh không bị hỏng theo.')],
    ['triage', t('A short meeting to give new bugs an owner, a priority, or close them as duplicate.', 'Buổi ngắn để gán chủ, ưu tiên cho bug mới, hoặc đóng bug trùng.')],
    [t('cross-testing', 'test chéo'), t('Members test each other’s screens on a rotation.', 'Thành viên test màn của nhau theo vòng xoay.')],
  ], en)}

${tomTat([
    t('A tester gives you free information; answer with environment, AC and a reply within a day.', 'Tester cho bạn thông tin miễn phí; đáp lại bằng môi trường, tiêu chí chấp nhận và phản hồi trong ngày.'),
    t('Severity belongs to the tester, priority to the product owner.', 'Severity thuộc về tester, priority thuộc về PO.'),
    t('Run the report on its environment before saying "cannot reproduce" — LF-B12 was TZ=UTC on staging.', 'Chạy report trên đúng môi trường của nó trước khi nói "không tái hiện" — LF-B12 là TZ=UTC trên staging.'),
    t('Measure ping-pong: complete reports bounced 0.4 rounds, incomplete ones 1.1.', 'Đo bóng bàn: report đủ nảy 0,4 vòng, report thiếu nảy 1,1 vòng.'),
    t('No tester in the team: cross-test on staging, rotate, triage twice a week.', 'Nhóm không có tester: test chéo trên staging, xoay vòng, phân loại hai lần mỗi tuần.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-7-2-ba-po', t('7.2 — Developers, BAs and product owners', '7.2 — Lập trình viên, BA và PO'))}.</p>
`);
};

export default {
  title: '7.1 — Developers and testers|||7.1 — Lập trình viên và tester',
  slug: 'agl-7-1-tester',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quan hệ lập trình viên – tester: mỗi bên cần gì ở bên kia; severity (tester) và priority (PO); vòng đời bug và các vòng "bóng bàn"; lab chạy thật tai-hien.mjs chạy report JSON trên đúng phiên bản + múi giờ: "máy em chạy được" (TZ máy) vs staging UTC từ chối 07:00, bản sửa gioVN(); vong-doi.mjs: report đủ bước + môi trường nảy 0,4 vòng vs 1,1; nhóm 5 SV không có tester: test chéo, phân loại; Post Office Horizon (phán quyết 16/12/2019); OJT với đội QA.',
  content: L71(true) + L71(false),
};
