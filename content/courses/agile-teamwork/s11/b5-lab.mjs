/**
 * 11.5 — Lab: đóng vai họp review với khách Nhật và demo với khách Mỹ (agl-11-5-lab). Soạn 24/11/2026, agent agl.
 * Dùng lại các công cụ đã chạy thật ở 11.1–11.4 (scratchpad/agl/lab/ch11: lich-nhat.mjs, mui-gio.mjs, kiem-bien-ban.mjs, anh-huong.sh, bisect.sh).
 * Kịch bản đóng vai là hư cấu (phòng khám giả "Sakura Clinic" như chương 9–10). Chế độ học một mình: tự ghi âm + dùng AI làm bạn diễn
 * CHỈ với kịch bản hư cấu này (luật bài 10.3).
 */
import { bang, cl, note, tomTat, giai, cs, ag, vo, js, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L115 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 11 · Lab', 'Chương 11 · Lab', `
<h2>${t('11.5 — Lab: role-play a review with a Japanese client and a demo with an American client', '11.5 — Lab: đóng vai họp review với khách Nhật và demo với khách Mỹ')}</h2>
<p class="lead">${t(
    'One simulated week, five scenes, five artefacts you can show in an interview. You play the offshore developer on the "Sakura Clinic" booking project from chapters 9–10. A partner (classmate, friend, or an AI chatbot given <em>only</em> this fictional script) plays the customers. Every artefact is checked by a script or a rubric — no "I think it went well".',
    'Một tuần mô phỏng, năm cảnh, năm sản phẩm bạn mang đi phỏng vấn được. Bạn đóng vai developer offshore của dự án đặt lịch "Sakura Clinic" ở chương 9–10. Một bạn diễn (bạn cùng lớp, bạn bè, hoặc chatbot AI chỉ được đưa <em>đúng</em> kịch bản hư cấu này) đóng vai khách. Mọi sản phẩm đều được kiểm bằng script hoặc phiếu chấm — không có chuyện "em thấy ổn".')}</p>

${cl('warn', t(
    'Fictional data only. If you use an AI chatbot as your partner, paste this lesson\'s scenario — never anything from a real project or a real customer (lesson 10.3).',
    'Chỉ dùng dữ liệu hư cấu. Nếu dùng chatbot AI làm bạn diễn, chỉ dán kịch bản của bài này — không bao giờ dán gì từ dự án thật hay khách thật (bài 10.3).'))}

<h3>${t('Setup (10 minutes)', 'Chuẩn bị (10 phút)')}</h3>
<ol>
<li>${t('Create <code>~/lab-ch11/</code> and copy in the scripts from lessons 11.1–11.4: <code>lich-nhat.mjs</code>, <code>mui-gio.mjs</code>, <code>kiem-bien-ban.mjs</code>, <code>bisect.sh</code>, <code>anh-huong.sh</code> (the last one needs the registration project of ', 'Tạo <code>~/lab-ch11/</code> và chép vào các script ở bài 11.1–11.4: <code>lich-nhat.mjs</code>, <code>mui-gio.mjs</code>, <code>kiem-bien-ban.mjs</code>, <code>bisect.sh</code>, <code>anh-huong.sh</code> (cái cuối cần dự án đăng ký của ')}${ag('agl-9-8-lab', 'lab 9.8')}${t('; change the path in its fourth line, the one starting with <code>R=</code>).', '; sửa đường dẫn ở dòng thứ tư, dòng bắt đầu bằng <code>R=</code>).')}</li>
<li>${t('Node 22 or newer, git 2.30 or newer. Check: <code>node -v; git --version</code>.', 'Node 22 trở lên, git 2.30 trở lên. Kiểm: <code>node -v; git --version</code>.')}</li>
<li>${t('A way to record audio or video (phone is fine) — scenes 2 and 3 are spoken.', 'Một cách ghi âm hoặc quay (điện thoại là đủ) — cảnh 2 và 3 là nói.')}</li>
</ol>

<h3>${t('Scene 1 — Monday: prepare the review (nemawashi + self-check)', 'Cảnh 1 — Thứ Hai: chuẩn bị buổi review (nemawashi + tự soát)')}</h3>
<p>${t('Tomorrow 10:00 JST you review the test spec for the registration screen with Tanaka-san. Five step texts from the spec:', 'Mai 10:00 JST bạn review test spec màn hình đăng ký với anh Tanaka. Năm dòng bước test trong spec:')}</p>
${out('TC-11  患者名に　山田 太郎 を入力する\nTC-12  ﾒｰﾙｱﾄﾞﾚｽ欄に test@example.com を入力する\nTC-13  電話番号に０９０１２３４５６７８を入力する\nTC-14  生年月日に2026/1/5を入力する\nTC-15  「登録」ボタンを押す')}
<p><strong>${t('Tasks', 'Việc cần làm')}</strong></p>
<ol>
<li>${t('Put these five rows into the <code>hang</code> array of lich-nhat.mjs (or read them from a file) and run it. Fix every row until the script reports 0 errors. Add a rule for dates (the notation rule says <code>YYYY/MM/DD</code> with zero padding), and look for any problem the script does not catch yet.', 'Đưa năm dòng này vào mảng <code>hang</code> của lich-nhat.mjs (hoặc đọc từ tệp) rồi chạy. Sửa từng dòng tới khi script báo 0 lỗi. Tự thêm luật cho ngày (quy ước ghi <code>YYYY/MM/DD</code> có số 0 đứng đầu), và tìm thêm lỗi mà script chưa bắt được.')}</li>
<li>${t('Write the nemawashi message to your BrSE (Minh) for today: what you will present, the two points you expect discussion on, one question you want Minh\'s advice on before the meeting.', 'Viết tin nemawashi gửi BrSE (anh Minh) trong hôm nay: bạn sẽ trình bày gì, hai điểm dự kiến được bàn, một câu muốn xin ý kiến anh Minh trước buổi họp.')}</li>
</ol>
${giai(t('Model answer — scene 1', 'Bài mẫu — cảnh 1'), `
<p>${t('Two rules are needed beyond lesson 11.1: the original script does not catch the <strong>full-width space</strong> (U+3000) after に, and dates need their own rule. The solution file and its real output:', 'Cần thêm hai luật so với bài 11.1: script gốc không bắt <strong>dấu cách toàn góc</strong> (U+3000) sau に, và ngày cần luật riêng. Tệp lời giải và output thật:')}</p>
${js(MA.canh1)}
${out('$ node canh1.mjs\n' + RA.canh1)}
<ul>
<li>${t('TC-14: NFKC does not pad dates, so the suggestion is unchanged — fix to 2026/01/05 by hand. The date rule was checked on three inputs: 2026/1/5 → caught, 2026/01/5 → caught, 2026/01/05 → passes.', 'TC-14: NFKC không thêm số 0 cho ngày, nên gợi ý không đổi — sửa tay thành 2026/01/05. Luật ngày đã thử trên ba đầu vào: 2026/1/5 → bắt, 2026/01/5 → bắt, 2026/01/05 → qua.')}</li>
<li>${t('TC-11 and TC-12: whether a space stays between 山田 and 太郎, or around an e-mail address, is a <em>customer rule</em> question — if unsure, it goes into the nemawashi message, not into a silent fix.', 'TC-11 và TC-12: có giữ dấu cách giữa 山田 và 太郎, hay quanh địa chỉ email, là câu hỏi về <em>quy ước của khách</em> — chưa chắc thì đưa vào tin nemawashi, không tự sửa lặng lẽ.')}</li>
</ul>
${out(t(
    'Minh-san, for tomorrow 10:00 JST review (test spec SCR-PAT-REG-01 v1.1):\n- I will present 15 cases, focusing on the phone and name fields.\n- Likely discussion: (1) phone optional or required — still Q&A #12 Open; (2) full-width input handling.\n- Advice please: if Tanaka-san says 検討します about #12, should I propose a default (optional) in the meeting or after?\nThe notation check is done (0 errors). File attached in the project folder.',
    'Anh Minh ơi, cho buổi review 10:00 JST mai (test spec SCR-PAT-REG-01 v1.1):\n- Em trình bày 15 case, tập trung trường số điện thoại và họ tên.\n- Dự kiến được bàn: (1) số điện thoại bắt buộc hay không — Q&A #12 vẫn Open; (2) xử lý dữ liệu toàn góc.\n- Em xin ý kiến: nếu anh Tanaka nói 検討します về #12, em nên đề xuất mặc định (không bắt buộc) ngay trong họp hay sau họp?\nĐã chạy soát quy ước (0 lỗi). Tệp để trong thư mục dự án ạ.'))}`)}

<h3>${t('Scene 2 — Tuesday: the review with the Japanese customer (spoken, 10 minutes)', 'Cảnh 2 — Thứ Ba: buổi review với khách Nhật (nói, 10 phút)')}</h3>
<p>${t('Your partner reads the customer\'s lines (Japanese phrase + meaning in brackets, so anyone can play it). You respond live. Record it.', 'Bạn diễn đọc lời khách (câu tiếng Nhật + nghĩa trong ngoặc, ai cũng đóng được). Bạn đáp trực tiếp. Ghi âm lại.')}</p>
${bang(['#', t('Customer (Tanaka) says', 'Khách (Tanaka) nói'), t('What a strong answer does', 'Câu trả lời tốt sẽ làm gì')], [
    ['1', t('"Thank you for the material. 念のため (just to be sure) — was TC-13 run with full-width input?"', '"Cảm ơn tài liệu. 念のため (cho chắc) — TC-13 đã chạy với dữ liệu toàn góc chưa?"'), t('Answers with evidence: file name of the evidence, date, result', 'Trả lời kèm bằng chứng: tên tệp evidence, ngày, kết quả')],
    ['2', t('"About the phone number… 検討します (we will consider it)."', '"Về số điện thoại thì… 検討します (sẽ xem xét)."'), t('Does not treat it as decided; asks a closed question with a default and a date, or notes it Open per Minh\'s advice', 'Không coi là đã quyết; hỏi câu đóng có mặc định và ngày, hoặc ghi Open theo lời khuyên của anh Minh')],
    ['3', t('"Adding the screen ID to each page footer 〜していただけると助かります (would help us)."', '"Thêm mã màn hình vào chân mỗi trang 〜していただけると助かります (thì đỡ cho chúng tôi lắm)."'), t('Recognises a request: repeats it, says it will be in the minutes with an owner and a date, and that scope will be checked', 'Nhận ra đây là yêu cầu: nhắc lại, nói sẽ ghi biên bản có người và hạn, và sẽ kiểm phạm vi')],
    ['4', t('"Showing an error page when the session expires is ちょっと… (a little…)."', '"Hiện trang lỗi khi hết phiên thì ちょっと… (hơi…)."'), t('Stops pushing; asks what they would prefer, or offers to bring two alternatives tomorrow', 'Thôi thuyết phục; hỏi họ muốn thế nào, hoặc hẹn mai mang hai phương án')],
    ['5', t('"Hai, hai." (while you explain TC-14 will be redone)', '"Hai, hai." (trong lúc bạn giải thích TC-14 sẽ làm lại)'), t('Does not take "hai" as approval of a new date; states the date and says it will be confirmed in the minutes', 'Không coi "hai" là đồng ý ngày mới; nói rõ ngày và nói sẽ xác nhận trong biên bản')],
  ])}
<p><strong>${t('Artefact 2', 'Sản phẩm 2')}</strong>: ${t('write <code>hop-review.md</code> — the minutes of this meeting — and run <code>node kiem-bien-ban.mjs hop-review.md</code> until it exits 0. Times in JST and ICT. Use the format of hop-1.md:', 'viết <code>hop-review.md</code> — biên bản buổi họp này — và chạy <code>node kiem-bien-ban.mjs hop-review.md</code> tới khi thoát 0. Giờ ghi cả JST và ICT. Theo khuôn của hop-1.md:')}</p>
${out(MA.hop1)}

<h3>${t('Scene 3 — Wednesday: demo for the US product manager (spoken, 8 minutes)', 'Cảnh 3 — Thứ Tư: demo cho product manager Mỹ (nói, 8 phút)')}</h3>
<p>${t('The same product is being sold to a US clinic group. Sarah (PM, New York) joins at 09:00 ET. Before the call, use mui-gio.mjs to state the meeting time in ICT for the actual date you choose.', 'Cùng sản phẩm đang bán cho một chuỗi phòng khám Mỹ. Sarah (PM, New York) vào họp lúc 09:00 ET. Trước buổi họp, dùng mui-gio.mjs để ghi giờ ICT của đúng ngày bạn chọn.')}</p>
${bang(['#', t('Sarah says', 'Sarah nói'), t('What a strong answer does', 'Câu trả lời tốt sẽ làm gì')], [
    ['1', t('"Great demo! Just one small thing — the search felt slow. Thoughts?"', '"Demo tuyệt! Chỉ một điều nhỏ — tìm kiếm hơi chậm. Thoughts?"'), t('Hears that the "small thing" is the message; gives a bottom line + up to 3 options + "I\'ll measure and send numbers by tomorrow"', 'Hiểu "điều nhỏ" mới là thông điệp; đưa kết luận + tối đa 3 phương án + "em sẽ đo và gửi số trước mai"')],
    ['2', t('"Can we make the phone number optional? We ship Friday, right?"', '"Cho số điện thoại không bắt buộc được không? Vẫn giao thứ Sáu chứ?"'), t('No yes/no in the meeting; says the impact will be measured and options sent within hours', 'Không nói có/không trong họp; nói sẽ đo ảnh hưởng và gửi phương án trong vài giờ')],
    ['3', t('"Also, while you\'re at it — a CSV export? Should be quick."', '"À, nhân tiện — xuất CSV nhé? Chắc nhanh thôi."'), t('Friendly, asks what is needed, routes to the PM', 'Thân thiện, hỏi rõ nhu cầu, chuyển PM')],
    ['4', t('"Any concerns from your side?"', '"Bên bạn có lo ngại gì không?"'), t('Not silent: one prepared concern with evidence', 'Không im lặng: một lo ngại đã chuẩn bị, có bằng chứng')],
  ])}
<p><strong>${t('Artefact 3', 'Sản phẩm 3')}</strong>: ${t('run <code>anh-huong.sh</code>, then write the options e-mail for item 2 in BLUF shape (lesson 11.2): recommendation first, at most three options with effort and risk, "not included", decision deadline with time zone.', 'chạy <code>anh-huong.sh</code>, rồi viết email phương án cho mục 2 theo khuôn BLUF (bài 11.2): khuyến nghị trước, tối đa ba phương án có công sức và rủi ro, "chưa gồm", hạn quyết kèm múi giờ.')}</p>

<h3>${t('Scene 4 — Thursday: the complaint', 'Cảnh 4 — Thứ Năm: lời phàn nàn')}</h3>
<p>${t('Tanaka-san writes: "Since version 1.3, patients cannot register with a full-width phone number. This is unacceptable."', 'Anh Tanaka viết: "Từ bản 1.3 bệnh nhân không đăng ký được bằng số điện thoại toàn góc. Không chấp nhận được."')}</p>
<p><strong>${t('Artefact 4', 'Sản phẩm 4')}</strong>: ${t('(a) the first reply, at most four lines, with the next update time in JST; (b) run <code>bisect.sh</code> and paste the guilty commit and <code>git tag --contains</code> output; (c) a one-page incident report with the six sections of lesson 11.4 and a why-why chain that ends in a process change.', '(a) câu trả lời đầu tiên, tối đa bốn dòng, kèm giờ cập nhật tiếp theo theo JST; (b) chạy <code>bisect.sh</code>, dán commit thủ phạm và kết quả <code>git tag --contains</code>; (c) một trang báo cáo sự cố đủ sáu mục của bài 11.4 với chuỗi vì sao kết thúc ở một thay đổi quy trình.')}</p>

<h3>${t('Scene 5 — Friday: the schedule for next month', 'Cảnh 5 — Thứ Sáu: lịch họp tháng sau')}</h3>
<p><strong>${t('Artefact 5', 'Sản phẩm 5')}</strong>: ${t('your team now has both customers. Using mui-gio.mjs, propose (a) a weekly 30-minute call with Tokyo, (b) a weekly call with New York that is fair to both sides (rotate), valid across the US DST change on 8 March 2026. Write it as the text of the calendar invitation, with every time in both zones.', 'đội bạn giờ có cả hai khách. Dùng mui-gio.mjs, đề xuất (a) một cuộc họp tuần 30 phút với Tokyo, (b) một cuộc họp tuần với New York công bằng cho cả hai bên (luân phiên), đúng cả qua ngày Mỹ đổi giờ 8/3/2026. Viết thành nội dung lời mời lịch, mọi giờ ghi cả hai múi.')}</p>
${giai(t('Model answer — scene 5', 'Bài mẫu — cảnh 5'), out(t(
    '(a) Sakura Clinic weekly — every Tuesday 10:00–10:30 JST (08:00–08:30 ICT). No DST on either side.\n(b) US weekly, organiser zone America/New_York:\n    odd weeks  Monday 08:00 ET  (winter 20:00 ICT, from 9 Mar 19:00 ICT)\n    even weeks Monday 19:00 ET  (winter 07:00 ICT Tue, from 9 Mar 06:00 ICT Tue)\nCreated in the calendar with zone America/New_York, so the ICT times move automatically on 8 Mar.',
    '(a) Họp tuần Sakura Clinic — thứ Ba 10:00–10:30 JST (08:00–08:30 ICT). Hai bên đều không có DST.\n(b) Họp tuần khách Mỹ, múi giờ người tổ chức America/New_York:\n    tuần lẻ  thứ Hai 08:00 ET  (mùa đông 20:00 ICT, từ 9/3 là 19:00 ICT)\n    tuần chẵn thứ Hai 19:00 ET  (mùa đông 07:00 ICT thứ Ba, từ 9/3 là 06:00 ICT thứ Ba)\nTạo trong lịch với múi America/New_York, nên giờ ICT tự dời vào 8/3.')))}

<h3>${t('Rubric (100 points)', 'Phiếu chấm (100 điểm)')}</h3>
${bang([t('Artefact', 'Sản phẩm'), t('Criteria', 'Tiêu chí'), t('Points', 'Điểm')], [
    [t('1. Self-check + nemawashi', '1. Tự soát + nemawashi'), t('Script reports 0 errors (5); own date rule tested on 3 inputs (5); message has topic, 2 expected points, 1 question, sent the day before (5)', 'Script báo 0 lỗi (5); luật ngày tự viết thử trên 3 đầu vào (5); tin nhắn có chủ đề, 2 điểm dự kiến, 1 câu hỏi, gửi hôm trước (5)'), '15'],
    [t('2. Japanese review', '2. Review khách Nhật'), t('Recording: all 5 signals handled correctly (2 each = 10); minutes pass kiem-bien-ban (exit 0) (5); request in item 3 captured as action item + scope check (5)', 'Ghi âm: xử lý đúng cả 5 tín hiệu (mỗi cái 2 = 10); biên bản qua kiem-bien-ban (thoát 0) (5); yêu cầu ở mục 3 thành việc cần làm + kiểm phạm vi (5)'), '20'],
    [t('3. US demo + options e-mail', '3. Demo khách Mỹ + email phương án'), t('Recording: no yes/no on scope in the meeting, one concern raised (5); e-mail: bottom line first, ≤ 3 options with effort/risk from the measured impact, "not included", deadline with zone (15)', 'Ghi âm: không nói có/không về phạm vi trong họp, nêu một lo ngại (5); email: kết luận trước, ≤ 3 phương án có công sức/rủi ro lấy từ ảnh hưởng đã đo, "chưa gồm", hạn kèm múi giờ (15)'), '20'],
    [t('4. Complaint', '4. Lời phàn nàn'), t('First reply ≤ 4 lines, apology for impact, no guessed cause, next update time (5); bisect output + affected tags (10); report: 6 sections, why-chain ends in a process change, no person blamed (10)', 'Trả lời đầu ≤ 4 dòng, xin lỗi về ảnh hưởng, không đoán nguyên nhân, có giờ cập nhật (5); output bisect + các tag bị ảnh hưởng (10); báo cáo: đủ 6 mục, chuỗi vì sao kết thúc ở thay đổi quy trình, không đổ lỗi cá nhân (10)'), '25'],
    [t('5. Schedule', '5. Lịch họp'), t('Every time in two zones (5); New York slot correct before and after 8 March, checked with the script (5); rotation fair (5)', 'Mọi giờ có hai múi (5); khung New York đúng cả trước và sau 8/3, đã kiểm bằng script (5); luân phiên công bằng (5)'), '15'],
    [t('Overall', 'Tổng thể'), t('No real customer data anywhere; artefacts named and stored in one folder (5)', 'Không có dữ liệu khách thật ở bất cứ đâu; sản phẩm đặt tên và lưu chung một thư mục (5)'), '5'],
  ])}
${note(t(
    'Grading yourself from recordings: listen once for content (rubric), once for language. English phrasing for scenes 3–4 is practised in ',
    'Tự chấm từ bản ghi: nghe một lượt cho nội dung (theo phiếu chấm), một lượt cho ngôn ngữ. Câu chữ tiếng Anh cho cảnh 3–4 được luyện ở ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-6-5-lab', t('Technical English lab 6.5', 'lab Tiếng Anh kỹ thuật 6.5')) + t('; turning this lab into interview stories: ', '; biến lab này thành câu chuyện phỏng vấn: ') + cs('interview-prep', 'pv-2-2-star', t('Interview prep 2.2 (STAR)', 'Chuẩn bị phỏng vấn 2.2 (STAR)')) + '.')}

${tomTat([
    t('Five artefacts: self-checked spec + nemawashi note, linted minutes, BLUF options e-mail, incident report with bisect evidence, a two-zone schedule.', 'Năm sản phẩm: spec đã tự soát + tin nemawashi, biên bản qua bộ soát, email phương án kiểu BLUF, báo cáo sự cố có bằng chứng bisect, lịch họp hai múi giờ.'),
    t('Every artefact is checked by a script or a rubric line.', 'Mỗi sản phẩm được kiểm bằng script hoặc một dòng phiếu chấm.'),
    t('Fictional data only — including when an AI plays the customer.', 'Chỉ dữ liệu hư cấu — kể cả khi AI đóng vai khách.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-11-6-quiz', t('11.6 — Chapter 11 quiz', '11.6 — Kiểm tra Chương 11'))}.</p>
`);
};
