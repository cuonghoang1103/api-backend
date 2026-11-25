/**
 * 2.3 — Ước lượng: story point và planning poker (agl-2-3-uoc-luong). Soạn 24/11/2026, agent agt.
 * Lab: scratchpad/agt/lab/ch2/poker.mjs (mô hình đồ chơi, hạt giống cố định, 200 buổi) + du-bao.mjs (Monte Carlo 10 000 lần) chạy THẬT — qua ./_ma.mjs.
 * Ranh giới: man-day/WBS/ba điểm cho hợp đồng ⇒ 9.6; throughput/cycle time ⇒ 1.3; burndown ⇒ 1.5.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L23 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 2 · Lesson 2.3', 'Chương 2 · Bài 2.3', `
<h2>${t('2.3 — Estimation: story points and planning poker', '2.3 — Ước lượng: story point và planning poker')}</h2>
<p class="lead">${t(
    'Nobody estimates software accurately — not students, not seniors. Estimation is still worth doing, for three other reasons: comparing sizes so the sprint is not overfilled, <strong>surfacing what one person knows and the others do not</strong>, and making promises as ranges with a probability instead of a single date. In this lesson you simulate two ways of estimating with the same five people, and then forecast a release with real arithmetic instead of hope.',
    'Không ai ước lượng phần mềm chính xác — sinh viên không, người lâu năm cũng không. Ước lượng vẫn đáng làm, vì ba lý do khác: so sánh độ lớn để sprint không bị nhồi quá tay, <strong>lôi ra điều một người biết mà những người khác không biết</strong>, và hứa bằng khoảng kèm xác suất thay vì một ngày duy nhất. Bài này mô phỏng hai cách ước lượng với cùng năm người, rồi dự báo một bản phát hành bằng phép tính thật thay vì hy vọng.')}</p>

<h3>${t('Everyday picture: which building is taller?', 'Liên tưởng đời thường: toà nào cao hơn?')}</h3>
<p>${t(
    'Ask five friends how tall Landmark 81 is in metres and you get answers from 300 to 600. Ask them whether it is taller than Bitexco and how many times, and almost everyone says "about one and a half to two times". People are poor at absolute numbers and good at comparisons. Story points use that: you never ask "how many hours?", you ask "is this bigger or smaller than the profile screen we already finished?".',
    'Hỏi năm người bạn Landmark 81 cao bao nhiêu mét, bạn nhận câu trả lời từ 300 tới 600. Hỏi nó cao hơn Bitexco không và gấp mấy lần, gần như ai cũng nói "khoảng gấp rưỡi tới gấp đôi". Con người kém với con số tuyệt đối và giỏi so sánh. Story point dùng đúng điều đó: bạn không bao giờ hỏi "mấy giờ?", bạn hỏi "cái này to hơn hay nhỏ hơn màn hồ sơ mình đã làm xong?".')}</p>

<h3>${t('Why not hours', 'Vì sao không ước bằng giờ')}</h3>
<ul>
<li>${t('<strong>Hours depend on who</strong>: S22 is 2 days for the member who built a wizard before and 5 for the one who has not. A point size is a property of the work; hours are a property of the work and the person.', '<strong>Giờ phụ thuộc người làm</strong>: S22 là 2 ngày với người từng làm wizard, 5 ngày với người chưa làm. Điểm là thuộc tính của công việc; giờ là thuộc tính của công việc cộng người làm.')}</li>
<li>${t('<strong>The planning fallacy</strong> (Kahneman and Tversky, 1979): people predict their own tasks from the best case and ignore how long similar tasks took before. Hofstadter’s law says the same with a smile: "it always takes longer than you expect, even when you take into account Hofstadter’s law".', '<strong>Ngụy biện lập kế hoạch</strong> (Kahneman và Tversky, 1979): người ta đoán việc của chính mình theo kịch bản tốt nhất và bỏ qua những việc tương tự trước đây đã mất bao lâu. Định luật Hofstadter nói cùng ý theo kiểu đùa: "việc gì cũng lâu hơn bạn nghĩ, kể cả khi bạn đã tính tới định luật Hofstadter".')}</li>
<li>${t('<strong>Hours become a stick</strong>: once a ticket says "8 hours", taking 12 feels like failure, and people stop reporting honestly. Points measure the team, not the individual.', '<strong>Giờ dễ thành cây roi</strong>: ticket đã ghi "8 giờ" thì làm mất 12 giờ thấy như thất bại, và mọi người thôi báo cáo trung thực. Điểm đo cả đội, không đo từng người.')}</li>
</ul>
<p>${t('Story points grew out of Extreme Programming in the late 1990s. Ron Jeffries, one of its founders, later wrote that he "may have invented story points" and regrets how they are misused as productivity numbers (', 'Story point lớn lên từ Extreme Programming cuối thập niên 1990. Ron Jeffries, một trong những người sáng lập XP, về sau viết rằng ông "có thể đã phát minh ra story point" và tiếc vì chúng bị dùng sai thành con số năng suất (')}${ng('https://ronjeffries.com/articles/019-01ff/story-points/Index.html', 'Story Points Revisited, 2019')}). ${t('Keep that warning in mind for the velocity section.', 'Hãy nhớ lời cảnh báo này khi tới phần velocity.')}</p>

<h3>${t('The scale and the reference stories', 'Thang điểm và các story mốc')}</h3>
<p>${t('LabFlow uses 1, 2, 3, 5, 8, 13. The gaps grow because uncertainty grows with size — arguing 5 versus 6 is pointless, 5 versus 8 is a real question. Anything above 8 is not estimated: it is split (lesson 2.2). Before the first poker session, the team agrees three reference stories everyone has seen:', 'LabFlow dùng 1, 2, 3, 5, 8, 13. Khoảng cách tăng dần vì độ không chắc tăng theo độ lớn — cãi 5 hay 6 là vô ích, 5 hay 8 mới là câu hỏi thật. Thứ gì trên 8 thì không ước: đem đi chia nhỏ (bài 2.2). Trước buổi poker đầu tiên, nhóm chốt ba story mốc mà ai cũng đã thấy:')}</p>
${bang([t('Points', 'Điểm'), t('Reference story', 'Story mốc'), t('Why this size', 'Vì sao cỡ này')], [
    ['1', t('S05 Change password + Logout', 'S05 Đổi mật khẩu + Logout'), t('One form, one transaction, pattern known.', 'Một form, một transaction, mẫu đã quen.')],
    ['3', t('S13 Building and lab list', 'S13 Danh sách toà nhà + lab'), t('List with search, filter, paging — done once, now routine.', 'Danh sách có tìm, lọc, phân trang — làm một lần rồi, giờ thành nếp.')],
    ['8', t('LF-39 Booking wizard (before splitting)', 'LF-39 Wizard đặt lịch (trước khi cắt)'), t('Several steps, overlap rule, many unknowns — the size at which we split.', 'Nhiều bước, luật trùng giờ, nhiều ẩn số — cỡ mà nhóm phải cắt.')],
  ])}

<h3>${t('Planning poker, step by step', 'Planning poker, từng bước')}</h3>
<ol>
<li>${t('The ticket owner reads the ticket and acceptance criteria (2.1). Questions about <em>what</em>, not yet about size.', 'Người giữ ticket đọc ticket và tiêu chí chấp nhận (2.1). Hỏi về <em>làm gì</em>, chưa hỏi về độ lớn.')}</li>
<li>${t('Everyone picks a card privately — paper cards, an app, or fingers under the table.', 'Mỗi người chọn bài riêng — bài giấy, ứng dụng, hoặc giơ ngón tay dưới gầm bàn.')}</li>
<li>${t('<strong>All reveal at the same moment.</strong>', '<strong>Tất cả lật cùng một lúc.</strong>')}</li>
<li>${t('If the cards are within one step, take the higher one and move on. If they differ by two steps or more, the highest and the lowest explain — they usually know something the others do not.', 'Nếu các lá chỉ lệch một nấc, lấy lá cao hơn rồi sang ticket khác. Nếu lệch từ hai nấc trở lên, người cao nhất và người thấp nhất giải thích — họ thường biết điều người khác không biết.')}</li>
<li>${t('Vote again, at most twice. Still split? Take the higher card, or make a spike.', 'Bỏ phiếu lại, tối đa hai lần. Vẫn lệch? Lấy lá cao hơn, hoặc tạo một spike.')}</li>
</ol>
<p>${t('James Grenning described the technique in 2002 to stop release planning from dragging on; Mike Cohn made it popular in <em>Agile Estimating and Planning</em> (2005). Step 3 is the whole trick. Why it matters is easier to see than to explain.', 'James Grenning mô tả kỹ thuật này năm 2002 để buổi lập kế hoạch phát hành khỏi kéo lê thê; Mike Cohn làm nó phổ biến qua sách <em>Agile Estimating and Planning</em> (2005). Bước 3 là toàn bộ mấu chốt. Vì sao nó quan trọng thì nhìn dễ hơn giải thích.')}</p>

<h3>${t('Lab: one team, two ways of estimating', 'Lab: một nhóm, hai cách ước lượng')}</h3>
<p>${t(
    'Twelve LabFlow tickets, five people with their own biases (C1 optimistic, C4 careful) and random noise. Three tickets hide a risk that only one member knows: C4 has fought the camera on iOS Safari before, C3 knows the e-mail must go through an outbox to avoid duplicates, C5 knows the PDF library has no Vietnamese font. In "speak in turn" the leader says a number first and the others drift 60% towards it — the <em>anchoring</em> effect described by Tversky and Kahneman in 1974. Every coefficient is an assumption chosen to show the mechanism, not a measurement.',
    'Mười hai ticket LabFlow, năm người với thiên lệch riêng (C1 lạc quan, C4 thận trọng) và nhiễu ngẫu nhiên. Ba ticket giấu một rủi ro mà chỉ một thành viên biết: C4 từng vật lộn với camera trên Safari iOS, C3 biết email phải đi qua outbox để khỏi gửi trùng, C5 biết thư viện PDF không có phông tiếng Việt. Ở cách "nói lần lượt", trưởng nhóm nói con số trước và những người sau trôi 60% về phía nó — hiệu ứng <em>mỏ neo</em> mà Tversky và Kahneman mô tả năm 1974. Mọi hệ số là giả định chọn để thấy cơ chế, không phải số đo.')}</p>
${js(MA.poker)}
<p>${t('One session (seed 2027), real output:', 'Một buổi (hạt giống 2027), output thật:')}</p>
${out('$ node poker.mjs\n' + RA.poker)}
<p>${t('In this session the anchored team was lucky: it still found two of the three risks, and LF-41 (PDF) slipped through as a 2 that is really a 5. One session proves nothing, so run two hundred:', 'Ở buổi này nhóm bị neo gặp may: vẫn tìm ra hai trong ba rủi ro, còn LF-41 (PDF) lọt qua với điểm 2 trong khi thật là 5. Một buổi không chứng minh được gì, nên chạy hai trăm buổi:')}</p>
${out('$ node poker.mjs nhieu-lan 200\n' + RA.pokerNhieu)}
<ul>
<li>${t('<strong>Error</strong> falls from 5.9 to 1.5 card steps per session, and the hidden risks surface almost every time (2.92 of 3 instead of 1.38). The person who knows is no longer pulled towards the leader’s number before anyone can see the disagreement.', '<strong>Độ lệch</strong> giảm từ 5,9 xuống 1,5 nấc mỗi buổi, và rủi ro ẩn lộ ra gần như mọi lần (2,92/3 thay vì 1,38). Người biết chuyện không còn bị kéo về con số của trưởng nhóm trước khi ai kịp thấy sự bất đồng.')}</li>
<li>${t('<strong>The price is time</strong>: 32 minutes instead of 16, because honest disagreement must be discussed. Keep it affordable: discuss only at two steps or more, cap two rounds, and size many small items quickly by sorting them on a table relative to the reference stories ("affinity estimation") before the poker.', '<strong>Cái giá là thời gian</strong>: 32 phút thay vì 16, vì bất đồng thật thì phải bàn. Giữ cho vừa túi: chỉ bàn khi lệch từ hai nấc, tối đa hai vòng, và với nhiều việc nhỏ thì xếp nhanh chúng lên bàn so với các story mốc ("affinity estimation") trước khi chơi poker.')}</li>
</ul>
${cl('ok', `<p><strong>${t('The leader’s rule', 'Luật của trưởng nhóm')}</strong>: ${t('never say your number first — not even "I think it is a 3, but what do you think?". Your number is the strongest anchor in the room.', 'đừng bao giờ nói con số của mình trước — kể cả kiểu "mình nghĩ là 3, các bạn thấy sao?". Con số của bạn là mỏ neo mạnh nhất trong phòng.')}</p>`)}

<h3>${t('Velocity — and how it gets abused', 'Velocity — và cách nó bị dùng sai')}</h3>
<p>${t(
    '<strong>Velocity</strong> is the sum of points of items that met the Definition of Done in a sprint. A ticket at 90% counts zero — otherwise velocity becomes a measure of optimism. Use it for one thing: deciding how much to pull into the next sprint and forecasting a release. Three abuses to refuse:',
    '<strong>Velocity</strong> là tổng điểm của các mục đạt Definition of Done trong một sprint. Ticket làm 90% tính bằng không — nếu không, velocity thành thước đo sự lạc quan. Dùng nó cho đúng một việc: quyết định kéo bao nhiêu vào sprint sau và dự báo một bản phát hành. Ba kiểu dùng sai cần từ chối:')}</p>
<ul>
<li>${t('<strong>Comparing teams</strong>: team A’s 30 and team B’s 20 are in different units; each team calibrated its own reference stories.', '<strong>So giữa các đội</strong>: 30 của đội A và 20 của đội B là hai đơn vị khác nhau; mỗi đội tự lấy story mốc của mình.')}</li>
<li>${t('<strong>Making it a target</strong>: "next sprint we need 25" is met by inflating estimates within a month. Goodhart’s law — when a measure becomes a target, it ceases to be a good measure.', '<strong>Biến nó thành chỉ tiêu</strong>: "sprint sau phải được 25" sẽ đạt được bằng cách thổi phồng điểm trong vòng một tháng. Định luật Goodhart — khi một thước đo thành chỉ tiêu, nó thôi là thước đo tốt.')}</li>
<li>${t('<strong>Converting to hours per person</strong>: "1 point = 4 hours, you did 10 points, so you worked 40 hours" brings back every problem of hour estimates.', '<strong>Quy ra giờ cho từng người</strong>: "1 điểm = 4 giờ, bạn làm 10 điểm nên bạn làm 40 giờ" đem lại mọi rắc rối của ước lượng bằng giờ.')}</li>
</ul>

<h3>${t('Forecasting: a range with a probability', 'Dự báo: một khoảng kèm xác suất')}</h3>
<p>${t('Scenario from an OJT team: two-week sprints, four sprints measured (14, 21, 17, 12 points — sprint 4 lost days to the 30/4–1/5 holiday), 96 points left, release in 5 sprints. The script compares the naive average with a Monte Carlo simulation that replays history: each future sprint draws one of the past velocities at random, 10 000 times.', 'Tình huống của một đội OJT: sprint hai tuần, đã đo bốn sprint (14, 21, 17, 12 điểm — sprint 4 mất ngày vì nghỉ lễ 30/4–1/5), còn 96 điểm, phát hành sau 5 sprint. Script so cách lấy trung bình ngây thơ với mô phỏng Monte Carlo phát lại lịch sử: mỗi sprint tương lai bốc ngẫu nhiên một velocity trong quá khứ, 10 000 lần.')}</p>
${js(MA.duBao)}
${out('$ node du-bao.mjs 96 5\n' + RA.duBao)}
<p>${t('The naive answer is "6 sprints, one late". The simulation is harsher: only a 3% chance of finishing in 5. Now cut the scope to 70 points, and separately see what 5% scope growth per sprint does to the original plan:', 'Câu trả lời ngây thơ là "6 sprint, trễ một". Mô phỏng khắc nghiệt hơn: chỉ 3% khả năng xong trong 5 sprint. Giờ cắt phạm vi còn 70 điểm, và riêng rẽ xem phạm vi phình 5% mỗi sprint làm gì với kế hoạch ban đầu:')}</p>
${out('$ node du-bao.mjs 70 5\n' + RA.duBaoCat)}
${out('$ node du-bao.mjs 96 5 5\n' + RA.duBaoPhinh)}
${cl('info', `<p><strong>${t('How to say it to a manager or lecturer', 'Nói với quản lý hoặc giảng viên thế nào')}</strong>: ${t('"With our measured velocity we are about 90% sure to deliver these 70 points in 5 sprints. The other 26 points are possible only if things go well; if the scope keeps growing, the date moves by months, not days." A range, a probability, and the lever you need from them (scope).', '"Theo velocity đã đo, bên em chắc khoảng 90% giao được 70 điểm này trong 5 sprint. 26 điểm còn lại chỉ làm được nếu mọi việc thuận lợi; nếu phạm vi cứ phình thì ngày giao lùi theo tháng chứ không theo ngày." Một khoảng, một xác suất, và cái cần gạt bạn cần từ họ (phạm vi).')}</p>`)}

<h3>${t('Points on SWP391', 'Điểm ở SWP391')}</h3>
<ul>
<li>${t('<strong>Points are not LOC Levels.</strong> The Level of a screen decides its grade; points decide how much fits in a sprint. S28 (QR check-in, 5 fields, 4 transactions) is only Level 3 but 8 points the first time because of the camera — both numbers belong on the ticket.', '<strong>Điểm không phải Level LOC.</strong> Level của màn quyết định điểm chấm; điểm story quyết định bao nhiêu việc vừa một sprint. S28 (QR check-in, 5 field, 4 transaction) chỉ Level 3 nhưng lần đầu là 8 điểm vì camera — cả hai con số đều nằm trên ticket.')}</li>
<li>${t('<strong>Three iterations are too few data points</strong>: measure velocity per week (points Done per week) from week 2, and plan iteration 3 from iterations 1–2 instead of from wishes — the', '<strong>Ba iteration là quá ít điểm dữ liệu</strong>: đo velocity theo tuần (điểm Done mỗi tuần) từ tuần 2, và lập kế hoạch iteration 3 từ iteration 1–2 thay vì từ mong muốn — ')}${ag('agl-1-5-lab', t('burndown script of lab 1.5', 'script burndown ở lab 1.5'))} ${t('already gives you the daily numbers.', 'đã cho bạn số liệu từng ngày.')}</li>
<li>${t('<strong>When items are similar in size</strong>, simply counting finished cards per week (throughput, lesson 1.3) forecasts as well as points. That observation is behind the #NoEstimates movement (Woody Zuill, Vasco Duarte, from about 2012): estimate less, split more, count more.', '<strong>Khi các mục có cỡ gần nhau</strong>, chỉ đếm số thẻ xong mỗi tuần (throughput, bài 1.3) dự báo tốt ngang điểm. Đó là nhận xét đứng sau phong trào #NoEstimates (Woody Zuill, Vasco Duarte, từ khoảng 2012): ước ít hơn, chia nhỏ nhiều hơn, đếm nhiều hơn.')}</li>
</ul>

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'At an outsourcing company you will meet both systems. The contract and the quotation are in <strong>man-days</strong>, built from a WBS with buffers (',
    'Ở công ty outsourcing bạn sẽ gặp cả hai hệ. Hợp đồng và báo giá tính bằng <strong>man-day</strong>, dựng từ WBS có dự phòng (')}${ag('agl-9-6-uoc-luong-man-day', t('lesson 9.6', 'bài 9.6'))}${t('), because a customer pays for time. Inside the sprint, the team often still plays planning poker in points to decide what fits. When your leader asks "how long will LF-41 take?", give a range and the assumption that could break it: "2–3 days if the PDF library supports a custom font; I will know after a 2-hour spike." That sentence earns more trust than any single number.', '), vì khách trả tiền theo thời gian. Bên trong sprint, đội vẫn thường chơi planning poker bằng điểm để quyết định thứ gì vừa. Khi leader hỏi "LF-41 mất bao lâu?", hãy đưa một khoảng kèm giả định có thể làm nó đổ: "2–3 ngày nếu thư viện PDF nhận phông tự chọn; em sẽ biết sau một spike 2 giờ." Câu đó tạo niềm tin hơn mọi con số đơn lẻ.')}</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
<li>${t('Set <code>NEO = 0</code> in <code>poker.mjs</code> (nobody is influenced by the first number). Predict the two lines of <code>nhieu-lan 200</code>, then run it.', 'Đặt <code>NEO = 0</code> trong <code>poker.mjs</code> (không ai bị ảnh hưởng bởi con số đầu tiên). Đoán hai dòng của <code>nhieu-lan 200</code>, rồi chạy.')}</li>
<li>${t('With the same velocity history and 5 sprints, what is the largest scope you would commit to at about 85% confidence?', 'Với cùng lịch sử velocity và 5 sprint, phạm vi lớn nhất bạn dám cam kết ở độ tin khoảng 85% là bao nhiêu?')}</li>
<li>${t('A manager says: "Your team did 16 points in two weeks. 1 point should be 4 hours, so that is 64 hours for five people — are you slacking?" Answer in three sentences.', 'Một quản lý nói: "Đội em làm 16 điểm trong hai tuần. 1 điểm phải là 4 giờ, vậy là 64 giờ cho năm người — các em lười à?" Trả lời trong ba câu.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `${out("$ sed 's/^const NEO = 0.6;/const NEO = 0;  /' poker.mjs > poker-neo0.mjs && node poker-neo0.mjs nhieu-lan 200\n" + RA.pokerNeo0)}
<p>${t('1. Both lines become identical: in this model the <em>only</em> difference between the two methods is anchoring. Real meetings add more — seniority, not wanting to look slow, the quiet member who never contradicts the leader — which is why simultaneous reveal matters even more in a real room than in the model.', '1. Hai dòng trùng nhau: trong mô hình này <em>khác biệt duy nhất</em> giữa hai cách là hiệu ứng mỏ neo. Buổi họp thật còn thêm nữa — thâm niên, ngại tỏ ra chậm, thành viên ít nói không bao giờ cãi trưởng nhóm — nên lật bài cùng lúc còn quan trọng hơn trong phòng thật so với trong mô hình.')}</p>
${out('$ for n in 60 64 68 70 72 76 80; do printf "%s: " $n; node du-bao.mjs $n 5 | grep "Xác suất"; done\n' + RA.duBaoQuet)}
<p>${t('2. About 72 points (86%); 70 points if you want a little margin (91%). Above 76 it becomes a coin toss.', '2. Khoảng 72 điểm (86%); 70 điểm nếu muốn thêm chút an toàn (91%). Trên 76 thì thành tung đồng xu.')}</p>
<p>${t('3. For example: "Points measure the relative size of the work, not hours — our team calibrated them on our own reference stories, so they cannot be converted to time per person. What we can promise from them is a forecast: at this velocity, 70 points by the release with about 90% confidence. If you need more output, the levers are scope and removing the blockers we listed in the retro, and we would like your help with those."', '3. Ví dụ: "Điểm đo độ lớn tương đối của công việc, không phải giờ — đội em hiệu chỉnh nó theo story mốc riêng nên không quy được ra thời gian của từng người. Thứ bọn em hứa được từ nó là dự báo: với velocity này, 70 điểm trước ngày phát hành với độ tin khoảng 90%. Nếu anh/chị cần nhiều hơn, cần gạt là phạm vi và gỡ các vướng mắc đội đã liệt kê ở retro, và bọn em mong anh/chị giúp ở đó."')}</p>`)}

${phongVan([
    [t('"Why story points instead of hours?"', '"Sao dùng story point thay vì giờ?"'), t('Relative sizing is faster and more consistent than absolute guesses, does not depend on who does the work, and keeps estimates from becoming individual targets. Hours are still useful for short tasks inside a day.', 'Ước lượng tương đối nhanh hơn và nhất quán hơn phỏng đoán tuyệt đối, không phụ thuộc người làm, và giữ cho ước lượng khỏi thành chỉ tiêu cá nhân. Giờ vẫn có ích cho việc ngắn trong ngày.')],
    [t('"How does planning poker work and why the simultaneous reveal?"', '"Planning poker làm thế nào, sao phải lật cùng lúc?"'), t('Everyone picks privately, reveals together, the extremes explain, then re-vote. Simultaneous reveal prevents anchoring on the first or most senior voice and brings hidden knowledge to the surface.', 'Mỗi người chọn riêng, lật cùng lúc, hai đầu cực giải thích, rồi bỏ phiếu lại. Lật cùng lúc chặn hiệu ứng mỏ neo theo người nói đầu hoặc người thâm niên, và lôi kiến thức ẩn ra.')],
    [t('"What is velocity and what should it not be used for?"', '"Velocity là gì và không nên dùng nó vào việc gì?"'), t('Points of Done items per sprint, used for sprint capacity and forecasting. Not for comparing teams, not as a target, not converted into individual hours.', 'Tổng điểm mục Done mỗi sprint, dùng để định sức chứa sprint và dự báo. Không dùng để so đội, không làm chỉ tiêu, không quy ra giờ từng người.')],
    [t('"Your manager wants a date. What do you give?"', '"Quản lý muốn một ngày cụ thể. Bạn đưa gì?"'), t('A range with a confidence level from historical data (for example a Monte Carlo forecast over past velocity or throughput), the assumptions behind it, and the scope that is committed versus stretch.', 'Một khoảng kèm độ tin dựa trên dữ liệu quá khứ (vd dự báo Monte Carlo trên velocity hoặc throughput), các giả định phía sau, và phần phạm vi cam kết so với phần cố gắng thêm.')],
    [t('"Have you ever estimated badly? What did you learn?"', '"Bạn từng ước lượng sai chưa? Học được gì?"'), t('A STAR story: the situation (e.g. a 2-point PDF export that took a week), what you did (raised it at the daily, split it, ran a spike), the result, and the change you made (spikes for unknown libraries, never estimating alone).', 'Một câu chuyện STAR: tình huống (vd xuất PDF 2 điểm mà mất một tuần), bạn đã làm gì (nêu ở daily, cắt nhỏ, làm spike), kết quả, và thay đổi bạn rút ra (spike cho thư viện lạ, không bao giờ ước một mình).')],
  ], en)}

${thuatNgu([
    ['story point', t('Relative size of work (effort, complexity, uncertainty).', 'Độ lớn tương đối của việc (công sức, độ phức tạp, độ không chắc).')],
    [t('reference story', 'story mốc'), t('Finished story the team uses as a size anchor.', 'Story đã xong được nhóm dùng làm mốc so sánh.')],
    ['planning poker', t('Private choice, simultaneous reveal, extremes explain, re-vote.', 'Chọn riêng, lật cùng lúc, hai đầu giải thích, bỏ phiếu lại.')],
    [t('anchoring', 'hiệu ứng mỏ neo'), t('Judgements pulled towards the first number heard (Tversky &amp; Kahneman, 1974).', 'Phán đoán bị kéo về con số nghe thấy đầu tiên (Tversky &amp; Kahneman, 1974).')],
    ['velocity', t('Points of Done items per sprint.', 'Tổng điểm của mục Done mỗi sprint.')],
    ['Monte Carlo', t('Forecast by replaying random draws of past data many times.', 'Dự báo bằng cách phát lại ngẫu nhiên dữ liệu quá khứ nhiều lần.')],
    [t('planning fallacy', 'ngụy biện lập kế hoạch'), t('Predicting from the best case, ignoring past durations.', 'Đoán theo kịch bản tốt nhất, bỏ qua thời gian của các việc trước.')],
    [t('Goodhart’s law', 'định luật Goodhart'), t('A measure that becomes a target stops being a good measure.', 'Thước đo thành chỉ tiêu thì thôi là thước đo tốt.')],
    ['#NoEstimates', t('Forecast by counting similar-sized items instead of estimating each.', 'Dự báo bằng cách đếm các mục cỡ gần nhau thay vì ước từng cái.')],
  ], en)}

${tomTat([
    t('Estimate to compare, to surface hidden knowledge and to promise ranges — not to predict exactly.', 'Ước lượng để so sánh, để lôi ra kiến thức ẩn và để hứa bằng khoảng — không phải để đoán chính xác.'),
    t('Points are relative, on 1-2-3-5-8-13 with reference stories; above 8 you split.', 'Điểm là tương đối, thang 1-2-3-5-8-13 với story mốc; trên 8 thì chia nhỏ.'),
    t('Simultaneous reveal beat speaking in turn in 200 simulated sessions: error 5.9 → 1.5 steps, hidden risks 1.38 → 2.92 of 3, at twice the meeting time.', 'Lật cùng lúc thắng nói lần lượt trong 200 buổi mô phỏng: lệch 5,9 → 1,5 nấc, rủi ro ẩn 1,38 → 2,92/3, đổi lại thời gian họp gấp đôi.'),
    t('Velocity counts only Done; never compare teams, set targets or convert to hours.', 'Velocity chỉ đếm Done; không so đội, không đặt chỉ tiêu, không quy ra giờ.'),
    t('Forecast with Monte Carlo over history: 96 points in 5 sprints = 3%, 70 points = 91%; scope growth moves dates by months.', 'Dự báo bằng Monte Carlo trên lịch sử: 96 điểm trong 5 sprint = 3%, 70 điểm = 91%; phạm vi phình làm ngày lùi theo tháng.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-2-4-ct-work', t('2.4 — Running it in CT Work', '2.4 — Vận hành trên CT Work'))}.</p>
`);
};

export default {
  title: '2.3 — Estimation: story points and planning poker|||2.3 — Ước lượng: story point và planning poker',
  slug: 'agl-2-3-uoc-luong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao ước lượng tương đối thay vì giờ (ngụy biện lập kế hoạch, định luật Hofstadter, lời Ron Jeffries); thang 1-2-3-5-8-13 với story mốc LabFlow; planning poker từng bước; mô phỏng chạy thật 200 buổi: lật cùng lúc lệch 1,5 nấc và lộ 2,92/3 rủi ro so với 5,9 nấc và 1,38/3 khi bị neo; velocity và ba kiểu dùng sai; dự báo Monte Carlo 10 000 lần (96 điểm 3%, 70 điểm 91%); điểm khác Level LOC ở SWP391; man-day khi đi làm.',
  content: L23(true) + L23(false),
};
