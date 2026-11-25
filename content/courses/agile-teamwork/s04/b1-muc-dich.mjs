/**
 * 4.1 — Code review để làm gì (agl-4-1-muc-dich). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch4/ai-duyet.mjs (mô hình đồ chơi, hạt giống cố định: 3 cách chia người review × 3 kịch bản) — qua ./_ma.mjs.
 * Nguồn (đọc 24/11): Bacchelli & Bird, ICSE 2013 (trang Microsoft Research — trích "reviews are less about defects than expected…");
 * Google eng-practices "The Standard of Code Review" ("definitely improves the overall code health"); Heartbleed — Wikipedia
 * (Seggelmann gửi, Henson review, đưa vào kho 31/12/2011; công bố 04/2014, CVE-2014-0160).
 * Ranh giới: ba phán quyết / thứ tự đọc / suggested changes ⇒ Git 6.2; review mã AI ⇒ ai-coding 2.1; review test ⇒ testing 10.3.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const kb = (n) => RA.aiDuyet.split('$ node ai-duyet.mjs')[n].replace(/^[^\n]*\n/, '').trim();

export const L41 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.1', 'Chương 4 · Bài 4.1', `
<h2>${t('4.1 — What code review is for', '4.1 — Code review để làm gì')}</h2>
<p class="lead">${t(
    'Most student teams treat review as a gate the leader guards: the leader reads everything, finds mistakes, clicks Approve. This lesson shows, with research and a simulation of your own team, why that design fails — and what review is actually for: shared understanding of the code first, defects second, and never a way to catch people out.',
    'Phần lớn nhóm sinh viên coi review là cánh cổng do trưởng nhóm canh: trưởng nhóm đọc hết, tìm lỗi, bấm Approve. Bài này cho thấy, bằng nghiên cứu và bằng mô phỏng chính nhóm của bạn, vì sao thiết kế đó hỏng — và review thực ra để làm gì: trước hết là cả nhóm cùng hiểu mã, sau đó mới là bắt lỗi, và không bao giờ là công cụ bắt lỗi người.')}</p>
${note(t('The mechanics — the three verdicts, batching comments, suggested changes, the order to read a PR — are in ', 'Phần thao tác — ba loại phán quyết, gom bình luận, suggested changes, thứ tự đọc một PR — có ở ') + cs('git', 'git-6-2-review', 'Git 6.2') + t('. Reviewing AI-written code: ', '. Review mã do AI viết: ') + cs('ai-coding', 'ai-2-1-review', 'AI Coding 2.1') + t('; reviewing tests: ', '; review test: ') + cs('testing', 'tst-10-3-review', 'Testing 10.3') + t('. This chapter is the <em>team</em> side: who reviews whom, how fast, in what tone, and what the leader does when it goes wrong.', '. Chương này là phía <em>nhóm</em>: ai review ai, nhanh cỡ nào, giọng ra sao, và trưởng nhóm làm gì khi trục trặc.'))}

<h3>${t('Everyday picture: proofreading the group report', 'Liên tưởng đời thường: đọc chéo bài báo cáo nhóm')}</h3>
<p>${t(
    'A group of five writes a 40-page report, eight pages each. Version one: the leader proofreads all forty pages the night before the deadline. Version two: each person reads the next person’s eight pages during the week. In version two the leader is not a bottleneck, typos get caught earlier — and, more importantly, when the lecturer asks "explain section 3" to someone who did not write it, two people can answer. Code review is the second version.',
    'Nhóm năm người viết báo cáo 40 trang, mỗi người tám trang. Cách một: trưởng nhóm đọc soát cả bốn mươi trang vào đêm trước hạn nộp. Cách hai: trong tuần, mỗi người đọc tám trang của người kế tiếp. Ở cách hai trưởng nhóm không thành nút thắt, lỗi chính tả bị bắt sớm hơn — và quan trọng hơn, khi giảng viên hỏi "giải thích phần 3" một người không viết phần đó, có hai người trả lời được. Code review là cách thứ hai.')}</p>

<h3>${t('What the research found', 'Nghiên cứu tìm thấy gì')}</h3>
${bang([t('Source', 'Nguồn'), t('Finding', 'Phát hiện'), t('For your team', 'Với nhóm bạn')], [
    [ng('https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/', 'Bacchelli &amp; Bird, ICSE 2013 (Microsoft)'),
      t('Developers say finding defects is the main motivation, but "reviews are less about defects than expected and instead provide additional benefits such as knowledge transfer, increased team awareness, and creation of alternative solutions".', 'Lập trình viên nói bắt lỗi là động lực chính, nhưng "review ít liên quan tới lỗi hơn kỳ vọng và thay vào đó mang lại lợi ích khác như truyền kiến thức, tăng hiểu biết chung của nhóm và tạo ra lời giải thay thế".'),
      t('Measure review by "how many people understand each screen", not by "how many bugs the leader found".', 'Đo review bằng "bao nhiêu người hiểu mỗi màn", không phải "trưởng nhóm bắt được bao nhiêu lỗi".')],
    [ng('https://google.github.io/eng-practices/review/reviewer/standard.html', 'Google eng-practices — The Standard of Code Review'),
      t('Approve once the change "definitely improves the overall code health", even if it is not perfect; there is no such thing as perfect code, only better code.', 'Duyệt khi thay đổi "chắc chắn làm sức khoẻ chung của mã tốt lên", dù chưa hoàn hảo; không có mã hoàn hảo, chỉ có mã tốt hơn.'),
      t('Review is not the place to impose personal taste or block for days over naming.', 'Review không phải chỗ áp sở thích cá nhân hay chặn nhiều ngày vì chuyện đặt tên.')],
    [ng('https://google.github.io/eng-practices/review/reviewer/speed.html', 'Google eng-practices — Speed of Code Reviews'),
      t('"One business day is the maximum time it should take to respond to a code review request."', '"Một ngày làm việc là thời gian tối đa để phản hồi một yêu cầu review."'),
      t('LabFlow’s agreement from 3.2: first response within one working day.', 'Thoả thuận LabFlow từ bài 3.2: phản hồi lần đầu trong một ngày làm việc.')],
  ])}

<h3>${t('Four purposes, in order', 'Bốn mục đích, theo thứ tự')}</h3>
<ol>
<li>${t('<strong>Shared understanding.</strong> After merge, at least two people can explain and change every screen. In SWP391 this matters directly: at the final defence the lecturer may ask any member about any part, and when someone drops out mid-semester another member must take over their screens.', '<strong>Cùng hiểu.</strong> Sau khi merge, ít nhất hai người giải thích và sửa được mọi màn. Ở SWP391 điều này tác động trực tiếp: lúc bảo vệ, giảng viên có thể hỏi bất kỳ thành viên nào về bất kỳ phần nào, và khi có người bỏ giữa kỳ thì phải có người khác nhận lại màn của họ.')}</li>
<li>${t('<strong>Correctness against the ticket.</strong> The reviewer checks behaviour against the acceptance criteria the author ticked in the PR description (3.2) — the one thing tests written by the same author tend to miss.', '<strong>Đúng với ticket.</strong> Người review soát hành vi theo tiêu chí chấp nhận mà tác giả đã tick trong mô tả PR (3.2) — đúng thứ mà test do chính tác giả viết hay bỏ sót.')}</li>
<li>${t('<strong>Risk the author cannot see.</strong> Security (lesson 4.4), shared files, migrations, data shown to the wrong person.', '<strong>Rủi ro tác giả không tự thấy.</strong> Bảo mật (bài 4.4), tệp chung, migration, dữ liệu hiện cho sai người.')}</li>
<li>${t('<strong>Consistency.</strong> The code looks like one team wrote it. Most of this should be automated (formatter, linter, CI — chapter 3), so humans spend their attention on 1–3.', '<strong>Nhất quán.</strong> Mã trông như một nhóm viết. Phần lớn việc này nên tự động (định dạng, linter, CI — chương 3), để con người dồn sự chú ý cho mục 1–3.')}</li>
</ol>
${cl('warn', `<p><strong>${t('What review is NOT', 'Review KHÔNG phải là')}</strong></p><ul>
<li>${t('A test of the author. Comments are about the code ("this query…"), never the person ("you always…"). Lesson 4.2 has a script that flags the difference.', 'Bài kiểm tra tác giả. Nhận xét nói về mã ("câu truy vấn này…"), không bao giờ về người ("ông lúc nào cũng…"). Bài 4.2 có script đánh dấu sự khác biệt đó.')}</li>
<li>${t('The leader’s private power. The leader’s own PRs are reviewed by a member with the same rules — and that member must feel safe to press Request changes.', 'Quyền riêng của trưởng nhóm. PR của chính trưởng nhóm cũng do một thành viên review theo cùng luật — và thành viên đó phải thấy an toàn khi bấm Request changes.')}</li>
<li>${t('A replacement for testing. A reviewer reads 300 lines in an hour; they do not run every case. Review + CI + the author’s own testing, together.', 'Thứ thay cho test. Người review đọc 300 dòng trong một giờ; họ không chạy mọi ca. Review + CI + tác giả tự thử, cả ba cùng lúc.')}</li>
<li>${t('A way to inflate LOC. Review comments do not count as LOC in SWP391; what counts is that the screen you own is correct and you can defend it.', 'Cách thổi phồng LOC. Nhận xét review không được tính LOC ở SWP391; điều được tính là màn bạn giữ chạy đúng và bạn bảo vệ được nó.')}</li>
</ul>`)}

<h3>${t('Lab — who should review? Simulate your own team', 'Lab — ai nên review? Mô phỏng chính nhóm bạn')}</h3>
<p>${t('The model below is a <strong>toy</strong> with stated assumptions (fixed seed, so you get the same numbers): iteration 2 has 20 working days and 30 PRs (six per member, 60–350 lines). A reviewer can read carefully about N lines per day on top of their own coding. A PR waits in its reviewer’s queue in the order it was opened; after review, one day of fixes, then merge. Three policies:', 'Mô hình dưới đây là <strong>mô hình đồ chơi</strong> với giả định ghi rõ (hạt giống cố định nên bạn chạy ra đúng số này): iteration 2 có 20 ngày làm việc và 30 PR (mỗi người sáu PR, 60–350 dòng). Một người đọc kỹ được khoảng N dòng mỗi ngày ngoài giờ code của mình. PR xếp hàng chờ người review theo thứ tự mở; review xong, sửa một ngày, rồi merge. Ba cách chia:')}</p>
${js(MA.aiDuyet)}
<p>${t('Scenario 1 — normal weeks, 300 lines/day each:', 'Kịch bản 1 — tuần bình thường, mỗi người 300 dòng/ngày:')}</p>
${out('$ node ai-duyet.mjs\n' + kb(1))}
<p>${t('In a calm week every policy works: the leader can read 4,591 lines in 20 days. This is why teams believe policy A is fine. Now the leader has three days of exams (days 8–10):', 'Tuần êm thì cách nào cũng chạy: trưởng nhóm đọc nổi 4.591 dòng trong 20 ngày. Đó là lý do các nhóm tin cách A ổn. Giờ trưởng nhóm có ba ngày thi (ngày 8–10):')}</p>
${out('$ node ai-duyet.mjs 300 8,9,10\n' + kb(2))}
<p>${t('And the realistic week: the leader is also coding, answering questions and writing reports, so they really have 150 lines/day — same for everyone in the model:', 'Và tuần thực tế: trưởng nhóm còn code, trả lời câu hỏi, viết báo cáo, nên thật ra chỉ còn 150 dòng/ngày — mô hình cho mọi người cùng mức đó:')}</p>
${out('$ node ai-duyet.mjs 150 8,9,10\n' + kb(3))}
${cl('info', `<p><strong>${t('Reading the numbers', 'Đọc các con số')}</strong></p><ul>
<li>${t('Policy A has <strong>one point of failure</strong>. With busy weeks and three days away, the median PR waits 9 days and 13 of 30 PRs miss the iteration deadline. B and C barely notice the absence: only one fifth of PRs depended on C1.', 'Cách A có <strong>một điểm chết</strong>. Tuần bận cộng ba ngày vắng, PR trung vị chờ 9 ngày và 13/30 PR trễ hạn iteration. B và C gần như không thấy C1 vắng: chỉ một phần năm số PR phụ thuộc C1.')}</li>
<li>${t('Policy A makes C1 read 4,591 lines while C3–C5 read 0. That is also four people who never learn how the others wrote their screens.', 'Cách A bắt C1 đọc 4.591 dòng trong khi C3–C5 đọc 0. Đó cũng là bốn người không bao giờ biết người khác viết màn của họ thế nào.')}</li>
<li>${t('B and C have the same waiting time, but C changes pairs every week, so after one iteration 4–5 people have read each domain instead of 2. Over the semester (lesson 4.5) every member reviews every other member for three weeks.', 'B và C có thời gian chờ như nhau, nhưng C đổi cặp mỗi tuần, nên sau một iteration mỗi miền có 4–5 người đã đọc thay vì 2. Cả kỳ (bài 4.5) mỗi thành viên review mỗi thành viên khác ba tuần.')}</li>
<li>${t('The model ignores re-review rounds and quality differences between reviewers — the direction of the result is what to keep, not the exact days.', 'Mô hình bỏ qua các vòng review lại và chênh lệch chất lượng giữa người review — thứ cần giữ là chiều của kết quả, không phải số ngày chính xác.')}</li>
</ul>`)}
${note(t('"But members review badly — they just click Approve." True at first. The fix is not to take review away from them but to teach it (4.2), give them a checklist (4.4), and let the leader spot-check: read one PR per week that someone else approved, and comment on the <em>review</em>, not only on the code.', '"Nhưng thành viên review kém — bấm Approve cho xong." Lúc đầu đúng vậy. Cách sửa không phải tước việc review khỏi họ mà là dạy (4.2), đưa checklist (4.4), và trưởng nhóm kiểm tra mẫu: mỗi tuần đọc một PR người khác đã duyệt, và nhận xét về <em>chính lượt review</em>, không chỉ về mã.'))}

<h3>🕵️ ${t('Incident: one reviewer, New Year’s Eve — Heartbleed', 'Sự cố: một người review, đêm giao thừa — Heartbleed')}</h3>
<p>${t(
    'In 2011 a PhD student, Robin Seggelmann, contributed the TLS "heartbeat" extension to OpenSSL. One core developer, Stephen Henson, reviewed it and did not notice a missing bounds check; the change entered OpenSSL’s repository on 31 December 2011. In April 2014 it was disclosed as <strong>Heartbleed</strong> (CVE-2014-0160): any client could ask a server to echo back up to 64 KB of its memory — private keys, passwords, session cookies — and roughly two years of servers had been exposed (',
    'Năm 2011, một nghiên cứu sinh, Robin Seggelmann, đóng góp phần mở rộng "heartbeat" của TLS cho OpenSSL. Một lập trình viên lõi, Stephen Henson, review và không nhận ra thiếu một phép kiểm giới hạn; thay đổi vào kho mã OpenSSL ngày 31/12/2011. Tháng 4/2014 nó được công bố với tên <strong>Heartbleed</strong> (CVE-2014-0160): bất kỳ máy khách nào cũng có thể yêu cầu máy chủ trả lại tới 64 KB bộ nhớ của nó — khoá riêng, mật khẩu, cookie phiên — và máy chủ đã hở khoảng hai năm (')}${ng('https://en.wikipedia.org/wiki/Heartbleed', 'Wikipedia: Heartbleed')}).</p>
<p>${t(
    'After the disclosure Seggelmann said OpenSSL was "not reviewed by enough people". The lesson for a student team is not "review harder" but <strong>design review so one tired person is not the only defence</strong>: two people on risky files (CODEOWNERS, lesson 4.5), a checklist for the classes of bug that keep recurring (4.4), and tests for boundaries — the heartbeat bug was precisely a length the code trusted from the other side.',
    'Sau khi lỗi được công bố, Seggelmann nói OpenSSL "không được đủ nhiều người review". Bài học cho nhóm sinh viên không phải là "review chăm hơn" mà là <strong>thiết kế việc review sao cho một người mệt mỏi không phải là lớp phòng thủ duy nhất</strong>: hai người cho tệp rủi ro (CODEOWNERS, bài 4.5), checklist cho các loại lỗi cứ lặp lại (4.4), và test cho biên — lỗi heartbeat chính là một độ dài mà mã tin theo lời phía bên kia.')}</p>

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'At an outsourcing company review is usually mandatory and recorded: many Japanese projects keep a review record (each comment, its severity, who fixed it, when) and report the number of review findings per thousand lines as a quality metric — chapter 9 (',
    'Ở công ty outsourcing, review thường bắt buộc và có ghi nhận: nhiều dự án Nhật giữ biên bản review (từng nhận xét, mức độ, ai sửa, khi nào) và báo cáo số lỗi phát hiện qua review trên mỗi nghìn dòng như một chỉ số chất lượng — chương 9 (')}${ag('agl-9-2-vong-doi-v-model', t('9.2', '9.2'))}${t(
    '). As a new hire you will be reviewed far more than you review. Treat the first twenty comments on your first PR as free training, and read the PRs of seniors even when nobody asks you to — that is how you learn the codebase fastest.',
    '). Là người mới, bạn sẽ bị review nhiều hơn nhiều so với đi review. Coi hai mươi nhận xét đầu tiên trên PR đầu tiên là buổi học miễn phí, và đọc PR của các anh chị đi trước kể cả khi không ai nhờ — đó là cách học codebase nhanh nhất.')}</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Copy <code>ai-duyet.mjs</code>. (1) Run <code>node ai-duyet.mjs 200 8,9,10</code> and find the reading speed at which policy A starts missing the deadline. (2) Add a policy D: "rotation, but C1 additionally approves every PR" (two reviewers for everything) and compare. Which would you choose for LabFlow, and what would you tell the team when announcing it?', 'Chép <code>ai-duyet.mjs</code>. (1) Chạy <code>node ai-duyet.mjs 200 8,9,10</code> và tìm tốc độ đọc mà từ đó cách A bắt đầu trễ hạn. (2) Thêm cách D: "xoay vòng, nhưng C1 duyệt thêm mọi PR" (hai người review cho mọi thứ) và so sánh. Bạn chọn cách nào cho LabFlow, và sẽ nói gì với nhóm khi công bố?')}</p>
${giai(t('Answer', 'Đáp án'), `${js(MA.baiTap41)}
${out(RA.baiTap41)}
<ul>
<li>${t('(1) With three days of absence, policy A already misses the deadline at 300 lines/day (1 PR) and degrades steadily: 9 late PRs at 200, 13 at 150. There is no safe threshold — the policy depends on one person never being busy.', '(1) Có ba ngày vắng, cách A đã trễ hạn ngay ở 300 dòng/ngày (1 PR) và tệ dần đều: 9 PR trễ ở 200, 13 ở 150. Không có ngưỡng an toàn — cách này dựa vào việc một người không bao giờ bận.')}</li>
<li>${t('(2) Policy D still sends every PR through C1’s queue, so it inherits A’s single point of failure exactly: same 9-day median, same 13 late PRs. Two reviewers on <em>everything</em> doubles the cost and fixes nothing.', '(2) Cách D vẫn đưa mọi PR qua hàng đợi của C1, nên thừa hưởng nguyên điểm chết của A: cùng trung vị 9 ngày, cùng 13 PR trễ. Hai người review cho <em>mọi thứ</em> nhân đôi công sức mà không sửa được gì.')}</li>
<li>${t('Choose C, plus a second reviewer only where risk is high: shared files and migrations (CODEOWNERS, 4.5). Announce it as "everyone reviews, everyone gets reviewed, including me" — and say why: knowledge for the defence, no waiting on one person.', 'Chọn C, cộng người review thứ hai chỉ ở chỗ rủi ro cao: tệp chung và migration (CODEOWNERS, 4.5). Công bố là "ai cũng review, ai cũng được review, kể cả mình" — và nói lý do: kiến thức cho buổi bảo vệ, không phải chờ một người.')}</li>
</ul>`)}

${phongVan([
    [t('"What is code review for?"', '"Code review để làm gì?"'), t('Mostly shared understanding — after merge more than one person can explain and change the code — then correctness against the requirement and catching risks the author cannot see. Research at Microsoft (Bacchelli and Bird, 2013) found reviews are less about defects than people expect and more about knowledge transfer.', 'Chủ yếu là cùng hiểu — sau khi merge có hơn một người giải thích và sửa được mã — rồi mới đến đúng yêu cầu và bắt rủi ro tác giả không tự thấy. Nghiên cứu ở Microsoft (Bacchelli và Bird, 2013) cho thấy review ít về lỗi hơn người ta nghĩ và nhiều về truyền kiến thức.')],
    [t('"In your student project, who reviewed code?"', '"Trong đồ án sinh viên, ai review code?"'), t('A rotating pair changed every week, plus the owner of any shared file. I was the leader and my PRs were reviewed by members too. We measured how long PRs waited and kept first responses under one working day.', 'Một cặp xoay vòng đổi mỗi tuần, cộng chủ của tệp chung bị chạm. Mình là trưởng nhóm và PR của mình cũng do thành viên review. Nhóm đo thời gian PR chờ và giữ phản hồi đầu tiên dưới một ngày làm việc.')],
    [t('"Isn’t it faster if the most senior person reviews everything?"', '"Người giỏi nhất review hết chẳng phải nhanh hơn sao?"'), t('Only while that person is free. They become the bottleneck and the single point of failure, and the rest of the team never learns the code. Better: everyone reviews, with a second senior reviewer only for risky areas.', 'Chỉ khi người đó rảnh. Họ thành nút thắt và điểm chết duy nhất, và cả nhóm không bao giờ học được mã. Tốt hơn: ai cũng review, chỉ thêm người giỏi làm người review thứ hai ở vùng rủi ro.')],
    [t('"What does Heartbleed teach about code review?"', '"Heartbleed dạy gì về code review?"'), t('A single reviewer missed a missing bounds check in OpenSSL in 2011; it was exploitable for about two years. One tired reviewer should never be the only defence for risky code: add a second reviewer, a checklist and boundary tests.', 'Một người review duy nhất đã bỏ sót phép kiểm giới hạn trong OpenSSL năm 2011; lỗi bị khai thác được khoảng hai năm. Một người review mệt mỏi không bao giờ được là lớp phòng thủ duy nhất cho mã rủi ro: thêm người review thứ hai, checklist và test biên.')],
  ], en)}

${thuatNgu([
    ['code review', t('Another person reads a change before it merges.', 'Người khác đọc một thay đổi trước khi nó được merge.')],
    ['modern code review', t('Lightweight, tool-based review of each change (PR), as opposed to formal inspection meetings.', 'Review gọn nhẹ bằng công cụ cho từng thay đổi (PR), khác với các buổi họp thanh tra chính thức.')],
    ['bus factor', t('How many people would have to leave before nobody understands a part.', 'Phải mất bao nhiêu người thì không còn ai hiểu một phần mã.')],
    [t('bottleneck', 'nút thắt'), t('One step everything waits on.', 'Một bước mà mọi thứ phải chờ.')],
    [t('rotation', 'xoay vòng'), t('Reviewer pairs that change on a schedule.', 'Cặp người review đổi theo lịch.')],
    ['spot-check', t('Leader reads a sample of already-approved PRs.', 'Trưởng nhóm đọc mẫu vài PR đã được duyệt.')],
  ], en)}

${tomTat([
    t('Review is first for shared understanding, then correctness against the ticket, then risk; style is automated.', 'Review trước hết để cùng hiểu, rồi đúng với ticket, rồi rủi ro; văn phong để máy lo.'),
    t('"Leader reviews everything" works only in calm weeks; with exams it stalls the team (simulation: median wait 9 days, 13/30 PRs late).', '"Trưởng nhóm duyệt hết" chỉ chạy được tuần êm; vào mùa thi nó làm cả nhóm đứng (mô phỏng: chờ trung vị 9 ngày, 13/30 PR trễ).'),
    t('Rotate pairs weekly: same speed as a fixed pair, but 4–5 people know each domain instead of 2.', 'Xoay cặp hằng tuần: nhanh như cặp cố định, nhưng mỗi miền có 4–5 người biết thay vì 2.'),
    t('The leader’s PRs are reviewed too; the leader spot-checks reviews, not just code.', 'PR của trưởng nhóm cũng được review; trưởng nhóm kiểm tra mẫu các lượt review, không chỉ mã.'),
    t('Heartbleed (2011–2014): one reviewer is not a defence for risky code.', 'Heartbleed (2011–2014): một người review không phải là lớp phòng thủ cho mã rủi ro.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-4-2-viet-review', t('4.2 — Writing useful review comments', '4.2 — Viết nhận xét review có ích'))}.</p>
`);
};

export default {
  title: '4.1 — What code review is for|||4.1 — Code review để làm gì',
  slug: 'agl-4-1-muc-dich',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn mục đích của review theo thứ tự (cùng hiểu, đúng ticket, rủi ro, nhất quán) và những gì review không phải; nghiên cứu Microsoft 2013 và chuẩn review của Google; lab mô hình chạy thật: trưởng nhóm duyệt hết vs xoay vòng cố định vs xoay vòng đổi cặp mỗi tuần, khi trưởng nhóm đi thi 3 ngày; sự cố Heartbleed (một người review, 2011–2014); tình huống đi làm: biên bản review ở dự án Nhật.',
  content: L41(true) + L41(false),
};
