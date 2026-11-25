/**
 * 6.5 — Khi một thành viên trễ, im lặng hoặc xung đột (agl-6-5-thanh-vien — BÀI MỚI thêm vào khung, slug không trùng). Soạn 24/11/2026, agent agt.
 * Mục 0 (bài 0.8) đã hứa: "Chương 6 và bài 12.2 cho bạn kịch bản nói chuyện với C5".
 * Lab chạy THẬT (scratchpad/agt/lab/ch6): canh-bao-som.mjs (chạy lại sprint từng ngày 21:30: IM LẶNG / THẺ ĐỨNG / KHÔNG GỬI STANDUP ⇒ bậc thang;
 * so ngày đề nghị với ngày nhóm thật sự hành động; nhật ký sự việc của C5), soat-bao-cao.mjs trên thư báo giảng viên (8/8).
 * Mẫu: mau/ghi-chu-1-1.md. Nguồn: Tuckman 1965 (Wikipedia), mô hình SBI của Center for Creative Leadership.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L65 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.5', 'Chương 6 · Bài 6.5', `
<h2>${t('6.5 — When a teammate is late, silent or in conflict', '6.5 — Khi một thành viên trễ, im lặng hoặc xung đột')}</h2>
<p class="lead">${t(
    'This is the part of being a leader nobody teaches and every student leader meets: one member goes quiet, another writes "almost done" for a week, two others argue in a pull request. Most first-time leaders choose one of two bad options — say nothing and do the work themselves at 2 am, or complain in the group chat. This lesson gives you a third option: notice early from data, talk privately with facts, agree a checkpoint with a date, and escalate step by step with a written record.',
    'Đây là phần của việc làm trưởng nhóm mà không ai dạy và trưởng nhóm sinh viên nào cũng gặp: một bạn im lặng, một bạn viết "sắp xong" suốt một tuần, hai bạn khác cãi nhau trong pull request. Đa số trưởng nhóm lần đầu chọn một trong hai cách tệ — im lặng và tự làm thay lúc 2 giờ sáng, hoặc than phiền trên nhóm chat. Bài này cho bạn cách thứ ba: nhận ra sớm từ dữ liệu, nói chuyện riêng bằng sự việc, thống nhất một mốc kiểm có ngày, và báo lên từng bậc kèm ghi chép.')}</p>

<h3>${t('First: conflict is normal', 'Trước hết: xung đột là bình thường')}</h3>
<p>${t(
    'In 1965 Bruce Tuckman described the stages a small group goes through: forming, <strong>storming</strong>, norming, performing (', 'Năm 1965 Bruce Tuckman mô tả các giai đoạn một nhóm nhỏ đi qua: hình thành, <strong>bão tố</strong>, ổn định chuẩn mực, vận hành (') + ng('https://en.wikipedia.org/wiki/Tuckman%27s_stages_of_group_development', 'Tuckman’s stages') + t(
    '). The storm usually arrives around the first real deadline — for SWP391, iteration 2. A team without any friction is often a team where people do not care enough to disagree. Your job is not to prevent conflict; it is to keep it about the work and to end each storm with a written rule (a norm).',
    '). Cơn bão thường tới quanh hạn chót thật đầu tiên — với SWP391 là iteration 2. Một nhóm không hề va chạm thường là nhóm mà không ai đủ quan tâm để bất đồng. Việc của bạn không phải ngăn xung đột; mà là giữ nó ở chuyện công việc và kết thúc mỗi cơn bão bằng một luật viết ra (một chuẩn mực).')}</p>

<h3>${t('Everyday picture: the shared room', 'Liên tưởng đời thường: phòng trọ chung')}</h3>
<p>${t(
    'When a roommate stops doing the dishes, posting "some people never wash anything 🙄" in the house chat makes everything worse. What works: talk to them alone, say what you saw ("the dishes from Monday are still there"), say how it affects you, ask what is going on — maybe they work night shifts now — and agree something you can both check ("you take the weekend, I take weekdays"). Leading a five-person team is the same conversation with tickets instead of dishes.',
    'Khi bạn cùng phòng thôi rửa bát, đăng lên nhóm phòng "có người chẳng bao giờ rửa gì 🙄" chỉ làm mọi thứ tệ hơn. Cách hiệu quả: nói riêng, nói điều mình thấy ("bát từ thứ Hai vẫn còn"), nói nó ảnh hưởng tới mình thế nào, hỏi có chuyện gì — có khi bạn ấy mới đi làm ca đêm — và thống nhất một điều cả hai kiểm được ("cậu rửa cuối tuần, tớ rửa ngày thường"). Điều hành nhóm năm người là đúng cuộc nói chuyện đó, với ticket thay cho bát.')}</p>

<h3>${t('Five causes, five different responses', 'Năm nguyên nhân, năm cách đáp khác nhau')}</h3>
<p>${t('"Not doing their part" looks the same from outside and has very different causes. Ask before you act.', '"Không làm phần của mình" nhìn từ ngoài thì giống nhau nhưng nguyên nhân rất khác nhau. Hỏi trước khi làm.')}</p>
${bang([t('Cause', 'Nguyên nhân'), t('What you hear', 'Bạn nghe được gì'), t('Response', 'Cách đáp')], [
    [t('Does not know how', 'Không biết làm'), t('"almost done", silence, no questions', '"sắp xong", im lặng, không hỏi gì'), t('Pair for an hour; split the ticket; make "I don’t know" safe to say', 'Ngồi cùng một giờ; chia nhỏ ticket; làm cho câu "mình không biết" an toàn để nói')],
    [t('Has no time', 'Không có thời gian'), t('part-time job, other courses, family', 'đi làm thêm, môn khác, gia đình'), t('Re-plan with real capacity; move work, keep a fair share of screens', 'Lập lại kế hoạch theo năng lực thật; dời việc, vẫn giữ phần màn công bằng')],
    [t('Does not know what is expected', 'Không rõ được giao gì'), t('"I thought someone else was doing it"', '"mình tưởng bạn khác làm"'), t('One owner per card, written acceptance criteria (lessons 0.1, 2.1)', 'Mỗi thẻ một chủ, tiêu chí chấp nhận viết ra (bài 0.1, 2.1)')],
    [t('Does not want to', 'Không muốn làm'), t('repeated missed checkpoints after help', 'trượt mốc kiểm nhiều lần dù đã được giúp'), t('Escalation ladder to the supervisor (below)', 'Bậc thang báo lên giảng viên (dưới đây)')],
    [t('Conflict with someone', 'Xung đột với ai đó'), t('sharp PR comments, avoiding someone', 'bình luận PR gay gắt, né một người'), t('Move from text to a short call; decide a rule about the work', 'Chuyển từ chữ sang một cuộc gọi ngắn; chốt một luật về công việc')],
  ])}

<h3>${t('The escalation ladder', 'Bậc thang xử lý')}</h3>
${bang([t('Step', 'Bậc'), t('When (signal lasts…)', 'Khi nào (tín hiệu kéo dài…)'), t('What', 'Làm gì')], [
    ['1', t('3 working days', '3 ngày làm việc'), t('Private message the same day, one question, an offer of help', 'Nhắn riêng trong ngày, một câu hỏi, một lời đề nghị giúp')],
    ['2', t('5 working days', '5 ngày làm việc'), t('15-minute 1:1: fact → impact → ask → a checkpoint with a date; write notes', '1:1 15 phút: sự việc → tác động → hỏi → mốc kiểm có ngày; ghi chú')],
    ['3', t('Checkpoint missed', 'Trượt mốc kiểm'), t('Raise it at the team meeting with data; re-split work (do not secretly do it for them); tell the person first', 'Nêu ở họp nhóm bằng dữ liệu; chia lại việc (không âm thầm làm thay); báo người đó trước')],
    ['4', t('Still no change, or grades at risk', 'Vẫn không đổi, hoặc ảnh hưởng điểm'), t('Report to the supervisor: facts, what the team did, a proposal; the person knows beforehand', 'Báo giảng viên: sự việc, nhóm đã làm gì, đề xuất; người đó được biết trước')],
  ])}
${cl('danger', `<p>${t(
    '<strong>Do not secretly do their work.</strong> It feels kind and fast. It hides the problem from the supervisor, removes the member’s LOC evidence (SWP391 grades per person, by screen), burns out the leader, and makes the supervisor see "one person did everything" — which hurts the whole team’s credibility, including yours. Re-splitting work openly, at step 3, is different: everyone knows, and the record says why.',
    '<strong>Đừng âm thầm làm thay.</strong> Nó có vẻ tử tế và nhanh. Nó giấu vấn đề khỏi giảng viên, xoá bằng chứng LOC của thành viên đó (SWP391 chấm theo từng người, theo màn), vắt kiệt trưởng nhóm, và khiến giảng viên thấy "một người làm tất cả" — làm giảm uy tín cả nhóm, kể cả bạn. Chia lại việc công khai ở bậc 3 thì khác: ai cũng biết, và ghi chép nói rõ vì sao.')}</p>`)}

<h3>${t('Lab: would the data have told us earlier?', 'Lab: dữ liệu có báo sớm hơn không?')}</h3>
<p>${t(
    'The script replays sprint 2 day by day at 21:30 (the daily) and asks, for each person: silent for 3+ working days (no event at all on the board or in git, announced absences subtracted)? a card in progress with no commit for 3+ days? no daily posted? It maps how long the signal has lasted to a step of the ladder, then prints what the team <em>actually</em> did and when.',
    'Script phát lại sprint 2 từng ngày lúc 21:30 (giờ daily) và hỏi với từng người: im lặng từ 3 ngày làm việc (không có sự kiện nào trên bảng hay git, đã trừ ngày vắng có báo)? có thẻ đang làm mà 3 ngày không commit? không gửi daily? Nó đổi độ dài của tín hiệu thành một bậc trên bậc thang, rồi in ra nhóm <em>thật sự</em> đã làm gì và lúc nào.')}</p>
${js(MA.canhBao)}
${out('$ node canh-bao-som.mjs C5\n' + RA.canhBao)}
<p>${t(
    'The data recommended step 1 for C5 on Friday 19/02. The team’s first action about C5 was the 1:1 on Tuesday 23/02 — two working days later, at which point the signal had already reached step 2. For C4 the team acted the same evening the signal appeared (22/02), because the standup preparation of lesson 6.1 put it on the screen. That difference is the argument for checking the data three times a week: not to judge people, but to stop the leader’s own lateness. In the sprint-2 retro the leader wrote exactly that in the Problem column (lesson 6.2).',
    'Dữ liệu đề nghị bậc 1 cho C5 từ thứ Sáu 19/02. Hành động đầu tiên của nhóm về C5 là buổi 1:1 thứ Ba 23/02 — trễ hai ngày làm việc, lúc tín hiệu đã lên bậc 2. Với C4 nhóm hành động ngay tối tín hiệu xuất hiện (22/02), vì phần chuẩn bị standup ở bài 6.1 đã đưa nó lên màn hình. Khác biệt đó là lý do nên soát dữ liệu ba lần mỗi tuần: không phải để phán xét người khác, mà để chặn sự chậm trễ của chính trưởng nhóm. Ở retro sprint 2, trưởng nhóm đã tự ghi đúng điều đó vào cột chưa tốt (bài 6.2).')}</p>
<p>${t(
    'The C5 log at the bottom is what you attach if you ever reach step 3 or 4: only dated facts — events, commits, what was posted in the daily — no adjectives. Note also what is <em>not</em> flagged: C2 during exam days, because the absence was announced.',
    'Nhật ký của C5 ở cuối là thứ bạn đính kèm nếu phải lên bậc 3 hoặc 4: chỉ sự việc có ngày — sự kiện, commit, điều đã viết trong daily — không tính từ. Để ý cả điều <em>không</em> bị báo: C2 trong những ngày thi, vì việc vắng đã được báo trước.')}</p>

<h3>${t('The 1:1: fact, impact, question, checkpoint', 'Buổi 1:1: sự việc, tác động, câu hỏi, mốc kiểm')}</h3>
<p>${t(
    'A useful structure is SBI — Situation, Behaviour, Impact — from the Center for Creative Leadership: describe the situation, the observable behaviour (what a camera would have recorded, not your interpretation), and its impact; then stop talking and ask. Add one thing for a project team: a checkpoint with a date that both of you can see without asking.',
    'Một cấu trúc hữu ích là SBI — Tình huống, Hành vi, Tác động (Situation, Behaviour, Impact) — của Center for Creative Leadership: tả tình huống, hành vi quan sát được (thứ một chiếc camera ghi lại được, không phải cách bạn diễn giải), và tác động của nó; rồi ngừng nói và hỏi. Thêm một điều cho nhóm dự án: một mốc kiểm có ngày mà cả hai cùng thấy được không cần hỏi.')}</p>
${bang([t('Instead of', 'Thay vì'), t('Say', 'Nói')], [
    [t('"Why are you so lazy?"', '"Sao cậu lười thế?"'), t('"LF-25 has had one 18-line commit since the 16th, and on the 22nd you wrote almost done."', '"LF-25 có một commit 18 dòng từ ngày 16, và ngày 22 cậu ghi sắp xong."')],
    [t('"You are letting everyone down."', '"Cậu làm cả nhóm thất vọng."'), t('"S24 is your only screen this iteration, and C2’s approval screen needs its cancel button for the demo."', '"S24 là màn duy nhất của cậu ở iteration này, và màn duyệt của C2 cần nút huỷ của nó để demo."')],
    [t('"Just finish it by Friday."', '"Thứ Sáu làm xong đi."'), t('"Where are you stuck? What would help?" … "So: PR for the cancel part on 03/03 — I will look for it on GitHub."', '"Cậu đang kẹt chỗ nào? Cái gì giúp được?" … "Vậy: PR phần huỷ ngày 03/03 — mình sẽ xem trên GitHub."')],
  ])}
${out(MA.motMot)}
<p>${t(
    'Two details in these notes matter. C5 said they had not asked because they were "afraid of asking a stupid question" — that is a team problem, not a C5 problem, and the fix (pairing, "not started" being acceptable) is the leader’s. And the personal reason is only shared with the supervisor because C5 agreed.',
    'Hai chi tiết trong ghi chú này quan trọng. C5 nói không hỏi vì "sợ hỏi câu ngớ ngẩn" — đó là vấn đề của nhóm, không phải của riêng C5, và cách sửa (ngồi cùng, chấp nhận câu "chưa bắt đầu") là việc của trưởng nhóm. Và lý do cá nhân chỉ được nêu với giảng viên vì C5 đã đồng ý.')}</p>

<h3>${t('Conflict between two members: PR #37', 'Xung đột giữa hai thành viên: PR #37')}</h3>
<p>${t(
    'On 25/02 C3 changed the QR component inside C4’s <code>muon-tra</code> folder as part of S28. C4 wrote a sharp review; C3 answered sharper. Four rules turned it back into a work problem:',
    'Ngày 25/02, trong PR của S28, C3 sửa component QR nằm trong thư mục <code>muon-tra</code> của C4. C4 viết một review gay gắt; C3 trả lời gay gắt hơn. Bốn luật đưa nó trở lại thành một vấn đề công việc:')}</p>
<ol>
<li>${t('<strong>Two exchanges, then a call.</strong> Text strips tone; after the second sharp comment, the leader proposed 15 minutes the next morning.', '<strong>Hai lượt chữ, rồi gọi.</strong> Chữ làm mất giọng điệu; sau bình luận gay gắt thứ hai, trưởng nhóm đề nghị 15 phút sáng hôm sau.')}</li>
<li>${t('<strong>Talk about the code, not the person.</strong> "Who owns shared components?" instead of "you touched my files".', '<strong>Nói về mã, không nói về người.</strong> "Ai giữ component dùng chung?" thay vì "cậu đụng vào tệp của tớ".')}</li>
<li>${t('<strong>The leader asks, does not judge.</strong> Each side explains what they need; the leader repeats it back until both agree it is accurate.', '<strong>Trưởng nhóm hỏi, không phân xử.</strong> Mỗi bên nói mình cần gì; trưởng nhóm nhắc lại tới khi cả hai đồng ý là đúng.')}</li>
<li>${t('<strong>End with a rule, written where the code is.</strong> Decision (26/02 09:00): the QR component moves to <code>fe/src/chung</code>, C3 owns it in CODEOWNERS, C4 uses it (retro action R2-3, mechanism from ', '<strong>Kết thúc bằng một luật, ghi ngay nơi có mã.</strong> Quyết định (26/02 09:00): component QR chuyển vào <code>fe/src/chung</code>, C3 là chủ trong CODEOWNERS, C4 dùng nó (hành động retro R2-3, cơ chế ở ') + ag('agl-4-4-checklist', t('lesson 4.4', 'bài 4.4')) + t('). PR #37 merged the same day; S30 merged on 03/03.', '). PR #37 merge ngay hôm đó; S30 merge ngày 03/03.')}</li>
</ol>
<p>${t('How to receive a sharp review without escalating it is in ', 'Cách nhận một review gay gắt mà không làm nó căng thêm ở ')}${ag('agl-4-3-nhan-review', t('lesson 4.3', 'bài 4.3'))}.</p>

<h3>${t('Step 4: writing to the supervisor', 'Bậc 4: viết cho giảng viên')}</h3>
<p>${t(
    'LabFlow never needed step 4 — C5’s PR arrived on the agreed day. But write the message <em>before</em> you need it, so you know what facts you will need to have collected. A draft, checked by the same 8 rules as the weekly report:',
    'LabFlow chưa bao giờ phải lên bậc 4 — PR của C5 tới đúng ngày đã hẹn. Nhưng hãy viết thư <em>trước</em> khi cần tới, để biết mình phải thu thập những sự việc nào. Một bản nháp, soát bằng đúng 8 luật như báo cáo tuần:')}</p>
${out(MA.baoGv)}
${out('$ node soat-bao-cao.mjs du-lieu/bao-gv-c5.md\n' + RA.baoGv)}
<p>${t(
    'What the supervisor can do that you cannot: talk to the member with the authority of the grade, change the division of work officially, and record it before grading. What the supervisor needs from you: dates, what was tried, and that the member was told first. A message that arrives in week 9 with no record ("they never did anything") gives the supervisor nothing to act on.',
    'Điều giảng viên làm được mà bạn không làm được: nói chuyện với thành viên bằng thẩm quyền của người chấm điểm, đổi phân công một cách chính thức, và ghi nhận trước khi chấm. Điều giảng viên cần ở bạn: ngày tháng, những gì đã thử, và việc thành viên đã được báo trước. Một tin nhắn tới ở tuần 9 mà không có ghi chép ("bạn ấy chẳng làm gì") không cho giảng viên căn cứ nào để hành động.')}</p>

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'At OJT you will not lead — but you will be on both sides of this lesson. If you are the one who is stuck, post it before anyone has to ask (hourensou, ', 'Khi OJT bạn sẽ chưa làm trưởng nhóm — nhưng bạn sẽ ở cả hai phía của bài này. Nếu bạn là người đang kẹt, hãy tự nói ra trước khi có ai phải hỏi (hourensou, ') + ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7')) + t(
    '). If a colleague does not deliver something you depend on, tell them first, then your leader — with the ticket, the date and the impact — and never go around them to the client. Companies have the same ladder, with names: a 1:1, a performance conversation, an improvement plan, HR. Seeing it once as a student makes it much less frightening.',
    '). Nếu một đồng nghiệp không giao phần bạn phụ thuộc vào, hãy nói với họ trước, rồi tới leader — kèm ticket, ngày và tác động — và không bao giờ vòng qua họ để nói với khách. Công ty cũng có đúng bậc thang đó, với tên gọi khác: 1:1, buổi trao đổi về hiệu suất, kế hoạch cải thiện, phòng nhân sự. Đã thấy nó một lần khi còn là sinh viên thì nó bớt đáng sợ đi nhiều.')}</p>

<h3>🧪 ${t('Practice (25 minutes)', 'Thực hành (25 phút)')}</h3>
<ol>
<li>${t('Role-play with a classmate: you are the leader in the 1:1 of 23/02; they are C5 and choose one of the five causes without telling you. Use SBI and end with a dated checkpoint. Swap roles.', 'Đóng vai với một bạn cùng lớp: bạn là trưởng nhóm trong buổi 1:1 ngày 23/02; bạn kia là C5 và tự chọn một trong năm nguyên nhân mà không nói trước. Dùng SBI và kết thúc bằng một mốc kiểm có ngày. Đổi vai.')}</li>
<li>${t('Suppose C5’s PR had not arrived on 03/03. Write the step-3 message to the team (re-splitting S24) — facts only, C5 told first.', 'Giả sử PR của C5 không tới ngày 03/03. Viết tin nhắn bậc 3 cho cả nhóm (chia lại S24) — chỉ sự việc, đã báo C5 trước.')}</li>
</ol>
${giai(t('A model step-3 message', 'Tin nhắn bậc 3 mẫu'), out(t(
    'LF-25 (S24): the checkpoint agreed at the 1:1 on 23/02 was a PR for the cancel part on 03/03; it did not arrive (I told C5 at 20:00 before posting this). To keep S25’s demo on 05/03: C5 keeps the cancel part and pairs with C1 tomorrow 20:00–21:00; the reschedule part moves to sprint 3, still owned by C5. Changed in LF-25. Objections before 22:00 tonight.',
    'LF-25 (S24): mốc kiểm thống nhất ở buổi 1:1 ngày 23/02 là PR phần huỷ trong ngày 03/03; PR chưa tới (mình đã báo C5 lúc 20:00 trước khi đăng tin này). Để giữ demo S25 ngày 05/03: C5 giữ phần huỷ và ngồi cùng C1 tối mai 20:00–21:00; phần đổi lịch chuyển sang sprint 3, vẫn do C5 làm. Đã sửa trong LF-25. Ai phản đối thì nói trước 22:00 tối nay.')) + `<p>${t('It keeps the screen with its owner (LOC and dignity), names the checkpoint, the impact and the new plan, and passes the message rules of lesson 6.4.', 'Nó giữ màn hình cho đúng chủ (LOC và thể diện), gọi tên mốc kiểm, tác động và kế hoạch mới, và qua được các luật tin nhắn của bài 6.4.')}</p>`)}

${phongVan([
    [t('"Tell me about a time a teammate was not pulling their weight."', '"Kể một lần một thành viên không làm tròn phần việc."'), t('STAR: a teammate’s only screen had no commits for seven working days and the daily said "almost done". I asked privately, then held a 15-minute 1:1 with facts. The cause was a new part-time job and a flow they did not understand. We paired for an hour, split the ticket, and agreed a PR date; the PR arrived on that date. I also learned to act on the first signal — I was two days late.', 'STAR: màn duy nhất của một bạn không có commit suốt bảy ngày làm việc, daily ghi "sắp xong". Tôi hỏi riêng, rồi 1:1 15 phút bằng sự việc. Nguyên nhân là bạn mới đi làm thêm và chưa hiểu một luồng xử lý. Chúng tôi ngồi cùng một giờ, chia nhỏ ticket, thống nhất ngày mở PR; PR tới đúng ngày. Tôi cũng học được phải hành động từ tín hiệu đầu tiên — tôi đã trễ hai ngày.')],
    [t('"How do you handle conflict between two team members?"', '"Bạn xử lý xung đột giữa hai thành viên thế nào?"'), t('Move it off text after two exchanges, talk about the work rather than the person, let each side state their need, and end with a written rule — in our case, a shared component with one owner in CODEOWNERS.', 'Chuyển khỏi chữ sau hai lượt, nói về công việc thay vì con người, để mỗi bên nói nhu cầu của mình, và kết thúc bằng một luật viết ra — trường hợp của chúng tôi là một component dùng chung có một chủ trong CODEOWNERS.')],
    [t('"Would you ever just do the work yourself?"', '"Có bao giờ bạn tự làm luôn phần đó không?"'), t('Not secretly. It hides the problem, removes the person’s evidence of work and burns out the leader. If work has to move, I re-split it openly, with the person told first and the reason recorded.', 'Không âm thầm. Nó giấu vấn đề, xoá bằng chứng làm việc của người đó và vắt kiệt trưởng nhóm. Nếu phải dời việc, tôi chia lại công khai, báo người đó trước và ghi lại lý do.')],
    [t('"When would you involve your manager or supervisor?"', '"Khi nào bạn kéo quản lý hay giảng viên vào?"'), t('After the steps I can take myself — private message, 1:1, a missed checkpoint raised with the team — or immediately if grades or a deadline are at risk. With dated facts, what we tried, a proposal, and the person informed beforehand.', 'Sau những bậc tôi tự làm được — nhắn riêng, 1:1, nêu mốc kiểm bị trượt với nhóm — hoặc ngay lập tức nếu điểm hay hạn chót bị đe doạ. Kèm sự việc có ngày, những gì đã thử, một đề xuất, và người đó được báo trước.')],
  ], en)}

${thuatNgu([
    [t('forming / storming / norming / performing', 'hình thành / bão tố / chuẩn mực / vận hành'), t('Tuckman’s (1965) stages of a small group; storming is normal.', 'Các giai đoạn của nhóm nhỏ theo Tuckman (1965); bão tố là bình thường.')],
    ['1:1', t('A private, short conversation between leader and one member.', 'Cuộc nói chuyện riêng, ngắn giữa trưởng nhóm và một thành viên.')],
    ['SBI', t('Situation – Behaviour – Impact: a way to give feedback with observable facts.', 'Tình huống – Hành vi – Tác động: cách góp ý bằng sự việc quan sát được.')],
    [t('checkpoint', 'mốc kiểm'), t('A dated, observable result both sides can see without asking.', 'Một kết quả có ngày, quan sát được, hai bên cùng thấy không cần hỏi.')],
    [t('escalation ladder', 'bậc thang báo lên'), t('Steps from private message to supervisor, each with a trigger.', 'Các bậc từ nhắn riêng tới giảng viên, mỗi bậc có điều kiện kích hoạt.')],
  ], en)}

${tomTat([
    t('Same symptom, five causes: cannot, no time, unclear, will not, conflict — ask before acting.', 'Cùng một biểu hiện, năm nguyên nhân: không biết, không có thời gian, không rõ, không muốn, xung đột — hỏi trước khi làm.'),
    t('Ladder: private message at 3 days, 1:1 with a dated checkpoint at 5, team meeting when it is missed, supervisor last — always telling the person first.', 'Bậc thang: nhắn riêng ở 3 ngày, 1:1 có mốc kiểm ở 5 ngày, họp nhóm khi trượt mốc, giảng viên sau cùng — luôn báo người đó trước.'),
    t('Data replay: the signal for C5 appeared on 19/02, the team acted on 23/02 — check the data to catch your own lateness.', 'Phát lại dữ liệu: tín hiệu về C5 có từ 19/02, nhóm hành động ngày 23/02 — soát dữ liệu để bắt chính sự chậm trễ của mình.'),
    t('Never secretly do their work; re-split openly with a record.', 'Đừng bao giờ âm thầm làm thay; chia lại công khai kèm ghi chép.'),
    t('Conflict: two text exchanges then a call, about the work, end with a written rule (CODEOWNERS for the QR component).', 'Xung đột: hai lượt chữ rồi gọi, nói về công việc, kết thúc bằng luật viết ra (CODEOWNERS cho component QR).'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-6-6-lab', t('6.6 — Lab: LabFlow’s communication kit', '6.6 — Lab: bộ giao tiếp của LabFlow'))}.</p>
`);
};

export default {
  title: '6.5 — When a teammate is late, silent or in conflict|||6.5 — Khi một thành viên trễ, im lặng hoặc xung đột',
  slug: 'agl-6-5-thanh-vien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Việc khó nhất của trưởng nhóm: Tuckman 1965 (bão tố là bình thường); năm nguyên nhân của "không làm" và cách đáp; bậc thang 4 bậc (nhắn riêng → 1:1 có mốc kiểm → họp nhóm → giảng viên), không âm thầm làm thay; lab chạy thật canh-bao-som.mjs phát lại sprint 2 từng ngày: tín hiệu về C5 từ 19/02, nhóm hành động 23/02; 1:1 theo SBI và ghi chú mẫu; xung đột C3–C4 ở PR #37 kết thúc bằng CODEOWNERS; thư báo giảng viên đạt 8/8 luật; tình huống OJT.',
  content: L65(true) + L65(false),
};
