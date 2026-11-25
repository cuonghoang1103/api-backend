/**
 * 1.5 — Lab: Sprint 0 cho LabFlow (agl-1-5-lab — bài MỚI thêm vào khung ch1, 24/11/2026, agent agt).
 * Mã + output THẬT: scratchpad/agt/lab/ch1/{lich-sprint,kanban-wip,burndown}.mjs + du-lieu/*.csv — qua ./_ma.mjs.
 */
import { bang, cl, note, giai, js, out, ag, ac, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const [BD_A, BD_B, BD_C] = RA.burndown.split(/\n\s*\n/);

export const L15 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 1 · Lab', 'Chương 1 · Lab', `
<h2>${t('1.5 — Lab: Sprint 0 for LabFlow', '1.5 — Lab: Sprint 0 cho LabFlow')}</h2>
<p class="lead">${t(
    'You have just been chosen as leader of a five-person SWP391 team building LabFlow AI (React + Spring Boot + PostgreSQL). Before anyone writes a line of feature code, a good leader spends a few hours on "Sprint 0": the rhythm, the board, the rules, and the habit of reading the team’s numbers. This lab produces exactly those, using the scripts from lessons 1.1–1.3. Budget: 2–3 hours. If you are not in a team yet, do it for an imaginary team — the artefacts carry straight over.',
    'Bạn vừa được chọn làm trưởng nhóm năm người SWP391 làm LabFlow AI (React + Spring Boot + PostgreSQL). Trước khi ai viết dòng code tính năng nào, một trưởng nhóm tốt dành vài giờ cho "Sprint 0": nhịp, bảng, luật, và thói quen đọc số liệu của nhóm. Lab này làm ra đúng những thứ đó, dùng các script ở bài 1.1–1.3. Thời gian: 2–3 giờ. Nếu chưa có nhóm, làm cho một nhóm tưởng tượng — sản phẩm dùng lại được nguyên vẹn.')}</p>

<h3>${t('What you need', 'Cần chuẩn bị')}</h3>
<ul>
<li>${t('Node.js 18 or newer (the outputs here are from Node 22.22.2). No packages to install — every script uses only <code>node:fs</code>.', 'Node.js 18 trở lên (output trong bài chạy bằng Node 22.22.2). Không cần cài gói — mọi script chỉ dùng <code>node:fs</code>.')}</li>
<li>${t('A folder <code>lab1/</code> with the scripts copied from the lessons: <code>lich-sprint.mjs</code> (1.2), <code>kanban-wip.mjs</code> (1.3), <code>burndown.mjs</code> (below), and <code>du-lieu/</code> with the three CSV files below.', 'Thư mục <code>lab1/</code> chứa các script chép từ bài: <code>lich-sprint.mjs</code> (1.2), <code>kanban-wip.mjs</code> (1.3), <code>burndown.mjs</code> (dưới đây), và <code>du-lieu/</code> chứa ba tệp CSV bên dưới.')}</li>
<li>${t('Your real timetable (or an example), a CT Work project (<a href="/work">/work</a>) for the team.', 'Thời khoá biểu thật (hoặc ví dụ), một dự án CT Work (<a href="/work">/work</a>) cho nhóm.')}</li>
</ul>

<h3>${t('Tasks', 'Yêu cầu')}</h3>
<ol>
<li>${t('<strong>Calendar.</strong> Write <code>cau-hinh.json</code> for your semester (start date, weeks per iteration, holidays, meeting times). Generate the <code>.ics</code>, import it into a shared team calendar. No sprint may span a holiday longer than one week.', '<strong>Lịch.</strong> Viết <code>cau-hinh.json</code> cho kỳ học của bạn (ngày bắt đầu, số tuần mỗi iteration, kỳ nghỉ, giờ họp). Sinh tệp <code>.ics</code>, nhập vào một lịch chung của nhóm. Không sprint nào được vắt qua kỳ nghỉ dài hơn một tuần.')}</li>
<li>${t('<strong>Board.</strong> Create the CT Work board with the columns of lesson 1.3, write each column’s entry/exit policy in its description, and set the WIP limits.', '<strong>Bảng.</strong> Tạo bảng CT Work với các cột của bài 1.3, ghi luật vào/ra của từng cột vào phần mô tả, đặt giới hạn WIP.')}</li>
<li>${t('<strong>Rules.</strong> Write and pin the working agreement (1.4) and the Definition of Done (1.2). Each member reacts ✅.', '<strong>Luật.</strong> Viết và ghim thoả thuận làm việc (1.4) và Definition of Done (1.2). Mỗi thành viên thả ✅.')}</li>
<li>${t('<strong>Read three burndowns.</strong> Run <code>burndown.mjs</code> on the three CSV files of three LabFlow teams (same backlog, same sprint 2). For each team write: what happened (2 sentences), the most likely cause, and one action for their retro.', '<strong>Đọc ba burndown.</strong> Chạy <code>burndown.mjs</code> trên ba tệp CSV của ba nhóm LabFlow (cùng backlog, cùng sprint 2). Với mỗi nhóm viết: chuyện gì đã xảy ra (2 câu), nguyên nhân khả dĩ nhất, và một hành động cho buổi retro của họ.')}</li>
<li>${t('<strong>One experiment on the simulation.</strong> In <code>kanban-wip.mjs</code>, change rule B so that <em>two</em> people (C1 and C2) review. Predict the number of cards done, run it, and explain the result in 3 sentences.', '<strong>Một thí nghiệm trên mô phỏng.</strong> Trong <code>kanban-wip.mjs</code>, sửa luật B để <em>hai</em> người (C1 và C2) review. Đoán số thẻ xong, chạy, giải thích kết quả trong 3 câu.')}</li>
</ol>

<h3>${t('The burndown script', 'Script burndown')}</h3>
<p>${t('It reads a CSV copied from the board (<code>ma,ten,diem,them,xong</code> — code, title, story points, date added if it came in mid-sprint, done date), counts only working days, prints a text chart and writes an SVG you can paste into the weekly report. Story points are explained in lesson 2.3; for now read them as "relative size".', 'Script đọc CSV chép từ bảng (<code>ma,ten,diem,them,xong</code> — mã, tên, story point, ngày thêm nếu vào giữa sprint, ngày xong), chỉ đếm ngày làm việc, in biểu đồ chữ và ghi một tệp SVG để dán vào báo cáo tuần. Story point được giảng ở bài 2.3; tạm hiểu là "kích cỡ tương đối".')}</p>
${js(MA.burndown)}
<p>${t('The three CSV files:', 'Ba tệp CSV:')}</p>
${out('du-lieu/sprint2-nhom-a.csv\n' + MA.csvA + '\n\ndu-lieu/sprint2-nhom-b.csv\n' + MA.csvB + '\n\ndu-lieu/sprint2-nhom-c.csv\n' + MA.csvC)}
<p>${t('Real output (sprint 2: 25/01 → 26/02/2027, Tết break 01/02 → 14/02 excluded):', 'Output thật (sprint 2: 25/01 → 26/02/2027, bỏ kỳ nghỉ Tết 01/02 → 14/02):')}</p>
${out('$ node burndown.mjs du-lieu/sprint2-nhom-a.csv 2027-01-25 2027-02-26 2027-02-01 2027-02-14\n' + BD_A)}
${out('$ node burndown.mjs du-lieu/sprint2-nhom-b.csv 2027-01-25 2027-02-26 2027-02-01 2027-02-14\n' + BD_B)}
${out('$ node burndown.mjs du-lieu/sprint2-nhom-c.csv 2027-01-25 2027-02-26 2027-02-01 2027-02-14\n' + BD_C)}
${note(t('How to read a burndown: the dotted line is the ideal — the same amount finished every day. The solid line is what is really left at the end of each day. Above the ideal = behind, below = ahead. The <em>shape</em> matters more than any single point.', 'Cách đọc burndown: đường chấm là lý tưởng — mỗi ngày xong một lượng như nhau. Đường đặc là phần thật sự còn lại cuối mỗi ngày. Nằm trên đường lý tưởng = chậm, nằm dưới = nhanh. <em>Hình dạng</em> quan trọng hơn bất kỳ điểm riêng lẻ nào.'))}

<h3>${t('Hints (open one at a time)', 'Gợi ý (mở từng cái)')}</h3>
${giai(t('Hint 1 — task 1', 'Gợi ý 1 — yêu cầu 1'), `<p>${t('The script accepts a JSON file with the same fields as <code>CAU_HINH</code>. If a sprint shows "(vắt qua kỳ nghỉ)", move the boundary: lengthen the iteration before the holiday, or shorten it and treat the leftover week as a hardening week. Practice 1 of lesson 1.2 has one worked example.', 'Script nhận tệp JSON có cùng các trường như <code>CAU_HINH</code>. Nếu sprint nào hiện "(vắt qua kỳ nghỉ)", dời ranh giới: kéo dài iteration trước kỳ nghỉ, hoặc rút ngắn và dùng tuần dư làm tuần gia cố. Thực hành 1 của bài 1.2 có một ví dụ giải sẵn.')}</p>`)}
${giai(t('Hint 2 — task 4', 'Gợi ý 2 — yêu cầu 4'), `<p>${t('Look for three classic shapes: a line that follows the ideal in steps; a long flat line followed by a cliff on the last days; a line that goes <em>up</em> somewhere. Then check the CSV: which cards finished when, which cards have a <code>them</code> date, which are still empty.', 'Tìm ba hình dạng kinh điển: đường bám theo lý tưởng thành từng bậc; đường nằm ngang rất lâu rồi rơi thẳng vào mấy ngày cuối; đường có chỗ đi <em>lên</em>. Rồi soát CSV: thẻ nào xong lúc nào, thẻ nào có ngày <code>them</code>, thẻ nào còn trống.')}</p>`)}
${giai(t('Hint 3 — task 5', 'Gợi ý 3 — yêu cầu 5'), `<p>${t('Change only the <code>reviewer</code> list of rule B. Think in terms of the bottleneck: what limited throughput in B, and how much more capacity does a second reviewer add at that step?', 'Chỉ sửa danh sách <code>reviewer</code> của luật B. Nghĩ theo chỗ tắc: điều gì giới hạn throughput ở B, và người review thứ hai thêm bao nhiêu năng lực ở đúng công đoạn đó?')}</p>`)}

<h3>${t('Rubric (10 points)', 'Tiêu chí chấm (10 điểm)')}</h3>
${bang([t('Criterion', 'Tiêu chí'), t('Points', 'Điểm'), t('Full marks when', 'Đạt điểm tối đa khi')], [
    [t('Calendar', 'Lịch'), '2', t('The .ics imports without errors; every Scrum event of every sprint is present; no sprint spans a long holiday; the calendar is shared with all members.', 'Tệp .ics nhập không lỗi; đủ mọi sự kiện Scrum của mọi sprint; không sprint nào vắt qua kỳ nghỉ dài; lịch đã chia sẻ cho cả nhóm.')],
    [t('Board', 'Bảng'), '2', t('Columns with written entry/exit policies; WIP limits set; at least the first 10 backlog cards exist with acceptance criteria.', 'Các cột có luật vào/ra viết rõ; đã đặt giới hạn WIP; có ít nhất 10 thẻ backlog đầu tiên kèm tiêu chí chấp nhận.')],
    [t('Working agreement + DoD', 'Thoả thuận + DoD'), '2', t('One screen each, specific (times, numbers), with a conflict ladder; all five members reacted.', 'Mỗi cái một màn hình, cụ thể (giờ, con số), có thang xử lý mâu thuẫn; đủ năm người đã thả ✅.')],
    [t('Burndown reading', 'Đọc burndown'), '3', t('Correct diagnosis for all three teams, each backed by evidence from the CSV, each with one concrete retro action that has an owner.', 'Chẩn đoán đúng cả ba nhóm, mỗi chẩn đoán có bằng chứng từ CSV, mỗi nhóm có một hành động retro cụ thể và có người phụ trách.')],
    [t('Experiment', 'Thí nghiệm'), '1', t('Prediction written before running; result explained with the bottleneck idea.', 'Ghi dự đoán trước khi chạy; giải thích kết quả bằng ý chỗ tắc.')],
  ])}
<p><strong>${t('Pass', 'Đạt')}</strong>: ${t('≥ 7 points and every member can find the next daily in their own calendar.', '≥ 7 điểm và mọi thành viên tìm được buổi daily kế tiếp trong lịch của chính mình.')}</p>

<h3>${t('Solution', 'Lời giải')}</h3>
${giai(t('Task 4 — the three burndowns', 'Yêu cầu 4 — ba burndown'), `
<p><strong>${t('Team A — healthy.', 'Nhóm A — khoẻ.')}</strong> ${t('The line steps down close to the ideal and reaches 0 on the last day. Steps (flat for a day, then a drop) are normal: points only burn when a whole card is Done. Evidence: done dates spread over the sprint (27/01, 28/01, 15/02, …, 25/02). Retro action: keep it; one small improvement, e.g. "split 5-point cards before planning" (LF-26 and LF-28 took 6 days each — see the cycle-time answer in 1.3). Owner: the proxy PO.', 'Đường đi xuống thành bậc, sát đường lý tưởng và chạm 0 ngày cuối. Có bậc (nằm ngang một ngày rồi rơi) là bình thường: điểm chỉ giảm khi cả thẻ Done. Bằng chứng: ngày xong rải đều cả sprint (27/01, 28/01, 15/02, …, 25/02). Hành động retro: giữ nguyên; một cải tiến nhỏ, vd "chia nhỏ thẻ 5 điểm trước planning" (LF-26 và LF-28 mất 6 ngày mỗi thẻ — xem đáp án cycle time ở 1.3). Người phụ trách: PO đại diện.')}</p>
<p><strong>${t('Team B — the hockey stick.', 'Nhóm B — hình gậy khúc côn cầu.')}</strong> ${t('Flat at 31–34 for 12 of 15 working days, then a cliff on the last three days, and still 10 points left (LF-26, LF-28). Either the work really was done at the end (big cards, no integration until the last minute, everything merged the night before the review), or cards were not moved on the board until the end — both mean the leader could not see a problem until it was too late. Evidence: six cards done on 24–26/02. Retro actions: WIP 1 per person and "a card that does not move for 2 days is raised at the daily" (owner: leader); split cards so that each finishes within 2–3 days (owner: proxy PO). Note how this is the same story as team B of the git log in ', 'Nằm ngang ở 31–34 suốt 12/15 ngày làm việc, rồi rơi thẳng ba ngày cuối, mà vẫn còn 10 điểm (LF-26, LF-28). Hoặc việc thật sự dồn cuối (thẻ to, không tích hợp tới phút chót, merge tất cả đêm trước buổi review), hoặc thẻ không được kéo trên bảng cho tới cuối — cả hai đều có nghĩa trưởng nhóm không thấy vấn đề cho tới khi đã muộn. Bằng chứng: sáu thẻ xong trong 24–26/02. Hành động retro: WIP 1 thẻ/người và "thẻ đứng yên 2 ngày thì nêu ở daily" (phụ trách: trưởng nhóm); chia thẻ để mỗi thẻ xong trong 2–3 ngày (phụ trách: PO đại diện). Để ý đây là cùng câu chuyện với nhóm B trong git log ở ')}${ag('agl-0-8-bat-dau-tai-day', t('Start here (1/2)', 'Bắt đầu tại đây (1/2)'))}.</p>
<p><strong>${t('Team C — scope creep.', 'Nhóm C — phạm vi phình.')}</strong> ${t('Normal start (34 → 18 points by 16/02), then on 17/02 the line goes <em>up</em> to 23 and stays there on 18/02: 8 points were added mid-sprint — two "small requests" from the lecturer (LF-41, LF-42) and an urgent bug (LF-43). The team finished the added work, and two committed cards (LF-27, LF-28 = 8 points) were left — exactly the amount added. The team did not work less; the plan changed silently. Retro actions: new requests go to the Product Backlog and are discussed with the lecturer as "if we add this, what do we drop?" (owner: proxy PO); urgent bugs go through an expedite lane and the PO explicitly removes something of the same size. Also: a burndown hides scope changes — a <em>burnup</em> chart (done line + total-scope line) would have shown the two lines separately.', 'Đầu sprint bình thường (34 → 18 điểm tới 16/02), rồi 17/02 đường đi <em>lên</em> 23 và đứng yên ở đó ngày 18/02: 8 điểm được thêm giữa sprint — hai "nhờ nhỏ" của giảng viên (LF-41, LF-42) và một lỗi gấp (LF-43). Nhóm làm xong phần thêm, còn hai thẻ đã cam kết (LF-27, LF-28 = 8 điểm) bị bỏ lại — đúng bằng lượng đã thêm. Nhóm không làm ít đi; kế hoạch bị đổi lặng lẽ. Hành động retro: yêu cầu mới vào Product Backlog và được bàn với giảng viên theo kiểu "thêm cái này thì bỏ cái gì?" (phụ trách: PO đại diện); lỗi gấp đi làn ưu tiên và PO bỏ rõ ràng một mục cùng cỡ. Thêm: burndown che mất thay đổi phạm vi — biểu đồ <em>burnup</em> (đường đã xong + đường tổng phạm vi) sẽ cho thấy hai đường riêng biệt.')}</p>`)}
${giai(t('Task 5 — two reviewers', 'Yêu cầu 5 — hai người review'), `
${out('$ node kanban-wip.mjs        # sau khi sửa luật B: reviewer: [\'C1\', \'C2\']\n' + RA.kanbanB2)}
<p>${t('With one reviewer, review capacity (about 40 half-days minus rework reviews) capped throughput at 27 cards. A second reviewer roughly doubles that capacity, so review is no longer the bottleneck and throughput jumps to 36 — almost as high as C (38) where everyone reviews. Idle time falls from 55 to 5 half-days. Lesson for the leader: you do not need everyone to review everything; you need enough review capacity that review stops being the constraint — two reliable reviewers already get you 90% of the way.', 'Với một người review, năng lực review (khoảng 40 buổi trừ các lần review lại) chặn throughput ở 27 thẻ. Người review thứ hai gần như nhân đôi năng lực đó, nên review không còn là chỗ tắc và throughput nhảy lên 36 — gần bằng C (38) nơi ai cũng review. Thời gian rảnh giảm từ 55 xuống 5 buổi. Bài học cho trưởng nhóm: không cần ai cũng review mọi thứ; cần đủ năng lực review để review không còn là ràng buộc — hai người review chắc tay đã đưa bạn đi được 90% chặng đường.')}</p>`)}
${giai(t('Tasks 1–3 — what a good submission looks like', 'Yêu cầu 1–3 — bài nộp tốt trông thế nào'), `<p>${t('Calendar: see practice 1 of lesson 1.2 (real output with <code>[4, 3, 3]</code>). Board: the table in 1.3, policies copied into column descriptions. Agreement and DoD: the examples in 1.4 and 1.2, but with <em>your</em> times and with every member’s exception written in. A submission that copies the examples word for word scores at most 1/2 on criterion 3 — the value is in the discussion.', 'Lịch: xem thực hành 1 bài 1.2 (output thật với <code>[4, 3, 3]</code>). Bảng: bảng ở bài 1.3, luật chép vào mô tả cột. Thoả thuận và DoD: các ví dụ ở 1.4 và 1.2, nhưng với giờ giấc <em>của nhóm bạn</em> và ghi rõ ngoại lệ của từng người. Bài nộp chép nguyên văn ví dụ được tối đa 1/2 ở tiêu chí 3 — giá trị nằm ở cuộc thảo luận.')}</p>`)}

<h3>🚀 ${t('Extra challenges', 'Thử thách thêm')}</h3>
<ul>
<li>${t('Turn <code>burndown.mjs</code> into <code>burnup.mjs</code>: two lines, "done so far" and "total scope". Run it on team C and check that the scope change becomes obvious.', 'Biến <code>burndown.mjs</code> thành <code>burnup.mjs</code>: hai đường, "đã xong" và "tổng phạm vi". Chạy trên nhóm C và kiểm rằng thay đổi phạm vi lộ ra rõ ràng.')}</li>
<li>${t('Forecast with Monte Carlo: from team A’s daily throughput history, simulate 10,000 sprints by sampling past days at random, and print "with 85% confidence we finish at least N cards". Compare N with the team’s commitment.', 'Dự báo bằng Monte Carlo: từ lịch sử throughput từng ngày của nhóm A, mô phỏng 10.000 sprint bằng cách bốc ngẫu nhiên các ngày trong quá khứ, rồi in "với độ tin cậy 85% nhóm xong ít nhất N thẻ". So N với cam kết của nhóm.')}</li>
<li>${t('Add a 30-minute "refinement" event in the middle of each sprint to <code>lich-sprint.mjs</code>.', 'Thêm sự kiện "refinement" 30 phút giữa mỗi sprint vào <code>lich-sprint.mjs</code>.')}</li>
</ul>

<h3>🛠 ${t('Project milestone — Chapter 1', 'Mốc dự án — Chương 1')}</h3>
${cl('ok', `<ul>
<li>${t('Shared team calendar with every sprint event of the semester (from your <code>.ics</code>).', 'Lịch chung của nhóm có mọi sự kiện sprint cả kỳ (từ tệp <code>.ics</code> của bạn).')}</li>
<li>${t('CT Work board with policies and WIP limits; the first 10 cards.', 'Bảng CT Work có luật và giới hạn WIP; 10 thẻ đầu tiên.')}</li>
<li>${t('Pinned working agreement and Definition of Done, all members ✅.', 'Thoả thuận làm việc và Definition of Done đã ghim, đủ ✅ của mọi người.')}</li>
<li>${t('A habit: every Wednesday of week 2, run <code>burndown.mjs</code> on your sprint and post the chart in the chat with one sentence of interpretation.', 'Một thói quen: thứ Tư tuần 2 của mỗi sprint, chạy <code>burndown.mjs</code> trên sprint của nhóm và đăng biểu đồ vào nhóm chat kèm một câu nhận xét.')}</li>
</ul>`)}
<p>${t('Academy link: how a single SWP391 iteration runs slot by slot and how to prepare each review with the lecturer — ', 'Liên kết Academy: một iteration SWP391 chạy từng slot thế nào và chuẩn bị mỗi buổi review với giảng viên ra sao — ')}${ac('software-development-project', 'swp391-p-3-vong-iteration-buoi-review', 'SWP391 P.3')}.</p>
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-1-6-quiz', t('Chapter 1 quiz', 'Kiểm tra Chương 1'))} · ${ag('agl-2-1-ticket', t('Chapter 2 — Writing tickets people can pick up', 'Chương 2 — Viết ticket ai cũng nhận làm được'))}.</p>
`);
};

export default {
  title: '1.5 — Lab: Sprint 0 for LabFlow|||1.5 — Lab: Sprint 0 cho LabFlow',
  slug: 'agl-1-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chương 1: lịch sprint .ics cả kỳ, bảng CT Work có luật và WIP, thoả thuận làm việc + DoD, đọc ba burndown chạy thật (khoẻ / gậy khúc côn cầu / phạm vi phình) và thí nghiệm hai người review trên mô phỏng Kanban; gợi ý từng bậc, rubric 10 điểm, lời giải, thử thách burnup + Monte Carlo, mốc dự án.',
  content: L15(true) + L15(false),
};
