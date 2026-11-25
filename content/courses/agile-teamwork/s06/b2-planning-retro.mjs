/**
 * 6.2 — Planning và retro thay đổi được điều gì đó (agl-6-2-planning-retro). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT (scratchpad/agt/lab/ch6): nang-luc.mjs (năng lực từ tốc độ sprint 1 + ngày vắng ⇒ đường cam kết, ghi sprint2.json),
 * can-bang.mjs (cam kết theo người vs năng lực riêng — lộ C2 quá tải, C3/C5 thiếu việc), retro.mjs (số liệu sprint + soát hành động retro, "xác sống").
 * Mẫu: mau/bien-ban-planning.md, mau/bien-ban-retro.md. Ranh giới: Scrum events tổng quát ⇒ agl-1-2; ước lượng/velocity ⇒ agl-2-3; Project Aristotle ⇒ agl-0-8.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';


export const L62 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.2', 'Chương 6 · Bài 6.2', `
<h2>${t('6.2 — Planning and retrospectives that change something', '6.2 — Planning và retro thay đổi được điều gì đó')}</h2>
<p class="lead">${t(
    'Two meetings decide whether a sprint is honest. Planning decides how much the team promises; the retrospective decides whether the next sprint is any different. Student teams tend to promise everything at planning ("we will do all 13 screens") and to end the retro with "everyone try harder". This lesson replaces both with numbers: a capacity line computed from the last sprint, and retro actions that are checked the way code is checked.',
    'Hai buổi họp quyết định một sprint có trung thực hay không. Planning quyết định nhóm hứa bao nhiêu; retro quyết định sprint sau có khác gì không. Nhóm sinh viên hay hứa tất cả ở planning ("làm hết 13 màn") và kết thúc retro bằng "mọi người cố gắng hơn". Bài này thay cả hai bằng con số: một đường năng lực tính từ sprint trước, và hành động retro được soát như soát mã.')}</p>
${note(t('The five Scrum events in general are in ', 'Năm sự kiện Scrum nói chung ở ') + ag('agl-1-2-scrum', t('lesson 1.2', 'bài 1.2')) + t('; story points, poker and velocity in ', '; story point, poker và velocity ở ') + ag('agl-2-3-uoc-luong', t('lesson 2.3', 'bài 2.3')) + t('; probabilistic forecasts in ', '; dự báo có xác suất ở ') + ag('agl-2-5-lab', t('lab 2.5', 'lab 2.5')) + t('. Here: running the two meetings as the leader of LabFlow.', '. Ở đây: điều hành hai buổi họp với vai trưởng nhóm LabFlow.'))}

<h3>${t('Everyday picture: packing for a trip', 'Liên tưởng đời thường: xếp đồ đi du lịch')}</h3>
<p>${t(
    'Planning is packing a 20-kg suitcase: you weigh it, you do not argue with the scale. The retro is the evening after the trip when you say "next time: one pair of shoes, and buy the ticket a week earlier" — and you write it on the checklist you will actually open next time, not on a napkin.',
    'Planning là xếp một vali 20 kg: bạn cân, không cãi với cái cân. Retro là buổi tối sau chuyến đi khi bạn nói "lần sau: một đôi giày thôi, và mua vé sớm một tuần" — và ghi nó vào đúng danh sách bạn sẽ mở ra lần sau, không phải lên mẩu giấy ăn.')}</p>

<h3>${t('Planning: three questions, one goal', 'Planning: ba câu hỏi, một mục tiêu')}</h3>
${bang([t('Question (Scrum Guide 2020)', 'Câu hỏi (Scrum Guide 2020)'), t('LabFlow sprint 2', 'LabFlow sprint 2')], [
    [t('<strong>Why</strong> is this sprint valuable? → Sprint Goal', '<strong>Vì sao</strong> sprint này có giá trị? → Sprint Goal'), t('"A student can book a lab and a lab manager can approve it, on staging" (S20, S22, S23, S25).', '"Sinh viên đặt được lịch phòng lab và quản lý lab duyệt được, chạy trên staging" (S20, S22, S23, S25).')],
    [t('<strong>What</strong> can be done? → selected items', '<strong>Làm được gì</strong>? → các mục được chọn'), t('Decided by capacity, not by wishes — the script below.', 'Quyết bằng năng lực, không bằng mong muốn — script dưới đây.')],
    [t('<strong>How</strong> will it get done? → plan', '<strong>Làm thế nào</strong>? → kế hoạch'), t('Each owner splits their screen into tasks; shared pieces (QR, booking table) get one owner.', 'Mỗi chủ màn tự chia việc; phần dùng chung (QR, bảng đặt lịch) có một chủ.')],
  ])}
<p>${t('Timebox: up to 8 hours for a one-month sprint (Scrum Guide). For a 3-week student sprint, 90 minutes is enough if the backlog was refined the week before.', 'Khung giờ: tối đa 8 giờ cho sprint một tháng (Scrum Guide). Với sprint 3 tuần của sinh viên, 90 phút là đủ nếu backlog đã được làm mịn từ tuần trước.')}</p>

<h3>${t('Lab 1: the capacity line', 'Lab 1: đường năng lực')}</h3>
<p>${t(
    'Velocity is the only forecast a team has that is not an opinion. Sprint 1 (iteration 1) finished 58 points with 96 person-days. Sprint 2 has 15 working days, five people, three announced absences (C2: two midterm days; C5: one day). The leader’s own meetings are <em>not</em> subtracted again — they already happened in sprint 1 and are inside its rate.',
    'Velocity là dự báo duy nhất của nhóm không phải ý kiến. Sprint 1 (iteration 1) xong 58 điểm với 96 ngày-người. Sprint 2 có 15 ngày làm việc, năm người, ba ngày vắng đã báo (C2: hai ngày thi giữa kỳ; C5: một ngày). Thời gian họp của trưởng nhóm <em>không</em> trừ thêm — sprint 1 cũng có, và nó đã nằm trong tốc độ.')}</p>
${out(MA.nangLucJson)}
${js(MA.nangLuc)}
${out('$ node nang-luc.mjs\n' + RA.nangLuc)}
<p>${t(
    'The team wanted all 13 iteration-2 screens: 59 points, 1.36 times the capacity. Promising 59 does not create 16 extra points; it only moves the bad news from week 1 (when the supervisor can still help) to week 3 (when nobody can). So LabFlow committed 43, kept two stretch tickets, and — the same evening — messaged the supervisor that S32 and S35 would move to iteration 3. Why that message cannot wait for the weekly report is ',
    'Nhóm muốn làm cả 13 màn iteration 2: 59 điểm, gấp 1,36 lần năng lực. Hứa 59 không tạo thêm 16 điểm; nó chỉ dời tin xấu từ tuần 1 (lúc giảng viên còn giúp được) sang tuần 3 (lúc không ai giúp được). Nên LabFlow cam kết 43, giữ hai ticket dự phòng, và — ngay tối đó — nhắn giảng viên rằng S32 và S35 sẽ sang iteration 3. Vì sao tin nhắn đó không được đợi báo cáo tuần: ') + ag('agl-6-3-bao-cao', t('lesson 6.3', 'bài 6.3')) + '.'}</p>

<h3>${t('Lab 2: a line that is right for the team can be wrong for a person', 'Lab 2: đường đúng cho cả nhóm có thể sai cho từng người')}</h3>
<p>${t(
    'Cutting by priority is right for the product. But SWP391 grades LOC per person, by screen (', 'Cắt theo ưu tiên là đúng cho sản phẩm. Nhưng SWP391 chấm LOC theo từng người, theo màn (') + ag('agl-2-2-chia-nho', t('lesson 2.2', 'bài 2.2')) + t(
    '), and people have different calendars. Compare each person’s commitment with their own capacity (days present × the team rate):',
    '), và mỗi người có lịch khác nhau. So cam kết của từng người với năng lực riêng (số ngày có mặt × tốc độ nhóm):')}</p>
${giai(t('can-bang.mjs', 'can-bang.mjs'), js(MA.canBang))}
${out('$ node can-bang.mjs\n' + RA.canBang)}
<p>${t(
    'Three things the team-level line hid. C2 has an exam week and the heaviest load (+5.1). C3 has 3 points committed — idle by day 4, which is exactly what the standup of 19/02 showed. C5’s only other screen (S35, 8 points) was the one cut, so C5’s iteration-2 LOC rests on a single 5-point screen. A planning fix that helps:',
    'Ba điều mà đường cấp nhóm che mất. C2 có tuần thi mà tải nặng nhất (+5,1). C3 chỉ cam kết 3 điểm — sẽ rảnh từ ngày thứ 4, đúng như standup 19/02 cho thấy. Màn còn lại của C5 (S35, 8 điểm) lại chính là màn bị cắt, nên LOC iteration 2 của C5 dựa trên đúng một màn 5 điểm. Một cách sửa ở planning:')}</p>
${out(MA.keHoachCanBang)}
${out('$ node can-bang.mjs du-lieu/ke-hoach-can-bang.json\n' + RA.canBangSua)}
<p>${t(
    'Moving C2’s LF-34 to stretch and C3’s LF-28 into the commitment narrows both gaps — but it cannot close them, because screens have fixed sizes and fixed owners. The real fix for C5 is upstream: put S35 at the top of sprint 3, and tell C5 so at planning. Balance across the <em>iteration</em> is decided when screens are assigned; planning can only nudge it.',
    'Chuyển LF-34 của C2 sang dự phòng và đưa LF-28 của C3 vào cam kết thu hẹp cả hai khoảng — nhưng không xoá được, vì màn có kích thước và chủ cố định. Cách sửa thật cho C5 nằm ở phía trước: đặt S35 lên đầu sprint 3, và nói với C5 ngay ở planning. Cân bằng trong cả <em>iteration</em> được quyết khi chia màn; planning chỉ chỉnh được một chút.')}</p>

<h4>${t('Planning minutes, filled in for LabFlow', 'Biên bản planning, điền sẵn cho LabFlow')}</h4>
${out(MA.bbPlanning)}

<h3>${t('Retrospective: make it safe, then make it specific', 'Retro: làm cho an toàn, rồi làm cho cụ thể')}</h3>
<blockquote>${t(
    '"Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand."',
    '"Dù tìm ra điều gì, chúng ta hiểu và thật lòng tin rằng mỗi người đã làm tốt nhất có thể, với những gì họ biết lúc đó, kỹ năng và khả năng của họ, nguồn lực sẵn có và hoàn cảnh lúc đó."')} — Norm Kerth, <em>Project Retrospectives</em> (2001), ${ng('https://retrospectivewiki.org/index.php?title=The_Prime_Directive', 'Retrospective Wiki')}</blockquote>
<p>${t(
    'The Prime Directive is read aloud at the start because a retro where people defend themselves finds nothing. It is the same idea as the blameless postmortem of ', 'Prime Directive được đọc to ở đầu buổi vì retro mà mọi người lo tự vệ thì không tìm ra gì. Cùng ý tưởng với postmortem không đổ lỗi ở ') + ag('agl-5-4-postmortem', t('lesson 5.4', 'bài 5.4')) + t(' and the psychological safety of ', ' và sự an toàn tâm lý của ') + ag('agl-0-8-bat-dau-tai-day', t('lesson 0.8', 'bài 0.8')) + '.'}</p>
${bang([t('Format', 'Mẫu'), t('Columns', 'Các cột'), t('When', 'Khi nào dùng')], [
    ['Start / Stop / Continue', t('start doing · stop doing · keep doing', 'bắt đầu làm · thôi làm · tiếp tục'), t('Default; fast', 'Mặc định; nhanh')],
    ['KPT', 'Keep · Problem · Try', t('Very common in Japanese companies — you will meet it on Japanese projects at OJT', 'Rất phổ biến ở công ty Nhật — bạn sẽ gặp ở dự án Nhật khi OJT')],
    ['4L', 'Liked · Learned · Lacked · Longed for', t('After a hard sprint, when feelings need room', 'Sau một sprint khó, khi cảm xúc cần chỗ')],
    [t('Timeline', 'Dòng thời gian'), t('Draw the sprint day by day, mark highs and lows', 'Vẽ sprint từng ngày, đánh dấu lúc lên lúc xuống'), t('After an incident or a messy sprint', 'Sau sự cố hoặc sprint lộn xộn')],
  ])}
<p>${t('Four rules matter more than the format:', 'Bốn luật quan trọng hơn mẫu:')}</p>
<ol>
<li>${t('<strong>Data first, feelings second.</strong> Five minutes of numbers (below) before anyone says "I felt".', '<strong>Số liệu trước, cảm nhận sau.</strong> Năm phút con số (dưới đây) trước khi ai đó nói "mình thấy".')}</li>
<li>${t('<strong>Write silently, then read.</strong> Five minutes of individual sticky notes; otherwise the first and loudest opinion becomes everyone’s opinion.', '<strong>Viết im lặng, rồi mới đọc.</strong> Năm phút mỗi người tự viết; không thì ý kiến đầu tiên và to nhất thành ý kiến của cả nhóm.')}</li>
<li>${t('<strong>Rotate the facilitator.</strong> If the leader always runs it, the leader’s mistakes are never on the board. In LabFlow C3 ran sprint 2’s retro, and C1 (the leader) wrote "I acted on C5 two days late" in the Problem column.', '<strong>Xoay vòng người điều phối.</strong> Nếu trưởng nhóm luôn điều phối, lỗi của trưởng nhóm không bao giờ lên bảng. Ở LabFlow C3 điều phối retro sprint 2, và C1 (trưởng nhóm) tự ghi "mình xử lý chuyện C5 trễ hai ngày" vào cột chưa tốt.')}</li>
<li>${t('<strong>At most two actions</strong>, each with one owner, a date and a ticket — then check them at the next retro.', '<strong>Tối đa hai hành động</strong>, mỗi cái một chủ, một hạn, một ticket — và soát lại ở retro sau.')}</li>
</ol>

<h3>${t('Lab 3: the retro, prepared by a script', 'Lab 3: retro, chuẩn bị bằng script')}</h3>
<p>${t(
    'Part 1 computes the sprint’s facts from the board. Part 2 checks every retro action the team ever wrote: one owner, a date, a ticket, measurable — and whether it is a "zombie", an action that comes back retro after retro because it was never actionable.',
    'Phần 1 tính các sự việc của sprint từ bảng. Phần 2 soát mọi hành động retro nhóm từng viết: một chủ, có hạn, có ticket, đo được — và có phải "xác sống" không, tức hành động cứ quay lại hết retro này tới retro khác vì nó chưa bao giờ làm được.')}</p>
${out(MA.hanhDong)}
${giai(t('retro.mjs', 'retro.mjs'), js(MA.retro))}
${out('$ node retro.mjs\n' + RA.retro)}
<p>${t(
    'Read the last line carefully. The outcomes in the CSV are illustration data, so the ratio itself proves nothing; what the script shows is the <em>pattern</em> every experienced Scrum Master recognises: "everyone review faster" was written in sprint 1, came back as "review faster still" in the mid-sprint retro, and was never done. The action that did change review speed was R2-2 — a named rule with an owner, checked by the standup script. Note also R3-2: two owners is no owner.',
    'Đọc kỹ dòng cuối. Kết quả trong CSV là dữ liệu minh hoạ, nên bản thân tỉ lệ không chứng minh gì; điều script cho thấy là một <em>khuôn mẫu</em> mà Scrum Master có kinh nghiệm nào cũng nhận ra: "mọi người review nhanh hơn" viết ở sprint 1, quay lại thành "review nhanh hơn nữa" ở retro giữa sprint, và không bao giờ được làm. Hành động thật sự đổi tốc độ review là R2-2 — một luật có tên, có chủ, được script standup kiểm. Để ý cả R3-2: hai chủ là không ai chủ.')}</p>
<p>${t('From part 1: LF-44 took 12 working days (blocked on QR for four of them), C5 finished 0 points, both stretch tickets were done by C3 — and the Sprint Goal was met. A retro that only looked at "goal met ✓" would have learned nothing.', 'Từ phần 1: LF-44 mất 12 ngày làm việc (bị chặn QR bốn ngày), C5 xong 0 điểm, cả hai ticket dự phòng do C3 làm — và Sprint Goal vẫn đạt. Retro mà chỉ nhìn "đạt mục tiêu ✓" thì không học được gì.')}</p>

<h4>${t('Review + retro minutes, filled in', 'Biên bản review + retro, điền sẵn')}</h4>
${out(MA.bbRetro)}
${cl('tip', `<p>${t(
    '<strong>Mid-sprint retro (30 minutes).</strong> For a 3-week sprint, a short retro at the end of week 2 catches problems while the sprint can still be saved. LabFlow’s mid-sprint retro on 26/02 produced R2-2, R2-3 and R2-4 — all done within a week.',
    '<strong>Retro giữa sprint (30 phút).</strong> Với sprint 3 tuần, một retro ngắn cuối tuần 2 bắt được vấn đề khi sprint còn cứu được. Retro giữa sprint 26/02 của LabFlow sinh ra R2-2, R2-3 và R2-4 — cả ba làm xong trong một tuần.')}</p>`)}

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'In a company, the Product Owner brings the ordered backlog and the team says how much fits; your first planning at OJT will ask you to estimate a ticket you barely understand. Say what you know, give a range, and name the unknown ("3 points if the API exists, 8 if I have to build it"). On Japanese projects the retro is very often KPT, and "Try" items are expected to come back with a result at the next one — the same discipline as the script above.',
    'Ở công ty, Product Owner mang backlog đã xếp thứ tự tới và đội nói bao nhiêu thì vừa; planning đầu tiên khi OJT sẽ bắt bạn ước lượng một ticket bạn chưa hiểu hết. Nói điều mình biết, đưa một khoảng, và gọi tên điều chưa biết ("3 điểm nếu API đã có, 8 nếu phải tự làm"). Ở dự án Nhật retro rất hay là KPT, và các mục "Try" được mong đợi quay lại kèm kết quả ở lần sau — đúng kỷ luật của script ở trên.')}</p>

<h3>🧪 ${t('Practice (25 minutes)', 'Thực hành (25 phút)')}</h3>
<ol>
<li>${t('Rewrite R3-1 and R3-2 so they pass every check, then run retro.mjs again.', 'Viết lại R3-1 và R3-2 để qua mọi luật, rồi chạy lại retro.mjs.')}</li>
<li>${t('Your own team: compute capacity from your last sprint with nang-luc.mjs (edit du-lieu/nang-luc.json) and compare with what you committed.', 'Nhóm của bạn: tính năng lực từ sprint trước bằng nang-luc.mjs (sửa du-lieu/nang-luc.json) và so với những gì nhóm đã cam kết.')}</li>
</ol>
${giai(t('Model answer for 1', 'Đáp án mẫu câu 1'), `<p>${t('R3-1 is dropped — it is replaced by R3-3, which is measurable. R3-2 gets a single owner:', 'R3-1 bị bỏ — đã có R3-3 đo được thay thế. R3-2 có đúng một chủ:')}</p>
${out('2027-03-05,R3-2,C2,2027-03-08,LF-66,,Ticket từ 8 điểm chia nhỏ (≤ 5 điểm) trước planning sprint 3')}
${out(RA.retroSua)}
<p>${t('With that row (and R3-1 removed) every sprint-2 action passes; the two zombies of earlier sprints stay in the history on purpose — the record of what did not work is part of the lesson.', 'Với dòng đó (và bỏ R3-1), mọi hành động của sprint 2 đều qua; hai "xác sống" của các sprint trước được giữ lại trong lịch sử có chủ đích — ghi nhận cái gì không hiệu quả cũng là một phần bài học.')}</p>`)}

${phongVan([
    [t('"How did your team decide how much to commit to?"', '"Nhóm bạn quyết định cam kết bao nhiêu bằng cách nào?"'), t('From the previous sprint’s rate: 58 points over 96 person-days, times the person-days available after announced absences — 43.5 points. The team wanted 59; we committed 43 plus two stretch tickets and told the supervisor the same night which screens moved to the next iteration.', 'Từ tốc độ sprint trước: 58 điểm trên 96 ngày-người, nhân với số ngày-người còn lại sau khi trừ ngày vắng đã báo — 43,5 điểm. Nhóm muốn 59; chúng tôi cam kết 43 cộng hai ticket dự phòng và báo giảng viên ngay tối đó những màn chuyển sang iteration sau.')],
    [t('"What makes a retrospective useful?"', '"Retro thế nào thì có ích?"'), t('Safety, data and follow-through. We read the Prime Directive, looked at cycle times before opinions, wrote silently before discussing, kept at most two actions with one owner, a date and a ticket, and checked them at the next retro. Vague actions like "review faster" came back as zombies; the named rule did not.', 'An toàn, số liệu và theo tới cùng. Chúng tôi đọc Prime Directive, xem cycle time trước khi nói ý kiến, viết im lặng trước khi thảo luận, giữ tối đa hai hành động có một chủ, một hạn, một ticket, và soát lại ở retro sau. Hành động mơ hồ như "review nhanh hơn" quay lại thành xác sống; luật có tên thì không.')],
    [t('"Have you ever had to reduce scope? How?"', '"Bạn đã bao giờ phải giảm phạm vi chưa? Thế nào?"'), t('At planning, with the capacity numbers on screen, I proposed moving two screens to the next iteration, messaged the supervisor that evening with the reason and the plan, and got agreement two days later — instead of discovering it in week 3.', 'Ở planning, với số năng lực trên màn hình, tôi đề xuất chuyển hai màn sang iteration sau, nhắn giảng viên ngay tối đó kèm lý do và kế hoạch, và được đồng ý sau hai ngày — thay vì phát hiện ra ở tuần 3.')],
    [t('"Who facilitates your retros?"', '"Ai điều phối retro của nhóm bạn?"'), t('We rotated. When someone else facilitates, the leader’s own mistakes make it onto the board — mine did.', 'Chúng tôi xoay vòng. Khi người khác điều phối, lỗi của trưởng nhóm mới lên được bảng — lỗi của tôi đã lên.')],
  ], en)}

${thuatNgu([
    [t('capacity', 'năng lực (capacity)'), t('Points the team can likely finish: past rate × person-days available.', 'Số điểm nhóm có khả năng làm xong: tốc độ quá khứ × số ngày-người còn lại.')],
    [t('stretch item', 'mục dự phòng (stretch)'), t('Planned but not promised; pulled in only when committed work is safe.', 'Có kế hoạch nhưng không hứa; chỉ kéo vào khi phần cam kết đã an toàn.')],
    ['Sprint Goal', t('The single objective that gives the sprint its purpose.', 'Mục tiêu duy nhất cho sprint ý nghĩa của nó.')],
    ['Prime Directive', t('Norm Kerth’s opening statement that makes a retrospective safe.', 'Câu mở đầu của Norm Kerth giúp retro an toàn.')],
    [t('zombie action', 'hành động xác sống'), t('A retro action that returns sprint after sprint because nobody owns or can check it.', 'Hành động retro quay lại sprint này qua sprint khác vì không ai chủ hoặc không kiểm được.')],
    ['KPT', t('Keep / Problem / Try — retro format common in Japan.', 'Keep / Problem / Try — mẫu retro phổ biến ở Nhật.')],
  ], en)}

${tomTat([
    t('Commit to capacity, not wishes: last sprint’s points per person-day × person-days available (LabFlow: 43.5 vs a wish of 59).', 'Cam kết theo năng lực, không theo mong muốn: điểm mỗi ngày-người của sprint trước × số ngày-người còn lại (LabFlow: 43,5 so với mong muốn 59).'),
    t('Check the line per person too: priority cuts can overload one member and starve another’s LOC; real balance is set when screens are assigned.', 'Soát đường cam kết theo từng người: cắt theo ưu tiên có thể làm một người quá tải và người khác thiếu LOC; cân bằng thật được quyết khi chia màn.'),
    t('Bad news from planning goes to the supervisor the same night.', 'Tin xấu từ planning tới tay giảng viên ngay tối đó.'),
    t('Retro: Prime Directive, data first, silent writing, rotating facilitator, ≤ 2 actions with one owner, date and ticket.', 'Retro: Prime Directive, số liệu trước, viết im lặng, xoay vòng người điều phối, ≤ 2 hành động có một chủ, một hạn, một ticket.'),
    t('Check old actions at every retro; vague ones become zombies.', 'Soát hành động cũ ở mỗi retro; hành động mơ hồ thành xác sống.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-6-3-bao-cao', t('6.3 — Reporting progress and risk', '6.3 — Báo cáo tiến độ và rủi ro'))}.</p>
`);
};

export default {
  title: '6.2 — Planning and retrospectives that change something|||6.2 — Planning và retro thay đổi được điều gì đó',
  slug: 'agl-6-2-planning-retro',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Planning theo ba câu hỏi Scrum 2020; lab chạy thật nang-luc.mjs (58 điểm/96 ngày-người ⇒ 43,5 điểm, nhóm muốn 59 ⇒ cam kết 43 + 2 dự phòng, báo giảng viên ngay tối đó) và can-bang.mjs (lộ C2 quá tải tuần thi, C3 thiếu việc, LOC của C5 dựa một màn); biên bản planning mẫu; retro: Prime Directive (Kerth), Start/Stop/Continue, KPT, 4L, số liệu trước, viết im lặng, xoay vòng điều phối; retro.mjs soát hành động: một chủ, hạn, ticket, "xác sống"; biên bản review + retro mẫu.',
  content: L62(true) + L62(false),
};
