/**
 * 11.4 — Tình huống khó (agl-11-4-tinh-huong-kho). Soạn 24/11/2026, agent agl.
 * Chạy thật: scratchpad/agl/lab/ch11/anh-huong.sh (bản sao dự án lab 9.8: 11 dòng 'phone', sửa 1 điều kiện ⇒ 19 pass / 1 fail)
 * và bisect.sh (repo tạm 24 commit, tag v1.1/v1.2/v1.3, git 2.55 bisect run ⇒ commit "refactor: rút gọn chuanHoaSdt", chỉ có trong v1.3).
 * Tác giả commit giả "Dev A <dev-a@example.com>"; repo tạm xoá sau khi chạy. Output RA.anhHuong, RA.bisect.
 * Nguồn: JPX/TSE — sự cố arrowhead 01/10/2020 (thông cáo 05/10/2020 nguyên nhân + biện pháp, báo cáo 19/10/2020, báo cáo điều tra 30/11/2020).
 * Không trùng: postmortem/5 whys chuyên sâu ⇒ incident-response ch10; CR ⇒ 9.5; email báo sự cố tiếng Anh ⇒ tak-4-4.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, bash, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L114 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 11 · Working with Japanese and American clients', 'Chương 11 · Làm việc với khách Nhật và khách Mỹ', `
<h2>${t('11.4 — Hard situations: last-minute changes, a customer complaining about a bug, out-of-scope requests', '11.4 — Tình huống khó: đổi yêu cầu sát hạn, khách phàn nàn lỗi, yêu cầu ngoài phạm vi')}</h2>
<p class="lead">${t(
    'Three messages arrive in the same week of your OJT. Tuesday: "Please make the phone number optional — delivery is still Friday, right?" Wednesday, from an upset customer: "Since version 1.3 our patients cannot register with a full-width phone number. This is unacceptable." Thursday, in a friendly chat: "While you are at it, could you add a CSV export? Should be quick." Each one has a wrong reflex (say yes / panic and apologise / say yes) and a professional answer. This lesson gives you the professional answer, with the commands that produce the facts behind it.',
    'Ba tin nhắn tới trong cùng một tuần OJT. Thứ Ba: "Cho số điện thoại thành không bắt buộc nhé — vẫn giao thứ Sáu chứ?" Thứ Tư, từ một khách đang bực: "Từ bản 1.3 bệnh nhân không đăng ký được bằng số điện thoại toàn góc. Không chấp nhận được." Thứ Năm, trong chat thân thiện: "Nhân tiện thêm nút xuất CSV được không? Chắc nhanh thôi." Mỗi tin có một phản xạ sai (nhận luôn / hoảng và xin lỗi rối rít / nhận luôn) và một câu trả lời chuyên nghiệp. Bài này đưa ra câu trả lời chuyên nghiệp, kèm các lệnh tạo ra dữ kiện phía sau nó.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> A tailor is asked, two days before the wedding, to "just make the sleeves longer". A good tailor checks the fabric left, says what it costs and whether Saturday is still possible, and writes it on the order slip. A bad tailor says "no problem" — and the bride gets a dress with one long sleeve.',
    '<strong>Liên tưởng đời thường.</strong> Hai ngày trước đám cưới, khách nhờ thợ may "nối tay áo dài ra chút". Thợ giỏi kiểm vải còn lại, nói tốn bao nhiêu và thứ Bảy còn kịp không, rồi ghi vào phiếu đặt. Thợ tệ nói "không vấn đề gì" — và cô dâu nhận cái váy một tay dài một tay ngắn.'))}

<h3>${t('Situation 1 — a change two days before delivery', 'Tình huống 1 — đổi yêu cầu hai ngày trước khi giao')}</h3>
<p>${t(
    'The wrong reflex is "yes" (or "no") in the first minute. The right one is: <strong>acknowledge → measure the impact → offer options → confirm in writing</strong>. You cannot offer options without facts, so measure first. On the registration project from lab 9.8, a copy of the code, the impact of "phone optional" looks like this:',
    'Phản xạ sai là nói "được" (hoặc "không") ngay phút đầu. Phản xạ đúng là: <strong>ghi nhận → đo ảnh hưởng → đưa phương án → xác nhận bằng văn bản</strong>. Không có dữ kiện thì không đưa được phương án, nên đo trước. Trên dự án đăng ký ở lab 9.8 (dùng bản sao mã), ảnh hưởng của "số điện thoại không bắt buộc" trông như sau:')}</p>
${bash(MA.anhHuong)}
${out(RA.anhHuong)}
<p>${t(
    'A one-condition change in code — but one existing test now fails (TC-REG-002 expected 7 errors for an empty form, now there are 6), so the test spec, the evidence, and DD section 3.2 all have to change too, and the new behaviour (empty phone accepted, wrong phone still rejected) needs new test cases. That is the real size of "just make it optional". Your answer to the customer, through your PM or BrSE:',
    'Trong mã chỉ đổi một điều kiện — nhưng một test cũ giờ hỏng (TC-REG-002 mong 7 lỗi khi để trống cả form, giờ còn 6), nên test spec, evidence và mục 3.2 của DD đều phải sửa theo, và hành vi mới (để trống thì nhận, nhập sai vẫn báo lỗi) cần thêm test case. Đó mới là kích thước thật của "cho không bắt buộc thôi". Câu trả lời cho khách, qua PM hoặc BrSE:')}</p>
${out(t(
    'Thank you — understood: phone number becomes optional; an invalid number is still rejected.\nImpact: 1 validation rule, DD 3.2, test spec (1 case updated, 2 added), re-test of the form: about 0.5 day.\nOption A: include it in Friday\'s delivery (we can absorb 0.5 day; no other change).\nOption B: deliver Friday as agreed, include the change in the next release (12/12).\nWe recommend A. Please confirm by Wednesday 12:00 JST; we will update DD to v1.2 on confirmation.',
    'Cảm ơn anh/chị — đã hiểu: số điện thoại thành không bắt buộc; nhập sai vẫn báo lỗi.\nẢnh hưởng: 1 luật kiểm, DD 3.2, test spec (sửa 1 case, thêm 2), test lại form: khoảng 0,5 ngày.\nPhương án A: đưa vào bản giao thứ Sáu (bên em gánh được 0,5 ngày; không đổi gì khác).\nPhương án B: giao thứ Sáu như đã chốt, thay đổi vào bản sau (12/12).\nBên em khuyến nghị A. Mong anh/chị xác nhận trước 12:00 JST thứ Tư; khi có xác nhận bên em cập nhật DD lên v1.2.'))}
${note(t(
    'Whether 0.5 day can be "absorbed" or must be charged is your PM\'s call, not yours — it depends on the contract (lesson 9.1) and on whether this is clarification or a change (',
    'Có "gánh" được 0,5 ngày hay phải tính phí là việc PM quyết, không phải bạn — nó tuỳ hợp đồng (bài 9.1) và tuỳ đây là làm rõ hay là thay đổi (') + ag('agl-9-5-qa-cr', t('lesson 9.5: Q&amp;A or CR?', 'bài 9.5: Q&amp;A hay CR?')) + ')' + t('. Your job is to bring the measured impact to the PM within the hour.', '. Việc của bạn là mang ảnh hưởng đã đo tới PM trong vòng một giờ.'))}

<h3>${t('Situation 2 — the customer complains about a bug', 'Tình huống 2 — khách phàn nàn về một lỗi')}</h3>
<p>${t(
    'An upset customer does not need an explanation first; they need to know you take it seriously and when they will hear more. Order of work:',
    'Một khách đang bực không cần nghe giải thích trước; họ cần biết bạn coi trọng chuyện này và khi nào họ được báo tiếp. Thứ tự công việc:')}</p>
${bang(['#', t('Step', 'Bước'), t('Who', 'Ai'), t('Time', 'Thời gian')], [
    ['1', t('Acknowledge: "We received it, we are investigating, next update at 15:00 JST." No guessing at causes, no blame.', 'Ghi nhận: "Bên em đã nhận, đang điều tra, cập nhật tiếp lúc 15:00 JST." Không đoán nguyên nhân, không đổ lỗi.'), t('PM / BrSE (you draft)', 'PM / BrSE (bạn soạn nháp)'), t('Within the hour', 'Trong vòng một giờ')],
    ['2', t('Reproduce, then find <em>when</em> it started and <em>which releases</em> are affected', 'Tái hiện, rồi tìm lỗi bắt đầu <em>khi nào</em> và <em>bản phát hành nào</em> bị ảnh hưởng'), t('You', 'Bạn'), t('Hours', 'Vài giờ')],
    ['3', t('Workaround (暫定対応) if a fix takes time', 'Cách xử lý tạm (暫定対応) nếu sửa cần thời gian'), t('Team', 'Đội'), t('Same day', 'Trong ngày')],
    ['4', t('Fix + test + release (恒久対策)', 'Sửa + test + phát hành (恒久対策)'), t('Team', 'Đội'), t('As agreed', 'Theo thoả thuận')],
    ['5', t('Incident report: cause, impact, prevention (再発防止策)', 'Báo cáo sự cố: nguyên nhân, ảnh hưởng, phòng tái diễn (再発防止策)'), t('PM with your facts', 'PM với dữ kiện của bạn'), t('Days', 'Vài ngày')],
  ])}
<p>${t(
    'Step 2 is where a junior adds the most value. The customer says "since 1.3"; the release v1.2 was fine. Between them are several commits — <code>git bisect</code> finds the guilty one by binary search, and <code>git bisect run</code> does it automatically with any script that exits 0 for good and non-zero for bad. Here the test is the customer\'s exact input. The script builds a small repository with three tagged releases, then searches:',
    'Bước 2 là chỗ junior đóng góp nhiều nhất. Khách nói "từ bản 1.3"; bản v1.2 vẫn ổn. Giữa hai bản có nhiều commit — <code>git bisect</code> tìm ra commit thủ phạm bằng tìm kiếm nhị phân, và <code>git bisect run</code> làm tự động với bất kỳ script nào thoát 0 khi tốt và khác 0 khi xấu. Ở đây phép thử chính là dữ liệu khách đã nhập. Script dựng một repo nhỏ có ba bản phát hành được gắn tag, rồi tìm:')}</p>
${bash(MA.bisect)}
${out(RA.bisect)}
<ul>
<li>${t('Three test runs instead of eight commits by hand; with 1,000 commits it would be about ten runs.', 'Ba lần chạy thử thay vì soi tám commit bằng tay; với 1.000 commit cũng chỉ khoảng mười lần.')}</li>
<li>${t('<code>git tag --contains</code> answers the customer\'s real question: <em>only v1.3 is affected</em>.', '<code>git tag --contains</code> trả lời câu hỏi thật của khách: <em>chỉ v1.3 bị ảnh hưởng</em>.')}</li>
<li>${t('The diff shows the cause: a "clean-up" refactor removed <code>normalize(\'NFKC\')</code> because it "looked unnecessary" — and no test covered full-width input.', 'Bản diff cho thấy nguyên nhân: một lần refactor "dọn mã" đã bỏ <code>normalize(\'NFKC\')</code> vì "trông thừa" — và không test nào phủ dữ liệu toàn góc.')}</li>
</ul>
<p>${t('Bisect in depth (manual mode, skipping broken commits): ', 'Bisect chuyên sâu (chế độ tay, bỏ qua commit hỏng): ')}${cs('git', 'git-2-4-bisect', 'Git 2.4')}.</p>

<h3>${t('The incident report (障害報告書) and "five whys"', 'Báo cáo sự cố (障害報告書) và "năm câu vì sao"')}</h3>
<p>${t(
    'Japanese customers in particular expect a written report with a fixed shape. "We fixed it" is not enough; they must explain to <em>their</em> management why it will not happen again. The technique behind the prevention section is なぜなぜ分析 (<em>naze-naze bunseki</em>, "why-why analysis"), popularised by Toyota: keep asking "why?" until you reach something in the <em>process</em>, not a person:',
    'Khách Nhật đặc biệt mong một báo cáo viết có khuôn cố định. "Đã sửa rồi" là chưa đủ; họ phải giải thích với cấp trên <em>của họ</em> vì sao chuyện này không lặp lại. Kỹ thuật phía sau mục phòng tái diễn là なぜなぜ分析 (<em>naze-naze bunseki</em>, "phân tích vì sao – vì sao"), phổ biến từ Toyota: hỏi "vì sao?" liên tục cho tới khi chạm tới một điểm trong <em>quy trình</em>, không phải một con người:')}</p>
${bang([t('Why?', 'Vì sao?'), t('Answer', 'Trả lời')], [
    ['1', t('Full-width phone numbers were rejected → the NFKC normalisation was removed in commit "refactor: rút gọn chuanHoaSdt".', 'Số điện thoại toàn góc bị từ chối → bước chuẩn hoá NFKC bị bỏ trong commit "refactor: rút gọn chuanHoaSdt".')],
    ['2', t('Why was it removed without anyone noticing? → No unit test used full-width input.', 'Vì sao bỏ mà không ai phát hiện? → Không unit test nào dùng dữ liệu toàn góc.')],
    ['3', t('Why no such test? → The test spec only listed half-width examples.', 'Vì sao không có test đó? → Test spec chỉ liệt kê ví dụ bán góc.')],
    ['4', t('Why? → The UT checklist has no item for character width, although Japanese users type full-width daily.', 'Vì sao? → Checklist UT không có mục độ rộng chữ, dù người dùng Nhật gõ toàn góc hằng ngày.')],
    ['5', t('Prevention: add "full-width / half-width / NFKC" to the UT checklist; add the three cases to the test spec; review rule: refactors that remove normalisation need a test proving it is unnecessary.', 'Phòng tái diễn: thêm "toàn góc / bán góc / NFKC" vào checklist UT; thêm ba case vào test spec; luật review: refactor bỏ bước chuẩn hoá phải kèm test chứng minh nó thừa.')],
  ])}
${bang([t('Section of the report', 'Mục của báo cáo'), t('Content for this bug', 'Nội dung cho lỗi này')], [
    [t('Summary', 'Tóm tắt'), t('Registration rejects full-width phone numbers', 'Đăng ký từ chối số điện thoại toàn góc')],
    [t('Timeline (with zone)', 'Diễn biến (kèm múi giờ)'), t('Release v1.3 → first report 2026-11-25 10:12 JST → cause found 13:40 → workaround 14:30 → fix released 2026-11-26', 'Phát hành v1.3 → khách báo 2026-11-25 10:12 JST → tìm ra nguyên nhân 13:40 → xử lý tạm 14:30 → phát hành bản sửa 2026-11-26')],
    [t('Impact (影響範囲)', 'Phạm vi ảnh hưởng (影響範囲)'), t('Only v1.3 (git tag --contains); only the phone field; number of failed registrations from logs', 'Chỉ v1.3 (git tag --contains); chỉ trường số điện thoại; số lượt đăng ký thất bại lấy từ log')],
    [t('Workaround (暫定対応)', 'Xử lý tạm (暫定対応)'), t('Help text "enter half-width digits" on the form', 'Dòng hướng dẫn "nhập số bán góc" trên form')],
    [t('Cause (原因)', 'Nguyên nhân (原因)'), t('Direct cause + why-why chain above', 'Nguyên nhân trực tiếp + chuỗi vì sao ở trên')],
    [t('Fix (恒久対策) and prevention (再発防止策)', 'Sửa (恒久対策) và phòng tái diễn (再発防止策)'), t('Restore NFKC + tests; checklist and review rule', 'Khôi phục NFKC + test; checklist và luật review')],
  ])}
<p>${t('Blameless postmortems and the limits of "five whys" in complex systems: ', 'Postmortem không đổ lỗi và giới hạn của "năm câu vì sao" trong hệ thống phức tạp: ')}${cs('incident-response', 'ir-10-3-nguyen-nhan', t('Incident Response 10.3', 'Xử lý sự cố 10.3'))}${t('; writing the update e-mails in English: ', '; viết email cập nhật bằng tiếng Anh: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-4-4-bao-su-co', t('Technical English 4.4', 'Tiếng Anh kỹ thuật 4.4'))}.</p>

<h3>${t('A real case: a stock exchange that reported within four days (2020)', 'Chuyện thật: một sở giao dịch báo cáo trong bốn ngày (2020)')}</h3>
<p>${t(
    'On 1 October 2020 the Tokyo Stock Exchange halted all trading for the whole day — its worst outage. A memory module failed in one unit of the shared disk device of its arrowhead trading system at 07:04, and the automatic switch to the second unit did not work as intended. Trading resumed the next day. On 5 October TSE published the cause and countermeasures, including corrected switch-over settings; a fuller report followed on 19 October and an investigation report on 30 November 2020 (',
    'Ngày 1/10/2020, Sở giao dịch chứng khoán Tokyo (TSE) dừng toàn bộ giao dịch cả ngày — sự cố nặng nhất của họ. Lúc 07:04 một mô-đun bộ nhớ hỏng trong một khối của thiết bị đĩa dùng chung thuộc hệ thống giao dịch arrowhead, và việc tự chuyển sang khối thứ hai không chạy như thiết kế. Giao dịch mở lại ngày hôm sau. Ngày 5/10 TSE công bố nguyên nhân và biện pháp, gồm cả việc sửa cài đặt chuyển đổi; báo cáo đầy đủ hơn ra ngày 19/10 và báo cáo điều tra ngày 30/11/2020 (')}${ng('https://www.jpx.co.jp/english/corporate/news/news-releases/0060/20201005-01.html', 'JPX 05/10/2020')}, ${ng('https://www.jpx.co.jp/english/corporate/news/news-releases/0060/20201019-01.html', 'JPX 19/10/2020')}${t(
    '). Look at the shape: what happened, the cause, the immediate fix, the prevention, and the tests and drills promised — the same sections as your one-page report above, at national scale. Two lessons for a junior: a failover path that is never tested is a guess; and the speed and honesty of the report is part of how customers judge you.',
    '). Hãy nhìn khuôn của nó: chuyện gì xảy ra, nguyên nhân, cách sửa ngay, phòng tái diễn, và những đợt kiểm thử, diễn tập đã hứa — đúng các mục trong bản báo cáo một trang ở trên, nhưng ở quy mô quốc gia. Hai bài học cho junior: một đường dự phòng chưa từng được thử chỉ là phỏng đoán; và tốc độ cùng sự trung thực của bản báo cáo là một phần để khách đánh giá bạn.')}</p>

<h3>${t('Situation 3 — "while you are at it…": out-of-scope requests', 'Tình huống 3 — "nhân tiện…": yêu cầu ngoài phạm vi')}</h3>
<p>${t(
    'Friendly, small, and dangerous. Saying yes alone means: unplanned work that pushes your real tasks late, an untested feature nobody estimated, and a precedent ("last time you just did it"). Adding things nobody asked for — <em>gold plating</em> — is the same mistake from the other side. The answer is always friendly and always routed:',
    'Thân thiện, nhỏ, và nguy hiểm. Tự nhận một mình nghĩa là: việc ngoài kế hoạch đẩy việc thật của bạn bị trễ, một tính năng chưa ai ước lượng và chưa ai test, và một tiền lệ ("lần trước em làm luôn mà"). Tự thêm thứ không ai yêu cầu — <em>gold plating</em>, "mạ vàng" — là cùng một lỗi nhìn từ phía ngược lại. Câu trả lời luôn thân thiện và luôn đi đúng đường:')}</p>
${out(t(
    'Thanks, a CSV export makes sense for the clinic staff!\nIt is not in the current scope, so let me check effort and timing with Minh (PM) — copying him here.\nTo estimate it, could you tell us: which columns, which date range, and who downloads it?\nWe will come back with an estimate by Friday.',
    'Cảm ơn anh/chị, xuất CSV rất hợp với nhân viên phòng khám!\nViệc này chưa nằm trong phạm vi hiện tại, nên em xin kiểm công sức và thời gian với anh Minh (PM) — em đưa anh Minh vào đây.\nĐể ước lượng, anh/chị cho bên em biết: những cột nào, khoảng ngày nào, và ai sẽ tải về?\nBên em sẽ gửi ước lượng trước thứ Sáu.'))}
${bang([t('Request', 'Yêu cầu'), t('Category', 'Loại'), t('What happens', 'Xử lý thế nào')], [
    [t('"The error message has a typo"', '"Thông báo lỗi bị sai chính tả"'), t('Defect in agreed scope', 'Lỗi trong phạm vi đã chốt'), t('Fix; log it as a bug', 'Sửa; ghi thành bug')],
    [t('"What should happen if the date is empty? The spec does not say"', '"Ngày để trống thì sao? Spec không nói"'), t('Clarification', 'Làm rõ'), t('Q&amp;A list (9.5)', 'Q&amp;A list (9.5)')],
    [t('"Make the phone optional"', '"Cho số điện thoại không bắt buộc"'), t('Change to agreed behaviour', 'Đổi hành vi đã chốt'), t('Impact + options + written confirmation; CR if it affects scope/date/cost', 'Ảnh hưởng + phương án + xác nhận bằng văn bản; thành CR nếu chạm phạm vi/ngày/chi phí')],
    [t('"Add a CSV export"', '"Thêm xuất CSV"'), t('New feature', 'Tính năng mới'), t('Route to PM → estimate → CR or next phase', 'Chuyển PM → ước lượng → CR hoặc giai đoạn sau')],
  ])}

<h3>${t('Situation 4 — when the customer is angry at you', 'Tình huống 4 — khi khách giận chính bạn')}</h3>
<ul>
<li>${t('<strong>Do not argue in the moment, and do not defend yourself in writing to the customer.</strong> Thank them, restate the problem, say when they will hear back.', '<strong>Đừng cãi ngay lúc đó, và đừng viết thư tự bào chữa cho khách.</strong> Cảm ơn, nhắc lại vấn đề, nói khi nào sẽ phản hồi.')}</li>
<li>${t('Apologise for the <em>impact</em> ("we are sorry this blocked your staff this morning") — that is courtesy, and in Japanese business (お詫び) it is expected. Do not admit causes you have not verified.', 'Xin lỗi về <em>ảnh hưởng</em> ("bên em rất tiếc việc này làm nhân viên của anh/chị bị chặn sáng nay") — đó là phép lịch sự, và với doanh nghiệp Nhật (お詫び) là điều được mong đợi. Đừng nhận những nguyên nhân chưa kiểm chứng.')}</li>
<li>${t('Tell your leader immediately (hourensou: bad news first). As an intern you are rarely the one who replies officially.', 'Báo leader ngay (hourensou: tin xấu báo trước). Là thực tập sinh, hiếm khi bạn là người trả lời chính thức.')}</li>
<li>${t('If the customer contacts you directly to go around your PM — reply politely and copy the PM. Never promise dates, scope or money yourself.', 'Nếu khách liên hệ thẳng với bạn để vượt qua PM — trả lời lịch sự và đưa PM vào. Không bao giờ tự hứa ngày, phạm vi hay tiền.')}</li>
</ul>

<h3>${t('Hacker\'s corner: urgency is the attacker\'s favourite tool', 'Góc hacker: sự gấp gáp là công cụ yêu thích của kẻ tấn công')}</h3>
<p>${t(
    'Every situation in this lesson comes with pressure — "delivery is Friday", "this is unacceptable", "should be quick". Social engineers manufacture exactly that pressure: "production is down, send me the database password now", "the CEO needs the customer list in ten minutes". The process you just learned is also your defence: the more urgent and unusual the request, the more it must go through your PM and a second channel (',
    'Mọi tình huống trong bài này đều kèm áp lực — "thứ Sáu giao rồi", "không chấp nhận được", "chắc nhanh thôi". Kẻ lừa đảo phi kỹ thuật cố tình tạo ra đúng áp lực đó: "production sập rồi, gửi ngay mật khẩu database", "giám đốc cần danh sách khách trong mười phút". Quy trình bạn vừa học cũng là lá chắn của bạn: yêu cầu càng gấp và càng bất thường thì càng phải đi qua PM và một kênh thứ hai (')}${ag('agl-10-6-lua-dao', t('lesson 10.6', 'bài 10.6'))}).</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<ol>
<li>${t('Run anh-huong.sh again with a different change: "full name max length 50 → 100". How many places, how many failing tests?', 'Chạy lại anh-huong.sh với một thay đổi khác: "họ tên tối đa 50 → 100 ký tự". Bao nhiêu chỗ, bao nhiêu test hỏng?')}</li>
<li>${t('Modify bisect.sh so the bug is introduced at commit 11 instead of 19. Which tags contain it now, and what does that change in your reply to the customer?', 'Sửa bisect.sh để lỗi xuất hiện ở commit 11 thay vì 19. Giờ những tag nào chứa nó, và điều đó đổi gì trong câu trả lời cho khách?')}</li>
<li>${t('Write the first reply (step 1) to the angry customer in Situation 2 — at most four lines.', 'Viết câu trả lời đầu tiên (bước 1) cho khách đang giận ở tình huống 2 — tối đa bốn dòng.')}</li>
</ol>
${giai(t('Hints and answers', 'Gợi ý và đáp án'), `<ol>
<li>${t('The limit is a literal 50 on line 42 of kiem-tra.mjs (grep "50" src finds 2 lines). Changing it to 100 gives 19 pass / 1 fail: TC-REG-005 (51 characters must be rejected) now passes validation. The boundary cases TC-REG-004/005 in the test spec must move to 100/101, and MSG-E002 shows the new limit.', 'Giới hạn là số 50 viết thẳng ở dòng 42 của kiem-tra.mjs (grep "50" src ra 2 dòng). Đổi thành 100 thì 19 pass / 1 fail: TC-REG-005 (51 ký tự phải bị từ chối) giờ lọt qua. Các case biên TC-REG-004/005 trong test spec phải dời thành 100/101, và MSG-E002 hiện giới hạn mới.')}</li>
<li>${t('Change <code>-eq 19</code> to <code>-eq 11</code> and <code>bisect start v1.3 v1.2</code> to <code>v1.3 v1.1</code>. <code>git tag --contains</code> now prints v1.2 and v1.3: the customer\'s claim "since 1.3" is wrong — v1.2 users are affected too, and the impact section must say so.', 'Đổi <code>-eq 19</code> thành <code>-eq 11</code> và <code>bisect start v1.3 v1.2</code> thành <code>v1.3 v1.1</code>. <code>git tag --contains</code> giờ in v1.2 và v1.3: nhận định "từ 1.3" của khách là chưa đúng — người dùng v1.2 cũng bị, và mục phạm vi ảnh hưởng phải ghi rõ.')}</li>
<li>${t('"Thank you for reporting this, and we are sorry for the trouble to your patients. We have reproduced the problem with full-width phone numbers and are investigating the cause now. We will send the next update by 15:00 JST today."', '"Cảm ơn anh/chị đã báo, và bên em rất tiếc vì phiền toái cho bệnh nhân. Bên em đã tái hiện được lỗi với số điện thoại toàn góc và đang điều tra nguyên nhân. Bên em sẽ gửi cập nhật tiếp theo trước 15:00 JST hôm nay."')}</li>
</ol>`)}

${phongVan([
    [t('The customer asks for a change two days before delivery. What do you do?', 'Khách xin đổi yêu cầu hai ngày trước khi giao. Bạn làm gì?'), t('Acknowledge, measure the impact in code, tests and documents, give my PM options with effort and risk, and confirm the chosen option in writing before changing anything.', 'Ghi nhận, đo ảnh hưởng trên mã, test và tài liệu, đưa PM các phương án có công sức và rủi ro, và xác nhận phương án được chọn bằng văn bản trước khi sửa bất cứ gì.')],
    [t('How would you find which commit introduced a regression?', 'Bạn tìm commit gây ra lỗi hồi quy thế nào?'), t('Write a script that reproduces the bug and exits non-zero, then git bisect run between the last good tag and the bad one; git tag --contains tells which releases are affected.', 'Viết script tái hiện lỗi và thoát khác 0, rồi git bisect run giữa tag tốt cuối cùng và tag xấu; git tag --contains cho biết bản phát hành nào bị ảnh hưởng.')],
    [t('What goes into an incident report for a customer?', 'Báo cáo sự cố gửi khách gồm những gì?'), t('Summary, timeline with time zone, impact, workaround, cause with a why-why chain down to the process, fix and prevention.', 'Tóm tắt, diễn biến kèm múi giờ, phạm vi ảnh hưởng, xử lý tạm, nguyên nhân với chuỗi vì sao xuống tới quy trình, cách sửa và phòng tái diễn.')],
    [t('A customer asks you directly for a small extra feature. What do you say?', 'Khách nhờ thẳng bạn một tính năng thêm nhỏ. Bạn nói gì?'), t('Thank them, ask what they need so it can be estimated, say it is outside current scope and copy my PM; I do not start or promise anything alone.', 'Cảm ơn, hỏi rõ nhu cầu để ước lượng được, nói việc này ngoài phạm vi hiện tại và đưa PM vào; em không tự bắt đầu hay hứa gì.')],
  ], en)}

${thuatNgu([
    [t('Impact analysis', 'Phân tích ảnh hưởng'), t('Measuring what a change touches: code, tests, documents, effort', 'Đo một thay đổi chạm tới đâu: mã, test, tài liệu, công sức')],
    ['git bisect', t('Binary search through history to find the commit that introduced a bug', 'Tìm kiếm nhị phân trong lịch sử để ra commit gây lỗi')],
    ['障害報告書', t('Incident report for the customer', 'Báo cáo sự cố gửi khách')],
    ['暫定対応 / 恒久対策', t('Temporary workaround / permanent fix', 'Xử lý tạm / sửa triệt để')],
    ['再発防止策', t('Measures to prevent recurrence', 'Biện pháp phòng tái diễn')],
    ['なぜなぜ分析', t('Why-why analysis ("five whys")', 'Phân tích vì sao – vì sao ("năm câu vì sao")')],
    ['Gold plating', t('Adding features nobody asked for', 'Tự thêm tính năng không ai yêu cầu')],
  ], en)}

${tomTat([
    t('Last-minute change: acknowledge → measure impact → options → written confirmation. Never yes or no in the first minute.', 'Đổi sát hạn: ghi nhận → đo ảnh hưởng → phương án → xác nhận văn bản. Không nói có hay không ngay phút đầu.'),
    t('A one-line code change still touches tests, test spec, evidence and design documents — measure them.', 'Sửa một dòng mã vẫn chạm tới test, test spec, evidence và tài liệu thiết kế — hãy đo chúng.'),
    t('Bug complaint: acknowledge with an update time, then git bisect run + git tag --contains for facts.', 'Khách phàn nàn lỗi: ghi nhận kèm giờ cập nhật, rồi git bisect run + git tag --contains để có dữ kiện.'),
    t('The incident report ends in a process change, not a name.', 'Báo cáo sự cố kết thúc bằng một thay đổi quy trình, không phải một cái tên.'),
    t('Out-of-scope requests are routed to the PM, friendly and fast; urgency is a reason to slow down and verify.', 'Yêu cầu ngoài phạm vi chuyển PM, thân thiện và nhanh; sự gấp gáp là lý do để chậm lại và xác minh.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-11-5-lab', t('11.5 — Lab: role-play a review and a demo', '11.5 — Lab: đóng vai họp review và demo'))}.</p>
`);
};
