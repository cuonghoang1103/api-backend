/**
 * 6.4 — Giao tiếp từ xa và bất đồng bộ (agl-6-4-tu-xa). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT (scratchpad/agt/lab/ch6): soat-tin-nhan.mjs (7 luật tin nhắn tự đủ; 6 tin nhắn nhóm 0/6 → bản viết lại 5/5),
 * kiem-camera.sh (Chrome 150 headless thật: cùng trang qua localhost có navigator.mediaDevices, qua IP LAN thì undefined — chữ lỗi nguyên văn).
 * Mẫu: mau/thoa-thuan-giao-tiep.md. Nguồn tra 24/11/2026: nohello.net; Yang et al., Nature Human Behaviour 2021 (61.182 nhân viên Microsoft);
 * CNN 17/05/2024 (Arup, deepfake 200 triệu HKD). Ranh giới: tin nhắn tiếng Anh ⇒ tak-4-5; múi giờ + biên bản với khách ⇒ agl-11-3; lừa đảo ⇒ agl-10-6.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, bash, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L64 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.4', 'Chương 6 · Bài 6.4', `
<h2>${t('6.4 — Remote and async communication', '6.4 — Giao tiếp từ xa và bất đồng bộ')}</h2>
<p class="lead">${t(
    'A student team is a remote team: five people, five schedules, one group chat that receives 200 messages a day and is read on a phone at 23:00. Most of the team’s misunderstandings are not about code — they are a "hey" with no question, a screenshot of an error nobody can search, a decision buried in chat that nobody can find three weeks later. This lesson gives you the rules of a self-sufficient message, checks real messages against them, and ends with the most expensive remote-communication failure on record.',
    'Nhóm sinh viên là một đội làm từ xa: năm người, năm lịch, một nhóm chat nhận 200 tin mỗi ngày và được đọc trên điện thoại lúc 23 giờ. Phần lớn hiểu lầm của nhóm không nằm ở mã — mà ở một chữ "ê" không kèm câu hỏi, một ảnh chụp lỗi không ai tìm kiếm được, một quyết định chìm trong chat mà ba tuần sau không ai tìm ra. Bài này đưa ra luật của tin nhắn tự đủ, soát tin nhắn thật theo luật đó, và kết thúc bằng vụ thất bại giao tiếp từ xa tốn kém nhất từng được ghi nhận.')}</p>
${note(t('Writing these messages in English (Slack/Teams with a foreign team) is ', 'Viết những tin nhắn này bằng tiếng Anh (Slack/Teams với đội nước ngoài) ở ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-4-5-chat', t('Technical English 4.5', 'Tiếng Anh kỹ thuật 4.5')) + t('; time zones, minutes and confirming in writing with clients are in ', '; múi giờ, biên bản và xác nhận bằng văn bản với khách ở ') + ag('agl-11-3-mui-gio-hop', t('lesson 11.3', 'bài 11.3')) + t('. This lesson: the team’s own channels and habits.', '. Bài này: kênh và thói quen của chính nhóm.'))}

<h3>${t('Everyday picture: a note on the fridge', 'Liên tưởng đời thường: tờ giấy dán tủ lạnh')}</h3>
<p>${t(
    '"Call me" on the fridge is useless if you are already asleep when your roommate reads it. "Landlord comes at 9:00 tomorrow to fix the tap — please be home or leave the key at the shop downstairs, reply before 22:00" works even if you never meet. Async messages are fridge notes: they must work without a conversation.',
    '"Gọi tao nhé" dán trên tủ lạnh là vô dụng nếu bạn đã ngủ khi bạn cùng phòng đọc nó. "Mai 9:00 chủ nhà tới sửa vòi nước — ở nhà giúp hoặc gửi chìa ở tiệm tạp hoá dưới nhà, trả lời trước 22:00 nhé" thì dùng được dù hai người không gặp nhau. Tin nhắn bất đồng bộ là tờ giấy dán tủ lạnh: phải dùng được mà không cần một cuộc trò chuyện.')}</p>

<h3>${t('Synchronous or asynchronous?', 'Đồng bộ hay bất đồng bộ?')}</h3>
${bang([t('Use a call / meeting when…', 'Gọi / họp khi…'), t('Use writing when…', 'Viết khi…')], [
    [t('two written exchanges did not converge (conflict, misunderstanding)', 'hai lượt trao đổi bằng chữ chưa ra kết quả (xung đột, hiểu lầm)'), t('the answer can wait a few hours', 'câu trả lời đợi được vài giờ')],
    [t('it is urgent: staging is down before a review', 'gấp: staging hỏng trước buổi review'), t('the decision must be found again later', 'quyết định cần được tìm lại sau này')],
    [t('feelings are involved (a 1:1, lesson 6.5)', 'có cảm xúc (một buổi 1:1, bài 6.5)'), t('it includes an error message, a link, a command', 'có thông báo lỗi, liên kết, lệnh')],
    [t('brainstorming many options quickly', 'cần nghĩ nhanh nhiều phương án'), t('people are in class, at work, or asleep', 'người khác đang học, đi làm, hoặc ngủ')],
  ])}
<p>${t(
    'Remote work has a measured side effect. A study of 61,182 Microsoft employees in the first half of 2020 found that firm-wide remote work made collaboration networks "more static and siloed, with fewer bridges between disparate parts", and shifted communication from synchronous to asynchronous (',
    'Làm từ xa có một tác dụng phụ đã được đo. Một nghiên cứu trên 61.182 nhân viên Microsoft nửa đầu 2020 cho thấy làm từ xa toàn công ty khiến mạng lưới cộng tác "tĩnh hơn và tách thành ốc đảo hơn, ít cầu nối giữa các phần khác nhau", và dời giao tiếp từ đồng bộ sang bất đồng bộ (') + ng('https://www.nature.com/articles/s41562-021-01196-4', 'Yang et al., Nature Human Behaviour, 2021') + t(
    '). In a five-person team the same thing looks like this: C3 and C4 both needed a QR scanner and did not know it for four days. Bridges do not appear by themselves; rotating reviewers (', '). Trong nhóm năm người, điều đó trông như sau: C3 và C4 cùng cần một bộ quét QR mà bốn ngày không biết. Cầu nối không tự mọc ra; xoay vòng người review (') + ag('agl-4-5-lab', t('lab 4.5', 'lab 4.5')) + t(') and pairing on stalled cards are how a leader builds them.', ') và ngồi cùng khi thẻ đứng là cách trưởng nhóm xây chúng.')}</p>

<h3>${t('Seven rules of a self-sufficient message', 'Bảy luật của tin nhắn tự đủ')}</h3>
${bang(['#', t('Rule', 'Luật'), t('Why', 'Vì sao')], [
    ['N1', t('No bare "hey" / "anyone there?" — write the question in the first message', 'Không "ê" / "có ai đó không" trần — viết luôn câu hỏi trong tin đầu tiên'), t('The other person waits for you to type; ', 'Người kia phải chờ bạn gõ tiếp; ') + ng('https://nohello.net/vi/', 'nohello.net')],
    ['N2', t('Context: which ticket / screen / PR', 'Ngữ cảnh: ticket / màn / PR nào'), t('The reader has 4 other projects in their head', 'Người đọc đang nghĩ về 4 môn khác')],
    ['N3', t('Error text copied verbatim, screenshot optional', 'Lỗi chép nguyên văn, ảnh chỉ là phụ'), t('Text can be searched, read on a phone, pasted into a search engine', 'Chữ tìm kiếm được, đọc được trên điện thoại, dán được vào công cụ tìm kiếm')],
    ['N4', t('"Urgent"/@all only with time, reason and duration', '"Gấp"/@all chỉ kèm giờ, lý do và thời lượng'), t('Otherwise everyone stops what they are doing for nothing', 'Không thì mọi người bỏ dở việc vì không có gì')],
    ['N5', t('Decisions go to the ticket or an ADR; chat only links to them', 'Quyết định ghi vào ticket hoặc ADR; chat chỉ dán liên kết'), t('Chat scrolls away; the ticket stays', 'Chat trôi đi; ticket ở lại')],
    ['N6', t('A question says when the answer is needed', 'Câu hỏi nói rõ khi nào cần trả lời'), t('Lets the reader decide whether to answer now', 'Giúp người đọc quyết định có cần trả lời ngay không')],
    ['N7', t('No vague worries ("looks a bit odd") — say what will break', 'Không lo ngại mơ hồ ("hơi lạ") — nói rõ điều gì sẽ hỏng'), t('A vague worry is easy to ignore', 'Lo ngại mơ hồ rất dễ bị bỏ qua')],
  ])}
<p>${t('Two writing habits help every rule: a <strong>closed question with a proposal</strong> ("A or B? If no objection by 22:00 tomorrow I pick B") and a <strong>default</strong> that lets work continue when nobody answers.', 'Hai thói quen viết giúp mọi luật: <strong>câu hỏi đóng kèm đề xuất</strong> ("A hay B? Không ai phản đối trước 22:00 mai thì mình chọn B") và <strong>một mặc định</strong> để việc vẫn đi tiếp khi không ai trả lời.')}</p>

<h3>${t('Lab 1: lint the team chat', 'Lab 1: soát nhóm chat')}</h3>
<p>${t('Six messages from the LabFlow group on the evening of 23/02 — the evening before the staging incident:', 'Sáu tin nhắn trong nhóm LabFlow tối 23/02 — buổi tối trước sự cố staging:')}</p>
${out(MA.tinNhan)}
${js(MA.soatTinNhan)}
${out('$ node soat-tin-nhan.mjs du-lieu/tin-nhan.txt\n' + RA.tinNhan)}
<p>${t(
    'Look at 21:10. C2 noticed something "a bit odd" about migration V3 in PR #29 — and still approved it. C1 merged at 21:40. The next morning staging returned 500 on the booking screen because V3 arrived after V4 (', 'Nhìn tin 21:10. C2 thấy migration V3 trong PR #29 "hơi lạ" — và vẫn duyệt. C1 merge lúc 21:40. Sáng hôm sau staging trả 500 ở màn Đặt lịch vì V3 tới sau V4 (') + ag('agl-5-4-postmortem', t('postmortem 5.4', 'postmortem 5.4')) + t(
    '). The data here is a simulation, but the pattern is real: the information that would have prevented the incident was in the chat, in a form that was easy to ignore. The rewritten version of the same message is below.',
    '). Dữ liệu ở đây là mô phỏng, nhưng khuôn mẫu là thật: thông tin có thể ngăn sự cố đã nằm trong chat, ở dạng rất dễ bị bỏ qua. Bản viết lại của chính tin nhắn đó ở ngay dưới.')}</p>
${out(MA.tinNhanSua)}
${out('$ node soat-tin-nhan.mjs du-lieu/tin-nhan-sua.txt\n' + RA.tinNhanSua)}

<h3>${t('Lab 2: why the exact error text matters', 'Lab 2: vì sao phải chép nguyên văn lỗi')}</h3>
<p>${t(
    'C3’s original message was "anyone know this error? [image]". The rewrite quotes the error and says it happens on the phone over the LAN address but not on the laptop. That one detail is the whole diagnosis — browsers only expose the camera in a <em>secure context</em> (HTTPS or localhost). We can show it with a real Chrome: the same page, opened twice.',
    'Tin gốc của C3 là "ai biết lỗi này không [ảnh]". Bản viết lại chép nguyên văn lỗi và nói nó xảy ra trên điện thoại qua địa chỉ LAN chứ không xảy ra trên laptop. Đúng chi tiết đó là toàn bộ chẩn đoán — trình duyệt chỉ cho dùng camera trong <em>secure context</em> (HTTPS hoặc localhost). Có thể cho thấy bằng Chrome thật: cùng một trang, mở hai lần.')}</p>
${bash(MA.kiemCamera)}
${out('$ ./kiem-camera.sh\n' + RA.camera)}
<p>${t(
    'Over <code>localhost</code> the page is a secure context and <code>navigator.mediaDevices</code> exists; over the LAN IP it is not, the object is <code>undefined</code>, and the call fails with exactly the text C3 quoted. Anyone searching that sentence finds the answer in a minute; nobody can search a screenshot. (C4’s QR blocker in lesson 6.1 belonged to the same family of problems.)',
    'Qua <code>localhost</code> trang là secure context và <code>navigator.mediaDevices</code> tồn tại; qua IP LAN thì không, đối tượng là <code>undefined</code>, và lời gọi hỏng với đúng dòng chữ C3 đã chép. Ai tìm câu đó cũng ra đáp án trong một phút; không ai tìm kiếm được một ảnh chụp. (Chỗ kẹt QR của C4 ở bài 6.1 cũng thuộc đúng họ vấn đề này.)')}</p>

<h3>${t('The team’s communication agreement', 'Thoả thuận giao tiếp của nhóm')}</h3>
<p>${t('Write the rules down once, in the repo, so nobody has to "remind" anyone. LabFlow’s version (it extends the working agreement of lab 1.5):', 'Viết luật ra một lần, trong repo, để không ai phải "nhắc" ai. Bản của LabFlow (bổ sung cho thoả thuận làm việc ở lab 1.5):')}</p>
${out(MA.thoaThuan)}
${cl('tip', `<p>${t(
    '<strong>Response time is a promise both ways.</strong> "Reply within 12 hours, nobody has to answer after 23:00" protects the asker (they know when to expect an answer) and the reader (they can switch off). For a student team with part-time jobs, the second half matters as much as the first.',
    '<strong>Thời gian phản hồi là lời hứa hai chiều.</strong> "Trả lời trong 12 giờ, không ai phải trả lời sau 23:00" bảo vệ người hỏi (biết khi nào có câu trả lời) và người đọc (được nghỉ). Với nhóm sinh viên đi làm thêm, nửa sau quan trọng ngang nửa trước.')}</p>`)}

<h3>🕵️ ${t('Real case: Arup, 2024 — the video call where everyone was fake', 'Sự cố thật: Arup, 2024 — cuộc gọi video mà ai cũng là giả')}</h3>
<p>${t(
    'In early 2024 a finance employee in the Hong Kong office of the engineering firm Arup received a message, apparently from the UK chief financial officer, about a secret transaction. The employee suspected phishing — until a video call in which the CFO and several colleagues looked and sounded like familiar colleagues. All of them were deepfakes. The employee then made 15 transfers totalling 200 million Hong Kong dollars, about US$25.6 million; Arup confirmed in May 2024 that it was the victim (',
    'Đầu năm 2024, một nhân viên tài chính ở văn phòng Hồng Kông của công ty kỹ thuật Arup nhận tin nhắn, tưởng là của giám đốc tài chính ở Anh, về một giao dịch bí mật. Người này nghi là lừa đảo — cho tới một cuộc gọi video mà giám đốc tài chính và vài đồng nghiệp trông và nghe giống hệt những đồng nghiệp quen. Tất cả đều là deepfake. Sau đó người này chuyển 15 lần, tổng cộng 200 triệu đô la Hồng Kông, khoảng 25,6 triệu USD; tháng 5/2024 Arup xác nhận mình là nạn nhân (') + ng('https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk/index.html', 'CNN, 05/2024') + t(
    '). The lesson for a remote team is small and concrete: <strong>an unusual request is verified through a second, known channel</strong>, however real the first channel looks. "C1 here, send me your GitHub token / the .env so I can deploy" — call C1 on the number you already have, or ask in the ticket. Phishing aimed at developers in detail: ',
    '). Bài học cho đội làm từ xa nhỏ và cụ thể: <strong>yêu cầu bất thường được xác minh qua một kênh thứ hai đã biết</strong>, dù kênh thứ nhất trông thật tới đâu. "C1 đây, gửi mình token GitHub / tệp .env để mình deploy" — gọi C1 qua số bạn vốn có, hoặc hỏi trong ticket. Lừa đảo nhắm vào lập trình viên chi tiết ở ') + ag('agl-10-6-lua-dao', t('lesson 10.6', 'bài 10.6')) + '.'}</p>

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'At an outsourcing company you will work across offices and sometimes time zones: Teams or Slack with the team, email and Q&A lists with the client (', 'Ở công ty outsourcing bạn sẽ làm việc qua nhiều văn phòng và đôi khi nhiều múi giờ: Teams hoặc Slack với đội, email và Q&A list với khách (') + ag('agl-9-5-qa-cr', t('lesson 9.5', 'bài 9.5')) + t(
    '). The seven rules carry over unchanged. Two additions: write the time zone with every time you mention to a client ("15:00 JST"), and when a call ends with a decision, post it in writing the same day for confirmation — the habit of ',
    '). Bảy luật dùng nguyên. Thêm hai điều: ghi múi giờ kèm mọi giờ bạn nhắc với khách ("15:00 JST"), và khi cuộc gọi kết thúc bằng một quyết định, gửi lại bằng chữ trong ngày để xác nhận — thói quen ở ') + ag('agl-11-3-mui-gio-hop', t('lesson 11.3', 'bài 11.3')) + '.'}</p>

<h3>🧪 ${t('Practice (15 minutes)', 'Thực hành (15 phút)')}</h3>
<p>${t(
    'Export the last 30 messages of your own group chat to a text file in the same format (<code>[dd/mm hh:mm] Name: text</code>, names replaced by C1…C5) and run soat-tin-nhan.mjs. Rewrite the three worst messages and run it again.',
    'Xuất 30 tin nhắn gần nhất của nhóm chat của bạn ra tệp chữ cùng định dạng (<code>[dd/mm hh:mm] Tên: nội dung</code>, thay tên bằng C1…C5) và chạy soat-tin-nhan.mjs. Viết lại ba tin tệ nhất và chạy lại.')}</p>
${giai(t('What usually comes out', 'Thường sẽ thấy gì'), `<p>${t(
    'In most student chats N1 and N2 dominate ("ê", "ai rảnh không"), N5 appears every time something is decided ("ok chốt vậy nhé"), and N6 is everywhere because people rarely say when they need the answer. The rewrite of the LabFlow messages above shows the pattern: ticket first, verbatim error, closed question, a default, a place for the decision.',
    'Ở phần lớn nhóm chat sinh viên, N1 và N2 chiếm nhiều nhất ("ê", "ai rảnh không"), N5 xuất hiện mỗi lần có quyết định ("ok chốt vậy nhé"), và N6 ở khắp nơi vì hiếm ai nói khi nào cần câu trả lời. Bản viết lại tin nhắn LabFlow ở trên cho thấy khuôn mẫu: ticket trước, lỗi nguyên văn, câu hỏi đóng, một mặc định, một nơi ghi quyết định.')}</p>`)}

${phongVan([
    [t('"How do you communicate in a remote team?"', '"Bạn giao tiếp thế nào trong đội làm từ xa?"'), t('Written first and self-sufficient: ticket ID, the verbatim error, what I tried, a closed question with a default and a deadline. Decisions go into the ticket. I switch to a call after two written exchanges that do not converge.', 'Viết trước và tự đủ: mã ticket, lỗi nguyên văn, đã thử gì, câu hỏi đóng kèm mặc định và hạn. Quyết định ghi vào ticket. Sau hai lượt trao đổi bằng chữ chưa ra kết quả thì tôi chuyển sang gọi.')],
    [t('"How do you handle teammates in different schedules?"', '"Bạn xử lý thế nào khi các thành viên khác lịch?"'), t('A written communication agreement in the repo: which channel for what, a 12-hour reply window, nobody has to answer after 23:00, and @all only with time and reason.', 'Một thoả thuận giao tiếp viết ra trong repo: kênh nào cho việc gì, trả lời trong 12 giờ, không ai phải trả lời sau 23:00, và @all chỉ khi có giờ và lý do.')],
    [t('"Someone in chat asks you to send credentials urgently. What do you do?"', '"Có người trong chat xin bạn gửi thông tin đăng nhập gấp. Bạn làm gì?"'), t('Verify through a second channel I already trust — call them or ask in the ticket — before anything else. Arup lost about 25 million dollars in 2024 to a video call full of deepfakes; urgency plus secrecy is the signature.', 'Xác minh qua kênh thứ hai mình vốn tin — gọi họ hoặc hỏi trong ticket — trước mọi việc khác. Năm 2024 Arup mất khoảng 25 triệu USD vì một cuộc gọi video toàn deepfake; gấp gáp cộng bí mật là dấu hiệu nhận dạng.')],
    [t('"Why not just send a screenshot of the error?"', '"Sao không gửi ảnh chụp lỗi cho nhanh?"'), t('Because text can be searched and read on a phone. In our case the verbatim message about getUserMedia led straight to the cause — the camera only works in a secure context.', 'Vì chữ tìm kiếm được và đọc được trên điện thoại. Trường hợp của chúng tôi, dòng lỗi nguyên văn về getUserMedia dẫn thẳng tới nguyên nhân — camera chỉ chạy trong secure context.')],
  ], en)}

${thuatNgu([
    [t('async(hronous) communication', 'giao tiếp bất đồng bộ'), t('Messages that do not need both people present at the same time.', 'Trao đổi không cần hai người có mặt cùng lúc.')],
    [t('self-sufficient message', 'tin nhắn tự đủ'), t('One message the reader can act on without asking back.', 'Một tin mà người đọc hành động được mà không phải hỏi lại.')],
    ['no hello', t('Etiquette: put the question in the first message instead of a bare greeting.', 'Phép lịch sự: đặt câu hỏi ngay tin đầu thay vì chỉ chào.')],
    ['secure context', t('HTTPS or localhost; browsers enable powerful APIs (camera, geolocation) only there.', 'HTTPS hoặc localhost; trình duyệt chỉ mở các API mạnh (camera, vị trí) ở đó.')],
    ['deepfake', t('AI-generated fake video or voice of a real person.', 'Video hoặc giọng nói giả của một người thật do AI tạo ra.')],
    [t('second-channel verification', 'xác minh kênh thứ hai'), t('Confirming an unusual request through a channel you already trust.', 'Xác nhận yêu cầu bất thường qua một kênh bạn vốn tin.')],
  ], en)}

${tomTat([
    t('Student teams are remote teams; write for someone reading on a phone at 23:00.', 'Nhóm sinh viên là đội làm từ xa; viết cho người đọc trên điện thoại lúc 23 giờ.'),
    t('Seven rules: no bare hello, context, verbatim error, urgent only with time and reason, decisions in tickets, a reply-by time, no vague worries.', 'Bảy luật: không chào trần, có ngữ cảnh, lỗi nguyên văn, gấp phải có giờ và lý do, quyết định vào ticket, hạn trả lời, không lo ngại mơ hồ.'),
    t('A vague "looks a bit odd" on PR #29 was the missed warning before the staging incident; the rewrite names what will break.', 'Một câu "hơi lạ" mơ hồ ở PR #29 là cảnh báo bị lỡ trước sự cố staging; bản viết lại gọi tên điều sẽ hỏng.'),
    t('Exact error text is diagnosis: a real Chrome shows the camera API vanishes outside a secure context.', 'Lỗi nguyên văn là chẩn đoán: Chrome thật cho thấy API camera biến mất ngoài secure context.'),
    t('Remote work silos people (Microsoft study, 2021); the leader builds bridges. Unusual requests are verified on a second channel (Arup, 2024).', 'Làm từ xa chia người thành ốc đảo (nghiên cứu Microsoft, 2021); trưởng nhóm xây cầu nối. Yêu cầu bất thường được xác minh qua kênh thứ hai (Arup, 2024).'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-6-5-thanh-vien', t('6.5 — When a teammate is late, silent or in conflict', '6.5 — Khi một thành viên trễ, im lặng hoặc xung đột'))}.</p>
`);
};

export default {
  title: '6.4 — Remote and async communication|||6.4 — Giao tiếp từ xa và bất đồng bộ',
  slug: 'agl-6-4-tu-xa',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nhóm SV là đội làm từ xa: khi nào gọi, khi nào viết; nghiên cứu 61.182 nhân viên Microsoft (2021): làm từ xa tạo ốc đảo; bảy luật tin nhắn tự đủ (nohello, ngữ cảnh, lỗi nguyên văn, @all có giờ, quyết định vào ticket, hạn trả lời, không "hơi lạ"); lab chạy thật soat-tin-nhan.mjs 0/6 → 5/5 (câu "hơi lạ" ở PR #29 trước sự cố staging); Chrome headless thật: camera chỉ có trong secure context; thoả thuận giao tiếp mẫu; Arup 2024 deepfake 25,6 triệu USD — xác minh kênh thứ hai.',
  content: L64(true) + L64(false),
};
