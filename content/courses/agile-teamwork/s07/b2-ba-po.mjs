/**
 * 7.2 — Lập trình viên, BA và PO (agl-7-2-ba-po — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: Q&A list với khách + CR ở agl-9-5 (liên kết); ticket/Given-When-Then ở agl-2-1; mơ hồ trong yêu cầu (lý thuyết Wiegers) ở SWR302 (swr302-5-6-ch11-ambiguity).
 * Bài này: dev làm việc với BA/PO thế nào; ở SWP391 ai là PO; từ yêu cầu mơ hồ ⇒ câu hỏi đóng ⇒ bảng ví dụ ba bên (three amigos) ⇒ chạy được.
 * Lab chạy THẬT (scratchpad/agt/lab/ch7): soat-yeu-cau.mjs (8 dòng yêu cầu của GV ⇒ 11 câu hỏi), vi-du.mjs (bảng ví dụ Q-04 trên quy-tac v1 5/6 ⇒ v2 6/6),
 * do-duong-dan.mjs (dòng 8 làm đúng chữ ⇒ ai cũng đọc được tài liệu người khác; bản hỏi "ai KHÔNG được" ⇒ 404/401).
 * Sự cố thật: Mars Climate Orbiter 1999 (NASA MIB Phase I 10/11/1999); First American Financial 2019 (KrebsOnSecurity 24/05/2019).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L72 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 7 · Lesson 7.2', 'Chương 7 · Bài 7.2', `
<h2>${t('7.2 — Developers, BAs and product owners', '7.2 — Lập trình viên, BA và PO')}</h2>
<p class="lead">${t(
    'The most expensive bugs are not in the code; they are in the gap between what someone meant and what someone else built. A business analyst (BA) turns what the business needs into requirements; a product owner (PO) decides what is worth building next. A developer’s part of that relationship is not "wait for perfect specs" — it is to find the ambiguity early, ask questions that can be answered in one line, and turn the answers into examples a machine can check.',
    'Những bug đắt nhất không nằm trong mã; chúng nằm ở khoảng trống giữa điều một người muốn nói và điều người khác xây ra. Business analyst (BA) biến nhu cầu nghiệp vụ thành yêu cầu; product owner (PO) quyết định cái gì đáng làm tiếp. Phần của lập trình viên trong mối quan hệ đó không phải "chờ đặc tả hoàn hảo" — mà là tìm ra chỗ mơ hồ sớm, hỏi những câu trả lời được bằng một dòng, và biến câu trả lời thành ví dụ máy kiểm được.')}</p>

<h3>${t('Everyday picture: "a haircut, a bit shorter"', 'Liên tưởng đời thường: "cắt ngắn đi một chút"')}</h3>
<p>${t(
    '"A bit shorter" means two centimetres to you and five to the barber. A good barber does not argue afterwards; they ask before cutting: "about this much?" and show it with their fingers. A question with a concrete option — this much, yes or no — is answered in a second. "How short do you want it?" makes you think, and you will still answer "a bit".',
    '"Ngắn đi một chút" với bạn là hai phân, với thợ là năm phân. Thợ giỏi không cãi sau khi cắt; họ hỏi trước: "chừng này nhé?" và đưa ngón tay ra ướm. Câu hỏi kèm một phương án cụ thể — chừng này, có hay không — được trả lời trong một giây. Câu "em muốn ngắn cỡ nào?" bắt bạn nghĩ, và bạn vẫn sẽ đáp "một chút".')}</p>

<h3>${t('Who is who — at work and in SWP391', 'Ai là ai — khi đi làm và ở SWP391')}</h3>
${bang([t('Role', 'Vai trò'), t('At a company', 'Ở công ty'), t('In an SWP391 team', 'Ở nhóm SWP391')], [
    ['PO', t('Owns the backlog order and the "why"; accepts the increment', 'Giữ thứ tự backlog và câu "vì sao"; nghiệm thu phần tăng trưởng'), t('The leader acts as PO for order; the supervisor has the final word on scope', 'Trưởng nhóm đóng vai PO về thứ tự; giảng viên có tiếng nói cuối về phạm vi')],
    ['BA', t('Elicits, writes and validates requirements; keeps the Q&A list', 'Khơi gợi, viết và xác nhận yêu cầu; giữ danh sách hỏi đáp'), t('Usually nobody — so every screen owner is the BA of their own screen, and the leader keeps one shared question log', 'Thường không có ai — nên mỗi người là BA của màn của mình, và trưởng nhóm giữ một sổ câu hỏi chung')],
    [t('BrSE (Japan projects)', 'BrSE (dự án Nhật)'), t('Bridges customer and offshore team; questions go through them', 'Cầu nối khách và đội offshore; câu hỏi đi qua họ'), '—'],
    [t('Customer / stakeholder', 'Khách / bên liên quan'), t('Has the need, often cannot describe it precisely', 'Có nhu cầu, thường không mô tả chính xác được'), t('The supervisor (and the imagined users: students, lab staff)', 'Giảng viên (và người dùng giả định: sinh viên, cán bộ phòng lab)')],
  ])}
<p>${t('Requirement engineering in depth — elicitation, ambiguity, reviews — is in ', 'Kỹ nghệ yêu cầu chuyên sâu — khơi gợi, mơ hồ, review — có ở ')}${ac('software-requirements', 'swr302-5-6-ch11-ambiguity', t('SWR302 — ambiguity in requirements', 'SWR302 — sự mơ hồ trong yêu cầu'))} ${t('and', 'và')} ${ac('software-requirements', 'swr302-3-1-ky-thuat-elicitation', t('SWR302 — elicitation techniques', 'SWR302 — kỹ thuật khơi gợi'))}. ${t('This lesson is the developer’s side of the table.', 'Bài này là phía bàn của lập trình viên.')}</p>

<h3>${t('Lab 1: find the words nobody can test', 'Lab 1: tìm những chữ không ai kiểm được')}</h3>
<p>${t(
    'On 01/03/2027 the team met the supervisor about the booking feature and wrote down eight lines. They look reasonable. The ISO/IEC/IEEE 29148 standard lists kinds of language to avoid in requirements because they cannot be verified — subjective words, loopholes, open-ended lists, absolutes, vague pronouns. A small script turns that list into questions:',
    'Ngày 01/03/2027 nhóm gặp giảng viên về chức năng đặt lịch và ghi lại tám dòng. Trông có vẻ ổn. Chuẩn ISO/IEC/IEEE 29148 liệt kê các kiểu ngôn ngữ cần tránh trong yêu cầu vì không kiểm chứng được — từ chủ quan, kẽ hở, danh sách bỏ ngỏ, từ tuyệt đối, đại từ mơ hồ. Một script nhỏ biến danh sách đó thành câu hỏi:')}</p>
${out(MA.yeuCau)}
${js(MA.soatYeuCau)}
${out('$ node soat-yeu-cau.mjs yeu-cau/dat-lich-gv.md\n' + RA.soatYeuCau)}
<p>${t(
    'Seven of eight lines contain something two people would build differently. The script is deliberately dumb: it found "một tuần" but it will never ask whether "4 hours" includes the lunch break; line 4 passed and may still hide a question. It is a checklist that starts the conversation, not a judge. The other important thing is what it does <em>not</em> do: it does not send eleven open questions to the supervisor.',
    'Bảy trên tám dòng có chỗ hai người sẽ làm ra hai thứ khác nhau. Script cố tình ngốc: nó bắt được "một tuần" nhưng sẽ không bao giờ hỏi "4 giờ" có tính giờ nghỉ trưa không; dòng 4 qua được mà vẫn có thể giấu một câu hỏi. Nó là danh sách soát để mở cuộc nói chuyện, không phải trọng tài. Điều quan trọng nữa là điều nó <em>không</em> làm: nó không gửi mười một câu hỏi mở cho giảng viên.')}</p>

<h3>${t('Turning open questions into closed ones', 'Biến câu hỏi mở thành câu hỏi đóng')}</h3>
<p>${t('A supervisor or customer answers a closed question in one line. Each question in the team’s log has: options, a proposal, a deadline and what it blocks.', 'Giảng viên hay khách trả lời câu hỏi đóng bằng một dòng. Mỗi câu trong sổ của nhóm có: các phương án, một đề xuất, hạn trả lời và việc nó đang chặn.')}</p>
${bang([t('Open (do not send)', 'Mở (đừng gửi)'), t('Closed (send)', 'Đóng (gửi)')], [
    [t('"How should one week be calculated?"', '"Một tuần tính thế nào ạ?"'), t('"Q-04: booking up to one week ahead — A: 7 calendar days in Vietnam time, today is day 0, all of day 7 allowed; B: 168 hours from the moment of booking; C: 5 working days. We propose A. If we have no answer by 03/03 we build A. Blocks LF-21 (S22)."', '"Q-04: đặt trước tối đa một tuần — A: 7 ngày lịch theo giờ Việt Nam, hôm nay là ngày 0, cả ngày thứ 7 đều được; B: 168 giờ tính từ lúc đặt; C: 5 ngày làm việc. Nhóm đề xuất A. Nếu đến 03/03 chưa có trả lời, nhóm làm theo A. Đang chặn LF-21 (S22)."')],
    [t('"Who should get notifications?"', '"Ai nhận thông báo ạ?"'), t('"Q-09: A: the booker and the approving lecturer; B: also the whole class group. We propose A."', '"Q-09: A: người đặt và giảng viên duyệt; B: thêm cả nhóm lớp. Nhóm đề xuất A."')],
  ])}
${out(MA.hoiDap)}
<p>${t(
    'Notice Q-07: the team proposed B, the supervisor chose A. That is the point of proposing — you get a fast, explicit decision either way, and it is written down with a date. The full process of a Q&A list with a customer (statuses, escalation, when an answer becomes a change request) is in ',
    'Để ý Q-07: nhóm đề xuất B, giảng viên chọn A. Đó chính là ý nghĩa của việc đề xuất — bạn nhận được quyết định nhanh và rõ dù theo hướng nào, và nó được ghi lại kèm ngày. Quy trình đầy đủ của danh sách hỏi đáp với khách (trạng thái, đẩy lên cấp trên, khi nào câu trả lời thành change request) có ở ')}${ag('agl-9-5-qa-cr', t('9.5 — Q&amp;A list and change requests', '9.5 — Q&amp;A list và change request'))}.</p>

<h3>${t('Lab 2: three amigos — examples that run', 'Lab 2: ba bên — ví dụ chạy được')}</h3>
<p>${t(
    'An answer in a chat is still words. The "three amigos" habit puts three views at one table for 20 minutes before a story starts: business (PO/BA — here the leader with the supervisor’s answer), development (C1, owner of S22) and testing (C3, who will cross-test it). They do not write more prose; they write <strong>examples</strong> — concrete inputs and the expected answer, including the edges. This is "specification by example" (Gojko Adzic’s book of that name, 2011).',
    'Một câu trả lời trên chat vẫn chỉ là chữ. Thói quen "ba bên" (three amigos) đặt ba góc nhìn vào một bàn 20 phút trước khi bắt đầu một story: nghiệp vụ (PO/BA — ở đây là trưởng nhóm cầm câu trả lời của giảng viên), phát triển (C1, chủ màn S22) và kiểm thử (C3, người sẽ test chéo). Họ không viết thêm văn xuôi; họ viết <strong>ví dụ</strong> — đầu vào cụ thể và kết quả mong đợi, kể cả các biên. Đây là "đặc tả bằng ví dụ" (specification by example, sách cùng tên của Gojko Adzic, 2011).')}</p>
${out(MA.viDuCsv)}
<p>${t('C1 had already written the rule on Monday, before Q-04 was answered:', 'C1 đã viết quy tắc từ thứ Hai, trước khi Q-04 được trả lời:')}</p>
${js(MA.quyTacV1)}
${js(MA.viDu)}
${out('$ TZ=UTC node vi-du.mjs yeu-cau/vi-du-q04.csv quy-tac/v1.mjs\n' + RA.viDuV1)}
<p>${t(
    'Five of six pass — which is exactly why this bug would survive a casual demo. "Within one week" was read as 7 × 24 hours; the supervisor meant "until the end of day 7". The example C3 insisted on (day 7, in the afternoon) is the one that fails. After the answer, C1 changes the rule to count Vietnamese calendar days:',
    'Năm trên sáu qua — chính vì thế lỗi này sống sót qua một buổi demo qua loa. "Trong một tuần" được hiểu là 7 × 24 giờ; giảng viên muốn nói "tới hết ngày thứ 7". Ví dụ mà C3 nhất quyết thêm vào (ngày thứ 7, buổi chiều) là ví dụ trượt. Sau câu trả lời, C1 sửa quy tắc để đếm theo ngày lịch Việt Nam:')}</p>
${js(MA.quyTacV2)}
${out('$ TZ=UTC node vi-du.mjs yeu-cau/vi-du-q04.csv quy-tac/v2.mjs\n' + RA.viDuV2)}
${cl('tip', `<p>${t(
    'The CSV is now the specification <em>and</em> the test. When the supervisor changes their mind, you change one row and see what breaks. The three "as designed" rejections from lesson 7.1 (S23, S25) were exactly this kind of disagreement; a 20-minute three-amigos session per story is cheaper than three bug ping-pongs.',
    'Tệp CSV giờ vừa là đặc tả <em>vừa</em> là test. Khi giảng viên đổi ý, bạn sửa một dòng và thấy ngay chỗ nào hỏng. Ba lần từ chối "đúng thiết kế" ở bài 7.1 (S23, S25) chính là kiểu bất đồng này; 20 phút ba bên cho mỗi story rẻ hơn ba vòng bóng bàn bug.')}</p>`)}

<h3>🕵️ ${t('Hacker’s corner: the requirement that forgot "who must NOT"', 'Góc hacker: yêu cầu quên câu "ai KHÔNG được"')}</h3>
<p>${t(
    'Line 8 says "students can view the attached guide through a link". A developer who builds exactly that, with sequential IDs, gets this — run for real against a small server, logged in as student An (SE180001):',
    'Dòng 8 ghi "sinh viên xem được tài liệu hướng dẫn đính kèm qua đường dẫn". Lập trình viên làm đúng từng chữ, với mã số tăng dần, sẽ được thế này — chạy thật trên một máy chủ nhỏ, đăng nhập là sinh viên An (SE180001):')}</p>
${js(MA.taiLieu)}
${out('$ node do-duong-dan.mjs\n' + RA.duongDan)}
<p>${t(
    'An reads every other student’s documents, including a parent’s phone number, and so does someone with no token at all. Nothing in the requirement was violated. This is how First American Financial exposed some 885 million title-insurance records in 2019: documents were reachable by a link with a sequential number, and changing the number showed someone else’s file (',
    'An đọc được tài liệu của mọi sinh viên khác, kể cả số điện thoại phụ huynh, và người không có token cũng vậy. Không chữ nào trong yêu cầu bị vi phạm. Đây chính là cách First American Financial để lộ khoảng 885 triệu hồ sơ bảo hiểm quyền sở hữu nhà đất năm 2019: tài liệu mở được bằng đường dẫn có số thứ tự, và đổi số là thấy hồ sơ của người khác (')}${ng('https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/', 'KrebsOnSecurity, 24/05/2019')}). ${t('The developer’s question that closes it is Q-10 in the log — "who is NOT allowed, and what do they see?" — and its answer becomes code:', 'Câu hỏi của lập trình viên chặn được nó là Q-10 trong sổ — "ai KHÔNG được, và họ thấy gì?" — và câu trả lời thành mã:')}</p>
${out('$ CHE=1 node do-duong-dan.mjs\n' + RA.duongDanChe)}
<p>${t('Make it a habit: for every "X can do Y", ask the BA or PO for the abuse case — "who must not do Y, and what happens if they try?" Broken access control is number one in the ', 'Biến thành thói quen: với mỗi câu "X được làm Y", hỏi BA hoặc PO ca lạm dụng — "ai không được làm Y, và nếu họ cố thì sao?" Lỗi kiểm soát truy cập đứng số một trong ')}${ng('https://owasp.org/Top10/A01_2021-Broken_Access_Control/', 'OWASP Top 10 (2021)')}.</p>

<h3>${t('A real case: two teams, two units (Mars Climate Orbiter, 1999)', 'Chuyện thật: hai đội, hai đơn vị đo (Mars Climate Orbiter, 1999)')}</h3>
<p>${t(
    'NASA lost the Mars Climate Orbiter on 23 September 1999. The investigation board’s Phase I report (10 November 1999) found that ground software supplied thruster data in English units while the navigation software expected metric units, and that communication between the navigation team and the project was inadequate (',
    'NASA mất tàu Mars Climate Orbiter ngày 23/09/1999. Báo cáo giai đoạn I của hội đồng điều tra (10/11/1999) kết luận phần mềm mặt đất cung cấp dữ liệu lực đẩy theo đơn vị Anh trong khi phần mềm dẫn đường chờ đơn vị mét, và việc trao đổi giữa đội dẫn đường với dự án là không đủ (')}${ng('https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf', 'MCO Mishap Investigation Board, Phase I')}). ${t(
    'Both teams built what they understood. An interface specification with one concrete example — "an impulse of 1 means 1 newton-second" — is the kind of example the three amigos write. In your project the "units" are time zones, currencies, page indexes starting at 0 or 1, and whether an end time is inclusive.',
    'Cả hai đội đều làm đúng điều mình hiểu. Một đặc tả giao diện kèm một ví dụ cụ thể — "xung lực 1 nghĩa là 1 newton-giây" — chính là loại ví dụ mà ba bên viết ra. Trong dự án của bạn, "đơn vị" là múi giờ, tiền tệ, số trang đếm từ 0 hay 1, và giờ kết thúc có tính hay không.')}</p>

<h3>${t('At work (OJT, outsourcing)', 'Khi đi làm (OJT, outsourcing)')}</h3>
<p>${t(
    'In a Japanese project your questions usually go through the BrSE and land in a Q&amp;A sheet; in a US project you may message the PO directly. Either way: read the whole specification first and batch your questions; write each one closed, with your proposal; say what it blocks; and never "assume and code" silently — if you must proceed, write "proceeding with A until answered" in the ticket. Customers forgive a question; they do not forgive a surprise at acceptance (',
    'Ở dự án Nhật, câu hỏi của bạn thường đi qua BrSE và vào một bảng Q&amp;A; ở dự án Mỹ bạn có thể nhắn thẳng PO. Dù cách nào: đọc hết đặc tả trước rồi gom câu hỏi; viết mỗi câu ở dạng đóng, kèm đề xuất của bạn; nói rõ nó đang chặn gì; và đừng bao giờ âm thầm "đoán rồi code" — nếu buộc phải làm tiếp, ghi "đang làm theo A cho tới khi có trả lời" vào ticket. Khách tha thứ cho một câu hỏi; họ không tha thứ cho một bất ngờ lúc nghiệm thu (')}${ag('agl-11-1-khach-nhat', t('11.1 — Japanese clients', '11.1 — khách Nhật'))}).</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
  <li>${t('Rewrite Q-03 ("handle overlapping bookings appropriately") as a closed question with options, a proposal, a deadline and what it blocks.', 'Viết lại Q-03 ("xử lý trùng lịch một cách phù hợp") thành câu hỏi đóng có phương án, đề xuất, hạn và việc bị chặn.')}</li>
  <li>${t('Add two rows to <code>vi-du-q04.csv</code> that a tester would insist on and that v2 must still pass. Run it.', 'Thêm hai dòng vào <code>vi-du-q04.csv</code> mà một tester sẽ nhất quyết đòi, và v2 vẫn phải qua. Chạy thử.')}</li>
  <li>${t('For line 6 ("approved bookings cannot be edited"), write the abuse-case question and two example rows (who, action, expected status).', 'Với dòng 6 ("lịch đã duyệt thì không được sửa"), viết câu hỏi ca lạm dụng và hai dòng ví dụ (ai, hành động, mã trạng thái mong đợi).')}</li>
</ol>
${giai(t('Model answers', 'Đáp án mẫu'), out(t(
    'Q-03: When a student books a slot that overlaps an existing booking of the same room — A: reject with "slot taken" and show the next free slot; B: put the student in the waiting list (S26) automatically; C: allow it if the first booking is not yet approved. We propose A + a button to join the waiting list. Default A if no answer by 05/03. Blocks LF-21 (S22) and LF-27 (S26).\n\nExtra examples (both pass on v2):\n2027-03-01T00:05+07:00,2027-03-08T23:00+07:00,co,booked just after midnight — still day 0\n2027-03-07T10:00+07:00,2027-03-14T21:00+07:00,co,crosses a week boundary (Sunday → Sunday)\n\nLine 6 abuse case: "Who must NOT edit an approved booking, and what do they get?"\nstudent SE180001, PATCH own approved booking → 409\nstudent SE180002, PATCH someone else’s booking → 404',
    'Q-03: Khi sinh viên đặt một khung trùng với lịch đã có của cùng phòng — A: từ chối "khung đã có người đặt" và gợi ý khung trống gần nhất; B: tự đưa sinh viên vào hàng chờ (S26); C: cho đặt nếu lịch trước chưa được duyệt. Nhóm đề xuất A + nút vào hàng chờ. Mặc định A nếu tới 05/03 chưa có trả lời. Đang chặn LF-21 (S22) và LF-27 (S26).\n\nVí dụ thêm (cả hai qua trên v2):\n2027-03-01T00:05+07:00,2027-03-08T23:00+07:00,co,đặt ngay sau nửa đêm — vẫn là ngày 0\n2027-03-07T10:00+07:00,2027-03-14T21:00+07:00,co,vắt qua ranh tuần (Chủ nhật → Chủ nhật)\n\nCa lạm dụng dòng 6: "Ai KHÔNG được sửa lịch đã duyệt, và họ nhận được gì?"\nsinh viên SE180001, PATCH lịch đã duyệt của mình → 409\nsinh viên SE180002, PATCH lịch của người khác → 404')))}

${phongVan([
    [t('"The requirements are unclear. What do you do?"', '"Yêu cầu không rõ. Bạn làm gì?"'), t('Read everything first, list the ambiguous points, and turn each into a closed question with options, my proposal, a deadline and what it blocks. Ask in one batch through the agreed channel and log the answers. If I must start, I proceed with my proposal and write that in the ticket. Then I turn the answers into examples that run as tests.', 'Đọc hết trước, liệt kê chỗ mơ hồ, biến mỗi chỗ thành câu hỏi đóng có phương án, đề xuất của tôi, hạn và việc bị chặn. Hỏi một lượt qua kênh đã thống nhất và ghi câu trả lời vào sổ. Nếu buộc phải bắt đầu, tôi làm theo đề xuất và ghi điều đó vào ticket. Sau đó tôi biến câu trả lời thành ví dụ chạy như test.')],
    [t('"What is a three amigos session?"', '"Three amigos là gì?"'), t('A short meeting of business, development and testing before a story starts, to agree concrete examples including edge cases. In our project the tester’s example — day 7 in the afternoon — exposed that we had read "one week" as 168 hours.', 'Buổi ngắn giữa nghiệp vụ, phát triển và kiểm thử trước khi bắt đầu một story, để thống nhất các ví dụ cụ thể kể cả ca biên. Trong dự án của chúng tôi, ví dụ của tester — ngày thứ 7 buổi chiều — lộ ra rằng chúng tôi đã hiểu "một tuần" là 168 giờ.')],
    [t('"How do you push back on a product owner?"', '"Bạn phản biện PO thế nào?"'), t('With options and consequences, not opinions: "we can do A by Friday or B by next Wednesday; B also needs a new screen". The PO decides; I make sure the decision is informed and written down.', 'Bằng phương án và hệ quả, không bằng ý kiến: "làm A thì kịp thứ Sáu, làm B thì thứ Tư tuần sau và cần thêm một màn". PO quyết; tôi đảm bảo quyết định có đủ thông tin và được ghi lại.')],
    [t('"Give an example of a security requirement you added."', '"Kể một yêu cầu bảo mật bạn đã bổ sung."'), t('A requirement said students can view attachments through a link. I asked who must not, and we specified 401 without login and 404 for other students’ documents, with a test that tries someone else’s ID.', 'Một yêu cầu ghi sinh viên xem được tài liệu đính kèm qua đường dẫn. Tôi hỏi ai không được, và chúng tôi chốt 401 khi chưa đăng nhập, 404 với tài liệu của sinh viên khác, kèm một test thử mã số của người khác.')],
  ], en)}

${thuatNgu([
    ['BA / PO', t('Business analyst: elicits and writes requirements / Product owner: decides what is built next.', 'Business analyst: khơi gợi và viết yêu cầu / Product owner: quyết định làm gì tiếp theo.')],
    [t('closed question', 'câu hỏi đóng'), t('A question with options and a proposal, answerable in one line.', 'Câu hỏi có phương án và đề xuất, trả lời được bằng một dòng.')],
    ['three amigos', t('Business + development + testing agreeing examples before a story starts.', 'Nghiệp vụ + phát triển + kiểm thử thống nhất ví dụ trước khi bắt đầu story.')],
    ['specification by example', t('Requirements expressed as concrete examples that also run as tests.', 'Yêu cầu thể hiện bằng ví dụ cụ thể, đồng thời chạy được như test.')],
    [t('abuse case', 'ca lạm dụng'), t('"Who must not do this, and what happens if they try?"', '"Ai không được làm việc này, và nếu họ cố thì sao?"')],
  ], en)}

${tomTat([
    t('Find untestable words early (subjective, loopholes, open lists, absolutes, vague "who") — a script can list them, people must ask.', 'Tìm sớm những chữ không kiểm được (chủ quan, kẽ hở, danh sách bỏ ngỏ, tuyệt đối, "ai" mơ hồ) — script liệt kê được, con người phải hỏi.'),
    t('Ask closed questions: options, a proposal, a deadline, what it blocks; log them.', 'Hỏi câu đóng: phương án, đề xuất, hạn, việc bị chặn; ghi vào sổ.'),
    t('Three amigos write examples; the examples run — v1 passed 5/6 because "one week" meant two things.', 'Ba bên viết ví dụ; ví dụ chạy được — v1 qua 5/6 vì "một tuần" có hai nghĩa.'),
    t('For every "X can do Y", ask who must not — line 8 built literally leaked everyone’s documents.', 'Với mỗi "X được làm Y", hỏi ai không được — dòng 8 làm đúng chữ đã lộ tài liệu của mọi người.'),
    t('In SWP391 the leader is the PO for order, the supervisor for scope, and each member is the BA of their own screen.', 'Ở SWP391 trưởng nhóm là PO về thứ tự, giảng viên về phạm vi, và mỗi thành viên là BA của màn của mình.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-7-3-designer', t('7.3 — Developers and designers', '7.3 — Lập trình viên và designer'))}.</p>
`);
};

export default {
  title: '7.2 — Developers, BAs and product owners|||7.2 — Lập trình viên, BA và PO',
  slug: 'agl-7-2-ba-po',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ai là BA/PO ở công ty và ở SWP391; lab chạy thật soat-yeu-cau.mjs tìm chữ không kiểm được (theo tinh thần ISO/IEC/IEEE 29148) ⇒ 8 dòng yêu cầu của giảng viên ra 11 câu hỏi; câu hỏi đóng có phương án + đề xuất + hạn, sổ hỏi đáp; ba bên (three amigos) + đặc tả bằng ví dụ: bảng ví dụ Q-04 chạy trên quy tắc v1 5/6 ⇒ v2 6/6; góc hacker: dòng 8 làm đúng chữ lộ tài liệu người khác (First American 2019), hỏi "ai KHÔNG được" ⇒ 401/404; Mars Climate Orbiter 1999.',
  content: L72(true) + L72(false),
};
