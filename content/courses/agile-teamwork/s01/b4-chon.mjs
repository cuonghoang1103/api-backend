/**
 * 1.4 — Chọn cho đội của bạn (agl-1-4-chon). Soạn 24/11/2026, agent agt.
 * Không có mã chạy trong bài này (quyết định + thoả thuận làm việc); số liệu WIP/cycle time dẫn từ lab 1.3.
 * Ranh giới: hợp đồng nhóm đầy đủ (điểm, phạt, phân xử) ⇒ Academy swp391-p-2; Spotify 2012 ⇒ bài 0.8; xử lý thành viên không làm ⇒ 6.x.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, ag, ac, vo } from '../_chung.mjs';

const THOA_THUAN = `# Thoả thuận làm việc — nhóm LabFlow (SWP391, SP27)        cập nhật: sau retro sprint 1

## Nhịp
- Sprint = 1 iteration (3 tuần). Planning tối thứ Hai đầu sprint 19:30–21:00. Review + Retro tối thứ Sáu cuối sprint.
- Daily 15 phút trực tuyến T2/T4/T6 21:30. Ngày khác: mỗi người 1 tin trong kênh #daily trước 22:00
  (hôm qua xong gì · hôm nay làm gì · vướng gì). Vắng daily ⇒ vẫn gửi tin.
- Giữa sprint (thứ Tư tuần 2): 30 phút xem burndown + làm mịn backlog sprint sau.

## Bảng và WIP
- Không có thẻ thì không làm. Mỗi người tối đa 1 thẻ In progress. Cột In review tối đa 3.
- Cột review đầy ⇒ review trước khi kéo thẻ mới. PR được review trong 24 giờ (ngày thi: 48 giờ).
- Thẻ đứng yên 2 ngày ⇒ tự nêu ở daily; trưởng nhóm hỏi thẻ già nhất trước.

## Bí và vắng
- Bí quá 2 giờ ⇒ nhắn #hoi-dap: đã thử gì, lỗi gì (ảnh/log), cần ai.
- Vắng/bận ⇒ báo trước 24 giờ trong nhóm. Tuần thi: khai năng lực thấp hơn ở planning, không im lặng.
- Trả lời tin nhóm trong 12 giờ (T2–T6), cuối tuần không bắt buộc.

## Chất lượng
- Definition of Done (ghim ở kênh #chung) áp cho mọi thẻ. Người review kéo thẻ sang Done.
- Nhánh feature/LF-xx-ten, commit "feat(LF-xx): ...", main được bảo vệ (bài 0.2, chương 3).

## Quyết định và bất đồng
- Việc kỹ thuật của một màn hình: người làm màn đó quyết, ghi vào thẻ.
- Việc chung (CSDL, kiến trúc, luật nhóm): bàn ≤ 15 phút; không đồng thuận ⇒ trưởng nhóm quyết,
  mọi người làm theo, người không đồng ý được ghi ý kiến vào thẻ (disagree and commit).
- Mâu thuẫn: nói riêng 1:1 trước ⇒ nêu ở retro ⇒ cả nhóm ⇒ mới báo giảng viên.

## Sửa thoả thuận
- Chỉ sửa ở retro, cả nhóm đồng ý. Ký (thả ✅ vào tin ghim): C1 C2 C3 C4 C5`;

export const L14 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 1 · Lesson 1.4', 'Chương 1 · Bài 1.4', `
<h2>${t('1.4 — Choosing for your team', '1.4 — Chọn cho đội của bạn')}</h2>
<p class="lead">${t(
    'Scrum or Kanban is the wrong question. The right one is: <strong>what are our constraints, and which practices help us get feedback and finish work under them?</strong> A five-person student team with other subjects, exams, a lecturer who reviews at fixed dates and grading by screen has very different constraints from a product team at a company. This lesson compares the options, gives a concrete recommendation for SWP391 with the reason behind each piece, shows how companies choose, and ends with the single most useful document a new leader can write in week 1: a working agreement.',
    'Scrum hay Kanban là câu hỏi sai. Câu đúng là: <strong>nhóm mình có những ràng buộc gì, và cách làm nào giúp nhận phản hồi và làm xong việc trong những ràng buộc đó?</strong> Nhóm năm sinh viên còn học môn khác, có tuần thi, có giảng viên review vào ngày cố định và chấm điểm theo màn hình có ràng buộc rất khác một đội làm sản phẩm ở công ty. Bài này so sánh các lựa chọn, đưa một đề xuất cụ thể cho SWP391 kèm lý do từng phần, chỉ ra công ty chọn thế nào, và kết thúc bằng tài liệu hữu ích nhất mà một trưởng nhóm mới có thể viết trong tuần 1: thoả thuận làm việc nhóm.')}</p>

<h3>${t('Everyday picture: choosing how a household cooks', 'Liên tưởng đời thường: nhà mình nấu ăn kiểu gì')}</h3>
<p>${t(
    'A family that eats together every evening plans a weekly menu and shops on Sunday (a fixed cadence: Scrum). A noodle stall cooks each bowl as the order comes and only cares that no customer waits too long (continuous flow: Kanban). A family that plans a weekly menu but also keeps "no more than two pots on the stove" uses both. Nobody argues which is "correct" — it depends on who eats when.',
    'Một gia đình tối nào cũng ăn chung thì lên thực đơn cả tuần và đi chợ chủ nhật (nhịp cố định: Scrum). Một quầy mì nấu từng bát khi có order và chỉ quan tâm không khách nào phải chờ quá lâu (dòng chảy liên tục: Kanban). Một nhà vừa lên thực đơn tuần vừa giữ luật "trên bếp không quá hai nồi" là dùng cả hai. Không ai cãi kiểu nào "đúng" — tuỳ ai ăn lúc nào.')}</p>

<h3>${t('The options side by side', 'Các lựa chọn đặt cạnh nhau')}</h3>
${bang(['', 'Scrum', 'Kanban', t('Scrumban (Scrum + Kanban practices)', 'Scrumban (Scrum + thực hành Kanban)'), t('Hybrid (outsourcing)', 'Lai (outsourcing)')], [
    [t('Cadence', 'Nhịp'), t('Fixed sprints, planning/review/retro every sprint', 'Sprint cố định, mỗi sprint có planning/review/retro'), t('Continuous; meetings on demand or on a separate rhythm', 'Liên tục; họp khi cần hoặc theo nhịp riêng'), t('Sprints for planning and review, continuous pull inside', 'Sprint để lập kế hoạch và review, kéo việc liên tục bên trong'), t('Client milestones (BD/DD/UT/IT) outside, sprints inside', 'Mốc với khách (BD/DD/UT/IT) bên ngoài, sprint bên trong')],
    [t('Roles', 'Vai trò'), t('PO, SM, Developers', 'PO, SM, Developers'), t('None required', 'Không bắt buộc'), t('Usually keeps PO and a facilitator', 'Thường giữ PO và người điều phối'), t('PM, BrSE/BA, leader, dev, QA (chapter 9)', 'PM, BrSE/BA, leader, dev, QA (chương 9)')],
    [t('Change', 'Thay đổi'), t('Between sprints; Sprint Goal protected', 'Giữa các sprint; Sprint Goal được bảo vệ'), t('Any time a slot frees up', 'Bất cứ khi nào có chỗ trống'), t('Between sprints, urgent items through an expedite lane', 'Giữa các sprint, việc gấp qua làn ưu tiên'), t('Through Q&amp;A and change requests', 'Qua Q&amp;A và change request')],
    [t('Main measures', 'Số đo chính'), t('Sprint Goal met, burndown, velocity', 'Đạt Sprint Goal, burndown, velocity'), t('Cycle time, throughput, WIP', 'Cycle time, throughput, WIP'), t('Both', 'Cả hai'), t('Progress %, defect density, man-days (9.6)', 'Tiến độ %, mật độ lỗi, man-day (9.6)')],
    [t('Fits', 'Hợp với'), t('Product work with regular stakeholders', 'Làm sản phẩm, có bên liên quan review đều'), t('Support, maintenance, ops, bug queues', 'Hỗ trợ, bảo trì, vận hành, hàng đợi lỗi'), t('Small teams with fixed review dates and uneven availability', 'Đội nhỏ có ngày review cố định và thời gian rảnh không đều'), t('Fixed-price contracts with Japanese clients', 'Hợp đồng trọn gói với khách Nhật')],
  ])}

<h3>${t('Recommendation for a 5-person SWP391 team — and why', 'Đề xuất cho nhóm SWP391 năm người — và lý do')}</h3>
${bang([t('Constraint', 'Ràng buộc'), t('Practice', 'Cách làm'), t('Why', 'Vì sao')], [
    [t('The lecturer reviews at the end of each iteration (3 iterations)', 'Giảng viên review cuối mỗi iteration (3 iteration)'), t('<strong>1 sprint = 1 iteration</strong>, the iteration review is the Sprint Review', '<strong>1 sprint = 1 iteration</strong>, buổi review iteration chính là Sprint Review'), t('Aligns your feedback loop with the real stakeholder; no fake reviews nobody attends.', 'Khớp vòng phản hồi của nhóm với bên liên quan thật; không có buổi review giả không ai dự.')],
    [t('3-week sprints are long for a part-time team', 'Sprint 3 tuần là dài với nhóm làm bán thời gian'), t('A <strong>30-minute mid-sprint check</strong> (burndown + refinement)', '<strong>30 phút soát giữa sprint</strong> (burndown + làm mịn backlog)'), t('Adds a feedback point inside the sprint where you can still drop scope (lab 1.5).', 'Thêm một điểm phản hồi trong sprint, lúc vẫn còn kịp bỏ bớt phạm vi (lab 1.5).')],
    [t('Members have other subjects and exams; availability is uneven', 'Thành viên học môn khác, có tuần thi; thời gian rảnh không đều'), t('<strong>Daily 3×/week online + written update</strong> other days; capacity declared at planning', '<strong>Daily 3 buổi/tuần trực tuyến + cập nhật bằng chữ</strong> các ngày khác; khai năng lực ở planning'), t('A daily call every day does not survive week 2; a written update does.', 'Gọi daily mỗi ngày không sống nổi qua tuần 2; cập nhật bằng chữ thì sống được.')],
    [t('Review is the bottleneck when only the leader reviews (1.3)', 'Review thành chỗ tắc khi chỉ trưởng nhóm review (1.3)'), t('<strong>Kanban board with WIP 1/person, review column ≤ 3</strong>, everyone reviews', '<strong>Bảng Kanban, WIP 1 thẻ/người, cột review ≤ 3</strong>, ai cũng review'), t('Same people, 27 → 38 cards in the simulation.', 'Cùng số người, 27 → 38 thẻ trong mô phỏng.')],
    [t('Grading by screens/LOC per person', 'Chấm theo màn hình/LOC từng người'), t('Each member <strong>owns screens end-to-end</strong> (not FE/BE split) — chapter 2', 'Mỗi người <strong>làm trọn màn hình của mình</strong> (không chia FE/BE) — chương 2'), t('Every member has visible, gradable work every iteration.', 'Ai cũng có phần việc thấy được, chấm được ở mỗi iteration.')],
    [t('No real "PO" in the team', 'Nhóm không có "PO" thật'), t('Leader as proxy PO; questions to the lecturer as Q&amp;A issues', 'Trưởng nhóm làm PO đại diện; câu hỏi cho giảng viên thành issue Q&amp;A'), t('One ordered backlog, one person accountable for the order.', 'Một backlog có thứ tự, một người chịu trách nhiệm về thứ tự đó.')],
  ])}
${note(t('In short: Scrum for the rhythm (because your stakeholder has a rhythm), Kanban for the flow inside the sprint (because your bottleneck is review). That is "Scrumban", and it is what many real teams end up with.', 'Gói gọn: Scrum cho nhịp (vì bên liên quan của bạn có nhịp), Kanban cho dòng chảy bên trong sprint (vì chỗ tắc của bạn là review). Đó là "Scrumban", và nhiều đội thật cuối cùng cũng làm vậy.'))}

<h3>${t('How companies choose', 'Công ty chọn thế nào')}</h3>
<ul>
<li>${t('<strong>Product company, one product</strong>: Scrum with 1–2-week sprints, or Kanban with continuous deployment when they release many times a day.', '<strong>Công ty sản phẩm, một sản phẩm</strong>: Scrum sprint 1–2 tuần, hoặc Kanban kèm deploy liên tục khi phát hành nhiều lần mỗi ngày.')}</li>
<li>${t('<strong>Outsourcing, Japanese client, fixed price</strong>: the contract follows the V-model; the team often runs internal sprints toward each milestone. You report progress in % and man-days, not story points (9.2, 9.6, 9.7).', '<strong>Outsourcing, khách Nhật, trọn gói</strong>: hợp đồng theo V-model; đội thường chạy sprint nội bộ hướng tới từng mốc. Báo tiến độ theo % và man-day, không theo story point (9.2, 9.6, 9.7).')}</li>
<li>${t('<strong>Outsourcing, US client, time and materials / dedicated team</strong>: often plain Scrum with the client as PO; you attend the client’s ceremonies in English (chapter 11).', '<strong>Outsourcing, khách Mỹ, theo giờ công / đội riêng</strong>: thường là Scrum thuần, khách làm PO; bạn dự các buổi của khách bằng tiếng Anh (chương 11).')}</li>
<li>${t('<strong>Maintenance after go-live</strong>: Kanban with service levels per bug severity (1.3).', '<strong>Bảo trì sau khi hệ thống chạy thật</strong>: Kanban với cam kết thời gian theo mức độ lỗi (1.3).')}</li>
</ul>
${cl('warn', `<p>${t('Do not copy a famous company’s model. The 2012 "Spotify model" paper (squads, tribes) was a snapshot of one company at one moment, and its authors later said so; teams that copied the org chart without the culture got the names without the results. Story in ', 'Đừng sao chép mô hình của một công ty nổi tiếng. Bài viết "mô hình Spotify" năm 2012 (squad, tribe) là ảnh chụp một công ty ở một thời điểm, chính tác giả sau này cũng nói vậy; các đội chép sơ đồ tổ chức mà không có văn hoá đi kèm thì được cái tên mà không được kết quả. Câu chuyện ở ')}${ag('agl-0-8-bat-dau-tai-day', t('Start here (1/2)', 'Bắt đầu tại đây (1/2)'))}.</p>`)}

<h3>${t('The working agreement — the leader’s first document', 'Thoả thuận làm việc — tài liệu đầu tiên của trưởng nhóm')}</h3>
<p>${t(
    'Most team conflicts are not about code; they are about unspoken expectations: "I thought replying the next day was fine", "I thought you would review it". A working agreement writes those expectations down <em>before</em> anyone is angry. It is short (one screen), written by the whole team at the first planning, pinned, and changed only at a retro. Here is a filled example for LabFlow — copy, then argue about every line with your team:',
    'Phần lớn mâu thuẫn trong nhóm không phải về code; mà về những kỳ vọng không ai nói ra: "mình tưởng mai trả lời cũng được", "mình tưởng bạn sẽ review". Thoả thuận làm việc ghi những kỳ vọng đó ra giấy <em>trước khi</em> có ai bực. Nó ngắn (một màn hình), cả nhóm cùng viết ở buổi planning đầu, ghim lại, và chỉ sửa ở retro. Đây là ví dụ đã điền cho LabFlow — chép về, rồi cùng nhóm tranh luận từng dòng:')}</p>
${out(THOA_THUAN)}
<p>${t('Why each block is there:', 'Vì sao có từng khối:')}</p>
<ul>
<li>${t('<strong>Rhythm</strong> — the times are in everyone’s calendar (lesson 1.2), so "I did not know there was a meeting" disappears.', '<strong>Nhịp</strong> — giờ giấc đã nằm trong lịch của mọi người (bài 1.2), nên câu "mình không biết có họp" biến mất.')}</li>
<li>${t('<strong>Board and WIP</strong> — the rules from the simulation in 1.3, written as team policy.', '<strong>Bảng và WIP</strong> — các luật từ mô phỏng ở bài 1.3, viết thành luật nhóm.')}</li>
<li>${t('<strong>Stuck and absent</strong> — the "2-hour rule" turns a silent blocker into a message with context; declaring exam weeks at planning turns a surprise into a plan.', '<strong>Bí và vắng</strong> — "luật 2 giờ" biến người bí mà im lặng thành một tin nhắn có ngữ cảnh; khai tuần thi ở planning biến bất ngờ thành kế hoạch.')}</li>
<li>${t('<strong>Decisions and disagreement</strong> — who decides what, and a ladder for conflict that starts with a private conversation. Disagree-and-commit means the team does not stall, and dissent is recorded, not ignored.', '<strong>Quyết định và bất đồng</strong> — ai quyết việc gì, và một cái thang xử lý mâu thuẫn bắt đầu từ nói chuyện riêng. "Không đồng ý nhưng vẫn làm theo" giúp nhóm không bị kẹt, và ý kiến trái chiều được ghi lại chứ không bị lờ.')}</li>
</ul>
${note(t('The SWP391 playbook has a fuller <em>team contract</em> (grades, what happens when someone does not contribute, how to escalate to the lecturer): ', 'Cẩm nang SWP391 có <em>hợp đồng nhóm</em> đầy đủ hơn (điểm, khi có người không đóng góp thì sao, cách báo giảng viên): ') + ac('software-development-project', 'swp391-p-2-hop-dong-nhom-git-flow', 'SWP391 P.2') + t('. Use that for the rules about grades; use this working agreement for the day-to-day way of working. Handling a member who stops working is in chapter 6.', '. Dùng tài liệu đó cho các luật liên quan tới điểm; dùng thoả thuận làm việc này cho cách làm việc hằng ngày. Xử lý thành viên ngừng làm việc ở chương 6.'))}

<h3>${t('A situation from the first week', 'Một tình huống tuần đầu')}</h3>
<p>${t(
    'At the first planning C4 says: "Daily three times a week is too much, I work evenings." Do not overrule and do not give in silently. Ask what would work ("Could you post the written update by 22:00 on those days and join the Monday one?"), write the exception into the agreement, and review it at the first retro. An agreement that bends to real constraints is followed; one imposed by the leader is ignored by week 3.',
    'Ở buổi planning đầu, C4 nói: "Daily ba buổi/tuần nhiều quá, tối mình đi làm thêm." Đừng gạt đi, cũng đừng lặng lẽ nhượng bộ. Hỏi cách nào được ("Mấy hôm đó bạn gửi tin cập nhật trước 22:00 và dự buổi thứ Hai được không?"), ghi ngoại lệ vào thoả thuận, và xem lại ở retro đầu tiên. Thoả thuận biết uốn theo ràng buộc thật thì được làm theo; thoả thuận do trưởng nhóm áp xuống thì tới tuần 3 bị bỏ qua.')}</p>

<h3>🧪 ${t('Practice (20 minutes)', 'Thực hành (20 phút)')}</h3>
<ol>
<li>${t('Choose Scrum, Kanban, Scrumban or hybrid, with one reason: (a) a 3-person team fixing bugs reported by users of a live school portal; (b) a 6-person startup team building a new app with weekly investor demos; (c) a 10-person offshore team building a system for a Japanese insurer under a fixed-price contract.', 'Chọn Scrum, Kanban, Scrumban hay lai, kèm một lý do: (a) đội 3 người sửa lỗi do người dùng cổng thông tin trường đang chạy báo về; (b) đội startup 6 người làm ứng dụng mới, demo cho nhà đầu tư mỗi tuần; (c) đội offshore 10 người làm hệ thống cho một công ty bảo hiểm Nhật theo hợp đồng trọn gói.')}</li>
<li>${t('Write your own team’s working agreement (one screen). Then find the line most likely to be broken first, and add what happens when it is broken.', 'Viết thoả thuận làm việc của nhóm bạn (một màn hình). Rồi tìm dòng dễ bị vi phạm đầu tiên nhất, và thêm điều gì xảy ra khi nó bị vi phạm.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('1. (a) Kanban — work arrives unpredictably, success is time-to-fix per severity. (b) Scrum with 1-week sprints (or Scrumban) — the weekly demo is the natural Sprint Review. (c) Hybrid — contract milestones follow the V-model and change requests; internal sprints organise the team toward each milestone.', '1. (a) Kanban — việc đến không đoán trước, thành công đo bằng thời gian sửa theo mức độ lỗi. (b) Scrum sprint 1 tuần (hoặc Scrumban) — buổi demo hằng tuần chính là Sprint Review tự nhiên. (c) Lai — mốc hợp đồng theo V-model và change request; sprint nội bộ tổ chức đội hướng tới từng mốc.')}</p>
<p>${t('2. In most student teams the first line to break is "reply within 12 hours" or "PR reviewed within 24 hours". A good consequence is about the work, not punishment: "a PR waiting more than 24 hours is raised at the next daily and reassigned to another reviewer", "no reply in 24 hours ⇒ the leader calls once, then notes it in the weekly report". Avoid fines and public shaming — they destroy the openness the daily needs.', '2. Ở phần lớn nhóm sinh viên, dòng bị vi phạm đầu tiên là "trả lời trong 12 giờ" hoặc "PR được review trong 24 giờ". Hệ quả tốt nhắm vào công việc chứ không trừng phạt: "PR chờ quá 24 giờ được nêu ở daily kế tiếp và chuyển cho người review khác", "24 giờ không trả lời ⇒ trưởng nhóm gọi một lần, rồi ghi vào báo cáo tuần". Tránh phạt tiền và bêu tên — chúng phá hỏng sự cởi mở mà daily cần.')}</p>`)}

${phongVan([
    [t('"Which process did your team use, and why?"', '"Nhóm bạn dùng quy trình nào, vì sao?"'), t('Name the constraints first (iteration reviews with the lecturer, part-time members, review bottleneck), then the practices that answer each one (sprint per iteration, WIP limits and shared review, written dailies). Show you chose, not copied.', 'Nêu ràng buộc trước (review iteration với giảng viên, thành viên bán thời gian, tắc ở review), rồi tới cách làm giải từng ràng buộc (mỗi iteration một sprint, giới hạn WIP và cùng review, daily bằng chữ). Cho thấy bạn đã chọn, không phải chép.')],
    [t('"What is Scrumban?"', '"Scrumban là gì?"'), t('Scrum’s cadence (planning, review, retro) combined with Kanban’s flow practices (WIP limits, pull, cycle-time metrics) inside the sprint.', 'Nhịp của Scrum (planning, review, retro) kết hợp thực hành dòng chảy của Kanban (giới hạn WIP, kéo việc, đo cycle time) bên trong sprint.')],
    [t('"How did you handle a teammate who disagreed with a team decision?"', '"Bạn xử lý thế nào khi một thành viên không đồng ý quyết định của nhóm?"'), t('STAR: we had a written rule for decisions (time-boxed discussion, then the owner decides, dissent recorded); I listened, we tried their concern as an experiment or recorded it; we reviewed at retro. Result and what you learned.', 'STAR: nhóm có luật quyết định viết sẵn (bàn có giới hạn thời gian, rồi người phụ trách quyết, ghi lại ý kiến trái chiều); tôi lắng nghe, nhóm thử điều bạn ấy lo dưới dạng thử nghiệm hoặc ghi lại; xem lại ở retro. Kết quả và điều học được.')],
  ], en)}

${thuatNgu([
    ['Scrumban', t('Scrum cadence + Kanban flow practices.', 'Nhịp Scrum + thực hành dòng chảy Kanban.')],
    [t('working agreement', 'working agreement (thoả thuận làm việc)'), t('Short, team-written rules for how the team works day to day.', 'Luật ngắn do cả nhóm viết về cách làm việc hằng ngày.')],
    [t('team charter / contract', 'team charter (hợp đồng nhóm)'), t('Broader agreement on goals, roles, grades and escalation.', 'Thoả thuận rộng hơn về mục tiêu, vai trò, điểm và cách báo cấp trên.')],
    ['disagree and commit', t('Voice disagreement, then fully support the decision once made.', 'Nói rõ ý không đồng ý, rồi làm hết sức theo quyết định đã chốt.')],
    [t('capacity', 'capacity (năng lực)'), t('Hours each member can really give in a sprint.', 'Số giờ mỗi người thật sự bỏ ra được trong một sprint.')],
    [t('expedite lane', 'expedite lane (làn ưu tiên)'), t('A board lane for urgent items that may bypass the normal order.', 'Một làn trên bảng cho việc gấp, được vượt thứ tự thường.')],
  ], en)}

${tomTat([
    t('Choose from constraints, not from fashion: cadence of your stakeholder, availability, bottleneck, grading.', 'Chọn theo ràng buộc, không theo phong trào: nhịp của bên liên quan, thời gian rảnh, chỗ tắc, cách chấm.'),
    t('SWP391: one sprint per iteration + a mid-sprint check, Kanban board with WIP limits and shared review, written dailies, screens owned end-to-end.', 'SWP391: mỗi iteration một sprint + soát giữa sprint, bảng Kanban có giới hạn WIP và cùng review, daily bằng chữ, mỗi người làm trọn màn hình của mình.'),
    t('Companies: Scrum for products, Kanban for maintenance, hybrid for fixed-price outsourcing.', 'Công ty: Scrum cho sản phẩm, Kanban cho bảo trì, lai cho outsourcing trọn gói.'),
    t('Write a one-screen working agreement together in week 1; change it only at retros.', 'Cùng viết thoả thuận làm việc một màn hình ở tuần 1; chỉ sửa ở retro.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-1-5-lab', t('1.5 — Lab: Sprint 0 for LabFlow', '1.5 — Lab: Sprint 0 cho LabFlow'))}.</p>
`);
};

export default {
  title: '1.4 — Choosing for your team|||1.4 — Chọn cho đội của bạn',
  slug: 'agl-1-4-chon',
  type: 'LESSON',
  isFreePreview: true,
  description: 'So sánh Scrum, Kanban, Scrumban, mô hình lai outsourcing; đề xuất cho nhóm SWP391 năm người kèm lý do theo từng ràng buộc (1 sprint = 1 iteration, soát giữa sprint, WIP, daily bằng chữ, làm trọn màn hình); công ty chọn thế nào; thoả thuận làm việc nhóm LabFlow điền sẵn; tình huống tuần đầu.',
  content: L14(true) + L14(false),
};
