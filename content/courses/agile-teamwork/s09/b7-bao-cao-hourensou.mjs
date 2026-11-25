/**
 * 9.7 — Báo cáo ngày/tuần và hourensou — và xử lý khi trễ (agl-9-7-bao-cao-hourensou). Soạn 24/11/2026.
 * Gốc hourensou: Yamazaki Tomiji (山崎富治), chủ tịch công ty chứng khoán Yamatane (山種証券) phổ biến trong công ty — tư liệu
 * bugin-eri.co.jp/report/report04/file/zinzai235.pdf (năm cụ thể không ghi vì chưa kiểm được nguồn). git log: chạy thật trong repo thử
 * /tmp/agl-git (tác giả giả "Dev A"). Ranh giới: báo cáo tiến độ chung ở agl-6-3-bao-cao; ở đây mẫu daily report outsourcing.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, out, ag, cs, ng, vo, taiMau } from '../_chung.mjs';
import { DR, bangHtml } from '../_mau.mjs';

const GIT_LOG = out(`$ git log --since="2026-11-25 00:00" --until="2026-11-25 23:59" --author="Dev A" --reverse --format="- %ad %s" --date=format:%H:%M
- 09:15 fix(AT-123): so email không phân biệt hoa/thường (BUG-001, QA-001)
- 11:02 test(AT-123): thêm TC-REG-006, 008, 019 theo QA-004/005/001
- 15:30 docs(AT-123): cập nhật test spec + evidence lần 2`);

export const L97 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.7 — Daily/weekly reports and hourensou: report, inform, consult — and handling slippage', '9.7 — Báo cáo ngày/tuần và hourensou (báo cáo, liên lạc, thảo luận) — và xử lý khi trễ')}</h2>
<p class="lead">${t(
    'Your leader cannot see inside your head. On an offshore project the leader also has to tell a customer, in another country, how the project is going — every day. The daily report and the habit the Japanese call <em>hourensou</em> are how information flows upward early enough to act on it. This lesson gives you the template, the phrases, and a script for the hardest message: "I am going to be late."',
    'Leader không nhìn được vào đầu bạn. Ở dự án offshore, leader còn phải báo cho một khách ở nước khác biết dự án đang ra sao — mỗi ngày. Báo cáo ngày và thói quen người Nhật gọi là <em>hourensou</em> là cách thông tin chảy ngược lên trên đủ sớm để còn kịp xử lý. Bài này đưa bạn mẫu báo cáo, các câu mẫu, và kịch bản cho tin nhắn khó nhất: "Em sẽ trễ."')}</p>

<h3>${t('Hourensou: three habits in one word', 'Hourensou: ba thói quen trong một từ')}</h3>
<p>${t(
    '<em>Hō-ren-sō</em> (報連相) sounds like the Japanese word for spinach. It was popularised as a company slogan by Yamazaki Tomiji, president of Yamatane Securities, and is now taught to almost every new employee in Japan. Your Japanese customer and your BrSE will expect it without explaining it.',
    '<em>Hō-ren-sō</em> (報連相) đọc giống từ "rau chân vịt" trong tiếng Nhật. Nó được ông Yamazaki Tomiji, chủ tịch công ty chứng khoán Yamatane, phổ biến như một khẩu hiệu công ty, và nay được dạy cho gần như mọi nhân viên mới ở Nhật. Khách Nhật và BrSE của bạn sẽ mặc định bạn làm vậy mà không cần giải thích.')}
${ng('https://www.bugin-eri.co.jp/report/report04/file/zinzai235.pdf', t('(source, Japanese PDF)', '(nguồn, PDF tiếng Nhật)'))}</p>
${bang(['', t('Meaning', 'Nghĩa'), t('When', 'Khi nào'), t('Example', 'Ví dụ')], [
    ['<strong>報告 hōkoku</strong> — ' + t('report', 'báo cáo'), t('Tell the person who gave you a task how it is going and how it ended', 'Báo người giao việc tình hình và kết quả'), t('At milestones, at the end, and <strong>immediately when something goes wrong</strong>', 'Ở các mốc, khi xong, và <strong>ngay khi có chuyện không ổn</strong>'), t('"AT-123 UT done: 20 Pass, 1 bug fixed. PR sent."', '"AT-123 xong UT: 20 Pass, sửa 1 bug. Đã gửi PR."')],
    ['<strong>連絡 renraku</strong> — ' + t('inform', 'liên lạc'), t('Share facts others need, without opinions', 'Chia sẻ sự việc người khác cần biết, không kèm ý kiến'), t('Whenever a fact affects someone else', 'Bất cứ khi nào một sự việc ảnh hưởng người khác'), t('"Test server will restart at 14:00."', '"Server test khởi động lại lúc 14:00."')],
    ['<strong>相談 sōdan</strong> — ' + t('consult', 'thảo luận, xin ý kiến'), t('Ask before deciding something that is not yours to decide', 'Hỏi trước khi quyết một việc không thuộc quyền của bạn'), t('Before changing a design, skipping a step, choosing between options', 'Trước khi đổi thiết kế, bỏ một bước, chọn giữa các phương án'), t('"QA-003 is late. Option A… B… I suggest A. OK?"', '"QA-003 trễ. Phương án A… B… Em đề xuất A. Được không ạ?"')],
  ])}
<p>${t('Two principles behind it: <strong>conclusion first</strong> (結論から — say the result, then the details) and <strong>bad news first and early</strong>. A problem reported on day 1 is a planning issue; the same problem discovered on the deadline is a crisis and a trust issue.', 'Hai nguyên tắc phía sau: <strong>kết luận trước</strong> (結論から — nói kết quả, rồi mới chi tiết) và <strong>tin xấu nói trước, nói sớm</strong>. Một vấn đề báo từ ngày 1 chỉ là chuyện kế hoạch; cũng vấn đề đó phát hiện vào ngày hạn là khủng hoảng và là chuyện mất lòng tin.')}</p>
${note(t('Everyday analogy: a delivery app. You do not mind that the driver is 15 minutes late if the app told you at the start; you are furious if it says "arriving" for 40 minutes. Hourensou is the tracking screen of your work.', 'Liên tưởng đời thường: ứng dụng giao đồ ăn. Bạn không giận tài xế trễ 15 phút nếu ứng dụng báo ngay từ đầu; bạn bực khi nó ghi "sắp đến" suốt 40 phút. Hourensou là màn hình theo dõi đơn hàng cho công việc của bạn.'))}

<h3>${t('The daily report (日報)', 'Báo cáo ngày (日報)')}</h3>
${taiMau('Daily-report-mau.xlsx', en)}
${bangHtml(DR)}
<p>${t('What makes this report useful:', 'Điều làm báo cáo này có ích:')}</p>
<ul>
<li>${t('<strong>Numbers with a plan to compare</strong>: "85 % (planned 90 %) — 0.5 MD behind", "planned 12 h, actual 13.5 h, remaining 3 h". "Working on AT-123" tells the leader nothing.', '<strong>Số liệu có kế hoạch để so</strong>: "85 % (kế hoạch 90 %) — chậm 0,5 MD", "kế hoạch 12 h, thực tế 13,5 h, còn lại 3 h". "Đang làm AT-123" không cho leader biết gì.')}</li>
<li>${t('<strong>Issues with IDs</strong> (QA-003, CR-003, TC-REG-021) so the leader can act without asking.', '<strong>Vấn đề có mã</strong> (QA-003, CR-003, TC-REG-021) để leader hành động mà không phải hỏi lại.')}</li>
<li>${t('<strong>A concrete request for help</strong>, with who and when.', '<strong>Một đề nghị hỗ trợ cụ thể</strong>, ai và khi nào.')}</li>
</ul>

<h3>${t('Honest percentages: avoid the "90 % syndrome"', 'Phần trăm trung thực: tránh "hội chứng 90 %"')}</h3>
<p>${t(
    'Self-reported progress tends to climb quickly to 90 % and stay there for days, because the last 10 % (bugs, evidence, review) is the uncertain part. Two remedies: measure by <strong>completed sub-tasks of the WBS</strong> (lesson 9.6: done lines ÷ all lines, weighted by estimate), and use a simple rule such as 0 % not started / 50 % started / 100 % done-and-reviewed for each small line.',
    'Tiến độ tự báo thường leo nhanh lên 90 % rồi đứng đó nhiều ngày, vì 10 % cuối (bug, evidence, review) mới là phần bất định. Hai cách chữa: đo bằng <strong>số dòng WBS đã xong</strong> (bài 9.6: dòng đã xong ÷ tất cả dòng, có trọng số theo ước lượng), và dùng quy tắc đơn giản 0 % chưa làm / 50 % đang làm / 100 % xong và đã review cho từng dòng nhỏ.')}</p>

<h3>${t('Fill "Done today" from facts, not memory', 'Điền "Đã làm hôm nay" từ dữ liệu, không từ trí nhớ')}</h3>
<p>${t('If your commits follow the convention with ticket IDs (', 'Nếu commit của bạn theo quy ước có mã ticket (')}${ag('agl-3-1-quy-uoc', t('lesson 3.1', 'bài 3.1'))}${t('), Git can draft the list for you:', '), Git có thể viết nháp danh sách cho bạn:')}</p>
${GIT_LOG}
<p>${t('Then rewrite each line for the reader (the leader does not care about "docs(AT-123)"; they care that the test spec is updated). Effort hours come from your timesheet (lesson 9.1).', 'Rồi viết lại mỗi dòng cho người đọc (leader không quan tâm "docs(AT-123)"; họ quan tâm test spec đã cập nhật). Số giờ công lấy từ timesheet (bài 9.1).')}</p>

<h3>${t('The weekly report', 'Báo cáo tuần')}</h3>
<p>${t('Usually written by the leader from the daily reports, but you may be asked for your part. Structure: (1) summary in three lines with a status colour (green/amber/red); (2) progress vs plan per feature; (3) quality figures (test cases run, bugs open/closed); (4) Q&amp;A and CR status; (5) risks and actions; (6) plan for next week.', 'Thường do leader viết từ các báo cáo ngày, nhưng bạn có thể được nhờ viết phần mình. Cấu trúc: (1) tóm tắt ba dòng kèm màu trạng thái (xanh/vàng/đỏ); (2) tiến độ so kế hoạch theo chức năng; (3) số liệu chất lượng (số case đã chạy, bug mở/đóng); (4) tình trạng Q&amp;A và CR; (5) rủi ro và hành động; (6) kế hoạch tuần sau.')}</p>

<h3>${t('When you are going to be late', 'Khi bạn sắp trễ')}</h3>
<p>${t('Situation: AT-130 was estimated at 2 days. It is the morning of day 3 and it is not finished. The worst options are: say nothing and work overnight; or say "almost done" again. The right one, as early as you <em>know</em> (ideally when half the time is gone and less than half the work is done):', 'Tình huống: AT-130 ước 2 ngày. Giờ là sáng ngày thứ 3 và vẫn chưa xong. Tệ nhất là: im lặng rồi thức đêm làm; hoặc lại nói "sắp xong ạ". Cách đúng, ngay khi bạn <em>biết</em> (lý tưởng là lúc thời gian đã trôi một nửa mà việc chưa được một nửa):')}</p>
<pre><code>${t(
`[AT-130] Delay — need 1 more day (new ETA: 27/11 17:00)

Status : search + paging done and tested; sort by date not done (≈ 60 %).
Cause  : the DD does not define sort order when two appointments have the
         same time (QA-021, sent 25/11, no answer yet) + 3 h on a date-picker bug.
Impact : AT-131 (edit screen) starts 1 day later; sprint goal still reachable
         if AT-133 moves to next sprint.
Options: A) finish with our proposed order (by id) now, adjust after QA-021 — +1 day
         B) wait for QA-021 and work on AT-131 meanwhile — ETA unknown
I suggest A. Could you also remind the customer about QA-021 at today's sync?`,
`[AT-130] Trễ — cần thêm 1 ngày (dự kiến xong mới: 27/11 17:00)

Hiện trạng : xong tìm kiếm + phân trang, đã test; chưa xong sắp xếp theo ngày (≈ 60 %).
Nguyên nhân: DD không định nghĩa thứ tự khi hai lịch khám trùng giờ (QA-021,
             gửi 25/11, chưa có trả lời) + mất 3 h vì lỗi component chọn ngày.
Ảnh hưởng  : AT-131 (màn sửa) bắt đầu muộn 1 ngày; vẫn đạt mục tiêu sprint
             nếu dời AT-133 sang sprint sau.
Phương án  : A) làm luôn theo thứ tự đề xuất (theo id), chỉnh lại khi có QA-021 — +1 ngày
             B) chờ QA-021, trong lúc đó làm AT-131 — chưa biết ngày xong
Em đề xuất A. Anh nhắc khách QA-021 giúp em ở buổi họp chiều nay được không ạ?`)}</code></pre>
<p>${t('Five parts — new date, status, cause, impact, options with a recommendation — and one clear request. This is hourensou in practice: report (status), inform (cause and impact), consult (options).', 'Năm phần — ngày mới, hiện trạng, nguyên nhân, ảnh hưởng, phương án kèm đề xuất — và một đề nghị rõ ràng. Đây là hourensou trong thực tế: báo cáo (hiện trạng), liên lạc (nguyên nhân, ảnh hưởng), thảo luận (phương án).')}</p>
${cl('warn', t('<strong>Do not hide a delay with overtime.</strong> Unreported overtime makes the estimate data wrong (the next estimate will be too small again), hides a real problem (QA-021 is late for everybody), and in T&amp;M projects distorts billing. Report first; the leader decides whether overtime is the right answer.', '<strong>Đừng giấu trễ bằng cách làm thêm giờ.</strong> Làm thêm không báo làm sai số liệu ước lượng (lần sau lại ước thấp), giấu một vấn đề thật (QA-021 đang trễ với cả đội), và ở dự án T&amp;M còn làm sai hoá đơn. Báo trước; leader quyết có nên làm thêm giờ hay không.'))}

<h3>${t('Escalation path', 'Đường báo cáo lên')}</h3>
<p>${t('You → team leader → PM / BrSE → customer. Skip a level only when your direct contact is unreachable and the issue is urgent (production down, security incident) — and then inform them as soon as possible. Security incidents have their own fast path (chapter 10, ', 'Bạn → team leader → PM / BrSE → khách. Chỉ vượt cấp khi người trực tiếp không liên lạc được và việc gấp (production sập, sự cố bảo mật) — rồi báo lại họ sớm nhất có thể. Sự cố bảo mật có đường nhanh riêng (chương 10, ')}${ag('agl-10-2-isms', t('lesson 10.2', 'bài 10.2'))}).</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<p>${t('Rewrite this daily report so a leader can act on it: <em>"Today: worked on login. Some problems. Tomorrow: continue."</em> Facts: AT-124 login; API done and tested (12 cases Pass); screen 50 %; customer has not answered QA-030 (lock account after how many failed attempts?) due yesterday; you spent 2 h helping a colleague with Docker.', 'Viết lại báo cáo ngày này để leader hành động được: <em>"Hôm nay: làm đăng nhập. Có vài vấn đề. Mai: làm tiếp."</em> Dữ kiện: AT-124 đăng nhập; API xong và đã test (12 case Pass); giao diện 50 %; khách chưa trả lời QA-030 (khoá tài khoản sau mấy lần sai?) hạn hôm qua; bạn mất 2 h giúp đồng nghiệp sửa Docker.')}</p>
${giai(t('Model answer', 'Đáp án mẫu'), `<pre><code>${t(
`Done today : AT-124 login API finished, 12/12 UT cases Pass (evidence round 1);
             login screen layout + validation (≈ 50 %)
Progress   : AT-124 70 % (plan 80 %) — 0.5 MD behind
Effort     : planned 8 h · actual 8 h (incl. 2 h helping Nam with Docker, task OPS-12)
Issues     : QA-030 (lock after N failed attempts) overdue since 25/11 —
             lock logic implemented with our proposal N = 5, marked in code
Need help  : please remind the customer about QA-030 at tomorrow's sync
Tomorrow   : finish screen, UT for screen, open PR`,
`Đã làm     : AT-124 xong API đăng nhập, 12/12 case UT Pass (evidence lần 1);
             bố cục + kiểm tra dữ liệu màn hình đăng nhập (≈ 50 %)
Tiến độ    : AT-124 70 % (kế hoạch 80 %) — chậm 0,5 MD
Thời gian  : kế hoạch 8 h · thực tế 8 h (gồm 2 h hỗ trợ Nam sửa Docker, mã OPS-12)
Vấn đề     : QA-030 (khoá sau N lần sai) quá hạn từ 25/11 —
             đã code theo đề xuất N = 5, có đánh dấu trong code
Cần hỗ trợ : nhờ anh nhắc khách QA-030 ở buổi họp mai
Ngày mai   : xong màn hình, UT màn hình, mở PR`)}</code></pre>`)}

${phongVan([
    [t('Tell me about a time you were going to miss a deadline.', 'Kể một lần bạn sắp trễ hạn.'), t('Use STAR: the situation and estimate, when and how I noticed (half the time gone, less than half done), the message I sent with cause, impact and options, what was decided, and what I changed in my estimating afterwards.', 'Dùng STAR: bối cảnh và ước lượng, khi nào và làm sao tôi nhận ra (hết nửa thời gian mà chưa được nửa việc), tin nhắn đã gửi có nguyên nhân, ảnh hưởng, phương án, điều đã được quyết, và tôi đã đổi gì trong cách ước lượng sau đó.')],
    [t('What is hourensou?', 'Hourensou là gì?'), t('Report, inform, consult — the Japanese workplace habit of keeping your superior updated, sharing facts with those affected, and asking before deciding; conclusion first and bad news early.', 'Báo cáo, liên lạc, thảo luận — thói quen nơi làm việc Nhật: cập nhật cho cấp trên, chia sẻ sự việc cho người bị ảnh hưởng, hỏi trước khi quyết; kết luận trước, tin xấu báo sớm.')],
    [t('How do you report progress so it is meaningful?', 'Bạn báo tiến độ thế nào cho có ý nghĩa?'), t('Against a plan, with numbers based on finished WBS items rather than a feeling, plus issues with IDs and a concrete request.', 'So với kế hoạch, bằng số dựa trên các mục WBS đã xong chứ không theo cảm giác, kèm vấn đề có mã và đề nghị cụ thể.')],
  ], en)}

${thuatNgu([
    ['Hourensou (報連相)', t('Report, inform, consult', 'Báo cáo, liên lạc, thảo luận')],
    [t('Daily report (日報)', 'Báo cáo ngày (日報)'), t('End-of-day summary: done, progress, effort, issues, help, plan', 'Tổng kết cuối ngày: đã làm, tiến độ, công, vấn đề, hỗ trợ, kế hoạch')],
    [t('Conclusion first (結論から)', 'Kết luận trước (結論から)'), t('State the result before the explanation', 'Nói kết quả trước phần giải thích')],
    ['ETA', t('Estimated time of arrival/completion', 'Thời điểm dự kiến xong')],
    [t('Escalation', 'Báo cáo vượt cấp (escalation)'), t('Raising an issue to the next level when it cannot be solved at yours', 'Đưa vấn đề lên cấp trên khi cấp mình không giải được')],
    [t('90 % syndrome', 'Hội chứng 90 %'), t('Progress stuck "almost done" because the uncertain tail was ignored', 'Tiến độ kẹt ở "sắp xong" vì bỏ qua phần đuôi bất định')],
  ], en)}

${tomTat([
    t('Report, inform, consult — conclusion first, bad news early.', 'Báo cáo, liên lạc, thảo luận — kết luận trước, tin xấu báo sớm.'),
    t('Daily report = numbers vs plan + issues with IDs + concrete help + plan.', 'Báo cáo ngày = số liệu so kế hoạch + vấn đề có mã + hỗ trợ cụ thể + kế hoạch.'),
    t('Late? Send new date, status, cause, impact, options + recommendation — as soon as you know.', 'Sắp trễ? Gửi ngày mới, hiện trạng, nguyên nhân, ảnh hưởng, phương án + đề xuất — ngay khi biết.'),
    t('Never hide a delay with silent overtime.', 'Không giấu trễ bằng làm thêm giờ lặng lẽ.'),
  ], en)}
<p>${t('General progress reporting in product teams: ', 'Báo cáo tiến độ nói chung ở đội sản phẩm: ')}${ag('agl-6-3-bao-cao', t('lesson 6.3', 'bài 6.3'))}; ${t('the same messages in English: ', 'cùng các tin nhắn bằng tiếng Anh: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-4-3-bao-tre', t('Technical English 4.3', 'Tiếng Anh kỹ thuật 4.3'))}. ${t('Next', 'Tiếp theo')}: ${ag('agl-9-8-lab', t('9.8 — the chapter lab', '9.8 — lab của chương'))}.</p>
`);
};
