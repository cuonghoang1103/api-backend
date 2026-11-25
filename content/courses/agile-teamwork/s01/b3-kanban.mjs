/**
 * 1.3 — Kanban và dòng chảy công việc (agl-1-3-kanban). Soạn 24/11/2026, agent agt.
 * Lab: scratchpad/agt/lab/ch1/kanban-wip.mjs (mô phỏng có hạt giống cố định) + chu-ky.mjs (đo từ CSV) chạy THẬT — qua ./_ma.mjs.
 * Ranh giới: người bí mà im lặng ⇒ 0.9; standup soi thẻ lâu ⇒ 6.1; review PR ⇒ ch4.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L13 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 1 · Lesson 1.3', 'Chương 1 · Bài 1.3', `
<h2>${t('1.3 — Kanban and flow', '1.3 — Kanban và dòng chảy công việc')}</h2>
<p class="lead">${t(
    'Scrum asks "what will we finish this sprint?". Kanban asks a different question: "how does work flow through the team, and where does it get stuck?". Its main tool is almost embarrassingly simple — <strong>limit how many things are in progress at once</strong> — and its effect is counter-intuitive enough that you need to see it in numbers. In this lesson you run a simulation of your own five-person team, see why "everyone starts something new while waiting for the leader to review" makes everything slower, and learn the three numbers (WIP, cycle time, throughput) and the one law (Little’s) that let a leader see trouble before the review.',
    'Scrum hỏi "sprint này làm xong được gì?". Kanban hỏi câu khác: "công việc chảy qua đội thế nào, và tắc ở đâu?". Công cụ chính của nó đơn giản tới mức ngại nói ra — <strong>giới hạn số việc đang làm cùng lúc</strong> — còn tác dụng của nó thì trái trực giác tới mức phải thấy bằng con số mới tin. Bài này chạy mô phỏng chính nhóm năm người của bạn, cho thấy vì sao "ai cũng mở việc mới trong lúc chờ trưởng nhóm review" làm mọi thứ chậm đi, và dạy ba con số (WIP, cycle time, throughput) cùng một định luật (Little) giúp trưởng nhóm thấy rắc rối trước buổi review.')}</p>

<h3>${t('Everyday picture: the motorway at rush hour', 'Liên tưởng đời thường: đường cao tốc giờ cao điểm')}</h3>
<p>${t(
    'At 5 p.m. more cars enter the road, and fewer cars per minute come out the other end — every car is slower and the road carries less. Some cities put traffic lights on the entry ramps to let cars in only as fast as the road can carry them: the queue on the ramp is a little longer, the trip is much shorter. A pho shop does the same when it stops seating new customers while the kitchen is full. A WIP limit is that ramp light for your team’s work.',
    'Năm giờ chiều, nhiều xe vào đường hơn, mà mỗi phút số xe ra ở đầu kia lại ít đi — xe nào cũng chậm, con đường chở được ít hơn. Có thành phố đặt đèn tín hiệu ở lối nhập cao tốc, chỉ cho xe vào nhanh bằng tốc độ đường thoát được: hàng chờ ở lối nhập dài thêm chút, còn chuyến đi ngắn đi nhiều. Quán phở cũng vậy khi ngừng xếp khách mới vào bàn lúc bếp đã đầy order. Giới hạn WIP là cái đèn ở lối nhập đó cho công việc của nhóm bạn.')}</p>

<h3>${t('Where it came from', 'Từ đâu ra')}</h3>
<p>${t(
    '<em>Kanban</em> (看板) means "signboard" in Japanese. In the Toyota Production System developed by Taiichi Ohno from the late 1940s, a card travels with a box of parts; a station may only produce more when it receives a card back — production is <em>pulled</em> by demand instead of <em>pushed</em> by a plan, and the number of cards caps the inventory. In the 2000s David J. Anderson applied the idea to software teams (his book <em>Kanban</em>, 2010): the cards became tickets, the stations became board columns, and the card cap became the WIP limit. A short modern definition is ',
    '<em>Kanban</em> (看板) trong tiếng Nhật nghĩa là "bảng hiệu". Trong Hệ thống sản xuất Toyota do Taiichi Ohno phát triển từ cuối thập niên 1940, một tấm thẻ đi cùng một hộp linh kiện; một công đoạn chỉ được làm thêm khi nhận lại thẻ — sản xuất được <em>kéo</em> theo nhu cầu thay vì bị <em>đẩy</em> theo kế hoạch, và số thẻ giới hạn lượng hàng tồn. Thập niên 2000, David J. Anderson áp ý tưởng này vào đội phần mềm (sách <em>Kanban</em>, 2010): thẻ thành ticket, công đoạn thành cột trên bảng, số thẻ thành giới hạn WIP. Định nghĩa ngắn gọn hiện nay ở ')}${ng('https://kanbanguides.org/', 'The Kanban Guide (kanbanguides.org)')}.</p>

<h3>${t('The board for LabFlow — columns with policies', 'Bảng cho LabFlow — cột có luật')}</h3>
<p>${t('A column is not just a label; it is a promise about what is true of every card in it. Write the policy on the board.', 'Một cột không chỉ là cái nhãn; nó là lời hứa về điều đúng với mọi thẻ nằm trong cột. Hãy ghi luật lên bảng.')}</p>
${bang([t('Column', 'Cột'), t('WIP limit', 'Giới hạn WIP'), t('A card may enter when…', 'Thẻ được vào khi…'), t('A card may leave when…', 'Thẻ được rời khi…')], [
    ['To do', '—', t('It has acceptance criteria and an estimate (chapter 2).', 'Có tiêu chí chấp nhận và ước lượng (chương 2).'), t('Someone pulls it — never assigned while they still have an open card.', 'Có người tự kéo — không bị giao khi người đó còn thẻ đang mở.')],
    ['In progress', t('5 (1 per person)', '5 (1 thẻ/người)'), t('A branch <code>feature/LF-xx-…</code> exists.', 'Đã có nhánh <code>feature/LF-xx-…</code>.'), t('A PR is open with the template filled and CI green.', 'Đã mở PR, điền đủ mẫu, CI xanh.')],
    ['In review', '3', t('The PR is open.', 'PR đã mở.'), t('Approved by one member who is not the author.', 'Được một thành viên không phải tác giả duyệt.')],
    [t('Testing (demo server)', 'Testing (máy demo)'), '3', t('Merged and deployed to the demo server.', 'Đã merge và deploy lên máy demo.'), t('Acceptance criteria checked by someone other than the author.', 'Một người khác tác giả soát đạt tiêu chí chấp nhận.')],
    ['Done', '—', t('Every line of the Definition of Done is true (lesson 1.2).', 'Mọi dòng của Definition of Done đều đúng (bài 1.2).'), '—'],
  ])}
${cl('ok', `<p><strong>${t('The rule that makes WIP limits work', 'Luật làm cho giới hạn WIP có tác dụng')}</strong>: ${t('when a column is full, you may not pull new work into it. Instead you help finish what is in front of it — usually by reviewing or testing someone else’s card. "Stop starting, start finishing."', 'khi một cột đã đầy, không ai được kéo việc mới vào. Thay vào đó bạn giúp làm xong thứ đang đứng trước nó — thường là review hoặc test thẻ của người khác. "Ngừng bắt đầu, hãy làm cho xong."')}</p>`)}

<h3>${t('Three numbers and one law', 'Ba con số và một định luật')}</h3>
${bang([t('Metric', 'Chỉ số'), t('Definition', 'Định nghĩa'), t('How the leader reads it', 'Trưởng nhóm đọc thế nào')], [
    ['<strong>WIP</strong> (work in progress)', t('Cards started but not Done, right now.', 'Số thẻ đã bắt đầu mà chưa Done, ngay lúc này.'), t('More WIP than people = people are switching or waiting.', 'WIP nhiều hơn số người = có người đang nhảy việc hoặc đang chờ.')],
    ['<strong>Cycle time</strong>', t('Time from "In progress" to "Done" for one card.', 'Thời gian từ lúc vào "In progress" tới lúc "Done" của một thẻ.'), t('Use the 85th percentile as a promise: "85% of our cards finish within 6 working days".', 'Dùng phân vị 85 làm lời hứa: "85% thẻ của nhóm xong trong ≤ 6 ngày làm việc".')],
    ['<strong>Throughput</strong>', t('Cards finished per day or week.', 'Số thẻ xong mỗi ngày hoặc mỗi tuần.'), t('The team’s real capacity — more honest than any estimate.', 'Năng lực thật của nhóm — trung thực hơn mọi ước lượng.')],
    ['<strong>Work item age</strong>', t('How long a card that is still open has been open.', 'Một thẻ còn mở đã mở được bao lâu.'), t('The card with the highest age is the first question at the daily: that is where the silent blocker hides.', 'Thẻ có tuổi cao nhất là câu hỏi đầu tiên ở daily: người bí mà im lặng nấp ở đó.')],
  ])}
<p>${t(
    '<strong>Little’s Law</strong> (John Little, 1961) ties them together for a stable system: <strong>average WIP = average throughput × average cycle time</strong>. Rearranged: cycle time = WIP ÷ throughput. If your team finishes about 1 card per day and has 10 cards open, a new card will take about 10 days. You cannot make the team type faster tomorrow, but you can lower WIP today — and cycle time drops with it. The law holds for averages over a period in which work enters about as fast as it leaves; when WIP keeps growing (the system is not stable) the formula and the measured numbers drift apart — you will see exactly that below.',
    '<strong>Định luật Little</strong> (John Little, 1961) nối ba số đó với nhau cho một hệ ổn định: <strong>WIP trung bình = throughput trung bình × cycle time trung bình</strong>. Đổi vế: cycle time = WIP ÷ throughput. Nếu nhóm xong khoảng 1 thẻ mỗi ngày và đang mở 10 thẻ, một thẻ mới sẽ mất khoảng 10 ngày. Bạn không làm được cả nhóm gõ nhanh hơn từ ngày mai, nhưng hạ WIP được ngay hôm nay — và cycle time giảm theo. Định luật đúng với giá trị trung bình trong một khoảng mà việc vào nhanh xấp xỉ việc ra; khi WIP cứ tăng mãi (hệ không ổn định) thì công thức và số đo lệch nhau — bạn sẽ thấy đúng điều đó ngay dưới đây.')}</p>

<h3>${t('Lab: simulate your team under three pulling rules', 'Lab: mô phỏng nhóm bạn với ba luật kéo việc')}</h3>
<p>${t(
    'Five members, four weeks (40 half-days), the same backlog of 60 cards with the same sizes (2–6 half-days of coding), the same reviews that send 30% of cards back for a half-day fix. A review takes half a day and nobody reviews their own card. Only the pulling rule changes. The random numbers come from a fixed seed, so you get exactly the numbers shown. They are assumptions for seeing the queue mechanism, not data from a real team.',
    'Năm thành viên, bốn tuần (40 buổi), cùng một backlog 60 thẻ với cùng kích cỡ (2–6 buổi code), cùng những lần review trả về 30% thẻ để sửa nửa buổi. Một lần review mất một buổi và không ai review thẻ của chính mình. Chỉ luật kéo việc thay đổi. Số ngẫu nhiên lấy từ hạt giống cố định, nên bạn chạy sẽ ra đúng các số dưới đây. Đó là giả định để thấy cơ chế hàng đợi, không phải số đo của một đội thật.')}</p>
${js(MA.kanbanWip)}
<p>${t('Real output (Node 22.22.2):', 'Output thật (Node 22.22.2):')}</p>
${out('$ node kanban-wip.mjs\n' + RA.kanbanWip)}
<p>${t('What each row tells you:', 'Mỗi dòng nói gì:')}</p>
<ul>
<li>${t('<strong>A</strong> — the usual student team. Nobody is ever idle (0 idle half-days) and it <em>feels</em> productive. But the leader is the only reviewer, so 18 PRs pile up waiting, 23 cards are half-finished at the end of week 4, and an average card takes 5.6 days. Little’s formula gives 7.5 but the measured WIP is 13.7: work enters faster than it leaves — the system is not stable, it is filling up.', '<strong>A</strong> — nhóm sinh viên thường gặp. Không ai rảnh lúc nào (0 buổi rảnh) và <em>cảm giác</em> rất năng suất. Nhưng chỉ trưởng nhóm review, nên 18 PR xếp hàng chờ, cuối tuần 4 còn 23 thẻ làm dở, trung bình một thẻ mất 5,6 ngày. Công thức Little cho 7,5 mà WIP đo được là 13,7: việc vào nhanh hơn việc ra — hệ không ổn định, nó đang đầy dần.')}</li>
<li>${t('<strong>B</strong> — add a WIP limit only. Throughput is <em>exactly the same</em> (27 cards, 1.35/day — the leader’s reviewing is the ceiling) but cycle time falls from 5.6 to 3.3 days and only 5 cards are half-done instead of 23. The price: 55 idle half-days. That idleness is not waste; it is the board shouting "the bottleneck is review".', '<strong>B</strong> — chỉ thêm giới hạn WIP. Throughput <em>y hệt</em> (27 thẻ, 1,35/ngày — sức review của trưởng nhóm là trần) nhưng cycle time giảm từ 5,6 xuống 3,3 ngày và chỉ còn 5 thẻ dở thay vì 23. Cái giá: 55 buổi rảnh. Sự rảnh đó không phải lãng phí; đó là bảng đang hét lên "chỗ tắc là review".')}</li>
<li>${t('<strong>C</strong> — WIP limit <em>and</em> anyone free reviews. Now the idle time goes into reviews: 38 cards done (+40%), cycle time 2.6 days, p85 3.5 days. Nobody typed faster. The team stopped starting and started finishing.', '<strong>C</strong> — giới hạn WIP <em>và</em> ai rảnh cũng review. Giờ thời gian rảnh chảy vào review: 38 thẻ xong (+40%), cycle time 2,6 ngày, p85 3,5 ngày. Không ai gõ nhanh hơn. Cả nhóm ngừng bắt đầu và bắt đầu làm cho xong.')}</li>
</ul>
${cl('warn', `<p>${t('For a leader the lesson is personal: <strong>if you are the only reviewer, you are the bottleneck</strong>, no matter how late you stay up. Spread review from week 1 (pairs review each other; you review the risky parts) — chapter 4 shows how to make that work without losing quality.', 'Với trưởng nhóm, bài học này rất riêng: <strong>nếu bạn là người review duy nhất, bạn là chỗ tắc</strong>, thức khuya tới đâu cũng vậy. Chia việc review ngay từ tuần 1 (từng cặp review cho nhau; bạn review phần rủi ro) — chương 4 chỉ cách làm vậy mà không giảm chất lượng.')}</p>`)}

<h3>${t('Measuring your real team from the board', 'Đo nhóm thật của bạn từ bảng công việc')}</h3>
<p>${t('You do not need a paid tool. Every card on CT Work or Jira has the date it moved to In progress and the date it became Done; copy them into a CSV with columns <code>ma,ten,diem,them,xong,batdau</code> (code, title, points, date added mid-sprint, done date, start date). The practice below asks you to write the script that turns it into cycle time and throughput; a CSV of sprint 2 of a LabFlow team is provided:', 'Không cần công cụ trả phí. Mỗi thẻ trên CT Work hay Jira đều có ngày vào In progress và ngày thành Done; chép vào một CSV có các cột <code>ma,ten,diem,them,xong,batdau</code> (mã, tên, điểm, ngày thêm giữa sprint, ngày xong, ngày bắt đầu). Phần thực hành yêu cầu bạn viết script biến nó thành cycle time và throughput; đây là CSV sprint 2 của một nhóm LabFlow:')}</p>
${out(MA.csvA)}
${note(t('A <strong>cumulative flow diagram</strong> (CFD) is the picture of the same data: one coloured band per column, stacked over time. A band that keeps getting wider is a column where work piles up — in rule A above, the "In review" band would swell every day. Jira draws it for you; for CT Work, the CSV plus a spreadsheet chart is enough.', '<strong>Biểu đồ dòng tích luỹ</strong> (CFD) là hình vẽ của cùng dữ liệu đó: mỗi cột một dải màu, chồng lên nhau theo thời gian. Dải nào cứ phình ra là cột đang dồn việc — với luật A ở trên, dải "In review" sẽ phình ra mỗi ngày. Jira vẽ sẵn; với CT Work, CSV cộng một biểu đồ bảng tính là đủ.'))}

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'Kanban is the default for work that arrives unpredictably: maintenance and support projects, bug queues with a service-level agreement ("severity 1 answered within 4 hours"), operations teams. Many outsourcing contracts after go-live are exactly that — a maintenance team on a Kanban board, measured by cycle time per severity. When a manager asks "when will this bug be fixed?", "our p85 for severity-2 bugs is 3 days" is an answer based on data; "soon" is not.',
    'Kanban là lựa chọn mặc định cho việc đến không đoán trước: dự án bảo trì, hỗ trợ, hàng đợi lỗi có cam kết dịch vụ ("lỗi mức 1 phản hồi trong 4 giờ"), đội vận hành. Nhiều hợp đồng outsourcing sau khi hệ thống lên chạy thật chính là vậy — một đội bảo trì trên bảng Kanban, được đo bằng cycle time theo mức độ lỗi. Khi quản lý hỏi "bao giờ sửa xong lỗi này?", câu "p85 của lỗi mức 2 bên em là 3 ngày" là câu trả lời dựa trên dữ liệu; "sớm thôi ạ" thì không.')}</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
<li>${t('Add a rule D: WIP 2 per person, anyone reviews. Predict first: better or worse than C? Run <code>node kanban-wip.mjs D</code>.', 'Thêm luật D: WIP 2 thẻ/người, ai cũng review. Đoán trước: tốt hơn hay kém hơn C? Chạy <code>node kanban-wip.mjs D</code>.')}</li>
<li>${t('Write <code>chu-ky.mjs</code>: read the CSV above, count working days (Mon–Fri, skipping the Tết break 2027-02-01 → 2027-02-14, counting both the start and the done day), print each card’s cycle time, the average, the 85th percentile and the throughput, then check Little’s Law.', 'Viết <code>chu-ky.mjs</code>: đọc CSV ở trên, đếm ngày làm việc (T2–T6, bỏ kỳ nghỉ Tết 2027-02-01 → 2027-02-14, tính cả ngày bắt đầu và ngày xong), in cycle time từng thẻ, trung bình, phân vị 85 và throughput, rồi soát định luật Little.')}</li>
<li>${t('At Monday’s daily the board shows: C2 has LF-23 in progress for 6 days, C4 has two cards in progress, the review column holds 3 PRs. What do you ask, in which order?', 'Ở daily thứ Hai, bảng cho thấy: C2 giữ LF-23 ở In progress 6 ngày, C4 có hai thẻ In progress, cột review có 3 PR. Bạn hỏi gì, theo thứ tự nào?')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('1. Real output:', '1. Output thật:')}</p>
${out('$ node kanban-wip.mjs D\n' + RA.kanbanWipD)}
<p>${t('D is almost identical to C (38 done, 2.7 vs 2.6 days). Once everyone reviews before pulling new work, the second slot is rarely used — the bottleneck was review capacity, not the exact limit number. Practical consequence: start with 1 per person, and only raise it when you see people idle for a reason the team cannot fix (e.g. waiting for the lecturer’s answer).', 'D gần như y hệt C (38 thẻ, 2,7 so với 2,6 ngày). Khi ai cũng review trước khi kéo việc mới, ô thứ hai hiếm khi được dùng — chỗ tắc là sức review, không phải con số giới hạn chính xác. Hệ quả thực tế: bắt đầu với 1 thẻ/người, chỉ nâng khi thấy người rảnh vì lý do nhóm không gỡ được (vd chờ giảng viên trả lời).')}</p>
<p>${t('2. One solution:', '2. Một lời giải:')}</p>
${js(MA.chuKy)}
${out('$ node chu-ky.mjs du-lieu/sprint2-nhom-a.csv 2027-02-01 2027-02-14\n' + RA.chuKy)}
<p>${t('The two longest cards (LF-26 with photo upload, LF-28 statistics) are 5-point items — a hint for chapter 2: big cards have long, unpredictable cycle times; split them.', 'Hai thẻ lâu nhất (LF-26 có tải ảnh, LF-28 thống kê) đều là mục 5 điểm — gợi ý cho chương 2: thẻ to có cycle time dài và khó đoán; hãy chia nhỏ.')}</p>
<p>${t('3. Start from the right of the board (closest to Done): (a) "Who can take one of the three PRs in review today?" — finishing beats starting; (b) "C2, LF-23 has been open 6 days — what is in the way, who can pair with you for an hour?" — the oldest card is the likely blocker; (c) "C4, which of your two cards matters more for the Sprint Goal? Can the other go back to To do?" — restore the WIP limit. Ask about the work, not the person.', '3. Đi từ bên phải bảng (gần Done nhất): (a) "Ai nhận được một trong ba PR đang chờ review hôm nay?" — làm xong hơn bắt đầu; (b) "C2 ơi, LF-23 mở 6 ngày rồi — đang vướng gì, ai ngồi cùng bạn một tiếng được?" — thẻ già nhất thường là chỗ bí; (c) "C4, trong hai thẻ của bạn cái nào quan trọng hơn với Sprint Goal? Cái kia trả về To do được không?" — khôi phục giới hạn WIP. Hỏi về công việc, không hỏi tội người.')}</p>`)}

${phongVan([
    [t('"What is a WIP limit and why would you use one?"', '"Giới hạn WIP là gì, sao lại dùng?"'), t('A cap on cards in a column or per person. It reduces context switching and queueing, so cycle time drops (Little’s Law), and it exposes the bottleneck: when a column is full, people help downstream instead of starting new work.', 'Mức trần số thẻ trong một cột hoặc mỗi người. Nó giảm nhảy việc và xếp hàng, nên cycle time giảm (định luật Little), và làm lộ chỗ tắc: cột đầy thì mọi người giúp phía sau thay vì bắt đầu việc mới.')],
    [t('"Scrum or Kanban?"', '"Scrum hay Kanban?"'), t('Scrum fits product work with a fixed rhythm and stakeholders who review regularly; Kanban fits continuous, unpredictable flow (support, maintenance). They combine well — many Scrum teams use WIP limits and cycle time inside the sprint (lesson 1.4).', 'Scrum hợp với việc làm sản phẩm có nhịp cố định và bên liên quan review đều; Kanban hợp với dòng việc liên tục, khó đoán (hỗ trợ, bảo trì). Hai cái kết hợp tốt — nhiều đội Scrum dùng giới hạn WIP và cycle time ngay trong sprint (bài 1.4).')],
    [t('"How would you forecast when something will be done?"', '"Bạn dự báo khi nào một việc xong bằng cách nào?"'), t('From history: the team’s cycle-time percentiles ("85% within 6 days") and throughput, rather than a single guess. For a batch of items, throughput-based forecasting or Monte Carlo simulation over past throughput.', 'Từ lịch sử: phân vị cycle time của đội ("85% trong 6 ngày") và throughput, thay vì một con số đoán. Với một loạt việc thì dự báo theo throughput hoặc mô phỏng Monte Carlo trên throughput quá khứ.')],
    [t('"Your team’s cycle time doubled this month. What do you do?"', '"Cycle time của đội tăng gấp đôi tháng này. Bạn làm gì?"'), t('Look at WIP and where cards wait (CFD or column ages) before blaming effort; typical causes are a review or test bottleneck, too much WIP, or oversized items. Then change one policy and measure again.', 'Xem WIP và thẻ đang chờ ở đâu (CFD hoặc tuổi thẻ theo cột) trước khi đổ cho sự cố gắng; nguyên nhân hay gặp là tắc ở review/test, WIP quá nhiều, hoặc thẻ quá to. Rồi đổi một luật và đo lại.')],
  ], en)}

${thuatNgu([
    ['Kanban', t('Pull-based method: visualise work, limit WIP, manage and improve flow.', 'Phương pháp kéo: hiển thị công việc, giới hạn WIP, quản lý và cải thiện dòng chảy.')],
    ['WIP limit', t('Maximum cards allowed in a column or per person.', 'Số thẻ tối đa được phép trong một cột hoặc mỗi người.')],
    ['pull vs push', t('Start work when there is capacity vs when it is assigned.', 'Bắt đầu việc khi có chỗ trống vs khi bị giao.')],
    ['cycle time', t('Start-to-done time of one card.', 'Thời gian từ bắt đầu tới xong của một thẻ.')],
    ['throughput', t('Cards finished per unit of time.', 'Số thẻ xong trong một đơn vị thời gian.')],
    ['work item age', t('How long an open card has been open.', 'Một thẻ đang mở đã mở bao lâu.')],
    ['Little’s Law', t('Average WIP = throughput × cycle time (stable system).', 'WIP trung bình = throughput × cycle time (hệ ổn định).')],
    ['bottleneck', t('The step with the least capacity; it sets the pace for all.', 'Công đoạn có năng lực thấp nhất; nó quyết định nhịp của cả dòng.')],
    ['CFD', t('Cumulative flow diagram — stacked bands per column over time.', 'Biểu đồ dòng tích luỹ — các dải chồng theo cột qua thời gian.')],
    [t('p85', 'p85 (phân vị 85)'), t('Value under which 85% of observations fall.', 'Giá trị mà 85% số quan sát nằm dưới nó.')],
  ], en)}

${tomTat([
    t('Kanban: make work visible, limit WIP, manage flow, write explicit column policies.', 'Kanban: hiển thị công việc, giới hạn WIP, quản lý dòng chảy, viết rõ luật từng cột.'),
    t('More WIP does not mean more output: in the simulation, same throughput, cycle time 5.6 → 3.3 days just by limiting WIP.', 'WIP nhiều không có nghĩa là ra nhiều: trong mô phỏng, cùng throughput mà cycle time 5,6 → 3,3 ngày chỉ nhờ giới hạn WIP.'),
    t('Idle time under a WIP limit points at the bottleneck; fix it by swarming (everyone reviews) — 27 → 38 cards.', 'Thời gian rảnh khi có giới hạn WIP chỉ ra chỗ tắc; gỡ bằng cách cả nhóm xúm vào (ai cũng review) — 27 → 38 thẻ.'),
    t('Little’s Law: cycle time = WIP ÷ throughput; it only holds when the system is stable.', 'Định luật Little: cycle time = WIP ÷ throughput; chỉ đúng khi hệ ổn định.'),
    t('Promise with percentiles from your own data, not with guesses.', 'Hứa bằng phân vị từ dữ liệu của chính đội, không bằng phỏng đoán.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-1-4-chon', t('1.4 — Choosing for your team', '1.4 — Chọn cho đội của bạn'))}.</p>
`);
};

export default {
  title: '1.3 — Kanban and flow|||1.3 — Kanban và dòng chảy công việc',
  slug: 'agl-1-3-kanban',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Kanban từ Toyota tới đội phần mềm; bảng LabFlow có giới hạn WIP và luật vào/ra từng cột; WIP, cycle time, throughput, tuổi thẻ, định luật Little; mô phỏng chạy thật 5 thành viên với 3 luật kéo việc (27 → 38 thẻ, cycle time 5,6 → 2,6 ngày); đo nhóm thật từ CSV; Kanban ở dự án bảo trì.',
  content: L13(true) + L13(false),
};
