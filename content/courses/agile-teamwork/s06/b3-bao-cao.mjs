/**
 * 6.3 — Báo cáo tiến độ và rủi ro (agl-6-3-bao-cao). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT (scratchpad/agt/lab/ch6): tao-repo.mjs (repo git thật từ nhật ký sprint 2), bao-cao-tuan.mjs (git log + bảng + sổ rủi ro ⇒ báo cáo
 * Markdown có luật màu, dự báo khoảng), soat-bao-cao.mjs (8 luật; bản viết vội 11 lỗi, bản sinh 8/8; LẦN ĐẦU bắt nhầm chính dòng luật màu).
 * Ranh giới: báo cáo ngày cho khách + hội chứng 90 % ⇒ agl-9-7; biên bản họp với khách ⇒ agl-11-3; báo cáo độ tin cậy ⇒ ir-9-4. Bài này: trưởng nhóm → giảng viên.
 * Nguồn: Rogers Commission Report (Wikipedia), 24/11/2026.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L63 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.3', 'Chương 6 · Bài 6.3', `
<h2>${t('6.3 — Reporting progress and risk', '6.3 — Báo cáo tiến độ và rủi ro')}</h2>
<p class="lead">${t(
    'Your supervisor is your first stakeholder. They see the team for 30 minutes a week and grade it for a whole semester, so what they know comes almost entirely from what you write. A good weekly report does three things: it says plainly whether to worry, it puts bad news first, and every claim in it can be checked. In this lesson the report is generated from the data the team already has — git, the board, a risk log — and then checked by a script before it is sent.',
    'Giảng viên là bên liên quan đầu tiên của bạn. Cô thầy gặp nhóm 30 phút mỗi tuần và chấm điểm cả học kỳ, nên những gì họ biết gần như hoàn toàn đến từ những gì bạn viết. Báo cáo tuần tốt làm ba việc: nói thẳng có nên lo hay không, đặt tin xấu lên đầu, và mọi điều trong đó đều kiểm được. Bài này sinh báo cáo từ dữ liệu nhóm vốn đã có — git, bảng, sổ rủi ro — rồi cho script soát trước khi gửi.')}</p>
${note(t('The daily report an outsourcing developer sends to the client, the "90 % syndrome" and the escalation path are in ', 'Báo cáo ngày lập trình viên outsourcing gửi khách, "hội chứng 90 %" và đường báo lên ở ') + ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7')) + t('; minutes of client meetings in ', '; biên bản họp với khách ở ') + ag('agl-11-3-mui-gio-hop', t('lesson 11.3', 'bài 11.3')) + t('; a one-page monthly reliability report in ', '; báo cáo độ tin cậy một trang mỗi tháng ở ') + cs('incident-response', 'ir-9-4-bao-cao', t('Incident response 9.4', 'Ứng phó sự cố 9.4')) + t('. This lesson: a team leader reporting to a supervisor.', '. Bài này: trưởng nhóm báo cáo cho giảng viên.'))}

<h3>${t('Everyday picture: the weather forecast', 'Liên tưởng đời thường: bản tin thời tiết')}</h3>
<p>${t(
    'A forecast that says "weather will be fine" every day is useless even on the days it is right. A useful one says "70 % chance of rain from 3 pm" — a colour, a range, a reason — and it says it in the morning, not at 3 pm. Your weekly report is the forecast for your project: green / yellow / red with a written rule, a range for the sprint, and the storm warnings at the top.',
    'Bản tin ngày nào cũng nói "trời đẹp" là vô dụng, kể cả những ngày nó đúng. Bản tin có ích nói "70 % khả năng mưa từ 15 giờ" — một màu, một khoảng, một lý do — và nói từ sáng, không phải lúc 15 giờ. Báo cáo tuần là bản tin thời tiết của dự án: xanh / vàng / đỏ kèm luật viết ra, một khoảng dự báo cho sprint, và cảnh báo bão đặt ở đầu.')}</p>

<h3>${t('Watermelon reports', 'Báo cáo "dưa hấu"')}</h3>
<p>${t(
    'Project managers call it a watermelon: green outside, red inside. Every status is "on track" until the week it becomes "failed". It happens for human reasons — nobody wants to be the bearer of bad news, and "almost done" feels true to the person saying it. The cure is structural, not moral: a written rule for the colour, so the colour is computed, not chosen.',
    'Người làm quản lý dự án gọi nó là "dưa hấu": ngoài xanh, trong đỏ. Trạng thái tuần nào cũng "đúng tiến độ" cho tới tuần nó thành "hỏng". Nó xảy ra vì lý do con người — không ai muốn là người mang tin xấu, và "sắp xong" nghe đúng với chính người nói. Cách chữa nằm ở cấu trúc, không ở đạo đức: một luật màu viết ra, để màu được tính, không phải được chọn.')}</p>
${bang([t('Colour', 'Màu'), t('LabFlow’s rule (printed in every report)', 'Luật của LabFlow (in trong mọi báo cáo)'), t('Supervisor should', 'Giảng viên nên')], [
    ['🔴 ' + t('RED', 'ĐỎ'), t('A decision is needed from the supervisor, or even if every started card finishes the team stays under 70 % of the commitment', 'Cần giảng viên quyết định, hoặc kể cả khi mọi thẻ đã bắt đầu đều xong thì vẫn dưới 70 % cam kết'), t('Act this week', 'Hành động trong tuần')],
    ['🟡 ' + t('YELLOW', 'VÀNG'), t('Current pace finishes under 90 % of the commitment, or a risk scores ≥ 6', 'Tốc độ hiện tại xong dưới 90 % cam kết, hoặc có rủi ro điểm ≥ 6'), t('Read the risks; no action needed yet', 'Đọc phần rủi ro; chưa cần làm gì')],
    ['🟢 ' + t('GREEN', 'XANH'), t('Neither of the above', 'Không thuộc hai loại trên'), t('Skim', 'Đọc lướt')],
  ])}

<h3>${t('A risk log in five columns', 'Sổ rủi ro trong năm cột')}</h3>
<p>${t(
    'A risk is something that has not happened yet. Score it: likelihood 1–3 × impact 1–3. Write the mitigation and one owner. Close it with a date when it is gone. Issues that already happened (an incident) can sit in the same log with their fix, so the supervisor sees one list.',
    'Rủi ro là điều chưa xảy ra. Chấm điểm: xác suất 1–3 × tác động 1–3. Ghi biện pháp và một người chủ. Đóng nó kèm ngày khi nó không còn. Vấn đề đã xảy ra (một sự cố) có thể nằm chung sổ kèm cách đã sửa, để giảng viên thấy một danh sách duy nhất.')}</p>
${out(MA.ruiRo)}

<h3>${t('Lab: generate the report from git and the board', 'Lab: sinh báo cáo từ git và bảng')}</h3>
<p>${t(
    'First, a real git repository is built from the sprint’s event log: every commit event becomes a commit with the right author, time and number of lines; every merge becomes a commit by the person who pressed merge.',
    'Trước hết, một repo git thật được dựng từ nhật ký sự kiện của sprint: mỗi sự kiện commit thành một commit đúng tác giả, đúng giờ, đúng số dòng; mỗi merge thành một commit của người bấm merge.')}</p>
${giai(t('tao-repo.mjs', 'tao-repo.mjs'), js(MA.taoRepo))}
${out('$ node tao-repo.mjs /tmp/agt-lab6/labflow\n' + RA.taoRepo)}
<p>${t('The report generator reads git for "who committed what, on how many days", the board for "what is done and what is next", the event log for reviews, absences and incidents, and the risk log for the rest:', 'Script sinh báo cáo đọc git cho "ai commit gì, trong bao nhiêu ngày", đọc bảng cho "cái gì xong, cái gì tiếp", đọc nhật ký cho review, ngày vắng và sự cố, và sổ rủi ro cho phần còn lại:')}</p>
${js(MA.baoCaoTuan)}
${cl('info', `<p>${t(
    'Two details that bit earlier chapters. <code>git log --since=2027-02-22</code> with a bare date means "that date at the current time of day", so a morning merge disappears — always pass a full timestamp with time zone (lesson 5.4). And merges are excluded from "commits per person": pressing the merge button is not writing code.',
    'Hai chi tiết đã cắn ở các chương trước. <code>git log --since=2027-02-22</code> với ngày trần nghĩa là "ngày đó vào giờ hiện tại", nên merge buổi sáng biến mất — luôn đưa mốc đầy đủ kèm múi giờ (bài 5.4). Và commit merge bị loại khỏi "commit theo người": bấm nút merge không phải viết mã.')}</p>`)}

<h4>${t('Week 1 (15–19/02): too early for a forecast', 'Tuần 1 (15–19/02): còn quá sớm để dự báo')}</h4>
${out('$ node bao-cao-tuan.mjs 2027-02-15 /tmp/agt-lab6/labflow\n' + RA.baoCao0215)}
<p>${t(
    'Before the middle of a sprint the 8-point screens have not landed yet, so any forecast is noise; the colour comes from risks only. Note what is <em>not</em> in "Needs the supervisor": the scope problem (R-01). It was sent to the supervisor on planning night, 15/02, and answered on 17/02 — the weekly report only records that it is closed. <strong>The weekly report is never the first time the supervisor hears bad news.</strong>',
    'Trước giữa sprint, các màn 8 điểm chưa về, nên mọi dự báo chỉ là nhiễu; màu chỉ dựa vào rủi ro. Để ý điều <em>không</em> có trong "Cần giảng viên": vấn đề phạm vi (R-01). Nó đã được gửi giảng viên ngay tối planning 15/02, được trả lời 17/02 — báo cáo tuần chỉ ghi lại rằng nó đã đóng. <strong>Báo cáo tuần không bao giờ là lần đầu giảng viên nghe tin xấu.</strong>')}</p>

<h4>${t('Week 2 (22–26/02): the hard week', 'Tuần 2 (22–26/02): tuần khó')}</h4>
${out('$ node bao-cao-tuan.mjs 2027-02-22 /tmp/agt-lab6/labflow\n' + RA.baoCao0222)}
<p>${t(
    'Everything a supervisor needs is in the first screen: yellow, with a range (24–35 of 43 committed points — the low end assumes the current pace continues, the high end assumes every started card finishes), the staging incident of 24/02 with times (promised in ', 'Mọi thứ giảng viên cần nằm ngay màn hình đầu: vàng, kèm một khoảng (24–35 trên 43 điểm cam kết — đầu thấp giả sử giữ tốc độ hiện tại, đầu cao giả sử mọi thẻ đã bắt đầu đều xong), sự cố staging 24/02 có giờ cụ thể (đã hứa ở ') + ag('agl-5-4-postmortem', t('lesson 5.4', 'bài 5.4')) + t(
    '), and the open risk about S24 with what the team has already done and the next checkpoint. The table shows C2 absent two days for exams — written as a fact, so nobody reads "1 commit" as laziness.',
    '), và rủi ro đang mở về S24 kèm những gì nhóm đã làm và mốc kiểm kế tiếp. Bảng ghi C2 vắng hai ngày vì thi — viết như một sự việc, để không ai đọc "1 commit" thành lười.')}</p>

<h4>${t('Week 3 (01–05/03): the end-of-sprint report', 'Tuần 3 (01–05/03): báo cáo cuối sprint')}</h4>
${out('$ node bao-cao-tuan.mjs 2027-03-01 /tmp/agt-lab6/labflow\n' + RA.baoCao0301)}
<p>${t(
    'The final number is 35 of 43 committed points (81 %) plus 6 stretch points — inside the range forecast a week earlier. The leader’s own row shows 0 commits and 2 reviews in week 3. That is honest too: a leader’s week is often reviews and unblocking, and the report should not hide it.',
    'Con số cuối là 35 trên 43 điểm cam kết (81 %) cộng 6 điểm dự phòng — nằm trong khoảng đã dự báo một tuần trước. Dòng của chính trưởng nhóm ghi 0 commit và 2 review ở tuần 3. Như vậy cũng là trung thực: tuần của trưởng nhóm thường là review và gỡ chặn, và báo cáo không nên giấu điều đó.')}</p>

<h3>${t('Lab: check before you send', 'Lab: soát trước khi gửi')}</h3>
<p>${t('Here is the report a tired leader writes at midnight, from memory:', 'Đây là bản báo cáo một trưởng nhóm mệt mỏi viết lúc nửa đêm, theo trí nhớ:')}</p>
${out(MA.baoCaoVoi)}
${js(MA.soatBaoCao)}
${out('$ node soat-bao-cao.mjs du-lieu/bao-cao-voi.md; for w in 0215 0222 0301; do node soat-bao-cao.mjs out-bao-cao-$w.txt; done\n' + RA.soatBaoCao)}
<p>${t(
    'Eleven problems in eight lines, and the worst two are not about grammar. "C5 is a bit lazy" is a judgement the supervisor cannot verify and C5 cannot answer; it also tells the supervisor more about the leader than about C5. "A small bug on staging" was an outage of almost twelve hours on the day of a review. The first run of the checker had its own lesson: it flagged the generated reports’ colour-rule line ("under 70 % … in progress") as vague — rules are blunt, so the checker now skips the legend, and a human still reads the result:',
    'Mười một lỗi trong tám dòng, và hai lỗi nặng nhất không phải ngữ pháp. "C5 hơi lười" là một phán xét mà giảng viên không kiểm được và C5 không trả lời được; nó còn nói về trưởng nhóm nhiều hơn là về C5. "Một lỗi nhỏ trên staging" là gần mười hai giờ hỏng vào đúng ngày review. Lần chạy đầu của bộ soát cũng có bài học riêng: nó bắt nhầm dòng luật màu của chính báo cáo sinh tự động ("dưới 70 % … đang làm") là mơ hồ — luật thì thô, nên bộ soát giờ bỏ qua dòng chú thích, và người vẫn đọc lại kết quả:')}</p>
${out(RA.soatLanDau)}

<h3>${t('Writing about a teammate in a report', 'Viết về một thành viên trong báo cáo')}</h3>
${bang([t('Instead of', 'Thay vì'), t('Write', 'Viết')], [
    [t('"C5 is lazy / irresponsible."', '"C5 lười / vô trách nhiệm."'), t('"LF-25 (S24, C5): no commit from 16/02 to 25/02 (7 working days)."', '"LF-25 (S24, C5): không có commit từ 16/02 tới 25/02 (7 ngày làm việc)."')],
    [t('"I reminded them many times."', '"Em đã nhắc nhiều lần."'), t('"1:1 on 23/02; paired 1 hour on 25/02; checkpoint: PR for the cancel part on 03/03."', '"1:1 ngày 23/02; ngồi cùng 1 giờ ngày 25/02; mốc kiểm: PR phần huỷ ngày 03/03."')],
    [t('A personal reason the teammate told you in private', 'Lý do cá nhân bạn nghe riêng'), t('Only with their agreement — and say that they agreed.', 'Chỉ khi họ đồng ý — và ghi rõ là họ đã đồng ý.')],
    [t('Surprising the teammate with the report', 'Để thành viên bất ngờ khi đọc báo cáo'), t('Tell them before you send. They should never learn it from the supervisor.', 'Nói với họ trước khi gửi. Họ không bao giờ nên biết điều đó từ giảng viên.')],
  ])}
<p>${t('When and how to escalate a teammate to the supervisor is the subject of ', 'Khi nào và làm thế nào để báo giảng viên về một thành viên là nội dung của ')}${ag('agl-6-5-thanh-vien', t('lesson 6.5', 'bài 6.5'))}.</p>

<h3>🕵️ ${t('Real case: the warning that never reached the decision', 'Sự cố thật: lời cảnh báo không tới được người quyết định')}</h3>
<p>${t(
    'On 28 January 1986 the Space Shuttle Challenger broke apart 73 seconds after launch; seven crew died. The presidential commission (the Rogers Commission, report of June 1986) found the physical cause in the O-ring seals of a booster, made brittle by the cold. It also found that the night before launch, the contractor’s engineers had recommended not launching below 53 °F; their management overruled them after an offline caucus, and the concerns "were not communicated beyond" the lower-level review. The report speaks of "failures in communication" and of a structure "that permitted internal flight safety problems to bypass key Shuttle managers" (',
    'Ngày 28/01/1986 tàu con thoi Challenger vỡ tung 73 giây sau khi phóng; bảy phi hành gia thiệt mạng. Uỷ ban điều tra của Tổng thống (Uỷ ban Rogers, báo cáo tháng 6/1986) tìm ra nguyên nhân vật lý ở vòng đệm O-ring của tên lửa đẩy, bị giòn đi vì lạnh. Uỷ ban cũng tìm ra rằng đêm trước khi phóng, kỹ sư của nhà thầu đã khuyến nghị không phóng dưới 53 °F; ban lãnh đạo của họ bác bỏ sau một cuộc bàn riêng, và mối lo ngại "không được truyền lên quá" cấp rà soát thấp hơn. Báo cáo nói về "những thất bại trong giao tiếp" và về một cơ cấu "cho phép các vấn đề an toàn bay nội bộ đi vòng qua những người quản lý chủ chốt" (') + ng('https://en.wikipedia.org/wiki/Rogers_Commission_Report', 'Rogers Commission Report') + t(
    '). A student project is not a space shuttle, but the mechanism is identical at every scale: the person who knows is not the person who decides, and the report in between turns red into green.',
    '). Đồ án sinh viên không phải tàu con thoi, nhưng cơ chế giống hệt nhau ở mọi quy mô: người biết không phải người quyết, và bản báo cáo ở giữa biến đỏ thành xanh.')}</p>

<h3>${t('At work: status reports at a company', 'Khi đi làm: báo cáo trạng thái ở công ty')}</h3>
<p>${t(
    'At FPT Software you will write a daily report to your leader and, later, contribute to the weekly report the PM sends to the client (', 'Ở FPT Software bạn sẽ viết báo cáo ngày cho leader và, sau đó, góp phần vào báo cáo tuần PM gửi khách (') + ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7')) + t(
    '). The same rules hold: a status with a definition, numbers with a base, risks with an owner and a date, bad news on top and early. Many PMs use exactly this RAG convention; ask on day one what "yellow" means on your project.',
    '). Cùng những luật đó: trạng thái có định nghĩa, con số có mẫu số, rủi ro có chủ và hạn, tin xấu ở đầu và báo sớm. Nhiều PM dùng đúng quy ước xanh/vàng/đỏ này; hỏi ngay ngày đầu "vàng" nghĩa là gì ở dự án của bạn.')}</p>

<h3>🧪 ${t('Practice (20 minutes)', 'Thực hành (20 phút)')}</h3>
<p>${t(
    'Rewrite the midnight report for week 2 by hand — without running the generator — using only the data shown in this lesson. Then run soat-bao-cao.mjs on it until it passes, and compare with the generated version.',
    'Viết lại bản báo cáo nửa đêm cho tuần 2 bằng tay — không chạy script sinh — chỉ dùng dữ liệu có trong bài này. Rồi chạy soat-bao-cao.mjs cho tới khi đạt, và so với bản sinh tự động.')}</p>
${giai(t('What to compare', 'So những gì'), `<p>${t(
    'The generated week-2 report above passes all 8 rules. Check your version for: the colour and its rule on line 2; the incident with times and what changed (LF-70); S24 written as dates and commits, with the actions taken and the checkpoint; C2’s exam days written as absences; every finished screen with its ticket and PR number. If your report needed more than 15 minutes, that is the argument for generating it.',
    'Báo cáo tuần 2 sinh tự động ở trên đạt cả 8 luật. Soát bản của bạn: màu và luật màu ở dòng 2; sự cố có giờ và điều đã thay đổi (LF-70); S24 viết bằng ngày và commit, kèm việc đã làm và mốc kiểm; ngày thi của C2 ghi là vắng; mỗi màn xong có mã ticket và số PR. Nếu bản của bạn tốn hơn 15 phút, đó chính là lý do nên sinh nó tự động.')}</p>`)}

${phongVan([
    [t('"How did you report progress to your supervisor?"', '"Bạn báo cáo tiến độ cho giảng viên thế nào?"'), t('A one-screen weekly report generated from git and the board: a colour with a written rule, a forecast range, what was merged with PR numbers, per-person activity, and a risk log with owners. Anything needing a decision went out the same day, not in the weekly report.', 'Một báo cáo tuần một màn hình sinh từ git và bảng: một màu kèm luật viết ra, một khoảng dự báo, những gì đã merge kèm số PR, hoạt động từng người, và sổ rủi ro có chủ. Việc gì cần quyết định thì gửi ngay trong ngày, không đợi báo cáo tuần.')],
    [t('"Tell me about a time you delivered bad news."', '"Kể một lần bạn phải báo tin xấu."'), t('At planning our capacity was 43 points and the iteration needed 59. I messaged the supervisor that night with the numbers and a proposal to move two screens; they agreed two days later. Delivering it in week 1 gave everyone options; in week 3 there would have been none.', 'Ở planning năng lực nhóm là 43 điểm còn iteration cần 59. Tôi nhắn giảng viên ngay tối đó kèm con số và đề xuất chuyển hai màn; hai ngày sau được đồng ý. Báo ở tuần 1 cho mọi người lựa chọn; ở tuần 3 thì không còn gì.')],
    [t('"What is a watermelon status?"', '"Trạng thái dưa hấu là gì?"'), t('Green on the outside, red inside — reports that stay green until the project fails. The fix is a written colour rule so the colour is computed from the data, plus risks with owners.', 'Ngoài xanh trong đỏ — báo cáo cứ xanh cho tới khi dự án hỏng. Cách sửa là một luật màu viết ra để màu được tính từ dữ liệu, cộng với rủi ro có chủ.')],
    [t('"How do you report a teammate who is not contributing?"', '"Bạn báo về một thành viên không đóng góp thế nào?"'), t('Facts with dates, what the team already did, the agreed checkpoint, and a proposal — never adjectives. The teammate hears it from me before the supervisor reads it.', 'Sự việc có ngày, những gì nhóm đã làm, mốc kiểm đã thống nhất, và một đề xuất — không bao giờ dùng tính từ. Thành viên đó nghe từ tôi trước khi giảng viên đọc.')],
  ], en)}

${thuatNgu([
    ['RAG status', t('Red / Amber / Green project status; useful only with a written rule.', 'Trạng thái Đỏ / Vàng / Xanh; chỉ có ích khi có luật viết ra.')],
    [t('watermelon report', 'báo cáo dưa hấu'), t('Green outside, red inside.', 'Ngoài xanh, trong đỏ.')],
    [t('risk log', 'sổ rủi ro'), t('List of risks with likelihood × impact, mitigation, owner, open/close dates.', 'Danh sách rủi ro có xác suất × tác động, biện pháp, chủ, ngày mở/đóng.')],
    [t('forecast range', 'khoảng dự báo'), t('Low end = current pace; high end = all started work finishes.', 'Đầu thấp = giữ tốc độ hiện tại; đầu cao = mọi việc đã bắt đầu đều xong.')],
    [t('escalation', 'báo lên (escalation)'), t('Raising an issue to someone who can decide, with facts and a proposal.', 'Đưa vấn đề lên người có quyền quyết định, kèm sự việc và đề xuất.')],
  ], en)}

${tomTat([
    t('The supervisor knows the project through your reports; write them so the colour is computed by a rule, not chosen.', 'Giảng viên biết dự án qua báo cáo của bạn; viết sao cho màu được tính bằng luật, không phải được chọn.'),
    t('Generate from git + board + risk log: what merged (with PR), per-person activity (absences as facts), risks with owners, incidents with times.', 'Sinh từ git + bảng + sổ rủi ro: cái gì đã merge (kèm PR), hoạt động từng người (vắng ghi là sự việc), rủi ro có chủ, sự cố có giờ.'),
    t('Decisions and bad news go out the same day; the weekly report records them.', 'Việc cần quyết định và tin xấu được gửi trong ngày; báo cáo tuần chỉ ghi lại.'),
    t('Check before sending: no adjectives about people, no percentages without a base, no "small" incidents.', 'Soát trước khi gửi: không tính từ về con người, không phần trăm thiếu mẫu số, không sự cố "nhỏ".'),
    t('Challenger 1986: the people who knew were not the people who decided — reports are where that gap opens or closes.', 'Challenger 1986: người biết không phải người quyết — báo cáo là nơi khoảng cách đó mở ra hoặc khép lại.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-6-4-tu-xa', t('6.4 — Remote and async communication', '6.4 — Giao tiếp từ xa và bất đồng bộ'))}.</p>
`);
};

export default {
  title: '6.3 — Reporting progress and risk|||6.3 — Báo cáo tiến độ và rủi ro',
  slug: 'agl-6-3-bao-cao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Báo cáo tuần cho giảng viên: luật màu xanh/vàng/đỏ viết ra (chống báo cáo "dưa hấu"), khoảng dự báo, sổ rủi ro xác suất × tác động có chủ; lab chạy thật: dựng repo git từ nhật ký sprint 2 LabFlow, bao-cao-tuan.mjs sinh báo cáo 3 tuần (tuần 2 VÀNG 24–35/43, sự cố staging 24/02, rủi ro S24), soat-bao-cao.mjs: bản viết vội 11 lỗi ("C5 hơi lười", "lỗi nhỏ"), bản sinh đạt 8/8; viết về thành viên bằng sự việc; Challenger 1986 (Uỷ ban Rogers): cảnh báo không tới người quyết.',
  content: L63(true) + L63(false),
};
