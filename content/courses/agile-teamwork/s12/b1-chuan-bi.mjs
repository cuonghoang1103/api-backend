/**
 * 12.1 — Backlog, mục tiêu sprint và planning (agl-9-1-chuan-bi — slug + title GIỮ theo khung; slug cũ agl-9-* do giuSlugDuAnCuoi).
 * Soạn 24/11/2026, agent agt. Dự án cuối khoá = điều hành TRỌN sprint 3 của LabFlow (08/03–26/03/2027) bằng chính công cụ ch1–8.
 * Lab THẬT (scratchpad/agt/lab/ch12, chạy lại: chay-het.sh): can-loc-ky.mjs (chênh LOC cả kỳ 390 → 180), nang-luc.mjs (trừ 30 % điều phối
 * của trưởng nhóm ở CẢ hai sprint, ticket dở tính theo phần còn lại: 41.2 điểm), can-bang.mjs (bản cắt máy móc: C5 +2.9, C3 −3.1),
 * kiem-planning.mjs (biên bản vội 7/8 luật trượt, mã thoát 7 → biên bản chốt 8/8), bai-tap-121.sh.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ac, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L121 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Lesson 12.1', 'Chương 12 · Bài 12.1', `
<h2>${t('12.1 — Backlog, sprint goal and planning', '12.1 — Backlog, mục tiêu sprint và planning')}</h2>
<p class="lead">${t(
    'This chapter is the capstone: you run one whole sprint of LabFlow — sprint 3, 08/03 to 26/03/2027 — as the team leader, using only the tools you built in chapters 1–8. Every number below comes from running those tools on the sprint’s data; nothing is typed by hand. This lesson is the evening before and the evening of planning: what the leader prepares, what the scripts say, and the two decisions the scripts cannot make for you.',
    'Chương này là dự án cuối khoá: bạn điều hành trọn một sprint của LabFlow — sprint 3, từ 08/03 tới 26/03/2027 — trong vai trưởng nhóm, chỉ bằng các công cụ đã dựng ở chương 1–8. Mọi con số bên dưới đều ra từ việc chạy các công cụ đó trên dữ liệu của sprint; không có số nào gõ tay. Bài này là buổi tối trước planning và chính buổi planning: trưởng nhóm chuẩn bị gì, script nói gì, và hai quyết định mà script không làm thay bạn được.')}</p>

<h3>${t('Everyday picture: a five-person trip', 'Liên tưởng đời thường: năm người đi du lịch')}</h3>
<p>${t(
    'Five friends plan a three-day trip. One has an exam on day 2, one is the only driver, one did nothing last trip and feels bad about it. A good organiser does not write "we will see as much as possible"; they write "Sunday evening we are in Đà Lạt and everyone has seen the flower garden", then check who can do what on which day, and give the friend who did nothing last time a job they can finish early — not the hardest one, not none. Sprint planning is the same three moves: a goal people can check, a plan that fits each person, and a first small win for whoever needs one.',
    'Năm người bạn lên kế hoạch đi chơi ba ngày. Một người thi vào ngày thứ hai, một người là tài xế duy nhất, một người chuyến trước chẳng làm gì và đang ngại. Người tổ chức giỏi không viết "đi được càng nhiều càng tốt"; họ viết "tối Chủ nhật cả nhóm ở Đà Lạt và ai cũng đã xem vườn hoa", rồi xem ai làm được gì vào ngày nào, và giao cho người chuyến trước chẳng làm gì một việc xong sớm được — không phải việc khó nhất, cũng không phải không có việc. Sprint planning cũng đúng ba bước đó: một mục tiêu kiểm được, một kế hoạch vừa với từng người, và một chiến thắng nhỏ đầu tiên cho người đang cần.')}</p>

<h3>${t('Where the team stands on Friday 05/03', 'Nhóm đang ở đâu tối thứ Sáu 05/03')}</h3>
${bang([t('Fact', 'Sự việc'), t('Number', 'Con số'), t('From', 'Lấy từ')], [
    [t('Sprint 2 result', 'Kết quả sprint 2'), t('committed 43 → done 35; with stretch 41', 'cam kết 43 → xong 35; cộng dự phòng 41'), ag('agl-6-2-planning-retro', t('retro.mjs, 6.2', 'retro.mjs, 6.2'))],
    [t('Points done per person', 'Điểm xong theo người'), 'C1 11 · C2 13 · C3 9 · C4 8 · <strong>C5 0</strong>', 'retro.mjs'],
    [t('Unfinished, carried over', 'Dở, chuyển sang'), t('LF-25 (S24, C5: review asked for changes) · LF-45 (S31, C4: waiting for review)', 'LF-25 (S24, C5: review yêu cầu sửa) · LF-45 (S31, C4: chờ review)'), 'retro.mjs'],
    [t('Retro actions due before planning', 'Hành động retro tới hạn trước planning'), t('R3-2 (C2): split every ticket of 8 points · R3-3 (C1): 3 days without a commit ⇒ pair for one hour within 24 h', 'R3-2 (C2): chia mọi ticket 8 điểm · R3-3 (C1): 3 ngày không commit ⇒ ngồi cùng một giờ trong 24 giờ'), ag('agl-6-6-lab', '6.6')],
    [t('Iteration 3', 'Iteration 3'), t('14 screens (12 new + S32, S35 moved from iteration 2), deadline 16/04 = sprint 3 + sprint 4', '14 màn (12 màn mới + S32, S35 dời từ iteration 2), hạn 16/04 = sprint 3 + sprint 4'), ag('agl-1-5-lab', t('sprint calendar, 1.5', 'lịch sprint, 1.5'))],
  ])}
<p>${t('The screen list and owners come from the LabFlow project page; the field/transaction counts of the iteration-3 screens are assumptions for practice. The backlog the team brings to planning (ticket.csv, exported from CT Work):', 'Danh sách màn và chủ màn lấy từ trang dự án LabFlow; số field/transaction của các màn iteration 3 là giả định để luyện. Backlog nhóm mang vào planning (ticket.csv, xuất từ CT Work):')}</p>
${out(MA.ticket)}
<p>${t('Two columns are new compared with chapter 6: <code>con_lai</code> — the remaining part of a carried-over ticket, re-estimated on Friday (LF-25 needs only the review fixes: 1 point of work out of 5); and <code>them</code> — the date a ticket entered the sprint mid-way (LF-80 appears on 15/03; in lesson 12.2 you will see why).', 'Hai cột mới so với chương 6: <code>con_lai</code> — phần còn lại của ticket dở, ước lại hôm thứ Sáu (LF-25 chỉ còn sửa theo review: 1 điểm việc trên 5); và <code>them</code> — ngày ticket vào sprint giữa chừng (LF-80 xuất hiện ngày 15/03; bài 12.2 sẽ cho thấy vì sao).')}</p>

<h3>${t('Step 0 — Before planning: balance LOC over the whole term', 'Bước 0 — Trước planning: cân LOC trên cả kỳ')}</h3>
<p>${t(
    'SWP391 grades LOC per person over the whole project (', 'SWP391 chấm LOC theo từng người trên cả đồ án (')}${ac('software-development-project', 'swp391-4-complexity-loc-grade', t('Academy SWP391 4.x', 'Academy SWP391 4.x'))}${t(
    '), not per iteration. Iteration 3 is the last chance to fix an imbalance, and it must be fixed when screens are assigned — planning can only nudge it (lesson 6.6 found this out). The leader extends the chapter-2 splitter to the whole term:',
    '), không theo từng iteration. Iteration 3 là cơ hội cuối để sửa lệch, và phải sửa lúc giao màn — planning chỉ chỉnh được một chút (bài 6.6 đã rút ra điều này). Trưởng nhóm mở rộng script chia màn của chương 2 ra cả kỳ:')}</p>
${js(MA.canLocKy)}
${out(RA.locKyV1)}
<p>${t(
    'With the assignment from the project page, C2 would end the term 228 LOC above average and C3 162 below — and C5, who finished 0 points last sprint, would carry the heaviest iteration (570 LOC). Trying two moves:',
    'Với phân công theo trang dự án, C2 sẽ kết thúc kỳ cao hơn trung bình 228 LOC và C3 thấp hơn 162 — còn C5, người vừa xong 0 điểm ở sprint trước, lại gánh iteration nặng nhất (570 LOC). Thử hai lần đổi:')}</p>
${out(RA.locKyV2)}
${cl('warn', `<p>${t(
    '<strong>The script proposes; the people decide.</strong> Moving S47 from C2 to C3 takes LOC away from C2. The leader brings both tables to planning, C2 agrees in the meeting (C2 is still highest), and the decision goes into the minutes with the names of who agreed. Changing someone’s screens in a private message the night before is how teams break.',
    '<strong>Script đề xuất; con người quyết.</strong> Chuyển S47 từ C2 sang C3 là lấy bớt LOC của C2. Trưởng nhóm mang cả hai bảng vào planning, C2 đồng ý ngay trong buổi họp (C2 vẫn cao nhất), và quyết định vào biên bản kèm tên người đồng ý. Đổi màn của ai đó bằng tin nhắn riêng tối hôm trước là cách các nhóm vỡ.')}</p>`)}

<h3>${t('Step 1 — Capacity, with two corrections', 'Bước 1 — Năng lực, với hai chỗ sửa')}</h3>
${out(RA.nangLuc)}
<ol>
  <li>${t(
    '<strong>The leader is not a full developer.</strong> Running standups, reviews, reports and the supervisor’s questions took about 30 % of C1’s time. The script now subtracts that — and, importantly, subtracts it from <em>sprint 2</em> too (4.5 days). Subtracting it only from sprint 3 would count the same overhead twice and make the team look slower than it is.',
    '<strong>Trưởng nhóm không phải một lập trình viên đủ thời gian.</strong> Daily, review, báo cáo, trả lời giảng viên chiếm khoảng 30 % thời gian của C1. Script giờ trừ phần đó — và quan trọng là trừ cả ở <em>sprint 2</em> (4.5 ngày). Chỉ trừ ở sprint 3 là đếm cùng một phần điều phối hai lần, làm nhóm trông chậm hơn thật.')}</li>
  <li>${t(
    '<strong>Carried-over tickets take only their remaining work.</strong> The commitment line is drawn on <code>con_lai</code>, so LF-25 and LF-45 take 2 points of capacity, not 8. The price: velocity, which counts <em>done</em> points, will look 6 points better than the work actually done in sprint 3. You will see this again in the burndown (12.3) and the forecast.',
    '<strong>Ticket dở chỉ chiếm phần việc còn lại.</strong> Đường cam kết kẻ trên <code>con_lai</code>, nên LF-25 và LF-45 chiếm 2 điểm năng lực chứ không phải 8. Cái giá: velocity — đếm điểm <em>đã xong</em> — sẽ đẹp hơn phần việc thật làm trong sprint 3 khoảng 6 điểm. Bạn sẽ gặp lại điều này ở burndown (12.3) và dự báo.')}</li>
</ol>
<p>${t('The team "wanted" all 18 tickets — 1.48 times capacity. Saying no to that, with a number, is the leader’s job (', 'Nhóm "muốn" làm cả 18 ticket — gấp 1.48 lần năng lực. Nói không với điều đó, bằng con số, là việc của trưởng nhóm (')}${ag('agl-6-2-planning-retro', '6.2')}).</p>

<h3>${t('Step 2 — Right for the team, wrong for two people', 'Bước 2 — Đúng cho nhóm, sai cho hai người')}</h3>
${out(RA.canBang)}
<p>${t(
    'The cut by priority (first table) overloads C5 by 2.9 points — the very person who needs a first win — and leaves C3 with 3 points of nothing. The fix chosen at planning (second table): LF-68 (the reschedule half of S24, C5) drops to stretch, LF-47 (S47, now C3’s) goes into the commitment. S35 — C5’s biggest screen, already split by R3-2 into LF-56 + LF-72 — stays at priority 3 so C5 starts on it the first evening.',
    'Bản cắt theo ưu tiên (bảng đầu) làm C5 quá tải 2.9 điểm — đúng người đang cần một chiến thắng đầu tiên — và để C3 trống 3 điểm. Cách sửa chốt ở planning (bảng sau): LF-68 (nửa đổi lịch của S24, C5) xuống dự phòng, LF-47 (S47, giờ là của C3) lên cam kết. S35 — màn lớn nhất của C5, đã được R3-2 chia thành LF-56 + LF-72 — giữ ưu tiên 3 để C5 bắt tay ngay tối đầu tiên.')}</p>

<h3>${t('Step 3 — A sprint goal someone can check', 'Bước 3 — Một mục tiêu sprint người khác kiểm được')}</h3>
${bang([t('Weak', 'Yếu'), t('Strong', 'Mạnh')], [
    [t('"Continue iteration 3 as much as possible."', '"Làm tiếp iteration 3 càng nhiều càng tốt."'),
     t('"Lab Staff can handle a broken device end to end on staging (report S34 → maintenance board S35), and the Lab Manager can see the dashboard and the usage report of their labs (S41, S42)."', '"Lab Staff xử lý trọn vòng một thiết bị hỏng trên staging (báo hỏng S34 → bảng bảo trì S35), và Lab Manager xem được dashboard + báo cáo mức sử dụng của lab (S41, S42)."')],
  ])}
<p>${t(
    'The strong one names <em>who</em> can do <em>what</em>, on which screens, where. At the review on 26/03 anyone can open staging and answer "yes" or "no" for each half — and in lesson 12.3 the honest answer will be "half". A goal that cannot fail cannot tell you anything either. (Scrum Guide 2020: the Sprint Goal is the single objective of the sprint and gives the team flexibility in what exactly to deliver — ', 'Câu mạnh nêu <em>ai</em> làm được <em>gì</em>, trên màn nào, ở đâu. Ở buổi review 26/03 ai cũng mở staging ra trả lời "có" hoặc "không" cho từng nửa — và ở bài 12.3 câu trả lời thật thà sẽ là "một nửa". Mục tiêu không thể trượt thì cũng không cho bạn biết gì. (Scrum Guide 2020: Sprint Goal là mục tiêu duy nhất của sprint và cho đội sự linh hoạt về chính xác giao cái gì — ')}${ag('agl-1-2-scrum', '1.2')}.)</p>

<h3>${t('Step 4 — Minutes that match the data', 'Bước 4 — Biên bản khớp với dữ liệu')}</h3>
<p>${t('The minutes are what the supervisor and the team will reread when someone asks "what did we agree?". A script compares them with ticket.csv, nang-luc.json and the plan file before they are posted:', 'Biên bản là thứ giảng viên và cả nhóm đọc lại khi ai đó hỏi "hôm đó chốt gì?". Một script đối chiếu biên bản với ticket.csv, nang-luc.json và tệp kế hoạch trước khi đăng:')}</p>
${js(MA.kiemPlanning)}
<p>${t('The minutes typed in a hurry at 20:10:', 'Biên bản gõ vội lúc 20:10:')}</p>
${out(MA.bbV1)}
${out('$ node kiem-planning.mjs goi-sprint/bien-ban-planning-v1.md\n' + RA.kiemPlanningV1)}
<p>${t(
    'Seven of eight rules fail, and each failure is a real future argument: the two carried-over tickets are missing (B8 — nobody would own finishing them), three stretch tickets slipped into the commitment (B2), the written total is off by one (B3), and the action items "report to the supervisor" and "C5 tries harder" have no owner and no date (B7) — the second one is also a judgement about a person, not an action. The minutes as posted:',
    'Bảy trên tám luật trượt, và mỗi chỗ trượt là một cuộc cãi nhau sau này: thiếu hai ticket dở (B8 — không ai chịu trách nhiệm làm nốt), ba ticket dự phòng lọt vào cam kết (B2), tổng ghi lệch một điểm (B3), và hai việc "báo giảng viên tiến độ", "C5 cố gắng hơn" không có chủ, không có hạn (B7) — việc thứ hai còn là một nhận xét về con người chứ không phải việc làm. Biên bản được đăng:')}</p>
${out(MA.bb)}
${out('$ node kiem-planning.mjs goi-sprint/bien-ban-planning.md\n' + RA.kiemPlanning)}
${note(t('Use the template from lesson 6.2 (bien-ban-planning.md). "Ghi" (minute-taker) rotates — this time C4. The plan file the scripts read for the rest of the sprint is <code>sprint.json</code>:', 'Dùng mẫu bài 6.2 (bien-ban-planning.md). Người "Ghi" xoay vòng — lần này là C4. Tệp kế hoạch các script đọc suốt sprint là <code>sprint.json</code>:'))}
${out(MA.sprintJson)}
<p>${t('(<code>themGiua</code> and <code>boGiua</code> are filled on 15/03, not at planning — lesson 12.2.)', '(<code>themGiua</code> và <code>boGiua</code> được điền ngày 15/03, không phải lúc planning — bài 12.2.)')}</p>

<h3>${t('Step 5 — Into CT Work, and tell the people affected', 'Bước 5 — Đưa lên CT Work, và báo người bị ảnh hưởng')}</h3>
<ul>
  <li>${t('Create the sprint on <a href="/work">CT Work</a>: commitment in the sprint, LF-68 and LF-75 labelled "stretch", the four sprint-4 tickets left in the backlog (how: ', 'Tạo sprint trên <a href="/work">CT Work</a>: cam kết vào sprint, LF-68 và LF-75 gắn nhãn "dự phòng", bốn ticket sprint 4 để lại backlog (cách làm: ')}${ag('agl-2-4-ct-work', '2.4')}, ${ag('agl-2-5-lab', '2.5')}).</li>
  <li>${t('Update <code>docs/phan-cong.csv</code> for S46 and S47 (C3 owns that task, LF-86) — CI’s contribution report reads it (', 'Cập nhật <code>docs/phan-cong.csv</code> cho S46 và S47 (C3 làm, LF-86) — báo cáo đóng góp của CI đọc tệp này (')}${ag('agl-3-5-lab', '3.5')}).</li>
  <li>${t('C5 hears the plan for S35 and the one-day review promise <em>in the meeting</em>, not from the board.', 'C5 nghe kế hoạch S35 và lời hứa review trong một ngày <em>ngay trong buổi họp</em>, không phải tự đọc trên bảng.')}</li>
</ul>

<h3>${t('At work: the same evening at FPT Software', 'Đi làm thật: cùng buổi tối đó ở FPT Software')}</h3>
<p>${t(
    'On an outsourcing project the shape is the same but the units change: capacity is in man-days (', 'Ở dự án outsourcing hình dạng giống hệt nhưng đơn vị khác: năng lực tính bằng man-day (')}${ag('agl-9-6-uoc-luong-man-day', '9.6')}${t(
    '), the "supervisor" is the customer or the PM, and the leader’s 30 % is written into the plan as "PM/BrSE effort". A Japanese customer will ask for the plan in a spreadsheet before the sprint starts and will treat every number as a promise — which is exactly why a plan that fits each person matters more than a plan that looks full. An American customer working Scrum with you will ask "what is the sprint goal?" in the first minute of the call.',
    '), "giảng viên" là khách hoặc PM, còn 30 % của trưởng nhóm được ghi vào kế hoạch là "công PM/BrSE". Khách Nhật sẽ xin kế hoạch dạng bảng tính trước khi sprint bắt đầu và coi mỗi con số là một lời hứa — chính vì vậy một kế hoạch vừa với từng người quan trọng hơn một kế hoạch trông đầy. Khách Mỹ làm Scrum trực tiếp với bạn sẽ hỏi "sprint goal là gì?" ngay phút đầu cuộc gọi.')}</p>

${phongVan([
    [t('"How did you plan a sprint for your student team?"', '"Bạn lên kế hoạch sprint cho nhóm sinh viên thế nào?"'),
     t('From last sprint’s velocity per person-day, minus known absences and my own coordination time, carried-over work at its remaining size; then I checked each person’s load, not only the team total — the priority cut overloaded one member by about 3 points, so we moved one ticket to stretch. The goal named a user, a flow and the screens.', 'Từ velocity sprint trước trên mỗi ngày-người, trừ ngày vắng đã biết và thời gian điều phối của chính mình, ticket dở tính theo phần còn lại; rồi em soát tải từng người chứ không chỉ tổng nhóm — bản cắt theo ưu tiên làm một bạn quá tải khoảng 3 điểm nên nhóm chuyển một ticket xuống dự phòng. Mục tiêu nêu người dùng, luồng việc và các màn.')],
    [t('"Your team wants to commit to more than its velocity. What do you do?"', '"Nhóm muốn cam kết nhiều hơn velocity. Bạn làm gì?"'),
     t('Show the number (here 61 points of work vs 41.2 capacity), commit to what fits, keep a short stretch list, and tell the stakeholder that night which items move — not at the end of the sprint.', 'Đưa con số ra (ở đây 61 điểm việc so với năng lực 41.2), cam kết phần vừa, giữ một danh sách dự phòng ngắn, và báo người liên quan ngay tối đó những gì phải dời — không đợi cuối sprint.')],
    [t('"What is a good sprint goal?"', '"Sprint goal tốt là gì?"'),
     t('One sentence a person outside the team can check on the demo day: who can do what, where. Not a list of tickets, and not "as much as possible".', 'Một câu mà người ngoài nhóm kiểm được vào ngày demo: ai làm được gì, ở đâu. Không phải danh sách ticket, cũng không phải "càng nhiều càng tốt".')],
    [t('"How do you handle a team member who delivered nothing last sprint?"', '"Bạn xử lý thế nào với thành viên sprint trước không làm xong gì?"'),
     t('Not by doing their work and not by giving them nothing. I put their biggest screen first, split it into two tickets, promised review within a day, and set a checkpoint with a date in the risk log. Their first PR merged a day before the checkpoint.', 'Không làm thay và cũng không bỏ trống việc của bạn ấy. Em đưa màn lớn nhất của bạn ấy lên đầu, chia thành hai ticket, hứa review trong một ngày, và ghi mốc kiểm có ngày vào sổ rủi ro. PR đầu tiên của bạn ấy merge sớm hơn mốc một ngày.')],
  ], en)}

<h3>${t('Exercises', 'Bài tập')}</h3>
<ol>
  <li>${t('C4 now says they will be away the <em>whole</em> week of 22–26/03, not two days. Rerun capacity and balance on a copy of the data. Is the plan still fine? Look beyond the totals.', 'C4 giờ báo vắng <em>cả</em> tuần 22–26/03, không phải hai ngày. Chạy lại năng lực và cân theo người trên bản sao dữ liệu. Kế hoạch còn ổn không? Nhìn xa hơn các con số tổng.')}</li>
  <li>${t('Write the sprint goal for sprint 4 (29/03–16/04, the end of iteration 3). Check it against rule B1.', 'Viết sprint goal cho sprint 4 (29/03–16/04, cuối iteration 3). Soát với luật B1.')}</li>
</ol>
${giai(t('Solution 1 (real run)', 'Lời giải 1 (chạy thật)'), out(RA.baiTap121) + `<p>${t(
    'Capacity drops to 39.4 and C4’s personal line is still balanced (6 vs 6.1) — because C4’s load was light. But totals hide <em>timing</em>: C4 would be away for the whole last week, so LF-74 must be merged by Friday 19/03 or not at all. The real change is in the order: LF-74 starts on 09/03 right after LF-45 merges, LF-46 waits, and the review of LF-74 is booked for 18/03. Write that in the minutes as a checkpoint.',
    'Năng lực xuống 39.4 và dòng của C4 vẫn cân (6 so với 6.1) — vì tải của C4 vốn nhẹ. Nhưng con số tổng che mất <em>thời điểm</em>: C4 vắng cả tuần cuối, nên LF-74 phải merge trước thứ Sáu 19/03 hoặc không bao giờ. Thay đổi thật nằm ở thứ tự: LF-74 bắt đầu ngày 09/03 ngay sau khi LF-45 merge, LF-46 chờ, và review LF-74 được hẹn ngày 18/03. Ghi điều đó vào biên bản như một mốc kiểm.')}</p>`)}
${giai(t('Solution 2', 'Lời giải 2'), `<p>${t('Exam 12.5 uses this one: "The supervisor can approve the iteration-3 demo on 16/04: the Lab Manager sees reports S42/S43, the Admin sees audit S45 and dashboard S46, Lab Staff check in by hand on S29." It passes B1: under 45 words, names users and screens, and it can fail.', 'Đề thi 12.5 dùng câu này: "Giảng viên duyệt được bản demo iteration 3 ngày 16/04: Lab Manager xem báo cáo S42/S43, Admin xem audit S45 và dashboard S46, Lab Staff check-in tay ở S29." Qua B1: dưới 45 từ, nêu người dùng và màn, và có thể trượt.')}</p>`)}

${thuatNgu([
    [t('Remaining estimate', 'Ước lượng phần còn lại'), t('The re-estimated size of the unfinished part of a carried-over ticket; capacity is planned on it, velocity is still counted on the full points when done.', 'Kích thước ước lại của phần chưa xong của ticket dở; năng lực kẻ theo nó, còn velocity vẫn tính đủ điểm khi xong.')],
    [t('Coordination time', 'Thời gian điều phối'), t('The share of the leader’s time spent on meetings, reviews and reporting; subtract it in every sprint you compare, or not at all.', 'Phần thời gian trưởng nhóm dành cho họp, review, báo cáo; trừ ở mọi sprint đem so, hoặc không trừ ở đâu cả.')],
    [t('Sprint Goal', 'Sprint Goal'), t('The single objective of the sprint (Scrum Guide 2020) — checkable by someone outside the team.', 'Mục tiêu duy nhất của sprint (Scrum Guide 2020) — người ngoài nhóm kiểm được.')],
    [t('Term-wide LOC balance', 'Cân LOC cả kỳ'), t('Comparing each member’s LOC over all iterations before assigning the last one; SWP391 grades per person over the project.', 'So LOC của từng người qua mọi iteration trước khi giao iteration cuối; SWP391 chấm theo người trên cả đồ án.')],
  ], en)}
${tomTat([
    t('Balance LOC over the whole term before planning the last iteration; decide reassignments in the meeting, with names.', 'Cân LOC cả kỳ trước khi lên kế hoạch iteration cuối; quyết đổi chủ màn ngay trong buổi họp, ghi tên người đồng ý.'),
    t('Capacity = velocity per person-day × available person-days; subtract the leader’s coordination time in both sprints; plan carried-over work at its remaining size.', 'Năng lực = velocity mỗi ngày-người × số ngày-người có mặt; trừ thời gian điều phối của trưởng nhóm ở cả hai sprint; ticket dở tính theo phần còn lại.'),
    t('A cut that fits the team can still overload one person — check each line.', 'Bản cắt vừa với nhóm vẫn có thể làm quá tải một người — soát từng dòng.'),
    t('The goal names who can do what, where; the minutes match the data (kiem-planning.mjs 8/8) before they are posted.', 'Mục tiêu nêu ai làm được gì, ở đâu; biên bản khớp dữ liệu (kiem-planning.mjs 8/8) rồi mới đăng.'),
  ], en)}
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-9-2-thuc-hien', t('12.2 — Daily work: PRs, reviews, standups', '12.2 — Công việc hằng ngày: PR, review, standup'))}.</p>
`);
};

export default {
  title: '12.1 — Backlog, sprint goal and planning|||12.1 — Backlog, mục tiêu sprint và planning',
  slug: 'agl-9-1-chuan-bi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án cuối khoá — planning sprint 3 của LabFlow chạy thật: cân LOC cả kỳ (chênh 390 → 180, quyết trong buổi họp), năng lực trừ 30 % điều phối của trưởng nhóm ở cả hai sprint và tính ticket dở theo phần còn lại (41.2 điểm), bản cắt theo ưu tiên làm C5 quá tải ⇒ sửa, sprint goal kiểm được, biên bản đối chiếu dữ liệu (7/8 luật trượt → 8/8), đưa lên CT Work.',
  content: L121(true) + L121(false),
};
