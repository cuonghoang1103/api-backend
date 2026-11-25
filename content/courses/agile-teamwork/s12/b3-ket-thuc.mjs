/**
 * 12.3 — Review, retro và báo cáo (agl-9-3-ket-thuc — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ngày cuối sprint 3 (26/03/2027): chốt số 19:00 → review/demo → retro → báo cáo sprint cho giảng viên → dự báo iteration 3.
 * Lab THẬT (scratchpad/agt/lab/ch12): retro.mjs (39/47; C5 0 → 13 điểm; LẦN ĐẦU bắt nhầm R4-1 là "xác sống" của R1-4 vì cùng khuôn câu
 * ⇒ chỉ tính xác sống khi hành động cũ CHƯA làm), xuat-burndown.mjs + burndown.mjs (bài 1.5), bai-tap-123.sh (bỏ 2 ticket dở ⇒ tuần đầu phẳng),
 * dong-gop.mjs (bài 3.5, thêm --invert-grep), du-bao.mjs (mẫu sprint 2 + 3: 89 % cho 8 ticket; chỉ sprint 3: 98 % — lạc quan),
 * soat-bao-cao.mjs trên báo cáo sprint (bản vội 8 lỗi; LẦN ĐẦU /khá/ khớp "Khác" ⇒ ranh giới \p{L}).
 * Sự cố thật: HHS OIG OEI-06-14-00350 (02/2016) — HealthCare.gov (truy cập 24/11/2026).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L123 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Lesson 12.3', 'Chương 12 · Bài 12.3', `
<h2>${t('12.3 — Review, retro and report', '12.3 — Review, retro và báo cáo')}</h2>
<p class="lead">${t(
    'Friday 26/03. At 19:00 the numbers are frozen; at 19:30 the supervisor watches the demo; then the team looks at itself; and before midnight the supervisor has a report that says exactly what happened, including what did not. Three meetings, one rule: data first, opinions second, decisions last — each decision with one owner and a date.',
    'Thứ Sáu 26/03. 19:00 chốt số; 19:30 giảng viên xem demo; sau đó nhóm nhìn lại chính mình; và trước nửa đêm giảng viên có một bản báo cáo nói đúng những gì đã xảy ra, kể cả những gì không xong. Ba buổi họp, một luật: dữ liệu trước, ý kiến sau, quyết định cuối — mỗi quyết định có đúng một người chịu trách nhiệm và một hạn.')}</p>

<h3>${t('Everyday picture: after the match', 'Liên tưởng đời thường: sau trận đấu')}</h3>
<p>${t(
    'A football team plays in front of the fans (the review: show what you can do, listen to the people who pay), then watches the recording alone in the dressing room (the retro: no fans, no blame, "on the 60th minute our left side was empty — who covers it next time?"), and the coach answers the press with the score, not with "we tried hard" (the report). Mixing them up — analysing mistakes in front of the fans, or telling the press only the good minutes — is how teams lose trust.',
    'Một đội bóng thi đấu trước khán giả (review: cho người xem thấy làm được gì, nghe những người trả tiền), rồi xem lại băng hình trong phòng thay đồ (retro: không khán giả, không đổ lỗi, "phút 60 cánh trái trống — lần sau ai bọc?"), và huấn luyện viên trả lời báo chí bằng tỉ số chứ không phải "các cầu thủ đã cố gắng" (báo cáo). Trộn lẫn chúng — mổ xẻ lỗi trước khán giả, hay chỉ kể với báo chí những phút hay — là cách đội bóng mất niềm tin.')}</p>

<h3>${t('19:00 — Freeze the numbers', '19:00 — Chốt số')}</h3>
${out('$ node retro.mjs | sed -n "1,/Điểm xong theo người/p"\n' + RA.retro.split('\n\n2)')[0])}
<ul>
  <li>${t('<strong>39 of 47 committed points</strong> (83 %). Two tickets unfinished: LF-73 (S29, C3) in progress, LF-42 (S42, C2) in review. LF-68 was traded out on 15/03; LF-75 was a stretch ticket started late.', '<strong>39 trên 47 điểm cam kết</strong> (83 %). Hai ticket chưa xong: LF-73 (S29, C3) đang làm, LF-42 (S42, C2) đang review. LF-68 đã đổi ra ngày 15/03; LF-75 là ticket dự phòng bắt đầu muộn.')}</li>
  <li>${t('<strong>C5: 0 points in sprint 2, 13 in sprint 3</strong> — the most of anyone. The planning decisions of 12.1 (S35 first, split, review within a day) are visible in this one line.', '<strong>C5: 0 điểm ở sprint 2, 13 điểm ở sprint 3</strong> — nhiều nhất nhóm. Các quyết định ở planning 12.1 (S35 lên đầu, chia nhỏ, review trong một ngày) hiện ra trong đúng một dòng này.')}</li>
  <li>${t('LF-25’s cycle time of 16 days is history from sprint 2, not a sprint-3 problem — read cycle times together with the start date.', 'Cycle time 16 ngày của LF-25 là lịch sử từ sprint 2, không phải vấn đề của sprint 3 — đọc cycle time phải kèm ngày bắt đầu.')}</li>
</ul>
<p>${t('The burndown, from the board as exported at 19:00 (the chart script is lesson ', 'Burndown, từ bảng xuất lúc 19:00 (script vẽ là bài ')}${ag('agl-1-5-lab', '1.5')}):</p>
${js(MA.xuatBurndown)}
${out(MA.burndownCsv)}
${out('$ node burndown.mjs burndown-sprint3.csv 2027-03-08 2027-03-26\n' + RA.burndown)}
<p>${t(
    'Three things a supervisor will read from this chart: a steep first two days (are they real?), a step <em>up</em> on 15/03 (the PDF export added mid-sprint — visible, not hidden), and 8 points left at the end. The first one is the trap: those two days are the carried-over tickets, worth 8 points but only 2 points of work. Exercise 1 shows what week 1 looked like without them.',
    'Ba điều giảng viên sẽ đọc từ biểu đồ này: hai ngày đầu dốc đứng (có thật không?), một bước nhảy <em>lên</em> ngày 15/03 (xuất PDF thêm giữa sprint — hiện rõ, không giấu), và còn 8 điểm lúc kết thúc. Điều đầu tiên là cái bẫy: hai ngày đó là hai ticket dở, mang 8 điểm nhưng chỉ có 2 điểm việc. Bài tập 1 cho thấy tuần đầu trông thế nào khi bỏ chúng ra.')}</p>

<h3>${t('19:30 — Sprint review: show only what is Done', '19:30 — Sprint review: chỉ cho xem cái đã Done')}</h3>
${bang([t('Minutes', 'Phút'), t('Who', 'Ai'), t('What', 'Việc')], [
    ['0–3', 'C1', t('The sprint goal, read aloud; the answer for each half: "maintenance flow — yes; usage report — no, here is why"', 'Đọc to sprint goal; trả lời từng nửa: "vòng bảo trì — có; báo cáo mức sử dụng — chưa, lý do là…"')],
    ['3–12', t('C5, C3', 'C5, C3'), t('Live on staging, as the user: a student reports a broken device (S34) → Lab Staff moves it across the board (S35); then the weekly timetable and its PDF (S47)', 'Chạy thật trên staging, trong vai người dùng: sinh viên báo hỏng thiết bị (S34) → Lab Staff kéo thẻ qua bảng (S35); rồi thời khoá biểu tuần và bản PDF (S47)')],
    ['12–20', t('C2, C1, C4, C3', 'C2, C1, C4, C3'), t('S41, S40, S32/S33, S27 — each by its owner, two minutes each', 'S41, S40, S32/S33, S27 — mỗi màn do chính chủ màn trình bày, hai phút mỗi người')],
    ['20–30', t('Supervisor', 'Giảng viên'), t('Feedback; C4 writes every request as a backlog item with the supervisor’s words, not a promise', 'Góp ý; C4 ghi mọi yêu cầu thành mục backlog bằng đúng lời giảng viên, không hứa ngay')],
    ['30–35', 'C1', t('Forecast for 16/04 and the one question that needs an answer (S42 demo on 02/04?)', 'Dự báo cho 16/04 và một câu hỏi cần trả lời (demo S42 ngày 02/04 được không?)')],
  ])}
${cl('warn', `<p>${t(
    '<strong>S42 is not shown.</strong> It works on C2’s laptop and the charts are pretty; the second review found that a date range crossing two months returns wrong totals. Demoing it would turn a known bug into a promise. The Scrum Guide puts it plainly: work that does not meet the Definition of Done is not presented at the review (', '<strong>Không demo S42.</strong> Nó chạy trên máy C2 và biểu đồ đẹp; review lần hai tìm ra khoảng ngày vắt qua hai tháng cho tổng sai. Demo nó là biến một lỗi đã biết thành một lời hứa. Scrum Guide nói thẳng: việc chưa đạt Definition of Done thì không trình bày ở review (')}${ag('agl-1-2-scrum', '1.2')}).</p>`)}

<h3>${t('20:15 — Retro: data first', '20:15 — Retro: dữ liệu trước')}</h3>
<p>${t('Part 2 of the same script checks every retro action ever written — owner, deadline, ticket, measurable, and whether it repeats an older action ("zombie"). The team proposed three new ones; the first run:', 'Phần 2 của cùng script soát mọi hành động retro từng viết — có chủ, có hạn, có ticket, đo được, và có lặp lại hành động cũ không ("xác sống"). Nhóm đề xuất ba hành động mới; lần chạy đầu:')}</p>
${out(RA.retroLan1.split('\n').slice(RA.retroLan1.split('\n').findIndex((d) => d.includes('R3-4'))).join('\n'))}
<p>${t(
    'R4-3 is a true zombie: "everyone asks early when stuck" is R3-1 again, which had already been dropped for being unmeasurable. But R4-1 is a <strong>false alarm</strong>: "CI runs gitleaks on every PR and blocks merge on a secret" shares the template of R1-4 ("CI runs tests on every PR and blocks merge when red") — and R1-4 was <em>done</em>. Repeating an action that worked is not a zombie. The rule was corrected: a zombie repeats an older action that was <em>not</em> done.',
    'R4-3 là xác sống thật: "mọi người chủ động hỏi sớm khi vướng" chính là R3-1, vốn đã bị bỏ vì không đo được. Nhưng R4-1 là <strong>báo nhầm</strong>: "CI chạy gitleaks cho mọi PR và chặn merge khi có bí mật" cùng khuôn câu với R1-4 ("CI chạy test cho mọi PR và chặn merge khi đỏ") — mà R1-4 đã <em>làm xong</em>. Lặp lại một hành động đã hiệu quả không phải xác sống. Luật được sửa: xác sống là lặp lại hành động cũ <em>chưa</em> được làm.')}</p>
<p>${t('R4-3 rewritten by the person it came from (C3, after the silent days of 12.2) — an action they own, with a number and a check:', 'R4-3 được viết lại bởi chính người trong cuộc (C3, sau mấy ngày im lặng ở 12.2) — một hành động bạn ấy làm chủ, có con số và có cách kiểm:')}</p>
${out('$ node retro.mjs du-lieu/hanh-dong-sua.csv\n…\n' + RA.retroSua)}
${note(t('"Đạt chuẩn 11/15" counts the whole history; old actions from sprint 1–2 stay unfixed on purpose — the log is a record, not a scoreboard. What matters is the last line: actions with owner + deadline + ticket were done 8/8, actions missing one of the three 0/4. That single line is the best argument for the format you will ever show a team.', '"Đạt chuẩn 11/15" tính cả lịch sử; các hành động cũ của sprint 1–2 cố ý để nguyên — sổ là hồ sơ, không phải bảng điểm. Điều quan trọng là dòng cuối: hành động có chủ + hạn + ticket được làm 8/8, thiếu một trong ba thì 0/4. Một dòng đó là lý lẽ mạnh nhất cho cách viết hành động mà bạn từng đưa ra trước một nhóm.'))}

<h3>${t('21:00 — Who built what: LOC per screen on main', '21:00 — Ai làm gì: LOC theo màn trên main')}</h3>
${out(RA.dongGop)}
<p>${t(
    'This is the same report as lesson ', 'Đây là cùng báo cáo của bài ')}${ag('agl-3-5-lab', '3.5')}${t(
    ', run on the rebuilt repository. Only merged work counts: S42 has 251 lines on its branch but none on main — exactly how the supervisor will see it in the LOC sheet. S31 and the first half of S24 show little because their lines were committed in sprint 2 (the report starts at 08/03). "No commit deviates from the assignment" means no one wrote code on another person’s screen — the thing that silently moves LOC between people.',
    ', chạy trên repo dựng lại. Chỉ việc đã merge mới được tính: S42 có 251 dòng trên nhánh nhưng 0 dòng trên main — đúng như giảng viên sẽ thấy trong bảng LOC. S31 và nửa đầu S24 hiện ít vì các dòng đó commit ở sprint 2 (báo cáo tính từ 08/03). "Không có gì lệch phân công" nghĩa là không ai viết mã trên màn của người khác — chuyện âm thầm chuyển LOC từ người này sang người kia.')}</p>

<h3>${t('21:15 — The forecast, updated', '21:15 — Dự báo, cập nhật')}</h3>
${js(MA.duBao)}
${out(RA.duBao)}
<p>${t(
    'Eight tickets are left for iteration 3 (six committed, S36 and S37 "if time allows"). With both sprints as the sample: 89 % for all eight by 16/04, 99 % for the six. With sprint 3 alone the answer is 98 % — too rosy, because sprint 3’s throughput includes the two carried-over merges whose work was done in sprint 2. The report uses the combined sample and says why.',
    'Iteration 3 còn tám ticket (sáu đã cam kết, S36 và S37 "nếu kịp"). Lấy mẫu cả hai sprint: 89 % xong cả tám trước 16/04, 99 % cho sáu ticket. Chỉ lấy sprint 3 thì ra 98 % — quá hồng, vì thông lượng sprint 3 có hai lần merge của ticket dở mà phần việc đã làm ở sprint 2. Báo cáo dùng mẫu gộp và nói rõ lý do.')}</p>

<h3>${t('22:00 — The sprint report to the supervisor', '22:00 — Báo cáo sprint gửi giảng viên')}</h3>
<p>${t('The version written at 21:55, tired:', 'Bản viết lúc 21:55, mệt:')}</p>
${out(MA.bcV1)}
<p>${t('The checker of lesson 6.3 — the first run had one false alarm:', 'Bộ soát của bài 6.3 — lần chạy đầu có một báo nhầm:')}</p>
${out(RA.soatBaoCaoSprintLan1)}
<p>${t(
    '"## Khác" ("Other") was flagged as vague because the vague-word list contains "khá" ("rather good") — a substring of "Khác". Same root cause as the "khẩu" bug in 12.2, same fix (letter-class boundaries). After the fix:',
    '"## Khác" bị cờ là từ mơ hồ vì danh sách từ mơ hồ có "khá" — chuỗi con của "Khác". Cùng gốc với lỗi "khẩu" ở 12.2, cùng cách sửa (ranh giới theo chữ cái). Sau khi sửa:')}</p>
${out(RA.soatBaoCaoSprint)}
<p>${t('The report sent:', 'Báo cáo được gửi:')}</p>
${out(MA.bc)}
<ul>
  <li>${t('The bad news is first, with cause and decision: S42 not done, the secret incident with times.', 'Tin xấu đứng đầu, kèm nguyên nhân và quyết định: S42 chưa xong, sự cố bí mật kèm giờ.')}</li>
  <li>${t('The goal is answered per half; every "done" line carries screen, ticket, PR and owner — the supervisor can open each one.', 'Mục tiêu được trả lời từng nửa; mọi dòng "đã xong" có màn, ticket, PR và người — giảng viên mở được từng cái.')}</li>
  <li>${t('The forecast has a denominator, a method and its weakness; the one question has a deadline.', 'Dự báo có mẫu số, phương pháp và điểm yếu của nó; câu hỏi duy nhất có hạn trả lời.')}</li>
</ul>
${cl('danger', `<p><strong>${t('Real case — HealthCare.gov, 2013', 'Chuyện thật — HealthCare.gov, 2013')}</strong></p><p>${t(
    'The US federal health-insurance website failed on launch day (1 October 2013). The HHS Office of Inspector General’s case study (February 2016) found that "most critical was the absence of clear leadership", and that the agency "continued on a failing path despite signs of trouble, making rushed corrections that proved insufficient". The recovery — the site was usable within two months — came from a "badgeless" culture where staff and contractors worked as one team and "ruthless prioritization" of the most important, achievable goals. Signs of trouble that are seen but not reported upward with numbers are exactly what a green-only status report produces. Source: ',
    'Trang web bảo hiểm y tế liên bang Mỹ sập ngay ngày ra mắt (1/10/2013). Báo cáo của Văn phòng Tổng Thanh tra Bộ Y tế Mỹ (HHS OIG, 02/2016) kết luận "nghiêm trọng nhất là thiếu một người lãnh đạo rõ ràng", và cơ quan này "tiếp tục đi trên con đường thất bại dù đã có dấu hiệu, sửa vội những chỗ hoá ra không đủ". Việc cứu vãn — trang dùng được sau hai tháng — đến từ văn hoá "không phân biệt thẻ" (nhân viên và nhà thầu làm như một đội) và "ưu tiên không khoan nhượng" những mục tiêu quan trọng, làm được. Dấu hiệu đã thấy mà không báo lên bằng con số chính là thứ một bản báo cáo lúc nào cũng xanh tạo ra. Nguồn: ')}${ng('https://oig.hhs.gov/reports/all/2016/healthcaregov-case-study-of-cms-management-of-the-federal-marketplace/', 'HHS OIG, OEI-06-14-00350 (2016)')}.</p>`)}

<h3>${t('At work: review and report with a customer', 'Đi làm thật: review và báo cáo với khách')}</h3>
<p>${t(
    'With a Japanese customer the review is usually a formal meeting with minutes sent the same day, every request logged as a Q&amp;A item or a change request, and no "yes" said in the room (', 'Với khách Nhật, review thường là một buổi họp trang trọng, biên bản gửi trong ngày, mọi yêu cầu ghi thành mục Q&amp;A hoặc change request, và không nói "vâng, được" ngay trong phòng (')}${ag('agl-11-1-khach-nhat', '11.1')}${t(
    '). With an American customer the demo is shorter, more interactive, and they will ask for the forecast as a date range with a confidence — the same 89 %/99 % form you just produced (', '). Với khách Mỹ, demo ngắn hơn, tương tác nhiều hơn, và họ sẽ hỏi dự báo dạng khoảng ngày kèm độ tin cậy — đúng dạng 89 %/99 % bạn vừa làm (')}${ag('agl-11-2-khach-my', '11.2')}).</p>

${phongVan([
    [t('"Your sprint did not meet its goal. How did you report it?"', '"Sprint không đạt mục tiêu. Bạn báo cáo thế nào?"'),
     t('Bad news first: which half of the goal failed, the cause (a date-range bug found in the second review), the decision (not demoed, first in the next sprint, split into smaller tickets) and the forecast impact with its method. Then what was done, each with a ticket and PR.', 'Tin xấu trước: nửa nào của mục tiêu không đạt, nguyên nhân (lỗi khoảng ngày phát hiện ở review lần hai), quyết định (không demo, lên đầu sprint sau, chia ticket nhỏ hơn) và ảnh hưởng tới dự báo kèm phương pháp. Rồi mới tới những gì đã xong, mỗi dòng có ticket và PR.')],
    [t('"How do you make retrospectives change anything?"', '"Làm sao để retro thay đổi được điều gì đó?"'),
     t('One owner, a deadline and a ticket per action, checked at the next retro. In our log, actions with all three were done 8/8 and actions missing one were done 0/4. And we drop zombies — actions that repeat an old one that was never done.', 'Mỗi hành động có một chủ, một hạn và một ticket, soát lại ở retro sau. Trong sổ của nhóm em, hành động đủ ba thứ được làm 8/8, thiếu một thứ thì 0/4. Và nhóm bỏ "xác sống" — hành động lặp lại cái cũ chưa từng được làm.')],
    [t('"Would you demo a feature that is almost done?"', '"Bạn có demo một tính năng gần xong không?"'),
     t('No. If it does not meet the Definition of Done it is not shown; showing it turns a known bug into a promise. I say what is missing and when it will be shown.', 'Không. Chưa đạt Definition of Done thì không trình bày; đem ra demo là biến lỗi đã biết thành lời hứa. Em nói rõ còn thiếu gì và khi nào sẽ demo.')],
  ], en)}

<h3>${t('Exercises', 'Bài tập')}</h3>
<ol>
  <li>${t('Draw the burndown again without LF-25 and LF-45. What did week 1 really look like, and should you show this version to the supervisor?', 'Vẽ lại burndown khi bỏ LF-25 và LF-45. Tuần đầu thật ra trông thế nào, và có nên cho giảng viên xem bản này không?')}</li>
  <li>${t('Write a retro action for the S42 problem that passes every check of retro.mjs, then compare with R4-2.', 'Viết một hành động retro cho vấn đề S42 qua mọi luật của retro.mjs, rồi so với R4-2.')}</li>
</ol>
${giai(t('Solution 1 (real run)', 'Lời giải 1 (chạy thật)'), out(RA.baiTap123) + `<p>${t(
    'Without the carried-over tickets the line is flat for four days and stays above the ideal until the second week: nothing new merged before 12/03. That is normal for a sprint that starts five screens at once — but it is the honest picture. Yes, show it next to the official one, with one sentence: "the first drop is sprint-2 work".',
    'Bỏ hai ticket dở thì đường nằm ngang bốn ngày và ở trên đường lý tưởng tới tuần hai: không ticket mới nào merge trước 12/03. Chuyện đó bình thường với một sprint bắt đầu năm màn cùng lúc — nhưng đó là bức tranh thật. Có, đưa nó cạnh bản chính thức, kèm một câu: "đoạn tụt đầu tiên là việc của sprint 2".')}</p>`)}
${giai(t('Solution 2', 'Lời giải 2'), out(MA.hanhDong.split('\n').filter((d) => d.includes('R4-2')).join('\n')) + `<p>${t('Owner C2 (the screen’s owner), deadline before sprint-4 planning, ticket LF-84, and a number (≤ 3 points) that the planning checker can enforce.', 'Chủ là C2 (chủ màn), hạn trước planning sprint 4, ticket LF-84, và một con số (≤ 3 điểm) mà bộ soát planning kiểm được.')}</p>`)}

${thuatNgu([
    [t('Sprint Review', 'Sprint Review'), t('The inspection of the increment with stakeholders; only Done work is shown, feedback becomes backlog items.', 'Buổi xem xét phần tăng trưởng cùng người liên quan; chỉ trình bày việc đã Done, góp ý thành mục backlog.')],
    [t('Zombie action', 'Hành động xác sống'), t('A retro action that repeats an earlier one which was never done.', 'Hành động retro lặp lại một hành động cũ chưa từng được làm.')],
    [t('Throughput sample', 'Mẫu thông lượng'), t('The days of history a Monte Carlo forecast draws from; its choice can move the answer from 89 % to 98 %.', 'Các ngày lịch sử mà dự báo Monte Carlo rút ra; chọn mẫu nào có thể đổi kết quả từ 89 % thành 98 %.')],
    [t('Watermelon report', 'Báo cáo "dưa hấu"'), t('Green outside, red inside: a status that hides known problems.', 'Ngoài xanh trong đỏ: trạng thái che các vấn đề đã biết.')],
  ], en)}
${tomTat([
    t('Freeze numbers before the meetings; read burndowns knowing what carried-over work does to them.', 'Chốt số trước các buổi họp; đọc burndown khi đã hiểu ticket dở làm nó méo ra sao.'),
    t('Review shows only Done work, by its owners, as users; feedback is recorded, not promised.', 'Review chỉ trình bày việc Done, do chính chủ màn, trong vai người dùng; góp ý được ghi lại, không hứa ngay.'),
    t('Retro: data, then at most a few actions with one owner, a deadline and a ticket; drop zombies — but check the checker.', 'Retro: dữ liệu trước, rồi vài hành động có một chủ, một hạn, một ticket; bỏ xác sống — nhưng soát lại cả bộ soát.'),
    t('Report bad news first, with numbers, cause and decision; give forecasts with their sample and its weakness.', 'Báo cáo tin xấu trước, kèm số, nguyên nhân và quyết định; dự báo kèm mẫu dữ liệu và điểm yếu của nó.'),
  ], en)}
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-9-4-tong-ket', t('12.4 — Checklist and interview stories', '12.4 — Checklist và câu chuyện phỏng vấn'))}.</p>
`);
};

export default {
  title: '12.3 — Review, retro and report|||12.3 — Review, retro và báo cáo',
  slug: 'agl-9-3-ket-thuc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ngày cuối sprint 3 chạy thật: chốt số 19:00 (39/47 điểm, C5 0 → 13), burndown từ bảng xuất (bẫy ticket dở làm hai ngày đầu dốc giả), review chỉ demo cái đã Done (không demo S42), retro bằng dữ liệu (bộ soát bắt nhầm "xác sống" ⇒ sửa luật), LOC theo màn trên main, dự báo iteration 3 (89 % so với 98 % khi chọn sai mẫu), báo cáo sprint tin xấu trước (bản vội 8 lỗi → đạt 8/8), HealthCare.gov 2013.',
  content: L123(true) + L123(false),
};
