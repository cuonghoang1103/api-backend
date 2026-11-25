/**
 * 12.4 — Checklist và câu chuyện phỏng vấn (agl-9-4-tong-ket — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Lab THẬT (scratchpad/agt/lab/ch12): kiem-sprint.sh — một lệnh soát cả hồ sơ sprint (7 phần, mã thoát = số phần trượt): bộ đủ ⇒ 0;
 * dùng sổ hành động có R4-3 "xác sống" ⇒ 1. soat-star.mjs: bản kể vội 6 lỗi; hai câu chuyện từ dữ liệu sprint 3 đạt.
 * Ranh giới: kỹ thuật STAR chung ⇒ interview-prep pv-2-2-star (liên kết, không viết lại); sổ thành tích ⇒ agl-8-4.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ac, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L124 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Lesson 12.4', 'Chương 12 · Bài 12.4', `
<h2>${t('12.4 — Checklist and interview stories', '12.4 — Checklist và câu chuyện phỏng vấn')}</h2>
<p class="lead">${t(
    'Two things are left after a sprint: the evidence that it was run well, and the stories you will tell about it. This lesson turns the first into one command and the second into two STAR stories that pass a checker — then gives you the whole-term checklist for leading SWP391, and the map from that term to your first months at FPT Software.',
    'Sau một sprint còn lại hai thứ: bằng chứng là sprint được điều hành tốt, và những câu chuyện bạn sẽ kể về nó. Bài này biến thứ nhất thành một lệnh, thứ hai thành hai câu chuyện STAR qua được bộ soát — rồi đưa bạn checklist cả kỳ để dẫn nhóm SWP391, và bản đồ từ kỳ đó sang những tháng đầu ở FPT Software.')}</p>

<h3>${t('Everyday picture: the pilot’s checklist', 'Liên tưởng đời thường: checklist của phi công')}</h3>
<p>${t(
    'Pilots with twenty years of experience still read the checklist aloud before take-off — not because they forget, but because tired people skip steps without noticing. Your sprint pack at 18:30 on the last Friday is the same: you are tired, the demo is in an hour, and the one missing piece (an action without an owner, a password still in a branch) is the one you will not see. A script that reads everything in ten seconds does not get tired.',
    'Phi công hai mươi năm kinh nghiệm vẫn đọc to checklist trước khi cất cánh — không phải vì quên, mà vì người mệt bỏ sót bước mà không biết. Bộ hồ sơ sprint lúc 18:30 thứ Sáu cuối cùng cũng vậy: bạn mệt, một giờ nữa là demo, và đúng mảnh còn thiếu (một hành động không chủ, một mật khẩu còn nằm trong nhánh) là mảnh bạn sẽ không thấy. Một script đọc mọi thứ trong mười giây thì không biết mệt.')}</p>

<h3>${t('1. One command for the sprint pack', '1. Một lệnh cho cả hồ sơ sprint')}</h3>
${bash(MA.kiemSprint)}
<p>${t('Each part calls a tool from this course: the planning checker (12.1), the report checker (6.3), the retro checker (6.2/12.3), the burndown export (1.5), the per-screen contribution report (3.5), the secret scanner (12.2) and the STAR checker below. Two habits from earlier chapters: <code>set -o pipefail</code> so a red tool in a pipe stays red (', 'Mỗi phần gọi một công cụ của khoá: bộ soát planning (12.1), bộ soát báo cáo (6.3), bộ soát retro (6.2/12.3), xuất burndown (1.5), báo cáo đóng góp theo màn (3.5), bộ quét bí mật (12.2) và bộ soát STAR bên dưới. Hai thói quen từ các chương trước: <code>set -o pipefail</code> để công cụ đỏ trong ống lệnh vẫn đỏ (')}${ag('agl-7-5-lab', '7.5')}${t('), and an exit code equal to the number of failed parts (', '), và mã thoát bằng số phần trượt (')}${ag('agl-8-5-lab', '8.5')}).</p>
${out('$ ./kiem-sprint.sh /tmp/agt-lab12/labflow\n' + RA.kiemSprint)}
<p>${t('The same pack with the retro log as first written (R4-3 still the zombie "everyone asks early"):', 'Cùng bộ hồ sơ nhưng dùng sổ retro bản viết đầu (R4-3 vẫn là xác sống "mọi người chủ động hỏi sớm"):')}</p>
${out('$ ./kiem-sprint.sh /tmp/agt-lab12/labflow du-lieu/hanh-dong.csv\n' + RA.kiemSprintDo)}
${cl('warn', `<p>${t(
    '<strong>Green means "nothing cheap is missing".</strong> The script cannot tell whether the sprint goal was the right goal, whether the reply to C4 sounded kind, or whether S42’s bug was found by luck. Those are the questions for you and your supervisor — the script clears the table so you have time for them.',
    '<strong>Xanh nghĩa là "không thiếu thứ gì dễ thấy".</strong> Script không biết sprint goal có phải mục tiêu đúng không, tin trả lời C4 nghe có tử tế không, hay lỗi của S42 được phát hiện nhờ may. Đó là câu hỏi của bạn và giảng viên — script dọn bàn để bạn có thời gian cho chúng.')}</p>`)}

<h3>${t('2. The whole-term checklist for an SWP391 leader', '2. Checklist cả kỳ cho trưởng nhóm SWP391')}</h3>
${bang([t('When', 'Khi nào'), t('Do', 'Làm'), t('Lesson', 'Bài')], [
    [t('Week 0 (before the term)', 'Tuần 0 (trước kỳ)'), t('Roles and RACI; screens split by domain so each person owns whole screens; working agreement; sprint calendar (.ics); repo with hooks, CI and CODEOWNERS; README that runs on a clean machine', 'Vai trò và RACI; chia màn theo miền để mỗi người làm chủ trọn màn; thoả thuận làm việc; lịch sprint (.ics); repo có hook, CI và CODEOWNERS; README chạy được trên máy sạch'), `${ag('agl-0-1-vai-tro', '0.1')} · ${ag('agl-2-2-chia-nho', '2.2')} · ${ag('agl-1-5-lab', '1.5')} · ${ag('agl-3-5-lab', '3.5')} · ${ag('agl-5-5-lab', '5.5')}`],
    [t('Each sprint — start', 'Mỗi sprint — đầu'), t('Refine (split ≥ 8 points, ready tickets); capacity with absences and your own coordination time; balance per person; checkable goal; minutes checked against data; tell the supervisor what moves the same evening', 'Làm mịn (chia ticket ≥ 8 điểm, ticket sẵn sàng); năng lực có trừ vắng và thời gian điều phối của chính bạn; cân theo người; mục tiêu kiểm được; biên bản khớp dữ liệu; báo giảng viên phần bị dời ngay tối đó'), `${ag('agl-2-1-ticket', '2.1')} · ${ag('agl-6-2-planning-retro', '6.2')} · ${ag('agl-9-1-chuan-bi', '12.1')}`],
    [t('Each day', 'Mỗi ngày'), t('PR queue (one working day), written standup checked against the board, signals → private question → pairing within 24 h', 'Hàng PR (một ngày làm việc), standup viết soát với bảng, tín hiệu → hỏi riêng → ngồi cùng trong 24 giờ'), `${ag('agl-6-1-standup', '6.1')} · ${ag('agl-4-5-lab', '4.5')} · ${ag('agl-9-2-thuc-hien', '12.2')}`],
    [t('Each week', 'Mỗi tuần'), t('Weekly report 8/8 with scope changes; four-role check; risk log with owners and checkpoints', 'Báo cáo tuần 8/8 có mục thay đổi phạm vi; soát bốn vai; sổ rủi ro có chủ và mốc kiểm'), `${ag('agl-6-3-bao-cao', '6.3')} · ${ag('agl-7-5-lab', '7.5')}`],
    [t('Each sprint — end', 'Mỗi sprint — cuối'), t('Freeze at 19:00; demo only Done; retro with data and owned actions; LOC per screen; updated forecast; report with bad news first; kiem-sprint.sh green', 'Chốt số 19:00; chỉ demo cái Done; retro bằng dữ liệu, hành động có chủ; LOC theo màn; dự báo cập nhật; báo cáo tin xấu trước; kiem-sprint.sh xanh'), ag('agl-9-3-ket-thuc', '12.3')],
    [t('When things go wrong', 'Khi có chuyện'), t('Member silent or not delivering: the ladder (private → 1:1 with a checkpoint → team → supervisor, each step announced); conflict: correct in private, update in public; leaked secret: rotate first', 'Thành viên im lặng hoặc không làm: bậc thang (riêng → 1:1 có mốc kiểm → cả nhóm → giảng viên, bước nào cũng báo trước); va chạm: góp ý riêng, cập nhật công khai; lộ bí mật: đổi trước'), `${ag('agl-6-5-thanh-vien', '6.5')} · ${ag('agl-9-2-thuc-hien', '12.2')} · ${ag('agl-10-5-tai-khoan', '10.5')}`],
    [t('End of term', 'Cuối kỳ'), t('Term-wide LOC balanced before the last iteration; documents that match the code; each member’s contribution visible in git; your own STAR stories written while the numbers are fresh', 'Cân LOC cả kỳ trước iteration cuối; tài liệu khớp mã; đóng góp từng người hiện rõ trong git; câu chuyện STAR của chính bạn viết khi số liệu còn mới'), `${ag('agl-9-1-chuan-bi', '12.1')} · ${ac('software-development-project', 'swp391-4-complexity-loc-grade', 'SWP391')}`],
  ])}

<h3>${t('3. Two STAR stories from the data', '3. Hai câu chuyện STAR từ dữ liệu')}</h3>
<p>${t('The structure and the "I, not we" rule are taught in ', 'Cấu trúc và luật "em, không phải nhóm" được dạy ở ')}${cs('interview-prep', 'pv-2-2-star', t('Interview prep 2.2', 'Phỏng vấn 2.2'))}${t('. Here you build the material from your own evidence (the brag log of ', '. Ở đây bạn dựng chất liệu từ bằng chứng của chính mình (sổ thành tích của ')}${ag('agl-8-4-phat-trien', '8.4')}${t(' and the sprint data), then check it like any other artefact. A first attempt, the way most students answer "tell me about leading a team":', ' và dữ liệu sprint), rồi soát nó như mọi sản phẩm khác. Lần thử đầu, đúng kiểu phần lớn sinh viên trả lời câu "kể về một lần dẫn nhóm":')}</p>
${out(MA.starV1)}
${js(MA.soatStar)}
${out('$ node soat-star.mjs star/*.md\n' + RA.star)}
<p>${t('The two stories that pass — every number in them can be traced to a script output in lessons 12.1–12.3:', 'Hai câu chuyện đạt — mọi con số trong đó truy được về một output script ở bài 12.1–12.3:')}</p>
${out(MA.starC5)}
${out(MA.starBiMat)}
${bang([t('Claim in the story', 'Ý trong câu chuyện'), t('Evidence', 'Bằng chứng')], [
    [t('LOC gap 390 → 180', 'Chênh LOC 390 → 180'), t('can-loc-ky.mjs, 12.1', 'can-loc-ky.mjs, 12.1')],
    [t('First PR merged 18/03, a day before the checkpoint', 'PR đầu merge 18/03, sớm một ngày so với mốc'), t('risk R-06 + su-kien.csv', 'rủi ro R-06 + su-kien.csv')],
    [t('13 points, the most of anyone; team 39/47', '13 điểm, nhiều nhất nhóm; cả nhóm 39/47'), t('retro.mjs, 12.3', 'retro.mjs, 12.3')],
    [t('Secret worthless 80 minutes after the block; old clone still had it', 'Bí mật vô hiệu 80 phút sau khi bị chặn; bản clone cũ vẫn còn'), t('bi-mat.sh, 12.2', 'bi-mat.sh, 12.2')],
  ])}
${note(t('Interviewers at outsourcing companies often follow up with "what would you do differently?" and "what did the other person say?". The "Bài học" line answers the first; the second needs you to have actually asked — another reason the 1:1 notes of lesson 6.5 matter.', 'Người phỏng vấn ở công ty outsourcing hay hỏi tiếp "nếu làm lại bạn sẽ làm khác gì?" và "người kia đã nói gì?". Dòng "Bài học" trả lời câu đầu; câu sau đòi hỏi bạn đã thật sự hỏi — thêm một lý do ghi chú 1:1 ở bài 6.5 quan trọng.'))}

<h3>${t('4. From SWP391 to OJT at FPT Software', '4. Từ SWP391 sang OJT ở FPT Software')}</h3>
${bang([t('What you did as SWP391 leader', 'Việc bạn đã làm khi dẫn nhóm SWP391'), t('What it becomes in OJT', 'Nó trở thành gì khi OJT'), t('Where', 'Ở đâu')], [
    [t('Written standup checked against the board', 'Standup viết soát với bảng'), t('Daily report to the leader/PM; hourensou', 'Báo cáo ngày cho leader/PM; hourensou'), ag('agl-9-7-bao-cao-hourensou', '9.7')],
    [t('Story points and capacity', 'Story point và năng lực'), t('Man-day estimates per task, compared with actuals', 'Ước lượng man-day theo task, so với thực tế'), ag('agl-9-6-uoc-luong-man-day', '9.6')],
    [t('Supervisor adding work mid-sprint', 'Giảng viên thêm việc giữa sprint'), t('Customer Q&amp;A and change requests', 'Q&amp;A và change request của khách'), ag('agl-9-5-qa-cr', '9.5')],
    [t('Secret in a PR', 'Bí mật trong PR'), t('Security incident under ISMS rules; report first', 'Sự cố an ninh theo quy định ISMS; báo trước'), ag('agl-10-7-su-co-that', '10.7')],
    [t('Review and report to the supervisor', 'Review và báo cáo giảng viên'), t('Review meetings and minutes with Japanese or American customers', 'Họp review và biên bản với khách Nhật hoặc Mỹ'), ag('agl-11-5-lab', '11.5')],
    [t('Leading four classmates', 'Dẫn bốn bạn cùng lớp'), t('Being a newcomer again: map, questions, first PR', 'Lại làm người mới: bản đồ, câu hỏi, PR đầu tiên'), ag('agl-8-5-lab', '8.5')],
  ])}
<p>${t(
    'The last row is the important one. In OJT you will not be the leader; you will be the person whose standup the leader reads. Everything in this chapter is also a description of what a good team member makes easy for their leader: honest standups, small PRs, early questions, no secrets in commits.',
    'Dòng cuối là dòng quan trọng. Khi OJT bạn không phải trưởng nhóm; bạn là người mà trưởng nhóm đọc standup. Mọi thứ trong chương này cũng là mô tả những gì một thành viên tốt làm cho trưởng nhóm dễ thở: standup thật thà, PR nhỏ, hỏi sớm, không bí mật trong commit.')}</p>

${phongVan([
    [t('"Tell me about a conflict in your team."', '"Kể về một va chạm trong nhóm bạn."'),
     t('The PR blocked for a password: the member complained in the team channel the day before an exam. I kept the rule, but moved the conversation: a private message with the facts, the reason (copies of the branch already existed) and thanks for rotating fast; a public update with only the incident and the new CI step that I took on.', 'Lần PR bị chặn vì mật khẩu: bạn ấy phàn nàn trên kênh nhóm hôm trước ngày thi. Em giữ luật, nhưng chuyển chỗ nói chuyện: nhắn riêng sự việc, lý do (bản sao của nhánh đã tồn tại) và cảm ơn bạn ấy đổi khoá nhanh; cập nhật công khai chỉ gồm sự cố và bước CI mới mà em nhận làm.')],
    [t('"Tell me about a failure."', '"Kể về một thất bại."'),
     t('Our sprint goal was half met: the usage report failed review on month-crossing date ranges and missed the demo. I reported it first in the sprint report, did not demo it, and the retro produced a rule that report screens are split into tickets of at most 3 points. It was merged in the first days of the next sprint.', 'Sprint goal của nhóm chỉ đạt một nửa: màn báo cáo mức sử dụng trượt review vì khoảng ngày vắt tháng và lỡ buổi demo. Em đưa nó lên đầu báo cáo sprint, không demo, và retro ra một luật: màn báo cáo chia thành ticket tối đa 3 điểm. Nó được merge ngay những ngày đầu sprint sau.')],
    [t('"How do you lead people who are your classmates, not your employees?"', '"Bạn dẫn dắt người ngang hàng — bạn cùng lớp — thế nào?"'),
     t('With rules the team agreed in retros, applied the same way to everyone including me, and with numbers instead of opinions; decisions about someone’s work are made in the meeting with them, not behind them.', 'Bằng những luật cả nhóm đã thống nhất ở retro, áp dụng như nhau cho mọi người kể cả em, và bằng con số thay vì ý kiến; quyết định về việc của ai thì quyết trong buổi họp có mặt người đó, không quyết sau lưng.')],
    [t('"What did you learn as a leader?"', '"Làm trưởng nhóm bạn học được gì?"'),
     t('That most problems are visible early in the data — a card without commits, a PR without a reviewer — and the leader’s job is to ask early and privately. And that my own time for coordination is real work that has to be in the plan.', 'Rằng phần lớn vấn đề hiện ra sớm trong dữ liệu — một thẻ không có commit, một PR không người duyệt — và việc của trưởng nhóm là hỏi sớm, hỏi riêng. Và thời gian điều phối của chính mình là việc thật, phải có trong kế hoạch.')],
  ], en)}

<h3>${t('Exercises — your own team', 'Bài tập — với nhóm của chính bạn')}</h3>
<ol>
  <li>${t('At the end of your first real SWP391 sprint, export the board and the git log, build your own <code>du-lieu/</code> in the same format, and run <code>kiem-sprint.sh</code>. Fix every red part before the review.', 'Cuối sprint SWP391 thật đầu tiên, xuất bảng và git log, dựng <code>du-lieu/</code> của riêng nhóm theo cùng định dạng, rồi chạy <code>kiem-sprint.sh</code>. Sửa mọi phần đỏ trước buổi review.')}</li>
  <li>${t('Write two STAR stories of your own — one about a person, one about a technical incident — until <code>soat-star.mjs</code> passes them. Make a table like the one above: every claim → its evidence.', 'Viết hai câu chuyện STAR của chính bạn — một về con người, một về sự cố kỹ thuật — tới khi <code>soat-star.mjs</code> cho qua. Lập bảng như bảng trên: mỗi ý → bằng chứng của nó.')}</li>
  <li>${t('Then take the timed exam (12.5) and the final quiz (12.6).', 'Rồi làm đề thi có giờ (12.5) và bài kiểm tra tổng (12.6).')}</li>
</ol>
${giai(t('How to rerun everything in this chapter', 'Cách chạy lại toàn bộ chương này'), bash(MA.chayHet))}

${thuatNgu([
    [t('STAR', 'STAR'), t('Situation, Task, Action, Result — a structure for behavioural interview answers; here checked like an artefact.', 'Tình huống, Nhiệm vụ, Hành động, Kết quả — khung trả lời phỏng vấn hành vi; ở đây được soát như một sản phẩm.')],
    [t('Sprint pack', 'Hồ sơ sprint'), t('Minutes, reports, retro log, burndown, contribution report — the evidence a sprint was run, checked by one command.', 'Biên bản, báo cáo, sổ retro, burndown, báo cáo đóng góp — bằng chứng sprint được điều hành, soát bằng một lệnh.')],
    [t('Evidence table', 'Bảng bằng chứng'), t('Every claim of a story mapped to the record that proves it.', 'Mỗi ý của câu chuyện gắn với bản ghi chứng minh nó.')],
  ], en)}
${tomTat([
    t('One command (kiem-sprint.sh) checks the cheap things so your attention goes to the expensive ones.', 'Một lệnh (kiem-sprint.sh) soát những thứ dễ thấy để sự chú ý của bạn dành cho những thứ khó.'),
    t('The whole-term checklist: week 0, each sprint start, each day, each week, each sprint end, when things go wrong, end of term.', 'Checklist cả kỳ: tuần 0, đầu mỗi sprint, mỗi ngày, mỗi tuần, cuối mỗi sprint, khi có chuyện, cuối kỳ.'),
    t('STAR stories are built from evidence and checked: four parts, "I" in the action, numbers in the result, no blame, a lesson.', 'Câu chuyện STAR dựng từ bằng chứng và được soát: đủ bốn phần, "mình" trong hành động, kết quả có số, không chê ai, có bài học.'),
    t('In OJT the same skills make you the team member a leader can rely on.', 'Khi OJT, cùng những kỹ năng đó làm bạn thành thành viên mà trưởng nhóm tin cậy được.'),
  ], en)}
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-9-5-de-thi', t('12.5 — Timed exam: lead sprint 4', '12.5 — Đề thi có giờ: dẫn sprint 4'))}.</p>
`);
};

export default {
  title: '12.4 — Checklist and interview stories|||12.4 — Checklist và câu chuyện phỏng vấn',
  slug: 'agl-9-4-tong-ket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một lệnh kiem-sprint.sh soát cả hồ sơ sprint (7 phần, mã thoát = số phần trượt: bộ đủ 0, sổ retro có xác sống 1); checklist cả kỳ cho trưởng nhóm SWP391; hai câu chuyện STAR dựng từ dữ liệu sprint 3 và soát bằng soat-star.mjs (bản kể vội 6 lỗi) kèm bảng bằng chứng; bản đồ từ SWP391 sang OJT FPT Software; câu hỏi phỏng vấn về va chạm, thất bại, dẫn dắt người ngang hàng.',
  content: L124(true) + L124(false),
};
