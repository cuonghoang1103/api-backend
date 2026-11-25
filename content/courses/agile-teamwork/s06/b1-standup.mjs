/**
 * 6.1 — Standup 10 phút (agl-6-1-standup). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch6/standup.mjs + lib.mjs trên dữ liệu sprint 2 LabFlow (du-lieu/su-kien.csv, ticket.csv, standup/*.txt),
 * bai-tap-61.mjs — qua ./_ma.mjs (sinh bởi lab/ch6/tao-ma.mjs). Phát hiện thật khi soạn: bản đầu standup.mjs đổ oan C2 (đi thi) là "4 ngày không commit".
 * Ranh giới: nói standup bằng tiếng Anh ⇒ tak-6-1; báo cáo ngày cho khách outsourcing ⇒ agl-9-7; bài này là phía TRƯỞNG NHÓM điều phối.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const dauSuKien = MA.suKien.split('\n').slice(0, 16).join('\n');

export const L61 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.1', 'Chương 6 · Bài 6.1', `
<h2>${t('6.1 — Standups that take 10 minutes', '6.1 — Standup 10 phút')}</h2>
<p class="lead">${t(
    'A student-team standup usually goes like this: a 40-minute call, everyone recites what they did for the leader, someone says "carrying on", nobody says "I am stuck". Two weeks later the leader finds out a screen has not moved since day 3. In this lesson you run the daily the way the Scrum Guide intends — a short check on the Sprint Goal that produces a plan for the next day — and you let the data, not memory, tell you which questions to ask.',
    'Standup của nhóm sinh viên thường như thế này: gọi 40 phút, từng người kể cho trưởng nhóm nghe đã làm gì, có người nói "làm tiếp", không ai nói "mình đang kẹt". Hai tuần sau trưởng nhóm mới biết một màn đứng yên từ ngày thứ 3. Bài này điều hành daily đúng ý Scrum Guide — một lần soát ngắn hướng về Sprint Goal và ra kế hoạch cho ngày kế tiếp — và để dữ liệu, không phải trí nhớ, chỉ cho bạn nên hỏi câu nào.')}</p>
${note(t('Saying a standup in English is ', 'Nói standup bằng tiếng Anh ở ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-6-1-standup', t('Technical English 6.1', 'Tiếng Anh kỹ thuật 6.1')) + t('; the daily report an outsourcing company sends to its client is ', '; báo cáo ngày công ty outsourcing gửi khách ở ') + ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7')) + t('. This lesson is the leader’s side: how to run it, and what to do in the five minutes after it ends.', '. Bài này là phía trưởng nhóm: điều hành thế nào, và làm gì trong năm phút sau khi nó kết thúc.'))}

<h3>${t('What the Scrum Guide actually says', 'Scrum Guide thật sự nói gì')}</h3>
<blockquote>${t(
    '"The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work. The Daily Scrum is a 15-minute event for the Developers of the Scrum Team." … "The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work."',
    '"Mục đích của Daily Scrum là soát tiến độ hướng tới Sprint Goal và điều chỉnh Sprint Backlog khi cần, sắp xếp lại phần việc sắp làm. Daily Scrum là sự kiện 15 phút cho các Developer của Scrum Team." … "Các Developer có thể chọn bất kỳ cấu trúc và kỹ thuật nào họ muốn, miễn là Daily Scrum tập trung vào tiến độ hướng tới Sprint Goal và tạo ra một kế hoạch hành động được cho ngày làm việc kế tiếp."')}
— ${ng('https://scrumguides.org/scrum-guide.html', 'The Scrum Guide, 11/2020')}</blockquote>
<p>${t(
    'Three things students usually miss. First, the 2020 Guide <strong>removed</strong> the famous three questions ("yesterday / today / blockers") — they are one possible structure, not the rule. Second, it is <em>for the Developers</em>: it is not a status report to the leader. Third, its output is a <em>plan</em>, so a standup where nothing changes in anyone’s next day was a ritual, not a Daily Scrum.',
    'Ba điều sinh viên hay bỏ qua. Một, bản 2020 đã <strong>bỏ</strong> ba câu hỏi nổi tiếng ("hôm qua / hôm nay / vướng gì") — đó chỉ là một cấu trúc có thể dùng, không phải luật. Hai, nó là <em>cho các Developer</em>: không phải buổi báo cáo cho trưởng nhóm. Ba, đầu ra của nó là một <em>kế hoạch</em>, nên một buổi standup mà không ai đổi gì cho ngày mai là một nghi thức, không phải Daily Scrum.')}</p>

<h3>${t('Everyday picture: a restaurant kitchen before service', 'Liên tưởng đời thường: bếp nhà hàng trước giờ mở cửa')}</h3>
<p>${t(
    'The head chef does not ask each cook "what did you chop yesterday". She looks at the pass: which dishes are almost out, which one is stuck because the fish has not arrived, who is free to help. Then everyone goes back to their station. That is "walking the board": start from the column closest to done and ask what stops each card from moving right.',
    'Bếp trưởng không hỏi từng người "hôm qua thái được bao nhiêu hành". Chị nhìn quầy ra món: món nào sắp xong, món nào kẹt vì cá chưa về, ai đang rảnh để phụ. Rồi ai về bếp nấy. Đó là "đi bảng": bắt đầu từ cột gần xong nhất, hỏi điều gì làm mỗi thẻ chưa sang phải được.')}</p>

<h3>${t('Two formats — and the one for a student team', 'Hai cách tổ chức — và cách cho nhóm sinh viên')}</h3>
${bang([t('Format', 'Cách'), t('How', 'Làm thế nào'), t('Good at', 'Tốt ở'), t('Weak at', 'Yếu ở')], [
    [t('Round-robin, three questions', 'Lần lượt từng người, ba câu'), t('Each person: yesterday, today, blockers', 'Mỗi người: hôm qua, hôm nay, vướng gì'), t('Easy to start; everyone speaks', 'Dễ bắt đầu; ai cũng lên tiếng'), t('Becomes a status report; stuck cards hide behind "carrying on"', 'Thành báo cáo; thẻ kẹt trốn sau câu "làm tiếp"')],
    [t('Walk the board, right to left', 'Đi bảng từ phải sang trái'), t('In Review → In Progress → To Do; per card: what stops it moving?', 'In Review → In Progress → To Do; mỗi thẻ: cái gì làm nó chưa sang phải?'), t('Focus on finishing; PRs waiting for review surface first', 'Tập trung làm xong; PR chờ review lộ ra đầu tiên'), t('Needs an up-to-date board', 'Cần bảng được cập nhật')],
    [t('Written async + short live sync', 'Viết bất đồng bộ + họp ngắn'), t('Mon/Wed/Fri: written before 21:45; leader prepares from data; live 15 min once a week', 'T2/T4/T6: viết trước 21:45; trưởng nhóm chuẩn bị từ dữ liệu; họp 15 phút mỗi tuần một lần'), t('Fits students with different class and part-time schedules', 'Hợp với sinh viên lịch học và làm thêm khác nhau'), t('Text can lie politely — needs a check against data', 'Chữ có thể "nói dối lịch sự" — cần soát với dữ liệu')],
  ])}
<p>${t(
    'LabFlow uses the third format (it was agreed in the working agreement of ', 'LabFlow dùng cách thứ ba (đã ghi trong thoả thuận làm việc ở ') + ag('agl-1-5-lab', t('lesson 1.5', 'bài 1.5')) + t(
    '): a daily written in the #daily channel on Monday, Wednesday and Friday before 21:45, three lines each — what moved, what next, what blocks. The leader does not "chair" it; the leader <strong>reads it against the board</strong>, which is what the script below does.',
    '): daily viết trong kênh #daily vào thứ Hai, Tư, Sáu trước 21:45, mỗi người ba dòng — cái gì đã nhích, làm gì tiếp, vướng gì. Trưởng nhóm không "chủ trì"; trưởng nhóm <strong>đọc nó đối chiếu với bảng</strong>, đúng việc script dưới đây làm.')}</p>

<h3>${t('Five rules that keep it at 10 minutes', 'Năm luật giữ nó ở 10 phút')}</h3>
<ol>
<li>${t('<strong>Name a card.</strong> Every line mentions a ticket, screen or PR (LF-44, S30, #39). "Carrying on" is not an update.', '<strong>Gọi tên thẻ.</strong> Dòng nào cũng nêu ticket, màn hoặc PR (LF-44, S30, #39). "Làm tiếp" không phải là cập nhật.')}</li>
<li>${t('<strong>"Blocked" means: something will stop me within 24 hours</strong> — a missing API, a question nobody answered, a library you do not understand. Not knowing how is a blocker.', '<strong>"Vướng" nghĩa là: có thứ sẽ làm mình dừng trong 24 giờ tới</strong> — thiếu API, câu hỏi chưa ai trả lời, thư viện chưa hiểu. Không biết làm thế nào cũng là vướng.')}</li>
<li>${t('<strong>"Not started" is an acceptable answer.</strong> If the team punishes honesty, it will get "almost done".', '<strong>"Chưa bắt đầu" là câu trả lời được chấp nhận.</strong> Nhóm nào phạt sự thật sẽ nhận được "sắp xong".')}</li>
<li>${t('<strong>No solving during the daily.</strong> Anything longer than one sentence goes to the "after" list: two people, right after.', '<strong>Không giải quyết trong daily.</strong> Cái gì dài hơn một câu thì vào danh sách "sau daily": hai người, ngay sau đó.')}</li>
<li>${t('<strong>Finish before you start.</strong> Reviewing a waiting PR beats opening a new card (WIP, ', '<strong>Làm xong trước khi bắt đầu.</strong> Review một PR đang chờ tốt hơn mở thẻ mới (WIP, ') + ag('agl-1-3-kanban', t('lesson 1.3', 'bài 1.3')) + ').'}</li>
</ol>

<h3>${t('Lab: prepare the daily from data', 'Lab: chuẩn bị daily từ dữ liệu')}</h3>
<p>${t(
    'The data is sprint 2 of LabFlow (iteration 2: 15/02–05/03/2027, three weeks, the sprint calendar from lesson 1.5): 13 tickets exported from CT Work as CSV, and an event log — the same facts the board and GitHub already hold (started, commit, PR, review, merge, blocked, absent). It is a simulation, but every number below is computed by the script, not typed.',
    'Dữ liệu là sprint 2 của LabFlow (iteration 2: 15/02–05/03/2027, ba tuần, lịch sprint ở bài 1.5): 13 ticket xuất từ CT Work dạng CSV, và một nhật ký sự kiện — đúng những sự việc mà bảng và GitHub vốn đã ghi (bắt đầu, commit, PR, review, merge, bị chặn, vắng). Đây là dữ liệu mô phỏng, nhưng mọi con số dưới đây đều do script tính, không gõ tay.')}</p>
${out(dauSuKien + '\n…')}
<p>${t('A small library turns the log into the board at any moment (used by every script in this chapter):', 'Một thư viện nhỏ biến nhật ký thành bảng ở bất kỳ thời điểm nào (mọi script trong chương dùng chung):')}</p>
${giai(t('lib.mjs', 'lib.mjs'), js(MA.lib))}
<p>${t('The standup preparation script: walk the board right to left, raise signals, then check each written update against the same data.', 'Script chuẩn bị standup: đi bảng từ phải sang trái, bật tín hiệu, rồi soát từng bản cập nhật viết tay với chính dữ liệu đó.')}</p>
${js(MA.standup)}

<h4>${t('Friday 19/02 — day 5', 'Thứ Sáu 19/02 — ngày thứ 5')}</h4>
${out(MA.standup19)}
${out(RA.standup19)}
<p>${t(
    'C4 posted "blocked: need to read a QR code with the camera in the browser" on the <em>board</em> on 18/02 — and then wrote "carrying on with S30" in the daily. Nobody reads the board at 21:30; everybody reads the chat. C5 did not post at all, and LF-25 has had no commit since 16/02.',
    'C4 đã ghi "bị chặn: cần đọc QR bằng camera trên trình duyệt" lên <em>bảng</em> ngày 18/02 — rồi viết "làm tiếp S30" trong daily. Lúc 21:30 không ai đọc bảng; ai cũng đọc chat. C5 không gửi gì, và LF-25 không có commit nào từ 16/02.')}</p>

<h4>${t('Monday 22/02 — day 6', 'Thứ Hai 22/02 — ngày thứ 6')}</h4>
${out(MA.standup22)}
${out(RA.standup22)}
<p>${t(
    'Two classic sentences, both caught by comparing words with data. C4: "not blocked" — while the board says blocked since 18/02 and there has been no commit for three working days. C5: "almost done" — on a ticket with 18 committed lines, the last one six days ago. Neither is necessarily lying; "not blocked" often means "I do not want to bother anyone", and "almost done" often means "I hope to finish this weekend". The leader’s job is not to accuse; it is to ask the right question in private, today.',
    'Hai câu kinh điển, đều bị bắt nhờ so lời với dữ liệu. C4: "không vướng" — trong khi bảng ghi bị chặn từ 18/02 và ba ngày làm việc không có commit. C5: "sắp xong" — trên một ticket mới có 18 dòng commit, lần cuối sáu ngày trước. Không ai nhất thiết đang nói dối; "không vướng" thường nghĩa là "mình không muốn làm phiền ai", "sắp xong" thường nghĩa là "mình mong cuối tuần làm kịp". Việc của trưởng nhóm không phải buộc tội; mà là hỏi đúng câu, riêng tư, ngay hôm nay.')}</p>
<p>${t('What actually happened that evening (from the log): ', 'Tối đó thật sự đã xảy ra gì (theo nhật ký): ')}<em>${t('21:45 — asked C4 after the daily: stuck on QR since 18/02; booked C3 (who needs QR for S28) to sit with C4 on 23/02. 22:30 — C4 unblocked: one shared QR component.', '21:45 — hỏi C4 sau daily: kẹt QR từ 18/02; hẹn C3 (cũng cần QR cho S28) ngồi cùng C4 ngày 23/02. 22:30 — C4 gỡ chặn: dùng chung một component QR.')}</em> ${t('C5 got a 1:1 the next day — that story is in ', 'C5 được hẹn 1:1 hôm sau — câu chuyện đó ở ')}${ag('agl-6-5-thanh-vien', t('lesson 6.5', 'bài 6.5'))}.</p>

<h4>${t('Friday 26/02 — and the bug in the first version', 'Thứ Sáu 26/02 — và lỗi của bản đầu')}</h4>
<p>${t(
    'The first version of the script counted plain working days. On 26/02 it reported C2 as "4 working days without a commit" and "says not blocked but data shows ⚠". C2 had announced in the 22/02 daily that C2 would sit midterm exams on Wednesday and Thursday. A leader who forwards that warning has just accused a teammate who did everything right. The fix: subtract absences that were announced in advance (an event of type <code>vang</code>). Same day, both versions:',
    'Bản đầu của script đếm ngày làm việc trần. Ngày 26/02 nó báo C2 "4 ngày làm việc không commit" và "nói không vướng nhưng dữ liệu có ⚠". C2 đã báo trong daily 22/02 rằng thứ Tư, thứ Năm bạn thi giữa kỳ. Trưởng nhóm nào chuyển tiếp cảnh báo đó là vừa buộc tội một người làm đúng mọi thứ. Cách sửa: trừ những ngày vắng đã báo trước (sự kiện loại <code>vang</code>). Cùng một ngày, hai phiên bản:')}</p>
${out('$ node standup.mjs 2027-02-26 --khong-tru-vang\n' + RA.standup26Oan)}
${out('$ node standup.mjs 2027-02-26\n' + RA.standup26)}
${cl('warn', `<p>${t(
    '<strong>A script prepares questions; it does not deliver verdicts.</strong> Never post the ⚠ list in the group chat. Numbers without context (exams, illness, a task with no code like design or test data) produce false alarms, and one public false alarm costs more trust than ten missed signals.',
    '<strong>Script chuẩn bị câu hỏi; nó không tuyên án.</strong> Đừng bao giờ dán danh sách ⚠ lên nhóm chat. Con số thiếu ngữ cảnh (thi, ốm, việc không ra mã như thiết kế hay dữ liệu test) sinh báo động giả, và một lần báo động giả công khai tốn nhiều niềm tin hơn mười tín hiệu bị bỏ sót.')}</p>`)}

<h3>${t('The five minutes after the daily', 'Năm phút sau daily')}</h3>
${bang([t('Signal', 'Tín hiệu'), t('Leader does, the same evening', 'Trưởng nhóm làm, ngay tối đó')], [
    [t('PR waiting for a reviewer ≥ 1 working day', 'PR chờ người duyệt ≥ 1 ngày làm việc'), t('Ping the assigned reviewer by name (rule R2-2), or review it yourself', 'Gọi tên người duyệt được giao (luật R2-2), hoặc tự review')],
    [t('Card blocked (on the board)', 'Thẻ bị chặn (trên bảng)'), t('Find who can unblock; book a 30-minute pairing, write it on the card', 'Tìm người gỡ được; hẹn ngồi cùng 30 phút, ghi lên thẻ')],
    [t('Card ≥ 3 working days without a commit', 'Thẻ ≥ 3 ngày làm việc không commit'), t('Private message, one question: "where are you stuck, what do you need?"', 'Nhắn riêng, một câu hỏi: "cậu đang kẹt chỗ nào, cần gì?"')],
    [t('Someone with nothing in progress', 'Có người không có thẻ nào đang làm'), t('Point them at review → pairing → stretch card, in that order (exercise below)', 'Chỉ họ sang review → ngồi cùng → thẻ dự phòng, theo thứ tự đó (bài tập dưới)')],
    [t('No daily posted', 'Không gửi daily'), t('Nothing public. If it repeats, see the escalation ladder in 6.5', 'Không nói công khai. Lặp lại thì xem bậc thang ở 6.5')],
  ])}

<h3>${t('At work: the daily at a company', 'Khi đi làm: daily ở công ty')}</h3>
<p>${t(
    'At FPT Software or any Scrum team you will join a 15-minute call, often in English, sometimes with the client. Three habits will mark you as reliable in week one: say the ticket ID, say "blocked" the day it happens (not the day before the deadline — the hourensou habit of ',
    'Ở FPT Software hay bất kỳ đội Scrum nào, bạn sẽ vào một cuộc gọi 15 phút, thường bằng tiếng Anh, đôi khi có khách. Ba thói quen giúp bạn được tin ngay tuần đầu: nói mã ticket, nói "blocked" ngay ngày bị kẹt (không phải ngày trước hạn — thói quen hourensou ở ') + ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7')) + t(
    '), and take long topics offline ("can we take this after the call?"). If you are the one who has been silent for three days, the best move is to post the blocker yourself before anyone asks.',
    '), và đưa chủ đề dài ra ngoài cuộc họp ("mình bàn cái này sau cuộc gọi nhé?"). Nếu bạn là người im lặng ba ngày, nước đi tốt nhất là tự viết ra chỗ vướng trước khi có ai hỏi.')}</p>

<h3>🧪 ${t('Practice (20 minutes)', 'Thực hành (20 phút)')}</h3>
<p>${t(
    'On 19/02 C3 had finished S26 and had nothing in progress. Extend the preparation with one line per idle person: what should they do next? Order: (1) review a PR that is waiting for a reviewer, (2) sit with the owner of a blocked or stalled card, (3) take one of their own stretch cards. Run it for 19/02 and 26/02.',
    'Ngày 19/02 C3 đã xong S26 và không có thẻ nào đang làm. Mở rộng phần chuẩn bị bằng một dòng cho mỗi người đang rảnh: họ nên làm gì tiếp? Thứ tự: (1) review PR đang chờ người duyệt, (2) ngồi cùng chủ một thẻ bị chặn hoặc đang đứng, (3) nhận thẻ dự phòng của chính mình. Chạy cho 19/02 và 26/02.')}</p>
${giai(t('Solution and real output', 'Lời giải và output thật'), `${js(MA.baiTap61)}
${out('$ node bai-tap-61.mjs 2027-02-19 2027-02-26\n' + RA.baiTap61)}
<p>${t(
    'On 19/02 the suggestion list starts with "review PR #34" and "sit with C4 on LF-44" — the exact two things that, done on Friday, would have saved C4 two days. In the real sprint C3 took the stretch card LF-28 on 22/02 instead. Taking new work is the instinct; finishing the team’s work is the job.',
    'Ngày 19/02 danh sách gợi ý bắt đầu bằng "review PR #34" và "ngồi cùng C4 ở LF-44" — đúng hai việc mà nếu làm từ thứ Sáu đã tiết kiệm cho C4 hai ngày. Trong sprint thật C3 lại nhận thẻ dự phòng LF-28 ngày 22/02. Nhận việc mới là bản năng; làm xong việc của cả nhóm mới là nhiệm vụ.')}</p>`)}

${phongVan([
    [t('"How do you run a daily standup?"', '"Bạn điều hành daily standup thế nào?"'), t('As a 15-minute check on the Sprint Goal, not a status report. In my student team we wrote it three times a week before 21:45; I read it against the board and PR list, so I knew which card was stuck before anyone said so, and I followed up privately the same evening.', 'Như một lần soát 15 phút hướng về Sprint Goal, không phải báo cáo. Nhóm đồ án của tôi viết daily ba lần mỗi tuần trước 21:45; tôi đọc đối chiếu với bảng và danh sách PR, nên biết thẻ nào kẹt trước khi có người nói, và hỏi riêng ngay tối đó.')],
    [t('"A teammate says \'no blockers\' every day but nothing moves. What do you do?"', '"Một bạn ngày nào cũng nói \'không vướng\' nhưng việc không nhích. Bạn làm gì?"'), t('Ask privately, with facts: "LF-44 has had no commit since the 17th — where are you stuck?" In our case the answer was a camera API for QR scanning; pairing with the teammate who needed the same thing unblocked it the same night.', 'Hỏi riêng, kèm sự việc: "LF-44 không có commit từ ngày 17 — cậu đang kẹt chỗ nào?" Trường hợp của chúng tôi là API camera để quét QR; ghép cặp với bạn cũng cần thứ đó gỡ được ngay tối hôm đó.')],
    [t('"Did the three questions disappear from Scrum?"', '"Ba câu hỏi đã biến khỏi Scrum à?"'), t('From the 2020 Scrum Guide, yes. The team chooses any structure as long as it inspects progress toward the Sprint Goal and ends with a plan for the next day. We used walking the board right to left because it surfaces PRs waiting for review first.', 'Khỏi Scrum Guide 2020 thì có. Đội tự chọn cấu trúc, miễn là soát tiến độ hướng tới Sprint Goal và kết thúc bằng kế hoạch cho ngày kế tiếp. Chúng tôi dùng đi bảng từ phải sang trái vì nó làm lộ PR chờ review trước tiên.')],
    [t('"Isn’t tracking commits per person micromanagement?"', '"Theo dõi commit từng người có phải quản lý vi mô không?"'), t('It would be if used as a scoreboard. I used it only to decide whom to ask a question, privately, and I fixed the script when it wrongly flagged someone who was sitting exams.', 'Sẽ là vậy nếu dùng như bảng xếp hạng. Tôi chỉ dùng nó để quyết định hỏi ai, hỏi riêng, và đã sửa script khi nó báo nhầm một bạn đang đi thi.')],
  ], en)}

${thuatNgu([
    ['Daily Scrum / standup', t('15-minute event to inspect progress toward the Sprint Goal and plan the next day.', 'Sự kiện 15 phút soát tiến độ hướng tới Sprint Goal và lên kế hoạch ngày kế tiếp.')],
    [t('walk the board', 'đi bảng'), t('Go through cards from the column closest to done, asking what stops each one.', 'Đi qua các thẻ từ cột gần xong nhất, hỏi điều gì đang chặn từng thẻ.')],
    [t('blocker', 'vướng / blocker'), t('Anything that will stop your work within a day.', 'Bất cứ thứ gì sẽ làm bạn dừng việc trong một ngày tới.')],
    [t('async standup', 'standup bất đồng bộ'), t('Written update at an agreed time instead of a call.', 'Cập nhật bằng chữ vào giờ đã thống nhất thay cho cuộc gọi.')],
    [t('parking lot', 'danh sách "sau daily"'), t('Topics moved out of the daily to a short follow-up between the people concerned.', 'Chủ đề đưa ra khỏi daily để những người liên quan bàn ngắn ngay sau đó.')],
  ], en)}

${tomTat([
    t('The Daily Scrum inspects progress toward the Sprint Goal and ends with a plan; since 2020 the three questions are optional.', 'Daily Scrum soát tiến độ hướng tới Sprint Goal và kết thúc bằng kế hoạch; từ 2020 ba câu hỏi chỉ là tuỳ chọn.'),
    t('For a student team: written daily Mon/Wed/Fri before 21:45, every line names a ticket, "not started" is acceptable.', 'Cho nhóm sinh viên: daily viết T2/T4/T6 trước 21:45, dòng nào cũng gọi tên ticket, "chưa bắt đầu" là câu được chấp nhận.'),
    t('Read the words against the data: "not blocked" with a blocked card, "almost done" with 18 lines — ask privately the same evening.', 'Đọc lời đối chiếu dữ liệu: "không vướng" khi thẻ bị chặn, "sắp xong" với 18 dòng — hỏi riêng ngay tối đó.'),
    t('Data without context accuses innocent people: the first script flagged a teammate who was sitting exams. Subtract announced absences; never post the warning list.', 'Dữ liệu thiếu ngữ cảnh buộc tội người vô can: bản đầu script báo nhầm một bạn đang thi. Trừ ngày vắng đã báo; không bao giờ dán danh sách cảnh báo.'),
    t('Idle people review and pair before they start new cards.', 'Người đang rảnh review và ngồi cùng trước khi mở thẻ mới.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-6-2-planning-retro', t('6.2 — Planning and retrospectives that change something', '6.2 — Planning và retro thay đổi được điều gì đó'))}.</p>
`);
};

export default {
  title: '6.1 — Standups that take 10 minutes|||6.1 — Standup 10 phút',
  slug: 'agl-6-1-standup',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Daily Scrum theo Scrum Guide 2020 (soát tiến độ hướng Sprint Goal, ra kế hoạch; ba câu hỏi đã thành tuỳ chọn); ba cách tổ chức và cách cho nhóm SV (viết T2/T4/T6 trước 21:45); năm luật giữ 10 phút; lab chạy thật standup.mjs trên dữ liệu sprint 2 LabFlow: đi bảng từ phải sang trái, bắt "không vướng" khi thẻ bị chặn và "sắp xong" với 18 dòng commit, bản đầu đổ oan bạn đi thi; năm phút sau daily; bài tập người rảnh làm gì.',
  content: L61(true) + L61(false),
};
